# arch-ABC-302 observation: under the PREREG's 27 killed mutants, a tip sketch with six remnants keeps default-lane parity. R2, R8 and R9 each hold a guard no staying row holds, and R3 kills nothing on the list

Architect/Design, task `arch-ABC-302`, under the PREREG `…23abb6c5` (sealed and committed at `85b227b5`, before the first mutant read).

## Setup
- The reads used a scratch copy (`git archive`) of `grugops/arch-ABC-302` at `b84613c1`. Its `src/` tree is `af2b77dc`, which is `main` `fed3f2b4`'s.
- Every run was inside the host lock, and nothing was written to `src/` or `tools/`.
- Scripts are in `raw/`:
  - `mut.py`: the mutants;
  - `lane.sh` and `sweep.sh`: the whole default lane per mutant;
  - `tip.py`: the tip sketch;
  - `tlines.sh`: the `-t` lines;
  - `counts.sh`: defined counts;
  - `r8real.sh`: the spy check.
- Per-mutant kill sets are in `raw/kills/`. The matrix is `raw/kill-matrix.tsv`.

## Controls
- **Base:** 2 687 / 2 687 green over 71 files, 0 skipped.
- **Tip sketch:** 2 684 / 2 684 green over 71 files, which is base minus the three W rows. No " [deep" title is in the lane.
- **`tsc --noEmit`:** green on the sketch.
- **Biome:** formatting only, plus one variable the move leaves unused (uci-session's default `STEP_MS`). The formatter would reflow one moved-body line: R1's last `expect`, at +4 indent.

## Kill sets, whole default lane (`raw/kill-matrix.tsv`)
**Every one of the 27 is killed at the tip.** M1p is killed by no row at base and leaves the list (PREREG rule (e)).

| mutant | base killers among the nine rows, and the named holders | tip |
|---|---|---|
| M1 | R1 and `engine` `ABC-249` (incidental: its Qe5+ line meets a check) | R1's remnant and `ABC-249` |
| M2 | **R2 only** | R2's remnant only |
| M2s | R2, R8, CLI A7 and 4 more | R2's remnant, R8's remnant, A7 and the same others |
| M3, M3s | **not R3**: the futility literal row and `QE-268-b`, plus `transposition` A5 for M3 | the same |
| M4 | R4, R8, CLI A7, UCI `ABC-241` A4, and 15 more (19 in all) | R4's remnant among 19 |
| M4z | R4 and 21 more | R4's remnant among 22 |
| M5 | R5, `engine` A4 (no depth default) and levels `ABC-259` (two source-text rows) | R5's remnant and the same two |
| M5c | R5 and 9 more | R5's remnant and the same 9 |
| M6 | R6, A10, `QE-087-d (slice)` and 20 more | A10, `QE-087-d (slice)` and 19 more (21) |
| M6t | R5, `ABC-249` and 17 more | 17 |
| M7 | R7, levels A6, `QE-087-a`, CLI `ABC-101` A8′ | the three others |
| M7n | R7, levels A6, `ABC-242` A6 | levels A6, `ABC-242` A6 |
| M8d | **R2 and R8 only** | R2's and R8's remnants only |
| M9, M9r | **R9 only** | R9's remnant only |
| F230, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1 | R2, R8, CLI A7, CLI `ABC-230` A1, and more | CLI A7, CLI `ABC-230` A1, R8's remnant, R2's remnant (plus CLI `ABC-242` A4 on F230, QSEAMRAW and QTRIM1) |
| REP0, S241M1, QMATCH1, UNTRIM, S241M6, QUCINOKEYS | R2 and/or R8, plus UCI `ABC-241` A4 on each | the same holders; the remnants of R2 and R8 where their rows killed it |

## Deep (`raw/tlines.tsv`)
- Unmutated, each of the nine `-t` lines prints 1 passed.
- Under its row's A6 mutant, each prints 1 failed: R1/M1, R2/M2, R4/M4, R5/M5, R6/M6, R7/M7n, R8/M8d and R9/M9.
- R3's line passes under M3.

## Why R3 is blind
- `chooseMoveWithoutFutility` and `searchWithoutFutility` turn off taper, SEE pruning, history, SEE ordering and aspiration as well as futility.
- So R3 compares the shipped path with the pre-`ABC-269` path. Futility off alone leaves the shipped path still well under that path's node count.
- Its depth-1 sibling was re-pointed to the `…WithoutTaper` doors at `ABC-269`. R3 was not.

## R8 in `src/uci-session.test.ts` reads the real search (`raw/r8-real-search.tsv`)
- With the new block switched on in the default lane (scratch only), the whole file ran. That puts the block after every describe that stubs `chooseMove` and resets it (`ABC-212` A9, `ABC-220`, `ABC-221`).
- Unmutated, 232 / 232 passed.
- Under REP0 and under M8d, the moved R8 row and R2's moved row both fail.

## Unmutated probes (`raw/probe-*.tsv`, `raw/probe2-*.tsv`)
- **R9's row** runs 650 root passes, to depth 555. That is far beyond the 130 iterations it needs.
  - 230 passes reach depth 135. 260 passes (`2 * ITERATIONS`) reach depth 165, with deepest ply 128 and at most 128 writes per pass.
  - That costs about 21 ms warm and 43 ms in-lane, cold.
- **R2's and R8's shapes** hold every assert at steps 100–4 000 ms.
  - At 500 ms, the direct call reaches depth 8 at about 3 ms (R2's shape) and 6 ms (R8's).
  - At 4 000 ms it reaches only depth 1, which would not see M8d.
- **R1:** the in-check root plus position-5 at depth 4 make 210 null moves in both recursions, at about 19 ms.
- **R4:** at depth 1, 178 nodes are checked and 19 carry an ep square, at 5 ms.
- **R5:** a 10 000 ms counting clock gives 8 readings and depth 4, at 8 ms.

## Counts (`raw/counts.tsv`, defined tests by `-t` no-match)
- **Default lane:** 2 687 → 2 684.
- **Per file, default lane:**
  - `search.null-move` 38 → 38;
  - `search.futility` 37 → 36;
  - `zobrist` 32 → 32;
  - `engine` 69 → 69;
  - `levels` 49 → 47;
  - `uci-session` 230 → 230;
  - `engine.capacity` 1 → 1;
  - `cli` 109 → 109.
- **Deep lanes:**
  - `SEARCH_DEEP` null-move 45 → 46;
  - `SEARCH_DEEP` futility 53 → 53;
  - `ZOBRIST_DEEP` 33 → 34;
  - `ENGINE_DEEP` engine 83 → 84;
  - `ENGINE_DEEP` levels 58 → 58;
  - `ENGINE_DEEP` uci-session 241 → 243;
  - `ENGINE_DEEP` engine.capacity 1 → 2.
- `AGENTS.md`'s futility "47 tests" is already stale at base, which defines 53.
- Passed counts on the long deep lanes were not run here: `UNKNOWN - verify`, A4's.

## Durations (in-thread, single lane reads; `raw/row-durations-base.tsv`, `raw/remnant-durations-tip.tsv`)
- **The rows:** R1 133, R2 105, R3 80, R4 80, R5 90, R6 62, R7 75, R8 196 and R9 128 ms, 948 ms in all.
- **The remnants:** R1 22, R2 4, R4 4, R5 10, R8 18 and R9 43 ms, 100 ms in all.

## Runs
About 17 minutes of runs, all inside the lock. Nothing is left running.
