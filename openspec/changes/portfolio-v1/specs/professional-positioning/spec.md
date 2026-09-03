# Professional Positioning Specification

## Purpose

Present truthful, employment-oriented professional positioning for Andrés López.

## Requirements

### Requirement: Truthful In-Training Identity

The portfolio SHALL describe Andrés López as a self-taught full-stack developer in training and MUST NOT claim unearned seniority, certifications, English fluency, production adoption, sales, manual-only authorship, or other unsupported achievements.

#### Scenario: Recruiter reads introduction

- GIVEN a visitor opens the portfolio introduction or profile content
- WHEN they read the professional description
- THEN it SHALL state the in-training identity without prohibited claims

#### Scenario: Unsupported claim review

- GIVEN visible profile copy is reviewed
- WHEN a claim cannot be substantiated by approved evidence
- THEN that claim MUST NOT be published

### Requirement: Scope and Evidence Exclusions

The portfolio MUST remain a one-page site and MUST NOT publish extra pages, fake demos, testimonials, fabricated metrics, or skill bars. These exclusions do not weaken the prohibition on false certifications or claims.

#### Scenario: Content-scope review

- GIVEN release content and navigation are reviewed
- WHEN pages and evidence elements are enumerated
- THEN only the one-page portfolio SHALL be present without prohibited elements

#### Scenario: Unsupported social proof

- GIVEN a proposed testimonial, metric, demo, or skill visualization
- WHEN it is not approved as truthful V1 evidence
- THEN it MUST NOT be published

### Requirement: Directed AI Assistance

The portfolio SHALL characterize AI as assistance directed, questioned, and verified by Andrés López, and MUST NOT present AI output as autonomous work or conceal its assisted nature.

#### Scenario: AI-work disclosure

- GIVEN a visitor reads the work approach
- WHEN AI assistance is referenced
- THEN the text SHALL attribute direction and verification to Andrés López

### Requirement: Audience Priority

The portfolio SHALL prioritize employability messaging and MAY present collaboration or business availability as secondary messaging.

#### Scenario: Primary call to action

- GIVEN a visitor reaches primary portfolio messaging
- WHEN calls to action are evaluated
- THEN the primary path SHALL support hiring or professional contact before secondary business messaging
