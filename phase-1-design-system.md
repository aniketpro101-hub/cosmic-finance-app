# PHASE 1 — DESIGN SYSTEM & RESPONSIVE FOUNDATION

**File name suggestion:** `phase-1-design-system.md`

## Context Summary From Previous Phase (Phase 0)
In Phase 0, the foundation was established: the project is called **Cosmic Finance**, a no-login public website blending financial astrology with live Indian market/gold/crypto data. The complete sitemap, folder structure, non-negotiable rules (no stock recommendations, no login, hidden admin route, mandatory disclaimers), and the "Premium Cosmic Observatory" design philosophy were defined. Skeleton pages for every route now exist. Do not change the sitemap, do not reintroduce login, and continue building strictly within the rules established in Phase 0. This phase now builds the actual visual design system on top of that foundation.

## Goal of This Phase
Establish a complete, documented, reusable design system — the exact colors, typography, spacing, grid behavior, and component visual language — so that every page built in future phases looks like it belongs to one single, cohesive, premium universe. This phase also finalizes the structural (not animated yet) difference between the Desktop and Mobile experiences in terms of layout and information hierarchy. Visual polish and animation come in Phase 2 — this phase is about getting the underlying skeleton of design right first.

## 1. Color System — "Deep Space Meets Gold Vault"

Define a complete color palette with the following logic:

- **Base/Background layer:** Very deep navy-black and near-black tones, almost like looking into deep space. This should never feel like flat pure black — it should have subtle depth, almost like a very dark gradient or faint nebula-like texture in places, giving the impression of infinite depth rather than a flat dark page.
- **Primary accent — Gold/Amber:** Used for key highlights, important numbers, call-to-action buttons, and anything that represents "value" or "wealth" — this ties the cosmic star imagery and the financial wealth imagery together deliberately. This should feel luxurious, not neon or cheap gold.
- **Secondary accent — Cosmic Violet/Indigo Glow:** Used for mystical elements, planetary highlights, astrology-specific sections, and ambient glows. This creates separation between "this is astrology content" (violet-toned) versus "this is financial data" (gold-toned), giving the user subtle visual cues about what type of information they're looking at without needing to read labels.
- **Success/Positive market movement color:** A clean, slightly desaturated green that still fits the cosmic palette rather than a harsh stock-app green.
- **Negative/Loss market movement color:** A deep red/crimson that also fits the overall tone rather than a jarring alert red.
- **Text colors:** Off-white/soft silver for primary readable text on dark backgrounds (never pure white, which feels too harsh against deep space tones), and a muted grey-blue for secondary/supporting text.
- Define at minimum 3 tonal depths of the background (darkest, mid, elevated/card level) so that cards, sections, and overlays have visual hierarchy without needing borders everywhere.

Document this palette clearly as a named system (e.g., "space-black-900, space-black-700, gold-500, violet-400" style naming) so every future phase references consistent names instead of arbitrary colors.

## 2. Typography System

- **Heading font:** Should feel modern, slightly futuristic, with good presence at large sizes — used for hero sections, page titles, and major section headers. It should feel premium and a little mysterious, not playful or casual.
- **Body/Data font:** A highly legible, neutral, clean font used for paragraph text, article content, and most importantly for all numerical/financial data. Financial numbers must always prioritize clarity and trust over style — never use the decorative heading font for prices, percentages, or live data figures.
- Define a complete type scale (hero size, page title, section heading, subheading, body text, small/caption text) with consistent sizing ratios, so every future page pulls from this same scale rather than inventing new sizes.
- Numerical data (prices, percentages, index values) should have its own distinct treatment — consider a monospaced or tabular-figure style font specifically for numbers so that live data feels precise, technical, and trustworthy, contrasting intentionally with the more mystical heading font used elsewhere.

## 3. Spacing, Grid & Layout Rhythm

- Define a consistent spacing scale (a set of standard spacing units) that will be used for all padding, margins, and gaps throughout the site, so nothing feels randomly spaced.
- Define a section rhythm for the homepage and long-scroll pages — meaning a consistent pattern of how much breathing room exists between major sections, so the scrolling experience feels intentional and paced rather than cramped or inconsistent.
- Desktop should use a wider, multi-column grid system capable of supporting side-by-side layouts (for example: planetary visualization on one side, live data reacting on the other side, as discussed in the concept phase).
- Mobile should use a single-column, vertically stacked grid, but with deliberate variation in section widths/padding (not everything edge-to-edge, not everything boxed) to avoid feeling monotonous during long scroll sessions.

## 4. Component Visual Language (describe intent, not code)

Define the general look and feel for these recurring components, to be used consistently everywhere they appear across the site:

