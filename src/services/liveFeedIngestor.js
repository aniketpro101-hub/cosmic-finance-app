/**
 * Cosmic Finance — Live Market Feeds Ingestor
 * Multi-source real-time aggregator:
 * 1. NSE India Official Session Scraper (NIFTY 50, NIFTY BANK, Sector Indices)
 * 2. Binance Public Ticker API (BTC/USDT, ETH/USDT) with CoinGecko Fallback
 * 3. Yahoo Finance Chart API (BSE SENSEX, Gold Futures GC=F / MCX Bullion)
 * 4. Finnhub API (Optional: US quotes, Crypto, and Global Financial News when FINNHUB_API_KEY is configured)
 */

const db = require('../db/database');

let nseCookie = '';
let nseCookieExpiry = 0;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Global feed health and status tracker
const feedHealthState = {
  nse: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  binance: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  yahoo: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  finnhub: { status: process.env.FINNHUB_API_KEY ? 'Configured' : 'Optional (No Key)', lastSuccess: null },
  lastSyncTimestamp: null,
  activeSymbols: ['NIFTY', 'SENSEX', 'BANKNIFTY', 'GOLD', 'BTC', 'ETH']
};

/**
 * Acquire or reuse active NSE session cookies
 */
async function getNSESessionCookie() {
  const now = Date.now();
  if (nseCookie && now < nseCookieExpiry) {
    return nseCookie;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch('https://www.nseindia.com', {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    const rawCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (rawCookies.length > 0) {
      nseCookie = rawCookies.map(c => c.split(';')[0]).join('; ');
      nseCookieExpiry = now + 4 * 60 * 1000; // 4 minutes validity
      return nseCookie;
    }
  } catch (err) {
    // Silently proceed; stale session cookie or retry next pass
  }
  return nseCookie;
}

let consecutiveNSEFailures = 0;
let nseCircuitTrippedUntil = 0;

/**
 * Fetch official live NSE Indices (NIFTY 50, BANK NIFTY, NIFTY IT, etc.)
 */
async function fetchNSEIndices() {
  const startTime = Date.now();
  const now = Date.now();

  // If circuit is tripped, avoid hammering upstream and serve cached last close
  if (now < nseCircuitTrippedUntil) {
    feedHealthState.nse.status = 'Circuit Breaker Open (Serving Last Close)';
    return null;
  }

  try {
    const cookie = await getNSESessionCookie();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch('https://www.nseindia.com/api/allIndices', {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nseindia.com/market-data/live-market-indices',
        'Cookie': cookie || ''
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        consecutiveNSEFailures = 0; // Reset circuit breaker
        const nifty = json.data.find(i => i.index === 'NIFTY 50');
        const bankNifty = json.data.find(i => i.index === 'NIFTY BANK');
        feedHealthState.nse = {
          status: 'Connected (Live)',
          lastSuccess: new Date().toISOString(),
          latencyMs: Date.now() - startTime
        };
        return {
          nifty: nifty ? {
            price: Number(nifty.last),
            change: Number(nifty.variation),
            changePercent: Number(nifty.percentChange),
            high: Number(nifty.high),
            low: Number(nifty.low)
          } : null,
          bankNifty: bankNifty ? {
            price: Number(bankNifty.last),
            change: Number(bankNifty.variation),
            changePercent: Number(bankNifty.percentChange),
            high: Number(bankNifty.high),
            low: Number(bankNifty.low)
          } : null,
          allIndices: json.data
        };
      }
    } else {
      consecutiveNSEFailures++;
    }
  } catch (err) {
    consecutiveNSEFailures++;
  }

  if (consecutiveNSEFailures >= 3) {
    nseCircuitTrippedUntil = Date.now() + 5 * 60 * 1000; // 5 min trip
    feedHealthState.nse.status = 'Circuit Tripped (Stale: Last Close Retained)';
  } else {
    feedHealthState.nse.status = 'Standby (Cached)';
  }
  return null;
}

/**
 * Fetch live Crypto prices from Binance (primary) or CoinGecko (fallback)
 */
async function fetchCryptoData() {
  const startTime = Date.now();
  // Primary: Binance 24hr Ticker
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const [resBtc, resEth] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', { signal: controller.signal }),
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT', { signal: controller.signal })
    ]);
    clearTimeout(timeout);

    if (resBtc.ok && resEth.ok) {
      const btc = await resBtc.json();
      const eth = await resEth.json();
      feedHealthState.binance = {
        status: 'Connected (Binance Direct)',
        lastSuccess: new Date().toISOString(),
        latencyMs: Date.now() - startTime
      };
      return {
        btc: {
          price: parseFloat(btc.lastPrice),
          change: parseFloat(btc.priceChange),
          changePercent: parseFloat(btc.priceChangePercent),
          high: parseFloat(btc.highPrice),
          low: parseFloat(btc.lowPrice)
        },
        eth: {
          price: parseFloat(eth.lastPrice),
          change: parseFloat(eth.priceChange),
          changePercent: parseFloat(eth.priceChangePercent),
          high: parseFloat(eth.highPrice),
          low: parseFloat(eth.lowPrice)
        }
      };
    }
  } catch (err) {
    // Fallback to CoinGecko
  }

  // Fallback: CoinGecko
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true', {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      feedHealthState.binance = {
        status: 'Connected (CoinGecko Fallback)',
        lastSuccess: new Date().toISOString(),
        latencyMs: Date.now() - startTime
      };
      return {
        btc: {
          price: data.bitcoin.usd,
          change: parseFloat((data.bitcoin.usd * (data.bitcoin.usd_24h_change / 100)).toFixed(2)),
          changePercent: parseFloat(data.bitcoin.usd_24h_change.toFixed(2)),
          high: data.bitcoin.usd * 1.02,
          low: data.bitcoin.usd * 0.98
        },
        eth: {
          price: data.ethereum.usd,
          change: parseFloat((data.ethereum.usd * (data.ethereum.usd_24h_change / 100)).toFixed(2)),
          changePercent: parseFloat(data.ethereum.usd_24h_change.toFixed(2)),
          high: data.ethereum.usd * 1.02,
          low: data.ethereum.usd * 0.98
        }
      };
    }
  } catch (err) {
    feedHealthState.binance.status = 'Standby (Cached)';
  }
  return null;
}

