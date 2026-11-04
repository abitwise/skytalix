# arch-ABC-281 observation: ABC-281's three rows are each the only default-lane killer of a named mutant, and a small remnant per row keeps every kill (scratch reads; whole default lane at base and on a tip sketch)

Architect/Design, task `arch-ABC-281`. The reads used a scratch copy (`git archive`) of `grugops/arch-ABC-281` at `1ce1f13a`. Its `src/` tree is `8adb0a18`, which is `main`'s and `08843504`'s. Every run was inside the host lock, and the copy was removed after. Nothing was written to `src/` or `tools/`. Scripts are in `raw/`: `mut.py` (the mutants), `probes.py` (per-reading, per-position and per-seed probes), `tip.py` (the tip sketch).

## Kill sets, whole default lane (`raw/kill-matrix.tsv`)
- **Control:** base 2 650 / 2 650. Tip sketch 2 650 / 2 650, 0 skipped.

| mutant | what it plants | base: default-lane killers | tip sketch (form S): killers |
|---|---|---|---|
| M1 | `src/engine.ts`'s null move unmade without `finally`, so not on abort (`ADR-0050`'s plant) | R1 only | R1's remnant |
| M2 | an empty `priorKeys` list leaves the table uncleared | R2 only | R2's remnant |
| M2c | an empty list turns the null move off | not run on the base lane | R2's remnant (plus the `QE-208-c` source-literal row) |
| M3a | the seed ignored (`seededRandom(0)`) | 16: R3, levels A10, `ABC-242` A6, 13 `uci-session` rows | 16, R3's remnant among them |
| M3b | an extra draw before the decision | R3, `ABC-242` A6 | R3's remnant, `ABC-242` A6 |
| M3c | an extra draw on a blunder move, after the decision (`ABC-087`'s `M5b` shape) | R3 only | R3's remnant |
| M3d | an extra draw on an engine move, after the decision | R3 only | R3's remnant |

## Per-row probes
- **R1** (`raw/r1-*.tsv`): one sweep per reading, 3–30, on both choosers.
  - Aborts that land inside a null subtree: 15 of 56.
  - Under M1: **15 of 15 landing readings mutate the root, and 0 of 41 others do.**
  - `chooseMoveWithoutTaper` lands at readings 8, 10, 11, 15, 18, 23, 25 and 27; `chooseMove` at 10, 15, 16, 20, 28, 29 and 30.
  - The cheapest pair is {8, 10} on the no-taper door, about 18 ms.
- **R2** (`raw/r2-*.tsv`): 36 positions, the six endgames plus the thirty. At base all are equal.
  - Under M2, 33 positions differ.
  - Under M2c, **0 of the 6 endgames** differ. 17 of the thirty differ, startpos and position-6 among them.
  - So an endgame-only remnant would miss a null-move-flavoured defect.
- **R3** (`raw/r3-*.tsv`): seeds 1–5 over the thirty. The first desync of `QE-087-d`'s check falls at move index:
  - M3b: 0, 0, 0, 0, 2;
  - M3c: 4, 2, 2, 3, 3;
  - M3d: 1, 2, 1, 4, 1.
  - Seed 1's first 10 moves hold two blunders.
- **Durations** (`raw/row-durations.tsv`, one lane read each, in-thread):
  - the rows: R1 368, R2 233, R3 137 ms;
  - the remnants: R1 20, R2 21, R3 4 ms (17–25 / 4–9 across the mutant runs).
