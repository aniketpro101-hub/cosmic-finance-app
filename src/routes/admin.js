/**
 * Hidden Administrative Router
 * Single-admin gateway with 2FA TOTP and encrypted records view.
 */

const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const db = require('../db/database');
const CONSTANTS = require('../config/constants');
const { requireAdminAuth } = require('../middleware/auth');
const { adminLoginLimiter } = require('../middleware/security');
const { decrypt } = require('../services/crypto');
const { createDatabaseBackup } = require('../services/backup');

// 1. GET Login Page
router.get('/login', (req, res) => {
  if (req.session && req.session.isAdminAuthenticated) {
    return res.redirect(CONSTANTS.ADMIN_PATH);
  }
  res.render('admin/login', {
    adminPath: CONSTANTS.ADMIN_PATH,
    error: null
  });
});

// 2. POST Login (Password + TOTP 2FA)
router.post('/login', adminLoginLimiter, (req, res) => {
  const { username, password, totpToken } = req.body;
  const configuredUser = process.env.ADMIN_USERNAME || 'cosmicadmin';
  const configuredPass = process.env.ADMIN_PASSWORD || 'CosmicAdminPass2026!';
  const configuredTotpSecret = process.env.ADMIN_2FA_SECRET || 'JBSWY3DPEHPK3PXP';

  // Check username & password
  if (username !== configuredUser || password !== configuredPass) {
    return res.status(401).render('admin/login', {
      adminPath: CONSTANTS.ADMIN_PATH,
      error: 'Invalid administrator credentials.'
    });
  }

  // Verify TOTP 2FA Token
  const isTotpValid = speakeasy.totp.verify({
    secret: configuredTotpSecret,
    encoding: 'base32',
    token: String(totpToken).trim(),
    window: 2 // Allow +/- 1 minute drift
  });

  // In local development, allow bypass token '123456' or verify true TOTP
  const isDevBypass = process.env.NODE_ENV === 'development' && String(totpToken).trim() === '123456';

  if (!isTotpValid && !isDevBypass) {
    return res.status(401).render('admin/login', {
      adminPath: CONSTANTS.ADMIN_PATH,
      error: 'Invalid Two-Factor Authentication (TOTP) code. Check your authenticator app.'
    });
  }

  // Grant session
  req.session.isAdminAuthenticated = true;
  req.session.adminUser = username;
  req.session.cookie.maxAge = 4 * 60 * 60 * 1000; // 4 hour session timeout

  return res.redirect(CONSTANTS.ADMIN_PATH);
});

// 3. GET Admin Control Deck Dashboard
router.get('/', requireAdminAuth, (req, res) => {
  let stats = {
    newLeadsCount: 0,
    pendingArticlesCount: 0,
    thoughtsCount: 0
  };
  let recentLeads = [];
  let pendingArticles = [];

  try {
    const leadsCountRow = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'New'").get();
    stats.newLeadsCount = leadsCountRow ? leadsCountRow.count : 0;

    const pendingArtRow = db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'pending'").get();
    stats.pendingArticlesCount = pendingArtRow ? pendingArtRow.count : 0;

    const thoughtsCountRow = db.prepare("SELECT COUNT(*) as count FROM daily_thoughts").get();
    stats.thoughtsCount = thoughtsCountRow ? thoughtsCountRow.count : 0;

    recentLeads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 10").all();
    pendingArticles = db.prepare("SELECT * FROM articles WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5").all();
  } catch (err) {
    console.error('Admin query error:', err.message);
  }

  res.render('admin/dashboard', {
    adminPath: CONSTANTS.ADMIN_PATH,
    stats,
    recentLeads,
    pendingArticles
  });
});

// 4. GET & POST Daily Thoughts Management
router.get('/thoughts', requireAdminAuth, (req, res) => {
  const thoughts = db.prepare("SELECT * FROM daily_thoughts ORDER BY published_at DESC").all();
  res.render('admin/thoughts', { adminPath: CONSTANTS.ADMIN_PATH, thoughts });
});

router.post('/thoughts', requireAdminAuth, (req, res) => {
  const { title, content, publishTiming, scheduledFor } = req.body;
  if (title && content) {
    let publishTimestamp = new Date().toISOString();
    let isPublished = 1;

    if (publishTiming === 'schedule' && scheduledFor) {
      publishTimestamp = new Date(scheduledFor).toISOString();
    }

    db.prepare(`
      INSERT INTO daily_thoughts (title, content, published_at, is_published)
      VALUES (?, ?, ?, ?)
    `).run(title, content, publishTimestamp, isPublished);
  }
  res.redirect(`${CONSTANTS.ADMIN_PATH}/thoughts`);
});

// 5. GET Articles Moderation Queue & Action
router.get('/articles', requireAdminAuth, (req, res) => {
  const pending = db.prepare("SELECT * FROM articles WHERE status = 'pending' ORDER BY created_at DESC").all();
  const approved = db.prepare("SELECT * FROM articles WHERE status = 'approved' ORDER BY published_at DESC LIMIT 50").all();
  res.render('admin/articles', { adminPath: CONSTANTS.ADMIN_PATH, pending, approved });
});

