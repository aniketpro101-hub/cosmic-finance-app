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

// Live VedAstro Swiss Ephemeris Status Endpoint
router.get('/vedastro/status', async (req, res) => {
  const telemetry = await calibrateTodayEphemeris();
  return res.json({
    status: 'success',
    telemetry
  });
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

// 2. Kundli Calculation & Teaser Generator
router.post('/kundli/calculate', formSubmissionLimiter, async (req, res) => {
  const { fullName, dob, tob, pob, approxTime } = req.body;

  if (!fullName || !dob || !pob) {
    return res.status(400).json({ error: 'Full Name, Date of Birth, and Place of Birth are required.' });
  }

  // Validate date is not future date
  if (new Date(dob) > new Date()) {
    return res.status(400).json({ error: 'Date of birth cannot be in the future.' });
  }

  // Compute Vedic Trading Kundli evaluation augmented with VedAstro Swiss Ephemeris predictions
  const analysis = await evaluateTradingKundliAsync({ fullName, dob, tob, pob, approxTime });

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
    return res.status(500).json({ error: 'Failed to process astronomical calculation.' });
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

module.exports = router;
