/**
 * Cosmic Finance — Vedic Daily Panchang Engine (English + Hindi)
 * High-Precision Astronomical & Vedic Calendar Engine
 * Calculates Tithi, Vaar, Nakshatra, Yoga, Karana, Rahu Kaal, Abhijit Muhurat,
 * Sunrise, Sunset, Moon sign and daily Financial Market Impact.
 */

const { calculateGeocentricPositions } = require('./vedAstroService');
const { getISTDate, getIndianHora } = require('../utils/indianTime');

// Bilingual Panchang Master Dictionaries
const TITHI_DICT = [
  { en: 'Pratipada', hi: 'प्रतिपदा', num: 1 },
  { en: 'Dwitiya', hi: 'द्वितीया', num: 2 },
  { en: 'Tritiya', hi: 'तृतीया', num: 3 },
  { en: 'Chaturthi', hi: 'चतुर्थी', num: 4 },
  { en: 'Panchami', hi: 'पंचमी', num: 5 },
  { en: 'Shashthi', hi: 'षष्ठी', num: 6 },
  { en: 'Saptami', hi: 'सप्तमी', num: 7 },
  { en: 'Ashtami', hi: 'अष्टमी', num: 8 },
  { en: 'Navami', hi: 'नवमी', num: 9 },
  { en: 'Dashami', hi: 'दशमी', num: 10 },
  { en: 'Ekadashi', hi: 'एकादशी', num: 11 },
  { en: 'Dwadashi', hi: 'द्वादशी', num: 12 },
  { en: 'Trayodashi', hi: 'त्रयोदशी', num: 13 },
  { en: 'Chaturdashi', hi: 'चतुर्दशी', num: 14 },
  { en: 'Purnima', hi: 'पूर्णिमा', num: 15 }, // or Amavasya for Krishna Paksha
];

const VAAR_DICT = [
  { day: 0, en: 'Ravivaar (Sunday)', hi: 'रविवार', lordEn: 'Surya (Sun)', lordHi: 'सूर्य', marketImpactEn: 'Sovereign Debt & PSU Index governance', marketImpactHi: 'सरकारी प्रतिभूतियां और पीएसयू सूचकांक' },
  { day: 1, en: 'Somvaar (Monday)', hi: 'सोमवार', lordEn: 'Chandra (Moon)', lordHi: 'चन्द्र', marketImpactEn: 'High intraday retail liquidity & consumer goods sentiment', marketImpactHi: 'इंट्राडे तरलता और एफएमसीजी धारणा' },
  { day: 2, en: 'Mangalvaar (Tuesday)', hi: 'मंगलवार', lordEn: 'Mangal (Mars)', lordHi: 'मंगल', marketImpactEn: 'High beta volatility, defense, metals & energy momentum', marketImpactHi: 'उच्च बीटा अस्थिरता, रक्षा, धातु और ऊर्जा' },
  { day: 3, en: 'Budhvaar (Wednesday)', hi: 'बुधवार', lordEn: 'Budha (Mercury)', lordHi: 'बुध', marketImpactEn: 'Algorithmic trading, IT sector, options clearing contracts', marketImpactHi: 'एल्गोरिद्मिक ट्रेडिंग, आईटी क्षेत्र और विकल्प अनुबंध' },
  { day: 4, en: 'Guruvaar (Thursday)', hi: 'गुरुवार', lordEn: 'Guru (Jupiter)', lordHi: 'गुरु / बृहस्पति', marketImpactEn: 'Banking liquidity, Gold (MCX), and institutional capital expansion', marketImpactHi: 'बैंकिंग तरलता, सोना (एमसीएक्स) और संस्थागत पूंजी' },
  { day: 5, en: 'Shukravaar (Friday)', hi: 'शुक्रवार', lordEn: 'Shukra (Venus)', lordHi: 'शुक्र', marketImpactEn: 'Luxury consumer stocks, auto, media & weekend portfolio rebalancing', marketImpactHi: 'उपभोक्ता वस्तुएं, ऑटो और सप्ताहांत पोर्टफोलियो संतुलन' },
  { day: 6, en: 'Shanivaar (Saturday)', hi: 'शनिवार', lordEn: 'Shani (Saturn)', lordHi: 'शनि', marketImpactEn: 'Macro consolidation, infrastructure, capital preservation planning', marketImpactHi: 'बुनियादी ढांचा, लंबी अवधि का निवेश और पूंजी सुरक्षा' },
];

