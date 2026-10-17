/**
 * Cosmic Finance — Automated Market Intelligence & News Syndication Engine
 * Aggregates fresh, verified financial news from:
 * 1. Google News RSS (Indian Equities, Dalal Street, Bullion & RBI) - 100% Legal RSS Syndication
 * 2. NewsAPI.org (Livemint, Economic Times, Moneycontrol, Business Standard)
 * 3. Finnhub API (Global Macro, Metals & Central Banks)
 */

const db = require('../db/database');

let lastSyncStats = {
  lastSyncTime: null,
  articlesFetched: 0,
  articlesInserted: 0,
  status: 'Idle',
  error: null
};

let schedulerTimer = null;

// Clean HTML entities & tags thoroughly
function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]*>/g, '') // remove initial tags
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8377;|&rupee;/g, '₹')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/<[^>]*>/g, '') // strip any tags exposed after entity replacement
    .replace(/http[s]?:\/\/\S+/g, '') // strip raw URLs
    .replace(/\s+/g, ' ')
    .trim();
}

// Automatic Bidirectional Financial Translator (MyMemory + Financial Terminology)
async function translateText(text, fromLang = 'en', toLang = 'hi') {
  if (!text || text.trim() === '') return '';
  if (fromLang === toLang) return text;
  if (toLang === 'hi' && /[\u0900-\u097F]/.test(text)) return text;
  if (toLang === 'en' && !/[\u0900-\u097F]/.test(text)) return text;

  try {
    const q = encodeURIComponent(text.slice(0, 300));
    const email = process.env.ADMIN_CONTACT_EMAIL || 'team@cosmicfinance.local';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=${fromLang}|${toLang}&de=${email}`, {
      headers: { 'User-Agent': 'CosmicFinanceApp/1.0' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !translated.startsWith('MYMEMORY WARNING')) {
        return sanitizeText(translated);
      }
    }
  } catch (err) {
    // Graceful fallback to original text if offline
  }
  return text;
}

async function translateToHindi(text) {
  return translateText(text, 'en', 'hi');
}

async function translateToEnglish(text) {
  return translateText(text, 'hi', 'en');
}

// Derive Cosmic Finance Category based on keywords (bilingual English + Hindi)
function detectCategory(title = '', summary = '') {
  const combined = (title + ' ' + summary).toLowerCase();

  if (/\b(gold|silver|bullion|mcx|precious metals?|yellow metal)\b/.test(combined) || /सोना|चांदी|गोल्ड|सिल्वर|बुलियन/.test(combined)) {
    return 'Bullion';
  }
  if (/\b(astro|planetary|ingress|nakshatra|zodiac|mercury retrograde|eclipse|samvat|gann|horary)\b/.test(combined) || /ग्रह|गोचर|ज्योतिष|नक्षत्र|राशि/.test(combined)) {
    return 'Astro-Market';
  }
  if (/\b(fed|federal reserve|powell|wall street|nasdaq|dow jones|s&p|crude oil|brent|dxy|dollar index|treasury)\b/.test(combined) || /फेड|कच्चा तेल|डॉलर/.test(combined)) {
    return 'Global';
  }
  if (/\b(rbi|inflation|repo rate|monetary policy|cpi|gdp|fiscal|central bank|rupee defence)\b/.test(combined) || /आरबीआई|महंगाई|मौद्रिक नीति|रेपो रेट|अर्थव्यवस्था/.test(combined)) {
    return 'Macro';
  }
  if (/\b(nifty|sensex|bse|nse|equities|shares|dalal street|fii|dii|quarterly|ipo|stocks|market rally|indices)\b/.test(combined) || /निफ्टी|सेंसेक्स|शेयर बाज़ार|शेयर बाजार|दलाल स्ट्रीट|स्टॉक/.test(combined)) {
    return 'Equities';
  }
  return 'Macro';
}

/**
 * 1. Fetch from Google News RSS feeds
 */
async function fetchGoogleNews() {
  const feeds = [
    {
      url: 'https://news.google.com/rss/search?q=Nifty+OR+Sensex+OR+"Dalal+Street"+OR+"Indian+Equities"&hl=en-IN&gl=IN&ceid=IN:en',
      defaultCategory: 'Equities'
    },
    {
      url: 'https://news.google.com/rss/search?q="Gold+Rate"+OR+"Silver+Price"+OR+"MCX+Gold"&hl=en-IN&gl=IN&ceid=IN:en',
      defaultCategory: 'Bullion'
    },
    {
      url: 'https://news.google.com/rss/search?q="RBI+Monetary"+OR+"Indian+Economy"+OR+"Inflation+India"&hl=en-IN&gl=IN&ceid=IN:en',
      defaultCategory: 'Macro'
    }
  ];

  const articles = [];

  for (const feed of feeds) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const xml = await res.text();

      const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const itemXml of itemMatches.slice(0, 10)) {
        const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
        const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/);
        const descMatch = itemXml.match(/<description>(.*?)<\/description>/);

        if (!titleMatch || !linkMatch) continue;

        let rawTitle = sanitizeText(titleMatch[1]);
        let sourceName = sourceMatch ? sanitizeText(sourceMatch[1]) : 'Financial Bureau';

        // Often Google News title ends with " - PublisherName"
        const dashIdx = rawTitle.lastIndexOf(' - ');
        if (dashIdx > 20) {
          sourceName = rawTitle.substring(dashIdx + 3).trim();
          rawTitle = rawTitle.substring(0, dashIdx).trim();
        }

        let summary = descMatch ? sanitizeText(descMatch[1]) : '';
        if (!summary || summary.length < 35 || summary.toLowerCase().startsWith(rawTitle.toLowerCase().slice(0, 25))) {
          summary = `${rawTitle}. Market intelligence and economic development reported by ${sourceName}.`;
        }

        // Limit summary length cleanly
        if (summary.length > 240) {
          summary = summary.substring(0, 237) + '...';
        }

        const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

        articles.push({
          title: rawTitle,
          summary,
          source_name: sourceName,
          source_url: linkMatch[1].trim(),
          category: detectCategory(rawTitle, summary) || feed.defaultCategory,
          published_at: publishedAt,
          image_url: null,
          lang: 'en'
        });
      }
    } catch (err) {
      console.warn(`[NewsService] Google News feed fetch error (${feed.defaultCategory}):`, err.message);
    }
  }

  return articles;
}

/**
 * 1b. Fetch from Google News Hindi RSS feeds (Native Hindi Financial Journalism)
 */
async function fetchGoogleNewsHindi() {
  const feeds = [
    {
      url: 'https://news.google.com/rss/search?q=%E0%A4%A8%E0%A4%BF%E0%A4%AB%E0%A5%8D%E0%A4%9F%E0%A5%80+OR+%E0%A4%B8%E0%A5%87%E0%A4%82%E0%A4%B8%E0%A5%87%E0%A4%95%E0%A5%8D%E0%A4%B8+OR+%22%E0%A4%B6%E0%A5%87%E0%A4%AF%E0%A4%B0+%E0%A4%AC%E0%A4%BE%E0%A4%9C%E0%A4%BE%E0%A4%B0%22&hl=hi&gl=IN&ceid=IN:hi',
      defaultCategory: 'Equities'
    },
    {
      url: 'https://news.google.com/rss/search?q=%22%E0%A4%B8%E0%A5%8B%E0%A4%A8%E0%A4%BE+%E0%A4%9A%E0%A4%BE%E0%A4%82%E0%A4%A6%E0%A5%80%22+OR+%22%E0%A4%97%E0%A5%8B%E0%A4%B2%E0%A5%8D%E0%A4%91+%E0%A4%B0%E0%A5%87%E0%A4%9F%22+OR+%22%E0%A4%B8%E0%A4%BF%E0%A4%B2%E0%A5%8D%E0%A4%B5%E0%A4%B0%22&hl=hi&gl=IN&ceid=IN:hi',
      defaultCategory: 'Bullion'
    },
    {
      url: 'https://news.google.com/rss/search?q=%22%E0%A4%86%E0%A4%B0%E0%A4%AC%E0%A5%80%E0%A4%86%E0%A4%88%22+OR+%22%E0%A4%AE%E0%A5%8C%E0%A4%A6%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%95+%E0%A4%A8%E0%A5%80%E0%A4%A4%E0%A4%BF%22+OR+%22%E0%A4%AE%E0%A4%B9%E0%A4%82%E0%A4%97%E0%A4%BE%E0%A4%88%22&hl=hi&gl=IN&ceid=IN:hi',
      defaultCategory: 'Macro'
    }
  ];

  const articles = [];

  for (const feed of feeds) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!res.ok) continue;
      const xml = await res.text();

      const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const itemXml of itemMatches.slice(0, 8)) {
        const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
        const sourceMatch = itemXml.match(/<source[^>]*>(.*?)<\/source>/);
        const descMatch = itemXml.match(/<description>(.*?)<\/description>/);

        if (!titleMatch || !linkMatch) continue;

        let rawTitle = sanitizeText(titleMatch[1]);
        let sourceName = sourceMatch ? sanitizeText(sourceMatch[1]) : 'हिन्दी समाचार डेस्क';

        const dashIdx = rawTitle.lastIndexOf(' - ');
        if (dashIdx > 20) {
          sourceName = rawTitle.substring(dashIdx + 3).trim();
          rawTitle = rawTitle.substring(0, dashIdx).trim();
        }

        let summary = descMatch ? sanitizeText(descMatch[1]) : '';
        if (!summary || summary.length < 35 || summary.toLowerCase().startsWith(rawTitle.toLowerCase().slice(0, 25))) {
          summary = `${rawTitle}। ${sourceName} द्वारा प्रकाशित प्रमुख बाज़ार खबर।`;
        }

        if (summary.length > 240) {
          summary = summary.substring(0, 237) + '...';
        }

        const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

        articles.push({
          title_hi: rawTitle,
          summary_hi: summary,
          title: null, // will be translated to English
          summary: null,
          source_name: sourceName,
          source_url: linkMatch[1].trim(),
          category: detectCategory(rawTitle, summary) || feed.defaultCategory,
          published_at: publishedAt,
          image_url: null,
          lang: 'hi'
        });
      }
    } catch (err) {
      console.warn(`[NewsService] Hindi RSS error (${feed.defaultCategory}):`, err.message);
    }
  }

  return articles;
}


/**
 * 2. Fetch from NewsAPI (targeted to Indian financial publications)
 */
async function fetchNewsAPI() {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const query = encodeURIComponent('Nifty OR Sensex OR "Gold Price" OR "RBI" OR "Stock Market"');
    const domains = 'livemint.com,economictimes.indiatimes.com,moneycontrol.com,business-standard.com';
    const url = `https://newsapi.org/v2/everything?domains=${domains}&q=${query}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${apiKey}`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'CosmicFinanceIntelligence/1.0' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.articles)) return [];

    return data.articles
      .filter(a => a.title && a.url && a.title !== '[Removed]')
      .map(a => {
        const title = sanitizeText(a.title);
        let summary = sanitizeText(a.description || a.content || `${title}. Indian market analysis.`);
        if (summary.length > 240) summary = summary.substring(0, 237) + '...';

        return {
          title,
          summary,
          source_name: sanitizeText(a.source?.name || 'Financial Wire'),
          source_url: a.url,
          category: detectCategory(title, summary),
          published_at: a.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString(),
          image_url: a.urlToImage || null,
          lang: 'en'
        };
      });
  } catch (err) {
    console.warn('[NewsService] NewsAPI fetch error:', err.message);
    return [];
  }
}

