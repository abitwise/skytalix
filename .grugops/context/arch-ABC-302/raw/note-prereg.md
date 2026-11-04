# arch-ABC-302 PREREG: 28 mutants and the rules that turn their kill sets into a form per row, sealed before the first mutant read

Architect/Design, task `arch-ABC-302`. This note is sealed before any mutant is applied to a tree that runs. QE freezes A6 from it.

## Base and copy
- The base is branch `grugops/arch-ABC-302` at `b84613c1` (the claim commit on `main` `fed3f2b4`). Its `src/` tree is `af2b77dc`, which is `main`'s.
- All reads use a `git archive` copy in `<scratch>/arch302/tree`, with `node_modules` linked. Nothing is written to the repository's `src/` or `tools/`. Every run is inside `flock <scratch>/host-test.lock`.
- **Already read, unmutated, before this note** (`raw/probes.py`, `raw/probe-*.tsv`):
  - the control lane: 2 687 / 2 687 over 71 files, 0 skipped;
  - the nine rows' in-thread ms;
  - per-root null-move counts at depths 3 and 4;
  - the futility node counts at depths 2–4;
  - the ep walk at depths 1 and 2;
  - the counting clock at five steps;
  - R6 and R7 over 5–30 positions, and the seeds' draws below 0.05;
  - R9 at pass limits 130–650;
  - R2 and R8 at virtual steps of 100–4 000 ms.
  No mutant was applied in any of them.

## The mutants (`raw/mut.py`, sha256 `642849d2…d08d2c5`; carried edits in `raw/abc244-carried.json`, sha256 `22e6784d…41c9bfa`)
Each anchor occurs once. Each mutant is applied alone to the production files, from the originals.

| id | row it targets | the plant |
|---|---|---|
| M1 | R1 | `nullMoveReduction`: the in-check guard holds only above remaining depth 3 |
| M1p | R1 | `nullMoveReduction`: at remaining depth ≤ 3, the zugzwang guard reads 2 pieces, not 3 |
| M2 | R2 | `level-seam.ts`: the seam trims one key long (`halfmoveClock + 1`) |
| M2s | R2 | `level-seam.ts`: the seam drops the oldest kept key (`.slice(1)`) |
| M3 | R3 | `engine.ts`: futility never fires in the engine recursion (`ply < 0 &&` in the gate) |
| M3s | R3 | `search.ts`: futility never fires in `search()`'s recursion |
| M4 | R4 | `apply.ts`: a double push sets the ep target only when an enemy pawn stands beside it (ADR-0005's availability, at the field) |
| M4z | R4 | `zobrist.ts`: the ep component is XORed only for rank-6 targets, in `zobristKey` and both deltas alike |
| M5 | R5 | `engine.ts`: with `maxDepth` given, the hard ceiling is not applied to the deadline |
| M5c | R5 | `engine.ts`: with `maxDepth` given, each iteration reads the clock once more |
| M6 | R6 | `levels.ts`: each `createLevel` instance seeds with seed + a module-level instance count |
| M6t | R6 | `engine.ts`: the transposition table is not cleared per call |
| M7 | R7 | `levels.ts`: a rate-0 level still blunders below a floor of 0.05 |
| M7n | R7 | `levels.ts`: the engine branch reports `nodes + 1` |
| M8d | R8 | `engine.ts`: the prior keys are dropped from iteration `ASPIRATION_FROM` (5) on |
| M9 | R9 | `engine.ts`: the capacity guard is one ply late (`ply > KEY_ARRAY_CAPACITY`) |
| M9r | R9 | `engine.ts`: the capacity guard is removed |
| F230, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1 | R8 (and R2) | **`QE-244-a`'s carry**, verbatim from `qe-ABC-244`'s frozen list. QPRIOROFF is re-anchored on today's `chooseMove` literal; it is the same plant, `priorKeys: false` |
| REP0, S241M1, QMATCH1 | R8 | the rest of CLI `ABC-241` A4's kill set in `qe-ABC-244`'s table |
| UNTRIM, S241M6, QUCINOKEYS | R2 | the rest of UCI `ABC-241` A5's kill set in that table |

## Procedure
1. **Base.** Run the whole default lane per mutant (`raw/lane.sh`: heap 128, `run-bounded` 120 s, JSON reporter). The failed rows are the base kill set. A suite error counts as a kill of every row in that file, and it is recorded as such.
2. **Tip sketch.** `raw/tip.py` writes the forms chosen under the rules below into the copy's test files. They are written after step 1, from the step-1 sets and the unmutated probes. Run the control, then the whole lane per mutant.
3. **Deep.** For each moved row, run its `-t` line under its flag at the tip sketch: unmutated, and under that row's mutants.

## Rules (fixed now)
- **(a) The A6 mutant per row** is the first mutant in the row's list above whose base kill set is that row alone.
  - If none is single-held, it is the row's listed mutant that the row kills with the fewest other killers.
  - In that case the row has no single-held guard on this list, and this note says so.
- **(b) The form.**
  - **S is the default.**
  - **W** only if every mutant the row kills at base is killed at the tip by a row that stays in the default lane. That row must not be a remnant of this ticket, and it is named as the holder.
  - **K** if no remnant kills a single-held mutant of the row. That is option (b), and the Orchestrator routes it.
- **(c) Parity, the gate.**
  - Every mutant the base default lane kills is killed by the tip's default lane.
  - For each S row, its remnant is among the tip killers of its A6 mutant.
  - If a remnant misses, it is redesigned once and the redesign is recorded. A second miss is K.
- **(d) Deep.** Unmutated, each moved row's `-t` line prints 1 passed. Under the row's A6 mutant, it prints 1 failed.
- **(e) Unkilled.** A mutant that no default-lane row kills at base is recorded. It leaves A6, because there is no parity to keep.
- **(f) The carry.** F230, QSEAMRAW, QPRIOROFF, QMATCH3 and QTRIM1 are each killed by the tip's default lane. The `src/cli.test.ts` rows that kill each one are named.

## Budget
At most 1 h of runs, all inside the lock, and none left running.