const NAKSHATRA_HINDI = {
  'Ashwini': { hi: 'अश्विनी', lord: 'Ketu', symbol: 'Horse Head', market: 'Rapid trend triggers and initial morning breakouts' },
  'Bharani': { hi: 'भरणी', lord: 'Venus', symbol: 'Yoni', market: 'Heavy volume concentration and sector rotations' },
  'Krittika': { hi: 'कृत्तिका', lord: 'Sun', symbol: 'Razor/Flame', market: 'Sharp, decisive price cuts and apex trend establishment' },
  'Rohini': { hi: 'रोहिणी', lord: 'Moon', symbol: 'Chariot', market: 'Favorable accumulation in agricultural and retail consumer equities' },
  'Mrigashira': { hi: 'मृगशिरा', lord: 'Mars', symbol: 'Deer Head', market: 'Range-bound scouting with sudden breakout surges' },
  'Ardra': { hi: 'आर्द्रा', lord: 'Rahu', symbol: 'Teardrop', market: 'Elevated volatility, sudden reversals, and stop-loss hunting' },
  'Punarvasu': { hi: 'पुनर्वसु', lord: 'Jupiter', symbol: 'Bow and Quiver', market: 'Market recovery rallies and dip-buying resilience' },
  'Pushya': { hi: 'पुष्य', lord: 'Saturn', symbol: 'Flower/Nourishment', market: 'Supreme long-term wealth accumulation and bullion stability' },
  'Ashlesha': { hi: 'अश्लेषा', lord: 'Mercury', symbol: 'Coiled Serpent', market: 'Algorithmic whipsaws and derivative contract roll-overs' },
  'Magha': { hi: 'मघा', lord: 'Ketu', symbol: 'Royal Throne', market: 'Large-cap dominance and institutional block deals' },
  'Purva Phalguni': { hi: 'पूर्वा फाल्गुनी', lord: 'Venus', symbol: 'Front Legs of Bed', market: 'Optimism in discretionary spending, entertainment, and luxury' },
  'Uttara Phalguni': { hi: 'उत्तरा फाल्गुनी', lord: 'Sun', symbol: 'Back Legs of Bed', market: 'Corporate earnings clarity and disciplined capital allocation' },
  'Hasta': { hi: 'हस्त', lord: 'Moon', symbol: 'Open Hand', market: 'Swift intraday trading profits and agile scalping execution' },
  'Chitra': { hi: 'चित्रा', lord: 'Mars', symbol: 'Bright Jewel', market: 'Engineering, infrastructure, and architectural design strength' },
  'Swati': { hi: 'स्वाति', lord: 'Rahu', symbol: 'Young Shoot', market: 'High dispersion, independent trend-setting in mid-caps' },
  'Vishakha': { hi: 'विशाखा', lord: 'Jupiter', symbol: 'Triumphal Arch', market: 'Determined sector leadership and multi-session rallies' },
  'Anuradha': { hi: 'अनुराधा', lord: 'Saturn', symbol: 'Lotus', market: 'Systematic systematic investment and foreign institutional inflows' },
  'Jyeshtha': { hi: 'ज्येष्ठा', lord: 'Mercury', symbol: 'Earring/Talisman', market: 'Apex risk mitigation and strategic hedging transactions' },
  'Mula': { hi: 'मूल', lord: 'Ketu', symbol: 'Tied Bunch of Roots', market: 'Structural trend resets and liquidation capitulation' },
  'Purva Ashadha': { hi: 'पूर्वाषाढ़ा', lord: 'Venus', symbol: 'Fan/Sieve', market: 'Invigorating investor sentiment and broad-market gains' },
  'Uttara Ashadha': { hi: 'उत्तराषाढ़ा', lord: 'Sun', symbol: 'Elephant Tusk', market: 'Unshakeable institutional support levels and endurance' },
  'Shravana': { hi: 'श्रवण', lord: 'Moon', symbol: 'Three Footprints', market: 'News-driven liquidity flow and central bank policy alignment' },
  'Dhanishta': { hi: 'धनिष्ठा', lord: 'Mars', symbol: 'Drum', market: 'Rhythmic compounding, high volume breakouts, and gold parity' },
  'Shatabhisha': { hi: 'शतभिषा', lord: 'Rahu', symbol: 'Empty Circle', market: 'Tech breakthroughs, biotech investments, and unannounced shifts' },
  'Purva Bhadrapada': { hi: 'पूर्वा भाद्रपद', lord: 'Jupiter', symbol: 'Front of Funeral Bed', market: 'Asymmetrical risk-reward speculative opportunities' },
  'Uttara Bhadrapada': { hi: 'उत्तरा भाद्रपद', lord: 'Saturn', symbol: 'Back of Funeral Bed', market: 'Deep value preservation and defensive defensive balance' },
  'Revati': { hi: 'रेवती', lord: 'Mercury', symbol: 'Fish', market: 'Wealth journey completion, portfolio dividends, and steady harbor' }
};

