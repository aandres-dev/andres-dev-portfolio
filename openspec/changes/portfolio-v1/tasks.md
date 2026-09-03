# Tasks: Portfolio V1

> **Rewritten 2026-09-03 after the design reset.** The first build shipped an
> accessible but visually generic site because no design authority was ever
> consulted. `src/` was removed in a dedicated commit; history, specs, tests and
> tooling were kept. Every task below is a rebuild task.

---

## MANDATORY DESIGN AUTHORITY

**No task in this document may be started, implemented, or marked complete
without first loading the taste-skill design authority.** This is a blocking
precondition, not advice. A task completed without it is invalid and must be
redone.

### Source of truth

| Field | Value |
|-------|-------|
| Upstream | `https://github.com/Leonxlnx/taste-skill` |
| Install | `npx skills add https://github.com/Leonxlnx/taste-skill` |
| Vendored at | `.agents/skills/` (14 skills, committed) |
| Loadable at | `.claude/skills/` (symlinks into `.agents/skills/`, committed) |
| Pinned by | `skills-lock.json` (SHA-256 per skill) |

### Which skill governs which work

| Skill | Governs |
|-------|---------|
| `design-taste-frontend` | **Primary authority.** All layout, typography, spacing, motion, and color decisions. Its Section 14 pre-flight check is the release gate. |
| `redesign-existing-projects` | Audit discipline when correcting existing markup or CSS rather than authoring it fresh. |
| `high-end-visual-design` | Consulted for depth, shadow, and micro-interaction quality only. Never overrides `design-taste-frontend`. |
| `industrial-brutalist-ui` / `minimalist-ui` | Consulted **only** if the confirmed design read selects that aesthetic family. Never both. |
| `image-to-code`, `imagegen-*`, `brandkit` | Out of scope for V1. Do not invoke. |

### Non-negotiable sequence, every implementation task

1. Load `design-taste-frontend` before opening any file.
2. Declare the **Design Read** one-liner (skill Section 0.B).
3. Declare **explicit dial values** for `DESIGN_VARIANCE`, `MOTION_INTENSITY`,
   `VISUAL_DENSITY` with reasoning (skill Section 1). Never ship silent baselines.
4. Implement.
5. Run the **full Section 14 pre-flight check**. Every box. A failed box means
   the task is not done.
6. Record the design read, the dial values, and the pre-flight result in
   `apply-progress.md` as task evidence.

### Standing conflict rule

The V1 accessibility contract outranks the skill on collisions. If the skill
asks for something that breaks WCAG AA contrast, keyboard operability, focus
visibility, reduced-motion honouring, or 320px reflow, **the accessibility
requirement wins**. Record the deviation and its justification in
`apply-progress.md`. Do not silently drop either side.

### Known collision to resolve before Phase 2

The skill's pre-flight requires *"Real images used ... NO pure-text
minimalism"*. Tasks 2.8 and P.2 are blocked on owner-approved assets that do not
exist. **Do not fabricate images, do not ship placeholder boxes, and do not
declare the pre-flight passed while that box fails.** Either the owner supplies
assets, or the owner records an explicit accepted deviation. This is decision
D-2 below.

---

## Retained From The First Build

These survived the reset and are contract, not suggestions.

| Kept | Why it is contract |
|------|--------------------|
| `test/form.test.js` | Behaviour spec for the contact form. Currently RED because it imports `src/js/form.js`, which no longer exists. Turning it green is the definition of done for Phase 3. Do not weaken or delete a case to make it pass. |
| `script/build.js`, `script/validate.js` | Read-only tooling. Never edit. |
| `openspec/changes/portfolio-v1/specs/**` | The five capability specs still bind. |
| `.gitignore` | Read-only. Already ignores `dist/`, `node_modules/`, `.codegraph/`. |
| Git history (9 commits) | Preserved. No rewrite is authorised inside this plan. |

Behaviours the rebuild must reproduce, proven by the retained tests:

- A submit lock that a Turnstile `expired-callback` or `error-callback` cannot
  release while a fetch is still in flight.
- HTTP 429 surfaced as a generic provider failure, never as monthly quota
  exhaustion.
- No form `action` in committed markup. `form.js` sets it only for a live
  endpoint, so a scripting-disabled browser can never POST to a placeholder.
- Zero em-dashes in any shipped string. The skill's pre-flight bans them too.

---

## Open Decisions (block the phases that name them)

| ID | Decision | Owner | Blocks |
|----|----------|-------|--------|
| D-1 | Design read and aesthetic family: confirm the one-liner and the three dial values, or delegate them to the skill's inference. | Owner | Phase 1 onward |
| D-2 | Image policy: supply approved assets, or record an accepted deviation from the skill's real-images requirement. | Owner | Phase 2, release |
| D-3 | Provider credentials: staging Formspree Form ID and Turnstile Site Key. Target Email and Turnstile Secret stay private and are never committed. | Owner | Phase 3 verification, Phase 5 |
| D-4 | Contact fallback: whether a public LinkedIn or GitHub link ships, given the form is the only hiring path today. | Owner | Phase 4 |
| D-5 | Pre-push history rewrite: all 9 commits carry a personal email address. Verified via `git log`. | Owner | Any push |

