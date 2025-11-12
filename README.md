SHE IS AI — Ethics Training Landing Page

Overview
- Single-page, accessible landing experience built from the PRD in `Ethic Landing Page PRD.md`.

Quick Start
- Open `index.html` directly in a browser, or
- Serve locally using any static server (e.g., `python -m http.server`).

Structure
- `index.html` — Semantic HTML for all sections
- `styles.css` — Design tokens, layout, responsive styles, focus states
- `script.js` — Accessible FAQ accordion, keyboard support, minor enhancements
- `assets/` — Placeholder for hero/background images (optional)

Assets
- Place hero images:
  - `assets/hero-desktop.webp` (1920×1080)
  - `assets/hero-mobile.webp` (768×1024)
- Optional celebration background: `assets/celebration.webp`
- If not present, hero gracefully falls back to gradient overlay.

Accessibility
- WCAG 2.1 AA contrast targets met
- Skip link, semantic landmarks, heading hierarchy
- Keyboard-friendly controls and visible focus
- FAQ uses button+region with `aria-expanded` and `hidden` panels
- Respects `prefers-reduced-motion`

Registration Integration
- CTA buttons currently link to `#registration-cta` as placeholders.
- Provide your endpoint or registration URL and update `href` values in `index.html`.

Video
- YouTube embed configured without autoplay and with captions enabled (`cc_load_policy=1`).
- Replace the `src` with your final video URL.
- Include a transcript PDF link where indicated.

Customization
- Colors are defined as CSS variables in `styles.css` per the PRD.
- Update schedule dates/times in the `<dl>` elements under "Choose Your Session".

Deploy
- Host `index.html`, `styles.css`, `script.js`, and any assets on static hosting (GitHub Pages, Netlify, Vercel, S3, etc.).

Supabase Backend Docs
- `docs/supabase/SETUP.md` — End-to-end setup, auth, password reset, env vars
- `docs/supabase/SCHEMA.md` — Full SQL schema and RLS (Markdown)
- `docs/supabase/schema.sql` — Copy-pasteable SQL equivalent
- `docs/supabase/API_EXAMPLES.md` — Client examples (auth, register, start/complete assessment)
