---
id: 20261011T120000Z-software-engineer-observation-abc114-fix-readings-m9-d3-ord-d4-3c7e91a2
kind: observation
by: software-engineer
task: fix-ABC-114
at: 2026-10-11T12:00:00Z
verified_by:
confidence: high
refs:
  - ABC-114
  - QE-114-a
  - QE-114-b
  - src/cli.test.ts
  - 20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8
supersedes:
---

# SE `fix-ABC-114`: the readings behind the two replacement sentences

This note is hand-authored and unsealed (AGENTS.md: no `finding` is admissible on this install).
**I wrote the sentences these readings back. They are NOT validated (`A7`).** A fresh QE hop
re-plants `M9`, `D3` and `ORD` itself and does not quote these numbers.

I took these readings on 2026-10-11 in my own worktree on `grugops/ABC-114-instrument-comments`,
from `30b34f44` and again at `54644ee5` (comment-only, so the results are the same). Node v26.11.0,
Darwin 25.5.0. Each build was planted into `src/cli.ts` by a script, checked with `tsc --noEmit`, and
run as `vitest run src/cli.test.ts`. Then it was reverted with `git checkout --`. Porcelain was empty
after every revert.

Instruments: the tip file; an ABLATION (the tip file with only the count `expect` removed); and the
control `cc037b3e^:src/cli.test.ts`.

| build | tsc | tip | ablation | control `cc037b3e^` |
|---|---|---|---|---|
| `M9` (`const decoy = { ...history };`, `history: decoy,`) | 0 | 1 red / 67: the count row, `[ 'history =', 'history:' ]` | 1 red: the shorthand row (`/\bhistory,/`) | 3 red / 55: `ABC-042` `A9`, `A10`, and `A1` on the shorthand row |
| `D3` (shadowing-parameter async IIFE, `({ ...history })`) | 0 | 1 red / 67: the count row, `[ 'history =', 'history:' ]` | 67/67 green | 2 red / 55: `A9`, `A10` only. `A1` green |
| `ORD` (`const history: ReturnType<typeof newGame> = newGame(START_FEN);` plus `M9`'s flat copy) | 0 | 1 red / 67: the INITIALIZER row (`/const history = newGame\(START_FEN\);/`) | the same initializer red | 3 red / 55: `A9`, `A10`, and `A1` on the initializer row |
| `D4` (`const spare = { ...history };`, `for (const history of [spare]) return runTurnLoop({ history, … })` inside an async IIFE) | 0 | 67/67 green | not run | 2 red / 55: `A9`, `A10` only. `A1` green |

What each new sentence rests on:
- "this row sits AFTER the initializer row and BEFORE the shorthand row": source order in `A1`.
- "On `D3` and `M9` it is the row that speaks, because both leave the initializer row green": the
  `M9` and `D3` tip rows.
- "`ORD` … reds the initializer row, and vitest stops there": the `ORD` tip row.
- "On `M9` … the shorthand row's own red is invisible from this file's output": `M9` tip (count) vs
  ablation (shorthand).
- "`D4` … Every row of this file stays green on it. On the control `A1` stays green, and the
  control's only reds are its 2 unrelated `ABC-042` drift rows": the `D4` row.
