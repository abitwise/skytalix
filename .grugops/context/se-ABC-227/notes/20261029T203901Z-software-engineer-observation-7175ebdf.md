---
id: 20261029T203901Z-software-engineer-observation-7175ebdf
kind: observation
by: software-engineer
at: 2026-10-29T20:39:01Z
verified_by: 
confidence: high on the measured shares on this host at main 193447bc; per-cut speed-up and play effect UNKNOWN - verify
refs:
  - se-ABC-227
  - ABC-227
  - EPIC-010
  - ABC-235
  - ABC-206
  - bapm-epic010-improvements/20261029T201508Z-ba-pm-decision-12cb550d
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - sa-ideas-verify/20261029T200049Z-system-analyst-decision-837e6fa8
  - ADR-0049
  - NFR-009
  - .grugops/context/se-ABC-227/raw/
supersedes: 
seal: sha256:df6d5b3be0ea3bc3f2bc3d84d2e1ace510c1cadd11603198bd084b1a11a81413
---

# SE observation, se-ABC-227: where a node's time goes at 3 000 ms (kiwipete, position-6, start); A1-A5

Measured at `main` `193447bc` (`src` unchanged), Node v26.12.1, this host, 2026-10-29 20:33:21-20:34:57 UTC. Measurement
only: no `src`/`data`/`tools` change, no game, no `rating.ts`. Each board: 5 fresh processes under `node --cpu-prof`
(200 µs interval) and 5 more under the inspector's sampling heap profiler (8 KiB, collected objects included). Only
samples inside the `chooseMove` window count (start-up and TypeScript stripping excluded; GC inside it kept; 0
`chooseMove` samples fell outside it in all 15 runs; ~12 000 samples per run). No process named cutechess existed at
any run; load1 0.92-1.64 (24 logical CPUs), recorded per run in `raw/analysis.json`.

Files (`raw/`): `run.mts` (one run), `profile.sh` (driver), `redact.mts` (host paths out, gzip), `analyse.mts`,
`analysis.txt`, `analysis.json`, `profiles/` (15 `.cpuprofile.gz`, 15 `.heapprofile.gz`, 30 run `.json`). Reproduce:
`profile.sh <work>`, `node redact.mts <work>`, `node analyse.mts`.

## A1: nodes per second and the top 15 by self time (pooled share of the 5 runs; full table with per-run ranks in `analysis.txt`)

| board | median nps (cpu-prof runs) | median depth | per-run nps |
|---|---|---|---|
| kiwipete | 572 859 | 8 | 549 839-590 458 |
| position-6 | 605 729 | 10 | 597 537-611 190 |
| start | 467 292 | 10 | 457 735-476 690 |

