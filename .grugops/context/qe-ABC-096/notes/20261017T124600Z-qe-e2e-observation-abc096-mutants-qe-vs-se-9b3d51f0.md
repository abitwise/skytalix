---
id: 20261017T124600Z-qe-e2e-observation-abc096-mutants-qe-vs-se-9b3d51f0
kind: observation
by: qe-e2e
task: qe-ABC-096
at: 2026-10-17T12:46:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ADR-0043
  - QE-096-a
  - QE-096-b
  - src/render-seam.ts
  - src/book.ts
  - src/cli.ts
  - 20261017T123600Z-software-engineer-observation-abc096-criteria-gates-mutants-8f2d4b60
supersedes:
---

# QE `ABC-096`: 22 mutants on the full lane plus `tsc`. 19 killed, 2 survived, 1 equivalent

Hand-authored and unsealed.
- **Method.** I planted the mutants **before** I opened the SE's notes or `scratchpad/abc096-se/mut.py`. Each one
  went into a `git archive 2acebaa8` copy outside the repository (`scratchpad/qe096/tip`).
- Each mutant was one text substitution, with no digit added, so that the digit pin could not kill it by
  accident. For each one I ran the whole `npm test` (58 files) and `npx tsc --noEmit`, then restored the file and
  `cmp`-checked it.
- The unmutated copy is green, 58 / 1822. Script: `scratchpad/qe096/qe_mut.py`. Results:
  `scratchpad/qe096/qe_mut_results.json`.
- **My first sweep was vacuous.** `run-bounded.js` was called without `npm`'s `PATH`, so it exited 2 (`spawn vitest
  ENOENT`) and every mutant looked killed. I caught this because every mutant reported 0 failed rows. I discarded
  that sweep and re-ran through `npm test`, deleting the result file before each run. Only the second sweep is
  reported here.

| id | mutant | result | killed by |
|---|---|---|---|
| Q1 | code-point cut (18 code points, not 18 units) | killed | `A4` astral (`more)`) |
| **Q2** | **code-unit split: `family.slice(…, HISTORY_COLS - ELLIPSIS.length)`** | **SURVIVED** | nothing (`QE-096-a`) |
| Q3 | the name appended after the loop's messages | killed | `A9` |
| Q4 | a "last known" memo in the seam | killed | `A5` and `cli.test.ts` `ABC-046` `A6` (`new` redraws the opening frame); `A11` guard |
| Q5 | the lookup made even when messages are present | killed | `A9` (0 lookups) |
| Q6 | `bookMove` reachable: `Pick<BookProbe, "openingName" \| "bookMove">` | killed | `tsc` (4 call sites) and `A8` source row |
| Q6b | the whole `BookProbe` as the seam's type | killed | `tsc` and `A8` |
| Q7 | a second `createBookProbe(` in the `render:` line | killed | `cli.test.ts` `ABC-043` `A1` and `ABC-042` `A9` |
| Q8 | names on entries with an empty `m` dropped | killed | `A5`, `A6` and the `A10` guard |
| **Q9** | **family separator `":"`, not `": "`** | **SURVIVED** | nothing. Equivalent on the shipped book (`QE-096-b`) |
| Q10 | whole only when `< HISTORY_COLS` | killed | `A1` ×2, `A5` |
| Q11 | `openingName` does not trigger the load (`ADR-0043` Alt. 6) | killed | 7 rows, including `A1`, `A2` and `A10` |
| Q12 | any non-empty `n` accepted, as `String(n)` | killed | `A7` |
| Q13 | the last `": "` segment instead of the first | killed | `A1`, `A5` |
| Q14 | `openingName` calls `legalMoves` | killed | `A6` |
| Q15 | `openingName` draws from `random` | killed | `A6` and the `A10` guard (whose `random` throws) |
| Q16 | the empty-family check removed | survived: **equivalent** | `[""]` is sanitised and packed into a blank region, so the frame is byte-identical |
| Q17 | cut to `HISTORY_COLS - FAMILY_END.length` (22 units) | killed | `A1`, `A4` |
| Q18 | `src/cli.ts` passes a stub, not `book` | killed | `cli.test.ts` `ABC-043` `A1`, `A2`, `A7` |
| Q19 | cut boundary `>=` (keeps 17) | killed | `A1`, `A4` ×2 |
| Q20 | `openingName` lazily imports `./history.ts` | killed | the `A10` guard (`A11`) and `book.test.ts` `ABC-094` `A7` |
| Q21 | the name in unicode mode only | killed | 8 rows |

**Why Q2 survives.** Every astral name in `A4` is built only of astral code points, so an 18-unit cut always lands
on a pair boundary: 9 whole pairs. No row in the suite starts an astral run at an odd offset.
- Reading the mutant directly: `"a"` + 20 × `U+1D11E` gives row 1 `a` + 8 × `U+1D11E` + `\uD834...`, which is a lone
  high surrogate on the terminal.
- `A1` says *"its leading whole code points"*, so it is not pinned by the suite.
- **The production code is correct.** On the same input the tip shows `a` + 8 × `U+1D11E` + `...`, 20 units with
  no lone surrogate (note `…fence-gates-independent-reads-4c7a2e19`).
- `A4`'s own lone-surrogate clause covers only names built of astral code points, and it is met.

**The SE's mutants, read after mine** (note `…8f2d4b60`, `scratchpad/abc096-se/mut.py`).
- The SE ran 8 mutants against `render-seam.test.ts` and `history-pane.nfr.test.ts` only. All 8 were reported
  killed.
- **Where we overlap, we agree.** SE `M1` = my Q1, `M2` = Q3, `M3` = Q5, `M6` = Q8, `M7` = Q12 and `M8` = Q4: all
  killed on both sides. SE `M4` (the whole name) and `M5` (no cut) sit next to my Q13 and Q17, and all of those are
  killed.
- **What the SE did not plant:**
  - the code-unit split (Q2, which survives);
  - the type widening (Q6, Q6b);
  - a second probe and a stub at the root (Q7, Q18);
  - the separator (Q9);
  - the load trigger (Q11);
  - the `legalMoves` and `random` calls (Q14, Q15);
  - the `history.ts` import (Q20).
- **Why the SE's file choice matters.** Q7 and Q18 are killed only by `src/cli.test.ts`, and Q6 and Q6b by `tsc`.
  The SE's two-file run could not have seen either.
