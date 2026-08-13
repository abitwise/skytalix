---
id: 20260813T223012Z-software-engineer-observation-strictly-stronger-withdrawn-the-premise-stands-499428bf
kind: observation
by: software-engineer
at: 2026-08-13T22:30:12Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-053
  - ABC-054
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.test.ts
  - src/frame.ts
  - 20260813T215008Z-qe-e2e-decision-95533fe2
  - 20260813T221658Z-ba-pm-decision-a4-repaired-and-the-strictly-stronger-contradiction-ruled-for-qe-7aa32d39
supersedes: 20260813T212621Z-software-engineer-observation-a4-cannot-be-satisfied-as-worded-and-three-more-flags-1d067874
---

# I withdraw "strictly stronger". The premise stands, the characterisation falls, and the named repair was circular.

This note supersedes my own
`20260813T212621Z-software-engineer-observation-a4-cannot-be-satisfied-as-worded-and-three-more-flags-1d067874`.
**The superseded file stays where it is.** It is not edited and not deleted: the record has to show
that the correction happened, not that it was never needed.

## What falls

I wrote of the delivered `A4` assertion: *"What was built instead, and it is strictly stronger"*, and
*"A second board implementation is caught."* **Both are wrong, and I accept QE's refutation and
BA/PM's ruling in full.**

1. **"Strictly stronger" is backwards as a set relation.** `A4` as literally worded rejected **every**
   build on this tree, the correct one included. A criterion that rejects everything is maximally
   strong; nothing can be strictly stronger than it. The build "the literal `A4` kills and the
   substitute admits" is the delivered build and every other one. The comparison I meant to make was
   against my own charitable repair — *"byte-identical to `renderBoard(...)` padded to the frame's
   width"* — and against **that** the delivered line was **weaker**, not stronger.
2. **The line I named as the repair was CIRCULAR.** `const width = (frame[0] as string).length` reads
   the width off a **board row**, so the seam and the assertion drew it from the same place. QE's `X2`
   walks through it, and I reproduced that by hand at this hop — see the sibling `observation` on the
   mutant runs.
3. **A second board implementation is NOT caught, by any byte comparison here.** QE's `X3b` — a copy
   of `renderBoard` in its own module — shipped 824/824 green with `renderBoard` never called. Bytes
   cannot see a copy that renders the same bytes, and duplication always starts byte-identical and
   drifts afterwards.

## What stands, and is load-bearing

**The premise.** `assembleFrame` pads every panel row to the widest panel (`src/frame.ts:194-208`),
the board's 18 columns are never the widest (the history pane's 21 are, at the start position), and
the width is content-dependent — 24 on the fool's-mate final position, where the status panel is
widest — so no fixed number could have been written into the criterion either. That is why `A4`
needed repair at all, and BA/PM repaired it on exactly that premise. **The measurements in the
superseded note are re-confirmed, not withdrawn.**

## Carried forward from the superseded note, so replay does not lose it

Superseding folds the whole earlier note out of the current state, not just the paragraph that was
wrong. Its other three sections were never refuted, so they are restated here with their status:

- **GAP 4 — the security firing threshold contradicted `A3`/`A6` when read literally.** **CLOSED by
  BA/PM at `refinement-ABC-041-a4`**: the threshold is now four clauses with a stated subject each,
  and clause (c) names read-only `node:fs` over the repository's own source as explicit precedent.
  My reading (the clause is about the **production module**) is the one the repair adopted. Security
  did not fire, and the three checkable parts were checked at the first hop.
- **FLAGGED, NOT FIXED (1) — `src/history-pane.nfr.test.ts:176` says "The five entries" over a
  six-entry list.** **STILL OPEN and still not fixed here.** `A10` budgets that file at exactly one
  line and this hop touches it not at all. One word, for whoever opens that file with a budget.
- **FLAGGED, NOT FIXED (2) — `ADR-0011` clause 2's declared list has reached its own dated expiry.**
  **STILL OPEN, and now HOMED**: BA/PM cut `ABC-053` (what the probe measures, declared-vs-derived
  roots) and `ABC-054` (import statements vs consumers) to Architect/Design. `src/render-seam.ts` is
  still the first module in the repository to import all four frame producers, so
  `closure("render-seam.ts")` yields four of the five declared roots and `glyph-mode.ts` is reachable
  from no frame producer at all.

## What this note does NOT claim

Not that the delivered `src/render-seam.ts` was ever wrong. It was correct at the first hop, it is
byte-untouched by the gate and by this hop, and every mutant that changed observable behaviour is
caught. What was wrong was my **account** of why it is held — and an account is what later hops build
on, which is precisely why this correction is a note and not a comment.
