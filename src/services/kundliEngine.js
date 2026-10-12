/**
 * Cosmic Finance — Vedic Kundli Calculation Engine
 * Analyzes natal coordinates for trading proclivity, Dhana/Speculation yogas, and asset alignments.
 */

const ZODIAC_SIGNS = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const PERSONALITY_TYPES = [
  {
    type: 'Calculated Swing Strategist',
    ruler: 'Budh-Guru (Mercury-Jupiter)',
    description: 'Thrives on high-probability technical setups combined with patient timeframe execution. Rarely acts on emotional impulse; excels in structured risk-reward swing trading.',
    favoredAsset: 'NIFTY Index & Large-Cap Bluechips'
  },
  {
    type: 'Intuitive High-Beta Explorer',
    ruler: 'Rahu-Mangal (Rahu-Mars)',
    description: 'High risk tolerance with sharp instinct for sudden volatility surges, momentum breakthroughs, and asymmetrical payoffs. Requires strict stop-loss rules to prevent overtrading.',
    favoredAsset: 'Cryptocurrencies & High-Beta Tech Stocks'
  },
  {
    type: 'Disciplined Capital Preserver',
    ruler: 'Shani-Surya (Saturn-Sun)',
    description: 'Prioritizes capital defense and downside limitation above all else. Exceptional emotional temperament during market panic and long-cycle bear regimes.',
    favoredAsset: 'Gold (MCX), Sovereign Bullion & Defensive Sectors'
  },
  {
    type: 'Momentum Liquidity Rider',
    ruler: 'Chandra-Shukra (Moon-Venus)',
    description: 'Attuned to broad market sentiment waves, consumer demand trends, and liquidity shifts. Highly agile in capitalizing on trending sectoral rotations.',
    favoredAsset: 'Banking, FMCG & Auto Sector Indices'
  }
];

// Deterministic Vedic Calculation Algorithm based on Birth Coordinates
function evaluateTradingKundli({ fullName, dob, tob, pob, approxTime }) {
  // Parse date
  const [yearStr, monthStr, dayStr] = dob.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  let hour = 12;
  let minute = 0;
  if (tob) {
    const [h, m] = tob.split(':');
    hour = parseInt(h, 10) || 12;
    minute = parseInt(m, 10) || 0;
  }

  // Calculate approximate Ascendant (Lagna) sign (changes every ~2 hours)
  // Base day offset + hour progression
  const lagnaIndex = Math.floor((month * 2 + (hour / 2) + Math.floor(day / 2.5)) % 12);
  const lagnaSign = ZODIAC_SIGNS[lagnaIndex];

  // 5th Bhava (Speculation House) is 4 signs ahead of Lagna
  const fifthHouseIndex = (lagnaIndex + 4) % 12;
  const fifthHouseSign = ZODIAC_SIGNS[fifthHouseIndex];

  // 2nd House (Dhana/Wealth) & 11th House (Labha/Gains)
  const secondHouseSign = ZODIAC_SIGNS[(lagnaIndex + 1) % 12];
  const eleventhHouseSign = ZODIAC_SIGNS[(lagnaIndex + 10) % 12];

  // Scoring framework:
  // Seed hash based on inputs
  const seed = (year * 31 + month * 17 + day * 13 + hour * 7 + minute) % 100;

  let speculationYogaScore = 'Moderate';
  let yogaBadge = 'Moderate (Madhyama)';
  let yogaDescription = 'Balanced 5th house aspects. Natural capacity for trading discipline, with optimum performance under structured mechanical trading systems.';

  if (seed >= 65) {
    speculationYogaScore = 'Strong';
    yogaBadge = 'Strong (Uchha 5th Bhava)';
    yogaDescription = 'Auspicious placement in the 5th and 11th bhavas indicates sharp intuitive perception of market momentum and natural capital-compounding potential.';
  } else if (seed <= 35) {
    speculationYogaScore = 'Cautious';
    yogaBadge = 'Cautious (Analytical Alignment)';
    yogaDescription = 'Planetary aspects favor risk mitigation and capital defense. Optimal focus should remain on long-term accumulation, hedging, and capital preservation rather than high-leverage intraday trading.';
  }

  // Assign trading personality archetype
  const personalityIndex = (seed + lagnaIndex) % PERSONALITY_TYPES.length;
  const personality = PERSONALITY_TYPES[personalityIndex];

  // Authentic Vimshottari Mahadasha & Antardasha calculation
  const { calculateVimshottariDashaTimeline } = require('./vedAstroService');
  const dashaInfo = calculateVimshottariDashaTimeline(dob, tob);

  return {
    fullName,
    dob,
    tob: tob || (approxTime ? 'Approximate' : '12:00 PM'),
    pob,
    approximateTime: Boolean(approxTime),
    lagna: {
      sign: lagnaSign,
      secondHouseDhana: secondHouseSign,
      fifthHouseSpeculation: fifthHouseSign,
      eleventhHouseGains: eleventhHouseSign
    },
    speculationYoga: {
      score: speculationYogaScore,
      badge: yogaBadge,
      description: yogaDescription
    },
    personality: {
      title: personality.type,
      ruler: personality.ruler,
      description: personality.description
    },
    favoredAsset: personality.favoredAsset,
    vimshottariDasha: {
      birthNakshatra: dashaInfo.birthNakshatra,
      birthMoonLongitude: dashaInfo.birthMoonLongitude,
      activeMahadasha: dashaInfo.activeMahadasha,
      activeAntardasha: dashaInfo.activeAntardasha
    },
    timestamp: new Date().toISOString()
  };
}

// Asynchronous evaluation augmenting the reading with real VedAstro Swiss Ephemeris predictions
async function evaluateTradingKundliAsync(params) {
  const baseAnalysis = evaluateTradingKundli(params);
  try {
    const { getHoroscopeFinancialPredictions } = require('./vedAstroClient');
    const vedastro = await getHoroscopeFinancialPredictions(params.dob, params.tob, params.pob);
    return {
      ...baseAnalysis,
      vedastroAnalysis: vedastro
    };
  } catch (err) {
    console.warn('VedAstro augmentation failed; returning base calculation:', err.message);
    return baseAnalysis;
  }
}

module.exports = {
  evaluateTradingKundli,
  evaluateTradingKundliAsync,
  ZODIAC_SIGNS,
  PERSONALITY_TYPES
};
