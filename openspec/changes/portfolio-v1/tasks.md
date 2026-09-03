# Tasks: Portfolio V1

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 900–1400 authored |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Shell, tokens, bilingual content | PR 1 | `npm run validate && npm run build` | ES/EN switch keeps hash | `src/index.html`, tokens, JS, header |
| 2 | Sections and approved assets | PR 2 | `npm run check` | Contrast/reflow; approved assets only | Phase 2 sections, `src/css/site.css`, `src/assets/images/*` |
| 3 | Contact + provider/deploy | PR 3 | `npm run check` | Formspree+Turnstile staging; Pages `dist/` | `src/sections/contact.html`, `src/js/form.js` |

Do not edit `script/build.js` (read-only) or `script/validate.js` (read-only).

## Phase 1: Shell, Tokens, Bilingual Content

- [x] 1.1 Create `src/index.html` ES shell, metadata, CSS/JS entries, header `@include`. <!-- sdd-owner: implementation -->
- [x] 1.2 Create `src/css/tokens.css` (Dark Void, Gluon, Slate, Dusty Grey, Snow, Liquid Lava). <!-- sdd-owner: implementation -->
- [x] 1.3 Create `src/js/content.js` keyed `es`/`en` copy, labels, alt, notices; no invented claims. <!-- sdd-owner: implementation -->
- [x] 1.4 Create `src/js/language.js` for i18n attrs, `?lang=en` plus hash, `lang`/`hreflang`; ES fallback. <!-- sdd-owner: implementation -->
- [x] 1.5 Create `src/js/main.js` to bootstrap language (and later form). <!-- sdd-owner: implementation -->
- [x] 1.6 Create `src/sections/site-header.html` with `nav`, language control, `ANDRES.DEV` and no domain claim. <!-- sdd-owner: implementation -->
- [x] 1.7 Run `npm run validate` and `npm run build`; each source HTML file ≤200 lines. <!-- sdd-owner: implementation -->

## Phase 2: Sections and Approved Assets

- [x] 2.1 Create `src/sections/hero.html`, `src/sections/story.html`, `src/sections/method.html` and `@include` them in `src/index.html`: in-training identity, directed AI, hire-first CTA; no unearned claims. <!-- sdd-owner: implementation -->
- [x] 2.2 Create `src/sections/case-studies.html` and `@include` it in `src/index.html`: RondApp prototype/pilot-ready flagship, AccessCampus360 second; omit unconfirmed details. <!-- sdd-owner: implementation -->
- [x] 2.3 Create `src/sections/learning.html` and `@include` it in `src/index.html` with ControlCampus-360 as learning history only. <!-- sdd-owner: implementation -->
- [x] 2.4 Create `src/sections/footer.html` and `@include` it in `src/index.html`; one page; no extra pages, demos, testimonials, metrics, or skill bars. <!-- sdd-owner: implementation -->
- [x] 2.5 Create `src/css/site.css` for asymmetric dark layout, focus, reduced motion, contrast, and reflow. <!-- sdd-owner: implementation -->
- [ ] 2.6 Add portrait under `src/assets/images/` only after separate source and treated-owner approval; crop/color/compression only. <!-- sdd-owner: implementation -->
- [ ] 2.7 Add screenshots under `src/assets/images/` only after owner and sanitization approval; withhold failures; keep repos private. <!-- sdd-owner: implementation -->
- [ ] 2.8 Set width/height, `alt`, and compression on images in `src/sections/hero.html` and `src/sections/case-studies.html`; lazy-load except hero portrait. <!-- sdd-owner: implementation -->
- [x] 2.9 Run `npm run check`; confirm `.gitignore` (read-only) still ignores dist. <!-- sdd-owner: implementation -->

## Phase 3: Contact Enhancement and Release

- [x] 3.1 Create `src/sections/contact.html` and `@include` it in `src/index.html` with labels, `required`, error IDs, `aria-describedby`, public Formspree action, bilingual 30-day notice. <!-- sdd-owner: implementation -->
- [x] 3.2 Create `src/js/form.js` for resubmit lock, live status, success-clear, invalid focus, preserved values on errors. <!-- sdd-owner: implementation -->
- [x] 3.3 Wire Turnstile; never commit Target Email or secret; add bilingual recovery copy in `src/js/content.js`. <!-- sdd-owner: implementation -->
- [x] 3.4 Verify keyboard, focus, no-JS submit, reduced motion, and ES/EN states on `src/sections/contact.html` and `src/js/form.js`. <!-- sdd-owner: implementation -->
- [ ] 3.5 Staging-verify Formspree+Turnstile success, validation, expiry, rejection, retry, quota; inspect for email/secrets. <!-- sdd-owner: implementation -->
- [ ] 3.6 Run `npm run check`; confirm Pages Free serves `dist/` (read-only) with no Pages Function. <!-- sdd-owner: implementation -->

## Parent Actions

- [x] Ask chain strategy (`stacked-to-main` vs `feature-branch-chain` vs `size:exception`) before apply. <!-- sdd-owner: parent -->
- [ ] Start or reuse bounded review after each work-unit PR. <!-- sdd-owner: parent -->
