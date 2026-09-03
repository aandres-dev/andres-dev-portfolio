# Apply Progress: portfolio-v1

## Slice

PR 1 of 3 — shell, tokens, bilingual content (`stacked-to-main`).

Design read: recruiter developer portfolio for hiring managers, dark cinematic language, Dark Void base with Liquid Lava as the sole accent.

## Structured status consumed

- `changeName`: portfolio-v1
- `artifactStore`: openspec
- `applyState`: ready
- `nextRecommended`: apply
- `actionContext.mode`: repo-local
- `workspaceRoot`: `/home/andres-dev/Projects/porfolio-andres.dev`
- `allowedEditRoots`: `[/home/andres-dev/Projects/porfolio-andres.dev]`
- `blockedReasons`: []
- Native attempt token: `sha256:04e63c55c2eb1a43c5d76aa2d494ee5d76916a38cb6e57fb371425be7b7594b8`
- Delivery path: chained PRs, `stacked-to-main`, PR 1 of 3, 400-line budget for this slice
- Strict TDD: not active
- `actionContext` warnings: none

## Completed this slice

| Task | Persisted checkbox |
|------|--------------------|
| 1.1 `src/index.html` ES shell, metadata, CSS/JS entries, header `@include` | `- [x]` |
| 1.2 `src/css/tokens.css` Dark Void, Gluon, Slate, Dusty Grey, Snow, Liquid Lava | `- [x]` |
| 1.3 `src/js/content.js` keyed `es`/`en` copy | `- [x]` |
| 1.4 `src/js/language.js` i18n attrs, `?lang=en` plus hash, `lang`/`hreflang`, ES fallback | `- [x]` |
| 1.5 `src/js/main.js` language bootstrap | `- [x]` |
| 1.6 `src/sections/site-header.html` nav, language control, `ANDRES.DEV` | `- [x]` |
| 1.7 `npm run validate` and `npm run build`; HTML ≤200 lines | `- [x]` |

Parent-owned rows were left unchanged.

## Files changed

- `src/index.html` (created)
- `src/css/tokens.css` (created)
- `src/js/content.js` (created)
- `src/js/language.js` (created)
- `src/js/main.js` (created)
- `src/sections/site-header.html` (created)
- `openspec/changes/portfolio-v1/tasks.md` (1.1–1.7 checkboxes)
- `openspec/changes/portfolio-v1/apply-progress.md` (created)

`dist/` is generated and gitignored.

## Verification

Focused test command: `npm run validate && npm run build`

Exact result: validate PASS, 2 HTML files, 0 errors, 3 warnings; build OK, included `sections/site-header.html`, copied CSS/JS to `dist/`.

Source HTML line counts: `src/index.html` 20, `src/sections/site-header.html` 18 (both ≤200). Assembled `dist/index.html` is 37 lines and is not under the source-file cap.

Validate warnings on `src/index.html` (missing `<header>`, `<nav>`, `<footer>` landmarks) are expected: header/nav live in the include partial, and footer is Phase 2.

Runtime harness: N/A — no browser test runner in this workspace. `language.js` keeps the current hash because `shareableUrl` copies `window.location.href` into `URL` before setting `?lang=en`.

Authored source lines this slice: 230 across the six `src/` files (under the 400-line PR budget).

## TDD Cycle Evidence

Not applicable. Strict TDD is not active; `openspec/config.yaml` has `strict_tdd: false` and no test runner.

## Deviations from design

- Named palette hex values were not specified; tokens use off-black cinematic mappings (not pure `#000`/`#fff`) with Liquid Lava `#e24e1b` as the sole accent.
- `content.js` includes shell labels and metadata only. Alt text and contact notices wait for Phase 2/3 assets and form.
- Header hash targets `#story`, `#method`, `#case-studies`, and `#contact` are reserved for later section partials; those landmarks are not in this slice.
- `src/css/site.css`, sections, portrait, contact form, and Formspree/Turnstile are out of this PR.

## Remaining implementation tasks

