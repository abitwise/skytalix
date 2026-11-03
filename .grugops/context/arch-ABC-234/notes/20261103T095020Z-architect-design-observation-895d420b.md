---
id: 20261103T095020Z-architect-design-observation-895d420b
kind: observation
by: architect-design
at: 2026-11-03T09:50:20Z
verified_by: 
confidence: high (paths in this commit; published as an observation because an artifact-ref needs a gate_run, and no gate ran)
refs:
  - arch-ABC-234
  - grugops/arch-ABC-234
  - ABC-234
  - EPIC-011
  - O3s
  - Q1
  - ADR-0065
  - ADR-0024
  - ADR-0056
  - ADR-0061
  - ADR-0063
  - ADR-0050
  - ADR-0026
  - NFR-005
  - NFR-009
  - e72487e1
  - 17725732
  - arch-ABC-234/20261103T093240Z-architect-design-decision-9ac61a7a
supersedes: 
seal: sha256:410cb7448f9c87f5a55aa033a8322e74922b4b09171a4b1179bb7fa6bccf58bf
---

# arch-ABC-234 artifacts: `ADR-0065` (PROPOSED, premise not met on `main`) and the reproducible probe

- `memory-bank/50-decisions/ADR-0065-see-orders-losing-captures-after-the-killers-in-the-full-width-search-ordering-only-behind-a-test-only-off-door-pair-and-its-pay-premise-is-not-met-on-main.md`: design of record S1m, decisions 1–12, falsifiers F1–F8 (F4 fired 2026-11-03), alternatives, consequences, rollback.
- `.grugops/context/arch-ABC-234/raw/probe/`: `patch_post268.py` (unchanged), `patch_234.py`, `probe.ts`, `job.sh`, `batch1–3.sh` (pre-registered), `patch_diag_q1.py`, `job_diag.sh` and `batch4.sh` (DIAGNOSTIC), `out/` (42 jobs) and `out4/` (8 jobs), plus `README.md`. Apply both patches to `git archive <main> src package.json` to reproduce. Every count is deterministic.
- No `src/` change was committed. The scratch copies were deleted after the readings.
