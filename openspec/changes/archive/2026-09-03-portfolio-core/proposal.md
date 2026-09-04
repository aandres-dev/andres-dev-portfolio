# Proposal: Andres Lopez (`<andres.{dev}>`) Portfolio

## Why

Most AI portfolios follow cookie-cutter templates with generic purple-cyan gradients, framework bloat, and div-soup markup. Andres Lopez represents a new generation of technical builders: an **AI Orchestrator / Director** who masters architectural design, system fundamentals, and AI direction to ship production-grade software without traditional manual typing of boilerplate.

He requires a distinct, high-performance portfolio that embodies this philosophy with zero fluff, radical performance, and high-craft aesthetic standards.

## What

Build a bespoke, production-ready portfolio for Andres Lopez (`<andres.{dev}>`) using pure, modern Vanilla web technologies.

### Aesthetic & Visual Identity
- **Palette**:
  - Obsidian Black: Deep background foundation (`oklch(0.12 0.01 0)`)
  - Graphite & Slate Grays: Structural hierarchy, subtle borders, muted text (`oklch(0.25 0.01 0)` to `oklch(0.70 0.01 0)`)
  - Crimson Red: Focused energy accent for primary calls to action, badges, and active states (`oklch(0.55 0.22 25)`)
  - Antique Gold: Precision accents, architectural indicators, and milestone highlights (`oklch(0.78 0.14 75)`)
- **Typography**: Typespiration-inspired pairing combining an expressive, authoritative editorial serif/display typeface for headers with a refined, legible monospace/sans-serif for technical body and code labels.
- **Motion & Polish**: 60fps hardware-accelerated animations using CSS transforms, `requestAnimationFrame`, and `IntersectionObserver`. Restrained, purposeful micro-interactions (no gratuitous AI fluff).

### Technical Architecture
- **Semantic HTML5**: 100% semantic markup (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`). Strict ban on unnecessary `<div>` wrappers ("zero divitis").
- **Modern CSS**:
  - Structured via `@layer` (`reset`, `tokens`, `layout`, `components`, `utilities`).
  - Native CSS Nesting, `:has()`, CSS Grid & Subgrid, and Container Queries.
  - Fluid typography and spacing scales using `clamp()`.
  - Modern color spaces with `oklch()`.
- **Vanilla ES Modules**:
  - Clean modular architecture in `src/scripts/` (navigation, interactive showcase, performance monitors).
  - Event delegation, passive listeners, zero third-party framework overhead.
- **SEO & Performance**:
  - Comprehensive OpenGraph metadata and JSON-LD structured data (`Person`, `WebSite`).
  - Zero-layout-shift architecture (CLS = 0), perfect Lighthouse target.
  - Stress testing and memory audit suite for scroll performance and DOM efficiency.

## Core Sections
1. **Hero**: Headline statement, identity `<andres.{dev}>`, and the core thesis: *The Human Directs, The Machine Executes*.
2. **Manifesto / Philosophy**: Why architectural vision, domain modeling, and SDD outlast syntax memorization.
3. **Showcase / Selected Works**: Case studies detailing problem, architecture, AI orchestration prompt pipeline, and measurable outcome.
4. **The Machine / Workflow**: Breakdown of the Spec-Driven Development (SDD) & Agentic workflow.
5. **Arsenal & Capabilities**: Highlighting foundational design patterns, orchestrations, and tool mastery.
6. **Transmission / Contact**: Minimalist, frictionless communication channel.

## Blast Radius
- Greenfield implementation within the repository root:
  - `index.html`
  - `src/styles/`
  - `src/scripts/`
  - `src/assets/`
- Zero external runtime dependencies.

## Rollback Plan
- Change is isolated within Git version control. Can be reverted atomically by resetting the working branch.
