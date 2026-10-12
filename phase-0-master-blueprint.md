# PHASE 0 — MASTER BLUEPRINT & PROJECT FOUNDATION

**File name suggestion:** `phase-0-master-blueprint.md`

## Context for AI
This is the very first phase of a multi-phase build. There is no previous context. This document establishes the entire foundation that all future phases will build upon. Read this fully before writing or structuring anything. Do not skip ahead to visual design or data integration in this phase — this phase is about establishing correct architecture, rules, and design philosophy only.

## Project Identity

- **Project Name:** Cosmic Finance
- **Tagline:** "Where Stars Meet The Street" (placeholder, can be refined later)
- **Core Concept:** A public, open-access website that blends financial astrology with live Indian stock market, gold, and crypto data. The site gives broad macro astrological commentary on markets and allows visitors to get a personalized astrological read on their trading/investing potential, leading them to book a personal consultation via WhatsApp or call.
- **Audience:** Indian retail stock market traders and investors who already believe in astrology and are looking for an edge, guidance, or entertainment value tied to their trading decisions.
- **Emotional Goal of the Site:** Every visitor should feel like they have stepped into a different dimension — a premium, mysterious, cosmic universe — while simultaneously trusting that the financial data shown is real, live, and credible. The site must feel both "magical" and "serious" at the same time. This duality is the entire soul of the brand.

## Critical Non-Negotiable Rules (apply to every phase, every page)

1. **No login or signup system anywhere on the public site.** Every visitor, without exception, can view all public content without creating an account.
2. **Only one hidden, secured admin access point** exists for content management. This must never be discoverable or linked from any public navigation, footer, or menu.
3. **No stock buy/sell/target/stop-loss recommendations ever**, anywhere on the site, in any content type (articles, daily posts, weekly outlook, news). All content must stay at the level of macro commentary, educational interpretation, or personalized astrological insight — never direct financial advice.
4. Every page that discusses markets, astrology-based predictions, or personal kundli analysis must carry a visible disclaimer stating this is for educational and informational purposes only, not registered financial advice.
5. The site must have two distinct, separately designed experiences: a rich, animated Desktop experience and a lightweight, performance-first Mobile experience. Both must feel premium, but they are not simply scaled versions of each other — they are deliberately different interaction models suited to their device.
6. Performance is never sacrificed for decoration. Any animation or visual effect must degrade gracefully on lower-end devices or slow connections.
7. All user-submitted content (articles, kundli form data) must pass through a moderation/review step before becoming public or being acted upon. Nothing from a public user auto-publishes.
8. All sensitive personal data (name, date of birth, time of birth, place of birth) submitted by visitors must be treated as confidential and stored securely, never displayed publicly.

## Complete Sitemap (every page that will eventually exist)

1. **Home Page** — the main cosmic experience, live data highlights, today's/this week's astrological market mood, latest admin daily thoughts feed, featured articles, latest news
2. **Weekly Market Outlook Page** — archive of all past weekly astrological macro write-ups, newest on top
3. **Live Market Data Page** — a dedicated, more detailed live dashboard view of Indian stock indices, gold, crypto
4. **Know Your Trading Kundli Page** — the personalization form (name, DOB, time, place) leading to an instant teaser result and a call-to-action for personal consultation via WhatsApp/call
5. **Articles Listing Page** — all published articles, with filters/categories
6. **Single Article Page** — full article view with option for public visitors to submit their own article via a visible "Write for us" entry point
7. **Submit an Article Page** — a simple public form (no login) to submit an article for admin review
8. **News Page** — curated financial-astrology and market-related news items
9. **About Cosmic Finance Page** — brand story, credibility, admin's background/research angle
10. **Terms & Conditions Page** — full detailed legal text (to be written in a later dedicated phase)
11. **Privacy Policy Page** — how personal and birth data is collected, used, stored
12. **Disclaimer Page** — standalone detailed disclaimer, also linked/summarized on every relevant page
13. **Contact / Consultation Page** — WhatsApp click-to-chat and call options clearly presented
14. **Admin Panel (hidden, secured, not in public navigation)** — login-protected area to manage daily thoughts, articles, news, leads, and analytics

## Design Philosophy (read carefully, this governs everything)

- The overall aesthetic direction is **"Premium Cosmic Observatory"** — imagine standing inside a planetarium crossed with a high-end financial terminal (like a Bloomberg terminal, but if it were designed for a mystical astrology experience).
- Color direction: deep space tones (deep navy, black, indigo) as the base, with accents of gold, amber, and a soft cosmic purple/violet for highlights. Gold accent specifically should tie back to both "cosmic stars" and "financial wealth" symbolism — this dual meaning should be used deliberately throughout.
- Typography should feel modern, premium, slightly futuristic for headings, but highly readable and neutral for data/body text, since financial data needs clarity and trust, not decoration.
- Every section of the site should feel like it belongs to one unified universe — no section should feel like a generic template bolted on. The live data widgets should be re-skinned to feel like "instruments on a cosmic dashboard," not default stock ticker widgets.
- Motion and animation are core to the brand, not an afterthought. However, motion must always serve a purpose — either guiding attention, revealing information progressively, or reinforcing the cosmic theme. Decoration without purpose should be avoided.
- The site should feel alive and "breathing" — subtle ambient motion even when the user is not interacting (slow-moving starfield, subtle pulsing glows) rather than a static page.

## Desktop vs Mobile Design Divergence (high-level, details come in later phase)

- **Desktop** is the "immersive flagship experience" — this is where the most elaborate animation, cursor-based interactions, and side-by-side storytelling (planet movement next to live data reacting) should happen. Desktop users are assumed to be more engaged, sitting down, exploring deeply.
- **Mobile** is the "fast, punchy, shareable experience" — assumed to be quick visits, scrolling with a thumb, checking today's outlook or market mood. Design should prioritize vertical scroll storytelling, lightweight touch-based effects, and extremely fast load time over elaborate animation. It should still feel distinctly premium and different from a typical finance app, but achieve that feeling through smart use of color, motion-on-scroll, and typography rather than heavy real-time 3D animation.

## What This Phase Should Produce

At the end of this phase, the goal is NOT a finished visual design. The goal is:
- A clearly defined project structure/folder organization that reflects the sitemap above
- A documented design token system plan (colors, typography scale, spacing scale) that will be referenced in every future phase — this ensures visual consistency across all future work
- A documented plan for how the no-login public/admin separation will be structured
- A placeholder/skeleton version of every page in the sitemap, unstyled or minimally styled, just to confirm the structure and routing is correct before visual design begins in Phase 1

## Explicitly Out of Scope for This Phase

Do not build live data integration, do not build the cosmic animation system, do not build the admin panel functionality, do not write Terms & Conditions content yet. These belong to later phases. This phase is foundation only.

## End-of-Phase Checklist (must confirm all before proceeding to Phase 1)

- [ ] All pages from the sitemap exist as skeleton/placeholder routes
- [ ] No login/signup exists anywhere in the public-facing structure
- [ ] A single hidden admin route path is defined and documented separately (not linked anywhere publicly)
- [ ] Design token plan (colors, typography, spacing) is documented
- [ ] Folder/project structure is clean, organized, and scalable for future phases
- [ ] Nothing in this phase violates the Non-Negotiable Rules listed above
