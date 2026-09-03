---
schema: gentle-ai.sdd-research/v1
revision: 7
outcome: done
change: portfolio-v1
artifact_store: openspec
generated_at: 2026-09-03
---

# Research evidence for portfolio-v1

## Outcome

The prior, validated evidence is retained for audit. This positive recovery admits three official Formspree Help Center sources from the declared bounded local capture. Together with the retained revision-2 evidence, all selected questions are supported. Owner choices remain separate, non-authoritative product decisions.

## Admission

| Field | Value |
|---|---|
| Capability schema | `gentle-ai.sdd-research-capability` v1 |
| Declared documentation grant | `read` at `openspec/changes/portfolio-v1/formspree-source-capture.md` |
| Declared open-web grants | None |
| Admitted source class used | documentation |
| Open-web access | Not granted and not used |
| Source boundary | Only the declared local capture was read for newly admitted claims. It contains bounded verbatim excerpts from the three specified official Formspree Help Center URLs. |

### Source-capture validation

| Validation check | Result | Admission effect |
|---|---|---|
| Retrieval metadata and method | Present: UTC retrieval timestamp, read-only `webfetch` retrieval method, Markdown conversion, and `Failures: None`. | Capture is eligible for bounded admission. |
| Official source identity | Each entry supplies a Formspree Help Center URL, publisher (`Formspree Help Center`), and title. | The three specified official URLs are valid source records. |
| Bounded excerpts | Each entry contains verbatim quoted excerpts for account limits, HTML-form storage/delivery, or Turnstile configuration/verification. | Admit only claims directly stated by those excerpts. |

No unsupported external source or ungranted capability was used.

## Questions and evidence

### 1. Static contact form with privacy, accessibility, spam prevention, and server-side anti-bot validation

**Evidence status: done.**

| Evidence-backed finding | Source IDs |
|---|---|
| A non-React site can use Formspree by creating forms in its dashboard. | `formspree-official-static-form-docs` |
| The Free tier starts at 50 monthly submissions, stores 30 days of submission history, and permits up to two linked notification email addresses. | `formspree-account-limits` |
| Formspree stores submissions in the account and can send them to the email configured as the form's Target Email. | `formspree-html-form-delivery-storage` |
| Formspree supports Turnstile when CAPTCHA is enabled and the Turnstile Secret Key is configured in form settings; Formspree verifies the generated `cf-turnstile-response` token using that secret. | `formspree-turnstile-configuration-verification` |
| Formspree API keys and `.env` files must not be committed. | `formspree-official-static-form-docs` |
| For static pages where forms exist on initial page load, Turnstile recommends implicit rendering. | `cloudflare-official-turnstile-docs` |
| Turnstile adds a token to a form submission, and server-side validation through Siteverify is mandatory. | `cloudflare-official-turnstile-docs`, `cloudflare-turnstile-siteverify-official` |
| A Pages root `/functions` directory generates a Worker with file-path-based routes; a Pages Function `onRequest(context)` can receive a request and return a response. | `cloudflare-pages-functions-official` |
| The Siteverify flow receives form data, extracts `cf-turnstile-response`, sends it to the Siteverify POST endpoint, and accepts or rejects the original submission according to the result. | `cloudflare-turnstile-siteverify-official`, `cloudflare-workers-turnstile-example-official` |
| The Turnstile secret must remain in backend environment/secrets rather than frontend code. | `cloudflare-turnstile-siteverify-official`, `cloudflare-workers-turnstile-example-official` |
| Tokens expire after 300 seconds and are single-use; the receiver should use HTTPS, rate limiting, timeouts, action/hostname validation when configured, and user-safe errors. | `cloudflare-official-turnstile-docs`, `cloudflare-turnstile-siteverify-official` |

#### Bounded technical conclusion

A direct static Formspree form is a viable low-complexity contact-flow option: submissions are stored in the Formspree account and can be delivered to its configured Target Email. With CAPTCHA enabled and a Turnstile Secret Key configured in Formspree, Formspree verifies the submission token server-side. A Cloudflare Pages Function/Worker remains a separately proven alternative server boundary if the owner later requires custom validation or delivery behavior.

#### Implementation constraints for later decisions

