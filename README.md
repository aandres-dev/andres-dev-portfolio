# andres.dev

Personal portfolio of Andrés López. One static page, no framework, no runtime
dependencies, no build step. Serve the folder and it runs.

The site claims its author directs AI rather than typing syntax by hand. That
claim is only worth anything if the result survives inspection, so this file
records the decisions and their costs — not just the commands.

---

## Quick path

```bash
python3 -m http.server 8000    # serve the repository root
npm test                       # comments + CSP + i18n + markup + payload
node test/form.test.js         # contact form behaviour
npm run csp                    # regenerate _headers after editing an inline block
npm run i18n                   # regenerate es/index.html after editing index.html
npm run e2e                    # browser + accessibility, needs npm ci first
```

Expected: **21/21** markup, **8/8** payload, **2/2** form, **30/30** browser.

`file://` mostly renders, but anchors and the form behave differently. Use HTTP
to verify anything.

---

## Comment style

**A comment says what the code does, in one line. Two at most.**

```bash
npm run comments    # runs inside npm test and in CI
```

Not why, not the history, not the trade-offs weighed. Those have somewhere
better to live: the README has room, and `git log` already holds the reasoning
in full. `script/validate-comments.js` fails the build on any comment block
over two lines, across HTML, CSS and JS.

---

## Before you touch the CSS

Two traps, both already paid for. Each cost a visible regression.

### 1. Every partial must open its own `@layer`

```css
/* main.css */
@layer reset, tokens, layout, components, utilities;
```

`components.css` shipped for months **without its wrapper**. Unlayered styles
outrank every layer, so those rules quietly beat the declared order until
someone noticed. If you add a partial and forget the wrapper, it wins
everything and nothing looks wrong until it does.

### 2. Reveals are animations, never transitions

`utilities` outranks `components`. Anything `transition-*` or `transform` that
utilities declares beats `.spotlight-card` and disables its hover.

| Written as | Result |
| --- | --- |
| `transform: translateY(0)` | Pinned all 21 cards flat, hover lift dead |
| `transition-delay: 80ms` (stagger) | Hover fired 80–160ms late on staggered cards |
| `@keyframes` + `animation-delay` | Independent system, cannot collide |

The reveal uses `@keyframes reveal-rise` and the stagger is an
`animation-delay`. **Do not rewrite either as a transition.**

---

## Decisions

| Topic | Decision and cost |
| --- | --- |
| No framework | One page, five sections, one form, no app state. A framework would ship more runtime than the whole site. Cost: markup is duplicated by hand and translations live in `data-es` attributes, not a message catalogue. Fine at this size, not past it. |
| No build step | Served straight from the repository root. Cost: no partials, no minification. |
| OKLCH tokens | Complete light and dark palettes in `tokens.css`. Nothing outside it hardcodes a colour. |
| Image crops | Each variant is cut to the ratio its CSS renders, so the browser never downloads pixels `object-fit` will discard. Portfolio `4:5` at 480w/892w, CV square, both at `object-position: center 18%`. |
| Formspree | Endpoint is public by design — a mailbox id, not an address. `form.js` refuses to submit unless it matches the expected shape, so a missing endpoint fails loudly instead of faking delivery. |
| Turnstile | Wired but unconfigured. The `_gotcha` honeypot, which Formspree honours natively, handles spam today. Pass a `siteKey` if that stops being true. |

---

## Budgets

`test/stress-audit.js` fails when the payload grows.

| Budget | Limit | Now |
| --- | --- | --- |
| `index.html` | 42 KB | 40.3 KB |
| CSS total | 32 KB | 30.6 KB |
| `src/scripts/main.js` | 16 KB | 15.8 KB |
| Hero portrait, AVIF 1x | 40 KB | 17.5 KB |

**Why the image budget exists:** the text budgets passed comfortably while the
hero portrait shipped 2.68 MB — roughly 32× every file they measured, combined.
A budget that ignores the largest asset measures nothing.

**Why HTML is 42 KB and CSS is 32 KB, not tighter:** the page carries its
Spanish translation inline across 94 `data-es` attributes, and the CSP forced
seven `style=""` attributes out of the markup into classes. Both limits were
originally set wherever the files already sat, which is a ceiling, not a target.

---

## Accessibility

Measured, not assumed. Contrast computed from the OKLCH tokens, reflow checked
in a real 320px viewport.

- [ ] All text meets WCAG AA in both themes — muted token at 5.69:1 on the dark
      canvas, 4.87:1 on the lightest dark surface
- [ ] Content reflows at 320px with no clipping and no horizontal scroll
- [ ] Skip link, visible focus, `aria-current` on the active section
- [ ] `prefers-reduced-motion` disables scramble, tilt, particle canvas and
      magnetic buttons
- [ ] Form fields carry labels, `autocomplete` and `maxlength`; status is
      announced through `role="status"`

