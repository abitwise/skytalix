---
id: 20261010T091104Z-qe-e2e-observation-abc051-mutant-matrix-and-measurements-8ea81c8c
kind: observation
by: qe-e2e
at: 2026-10-10T09:11:04Z
verified_by:
confidence: high
refs:
  - ABC-051
  - NFR-002
  - ADR-0021
  - ABC-019
  - ABC-021
  - M2
  - src/turn-loop.ts
  - src/turn-loop.nfr.test.ts
  - src/turn-loop.test.ts
  - .grugops/context/qe-ABC-051/probe/mut.mjs
  - 20261010T090235Z-software-engineer-observation-abc051-reverify-build-and-measurements-0db3513e
  - 20261010T090235Z-software-engineer-claim-abc051-acceptance-met-ready-for-review-05908d8f
supersedes:
---

# `ABC-051` QE: nine mutants planted on the tip, `M2` red on `keyHistory` alone, and the docblock checked against its sources

Hand-authored, no seal (degraded posture, `AGENTS.md`). Subtask `qe-ABC-051`. QE ran this in the
Engineer's worktree `.claude/worktrees/ABC-051-r2` at tip `85f260f`, on Apple M3 / darwin-arm64 /
Node v26.11.0, with load1 between 14 and 19 (other hops were running in parallel).

## Pins

At the tip: `src/turn-loop.ts` md5 `f01ba3abed13c36f01e529289c027dcb`, `src/turn-loop.nfr.test.ts`
`c9c6373a…` (matches the Engineer's), `src/turn-loop.test.ts` `e6d3ac40…` and `src/history.ts`
`12f8c562…` (both unchanged from base). At base `7812018`, in a clean `git archive`:
`src/turn-loop.ts` `0b0687a1…` and the nfr file `d48a0eb3…`, both matching the page.

**The Engineer's `M2` was built on the base `src/turn-loop.ts`.** Its mutant md5 `276de6e0…` equals
the first hop's and QE's base run. QE re-ran `M2` on the tip's commented file, where the mutant md5
is `14bbca7b…`. The Engineer's runner `m2.mjs`, unchanged, gave the same result on the tip.

## Mutant matrix

Every mutant inserts one line before a unique anchor in `src/turn-loop.ts`. The file is pinned by
md5 and the runner throws on a mismatch. A pristine copy is restored in a `finally` and the md5 is
re-checked; every run printed the pinned md5. The runner is `.grugops/context/qe-ABC-051/probe/mut.mjs`
(Vitest json reporter). "tl" is `src/turn-loop.test.ts`.

| id | the change | expected | tip nfr file | tip tl | whole suite (1,540) | base nfr file |
|---|---|---|---|---|---|---|
| `M2` | `keyHistory(history)` before the advancing tail's derive (the ticket's mutant) | red on `keyHistory` | **RED 4/4**, every failure `expected "keyHistory" to be called +0 times`: 40 / 120 / 300 / 40 | RED, `A8` (i), got 8 | — | green 4/4 (blind) |
| `M3` | `keyHistory` on the 7/8/9 non-mutating path (once per rejected/ambiguous/command) | red | **RED 1/4**, on the `rejected` row: `keyHistory` got 12 | **green** | **1 failure, the new assertion only** | green (blind) |
| `M4` | `keyHistory` once per game, at transition 1 → 2 | red | **RED 4/4**, `keyHistory` got 1 | RED, `A8` (i) | — | green (blind) |
| `M5` | `keyHistory` on engine plies only | red | **RED 4/4**, `keyHistory` got 20 / 60 / 150 / 20 | RED, `A8` (i) | — | green (blind) |
| `M6` | a second `gameStatusOf` per ply. **Control:** red is expected, but **not** on `keyHistory` | red elsewhere | RED 4/4, all on **`gameStatus`** (81 / 241 / 601 / 81). No `keyHistory` failure | RED, 8 rows | — | RED 4/4 on `gameStatus` |
| `M7` | a second `keyHistory` in `claimShortfall` (per refused claim). **Control:** not the per-ply bar's | green here | **green 4/4** | RED, `A8` (ii): expected 1, got 2 | — | — |
| `M8` | `takeBack(history, 0)` before every advancing derive: an `O(plies)` replay from `initialFen` that calls neither `keyHistory` nor `repetitionCounts`. **Probe** | — | green | green | **0 failures. Survives** | green |
| `M9` | `keyHistory` on the take-back edge (transition 18, per take-back). **Probe** | — | (not driven) | green | **0 failures. Survives** | — |

What the matrix shows:

1. **`A1`'s wiring proof holds on the tip.** `keyHistory` is the last `expect` in every `it` body, so
   a failure there means `gameStatus` (`plies + 1`) and `repetitionCounts` (0) passed under `M2`.
   That is exactly what the page predicts.
