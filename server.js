/**
 * Cosmic Finance — Express Application Server
 * Architecture: Node.js + Express + EJS + SQLite + Vanilla CSS & JS
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const CONSTANTS = require('./src/config/constants');
const db = require('./src/db/database');
const seedDatabase = require('./src/db/seed');
const { helmetConfig, generalLimiter } = require('./src/middleware/security');
const { startMarketTelemetryWorker } = require('./src/services/marketData');
const { startNewsScheduler } = require('./src/services/newsService');

// Process-level resilience against intermittent external API network dropouts
process.on('uncaughtException', (err) => {
  console.error('Unhandled process exception recovered:', err.stack || err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection recovered:', reason);
});

process.on('exit', (code) => {
  console.log(`[Process] Server exiting with code: ${code}`);
});

process.on('SIGINT', () => {
  console.log('[Process] Received SIGINT');
});

process.on('SIGTERM', () => {
  console.log('[Process] Received SIGTERM');
});

// Seed starter tables if needed
seedDatabase();
startMarketTelemetryWorker();
startNewsScheduler();

const app = express();
const PORT = process.env.PORT || 3000;

// Compression & Security Headers
app.use(compression());
app.use(helmetConfig);

// Serve Static Assets (Bypasses rate limiting)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Rate Limiter for Application Routes & APIs
app.use(generalLimiter);

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session Management (Strict HttpOnly, SameSite)
app.use(session({
  name: 'cf_session_id',
  secret: process.env.SESSION_SECRET || 'cosmic_finance_fallback_secret_prod_99',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60 * 1000 // 4 hours
  }
}));

// View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// SEO: robots.txt (Explicitly hide the admin route!)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: ${CONSTANTS.ADMIN_PATH}*\nSitemap: http://${req.headers.host}/sitemap.xml\n`);
});

// SEO: sitemap.xml (Public pages only, NEVER the admin route)
app.get('/sitemap.xml', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const pages = [
    '',
    '/market-data',
    '/weekly-outlook',
    '/trading-kundli',
    '/gann-square',
    '/founder',
    '/articles',
    '/submit-article',
    '/news',
    '/patterns',
    '/track-record',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/disclaimer'
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  pages.forEach(p => {
    xml += `  <url>\n    <loc>${host}${p}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${p === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });
  xml += '</urlset>';

  res.type('application/xml');
  res.send(xml);
});

// Mount Hidden Administrative Router
const adminRouter = require('./src/routes/admin');
app.use(CONSTANTS.ADMIN_PATH, adminRouter);

// Mount Public API Router
const apiRouter = require('./src/routes/api');
app.use('/api', apiRouter);

// Mount Public Frontend Router
const publicRouter = require('./src/routes/public');
app.use('/', publicRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('layouts/main', {
    pageId: '404',
    title: '404 — Cosmic Horizon Not Found | Cosmic Finance',
    description: 'The requested sector is outside observable space.',
    body: `
      <div class="container section-rhythm text-center">
        <div class="cosmic-badge mb-4">404 ANOMALY</div>
        <h1 class="page-title">Celestial Sector Not Found</h1>
        <p class="page-subtitle">The planetary coordinates or page you are searching for are outside observable space.</p>
        <div class="mt-4">
          <a href="/" class="btn btn-gold btn-lg">Return to Observatory Horizon &rarr;</a>
        </div>
      </div>
    `,
    currentPath: req.path,
    phone: CONSTANTS.PHONE_NUMBER,
    whatsappMessage: CONSTANTS.WHATSAPP_PREFILLED_MESSAGE,
    constants: CONSTANTS
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Exception:', err);
  res.status(500).send('Cosmic System Anomaly. Please reload momentarily.');
});

// Start Server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌌 Cosmic Finance Observatory is active on http://0.0.0.0:${PORT}`);
    console.log(`🔒 Hidden Admin gateway mounted at ${CONSTANTS.ADMIN_PATH}`);
  });
}

module.exports = app;
