# se-ABC-274-fix artifacts: code commit 7daae342 on grugops/ABC-274; carry-over diff vs c131ecd0 touches only the seam body and src/evaluate.taper.test.ts

- **Commit:** `7daae342` (`fix(ABC-274): seam repair S1-S3`), branch `grugops/ABC-274`. Not pushed.
- **Files:** `src/evaluate.ts` (seam body, 2 lines moved), `src/evaluate.taper.test.ts` (`mobilityCount`, `reach`, both mobility shifts, rows S1/S2/S3, `readdirSync`/`statSync` imports).
- **Carry-over (`git diff --stat c131ecd0 7daae342 -- src/`):** `src/evaluate.taper.test.ts | 126 +++…---`, `src/evaluate.ts | 4 +-`, 2 files, 120 insertions, 10 deletions. The `src/evaluate.ts` hunk is the two-line move inside `withParametersForTest` only (`raw/out/carry-over-evaluate.diff`). So A1/A2/A5/A6 read on `c131ecd0` carry by the ruling's condition.
- **Commands:** in `raw/out/runs.txt`; all under the host lock.