- [ ] 2.1 Create `src/sections/hero.html`, `src/sections/story.html`, `src/sections/method.html` and `@include` them in `src/index.html`: in-training identity, directed AI, hire-first CTA; no unearned claims. <!-- sdd-owner: implementation -->
- [ ] 2.2 Create `src/sections/case-studies.html` and `@include` it in `src/index.html`: RondApp prototype/pilot-ready flagship, AccessCampus360 second; omit unconfirmed details. <!-- sdd-owner: implementation -->
- [ ] 2.3 Create `src/sections/learning.html` and `@include` it in `src/index.html` with ControlCampus-360 as learning history only. <!-- sdd-owner: implementation -->
- [ ] 2.4 Create `src/sections/footer.html` and `@include` it in `src/index.html`; one page; no extra pages, demos, testimonials, metrics, or skill bars. <!-- sdd-owner: implementation -->
- [ ] 2.5 Create `src/css/site.css` for asymmetric dark layout, focus, reduced motion, contrast, and reflow. <!-- sdd-owner: implementation -->
- [ ] 2.6 Add portrait under `src/assets/images/` only after separate source and treated-owner approval; crop/color/compression only. <!-- sdd-owner: implementation -->
- [ ] 2.7 Add screenshots under `src/assets/images/` only after owner and sanitization approval; withhold failures; keep repos private. <!-- sdd-owner: implementation -->
- [ ] 2.8 Set width/height, `alt`, and compression on images in `src/sections/hero.html` and `src/sections/case-studies.html`; lazy-load except hero portrait. <!-- sdd-owner: implementation -->
- [ ] 2.9 Run `npm run check`; confirm `.gitignore` (read-only) still ignores dist. <!-- sdd-owner: implementation -->
- [ ] 3.1 Create `src/sections/contact.html` and `@include` it in `src/index.html` with labels, `required`, error IDs, `aria-describedby`, public Formspree action, bilingual 30-day notice. <!-- sdd-owner: implementation -->
- [ ] 3.2 Create `src/js/form.js` for resubmit lock, live status, success-clear, invalid focus, preserved values on errors. <!-- sdd-owner: implementation -->
- [ ] 3.3 Wire Turnstile; never commit Target Email or secret; add bilingual recovery copy in `src/js/content.js`. <!-- sdd-owner: implementation -->
- [ ] 3.4 Verify keyboard, focus, no-JS submit, reduced motion, and ES/EN states on `src/sections/contact.html` and `src/js/form.js`. <!-- sdd-owner: implementation -->
- [ ] 3.5 Staging-verify Formspree+Turnstile success, validation, expiry, rejection, retry, quota; inspect for email/secrets. <!-- sdd-owner: implementation -->
- [ ] 3.6 Run `npm run check`; confirm Pages Free serves `dist/` (read-only) with no Pages Function. <!-- sdd-owner: implementation -->

## Deferred parent lifecycle actions

- [ ] Ask chain strategy (`stacked-to-main` vs `feature-branch-chain` vs `size:exception`) before apply. <!-- sdd-owner: parent -->
- [ ] Start or reuse bounded review after each work-unit PR. <!-- sdd-owner: parent -->

## Workload / PR boundary

- Current PR: 1 of 3 (shell, tokens, bilingual content)
- Next PR: Phase 2 sections and approved assets
- Rollback boundary: `src/index.html`, `src/css/tokens.css`, `src/js/content.js`, `src/js/language.js`, `src/js/main.js`, `src/sections/site-header.html`
- No commit created; no review actor started

---

## Slice (PR 2 of 3)

PR 2 of 3 — remaining landmarks and `site.css` only (`stacked-to-main`). Owner path: implement 2.1–2.5 and 2.9; leave 2.6, 2.7, and 2.8 unchecked because no filesystem-approved portrait or screenshots exist. Do not implement Phase 3.

Design read: recruiter developer portfolio for hiring managers, dark cinematic language, native CSS, Dark Void base with Liquid Lava as the sole accent. Dials: VARIANCE 6 / MOTION 5 / DENSITY 4.

## Structured status consumed (PR 2)

- `schemaName`: gentle-ai.sdd-status
- `schemaVersion`: 2
- `changeName`: portfolio-v1
- `artifactStore`: openspec
- `changeRoot`: `/home/andres-dev/Projects/porfolio-andres.dev/openspec/changes/portfolio-v1`
- `applyState`: ready
- `nextRecommended`: apply
- `actionContext.mode`: repo-local
- `workspaceRoot`: `/home/andres-dev/Projects/porfolio-andres.dev`
- `allowedEditRoots`: `[/home/andres-dev/Projects/porfolio-andres.dev]`
- `blockedReasons`: []
- Native attempt token: `sha256:824f5198a1227f0a825865d9925cc251508468a42a4577fdfcd95a750a8b3dae`
- request-id: `portfolio-v1-apply-pr2-20260903`
- Delivery path: `ask-on-risk`, `stacked-to-main`, PR 2 of 3, 400-line budget for this slice
- Strict TDD: not active
- `actionContext` warnings: none

## Completed this slice (PR 2)

