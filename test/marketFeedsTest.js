// Test live market data feeds
async function testFeeds() {
  console.log('--- TESTING BINANCE API ---');
  try {
    const resBtc = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    const dataBtc = await resBtc.json();
    console.log('✅ Binance BTCUSDT:', {
      price: dataBtc.lastPrice,
      change: dataBtc.priceChange,
      changePercent: dataBtc.priceChangePercent,
      high: dataBtc.highPrice,
      low: dataBtc.lowPrice
    });

    const resEth = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT');
    const dataEth = await resEth.json();
    console.log('✅ Binance ETHUSDT:', {
      price: dataEth.lastPrice,
      change: dataEth.priceChange,
      changePercent: dataEth.priceChangePercent
    });
  } catch (err) {
    console.error('❌ Binance Error:', err.message);
  }

  console.log('\n--- TESTING COINGECKO API ---');
  try {
    const resCg = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
    const dataCg = await resCg.json();
    console.log('✅ CoinGecko:', dataCg);
  } catch (err) {
    console.error('❌ CoinGecko Error:', err.message);
  }

  console.log('\n--- TESTING NSE INDIA SESSION FETCH ---');
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    };

    // Step 1: Handshake with NSE homepage to acquire cookies
    const homeRes = await fetch('https://www.nseindia.com', { headers });
    const rawCookies = homeRes.headers.getSetCookie ? homeRes.headers.getSetCookie() : [];
    const cookieHeader = rawCookies.map(c => c.split(';')[0]).join('; ');
    console.log('NSE Handshake status:', homeRes.status, '| Cookies acquired:', rawCookies.length);

    // Step 2: Fetch all indices API
    const apiHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://www.nseindia.com/market-data/live-market-indices',
      'Cookie': cookieHeader
    };

    const indicesRes = await fetch('https://www.nseindia.com/api/allIndices', { headers: apiHeaders });
    console.log('NSE allIndices status:', indicesRes.status);
    if (indicesRes.ok) {
      const indicesData = await indicesRes.json();
      const nifty = indicesData.data.find(i => i.index === 'NIFTY 50');
      const bankNifty = indicesData.data.find(i => i.index === 'NIFTY BANK');
      console.log('✅ NSE NIFTY 50:', nifty ? { last: nifty.last, variation: nifty.variation, percentChange: nifty.percentChange } : 'Not found');
      console.log('✅ NSE BANK NIFTY:', bankNifty ? { last: bankNifty.last, variation: bankNifty.variation, percentChange: bankNifty.percentChange } : 'Not found');
    } else {
      console.log('⚠️ NSE returned non-200:', indicesRes.status, await indicesRes.text().then(t => t.slice(0, 150)));
    }
  } catch (err) {
    console.error('❌ NSE Error:', err.message);
  }

  console.log('\n--- TESTING GOOGLE FINANCE FOR SENSEX & GOLD ---');
  try {
    const res = await fetch('https://www.google.com/finance/quote/SENSEX:INDEXBOM', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const match = html.match(/class="YMlKec fxKbKc">([^<]+)<\/div>/);
    if (match) {
      console.log('✅ Google Finance SENSEX:', match[1]);
    } else {
      console.log('Google Finance Sensex regex did not match.');
    }
  } catch (err) {
    console.error('❌ Google Finance Error:', err.message);
  }
}

testFeeds();
