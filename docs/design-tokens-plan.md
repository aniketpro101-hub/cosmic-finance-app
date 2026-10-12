# Cosmic Finance — Design Tokens & Architecture Blueprint
**Phase 0 Foundation Specification**

## 1. Color Palette Tokens ("Deep Space Meets Gold Vault")

| Token Name | Value (HSL / Hex) | Role / Usage |
| :--- | :--- | :--- |
| `--space-bg-deepest` | `#040711` (`hsl(225, 62%, 4%)`) | Primary canvas background (infinite deep space) |
| `--space-bg-mid` | `#0a0f24` (`hsl(227, 56%, 9%)`) | Elevated section backgrounds, dashboard containers |
| `--space-bg-card` | `#111836` (`hsl(229, 52%, 14%)`) | Floating panels, interactive widgets, cards |
| `--space-bg-glass` | `rgba(17, 24, 54, 0.65)` | Glassmorphism overlays with backdrop-filter blur |
| `--space-border-subtle` | `rgba(164, 180, 240, 0.12)`| Faint constellation border & card edge divider |
| `--gold-500` (Primary) | `#f5be48` (`hsl(41, 90%, 62%)`) | Value, wealth, key numbers, primary CTAs, stars |
| `--gold-400` (Hover) | `#ffd572` (`hsl(42, 100%, 72%)`)| Button hover states, glowing highlights |
| `--gold-600` (Active) | `#d49a24` (`hsl(41, 71%, 49%)`)| Pressed states, warm amber accents |
| `--violet-500` (Mystic) | `#8a5cf6` (`hsl(258, 90%, 66%)`)| Planetary glow, astrology labels, kundli indicators |
| `--violet-400` (Glow) | `#a78bfa` (`hsl(256, 95%, 76%)`)| Subtle nebula background pulses & celestial paths |
| `--market-green` | `#22c55e` (`hsl(142, 71%, 45%)`)| Market advance / positive gain (cosmic desaturated) |
| `--market-red` | `#f43f5e` (`hsl(349, 89%, 60%)`)| Market decline / loss (deep crimson, non-jarring) |
| `--text-primary` | `#f1f5f9` (`hsl(210, 40%, 96%)`)| High-contrast readable off-white / soft silver text |
| `--text-secondary` | `#94a3b8` (`hsl(215, 20%, 65%)`)| Muted grey-blue for descriptions & metadata |
| `--text-muted` | `#64748b` (`hsl(215, 16%, 47%)`)| Disclaimers, footnotes, timestamps |

---

## 2. Typography System

| Style Level | Font Family | Size (Desktop / Mobile) | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `'Cinzel', 'Outfit', serif` | `3.75rem (60px) / 2.25rem (36px)` | `1.1` | `-0.02em` |
| **H1 (Page Title)**| `'Cinzel', 'Outfit', serif` | `2.75rem (44px) / 2.0rem (32px)` | `1.2` | `-0.01em` |
| **H2 (Section)** | `'Outfit', sans-serif` | `2.0rem (32px) / 1.5rem (24px)` | `1.25` | `0` |
| **H3 (Subheading)** | `'Outfit', sans-serif` | `1.375rem (22px) / 1.25rem (20px)` | `1.35` | `0` |
| **Body (Readable)** | `'Inter', system-ui, sans-serif` | `1.0rem (16px) / 0.938rem (15px)` | `1.65` | `0` |
| **Small / Caption** | `'Inter', system-ui, sans-serif` | `0.813rem (13px) / 0.75rem (12px)` | `1.4` | `0.02em` |
| **Data / Tabular** | `'JetBrains Mono', 'Roboto Mono', monospace` | `1.125rem (18px) / 1.0rem (16px)` | `1.2` | `0.05em` |

---

## 3. Spacing Scale & Grid Layout Rhythm

- Base Unit: `4px`
- Scale:
  - `--space-1`: `4px`
  - `--space-2`: `8px`
  - `--space-3`: `12px`
  - `--space-4`: `16px`
  - `--space-5`: `24px`
  - `--space-6`: `32px`
  - `--space-7`: `48px`
  - `--space-8`: `64px`
  - `--space-9`: `96px`
  - `--space-10`: `128px`
- Container Max Width: `1280px`
- Section Padding: `96px 24px` on Desktop, `56px 16px` on Mobile.

---

## 4. No-Login Public Architecture & Admin Separation Plan

1. **Public Persona (Zero Login / Zero Signups):**
   - 100% of all public pages, outlooks, tickers, articles, and news are publicly accessible without authentication.
   - Lead forms (Kundli Form & Article Submissions) operate anonymously with server-side validation, rate limiting, and CAPTCHA bot defense.
   - No "Login", "Sign In", or "Register" buttons appear anywhere on public pages, footers, headers, or sitemaps.

2. **Hidden Admin Portal Architecture:**
   - Obfuscated route: `/portal-cosmic-admin-7x89q` (configurable in `.env`).
   - Completely excluded from `robots.txt` (`Disallow: /portal-cosmic-admin-7x89q*`) and excluded from `sitemap.xml`.
   - Protected via multi-factor authentication:
     - Step 1: Secure Master Password check.
     - Step 2: Time-based One-Time Password (TOTP 2FA via authenticator app).
     - Session: Secure, HttpOnly, SameSite cookies with strict session expiration and brute-force IP rate limiting.
   - Backend APIs for admin operations strictly enforce `requireAdminAuth` middleware.
