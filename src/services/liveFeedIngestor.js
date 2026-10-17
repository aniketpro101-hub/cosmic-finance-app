/**
 * Cosmic Finance — Live Market Feeds Ingestor
 * Multi-source real-time aggregator:
 * 1. NSE India Official Session Scraper (NIFTY 50, NIFTY BANK, Sector Indices)
 * 2. Binance Public Ticker API (BTC/USDT, ETH/USDT) with CoinGecko Fallback
 * 3. Yahoo Finance Chart API (BSE SENSEX, Gold Futures GC=F / MCX Bullion)
 * 4. Finnhub API (Optional: US quotes, Crypto, and Global Financial News when FINNHUB_API_KEY is configured)
 */

const db = require('../db/database');
const { getISTDate } = require('../utils/indianTime');

// Initialize persistent quota ledger for GoldAPI.io (strictly protects 100 req/mo cap)
db.prepare(`
  CREATE TABLE IF NOT EXISTS gold_api_quota (
    date_str TEXT PRIMARY KEY,
    gold_calls INTEGER DEFAULT 0,
    silver_calls INTEGER DEFAULT 0,
    last_gold_at DATETIME,
    last_silver_at DATETIME,
    last_gold_price REAL,
    last_silver_price REAL
  )
`).run();

let nseCookie = '';
let nseCookieExpiry = 0;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// Global feed health and status tracker
const feedHealthState = {
  nse: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  binance: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  yahoo: { status: 'Initializing', lastSuccess: null, latencyMs: 0 },
  goldapi: {
    status: process.env.GOLDAPI_KEY ? 'Configured (Active)' : 'Optional (No Key)',
    lastSuccess: null,
    callsToday: { gold: 0, silver: 0 },
    monthlyTotal: 0
  },
  finnhub: { status: process.env.FINNHUB_API_KEY ? 'Configured' : 'Optional (No Key)', lastSuccess: null },
  lastSyncTimestamp: null,
  activeSymbols: ['NIFTY', 'SENSEX', 'BANKNIFTY', 'GOLD', 'SILVER', 'BTC']
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
 * Direct Yahoo Finance Chart Relay for NIFTY 50 (^NSEI) and BANK NIFTY (^NSEBANK)
 * High-speed fallback when NSE website sessions fail, rate-limit, or are blocked.
 */
async function fetchYahooIndianIndices() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const [resNifty, resBank] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      }),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEBANK?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      })
    ]);
    clearTimeout(timeout);

    const niftyJson = resNifty.ok ? await resNifty.json() : null;
    const bankJson = resBank.ok ? await resBank.json() : null;

    const nMeta = niftyJson?.chart?.result?.[0]?.meta;
    const bMeta = bankJson?.chart?.result?.[0]?.meta;

    const nifty = nMeta && nMeta.regularMarketPrice ? {
      price: parseFloat(nMeta.regularMarketPrice.toFixed(2)),
      change: parseFloat((nMeta.fulldayChange || (nMeta.regularMarketPrice - (nMeta.chartPreviousClose || nMeta.regularMarketPrice))).toFixed(2)),
      changePercent: parseFloat((nMeta.regularMarketChangePercent || nMeta.fulldayChangePercent || 0).toFixed(2)),
      high: parseFloat((nMeta.regularMarketDayHigh || nMeta.regularMarketPrice).toFixed(2)),
      low: parseFloat((nMeta.regularMarketDayLow || nMeta.regularMarketPrice).toFixed(2))
    } : null;

    const bankNifty = bMeta && bMeta.regularMarketPrice ? {
      price: parseFloat(bMeta.regularMarketPrice.toFixed(2)),
      change: parseFloat((bMeta.fulldayChange || (bMeta.regularMarketPrice - (bMeta.chartPreviousClose || bMeta.regularMarketPrice))).toFixed(2)),
      changePercent: parseFloat((bMeta.regularMarketChangePercent || bMeta.fulldayChangePercent || 0).toFixed(2)),
      high: parseFloat((bMeta.regularMarketDayHigh || bMeta.regularMarketPrice).toFixed(2)),
      low: parseFloat((bMeta.regularMarketDayLow || bMeta.regularMarketPrice).toFixed(2))
    } : null;

    return { nifty, bankNifty };
  } catch (err) {
    return { nifty: null, bankNifty: null };
  }
}

/**
 * Fetch official live NSE Indices (NIFTY 50, BANK NIFTY, NIFTY IT, etc.)
 * Primary: Official NSE India session
 * Resilient Instant Fallback: Yahoo Finance Indian Indices Relay
 */