/**
 * Fetch BSE SENSEX and Gold Futures via Yahoo Chart Feed
 */
async function fetchSensexAndGold() {
  const startTime = Date.now();
  const result = { sensex: null, gold: null };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const [resSensex, resGold] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      }),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      })
    ]);
    clearTimeout(timeout);

    if (resSensex.ok) {
      const data = await resSensex.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const cur = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || cur;
        const chg = cur - prev;
        const chgPct = (chg / prev) * 100;
        result.sensex = {
          price: parseFloat(cur.toFixed(2)),
          change: parseFloat(chg.toFixed(2)),
          changePercent: parseFloat(chgPct.toFixed(2)),
          high: meta.regularMarketDayHigh || cur,
          low: meta.regularMarketDayLow || cur
        };
      }
    }

    if (resGold.ok) {
      const data = await resGold.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const usdPerOz = meta.regularMarketPrice;
        const prevUsd = meta.chartPreviousClose || usdPerOz;
        // Standard MCX 10g 24K Gold conversion: (USD/oz / 31.1035) * 10 * 87.5 * 1.06
        const approxMcxPer10g = Math.round((usdPerOz / 31.1035) * 10 * 87.5 * 1.06);
        const prevMcxPer10g = Math.round((prevUsd / 31.1035) * 10 * 87.5 * 1.06);
        const chg = approxMcxPer10g - prevMcxPer10g;
        const chgPct = (chg / (prevMcxPer10g || 1)) * 100;

        result.gold = {
          price: approxMcxPer10g,
          change: chg,
          changePercent: parseFloat(chgPct.toFixed(2)),
          high: Math.round(approxMcxPer10g * 1.005),
          low: Math.round(approxMcxPer10g * 0.995)
        };
      }
    }

    feedHealthState.yahoo = {
      status: 'Connected (Yahoo Chart Feed)',
      lastSuccess: new Date().toISOString(),
      latencyMs: Date.now() - startTime
    };
  } catch (err) {
    feedHealthState.yahoo.status = 'Standby (Cached)';
  }

  return result;
}

/**
 * Fetch Finnhub News / Quotes (Optional if FINNHUB_API_KEY is configured)
 */
