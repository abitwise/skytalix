---
id: 20260809T110127Z-ba-pm-observation-6336a2ab
kind: observation
by: ba-pm
at: 2026-08-09T11:01:27Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-022
  - NFR-001
  - src/moves.ts
  - src/legal.ts
  - src/apply.ts
  - src/fen.ts
  - src/gameend.ts
  - src/perft.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
supersedes: 
---

# What `addCastlingMoves` actually leaks, measured on merged `main` at `aad6d48`

Re-derived rather than read back, because the Orchestrator's routing note
(`20260809T103247Z-orchestrator-decision-f050eb4b`) says plainly that it did not audit the ticket
line by line and expects more than its four defects to be found.

**Instrument.** A throwaway probe of my own, run against a **copy** of merged `main`'s `src/` taken
outside the repository. **No file under `src/` in this repo was modified at any point** —
`git diff --stat -- src/` against `main` is empty and `src/moves.ts` still hashes
`fb4fa40934e768dffeaeed0b43548842`. Move counts and FEN comparisons are integer results and are
machine-independent; the machine was Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. The
state comparison is **all 128 board bytes plus all five scalars**, never `toFen`. `npm run perft` was
**not** run and no throughput figure anywhere in my output is mine.

## The generator reads three things and none of them is a piece

`addCastlingMoves` (`src/moves.ts:299-319`) tests that the right is held, that `option.empty` is
clear, and that no square of `option.kingPath` is attacked. **The king's home square and the rook's
home square are never read.** The rook's square is not even a member of `option.empty` (kingside
`empty` is `[f1, g1]`; h1 is square 7). `addCastlingMoves` is unchanged since `6805345` (`ABC-004`),
verified with `git log -- src/moves.ts`; `src/legal.ts` has moved twice since the ticket was written
(`988f678`, `2efe9ac`, both `ABC-011`), which is why re-derivation was owed.

## Three families leak. Only the first was on record before today.

The ticket's own reproduction reproduces exactly: `4k3/8/8/8/8/8/8/K7 w KQ - 0 1` counts **5, 10, 10**,
leaves `4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1`, one changed byte `e1: EMPTY → white KING`, both castles
offered in call 1. `4k3/8/8/8/8/8/8/4K3 w K - 0 1` returns **6** with `FLAG_CASTLE e1g1` and is
**byte-identical** across the call. Kiwipete is 48, 48, 48 and pure. One `gameStatus` call on the
reproduction FEN returns `draw / insufficient-material` and leaves the phantom king behind.

**Family 1 — king off its home square, matching rook present. Offers the castle AND corrupts.**

```
FEN                              gen legal  castle  3 calls    after ONE legalMoves call
4k3/8/8/8/8/8/8/K6R w K - 0 1     17   17   e1g1    17,18,18   4k3/8/8/8/8/8/8/K3K2R w K - 0 1
4k3/8/8/8/8/8/8/R6K w Q - 0 1     17   17   e1c1    17,19,19   4k3/8/8/8/8/8/8/R3K2K w Q - 0 1
k6r/8/8/8/8/8/8/4K3 b k - 0 1     17   17   e8g8    17,18,18   k3k2r/8/8/8/8/8/8/4K3 b k - 0 1
r6k/8/8/8/8/8/8/4K3 b q - 0 1     17   17   e8c8    17,19,19   r3k2k/8/8/8/8/8/8/4K3 b q - 0 1
```

The Orchestrator named the first two. **Both colours and both sides reproduce**, so the gap is four
rows wide. Post-fix count on every row: **16**.

**Family 2 — the king's home square holds a piece that is NOT the mover's king. Offers the castle AND
DESTROYS that piece, writing a king of the MOVING side over it.** No note on this board recorded this
for the castling route before today, and it is strictly worse than a phantom king on an empty square:
one `legalMoves` call performs **silent material loss and a piece-type change**.

```
FEN                              gen legal  3 calls    the byte on e1 / e8
4k3/8/8/8/8/8/8/K3B2R w K - 0 1   20   20   20,18,18   own BISHOP(3)    -> white KING(6)     post-fix 19
4k3/8/8/8/8/8/8/R3N2K w Q - 0 1   18   18   18,19,19   own KNIGHT(2)    -> white KING(6)     post-fix 17
4k3/8/8/8/8/8/8/K3b2R w K - 0 1   14   14   14,18,18   ENEMY bishop(11) -> white KING(6)     post-fix 13
k3b2r/8/8/8/8/8/8/4K3 b k - 0 1   20   20   20,18,18   own bishop(11)   -> black KING(14)    post-fix 19
```