- Keep the form receiver and Turnstile secret server-side; never expose the secret in client code.
- Treat a token as expired after five minutes and unusable after one validation attempt; provide an accessible recovery path after expiry, validation failure, or network failure.
- Add rate limits, HTTPS, request timeouts, configured action/hostname checks, and non-sensitive user-facing error responses at the server boundary.
- Accessible success and error announcements remain an implementation requirement from the selected portfolio scope; no admitted excerpt proves a specific vanilla-JavaScript state-management implementation.

### 2. Publication evidence and sanitization gates for screenshots and repositories

**Evidence status: done.**

| Evidence-backed finding | Source IDs |
|---|---|
| GitHub secret scanning checks the full history of all branches for hardcoded credentials, including API keys, passwords, tokens, and known secret types. | `github-official-secret-scanning-docs` |
| Secret scanning is automatically available for public repositories. | `github-official-secret-scanning-docs` |
| GitHub recommends immediate credential rotation after a detected leak; deleting the secret from history alone is not sufficient proof of safety. | `github-official-secret-scanning-docs` |
| PII must be protected from inappropriate access, use, and disclosure; protection should identify each PII instance and apply context-appropriate safeguards. | `nist-sp-800-122-official` |
| Identity, private-information, and communications platforms must protect communications in transit and private data under strict access conditions. | `owasp-official-user-privacy-cheat-sheet` |
| Third-party content can disclose visitor IP addresses and must be evaluated as a privacy dependency. | `owasp-official-user-privacy-cheat-sheet` |
| Honesty and transparency are required when sensitive-information misuse or disclosure cannot be fully prevented. | `owasp-official-user-privacy-cheat-sheet` |

#### Required publication gate for later owner confirmation

1. Perform a full-history, all-branches secret scan before public repository publication.
2. If a credential is found, rotate it before publication; do not accept history removal alone as remediation.
3. Perform a context-based manual PII review of every candidate screenshot and repository material. Identify the relevant PII instance and apply a protection level appropriate to its context, including the owner-identified categories of personal data, document numbers, locations, and security-operation details.
4. Remove, replace, crop, blur, or withhold any material that fails the manual review. Record the reviewed asset or repository, reviewer decision, and evidence basis in the internal claim-to-evidence sheet.
5. Review third-party embeds, images, analytics, and other external content as privacy dependencies because they can disclose visitor IP addresses.
6. Do not promise complete automated detection or complete prevention of sensitive disclosure. State residual limits transparently where applicable.

### 3. Truthfulness and privacy constraints for an AI-assisted realistic professional portrait

**Evidence status: done.**

| Evidence-backed finding | Source IDs |
|---|---|
| The Images API `images.edit` accepts one or more reference image files and a prompt to produce a new image. | `openai-image-edit-official` |
| Supported image-reference workflows can use a URL, base64 data URL, or Files API file ID. | `openai-image-edit-official` |
| The guide demonstrates photorealistic requests but does not promise facial-identity fidelity or professional suitability. | `openai-image-edit-official` |
| API data is not used to train or improve models unless the customer explicitly opts in. | `openai-api-data-controls-official` |
| Image generation and edit endpoints have no application-state retention, have 30-day abuse-monitoring retention by default, and are Zero Data Retention eligible. | `openai-api-data-controls-official` |
| Image and file inputs are scanned for CSAM and can be retained for manual review when flagged, including under special retention controls. | `openai-api-data-controls-official` |

#### Bounded capability, privacy, and truthfulness constraints

- **Capability:** documentation supports reference-image editing, including portrait-oriented workflows, but does not guarantee likeness fidelity or professional suitability.
- **Data handling:** the documented data controls apply to the referenced API endpoints, with the stated default abuse-monitoring retention and exception for flagged CSAM review. They are not a blanket claim that submitted portrait data is never retained.
- **Owner-controlled truthfulness:** because no admitted source guarantees identity fidelity, the owner must manually approve the final portrait against the source photographs. Reject it if identity, physical appearance, role, setting, or professional context is fabricated or materially misleading. This is a conservative publication constraint, not a vendor promise.

## Source register