---

## Phase 0: Design Authority Setup

- [x] 0.1 Install taste-skill via `npx skills add`; vendor `.agents/skills/`, symlink `.claude/skills/`, pin `skills-lock.json`. <!-- sdd-owner: implementation -->
- [x] 0.2 Remove `src/` and `dist/` in a dedicated reset commit; retain history, specs, tests, and tooling. <!-- sdd-owner: implementation -->
- [ ] 0.3 Load `design-taste-frontend`; produce the Design Read one-liner and the three dial values for a developer portfolio aimed at recruiters; present both to the owner as decision D-1. <!-- sdd-owner: implementation -->
- [ ] 0.4 Owner: confirm or override the Design Read and dial values (D-1), and rule on the image policy (D-2). <!-- sdd-owner: parent -->
- [ ] 0.5 Record the confirmed design read, dials, and aesthetic family in `apply-progress.md` as the binding reference for every later task. <!-- sdd-owner: implementation -->

## Phase 1: Design System Foundation

**Skill gate: `design-taste-frontend` Sections 1 to 4. Declare dials before writing CSS.**

- [ ] 1.1 Author `src/css/tokens.css` under the confirmed design read: color ramp, one accent used identically page-wide, one corner-radius system, elevation scale, fluid type scale. Do not reuse the previous flat token set. <!-- sdd-owner: implementation -->
- [ ] 1.2 Choose and self-host a typeface with real character. `Segoe UI` and `Helvetica Neue` are banned: neither exists on Linux and both fell back to Liberation Sans in V1. Arial, Inter, Roboto, Open Sans and Helvetica are banned by the skill. Ship the font files, do not rely on a system stack. <!-- sdd-owner: implementation -->
- [ ] 1.3 Author `src/css/site.css` layout primitives: grid system, section rhythm, spacing scale, container widths. At least 4 distinct layout families must be available for the 8 sections. <!-- sdd-owner: implementation -->
- [ ] 1.4 Define motion at the declared `MOTION_INTENSITY`, every animation justifiable in one sentence. Wrap all of it in `prefers-reduced-motion`. No `window.addEventListener('scroll')`. <!-- sdd-owner: implementation -->
- [ ] 1.5 Verify the foundation against WCAG AA: text contrast at least 4.5:1, focus visible on every interactive element, `min-height: 100dvh` never `height: 100vh`. Accessibility outranks the skill on conflict. <!-- sdd-owner: implementation -->
- [ ] 1.6 Run `npm run check`; every source HTML file stays at or under 200 lines. <!-- sdd-owner: implementation -->

## Phase 2: Shell, Content, and Sections

**Skill gate: `design-taste-frontend` Sections 4, 9, 12. Re-read the anti-pattern list before each section.**

- [ ] 2.1 Author `src/index.html` shell, metadata, CSS and JS entries, and section `@include` directives. <!-- sdd-owner: implementation -->
- [ ] 2.2 Author `src/js/content.js` with keyed `es` and `en` copy, labels, alt text, and notices. Reuse the V1 copy from git history where it was accurate; invent no new claims. Zero em-dashes. <!-- sdd-owner: implementation -->
- [ ] 2.3 Author `src/js/language.js` and `src/js/main.js`: i18n attributes, `?lang=en` plus hash preservation, `lang` and `hreflang`, Spanish fallback. Recoverable from history at `937a7b6`. <!-- sdd-owner: implementation -->
- [ ] 2.4 Author `src/sections/site-header.html`: navigation on ONE line at desktop, height at or under 80px, language control, `ANDRES.DEV` with no domain claim. <!-- sdd-owner: implementation -->
- [ ] 2.5 Author `src/sections/hero.html`: headline at most 2 lines, subtext at most 20 words and 4 lines, CTA visible without scrolling, at most 4 text elements, top padding capped. No decorative text strip, no scroll cue, no version label. <!-- sdd-owner: implementation -->
- [ ] 2.6 Author `story.html`, `method.html`, `case-studies.html`, `learning.html`, `footer.html`: in-training identity, directed AI, RondApp as flagship prototype, AccessCampus360 second, ControlCampus-360 as learning history only. <!-- sdd-owner: implementation -->
- [ ] 2.7 Enforce layout variety: no two sections share a layout family, no 3+ consecutive image-text splits, eyebrow count at or under `ceil(sectionCount / 3)`, exactly one CTA intent page-wide. <!-- sdd-owner: implementation -->
- [ ] 2.8 Resolve D-2 before shipping any image markup. With approved assets: set width, height, `alt`, compression, and lazy-load everything except the hero portrait. Without them: record the accepted pre-flight deviation. Never ship a placeholder box standing in for a photo, as V1's `.hero-mass` did. <!-- sdd-owner: implementation -->
- [ ] 2.9 Run `npm run check`; confirm `.gitignore` still ignores `dist/`. <!-- sdd-owner: implementation -->

