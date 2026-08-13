---
id: 20260813T221658Z-ba-pm-decision-a4-repaired-and-the-strictly-stronger-contradiction-ruled-for-qe-7aa32d39
kind: decision
by: ba-pm
at: 2026-08-13T22:16:58Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-054
  - plans/tickets/ABC-041-render-seam-closure.md
  - src/render-seam.ts
  - src/frame.ts
  - 20260813T212621Z-software-engineer-observation-a4-cannot-be-satisfied-as-worded-and-three-more-flags-1d067874
  - 20260813T215008Z-qe-e2e-decision-95533fe2
supersedes: 
---

# `A4` repaired. The Engineer/QE contradiction is ruled **for QE**, and the repair is split across TWO criteria because one instrument cannot hold both properties.

I wrote `A4`. The gate refuted it. Both halves of the refutation are correct and I am adopting both.
**No criterion was softened to make the delivered build pass, and `src/` was not touched.**

## The contradiction, ruled rather than averaged

The Engineer recorded its substitute as *"strictly stronger"*. QE refuted that. **QE is right, and the
reason is a set relation, not a matter of emphasis.**

`A4` as literally worded — *"the frame's board region is **byte-identical** to `renderBoard(position,
mode, orientation)`"* — rejects **every** build on this tree. `assembleFrame` pads every panel row to
the widest panel (`src/frame.ts:194-208`, `rows.map((row) => row.padEnd(width))`), and the widest
panel is the history pane's 21 columns, never the board's 18. I confirmed the mechanism myself before
adopting it. A criterion that rejects everything is **maximally strong**; nothing can be strictly
stronger than it. So the build that "the literal `A4` kills and the substitute admits" is **the
delivered build**, and every other. The comparison the Engineer meant to make is against its own
charitable repair (*"byte-identical to `renderBoard(...)` padded to the frame's width"*), and against
**that** the delivered line is weaker, not stronger — which is QE's second point.

**The Engineer's PREMISE survives intact and is load-bearing**: `A4` is unsatisfiable as worded, the
reason is a merged module `A10` forbids touching, and no fixed number could be written down either
because the frame width is content-dependent (24 on the fool's-mate final position, where the status
panel is widest). That premise is why this repair exists. **Only the characterisation is superseded**,
and the distinction matters because "strictly stronger" was about to be inherited as a settled fact by
the next reader.

## The named repair was CIRCULAR, and that is why the new wording names where the width comes from

```ts
const width = (frame[0] as string).length;   // frame[0] IS a board row
```

The seam and the assertion draw the number from the same place. QE's mutant `X2` — nine blank columns
appended to every board row, digit-free so `A3` cannot claim the kill — inflates the frame to 27
columns, the assertion reads 27 off row 0, and `board.map(padEnd(27))` matches. **8 passed (8)** with
the adjacent whole-frame equality removed. The repaired `A4` therefore does not merely say "padded to
the frame's width"; it says the width is **derived from the panels** — the widest row of
`renderBoard` / `renderStatusPanel` / `renderHistory` — and is **never read off the frame or off the
board region**. That is the one clause that makes the criterion non-circular, and it is now in the
ticket's text rather than in a test comment.

## The purpose clause was FALSE and is DELETED, not re-worded

`A4`'s parenthetical and `## Test notes` row 2 both asserted that byte-equality *"is what forbids a
second board implementation"*. QE built that second implementation — `renderBoard`'s algorithm copied
into its own module, `render.ts` left holding only type-erased specifiers — and it ships **824/824
green, `tsc` exit 0, with `renderBoard` never called**. A copy that renders the *same bytes* is
invisible to every byte comparison, and duplication always starts byte-identical and drifts later,
which is the failure the clause existed to prevent.

**So the property was not re-worded onto byte-equality. It was split off:**

- **`A4`** now states what byte-equality does measure — the board region is `renderBoard`'s rows for
  the matching orientation, padded to the panels' width, and the two orientations differ. It catches
  a hardcoded orientation (`X1`) and a self-padding seam (`X2`), both measured survivors of weaker
  forms. Its parenthetical now says **in words** that it does not catch a second implementation.
- **`A11`** (new) carries the call count: `renderBoard`, `renderStatusPanel`, `renderHistory` and
  `assembleFrame` are each called **exactly once**. This is `## Scope`'s own *"every panel is called,
  none is re-implemented"*, which until today **no criterion asserted**.

## `A11`'s reach is stated honestly, and it is NOT the second-implementation guard

The subtask is explicit that forbidding a second implementation needs a different instrument and that
the instrument is Architect/Design's. **I agree and I did not smuggle it into `A11`.** A call count
proves *this seam calls the merged four*. It does not prove the repository holds one board
implementation: a seam could call `renderBoard` to satisfy the count and render from a byte-identical
copy, and **both** the count and every byte comparison would pass. The repo-wide property needs an
instrument that measures **consumers** rather than import statements, and that is **`ABC-054`**, cut
on this hop and homed to Architect/Design. `ABC-041` `A11`'s parenthetical says this in the ticket, so
the next reader inherits the limit with the criterion.

## What this decision does NOT claim

- Not that the delivered `src/render-seam.ts` is wrong. It is correct and untouched.
- Not that `A11` is new work. QE's `A4 (purpose)` row is already written and **green on the pristine
  module** (828/828). See the sibling `claim` note on the stop condition.
- Not that the whole-frame equality is redundant. QE measured it doing the work the named repair was
  credited with; it stays, and `A4`'s new wording is what stops it being the only thing standing.
