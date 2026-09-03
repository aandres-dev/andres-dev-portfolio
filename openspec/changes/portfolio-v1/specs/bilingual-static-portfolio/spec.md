# Bilingual Static Portfolio Specification

## Purpose

Provide a deployable ES/EN recruiter portfolio without a framework rebuild. The absence of `src/` is the baseline state; V1 creates its modular source tree.

## Requirements

### Requirement: Bilingual Content Parity

The portfolio SHALL provide Spanish and English versions of every user-facing portfolio section and SHALL let visitors switch languages without losing the current page context.

#### Scenario: Switch language

- GIVEN a visitor is viewing a portfolio section in Spanish
- WHEN the visitor selects English
- THEN the same section SHALL be presented in English

#### Scenario: Parity check

- GIVEN either supported language is selected
- WHEN the visitor reaches any portfolio section or contact state
- THEN equivalent content and actions SHALL be available in that language

### Requirement: Modular Static Delivery

The portfolio MUST create modular HTML, CSS, and JavaScript under `src/`, assembled by the existing build into `dist/`; it MUST NOT add a framework, Pages Function, or other server-side backend.

#### Scenario: Build output

- GIVEN the complete source tree is present
- WHEN the existing build command runs
- THEN an equivalent static portfolio SHALL be emitted to `dist/`

#### Scenario: Source-size boundary

- GIVEN any source HTML file, including an included partial, under `src/`
- WHEN it is validated
- THEN it SHALL contain no more than 200 physical lines

#### Scenario: Assembled output boundary

- GIVEN the build emits `dist/index.html`
- WHEN its line count is reviewed
- THEN no source-file line limit SHALL be applied to the assembled output

### Requirement: Pages-Free Release Verification

The portfolio MUST be deployable to Cloudflare Pages Free as a static site, and `npm run check` MUST complete successfully before release.

#### Scenario: Successful release check

- GIVEN complete V1 source and release configuration
- WHEN `npm run check` is run
- THEN it SHALL exit successfully and produce the static build output

#### Scenario: Pages deployment

- GIVEN the successful build output
- WHEN it is deployed to Cloudflare Pages Free
- THEN the published site SHALL serve the portfolio without a server-side backend

### Requirement: Professional Usability Baseline

To satisfy the proposal's professional-usability success criterion and mitigate its accessible-form-state risk, the portfolio MUST provide semantic structure, keyboard-operable controls, visible focus indication, text alternatives for meaningful images, legible text and controls, and responsive reflow that keeps primary content and controls available.

#### Scenario: Keyboard navigation

- GIVEN a keyboard-only visitor
- WHEN focus moves through navigation, language controls, links, and form controls
- THEN each control SHALL be reachable, named, and visibly focused

#### Scenario: Narrow viewport reflow

- GIVEN the viewport is narrowed from a wide layout
- WHEN the portfolio is viewed
- THEN primary content and controls SHALL reflow and remain available without two-dimensional scrolling
