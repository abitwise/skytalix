---
id: 20260818T162000Z-software-engineer-observation-three-things-i-did-not-absorb-1f8a5cd6
kind: observation
by: software-engineer
at: 2026-08-18T16:20:00Z
verified_by:
confidence: high
refs:
  - ABC-106
  - ABC-032
  - src/san.parse.test.ts
  - ticket-to-pr-ABC-106-2026-08-18
supersedes:
---

# Four discrepancies found while doing the work, none of them absorbed silently

Each is reported rather than fixed, because fixing any of them would have been scope this ticket did
not carry.

**1. The queue task file does not exist.** `.grugops/queue/pending/` is EMPTY and
`find .grugops/queue -name '*ABC-106*'` returns nothing in `pending/`, `claimed/` or `done/`. The
claim was still taken by hand per Workflow 17 — `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-106-2026-08-18/`, which SUCCEEDED (no EEXIST).
There was no file to move from `pending/`, so `.claim.md` records the absence instead. No task file
was authored to paper over it.

**2. Only ONE `it` title carried "not only the two the ticket names", not two.** The ticket's
`## Problem` says *"the two row titles say 'not only the two the ticket names'"*. Measured:
`grep -n "not only the two"` returns exactly **one** hit, the mixed-castle-spellings `it` title. The
second title carrying the same pending-ruling SENSE is the `describe` title (*"undisclosed input
widenings, pinned so a ruling has something to rule on"*). Both were fixed, so `A1` is met either
way, but the ticket's count of that exact phrase is off by one.

**3. `32/32` is the PERFT_DEEP suite, not `src/san.parse.test.ts`.** `ABC-106` `A2` reads *"the test
count of that file is unchanged … and `PERFT_DEEP=1` is **32/32** exact"* — two separate clauses that
are easy to collapse into "32/32 on that file". Measured: `src/san.parse.test.ts` is **30/30**, and
`PERFT_DEEP=1 npx vitest run src/perft.test.ts` is **32/32**. Both were run before and after the
edit and both are unchanged. There is no reading of the tree in which `src/san.parse.test.ts` is 32
tests, so a later reader checking "32/32 on that file" will find a false negative.

**4. One title with the SAME defect sits just OUTSIDE this ticket's block, and was left alone.**
The row above the block reads `it("surrounding whitespace is trimmed — the tolerance the ticket's
closed list does not name", …)`. That is now **false**: the same 2026-08-18 ruling wrote `trim` onto
`ABC-032` § Scope as **entry 3** (`ACCEPTED`), so the closed list DOES name it. It is the identical
class of defect `ABC-106` was cut for. It was NOT changed, because `ABC-106` § Scope is the
`undisclosed input widenings` block and its three rows, `A1` names only that block, and widening a
comment-only ticket by an unasked row is exactly the hidden scope the role's hard limits forbid.
**Recommend it ride the next touch of this file** — it is a one-line title fix of the same shape.
