/**
 * Public REST API Endpoints
 * Rate-limited endpoints for live data polling, kundli teaser generation, and leads.
 */

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { encrypt } = require('../services/crypto');
const { formSubmissionLimiter } = require('../middleware/security');

const { getCachedMarketTelemetry } = require('../services/marketData');
const { calculateCurrentPlanetaryEphemeris, calculateCurrentHora } = require('../services/astronomy');

// 1. Live Market Data Telemetry Endpoint
router.get('/market-data', (req, res) => {
  try {
    const telemetry = getCachedMarketTelemetry();
    return res.json({
      status: 'success',
      ...telemetry
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve market telemetry.' });
  }
});

// 1b. Real-Time Server-Sent Events (SSE) Stream
router.get('/stream/market', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const eventBus = require('../services/eventBus');
  const initial = getCachedMarketTelemetry();
  res.write(`data: ${JSON.stringify(initial)}\n\n`);

  const onUpdate = (payload) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  eventBus.on('market:update', onUpdate);

  req.on('close', () => {
    eventBus.off('market:update', onUpdate);
  });
});

// Live Market Data Feeds Health
router.get('/market-data/feeds', (req, res) => {
  try {
    const { getLiveFeedsHealth } = require('../services/marketData');
    return res.json({
      status: 'success',
      feeds: getLiveFeedsHealth()
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve feed health.' });
  }
});

// Trigger Live Ingestion Sync
router.post('/market-data/sync', async (req, res) => {
  try {
    const { syncLiveMarketFeeds } = require('../services/marketData');
    const feeds = await syncLiveMarketFeeds();
    return res.json({
      status: 'success',
      synced: true,
      feeds
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to synchronize feeds.' });
  }
});

const { calibrateTodayEphemeris } = require('../services/vedAstroClient');

// Real-time Astronomical Ephemeris & Living Orbit Data with VedAstro Telemetry
router.get('/ephemeris', async (req, res) => {
  const ephemeris = calculateCurrentPlanetaryEphemeris();
  const hora = calculateCurrentHora();
  const telemetry = await calibrateTodayEphemeris();
  return res.json({
    status: 'success',
    ephemeris,
    hora,
    telemetry
  });
});

// Live Astronomical Telemetry Status Endpoint
router.get('/astronomy/telemetry', async (req, res) => {
  const telemetry = await calibrateTodayEphemeris();
  return res.json({
    status: 'success',
    telemetry
  });
});

const { getComprehensivePanchang } = require('../services/panchangService');

// Live Daily Vedic Panchang (English & Hindi)
router.get('/panchang', (req, res) => {
  try {
    const panchang = getComprehensivePanchang();
    return res.json({
      status: 'success',
      panchang
    });
  } catch (err) {
    console.error('Error calculating Panchang:', err);
    return res.status(500).json({ error: 'Failed to compute daily panchang.' });
  }
});

// Real-time Vedic Hora Endpoint
router.get('/hora', (req, res) => {
  const hora = calculateCurrentHora();
  return res.json({
    status: 'success',
    hora
  });
});

const { TIME_MACHINE_PRESETS, getSnapshot } = require('../services/timeMachineService');

// 4D Time Machine Presets
router.get('/time-machine/presets', (req, res) => {
  return res.json({
    status: 'success',
    presets: TIME_MACHINE_PRESETS
  });
});

// 4D Time Machine Snapshot (Zero latency, local DB precomputed store)
router.get('/time-machine/snapshot', (req, res) => {
  const { date } = req.query;
  const snapshot = getSnapshot(date);
  return res.json({
    status: 'success',
    snapshot
  });
});

const { getSectorHeatmapData, getVikramSamvatSeasonalityData, getIndexNatalCharts } = require('../services/marketData');

// C.4 Sector Heatmap by Planetary Dignity
router.get('/market-data/sectors-heatmap', (req, res) => {
  const data = getSectorHeatmapData();
  return res.json({ status: 'success', ...data });
});

// C.5 Vikram Samvat Seasonality Data
router.get('/market-data/vikram-samvat', (req, res) => {
  const data = getVikramSamvatSeasonalityData();
  return res.json({ status: 'success', ...data });
});

// C.6 Index Natal Charts
router.get('/market-data/index-charts', (req, res) => {
  const data = getIndexNatalCharts();
  return res.json({ status: 'success', charts: data });
});

// Historical Pattern Library API
router.get('/patterns', (req, res) => {
  try {
    const patterns = db.prepare('SELECT * FROM historical_patterns ORDER BY win_rate_percent DESC').all();
    const formatted = patterns.map(p => ({
      ...p,
      occurrences: JSON.parse(p.occurrences_json)
    }));
    return res.json({ status: 'success', patterns: formatted });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch historical patterns.' });
  }
});

const { evaluateTradingKundli, evaluateTradingKundliAsync } = require('../services/kundliEngine');

// 2. Kundli Calculation & Comprehensive Analysis Engine
router.post('/kundli/calculate', formSubmissionLimiter, async (req, res) => {
  let {
    fullName, gender, dob, tob, pob,
    day, month, year, hrs, min, sec,
    lat, lng, ayanamsa, chartStyle, horaryNumber
  } = req.body;

  // Reconstruct dob if sent as day, month, year
  if (!dob && day && month && year) {
    dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Reconstruct tob if sent as hrs, min, sec
  if (!tob && (hrs !== undefined || min !== undefined)) {
    tob = `${String(hrs || 12).padStart(2, '0')}:${String(min || 0).padStart(2, '0')}:${String(sec || 0).padStart(2, '0')}`;
  }

  if (!fullName || !dob || !pob) {
    return res.status(400).json({ error: 'Full Name, Date of Birth, and Place of Birth are required.' });
  }

  // Validate date is not future date
  if (new Date(dob) > new Date()) {
    return res.status(400).json({ error: 'Date of birth cannot be in the future.' });
  }

  // Compute comprehensive Vedic Trading Kundli evaluation
  const analysis = await evaluateTradingKundliAsync({
    fullName, gender: gender || 'Male', dob, tob, pob,
    day, month, year, hrs, min, sec,
    lat, lng, ayanamsa: ayanamsa || 'N.C.Lahiri',
    chartStyle: chartStyle || 'North Indian',
    horaryNumber
  });

  const ipAddress = req.ip || req.connection.remoteAddress;

  try {
    const stmt = db.prepare(`
      INSERT INTO leads (full_name, dob, tob, pob, speculation_yoga, trading_personality, favored_sector, lead_type, status, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'kundli_teaser', 'New', ?)
    `);
    const info = stmt.run(
      fullName,
      dob,
      tob || 'Approximate',
      pob,
      analysis.speculationYoga.badge,
      analysis.personality.title,
      analysis.favoredAsset,
      ipAddress
    );

    return res.json({
      success: true,
      leadId: info.lastInsertRowid,
      analysis
    });
  } catch (err) {
    console.error('Error logging kundli calculation:', err.message);
    return res.json({
      success: true,
      analysis
    });
  }
});

const { generateWealthDossierPdf } = require('../services/pdfGenerator');

// 2b. Executive Wealth Dossier PDF Compilation Endpoint
router.post('/kundli/pdf', async (req, res) => {
  const fs = require('fs');
  try {
    let analysis = req.body.analysis;
    if (typeof analysis === 'string') {
      try {
        analysis = JSON.parse(analysis);
      } catch (e) {
        analysis = null;
      }
    }
    if (!analysis) {
      let { fullName, gender, dob, tob, pob, day, month, year, hrs, min, sec } = req.body;
      if (!dob && day && month && year) {
        dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      if (!tob && (hrs !== undefined || min !== undefined)) {
        tob = `${String(hrs || 12).padStart(2, '0')}:${String(min || 0).padStart(2, '0')}:${String(sec || 0).padStart(2, '0')}`;
      }
      analysis = evaluateTradingKundli({
        fullName: fullName || 'Valued Client',
        gender: gender || 'Male',
        dob: dob || '1990-01-15',
        tob: tob || '12:00:00',
        pob: pob || 'Mumbai, Maharashtra'
      });
    }

    const pdfPath = await generateWealthDossierPdf(analysis);
    const safeName = (analysis.fullName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Cosmic_Finance_Wealth_Dossier_${safeName}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);
    stream.on('end', () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });
    stream.on('error', (err) => {
      console.error('Stream error while sending PDF:', err);
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });
  } catch (err) {
    console.error('Error generating Wealth Dossier PDF:', err);
    res.status(500).json({ error: 'Failed to generate Wealth Dossier PDF: ' + err.message });
  }
});

router.get('/kundli/pdf', async (req, res) => {
  const fs = require('fs');
  try {
    const { fullName, gender, dob, tob, pob } = req.query;
    const analysis = evaluateTradingKundli({
      fullName: fullName || 'Valued Client',
      gender: gender || 'Male',
      dob: dob || '1990-01-15',
      tob: tob || '12:00:00',
      pob: pob || 'Mumbai, Maharashtra'
    });

    const pdfPath = await generateWealthDossierPdf(analysis);
    const safeName = (analysis.fullName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `Cosmic_Finance_Wealth_Dossier_${safeName}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);
    stream.on('end', () => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });
    stream.on('error', (err) => {
      try { fs.unlinkSync(pdfPath); } catch (e) {}
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate Wealth Dossier PDF.' });
  }
});

// 3. Lead Capture from Call Request or WhatsApp Intent
router.post('/leads/inquiry', formSubmissionLimiter, (req, res) => {
  const { fullName, phone, leadId, notes } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Contact phone number is required.' });
  }

  const encryptedPhone = encrypt(phone);

  try {
    if (leadId) {
      // Update existing kundli teaser lead
      db.prepare(`
        UPDATE leads 
        SET phone_encrypted = ?, admin_notes = COALESCE(admin_notes, '') || ' ' || ?, lead_type = 'call', status = 'New'
        WHERE id = ?
      `).run(encryptedPhone, notes || 'Requested phone consultation from Kundli page', leadId);
    } else {
      // Insert fresh direct inquiry
      db.prepare(`
        INSERT INTO leads (full_name, dob, pob, phone_encrypted, lead_type, admin_notes, ip_address)
        VALUES (?, 'N/A', 'N/A', ?, 'call', ?, ?)
      `).run(fullName || 'Consultation Inquiry', encryptedPhone, notes || '', req.ip);
    }

    return res.json({ success: true, message: 'Consultation request registered securely.' });
  } catch (err) {
    console.error('Error saving lead inquiry:', err.message);
    return res.status(500).json({ error: 'Unable to register consultation request.' });
  }
});

// 4. Submit an Article (Goes directly into moderation queue)
router.post('/articles/submit', formSubmissionLimiter, (req, res) => {
  const { authorName, authorEmail, articleTitle, category, articleExcerpt, articleContent, authorBio } = req.body;

  if (!authorName || !articleTitle || !articleContent) {
    return res.status(400).json({ error: 'Author Name, Article Title, and Content are required.' });
  }

  // Generate safe slug
  const baseSlug = articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  try {
    db.prepare(`
      INSERT INTO articles (slug, title, excerpt, content, category, author_name, author_bio, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(slug, articleTitle, articleExcerpt || '', articleContent, category || 'Basics', authorName, authorBio || '');

    return res.json({
      success: true,
      message: 'Article submitted successfully to the editorial moderation queue.'
    });
  } catch (err) {
    console.error('Error submitting article:', err.message);
    return res.status(500).json({ error: 'Failed to submit article for review.' });
  }
});

// 5. News Intelligence API Endpoints
const { syncAllNews, getNewsSyncStatus } = require('../services/newsService');

router.get('/news', (req, res) => {
  try {
    const { category, q, limit = 50 } = req.query;
    let query = 'SELECT * FROM news WHERE is_published = 1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (q) {
      query += ' AND (title LIKE ? OR summary LIKE ? OR source_name LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(Math.min(parseInt(limit, 10) || 50, 100));

    const newsItems = db.prepare(query).all(...params);
    return res.json({
      status: 'success',
      count: newsItems.length,
      news: newsItems
    });
  } catch (err) {
    console.error('Error fetching news API:', err.message);
    return res.status(500).json({ error: 'Failed to retrieve news feed.' });
  }
});

router.get('/news/status', (req, res) => {
  try {
    return res.json({
      status: 'success',
      ...getNewsSyncStatus()
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve news sync status.' });
  }
});

router.post('/news/sync', async (req, res) => {
  try {
    const result = await syncAllNews();
    return res.json({
      status: 'success',
      message: `News synchronization complete. Fetched: ${result.articlesFetched}, Newly Inserted: ${result.articlesInserted}`,
      data: result
    });
  } catch (err) {
    return res.status(500).json({ error: 'News synchronization failed: ' + err.message });
  }
});

module.exports = router;
