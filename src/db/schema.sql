-- Cosmic Finance SQLite Schema

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  tob TEXT,
  pob TEXT NOT NULL,
  phone_encrypted TEXT,
  phone_hash TEXT,
  lead_type TEXT DEFAULT 'whatsapp', -- 'whatsapp' | 'call'
  speculation_yoga TEXT,
  trading_personality TEXT,
  favored_sector TEXT,
  status TEXT DEFAULT 'New', -- 'New' | 'Contacted' | 'Converted' | 'Not Interested'
  admin_notes TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_thoughts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_published INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_bio TEXT,
  featured_image TEXT,
  read_time TEXT DEFAULT '5 min read',
  status TEXT DEFAULT 'approved', -- 'pending' | 'approved' | 'rejected'
  rejection_note TEXT,
  reactions_json TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  category TEXT DEFAULT 'Macro', -- 'Macro' | 'Astro-Market' | 'Gold' | 'Crypto'
  image_url TEXT,
  is_published INTEGER DEFAULT 1,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weekly_outlook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_range TEXT NOT NULL,
  planetary_transits TEXT NOT NULL,
  market_commentary TEXT NOT NULL,
  nifty_sensex_outlook TEXT,
  gold_outlook TEXT,
  crypto_outlook TEXT,
  nasdaq_outlook TEXT,
  is_published INTEGER DEFAULT 1,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  totp_secret TEXT NOT NULL,
  totp_enabled INTEGER DEFAULT 1,
  failed_attempts INTEGER DEFAULT 0,
  lockout_until DATETIME,
  last_login DATETIME
);

CREATE TABLE IF NOT EXISTS market_cache (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- 'index' | 'commodity' | 'crypto'
  current_price REAL NOT NULL,
  change_amount REAL NOT NULL,
  change_percent REAL NOT NULL,
  high REAL,
  low REAL,
  market_status TEXT DEFAULT 'Open', -- 'Open' | 'Closed'
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Phase 10: 4D Time Machine Snapshots (Precomputed daily geocentric planetary coordinates + historical market data)
CREATE TABLE IF NOT EXISTS astro_snapshots (
  date TEXT PRIMARY KEY, -- 'YYYY-MM-DD'
  planets_json TEXT NOT NULL,
  panchang_json TEXT,
  nifty_close REAL,
  sensex_close REAL,
  gold_close REAL,
  btc_close REAL,
  market_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_astro_snapshots_date ON astro_snapshots(date);

-- Phase 10: Public Track Record (Immutable log of Weekly Macro calls vs real market outcomes)
CREATE TABLE IF NOT EXISTS macro_track_record (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  outlook_id INTEGER,
  week_range TEXT NOT NULL,
  published_date TEXT NOT NULL,
  stated_macro_call TEXT NOT NULL,
  actual_outcome TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending' | 'Verified Match' | 'Verified Divergence'
  market_metric_delta TEXT,
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Phase 10: Historical Pattern Library (Transparent computed statistics without AI-generated claims)
CREATE TABLE IF NOT EXISTS historical_patterns (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  planetary_condition TEXT NOT NULL,
  asset_symbol TEXT NOT NULL,
  sample_count INTEGER NOT NULL,
  date_range_start TEXT NOT NULL,
  date_range_end TEXT NOT NULL,
  positive_occurrences INTEGER NOT NULL,
  negative_occurrences INTEGER NOT NULL,
  win_rate_percent REAL NOT NULL,
  avg_return_percent REAL NOT NULL,
  median_return_percent REAL NOT NULL,
  max_gain_percent REAL NOT NULL,
  max_drawdown_percent REAL NOT NULL,
  occurrences_json TEXT NOT NULL,
  analytical_summary TEXT NOT NULL,
  methodology_note TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
