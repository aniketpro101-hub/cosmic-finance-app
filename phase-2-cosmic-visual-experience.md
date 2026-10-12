# PHASE 2 — COSMIC VISUAL EXPERIENCE LAYER

**File name suggestion:** `phase-2-cosmic-visual-experience.md`

## Context Summary From Previous Phases
Phase 0 established the foundation: **Cosmic Finance**, a no-login public site, complete sitemap, non-negotiable rules (no stock recommendations, hidden admin route, mandatory disclaimers), and the "Premium Cosmic Observatory" design philosophy. Phase 1 built the full design system on top of that — color tokens (deep space base, gold accent, violet accent), typography scale (mystical heading font, clean data font, numerical font), spacing/grid rhythm, and component visual language (cards, buttons, widgets, forms, navigation), along with two distinct structural layout templates for Desktop and Mobile homepages. All skeleton pages now carry real visual styling. This phase now brings that static design to life through animation and interaction — this is the signature, most differentiating layer of the entire product. Do not alter the color system, typography, or component styles already established — this phase only adds motion and interactivity on top of them.

## Goal of This Phase
Build the actual "wow factor" of Cosmic Finance — the moving planetary visualization, cursor/touch-based interactivity, and the synchronized storytelling between planetary movement and financial data. This is what should make a visitor stop scrolling and think "I've never seen a website like this." At the same time, this must never compromise load speed or usability, especially on mobile. Every animation must be purposeful, tied to real astronomical or financial meaning wherever possible, not decoration for its own sake.

## 1. The Core Idea To Build: "Living Orbit System"

- At the heart of the homepage (and potentially a dedicated full "Live Sky" page) should be a visual representation of the solar system/planets positioned according to their **actual current real astronomical positions**, not random decorative placement. This is what separates Cosmic Finance from a generic animated template — the orbit should be astronomically accurate, continuously updating.
- Each planet in this visualization should be interactive — when a user hovers (desktop) or taps (mobile) on a planet, it should visually highlight (glow intensifies, slight scale-up, orbit path illuminates) and simultaneously reveal a small info panel stating that planet's current zodiac placement and a one-line plain-language note on what it traditionally signifies for markets (e.g., "Jupiter in Taurus — traditionally associated with strength in commodities and gold").
- Critically: when a planet is highlighted, a connected live data panel elsewhere on the screen should simultaneously react or highlight the related data point (for example, highlighting Jupiter also highlights the Gold price widget with a connecting glow line or subtle animated pulse between the two elements). This visual connection between "planet" and "data" is the single most important interaction in the entire website — it must feel seamless and intentional, as if the cosmos and the market are visibly linked in real time.

## 2. Desktop Experience — Full Immersive Mode

- Background of the hero/landing area should contain a slow-moving starfield with subtle depth (some stars appear closer/brighter, some distant/dimmer), creating a parallax sense of depth as the user moves their cursor across the screen.
- Cursor interaction: as the user moves their mouse, a soft glowing trail (like stardust or a comet tail) should follow the cursor with a slight delay/easing, never instant and rigid — this delay is what creates the "floating in space" feeling rather than a mechanical effect.
- The main orbit visualization should sit prominently in the hero area, with live data widgets arranged around or beside it in a way that feels like control panels around a central cosmic display, reinforcing the "observatory dashboard" concept from the design philosophy.
- As the user scrolls down past the hero section, the orbit visualization should smoothly shrink/transition into a smaller persistent element (perhaps a compact version fixed in a corner or integrated into the navigation bar) rather than abruptly disappearing — maintaining the feeling that "the cosmos is always present" throughout the browsing experience.
- Consider a subtle ambient animation even when the user is idle (not touching mouse/keyboard) — slow star twinkle, slow orbit rotation — so the page always feels alive, never static or frozen.

## 3. Mobile Experience — Lightweight But Still Crazy

