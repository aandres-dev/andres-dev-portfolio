# andres.dev

Personal portfolio of Andrés López, built as a static site with no framework
and no runtime dependencies.

The site states that its author directs AI rather than typing syntax by hand.
That claim only means something if the result holds up to inspection, so this
README records what was decided and why, not just how to run it.

**Stack:** HTML, CSS and JavaScript. No build step, no bundler, no npm packages
shipped to the browser. Deployed as static files. Contact form handled by
Formspree.

---

## Why vanilla

A single page with five sections, one form and no application state does not
need a framework. Choosing one would have meant shipping a runtime larger than
the entire site to solve problems this site does not have.

What that decision costs: no component model, so shared markup is duplicated by
hand, and translations live in `data-es` attributes rather than in a message
catalogue. Both are acceptable at this size and would not be past it.

The trade is visible in the numbers. Every byte the browser parses:

| Asset | Size |
| --- | --- |
| HTML | ~41 KB |
| CSS | ~30 KB |
| JavaScript | ~16 KB |
| Hero portrait (AVIF, 1x) | ~17 KB |

---

## Running it

There is no build. Serve the repository root over HTTP and open it:

```bash
python3 -m http.server 8000
```

`file://` also mostly works, but in-page anchors and the form behave
differently, so HTTP is the honest way to check anything.

### Tests

```bash
npm test              # markup audit + performance audit
npm run test:markup   # semantics, metadata, i18n coverage
npm run test:stress   # payload budgets, animation safety, observer cleanup
node test/form.test.js
```

`form.test.js` covers the two behaviours that are easy to get wrong and hard to
notice: a Turnstile expiry or error callback must not release the submit lock
while a request is in flight, and a 429 is a generic provider failure rather
than a signal that a quota is exhausted.

---

## Layout

```
index.html            the site; the only page
404.html              error page
og-image.jpg          social preview (regenerate from script/og-image.html)
src/styles/           main.css imports the five partials, in cascade order
src/scripts/main.js   all behaviour except the form and the theme
src/js/form.js        contact form; the only module with behaviour tests
src/js/theme.js       theme switch, with a View Transitions animation
cv/                   editorial CV, HTML source and generated PDF
test/                 markup audit, stress audit, form behaviour
script/               build.js and validate.js — see Loose ends
```

---

## CSS architecture

Styles are organised with `@layer`, declared once in `main.css`:

```css
@layer reset, tokens, layout, components, utilities;
```

Every partial must open with its own `@layer` block. This matters more than it
looks: `components.css` shipped for months without its wrapper, which left every
component rule **unlayered**. Unlayered styles outrank all layers, so those rules
silently beat the declared order until it was noticed and fixed.

Colours are OKLCH tokens with complete light and dark palettes. Nothing outside
`tokens.css` hardcodes a colour.

### Reveal animations use `translate`, not `transform`

Scroll reveals live in the `utilities` layer, which outranks `components`.
Writing `transform` there pins every revealed element flat and cancels the hover
lift on `.spotlight-card`. `translate` is a separate property that composes with
`transform` instead of replacing it, so entrance and hover animate
independently. Do not convert these back.

---

## Performance budgets

`test/stress-audit.js` fails the build when the payload grows:

| Budget | Limit |
| --- | --- |
| `index.html` | 42 KB |
| CSS total | 30 KB |
| `src/scripts/main.js` | 16 KB |
| Hero portrait (AVIF 1x) | 40 KB |

The image budget exists because the text budgets alone were misleading: they
passed comfortably while the hero portrait shipped 2.68 MB, roughly 32× the
weight of every file they measured combined. A budget that ignores the largest
asset on the page is not measuring anything useful.

The HTML limit is 42 KB rather than something tighter because this page carries
its Spanish translation inline across 93 `data-es` attributes. That is content.

### Images

Each variant is cropped to the ratio its CSS actually renders, so the browser
never downloads pixels that `object-fit` will discard:

- Portfolio: `4:5`, offset 15px from the top, at 480w and 892w
- CV: square, offset 55px, matching `object-position: center 18%`

Served as AVIF with WebP and JPEG fallbacks.

---

## Accessibility

Verified rather than assumed: contrast ratios computed from the OKLCH tokens,
and reflow measured in a real 320px viewport.

- All text meets WCAG AA in both themes; the muted token sits at 5.69:1 on the
  dark canvas and 4.87:1 on the lightest dark surface
- Content reflows at 320px with no clipping and no horizontal scroll
- Skip link, visible focus states, and `aria-current` on the active section
- `prefers-reduced-motion` disables the scramble, tilt, particle canvas and
  magnetic buttons
- Form fields carry associated labels, `autocomplete` and `maxlength`; status
  messages are announced through `role="status"`

---

## Contact form

Posts to Formspree. The endpoint is public by design — it is a mailbox id, not
a destination address, and the real address is never exposed in the page.

`src/js/form.js` refuses to submit unless the endpoint matches the expected
Formspree shape, so a missing or placeholder endpoint fails loudly in
development instead of silently pretending a message was delivered.

Spam is filtered by a `_gotcha` honeypot, which Formspree honours natively.
Turnstile is wired but intentionally unconfigured; it can be enabled by passing
a `siteKey` if spam becomes a real problem.

---

## Loose ends

Recorded because undocumented dead code is worse than documented dead code.

- `script/build.js` inlines `@include` directives into `dist/`. `index.html`
  contains no `@include`, no `dist/` is produced, and the site is served from
  the repository root. The script is currently unused.
- `src/sections/contact.html` is referenced by nothing. The contact form lives
  inline in `index.html`.
- The LinkedIn button is present in the markup and deliberately not shipped: it
  carries `hidden` and has no `href`, so it is inert and outside the tab order.
  Publishing it means adding the `href` and removing `hidden`.
- `hreflang` currently advertises English and Spanish at the same URL. The
  Spanish translation is applied client-side, so there is no separate URL to
  point at. Either the site serves a real `/es/`, or those tags should go.

---

## License

MIT