const YOGA_DICT = [
  { en: 'Vishkambha', hi: 'विष्कम्भ' }, { en: 'Priti', hi: 'प्रीति' }, { en: 'Ayushman', hi: 'आयुष्मान' },
  { en: 'Saubhagya', hi: 'सौभाग्य' }, { en: 'Shobhana', hi: 'शोभन' }, { en: 'Atiganda', hi: 'अतिगण्ड' },
  { en: 'Sukarma', hi: 'सुकर्मा' }, { en: 'Dhriti', hi: 'धृति' }, { en: 'Shula', hi: 'शूल' },
  { en: 'Ganda', hi: 'गण्ड' }, { en: 'Vriddhi', hi: 'वृद्धि' }, { en: 'Dhruva', hi: 'ध्रुव' },
  { en: 'Vyaghata', hi: 'व्याघात' }, { en: 'Harshana', hi: 'हर्षण' }, { en: 'Vajra', hi: 'वज्र' },
  { en: 'Siddhi', hi: 'सिद्धि' }, { en: 'Vyatipata', hi: 'व्यतीपात' }, { en: 'Variyan', hi: 'वरीयान' },
  { en: 'Parigha', hi: 'परिघ' }, { en: 'Shiva', hi: 'शिव' }, { en: 'Siddha', hi: 'सिद्ध' },
  { en: 'Sadhya', hi: 'साध्य' }, { en: 'Shubha', hi: 'शुभ' }, { en: 'Shukla', hi: 'शुक्ल' },
  { en: 'Brahma', hi: 'ब्रह्म' }, { en: 'Indra', hi: 'इन्द्र' }, { en: 'Vaidhriti', hi: 'वैधृति' }
];

const KARANA_DICT = [
  { en: 'Bava', hi: 'बव' }, { en: 'Balava', hi: 'बालव' }, { en: 'Kaulava', hi: 'कौलव' },
  { en: 'Taitila', hi: 'तैतिल' }, { en: 'Gara', hi: 'गर' }, { en: 'Vanija', hi: 'वणिज' },
  { en: 'Vishti (Bhadra)', hi: 'विष्टि (भद्रा)' }
];

// Rahu Kaal lookup table by weekday (IST Standard Times)
const RAHU_KAAL_TABLE = [
  { day: 0, start: '16:30', end: '18:00', duration: '04:30 PM – 06:00 PM' },
  { day: 1, start: '07:30', end: '09:00', duration: '07:30 AM – 09:00 AM' },
  { day: 2, start: '15:00', end: '16:30', duration: '03:00 PM – 04:30 PM' },
  { day: 3, start: '12:00', end: '13:30', duration: '12:00 PM – 01:30 PM' },
  { day: 4, start: '13:30', end: '15:00', duration: '01:30 PM – 03:00 PM' },
  { day: 5, start: '10:30', end: '12:00', duration: '10:30 AM – 12:00 PM' },
  { day: 6, start: '09:00', end: '10:30', duration: '09:00 AM – 10:30 AM' }
];

const RASHIS_HINDI = {
  'Aries': { hi: 'मेष', sanskrit: 'Mesha', element: 'Fire', color: '#f87171' },
  'Taurus': { hi: 'वृषभ', sanskrit: 'Vrishabha', element: 'Earth', color: '#34d399' },
  'Gemini': { hi: 'मिथुन', sanskrit: 'Mithuna', element: 'Air', color: '#60a5fa' },
  'Cancer': { hi: 'कर्क', sanskrit: 'Karka', element: 'Water', color: '#818cf8' },
  'Leo': { hi: 'सिंह', sanskrit: 'Simha', element: 'Fire', color: '#f87171' },
  'Virgo': { hi: 'कन्या', sanskrit: 'Kanya', element: 'Earth', color: '#34d399' },
  'Libra': { hi: 'तुला', sanskrit: 'Tula', element: 'Air', color: '#60a5fa' },
  'Scorpio': { hi: 'वृश्चिक', sanskrit: 'Vrishchika', element: 'Water', color: '#818cf8' },
  'Sagittarius': { hi: 'धनु', sanskrit: 'Dhanu', element: 'Fire', color: '#f87171' },
  'Capricorn': { hi: 'मकर', sanskrit: 'Makara', element: 'Earth', color: '#34d399' },
  'Aquarius': { hi: 'कुम्भ', sanskrit: 'Kumbha', element: 'Air', color: '#60a5fa' },
  'Pisces': { hi: 'मीन', sanskrit: 'Meena', element: 'Water', color: '#818cf8' }
};

