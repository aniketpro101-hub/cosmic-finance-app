# PHASE 3 — LIVE DATA INTEGRATION LAYER

**File name suggestion:** `phase-3-live-data-integration.md`

## Context Summary From Previous Phases
Phase 0 established the foundation: **Cosmic Finance**, a no-login public site with a complete sitemap and non-negotiable rules (no stock recommendations, hidden admin route, mandatory disclaimers). Phase 1 built the full design system — colors, typography, spacing, component language, and two distinct Desktop/Mobile layout templates. Phase 2 brought the site to life with the astronomically-accurate orbit visualization, cursor/touch interactivity, scroll-driven mobile storytelling, and the planet-to-data-widget connection interaction — currently running on placeholder/mock data. This phase now replaces that mock data with real, live data feeds for Indian stock market indices, gold prices, and cryptocurrency, and ensures this data flows reliably into all the widgets designed in Phase 1 and animated in Phase 2. Do not alter the visual design or animation system already built — this phase focuses on data sourcing, reliability, and connecting real numbers into the existing visual framework.

## Goal of This Phase
Ensure the site displays genuinely live (or near-live) Indian stock market data, gold prices, and crypto prices in a way that is reliable, fast-loading, accurate, and never breaks the visual experience even when a data source is slow, rate-limited, or temporarily unavailable. Credibility of this data is extremely important — if numbers are wrong, delayed without indication, or the widgets break, it damages the trust of an audience that is already skeptical of combining astrology with finance.

## 1. What Data Needs To Be Shown

- **Indian Stock Market:** Major indices (Nifty 50, Sensex, Bank Nifty) at minimum, with current value, change points, and change percentage. If feasible, a small set of top gainers/losers can be shown as a broader market pulse, but always framed as informational display only, never as recommendations.
- **Gold:** Current gold price (international rate at minimum; Indian/MCX rate if a reliable free source is available), shown with change indicators similar to stock indices.
- **Crypto:** Major cryptocurrencies (Bitcoin, Ethereum at minimum) with current price and 24-hour change, since crypto audiences expect at least these two as a baseline.
- **Optional/Future addition:** Nasdaq or other global index, as mentioned in the original vision, to give a sense of global macro context alongside Indian markets.

## 2. Data Sourcing Strategy

- Data should never be fetched directly from the final source on every single page load for every single visitor — this risks getting rate-limited, blocked, or causing slow page performance. Instead, a **server-side aggregation approach** should be used: a backend process periodically fetches data from the respective sources (stock index data, gold rate data, crypto data), stores the latest values in a lightweight cache/store, and the website's frontend always requests data from this internal cache rather than hitting external sources directly on every visitor's page load.
- Define a reasonable refresh interval for each data type — stock market data refreshing every short interval during market hours is sufficient (true millisecond real-time is unnecessary for this use case and adds unnecessary complexity/cost), while outside market hours the refresh interval can slow down significantly or simply display the last closing values clearly labeled as such.
- Crypto data can refresh independently of stock market hours since crypto markets operate continuously.
- Gold data refresh interval can be moderate, since gold prices do not require second-by-second precision for this site's purpose.

## 3. Reliability & Fallback Behavior (critical for trust)

- Every data widget must clearly indicate when data was last updated (a small "last updated at [time]" label), so users always know the freshness of what they're viewing rather than assuming false real-time precision.
- If a data source fails or is temporarily unreachable, the widget must not show broken, blank, or zero values. Instead, it should gracefully display the last successfully fetched value along with a clear indication that live refresh is temporarily paused (for example, a small "reconnecting" or "last known value" indicator), preserving trust rather than showing an error state or broken UI.
- Design a monitoring/logging approach so that if a particular data source repeatedly fails, it gets flagged for the admin to notice and address, rather than silently showing stale data indefinitely without anyone realizing.
- When markets are closed (weekends, holidays, after trading hours for Indian indices), the relevant widgets should clearly label the data as "Market Closed — Last Close" rather than implying live movement that isn't actually happening.

## 4. Connecting Live Data Into The Cosmic Visual Layer (Phase 2 integration point)

