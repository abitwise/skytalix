---
id: 20261029T205200Z-architect-design-decision-7fc1b90c
kind: decision
by: architect-design
at: 2026-10-29T20:52:00Z
verified_by: 
confidence: high on value-identity by construction and on the re-cut shares and probe counts; per-cut nps gain UNKNOWN - verify
refs:
  - arch-ABC-235
  - ABC-235
  - ABC-227
  - EPIC-010
  - EPIC-008
  - ABC-206
  - se-ABC-227/20261029T203901Z-software-engineer-observation-7175ebdf
  - se-ABC-227/20261029T203901Z-software-engineer-decision-e56997fd
  - ADR-0002
  - ADR-0003
  - ADR-0020
  - ADR-0024
  - ADR-0025
  - ADR-0026
  - NFR-001
  - NFR-005
  - NFR-009
  - ABC-231
  - ABC-232
  - ABC-233
  - ABC-234
  - .grugops/context/arch-ABC-235/raw/
supersedes: 
seal: sha256:be27e41400027a37532011a4157a1e5ff58527a91649654531a281710560ec2e
---

# Architect/Design decision, arch-ABC-235: which of ABC-227's six cuts are value-identical, and the proof each one owes

Records only, at `main` `ff416a56` (`src` equals `193447bc`'s, the commit ABC-227 profiled). No `src`, `data`, `tools`, ticket, epic or board edit. Inputs: ABC-235's page; SE `se-ABC-227` `…7175ebdf` (A1-A5, the six cuts) and `…e56997fd` (method); `ADR-0002`, `ADR-0003`, `ADR-0020`, `ADR-0024`, `ADR-0025`, `ADR-0026`; ABC-206's design and its owner-accepted reading `OD-206-1`; EPIC-008 § Common gates; EPIC-010.

"Value-identical" means: for every in-domain position, the same move lists in the same order, the same scores, and so the same tree, the same node counts and the same clock reads. "In-domain" means what `parseFen` and `makeMove` can produce: one king per side, a consistent en-passant square.

## Two readings taken for this ruling (no `src` change)

1. **The SE's 15 CPU profiles, re-cut by call stack** (`raw/cuts.mts`, output `raw/cuts.txt`). No engine run. This splits each cut's own share from its neighbours' (k / p6 / s = kiwipete / position-6 / start, % of in-window self time, pooled over 5 runs).
2. **One probe on a scratch copy of `src`** (`raw/probe.mts`, instrumentation in `raw/probe-instrumentation.diff`). `chooseMove` with `maxNodes` 400 000 on the three boards; 3.3 s CPU in total. No process named `cutechess-cli` ran (`pgrep -x`), load1 0.74-0.78. Counts are deterministic; no timing is read from it.

| board | evaluate calls | makeMove per evaluate | pawn signatures, unique | pawn-cache hit rate, 2^14 direct-mapped | signature → value mismatches |
|---|---|---|---|---|---|
| kiwipete | 372 715 | 5.3 | 15 114 | 94.3 % | 0 |
| position-6 | 365 699 | 5.4 | 21 511 | 92.2 % | 0 |
| start | 294 576 | 9.3 | 38 301 | 83.2 % | 0 |

## The rulings

| cut | value-identical | in ABC-235 | share it can remove (ABC-227 profile, re-cut; a bound, not a speed-up) |
|---|---|---|---|
| 1 king-square scan | **yes**, in the hoisted form below | **yes** | `kingSquareOf` under the three legality filters: 7.1 / 8.2 / 7.1 |
| 2 check- and pin-aware legality | conditional | **no**: blocked by `ADR-0003` | make/test/unmake inside the filters: 27.7 / 29.4 / 28.4 (overlaps 1 and 3) |
| 3 captures-only generator | **yes, if** order is kept (below) | **yes** | generation under `legalCaptures`: 13.5 / 10.8 / 11.9, of which castling attack tests 4.1 / 0.1 / 1.1 |
| 4 incremental material + PST | yes | **no**: low net, wide reach, collides with `ABC-231` | material + PST lines are 48 / 50 / 51 % of `whiteMinusBlack` self = 4.9 / 5.3 / 4.2, before the cost in make/unmake |
| 5 pawn-structure cache | **yes, if** the key is verified exactly (below) | **yes** | `pawnStructure` inclusive 11.5 / 12.8 / 10.9 × hit rate 0.94 / 0.92 / 0.83 |
| 6 allocation-free ordering | **yes, if** four conditions hold (below) | **split out** to a small ticket | `orderMoves` inclusive 5.6 / 6.7 / 6.6, plus quiescence's sort 1.1 / 0.9 / 0.2 |

### Cut 1: the king-square scan. Value-identical: yes. In ABC-235.

- **The form: hoist, do not cache on `Position`.** In `legalMoves`, `legalCaptures` and `hasLegalMove`, read the mover's king square once before the loop. For each move, the king stands on `move.to` when `move.piece` is the mover's king (castling included), else on the hoisted square. `isInCheck`, `givesCheck` and `hasLegalEnPassant` keep their own scan.
- **Why it is identical.** In-domain, the mover has one king, and no move by the mover except its own king move changes where that king stands. En passant removes an enemy pawn, and promotion replaces a pawn. So the square equals `board.indexOf(king)` for every move, and every legality test reads the same board.
- **The rejected form.** King squares kept on `Position` and updated in make/unmake. It changes `Position`'s shape (`ADR-0020` keeps incremental state off `Position`). Every board writer would also have to re-sync it. These are `parseFen`, `clonePosition` in `src/evaluate.mirror-corpus.ts`, 12 direct writes in 4 test files, and `givesCheck`'s transient writes. A missed sync gives a wrong answer silently.
- **What could break.** Off-domain boards with two kings of one colour (`parseFen` rejects them). A move whose `piece` is a king but whose `to` is not the king's square (none exists; castling's `to` is the king's).
- **Recorded failed attempt, cited and not retried blindly.** `ADR-0003` § Context records this hoist at 0.99x (white) and 1.08x (black) on one `legalMoves` call, and calls it closed. That record answered "can it close a 2.5x gap to 500 k nps". ABC-235's bar is ≥ 3 % per board median, and the real search now spends 7.1-8.2 % of self time in these scans. So it is re-opened under that bar only. If A3's drop rule fires, the cut is dropped and the record stands. `OD-206-1`'s accepted reading covers the edit: the make/test/unmake strategy is unchanged and only the scan moves. The Orchestrator reports it to the owner as INFO (`OD-235-1`).
- **Proof.** (P1) List equality of `legalMoves` and `legalCaptures`, and boolean equality of `hasLegalMove`, against a reference in the test file. The reference is today's loop, rebuilt from the exported `generateMoves`, `makeMove`, `unmakeMove`, `isSquareAttackedBy` and `board.indexOf`. The lane runs the six perft FENs at depth 1 plus ABC-206's terminal FENs. The depth-3 walk (ABC-206's 285 074 positions) runs under `ENGINE_DEEP=1`. Each row asserts the position is unchanged. (P2) Perft counts equal: `npm run perft`, `PERFT_DEEP=1` 32/32. (P3) ABC-235 A1.

### Cut 2: check- and pin-aware legality. Value-identical: conditional. Not in ABC-235.

- **Conditional on:** the same legal set (perft), filtered in generation order (list equality), with full tests kept for king moves, en passant (the rank discovered check), any move in check and double check, and pinned pieces (promotions by a pinned pawn included).
- **Why it is out.** `ADR-0003` clause 1 (owner-ratified) keeps make/test/unmake. Its clause 3 lists exactly this, (c2) lazy legality and (b) pin-aware generation, and "authorizes none of the three". Its trigger has not fired: `G6` reads depth 7 at 3 s on both boards. `OD-206-1`'s reading ("the clause keeps the strategy") cannot stretch to a change of strategy.
- **What it would need.** A new ADR that amends `ADR-0003` clauses 1 and 3, ratified by the owner, and its own ticket. It is the largest prize on the board (27.7-29.4 % bound; `ADR-0003` measured (c2) at 3.2-4.4x per `legalMoves` call). It also has the largest correctness risk. That is an owner call, not an ABC-235 design call.

### Cut 3: captures-only generator. Value-identical: yes, if order is kept. In ABC-235.

- **The form.** A new sibling `generateCaptures(position)` in `src/moves.ts`. `generateMoves` is untouched, so `NFR-001`'s perft half and the perft proof are untouched. `legalCaptures` calls it in place of `generateMoves` and keeps its make/test/unmake check.
- **Its contract.** Exactly `generateMoves(position).filter((m) => m.captured !== EMPTY)`, in the same order. The order rules it must copy:
  - squares 0..127;
  - a pawn's capture sides -1 then +1;
  - on each side, a normal capture (a promotion capture emits Q, R, B, N), else the en-passant check, so an en-passant capture on side -1 comes before a normal capture on side +1;
  - step offsets in table order;
  - ray directions in table order, with empty squares walked but not emitted.
  - No pushes, no quiet promotions, no castling (none is a capture).
- **Why order matters.** Quiescence's MVV-LVA sort is stable, so ties keep generation order (ABC-206). A reordered list changes which refutation is found first, and so changes node counts.
- **What could break.** En passant: `captured` is the pawn, so it IS in the list; ABC-022's two guards (target empty, the captured pawn present) must be copied. Capture promotions: four moves, in that order. The own-colour occupant must never be offered. Castling disappears, and that is the 4.1 % on kiwipete.
- **Duplication cost, stated.** Two generators share the movement rules. The oracle below holds them together.
- **Proof.** (P1) `generateCaptures(p)` deep-equals, in order, `generateMoves(p).filter(captured ≠ EMPTY)`, on the same walk as cut 1. Targeted rows: en passant on both sides, ABC-022's off-domain en-passant FENs, capture promotions on both sides, the rank-pinned en-passant capture, and positions with all castling rights. (P2) ABC-206's existing `legalCaptures` list-equality row stays green. (P3) A spied count guard: `legalCaptures` calls `generateMoves` 0 times. This is ABC-206's precedent: a reintroduced generation is invisible to every value row. (P4) ABC-235 A1, and perft counts unchanged.

### Cut 4: incremental material + PST. Value-identical: yes. Not in ABC-235.

- **Why it would be identical.** Integer sums, independent of order. `evaluate`'s `0 - score` already guards `-0`.
- **Why it is out.**
  1. **Low net.** The most it removes is 4.9 / 5.3 / 4.2 %. The board walk stays for mobility, king squares and pawns. The update moves into make/unmake, which runs 5.3 / 5.4 / 9.3 times per `evaluate` (the probe). The legality filters' make/test/unmake pays it too. The net is likely under A3's 3 % drop bar. `UNKNOWN - verify`, but not worth a build to find out.
  2. **Wide reach.** It puts state on `Position` or in make/unmake. `ADR-0002` names the core's statelessness as what makes perft a proof. `ADR-0020` keeps incremental state off `Position`. Every board writer would need a re-sync (cut 1's list).
  3. **It collides with `ABC-231`**, which rewrites the king PST as a phase blend, and `ABC-232`.
- **Re-open only** after `ABC-231` and `ABC-232` merge, if a fresh profile ranks it, and with an ADR.

### Cut 5: pawn-structure cache. Value-identical: yes, if the key is exact. In ABC-235.

- **Why it is identical.** `pawnStructure(board)` reads only squares compared with `PAWN` and `BLACK_PAWN`, and `isPassedPawn` reads only enemy pawns. So it is a pure function of the pawn placement. The probe agrees: 0 mismatches over 1 032 990 calls.
- **The form.**
  - **Key.** Two pawn masks, one per colour: 48 squares each (ranks 2-7), built in `whiteMinusBlack`'s existing walk. A 48-bit integer is exact in a double.
  - **Table.** Direct-mapped, 2^14 slots in fixed typed arrays, allocated once per process. Each slot holds both masks and the cached parts. Empty slots start at -1, which no real mask equals.
  - **Hit.** Only when BOTH masks are equal, never on an index or hash match alone.
  - **Not cleared between searches.** Values do not depend on it. A test-only clear exists for the cold reading.
- **The seam for `ABC-232`.** Store the doubled-and-isolated sum and the passed-pawn sum as two fields, not one total. `ABC-232` then blends the passed part by phase outside the cache, and adds an endgame passed-pawn field. It needs no re-keying.
- **What stays out of the cache.** `kingExposure`, which also reads the king squares.
- **What could break.**
  - A hash-only hit returns another structure's score. This is the condition.
  - A key built from fewer squares than the function reads. `pawnStructure` and `isPassedPawn` read ranks 2-7 only, so those 96 squares are exactly its input, even off-domain.
  - A miss path slower than today: the masks and the store are added work. `G2` reads it (below).
- **Memory.** 2^14 × (8 + 8 + 4 + 4) bytes = 384 KiB, counted in `NFR-009` (a)'s byte-length sum beside the 4 MiB TT. It is fixed, so (b) and (c) growth is 0.
- **The header must change.** `src/evaluate.ts`'s header says "no state, no cache". The commit restates it: one value-free memo, exact-keyed.
- **Proof.**
  - (P1) `evaluate` `Object.is`-equal to the uncached reference, on cut 1's walk and the `G3` mirror corpus. Run it cache-cold and then cache-warm.
  - (P1b) A forced-collision row: two pawn placements that map to one slot, evaluated in turn, each returns its own value.
  - (P2) `G2`, `G3` (A1 mirror exact, A6 purity: the cache never writes the position), and `G7` with the cache counted.
  - (P3) ABC-235 A1.
- **Expected bound.** About 10.8 / 11.8 / 9.0 %, before the cost of building the masks and probing. It is the largest of the confirmed cuts.

### Cut 6: allocation-free ordering. Value-identical: yes, if four conditions hold. Split out of ABC-235.

1. **Ties keep generation order.** Today's `Array.prototype.sort` is stable. The new sort must be stable by construction (insertion sort that moves only on strict `<`), or must break ties on the index explicitly.
2. **Keys stay float64.** `mvvLvaKey` subtracts attacker ÷ 1000 (0.1, 0.32, 0.33, 0.5, 0.9). An `Int32Array` merges QxP and NxP. A `Float32Array` merges the knight's 0.32 with the bishop's 0.33 near 1 000 000. Either changes order and node counts.
3. **The input is never mutated.** `chooseMove` re-orders the same `rootMoves` every iteration (`src/engine.ts` `runIteration`). An in-place sort would start iteration N from iteration N-1's order, so equal keys would break differently. Both recursions also read `moves[0]` and `entryMove(slot, moves)` from the unsorted list.
4. **The output is not shared between plies.** The parent iterates its ordered list while the children call `orderMoves`. Keys and indices may live in one module scratch, because the sort finishes before anything recurses. The returned `Move[]` must be one fresh array, which is the documented "returns a NEW array" contract. That still removes the n wrapper objects and two of the three arrays.

- **Quiescence's sort.** Pre-compute each `mvvLvaKey` once, then sort `captures` in place. Unlike `orderMoves`'s input, that array is the frame's own. The same stability and float64 conditions apply.
- **Why it is split out.** The bound is the smallest (5.6-6.7 % inclusive, and `orderKey`'s own work stays). GC is only 1.6-1.9 % of time. It may miss the 3 % drop bar on its own. `ABC-233` and `ABC-234` both edit `orderKey` and `orderMoves`, so it is best landed as one small value-identical ticket just before them.
- **Proof.** (P1) New `orderMoves` against a reference copy of today's map/sort/map, on every node's legal list from the walk. Killers and hash moves are drawn from the list, plus absent ones. Compare by `Move` identity, and check the input array is unchanged. (P2) Quiescence's order equals today's stable sort. (P3) A1, including the `searchWithoutOrdering` and `searchWithoutKillers` doors.

## Out of the six, for BA/PM (an observation, not a cut)

`addCastlingMoves`' attack tests are 8.0 / 0.3 / 2.2 % of self time in total. Cut 3 removes them from `legalCaptures`, but not from `hasLegalMove` (2.8 / 0.1 / 0.9) or `legalMoves` (1.0 / 0.0 / 0.3). ABC-227's A5 does not name them, so they are outside ABC-235's scope item 1.
