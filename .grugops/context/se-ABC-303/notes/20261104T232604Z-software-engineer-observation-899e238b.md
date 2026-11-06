---
id: 20261104T232604Z-software-engineer-observation-899e238b
kind: observation
by: software-engineer
at: 2026-11-04T23:26:04Z
verified_by: 
confidence: high: the artifact record, sealed as an observation as se-ABC-302's was (an artifact-ref needs provenance fields this hop has none of)
refs:
  - ABC-303
  - ABC-286
  - ABC-288
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - orch-2026-10-30a/20261104T222400Z-orchestrator-decision-3c67d3c4
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:e2959591d7ca460d9202293d84514b9ade6719678a2a4c16cdb6cbcb250eca0e
---

# se-ABC-303 artifact: `grugops/ABC-303` from `main` `1bcdbf2d`, code and rows committed; not pushed, not merged

- Claim `da012040`; code `ea580358` (`src/search.ts`, `src/engine.ts`); rows `de1adcc5`, `de15cfb2` (`src/search.bundle.test.ts`, `src/see.test.ts`, `src/engine.test.ts`, `src/search.test.ts`, `src/search.futility.test.ts`, `src/search.null-move.test.ts`, `src/quiescence.test.ts`, `src/evaluate.taper.test.ts`). Code tip `src/` tree `001d6c7c`.
- Production diff: `src/search.ts`, `src/engine.ts`. UAT is not waived.
- Raw: `.grugops/context/se-ABC-303/raw/`: `read.ts`, `audit.ts`, `audit_patch.py`, `wall.sh`, `deep.sh`, `out/`.
- **Owed before QE seals its PREREG:** `main` merged in after the later of `ABC-282` and `ABC-301` settles (`…3c67d3c4` 3), then R1 and R2 re-read on the new base and brought to the Orchestrator (`…3c67d3c4` 4). If `ABC-282` merges, b = 2.3 and A0's counts too (`ADR-0072` d11). Not done here: the brief keeps `main` out. This hand-off's figures are on the unmoved base, so they say nothing yet of a moved one.
