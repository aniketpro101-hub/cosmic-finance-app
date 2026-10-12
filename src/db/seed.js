/**
 * SQLite Starter Database Seed
 * Populates starter daily thoughts, market cache, and news if empty.
 */

const db = require('./database');
const { seedArticles } = require('./seedArticles');
const { seedPhase10Data } = require('./seedPhase10');
const { seedKeyTimeMachineSnapshots } = require('../services/timeMachineService');

function seedDatabase() {
  // 1. Seed Initial Market Cache if empty
  const countMarkets = db.prepare('SELECT COUNT(*) as count FROM market_cache').get().count;
  if (countMarkets === 0) {
    const insertMarket = db.prepare(`
      INSERT INTO market_cache (symbol, name, asset_type, current_price, change_amount, change_percent, high, low, market_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertMarket.run('NIFTY', 'NIFTY 50', 'index', 22514.80, 132.40, 0.59, 22550.00, 22410.20, 'Open');
    insertMarket.run('SENSEX', 'SENSEX', 'index', 74228.60, 398.20, 0.54, 74340.00, 73950.10, 'Open');
    insertMarket.run('BANKNIFTY', 'BANK NIFTY', 'index', 48490.15, -85.30, -0.18, 48620.00, 48310.00, 'Open');
    insertMarket.run('GOLD', 'GOLD (MCX 24K)', 'commodity', 71850.00, 410.00, 0.57, 72050.00, 71420.00, 'Open');
    insertMarket.run('BTC', 'BITCOIN (USD)', 'crypto', 67820.00, 1420.00, 2.14, 68400.00, 66100.00, 'Open');
    insertMarket.run('ETH', 'ETHEREUM (USD)', 'crypto', 3540.00, 88.50, 2.56, 3590.00, 3420.00, 'Open');
  }

  // 2. Seed Initial Daily Thoughts if empty
  const countThoughts = db.prepare('SELECT COUNT(*) as count FROM daily_thoughts').get().count;
  if (countThoughts === 0) {
    const insertThought = db.prepare('INSERT INTO daily_thoughts (title, content, published_at) VALUES (?, ?, ?)');
    insertThought.run(
      'Mercury Direct in Ashwini: Recalibrating Sector Rotation',
      'As Mercury moves forward with full acceleration, short-term algorithmic chop settles across banking indices. Capital shifts towards quality large-cap names as planetary clarity resumes.',
      new Date().toISOString()
    );
    insertThought.run(
      'Jupiter-Venus Trine: Bullion Stability & Luxury Demand',
      'Harmonious aspect between classical wealth significators Jupiter and Venus indicates persistent resilience in precious metal accumulation. Maintain steady risk sizing.',
      new Date(Date.now() - 86400000).toISOString()
    );
  }

  // 3. Seed Articles Library (ensure full 20 starter articles)
  const countArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE status = 'approved'").get().count;
  if (countArticles < 20) {
    seedArticles();
  }

  // 4. Seed News if empty
  const countNews = db.prepare('SELECT COUNT(*) as count FROM news').get().count;
  if (countNews === 0) {
    const insertNews = db.prepare(`
      INSERT INTO news (title, summary, source_name, source_url, category)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertNews.run(
      'Indian Indices Consolidate Near Record Territory as FII Flows Stabilize',
      'Domestic institutional liquidity continues to anchor market breadth even as global central bank statements trigger brief volatility intervals.',
      'Financial Express',
      'https://www.financialexpress.com',
      'Macro'
    );

    insertNews.run(
      'Gold Prices Rebound Towards Key Resistance on Global Sovereign Buying',
      'Central bank bullion accumulation drives sustained spot demand as planetary Jupiter transit highlights defensive safe-haven asset classes.',
      'Bullion Bulletin',
      'https://www.moneycontrol.com',
      'Gold'
    );
  }

  // 5. Seed Weekly Outlook if empty
  const countOutlook = db.prepare('SELECT COUNT(*) as count FROM weekly_outlook').get().count;
  if (countOutlook === 0) {
    const insertOutlook = db.prepare(`
      INSERT INTO weekly_outlook (week_range, planetary_transits, market_commentary, nifty_sensex_outlook, gold_outlook, crypto_outlook)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertOutlook.run(
      'Current Week: October 05 – October 11, 2026',
      'Mercury Direct in Virgo | Jupiter in Taurus | Moon transiting through Leo and Virgo',
      'The current planetary configuration indicates steady consolidation across headline indices. Market velocity favors calculated swing positioning over impulsive intraday leverage.',
      'Rangebound consolidation with positive bias around major support zones.',
      'Firm retention of support above key psychological bullion markers.',
      'High beta volatility as Rahu aspect triggers sudden liquidity rotations.'
    );
  }

  // 6. Seed Phase 10: Historical Patterns & Track Record if empty
  const countPatterns = db.prepare('SELECT COUNT(*) as count FROM historical_patterns').get().count;
  if (countPatterns === 0) {
    seedPhase10Data();
  }

  // 7. Seed Time Machine Key Snapshots if empty
  const countSnapshots = db.prepare('SELECT COUNT(*) as count FROM astro_snapshots').get().count;
  if (countSnapshots === 0) {
    seedKeyTimeMachineSnapshots();
  }
}

module.exports = seedDatabase;