async function fetchNSEIndices() {
  const startTime = Date.now();
  const now = Date.now();

  // If circuit is not tripped, try official NSE scraper first
  if (now >= nseCircuitTrippedUntil) {
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
            status: 'Connected (NSE India Direct)',
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
    }
  }

  // Resilient Instant Fallback: Query Yahoo Finance Indian Indices Relay
  const yahooIndian = await fetchYahooIndianIndices();
  if (yahooIndian && (yahooIndian.nifty || yahooIndian.bankNifty)) {
    feedHealthState.nse = {
      status: 'Connected (Yahoo Indian Indices Relay)',
      lastSuccess: new Date().toISOString(),
      latencyMs: Date.now() - startTime
    };
    return {
      nifty: yahooIndian.nifty,
      bankNifty: yahooIndian.bankNifty,
      allIndices: []
    };
  }

  feedHealthState.nse.status = 'Standby (Cached)';
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
  const result = { sensex: null, gold: null, silver: null };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const [resSensex, resGold, resSilver] = await Promise.all([
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5EBSESN?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      }),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1d', {
        headers: { 'User-Agent': USER_AGENT },
        signal: controller.signal
      }),
      fetch('https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d', {
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

    if (resSilver.ok) {
      const data = await resSilver.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && meta.regularMarketPrice) {
        const usdPerOz = meta.regularMarketPrice;
        const prevUsd = meta.chartPreviousClose || usdPerOz;
        // Standard MCX 1kg Silver conversion: (USD/oz / 31.1035) * 1000 * 87.5 * 1.06
        const approxMcxPer1Kg = Math.round((usdPerOz / 31.1035) * 1000 * 87.5 * 1.06);
        const prevMcxPer1Kg = Math.round((prevUsd / 31.1035) * 1000 * 87.5 * 1.06);
        const chg = approxMcxPer1Kg - prevMcxPer1Kg;
        const chgPct = (chg / (prevMcxPer1Kg || 1)) * 100;

        result.silver = {
          price: approxMcxPer1Kg,
          change: chg,
          changePercent: parseFloat(chgPct.toFixed(2)),
          high: Math.round(approxMcxPer1Kg * 1.008),
          low: Math.round(approxMcxPer1Kg * 0.992)
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
 * Official GoldAPI.io Spot Pricing with Daily Quota Protection
 * User Configuration: Exactly 2 Gold calls + 1 Silver call per day
 * (Max 93 requests/month vs 100 limit, leaving buffer)
 * Slot 1 (Morning ~09:00+ IST): Gold #1 + Silver #1
 * Slot 2 (Evening ~17:00+ IST): Gold #2
 */
async function fetchGoldAPIQuotes() {
  const apiKey = process.env.GOLDAPI_KEY;
  if (!apiKey) return null;

  const ist = getISTDate();
  const todayStr = ist.dateIso;
  const currentMonthPrefix = todayStr.substring(0, 7);

  let row = db.prepare('SELECT * FROM gold_api_quota WHERE date_str = ?').get(todayStr);
  if (!row) {
    db.prepare('INSERT INTO gold_api_quota (date_str, gold_calls, silver_calls) VALUES (?, 0, 0)').run(todayStr);
    row = { date_str: todayStr, gold_calls: 0, silver_calls: 0, last_gold_price: null, last_silver_price: null };
  }

  const monthStats = db.prepare(`
    SELECT SUM(gold_calls) as total_gold, SUM(silver_calls) as total_silver 
    FROM gold_api_quota 
    WHERE date_str LIKE ?
  `).get(`${currentMonthPrefix}%`);

  const monthlyTotal = (monthStats?.total_gold || 0) + (monthStats?.total_silver || 0);
  feedHealthState.goldapi = {
    status: monthlyTotal >= 95 ? 'Monthly Quota Buffer Active (95/100 reached — Serving Cached)' : 'Active (Scheduled 2 Gold/1 Silver Daily)',
    callsToday: { gold: row.gold_calls, silver: row.silver_calls },
    monthlyTotal: monthlyTotal,
    lastSuccess: row.last_gold_at || null
  };

  if (monthlyTotal >= 95) {
    return null;
  }

  const result = { gold: null, silver: null };

  const canCallGold = (row.gold_calls < 1) || (row.gold_calls === 1 && ist.hours >= 17);
  const canCallSilver = (row.silver_calls < 1 && ist.hours >= 9);

  if (canCallGold) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://www.goldapi.io/api/price/XAU/INR', {
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const pricePerGram = json.price_per_unit?.gram || json.melt_price_per_gram?.['24k'] || (json.price / 31.1035);
        const price10g = Math.round(pricePerGram * 10);
        const prev10g = json.prev_close_price ? Math.round((json.prev_close_price / 31.1035) * 10) : price10g;
        const change10g = price10g - prev10g;
        const changePct = json.change_percent ? parseFloat(json.change_percent.toFixed(2)) : 0;
        const high10g = json.high_price ? Math.round((json.high_price / 31.1035) * 10) : price10g;
        const low10g = json.low_price ? Math.round((json.low_price / 31.1035) * 10) : price10g;

        result.gold = {
          price: price10g,
          change: change10g,
          changePercent: changePct,
          high: high10g,
          low: low10g
        };

        db.prepare(`
          UPDATE gold_api_quota
          SET gold_calls = gold_calls + 1, last_gold_at = CURRENT_TIMESTAMP, last_gold_price = ?
          WHERE date_str = ?
        `).run(price10g, todayStr);

        feedHealthState.goldapi.status = 'Connected (GoldAPI.io 24K Live)';
        feedHealthState.goldapi.lastSuccess = new Date().toISOString();
        feedHealthState.goldapi.callsToday.gold = row.gold_calls + 1;
        feedHealthState.goldapi.monthlyTotal = monthlyTotal + 1;
      }
    } catch (err) {
      console.warn('GoldAPI XAU fetch failed, serving cached/COMEX fallback:', err.message);
    }
  }

  if (canCallSilver) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch('https://www.goldapi.io/api/price/XAG/INR', {
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const pricePerKg = Math.round(json.price_per_unit?.kilogram || (json.price_per_unit?.gram * 1000) || ((json.price / 31.1035) * 1000));
        const prevKg = json.prev_close_price ? Math.round((json.prev_close_price / 31.1035) * 1000) : pricePerKg;
        const changeKg = pricePerKg - prevKg;
        const changePct = json.change_percent ? parseFloat(json.change_percent.toFixed(2)) : 0;
        const highKg = json.high_price ? Math.round((json.high_price / 31.1035) * 1000) : pricePerKg;
        const lowKg = json.low_price ? Math.round((json.low_price / 31.1035) * 1000) : pricePerKg;

        result.silver = {
          price: pricePerKg,
          change: changeKg,
          changePercent: changePct,
          high: highKg,
          low: lowKg
        };

        db.prepare(`
          UPDATE gold_api_quota
          SET silver_calls = silver_calls + 1, last_silver_at = CURRENT_TIMESTAMP, last_silver_price = ?
          WHERE date_str = ?
        `).run(pricePerKg, todayStr);

        feedHealthState.goldapi.callsToday.silver = row.silver_calls + 1;
        feedHealthState.goldapi.monthlyTotal = feedHealthState.goldapi.monthlyTotal + 1;
      }
    } catch (err) {
      console.warn('GoldAPI XAG fetch failed:', err.message);
    }
  }

  return result;
}

