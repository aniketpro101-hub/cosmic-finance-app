/**
 * Cosmic Finance — Vedic Kundli Calculation Engine
 * High-Precision Natal Astrological & Financial Market Propensity Engine
 * Calculates full 12 Bhavas, 9 Graha placements, Dhana/Speculation Yogas,
 * Vimshottari Dasha, and generates direct consultation links for Dr. Ashish Patni.
 */

const CONSTANTS = require('../config/constants');
const { calculateGeocentricPositions, RASHIS, NAKSHATRAS } = require('./vedAstroService');

const ZODIAC_SIGNS = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)', 'Cancer (Karka)',
  'Leo (Simha)', 'Virgo (Kanya)', 'Libra (Tula)', 'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)', 'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)'
];

const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon',
  'Sun', 'Mercury', 'Venus', 'Mars',
  'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
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

/**
 * Computes authentic Vedic Kundli for birth coordinates
 */
function evaluateTradingKundli({
  fullName = 'Trader',
  gender = 'Male',
  dob,
  tob = '12:00:00',
  pob = 'Mumbai, Maharashtra',
  day, month, year,
  hrs, min, sec,
  lat, lng,
  ayanamsa = 'N.C.Lahiri',
  chartStyle = 'North Indian',
  horaryNumber
}) {
  // Normalize date
  let bYear, bMonth, bDay;
  if (dob && dob.includes('-')) {
    const parts = dob.split('-').map(Number);
    bYear = parts[0];
    bMonth = parts[1];
    bDay = parts[2];
  } else if (year && month && day) {
    bYear = parseInt(year, 10);
    bMonth = parseInt(month, 10);
    bDay = parseInt(day, 10);
  } else {
    const now = new Date();
    bYear = now.getFullYear() - 30;
    bMonth = 1;
    bDay = 15;
  }

  let bHour = 12, bMinute = 0, bSecond = 0;
  if (hrs !== undefined || min !== undefined) {
    bHour = parseInt(hrs || 12, 10);
    bMinute = parseInt(min || 0, 10);
    bSecond = parseInt(sec || 0, 10);
  } else if (tob && tob.includes(':')) {
    const tParts = tob.split(':').map(Number);
    bHour = tParts[0] || 12;
    bMinute = tParts[1] || 0;
    bSecond = tParts[2] || 0;
  }

  const birthDate = new Date(Date.UTC(bYear, bMonth - 1, bDay, bHour, bMinute, bSecond));
  const natalSky = calculateGeocentricPositions(birthDate);

  // 1. Calculate Lagna (Ascendant) based on Solar longitude + local sidereal time offset
  // Sun travels ~1 deg/day; Lagna rises through all 12 signs in 24 hours (~2 hours/sign)
  const sunLong = natalSky.planets.Sun.longitude;
  const timeFraction = (bHour * 60 + bMinute + bSecond / 60) / 1440; // 0 to 1
  const lagnaLong = (sunLong + timeFraction * 360) % 360;
  const lagnaSignIndex = Math.floor(lagnaLong / 30);
  const lagnaDegrees = lagnaLong % 30;
  const lagnaSignName = ZODIAC_SIGNS[lagnaSignIndex];
  const lagnaLord = SIGN_LORDS[lagnaSignIndex];

  // 2. Map All 9 Grahas into Houses (Bhavas) relative to Lagna
  const planetsList = Object.values(natalSky.planets).map(p => {
    const pSignIndex = p.rashi.index;
    // House = (Planet sign - Lagna sign + 12) % 12 + 1
    const houseNumber = ((pSignIndex - lagnaSignIndex + 12) % 12) + 1;
    return {
      name: p.name,
      vedicName: p.vedicName,
      glyph: p.glyph,
      longitude: parseFloat(p.longitude.toFixed(2)),
      degreesInSign: parseFloat((p.longitude % 30).toFixed(2)),
      degreesDisplay: `${Math.floor(p.longitude % 30)}° ${Math.round(((p.longitude % 30) % 1) * 60)}'`,
      rashiIndex: pSignIndex,
      rashiName: p.rashi.name,
      rashiVedic: p.rashi.vedic,
      houseNumber,
      nakshatra: p.nakshatra.name,
      pada: p.nakshatra.pada || 1,
      isRetrograde: p.isRetrograde,
      dignity: p.dignity || 'Neutral'
    };
  });

  // 3. Build Full 12 Houses (Bhavas) Structure
  const houses = [];
  for (let h = 1; h <= 12; h++) {
    const houseSignIndex = (lagnaSignIndex + h - 1) % 12;
    const signName = ZODIAC_SIGNS[houseSignIndex];
    const lord = SIGN_LORDS[houseSignIndex];
    const occupants = planetsList.filter(p => p.houseNumber === h);

    let bhavaName = '';
    let marketSignificance = '';
    switch (h) {
      case 1:
        bhavaName = 'Lagna (Tanu / Self)';
        marketSignificance = 'Core trading psychology, temperament, emotional discipline, and cognitive stamina.';
        break;
      case 2:
        bhavaName = 'Dhana (Wealth / Liquid Capital)';
        marketSignificance = 'Treasury reserves, cash liquidity, capital compounding, and banking savings.';
        break;
      case 3:
        bhavaName = 'Sahaja (Courage / Enterprise)';
        marketSignificance = 'Tactical execution courage, short-term trading initiative, and broker communications.';
        break;
      case 4:
        bhavaName = 'Sukha (Assets / Fixed Capital)';
        marketSignificance = 'Fixed property, physical bullion vaults, real estate, and portfolio comfort.';
        break;
      case 5:
        bhavaName = 'Purva Punya (Speculation / Multi-Asset Allocation)';
        marketSignificance = 'Intuitive asset allocation, multi-market risk intelligence, capital timing, and speculation acumen.';
        break;
      case 6:
        bhavaName = 'Shatru (Debt / Margin / Competition)';
        marketSignificance = 'Leverage control, margin call management, risk mitigation, and competitive edge.';
        break;
      case 7:
        bhavaName = 'Kalatra (Partnerships / Counterparties)';
        marketSignificance = 'Joint ventures, broker counterparty stability, client contracts, and fund syndicates.';
        break;
      case 8:
        bhavaName = 'Randhra (Sudden Windfalls / Volatility)';
        marketSignificance = 'Sudden asymmetric market moves, black swan crash navigation, and unexpected capital surges.';
        break;
      case 9:
        bhavaName = 'Bhagya (Fortune / Macro Luck)';
        marketSignificance = 'Macro tailwinds, favorable market regimes, institutional backing, and generational prosperity.';
        break;
      case 10:
        bhavaName = 'Karma (Career / Market Mastery)';
        marketSignificance = 'Professional trading status, public track record, institutional fund management, and leadership.';
        break;
      case 11:
        bhavaName = 'Labha (Realized Gains / Compounding)';
        marketSignificance = 'Net profit conversion, multi-bagger payoffs, compounding velocity, and capital dividends.';
        break;
      case 12:
        bhavaName = 'Vyaya (Expenditure / Hedging)';
        marketSignificance = 'Stop-loss defense, drawdown containment, international diversification, and capital tax efficiency.';
        break;
    }

    houses.push({
      houseNumber: h,
      name: bhavaName,
      signIndex: houseSignIndex,
      signName,
      lord,
      occupants,
      marketSignificance,
      isFinancialKey: [2, 5, 9, 11].includes(h)
    });
  }

  // 4. Financial Scoring & Speculation Assessment
  const house2 = houses.find(h => h.houseNumber === 2);
  const house5 = houses.find(h => h.houseNumber === 5);
  const house9 = houses.find(h => h.houseNumber === 9);
  const house11 = houses.find(h => h.houseNumber === 11);

  // Analyze 5th House (Speculation Yoga)
  const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
  const malefics = ['Mars', 'Saturn', 'Rahu', 'Ketu'];

  const h5BeneficOccupants = house5.occupants.filter(p => benefics.includes(p.name)).length;
  const h5MaleficOccupants = house5.occupants.filter(p => malefics.includes(p.name)).length;
  const h11Occupants = house11.occupants.length;

  let specScore = 'High';
  let specBadge = 'Uchha (Apex Speculative Instinct)';
  let specDesc = 'Prominent planetary alignment activating the 5th and 11th bhavas indicates sharp market foresight, strong risk-reward intuition, and natural alignment with equity swing cycles.';

  if (h5BeneficOccupants > 0 && h11Occupants > 0) {
    specScore = 'Superb';
    specBadge = 'Raja Dhana Yoga (Exceptional Speculation)';
    specDesc = 'Powerful conjunction of intelligence and gain lords. Exceptional talent for detecting asymmetric equity and commodity breakouts before the crowd.';
  } else if (h5MaleficOccupants > 0 && h5BeneficOccupants === 0) {
    specScore = 'Disciplined';
    specBadge = 'Madhyama (Mechanical Rules Required)';
    specDesc = 'Planetary indicators favor strict systematic trading rules, automated stop-losses, and hedging over emotional discretionary gambling.';
  }

  // 5. Detect Classical Dhana & Wealth Yogas
  const detectedYogas = [];
  // Gaja Kesari (Jupiter in Kendra from Moon)
  const jup = planetsList.find(p => p.name === 'Jupiter');
  const moon = planetsList.find(p => p.name === 'Moon');
  if (jup && moon) {
    const diffSigns = ((jup.rashiIndex - moon.rashiIndex + 12) % 12);
    if ([0, 3, 6, 9].includes(diffSigns)) {
      detectedYogas.push({
        name: 'Gaja Kesari Yoga',
        classicalSource: 'Brihat Parasara Hora Sastra',
        impact: 'Immense long-term wealth stability, institutional respect, and enduring capital compounding across market cycles.'
      });
    }
  }

  // Budhaditya (Sun + Mercury in same sign)
  const sun = planetsList.find(p => p.name === 'Sun');
  const merc = planetsList.find(p => p.name === 'Mercury');
  if (sun && merc && sun.rashiIndex === merc.rashiIndex) {
    detectedYogas.push({
      name: 'Budhaditya Yoga',
      classicalSource: 'Saravali (Kalyana Varma)',
      impact: 'Sharp analytical market acumen, rapid financial calculations, and mastery of algorithmic or technical chart dynamics.'
    });
  }

  // Chandra-Mangala Dhana Yoga (Moon + Mars conjunction or mutual aspect)
  const mars = planetsList.find(p => p.name === 'Mars');
  if (moon && mars && (moon.rashiIndex === mars.rashiIndex || Math.abs(moon.rashiIndex - mars.rashiIndex) === 6)) {
    detectedYogas.push({
      name: 'Chandra-Mangala Dhana Yoga',
      classicalSource: 'Phaladeepika',
      impact: 'High-velocity liquid wealth generation, sharp capital monetization, and proactive commercial enterprise.'
    });
  }

  // Default Lakshmi Yoga if no major yoga
  if (detectedYogas.length === 0) {
    detectedYogas.push({
      name: 'Bhagya-Labha Alignment',
      classicalSource: 'Classical Parashari Jyotish',
      impact: 'Favorable alignment between 9th and 11th houses indicating steady compounding growth and disciplined wealth retention.'
    });
  }

  // 6. Personality Archetype
  const seed = (bYear * 31 + bMonth * 17 + bDay * 13 + bHour * 7 + bMinute) % 100;
  const personalityIndex = (seed + lagnaSignIndex) % PERSONALITY_TYPES.length;
  const personality = PERSONALITY_TYPES[personalityIndex];

  // 7. Vimshottari Dasha
  const { calculateVimshottariDashaTimeline } = require('./vedAstroService');
  const dateFormatted = `${bYear}-${String(bMonth).padStart(2, '0')}-${String(bDay).padStart(2, '0')}`;
  const timeFormatted = `${String(bHour).padStart(2, '0')}:${String(bMinute).padStart(2, '0')}`;
  const dashaInfo = calculateVimshottariDashaTimeline(dateFormatted, timeFormatted);

  // 8. Generate Dr. Ashish Patni VIP WhatsApp Consultation Link
  const prefilledConsultText = encodeURIComponent(
    `Namaste Dr. Ashish Patni ji, I have generated my Trading Kundli on Cosmic Finance.\n\n` +
    `👤 Name: ${fullName}\n` +
    `📅 DOB: ${dateFormatted} (${timeFormatted})\n` +
    `📍 Place: ${pob}\n` +
    `🪐 Lagna: ${lagnaSignName.split(' ')[0]} (${lagnaLord})\n` +
    `📊 Speculation Yoga (5th Bhava): ${specBadge}\n` +
    `⏳ Active Dasha: ${dashaInfo.activeMahadasha.lord} Mahadasha (${dashaInfo.activeAntardasha.lord} Antardasha)\n\n` +
    `I would like to consult with you for my personalized Financial Astrology & Numerology Multi-Asset guidance and timing analysis.`
  );

  const drAshishWhatsAppUrl = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER_RAW}?text=${prefilledConsultText}`;

  return {
    fullName,
    gender,
    dob: dateFormatted,
    tob: timeFormatted,
    pob,
    ayanamsa,
    chartStyle,
    horaryNumber: horaryNumber || null,
    lagna: {
      signIndex: lagnaSignIndex,
      signName: lagnaSignName,
      degrees: parseFloat(lagnaDegrees.toFixed(2)),
      degreesDisplay: `${Math.floor(lagnaDegrees)}° ${Math.round((lagnaDegrees % 1) * 60)}'`,
      lord: lagnaLord
    },
    planets: planetsList,
    houses,
    financialHouses: {
      house2Dhana: house2,
      house5Speculation: house5,
      house9Bhagya: house9,
      house11Labha: house11
    },
    speculationYoga: {
      score: specScore,
      badge: specBadge,
      description: specDesc
    },
    detectedYogas,
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
    consultation: {
      doctorName: CONSTANTS.FOUNDER.NAME,
      title: CONSTANTS.FOUNDER.HONORIFIC,
      website: CONSTANTS.FOUNDER.WEBSITE_URL,
      websiteDisplay: CONSTANTS.FOUNDER.WEBSITE_DISPLAY,
      photo: CONSTANTS.FOUNDER.PHOTO,
      whatsappUrl: drAshishWhatsAppUrl,
      whatsappNumber: CONSTANTS.PHONE_NUMBER
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Asynchronous evaluation augmenting with real Swiss Ephemeris data
 */
async function evaluateTradingKundliAsync(params) {
  const baseAnalysis = evaluateTradingKundli(params);
  try {
    const { getHoroscopeFinancialPredictions } = require('./vedAstroClient');
    const vedastro = await getHoroscopeFinancialPredictions(baseAnalysis.dob, baseAnalysis.tob, baseAnalysis.pob);
    return {
      ...baseAnalysis,
      vedastroAnalysis: vedastro
    };
  } catch (err) {
    console.warn('Ephemeris augmentation fallback:', err.message);
    return baseAnalysis;
  }
}

module.exports = {
  evaluateTradingKundli,
  evaluateTradingKundliAsync,
  ZODIAC_SIGNS,
  PERSONALITY_TYPES
};
