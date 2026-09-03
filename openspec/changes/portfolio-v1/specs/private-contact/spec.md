# Private Contact Specification

## Purpose

Offer a private, accessible contact path within the selected free-tier service boundaries.

## Requirements

### Requirement: Private Form Delivery

The portfolio SHALL submit contact messages through Formspree Free protected by Turnstile; the owner's Target Email MUST be configured privately and MUST NOT be rendered, embedded, or exposed in public portfolio content.

#### Scenario: Valid protected submission

- GIVEN a visitor completes required fields and Turnstile verification
- WHEN they submit the form
- THEN the message SHALL be sent through the configured Formspree endpoint

#### Scenario: Public privacy review

- GIVEN the published portfolio source and rendered page are reviewed
- WHEN contact details are inspected
- THEN the owner's email address MUST NOT be discoverable

### Requirement: Accessible Submission States

The form MUST expose understandable success, validation-error, delivery-error, Turnstile-expiry, and retry states. Each state MUST be programmatically announced; validation and delivery errors MUST move focus to the status or first invalid control, and recoverable failures MUST preserve entered content.

#### Scenario: Successful submission

- GIVEN a visitor completes valid required fields and Turnstile verification
- WHEN Formspree accepts the submission
- THEN success SHALL be announced and focus SHALL remain on or move to its status

#### Scenario: Validation error

- GIVEN a visitor omits or invalidly completes a required field
- WHEN they submit the form
- THEN the error SHALL be announced and focus SHALL move to the status or first invalid control

#### Scenario: Expired verification

- GIVEN a visitor's Turnstile verification expires before submission
- WHEN they attempt to submit
- THEN expiry and the retry action SHALL be announced without clearing entered content

#### Scenario: Delivery failure

- GIVEN Formspree cannot accept a verified submission
- WHEN the response is received
- THEN the delivery error SHALL be announced, focus SHALL reach the status or retry action, and entered content SHALL remain available

#### Scenario: Recovery retry

- GIVEN a recoverable expiry or delivery error was announced
- WHEN the visitor completes the offered retry path and delivery succeeds
- THEN the success state SHALL be announced without requiring the visitor to rediscover the form

### Requirement: Deterministic Service Privacy Notice

Before deployment, the implementation MUST validate the configured Formspree Target Email and Turnstile integration without exposing private values. Public contact copy MUST state that submitted messages are processed by Formspree and retained in the Formspree account for 30 days; equivalent notice MUST be available in both supported languages.

#### Scenario: Deployment configuration check

- GIVEN deployment configuration is prepared
- WHEN private contact configuration is validated
- THEN valid delivery and Turnstile verification SHALL be demonstrated without publishing secrets or the Target Email

#### Scenario: Retention notice review

- GIVEN either portfolio language is selected
- WHEN the contact privacy notice is reviewed
- THEN it SHALL identify Formspree processing and 30-day Formspree-account retention