---

## Browser and accessibility tests

```bash
npm ci && npm run e2e
```

Playwright drives real Chromium at **1440px and 320px**, and axe-core scans for
WCAG 2.2 AA violations in dark, light, Spanish, the open mobile drawer and the
404 page. `playwright.config.js` reuses a system Chromium when one exists, so a
local run downloads no browsers.

**Every test names the defect it would have caught.** These are regressions
this site actually shipped, not coverage for its own sake:

| Test | Regression |
| --- | --- |
| `project cards share one hover behaviour` | Layer demotion killed the hover lift, then the stagger delayed it 80–160ms |
| `the mobile drawer opens over an opaque panel` | `backdrop-filter` on the header left the drawer with no background |
| `no horizontal overflow` | A grid item clipped the manifesto text at 320px |
| `the contact form posts to the live endpoint` | The endpoint shipped empty and every submission reported failure |
| `dark theme has no accessibility violations` | Muted text sat at 3.46:1 on 14px body copy |
| `github is a real link and linkedin is inert` | GitHub was a `<button>` calling `window.open` |

Both were confirmed to fail on purpose before being trusted: reverting the
stagger fix produces `Expected "0s,0s,0s" / Received "0.08s"`, and reverting the
contrast token produces `color-contrast (serious)`.

CI runs the dependency-free audits and this suite as separate jobs
(`.github/workflows/ci.yml`).

---

## Two languages, two URLs

English is `/`. Spanish is `/es/`, generated from `index.html`:

```bash
npm run i18n                       # write es/index.html
node script/build-i18n.js --check  # runs inside npm test
```

The Spanish text lives in `data-es` attributes and the switch used to apply it
in the browser. That is enough for a visitor and useless for a crawler: with no
distinct URL, Google indexes English only, and the `hreflang` advertising
Spanish at `/` was an unbacked claim. Both pages now declare the same, honest
set.

Because each language is a real URL, **the switch navigates rather than
swapping text** — swapping would leave a Spanish page sitting at the English
canonical, the exact mismatch this build removes. That also made the switcher
smaller: JS dropped to 15.4 KB.

**Edit `index.html` and the Spanish copy goes stale**, so `--check` runs in the
suite. Head strings have no element content to translate, so the four `<meta>`
and `<title>` strings are listed in `script/build-i18n.js`; the check fails when
an English original no longer matches.

Paths are root-absolute (`/src/...`, `/assets/...`) so one document works from
both directories.

---

## Security headers

`_headers` is generated, never hand-edited:

```bash
npm run csp             # regenerate
node script/csp.js --check   # runs inside npm test
```

The page keeps two inline blocks on purpose — a script that applies the stored
theme before first paint, and the mobile navigation styles. Both are allowed by
**SHA-256 hash**, not `'unsafe-inline'`, so anything injected later is still
blocked.

**Edit an inline block and the hash goes stale.** The deployed page would then
be blocked by its own policy while every local check stayed green, so
`--check` runs in the suite and fails loudly instead.

Writing the policy caught a bug no test had: seven `style=""` attributes that
production would have dropped silently, leaving the page misaligned with
nothing to explain why. `form.test.js` now also asserts the contact form
carries no inline handler, so the policy cannot quietly regress.

---

## Layout

| Path | Role |
| --- | --- |
| `index.html` | The site. The only page. |
| `404.html` | Error page |
| `og-image.jpg` | Social preview — regenerate from `script/og-image.html` |
| `es/index.html` | Generated Spanish page — never edit, run `npm run i18n` |
| `src/styles/` | `main.css` imports five partials in cascade order |
| `src/scripts/main.js` | All behaviour except the form and the theme |
| `src/js/form.js` | Contact form. The only module with behaviour tests. |
| `src/js/theme.js` | Theme switch, View Transitions animation |
| `cv/` | Editorial CV, HTML source and generated PDF |
| `test/` | Markup audit, payload audit, form behaviour |

**What `form.test.js` covers** — the two failures that are easy to write and
hard to notice: a Turnstile expiry callback must not release the submit lock
mid-request, and a 429 is a generic provider failure, not an exhausted quota.

---

## Loose ends

Listed on purpose. Undocumented dead code is worse than documented dead code.

| Item | Status |
| --- | --- |
| LinkedIn button | Deliberately unshipped. Carries `hidden`, has no `href`, so it is inert and out of the tab order. To publish: add `href`, remove `hidden`. |
| `form.js` validation branch | Unreachable in a browser. With no `novalidate`, constraint validation refuses the submit and the event never fires, so `setStatus('validation')` never runs. Add `novalidate` if the custom message is wanted. |

---

## Next step

Publish the project repositories and link them from each card in `index.html`.
Nothing else on this list changes how the site is judged as much.

---

MIT
