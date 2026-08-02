---
id: 20260803T000500Z-software-engineer-decision-26794591
kind: decision
by: software-engineer
at: 2026-08-03T00:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-012
  - EPIC-001
  - EPIC-004
  - NFR-005
  - ADR-0002
  - ADR-0005
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - src/legal.ts
  - src/zobrist.ts
  - src/legal.test.ts
  - src/zobrist.test.ts
  - memory-bank/30-architecture.md
supersedes: 
---

# BUILT: the ratified `### ANSWERED` block, all six rules, nothing traded away

The design hop settled the reading and the shape; this note records the decisions that were
still mine — how the predicate is written, how it is tested, and the three places I chose not
to widen scope. **Nothing in the `### ANSWERED` block was re-opened, re-derived or negotiated.**

## The implementation, in the two places it lives

`src/legal.ts` gains one export and `src/zobrist.ts` changes one condition. That is the whole
production diff (+55/−2 and +13/−1).

```ts
// src/legal.ts
export function hasLegalEnPassant(position: Position): boolean {
  const target = position.epSquare;
  if (target === NO_SQUARE) return false;
  // ... derive the at most two candidate from-squares, make/test/unmake each
}

// src/zobrist.ts — the single changed condition
if (position.epSquare !== NO_SQUARE && hasLegalEnPassant(position)) {
  key ^= EP_FILE[fileOf(position.epSquare)] as bigint;
}
```

The six rules, each with how it was satisfied rather than an assertion that it was:

1. **Guard first, short-circuits.** Written as ratified, and **spied rather than trusted**:
   over a depth-3 walk of all six perft positions — 277,955 nodes hashed, 17,663 carrying an ep
   square — `hasLegalEnPassant` was entered exactly **17,663** times. **Zero** calls on the
   260,292 no-ep nodes, never more than one on any node.
2. **Not `legalMoves(...).some(...)`.** The predicate derives the two candidate pawn
   from-squares from `epSquare` directly, the same geometry `isSquareAttackedBy` walks to find
   a pawn attacker, and make/test/unmakes each. Worst-case per-call cost measured **1.36–1.38x**
   against the rejected shape's recorded 1.979x amortized, and the purity test on
   `4k3/8/8/3pP3/8/8/8/K7 w KQ d6 0 1` — the FEN the design hop recorded the corruption on —
   passes, so `ABC-009` is demonstrably **not** inherited.
3. **Not homed in `src/moves.ts`.** Homed in `src/legal.ts`. The graph was **rebuilt from
   `src/*.ts`** rather than taken on trust: still acyclic, still max depth 6, `zobrist` 2 → 5,
   `gameend` 5 → 6. The rejected home's cycle (`apply → moves → apply`) was not walked into.
4. **Not re-implemented inside `src/zobrist.ts`.** `zobrist.ts` imports `legal.ts` and asks.
5. **Purity asserted with `toFen` across the call**, four FENs, in `src/legal.test.ts` — not by
   inspection, exactly as the rule words it.
6. **Signature unchanged, no state on `Position`, `gameend.ts`/`apply.ts` untouched.**
   `src/gameend.ts`, `src/apply.ts`, `src/moves.ts`, `src/position.ts` and `src/fen.ts` are
   **byte-untouched**; the only `## Out of scope` escape hatch exercised is `src/legal.ts`, which
   is the one the design hop exercised it for.

## The decisions that were actually mine

**TDD, red first, and it was measured rather than claimed.** All nine new assertions were run
against the unmodified tree before `hasLegalEnPassant` existed: 9 failed, 19 passed in the two
touched files. The four that had to go from red to green did; the two regression guards were
green before and after, which is the only way to know the fix did not over-collapse.

**The property test's oracle is `legalMoves`, and its walk is 2 plies from each of the six
perft positions.** The ruling fixed the oracle and the ticket named the table; the depth was
mine. Two plies costs 81 ms in the default suite and already reaches the divergent geometry —
`position-3`'s `g2g4` answered by `f4xg3 e.p.`, which is pseudo-legal and illegal — so it
exercises the exact case the reading decides. I did not put a deeper walk in the default lane:
`src/perft.test.ts`'s own precedent puts the expensive lane behind `PERFT_DEEP=1`, and a
multi-second unit test is a test people start skipping.

**The table is a local copy of the six FENs, not an import.** `src/perft.test.ts` does not
export its table, and `src/legal.test.ts` already keeps exactly such a local copy with the
reason written beside it ("so the test does not lean on legal.ts internals"). Matching the
existing style beat introducing an export purely for a test.

**The property test asserts that both halves were exercised.** `checked > 0` and
`answered > 0` — a walk that found no double push, or no double push with a legal ep answer,
would otherwise pass green while proving nothing. That is the failure mode this ticket exists
to fix, so leaving the test able to repeat it would have been ironic rather than lean.

**One `generateMoves` assertion in the predicate's own test.** The pseudo-legal-but-illegal
case asserts both that the predicate says **false** and that `generateMoves` still offers the
capture — otherwise the test would pass just as well against a predicate that never sees the
move at all, and the strict reading would be unproven.

## What I did NOT do, each with its reason

- **No `src/zobrist.nfr.test.ts`.** Rule 1's short-circuit is pinned by no test in the repo,
  which is precisely the gap the `ABC-020` Security/NFR gate closed for `NFR-001` by adding
  `src/gameend.nfr.test.ts`. I measured it out-of-repo with a spy and flagged it, which is the
  division of labour that precedent set (the engineer measures, the gate pins). The design hop
  sized this ticket at three test shapes; a fourth is scope I should not quietly take, and the
  Security/NFR gate is one column away. **Flagged, not absorbed** — see the `claim` note.
- **No incremental/XOR-updated hashing.** `## Out of scope` names it; the amortized cost came
  in at 0.995–1.022x, so there is no pressure to smuggle it in either.
- **No `epSquare` normalization upstream.** Rejected at the design hop on a measured ground
  (it breaks the byte-identical FEN round trip); not re-litigated.
- **No fix for `ABC-009` or `ABC-010`.** Carried, and the shipped predicate does not inherit
  either.
- **No edit to the `Hashing` row of `memory-bank/30-architecture.md`'s module table.** Its
  content ("64-bit `bigint` position key, fixed seed, recomputed per call") is still true; only
  the layering line and the transient-mutation bullet became false, and those are the two edits
  the ticket names. Re-ordering the table to match DAG level would be an unrequested refactor
  of a document that orders by conceptual layer, not by level.

## What this decision costs, stated because I would rather it be on the record than discovered

`zobristKey` is no longer a pure read of the board — the design hop said so and it is now true
in merged form on this branch. On the ~1% of nodes with an available ep capture it plays a move
and takes it back. `memory-bank/30-architecture.md` now says this in the pattern list rather
than only in an ADR, because that file is where a maintainer looks before calling a query from
a place a mutation would be illegal.
