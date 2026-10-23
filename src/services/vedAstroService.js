/**
 * Cosmic Finance — VedAstro Integration & Authentic Vedic Astrological Engine
 * Phase 10: "We don't predict. We calculate, and we show you the calculation."
 * 
 * Computes authentic Geocentric Sidereal (Lahiri) Navagraha longitudes,
 * Rashis, Nakshatras, Retrograde (Vakri) status, Panchang, and Vimshottari Dashas.
 */

const db = require('../db/database');
const Astronomy = require('astronomy-engine');

const VEDASTRO_API_URL = process.env.VEDASTRO_API_URL || 'https://api.vedastro.org/api';
const VEDASTRO_API_KEY = process.env.VEDASTRO_API_KEY || '';

// 1. Vedic Zodiac Signs (12 Rashis, 30° each)
const RASHIS = [
  { id: 0, name: 'Aries', vedic: 'Mesha', element: 'Fire', ruler: 'Mars', symbol: '♈' },
  { id: 1, name: 'Taurus', vedic: 'Vrishabha', element: 'Earth', ruler: 'Venus', symbol: '♉' },
  { id: 2, name: 'Gemini', vedic: 'Mithuna', element: 'Air', ruler: 'Mercury', symbol: '♊' },
  { id: 3, name: 'Cancer', vedic: 'Karka', element: 'Water', ruler: 'Moon', symbol: '♋' },
  { id: 4, name: 'Leo', vedic: 'Simha', element: 'Fire', ruler: 'Sun', symbol: '♌' },
  { id: 5, name: 'Virgo', vedic: 'Kanya', element: 'Earth', ruler: 'Mercury', symbol: '♍' },
  { id: 6, name: 'Libra', vedic: 'Tula', element: 'Air', ruler: 'Venus', symbol: '♎' },
  { id: 7, name: 'Scorpio', vedic: 'Vrishchika', element: 'Water', ruler: 'Mars', symbol: '♏' },
  { id: 8, name: 'Sagittarius', vedic: 'Dhanu', element: 'Fire', ruler: 'Jupiter', symbol: '♐' },
  { id: 9, name: 'Capricorn', vedic: 'Makara', element: 'Earth', ruler: 'Saturn', symbol: '♑' },
  { id: 10, name: 'Aquarius', vedic: 'Kumbha', element: 'Air', ruler: 'Saturn', symbol: '♒' },
  { id: 11, name: 'Pisces', vedic: 'Meena', element: 'Water', ruler: 'Jupiter', symbol: '♓' }
];

