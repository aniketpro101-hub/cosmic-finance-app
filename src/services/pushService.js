/**
 * Cosmic Finance — PWA Push Notification & Broadcast Service
 * Manages client push subscriptions, notification history, and broadcasts
 */

const db = require('../db/database');

// Ensure tables exist in active database session
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      subscription_json TEXT NOT NULL,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS push_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      url TEXT DEFAULT '/',
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (e) {
  console.error('Push tables init error:', e.message);
}

/**
 * Save or update a client push subscription
 */
function saveSubscription(subscription, userAgent = '') {
  if (!subscription || !subscription.endpoint) return null;
  const endpoint = subscription.endpoint;
  const subJson = JSON.stringify(subscription);

  try {
    const existing = db.prepare('SELECT id FROM push_subscriptions WHERE endpoint = ?').get(endpoint);
    if (existing) {
      db.prepare('UPDATE push_subscriptions SET subscription_json = ?, user_agent = ? WHERE endpoint = ?')
        .run(subJson, userAgent, endpoint);
      return existing.id;
    } else {
      const info = db.prepare('INSERT INTO push_subscriptions (endpoint, subscription_json, user_agent) VALUES (?, ?, ?)')
        .run(endpoint, subJson, userAgent);
      return info.lastInsertRowid;
    }
  } catch (err) {
    console.error('Error saving push subscription:', err.message);
    return null;
  }
}

/**
 * Broadcast a notification to all subscribers & record in push history
 */
function broadcastPushNotification({ title, body, url = '/', category = 'general' }) {
  if (!title || !body) return null;

  try {
    const info = db.prepare(`
      INSERT INTO push_notifications (title, body, url, category, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(title, body, url, category);

    const notificationId = info.lastInsertRowid;
    console.log(`[PushService] Broadcasted notification #${notificationId}: "${title}"`);

    // In a production environment with web-push package & VAPID keys, this will send to webPush.sendNotification()
    // Subscribed browsers also poll /api/push/latest or receive SSE
    return {
      success: true,
      notificationId,
      title,
      body,
      url
    };
  } catch (err) {
    console.error('Error broadcasting push notification:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Get latest notifications
 */
function getRecentNotifications(limit = 10) {
  try {
    return db.prepare('SELECT * FROM push_notifications ORDER BY created_at DESC LIMIT ?').all(limit);
  } catch (err) {
    return [];
  }
}

/**
 * Get latest single notification (used by service worker sync)
 */
function getLatestNotification() {
  try {
    return db.prepare('SELECT * FROM push_notifications ORDER BY created_at DESC LIMIT 1').get() || null;
  } catch (err) {
    return null;
  }
}

module.exports = {
  saveSubscription,
  broadcastPushNotification,
  getRecentNotifications,
  getLatestNotification
};
