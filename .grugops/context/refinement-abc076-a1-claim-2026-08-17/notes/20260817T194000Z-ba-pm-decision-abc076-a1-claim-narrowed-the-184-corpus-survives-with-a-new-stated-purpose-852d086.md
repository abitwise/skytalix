---
id: 20260817T194000Z-ba-pm-decision-abc076-a1-claim-narrowed-the-184-corpus-survives-with-a-new-stated-purpose-852d086
kind: decision
by: ba-pm
at: 2026-08-17T19:40:00Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190709Z-qe-e2e-observation-abc076-a1-is-vacuous-for-table-content-at-184-and-at-12-the-widening-bought-nothing-for-that-defect-class-99a7fcf7.md
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190711Z-qe-e2e-decision-abc076-qe-verdict-pass-six-of-six-criteria-met-two-gaps-found-at-qe-99a7fcf7.md
  - .grugops/context/refinement-abc076-a1-corpus-2026-08-17/notes/20260817T184032Z-ba-pm-decision-abc076-a1-corpus-widened-to-the-six-perft-positions-plus-their-one-ply-children-757221a2.md
supersedes:
  - 20260817T184032Z-ba-pm-decision-abc076-a1-corpus-widened-to-the-six-perft-positions-plus-their-one-ply-children-757221a2
---

# `ABC-076` `A1`: the CLAIM is narrowed to what QE measured; the 184-position CORPUS SURVIVES, with a different stated purpose. The two are separable and I separated them.

QE falsified my 2026-08-17 widening argument by experiment (`KNIGHT_TABLE[27]` mutant green at 184
AND at 12; all six tables plus every `PIECE_VALUE` randomised, still green at 184). **I accept the
measurement without re-running it, and I accept the structural explanation**: `whiteMinusBlack`
reads one table per piece type for both colours through `(black ? rank : 7 - rank) * 8 + file`, so a
white piece and its mirror read the SAME index and `whiteMinusBlack(mirror(p)) === -whiteMinusBlack(p)`
holds for any table contents. **"Mirrored for black" landed as a mirrored INDEX, not a mirrored
TABLE. The defect class I widened the corpus to catch does not exist in this implementation, at any
corpus size.** My argument was sound about the two-table implementation the ticket's `## Scope`
described and that I wrote before `src/evaluate.ts` existed; the premise expired when the code
landed and nothing re-checked it. That is the failure, and it is a process failure, not a reasoning
failure — see the companion `observation` for what it costs and what would have caught it.

## The move that matters: the claim and the corpus are two decisions, not one

The falsified argument was the *justification* for a corpus size. It was never the *only* thing the
corpus does. So I ruled on them separately, and refused to bundle them:

1. **`A1`'s text promised a defect class it cannot detect. That is the defect, and it is repaired.**
2. **The corpus's cost/benefit is a different question, decided on its own inputs below.**

Reverting the corpus because the argument for it collapsed would be as unprincipled as keeping the
text because I wrote it.

## Ruling on the 184 corpus: **IT STAYS.** The case I would have to beat to shrink it

Argued for shrinking first, honestly, because that is the side my embarrassment points away from:

- The one defect `A1` genuinely detects — the side-to-move sign flip — **reds at 12 four times
  over** (kiwipete, position-3, position-4, position-6) and at 184 with 170 mismatches. For
  `ABC-076` alone, **12 is sufficient and 184 buys literally nothing measurable.** If `ABC-076` were
  the last evaluation ticket I would shrink it today.
- The cost is sunk here but **recurring** for `ABC-082`/`ABC-083`, which inherit it.

Against, and this is what decides it:

- **The one-ply machinery forced the castling/`epSquare` mirroring, and QE confirms two dedicated
  tests are the only thing holding those fields.** Shrinking to the six roots removes the pressure
  that keeps them mirrored, and `ABC-082`/`ABC-083` need them mirrored. Deleting the corpus deletes
  the reason the mirroring exists — the fields would then be held by tests with no consumer, which
  is exactly how a mirroring rule quietly rots.
- **`A1`'s blindness is a property of `ABC-076`'s implementation, not of the corpus.** Pawn
  structure, king safety and mobility are *relational* over files, ranks and adjacency; there is no
  reason to expect their mirror equality to reduce to an index identity. **For `ABC-082`/`ABC-083`
  the mirror property is a real test, and a corpus with 178 varied one-ply children — differing
  castling rights, live en-passant squares, asymmetric pawn structures — is where it earns its
  keep.** The corpus is worth what it is worth *there*, and it is already built.
- **The recurring cost is generation, and it is zero-thought**: deterministic, from merged
  `legalMoves`/`makeMove`, already written. What recurs is runtime on 184 cheap pure calls, well
  inside the `N8-LANE` bar.

**What the corpus is FOR, one sentence, since "catches a wrong table entry" is no longer available:**
*the 184 positions are the shared, deterministically-derived input set that reds `ABC-076`'s
side-to-move sign negation and that forces and holds the castling/`epSquare` mirroring `ABC-082` and
`ABC-083` need for their own — genuinely non-identity — mirror properties.*

**The live risk QE named is closed in the pages, not in a note**: `A1` now states in terms that its
greenness is not evidence about table contents, and `ABC-082` `A1` now says the inherited 184 are
INPUTS, not evidence. That was the whole reason G1 was referred rather than filed.

## Ruling on QE's mirror-helper recommendation: **ACCEPTED, with one addition. `A7` is written into `ABC-082`.**

Accepted, and QE's reasoning is right on every leg: a comment is advice with no consequence, a fork
here is silent until a mirroring rule changes and then two corpora assert different things while
both look green, and the comment asks `ABC-082`'s engineer to do exactly the drive-by refactor
coding rules 9–10 forbid. Accepted too that the lift belongs **inside `ABC-082`** — a standalone
"move three functions" ticket delivers no user value and would queue behind `ABC-077` — and that
`noExportsInTest` must NOT be relaxed. The `ABC-076` "no third file" fence was that ticket's
security firing threshold and does not bind `ABC-082`, so nothing carries over.

**My addition:** QE's proposed criterion leaves the `productionModules()` consequence outside the
criterion, where it would be advice again. `A7` therefore carries it as a third mechanically-red
clause. Detail and the two rejected alternatives are in the companion `observation`.

## What I did NOT do, deliberately

- **No code change, no `src/` edit.** The mirror-helper lift is `ABC-082`'s work, paid for by `A7`.
- **No table-content test ordered.** `ABC-076` test note 3 forbids asserting totals; overriding it
  is mine to do and I decline — the honest fix for `A1` is a truthful claim, not a brittle assertion
  of hand-tuned numbers. **What genuinely guards table contents is `A4`-style relational assertions,
  and QE's residual R1 (five of six material values unguarded) is `ABC-077`'s or a follow-up's, not
  a retrofit into a shipped ticket.**
- **No renumbering, no re-scope, no new ticket.** `A1` keeps its identity and its 184.
- **`ABC-083` not edited.** It inherits the same misreading risk through its own `A1`; the same
  `A7`-shaped clause should be written into it **at its refinement**, and doing it now would edit a
  Backlog ticket nobody has read against a tree. **Flagged, owned, and named here so it is not lost.**
