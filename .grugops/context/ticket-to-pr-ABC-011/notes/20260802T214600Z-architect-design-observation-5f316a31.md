---
id: 20260802T214600Z-architect-design-observation-5f316a31
kind: observation
by: architect-design
at: 2026-08-02T21:46:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - NFR-005
  - src/zobrist.ts
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
  - src/perft.test.ts
  - src/zobrist.test.ts
supersedes: 
---

# The design-hop measurements, and what each of them was run against

Neutral record of what was actually executed at this hop, so the ruling beside it can be checked
rather than believed. Everything below was driven **read-only against merged `src/`** from a
scratchpad outside the repository; **no production file was changed at this hop**. Machine: Apple M3,
Node v24.12.0, darwin/arm64 — `UNKNOWN - verify` on any other hardware.

## 1. Every key and every FEN the ticket quotes reproduces byte-exact

Re-run, not transcribed. All eight FENs round-trip byte-identically through `toFen`.

```
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1    4366836039462477420  pseudo=0 legal=0
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1   18311490354223382796  pseudo=0 legal=0
rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1    8587513887981778220  pseudo=1 legal=1
rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1   13090168791698106956  pseudo=0 legal=0
4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1                              14512009346798793826  pseudo=1 legal=1
4k3/8/8/3pP3/8/8/8/4K3 w - -  0 1                              14344393565561618306  pseudo=0 legal=0
7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1                                 973849139394194878  pseudo=1 legal=0   <- the open question
7k/8/8/K1Pp3r/8/8/8/8 w - -  0 1                                 285777158189409886  pseudo=0 legal=0
```

The design question's FEN is confirmed exactly as the ticket states it: **1 pseudo-legal ep capture,
0 legal ones.**

## 2. The ticket's acceptance criteria under each reading

| criterion | want | merged | board-only | strict |
|---|---|---|---|---|
| the repro pair (no ep capture at all) | equal | different | **EQUAL** | **EQUAL** |
| the real-capture control (regression guard) | different | different | **different** | **different** |
| the existing `src/zobrist.test.ts:33-37` fixture | different | different | **different** | **different** |
| the divergence FEN pair | FIDE: equal | different | different | **EQUAL** |

Both readings satisfy the headline criterion and both hold both regression guards, exactly as the
ticket predicted. **The existing test at `src/zobrist.test.ts:33-37` needs no edit under either
reading** — its fixture has a genuinely legal ep capture, so it still asserts a true inequality.

## 3. Divergence, with its denominators

Exhaustive walk of the `src/perft.test.ts` position table (startpos d4, kiwipete d3, position-3 d4,
position-4 d3, position-5 d3, position-6 d3):

```
TOTAL nodes visited        : 518,474
nodes with epSquare set    : 81,397   (15.70%)
board-only != strict       : 862      (1.06% of ep-set nodes, 0.166% of all nodes)
```

Per position: startpos 0, kiwipete 0, **position-3 861**, position-4 1, position-5 0, position-6 0.
**The divergence is essentially one position's geometry** — `position-3` is the standard perft
position with a white king on a5 and a black rook on h5, i.e. the rank-5 pin that makes an ep capture
illegal. Stated because it is the number most likely to be over-read.

The same walk expressed as the ticket's own property test (every legal double push, key with
`epSquare` vs key with it cleared, against the ground truth
`legalMoves(p).some(m => m.flags === FLAG_EN_PASSANT)`): **19,667 ep-setting moves, board-only misses
on 862, strict misses on 0.**

## 4. The cheap predicates agree with the real generator and the real filter

The strict predicate re-derives the two candidate pawn from-squares rather than calling
`generateMoves`, which is a duplication of geometry that `src/moves.ts` also owns. It was checked
against both oracles over the whole walk:

```
board-only predicate disagrees with generateMoves : 0   (over 81,397 ep-set nodes)
strict predicate     disagrees with legalMoves    : 0   (over 81,397 ep-set nodes)
strict key == legalMoves-based key                : true on all 120,000 pooled nodes
```

This is the invariant the ticket's property test should pin, and it is why the ruling asks for that
test's oracle to be `legalMoves(...)` rather than a hand-written expectation.

## 5. Cost

Per call, 300k iterations, interleaved forward and backward:

