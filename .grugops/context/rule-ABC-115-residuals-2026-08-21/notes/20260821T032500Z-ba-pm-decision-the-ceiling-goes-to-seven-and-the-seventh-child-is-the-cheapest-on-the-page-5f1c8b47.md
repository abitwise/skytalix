---
id: 20260821T032500Z-ba-pm-decision-the-ceiling-goes-to-seven-and-the-seventh-child-is-the-cheapest-on-the-page-5f1c8b47
kind: decision
by: ba-pm
at: 2026-08-21T03:25:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - N8-SPAWN
  - NFR-008
  - A10
  - A9
  - ABC-108
supersedes:
---

# RULED: `N8-SPAWN` GOES `<= 6` → `<= 7` ADDED CHILDREN, PIN 23 → 24. THE TIME CLAUSES DO NOT MOVE

**The clause in force: `<= 7 added children` AND `<= 2.0 s added wall` AND `<= 0.30 s added CPU
(user+sys) PER ADDED CHILD`**, on `npx vitest run --dir src`, median of >= 5 interleaved paired runs
against the immediate base commit, sign agreeing on >= 4 of 5. **Only the count moves. The two time
clauses are untouched and are re-measured at the repair hop on that paired-run lane instrument — my
figures below are standalone child readings and are NOT the clause measurement.**

## The under-ceiling routes, priced before the ceiling was touched

1. **Fold `A10` into an existing child — IMPOSSIBLE BY CONSTRUCTION, not merely awkward.** The row's
   Given is *a stdout that cannot be written to*, so the child yields **zero capturable stdout**.
   Every existing `CHILDREN` entry asserts on its own stdout; none can carry this Given and keep its
   own row. This is the first time on this ticket that the cheap route was closed by the criterion's
   own shape rather than by cost.
2. **Drop a row to make room — REJECTED, for the third time on this page.** The rule this ticket
   already wrote holds: *a row may only go by a RE-CUT argued on the criterion's own value, never to
   make a number fit.* Nothing about `A3`'s or `A4`'s value changed today.

## Why the count clause was the wrong instrument again — and in the OPPOSITE direction to last time

At the 2026-08-20 amendment the count **under-priced** `A9`'s child by ~15x in wall. Here it
**over-prices** `A10`'s, which dies at its first write and renders and captures nothing:

| child, standalone `/usr/bin/time -p` | wall | CPU (user+sys) |
|---|---|---|
| `A10`'s read-only-fd child | **0.06-0.07 s** | **0.11-0.12 s** (5 runs) |
| an ordinary `node src/cli.ts --ascii` child | 0.07 s | 0.16-0.17 s (3 runs) |

**The seventh child is CHEAPER than any of the first six.** It cannot be the child that breaks a
budget those six met, and it sits at **0.12 s against a `<= 0.30 s per added child` clause** — well
inside, with the same 2.5x headroom the delivered 0.198 s figure had. Added wall goes from the
delivered **+1.12 s** to roughly **+1.19 s** against `<= 2.0 s`. **A count that blocks the cheapest
child on the page is measuring the wrong quantity**, and that is the whole reason the raise is
defensible rather than a slipped fence.

## What the raise does NOT do

It does not touch `NFR-008` — **not graded here**, `ABC-108` is still open and this ticket still
claims no `N8-LANE` line. `A10`'s ~0.12 s CPU is reported to `ABC-108` at the repair hop as a
measured contribution, exactly as `A9`'s was; that lane budget is `ABC-108`'s to rule and this ticket
neither rules it nor hides in it.

## Size and priority — UNCHANGED, and said out loud because silence would be read as drift

**`S` and `P1` stand.** `A10` adds **zero production lines**, one row in a file this ticket already
opens, and one child through a harness shape the file already has. The `XS` re-size trigger is not
fired (the guard did not collapse to one child — it grew), and `SPLIT_REQUIRED` is not raised.
Neither of `## Priority`'s pre-registered triggers fired: nothing was measured taking a wrong routing
decision off this exit code, and the unhandled-`error` shape was not found on a second stream.
