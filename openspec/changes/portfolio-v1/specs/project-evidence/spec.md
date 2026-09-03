# Project Evidence Specification

## Purpose

Provide credible project evidence while protecting private project materials.

## Requirements

### Requirement: Truthful Case-Study Portfolio

The portfolio SHALL publish RondApp as the flagship advanced prototype or pilot-ready case study and AccessCampus360 as the second case study; it MUST NOT claim multi-guard validation, production adoption, or sales for either project.

#### Scenario: RondApp claim review

- GIVEN a visitor opens the RondApp case study
- WHEN readiness is described
- THEN it SHALL be limited to advanced prototype or pilot-ready status

#### Scenario: Second case study

- GIVEN a visitor reviews project evidence
- WHEN the case-study list is shown
- THEN AccessCampus360 SHALL appear as the second study

### Requirement: Learning-History Boundary

The portfolio SHALL present ControlCampus-360 only as learning history and MUST NOT market it as a current case study, product, production deployment, or commercial offer.

#### Scenario: History reference

- GIVEN ControlCampus-360 is mentioned
- WHEN a visitor reads its context
- THEN it SHALL be identified as learning history only

### Requirement: Sanitized Private Evidence

Written case studies and screenshots MUST pass owner approval and a sanitization review for secrets, personal data, locations, document data, and operational/security information before publication; RondApp and AccessCampus360 repositories MUST remain private.

#### Scenario: Approved screenshot

- GIVEN a screenshot has no prohibited information and owner approval
- WHEN it is selected for a case study
- THEN it MAY be published

#### Scenario: Failed sanitization

- GIVEN a screenshot exposes protected information or lacks approval
- WHEN publication is considered
- THEN it MUST be withheld until corrected and approved