| shape | merged | board-only | strict (minimal) | strict via `legalMoves` |
|---|---|---|---|---|
| startpos, no ep | 302.7–303.1 ns | 302.4–311.1 | 305.2–318.0 | 303.8–305.9 |
| kiwipete, no ep | 313.7–317.2 ns | 316.6–321.0 | 312.8–334.7 | 313.3–314.9 |
| ep set, no capture | 319.8–325.7 ns | 327.2–345.7 | 333.4–351.9 | 2985.4–2989.8 |
| ep set, capture available | 315.3–317.2 ns | 321.0–321.3 | 458.6–465.8 | 4395.7–4406.0 |
| the divergence FEN | 151.5–187.0 ns | 155.6–180.3 | 271.3–299.0 | 1206.9–1683.5 |

Amortized over 120,000 nodes collected from the same table at natural frequency (6.42% ep set, 2.07%
with a pseudo-legal ep capture, 1.87% with a legal one):

```
merged src/zobrist.ts   317.2-317.3 ns   1.000
board-only              316.0-318.6 ns   0.996-1.004
strict (minimal)        321.5-324.1 ns   1.014-1.022
strict via legalMoves   627.6-627.8 ns   1.979
```

Keys that change versus merged, over that pool: board-only **5,218**, strict **5,456**, of 120,000.

Allocation (heapUsed delta over 200k calls, GC forced first): identical on no-ep positions
(5.0–5.2 B/call for all three, dominated by the `bigint` intermediates merged code already
allocates); **+2.3 B/call for strict on ep-capture-available positions only** (2.7 vs 0.4).

## 6. Purity, and the `ABC-009` inheritance

`toFen` compared before and after a single hash call:

| position | merged | board-only | strict (minimal) | strict via `legalMoves` |
|---|---|---|---|---|
| `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1` | unchanged | unchanged | unchanged | unchanged |
| `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` | unchanged | unchanged | unchanged | **CORRUPTED** |
| `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` (`ABC-009`'s own shape) | unchanged | unchanged | unchanged | unchanged¹ |

```
4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1  ->  4k3/8/8/3pP3/8/8/8/K3K3 w KQ d6 0 1
```

A phantom white king appears on e1. ¹ the third row is unchanged only because it has no ep square, so
the ep path returns before reaching the filter; `legalMoves` called directly on that position corrupts
it (2 `FLAG_CASTLE` moves offered), which is `ABC-009` reproduced unchanged at this hop.

**`ABC-009` and `ABC-010` are confirmed still carried and are not made worse by the ruling.** The
second row above is a semantically-invalid FEN — `ABC-010`'s territory — and is the position that
shows a `legalMoves`-based hash would inherit `ABC-009`. The ruled shape does not touch castling
moves and does not inherit it.

## 7. The dependency graph, rebuilt from the merged files

Not read off the audit — parsed out of `src/*.ts` and analysed for cycles and longest path:

```
TODAY               acyclic, max depth 6
                    position=1  fen=2  moves=2  zobrist=2  apply=3  legal=4  gameend=5  perft=5  perft-bench=6

RULED (zobrist -> legal)
                    acyclic, max depth 6
                    position=1  fen=2  moves=2  apply=3  legal=4  perft=5  zobrist=5  gameend=6  perft-bench=6

ALT (zobrist -> apply + moves)
                    acyclic, max depth 6
                    position=1  fen=2  moves=2  apply=3  legal=4  zobrist=4  gameend=5  perft=5  perft-bench=6

REJECTED (predicate in moves.ts)
                    CYCLE: apply -> moves -> apply
```

The audit's recorded line `position ← {fen, moves, zobrist} ← apply ← legal ← {gameend, perft} ←
perft-bench` in `memory-bank/30-architecture.md` becomes false under the ruling and is owed an edit
when the change lands.

## 8. One structural fact about repetition that the ticket does not state

A position carrying an en-passant square can only arise immediately after the double push that set
it, and a pawn cannot return to the square it double-pushed from, so **no position with an ep square
set can occur twice in one game.** Its key therefore always has count 1 in the repetition map. The
defect's entire cost is that this one occurrence fails to join the count of its FIDE-identical
ep-free twin — which is reachable by ordinary play (the placement after `1.e4` is the placement after
`1.e3 … 2.e4`, same side to move, same castling rights, ep square set in the first and not the
second). Recorded because it bounds the damage precisely: the count is under-reported by exactly one,
never more, and never over-reported.
