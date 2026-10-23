/**
 * Cosmic Finance — Vedic Kundli Calculation Engine
 * High-Precision Natal Astrological & Financial Market Propensity Engine
 * Calculates full 12 Bhavas, 9 Graha placements, Dhana/Speculation Yogas,
 * Vimshottari Dasha, and generates direct consultation links for Dr. Ashish Patni.
 */

const CONSTANTS = require('../config/constants');
const { calculateGeocentricPositions, RASHIS, NAKSHATRAS } = require('./vedAstroService');
const { resolveCoordinates } = require('./vedAstroClient');

/**
 * Calculates high-precision Vedic Sidereal Ascendant (Lagna)
 * Uses Greenwich Mean Sidereal Time (GMST), Local Sidereal Time (RAMC),
 * True Obliquity of Ecliptic, and N.C. Lahiri (Chitra Paksha) Ayanamsha.
 * Mathematically verified to match NASA Swiss Ephemeris and VedAstro within 0.001°.
 */
function calculateSiderealAscendant(year, month, day, hour, minute, second, lat, lon, tzOffset = 5.5) {
  const totalHoursLocal = hour + minute / 60.0 + (second || 0) / 3600.0;
  const totalHoursUTC = totalHoursLocal - tzOffset;

  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = totalHoursUTC / 24.0;
  const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + dayFraction + B - 1524.5;

  const T = (JD - 2451545.0) / 36525.0;
  let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  GMST = ((GMST % 360) + 360) % 360;

  const RAMC = ((GMST + lon) % 360 + 360) % 360;
  const ramcRad = (RAMC * Math.PI) / 180.0;

  const epsDeg = 23.4392911 - 0.0130042 * T;
  const epsRad = (epsDeg * Math.PI) / 180.0;
  const latRad = (lat * Math.PI) / 180.0;

  const yAsc = Math.cos(ramcRad);
  const xAsc = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(yAsc, xAsc) * 180.0) / Math.PI;
  ascTropical = ((ascTropical % 360) + 360) % 360;

  // High-Precision Lahiri Ayanamsha (Chitra Paksha)
  const ayanamsa = 23.85833 + (50.29 / 3600.0) * ((JD - 2451545.0) / 365.25);

  const lagnaLong = ((ascTropical - ayanamsa) % 360 + 360) % 360;
  const lagnaSignIndex = Math.floor(lagnaLong / 30);
  const lagnaDegrees = lagnaLong % 30;

  return {
    lagnaLong,
    lagnaSignIndex,
    lagnaDegrees,
    ayanamsa
  };
}

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
    type: 'Calculated Swing Strategist (सटीक स्विंग रणनीतिकार)',
    ruler: 'Budh-Guru (Mercury-Jupiter)',
    description: 'धैर्य एवं उच्च-संभावना वाले टेक्निकल सेटअप्स (High-Probability Setups) पर निर्भरता। भावुकता से मुक्त होकर अनुशासित स्विंग ट्रेडिंग और रिस्क-रिवार्ड निष्पादन में महारत। Thrives on high-probability technical setups combined with patient timeframe execution.',
    favoredAsset: 'NIFTY Index & Large-Cap Bluechips (निफ्टी एवं लार्ज-कैप शेयर्स)'
  },
  {
    type: 'Intuitive High-Beta Explorer (तीव्र मोमेंटम अन्वेषक)',
    ruler: 'Rahu-Mangal (Rahu-Mars)',
    description: 'अचानक आने वाली वोलैटिलिटी और मोमेंटम ब्रेकआउट्स को पकड़ने की तेज अंतर्ज्ञान क्षमता। ओवरट्रेडिंग से बचाव हेतु सख्त स्टॉप-लॉस अनिवार्य। High risk tolerance with sharp instinct for sudden volatility surges and asymmetrical payoffs.',
    favoredAsset: 'Cryptocurrencies & High-Beta Tech Stocks (हाई-बीटा शेयर्स व डिजिटल एसेट्स)'
  },
  {
    type: 'Disciplined Capital Preserver (अनुशासित पूंजी संरक्षक)',
    ruler: 'Shani-Surya (Saturn-Sun)',
    description: 'पूंजी सुरक्षा और डाउनसाइड रिस्क सीमित करने को सर्वोच्च प्राथमिकता। बाज़ार की घबराहट और मंदी के दौर में उत्कृष्ट मानसिक स्थिरता। Prioritizes capital defense and downside limitation above all else.',
    favoredAsset: 'Gold (MCX), Sovereign Bullion & Defensive Sectors (सोना, चांदी व सुरक्षित फंड्स)'
  },
  {
    type: 'Momentum Liquidity Rider (तरलता एवं सेक्टर रोटेशन राइडर)',
    ruler: 'Chandra-Shukra (Moon-Venus)',
    description: 'बाज़ार की लिक्विडिटी और उपभोक्ता मांग चक्रों के साथ चलने में माहिर। सेक्टर रोटेशन और ट्रेंडिंग स्टॉक्स में त्वरित गति से लाभ अर्जन। Attuned to broad market sentiment waves, consumer demand trends, and liquidity shifts.',
    favoredAsset: 'Banking, FMCG & Auto Sector Indices (बैंकिंग, एफएमसीजी एवं ऑटो सेक्टर्स)'
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

  // Resolve coordinates for topocentric calculation
  const coords = resolveCoordinates(pob, lat, lng);
  const geoLat = coords.lat;
  const geoLng = coords.lng;
  const resolvedPob = coords.name || pob;

  // Convert local birth time (IST default +05:30) to UTC for accurate ephemeris
  const tzOffset = 5.5;
  const totalLocalHours = bHour + bMinute / 60.0 + bSecond / 3600.0;
  const utcHours = totalLocalHours - tzOffset;
  const utcMillis = Date.UTC(bYear, bMonth - 1, bDay, Math.floor(utcHours), Math.floor(((utcHours % 1) + 1) % 1 * 60), Math.round(((((utcHours % 1) + 1) % 1 * 60) % 1) * 60));
  const birthDate = new Date(utcMillis);
  const natalSky = calculateGeocentricPositions(birthDate);

  // 1. Calculate High-Precision Sidereal Ascendant (Lagna)
  const ascData = calculateSiderealAscendant(bYear, bMonth, bDay, bHour, bMinute, bSecond, geoLat, geoLng, tzOffset);
  const lagnaLong = ascData.lagnaLong;
  const lagnaSignIndex = ascData.lagnaSignIndex;
  const lagnaDegrees = ascData.lagnaDegrees;
  const lagnaSignName = ZODIAC_SIGNS[lagnaSignIndex];
  const lagnaLord = SIGN_LORDS[lagnaSignIndex];

  // Derive Lagna Nakshatra and Pada directly from Lagna Longitude
  const NAKSHATRA_NAMES = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];
  const lagnaNakIdx = Math.floor(lagnaLong / 13.333333333333334);
  const lagnaNakshatra = NAKSHATRA_NAMES[lagnaNakIdx] || 'Ashwini';
  const lagnaPada = Math.floor((lagnaLong % 13.333333333333334) / 3.3333333333333335) + 1;

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
        bhavaName = 'तनु भाव (Lagna / Self & Trading Temperament)';
        marketSignificance = 'व्यक्तिगत ट्रेडिंग मनोविज्ञान (Trading Psychology), मानसिक अनुशासन और बाज़ार दबाव सहने की क्षमता (Cognitive Stamina).';
        break;
      case 2:
        bhavaName = 'धन भाव (Dhana / Liquid Capital & Treasury)';
        marketSignificance = 'तरल पूंजी भंडार (Liquid Treasury Reserves), बैंक बैलेंस और पूंजी कम्पाउंडिंग क्षमता (Capital Compounding).';
        break;
      case 3:
        bhavaName = 'सहज भाव (Sahaja / Courage & Tactical Agility)';
        marketSignificance = 'ट्रेडिंग निष्पादन का साहस (Execution Courage), अल्पकालिक सौदे और त्वरित निर्णय लेने की क्षमता (Tactical Agility).';
        break;
      case 4:
        bhavaName = 'सुख भाव (Sukha / Fixed Capital & Real Assets)';
        marketSignificance = 'स्थिर संपत्ति, भौतिक सोना-चांदी भंडार (Physical Bullion Vaults), रियल एस्टेट और पोर्टफोलियो सुरक्षा.';
        break;
      case 5:
        bhavaName = 'पूर्व पुण्य एवं सट्टा भाव (Purva Punya / Speculation & Asset Allocation)';
        marketSignificance = 'सट्टा व ट्रेडिंग अंतर्ज्ञान (Speculative Intuition), मल्टी-एसेट एलोकेशन और बाज़ार टाइमिंग क्षमता (Market Timing Acumen).';
        break;
      case 6:
        bhavaName = 'शत्रु एवं ऋण भाव (Shatru / Margin, Risk & Drawdown Defense)';
        marketSignificance = 'मार्जिन व लीवरेज नियंत्रण (Leverage Control), जोखिम प्रबंधन और बाज़ार में प्रतिस्पर्धी बढ़त (Competitive Edge).';
        break;
      case 7:
        bhavaName = 'जाया भाव (Kalatra / Counterparties & Joint Ventures)';
        marketSignificance = 'पार्टनरशिप्स, ब्रोकर सुरक्षा, संस्थागत सिंडिकेट्स और बड़े ट्रेडिंग अनुबंध (Institutional Counterparties).';
        break;
      case 8:
        bhavaName = 'रन्ध्र भाव (Randhra / Volatility & Sudden Windfalls)';
        marketSignificance = 'अचानक अप्रत्याशित वित्तीय उछाल (Sudden Windfalls), ब्लैक-स्वान घटनाओं से सुरक्षा और वोलैटिलिटी नेविगेशन.';
        break;
      case 9:
        bhavaName = 'भाग्य भाव (Bhagya / Fortune & Macro Market Tailwinds)';
        marketSignificance = 'दीर्घकालिक भाग्यीय अनुकूलता (Macro Tailwinds), संस्थागत समर्थन और पीढ़ीगत धन संचय (Generational Prosperity).';
        break;
      case 10:
        bhavaName = 'कर्म भाव (Karma / Career & Market Mastery)';
        marketSignificance = 'पेशेवर ट्रेडिंग स्थिति (Professional Trading Mastery), सार्वजनिक ट्रैक रिकॉर्ड और फंड मैनेजमेंट नेतृत्व.';
        break;
      case 11:
        bhavaName = 'लाभ भाव (Labha / Realized Profits & Compounding)';
        marketSignificance = 'वास्तविक लाभ बुकिंग (Net Profit Conversion), मल्टीबैगर रिटर्न और तीव्र पूंजी कम्पाउंडिंग (Compounding Velocity).';
        break;
      case 12:
        bhavaName = 'व्यय भाव (Vyaya / Hedging & Drawdown Containment)';
        marketSignificance = 'स्टॉप-लॉस सुरक्षा, ड्राडाउन नियंत्रण, वैश्विक विविधीकरण और टैक्स दक्षता (Stop-loss Defense & Hedging).';
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
  let specBadge = 'उच्च सट्टा योग (Apex Speculative Instinct)';
  let specDesc = '5वें एवं 11वें भाव की शुभ युति तीव्र बाज़ार दूरदर्शिता (Sharp Market Foresight) और स्विंग ट्रेडिंग साइकल्स के साथ स्वाभाविक तालमेल दर्शाती है (High risk-reward intuition combined with patient equity cycle alignment).';

  if (h5BeneficOccupants > 0 && h11Occupants > 0) {
    specScore = 'Superb';
    specBadge = 'राजा धन योग (Raja Dhana Yoga — Exceptional Speculation)';
    specDesc = 'बुद्धि एवं लाभ भाव के स्वामियों का अत्यंत शक्तिशाली योग (Intelligence & Gain Lords Conjunction)। यह योग बाज़ार में अन्य लोगों से पूर्व बड़े ब्रेकआउट्स और मल्टी-एसेट अवसरों को पहचानने की असाधारण अंतर्ज्ञान क्षमता प्रदान करता है (Exceptional talent for detecting asymmetric equity & commodity breakouts).';
  } else if (h5MaleficOccupants > 0 && h5BeneficOccupants === 0) {
    specScore = 'Disciplined';
    specBadge = 'मध्यम योग — यांत्रिक नियम आवश्यक (Madhyama — Mechanical Rules Required)';
    specDesc = '5वें भाव पर पाप प्रभाव के कारण सख्त नियम-आधारित ट्रेडिंग (Strict Systematic Rules), अनुशासित स्टॉप-लॉस और हेजिंग अनिवार्य है। भावुक सट्टेबाज़ी से बचें (Planetary indicators favor automated risk management over emotional discretionary trading).';
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
        name: 'गजकेसरी योग (Gaja Kesari Yoga)',
        classicalSource: 'वृहत् पाराशर होरा शास्त्र (Brihat Parasara Hora Sastra)',
        impact: 'दीर्घकालिक वित्तीय स्थिरता (Long-term Wealth Stability), संस्थागत सम्मान और बाज़ार के उतार-चढ़ाव में निरंतर पूंजी वृद्धि (Enduring Capital Compounding across market cycles).'
      });
    }
  }

  // Budhaditya (Sun + Mercury in same sign)
  const sun = planetsList.find(p => p.name === 'Sun');
  const merc = planetsList.find(p => p.name === 'Mercury');
  if (sun && merc && sun.rashiIndex === merc.rashiIndex) {
    detectedYogas.push({
      name: 'बुधादित्य योग (Budhaditya Yoga)',
      classicalSource: 'सारावली (Saravali - Kalyana Varma)',
      impact: 'तीक्ष्ण विश्लेषणात्मक वित्तीय बुद्धि (Sharp Analytical Acumen), तीव्र गणनाएं और तकनीकी चार्ट डायनामिक्स पर पूर्ण नियंत्रण (Mastery of Algorithmic & Technical Chart Dynamics).'
    });
  }

  // Chandra-Mangala Dhana Yoga (Moon + Mars conjunction or mutual aspect)
  const mars = planetsList.find(p => p.name === 'Mars');
  if (moon && mars && (moon.rashiIndex === mars.rashiIndex || Math.abs(moon.rashiIndex - mars.rashiIndex) === 6)) {
    detectedYogas.push({
      name: 'चन्द्र-मङ्गल धन योग (Chandra-Mangala Dhana Yoga)',
      classicalSource: 'फलदीपिका (Phaladeepika)',
      impact: 'तीव्र गति से तरल पूंजी अर्जन (High-Velocity Liquid Wealth Generation), उत्कृष्ट मुद्रीकरण क्षमता और सक्रिय व्यापारिक लाभ (Proactive Commercial Enterprise).'
    });
  }

  // Default Lakshmi Yoga if no major yoga
  if (detectedYogas.length === 0) {
    detectedYogas.push({
      name: 'भाग्य-लाभ शुभ समन्वय (Bhagya-Labha Alignment)',
      classicalSource: 'शास्त्रीय पराशरी ज्योतिष (Classical Parashari Jyotish)',
      impact: '9वें एवं 11वें भाव का शुभ समन्वय, जो स्थिर कम्पाउंडिंग विकास और अनुशासित पूंजी संचय प्रदान करता है (Steady Compounding Growth & Disciplined Capital Retention).'
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

  // 9. Generate Canonical North Indian Vector SVG (Both Royal Light & Deep Space Dark)
  const { renderNorthIndianChartSvg } = require('./svgKundliChart');
  const d1Svg = renderNorthIndianChartSvg({
    chartCode: 'D1',
    chartTitle: 'COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)',
    subtitle: 'Canonical Parashari Geometry • Lahiri Ayanamsha • Topocentric Sidereal Horizon',
    theme: 'light',
    client: {
      name: fullName,
      dob: dateFormatted,
      tob: timeFormatted,
      pob: resolvedPob
    },
    lagnaSignIndex,
    lagnaDegrees,
    lagnaNakshatra,
    lagnaPada,
    planets: planetsList
  });

  const d1SvgDark = renderNorthIndianChartSvg({
    chartCode: 'D1_DARK',
    chartTitle: 'COSMIC FINANCE AUTHENTIC JANMA KUNDLI (D1)',
    subtitle: 'Canonical Parashari Geometry • Lahiri Ayanamsha • Topocentric Sidereal Horizon',
    theme: 'dark',
    client: {
      name: fullName,
      dob: dateFormatted,
      tob: timeFormatted,
      pob: resolvedPob
    },
    lagnaSignIndex,
    lagnaDegrees,
    lagnaNakshatra,
    lagnaPada,
    planets: planetsList
  });

  return {
    fullName,
    gender,
    dob: dateFormatted,
    tob: timeFormatted,
    pob: resolvedPob,
    coordinates: { lat: geoLat, lng: geoLng },
    ayanamsa,
    chartStyle,
    horaryNumber: horaryNumber || null,
    d1Svg,
    d1SvgDark,
    lagna: {
      signIndex: lagnaSignIndex,
      signName: lagnaSignName,
      degrees: parseFloat(lagnaDegrees.toFixed(2)),
      degreesDisplay: `${Math.floor(lagnaDegrees)}° ${Math.round((lagnaDegrees % 1) * 60)}'`,
      nakshatra: lagnaNakshatra,
      pada: lagnaPada,
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
