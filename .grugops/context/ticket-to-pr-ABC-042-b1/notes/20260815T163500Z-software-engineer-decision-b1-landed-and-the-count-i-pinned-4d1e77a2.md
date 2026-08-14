---
id: 20260815T163500Z-software-engineer-decision-b1-landed-and-the-count-i-pinned-4d1e77a2
kind: decision
by: software-engineer
at: 2026-08-15T16:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B1
  - E1
  - Q4
  - A6
  - ASVS-V2.2.1
  - src/cli.test.ts
supersedes: 
---

# `B1` landed: the instrument caught up with the criterion — and the count I pinned is **138 cases over 134 distinct**, both of them

## What the two rows say now

**`A6`(i)'s near-miss row** implements BA/PM's clause verbatim: the upper-case form, plus one character
from `{"x", " "}` **inserted at every index** and **deleted at every index**, per spelling, each case
still resolved **in its legal argv position** (`--colour`'s two-token form is `Q1`'s fix and I did not
undo it). The shape is BA/PM's, written as a loop rather than a three-element array literal.

**`A6`(ii)'s corpus** is now drawn against a **500-draw budget**: the loop is bounded by draws, the draw
count per shape is recorded, and **the draws are asserted first**, before the survivors. That ordering is
the criterion's and it is the whole point — a survivor count under an unbounded loop cannot fail.

**Test count is unchanged: 29 before, 29 after.** No row was added; two existing rows were strengthened
and two more (bar 3, the only-argv-literal scan) were repaired under `S2`/`S3`. **Zero new spawns.**

## The count — pinned deliberately, and I pinned BOTH numbers

```
expect(derived).toHaveLength(138);
expect(new Set(derived).size).toBe(134);
```

**My independent measurement agrees with BA/PM's exactly: 138 cases, 134 distinct, 4 duplicates.** I
derived it before writing a line of test, against the delivered resolver, and I can show the arithmetic
rather than assert it — each spelling contributes `3n+3` cases (`1` upper-case, `2(n+1)` insertions, `n`
deletions), and `n` sums to `7+9+8+5+5+6 = 40`, so `3(40) + 3(6) = 138`:

| spelling | n | cases | distinct |
|---|---|---|---|
| `--ascii` | 7 | 24 | **22** |
| `--unicode` | 9 | 30 | **29** |
| `--colour` | 8 | 27 | **26** |
| `white` / `black` | 5 | 18 / 18 | 18 / 18 |
| `random` | 6 | 21 | 21 |
| **total** | 40 | **138** | **134** |

The four duplicates are exactly the ones BA/PM named, and I printed them rather than trusting the
description: **`-ascii`, `--asci`, `-unicode`, `-colour`** — deleting either `-` of `--`, or either `i`
of `ascii`. **No cross-spelling collision exists**; every duplicate is inside one spelling's own family.

**Why both numbers and not one.** The subtask says pin one deliberately. I pin **138 as the derived
count the criterion asks for** — it is the number of cases actually resolved, so it is the number that
measures the row's reach — and I pin **134 as the distinct count in the same breath**, because the trap
is not that one number is wrong: it is that **the two differ and nobody wrote down which is which.** An
engineer who reaches for the obvious uniqueness assertion writes `expect(new Set(derived).size).toBe(138)`
and **reds a correct build**. Two pinned numbers and a comment naming the four duplicates make that
mistake impossible to make quietly, and the second pin costs one line and one `Set`. Either number
drifting now reds.

**Nothing about `134` is load-bearing on the resolver** — both pins are properties of the test's own
derivation from `## Scope`'s table, so neither can red on a legal change to the build. They red when the
family or the table changes, which is what a tripwire is for.

## `Q4`'s repair, and the number that is not arbitrary

`DRAW_BUDGET = 500` is BA/PM's measured 2x headroom, and I did not re-choose it. The correct whole-form
filter needs **exactly 250 draws for 250 items** — the chance of randomly drawing `--ascii` or `white`
is ~1e-10 — so the budget can only be reached by a filter that drops more than it keeps. Measured in my
census note: the over-dropping CONTAINS reading now **reds in 1.6 s** where the unbounded loop **did not
terminate in 30 s**.

## What I did NOT do, because it was not mine

- **No production byte.** The build is correct — BA/PM measured it and I re-measured it: the delivered
  resolver accepts **0 of 138**. There was nothing to fix in `src/`.
- **No criterion edited.** The clause was written for me; I implemented it and re-worded nothing.
- **The ticket page, `plans/board.md`, `plans/traceability.md`, `src/history-pane.nfr.test.ts`** — all
  untouched, all somebody else's.
