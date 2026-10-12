/**
 * Cosmic Finance — Indian Standard Time (IST, UTC+5:30) Utility
 * Location: Mumbai / New Delhi, India
 * Standard Timezone: Asia/Kolkata
 */

const IST_TIMEZONE = 'Asia/Kolkata';

// Get current date/time converted reliably to Indian Standard Time (UTC+5:30)
function getISTDate(date = new Date()) {
  const d = new Date(date);
  
  // Format string parts using official Asia/Kolkata timezone
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    weekday: 'short'
  }).formatToParts(d);

  const map = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }

  const hours = parseInt(map.hour, 10) || 0;
  const minutes = parseInt(map.minute, 10) || 0;
  const seconds = parseInt(map.second, 10) || 0;
  const day = parseInt(map.day, 10) || 1;
  const month = parseInt(map.month, 10) || 1;
  const year = parseInt(map.year, 10) || 2026;

  // Day of week in IST: map weekday string
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = weekdayNames.indexOf(map.weekday);

  const pad = n => String(n).padStart(2, '0');
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const timeStrShort = `${pad(hours)}:${pad(minutes)}`;
  const dateIso = `${year}-${pad(month)}-${pad(day)}`;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateFormatted = `${pad(day)} ${monthNames[month - 1]} ${year}`;

  return {
    hours,
    minutes,
    seconds,
    dayOfWeek, // 0: Sun, 1: Mon, ... 6: Sat
    day,
    month,
    year,
    timeStr,
    timeStrShort,
    dateIso,
    dateFormatted,
    fullDisplay: `${timeStr} IST · ${dateFormatted}`
  };
}

// Indian Stock Market (NSE / BSE) Trading Hours
// Regular Session: Monday to Friday, 09:15 to 15:30 IST
function getIndianMarketStatus(date = new Date()) {
  const ist = getISTDate(date);
  const timeInMinutes = ist.hours * 60 + ist.minutes;

  const marketOpen = 9 * 60 + 15;   // 09:15 AM IST
  const marketClose = 15 * 60 + 30; // 03:30 PM IST

  const isWeekday = ist.dayOfWeek >= 1 && ist.dayOfWeek <= 5;
  const isWithinHours = timeInMinutes >= marketOpen && timeInMinutes <= marketClose;

  if (isWeekday && isWithinHours) {
    return {
      status: 'Open',
      label: 'Market Active',
      isOpen: true,
      istTime: `${ist.timeStr} IST`,
      sessionInfo: 'Regular Market Trading (09:15 – 15:30 IST)'
    };
  } else {
    return {
      status: 'Closed',
      label: 'Market Closed — Last Close',
      isOpen: false,
      istTime: `${ist.timeStr} IST`,
      sessionInfo: 'Next Session: 09:15 AM IST'
    };
  }
}

// Calculate Authentic Vedic Chaldean Hora based on Indian Standard Time & Indian Sunrise
function getIndianHora(date = new Date()) {
  const ist = getISTDate(date);
  
  // In Vedic Jyotish, day begins at local sunrise in India (approx 06:00 AM IST, Mumbai: ~06:33 IST)
  // If current IST hour is before 06:00, the Vedic day belongs to the previous day
  const sunriseHour = 6;
  const isBeforeSunrise = ist.hours < sunriseHour;
  
  // Vedic Day of Week (0: Sunday/Ravivar, 1: Monday/Somavar, etc.)
  const vedicDayOfWeek = isBeforeSunrise ? (ist.dayOfWeek + 6) % 7 : ist.dayOfWeek;
  const hoursSinceSunrise = (ist.hours - sunriseHour + 24) % 24;
  const horaNumber = hoursSinceSunrise + 1; // 1 to 24

  const isDayHora = horaNumber <= 12;
  const horaType = isDayHora ? 'Day Hora' : 'Night Hora';

  // Chaldean planetary order (from highest sphere to lowest):
  // Saturn -> Jupiter -> Mars -> Sun -> Venus -> Mercury -> Moon
  const HORA_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  const DAY_RULERS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const VARA_NAMES = [
    'Ravivar (Sunday)',
    'Somavar (Monday)',
    'Mangalvar (Tuesday)',
    'Budhavar (Wednesday)',
    'Guruvar (Thursday)',
    'Shukravar (Friday)',
    'Shanivar (Saturday)'
  ];

  const firstRuler = DAY_RULERS[vedicDayOfWeek];
  const firstIdx = HORA_ORDER.indexOf(firstRuler);
  const currentPlanetKey = HORA_ORDER[(firstIdx + hoursSinceSunrise) % 7];
  const nextPlanetKey = HORA_ORDER[(firstIdx + hoursSinceSunrise + 1) % 7];

  const GLYPHS = {
    Sun: '☉',
    Moon: '☽',
    Mars: '♂',
    Mercury: '☿',
    Jupiter: '♃',
    Venus: '♀',
    Saturn: '♄',
    Rahu: '☊',
    Ketu: '☋'
  };

  const VEDIC_NAMES = {
    Sun: 'Surya',
    Moon: 'Chandra',
    Mars: 'Mangal',
    Mercury: 'Budha',
    Jupiter: 'Guru',
    Venus: 'Shukra',
    Saturn: 'Shani'
  };

  const ASSETS = {
    Sun: 'Sovereign Debt & PSU Index',
    Moon: 'High Beta, Liquid FMCG & Retail Flow',
    Mars: 'Defense, Real Estate & High Beta',
    Mercury: 'NIFTY IT, Fintech & Algorithmic Trading',
    Jupiter: 'Gold (MCX), Banking & Institutional Capital',
    Venus: 'Luxury Equities, Auto & Precious Metals',
    Saturn: 'Energy, Infrastructure & Heavy Metals'
  };

  const SIGNIFICANCES = {
    Sun: 'Governs sovereign credit, apex monetary governance, state discretion, and primary market trend.',
    Moon: 'Governs intraday momentum, retail participant emotion, public liquidity perception, and short squeeze velocity.',
    Mars: 'Governs physical capital expenditure, real estate development, defense manufacturing, and aggressive market beta.',
    Mercury: 'Governs communication networks, software platforms, high-frequency clearing systems, and commercial trade contracts.',
    Jupiter: 'Governs banking liquidity, bullion reserves, asset accumulation, systemic credit expansion, and macro optimism.',
    Venus: 'Governs tangible asset valuation, discretionary consumption, consumer durables, and wealth aesthetics.',
    Saturn: 'Governs long-cycle capital expenditure, structural debt discipline, energy supply chains, and market capitulations.'
  };

  return {
    planet: currentPlanetKey,
    vedic: VEDIC_NAMES[currentPlanetKey],
    glyph: GLYPHS[currentPlanetKey],
    asset: ASSETS[currentPlanetKey],
    significance: SIGNIFICANCES[currentPlanetKey],
    horaNumber,
    horaType,
    label: `${currentPlanetKey}'s ${isDayHora ? 'day' : 'night'} hour ${horaNumber}`,
    vara: VARA_NAMES[vedicDayOfWeek],
    nextPlanet: nextPlanetKey,
    nextGlyph: GLYPHS[nextPlanetKey],
    sunrise: '06:33 IST',
    sunset: '18:24 IST',
    location: 'Mumbai (NSE/BSE), IST (UTC+5:30)',
    istTime: `${ist.timeStrShort} IST`
  };
}

module.exports = {
  IST_TIMEZONE,
  getISTDate,
  getIndianMarketStatus,
  getIndianHora
};
