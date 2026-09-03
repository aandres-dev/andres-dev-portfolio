# Proposal: Portfolio V1

Bilingual dark one-page hiring site for Andrés López: self-taught full-stack developer in training who directs, questions, and verifies AI-assisted work.

## Intent

Static shell without `src/`. V1 is a truthful recruiter surface: no inflated seniority, certifications, English fluency, production adoption, or manual-authorship claims.

## Scope

### In Scope
- Modular bilingual SPA; HTML ≤200 lines; assemble-to-`dist/` build
- Dark, asymmetric, cinematic UI; provisional `ANDRES.DEV` (not `andres.dev` ownership)
- Authentic photo; source approved; treated asset needs owner approval
- Written studies + sanitized screenshots after the established gate; repos private
- Pages Free, Formspree Free private email, Turnstile; 50/month, 30-day history; no public email
- RondApp flagship advanced prototype/pilot-ready (no multi-guard validation); AccessCampus360 second study; ControlCampus-360 history only
- Primary employability; secondary collaboration/business

### Out of Scope
- Framework rebuild; extra pages; public repos; fake demos, testimonials, metrics, skill bars, certifications
- Production, sale, or multi-guard validation claims
- AI identity change; later AI portrait; `andres.dev` ownership; custom Pages Function backend

## Capabilities

> Contract for `sdd-spec`.

### New Capabilities
- `bilingual-static-portfolio`: Modular HTML/CSS/JS; ES/EN; 200-line cap; existing build
- `professional-positioning`: In-training identity; employability first, collaboration/business second; AI as directed assistance
- `visual-identity`: Dark cinematic tokens; `ANDRES.DEV` without domain claim; authentic portrait
- `project-evidence`: Two studies; ControlCampus-360 history; sanitization gate; private repos
- `private-contact`: Formspree Free + Turnstile; hidden email; accessible states proven in implementation

### Modified Capabilities
- None

## Approach

Include-based assembly; native CSS/JS. Formspree Free + Turnstile; owner sets Target Email privately. Publish only gated, owner-approved screenshots.

## Affected Areas

| Area | Impact |
|------|--------|
| `src/index.html`, `src/sections/*.html` | New partials |
| `src/css/`, `src/js/`, `src/assets/` | New visuals and behavior |
| `script/build.js`, `script/validate.js` | Unchanged build/validate |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Accessible form UI states unproven | Med | Prove a11y success/error/recovery in implementation |
| Target Email privacy is config-only | Med | Private Target Email; never render personal email |
| Screenshot PII/ops leakage | High | Manual sanitization gate |
| 400-line review overrun | High | `sdd-tasks` forecasts chained slices |

## Rollback Plan

Delete unpublished `src/` and assets. Keep scripts. Unpublish Pages. Disable Formspree. Residual: 30-day history.

## Dependencies

Pages Free; Formspree Free (50/month, 30-day history, ≤2 notification emails); Turnstile keys; owner-approved portrait and screenshots; private RondApp and AccessCampus360.

## Success Criteria

- [ ] Bilingual Pages Free deploy; no public email; `npm run check` passes; HTML ≤200 lines
- [ ] Honest in-training positioning; RondApp prototype/pilot-ready only; AccessCampus360 second; ControlCampus-360 history
- [ ] Private Target Email via Formspree + Turnstile; accessible states validated in implementation
- [ ] Authentic owner-approved portrait; gated screenshots; private repos
