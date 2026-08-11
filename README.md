# کیا تک (Kia Tech) — Landing Page

A responsive, dependency-free Persian (RTL) landing page built with plain HTML, CSS, and JavaScript.

## Run

Open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure: hero, features, steps, testimonials, pricing, FAQ, CTA, footer.
- `styles.css` — design tokens, layout, components, responsive and reduced-motion rules.
- `script.js` — sticky header, mobile nav, scroll reveals, animated counters, typed terminal, pricing toggle, email validation.

## Design tokens

All colors live as CSS custom properties in `:root` (`styles.css`):

| Token | Value | Usage |
| --- | --- | --- |
| `--orange` | `#EF5603` | primary accent |
| `--orange-light` | `#F25A01` | highlights, prices, links on dark |
| `--orange-dark` | `#ED5301` | gradients, hover states |
| `--navy-darkest` | `#030E18` | page background, text on orange |
| `--navy` | `#111C27` | alternate sections, footer |
| `--navy-light` | `#1A2631` | raised surfaces, card hover |
| `--black` | `#000000` | reserved |
| `--white` | `#FEFEFE` | primary text |
| `--gray-lightest` | `#F5F5F5` | light surfaces, terminal text |
| `--gray` | `#D3CDCA` | muted text, borders |

Semantic aliases (`--bg`, `--surface`, `--border`, `--text`, `--muted`, `--brand`, `--on-brand`) map to the palette, so re-theming only requires editing `:root`.

## Notes

- Language is Persian (`lang="fa" dir="rtl"`); layout uses logical properties (`margin-inline`, `inset-inline`) so RTL mirrors correctly.
- Font is **Vazirmatn**, loaded from a CDN with a `Tahoma`/system fallback. To self-host, drop the font files in `fonts/` and replace the CDN `<link>` in `index.html` with a local `@font-face`.
- Numbers render with Persian digits via a helper in `script.js`.
- Contrast: body and muted text exceed 9:1 on all navy backgrounds; orange buttons use dark navy text (~5.4:1) to meet WCAG AA.
- Content is placeholder copy; replace plans, testimonials, and logos as needed.
