# arch-E1 PREREG: E1's design probe. Two phase forms of one tapered evaluation (L linear, P plateau), each with the two folded value changes (king endgame half, `ABC-231`; passer endgame half, `ABC-232`) and every other term wired with equal halves. What is read, the instrument check, the choice rule, and what decides nothing. Sealed and committed before any measured run

Architect/Design, task `arch-E1`, on `grugops/arch-E1` from `main` `a2b593d5` (`src/` tree `58fa3eb4`, the tree `arch-next-pull` measured). Inputs: `arch-next-pull` `…4de572aa`, `…d0f1a5fc`, `…7e3ace66`; `ADR-0056` D2 (E1, E2), D7 (`Q-3K-4`); `ABC-231`, `ABC-232` (acceptance rows); `ABC-205` (§ Design ruling, § the `G6` miss, § Close); `ADR-0031` addendum (the king endgame rule, accepted not shipped); `src/evaluate.ts`. **No measured run has been made in this hop.** The patch was applied and the module loaded once (a load check; no count read).

## Instrument
- Base: `git archive HEAD src package.json` into a scratch directory outside the repository (deleted after).
- `patch_e1.py` adds `E1CFG` to `src/evaluate.ts`. `on = 0` is `main`, node for node.
  - **Phase:** N 1, B 1, R 2, Q 4 over both sides, gathered in the existing walk, clamped to 24 (start = 24, pawn ending = 0).
  - **Blend:** w = clamp(phase − phEg, 0, phMg − phEg), D = phMg − phEg; score = mg + trunc(Δ × (D − w) / D), Δ = eg − mg summed over the terms whose halves differ. This equals trunc((mg·w + eg·(D − w)) / D) exactly.
  - **King endgame half:** 40 − 15 m, m = Manhattan distance to the nearest of d4, e4, d5, e5 (`ADR-0031` addendum's rule). Middlegame half = today's `KING_TABLE`.
  - **Passer endgame half:** 2 × today's `PASSED_PAWN_BONUS` (0, 10, 20, 40, 70, 120, 200). Middlegame half = today's.
  - **Every other term** (material, five PSTs, doubled, isolated, shelter / file terms, mobility weight and cap): endgame half = middlegame half. No value change.
  - Counters (evaluate calls, pieces, pawns, squares reached) for a per-node work proxy. **No timing is read anywhere.**
- Driver `e1probe.ts`. Every batch under `flock <host-test.lock> timeout 300`; every job `timeout ≤ 300`.

## The closed set (the only forms read)
- **BASE**: `on = 0` (`main`).
- **L** (linear): phMg 24, phEg 0.
- **P** (plateau, the common "midgame limit / endgame limit" shape): phMg 22, phEg 6. Pure middlegame while phase ≥ 22 (at most one minor pair off), pure endgame at phase ≤ 6.
- No other form, constant or table is read or tuned in this hop.

## Instrument check (not a bar; a differing count is explained before anything is read)
- BASE d8 nodes reproduce `arch-next-pull`'s `main` door: `search()` kiwipete 888 786, position-6 1 262 046; `chooseMove` kiwipete 1 306 981, position-6 391 451.
- BASE `play` at 47 000 nodes reproduces `arch-next-pull`'s `play47000.jsonl` move for move on the 145.

## What is read (each of L and P against BASE)
1. **G6 shape (deterministic node counts):** nodes to complete depth 7, 8, 9 on kiwipete and depth 7, 8, 9, 10 on position-6 in `chooseMove` (the `G6` recursion); `search()` d8 on both as a report.
2. **Work proxy:** evaluate calls per node, pieces / pawns / mobility squares per call (BASE, d8 `chooseMove`, both boards). E1's added operations per call are then stated from the code (per non-pawn piece one phase add; per king one load and one add; per call one passer add, a clamp, one multiply, one divide). A proxy, not a time.
3. **Play premise checks:** the mate floor (BASE d4 mates → form d5 on the 287: violations; same-depth d5 a report); zugzwang (`ADR-0050` d9's seven rows at their recorded depths); `G1` (58 puzzles on the virtual clock: solved, NEWLY-MISSED).
4. **Static shapes:** the mirror (`Object.is`) over `G3`'s corpus; six king-and-pawn endings (centre king minus corner king); seven full-material middlegames (form minus BASE); six passers at ranks 4–7 at low phase (form and BASE).
5. **Reports:** reach at 47 000 on the 196 (`chooseMove`, `maxNodes`); drift at d5 in `chooseMove` on the 196 (expected for an evaluation change; it decides nothing).
6. **The evaluation instrument (information only):** `arch-next-pull`'s 145 positions at 47 000 nodes, Stockfish 19 depth 16 labels (the chosen form; both if time allows): mean loss, errors ≥ 50 / 150 / 300, Stockfish's best %, by ply bucket. **It never decides a form or a bar** (a rule fitted to a fixed corpus measures nothing).

## Choice rule (between L and P)
- **Eligible:** mirror 0 mismatches, mate floor 0 violations, zugzwang 7 / 7, `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
- **Among eligible forms:** the smaller **G6-shape statistic** S = the largest `chooseMove` node ratio against BASE over kiwipete d8, d9 and position-6 d8, d9, d10. Within 0.01 of each other: **L** (the textbook form, and the one the owner accepted in the `ADR-0031` addendum).
- **Neither eligible:** the ADR is still written (the brief asks for it). The failed check is named in it as a build-blocking finding, and no form, constant or bar is changed after the read.
- Why S chooses: under `Q-3K-4`'s default ("`G6` ≥ base" binds), tree shape on the `G6` boards is the measured way `ABC-205`'s taper lost (`position-6` +3.2 % nodes to depth 8, taper alone). Under the alternative (play-judged), either eligible form is acceptable, so the default's need decides.

## What the readings feed
- The ADR's per-node cost statement (work proxy + node ratios), its `G6` bars under both `Q-3K-4` outcomes, its play bars (mate floor, zugzwang, `G1`), and its static acceptance shapes for BA/PM.
- Nothing here is a build's reading. The build's `G2` (time per call) and `G6` (real clock, 4 000 ms) are QE's.
