---
id: 20261010T101420Z-software-engineer-observation-abc130-red-first-and-mutants-8d4b2e91
kind: observation
by: software-engineer
at: 2026-10-10T10:14:20Z
verified_by:
confidence: high
refs:
  - ABC-130
  - ABC-118
  - commit:adff124e
  - .grugops/context/ticket-to-pr-ABC-130/notes/raw-out-mutants-base.txt
  - .grugops/context/ticket-to-pr-ABC-130/notes/raw-out-mutants-tip.txt
  - .grugops/context/ticket-to-pr-ABC-130/notes/raw-harness.sh.txt
supersedes:
---

# `ABC-130`: watched red on the unfixed tool (`b62d1b6`), green on the fix (`adff124`). Every mutant ran in a `git archive` copy outside the repo

Each harness run takes `git archive <tree>` into the scratchpad, then `git init` and a commit, and
symlinks `node_modules`. Replacement configs are written in the copy only. The repo's
`vitest.config.ts` is never edited.

| scenario | unfixed `b62d1b6` | fixed `adff124` |
|---|---|---|
| A1 real tree (worktree) | 50 / 53, 3 `.grugops` findings, exit 1 | **50 / 50, `No findings.`, exit 0**; `git ls-files -- '*.test.ts' ':!.grugops/' \| wc -l` = 50 |
| A2 `".grugops/**"` removed | 54 / 53, only the `.mjs`, labelled "NOT tracked by git" (false), exit 1 | 54 / 50, **all four** named (3 `.ts` + `depth-vitest.test.mjs`) on the new line, exit 1. `grep '\.grugops/' \| grep -c 'NOT tracked by git'` = **0** |
| A2 glob restored | exit 1 | exit 0 |
| M1 `"src/perft.test.ts"` excluded | exit 1 (4 findings) | 49 / 50, `src/perft.test.ts` named, exit 1 |
| M2 `.claud/**` typo + checkout of `src` under `.claude/worktrees/probe/` | 100 / 53, exit 1 | 100 / 50, 50 planted paths named, exit 1; restored: exit 0 |
| M3 untracked `src/zz.test.ts` | exit 1 | 51 / 50, `src/zz.test.ts` named, exit 1; after `git add`: 51 / 51, exit 0 |
| A4 committed `.grugops/context/zz/probe/new.test.ts` | 50 / 54, 4 findings, exit 1 | **50 / 50, exit 0** |

The unfixed readings for A1, A2 and A4 match the page's cut readings exactly.
