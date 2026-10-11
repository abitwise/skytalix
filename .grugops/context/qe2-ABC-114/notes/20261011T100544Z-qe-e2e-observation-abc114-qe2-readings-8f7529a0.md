---
id: 20261011T100544Z-qe-e2e-observation-abc114-qe2-readings-8f7529a0
kind: observation
by: qe-e2e
role: qe-e2e
task: qe2-ABC-114
at: 2026-10-11T10:05:44Z
verified_by:
confidence: high
refs:
  - ABC-114
  - QE-114-a
  - QE-114-b
  - src/cli.test.ts
  - src/result-screen.test.ts
  - src/cli.ts
  - src/result-screen.ts
  - 20261011T091155Z-qe-e2e-observation-abc114-gap-register-168698b8
supersedes:
---

# QE 2nd pass `ABC-114`: my own readings at `d60cedb4` (fix `54644ee5`), every build re-planted by me

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

I am QE/E2E (Claude Opus 5.5), dispatched as subtask `qe2-ABC-114`. That makes me a separate agent
from the Software Engineer who wrote the sentences. I took these readings on 2026-10-11 in my own
worktree on `grugops/ABC-114-instrument-comments` @ `d60cedb4`, with Node v26.11.0 on Darwin 25.5.0
at load ≈3–4. Each build was written by a script of mine from its definition in the ticket and the
`qe-ABC-114` notes. Each was planted into production `src/` at the tip, checked with `tsc --noEmit`,
and run against three instruments. I then reverted it with `git checkout --`. `git status
--porcelain` was empty after every revert. No timing figure here is graded.

Instruments for `src/cli.test.ts`:
- **tip**: `HEAD:src/cli.test.ts`.
- **ablation**: the tip file with ONLY the count `expect` (`:2704–2707`) removed.
- **control**: `cc037b3e^:src/cli.test.ts`, which is an ancestor of the tip, checked.
- **`main:`**: also run on `M9` and `D4`. It is byte-identical to the base `7411f73a` and carries
  the count row, so it is not an independent control.

## The rows `A1` runs, in source order at the tip

`:2669` initializer `/const history = newGame\(START_FEN\);/`, then `:2705` count
`/\bhistory\s*[:=]/g` length 1, then `:2712` shorthand `/\bhistory,/` in `windowOf(entry,
"runTurnLoop(", "sink,")`.

## `src/cli.test.ts`, per build

| build | `tsc` | tip | ablation | control `cc037b3e^` |
|---|---|---|---|---|
| delivered | 0 | 67/67 | 67/67 | 2 failed / 53 (55): `ABC-042` `A9` (`process.argv` 8 vs 7), `A10` (`scripts.test`) |
| `M9` (`const decoy = { ...history };`, `history: decoy,` at the call) | 0 | 1 failed / 66: count row, `[ 'history =', 'history:' ]`, got 2 | 1 failed / 66: shorthand row, `'runTurnLoop({\n      history: decoy,…'` to match `/\bhistory,/` | 3 failed / 52: `A9`, `A10`, and `A1` on the shorthand row (same message) |
| `D3` (`await (async (history: ReturnType<typeof newGame>) => runTurnLoop({ history, … }))({ ...history })`) | 0 | 1 failed / 66: count row, `[ 'history =', 'history:' ]`, got 2 | 67/67 | 2 failed / 53: `A9`, `A10` only. `A1` green |
| `ORD` (`const history: ReturnType<typeof newGame> = newGame(START_FEN);` plus `M9`'s flat copy) | 0 | 1 failed / 66: INITIALIZER row, to match `/const history = newGame\(START_FEN\);/` | 1 failed / 66: the same initializer row | 3 failed / 52: `A9`, `A10`, and `A1` on the initializer row |
| `D4` (an async IIFE: `const spare = { ...history }; for (const history of [spare]) return runTurnLoop({ history, … }); throw …`) | 0 | 67/67 | 67/67 | 2 failed / 53: `A9`, `A10` only. `A1` green |

`main:` instrument: `M9` gives 1 failed / 66 on the count row, the same as the tip. `D4` gives 67/67.

## `A3` on `M15` (`headline()`: fivefold gives a two-row headline, threefold gives one row; the ticket's text)

`tsc` 0. On the narrow file `src/result-screen.test.ts`, the tip gives 1 failed / 12 (13). The red is
`ABC-044 A2 … NEITHER STRING IS A SUBSTRING OF THE OTHER`, "threefold-repetition's headline contains
fivefold-repetition's". The control `cc037b3e^:src/result-screen.test.ts` gives 13/13. The fix did
not touch this file. I ran only the narrow file, as the 2026-10-10 re-score allows.

## `A5`: the fence, from git (`main` = merge-base `517d9d2f`)

- `git diff --name-only main...HEAD -- src/` gives `src/cli.test.ts` and `src/result-screen.test.ts`.
- `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is empty.
- `+`/`-` lines in `git diff main...HEAD -- src/` that do not match `^[-+]\s*//`: **0**. numstat:
  `29 9` and `13 6`.
- Fix only (`30b34f44..d60cedb4`): `src/cli.test.ts` plus two `fix-ABC-114` notes. 0 non-`//` lines.
  The longest added line is 101 characters. `plans/` is untouched.
- `it(` / `expect(` counts are 67 / 315 and 13 / 31, at both `main` and the tip.

## `A6` and the gates at the tip

| gate | reading |
|---|---|
| `npm run lint` | exit 0, 102 files |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` at the tip | exit 0, 53 files / 1680 tests / 0 skipped (`.test-results/last-run.json`) |
| `npm test`, base test files (`main:` copies of both files) | exit 0, 53 / 1680 / 0 |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, "No findings." |
| `host-protection.js` | exit 2, `UNKNOWN - verify`. Not a pass |