| Task | Persisted checkbox |
|------|--------------------|
| 2.1 hero, story, method partials and `@include` | `- [x]` |
| 2.2 case-studies partial and `@include` | `- [x]` |
| 2.3 learning partial and `@include` | `- [x]` |
| 2.4 footer partial and `@include` | `- [x]` |
| 2.5 `src/css/site.css` asymmetric dark layout, focus, reduced motion, contrast, reflow | `- [x]` |
| 2.9 `npm run check`; `.gitignore` still ignores `dist/` | `- [x]` |

2.6, 2.7, and 2.8 left `- [ ]` (no approved assets). Phase 3 and parent-owned rows left unchanged.

## Files changed (PR 2)

- `src/index.html` (site.css link; hero/story/method/case-studies/learning/footer includes)
- `src/sections/hero.html` (created)
- `src/sections/story.html` (created)
- `src/sections/method.html` (created)
- `src/sections/case-studies.html` (created)
- `src/sections/learning.html` (created)
- `src/sections/footer.html` (created)
- `src/css/site.css` (created)
- `src/js/content.js` (ES/EN keys for new sections)
- `openspec/changes/portfolio-v1/tasks.md` (2.1–2.5, 2.9 checkboxes)
- `openspec/changes/portfolio-v1/apply-progress.md` (merged PR 2 evidence)

No `src/assets/**` added.

## Verification (PR 2)

Focused test command: `npm run check`

Exact result: validate PASS, 8 HTML files, 0 errors, 3 warnings; build OK; included `site-header`, `hero`, `story`, `method`, `case-studies`, `learning`, `footer`; CSS/JS copied to `dist/`.

Source HTML line counts (all ≤200): `src/index.html` 28, `hero.html` 10, `story.html` 4, `method.html` 9, `case-studies.html` 14, `learning.html` 8, `footer.html` 7, `site-header.html` 18. Assembled `dist/index.html` is 91 lines and is not under the source-file cap.

Validate warnings on `src/index.html` (missing `<header>`, `<nav>`, `<footer>` landmarks) remain expected: those tags live in include partials, and `script/validate.js` (read-only) inspects source `index.html` rather than assembled output. Assembled `dist/index.html` contains header, nav, main, and footer.

`.gitignore` still lists `dist/`.

Runtime harness: N/A — no browser test runner in this workspace. Contrast/reflow are encoded in `site.css` (Snow on Dark Void, sticky header, single-column collapse at 767px, `prefers-reduced-motion`). Hire CTA targets `#contact` for PR 3.

Authored additions this slice: 451 (`site.css` 317, new section HTML 52, `content.js` +74, `index.html` +8). This exceeds the 400-line authored budget after one honest pass. Code was not compressed to fit. Recommend `size:exception` for PR 2.

## TDD Cycle Evidence (PR 2)

Not applicable. Strict TDD is not active; `openspec/config.yaml` has `strict_tdd: false` and no test runner.

## Deviations from design (PR 2)

- No portrait or screenshots: owner confirmed none are filesystem-approved; 2.6–2.8 deferred. Hero uses typographic/asymmetric mass instead of an image. No placeholder stock or AI identity imagery.
- AccessCampus360 public details omitted pending owner confirmation (open design question unchanged).
- Contact form, Formspree, and Turnstile remain PR 3. Hire-first CTA and footer link to reserved `#contact`.
- `ANDRES.DEV` appears as a personal brand name in header and footer with no domain-ownership claim.

## Remaining implementation tasks

- [ ] 2.6 Add portrait under `src/assets/images/` only after separate source and treated-owner approval; crop/color/compression only. <!-- sdd-owner: implementation -->
- [ ] 2.7 Add screenshots under `src/assets/images/` only after owner and sanitization approval; withhold failures; keep repos private. <!-- sdd-owner: implementation -->
- [ ] 2.8 Set width/height, `alt`, and compression on images in `src/sections/hero.html` and `src/sections/case-studies.html`; lazy-load except hero portrait. <!-- sdd-owner: implementation -->
- [ ] 3.1 Create `src/sections/contact.html` and `@include` it in `src/index.html` with labels, `required`, error IDs, `aria-describedby`, public Formspree action, bilingual 30-day notice. <!-- sdd-owner: implementation -->
- [ ] 3.2 Create `src/js/form.js` for resubmit lock, live status, success-clear, invalid focus, preserved values on errors. <!-- sdd-owner: implementation -->
- [ ] 3.3 Wire Turnstile; never commit Target Email or secret; add bilingual recovery copy in `src/js/content.js`. <!-- sdd-owner: implementation -->
- [ ] 3.4 Verify keyboard, focus, no-JS submit, reduced motion, and ES/EN states on `src/sections/contact.html` and `src/js/form.js`. <!-- sdd-owner: implementation -->
- [ ] 3.5 Staging-verify Formspree+Turnstile success, validation, expiry, rejection, retry, quota; inspect for email/secrets. <!-- sdd-owner: implementation -->
- [ ] 3.6 Run `npm run check`; confirm Pages Free serves `dist/` (read-only) with no Pages Function. <!-- sdd-owner: implementation -->

