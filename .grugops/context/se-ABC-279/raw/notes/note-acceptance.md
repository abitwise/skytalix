# se-ABC-279 acceptance, offline bars: every bar this hop can grade is MET. The build reproduces the probe's faithful build exactly: d8 0.7208 / 0.2652 (`search()`) and 0.5909 / 0.2160 (`chooseMove`) ≤ 0.78; reach 5.879 → 6.716 (+0.837 ≥ 0.55); drift 96.26 % / 95.72 % within 25 cp, max 66 / 96 ≤ 144, 0 sign changes; mate floor 0 / 190; zugzwang 7 / 7; G1 54 / 58 with none newly missed; G6 median ≥ base on both boards; G2 by byte identity. A2 (cross-build) and A6 (games, S′, Levels) are QE's

Software Engineer, task `se-ABC-279`, `grugops/ABC-279`. Every run was deterministic (a fixed depth, or `chooseMove` on a frozen clock with `maxDepth` / `maxNodes`, or G1's virtual clock), one job at a time under `flock <scratch>/host-test.lock`. The exception is G6, which reads the real clock (see below). Scripts and outputs: `raw/scripts/`, `raw/out/`.

## A1 (default lane, `src/see.test.ts`, no full-width search): MET
- (a) 23 hand rows, each with its swap written beside it (the ADR's six, then 17 more), x-rays on both sides and both colours to move: `see` equals the hand value on 23 / 23. `HANGING_CORPUS`: 24 / 24 are `see < 0` and LOSING.
- (b) The truth table.
  - A king capture is false, with `see` −19 900 on a hand-built K×P onto a rook-covered square.
  - A capturing promotion is false (see 400). En passant is false (see 0). An equal or bigger victim is false (R×R 0, N×B 10).
  - Q×P defended by P (−800) is true, B×N defended by P (−10) is true, and N×N defended (0) is false. A quiet move is false.
  - **For QE:** "on a board where SEE alone would call it losing" can be met only for the king clause. The fold gives `see ≥ victim − attacker`, so a capture of an equal or bigger piece, en passant (P×P) and a capturing promotion (a pawn mover) can never read below 0. Those rows stand on defended squares with `see` pinned, and the test comment states the bound.
- (c) With `seePruning` on, the children entered (read by the visitor at qply 1, as FENs) are exactly the whole MVV-LVA-sorted list less the `isLosingCapture` moves, in order, on 27 out-of-check rows (the 24 hanging, kiwipete, position-6, CPW). At least 24 moves are skipped.
  - A record built without the field searches every capture.
  - A node whose every capture is losing returns `evaluateAtPhase`.
  - A source row pins the order: stand pat → flag → one sort → the loop test.
- (d) In check (pawn check, Q×P defended by N, −800, LOSING), the evasion is searched, and every legal move is entered.
- (e) The board is byte-identical after `see` on all 47 rows, and a repeated call is equal. `seeScratchByteLength()` = 288. `src/see.ts` has exactly 3 exports.
- Also: the seePruning literal ladder (true on the shipped entry only; the door is the shipped literal less the switch; ≥ 15 / 9 entries). seePruning is a field of Switches, Heuristics and QuiescenceRules only. R-TC: no budget, clock, process or environment read in `src/see.ts` / `src/quiescence.ts` code.

## A3 (`SEARCH_DEEP=1`, `src/see.test.ts`; also the scratch driver): MET
- (a) Drift, depth 5 on the 190 against the doors:
  - `search()`: 96.26 % within 25 cp of 187, max 66 (kiwipete/a1d1 298 → 232), 0 sign changes.
  - `chooseMove`: 95.72 %, max 96 (kiwipete/f3f4 555 → 459), 0.
  - Root moves differ on 9 / 7 rows.
- (b) Mate floor, door d5 → head d5 on the 287: 0 of 190 violated (0 longer).
- (c) Zugzwang 7 / 7 at the recorded depths, on the shipped `chooseMove`: zugzwang.001 e1f1 d9, four kpk rows d8, zugzwang.004 h3h4 d11, zugzwang.005 f4d5 d12. That is the scratch reading plus the committed rows in `src/search.null-move.test.ts` / `src/search.futility.test.ts`, which are green. No depth was re-pinned.

## A4: MET
- (a) d8 (exact instrument counts, pinned in A4 (a)'s rows):

  | reading | head | door | ratio |
  |---|---|---|---|
  | `search()` kiwipete | 605 117 | 839 514 | 0.7208 |
  | `search()` position-6 | 406 787 | 1 533 901 | 0.2652 |
  | `chooseMove` kiwipete | 766 275 | 1 296 788 | 0.5909 |
  | `chooseMove` position-6 | 87 475 | 404 930 | 0.2160 |

  - Kiwipete moves e2a6 −81 → d5e6 −89 in both recursions. Position-6 is c3d5 in both (74 / 71 head).
- (b) Reach at 47 000 on the 190: door 5.879 → head 6.716 (+0.837), with 121 deeper, 1 shallower, and 22 root moves differing.
- **The instrument check is exact on every count** (the ADR's d12 line, on the same src tree `4cb84035`). `main`'s `src/` has not moved since the cut, so no re-derived count is owed.
- (c) **G6 / NFR-005 at `LEVELS[5]` 4 000 ms, graded "≥ base" by the median. MET (SE's local reading; not a QE ALONE certification).**
  - qe-ABC-268's `g6.mjs` / `timed.mjs` / `host.mjs`, unchanged: 5 interleaved rounds, wait-clear before every read (no foreign vitest, load1 ≤ 2.0, Tctl ≤ 60), one fresh node process per search.
  - Base = `main` `src/` `4cb84035`, head = `cd9ccd10` `src/` (production code equal to `1feb7560`). Session 22:43:48Z-22:52:01Z, no thermal stop.

  | board | base depths | head depths | median base / head | move | nps base / head |
  |---|---|---|---|---|---|
  | kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | Bxa6 (both) | 847-868 / 660-709 |
  | position-6 | 10 10 10 10 10 | 12 12 12 12 12 | 10 / 12 | Nd5 (both) | 833-860 / 647-666 |

  - No run is below depth 6, and none is at 7 (0 WARN).
  - **For QE, F9's margin:** head nps is about 0.78-0.82 × base (SEE's per-node cost). At 4 s on kiwipete the node saving buys no extra ply, so kiwipete sits at parity (9 = 9). The host was shared, with other agents serialised on the lock, so the nps figures are medium confidence.
- (d) G2 by byte identity: `src/evaluate.ts` (`0c8eab0f`) and `src/evaluate-params.ts` (`691044fc`) are blob-equal to `main`. G2 was not re-read.

## A5: MET
- `PUZZLE_DEEP=1` lane: exit 0, 18 / 18.
- The scratch G1 read, with the suite's rule, budget and virtual clock: door 54 / 58 and head 54 / 58. None is newly missed and none newly solved, so the lines are the same.

## Gates on `1feb7560` (all exit 0)
- `npm run lint` (140 files), `npm run typecheck`, `npm run build`.
- `npm test`: 67 files, 2 631 / 2 631, 0 skipped. Base `main` 2 588 → 2 631. The +43 are `src/see.test.ts`'s default rows (39 A1 rows + 4 switch rows); its 9 deep rows are defined only under `SEARCH_DEEP=1` (52 in all). The other edited files keep their counts (rows rewritten, none added or dropped).
- Deep lanes, each exit 0:
  - `SEARCH_DEEP=1`: search 57 / 57, quiescence 116 / 116, futility 53 / 53, null-move 44 / 44, pvs-lmr 29 / 29, taper 168 / 168, transposition 40 / 40, see 52 / 52 (55 s).
  - `ENGINE_DEEP=1`: transposition 26 / 26, engine 82 / 82 (180 s).
  - `PUZZLE_DEEP=1`: 18 / 18.
  - `src/search.ordering.test.ts` (rows edited here): `SEARCH_DEEP=1` 43 / 43, `ENGINE_DEEP=1` 30 / 30. `src/search.capacity.test.ts` 1 / 1.
- **N8-LANE (vitest Duration, 3 interleaved rounds):**
  - Base `main` snapshot: 9.96 / 9.50 / 9.91 s (median 9.91).
  - Head: 9.77 / 9.59 / 10.13 s (median 9.77).
  - **One head run is over NFR-008's 10 s.** Base already reads up to 9.96 s on this host, so the lane sits at the bound before this ticket. Flagged, not claimed as MET: `UNKNOWN - verify` on a quiet host.
- Typecheck once ran without the lock (a single `tsc`, a slip). Every test, engine and build run otherwise went through `flock`.

## Owed to QE (not graded here)
- **A2 / G4:** node-equal across builds on the `ABC-078` A3 corpus, out of tree. Base `search()` / `chooseMove` against head `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning`, and every older door against its base self. In-tree evidence: the doors reproduce `ABC-269` B0's base counts exactly.
- **A6:** C2′ 100 games at 100 ms against the merge-base (GAIN ≥ 50.0), S′ at E 1 810, and the Levels deep lane, host ALONE.
- **UAT** (production lines; QE's verdict signs).
