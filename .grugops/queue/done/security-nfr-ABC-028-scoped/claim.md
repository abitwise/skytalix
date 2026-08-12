---
task: security-nfr-ABC-028-scoped
by: security-nfr
at: 2026-08-13T08:00:00Z
---
Claimed by hand per Workflow 17 step 2: `scripts/claim.js` does not exist in this repository
(there is no `scripts/` directory at all). The atomic act was a bare `mkdir` (no `-p`) of
`.grugops/queue/claimed/security-nfr-ABC-028-scoped/`; no `EEXIST` was raised, so this hop won
the claim. The `claimed/` parent was created with `mkdir -p` and is NOT the claim.
