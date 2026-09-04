# andres.dev

Personal portfolio of Andrés López. One static page: no framework, no runtime
dependencies, no build step. Serve the folder and it runs.

This file is for the next person who has to change the site — including a future
agent. It records decisions and their costs, not just commands.

## Quick path

```bash
python3 -m http.server 8000    # serve the repository root
pnpm test                      # comments + CSP + i18n + markup + payload
node test/form.test.js         # contact form behaviour
pnpm csp                       # regenerate _headers after an inline-block edit
pnpm i18n                      # regenerate es/index.html after editing index.html
pnpm e2e                       # browser + accessibility; needs pnpm install first
```

Expected: **21/21** markup, **9/9** payload, **2/2** form, **30/30** browser
(2 skipped). Use HTTP, not `file://`, to verify anchors and the form.

## Details

| Topic | Decision |
| --- | --- |
| No framework | One page, five sections, one form. A framework would ship more runtime than the site. Cost: markup is hand-duplicated; Spanish lives in `data-es`, not a catalogue. |
| No build step | Served from the repository root. Cost: no partials, no minification. |
| Two URLs | English is `/`. Spanish is `/es/`, generated. The language switch **navigates**; it does not swap text in place. |
| Formspree | The endpoint is a public mailbox id, not an email address. `form.js` refuses to post unless the URL matches the expected shape. |
| Turnstile | Wired, unconfigured. The `_gotcha` honeypot handles spam today. |
| Fonts | Four self-hosted variable `woff2` files. No Google Fonts, no third-party origin. |
| CV | Working files and PDF stay local. The public page does not list unpublished products. |
| Agent files | `.agents/`, `.claude/`, `openspec/`, and `AGENTS.md` stay local. |
| pnpm | Lockfile and CI use pnpm, not npm. |

## Checklist

- [ ] `pnpm test` is green after your edit
- [ ] `pnpm i18n` if you changed `index.html` (81 `data-es` attributes)
- [ ] `pnpm csp` if you changed an inline `<script>` or `<style>`
- [ ] Comments still say what the code does, one line, two at most (`pnpm comments`)
- [ ] `node script/validate-commit-attribution.js` — no `Co-Authored-By` / Claude-Session in history

## Before you touch the CSS

Two traps, both already paid for.

### Every partial must open its own `@layer`

`components.css` shipped for months without its wrapper. Unlayered styles outrank
every layer. If you add a partial and forget `@layer`, it wins everything.

### Reveals are animations, never transitions

`utilities` outranks `components`. A `transform` or `transition-delay` on the
reveal kills or delays card hover. The reveal uses `@keyframes reveal-rise` and
`animation-delay`. **Do not rewrite either as a transition.**

## Budgets

`test/stress-audit.js` fails when the payload grows. Ceilings, not targets.

| Budget | Limit |
| --- | --- |
| `index.html` | 42 KB |
| CSS total | 32 KB |
| `src/scripts/main.js` | 16 KB |
| Hero portrait, AVIF 1x | 40 KB |
| Self-hosted fonts | 160 KB |

The image budget exists because text budgets once passed while the hero shipped
2.68 MB.

## Tests

```bash
pnpm install --frozen-lockfile && pnpm e2e
```

Playwright at **1440px and 320px**. axe-core for WCAG 2.2 AA in dark, light,
Spanish, the open mobile drawer, and the 404 page.

Every browser test names a defect this site actually shipped:

| Test | Regression it guards |
| --- | --- |
| `project cards share one hover behaviour` | Layer demotion, then stagger, killed hover |
| `the mobile drawer opens over an opaque panel` | `backdrop-filter` on the header |
| `no horizontal overflow` | Manifesto clipped at 320px |
| `the contact form posts to the live endpoint` | Empty endpoint, every submit failed |
| `dark theme has no accessibility violations` | Muted text at 3.46:1 |
| `github is a real link and linkedin is inert` | GitHub was a `<button>` |

CI runs audits and this suite as separate jobs (`.github/workflows/ci.yml`).

## Languages and security

- Edit `index.html`, then `pnpm i18n`. Never edit `es/index.html` by hand.
- Paths are root-absolute (`/src/...`, `/assets/...`) so one document works from `/` and `/es/`.
- `_headers` is generated (`pnpm csp`). Hashed CSP, no `'unsafe-inline'`, no third-party hosts except Formspree on `form-action` / `connect-src`.
- Edit an inline block and the hash goes stale: production would block the page while local tests stayed green. `--check` runs in `pnpm test`.

## Layout

| Path | Role |
| --- | --- |
| `index.html` | The site |
| `404.html` | Error page |
| `og-image.jpg` | Social preview — regenerate from `script/og-image.html` |
| `es/index.html` | Generated Spanish page |
| `src/styles/` | `main.css` imports five partials in cascade order |
| `src/scripts/main.js` | Behaviour except form and theme |
| `src/js/form.js` | Contact form |
| `src/js/theme.js` | Theme switch |

| `test/` | Markup, payload, form, browser |

## Loose ends

| Item | Status |
| --- | --- |
| LinkedIn button | Unshipped: `hidden`, no `href`. To publish: add `href`, drop `hidden`. |
| `form.js` validation branch | Unreachable without `novalidate`; the browser blocks submit first. |

## Next step

Deploy this repository (Cloudflare Pages or Netlify, not GitHub Pages — `_headers`
must be honoured). Project repositories stay private until they are ready.

---

MIT
