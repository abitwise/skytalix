---
id: 20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-114
at: 2026-10-11T09:11:55Z
verified_by:
confidence: high
refs:
  - ABC-114
  - ABC-113
  - ABC-043
  - ABC-044
  - src/cli.test.ts
  - src/result-screen.test.ts
  - src/cli.ts
  - src/result-screen.ts
  - src/line-input.ts
supersedes:
---

# QE `ABC-114`: my own readings for `A1`–`A7`, every build re-planted by me

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

I am a separate dispatch from the Software Engineer. I took these readings on 2026-10-11 in my own
worktree on `grugops/ABC-114-instrument-comments` @ `8895a9a0` (code `67296100`), with Node v26.11.0
on Darwin 25.5.0. I wrote each build from the ticket's definition (or, for `D3` and `G03`, from the
pre-`ABC-114` notes that define them). I read the SE's notes only after these runs, to compare.
Each build was planted at the tip, checked with `tsc --noEmit`, and reverted with `git checkout --`.
`git status --porcelain` was empty after every revert. No timing figure below is graded.

## Gates at the tip

| gate | reading |
|---|---|
| `npm run lint` | exit 0, 102 files |
| `npm run typecheck` / `npm run build` | exit 0 / exit 0 |
| `npm test` | exit 0, 53 files / 1680 tests |
| skip count (`--reporter=json`) | 0 |
| `test-skip-integrity.js … --skip-count 0` | exit 0, "No findings." (the SE left this `UNKNOWN - verify`) |
| `host-protection.js` | exit 2, `UNKNOWN - verify` (no readable remote). Not a pass |

## A5: the fence, from git (`main` = merge-base `517d9d2f`)

- `git diff --name-only main...HEAD -- src/` gives exactly `src/cli.test.ts` and `src/result-screen.test.ts`.
- `git diff --numstat main...HEAD -- 'src/' ':!src/*.test.ts'` is empty.
- Every `+`/`-` line in `git diff main...HEAD -- src/` matches `^[-+]\s*//`, so 0 lines are not comments.
  numstat: `25 9` and `13 6`. There are 67 and 13 `it(` blocks at both `main` and the tip.

## A6: the lane

Base test files (`7411f73a`) swapped in, `npm test` gives 53 / 1680 / 0 skipped, green. At the tip
it gives 53 / 1680 / 0, green. No file, test or spawn was added.

## The controls

`main:` holds both test files byte-identical to the BASE `7411f73a`. It does not match the tip: the
tip differs by the comment lines that `A5` counts. So `main:` is the same instrument, executably.
`cc037b3e` (`ABC-113`) was already on `main` at the cut `b03658f`. I checked that with
`merge-base --is-ancestor`.
`cc037b3e^:src/cli.test.ts` on the delivered build gives `2 failed | 53 passed (55)`. The two reds are
`ABC-042` `A9` (`process.argv` 8 vs 7) and `A10` (`scripts.test`). That is drift, so I read it row by row.
`cc037b3e^:src/result-screen.test.ts` on the delivered build gives 13/13 green, with no drift.
I added an ABLATION control of my own: the tip file with ONLY the count `expect` (`:2700–2703`) removed.

## A1: `M9` (`const decoy = { ...history };` and `history: decoy,` at the call)

`tsc` exit 0.
| instrument | result | the row that speaks |
|---|---|---|
| tip | 1 failed / 66 (67) | count row: `[ 'history =', 'history:' ]`, length 2 |
| `main:` | 1 failed / 66 (67) | the same count row |
| `cc037b3e^` | 3 failed / 52 (55) | the 2 drift reds, plus `A1` on the shorthand row (`… history: decoy,…` to match `/\bhistory,/`) |
| ablation | 1 failed / 66 (67) | `A1` on the shorthand row, with the same message |

## A1: `D3` (`await (async (history: ReturnType<typeof newGame>) => runTurnLoop({ history, … }))({ ...history })`)

`tsc` exit 0. Tip: 1 failed / 66, on the count row, got 2. `cc037b3e^`: only the 2 drift reds, so `A1`
is GREEN. Ablation: 67/67 green. So `D3` leaves the initializer and shorthand rows green, and only
the count reds it.

## A1: the row order (an extra decoy, `ORD`)

