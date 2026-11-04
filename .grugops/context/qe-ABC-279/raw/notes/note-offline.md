# qe-ABC-279 offline re-grades on the frozen build: A1 MET (QE's own 14 hand rows plus the truth table, 22 / 22); A2 / G4 MET out of tree (new doors = base shipped on 1 990 rows, 13 older doors × 7 = base selves on 13 244 rows, 0 mismatches; exports +1 / +1 / 3); A3, A4 (a) and (b) MET (the committed deep rows, exact instrument counts); A4 (c) G6 MET ALONE (kiwipete 9 / 9, position-6 10 / 12, no run below 9); G2 by byte identity; A5 G1 54 / 58, none newly missed; scope and the rows moved obey the rules

QE/E2E, task `qe-ABC-279`. Base tree `00e99db8` and head tree `1feb7560`, each extracted to scratch with `git archive`. Lanes ran on the worktree at `109ecc25` (`src/` `fe6a0975`, 0 dirty). Every run went one at a time under `flock <scratch>/host-test.lock`. Scripts under `raw/scripts/`, outputs under `raw/out/`.

## A1: MET
- **The committed rows:** `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts`, exit 0, **43 / 43**. That is A1 (a)–(e) and the switch rows (23 hand rows, `HANGING_CORPUS` 24 / 24, the truth table, the source row, the in-check row, purity, 288 B, 3 exports).
- **QE's own hand rows** (`raw/scripts/a1.ts`; none is copied from the fixture), each swap list worked by hand before the run. **14 / 14 equal:**
  - P×P undefended +100.
  - Q×P defended by P −800.
  - R×P defended by N −400.
  - Doubled rooks against R+K on d7: −400 (own x-ray through the first rook).
  - Black B×N with a queen x-raying behind the bishop, P recaptures: +90.
  - Q×R defended by B −400.
  - B×N defended by P −10.
  - N×P on e5 with three attackers against three defenders (pawn, knight, knight against pawn, knight, bishop): −220, plus its colour-mirrored black row −220.
  - Q in front of R against P+R: −800. R in front of Q against the same: −400.
  - Q×N with a bishop x-ray behind the queen, P defends: −480.
  - R×P defended only by the king with a second rook behind: +100 (the king cannot recapture). The same without the second rook: −400.
- **The truth table**, each `isLosingCapture` as written:
  - false for en passant (see 100);
  - false for all four capturing promotions onto a rook- and king-covered square (see 220);
  - false for N×N defended by P (see 0);
  - false for a quiet move;
  - false for a king capture, hand-built (K×P onto a pawn-covered square, see −19 900; the move is illegal on that board).
  - Q×P (−800), B×N (−10) and the other losing rows above are true.
- Purity: the board, side, castling and ep square are byte-identical after every call, and a repeat call is equal. `seeScratchByteLength()` = 288.
- **A1 (b)'s wording is a gap, not a bar move.** "On a board where SEE alone would call the capture losing" cannot be met for three of its four clauses: the fold gives `see ≥ victim − attacker`, so a capture of an equal or bigger piece, en passant (P×P) and every capturing promotion (a pawn mover) never read below 0. The fourth, the king clause, holds only on an illegal move: a legal king capture lands on an unattacked square, so its `see` is the victim's value. The Engineer's rows (and QE's) pin `false` with `see` stated. See the gaps note.

## A2 / `G4`: MET (out of tree, `raw/scripts/a2.ts`, one process)
- **The corpus** is `ABC-078` `A3`'s, rebuilt as `src/engine.test.ts` builds it: 92 endgame rows (the six and every non-terminal child) and 209 broad rows (six roots and every child, plus `position-3`'s capped grandchildren). 301 in all.
- **New door = base shipped.** Head `searchWithoutSeePruning` against base `search()` at d1–5. Head `chooseMoveWithoutSeePruning` against base `chooseMove` on a frozen clock to d5, and on `A3`'s ticking clock at budgets 3 and 5 on the endgame set. **1 990 rows, 0 mismatches** on nodes, score, move (and depth for the engine).
- **Every older door = its base self.** The door names were read from both trees' exports: 13 search doors at d1–3 (the two `WithoutPruning*` doors at d1–2), and 7 engine doors frozen to d3. **13 244 rows, 0 mismatches.**
- **Export lists:** `src/search.ts` 24 → 25, adding only `searchWithoutSeePruning`. `src/engine.ts` 13 → 14, adding only `chooseMoveWithoutSeePruning`. Nothing was removed. `src/see.ts` exports exactly `isLosingCapture`, `see` and `seeScratchByteLength`. Nothing re-exports `see`.
- **Information:** head shipped `search()` against base at d3 / d5 on the same 301 differs on 417 of 602 rows, with nodes 2 785 480 / 6 015 500 = 0.4631 ×. So the switch is wired.

## A3 and A4 (a), (b): MET (the committed `SEARCH_DEEP=1` rows)
- `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts`: exit 0, **52 / 52**, 54 s.
- QE read each row against the bar. The bars are asserted as written:
  - drift ≥ 0.93 within 25 cp, max ≤ 144, 0 sign flips, on the 190 (asserted length), in both recursions at d5 against the doors;
  - mate floor on the 287: 0 violations;
  - d8 nodes `≤ 0.78 ×` on each of the four readings, plus the exact instrument counts 605 117 / 839 514, 406 787 / 1 533 901, 766 275 / 1 296 788, 87 475 / 404 930;
  - reach `≥ door + 0.55` on the 190 at 47 000 nodes.
