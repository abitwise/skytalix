---
id: 20260817T203000Z-ba-pm-decision-abc031-a2-fen-repaired-one-character-verified-three-times-4c1b90e2
kind: decision
by: ba-pm
at: 2026-08-17T20:30:00Z
verified_by:
confidence: high
refs:
  - ABC-031
  - plans/tickets/ABC-031-coordinate-move-input.md
  - plans/traceability.md
  - src/legal.ts
  - .grugops/context/ticket-to-pr-ABC-031-2026-08-17/notes/20260817T184249Z-software-engineer-observation-abc031-a2-fen-has-adjacent-kings-and-cannot-carry-the-criterion-913e5b27.md
  - .grugops/context/quality-gate-ABC-031-qe-2026-08-17/notes/20260817T190536Z-qe-e2e-decision-abc031-a2-confirmed-defective-qe-accepts-the-engineers-handling-dbbb1b96.md
supersedes:
---

# `A2`'s FEN repaired — one character, and I ran it before I wrote it

## The repair

| | FEN |
|---|---|
| **BEFORE** (as cut 2026-08-12) | `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` |
| **AFTER** (repaired 2026-08-17) | `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` |

**Black king `e2` → `e3`. Nothing else moved.** The white pawn is still on `e7`, the promotion rank
is still the eighth, the four promotion types are still Q/R/B/N, `from`/`to` are still `e7`/`e8`.
**`A2`'s meaning is unchanged; only its fixture is corrected.** This is a repair, not a re-cut, and
`A1`-`A7` keep their identities.

## Measured at my own hand, against merged `src/legal.ts` — not read off either note

`parseFen` then `legalMoves`, printed with `squareName`:

| FEN | moves | detail |
|---|---:|---|
| the cut FEN | **1** | `e1e2` only |
| the repaired FEN | **6** | `e1f1`, `e1d1`, `e7e8[p5]`, `e7e8[p4]`, `e7e8[p3]`, `e7e8[p2]` |

The cut FEN puts the kings adjacent on `e1`/`e2`. That is not a legal position: White is "in check"
from the black king, the only legal move is the king capturing it, and **no promotion is legal at
all**, so `A2`'s two stated outcomes — a queen promotion by reference, and a 4-candidate `ambiguous`
— are unproducible by any correct implementation. **The criterion as printed was unsatisfiable.**

The repaired FEN returns exactly the four `e7e8` promotions with identical `from`/`to` that `A2`
asks for. **Three independent measurements agree** — the software engineer's at build, QE's at the
gate, and mine at this hop.

## Why the engineer's correction, and not another

Moving either king produces a legal position, and the engineer explicitly declined to pick. **I
picked his: it is the minimal edit — one character — and it is the FEN both the delivered `A2` rows
and QE's confirming run already execute.** Choosing a different legal position would be a repair
nobody has run and would strand the delivered evidence for no gain. The bar the task set was that
the FEN must produce the four promotions `A2` describes; this one does, measured.

## Consequences I am recording rather than leaving implied

1. **`ABC-031` may now be recorded as 7 of 7 once this page repair merges.** Until it does, QE's line
   stands: 6 MET, 1 met in substance against a corrected fixture. The blocker was the page, not the
   code, and the page is repaired here.
2. **`src/coordinate-move.test.ts:103-109` is now stale.** That row pins the *cut* FEN's single legal
   move (`["e1e2"]`) so the defect was visible from the suite. It stays **green** after this repair —
   it asserts a property of a string literal in the test, not of the ticket — so **nothing reds to
   announce it**. It has done its job and should be deleted or re-commented at the next touch of that
   file. **Routed to the engineer at `ABC-031`'s close-out; deliberately NOT a ticket** — seven test
   lines whose only cost is a reader's confusion do not earn a page, and a standalone ticket would
   outlive the cleanup it asks for. **I could not do it myself: `src/` is out of bounds at this hop.**
3. **The DoR table's row 4 was wrong** and is corrected in place on the page. *"Exact FENs"* was
   scored by reading. **The standing repair I adopt, endorsing the orchestrator's proposal and QE's
   extension of it: execute every FEN and literal input a criterion names, against the merged
   generator, before the ticket leaves `Ready` — and again at the QE hop.** It costs one `node -e`.
   This defect survived a cut, a DoR, a pull and an exit review over five days; nothing on the page
   asserted anything about the page's own fixtures.
