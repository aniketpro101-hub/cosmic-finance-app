/**
 * Cosmic Finance - Central Constants & Configuration
 * Master reference for rules, paths, contact information, and disclaimers.
 */

require('dotenv').config();

const CONSTANTS = {
  PROJECT_NAME: 'Cosmic Finance',
  TAGLINE: 'Where Stars Meet The Street',
  TAGLINE_SECONDARY: "Decode The Market's Destiny",

  // Central Phone Number (Must strictly be +91 8888888888 per guidelines)
  PHONE_NUMBER: process.env.CONSULTATION_PHONE || '+91 8888888888',
  WHATSAPP_NUMBER_RAW: '919039610001', // Dr. Ashish Patni official VIP WhatsApp helpline

  // Celebrity Financial Astrologer & Mentor Profile
  FOUNDER: {
    NAME: 'Dr. Ashish Patni',
    HONORIFIC: 'Celebrity Financial Astrologer & Vedic Market Architect',
    WEBSITE_URL: 'https://www.bhavishyam.com',
    WEBSITE_DISPLAY: 'www.bhavishyam.com',
    PHOTO: '/images/dr-ashish-patni.jpg',
    EXPERTISE: 'Financial Astrology, Equity Index Forecasting, Bullion Cycles, Kundli Wealth Timing',
    ORGANIZATION: 'Bhavishyam',
    BIO: 'Dr. Ashish Patni is a distinguished celebrity astrologer, corporate consultant, and pioneer in Vedic Financial Astrology. As the founder of Bhavishyam (www.bhavishyam.com), he has decoded the celestial mechanics behind Dalal Street and global market cycles, guiding prominent industrialists, institutional investors, and seasoned traders across India.',
    // Dual format for template convenience
    name: 'Dr. Ashish Patni',
    title: 'Celebrity Financial Astrologer & Numerologist',
    tagline: 'Founder, Bhavishyam • Master of Vedic Financial Market Cycles',
    website: 'https://www.bhavishyam.com',
    websiteDisplay: 'www.bhavishyam.com',
    photo: '/images/dr-ashish-patni.jpg',
    whatsappNumber: '919039610001',
    bio: 'Dr. Ashish Patni is a distinguished celebrity astrologer, corporate consultant, and pioneer in Vedic Financial Astrology. As the founder of Bhavishyam (www.bhavishyam.com), he has decoded the celestial mechanics behind Dalal Street and global market cycles, guiding prominent industrialists, institutional investors, and seasoned traders across India.',
    stats: {
      experience: '20+ Yrs',
      clients: '25,000+',
      countries: '45+',
      research: 'ABDC Indexed',
      awards: '8+ State Honours'
    }
  },

  // Default Consultation Message
  WHATSAPP_PREFILLED_MESSAGE: 'Namaste Dr. Ashish Patni ji, I have generated my Trading Kundli on Cosmic Finance and would like to consult with you for my personalized Financial Market Prediction and Stock Market timing.',

  // Hidden Admin Route (Never linked in public menus, footers, or sitemap.xml)
  ADMIN_PATH: process.env.ADMIN_SECRET_PATH || '/portal-cosmic-admin-7x89q',

  // Mandatory Disclaimers
  DISCLAIMERS: {
    GENERAL: 'Cosmic Finance provides astrological macro perspectives, educational market commentary, and astronomical data for informational and entertainment purposes only. We are NOT registered with SEBI as financial advisors or research analysts. Nothing on this website constitutes financial advice, investment recommendations, or buy/sell/target/stop-loss calls. Always consult a qualified SEBI-registered financial advisor before making financial decisions.',
    KUNDLI: 'This personalized astrological analysis is based on Vedic astrological principles and indicates traditional planetary alignments and psychological trading propensities. It is strictly educational and does not guarantee financial performance or replace prudent risk management.',
    DATA: 'Live and indicative market data is provided for informational convenience. Indian stock indices, Gold, and Crypto quotations may be delayed or subject to source availability. Do not execute trades solely on real-time assumptions from this dashboard.'
  },

  // Complete Sitemap Definitions
  SITEMAP: {
    HOME: { path: '/', title: 'Home | Cosmic Finance — Where Stars Meet The Street' },
    WEEKLY_OUTLOOK: { path: '/weekly-outlook', title: 'Weekly Market Outlook | Cosmic Finance' },
    MARKET_DATA: { path: '/market-data', title: 'Live Market Data & Dashboard | Cosmic Finance' },
    KUNDLI: { path: '/trading-kundli', title: 'Know Your Trading Kundli | Cosmic Finance' },
    GANN_SQUARE: { path: '/gann-square', title: "Gann's Square of 9 & Sarvatobhadra Chakra | Cosmic Finance" },
    FOUNDER: { path: '/founder', title: 'Celebrity Astrologer & Founder Dr. Ashish Patni | Cosmic Finance' },
    ARTICLES: { path: '/articles', title: 'Financial Astrology Articles | Cosmic Finance' },
    SUBMIT_ARTICLE: { path: '/submit-article', title: 'Write For Us — Submit Article | Cosmic Finance' },
    NEWS: { path: '/news', title: 'Market & Cosmic News | Cosmic Finance' },
    ABOUT: { path: '/about', title: 'About Cosmic Finance — Our Story & Philosophy' },
    PATTERNS: { path: '/patterns', title: 'Historical Planetary Market Patterns | Cosmic Finance' },
    TRACK_RECORD: { path: '/track-record', title: 'Public Track Record & Verified Macro Calls | Cosmic Finance' },
    TERMS: { path: '/terms', title: 'Terms & Conditions | Cosmic Finance' },
    PRIVACY: { path: '/privacy', title: 'Privacy Policy | Cosmic Finance' },
    DISCLAIMER: { path: '/disclaimer', title: 'Regulatory Disclaimer | Cosmic Finance' },
    CONTACT: { path: '/contact', title: 'Consultation & Contact | Cosmic Finance' }
  }
};

module.exports = CONSTANTS;