- The printed figures, from QE's verbose re-run (same lane, exit 0, 52 / 52):
  - drift: `search()` d5 96.26 % within 25 cp of 187, max 66 (kiwipete/a1d1 298 → 232); `chooseMove` to d5 95.72 %, max 96 (kiwipete/f3f4 555 → 459); 0 mate sign flips in each;
  - mate floor d5: 0 of 190 violated;
  - d8: 0.7208 / 0.2652 (`search()`) and 0.5909 / 0.2160 (`chooseMove`). Kiwipete moves e2a6 −81 → d5e6 −89 in both, and position-6 plays c3d5 in both;
  - reach: 5.879 → 6.716 (+0.837), with 121 deeper, 1 shallower and 22 root moves differing.
  These equal the probe's and the Engineer's readings, to the node.
- **Zugzwang 7 / 7:** the committed rows in `src/search.null-move.test.ts` (`SEARCH_DEEP=1`, 44 / 44, exit 0) and `src/search.futility.test.ts` (53 / 53, exit 0), on the shipped `chooseMove`, at the recorded depths. No depth was re-pinned (diff read).
- Also green on the frozen tree: `SEARCH_DEEP=1` `src/quiescence.test.ts` 116 / 116; `ENGINE_DEEP=1` `src/engine.test.ts` 82 / 82 (the `ABC-078` `A3` identity sweep in-tree); `npm run lint` 0 (140 files); `npm run typecheck` 0.

## A4 (c) `G6` / `NFR-005`: MET (ALONE)
- `qe-ABC-268`'s `g6.mjs` / `timed.mjs` / `host.mjs`, unchanged: 5 interleaved rounds, wait-clear before each read (no foreign vitest or cutechess, load1 ≤ 2.0, Tctl ≤ 60), one fresh node process per search, `LEVELS[5]` 4 000 ms on both.
- Session 2026-11-04 00:12:21Z → 00:21:55Z. load1 1.23 → 0.80. Tctl median 57.4, max 73.0, no thermal stop.

  | board | base depths | head depths | median base / head | move | nps base / head |
  |---|---|---|---|---|---|
  | kiwipete | 9 9 9 9 9 | 9 9 9 9 9 | 9 / 9 | Bxa6 (both) | 856–877 / 667–702 |
  | position-6 | 10 10 10 10 10 | 12 12 12 12 12 | 10 / 12 | Nd5 (both) | 838–872 / 644–669 |

- No run is below 6, and none is at 7 (0 WARN). The median is ≥ base on both boards.
- **F9's margin on kiwipete is zero.** Head nps is about 0.80 × base, and at 4 s the node saving there buys no ply (it is at parity). This reproduces the Engineer's reading.

## A4 (d) `G2`: by byte identity
- `src/evaluate.ts` blob `0c8eab0f` and `src/evaluate-params.ts` blob `691044fc` are equal at `00e99db8`, `1feb7560` and `main`.
- No other production file outside the ticket's Files line moved. `git diff 00e99db8 1feb7560` touches only `src/see.ts`, `src/quiescence.ts`, `src/search.ts` and `src/engine.ts` among production files. `data/`, `package.json` and the lock file are unchanged.

## A5 `G1`: MET
- `PUZZLE_DEEP=1` lane: exit 0, 18 / 18. The gate asserts solved ≥ baseline 54 / 58. The verbose re-run prints `solved 54/58, baseline 54/58` with **no NEWLY-MISSED and no NEWLY-SOLVED line**, so the unsolved four are the recorded four.

## Scope (the Orchestrator's ruling in the brief): within it
- **`src/quiescence.ts`:** the header paragraph and the corrected "Not here" line (delta pruning and quiet checks stay listed), one import, the `seePruning?` field, and the two-line rule (`skipLosing` set only after the stand pat on the stand-pat branch, and the loop test after the one sort). Nothing else.
- **`src/engine.ts`:** the `Heuristics` field, `RULES_SEE_PRUNING`, the leaf's record selector, `seePruning: true` in `chooseMove`, the new door, and `seePruning: false` in the 7 older doors.
- **`src/search.ts`:** the same at its seam, with 13 older doors.
- In-check safety holds: an in-check node with `qply < 8` takes the evasion branch, where `skipLosing` stays false. At `qply ≥ 8` the node returns its stand pat before any move, so the rule never reaches an in-check node.
- **R-TC part 1, item 2:** no budget, deadline, `movetime`, test flag, clock or environment read in `src/see.ts` or the added lines.

## The rows moved (pin / bar rule, `…42c82347`): obeyed
- **Re-pointed to the door pair, figures unchanged:**
  - `ABC-170` A2 row 2 (it measures the abort);
  - `ABC-080`'s tie fixture: a4b3 on the doors. The engine-root = `search()`-root identity is kept on BOTH pairs, with a1b1 shipped;
  - `ABC-269` B0's five `chooseMove` and two `search()` d8 counts.
  These are pins of the pre-ticket search, moved by `ADR-0069` d8's reference.
- **Re-pinned:** `ABC-122` A6's oracle record. It is now the shipped `RULES_SEE_PRUNING`, so the derived leaf count goes 10 → 0 and the total 139 → 129. The relation `nodes = 1 + 128 + leaf capture nodes` and the score equality are unchanged. The oracle also gained `taper: true`: it had lagged the shipped record since `ABC-269`, and the comment names only the SEE change (gaps note, information).
- **Ladders and export lists:** +1 door each. `least` 13 → 14, 7 → 8, 14 → 15, 8 → 9.
- **No zugzwang, mate-floor, `G1` or relation row moved.** `git diff 00e99db8 1feb7560 -- src/*.test.ts` touches none of them.
