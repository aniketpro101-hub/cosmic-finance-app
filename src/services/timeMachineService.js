/**
 * Cosmic Finance — 4D Time Machine Service
 * Phase 10: Precomputes and caches daily astronomical & historical market snapshots.
 * Zero live external API calls during dragging/scrubbing.
 */

const db = require('../db/database');
const { calculateGeocentricPositions, calculatePanchang } = require('./vedAstroService');

// Historical Market Benchmark Reference Data (NIFTY, SENSEX, GOLD, BTC)
const HISTORICAL_MARKET_MILESTONES = {
  '2008-09-15': { nifty: 4038.90, sensex: 13531.07, gold: 13150, btc: 0, notes: 'Lehman Brothers bankruptcy; global liquidity shock. Saturn in Simha, Rahu in Makara.' },
  '2008-10-24': { nifty: 2584.00, sensex: 8701.07, gold: 12200, btc: 0, notes: '2008 global financial crisis capitulation low. Severe liquidity contraction.' },
  '2009-05-18': { nifty: 4321.10, sensex: 14284.21, gold: 14500, btc: 0, notes: 'Indian general election results; historic upper circuit back-to-back halt.' },
  '2016-11-08': { nifty: 8432.00, sensex: 27252.53, gold: 30100, btc: 710, notes: 'Demonetization announced & US Presidential election day. High volatility shock.' },
  '2020-03-23': { nifty: 7610.25, sensex: 25981.24, gold: 41200, btc: 6420, notes: 'Covid-19 panic capitulation low. Saturn-Mars conjunction in Makara (Capricorn).' },
  '2020-11-10': { nifty: 12631.10, sensex: 43277.69, gold: 50800, btc: 15300, notes: 'Vaccine efficacy breakthrough; massive institutional liquidity inflection.' },
  '2021-10-19': { nifty: 18477.05, sensex: 61765.59, gold: 47350, btc: 64400, notes: 'Post-pandemic liquidity peak. Jupiter transit in Kumbha (Aquarius).' },
  '2021-11-10': { nifty: 18017.20, sensex: 60352.82, gold: 49200, btc: 68789, notes: 'Bitcoin and global risk asset all-time high prior to tightening cycle.' },
  '2023-12-08': { nifty: 20969.40, sensex: 69825.60, gold: 61850, btc: 44100, notes: 'Nifty breaches 20,000 milestone; structural bull run continuation.' },
  '2024-06-04': { nifty: 21884.50, sensex: 72079.05, gold: 71900, btc: 70500, notes: '2024 Indian election counting day volatility swing; sharp intraday V-reversal.' },
  '2024-09-27': { nifty: 26277.35, sensex: 85978.25, gold: 75750, btc: 65800, notes: 'Nifty record peak 26,277; Jupiter in Vrishabha (Taurus).' }
};

// Key presets for interactive jump points
const TIME_MACHINE_PRESETS = [
  { id: 'today', label: 'Today (Live Ephemeris)', date: new Date().toISOString().split('T')[0], tag: 'LIVE' },
  { id: 'lehman_2008', label: '2008 Lehman Liquidity Shock', date: '2008-09-15', tag: 'HISTORICAL' },
  { id: 'covid_2020', label: '2020 Covid Capitulation Low', date: '2020-03-23', tag: 'HISTORICAL' },
  { id: 'bull_2021', label: '2021 Crypto & Risk Asset ATH', date: '2021-11-10', tag: 'HISTORICAL' },
  { id: 'election_2024', label: '2024 Election Volatility Swing', date: '2024-06-04', tag: 'HISTORICAL' },
  { id: 'transit_next_month', label: 'Next Month Transit (+30 Days)', date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], tag: 'NEAR FUTURE' },
  { id: 'transit_six_months', label: 'Six-Month Horizon (+180 Days)', date: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0], tag: 'NEAR FUTURE' }
];