router.post('/articles/moderate', requireAdminAuth, (req, res) => {
  const { articleId, action, rejectionNote } = req.body;
  if (action === 'approve') {
    db.prepare("UPDATE articles SET status = 'approved', published_at = CURRENT_TIMESTAMP WHERE id = ?").run(articleId);
  } else if (action === 'reject') {
    db.prepare("UPDATE articles SET status = 'rejected', rejection_note = ? WHERE id = ?").run(rejectionNote || 'Does not meet editorial guidelines', articleId);
  }
  res.redirect(`${CONSTANTS.ADMIN_PATH}/articles`);
});

// Create Article Directly from Admin Panel
router.post('/articles/create', requireAdminAuth, (req, res) => {
  const { title, excerpt, content, category, authorName, authorBio, readTime } = req.body;
  if (title && content) {
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    db.prepare(`
      INSERT INTO articles (slug, title, excerpt, content, category, author_name, author_bio, read_time, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', CURRENT_TIMESTAMP)
    `).run(slug, title, excerpt || '', content, category || 'Basics', authorName || 'Cosmic Finance Team', authorBio || 'Staff Astrological Analyst', readTime || '5 min read');
  }
  res.redirect(`${CONSTANTS.ADMIN_PATH}/articles`);
});

// 6. GET Leads Management Deck (With decryption)
router.get('/leads', requireAdminAuth, (req, res) => {
  const rawLeads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  const leads = rawLeads.map(l => ({
    ...l,
    phone_decrypted: l.phone_encrypted ? decrypt(l.phone_encrypted) : 'None'
  }));
  res.render('admin/leads', { adminPath: CONSTANTS.ADMIN_PATH, leads });
});

router.post('/leads/status', requireAdminAuth, (req, res) => {
  const { leadId, status, adminNotes } = req.body;
  db.prepare("UPDATE leads SET status = ?, admin_notes = ? WHERE id = ?").run(status, adminNotes || '', leadId);
  res.redirect(`${CONSTANTS.ADMIN_PATH}/leads`);
});

// 7. GET News Management
router.get('/news', requireAdminAuth, (req, res) => {
  const newsList = db.prepare("SELECT * FROM news ORDER BY published_at DESC").all();
  res.render('admin/news', { adminPath: CONSTANTS.ADMIN_PATH, newsList });
});

router.post('/news', requireAdminAuth, (req, res) => {
  const { title, summary, sourceName, sourceUrl, category } = req.body;
  if (title && summary && sourceName && sourceUrl) {
    db.prepare(`
      INSERT INTO news (title, summary, source_name, source_url, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, summary, sourceName, sourceUrl, category || 'Macro');
  }
  res.redirect(`${CONSTANTS.ADMIN_PATH}/news`);
});

// 8. GET Analytics
router.get('/analytics', requireAdminAuth, (req, res) => {
  const totalLeads = db.prepare("SELECT COUNT(*) as count FROM leads").get().count;
  const convertedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Converted'").get().count;
  const contactedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'Contacted'").get().count;
  const totalArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'approved'").get().count;
  res.render('admin/analytics', {
    adminPath: CONSTANTS.ADMIN_PATH,
    analytics: { totalLeads, convertedLeads, contactedLeads, totalArticles }
  });
});

// Phase 10: Weekly Macro Outlook & Public Track Record Management
router.get('/outlook', requireAdminAuth, (req, res) => {
  const outlooks = db.prepare('SELECT * FROM weekly_outlook ORDER BY published_at DESC').all();
  const trackRecords = db.prepare('SELECT * FROM macro_track_record ORDER BY published_date DESC').all();
  res.render('admin/outlook', {
    adminPath: CONSTANTS.ADMIN_PATH,
    outlooks,
    trackRecords
  });
});

router.post('/outlook/verify-outcome', requireAdminAuth, (req, res) => {
  const { trackId, outlookId, weekRange, publishedDate, statedCall, actualOutcome, status, marketMetricDelta } = req.body;

  if (actualOutcome && status) {
    if (trackId) {
      db.prepare(`
        UPDATE macro_track_record
        SET actual_outcome = ?, status = ?, market_metric_delta = ?, verified_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(actualOutcome, status, marketMetricDelta || '', trackId);
    } else {
      db.prepare(`
        INSERT INTO macro_track_record (outlook_id, week_range, published_date, stated_macro_call, actual_outcome, status, market_metric_delta, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).run(outlookId || null, weekRange, publishedDate || new Date().toISOString().split('T')[0], statedCall, actualOutcome, status, marketMetricDelta || '');
    }
  }

  res.redirect(`${CONSTANTS.ADMIN_PATH}/outlook`);
});

// 9. Manual & Automated Backup Endpoint
router.post('/backup', requireAdminAuth, (req, res) => {
  const result = createDatabaseBackup();
  res.json(result);
});

// 10. Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
