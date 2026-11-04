---
id: 20261104T165714Z-orchestrator-decision-ce2883d8
kind: decision
by: orchestrator
at: 2026-11-04T16:57:14Z
verified_by: 
confidence: high
refs:
  - R-BUNDLE-1
  - ADR-0056
  - ABC-283
  - arch-second-pull-1104
supersedes: 
seal: sha256:5a9a58b2b262d5e65cc320e881ceb5dea87616b432eb373bea1cef2bc0ca6c8e
---

Owner 2026-11-04, on the bundling rule's residual risk ("A bundle can hide a part that hurts a little"): "I agree, but still this is better approach than having issues with statistical borderlines. We can accept that risk."
Recorded as an OWNER RISK ACCEPTANCE, R-BUNDLE-1:
- A bundle's single read may hide a part with a small negative share.
- Mitigations stay in the rule: per-part doors, safety rows read per part when one goes red, a part may be re-read later by its door, and credit goes to the bundle.
- The bundling rule's draft (arch-second-pull-1104) carries this acceptance in its text. Once the draft is merged, the Orchestrator shows the final rule text to the owner for a one-word acceptance. His direction and this risk acceptance already settle the substance, and reading (b) applies meanwhile.
