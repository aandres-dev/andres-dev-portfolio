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
npm test                       # markup audit + payload audit
node test/form.test.js         # contact form behaviour
```

Expected: **21/21** markup checks, **8/8** payload checks, **2/2** form tests.

`file://` mostly renders, but anchors and the form behave differently. Use HTTP
to verify anything.

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
| `index.html` | 42 KB | 41.0 KB |
| CSS total | 30 KB | 29.9 KB |
| `src/scripts/main.js` | 16 KB | 15.8 KB |
| Hero portrait, AVIF 1x | 40 KB | 17.5 KB |

**Why the image budget exists:** the text budgets passed comfortably while the
hero portrait shipped 2.68 MB — roughly 32× every file they measured, combined.
A budget that ignores the largest asset measures nothing.

**Why HTML is 42 KB, not tighter:** this page carries its Spanish translation
inline across 94 `data-es` attributes. That is content, not slack.

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

## Layout

| Path | Role |
| --- | --- |
| `index.html` | The site. The only page. |
| `404.html` | Error page |
| `og-image.jpg` | Social preview — regenerate from `script/og-image.html` |
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
| `script/build.js` | Unused. `index.html` has no `@include`, no `dist/` is produced. |
| `src/sections/contact.html` | Referenced by nothing. The form is inline in `index.html`. |
| LinkedIn button | Deliberately unshipped. Carries `hidden`, has no `href`, so it is inert and out of the tab order. To publish: add `href`, remove `hidden`. |
| `hreflang` | Advertises English and Spanish at the same URL. Spanish is applied client-side, so no second URL exists. Either serve a real `/es/` or drop the tags. |

---

## Next step

Publish the project repositories and link them from each card in `index.html`.
Nothing else on this list changes how the site is judged as much.

---

MIT