## Deferred parent lifecycle actions

- [ ] Ask chain strategy (`stacked-to-main` vs `feature-branch-chain` vs `size:exception`) before apply. <!-- sdd-owner: parent -->
- [ ] Start or reuse bounded review after each work-unit PR. <!-- sdd-owner: parent -->

## Workload / PR boundary (PR 2)

- Current PR: 2 of 3 (sections and site CSS; assets deferred)
- Next PR: Phase 3 contact + provider/deploy, after parent accepts `size:exception` for this 451-line slice or otherwise decides delivery
- Rollback boundary: `src/index.html` includes, `src/sections/hero.html`, `src/sections/story.html`, `src/sections/method.html`, `src/sections/case-studies.html`, `src/sections/learning.html`, `src/sections/footer.html`, `src/css/site.css`, PR 2 keys in `src/js/content.js`
- No commit created; no review actor started

---

## Slice (PR 3 of 3)

PR 3 of 3 — private contact via Formspree Free + Turnstile (`stacked-to-main`). Owner path: implement 3.1–3.4; leave 3.5 and 3.6 unchecked (no secrets, staging credentials, or live Pages deploy). Do not implement 2.6–2.8.

Design read: recruiter developer portfolio for hiring managers, dark cinematic language, native CSS, Dark Void base with Liquid Lava as the sole accent. Dials: VARIANCE 6 / MOTION 5 / DENSITY 4.

## Structured status consumed (PR 3)

- `schemaName`: gentle-ai.sdd-status
- `schemaVersion`: 2
- `changeName`: portfolio-v1
- `artifactStore`: openspec
- `applyState`: ready
- `nextRecommended`: apply
- `actionContext.mode`: repo-local
- `workspaceRoot`: `/home/andres-dev/Projects/porfolio-andres.dev`
- `allowedEditRoots`: `[/home/andres-dev/Projects/porfolio-andres.dev]`
- `blockedReasons`: []
- Native attempt token: `sha256:a7462475b8e41f4abe97cc7fdc9dce524c0f1f5d2636ffcf9b8efad3485ca6ec`
- request-id: `portfolio-v1-apply-pr3-20260903`
- Delivery path: `ask-on-risk`, `stacked-to-main`, PR 3 of 3, 400-line budget for this slice
- Strict TDD: not active
- `actionContext` warnings: none

## Completed this slice (PR 3)

| Task | Persisted checkbox |
|------|--------------------|
| 3.1 `src/sections/contact.html` include, labels, required, error IDs, aria-describedby, public Formspree action, bilingual 30-day notice | `- [x]` |
| 3.2 `src/js/form.js` resubmit lock, live status, success-clear, invalid focus, preserved values on errors | `- [x]` |
| 3.3 Turnstile wiring with public site-key placeholder only; bilingual recovery copy in `content.js` | `- [x]` |
| 3.4 Keyboard, focus, no-JS submit, reduced motion, ES/EN static verification | `- [x]` |

2.6, 2.7, 2.8, 3.5, and 3.6 left `- [ ]`. Parent-owned rows left unchanged.

Persisted task checkbox updates: `openspec/changes/portfolio-v1/tasks.md` 3.1–3.4 `- [ ]` → `- [x]`.

## Files changed (PR 3)

- `src/index.html` (contact include)
- `src/sections/contact.html` (created)
- `src/js/form.js` (created)
- `src/js/main.js` (bootstrap `initContactForm`)
- `src/js/content.js` (form labels, privacy notice, recovery states)
- `src/css/site.css` (minimal form/focus additions only)
- `openspec/changes/portfolio-v1/tasks.md` (3.1–3.4 checkboxes)
- `openspec/changes/portfolio-v1/apply-progress.md` (merged PR 3 evidence)

## Verification (PR 3)

Focused test command: `npm run check`

Exact result: validate PASS, 9 HTML files, 0 errors, 3 warnings; build OK; included `site-header`, `hero`, `story`, `method`, `case-studies`, `learning`, `contact`, `footer`; CSS/JS copied to `dist/`.