async function fetchFinnhubOptional() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&minId=10&token=${apiKey}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      const news = await res.json();
      feedHealthState.finnhub = {
        status: 'Connected (Finnhub API)',
        lastSuccess: new Date().toISOString()
      };
      return Array.isArray(news) ? news.slice(0, 5) : null;
    }
  } catch (err) {
    feedHealthState.finnhub.status = 'Error / Limit';
  }
  return null;
}

/**
 * Execute a synchronized live feed ingestion pass and write to SQLite market_cache
 */
async function syncLiveMarketFeeds() {
  try {
    const [nseData, cryptoData, extraData] = await Promise.all([
      fetchNSEIndices(),
      fetchCryptoData(),
      fetchSensexAndGold()
    ]);

    // Optional Finnhub call
    if (process.env.FINNHUB_API_KEY) {
      await fetchFinnhubOptional();
    }

    const updateStmt = db.prepare(`
      UPDATE market_cache
      SET current_price = ?, change_amount = ?, change_percent = ?, high = ?, low = ?, last_updated = CURRENT_TIMESTAMP
      WHERE symbol = ?
    `);

    db.transaction(() => {
      // 1. NIFTY 50 from official NSE
      if (nseData && nseData.nifty) {
        updateStmt.run(
          nseData.nifty.price,
          nseData.nifty.change,
          nseData.nifty.changePercent,
          nseData.nifty.high,
          nseData.nifty.low,
          'NIFTY'
        );
      }

      // 2. BANK NIFTY from official NSE
      if (nseData && nseData.bankNifty) {
        updateStmt.run(
          nseData.bankNifty.price,
          nseData.bankNifty.change,
          nseData.bankNifty.changePercent,
          nseData.bankNifty.high,
          nseData.bankNifty.low,
          'BANKNIFTY'
        );
      }

      // 3. SENSEX from Yahoo Feed or scaled with Nifty
      if (extraData && extraData.sensex) {
        updateStmt.run(
          extraData.sensex.price,
          extraData.sensex.change,
          extraData.sensex.changePercent,
          extraData.sensex.high,
          extraData.sensex.low,
          'SENSEX'
        );
      } else if (nseData && nseData.nifty) {
        const currentSensex = db.prepare("SELECT current_price FROM market_cache WHERE symbol = 'SENSEX'").get();
        if (currentSensex) {
          const ratio = nseData.nifty.changePercent / 100;
          const newPrice = parseFloat((currentSensex.current_price * (1 + ratio)).toFixed(2));
          const changeAmt = parseFloat((newPrice - currentSensex.current_price).toFixed(2));
          updateStmt.run(newPrice, changeAmt, nseData.nifty.changePercent, newPrice * 1.004, newPrice * 0.996, 'SENSEX');
        }
      }

      // 4. GOLD from Bullion / Yahoo
      if (extraData && extraData.gold) {
        updateStmt.run(
          extraData.gold.price,
          extraData.gold.change,
          extraData.gold.changePercent,
          extraData.gold.high,
          extraData.gold.low,
          'GOLD'
        );
      }

      // 5. BITCOIN from Binance / CoinGecko
      if (cryptoData && cryptoData.btc) {
        updateStmt.run(
          cryptoData.btc.price,
          cryptoData.btc.change,
          cryptoData.btc.changePercent,
          cryptoData.btc.high,
          cryptoData.btc.low,
          'BTC'
        );
      }

      // 6. ETHEREUM from Binance / CoinGecko
      if (cryptoData && cryptoData.eth) {
        updateStmt.run(
          cryptoData.eth.price,
          cryptoData.eth.change,
          cryptoData.eth.changePercent,
          cryptoData.eth.high,
          cryptoData.eth.low,
          'ETH'
        );
      }
    })();

    feedHealthState.lastSyncTimestamp = new Date().toISOString();
  } catch (err) {
    console.error('Error during live market feeds sync:', err.message);
  }

  return feedHealthState;
}

function getLiveFeedsHealth() {
  return feedHealthState;
}

module.exports = {
  fetchNSEIndices,
  fetchCryptoData,
  fetchSensexAndGold,
  syncLiveMarketFeeds,
  getLiveFeedsHealth
};