- The planet-to-data-widget connection interaction built in Phase 2 must now pull from this real live data cache rather than mock data — meaning when a user interacts with Jupiter, the Gold widget it connects to must show the actual current gold price and movement, not a placeholder number.
- The color-coded positive/negative treatment established in the Phase 1 design system (success green, negative red/crimson, both styled to fit the cosmic palette) must be applied consistently and accurately based on real data direction.
- Consider a subtle animated "pulse" or "flicker" effect on a widget specifically at the moment its value updates, so users visually perceive the data as alive and continuously refreshing, reinforcing the "living cosmic dashboard" feeling rather than a static webpage that happens to show numbers.

## 5. Dedicated Live Market Data Page

- Beyond the homepage widgets, build out the dedicated "Live Market Data" page referenced in the Phase 0 sitemap, offering a more complete, detailed dashboard view — more indices, more detail per data point, and potentially simple visual elements like a basic trend indicator (up/down arrow styling, simple sparkline-style trend visuals) while still explicitly avoiding any recommendation, target, or advisory language anywhere near this data.
- This page should still carry the cosmic visual identity (background, color tokens, widget styling from Phase 1) rather than looking like a plain, generic finance data table — it must still feel distinctly like part of the Cosmic Finance universe, not a bolted-on third-party widget page.

## 6. Performance Considerations

- Data widgets must load progressively and independently — if stock data loads slightly before or after gold/crypto data, each widget should show its own loading state individually rather than making the user wait for all data sources to respond before showing anything on the page.
- Initial page load should show a tasteful loading/skeleton state for data widgets (consistent with the cosmic theme — perhaps a soft pulsing glow placeholder rather than a generic grey box) rather than blank space or layout shift when real numbers arrive.
- Given that a large portion of traffic is mobile and potentially on slower Indian mobile networks, data payloads should be kept as lightweight as possible, sending only the specific values needed for display rather than large, unnecessary data structures.

## 7. Legal/Compliance Reminder For This Layer

- All data displays must carry a general disclaimer (can be a persistent small footer note near data widgets) clarifying that data may be slightly delayed, is for informational purposes only, and should not be solely relied upon for making financial decisions — reinforcing the non-advisory positioning established in Phase 0.

## What This Phase Should Produce

- A working backend aggregation layer that reliably fetches and caches stock index data, gold price data, and crypto price data on sensible refresh intervals.
- All homepage data widgets (including those connected to the Phase 2 orbit interaction) now displaying real, accurate, properly formatted live data instead of mock data.
- Clear "last updated" labeling and graceful fallback behavior across all data widgets when a source is slow or temporarily unavailable.
- A fully functional, detailed Live Market Data page consistent with the established cosmic design system.
- Verified performance: data loads progressively, widgets show appropriate skeleton/loading states, and mobile data payload sizes remain lightweight.

## Explicitly Out of Scope for This Phase

Do not build the kundli/personalization form yet. Do not build the admin panel. Do not write Terms & Conditions or final page copy. This phase is strictly about sourcing, reliability, and integration of live financial data into the existing visual and animation framework.

## End-of-Phase Checklist (must confirm all before proceeding to Phase 4)

- [ ] Stock index data (Nifty, Sensex, Bank Nifty at minimum), gold data, and crypto data are all live and updating on sensible refresh intervals
- [ ] Backend caching/aggregation layer is in place so external sources are not hit directly by every individual visitor
- [ ] Every data widget shows a clear "last updated" indicator
- [ ] Graceful fallback behavior confirmed when a data source fails or is slow — no broken/blank/zero states ever shown
- [ ] "Market Closed — Last Close" labeling works correctly outside trading hours for Indian indices
- [ ] Phase 2's planet-to-data-widget interactions now pull real data correctly, with accurate color-coded positive/negative styling
- [ ] Dedicated Live Market Data page is complete, detailed, and visually consistent with the established design system
- [ ] Data widgets load progressively with cosmic-themed skeleton/loading states, no layout shift issues
- [ ] Mobile data payloads are lightweight and perform well on slower network conditions
- [ ] Disclaimer regarding data delay/informational-only purpose is visibly present near data sections
- [ ] Nothing in this phase breaks or alters the design system (Phase 1) or animation system (Phase 2) already built
