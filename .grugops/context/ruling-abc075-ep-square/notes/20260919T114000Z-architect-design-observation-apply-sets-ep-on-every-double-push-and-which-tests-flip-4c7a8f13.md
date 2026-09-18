---
id: 20260919T114000Z-architect-design-observation-apply-sets-ep-on-every-double-push-and-which-tests-flip-4c7a8f13
kind: observation
by: architect-design
at: 2026-09-19T11:40:00Z
verified_by:
confidence: high
refs:
  - ABC-075
  - ADR-0020
  - ADR-0005
  - NFR-005
  - src/apply.ts
  - src/zobrist.ts
  - src/zobrist.test.ts
  - src/zobrist.nfr.test.ts
  - src/legal.ts
supersedes:
---

# WHAT THE CODE SAYS, READ AT THIS HOP — `apply.ts`'s ep rule, the graph, and every assertion the ruling flips

**Read, not written.** Zero `src/` bytes changed. Each line below names its source line.

## `src/apply.ts` sets `epSquare` on EVERY double push — this matters, and it is the cheap case

`makeMove`: `position.epSquare = isPawn && Math.abs(move.to - move.from) === DOUBLE_PUSH ?
(move.from + move.to) / 2 : NO_SQUARE;` — **unconditional on the double push**, no adjacency test,
no capturer check; every other move clears it. `unmakeMove` restores it from `undo.epSquare`.
So under `ADR-0020` "ep square set" is a local O(1) function of the move just played, already
computed by `makeMove`, and the ep component XOR-updates from `(undo.epSquare, position.epSquare)`
with nothing else. Had `apply.ts` used the Stockfish-style adjacency rule the ruling would still
hold but the delta would need a neighbour probe; it does not.

## `hasLegalEnPassant` has exactly ONE production caller

`grep -rn hasLegalEnPassant src --include=*.ts | grep -v test` → `src/zobrist.ts:28` (import) and
`:85` (the conjunct). After `ABC-075` it is an exported function with no production caller; it stays
because `ABC-075 A6` holds `src/legal.ts` byte-identical (`ADR-0003` clause 1).

## Import graph after the change — acyclic

`apply.ts` imports `moves.ts`, `position.ts`; `moves.ts` imports `position.ts`; `position.ts`
imports nothing under `src/`. None imports `zobrist.ts`. A type-only `UndoRecord` import from
`apply.ts` into `zobrist.ts` creates no cycle. `zobrist.ts` moves from below `legal.ts` (level 5,
`ADR-0005`) to directly above `apply.ts`; `gameend.ts` (imports `zobrist.ts` + `legal.ts`) drops
one level.

## Assertions that go RED on purpose under Decision 1 — named so the engineer re-points, not rediscovers

| file:line | today asserts | under `ADR-0020` |
|---|---|---|
| `src/zobrist.test.ts:49` "ignores an ep square no capture can use — the ABC-011 defect pair" | `toBe` | flips to `not.toBe`; becomes `A3`'s ep-set-no-capture case |
| `src/zobrist.test.ts:73` "ignores an ep square whose only capture is illegal" (`7k/8/8/K1Pp3r/8/8/8/8 w - d6`) | `toBe` | flips to `not.toBe`; second `A3` case of the same class |
| `src/zobrist.test.ts:158` "the ep component tracks availability, not the ep field" | oracle `legalMoves(...).some(FLAG_EN_PASSANT)` | oracle becomes `epSquare !== NO_SQUARE`; keep the three non-vacuity counts (557 / 52 / 505 measured there) |
| `src/zobrist.nfr.test.ts:54` "never asks … when there is no ep square" | spy count 0 | vacuous (no call site left); retire or keep as a structural guard |
| `src/zobrist.nfr.test.ts:69` "asks exactly once when an ep square IS set" | spy count 1 | goes red (0); retire — `NFR-005`'s no-ep guarantee is now structural |

**Stay green, stay:** `zobrist.test.ts:43`, `:61`, `:199`, `:212` (inequalities still true);
`:221`, `:276`, `:308` (purity and board-contradicts-ep — trivially true for a hash that only reads,
now regression guards against re-introducing a probe); `:82` (make/unmake round trip).

## `ABC-075 A6` is FALSE AS WRITTEN and the ticket page says so

*"`src/zobrist.test.ts` and `src/zobrist.nfr.test.ts` pass unchanged"* cannot hold with the rows
above. The rest of `A6` (byte-identical `legal.ts`, unchanged `zobristKey` signature, green suite,
skip 0) stands. Recorded on the ticket under "Ruling applied — 2026-09-19", not silently rewritten.

## NFR impact — no target moves, catalog not opened

`NFR-005` anchor positions (`kiwipete`, startpos) carry no ep square and run the identical code.
The 15.70% of nodes with an ep square (`ADR-0005`'s figure) get strictly cheaper (no probe). The
`A5` ≥ 5x bar is against the 295–304 ns full scan; the delta is a bounded number of XORs.
`plans/nfr-catalog.md` was not written to at this hop.