/**
 * 3. Fetch from Finnhub API (Global Macro & Commodities)
 */
async function fetchFinnhubNews() {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const url = `https://finnhub.io/api/v1/news?category=general&minId=10&token=${apiKey}`;

    const res = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items.slice(0, 15).map(item => {
      const headline = sanitizeText(item.headline);
      let summary = sanitizeText(item.summary || `${headline}. Global macro report.`);
      if (summary.length > 240) summary = summary.substring(0, 237) + '...';

      return {
        title: headline,
        summary,
        source_name: sanitizeText(item.source || 'International Desk'),
        source_url: item.url,
        category: detectCategory(headline, summary) || 'Global',
        published_at: item.datetime ? new Date(item.datetime * 1000).toISOString() : new Date().toISOString(),
        image_url: item.image || null,
        lang: 'en'
      };
    });
  } catch (err) {
    console.warn('[NewsService] Finnhub fetch error:', err.message);
    return [];
  }
}

/**
 * 4. Execute Full Synchronization Pass (Bilingual Multi-Source)
 */
async function syncAllNews() {
  lastSyncStats.status = 'Syncing...';
  let totalFetched = 0;
  let newInserted = 0;

  try {
    // Concurrently poll all streams: English + Native Hindi
    const [googleItems, googleHindiItems, newsApiItems, finnhubItems] = await Promise.all([
      fetchGoogleNews(),
      fetchGoogleNewsHindi(),
      fetchNewsAPI(),
      fetchFinnhubNews()
    ]);

    const allArticles = [...googleItems, ...googleHindiItems, ...newsApiItems, ...finnhubItems];
    totalFetched = allArticles.length;

    const checkStmt = db.prepare('SELECT id FROM news WHERE source_url = ? OR title = ? OR title_hi = ?');
    const insertStmt = db.prepare(`
      INSERT INTO news (title, summary, title_hi, summary_hi, source_name, source_url, category, image_url, lang, is_published, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);

    // Filter articles that need inserting
    const toInsert = allArticles.filter(item => {
      const t = item.title || item.title_hi;
      if (!t || !item.source_url) return false;
      const existing = checkStmt.get(item.source_url, item.title || '', item.title_hi || '');
      return !existing;
    });

    for (const item of toInsert) {
      try {
        let titleEn = item.title;
        let summaryEn = item.summary;
        let titleHi = item.title_hi;
        let summaryHi = item.summary_hi;

        if (item.lang === 'hi') {
          titleEn = titleEn || await translateToEnglish(titleHi);
          summaryEn = summaryEn || await translateToEnglish(summaryHi);
        } else {
          titleHi = titleHi || await translateToHindi(titleEn);
          summaryHi = summaryHi || await translateToHindi(summaryEn);
        }

        insertStmt.run(
          titleEn || titleHi,
          summaryEn || summaryHi,
          titleHi || titleEn,
          summaryHi || summaryEn,
          item.source_name,
          item.source_url,
          item.category || 'Macro',
          item.image_url || null,
          item.lang || 'en',
          item.published_at || new Date().toISOString()
        );
        newInserted++;
      } catch (insertErr) {
        console.warn('[NewsService] Failed inserting article:', insertErr.message);
      }
    }


    // Prune stale news beyond top 250 to keep database compact & fast
    db.prepare(`
      DELETE FROM news 
      WHERE id NOT IN (
        SELECT id FROM news ORDER BY published_at DESC LIMIT 250
      )
    `).run();

    lastSyncStats = {
      lastSyncTime: new Date().toISOString(),
      articlesFetched: totalFetched,
      articlesInserted: newInserted,
      status: 'Healthy',
      error: null
    };

    console.log(`[NewsService] Sync complete. Fetched: ${totalFetched}, Newly Inserted: ${newInserted}`);
    return lastSyncStats;
  } catch (err) {
    lastSyncStats.status = 'Error';
    lastSyncStats.error = err.message;
    console.error('[NewsService] Synchronization failed:', err);
    return lastSyncStats;
  }
}

/**
 * Initialize background scheduler (every N hours)
 */
function startNewsScheduler() {
  if (process.env.NEWS_AUTO_SYNC_ENABLED === 'false') {
    console.log('[NewsService] Auto-sync disabled via NEWS_AUTO_SYNC_ENABLED=false');
    return;
  }

  // Initial fetch delayed by 5 seconds after boot to let database settle
  setTimeout(() => {
    syncAllNews().catch(err => console.error('[NewsService] Initial boot sync error:', err.message));
  }, 5000);

  const hours = parseFloat(process.env.NEWS_SYNC_INTERVAL_HOURS) || 2;
  const intervalMs = Math.max(30, hours * 60) * 60 * 1000; // minimum 30 minutes

  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = setInterval(() => {
    syncAllNews().catch(err => console.error('[NewsService] Scheduled interval error:', err.message));
  }, intervalMs);

  console.log(`[NewsService] Background worker active. Interval: every ${hours} hours.`);
}

function getNewsSyncStatus() {
  const totalInDb = db.prepare('SELECT COUNT(*) as count FROM news WHERE is_published = 1').get()?.count || 0;
  return {
    ...lastSyncStats,
    totalInDb
  };
}

module.exports = {
  syncAllNews,
  startNewsScheduler,
  getNewsSyncStatus,
  fetchGoogleNews,
  fetchGoogleNewsHindi,
  fetchNewsAPI,
  fetchFinnhubNews,
  translateToHindi,
  translateToEnglish
};
