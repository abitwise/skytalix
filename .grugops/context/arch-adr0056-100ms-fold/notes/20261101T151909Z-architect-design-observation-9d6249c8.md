---
id: 20261101T151909Z-architect-design-observation-9d6249c8
kind: observation
by: architect-design
at: 2026-11-01T15:19:09Z
verified_by: 
confidence: high (git diff --stat: 1 file, 259 insertions)
refs:
  - ADR-0056
  - EPIC-011
  - EPIC-010
  - ABC-255
  - ABC-256
  - arch-adr0056-100ms-fold
  - grugops/arch-adr0056-100ms-fold
  - 75919370
  - orch-2026-10-30a/20261101T125800Z-orchestrator-decision-2896c6eb
  - orch-2026-10-30a/20261101T131000Z-orchestrator-decision-f7a50e95
  - qe-tc-depth-probe/20261101T150834Z-qe-e2e-decision-b505d675
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-1889e3b0
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-07357280
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-9fd1fdce
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-f440e5f5
  - memory-bank/50-decisions/ADR-0056
supersedes: 
seal: sha256:76831f03458fcf86cbe24d513a7821fa339fe910599a72e91f7be978633fd9c4
---

# Artifact (recorded as an observation: artifact-ref needs a gate_run this records-only hop has none of): ADR-0056 amended by `arch-adr0056-100ms-fold` (commit 75919370 on `grugops/arch-adr0056-100ms-fold`)

- **File:** `memory-bank/50-decisions/ADR-0056-the-path-toward-3000-elo-stays-classical-and-measured-an-sprt-lane-first-then-tt-pruning-ordering-and-a-tuned-tapered-evaluation-interleaved-with-o1.md`.
- **Change:** additions only, 259 insertions and 0 deletions:
  - a Status block, "Folded 2026-11-01, second time";
  - a superseded line under C2 and under C3;
  - D5's dated block "no SPRT. The fixed-count rule at 100 ms (supersedes C2 and C3)", with the facts table, C2′, C3′,
    restart and warm-up, E > 2 600, the 100 ms → 40/15 caveat, the C4/C1 re-point, and the ABC-255 re-scope;
  - dated lines in D6, D7 (Q-3K-2 and Q-3K-3 answered), D8 and Consequences.
- **No NFR is added or moved.** No plans/, board, src/, tools/ or data/ file was touched.
- **For BA/PM (`bapm-100-400-rule`):** ABC-255 is re-scoped as the ADR states (size S). ABC-256 becomes a 200-game
  read at the C3′ control. The EPIC-010/011 merge rule takes C2′ in place of the D smoke, and the R smoke is
  recommended kept.
