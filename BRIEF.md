# Tai Lopez — AI Agents funnel · Creative brief v2

## What changed after client feedback (read first)
1. **Tai is the brand.** Tai must be the hero visual of every page: big, above the fold on
   desktop AND mobile. Nothing matters more. Use the real cutouts in `assets/tai/`.
2. **Simple, not technical.** The pages looked like SaaS product pages. Remove every technical
   visual: no workflow canvases, terminals, run logs, code, node graphs, dashboards, keyboard
   shortcuts (⌘K / Ctrl K), command palettes, "agent.sales" style labels, latency numbers.
   The process must feel effortless, almost magic: "You don't need to be technical.
   Tai's team shows you where AI agents make you money and save you time."
3. **Less content.** Short page. Fewer sections, fewer words, one idea per block.
4. **More visual social proof of Tai.** Real photos, real follower counts, the official
   "As seen on" logos. Make it feel like a famous person's page, not a startup's.
5. **One clean CTA.** Just the button. No secondary/ghost button next to it, no "or press...",
   no keyboard hints, no links competing with it. Under the button: one micro-trust line only.

## The offer (unchanged)
- How to make money with AI agents, and how to use AI agents to automate your business and life.
- Funnel goal: **book a free call** with Tai's team. One conversion goal only.
- CTA label: `Book a free call` (light variations allowed further down: "Book my free call").
- **Never mention** a masterclass, course, program price, or anything sold on the call.
- Language: English (US).

## Page structure (target: desktop ≤ ~4,000px tall, mobile ≤ ~6,500px)
1. **Nav:** wordmark (+ "with Tai Lopez") and the CTA button. Nothing else.
2. **Hero:** Tai big + eyebrow + headline + 1–2 line subheadline + CTA + micro-trust line
   ("Free · 1-on-1 · No tech skills needed"). Optional: 2–3 tiny plain-English "result" chips
   floating near Tai (e.g. "New lead answered in 2 min", "Your inbox, handled", "Call booked
   while you slept"). Plain language, no tech jargon, no numbers that look like income.
3. **Proof bar:** "As seen on" official logos + Tai's follower counts with platform icons.
4. **3 simple outcomes** (icon + 4–6 word title + one short line each):
   Make money with AI agents / Automate your business / Put your life on autopilot.
5. **Tai authority block:** second big Tai photo, 2–3 lines max about Tai, follower stats.
   Can be merged with the proof bar if it reads better.
6. **Testimonials:** 2–3 short quotes (placeholders, marked).
7. **FAQ (optional, max 3 questions)**, then **final CTA** block, then footer with disclaimer.
   "How the call works" can be a single line of 3 tiny steps (Book → Talk → Get your plan)
   inside the final CTA block rather than its own section.

## Verified social proof you MAY use
Source: Tai's official site tailopez.com, read Oct 2026. Put an HTML comment next to each use:
`<!-- Source: tailopez.com (Oct 2026). Confirm with Tai's team before launch. -->`
- Instagram 3,013,676 → "3M+" · Facebook 6,528,126 → "6.5M" · TikTok 1,100,000 → "1.1M"
  · X 652,382 → "650K" · combined → "11M+ followers".
- "As seen on" (as listed on tailopez.com): Forbes, London Business School, NBC, Bravo, TEDx, USC.
- Famous for the viral "Here in my garage" video (no view count).

## Claims you must NOT make
- No income claims or money figures, no "billionaire", no investing track record, no company
  acquisitions or brands (RadioShack, Pier 1, etc.), no student/customer counts, no
  "years investing". No invented press quotes. Testimonials stay placeholders, marked
  `<!-- PLACEHOLDER: replace with real testimonial -->`, with no dollar results.

## Assets (shared, referenced relatively from a direction: `../../assets/...`)
Tai cutouts, transparent WebP (PNG twins exist). They are LOW resolution: never display a
cutout larger than ~1.3× its native size. Cutouts from banners have straight cut edges at the
bottom/sides: always fade the bottom with
`mask-image: linear-gradient(to bottom, #000 70%, transparent)` (plus `-webkit-` prefix)
or hide the edges behind another element. Add light treatment (rim light, glow, shadow,
colored backdrop shape) so he sits IN the design, not pasted on.
Current look (long hair) — use these as primary, keep the same look within a page's hero:
- `assets/tai/tai-portrait.webp` 660×710 · serious, 3/4 view looking to the right, dark jacket,
  grey tee. Head-and-chest. Right/bottom edges cut. Best for dramatic/dark heroes.
- `assets/tai/tai-smile.webp` 513×437 · big warm smile, glasses, brown coat, facing camera,
  slightly up. Shoulders cut straight on both sides → fade bottom. Best "approachable" shot.
- `assets/tai/tai-laugh.webp` 447×445 · laughing, white textured shirt, turned to his left.
  Right shoulder edge cut → fade.
Older look (short hair) — only for a secondary block if useful:
- `assets/tai/tai-suit.webp` 540×436 · navy suit, calm, frontal.
- `assets/tai/tai-seated.webp` 500×423 · dark patterned blazer, frontal, serious.
- `assets/tai/tai-library.jpg` 500×447 · NOT a cutout: original photo, Tai seated in a leather
  chair in front of bookshelves. Good for an editorial/about card.
Press logos: `assets/press/{forbes,london-business-school,nbc,bravo,tedx,usc}-{white,ink,color}.png`
(~96px tall sources; show at 24–36px height; white for dark pages, ink for light pages).
Social icons (Simple Icons, CC0): `assets/icons/{instagram,facebook,tiktok,x,youtube}.svg`
(inline the path or use as mask; color them to fit the page).

## Booking flow (same on every page, vanilla JS)
Every CTA opens one accessible modal (focus trap, Esc closes, aria-modal, returns focus):
1. Qualify: first name, email, phone, plus ONE choice ("What do you want AI agents to do for
   you first?": Make money / Automate my business / Automate my life / Not sure yet).
2. Pick a slot: styled mock calendar (next 5 weekdays, a few times each), with the comment
   `<!-- Replace step 2 with the iClosed/Calendly embed -->`.
3. Confirmation ("You're booked", what happens next).
Progress indicator. Bottom sheet on mobile. Step 1 must feel effortless.

## Technical rules
- One `index.html` per direction, inline CSS + JS. External: Google Fonts only, plus the
  local shared assets above. No other CDNs, no hotlinked images.
- Mobile-first, flawless at 390px: no horizontal scroll, tap targets ≥ 44px, Tai visible in
  the first mobile screen together with the headline and CTA (or CTA right below).
  A sticky bottom CTA bar on mobile is welcome.
- Accessibility: landmarks, AA contrast, visible focus, `prefers-reduced-motion`, alt text
  on Tai images ("Tai Lopez").
- Motion: subtle and premium only.
- Screenshot helper: `NODE_PATH=$(npm root -g) node tools/shoot.mjs directions/<dir>/index.html <outDir>`
