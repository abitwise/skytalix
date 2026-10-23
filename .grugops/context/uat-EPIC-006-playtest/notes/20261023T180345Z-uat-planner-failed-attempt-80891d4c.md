---
id: 20261023T180345Z-uat-planner-failed-attempt-80891d4c
kind: failed-attempt
by: uat-planner
at: 2026-10-23T18:03:45Z
verified_by: 
confidence: high (refusal text quoted)
refs:
  - EPIC-006
  - uat-EPIC-006-playtest
  - plans/uat/EPIC-006-play-test-guide.md
  - d78b0833
  - 8f619b80
supersedes: 
seal: sha256:df01fa9408291b6dc4ba6b3f08283797e0bff4f96f11614d87e7c14d777e61e5
---

# UAT Planner: the guide's `artifact-ref` was refused, with no gate run to bind it to

- The brief asked for a `kind: artifact-ref` for the guide. `admitAndAppend` (grugops 2.1.0) refused it with this message: `structural FAIL: an artifact-ref requires the evidence-provenance field "gate_run"`. The attempt carried `sha: d78b0833` and `content_hash: 453eb239…`. Nothing was written.
- This hop is docs-only and the brief asks for no lane runs, so there is no §14-gate verdict to cite. A `gate_run` was not invented.
- I degraded honestly per WF16: the pointer is recorded as an `observation` in this hop's pointer note.
- **Do not retry** an artifact-ref for a docs-only guide unless a real green §14-gate run exists for its commit.
