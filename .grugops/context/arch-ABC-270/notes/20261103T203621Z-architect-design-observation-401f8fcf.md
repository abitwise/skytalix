---
id: 20261103T203621Z-architect-design-observation-401f8fcf
kind: observation
by: architect-design
at: 2026-11-03T20:36:21Z
verified_by: 
confidence: high (paths in this commit; an observation because an artifact-ref needs a gate_run, and no gate ran)
refs:
  - arch-ABC-270
  - grugops/arch-ABC-270
  - ABC-270
  - E3
  - EPIC-011
  - ADR-0068
  - ADR-0031
  - ADR-0064
  - ADR-0061
  - ADR-0067
  - ADR-0056
  - ABC-239
  - ABC-274
  - ABC-272
  - ABC-083
  - QE-269-a
  - Q-3K-4
  - OD-205-1
  - OD-205-2
  - NFR-005
  - NFR-001
  - dc7dc15d
  - arch-ABC-270/20261103T202104Z-architect-design-decision-117475f9
  - arch-ABC-270/20261103T202530Z-architect-design-decision-3f24d8a0
  - orch-2026-10-30a/20261103T200613Z-orchestrator-decision-af126c04
supersedes: 
seal: sha256:091d3107f2d6d77304cf7d7254c8106413df187816f9efc341e6536d546b93c5
---

# arch-ABC-270 artifacts: `ADR-0068` (PROPOSED), three dated lines (`ADR-0031`, `ADR-0064`, `ADR-0061`), and the reproducible E3a probe and D5 tuner diagnostic

- `memory-bank/50-decisions/ADR-0068-e3a-lands-as-structure-only-…md`, PROPOSED.
- Dated lines: `ADR-0031` § Addendum status; `ADR-0064` decision 10; `ADR-0061` § Consequences (eval-scale coupling).
- `.grugops/context/arch-ABC-270/raw/probe/`: `patch_k3.py`, `k3probe.ts`, `mainnodes.ts`, `batchA.sh`, `batchB.sh`,
  `batchC.sh`, `batchE.sh`, `README.md`, and `out/` (every figure quoted).
- `.grugops/context/arch-ABC-270/raw/probe/tune/`: `patch_tune.py` (derives `extract.ts` / `diag5.ts` from
  `arch-ABC-239`'s prototype), `job.sh`; outputs in `raw/probe/out/tune/` (`diag5.json`, `diag5.log`, `extract.json`).
- Published as an observation, because an artifact-ref needs a gate_run and no gate ran.
- The scratch copies sit outside the repository and are deleted at the end of the hop.