2. **"Exactly that assertion" discriminates.** `M6` is red in this file on `gameStatus` only, so a
   red on another assertion is visibly different and cannot be mistaken for the wiring proof.
   `M7` stays green here and dies at `A8` (ii), which supports withdrawing `A2`: the per-command price
   stays `A8`'s.
3. **The new spy kills something nothing else in the suite kills.** Before this ticket, `M3` was
   caught by **no test in the 1,540**. On the tip it is caught by the new `keyHistory` zero in the
   `rejected` row, and by nothing else. `M2`, `M4` and `M5` were already caught by merged `A8` (i).
   Now they are also red in `NFR-002`'s own file, which is the ticket's stated value.
4. **`M8` and `M9` survive everything.** They are gap-registered in the verdict note.

## `A3`: docblock paragraph against `ADR-0021` clause 5 and `ABC-019` § Scope, line by line

| docblock (`src/turn-loop.ts:268-277` at tip) | source | holds? |
|---|---|---|
| "Eight states" | `ABC-019` § Scope: "Eight states and fifteen transitions, enumerated". `ADR-0021` cl. 5: "States stay at 8" | yes |
| "eighteen NUMBERED transitions" | cl. 5: "Transitions go 16 → 18" | yes |
| "the sixteenth, `awaiting-human` → `game-over` via the `claim` verb, is `ABC-021`'s" | `ABC-019` § Scope: "The **sixteenth** transition, `awaiting-human` → `game-over` (the `claim` outcome), is **`ABC-021`'s**" | yes |
| "seventeenth and eighteenth — `quit` to `exiting`, `take-back` to `evaluating-terminal`" | cl. 5's table, rows 17 and 18, with the same from → to | yes |
| "`ABC-019` `## Scope`'s numbered rows 1-15" | the table under "Eight states and fifteen transitions" numbers rows 1 to 15 | yes |
| "`ABC-021`'s 16 and `ADR-0021` clause 5's 17 and 18" | as above | yes |
| "the refused claim's edge, back to `rendering` on `rejected`'s path, IS NOT ONE OF THE EIGHTEEN: clause 5 lists it beside 7, 8 and 9 with no number" | cl. 5: *"a non-MUTATING outcome (7, 8, 9 and the refused claim) is not re-evaluated"*. Code `:377-379` is `messages = claimShortfall(history); continue;`, which goes back to `rendering` | yes |
| "Counting it as its own row gives 19 … adopting it would amend that clause" | 18 + 1. Cl. 5 states 18 | yes |

No line contradicts `ADR-0021`, so Test note 5's route-to-Architect condition does not fire. The
neighbouring docblocks the page fences (`:105-108`, `:248-253`, and the moved `:293-296`) are
byte-unchanged; the diff touches only `:268` and adds `:272-277`.

## Measurements (all run by QE, on both sides where the page says so)

- `A3` grep `/usr/bin/grep -nE 'derives nothing on its own' src/turn-loop.ts src/turn-loop.nfr.test.ts`:
  **exit 1, zero hits** on the tip. On base: two hits, nfr `:23` and `:131`.
- Test name at nfr `:147`: "derives ZERO times on a `rejected` prompt outcome". Counts `41` and `0`
  unmoved. The honest-limit sentence (`:21-22`) survives word for word, and the cite is `history.ts:153`,
  which is `gameStatusOf`'s `return gameStatus(...)` line.
- `A4` pipeline over `git diff -U0 7812018 85f260f -- src/turn-loop.ts`: **empty** (grep exit 1).
- `git diff --numstat 7812018 85f260f -- src/`: `19 7 src/turn-loop.nfr.test.ts`, `7 1 src/turn-loop.ts`.
  Exactly two `src/` files. The whole branch diff is 7 files; the other 5 are the Engineer's notes,
  the ticket page and the trace row (see the verdict's gap register).
- Suite: **base 50 files / 1,540 tests / skip 0** (clean `git archive 7812018`, json reporter).
  **Tip 50 / 1,540 / 0.** The nfr file has 2 `it(` sites and there are 50 `*.test.ts` files on both
  sides.
- Gates on the tip: `npm run lint` exit 0 (97 files); `npm run typecheck` exit 0; `npm run build`
  exit 0; `npm test` exit 0, 50 files / 1,540 passed; skip count 0
  (`numPendingTests + numTodoTests`); `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` printed `No findings.`, exit 0.
- After every mutant: `git diff --quiet HEAD -- src/` succeeded, and `src/turn-loop.ts` md5 is
  `f01ba3ab…`.
- **Not re-run by QE:** `N8-LANE`. There are 0 new files and 3 spy reads, and the build's −410 ms
  median (null −0.63%) is accepted as "no detectable cost", with the load caveat the Engineer
  already states. Security/NFR owns the timing.
