---
id: 20261010T145645Z-qe-e2e-artifact-ref-abc131-qe-commit-gates-raw-476bdc8f
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T14:56:45Z
verified_by:
confidence: high
refs:
  - ABC-131
  - branch:grugops/ABC-131-drop-edge-puzzles
  - commit:f994c724
  - src/puzzle-suite.test.ts
supersedes:
---

# `ABC-131` QE artifacts: test commit `f994c724`, gates at that tip, raw readings

Hand-authored, no seal. Branch `grugops/ABC-131-drop-edge-puzzles`, worktree `.claude/worktrees/qe-ABC-131`.
Not merged, not pushed.

- **`f994c724`** `test(ABC-131): grug QE pin unsolved names distinct in A6 row (QE-131-a)`. +4 lines in
  `src/puzzle-suite.test.ts`, inside the existing `A6` row. 0 production lines, 0 new rows, 0 new files.
- **Gates at `f994c724`** (`raw-qe-gates-qetip.txt`, 2026-10-10T14:54:09Z, load1 5.95): lint exit 0
  (100 files); typecheck exit 0; build exit 0. `npm test` exit 0, 52 files / 1608 passed, 7.03 s.
  Skip count `0` (pending + todo). Integrity `No findings.`, exit 0. Inventory 52/52 `No findings.`, exit 0.
- **Default lane, base vs QE tip** (`git archive` copies): 52 files / 1608 tests at both, and 12
  puzzle-suite rows at both. Both copies fail the same 7 AGENTS.md-reading rows (ENOENT: the copy carries
  only `src/`). That is the copy's environment, and the in-tree run is 1608/1608.
- **Raw:** `raw-qe-deep-base-tip-x3.txt`, `raw-qe-deep-{base,tip}.rows.txt`, `raw-qe-a3-a5-ladder.txt`,
  `raw-qe-a4-weakenings.txt`, `raw-qe-a6-a8-mutants.txt`, `raw-qe-levels-tip.txt`,
  `raw-qe-gates-qetip.txt`. Scripts: `raw-qe-run.sh.txt`, `raw-qe-lane.sh.txt`,
  `raw-qe-readings.mts.txt`, `raw-qe-count.mts.txt` and `raw-qe-plant-{weak,step,json,src}.mjs.txt`.
- **UAT waiver probe** over `679e847d..f994c724`, non-test `src/` paths: `src/puzzle-corpus.ts` and
  `src/puzzle-suite.baseline.json`. **Not empty, so the owner's UAT word is owed.**
