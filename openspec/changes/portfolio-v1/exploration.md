## Exploration: portfolio-v1

### Current State
The repository is a Node.js ES module static-site shell. `npm run check` runs semantic validation followed by assembly, but it currently stops because `src/` does not exist. The intended architecture is already clear: `src/index.html` composes small `sections/*.html` partials, `script/build.js` emits `dist/`, and `script/validate.js` enforces semantic HTML and a 200-line limit for every source HTML file. There is no test runner, framework, linter, or deployed application evidence.

The V1 should be a bilingual, dark-first, one-page hiring portfolio for Andrés López. Its narrative should progress from honest transition and working method to two evidence-led case studies, active learning, and an accessible contact path. It must describe AI as directed and verified assistance, not conceal it or turn it into a substitute for demonstrated judgment.

Repository evidence supports careful, bounded claims:
- RondApp contains mobile photo capture into private app storage, photo compression, queued evidence states (`pending`, `synced`, `failed`), and automated tests around evidence synchronization and database safeguards. It supports an advanced prototype narrative, not field validation, production readiness, or a multi-guard pilot claim.
- AccessCampus360 contains tested cédula parsing for handheld-reader input and a mobile scanner that handles PDF417, QR, and MRZ paths. Code comments record real-reader and device observations, but the exact successful digital-ID demonstration and the contribution/sale status need owner-confirmed evidence before publication.
- ControlCampus-360 contains Firebase authentication and audit-oriented code. The repositories do not themselves establish the claimed evolution path to AccessCampus360, so it remains historical context pending confirmation.

### Affected Areas
- `src/index.html` - new composition template is required; it is currently absent.
- `src/sections/*.html` - planned modular navigation, story, method, case-study, learning, contact, and footer partials, each within the 200-line source limit.
- `src/css/` and `src/js/` - planned tokenized visual system, responsive behavior, bilingual switching, accessible navigation, and form state handling.
- `script/build.js` - existing include-based assembly must remain the V1 build path.
- `script/validate.js` - existing semantic and source-size constraints govern all new HTML.
- `apps/mobile/lib/features/operator/presentation/pages/evidence_photo_capture_page.dart` in `../rondapp` - safe internal evidence for local evidence-photo capture and storage.
- `apps/mobile/lib/features/operator/domain/evidence/evidence_status.dart` and `supabase/tests/test_ronda_evidence_multi_photo_migration.py` in `../rondapp` - safe internal evidence for sync-state and database-safeguard claims.
- `apps/web/src/app/features/gestion-accesos/schemas/cedula-scan.util.ts` and `apps/mobile/lib/features/acceso/ui/scanner_view.dart` in `../AccessCampus360` - safe internal evidence for the cédula-input and mobile-scanning story.
- `src/utils/security/auditLogger.ts` and `src/services/users/userManager.service.ts` in `../controlCampus-360` - historical context only; not a third featured case study.

### Approaches
1. **Modular static one-page portfolio** - Implement the defined sections as HTML partials with native CSS and minimal JavaScript, preserving the existing build and validation flow.
   - Pros: Fits the repository architecture, has no dependency cost, keeps source files reviewable, and makes semantic HTML and performance straightforward.
   - Cons: Bilingual state and contact submission need disciplined native JavaScript; sophisticated motion should remain intentionally limited.
   - Effort: Medium.

2. **Framework rebuild before portfolio delivery** - Introduce a component framework and new build tooling before designing the V1 page.
   - Pros: Can provide richer state abstractions and a larger ecosystem for form and animation libraries.
   - Cons: Adds migration, dependency, bundle, and review risk without evidence that the static architecture cannot meet V1 needs.
   - Effort: High.

### Recommendation
Use the modular static approach. Create one continuous page in this narrative order: navigation; asymmetric hero with a truthful portrait; personal transition; working method; RondApp; AccessCampus360 with ControlCampus-360 as origin context; active learning; availability and contact; footer. Do not create separate project pages, fake demos, public repository links, testimonials, metrics, skill bars, certifications, or production claims.

**Content evidence strategy:** maintain an internal claim-to-evidence sheet before copy is finalized. Use selected, manually reviewed screenshots with all names, document numbers, locations, credentials, and operational data removed. Prefer repository-backed process details over outcome claims. Label RondApp as an advanced prototype that Andrés has tested himself and that awaits coordinator approval for a multi-guard pilot. Present AccessCampus360's cédula flow only with reproducible evidence or owner-approved screenshots, and state that it is an intended institutional contribution rather than a deployed sale.

**Visual-system direction:** read this as a developer portfolio for recruiters, with a dark, precise, asymmetric, cinematic language. Use Dark Void, Gluon Grey, Slate Grey, Dusty Grey, Snow, and Liquid Lava as the single accent. A geometric `A` mark may express a path and change of course through negative space or measured construction, but must not use generic code brackets, cursors, shields, or obvious arrows. Use the supplied references for restraint, scale, material contrast, and orange-accent rhythm, never their composition. Choose high-legibility sans typography, generous negative space, real project screenshots, and one realistic, truthful portrait. Default to restrained, purposeful motion only for hierarchy, storytelling, or feedback.

**Accessibility and performance constraints:** use semantic landmarks, a keyboard-operable navigation and language control, visible focus states, translated `lang` metadata, descriptive alt text, strong contrast, and no private-email exposure. The contact form requires labels, inline validation, accessible success/error states, anti-spam, and a selected delivery backend or provider. Reserve image dimensions, compress and lazy-load below-the-fold media, avoid scroll listeners and heavy effects, honor `prefers-reduced-motion`, and keep the hero asset optimized for fast LCP. A dark-only V1 is acceptable because it is explicit brand direction, provided contrast and interaction states are verified; future theme expansion can be token-based.

### Risks
- The portfolio has no `src/` implementation, so build and validation cannot pass until the future change supplies the complete source structure.
- The exact relationship between ControlCampus-360 and AccessCampus360, the digital-ID scanning result, and any institutional approval require owner-confirmed evidence before public copy is written.
- Case-study screenshots can expose personal, credential, location, or security-operation data unless redacted and reviewed.
- Contact delivery, privacy handling, anti-spam, and error recovery cannot be truthfully specified until a provider or backend is selected.
- A bilingual site can accidentally imply English fluency; copy must state Spanish native and English as active learning where relevant.
- The expected visual scope, portrait preparation, bilingual copy, contact integration, and source setup may exceed the 400-line review budget and should be forecast by `sdd-tasks` before apply.

### Ready for Proposal
No. The proposal can proceed after the owner confirms the public wording and evidence for the AccessCampus360 contribution and digital-ID scan, approves a redacted asset set and truthful portrait, selects or constrains the contact delivery provider, and confirms the initial Spanish and English copy. The proposal should preserve static architecture, define privacy and consent boundaries for submitted messages, and keep independent project pages and public repository releases out of V1.
