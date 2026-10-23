# Tai Lopez — AI Agents funnel · Creative brief

## The offer
- **What:** how to make money with AI agents, and how to use AI agents to automate your
  business and your personal life (process, automate, delegate "everything").
- **Who sells it:** Tai Lopez (entrepreneur, investor, online business educator).
- **Funnel goal:** book a **free call** with Tai's team (closers). One conversion goal only.
- **Primary CTA label:** `Book a free call` (small variations allowed in secondary spots,
  e.g. "Book your free call", "Claim my free call"). Every CTA opens the same booking flow.
- **Never mention** the masterclass, a course, a price, or any product sold on the call.
  The call is framed as a free 1-on-1 **AI Agent strategy call** with an advisor from Tai's team.
- Language: **English** (US audience).

## Core messaging (adapt tone and headline to your direction)
- Promise: AI agents are the biggest leverage shift since the internet. On a free call,
  Tai's team shows you exactly where agents can **make you money** and **give you your time back**.
- Three pillars:
  1. **Make money with AI agents.** New income streams, agent-powered services, offers you can sell.
  2. **Automate your business.** Leads, follow-ups, support, content, admin, ops, running 24/7.
  3. **Put your life on autopilot.** Inbox, calendar, research, finances, learning.
- What you walk away with from the call (free):
  - Your #1 money opportunity with AI agents, given your skills and situation.
  - The first 3 processes in your business or life to hand to agents.
  - A clear, step-by-step game plan. No tech background needed.
- Who it's for: entrepreneurs, business owners, operators, freelancers, ambitious
  career-builders who want leverage. Not for: get-rich-quick seekers, people who won't act.

## Page structure: SHORT. Aim for ~4–6 desktop screens, 7–9 blocks max.
1. Minimal nav: offer wordmark + "with Tai Lopez" + CTA button. No other links needed.
2. Hero: eyebrow, headline, subheadline, primary CTA, micro-trust line under the button
   (e.g. "Free · 1-on-1 · No obligation"), and a strong visual (product-style agent UI,
   VSL video placeholder with play button, or Tai portrait slot, by direction).
3. Proof strip (placeholder logos / "as seen on" / stat row).
4. The 3 pillars.
5. What happens on the call / how it works (3 steps: Book → Call → Game plan).
6. About Tai (short, with portrait slot) and/or who it's for.
7. Testimonials (2–3, placeholder).
8. FAQ (4–5 short questions, accordion).
9. Final CTA block + footer with earnings disclaimer, privacy, terms.

## Booking flow (same behavior on every page, vanilla JS)
Every CTA opens a modal (accessible: focus trap, Esc closes, aria-modal):
1. Step 1, short qualification form: first name, email, phone, plus ONE select
   ("What do you want AI agents to do for you first?": Make money / Automate my business /
   Automate my life / Not sure yet). Basic validation.
2. Step 2, pick a slot: a styled mock calendar (next 5 weekdays, a few time slots).
   Add an HTML comment: `<!-- Replace step 2 with the iClosed/Calendly embed -->`.
3. Step 3, confirmation ("You're booked", what happens next).
Include a progress indicator. Step 1 must feel effortless.

## Honesty / placeholders
- Testimonials, logos, stats and Tai numbers are **placeholders**. Mark each one in the
  HTML with `<!-- PLACEHOLDER: replace with real ... -->`. Keep them plausible and modest;
  no invented income claims, no fake "$X/month" results.
- Tai photo: a designed placeholder slot (no broken `<img>`), labelled e.g. "Tai Lopez portrait".
- Footer: earnings disclaimer ("Results are not typical... no guarantee of income"),
  "Not affiliated with Meta/Google" style line is optional.

## Technical rules
- One self-contained `index.html` per direction (inline CSS + JS). No build step.
- External: Google Fonts only. Icons as inline SVG. No other CDNs, no images from the web.
- Mobile-first and responsive: 390px wide must look designed, not squeezed.
  No horizontal scroll. Tap targets ≥ 44px. Sticky/visible CTA on mobile is welcome.
- Accessibility: semantic landmarks, contrast AA, visible focus states, `prefers-reduced-motion`.
- Motion: tasteful, purposeful (subtle reveal, hero UI animation). No jank, no layout shift.
- Performance: no heavy libraries, fonts with `display=swap`.
- Screenshot helper: `NODE_PATH=$(npm root -g) node tools/shoot.mjs directions/<dir>/index.html <outDir>`
  (desktop 1440 + mobile 390, full page + fold, reports console errors and horizontal overflow).
