---
id: 20260817T190536Z-qe-e2e-decision-abc031-a2-confirmed-defective-qe-accepts-the-engineers-handling-dbbb1b96
kind: decision
by: qe-e2e
at: 2026-08-17T19:05:36Z
verified_by:
confidence: high
refs:
  - ABC-031
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/coordinate-move.test.ts
  - src/legal.ts
  - .grugops/context/ticket-to-pr-ABC-031-2026-08-17/notes/20260817T184249Z-software-engineer-observation-abc031-a2-fen-has-adjacent-kings-and-cannot-carry-the-criterion-913e5b27.md
supersedes:
---

# `A2` confirmed defective by independent measurement. **QE ACCEPTS the engineer's handling.**

The QE brief asked me to confirm the `A2` situation myself and then to **say plainly** whether I
accept the engineer's handling or whether `A2` should be NOT-MET until BA/PM repairs the ticket.

## Confirmed — re-derived from the tree, not read off either note

Ran the merged generator against both FENs directly, exactly as the engineer's note invited:

| FEN | legal moves | detail |
|---|---:|---|
| `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` — **the ticket's printed FEN** | **1** | `e1e2` only. Kings on **e1** and **e2**, adjacent; the position is illegal, White is "in check" from the black king, and **no promotion is legal at all** |
| `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` — the engineer's minimal correction | **6** | `e1f1`, `e1d1`, and **four `e7e8`** promotions (types 5/4/3/2 = Q/R/B/N) |

Both the engineer's and the orchestrator's numbers reproduce exactly. `A2` demands a queen promotion
by reference and a 4-candidate `ambiguous`; **no correct implementation can produce either from the
printed FEN.** The criterion as printed is unsatisfiable.

## The verdict, plainly

**I accept the engineer's handling, and I do NOT hold `ABC-031` at NOT-MET for it.** Four reasons,
in order of weight:

1. **He proved the substance, not a substitute for it.** The corrected FEN is a **one-character**
   change (black king e2 → e3) and changes nothing `A2` is about: same white pawn on e7, same
   promotion rank, same four promotion types, same `from`/`to`. Both `A2` rows pass on it **by
   reference identity**. The behaviour `A2` was written to pin is pinned.
2. **He pinned the broken fixture in the suite.** `src/coordinate-move.test.ts:103-109` asserts the
   printed FEN's legal moves are exactly `["e1e2"]`. That makes his claim **falsifiable from the
   suite** and makes BA/PM's repair **verifiable** — the row goes red the moment the FEN is fixed,
   which is the correct signal. This is materially better than a note.
3. **He refused the two things that were not his to take.** He did not edit the criterion, and he did
   not *pick* the repair (moving either king is equally valid). Criteria are BA/PM's. Had he silently
   swapped the FEN in and reported `A2` MET, this hop would have had nothing to catch.
4. **He reported it as NOT-MET-as-written rather than banking a green tick.** A criterion whose stated
   fixture was never used, reported as plain MET, is exactly the drift process rule 1 exists to catch.

## What I am NOT signing off

**`A2` remains NOT-MET AS WRITTEN, and that is BA/PM's to clear, not mine and not the engineer's.**
My acceptance is of the **engineer's conduct and evidence**, not of the ticket page. Concretely:

- **`ABC-031` must not be recorded as "7 of 7 criteria MET".** The honest line is **6 MET, 1 met in
  substance against a corrected fixture, pending a BA/PM repair of the printed FEN.**
- **BA/PM owes a one-character repair** to `plans/tickets/ABC-031-coordinate-move-input.md` `A2`.
  Once it lands, the pinning row at `src/coordinate-move.test.ts:103-109` must be updated or removed
  in the same change — it exists only to make the defect visible.

## The process point, stated narrowly and against my own gate too

The orchestrator's own note names this as a **fixture** gap that the `Ready for Dev` exit review
missed while checking code paths and measurements. **That diagnosis is correct and it generalises
past the exit review: no acceptance criterion on this ticket asserted anything about the ticket's own
fixtures either.** `A2`'s FEN was wrong for five days across a cut, a Definition-of-Ready assessment
scoring item 4 as ✅ *"exact FENs"*, a pull, and an exit review.

The cheap, falsifiable repair the orchestrator proposed — **execute every FEN and literal input a
criterion names against the merged generator before the ticket is pulled** — would have cost one
`node -e` and caught it. **I endorse it, and I extend it by one step: run the same check at the QE
hop too**, because that is where I caught gap 4 (`A5`'s corpus has zero en-passant moves), which is
the same class of defect — a criterion whose named corpus does not contain the case the criterion
exists to catch. **Neither check is expensive; both are the difference between a criterion and a
sentence about a criterion.**
