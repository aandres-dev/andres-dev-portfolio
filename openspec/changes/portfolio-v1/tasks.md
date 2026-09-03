# Tasks: Portfolio V1

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 350–650 recovery authored |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Tracker → PR 1 → PR 2 → PR 3 |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Planning only: create no branches or PRs. No `size:exception` is approved; stop and request one if a cohesive slice exceeds 400 lines.

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Contact safety + regression tests | PR 1 (base: feature/tracker) | `node --test test/form.test.js && npm run check` | `python3 -m http.server 4173 --directory dist`; simulate expiry/error during fetch | `test/form.test.js`, contact JS/copy/markup |
| 2 | Responsive, contrast, and copy corrections | PR 2 (base: PR 1 branch) | `npm run check` | Browser reflow at 768–1024px; keyboard/focus review | `src/css/site.css`, `src/css/tokens.css`, hero/content/header |
| 3 | Approved assets and provider release proof | PR 3 (base: PR 2 branch) | `npm run check` | Staging Formspree/Turnstile + Pages browser matrix | assets, image markup, configured public IDs |

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
- [x] 3.4 Complete static verification of keyboard, focus, no-JS submit, reduced motion, and ES/EN states on `src/sections/contact.html` and `src/js/form.js`; runtime proof remains task 4.6. <!-- sdd-owner: implementation -->
- [ ] 3.5 Staging-verify Formspree+Turnstile success, validation, expiry, rejection, retry, quota; inspect for email/secrets. <!-- sdd-owner: implementation -->
- [ ] 3.6 Run `npm run check`; confirm Pages Free serves `dist/` (read-only) with no Pages Function. <!-- sdd-owner: implementation -->

## Parent Actions

- [x] Resolve the chain strategy as `feature-branch-chain`; no `size:exception` is approved. <!-- sdd-owner: parent -->
- [ ] Start or reuse bounded review after each work-unit PR. <!-- sdd-owner: parent -->

## Phase 4: Audit Recovery

- [x] 4.1 Parent: reconcile `openspec/changes/portfolio-v1/apply-progress.md` with six local commits; retain the actual feature-chain decision and never claim prior PRs, exceptions, or no commits. <!-- sdd-owner: parent -->
- [x] 4.2 RED: add `test/form.test.js` cases proving 429 maps to generic provider failure and Turnstile expiry/error cannot unlock an in-flight fetch. <!-- sdd-owner: implementation -->
- [x] 4.3 GREEN: update `src/js/form.js` and `src/js/content.js` so callbacks preserve the submit lock until fetch settles and 429 is not described as monthly quota exhaustion. <!-- sdd-owner: implementation -->
- [ ] 4.4 Parent: configure the private Formspree Target Email and Turnstile secret plus staging public IDs; disclose no private value. <!-- sdd-owner: parent -->
- [ ] 4.5 Configure staged public IDs in `src/sections/contact.html` and `src/js/form.js`; prove no-JS submission reaches staging, never a placeholder. <!-- sdd-owner: implementation -->
- [ ] 4.6 Verify task 3.4 at runtime in `src/sections/contact.html` and `src/js/form.js`: ES/EN, keyboard/focus, reduced motion, no-JS, retry, expiry, rejection, and single-submit behavior. <!-- sdd-owner: implementation -->
- [ ] 4.7 Correct `src/css/site.css` and `src/css/tokens.css` for ≥4.5:1 required accent text and an unclipped wrapping header at intermediate widths; browser-check 768–1024px. <!-- sdd-owner: implementation -->
- [ ] 4.8 Correct `src/js/content.js` and `src/sections/hero.html`: remove em dashes and duplicate CTA intent while retaining one primary hiring path in both languages. <!-- sdd-owner: implementation -->
- [ ] 4.9 Parent: approve the final treated portrait and each sanitized screenshot before tasks 2.6–2.8 edit `src/assets/images/`; reject identity, PII, secret, location, document, or ops leakage. <!-- sdd-owner: parent -->
- [ ] 4.10 Staging-verify `src/sections/contact.html` and `src/js/form.js` against Formspree/Turnstile success, validation, expiry, rejection, retry, and 429; inspect published `dist/` (read-only) for secrets/email and Pages static delivery. <!-- sdd-owner: implementation -->
- [ ] 4.11 Parent: before any push, rewrite public-bound history to remove personal-email metadata; verify `git log` (read-only), then preserve the recovery chain. Do not rewrite during this recovery plan. <!-- sdd-owner: parent -->