| ID | Class | Publisher | Title | URL | Accessed | Validated excerpt |
|---|---|---|---|---|---|---|
| `formspree-official-static-form-docs` | documentation | Formspree | The Formspree CLI / form setup documentation | https://help.formspree.io/hc/en-us/articles/360053819114-Adding-a-form-to-your-site | 2026-09-03 | “Formspree CLI currently supports React forms... If you're not using React, you can still use Formspree by creating forms in the dashboard.” API keys must not be checked in; `.env` files must not be committed. The excerpt does not prove vanilla-JS state handling or a privacy/retention policy. |
| `formspree-account-limits` | documentation | Formspree Help Center | Account limits | https://help.formspree.io/articles/account-management/account-limits | 2026-09-03T10:18:28Z | “On the Free plan, you can link up to two email addresses for notifications and store 30 days of submission history.” “Submission allowances vary by plan, starting at 50 per month on the Free tier.” |
| `formspree-html-form-delivery-storage` | documentation | Formspree Help Center | Building an HTML Form | https://help.formspree.io/articles/building-your-form/building-an-html-form | 2026-09-03T10:18:28Z | “All of your form submissions will be stored within your Formspree account. Submissions can also be sent to an email listed as the Target Email in your form’s settings.” |
| `formspree-turnstile-configuration-verification` | documentation | Formspree Help Center | Protecting your Forms with Cloudflare Turnstile | https://help.formspree.io/articles/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile | 2026-09-03T10:18:28Z | “Formspree supports Turnstile out of the box — just configure your keys and enable CAPTCHA in your form settings.” CAPTCHA must be enabled, Cloudflare Turnstile selected, and the Secret Key saved. “The Turnstile widget automatically generates a token (`cf-turnstile-response`) that is verified by Formspree using your Secret Key.” |
| `cloudflare-official-turnstile-docs` | documentation | Cloudflare | Embed the widget | https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/ | 2026-09-03 | Implicit rendering is recommended for static pages; a token is added to submission; Siteverify is mandatory; tokens expire after 300 seconds and are single-use; callbacks support success, error, and expiry. |
| `github-official-secret-scanning-docs` | documentation | GitHub Docs | Secret scanning | https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning | 2026-09-03 | Secret scanning checks full history and all branches for hardcoded credentials; public repositories receive it automatically; rotate detected credentials immediately because history removal alone is insufficient. |
| `owasp-official-user-privacy-cheat-sheet` | documentation | OWASP Cheat Sheet Series | User Privacy Protection Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html | 2026-09-03 | Protect private data and communications; evaluate third-party content because it can leak visitor IP addresses; be honest and transparent about limits on preventing sensitive-information misuse or disclosure. |
| `cloudflare-pages-functions-official` | documentation | Cloudflare Docs | Functions - Get started | https://developers.cloudflare.com/pages/functions/get-started/ | 2026-09-03 | A root `/functions` directory automatically generates a Worker with file-path-based routes. A Pages Function `onRequest(context)` receives requests and returns a `Response` or `Promise<Response>`. Functions deploy through Git integration or Wrangler; dashboard Direct Upload does not support Functions. |
| `cloudflare-turnstile-siteverify-official` | documentation | Cloudflare Docs | Validate the token | https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | 2026-09-03 | Siteverify validation is mandatory because client tokens may be forged. The server extracts `cf-turnstile-response`, posts to Siteverify, and allows or rejects the original submission. Secrets stay in backend environment/secrets; use HTTPS, rate limits, timeouts, configured action/hostname validation, and user-safe errors. Tokens expire after 300 seconds and are single-use. |
| `cloudflare-workers-turnstile-example-official` | documentation | Cloudflare Docs | Turnstile HTMLRewriter example | https://developers.cloudflare.com/workers/examples/turnstile-html-rewriter | 2026-09-03 | The official Worker example handles POST form data, extracts the Turnstile token, sends it with the secret to Siteverify, rejects invalid results, and proceeds only after success. Worker environment bindings hold `SITE_KEY` and `SECRET_KEY`. |
| `nist-sp-800-122-official` | documentation | NIST Computer Security Resource Center | Guide to Protecting the Confidentiality of Personally Identifiable Information (PII) | https://csrc.nist.gov/pubs/sp/800/122/final | 2026-09-03 | PII should be protected from inappropriate access, use, and disclosure. Protection should identify PII and determine an appropriate protection level for each instance; organizations tailor safeguards to their requirements. Published April 2010. |
| `openai-image-edit-official` | documentation | OpenAI Developers | Image generation guide | https://developers.openai.com/api/docs/guides/image-generation | 2026-09-03 | `images.edit` accepts one or more reference image files and a prompt. References can use URL, base64 data URL, or Files API file ID in supported workflows. The guide demonstrates photorealistic output requests but does not promise facial-identity fidelity or professional suitability. |
| `openai-api-data-controls-official` | documentation | OpenAI Developers | Data controls in the OpenAI platform | https://platform.openai.com/docs/guides/your-data | 2026-09-03 | API data is not used to train or improve models unless the customer opts in. Image edits and generations have no application-state retention, 30-day default abuse-monitoring retention, and Zero Data Retention eligibility. Inputs are scanned for CSAM and flagged inputs may be retained for manual review, including under special retention controls. |

