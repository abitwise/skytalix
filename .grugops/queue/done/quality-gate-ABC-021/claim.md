---
task: quality-gate-ABC-021
by: qe-e2e
at: 2026-08-13T11:36:35Z
---

Now-running registry record. Claimed by atomic `mkdir` (no `-p`) of
`.grugops/queue/claimed/quality-gate-ABC-021/` per Workflow 17 step 2 — `scripts/claim.js` does not
exist in this repo, so the bare `mkdir` IS the atomic act that would have raced.
