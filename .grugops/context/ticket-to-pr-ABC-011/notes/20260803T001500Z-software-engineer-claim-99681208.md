---
id: 20260803T001500Z-software-engineer-claim-99681208
kind: claim
by: software-engineer
at: 2026-08-03T00:15:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - ABC-020
  - EPIC-004
  - NFR-005
  - ADR-0005
  - src/zobrist.ts
  - src/legal.ts
supersedes: 
---

# Five things this hop could NOT settle, and what I carried rather than fixed

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of them is gate-adjudicable
here. There is no §14 gate on this install, so no `finding` is admissible on this task, none was
written, and nothing is self-stamped.

**1. Rule 1's short-circuit is pinned by no test in the repo, and that is a real gap.** I proved
it with an out-of-repo spy — zero `hasLegalEnPassant` calls on 260,292 no-ep nodes — but nothing
in `src/` fails if someone later reorders the condition to
`hasLegalEnPassant(position) && position.epSquare !== NO_SQUARE`. That mutant would keep the
whole suite green and would put a make/unmake on the majority path, which is exactly the
`NFR-005` sub-bar. This is the same shape of gap the `ABC-020` Security/NFR gate found and
closed for `NFR-001` by adding `src/gameend.nfr.test.ts` ("all three bars were held by nothing
in the repo"). **Flagged for the Security/NFR gate rather than absorbed**, on that ticket's own
precedent — the engineer measures, the gate pins — and because the design hop sized this ticket
at three test shapes. The fix is small and the shape already exists in this repo. Owner:
Security/NFR.

**2. Every timing figure is one machine.** Apple M3, Node v24.12.0, darwin/arm64. The
1.36–1.38x worst-case per-call shape and the 0.995–1.022x amortized row are `UNKNOWN - verify`
on any other hardware, exactly as `NFR-005`'s depth levels already are. What is
machine-independent is the ratio to the merged tree measured in the same process. Owner:
`EPIC-004`'s non-M3 spike, which already carries the same obligation.

**3. The amortized figure is not a prediction about `EPIC-004`'s search, and my pool is
shallower than the design hop's.** Mine is a depth-3 walk downsampled to 120,000 nodes: 6.77%
carry an ep square and 0.85% have a legal ep capture, against the design hop's 6.42% / 1.87%.
Scaled to their frequency my per-call deltas land at roughly 1.02x, i.e. the two runs agree —
but an alpha-beta search with move ordering, quiescence and transposition cutoffs visits a
different distribution again, plausibly with more pawn tension. The honest statement is: on the
population measured, the change is inside noise; no search exists yet to measure the real one.

**4. Whether the predicate's geometry can drift from `generateMoves`.** It re-derives the two
candidate from-squares rather than calling the generator, and it disagreed with `legalMoves`
**zero** times over 81,397 ep-set nodes. That is strong evidence, not proof: a future change to
`src/moves.ts`'s pawn geometry could desynchronise them. The property test in
`src/zobrist.test.ts` is the guard, and it is deliberately oracle-driven for this reason — but it
walks 2 plies from six roots, not the whole table, so a drift confined to a shape that walk
misses would survive. Naming the residual, not implying the guard is total.

**5. Whether the 2-ply walk is the right depth for the default lane.** It costs 81 ms and it
does reach the divergent geometry, which is why I chose it. A deeper walk finds strictly more,
and this repo has a precedent for an opt-in slow lane (`PERFT_DEEP=1`). I did not add a second
lane for one property test — that felt like unrequested machinery for a guard that already
bites — but a reviewer who disagrees has a cheap change available and I would not argue hard
against it.

## Carried, not fixed — each deliberate

- **`ABC-009`** (`legalMoves` mutating its argument) is untouched and still reproduces. The
  shipped predicate does **not** inherit it, proved on `ABC-009`'s own trigger FEN and pinned by
  a test, which is the one thing this ticket owed it.
- **`ABC-010`** (FEN semantic validation) untouched — different module, different defect.
- **`ADR-0005` is still `proposed`.** No agent may mark it `accepted` and I did not. The code it
  describes is now merged on this branch, which means the ADR describes the tree rather than a
  proposal about it — worth a human's attention, and stated here rather than treated as
  self-resolving. `ABC-011` was never blocked on it.
- **`memory-bank/30-architecture.md`'s module table still lists `zobrist.ts` in the third row**,
  between Serialization and Generation, which reads as a shallow layer. The cell's content is
  true and the table is ordered by conceptual layer rather than DAG level, so I did not reorder
  it — the layering line two sections down now carries the correction. A reader who scans only
  the table could still form the old mental model. Flagged, not silently reshuffled.
- **`ABC-012` is now unblocked in the sense that mattered.** Its threefold test no longer has to
  use an ep-free knight cycle to dodge this defect, which is the entire reason the Orchestrator
  pulled this ticket ahead of two P0s. Whether `ABC-012`'s Test notes get updated to say so is
  BA/PM's, not mine.