This is `ABC-022` half (a)'s *"one move removes two pieces"* shape arriving by the castling route.

**Family 3 — the rook's home square holds a piece that is NOT the mover's rook. Offers the castle and
the position stays BYTE-IDENTICAL.** The make/unmake pair round-trips the impostor exactly, so **no
purity criterion, however strong, can ever see this family** — only a `FLAG_CASTLE`-count assertion
can. The king is on its home square in every row, so family 3 is orthogonal to families 1 and 2.

```
FEN                              gen legal  castle  3 calls     state      post-fix
4k3/8/8/8/8/8/8/4K2B w K - 0 1    13   13   e1g1    13,13,13    PURE       12
4k3/8/8/8/8/8/8/N3K3 w Q - 0 1     8    8   e1c1    8,8,8       PURE        7
4k2b/8/8/8/8/8/8/4K3 b k - 0 1    13   13   e8g8    13,13,13    PURE       12
4k3/8/8/8/8/8/8/4K2b w K - 0 1     6    6   e1g1    6,6,6       PURE        5
```

## One shape was looked for and is NOT reachable — recorded so nobody specifies it

A **wrong-colour rook** on the rook's home square is already refused today, by the right answer
through the wrong rule: an enemy rook there attacks the very squares the castle requires to be empty,
so `option.kingPath` is attacked and the through-check test drops the option. Measured:
`4k3/8/8/8/8/8/8/4K2r w K - 0 1` → gen 5, legal 3, **no castle**; `4k3/8/8/8/8/8/8/r3K3 w Q - 0 1` →
gen 5, legal 3, **no castle**. The colour dimension is therefore only reachable on the **king's**
square (family 2 row 3) and through a non-rook impostor on the rook's square (family 3 row 4). A
"wrong-colour rook" criterion would be theatre and none was written.

## The four legal castles, so over-rejection is checkable at the same time

`4k3/8/8/8/8/8/8/4K2R w K - 0 1` → **15** moves, 1 castle · `4k3/8/8/8/8/8/8/R3K3 w Q - 0 1` → **16**,
1 · `4k2r/8/8/8/8/8/8/4K3 b k - 0 1` → **15**, 1 · `r3k3/8/8/8/8/8/8/4K3 b q - 0 1` → **16**, 1.

## `toFen` is a 64-of-128 projection, and it hides nothing here

`src/fen.ts:185-210` iterates `file 0..7 × rank 0..7` through `squareAt`, so it reads 64 of the 128
0x88 bytes; all five scalars do appear in the string, so off-board bytes are exactly what it cannot
see. **But the castling route cannot write off-board at all** — a `FLAG_CASTLE` make/unmake touches
only `{e1, e8}`, `{g1, c1, g8, c8}` and the eight rook-leg squares from `CASTLE_ROOK_MOVE`
(`src/apply.ts:70-75`), every one on-board by construction — and a 128-byte diff across all twelve
leaking rows and the whole perft table reported **zero** off-board changes. So the pre-check's item 2
is real as a structural fact and **narrower than it sounds as an implication**: nothing in this ticket
is currently hidden by `toFen`, and nobody should go hunting an off-board write in the castling branch.

## Layers and callers, checked rather than assumed

On every leaking row `generateMoves` and `legalMoves` report the **same** castle count, so both layers
are assertable today at no extra cost. `grep` over non-test `src/` shows `generateMoves` has **no
non-test caller other than `legalMoves`** (`src/legal.ts:46`), and `legalMoves` is called from
`src/perft.ts:26`/`:65` and `src/gameend.ts:137`. `gameStatus` inherits both the defect and any fix,
because `legalMoves` is its first executable line and the only other board-touching call it makes is
`zobristKey` → `hasLegalEnPassant`, which `ABC-011` made pure by construction
(`src/legal.ts:85-134`, guards at 110-111).

## `ABC-022`'s boundary, measured from this side

With a correct castling fix in place, `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` **still** writes a phantom
black pawn onto a2 (`sq16`) on one `legalMoves` call. So `ABC-009`'s `## Scope` bullet 1 taken at its
word is not met by any castling fix, and `ABC-022`'s `## Dependencies` claim that *"`ABC-009` does not
close this"* is correct and stays correct after today's correction. `ABC-022` was not edited.
