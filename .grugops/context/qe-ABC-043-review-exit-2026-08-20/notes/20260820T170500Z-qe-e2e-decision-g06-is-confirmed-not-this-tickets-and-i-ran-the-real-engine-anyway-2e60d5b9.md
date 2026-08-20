---
id: 20260820T170500Z-qe-e2e-decision-g06-is-confirmed-not-this-tickets-and-i-ran-the-real-engine-anyway-2e60d5b9
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T17:05:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-078
  - ABC-108
  - ADR-0014
  - NFR-004
  - NFR-008
supersedes:
---

# `G-06`: **CONFIRMED, not contested — it is not this ticket's.** And I ran the real engine end to end myself anyway, so the gap is now covered by evidence even though it is still not covered by a row

## The gap, restated once

**No criterion on `ABC-043`'s page runs the delivered composition's real engine.** All seven
`ABC-043` children and `ABC-042`'s two carry a substituted `./engine.ts` exporting
`DEFAULT_BUDGET_MS = 0`. Confirmed by reading `src/cli.test.ts`'s child table at `main`.

## The engineer said it is not this ticket's. He is right, and the ticket says so in its own words

Three places on the page, none of them added after the fact:

- `## Test notes` 8 — *"No criterion here runs the real engine, deliberately, and no default-lane row
  may."*
- `## The ruling on `A5` and `A2`'s testability` — *"with `A2` and `A5` both driven by doubles, no
  criterion on this page runs the REAL engine end to end, and that is deliberate … **Not cut as a
  ticket here; recorded as the honest gap.**"*
- `## Security / NFR triggers` — *"`NFR-004` … no criterion here runs the real search, so no row on
  this page may be read as a re-measurement of `NFR-004`."*

**And the arithmetic behind the deliberateness holds at `main`:** `DEFAULT_BUDGET_MS` is 3 s per
engine ply, the default lane already reads **~15.6 s CPU / ~3.3 s wall** (median of three, this hop),
and `ADR-0014` has `NFR-008` **BREACHED** with `ABC-108`'s `OQ-1` open. A real-engine row in the
default lane would add 3 s of wall **per ply** to a lane that is already over both clauses.

**So: not contested. `ENGINE_DEEP` is the precedent and the home; the cut is BA/PM's.**

## What I contest is the ownership, not the exclusion — and it is unchanged from 2026-08-19

`G-06` was recorded as *"BA/PM to cut"* at the previous QE hop. **It has not been cut, and it is now
the second QE hop to hand it forward.** I am not absorbing it into a PASS silently: it travels with
this ticket into `Ready for UAT` as a named, unowned gap, and the honest sentence is the one the prior
hop wrote — **this product's strongest end-to-end evidence is a person at a terminal, recorded in
context notes, not a row in a suite.**

## I added to that evidence rather than only pointing at it

Run by me at `main` @ `d127ae3`, through the real entry point, with the real engine at its real budget
— **`npm run chess --`, separator and all**, no `--import`, no double, no hook:

- **`npm run chess -- --colour black --ascii </dev/null`** → **exit 0**, `real 3.20 s` (one real
  engine ply at `DEFAULT_BUDGET_MS`), **two boards**, `White to move 1.` then `Black to move 1...`,
  then `input ended`. The engine opens because the human is black, and the first board sits there
  while it thinks — which is `A7`'s behaviour through a real search rather than through a double.
- **`npm run chess -- --colour white --ascii` on a live stdin, four inputs over 20 s** —
  `e2e4`, `g1f3`, `zzz`, `f1c4`: **8 frames**. The engine answered every legal move with a legal reply
  within its budget; `zzz` produced a **rejection frame that did not advance the game** (`White to
  move 3.` appears twice — `ABC-019`'s non-advancing-with-a-message cadence, observed against the real
  engine rather than derived); the session then continued to `White to move 4.`. No crash line, no
  stack, stderr empty.

**That is not a criterion and I am not recording it as one.** It is a hand run, it is not repeatable
by a suite, and its engine choices are hardware-dependent — which is exactly why `A2` uses a
deterministic double and exactly why `G-06` needs an opt-in lane rather than a promotion of this
paragraph.