/**
 * Execute a synchronized live feed ingestion pass and write to SQLite market_cache
 */
async function syncLiveMarketFeeds() {
  try {
    const [nseData, cryptoData, extraData, goldApiData] = await Promise.all([
      fetchNSEIndices(),
      fetchCryptoData(),
      fetchSensexAndGold(),
      fetchGoldAPIQuotes()
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
      // 1. NIFTY 50 from official NSE or Yahoo Relay
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

      // 2. BANK NIFTY from official NSE or Yahoo Relay
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

      // 4. GOLD from GoldAPI.io primary or Bullion/Yahoo fallback
      if (goldApiData && goldApiData.gold) {
        updateStmt.run(
          goldApiData.gold.price,
          goldApiData.gold.change,
          goldApiData.gold.changePercent,
          goldApiData.gold.high,
          goldApiData.gold.low,
          'GOLD'
        );
      } else if (extraData && extraData.gold) {
        updateStmt.run(
          extraData.gold.price,
          extraData.gold.change,
          extraData.gold.changePercent,
          extraData.gold.high,
          extraData.gold.low,
          'GOLD'
        );
      }

      // 4b. SILVER from GoldAPI.io primary or Yahoo SI=F fallback (upsert into market_cache)
      const silverSource = (goldApiData && goldApiData.silver) ? goldApiData.silver : (extraData && extraData.silver ? extraData.silver : null);
      if (silverSource) {
        db.prepare(`
          INSERT INTO market_cache (symbol, name, asset_type, current_price, change_amount, change_percent, high, low, market_status, last_updated)
          VALUES ('SILVER', 'SILVER (Fine 999)', 'commodity', ?, ?, ?, ?, ?, 'Open', CURRENT_TIMESTAMP)
          ON CONFLICT(symbol) DO UPDATE SET
            name = 'SILVER (Fine 999)',
            asset_type = 'commodity',
            current_price = excluded.current_price,
            change_amount = excluded.change_amount,
            change_percent = excluded.change_percent,
            high = excluded.high,
            low = excluded.low,
            market_status = 'Open',
            last_updated = CURRENT_TIMESTAMP
        `).run(
          silverSource.price,
          silverSource.change,
          silverSource.changePercent,
          silverSource.high,
          silverSource.low
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

      // Ensure Ethereum is purged from market_cache
      db.prepare("DELETE FROM market_cache WHERE symbol = 'ETH'").run();
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
  fetchYahooIndianIndices,
  fetchCryptoData,
  fetchSensexAndGold,
  fetchGoldAPIQuotes,
  syncLiveMarketFeeds,
  getLiveFeedsHealth
};