// Seed initial snapshots into SQLite cache
function seedKeyTimeMachineSnapshots() {
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO astro_snapshots 
    (date, planets_json, panchang_json, nifty_close, sensex_close, gold_close, btc_close, market_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const datesToPrecompute = [
    ...Object.keys(HISTORICAL_MARKET_MILESTONES),
    new Date().toISOString().split('T')[0],
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]
  ];

  const transaction = db.transaction(() => {
    for (const dateStr of datesToPrecompute) {
      const targetDate = new Date(dateStr + 'T12:00:00Z');
      const sky = calculateGeocentricPositions(targetDate);
      const panchang = calculatePanchang(targetDate);

      const market = HISTORICAL_MARKET_MILESTONES[dateStr] || {
        nifty: 22500,
        sensex: 74200,
        gold: 71800,
        btc: 67500,
        notes: 'Precomputed geocentric ephemeris & projected planetary cycle alignment.'
      };

      insertStmt.run(
        dateStr,
        JSON.stringify(sky.planets),
        JSON.stringify(panchang),
        market.nifty,
        market.sensex,
        market.gold,
        market.btc,
        market.notes
      );
    }
  });

  transaction();
}

// In-memory LRU/Map cache for sub-millisecond scrub scrubbing
const snapshotMemoryCache = new Map();

// Retrieve snapshot for scrubbing — strictly from local database/memory, zero live API calls
function getSnapshot(dateStr) {
  // Validate format
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    dateStr = new Date().toISOString().split('T')[0];
  }

  if (snapshotMemoryCache.has(dateStr)) {
    return snapshotMemoryCache.get(dateStr);
  }

  const row = db.prepare('SELECT * FROM astro_snapshots WHERE date = ?').get(dateStr);

  if (row) {
    const result = {
      date: row.date,
      planets: JSON.parse(row.planets_json),
      panchang: row.panchang_json ? JSON.parse(row.panchang_json) : null,
      market: {
        nifty: row.nifty_close,
        sensex: row.sensex_close,
        gold: row.gold_close,
        btc: row.btc_close,
        notes: row.market_notes
      },
      source: 'Local Precomputed Snapshot Store (Zero Latency)'
    };
    snapshotMemoryCache.set(dateStr, result);
    return result;
  }

  // If not yet in cache, compute locally using deterministic geocentric engine and cache it
  const targetDate = new Date(dateStr + 'T12:00:00Z');
  const sky = calculateGeocentricPositions(targetDate);
  const panchang = calculatePanchang(targetDate);

  // Approximate historical trend interpolation if milestone not present
  const year = targetDate.getFullYear();
  let estNifty = 1000 + (year - 2000) * 850;
  if (estNifty < 900) estNifty = 900;
  let estSensex = estNifty * 3.3;
  let estGold = 4500 + (year - 2000) * 2800;
  let estBtc = year >= 2011 ? Math.min(70000, Math.pow(year - 2009, 3.5) * 25) : 0;

  const notes = `Astronomical snapshot for ${dateStr}. Geocentric sidereal Navagraha coordinates.`;

  db.prepare(`
    INSERT OR REPLACE INTO astro_snapshots 
    (date, planets_json, panchang_json, nifty_close, sensex_close, gold_close, btc_close, market_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    dateStr,
    JSON.stringify(sky.planets),
    JSON.stringify(panchang),
    parseFloat(estNifty.toFixed(2)),
    parseFloat(estSensex.toFixed(2)),
    parseFloat(estGold.toFixed(2)),
    parseFloat(estBtc.toFixed(2)),
    notes
  );

  return {
    date: dateStr,
    planets: sky.planets,
    panchang,
    market: {
      nifty: estNifty,
      sensex: estSensex,
      gold: estGold,
      btc: estBtc,
      notes
    },
    source: 'Computed On-Demand & Cached Locally'
  };
}

module.exports = {
  TIME_MACHINE_PRESETS,
  HISTORICAL_MARKET_MILESTONES,
  seedKeyTimeMachineSnapshots,
  getSnapshot
};