`ORD` is `const history: ReturnType<typeof newGame> = newGame(START_FEN);` plus `M9`'s flat copy at the call.
`tsc` exit 0. The count would read `[ 'history:', 'history:' ]`, which is 2. The row that speaks is the
INITIALIZER row (`:2669`, before the count row at `:2701`): "expected … to match `/const history =
newGame\(START_FEN\);/`". The count row is NOT first on every decoy (gap `QE-114-a`).

## A2: `D4` (`const spare = { ...history };` then `for (const history of [spare]) return runTurnLoop({ history, … })` inside an async IIFE)

`tsc` exit 0. Tip file: 67/67. `main:`: 67/67. `cc037b3e^`: only the 2 drift reds, so `A1` is green.
Full lane: 1680/1680 green at load ≈3. Two earlier full-lane runs at load ≈25 each had ONE red, a
5000 ms timeout in `src/search.test.ts` "pruned and unpruned scores … position-4 at depth 2". That
file passed alone on the delivered build at the same moment, and it does not touch `cli.ts`. I put
it down to load, not `D4`.

The other binder forms named in the comment, each planted the same way (tip file, `tsc`):
| form | `tsc` | tip file |
|---|---|---|
| contextually-typed callback, `(history) =>` | 0 | 67/67 GREEN (blind) |
| the same, bare `history =>` | 0 | RED on the count row, `[ 'history =', 'history =' ]`, from the `=` of `=>` |
| `for (const history in { spare })` | **2** | the typecheck reds it (a string key is not a game) |
| `catch (history)` | **2** | the typecheck reds it (`unknown` under `strict`) |

## A3: `M15` in `headline()` (fivefold gives a two-row headline, threefold gives one row; the ticket's text)

`tsc` exit 0.
| instrument | full lane `npm test` |
|---|---|
| tip | 1 failed / 1679 (1680). The red is `ABC-044 A2 … NEITHER STRING IS A SUBSTRING OF THE OTHER`, "threefold-repetition's headline contains fivefold-repetition's" |
| `main:` | the same 1 / 1679 |
| `cc037b3e^` | 1680 / 1680 green |

This agrees with the `ABC-113` QE note's shape (one red, the retargeted row, control green). Only
the lane total differs, because the lane grew from 1207 to 1680.

## A4: the FIFO harness (behaviour only)

The harness: `mkfifo`, then `node src/cli.ts --colour <c> --ascii < fifo`. The writer opens, sleeps
DELAY, writes one move, and holds the FIFO for 10–12 s. The child is still alive at that point every
time, and is then sent SIGTERM.
| build | colour | DELAY (s) | boards | prompts | bytes | move |
|---|---|---|---|---|---|---|
| delivered | white | 0, 1, 2 | 3 | 2 | 1481 | played ×3 |
| `G03` (hoisted bag + `void options.input(history)`) | white | 0, 1, 2, 0.1, 0.3, 0.6 | 3 | 3 | 1483 | played ×6 |
| delivered | black (`e7e5`) | 0, 1, 2 | 4 | 2 | 2010 | played ×3 |
| `G03` | black (`e7e5`) | 0, 1, 2, 6 | 4 | 3 | 2012 | played ×4 |
| `G03` on an anonymous pipe, writer closed | white | 0 | 3 | 3 | 1495 | played ×3, `input ended`, exit 0 |

`G03` was `tsc`-clean. Against the tip file it gave 13 failed / 54 (67), `G6` among them ("the
window is INVERTED"). The SE recorded 12. My build drops the SE's `as` cast and passes `history`, so
the builds differ. The move-eaten outcome was NOT observed in 13 runs.

End of input on a FIFO, with the writer writing one line and then CLOSING (6 s bound):
| reader | terminated? |
|---|---|
| `cat`, `wc -c`, `python3 -I sys.stdin.read()` | yes, rc 0 |
| `node -e 'fs.readFileSync(0)'` | yes, rc 0 |
| a bare `process.stdin` `data`/`end` reader in Node, ×3 | NO. `data` fired, `end` never did |
| the delivered product, ×2 (15 s bound) | NO. No `input ended` |
| the delivered product on an anonymous pipe | yes, `input ended`, rc 0 |
