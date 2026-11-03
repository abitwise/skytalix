---
id: 20261103T105010Z-architect-design-observation-ad30a5b9
kind: observation
by: architect-design
at: 2026-11-03T10:50:10Z
verified_by: 
confidence: high (paths in this commit; published as an observation because an artifact-ref needs a gate_run, and no gate ran)
refs:
  - arch-ABC-239
  - grugops/arch-ABC-239
  - ABC-239
  - E2
  - E2-pre
  - EPIC-011
  - ADR-0067
  - ADR-0064
  - ADR-0056
  - ADR-0048
  - ADR-0023
  - ADR-0050
  - ADR-0061
  - ABC-269
  - ABC-270
  - ABC-271
  - ABC-272
  - ABC-273
  - ABC-215
  - ABC-207
  - ABC-205
  - ABC-255
  - Q-3K-7
  - Q-3K-4
  - NFR-005
  - NFR-008
  - NFR-009
  - G2
  - G6
  - RISK-EPIC010-05
  - af15cbc9
  - b7a8fc3a
  - arch-ABC-239/20261103T102308Z-architect-design-decision-9ed1db11
  - arch-ABC-239/20261103T104045Z-architect-design-decision-255e9bcf
  - arch-ABC-239/20261103T104220Z-architect-design-decision-f8d36d73
  - bapm-epic011-cut/20261103T094553Z-ba-pm-decision-08584853
  - bapm-epic011-cut/20261103T094553Z-ba-pm-observation-0fd882f7
  - arch-next-pull/20261102T213500Z-architect-design-observation-d0f1a5fc
supersedes: 
seal: sha256:f39d47075c549daded2516bb64124af144bf151a494373b73ce0763257680a4f
---

# arch-ABC-239 artifacts: `ADR-0067` (PROPOSED) and the reproducible tuner prototype

Architect/Design, task `arch-ABC-239`. Published as an observation (no gate ran, so not an artifact-ref).

- `memory-bank/50-decisions/ADR-0067-evaluation-weights-tuned-offline-by-a-logistic-fit-of-game-results-newton-on-cross-entropy-material-frozen-at-the-first-pull-and-a-value-identical-blend-of-every-half-first.md`: PROPOSED.
- `.grugops/context/arch-ABC-239/raw/proto/`: `README.md` (how to reproduce), `extract.ts`, `fit.ts`, `diag.ts`, `diag2.ts`, `job.sh`; `out/extract.json`, `out/fit.json`, `out/diag.json`, `out/diag2.json`, `out/data-files.txt` (manifest, sha256 `6e8d0ab0…f040cf`).
- Engine reference: `grugops/ABC-269` `b7a8fc3a` (`src/` tree `4e23078f`), scratch copy, deleted after. Data: PGNs at `main` `af15cbc9`.
- PREREG `…9ed1db11` (`ed922f3e`), addenda `…255e9bcf` (`acc97083`) and `…f8d36d73` (`a2bbdee0`), each committed before its run.
- Nothing is committed to `src/` or `tools/`. Scratch (61 MB position file, the E1 copy) is deleted.
