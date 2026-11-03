---
id: 20261103T131112Z-software-engineer-observation-38c76b5b
kind: observation
by: software-engineer
at: 2026-11-03T13:11:12Z
verified_by: 
confidence: high: git diff --stat read; artifact-ref refused by the writer (no gate_run on this install), recorded as observation as se-ABC-274 …a11e7540 was
refs:
  - se-ABC-274-fix
  - grugops/ABC-274
  - ABC-274
  - EPIC-011
  - E2-pre
  - ADR-0067
  - arch-ABC-274-seam/20261103T130452Z-architect-design-decision-3169a174
  - S1
  - S2
  - S3
  - A3
  - Q1
  - withParametersForTest
  - src/evaluate.ts
  - src/evaluate.taper.test.ts
  - c131ecd0
  - 7daae342
supersedes: 
seal: sha256:bda4199de74518d6c77c15c80692ee5fa79eb5a2ede7c89624d12b21bf02e75e
---

# se-ABC-274-fix artifacts: code commit 7daae342 on grugops/ABC-274; carry-over diff vs c131ecd0 touches only the seam body and src/evaluate.taper.test.ts

- **Commit:** `7daae342` (`fix(ABC-274): seam repair S1-S3`), branch `grugops/ABC-274`. Not pushed.
- **Files:** `src/evaluate.ts` (seam body, 2 lines moved), `src/evaluate.taper.test.ts` (`mobilityCount`, `reach`, both mobility shifts, rows S1/S2/S3, `readdirSync`/`statSync` imports).
- **Carry-over (`git diff --stat c131ecd0 7daae342 -- src/`):** `src/evaluate.taper.test.ts | 126 +++…---`, `src/evaluate.ts | 4 +-`, 2 files, 120 insertions, 10 deletions. The `src/evaluate.ts` hunk is the two-line move inside `withParametersForTest` only (`raw/out/carry-over-evaluate.diff`). So A1/A2/A5/A6 read on `c131ecd0` carry by the ruling's condition.
- **Commands:** in `raw/out/runs.txt`; all under the host lock.