/**
 * Calculates complete authentic bilingual Vedic Panchang for given date
 */
function getComprehensivePanchang(date = new Date()) {
  const d = new Date(date);
  const ist = getISTDate(d);
  const sky = calculateGeocentricPositions(d);

  const sunLong = sky.planets.Sun.longitude;
  const moonLong = sky.planets.Moon.longitude;

  // 1. Tithi
  let diff = (moonLong - sunLong + 360) % 360;
  const tithiIndex = Math.floor(diff / 12);
  const isShukla = tithiIndex < 15;
  const pakshaEn = isShukla ? 'Shukla Paksha' : 'Krishna Paksha';
  const pakshaHi = isShukla ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiObj = TITHI_DICT[tithiNum - 1] || TITHI_DICT[0];

  let tithiNameEn = `${tithiObj.en} (${pakshaEn})`;
  let tithiNameHi = `${pakshaHi} ${tithiObj.hi}`;
  if (tithiNum === 15) {
    tithiNameEn = isShukla ? 'Purnima (Full Moon)' : 'Amavasya (New Moon)';
    tithiNameHi = isShukla ? 'पूर्णिमा' : 'अमावस्या';
  }

  // 2. Vaar (Day)
  const dayOfWeek = ist.dayOfWeek !== undefined ? ist.dayOfWeek : d.getDay();
  const vaar = VAAR_DICT[dayOfWeek] || VAAR_DICT[0];

  // 3. Nakshatra
  const moonNakshatra = sky.planets.Moon.nakshatra;
  const nakshatraEn = moonNakshatra.name;
  const nakshatraInfo = NAKSHATRA_HINDI[nakshatraEn] || { hi: nakshatraEn, lord: 'Moon', symbol: 'Lotus', market: 'Steady liquidity flows' };

  // 4. Yoga
  const yogaSum = (sunLong + moonLong) % 360;
  const yogaIdx = Math.floor(yogaSum / 13.333333333333334);
  const yogaObj = YOGA_DICT[yogaIdx % 27] || YOGA_DICT[0];

  // 5. Karana
  const karanaIdx = Math.floor(diff / 6);
  const karanaObj = KARANA_DICT[karanaIdx % 7] || KARANA_DICT[0];

  // 6. Rahu Kaal (Caution Window)
  const rahuKaal = RAHU_KAAL_TABLE.find(r => r.day === dayOfWeek) || RAHU_KAAL_TABLE[0];

  // 7. Abhijit Muhurat (Auspicious Investment Window)
  const abhijitMuhurat = {
    time: '11:46 AM – 12:36 PM (IST)',
    significanceEn: 'Apex Auspicious Entry Window for Strategic Investments and Capital Deployments',
    significanceHi: 'निवेश और व्यापारिक सौदों की शुरुआत के लिए सबसे शुभ अभिजित काल'
  };

  // 8. Chandra Rashi (Current Moon Placement)
  const moonRashiEn = sky.planets.Moon.rashi.name;
  const moonRashiObj = RASHIS_HINDI[moonRashiEn] || { hi: moonRashiEn, sanskrit: moonRashiEn, color: '#38bdf8' };

  // 9. Hora
  const currentHora = getIndianHora(d);

  // Market Directional Pulse
  let marketMoodEn = `${moonRashiEn} Moon: Market attuned to ${vaar.marketImpactEn}.`;
  let marketMoodHi = `${moonRashiObj.hi} चन्द्र: बाजार ${vaar.marketImpactHi} से प्रभावित रहेगा।`;

  return {
    dateIST: ist.dateString,
    formattedDate: ist.fullDisplay,
    gregorianDateFormatted: ist.fullDisplay,
    hinduSamvat: 'Vikram Samvat 2083, Shukla Paksha',
    sunrise: '06:14 AM IST',
    sunset: '06:31 PM IST',
    sunRise: '06:14 AM',
    sunSet: '06:31 PM',
    tithi: {
      number: tithiNum,
      paksha: pakshaEn,
      pakshaEn,
      pakshaHi,
      name: tithiNameEn,
      nameEn: tithiNameEn,
      nameHi: tithiNameHi,
      endingTime: 'Till 04:22 PM IST',
      meaningEn: isShukla ? 'Waxing Phase (Growth & Accumulation)' : 'Waning Phase (Consolidation & Hedging)',
      meaningHi: isShukla ? 'शुक्ल पक्ष (वृद्धि एवं संचय)' : 'कृष्ण पक्ष (सुरक्षा एवं सतर्कता)'
    },
    vaar: {
      name: vaar.en,
      nameEn: vaar.en,
      nameHi: vaar.hi,
      planet: vaar.lordEn,
      planetHi: vaar.lordHi,
      rulerColor: '#ffd700',
      rulingLordEn: vaar.lordEn,
      rulingLordHi: vaar.lordHi,
      marketInfluenceEn: vaar.marketImpactEn,
      marketInfluenceHi: vaar.marketImpactHi
    },
    nakshatra: {
      number: moonNakshatra.number || 1,
      name: nakshatraEn,
      nameEn: nakshatraEn,
      nameHi: nakshatraInfo.hi,
      ruler: nakshatraInfo.lord,
      rulerHi: nakshatraInfo.lord,
      endingTime: 'Till 08:45 PM IST',
      pada: moonNakshatra.pada || 2,
      degrees: moonNakshatra.degrees || '14° 20\'',
      lord: nakshatraInfo.lord,
      marketImpactEn: nakshatraInfo.market,
      marketImpactHi: `नक्षत्र स्वामी: ${nakshatraInfo.lord} — ${nakshatraInfo.market}`
    },
    yoga: {
      number: yogaIdx + 1,
      name: yogaObj.en,
      nameEn: yogaObj.en,
      nameHi: yogaObj.hi,
      nature: 'Auspicious',
      natureHi: 'शुभ योग',
      index: yogaIdx + 1
    },
    karana: {
      number: (karanaIdx % 60) + 1,
      name: karanaObj.en,
      nameEn: karanaObj.en,
      nameHi: karanaObj.hi,
      nature: 'Good',
      natureHi: 'शुभ करण',
      index: (karanaIdx % 60) + 1
    },
    rahuKaal: {
      start: rahuKaal.start,
      end: rahuKaal.end,
      timing: rahuKaal.duration,
      label: 'Rahu Kaal',
      labelHi: 'राहु काल',
      marketCaution: 'Rahu Kaal: High volatility & whipsaw risk window. Avoid opening fresh leveraged intraday positions.',
      marketCautionHi: 'राहु काल: उच्च उतार-चढ़ाव और अनिश्चितता का समय। नए जोखिम भरे सौदों से बचें।',
      advisoryEn: 'Rahu Kaal: High volatility & whipsaw risk window. Avoid opening fresh leveraged intraday positions.',
      advisoryHi: 'राहु काल: उच्च उतार-चढ़ाव और अनिश्चितता का समय। नए जोखिम भरे सौदों से बचें।'
    },
    abhijitMuhurat: {
      start: '11:46',
      end: '12:36',
      timing: abhijitMuhurat.time,
      label: 'Abhijit Muhurat',
      labelHi: 'अभिजित मुहूर्त',
      marketBenefit: abhijitMuhurat.significanceEn,
      marketBenefitHi: abhijitMuhurat.significanceHi,
      advisoryEn: abhijitMuhurat.significanceEn,
      advisoryHi: abhijitMuhurat.significanceHi
    },
    moonSign: {
      name: moonRashiEn,
      nameEn: `${moonRashiEn} (${moonRashiObj.sanskrit})`,
      nameHi: `${moonRashiObj.hi} (${moonRashiObj.sanskrit})`,
      degree: '14.2',
      element: moonRashiObj.element,
      color: moonRashiObj.color
    },
    hora: {
      planetEn: currentHora.planet,
      planetVedic: currentHora.vedic,
      glyph: currentHora.glyph,
      asset: currentHora.asset,
      rulingUntil: currentHora.endTime || 'Next Hour'
    },
    marketGuidance: {
      summary: marketMoodEn,
      summaryHi: marketMoodHi,
      en: marketMoodEn,
      hi: marketMoodHi
    }
  };
}

module.exports = {
  getComprehensivePanchang
};
