# Design: Portfolio V1

## Technical Approach

Deliver one static, dark-first ES/EN portfolio through the existing include assembler: semantic source partials in `src/` become `dist/index.html`; native CSS and ES modules provide styling and progressive enhancement. This implements the five delta specs without a framework, extra pages, public repositories, or a Pages Function.

## Architecture Decisions

| Decision | Options / tradeoff | Choice and rationale |
|---|---|---|
| Composition | Framework rebuild improves abstractions but adds migration and bundle risk. | Keep `script/build.js` includes and small semantic HTML partials. It matches the repository and keeps every source HTML file at or below 200 physical lines. |
| Language state | Server routes duplicate pages; client-only text can fail without JS. | Ship Spanish semantic fallback in HTML; `content.js` owns equivalent ES/EN strings. `?lang=en` plus the current hash is the shareable state; `language.js` switches in place and invalid/missing state falls back to ES. |
| Form boundary | Pages Function enables custom control but violates scope; native provider submission limits UI feedback. | Submit directly to Formspree Free with Turnstile configured in Formspree. JS enhances state handling; native form submission remains the no-JS fallback. The Formspree endpoint and Turnstile site key are public configuration; the Target Email and Turnstile secret remain dashboard-only. |
| Visual system | Generic dark gradients reduce distinction. | Use the approved asymmetric cinematic system: Dark Void base; Gluon, Slate, and Dusty Greys for depth; Snow for text; Liquid Lava as the sole accent. `ANDRES.DEV` is a visual name only, never a domain claim. |
| Public assets | Fast publication risks identity and data disclosure. | Include only owner-approved final portrait and screenshot assets. Preserve identity through crop/color/compression only; reject AI replacement or alteration. Keep repositories private and withhold any asset failing secret, PII, location, document-data, or operational-security review. |

## Boundaries, Ownership, and Data Flow

`index.html` owns document metadata, CSS/module entry points, and include markers. Partials own landmarks: `site-header`, `hero`, `story`, `method`, `case-studies`, `learning`, `contact`, and `footer`. `content.js` owns approved copy, labels, notices, and status strings; it must not invent claims. CSS owns tokens, responsive layout, focus, and reduced-motion rules. JS owns language, navigation enhancement, and form state.

```text
ES fallback HTML + partials -> build.js -> dist/index.html -> Cloudflare Pages
                                    |
content.js <- language.js (?lang + #section) <- visitor
contact form -> Turnstile token -> Formspree -> private Target Email
```

Form sequence: browser validation first; then `form.js` intercepts only enhanced submits, disables duplicate submission, posts to Formspree, and updates a `role="status"`/`aria-live` region. Success clears only after acceptance. Invalid fields focus the first invalid control; delivery error and Turnstile error/expiry preserve values, announce recovery, and expose retry/reset. A 50-submission monthly limit, network failure, provider rejection, expired/single-use token, or unavailable widget fails safely with non-sensitive bilingual guidance, never an email address. The bilingual privacy notice states Formspree processing and 30-day account retention.

## File Changes

| File | Action | Description |
|---|---|---|
| `src/index.html`, `src/sections/*.html` | Create | ES fallback shell and bounded semantic section partials. |
| `src/css/tokens.css`, `src/css/site.css` | Create | Palette, typography, asymmetric responsive layout, focus, and reduced-motion styles. |
| `src/js/content.js`, `src/js/language.js`, `src/js/form.js`, `src/js/main.js` | Create | Translation contract, URL/hash language state, enhanced contact lifecycle, bootstrap. |
| `src/assets/images/*` | Create | Optimized approved portrait and sanitized case-study screenshots only. |
| `script/build.js`, `script/validate.js` | Unchanged | Existing assembly and semantic/source-line validation remain authoritative. |

## Interfaces / Contracts

- Translation entries are keyed by semantic element/state and contain both `es` and `en`; all visible copy, alternative text, form labels, privacy notice, and states require parity.
- `data-i18n`, `data-i18n-attr`, and stable section IDs bind HTML to translation entries. `lang` and `hreflang`/language-control attributes reflect active state.
- Contact fields use native labels, `required`, named controls, inline error IDs, and `aria-describedby`. Formspree action is configurable only as its public endpoint; neither secrets nor Target Email enter source, `dist/`, screenshots, or logs.
- Images declare width/height, descriptive `alt`, modern compression, and lazy loading except the preloaded hero portrait. Screenshots are published only with recorded owner and sanitization approval; final portrait approval is separate from source approval.

## Testing, Privacy, and Release

| Layer | Verification |
|---|---|
| Static | `npm run check`; confirm every source HTML file is <=200 lines and `dist/` is ignored. |
| Browser/manual | ES/EN parity and hash retention; keyboard/focus/reflow; contrast; no-JS form fallback; reduced motion; responsive images and no horizontal scrolling. |
| Provider/deployment | Test Formspree + Turnstile success, validation, expiry, rejection, retry, and quota messaging with non-production data; inspect published source for email/secrets; verify Pages serves `dist/`. |

Before release, owner approves final portrait and each sanitized screenshot; verify both repositories remain private. Do not add analytics or third-party embeds without a privacy review. Rollback is unpublish Pages, disable Formspree, and remove unpublished assets/source; Formspree history may persist for 30 days.

## Traceability and Review Slices

| Spec | Design coverage |
|---|---|
| `bilingual-static-portfolio` | Assembly, parity, fallback, semantics, responsive release checks. |
| `professional-positioning` | Copy ownership and one-page, truthful claim boundaries. |
| `visual-identity` | Approved palette, provisional mark, portrait approval gate. |
| `project-evidence` | Two studies, history-only reference, private/sanitized asset gate. |
| `private-contact` | Direct Formspree/Turnstile flow, privacy, accessible recovery states. |

Likely 400-line review slices: (1) shell, tokens, bilingual content; (2) sections and approved assets; (3) contact enhancement plus provider/deployment verification. Confirm the forecast in `sdd-tasks` before apply.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No data migration required. Publish only after approval gates and staging verification pass.

## Open Questions

- [ ] Confirm final public wording where current evidence still requires owner confirmation for AccessCampus360 details.
- [ ] Obtain separate owner approval for the final treated portrait and every proposed screenshot.