## Uncertainty, contradictions, and freshness

| Area | Record |
|---|---|
| Contradictions | None found within the supplied excerpts. |
| Question 1 uncertainty | Formspree's Free tier starts at 50 monthly submissions, retains 30 days of history, and supports up to two linked notification emails. The capture supports delivery to a configured Target Email and Formspree-side Turnstile verification, but does not prove a particular UI pattern for accessible success/error states or that a Target Email is private by product guarantee; private-email exposure is an owner-controlled configuration requirement. |
| Question 2 uncertainty | Secret scanning and manual review are complementary controls. The admitted sources do not establish a complete screenshot-redaction taxonomy and do not guarantee automated detection of every sensitive item. |
| Question 3 uncertainty | The admitted image-edit guide proves input and editing capability, not likeness fidelity, consent, legal suitability, or professional suitability. The data-controls facts are endpoint-specific and allow the documented flagged-content retention exception. |
| Freshness | The bounded Formspree capture was retrieved at 2026-09-03T10:18:28Z. Prior registered sources were accessed on 2026-09-03. Supplied update metadata: Pages Functions 2026-04-21; Turnstile Siteverify 2026-05-05; prior client-side Turnstile source 2026-06-17. NIST was published in April 2010. No other source freshness is asserted. |

## Product decisions

The following owner-confirmed product choices are intentionally separate from evidence claims:

| Area | Confirmed choice | Initial constraint |
|---|---|---|
| Hosting and deployment | Cloudflare Pages free tier | This is an initial free-tier architecture and therefore depends on an external service and its applicable limits. |
| Contact message delivery | Formspree Free delivers submissions to a private linked email; the personal email address is not displayed publicly. | The owner accepts an initial limit of 50 submissions per month and 30 days of submission history. |
| Spam protection | Cloudflare Turnstile with the selected Formspree contact flow. | The implementation remains dependent on the external services and their configuration. |
| V1 portrait | Use an authentic real photograph with site-native visual treatment. | This is a zero-cost V1 approach. Do not use AI to generate or materially alter identity; the owner must manually approve the final photograph before publication. AI-assisted portrait generation is deferred to a possible later version. |
| V1 portrait source image | The photograph supplied in the active conversation is approved as a source image for composition, cropping, color treatment, and visual integration without identity alteration. | This is source-image approval only, not final publication approval. No filesystem asset path exists yet. The owner must approve the treated final asset before publication. |
| V1 public project evidence | Publish written case studies and owner-approved sanitized screenshots for RondApp and AccessCampus360. | Keep both corresponding repositories private in V1; repository publication is deferred. Every screenshot must pass the established manual sanitization/publication gate for secrets, PII, document numbers, locations, and security-operation details before use. |

All owner-controlled product decisions are confirmed. These confirmed choices are not evidence claims; the requested Formspree documentation is admitted only for the bounded claims recorded above.

## Recovery record

- **Retained intent:** retain every confirmed owner choice and accepted initial constraint from revision 6.
- **Declared admission:** `documentation=[read openspec/changes/portfolio-v1/formspree-source-capture.md]`; `open-web=[]`.
- **Admitted claims:** only the bounded excerpts in the validated Formspree capture support the newly added Free-plan, account-storage/Target-Email, and Turnstile claims.
- **Recovery result:** the requested Formspree evidence is now complete for the selected claims.

## Handoff constraint

Research is done. The handoff preserves the confirmed owner choices without presenting them as evidence claims. `state.yaml` records proposal readiness after OpenSpec persistence and readback validation.