The heap-sampling runs ran at 0.61-0.70x these rates (that profiler's overhead), so nps is read from the CPU runs.

| # | kiwipete | % | position-6 | % | start | % |
|---|---|---|---|---|---|---|
| 1 | isSquareAttackedBy (moves) | 12.9 | whiteMinusBlack (evaluate) | 10.3 | isSquareAttackedBy | 10.9 |
| 2 | whiteMinusBlack | 10.1 | isSquareAttackedBy | 9.9 | generateMoves (moves) | 10.3 |
| 3 | kingSquareOf (legal) | 7.2 | generateMoves | 8.2 | whiteMinusBlack | 8.2 |
| 4 | squaresReached (evaluate) | 7.1 | kingSquareOf | 8.2 | kingSquareOf | 7.3 |
| 5 | raySliderAttacks (moves) | 7.0 | squaresReached | 7.1 | squaresReached | 5.6 |
| 6 | generateMoves | 6.7 | pawnStructure (evaluate) | 7.0 | pawnStructure | 5.3 |
| 7 | pawnStructure | 6.7 | isPassedPawn (evaluate) | 5.2 | isPassedPawn | 5.2 |
| 8 | isPassedPawn | 4.3 | raySliderAttacks | 4.3 | raySliderAttacks | 4.7 |
| 9 | addMove (moves) | 3.5 | orderMoves (search) | 3.7 | addMove | 4.0 |
| 10 | orderMoves | 3.0 | addMove | 3.6 | addPawnMoves (moves) | 3.5 |
| 11 | kingExposure (evaluate) | 2.9 | addRayMoves (moves) | 2.8 | addRayMoves | 3.5 |
| 12 | quiesce (quiescence) | 2.8 | addPawnMoves | 2.8 | orderMoves | 3.5 |
| 13 | makeMove (apply) | 2.6 | quiesce | 2.8 | makeMove | 2.7 |
| 14 | addRayMoves | 2.3 | makeMove | 2.8 | kingExposure | 2.4 |
| 15 | addPawnMoves | 2.1 | kingExposure | 2.5 | (garbage collector) | 1.9 |

Native builtins are charged to the JS function that calls them: `kingSquareOf` is one `Uint8Array.indexOf` over the
0x88 board, and `orderMoves` includes its `Array.prototype.sort`.

## A2: stability. Holds on all three boards

Max |run rank − pooled rank| for the top 5: kiwipete 0, 0, 2, 2, 2; position-6 1, 1, 1, 1, 1; start 0, 0, 1, 1, 1. All
within ±2, so no extra runs were needed. On kiwipete, ranks 3-7 sit within 0.5 points of each other (7.2-6.7 %), which
is why they swap places.

## A3: the five buckets, share of self time (pooled; per-run min-max)

| bucket | kiwipete | position-6 | start |
|---|---|---|---|
| move generation (`moves.ts`, `legal.ts`) | 47.4 (46.5-48.8) | 44.9 (44.3-45.7) | 50.5 (49.9-51.2) |
| make/unmake (`apply.ts`) | 4.2 (3.7-5.8) | 4.1 (3.7-4.6) | 4.0 (3.8-4.3) |
| evaluation (`evaluate.ts`) | 31.5 (29.6-32.3) | 32.8 (32.0-33.4) | 27.0 (26.6-27.3) |
| ordering (`orderMoves`/`orderKey` and their callees) | 5.5 (5.1-5.8) | 6.6 (6.4-6.7) | 6.5 (6.2-6.8) |
| TT (`transposition.ts`) | 1.1 (1.0-1.2) | 1.3 (1.0-1.5) | 2.0 (1.9-2.1) |
| other | 10.3 | 10.3 | 10.1 |
| sum | 100.0 | 100.0 | 100.1 |

Other is made up of quiescence.ts self (sort + loop) 1.6-3.9, position.ts helpers (`isBlack` and `pieceType`, not
inlined) ~2.0, GC 1.6-1.9, engine.ts (its own negamax and `countNode`) 1.3-2.0, zobrist 0.7-1.4, search.ts 0.3-0.6
and gameend 0.3-0.5. Inclusive readings (self + callees): legality by make/test/unmake is `legalMoves`
17.9/18.8/22.7, `legalCaptures` 23.6/20.1/17.0 and `hasLegalMove` 9.7/9.5/14.2. Within that, `isSquareAttackedBy` is
20.5/14.6/16.1. `evaluate` is 32.4/33.7/27.7 and `quiesce` 60.7/58.0/46.6 (kiwipete/position-6/start).

## A4: allocation

Bytes allocated per node, as a median of the CPU runs (V8 `total_allocated_bytes` across the call): kiwipete 2 737,
position-6 2 807, start 4 019. That is 1.57/1.70/1.89 GB/s. The sampled heap profile agrees with the counter within
2 % (ratio 0.981-0.984). The share of bytes allocated in `orderMoves` (with its callees, including its native `sort`)
is 8.6 % / 9.6 % / 12.8 %. Move generation holds 78.1 / 76.5 / 76.1 %: `generateMoves` 52.5 / 50.5 / 38.0 and
`addPawnMoves` 14.5 / 15.6 / 27.3. Quiescence's `captures.sort` adds another 8.2 / 8.6 / 2.2 %. Evaluation allocates
0 %. GC, though, takes only 1.6-1.9 % of the time.

## A5: the hand-off to `ABC-235`. Buckets at ≥ 5 % on at least two boards

These are move generation, evaluation and ordering. Make/unmake (4.0-4.2) and the TT (1.1-2.0) miss the bar on every
board. Each candidate cut below comes with the profiler's reading on value-identity. Architect/Design confirms it at
`ABC-235`'s design hop.

1. **Move generation: `kingSquareOf` scan** (7.2/8.2/7.3 % self). The cut keeps both king squares on `Position`,
   updated in make/unmake. **Value-identical: yes.** It returns the same square, so moves, order and scores are
   unchanged. Perft is the check.
2. **Move generation: legality by make/test/unmake of every pseudo-legal move** (SA 7b; `isSquareAttackedBy` +
   `raySliderAttacks` 19.9/14.2/15.6 % self). The cut is check/pin-aware legality: a full test only for king moves,
   en passant, pinned pieces and positions in check. **Value-identical: yes, if** it keeps the same set (perft) and
   filters in generation order. It is larger than item 1.
3. **Move generation: `legalCaptures` builds every pseudo-legal move first** (SA 7d remainder; `legalCaptures`
   inclusive 23.6/20.1/17.0). The cut is a captures-only generator. **Value-identical: yes, if** captures come out in
   the full generator's relative order, because quiescence's stable sort depends on it (ABC-206). Capture-promotions
   and en passant need care.
4. **Evaluation: material + PST recomputed per call** (SA 7e; part of `whiteMinusBlack` 10.1/10.3/8.2). The cut is
   incremental material+PST in make/unmake. **Value-identical: yes.** The evaluation is untapered integer arithmetic,
   so an incremental sum equals the recomputed one exactly. Mobility (`squaresReached` 7.1/7.1/5.6) still needs the
   walk, so the board walk itself stays.
5. **Evaluation: pawn structure + passed pawns per call** (`pawnStructure` + `isPassedPawn` 11.0/12.2/10.5). The cut
   is a cache keyed on pawn placement. **Value-identical: yes.** Both read only pawn squares; `kingExposure` reads
   pawns and king squares, so a pawn-king key would be needed to include it. Cache size counts against `NFR-009`.
6. **Ordering: object per move, then sort and map** (SA 7f; 5.5/6.6/6.5 % time, 8.6/9.6/12.8 % bytes). The cut keys
   into a reused typed array and sorts indices or sorts in place. **Value-identical: yes, if** ties keep generation
   order, since today's `Array.prototype.sort` is stable. Quiescence's `captures.sort` calls `mvvLvaKey` inside the
   comparator and allocates 2-9 % of bytes. It sits in "other" and is the same kind of cut, value-identical on the same
   stable-tie condition.

Not candidates: make/unmake (below 5 % everywhere) and the TT (≤ 2 %). Move-object allocation (`generateMoves`,
`addMove`, `addPawnMoves`: 76-78 % of bytes) costs little GC time (≤ 1.9 %). Its CPU share is already inside items 1-3,
and a packed-integer move would touch every `Move` consumer, which is no small ticket. No item is ranked by play value.
§ B's "success is playing results" stands, and nps is not strength (SA 7g).

## UNKNOWN - verify

- The nps gain each cut buys. The shares bound it, they do not measure it.
- Whether V8's inlining moves self time between caller and callee. Inlined frames appear in the profile, but the
  split is the profiler's.
- The shares at levels other than 3 000 ms, on a mid-game from real play, or warm across a game's moves (each run here
  is one fresh process).