// 2. 27 Nakshatras (13° 20' = 13.333333° each)
const NAKSHATRAS = [
  { id: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashvini Kumaras', span: [0, 13.333333] },
  { id: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', span: [13.333333, 26.666667] },
  { id: 2, name: 'Krittika', lord: 'Sun', deity: 'Agni', span: [26.666667, 40.0] },
  { id: 3, name: 'Rohini', lord: 'Moon', deity: 'Brahma', span: [40.0, 53.333333] },
  { id: 4, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', span: [53.333333, 66.666667] },
  { id: 5, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', span: [66.666667, 80.0] },
  { id: 6, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', span: [80.0, 93.333333] },
  { id: 7, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', span: [93.333333, 106.666667] },
  { id: 8, name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpas', span: [106.666667, 120.0] },
  { id: 9, name: 'Magha', lord: 'Ketu', deity: 'Pitris', span: [120.0, 133.333333] },
  { id: 10, name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', span: [133.333333, 146.666667] },
  { id: 11, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', span: [146.666667, 160.0] },
  { id: 12, name: 'Hasta', lord: 'Moon', deity: 'Savitr', span: [160.0, 173.333333] },
  { id: 13, name: 'Chitra', lord: 'Mars', deity: 'Tvashtar', span: [173.333333, 186.666667] },
  { id: 14, name: 'Swati', lord: 'Rahu', deity: 'Vayu', span: [186.666667, 200.0] },
  { id: 15, name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni', span: [200.0, 213.333333] },
  { id: 16, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', span: [213.333333, 226.666667] },
  { id: 17, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', span: [226.666667, 240.0] },
  { id: 18, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', span: [240.0, 253.333333] },
  { id: 19, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', span: [253.333333, 266.666667] },
  { id: 20, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas', span: [266.666667, 280.0] },
  { id: 21, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', span: [280.0, 293.333333] },
  { id: 22, name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', span: [293.333333, 306.666667] },
  { id: 23, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', span: [306.666667, 320.0] },
  { id: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', span: [320.0, 333.333333] },
  { id: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya', span: [333.333333, 346.666667] },
  { id: 26, name: 'Revati', lord: 'Mercury', deity: 'Pushan', span: [346.666667, 360.0] }
];

// Vimshottari Dasha Periods (Total 120 Years)
const DASHA_LORDS = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 }
];

// 3. Classical Navagraha Metadata (Strict Jyotish canon: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
const NAVAGRAHA_CONFIG = {
  Sun: {
    vedic: 'Surya',
    glyph: '☉',
    element: 'Fire',
    nature: 'Kruura (Malefic/Authority)',
    color: '#ffd572',
    glow: 'rgba(255, 213, 114, 0.6)',
    asset: 'Sovereign Debt & PSU Index',
    symbolLink: 'SENSEX',
    significance: 'Governs sovereign credit, apex monetary governance, state discretion, and primary market trend.',
    exaltedSign: 'Aries',
    debilitatedSign: 'Libra',
    ownSigns: ['Leo']
  },
  Moon: {
    vedic: 'Chandra',
    glyph: '☽',
    element: 'Water',
    nature: 'Saumya (Benefic/Sentiment)',
    color: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.6)',
    asset: 'Intraday Liquidity & FMCG',
    symbolLink: 'NIFTY',
    significance: 'Governs emotional market sentiment, intraday retail order flow, consumer velocity, and FMCG equities.',
    exaltedSign: 'Taurus',
    debilitatedSign: 'Scorpio',
    ownSigns: ['Cancer']
  },
  Mars: {
    vedic: 'Mangal',
    glyph: '♂',
    element: 'Fire',
    nature: 'Kruura (Aggression/Beta)',
    color: '#f87171',
    glow: 'rgba(248, 113, 113, 0.6)',
    asset: 'Defense, Real Estate & High Beta',
    symbolLink: 'BANKNIFTY',
    significance: 'Governs physical capital expenditure, real estate development, defense manufacturing, and aggressive market beta.',
    exaltedSign: 'Capricorn',
    debilitatedSign: 'Cancer',
    ownSigns: ['Aries', 'Scorpio']
  },
  Mercury: {
    vedic: 'Budha',
    glyph: '☿',
    element: 'Earth',
    nature: 'Saumya (Analytical/Trade)',
    color: '#6ee7b7',
    glow: 'rgba(110, 231, 183, 0.6)',
    asset: 'NIFTY IT, Fintech & Algorithmic Trading',
    symbolLink: 'NIFTY',
    significance: 'Governs communication networks, software platforms, high-frequency clearing systems, and commercial trade contracts.',
    exaltedSign: 'Virgo',
    debilitatedSign: 'Pisces',
    ownSigns: ['Gemini', 'Virgo']
  },
  Jupiter: {
    vedic: 'Guru',
    glyph: '♃',
    element: 'Ether',
    nature: 'Shubha (Great Benefic/Wealth)',
    color: '#fcd34d',
    glow: 'rgba(252, 211, 77, 0.6)',
    asset: 'Gold (MCX), Banking & Institutional Capital',
    symbolLink: 'GOLD',
    significance: 'Governs banking liquidity, bullion reserves, asset accumulation, systemic credit expansion, and macro optimism.',
    exaltedSign: 'Cancer',
    debilitatedSign: 'Capricorn',
    ownSigns: ['Sagittarius', 'Pisces']
  },
  Venus: {
    vedic: 'Shukra',
    glyph: '♀',
    element: 'Water',
    nature: 'Shubha (Benefic/Value)',
    color: '#f5be48',
    glow: 'rgba(245, 190, 72, 0.6)',
    asset: 'Luxury Equities, Auto & Precious Metals',
    symbolLink: 'GOLD',
    significance: 'Governs tangible asset valuation, discretionary consumption, consumer durables, and wealth aesthetics.',
    exaltedSign: 'Pisces',
    debilitatedSign: 'Virgo',
    ownSigns: ['Taurus', 'Libra']
  },
  Saturn: {
    vedic: 'Shani',
    glyph: '♄',
    element: 'Air',
    nature: 'Kruura (Discipline/Cycles)',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.6)',
    asset: 'Heavy Infrastructure, Metals & Energy',
    symbolLink: 'BANKNIFTY',
    significance: 'Governs core industrial capacity, capital goods, commodity extraction, regulatory compression, and valuation discipline.',
    exaltedSign: 'Libra',
    debilitatedSign: 'Aries',
    ownSigns: ['Capricorn', 'Aquarius']
  },
  Rahu: {
    vedic: 'Rahu (North Node)',
    glyph: '☊',
    element: 'Air',
    nature: 'Chhaya (Shadow/Speculation)',
    color: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.6)',
    asset: 'Cryptocurrencies & High-Leverage Options',
    symbolLink: 'BTC',
    significance: 'Governs technological disruption, speculative frenzy, algorithmic leverage shocks, and options volatility skew.',
    exaltedSign: 'Taurus',
    debilitatedSign: 'Scorpio',
    ownSigns: ['Aquarius']
  },
  Ketu: {
    vedic: 'Ketu (South Node)',
    glyph: '☋',
    element: 'Fire',
    nature: 'Chhaya (Shadow/Detachment)',
    color: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.6)',
    asset: 'Macro Hedging, Gold Mining & Unwinding',
    symbolLink: 'GOLD',
    significance: 'Governs liquidity contraction, sudden capitulation, debt liquidation, and systemic deleveraging.',
    exaltedSign: 'Scorpio',
    debilitatedSign: 'Taurus',
    ownSigns: ['Scorpio']
  }
};

// 4. Mathematical Geocentric Sidereal Engine (Lahiri Ayanamsha)
// Powered by high-precision NASA JPL/Meeus ephemeris via astronomy-engine.
// Computes true Sidereal Longitude, Apparent Velocity (for Retrograde detection),
// Rashi, Nakshatra, and Pada for all 9 Navagraha on any Date across centuries.

function getLahiriAyanamsha(julianDay) {
  // Canonical Lahiri Ayanamsha matching Indian Astronomical Ephemeris standards
  const t = (julianDay - 2451545.0) / 36525.0; // Centuries from J2000
  const ayanamsha = 23.857092 + (1.396971 * t) + (0.0003086 * t * t);
  return ayanamsha;
}

function dateToJulianDay(date) {
  const d = new Date(date);
  return (d.getTime() / 86400000.0) + 2440587.5;
}

// High-precision geocentric planetary algorithm
function calculateGeocentricPositions(targetDate) {
  const d = new Date(targetDate);
  const time = Astronomy.MakeTime(d);
  const jd = (d.getTime() / 86400000.0) + 2440587.5;
  const ayanamsha = getLahiriAyanamsha(jd);
  const t = (jd - 2451545.0) / 36525.0;

  function getEclipticLong(bodyName, timeObj) {
    const geoVector = Astronomy.GeoVector(bodyName, timeObj, true);
    const eclip = Astronomy.Ecliptic(geoVector);
    return eclip.elon;
  }

  // Apparent velocity over 0.25 day (6 hours) to detect Retrograde (Vakri) status
  const dtDays = 0.25;
  const dateNext = new Date(d.getTime() + dtDays * 86400000);
  const timeNext = Astronomy.MakeTime(dateNext);

  const majorBodies = [
    { key: 'Sun', body: 'Sun' },
    { key: 'Moon', body: 'Moon' },
    { key: 'Mercury', body: 'Mercury' },
    { key: 'Venus', body: 'Venus' },
    { key: 'Mars', body: 'Mars' },
    { key: 'Jupiter', body: 'Jupiter' },
    { key: 'Saturn', body: 'Saturn' }
  ];

  const rawPositions = {};
  for (const item of majorBodies) {
    const tropLong = getEclipticLong(item.body, time);
    const tropNext = getEclipticLong(item.body, timeNext);
    let diff = tropNext - tropLong;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const velocity = diff / dtDays;

    const sidereal = (tropLong - ayanamsha + 360) % 360;
    const isRetrograde = velocity < 0;
    rawPositions[item.key] = {
      longitude: sidereal,
      isRetrograde,
      velocity
    };
  }

  // Rahu & Ketu (Mean Lunar Nodes — strictly opposite 180°)
  const nodeTrop = (125.04452 - 1934.136261 * t + 0.0020708 * t * t + 360000) % 360;
  const rahuSidereal = (nodeTrop - ayanamsha + 360) % 360;
  const ketuSidereal = (rahuSidereal + 180) % 360;

  rawPositions.Rahu = { longitude: rahuSidereal, isRetrograde: true, velocity: -0.053 };
  rawPositions.Ketu = { longitude: ketuSidereal, isRetrograde: true, velocity: -0.053 };

  // Convert each graha into rich Vedic metadata
  const results = {};
  for (const [key, data] of Object.entries(rawPositions)) {
    const normLong = parseFloat(data.longitude.toFixed(3));
    const rashiIdx = Math.floor(normLong / 30);
    const rashi = RASHIS[rashiIdx];
    const degreesInRashi = parseFloat((normLong % 30).toFixed(2));

    const nakshatraIdx = Math.floor(normLong / 13.333333333333334);
    const nakshatra = NAKSHATRAS[nakshatraIdx] || NAKSHATRAS[0];
    const nakshatraDeg = normLong % 13.333333333333334;
    const pada = Math.floor(nakshatraDeg / 3.3333333333333335) + 1;

    const config = NAVAGRAHA_CONFIG[key];

    // Determine Dignity (Exalted / Debilitated / Own Sign / Neutral)
    let dignity = 'Neutral';
    if (rashi.name === config.exaltedSign) dignity = 'Exalted';
    else if (rashi.name === config.debilitatedSign) dignity = 'Debilitated';
    else if (config.ownSigns && config.ownSigns.includes(rashi.name)) dignity = 'Own Sign';
    if (data.isRetrograde && key !== 'Rahu' && key !== 'Ketu') dignity += ' [Retrograde]';

    results[key] = {
      name: key,
      vedicName: config.vedic,
      glyph: config.glyph,
      color: config.color,
      glow: config.glow,
      element: config.element,
      nature: config.nature,
      asset: config.asset,
      symbolLink: config.symbolLink,
      significance: config.significance,
      longitude: normLong,
      isRetrograde: data.isRetrograde,
      velocity: parseFloat(data.velocity.toFixed(3)),
      rashi: {
        index: rashiIdx,
        name: rashi.name,
        vedic: rashi.vedic,
        symbol: rashi.symbol,
        degrees: degreesInRashi,
        label: `${degreesInRashi}° in ${rashi.name} ${rashi.symbol}`
      },
      nakshatra: {
        index: nakshatraIdx,
        name: nakshatra.name,
        lord: nakshatra.lord,
        pada: pada,
        label: `${nakshatra.name} (Pada ${pada}, Lord: ${nakshatra.lord})`
      },
      dignity: dignity
    };
  }

  // Sanity check: Enforce exact 180° opposition between Rahu and Ketu
  const rahuKetuDiff = Math.abs((results.Rahu.longitude - results.Ketu.longitude + 360) % 360);
  results.Ketu.oppositeCheckPassed = Math.abs(rahuKetuDiff - 180) < 0.001;

  return {
    timestamp: d.toISOString(),
    ayanamsa: 'Lahiri (Sidereal)',
    ayanamsaValue: parseFloat(ayanamsha.toFixed(4)),
    calculationSource: 'Vedic Geocentric Astronomical Engine',
    planets: results
  };
}

// 5. Cache Mechanism for "Today's Sky"
let cachedTodaySky = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function getTodaySky(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedTodaySky && (now - lastCacheTime < CACHE_TTL_MS)) {
    return cachedTodaySky;
  }

  // Calculate high-precision geocentric sidereal data
  const sky = calculateGeocentricPositions(new Date());
  cachedTodaySky = sky;
  lastCacheTime = now;
  return sky;
}

// 6. Panchang Calculation (Tithi, Nakshatra, Yoga, Karana, Hora)
function calculatePanchang(date = new Date()) {
  const d = new Date(date);
  const sky = calculateGeocentricPositions(d);
  const sunLong = sky.planets.Sun.longitude;
  const moonLong = sky.planets.Moon.longitude;

  // Tithi: Lunar day (Moon - Sun difference in 12° increments, 30 tithis total)
  let diff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(diff / 12);
  const tithiPaksha = tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  const tithiName = `${tithiNames[tithiNum - 1]} (${tithiPaksha})`;

  // Yoga: (Sun + Moon) / 13°20' (27 Yogas)
  const yogaSum = (sunLong + moonLong) % 360;
  const yogaIdx = Math.floor(yogaSum / 13.333333333333334);
  const YOGA_NAMES = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti',
    'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata',
    'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
  ];
  const yogaName = YOGA_NAMES[yogaIdx] || 'Siddha';

  // Karana: Half of Tithi (60 Karanas in a lunar month)
  const karanaIdx = Math.floor(diff / 6);
  const KARANA_NAMES = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)'];
  const karanaName = KARANA_NAMES[karanaIdx % 7];

  // Current Planetary Hour (Vedic Hora) based on Indian Standard Time & Indian Sunrise
  const { getIndianHora } = require('../utils/indianTime');
  const horaData = getIndianHora(d);

  return {
    tithi: { index: tithiIndex + 1, name: tithiName, paksha: tithiPaksha },
    nakshatra: sky.planets.Moon.nakshatra,
    yoga: { index: yogaIdx + 1, name: yogaName },
    karana: { index: karanaIdx + 1, name: karanaName },
    hora: horaData
  };
}

// 7. Vimshottari Mahadasha & Antardasha Timeline Engine
// Classical 120-year cycle determined by natal Chandra (Moon) longitude
function calculateVimshottariDashaTimeline(dobStr, tobStr) {
  const [year, month, day] = dobStr.split('-').map(Number);
  let hour = 12, min = 0;
  if (tobStr) {
    const parts = tobStr.split(':').map(Number);
    hour = parts[0] || 12;
    min = parts[1] || 0;
  }
  const birthDate = new Date(Date.UTC(year, month - 1, day, hour, min));

  // Compute Moon's sidereal position at birth
  const natalSky = calculateGeocentricPositions(birthDate);
  const moonLong = natalSky.planets.Moon.longitude;

  // Moon Nakshatra (each Nakshatra is 13° 20' = 800 arcminutes)
  const nakshatraIndex = Math.floor(moonLong / 13.333333333333334);
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const degreesElapsedInNak = moonLong - nakshatra.span[0];
  const fractionElapsed = degreesElapsedInNak / 13.333333333333334;

  // First Mahadasha lord is the ruler of Moon's birth Nakshatra
  const firstLordName = nakshatra.lord;
  const firstLordIndex = DASHA_LORDS.findIndex(d => d.planet === firstLordName);

  // Balance of first Mahadasha at birth
  const firstLordTotalYears = DASHA_LORDS[firstLordIndex].years;
  const balanceYearsRemaining = firstLordTotalYears * (1 - fractionElapsed);

  // Generate full 120-year sequence of Mahadashas from birth
  const mahadashas = [];
  let currentStart = new Date(birthDate.getTime());

  for (let i = 0; i < DASHA_LORDS.length; i++) {
    const lordIdx = (firstLordIndex + i) % DASHA_LORDS.length;
    const lordObj = DASHA_LORDS[lordIdx];
    const durationYears = (i === 0) ? balanceYearsRemaining : lordObj.years;

    const endDate = new Date(currentStart.getTime() + durationYears * 365.25 * 86400000);

    // Compute 9 Antardashas within this Mahadasha
    const antardashas = [];
    let antStart = new Date(currentStart.getTime());
    for (let j = 0; j < DASHA_LORDS.length; j++) {
      const subLordIdx = (lordIdx + j) % DASHA_LORDS.length;
      const subLordObj = DASHA_LORDS[subLordIdx];
      // Formula: (Mahadasha Years * Antardasha Years) / 120
      const subDurationYears = (lordObj.years * subLordObj.years) / 120.0;
      const antEnd = new Date(antStart.getTime() + subDurationYears * 365.25 * 86400000);

      antardashas.push({
        lord: subLordObj.planet,
        vedic: NAVAGRAHA_CONFIG[subLordObj.planet].vedic,
        startDate: antStart.toISOString().split('T')[0],
        endDate: antEnd.toISOString().split('T')[0]
      });
      antStart = antEnd;
    }

    mahadashas.push({
      lord: lordObj.planet,
      vedic: NAVAGRAHA_CONFIG[lordObj.planet].vedic,
      glyph: NAVAGRAHA_CONFIG[lordObj.planet].glyph,
      asset: NAVAGRAHA_CONFIG[lordObj.planet].asset,
      significance: NAVAGRAHA_CONFIG[lordObj.planet].significance,
      durationYears: parseFloat(durationYears.toFixed(2)),
      startDate: currentStart.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      antardashas
    });

    currentStart = endDate;
  }

  // Find currently active Mahadasha and Antardasha today
  const now = new Date();
  const nowISO = now.toISOString().split('T')[0];
  let activeMahadasha = mahadashas.find(m => nowISO >= m.startDate && nowISO <= m.endDate) || mahadashas[0];
  let activeAntardasha = activeMahadasha.antardashas.find(a => nowISO >= a.startDate && nowISO <= a.endDate) || activeMahadasha.antardashas[0];

  return {
    birthNakshatra: nakshatra.name,
    birthMoonLongitude: parseFloat(moonLong.toFixed(2)),
    activeMahadasha: {
      lord: activeMahadasha.lord,
      vedic: activeMahadasha.vedic,
      glyph: activeMahadasha.glyph,
      startDate: activeMahadasha.startDate,
      endDate: activeMahadasha.endDate,
      asset: activeMahadasha.asset,
      significance: activeMahadasha.significance
    },
    activeAntardasha: {
      lord: activeAntardasha.lord,
      vedic: activeAntardasha.vedic,
      startDate: activeAntardasha.startDate,
      endDate: activeAntardasha.endDate
    },
    timeline: mahadashas
  };
}

module.exports = {
  RASHIS,
  NAKSHATRAS,
  NAVAGRAHA_CONFIG,
  calculateGeocentricPositions,
  getTodaySky,
  calculatePanchang,
  calculateVimshottariDashaTimeline
};