## Phase 3: Contact Form (test-driven)

**Skill gate: `design-taste-frontend` form-contrast pre-flight boxes. Accessibility outranks aesthetics here.**

- [ ] 3.1 Re-read `test/form.test.js` as the binding spec before writing any code. Both cases must pass unmodified. <!-- sdd-owner: implementation -->
- [ ] 3.2 Author `src/sections/contact.html`: labels, `required`, error IDs, `aria-describedby`, bilingual 30-day retention notice, and a `noscript` fallback. **Ship no `action` attribute.** <!-- sdd-owner: implementation -->
- [ ] 3.3 Author `src/js/form.js`: resubmit lock held until fetch settles, live status, success-clear, invalid-field focus, values preserved on error, 429 as a generic provider failure, `form.action` assigned only when the endpoint is live. <!-- sdd-owner: implementation -->
- [ ] 3.4 Wire Turnstile. Never commit the Target Email or any secret. Add bilingual recovery copy to `src/js/content.js`. <!-- sdd-owner: implementation -->
- [ ] 3.5 `node --test test/form.test.js` passes with both retained cases green and unmodified. <!-- sdd-owner: implementation -->
- [ ] 3.6 Verify form contrast per the skill: inputs, placeholders, labels, focus rings, and error text all pass WCAG AA against their section background. <!-- sdd-owner: implementation -->
- [ ] 3.7 Static verification of keyboard order, focus visibility, no-JS behaviour, reduced motion, and both language states. Runtime proof is task 5.3. <!-- sdd-owner: implementation -->

## Phase 4: Contact Reachability

- [ ] 4.1 Owner: rule on D-4. The form is currently the only hiring path, and V1 shipped zero external links, so a placeholder endpoint left recruiters with no way to reach you. <!-- sdd-owner: parent -->
- [ ] 4.2 If D-4 approves it, add the owner-supplied public profile links to the footer. Use real SVG marks, not text wordmarks. Add no link the owner did not supply. <!-- sdd-owner: implementation -->

## Phase 5: Release Verification

- [ ] 5.1 Owner: configure the private Formspree Target Email and Turnstile Secret, and supply the staging public IDs (D-3). Disclose no private value in the repository or the conversation. <!-- sdd-owner: parent -->
- [ ] 5.2 Configure the staged public IDs; prove a no-JS submission reaches staging and never a placeholder. <!-- sdd-owner: implementation -->
- [ ] 5.3 Runtime-verify in a real browser: both languages, keyboard and focus, reduced motion, no-JS, retry, Turnstile expiry, rejection, single-submit, and reflow from 320px through 1024px. No PASS may be claimed without a configured browser harness. <!-- sdd-owner: implementation -->
- [ ] 5.4 Staging-verify Formspree and Turnstile across success, validation, expiry, rejection, retry, and 429. Inspect published `dist/` for leaked secrets or email addresses. <!-- sdd-owner: implementation -->
- [ ] 5.5 Run the complete `design-taste-frontend` Section 14 pre-flight against the finished site. Record every box with its result. Any failed box blocks release. <!-- sdd-owner: implementation -->
- [ ] 5.6 Run `npm run check`; confirm Cloudflare Pages Free serves `dist/` with no Pages Function. <!-- sdd-owner: implementation -->

## Parent Actions

- [ ] P.1 Resolve D-1 through D-4 as each phase reaches them. <!-- sdd-owner: parent -->
- [ ] P.2 Approve the final treated portrait and each sanitized screenshot before any task writes to `src/assets/images/`. Reject identity, PII, secret, location, document, or ops leakage. <!-- sdd-owner: parent -->
- [ ] P.3 Before any push, decide D-5: all 9 commits carry a personal email address, and publishing puts it in the permanent public record. Do not rewrite history inside this plan. <!-- sdd-owner: parent -->

---

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 900 to 1400 across the full rebuild |
| 400-line budget risk | Certain to exceed in a single PR |
| Chained PRs required | Yes |
| Chain strategy | `feature-branch-chain` |
| Delivery strategy | ask-on-risk |

No `size:exception` is approved. Stop and request one if a cohesive slice
exceeds 400 lines.

### Work Units

| Unit | Phases | Focused test command | Rollback boundary |
|------|--------|----------------------|-------------------|
| A | 0 | `npm run check` | Skill install and reset commit |
| B | 1 | `npm run check` | `src/css/**` |
| C | 2 | `npm run check` | `src/index.html`, `src/sections/**`, `src/js/content.js`, `src/js/language.js`, `src/js/main.js` |
| D | 3 | `node --test test/form.test.js && npm run check` | `src/sections/contact.html`, `src/js/form.js` |
| E | 4, 5 | `npm run check` plus staging and browser harness | Assets, provider IDs, footer links |

Do not edit `script/build.js` or `script/validate.js`. Both are read-only.