- Full real-time 3D/heavy orbit animation is not appropriate for mobile due to performance, battery, and data concerns. Instead, build a **simplified, stylized orbit banner** at the top of the homepage — still astronomically accurate in planet placement, but using lighter 2D/CSS-based animation rather than complex real-time rendering.
- Replace cursor-trail interaction with **touch-ripple interaction** — when a user taps anywhere on the cosmic banner, a glowing ripple/stardust burst emanates from the touch point, giving tactile, satisfying feedback suited to touch interaction rather than mouse movement.
- The primary interaction model on mobile should shift to **scroll-triggered storytelling**: as the user scrolls down the page, sections should animate into view with cosmic-themed transitions (fade combined with slight upward motion and a soft glow reveal), and at key points, a planet icon moving across the screen in sync with scroll position can "hand off" into the next data section — creating a sense of journey/progression down the page rather than relying on constant real-time animation.
- Performance must be prioritized aggressively here: animations should use lightweight, hardware-accelerated techniques, should pause when not in the visible viewport, and must have a graceful fallback (simpler static version) for low-end devices or users with reduced-motion accessibility settings enabled.

## 4. The "Live Planetary Hour" Widget

- Include a small persistent widget (visible in a corner on desktop, accessible via a tap/expand on mobile) showing the current traditional planetary hour (Hora) in real time, continuously updating.
- This should feel like a genuinely useful, unique tool that doesn't exist on typical finance sites — reinforcing the "something new and crazy" positioning stated in the original vision.

## 5. Synchronized Data Storytelling Sections

- Beyond the hero section, build at least one dedicated homepage section that tells a mini-story combining astrology and finance side by side as the user scrolls — for example, a horizontal (desktop) or vertical (mobile) sequence like: "Mercury governs communication and trade" paired visually with a relevant live data widget, "Venus governs wealth and luxury" paired with Gold data, "Rahu governs speculation" paired with a volatility/crypto indicator.
- Each pairing in this section should use consistent visual treatment (the violet glow for astrology side, gold/data-font styling for financial side, as established in Phase 1's color system) so the user intuitively learns to associate the color coding throughout the rest of the site.

## 6. Technical & Performance Guardrails (non-negotiable for this phase)

- Every animation must have a defined performance budget — if frame rate drops on a given device, animations should automatically degrade to a simpler version rather than causing lag or jank.
- All animations must respect the user's system-level "reduced motion" accessibility preference, falling back to minimal/no animation when that preference is detected.
- Animations must not block or delay the loading/rendering of actual financial data — live data widgets should always load and display promptly even if decorative animations are still initializing.
- Mobile animation assets (images, animation libraries) must be optimized/compressed aggressively to avoid slow load times on average Indian mobile network speeds, not just high-speed wifi/broadband assumptions.

## 7. Astronomical Accuracy Requirement

- The planetary positions shown must be calculated from real, accurate astronomical/astrological data (not randomly placed or purely decorative), since credibility is central to the brand's trust with its astrology-believing audience. This data should update at a reasonable interval (does not need to be millisecond-precise, but should reflect genuinely correct planetary positions for the current date/time).

## What This Phase Should Produce

- A fully functional, astronomically-accurate orbit visualization on the homepage for Desktop, with interactive hover states connecting planets to live data widgets.
- A lightweight, scroll-driven, touch-interactive equivalent experience for Mobile that preserves the premium cosmic feeling without heavy performance cost.
- The Live Planetary Hour widget functioning and updating in real time.
- At least one synchronized "astrology meets finance" storytelling section demonstrating the color-coded visual language from Phase 1 in action.
- Confirmed performance behavior: animations degrade gracefully, respect reduced-motion settings, and never delay core data loading.

## Explicitly Out of Scope for This Phase

Do not integrate actual live NSE/Gold/Crypto data feeds yet (use placeholder/mock data that looks realistic for now, to be replaced in Phase 3) — this phase is about the animation and interaction system itself. Do not build the admin panel. Do not write final page copy/content yet.

## End-of-Phase Checklist (must confirm all before proceeding to Phase 3)

- [ ] Desktop orbit visualization reflects real astronomical planet positions and updates appropriately
- [ ] Desktop cursor-trail/stardust interaction works smoothly and feels premium, not mechanical
- [ ] Mobile banner version is lightweight, touch-interactive, and performs well on average mobile hardware
- [ ] Scroll-triggered storytelling works correctly on mobile without jank
- [ ] Planet-to-data-widget connection interaction (hover/tap linking astrology element to finance element) works clearly and intuitively
- [ ] Live Planetary Hour widget displays and updates correctly
- [ ] Reduced-motion accessibility preference is respected across all animations
- [ ] No animation delays or blocks the loading of core page content
- [ ] All animation performance has been tested and degrades gracefully rather than causing lag
- [ ] Nothing in this phase alters or breaks the design system established in Phase 1 or the structural rules from Phase 0
