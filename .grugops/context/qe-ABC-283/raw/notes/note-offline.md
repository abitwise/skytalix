# qe-ABC-283 offline bars, re-read independently: **P0 6 / 6; mate floor `search()` d5 0 / 190 and `chooseMove` d5 0 / 188 (against both the all-off doors and base `main` itself), with every older floor row at 0; zugzwang 7 / 7; G1 54 / 58, none newly missed; typecheck, lint and build 0; skip count 0; `npm test` 2 665 / 2 665; R-281-a 4 / 1 / 1 / 1; 28 game-free deep lanes (27 in `lanes.sh` plus Levels) exit 0, 0 failed.** The three re-pins are pins, not bars. Drift max 28 / 27 cp (information)

QE/E2E, task `qe-ABC-283`. QE's own driver `raw/scripts/drv.ts` (not the Engineer's or the Architect's), one part per process. The arms are out of tree: B = `git archive 09694a4e`, H = `git archive ab0a37b6`. Every search ran at a fixed depth or on a frozen clock, under `flock <scratch>/host-test.lock`. Output: `raw/out/offline/`; readout `grade.out` (`grade-offline.py`).

## B1 / P0: all off equals main. MET, 6 / 6
- **Method:** base `search()` and `chooseMove(maxDepth)`, computed fresh on B (not the Engineer's `p0-main.jsonl`), against H's `searchWithoutBundle` / `chooseMoveWithoutBundle`. Kiwipete and position-6, at d6, d7 and d8.
- **Result:** nodes, score, move and depth are byte-equal on all 6 rows.
- **d8 figures:** `search()` 605 117 / 406 787 and `chooseMove` 766 275 / 87 475.
- **On the 287 at d5 and d6,** the all-off doors' scores also equal base `main`'s, every row.

## B2 (a): the mate floor. MET, 0 violations
A violation is a door mate whose head score is not a same-sign mate.

| row | reading |
|---|---|
| `search()` d5 vs `searchWithoutBundle` d5 | **0 of 190** |
| `search()` d5 vs base `main` `search()` d5 | **0 of 190** |
| `chooseMove` d5 vs `chooseMoveWithoutBundle` d5 | **0 of 188** |
| `chooseMove` d5 vs base `main` `chooseMove` d5 | **0 of 188** |
| futility door d5 / SEE-pruning door d5 / taper door d5 / taper d4 → d5 | 0 / 189, 0 / 190, 0 / 189, 0 / 163 |
| older form, base `search()` d4 → head d5 (report) | 0 / 163 |
| **report:** `chooseMove` d6 vs the all-off door, and vs base `main` | 2 / 209 each: `7k/8/R4K2/8/8/8/8/8 b` and `7k/8/5K2/8/8/8/8/5R2 b`, −29994 → −652 |

- **The committed rows are green:** the bundle lane prints "0 of 190 violated" and "0 of 188 violated" (21 / 21), futility 53 / 53, see 52 / 52 and taper 169 / 169.
- **Break attempt (information, `R-283-LMR`):** `raw/scripts/probe-krk.ts` draws a FRESH seeded corpus, 600 legal random KRK and KQK positions (seed 283).
  - d5: 0 of 16 door mates violated in `search()`, and 0 of 16 in `chooseMove`. One extra mate is found by the head only.
  - `chooseMove` d6: 1 of 30. `5K2/8/4k3/8/8/8/3q4/8 w` reads −29994 → −1053: the defending side misses the mate against itself, the same shape as the 287's d6 rows.
  - The d5 floor holds off the 287 as well. The d6 order-sensitivity reproduces.

## B2 (b): zugzwang. MET, 7 / 7
- `ADR-0050` d9's seven rows, copied from the ADR: shipped `chooseMove`, frozen clock, each at its recorded depth.
- Moves played: e1f1 (d9), h3h4 (d11), f4d5 (d12), b6c6, c6d6, d6e6, e6f6 (d8). None was re-pinned.

## B2 (c): G1. MET, none newly missed
- 54 / 58 at the baseline's 25 ms budget and 1 ms virtual clock.
- The four missed rows are exactly the baseline file's `unsolved` and exactly base `main`'s own run on B. Newly missed [], newly solved [].
- The `PUZZLE_DEEP` lane is 18 / 18.

## A driver defect, found and fixed (recorded, not hidden)
- v1 of `drv.ts` printed a move as from + to + the numeric `promotion` field. That field is 0 on non-promotions, so every UCI compare in the zugzwang and G1 parts read false (0 / 7 and 24 / 58, on both B and H alike).
- v2 prints from + to, as `src/puzzle-suite.test.ts` labels a move. The zugzwang and G1 parts were re-run once, under the lock.
- The engine's output is identical between v1 and v2: the same moves, depths and nodes.
- No other part compares UCI strings across formatters. P0 compares one formatter's output on both sides; the floor and the ratios compare scores and nodes.
- The v1 outputs are kept in `raw/out/offline/v1-formatter-bug/`. That one line is the only change to `drv.ts` since the PREREG's sha256 list (`scripts.sha256` → `scripts-final.sha256`).

## Gates and lanes (`raw/out/lanes/exits.txt`, in the worktree at `840a343d`, `src/` `d051784f`, clean)
- **Gates:** typecheck 0, lint 0 (147 files), build 0. Skip count **0**; `test-skip-integrity.js` reports "No findings.". `npm test` 2 665 / 2 665 in 70 files.
- **R-281-a's four `-t` lines, each at its expected count:** ABC-167 A5 **4** passed; QE-208-a **1**; ABC-230 A3/A4 **1**; levels A9 **1**. None is short.
- **Game-free deep lanes, all exit 0 with 0 failed:**
  - bundle 21, search 57, see 52, futility 53, taper 169, null-move 45;
  - pvs-lmr 29 (search) and 21 (engine), quiescence 116 (search) and 99 (engine);
  - transposition 40 / 26, ordering 43 / 30;
  - engine 83, pawns 44, legal 50, moves 38, gameend 58;
  - puzzle 18, zobrist 33, perft 32, input 34, tune 17;
  - cli 11, uci 13, uci-session 241;
  - and Levels 58, run ALONE (games note).
  - The ladder lane was not run, because it plays games.

## The three re-pins: each a pin, not a bar (`…c7609f51` 1–2)
1. **The order row** (`src/search.bundle.test.ts`) pins the comparator under K3: negative cells key 0. It asserts the ordering, not a safety property. The added assertion (negative = zero, below every positive cell) is K3's own statement in `ADR-0063` d4, dated 2026-11-04.
2. **`ADR-0066`'s KRK aspiration row,** iteration 5 → 6. The FEN, c5c6, MATE − 5 and the door-equality assertions are unchanged, and `ADR-0066` d9 reads "a forced mate found first at iteration 5 or later". The bar holds. The row now pins *which* iteration, not whether the mate is kept.
3. **The d8 instrument row:** 523 847 / 707 548 and 234 214 / 101 425. It is titled "information, not a bar". QE's driver reads the same figures.
- **No zugzwang, mate-floor, G1, P0 or relation row moved.** The P0 row still reads main's 605 117 / 766 275 and 406 787 / 87 475.

## Information
- **Drift** (`ADR-0063` d8 form, history on vs off, d5 on the 190): `search()` 99.47 % within 25 cp, max 28 cp; `chooseMove` 99.47 %, max 27 cp. 0 sign flips and 0 mate changes. That is within 42 cp, reported and not graded (`…3851bf43` 2).
- **d8 nodes / base:** `search()` 0.8657 (kiwipete) and 0.5758 (position-6); `chooseMove` 0.9234 and 1.1595. The root move and score are base's on both.
- **Scope:** the production diff is `src/search.ts`, `src/engine.ts`, and `src/see.ts` (doc comment only, 6 lines). Exports: `src/search.ts` +7 (3 doors + 4 history pieces) and `src/engine.ts` +4 doors, none removed, which is exactly `…d64042c4` decision 2.