- **Cards** (used for articles, news items, daily thought posts): Should feel like "floating panels in space" — soft glowing edges or subtle border glow rather than harsh borders, slightly elevated background tone compared to the page background, soft shadow or glow rather than a hard drop shadow.
- **Buttons/Call-to-actions:** Primary buttons use the gold accent and should feel tactile and premium — perhaps a subtle glow or shimmer treatment on hover (desktop) or tap (mobile), reinforcing the "wealth/value" association. Secondary buttons should be more subdued, using outline or ghost style so the gold primary buttons always stand out as the main action.
- **Data widgets/tickers** (for live stock, gold, crypto numbers): Should feel like "instrument readouts" on a cosmic dashboard — framed distinctly, using the numerical font defined above, with color-coded positive/negative indicators, and ideally a small glowing accent line or icon that ties them visually back to the cosmic theme (for example, a small star or orbit icon integrated into the widget frame) so they never feel like a generic bolted-on finance widget.
- **Section dividers:** Instead of plain horizontal lines, consider subtle cosmic-themed dividers (like a thin glowing gradient line, or a faint constellation-style dot pattern) to maintain the immersive feel even in structural elements.
- **Forms** (kundli form, article submission form, contact form): Should feel clean, trustworthy, and premium — dark input fields with soft glowing focus states, clear labels, generous spacing between fields so they don't feel cramped or untrustworthy, since users are entering sensitive personal information here.
- **Navigation (Desktop):** Should be minimal and elegant, likely a slim top bar that may become more transparent/immersive as the user scrolls into the cosmic hero section, then solidify into a more standard readable bar as they scroll into data-heavy sections.
- **Navigation (Mobile):** Should use a simple, thumb-friendly bottom or hamburger-based navigation, prioritizing quick access to Live Data, Weekly Outlook, and Know Your Kundli as the most important destinations, since mobile users want fast access, not exploration.

## 5. Iconography & Imagery Direction

- Icons throughout the site should follow a consistent line-style or glow-style (not mixing flat icons with glow icons) — likely a thin-line, slightly luminous icon style that fits the cosmic theme.
- Where possible, custom icons representing planets, zodiac symbols, and financial symbols (rupee, bullion, coin, chart) should be designed in the same consistent visual style, not using mismatched generic icon packs that break the premium feel.
- Avoid literal, cheap-looking "stock clipart" style astrology imagery (generic zodiac wheel images, cheesy crystal ball graphics) — the visual language should feel more like a modern planetarium/space-tech aesthetic than a traditional fortune-telling aesthetic. This is critical to keep the "serious + premium" trust factor intact alongside the mystical angle.

## 6. Desktop vs Mobile — Structural (Non-Animated) Differences To Define Now

- On Desktop, define how the homepage hero area will structurally divide space (e.g., cosmic visualization dominant in background, content/data overlaid or side-by-side).
- On Mobile, define how that same homepage hero will restructure into a vertical flow (e.g., a condensed cosmic visual banner at top, followed by stacked content sections, since there isn't room for elaborate side-by-side layouts on a small screen).
- Clearly document that these are two separate layout templates sharing the same design tokens (colors, type, spacing) — not one layout simply "squeezed" into a smaller screen. This distinction should be documented clearly so future phases don't default to simple responsive scaling.

## 7. Accessibility & Readability Considerations

- Even though the theme is dark and atmospheric, ensure sufficient contrast ratios between text and background for all primary content, especially financial numbers and disclaimer text, which must always remain clearly legible regardless of how decorative the surrounding design becomes.
- Any glowing/animated text effects should be reserved for decorative headings only, never for critical data, legal text, or form labels.

## What This Phase Should Produce

- A fully documented design system (colors, typography, spacing, component language) that acts as the single source of truth for every future phase.
- Updated skeleton pages from Phase 0 now reflecting actual visual styling based on this design system — still without animation or live data, but now looking like genuine designed pages rather than structural placeholders.
- Two clearly distinct but token-consistent layout templates for homepage (Desktop version and Mobile version) demonstrating how the structural divergence will work.

## Explicitly Out of Scope for This Phase

Do not build the orbit/planet animation system yet, do not integrate any live data yet, do not build admin panel UI yet, do not write actual page content/copy yet (placeholder text is fine). This phase is purely about the visual design system and layout structure.

## End-of-Phase Checklist (must confirm all before proceeding to Phase 2)

- [ ] Complete color palette documented with named tokens and clear usage rules (background depths, gold accent, violet accent, success/negative colors)
- [ ] Complete typography scale documented, with clear separation between heading font, body font, and numerical/data font
- [ ] Spacing and grid system documented and applied consistently across skeleton pages
- [ ] Card, button, widget, form, and navigation component styles defined and visually consistent across all pages
- [ ] Desktop and Mobile homepage layouts both exist as separate structural templates, not one scaled version of the other
- [ ] Iconography style is consistent and avoids cheap/cliché astrology visuals
- [ ] Text contrast and legibility verified, especially for data and legal/disclaimer text
- [ ] Nothing in this phase violates rules or structure established in Phase 0
