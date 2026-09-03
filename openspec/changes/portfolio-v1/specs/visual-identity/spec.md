# Visual Identity Specification

## Purpose

Establish a distinctive, truthful visual identity for the portfolio.

## Requirements

### Requirement: Dark Cinematic Identity

The portfolio SHALL use a coherent dark, asymmetric, cinematic visual language while preserving readable hierarchy, responsive composition, and accessible contrast.

#### Scenario: Visual review

- GIVEN the portfolio is rendered at desktop width
- WHEN its sections are reviewed together
- THEN the visual language SHALL remain dark, asymmetric, and coherent

#### Scenario: Contrast review

- GIVEN text and interactive controls are rendered on their backgrounds
- WHEN contrast is assessed
- THEN required content and controls SHALL remain legible and distinguishable

### Requirement: Provisional Brand Naming

The portfolio MAY use `ANDRES.DEV` as the personal brand name but MUST NOT claim ownership, control, or availability of the `andres.dev` domain.

#### Scenario: Brand presentation

- GIVEN a visitor views the brand identity
- WHEN the `ANDRES.DEV` name is shown
- THEN no adjacent copy or link SHALL assert domain ownership

### Requirement: Authentic Portrait Approval

The portfolio MUST publish a portrait only after separate explicit owner approval of both the selected source asset and the final treated portrait. Editing MAY adjust composition or treatment but MUST NOT alter the person's identity or use an AI-generated replacement.

#### Scenario: Approved treated portrait

- GIVEN an owner-approved source portrait is available
- AND the final treated portrait has separate explicit owner approval
- WHEN it is added to the portfolio
- THEN the published image SHALL preserve the person's identity

#### Scenario: Unapproved asset

- GIVEN the source or final treated portrait lacks explicit owner approval
- WHEN portfolio assets are prepared for publication
- THEN no portrait SHALL be published