Source HTML line counts (all ≤200): `src/index.html` 29, `contact.html` 31, `hero.html` 10, `story.html` 4, `method.html` 9, `case-studies.html` 14, `learning.html` 8, `footer.html` 7, `site-header.html` 18.

Validate warnings on `src/index.html` (missing `<header>`, `<nav>`, `<footer>` landmarks) remain expected: those tags live in include partials.

3.4 static evidence:
- Keyboard: native labeled controls, submit, and retry button; no custom click-only widgets.
- Focus: existing `:focus-visible` tokens; invalid handler focuses the first invalid control; status uses `tabindex="-1"` for programmatic focus.
- No-JS submit: `method="post"` plus public Formspree `action`; no `novalidate`; `form.js` calls `preventDefault` only when JS runs.
- Reduced motion: form adds no animation; existing `prefers-reduced-motion` rule still disables transitions.
- ES/EN: Spanish fallback in HTML; `content.js` parity for labels, privacy notice, and all status/recovery keys; status nodes set `data-i18n` so language switches update live copy.

Secret/email inspection of authored contact surfaces and `dist/` copies: no Target Email, no Turnstile secret, no Pages Function, no `mailto:`. Form action and JS constants use `FORMSPREE_FORM_ID_PLACEHOLDER` and `TURNSTILE_SITE_KEY_PLACEHOLDER`. Enhanced submit refuses to POST while those placeholders remain.

Runtime harness: N/A — no browser test runner and no staging Formspree/Turnstile credentials in this workspace.

Authored additions this slice after one honest pass: 472 (`form.js` 271, `contact.html` 31, `content.js` +81, `site.css` +86, `main.js` +2, `index.html` +1). This exceeds the 400-line authored budget. Code was not compressed to fit. Recommend `size:exception` for PR 3.

## TDD Cycle Evidence (PR 3)

Not applicable. Strict TDD is not active; `openspec/config.yaml` has `strict_tdd: false` and no test runner.

## Deviations from design (PR 3)

- Owner has not provided a live Formspree endpoint or Turnstile site key. Public placeholders are used; JS fails closed without posting. Native no-JS still posts to the placeholder action until the owner replaces it.
- Turnstile script loads only when a non-placeholder site key is present (explicit render). Implicit HTML widget omitted so a placeholder key never ships to Cloudflare.
- 3.5 staging provider matrix and 3.6 Pages Free serve confirmation are out of this slice (no secrets, staging credentials, or live deploy).

## Remaining implementation tasks

- [ ] 2.6 Add portrait under `src/assets/images/` only after separate source and treated-owner approval; crop/color/compression only. <!-- sdd-owner: implementation -->
- [ ] 2.7 Add screenshots under `src/assets/images/` only after owner and sanitization approval; withhold failures; keep repos private. <!-- sdd-owner: implementation -->
- [ ] 2.8 Set width/height, `alt`, and compression on images in `src/sections/hero.html` and `src/sections/case-studies.html`; lazy-load except hero portrait. <!-- sdd-owner: implementation -->
- [ ] 3.5 Staging-verify Formspree+Turnstile success, validation, expiry, rejection, retry, quota; inspect for email/secrets. <!-- sdd-owner: implementation -->
- [ ] 3.6 Run `npm run check`; confirm Pages Free serves `dist/` (read-only) with no Pages Function. <!-- sdd-owner: implementation -->

## Deferred parent lifecycle actions

- [ ] Ask chain strategy (`stacked-to-main` vs `feature-branch-chain` vs `size:exception`) before apply. <!-- sdd-owner: parent -->
- [ ] Start or reuse bounded review after each work-unit PR. <!-- sdd-owner: parent -->

## Workload / PR boundary (PR 3)

- Current PR: 3 of 3 (contact form enhancement)
- Delivery decision needed: `size:exception` for this 472-line slice (owner already accepted size:exception for PR 2; do not reopen that exception)
- Follow-up: owner replaces `FORMSPREE_FORM_ID_PLACEHOLDER` and `TURNSTILE_SITE_KEY_PLACEHOLDER`; then 3.5 staging and 3.6 Pages confirmation
- Out of scope: 2.6–2.8 assets, Target Email, Turnstile secret, Pages Function, commits, review actors
- Rollback boundary: `src/sections/contact.html`, `src/js/form.js`, PR 3 keys in `src/js/content.js`, `src/js/main.js` form bootstrap, contact include in `src/index.html`, form/focus rules in `src/css/site.css`
- No commit created; no review actor started
