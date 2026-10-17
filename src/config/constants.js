/**
 * Cosmic Finance - Central Constants & Configuration
 * Master reference for rules, paths, contact information, and disclaimers.
 */

require('dotenv').config();

const CONSTANTS = {
  PROJECT_NAME: 'Cosmic Finance',
  TAGLINE: 'Where Stars Meet The Street',
  TAGLINE_SECONDARY: "Decode The Market's Destiny",

  // Mandatory Regulatory Multi-Asset Class Research Statement
  MULTI_ASSET_STATEMENT: "Cosmic Finance explores the relationship between planetary transits, Nakshatra movements, Vedic astrology, numerology and historical patterns across multiple asset classes.\nOur research extends across equities, precious metals, energy, agricultural commodities, real estate and digital assets.\nThrough individual horoscope and name - numerology analysis, we also explore traditional astrological interpretations of financial tendencies, speculation and favourable or challenging periods in a person's life.*",

  MULTI_ASSET_CLASSES: [
    { name: 'Equities & Indices', symbol: 'NSE / BSE / Global', icon: '📈', desc: 'Cap-weighted index cycles & rotational harmonics' },
    { name: 'Precious Metals', symbol: 'Gold & Silver (MCX/COMEX)', icon: '🪙', desc: 'Solar bullion preservation & currency hedges' },
    { name: 'Energy & Commodities', symbol: 'Crude Oil & Natural Gas', icon: '⚡', desc: 'Martian & Saturnian geopolitical cycle timing' },
    { name: 'Agricultural Commodities', symbol: 'Agri Spot & Futures', icon: '🌾', desc: 'Lunar monsoons, Nakshatra rains & crop harvest cycles' },
    { name: 'Real Estate & Land Assets', symbol: 'Property & Infrastructure', icon: '🏛️', desc: 'Bhumi-karaka Mars & Saturnian land-holding periods' },
    { name: 'Digital & Cryptographic Assets', symbol: 'Bitcoin & Web3 Macro', icon: '🌐', desc: 'Rahu-driven high-velocity digital innovation waves' }
  ],

  // Sacred Vedic Sanskrit & Hindi Wisdom Quotes for Trust & Deep Impact
  HINDI_QUOTES: [
    {
      sanskrit: 'ज्योतिषं वेदस्य चक्षुः।',
      hindi: 'ज्योतिष वेदों का दिव्य नेत्र है — जो काल के सूक्ष्म प्रवाह और दिशा को प्रकाशित करता है।',
      translation: 'Astrology is the sacred eye of the Vedas, illuminating the subtle currents and direction of time.',
      source: 'ऋग्वेद वेदांग ज्योतिष',
      theme: 'wisdom'
    },
    {
      sanskrit: 'कर्म प्रधान विश्व करि राखा, जो जस करइ सो तस फलु चाखा।',
      hindi: 'कर्म ही सृष्टि का मूल विधान है; ग्रह-नक्षत्र उचित समय का संकेत देकर हमारे कर्म को सही दिशा प्रदान करते हैं।',
      translation: 'Action governs destiny; celestial planetary cycles signal the exact opportune moments for wise decisions.',
      source: 'गोस्वामी तुलसीदास (रामचरितमानस)',
      theme: 'karma'
    },
    {
      sanskrit: 'कालचक्रं जगत्सर्वं भ्रमते सूर्यतेजसा।',
      hindi: 'सम्पूर्ण जगत और समस्त सम्पत्ति चक्र सूर्य तथा कालचक्र के प्रभाव से ही गतिशील हैं।',
      translation: 'The entire universe and all asset cycles rotate under the eternal solar wheel of time.',
      source: 'सूर्य सिद्धान्त',
      theme: 'cycles'
    },
    {
      quote: 'ग्रह हमें विवश नहीं करते, वे केवल समय के अनुकूल और प्रतिकूल प्रवाह का संकेत देते हैं। जब आपकी कुंडली और नाम-अंक आपके कर्म के साथ संरेखित होते हैं, तो अनिश्चितता विवेकपूर्ण आत्मविश्वास में बदल जाती है।',
      author: 'डॉ. आशीष पटनी',
      title: 'वैदिक वित्तीय ज्योतिषाचार्य एवं अंकशास्त्री',
      theme: 'guidance'
    }
  ],

  // Central Phone Number & VIP WhatsApp Direct Contact
  PHONE_NUMBER: process.env.CONSULTATION_PHONE || '+91 8888888888',
  WHATSAPP_NUMBER_RAW: (process.env.CONSULTATION_PHONE || '+91 8888888888').replace(/[^0-9]/g, ''),

  // Celebrity Financial Astrologer & Mentor Profile
  FOUNDER: {
    NAME: 'Dr. Ashish Patni',
    HONORIFIC: 'Celebrity Financial Astrologer & Master Numerologist',
    WEBSITE_URL: 'https://www.bhavishyam.com',
    WEBSITE_DISPLAY: 'www.bhavishyam.com',
    PHOTO: '/images/dr_ashish_patni_executive.png',
    PHOTO_SECONDARY: '/images/dr-ashish-patni.jpg',
    EXPERTISE: 'Multi-Asset Financial Astrology, Name & Corporate Numerology, Kundli Wealth Timing, Corporate Astro-Vastu',
    ORGANIZATION: 'Bhavishyam',
    BIO: 'Dr. Ashish Patni is a globally recognized celebrity astrologer, master numerologist, corporate consultant, and pioneer in Vedic Financial Astrology. As the founder of Bhavishyam (www.bhavishyam.com), he has decoded the celestial mechanics behind Dalal Street and multi-asset global market cycles for over 20 years, guiding prominent industrialists, institutional investors, family offices, and seasoned traders across 45+ countries.',
    // Dual format for template convenience
    name: 'Dr. Ashish Patni',
    title: 'Celebrity Financial Astrologer & Master Numerologist',
    tagline: 'Founder, Bhavishyam • Master of Vedic Multi-Asset & Life Financial Cycles',
    website: 'https://www.bhavishyam.com',
    websiteDisplay: 'www.bhavishyam.com',
    photo: '/images/dr_ashish_patni_executive.png',
    photoWhite: '/images/dr_ashish_patni_white_framed.png',
    whatsappNumber: (process.env.CONSULTATION_PHONE || '+91 8888888888').replace(/[^0-9]/g, ''),
    bio: 'Dr. Ashish Patni is a globally recognized celebrity astrologer, master numerologist, corporate consultant, and pioneer in Vedic Financial Astrology. As the founder of Bhavishyam (www.bhavishyam.com), he has decoded the celestial mechanics behind Dalal Street and multi-asset global market cycles for over 20 years, guiding prominent industrialists, institutional investors, family offices, and seasoned traders across 45+ countries.',
    credentials: [
      'Ph.D. in Vedic Astro-Sciences & Mathematical Jyotish',
      'Pioneer of Vedic Multi-Asset Planetary Cycle Timing',
      'ABDC Indexed Academic Research Publication Author',
      'Over 25,000+ Individual Horoscopes & Name-Numerology Charts Evaluated',
      'Keynote Speaker at National Astrological & Economic Summits',
      'Personal Mentor to Corporate Leaders, Industrialists & HNI Investors'
    ],
    stats: {
      experience: '20+ Yrs',
      clients: '25,000+',
      countries: '45+',
      research: 'ABDC Indexed',
      awards: '8+ State Honours'
    }
  },

  // Default Consultation Message (SEBI Safe, Multi-Asset Oriented)
  WHATSAPP_PREFILLED_MESSAGE: 'Namaste Dr. Ashish Patni ji, I have generated my Birth Coordinates analysis on Cosmic Finance and would like to consult with you for personal guidance on astrology, numerology, and my life financial planetary timings across multi-asset classes.',

  // Hidden Admin Route (Never linked in public menus, footers, or sitemap.xml)
  ADMIN_PATH: process.env.ADMIN_SECRET_PATH || '/portal-cosmic-admin-7x89q',

  // Mandatory Disclaimers (SEBI Compliant, Multi-Asset Class Scope)
  DISCLAIMERS: {
    GENERAL: 'Cosmic Finance explores the relationship between planetary transits, Nakshatra movements, Vedic astrology, numerology and historical patterns across multiple asset classes including equities, precious metals, energy, agricultural commodities, real estate and digital assets. We are strictly an educational and astrological research initiative and are NOT registered with SEBI as financial advisors or research analysts. Nothing on this website constitutes financial advice, investment recommendations, or buy/sell/target/stop-loss calls. Always consult a qualified SEBI-registered financial advisor before making financial decisions.',
    KUNDLI: 'This personalized astrological and numerological analysis is based on traditional Vedic principles and indicates planetary alignments, psychological propensities, and traditional interpretations of financial tendencies. It is strictly educational and does not guarantee financial returns, speculation success, or replace prudent risk management.',
    DATA: 'Live and indicative multi-asset telemetry is provided for informational convenience. Indian stock indices, Gold, and Crypto quotations may be delayed or subject to source availability. Do not execute trades solely on real-time assumptions from this dashboard.'
  },

  // Complete Sitemap Definitions
  SITEMAP: {
    HOME: { path: '/', title: 'Cosmic Finance — Vedic Multi-Asset Astrology & Personal Guidance | Dr. Ashish Patni' },
    WEEKLY_OUTLOOK: { path: '/weekly-outlook', title: 'Weekly Multi-Asset Outlook | Cosmic Finance' },
    MARKET_DATA: { path: '/market-data', title: 'Live Multi-Asset Telemetry Dashboard | Cosmic Finance' },
    KUNDLI: { path: '/trading-kundli', title: 'Personal Financial Kundli & Birth Coordinates | Cosmic Finance' },
    GANN_SQUARE: { path: '/gann-square', title: "Gann's Square of 9 & Sarvatobhadra Chakra | Cosmic Finance" },
    FOUNDER: { path: '/founder', title: 'Celebrity Astrologer & Numerologist Dr. Ashish Patni | Cosmic Finance' },
    ARTICLES: { path: '/articles', title: 'Multi-Asset Vedic Astrology Articles | Cosmic Finance' },
    SUBMIT_ARTICLE: { path: '/submit-article', title: 'Write For Us — Submit Article | Cosmic Finance' },
    NEWS: { path: '/news', title: 'Market & Cosmic News | Cosmic Finance' },
    ABOUT: { path: '/about', title: 'About Cosmic Finance — Our Story & Multi-Asset Philosophy' },
    PATTERNS: { path: '/patterns', title: 'Historical Planetary Multi-Asset Patterns | Cosmic Finance' },
    TRACK_RECORD: { path: '/track-record', title: 'Public Track Record & Verified Macro Calls | Cosmic Finance' },
    TERMS: { path: '/terms', title: 'Terms & Conditions | Cosmic Finance' },
    PRIVACY: { path: '/privacy', title: 'Privacy Policy | Cosmic Finance' },
    DISCLAIMER: { path: '/disclaimer', title: 'Regulatory Multi-Asset Disclaimer | Cosmic Finance' },
    CHRONICLES: { path: '/chronicles', title: 'Market Chronicles: Titans, Legends & Turning Points | Cosmic Finance' },
    CONTACT: { path: '/contact', title: 'Consultation & Personal Guidance | Dr. Ashish Patni' }
  }
};

module.exports = CONSTANTS;
