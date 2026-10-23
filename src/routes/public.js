/**
 * Public Routes for Cosmic Finance
 * Implements every page in the Phase 0 sitemap with zero login/signup requirements.
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const CONSTANTS = require('../config/constants');

const { getISTDate, getIndianHora } = require('../utils/indianTime');
const { getComprehensivePanchang } = require('../services/panchangService');
const chroniclesService = require('../services/chroniclesService');

// Middleware to inject global template locals
router.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.phone = CONSTANTS.PHONE_NUMBER;
  res.locals.whatsappMessage = CONSTANTS.WHATSAPP_PREFILLED_MESSAGE;
  res.locals.constants = CONSTANTS;
  res.locals.founder = CONSTANTS.FOUNDER;
  res.locals.multiAssetStatement = CONSTANTS.MULTI_ASSET_STATEMENT;
  res.locals.hindiQuotes = CONSTANTS.HINDI_QUOTES;
  res.locals.multiAssetClasses = CONSTANTS.MULTI_ASSET_CLASSES;
  res.locals.hostUrl = `${req.protocol}://${req.get('host')}`;
  res.locals.istNow = getISTDate();
  res.locals.currentHora = getIndianHora();
  try {
    res.locals.panchang = getComprehensivePanchang();
  } catch (e) {
    res.locals.panchang = null;
  }
  next();
});

// Helper for rendering with layout
function renderWithLayout(res, view, options = {}) {
  const mergedOptions = {
    layout: false,
    extraScripts: [],
    ...res.locals,
    ...options
  };

  res.render(`pages/${view}`, mergedOptions, (err, html) => {
    if (err) {
      console.error(`Error rendering page ${view}:`, err);
      return res.status(500).send('Internal Celestial Rendering Error');
    }
    res.render('layouts/main', {
      ...mergedOptions,
      body: html
    });
  });
}

// 1. Home Page
router.get('/', (req, res) => {
  // Fetch latest daily thoughts and featured articles from database
  let thoughts = [];
  try {
    thoughts = db.prepare("SELECT * FROM daily_thoughts WHERE is_published = 1 AND (datetime(published_at) <= datetime('now') OR published_at IS NULL) ORDER BY published_at DESC LIMIT 5").all();
  } catch (e) {
    console.error('Error fetching thoughts:', e.message);
  }

  // Featured Market Chronicles for Homepage (Harshad Mehta, Rakesh Jhunjhunwala Legend, Jesse Livermore, Vijay Mallya)
  const featuredSlugs = ['harshad-mehta-1992', 'rakesh-jhunjhunwala-legend', 'jesse-livermore-1929', 'vijay-mallya-2012'];
  const featuredChronicles = featuredSlugs.map(s => chroniclesService.getBySlug(s)).filter(Boolean);

  renderWithLayout(res, 'home', {
    pageId: 'home',
    title: CONSTANTS.SITEMAP.HOME.title,
    description: 'Explore financial astrology macro commentary alongside live Indian equity indices, gold, and crypto.',
    thoughts,
    featuredChronicles,
    extraScripts: [
      '/js/orbit.js',
      '/js/market-data.js',
      '/js/panchang.js',
      '/js/gann-chakra.js',
      '/js/kundli-form.js'
    ]
  });
});


// 2. Weekly Market Outlook
router.get('/weekly-outlook', (req, res) => {
  let outlooks = [];
  try {
    outlooks = db.prepare('SELECT * FROM weekly_outlook WHERE is_published = 1 ORDER BY published_at DESC').all();
  } catch (e) {
    console.error('Error fetching outlooks:', e.message);
  }

  renderWithLayout(res, 'weekly-outlook', {
    pageId: 'weekly-outlook',
    title: CONSTANTS.SITEMAP.WEEKLY_OUTLOOK.title,
    description: 'Weekly astrological macro write-ups assessing planetary cycles against stock indices, gold, and crypto.',
    outlooks
  });
});

// 3. Live Market Data
router.get('/market-data', (req, res) => {
  renderWithLayout(res, 'market-data', {
    pageId: 'market-data',
    title: CONSTANTS.SITEMAP.MARKET_DATA.title,
    description: 'Telemetry dashboard for Indian stock indices, precious metals, and digital currencies.',
    extraScripts: ['/js/market-data.js']
  });
});

// 4. Know Your Trading Kundli
router.get(['/trading-kundli', '/kundli'], (req, res) => {
  renderWithLayout(res, 'kundli', {
    pageId: 'kundli',
    title: CONSTANTS.SITEMAP.KUNDLI.title,
    description: 'Calculate your Vedic trading propensity, speculation yoga, and planetary archetypes.',
    extraScripts: ['/js/kundli-form.js']
  });
});

// 4a. Standalone Institutional Wealth Dossier (5-Page Printable / PDF Report View)
const { evaluateTradingKundli } = require('../services/kundliEngine');
const { buildDossierHtml } = require('../services/pdfGenerator');

router.all(['/kundli/dossier', '/wealth-dossier', '/kundli-report'], (req, res) => {
  let analysis = req.body?.analysis || req.query?.analysis;
  if (typeof analysis === 'string') {
    try {
      analysis = JSON.parse(analysis);
    } catch (e) {
      analysis = null;
    }
  }

  if (!analysis) {
    const params = req.method === 'POST' ? req.body : req.query;
    const { fullName, gender, dob, tob, pob, day, month, year, hrs, min, sec, lat, lng } = params;
    analysis = evaluateTradingKundli({
      fullName: fullName || 'Valued Client',
      gender: gender || 'Male',
      dob: dob || (year && month && day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '1990-01-15'),
      tob: tob || (hrs !== undefined ? `${String(hrs || 12).padStart(2, '0')}:${String(min || 0).padStart(2, '0')}:${String(sec || 0).padStart(2, '0')}` : '12:00:00'),
      pob: pob || 'Mumbai, Maharashtra',
      lat, lng
    });
  }

  let html = buildDossierHtml(analysis);
  const shouldAutoPrint = req.query?.print === '1' || req.body?.print === '1';

  html = html.replace('</body>', `
    <div class="no-print" style="position:fixed; top:14px; right:18px; z-index:99999; display:flex; gap:10px; font-family:'Montserrat', sans-serif;">
      <button onclick="window.print()" style="background:#7e122a; color:#fff; border:none; padding:10px 22px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,0.35); display:flex; align-items:center; gap:6px;">
        <span>🖨️</span> Save as PDF / Print
      </button>
      <button onclick="window.close()" style="background:#334155; color:#fff; border:none; padding:10px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
        ✕ Close
      </button>
    </div>
    <style>
      @media print {
        .no-print { display: none !important; }
      }
    </style>
    ${shouldAutoPrint ? `
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => { window.print(); }, 700);
      });
    </script>
    ` : ''}
    </body>
  `);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

// 4a. Client Kundli Forensic Audit & Architectural Comparison (Standalone Presentation Document)
router.get(['/kundli-comparison', '/kundli-audit', '/chart-audit'], (req, res) => {
  res.render('pages/kundli-comparison', {
    layout: false,
    pageId: 'kundli-comparison',
    title: 'वैदिक कुंडली सत्यापन एवं प्रमाणिक तुलनात्मक रिपोर्ट | Cosmic Finance',
    description: 'पारंपरिक मंडल यंत्र और कॉस्मिक फाइनेंस की शुद्ध वैदिक गणना का तुलनात्मक विश्लेषण।',
    ...res.locals
  });
});

// 4b. Gann's Square of 9 & Sarvatobhadra Chakra Interactive Terminal
router.get(['/gann-square', '/gann-sarvatobhadra', '/sarvatobhadra'], (req, res) => {
  renderWithLayout(res, 'gann-square', {
    pageId: 'gann-square',
    title: CONSTANTS.SITEMAP.GANN_SQUARE.title,
    description: 'Interactive Gann Square of 9 price-time wheel & Vedic Sarvatobhadra Chakra Vedha raycast terminal. Master geometric market timing in Hindi & English.',
    founder: CONSTANTS.FOUNDER,
    extraScripts: ['/js/gann-chakra.js']
  });
});

// 4c. Founder & Celebrity Astrologer Showcase Page
router.get(['/founder', '/dr-ashish-patni', '/about-founder'], (req, res) => {
  renderWithLayout(res, 'founder', {
    pageId: 'founder',
    title: CONSTANTS.SITEMAP.FOUNDER.title,
    description: 'Dr. Ashish Patni — Renowned Celebrity Financial Astrologer, Numerologist & Founder of Bhavishyam. Discover his pioneer work in Vedic Market Timing, Corporate Astro-Vastu & Cosmic Finance.',
    founder: CONSTANTS.FOUNDER
  });
});

// 4d. Market Chronicles: Titans, Legends & Turning Points
router.get(['/chronicles', '/market-chronicles', '/rise-and-fall'], (req, res) => {
  const category = req.query.category || null;
  const chronicles = chroniclesService.getAll(category);
  const categories = chroniclesService.getCategories();

  renderWithLayout(res, 'chronicles', {
    pageId: 'chronicles',
    title: 'Market Chronicles: Titans, Legends & Turning Points — Astrological Case Studies | Cosmic Finance',
    description: 'Explore the astronomical, Vedic, and numerological mechanics behind the meteoric rises, dramatic turning points, and unbroken legends of Dalal Street and Wall Street.',
    chronicles,
    categories,
    activeCategory: category || 'all',
    founder: CONSTANTS.FOUNDER
  });
});

// 4e. Single Chronicle Case Study Detail
router.get(['/chronicles/:slug', '/market-chronicles/:slug', '/rise-and-fall/:slug'], (req, res) => {
  const { slug } = req.params;
  const chronicle = chroniclesService.getBySlug(slug);

  if (!chronicle) {
    return res.status(404).render('layouts/main', {
      pageId: '404',
      title: 'Case Study Not Found | Cosmic Finance',
      currentPath: req.path,
      phone: CONSTANTS.PHONE_NUMBER,
      whatsappMessage: CONSTANTS.WHATSAPP_PREFILLED_MESSAGE,
      constants: CONSTANTS,
      founder: CONSTANTS.FOUNDER,
      body: '<div class="container py-12 text-center"><h1>Case Study Not Found</h1><p class="text-secondary">The requested Market Chronicle could not be located.</p><a href="/chronicles" class="btn btn-gold mt-4">Return to Market Chronicles</a></div>'
    });
  }

  const related = chroniclesService.getRelated(slug, 3);

  renderWithLayout(res, 'chronicle-detail', {
    pageId: 'chronicle-detail',
    title: `${chronicle.name} (${chronicle.era}) — Astrological Case Study | Cosmic Finance`,
    description: `${chronicle.moniker}: ${chronicle.tagline}`,
    chronicle,
    related,
    founder: CONSTANTS.FOUNDER
  });
});

// 5. Articles Listing
router.get('/articles', (req, res) => {
  let articles = [];
  try {
    articles = db.prepare("SELECT * FROM articles WHERE status = 'approved' ORDER BY published_at DESC").all();
  } catch (e) {
    console.error('Error fetching articles:', e.message);
  }

  renderWithLayout(res, 'articles', {
    pageId: 'articles',
    title: CONSTANTS.SITEMAP.ARTICLES.title,
    description: 'In-depth research articles on financial astrology, market timing, and trader psychology.',
    articles
  });
});

// 6. Single Article Detail
router.get('/articles/:slug', (req, res) => {
  const { slug } = req.params;
  let article = null;
  try {
    article = db.prepare("SELECT * FROM articles WHERE slug = ? AND status = 'approved'").get(slug);
  } catch (e) {
    console.error('Error fetching article:', e.message);
  }

  if (!article) {
    return res.status(404).render('layouts/main', {
      pageId: '404',
      title: 'Article Not Found | Cosmic Finance',
      description: 'The requested article could not be found.',
      body: '<div class="container section-rhythm text-center"><h1>Article Not Found</h1><p>The requested cosmic dispatch does not exist.</p><a href="/articles" class="btn btn-gold mt-4">Browse Articles</a></div>'
    });
  }

  renderWithLayout(res, 'article-single', {
    pageId: 'article-single',
    title: `${article.title} | Cosmic Finance`,
    description: article.excerpt || 'Financial astrology research article.',
    article,
    currentUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
});

// 7. Submit an Article
router.get('/submit-article', (req, res) => {
  renderWithLayout(res, 'submit-article', {
    pageId: 'submit-article',
    title: CONSTANTS.SITEMAP.SUBMIT_ARTICLE.title,
    description: 'Submit your astrological market research for editorial review and publication.'
  });
});

// 8. News Radar
const { getCachedMarketTelemetry } = require('../services/marketData');
const { getNewsSyncStatus } = require('../services/newsService');

router.get('/news', (req, res) => {
  let newsItems = [];
  let categoryCounts = { all: 0, Equities: 0, Bullion: 0, Macro: 0, Global: 0, 'Astro-Market': 0 };
  const requestedCategory = req.query.category || 'all';

  try {
    let query = 'SELECT * FROM news WHERE is_published = 1';
    const params = [];

    if (requestedCategory && requestedCategory !== 'all') {
      query += ' AND category = ?';
      params.push(requestedCategory);
    }

    query += ' ORDER BY published_at DESC LIMIT 100';
    newsItems = db.prepare(query).all(...params);

    // Compute category counts for tab badges
    const allCounts = db.prepare('SELECT category, COUNT(*) as cnt FROM news WHERE is_published = 1 GROUP BY category').all();
    let totalAll = 0;
    allCounts.forEach(c => {
      if (categoryCounts[c.category] !== undefined) {
        categoryCounts[c.category] = c.cnt;
      }
      totalAll += c.cnt;
    });
    categoryCounts.all = totalAll;
  } catch (e) {
    console.error('Error fetching news:', e.message);
  }

  // Retrieve cached market benchmarks for top ticker banner
  let marketBenchmarks = [];
  try {
    const telemetry = getCachedMarketTelemetry();
    if (telemetry && telemetry.data) {
      marketBenchmarks = telemetry.data.filter(d => ['NIFTY', 'SENSEX', 'GOLD', 'SILVER', 'BTC'].includes(d.symbol));
    }
  } catch (err) {
    // Graceful fallback
  }

  const syncStatus = getNewsSyncStatus();

  renderWithLayout(res, 'news', {
    pageId: 'news',
    title: 'Market & Cosmic News Radar | Real-Time Intelligence & Ingress Telemetry',
    description: 'Real-time syndicated financial dispatches, Dalal Street market movements, bullion prices, and planetary ingress developments.',
    newsItems,
    activeCategory: requestedCategory,
    categoryCounts,
    marketBenchmarks,
    syncStatus
  });
});

// Phase 10 C.1: Historical Pattern Library Listing
router.get('/patterns', (req, res) => {
  let patterns = [];
  try {
    patterns = db.prepare('SELECT * FROM historical_patterns ORDER BY win_rate_percent DESC').all();
  } catch (e) {
    console.error('Error fetching patterns:', e.message);
  }

  renderWithLayout(res, 'patterns', {
    pageId: 'patterns',
    title: 'Historical Pattern Library | Cosmic Finance',
    description: 'Empirical cross-reference of planetary cycles against historical Indian market performance. Calculated statistics, zero AI predictions.',
    patterns
  });
});

// Phase 10 C.1: Single Historical Pattern Detail
router.get('/patterns/:slug', (req, res) => {
  const { slug } = req.params;
  let pattern = null;
  try {
    const row = db.prepare('SELECT * FROM historical_patterns WHERE slug = ?').get(slug);
    if (row) {
      pattern = {
        ...row,
        occurrences: JSON.parse(row.occurrences_json)
      };
    }
  } catch (e) {
    console.error('Error fetching pattern:', e.message);
  }

  if (!pattern) {
    return res.status(404).render('layouts/main', {
      pageId: '404',
      title: 'Pattern Not Found | Cosmic Finance',
      description: 'The requested pattern calculation does not exist.',
      body: '<div class="container section-rhythm text-center"><h1>Pattern Not Found</h1><p>The requested empirical pattern calculation does not exist.</p><a href="/patterns" class="btn btn-gold mt-4">Browse Pattern Library</a></div>'
    });
  }

  renderWithLayout(res, 'pattern-single', {
    pageId: 'pattern-single',
    title: `${pattern.title} | Cosmic Finance`,
    description: `Empirical distribution across ${pattern.sample_count} historical occurrences. Sample win rate: ${pattern.win_rate_percent}%.`,
    pattern,
    currentUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
});

// Phase 10 C.2: Public Track Record Page
router.get('/track-record', (req, res) => {
  let records = [];
  try {
    records = db.prepare('SELECT * FROM macro_track_record ORDER BY published_date DESC').all();
  } catch (e) {
    console.error('Error fetching track records:', e.message);
  }

  renderWithLayout(res, 'track-record', {
    pageId: 'track-record',
    title: 'Public Track Record & Verified Macro Calls | Cosmic Finance',
    description: 'Transparent, immutable historical log of weekly macro calls verified against actual market outcomes.',
    records
  });
});

// 9. About Cosmic Finance
router.get('/about', (req, res) => {
  renderWithLayout(res, 'about', {
    pageId: 'about',
    title: CONSTANTS.SITEMAP.ABOUT.title,
    description: 'Learn the genesis, methodology, and philosophy of Cosmic Finance.'
  });
});

// 10. Terms & Conditions
router.get('/terms', (req, res) => {
  renderWithLayout(res, 'terms', {
    pageId: 'terms',
    title: CONSTANTS.SITEMAP.TERMS.title,
    description: 'Terms of engagement and public access conditions for Cosmic Finance.'
  });
});

// 11. Privacy Policy
router.get('/privacy', (req, res) => {
  renderWithLayout(res, 'privacy', {
    pageId: 'privacy',
    title: CONSTANTS.SITEMAP.PRIVACY.title,
    description: 'Privacy standards and confidential encryption protocols for birth coordinates.'
  });
});

// 12. Regulatory Disclaimer
router.get('/disclaimer', (req, res) => {
  renderWithLayout(res, 'disclaimer', {
    pageId: 'disclaimer',
    title: CONSTANTS.SITEMAP.DISCLAIMER.title,
    description: 'SEBI regulatory non-registration disclosures and risk warnings.'
  });
});

// 13. Contact & Consultation
router.get('/contact', (req, res) => {
  renderWithLayout(res, 'contact', {
    pageId: 'contact',
    title: CONSTANTS.SITEMAP.CONTACT.title,
    description: 'Book a 1-on-1 personal financial astrological consultation via WhatsApp or phone.'
  });
});

module.exports = router;
