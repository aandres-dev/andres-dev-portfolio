# Portfolio Core Specification

## ADDED Requirements

### Requirement: Semantic HTML5 Structure (Zero Divitis)
The portfolio MUST utilize native semantic HTML5 landmark and sectioning elements exclusively where appropriate. `<div>` elements SHALL only be permitted when no semantic tag exists and purely for CSS styling hooks where pseudo-elements or parent elements are insufficient.

#### Scenario: Document outline and landmarks
- **Given** an audit of `index.html`
- **When** parsing the document outline
- **Then** the page MUST contain exactly one `<header>`, `<main>`, and `<footer>`
- **And** all core content sections MUST be enclosed in `<section>` or `<article>` tags with accessible heading levels (`<h1>` through `<h3>`)
- **And** navigation links MUST reside within a `<nav>` element.

---

### Requirement: Visual Design System & Color Tokens
The interface MUST implement a coherent design token hierarchy using the modern `oklch()` color space. The palette SHALL feature deep obsidian black, graphite slate, crimson red, and antique gold accents.

#### Scenario: Theme tokens and contrast compliance
- **Given** the global stylesheet
- **When** inspecting color token declarations in `@layer tokens`
- **Then** background colors MUST evaluate to deep obsidian black (`oklch(0.12 0.01 0)` or darker)
- **And** primary action accents MUST evaluate to crimson red (`oklch(0.55 0.22 25)`)
- **And** prestige badges and architectural highlights MUST evaluate to antique gold (`oklch(0.78 0.14 75)`)
- **And** body copy on dark surfaces MUST satisfy WCAG AA contrast ratio of at least 4.5:1.

---

### Requirement: Editorial Typespiration Typography
The portfolio MUST feature high-contrast, editorial typography inspired by Typespiration standards, pairing a bold character-rich display serif with a clean, utilitarian technical sans-serif/monospace.

#### Scenario: Font loading and fluid scaling
- **Given** the loaded document
- **When** rendering headings and body text across viewport widths from 360px to 1920px
- **Then** font sizes MUST scale continuously using `clamp()` fluid formulas
- **And** text line length for long-form content MUST NOT exceed 75 characters (`max-inline-size: 70ch`) to preserve readable measure.

---

### Requirement: 60 FPS Micro-Interactions and Motion
Interactive animations and scroll reveals MUST run on the GPU compositor thread without triggering layout thrashing or main-thread frame drops.

#### Scenario: Reduced motion preference
- **Given** a user with `prefers-reduced-motion: reduce` configured in their OS or browser
- **When** accessing or scrolling through the portfolio
- **Then** all parallax, transforms, and automatic transitions MUST be disabled or replaced with immediate opacity cuts.

#### Scenario: Scroll triggers and frame performance
- **Given** standard scrolling across all sections
- **When** observing frame rendering rates
- **Then** the application MUST maintain a steady 60 FPS without dropping frames below 55 FPS under normal scroll velocities
- **And** all scroll observers MUST utilize native `IntersectionObserver` instead of raw window scroll handlers.

---

### Requirement: SEO, OpenGraph & Structured Metadata
The page MUST provide rich machine-readable metadata for social sharing and search indexing representing Andres Lopez as an AI Orchestrator / Director.

#### Scenario: Metadata and Schema validation
- **Given** a search engine crawler or social platform crawler
- **When** reading the `<head>` of `index.html`
- **Then** it MUST contain valid OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- **And** a valid JSON-LD script tag with `@type: "Person"` declaring name, title, and key competencies.
