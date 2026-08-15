---
id: 20260815T230000Z-security-nfr-observation-four-things-nobody-asked-about-52ff6b7c
kind: observation
by: security-nfr
at: 2026-08-15T23:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - N8-SPAWN
  - N8-LANE
  - NFR-008
  - plans/nfr-catalog.md
  - plans/traceability.md
supersedes: 
---

# Four things nobody asked me about, each with a severity, a named owner and a trigger

None of these changes the `G1` verdict. Each is recorded because it is true, and because the first
three are the kind of thing that is cheap now and expensive at the second spawning ticket.

## 1. **The account's cumulative wire is INSTRUMENT-DEPENDENT, and on its own first charge that decides whether it survives.** MEDIUM.

The account fixes the *statistic* (median of ≥ 5) but leaves the *quantity* under-specified: it says
*"the child's own measured CPU"*. Measured **how** is the whole question, and I measured it three ways
on the same ten children, on the same machine, in the same hour:

```
                                              charge     vs the 1300 ms cumulative wire
my gate reading  (/usr/bin/time -p, 10 ms      1070 ms    does not fire   margin 230 ms
                  resolution, n=5, loaded)
this hop         (bash time, 1 ms resolution,  1236 ms    does not fire   margin  64 ms
                  n=9, quiet)  <- the reading of record
IN-LANE          (C-B minus the floor)         1430 ms    WOULD FIRE — the account CLOSES
```

> **The spread between two defensible readings of the same protocol (166 ms) is LARGER than the margin
> the wire has left (64 ms). And the reading I believe is physically truest — what the children
> actually cost inside the lane — closes the account on the charge that opens it.**

**This is not an argument for shading the charge.** I applied the account as written and reported the
number it produces. It is an argument that **the account should say which measurement it means**, and
that the choice is doing more work than its author had reason to expect: `N8-SPAWN` was calibrated
against my gate's 1070 ms, which I now know was taken on a 10-ms-resolution instrument that rounds
toward zero.

**Owner: Architect/Design** (the row and the account are theirs; `plans/nfr-catalog.md` is read-only to
me and I have not touched it). **The shape of the ask, if it is wanted:** one clause naming the
instrument and its resolution, in the same place the statistic is already named. **Trigger: the second
ticket whose criteria force child processes** — which is also the ticket that closes the account, so
the two questions arrive together.

## 2. **The 3 s WALL clause has no account, no per-ticket bar, and `ABC-042` puts 640–790 ms into it.** MEDIUM.

Architect/Design named this in its own limitations note and did not measure it. **I measured it, and it
is bigger than the CPU story relative to its budget:**

```
                     CPU                          WALL
lane total      11.036-11.347 s of 13 s          2.381-2.655 s of 3 s
                84.9% - 87.3%                    79.3% - 88.5%
headroom         1.964 - 1.653 s                 0.620 - 0.346 s
ABC-042's delta  +1548-1566 ms  sign 8/8         +637-746 ms  sign 8/8
the children     +1430 ms (in-lane)              +791 ms (C-B)
attributed to    the SPAWN account               NOBODY
```

**The children are 21–26% of the entire 3 s wall clause, charged to no account and bounded by nothing
but the total** — and the wall headroom (346–620 ms) is now **smaller than a single ticket's wall
delta.** The reasoning that made a per-ticket wall bar unmeasurable was derived on file-adding tickets
(two added files move the wall by −15 to +3 ms, below the identity null). **A spawning ticket is not
one of those**: its wall signal is 637–791 ms at sign 8/8 against a null of +0.36% at 4/8. **The wall
clock, which cannot see two added test files, sees children at seven times the null.**

**No change is asked for and none is made** — `N8-SPAWN` is CPU-only and says so, and a gate does not
invent a bar. **Owner: Architect/Design (this row). Trigger: the same one — the second ticket whose
criteria force child processes**, adopted verbatim so there is one trigger and not three.

## 3. **FOUR rows of `plans/traceability.md` are NOT at 10 cells, and have not been for 12 days.** LOW.

The subtask told me the `ABC-042` row is 10 cells and must stay 10, and to assert it rather than
eyeball it. I did. **Then I ran the same assertion over the whole table, which costs one line, and it
fails on four other rows:**

```
rows not at 10 cells at HEAD (b891880) and at d011df4, identically:
  ABC-009  12 cells      ABC-011  11      ABC-015  11      ABC-019  11
```

**Pre-existing, not mine** — identical at `d011df4` and at `HEAD`, and my write left them untouched
(I hashed the nine cells I did not write and re-split the row from disk after the write). Traced to
first cause:

```
c525ba5  2026-08-03  ABC-011 breaks     -> b42babb +ABC-015 -> 8af702f +ABC-009 -> 4c306da +ABC-019
deb49e3  2026-08-15  ABC-042 breaks too (5 rows broken)
d18bcfd  2026-08-15  ABC-042 REPAIRED   (4 rows still broken, and still broken today)
```

**The defect and the repair happened on the same day on the same table, and only the row the hop
happened to be touching got fixed.** That is the real finding: **the invariant is asserted per-row by
whoever is writing that row, so it is enforced exactly where it is already being watched and nowhere
else.**

**`ABC-009`'s row states the cause in its own prose, and the statement is wrong**: it says a pipe
*"inside a quoted shell pipeline … is the documented GFM way to put a pipe in a cell"*. **It is not.**
GFM requires `\|`, escaped, **including inside code spans** — a backtick span does not protect a pipe
from the table parser. That belief is what broke the row, and it is written down where the next person
will read it as guidance.

**Not repaired by me, deliberately:** those are four other tickets' rows, written by other roles, and
my subtask scopes me to one cell of one row. **Owner: the Orchestrator** to route (or BA/PM at a cut).
**The fix is `\|` in four places and one sentence of `ABC-009`'s prose corrected. The durable fix is
one whole-table assertion instead of a per-row one, and it is the line I already ran.**

## 4. **`plans/traceability.md`'s `ABC-042` `Status` cell is now STALE, and I did not repair it.** LOW.

It reads *"`ABC-042` IS HELD AT THE MERGE ON `G1` ALONE, WHICH IS WITH THE PROJECT OWNER AND
UNANSWERED"*. **`G1` is answered and now MET, so that sentence is false as of this hop.**

**I left it.** It is the Orchestrator's cell, signed by the Orchestrator, and it carries board-column
arithmetic that only the Orchestrator's consolidated move can settle. **Rewriting another role's cell
to record my own result is the exact act the Orchestrator refused when it declined to pick between my
two writes** — and my subtask forbids moving the board. **My role file tells me to update `Status`; the
subtask forbids it on this row; the subtask is authoritative for this hop**, and Architect/Design hit
the identical conflict on the same row and resolved it the same way. **Named here so the Orchestrator's
next hop repairs it deliberately rather than discovering it.**
