---
id: 20260817T184249Z-software-engineer-observation-abc031-a2-fen-has-adjacent-kings-and-cannot-carry-the-criterion-913e5b27
kind: observation
by: software-engineer
at: 2026-08-17T18:42:49Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/coordinate-move.test.ts
  - src/legal.ts
supersedes:
---

# `ABC-031` `A2`'s FEN is defective — its two kings are adjacent, so no promotion is legal in it

**A fourth gap on this ticket, found at build time and not at the `Ready for Dev` exit.** The exit
review (`.grugops/context/pull-abc076-abc031-2026-08-17/notes/…-5d2b7c81`) recorded `G2` (stale prose)
and `G3` (`SanParseResult` not in `src/`) and verified `A2`'s *"exactly 4 candidates"* premise against
`src/moves.ts`'s `addPromotions`. **That premise is sound. The FEN the criterion supplies is not.**

## The measurement

`A2`'s position, as printed on the ticket: **`8/4P3/8/8/8/8/4k3/4K3 w - - 0 1`**.

Black king **e2**, white king **e1** — **adjacent**. That is not a legal chess position. White is
consequently "in check" from the black king, and `legalMoves` on it returns **exactly one move,
`e1e2`** (the white king capturing the black one). There is **no promotion move at all**: `e7e8q`
resolves to `rejected` / `no-such-move` and `e7e8` likewise, so `A2`'s stated outcomes — a queen
promotion by reference, and a 4-candidate `ambiguous` — **cannot be produced from it by any correct
implementation.** Measured against merged `src/legal.ts`, not reasoned from the page.

**This is the failure mode `A2`'s own Test note 5 warns about, inverted.** The note says getting
`e7e8` → `ambiguous` backwards is the easy wrong implementation. With the printed FEN, `rejected` is
the *correct* answer — so an engineer who trusted the FEN would either read a correct implementation
as broken, or "fix" the implementation until the wrong answer appeared.

## What I did, and what I deliberately did not

**Did.** Proved `A2`'s substance against the **minimal** correction — black king e2 → **e3**, one
character, nothing else changed: **`8/4P3/8/8/8/4k3/8/4K3 w - - 0 1`**. White not in check, and `e7e8`
has exactly the four promotion moves with identical `from`/`to`. Both `A2` rows pass on it by
reference identity. Both FENs are in `src/coordinate-move.test.ts` with the reason, and a third row
**pins the printed FEN's single legal move** so the repair is verifiable and this note is falsifiable
from the suite.

**Did not.** Edit the ticket page. Acceptance criteria are BA/PM's — the same routing the exit review
applied to `G1` and `G2`. **Nor did I pick the repair**: e2 → e3 is the minimal one and it is what I
measured against, but moving the black king elsewhere, or moving the white king, are equally valid and
the choice is not mine.

## Why this is reported as NOT-MET-as-written rather than quietly passed

The delivered code satisfies everything `A2` *describes*. It does not satisfy `A2` as *printed*, and
nothing could. Recording it as plain MET would put a green tick against a criterion whose stated FEN
was never used — exactly the drift process rule 1 exists to catch, one stage later.

## For QE's mandatory hop

Re-derive this from the tree, not from this note: `parseFen("8/4P3/8/8/8/8/4k3/4K3 w - - 0 1")` then
`legalMoves` — expect one move. The `A2` rows in `src/coordinate-move.test.ts` run against the
corrected FEN and say so in place.
