---
id: 20261010T143605Z-software-engineer-artifact-ref-abc131-branch-gates-readings-ab35e99a
kind: artifact-ref
by: software-engineer
at: 2026-10-10T14:36:05Z
verified_by:
confidence: high
refs:
  - ABC-131
  - branch:grugops/ABC-131-drop-edge-puzzles
  - commit:7cf74d43
  - commit:506d80c6
  - commit:51fb4ca9
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - src/puzzle-suite.test.ts
supersedes:
---

# `ABC-131` built: branch `grugops/ABC-131-drop-edge-puzzles`, code `51fb4ca9`, 3 `src/` paths

Hand-authored, no seal. Base `679e847d` (`grugops/wave-2026-09-25`). Not merged, not pushed.

- **`src/` numstat `679e847d..51fb4ca9`:** `src/puzzle-corpus.ts` 1/4; `src/puzzle-suite.baseline.json`
  8/8 (commit `51fb4ca9`, which touches only that file); `src/puzzle-suite.test.ts` 9/0.
- **Premise at `679e847d`:** the four rows are present, and `A6` and `A8` are absent.
  `PUZZLE_DEEP=1` exits 0 with 17 passed and 58/62; gating wall 25.52 s, real 40.37 s, load1 8.75 → 8.58
  (`raw-deep-base-679e847d.txt`).
- **Tip `PUZZLE_DEEP=1`:** three processes at `506d80c` plus the baseline. Each exits 0 with 18 passed and
  54/58, the per-row lines are identical, and there is no NEWLY line. Gating wall 23.94 / 19.21 / 19.93 s;
  load1 7.73 / 7.98 / 6.04. A fourth run at the committed `51fb4ca9` gave 54/58, exit 0, 22.12 s, load1
  12.59, with rows identical to process 1.
- **Gates at `51fb4ca9`:** lint, typecheck and build exit 0. `npm test` exit 0 at 52 files / 1608, the
  same as the base (+0 files, +0 rows), with 0 pending and 0 todo. Integrity `No findings.`; inventory
  52/52 `No findings.`
- **Red first:** `A8`'s M9 (`+4` → `+6`) is RED naming the `discovered check` row. `A6`'s misspelt
  `seed 288` name is RED naming the entry. Both are green on the tree.
- **`A5`:** 4x (step 0.25) reads 58/58, with the four headroom rows NEWLY-SOLVED. `weakened` exits 1 at
  15/58.
- **Owed:** the QE hop, the `In Review` move (Orchestrator) and the merge. **The owner's UAT word is
  owed** (`src/puzzle-corpus.ts` and the baseline are non-test files). After merge: the Scribe
  (`PUZZLE_DEEP` comment `58/62` → `54/58`, `17 passed` → `18 passed`), and Security/NFR (`RISK-003`
  0.8x figure, see the observation note).
