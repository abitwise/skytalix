---
id: 20261011T143751Z-qe-e2e-artifact-ref-abc083-qe-probes-and-trees-ae73a687
kind: artifact-ref
by: qe-e2e
at: 2026-10-11T14:37:51Z
verified_by:
confidence: high
refs:
  - ABC-083
  - grugops/ABC-083-king-safety-mobility
  - 67c189b9
  - 5ed308a8
supersedes:
---

# Where QE's `qe-ABC-083-seed5061` readings live

This note is hand-authored and unsealed. No `sha`/`gate_run`/`content_hash` is given, because no `§14-gate`
verdict exists on this install (AGENTS.md).

- **Trees read.** The branch tip `67c189b9` and base `5ed308a8` were checked out as git worktrees outside
  the repository, with `node_modules` linked from the main checkout and an identical `package-lock.json`.
  Evaluator variants and mutants are `git archive` copies of `67c189b9`. Nothing under `src/` in the
  repository was edited.
- **Probe directory:** `.grugops/context/qe-ABC-083-seed5061/probe/`.
  - `quiet-runs.sh`, `r{1,2,3}-{base,branch}.txt` and `.rows`, `summary.tsv`: three alternating
    `PUZZLE_DEEP=1` rounds, with load1 and thermal recorded per run.
  - `row5061.mjs`, `ladder.tsv`: the suite's exact call on one row, across readings budgets and four
    evaluators.
  - `rootscores.mjs`, `rootscores.tsv`: clean per-root-move values at d5 and d6.
  - `heuristics.mjs`, `heuristics.tsv`: fixed-depth `search()` and its doors, plus `chooseMove` and its
    doors. `searchWithoutPruning` stops at d4, because d5 is brute force and was stopped by QE after
    10 minutes.
  - `idvariants.mjs`, `idvariants.tsv`: the deepening doors across budgets, base's 0.8x margin, and the
    king-safety weight band.
  - `variants.diff`: every evaluator variant, as a diff against the tip.
  - `scope.txt`: the `ADR-0034` decision 2 scope command, the UAT-waiver measure, and the src delta since
    `79248602`.
  - `depth-shift.txt`: per-row depth shifts, base against branch.
  - `lanes.sh`, `lanes.txt`, `lane-*.log`: gates and deep lanes on the tip.
  - `mutants.sh` (bash ≥ 4), `mutants-eval.tsv`, `mutants-all.tsv`, `mut-*.log`: QE's own mutants.
- **Not run by QE.** The pvs-lmr deep lane (926–1 117 s) was cited at `79248602` (`scope.txt`). No
  `A5` timing was taken. `A7`/`A9` are Security/NFR's (`…1643be6c`).
