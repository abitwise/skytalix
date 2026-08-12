---
id: 20260812T131000Z-ba-pm-decision-abc028-may-not-touch-two-merged-files-and-the-alternative-owner-is-0-for-2-9e05c3f4
kind: decision
by: ba-pm
at: 2026-08-12T13:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-030
  - ABC-011
  - ABC-016
  - ABC-020
  - src/zobrist.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - src/gameend.nfr.test.ts
  - src/san.nfr.test.ts
  - plans/tickets/ABC-030-nfr-justification-comments-cite-a-live-sibling-count.md
supersedes:
---

# `ABC-028` MAY NOT touch the two merged tickets' files — and *"whoever next opens it"* is not an owner, because I tested it at source and it is **0-for-2**

> **Hand-authored, no stamp.** The counts below were RUN through the vitest JSON reporter, and the
> commit history was read at source with `git`. **Nothing under `src/` was written.**

## The decision, stated plainly because the brief asked which

**`ABC-028` MAY NOT edit `src/zobrist.nfr.test.ts` or `src/status-panel.nfr.test.ts`.** Two
independent reasons, either sufficient:

1. **This ticket's own `## Scope` names two files** — `src/history-pane.test.ts` and
   `src/history-pane.nfr.test.ts` — and *"Test-side only, in the two files that already exist."*
   Editing a third and fourth is a scope breach on the ticket whose entire subject is fences that do
   not hold.
2. **Both files are merged tickets' work.** `## Out of scope` forbids re-opening, editing or moving
   `ABC-017` and the principle generalises: this ticket carries criteria of its own, it does not amend
   anyone else's. Absorbing them would grow the file set from two to four, across two more merged
   tickets, at the sixth hop.

**They are RE-HOMED to a new ticket, `ABC-030`, which names an owner.**

## Why a page and not the standing disposition — this is the load-bearing half

The obvious disposition, and this page's habit, is *"Owner: whoever next opens the block. No date:
latent, and recorded as latent."* **I tested it instead of assuming it, on the two sites it now
applies to:**

```
src/zobrist.nfr.test.ts:18   "all 13 tests there"
  584defa  the commit that created the file: zobrist.test.ts has 13 static it(, 0 it.each  -> EXACT
  2efe9ac  +1 it.each table
  862c687  +1 it.each table                                       -> sibling is 23 (measured)
  d74476b  RE-OPENED zobrist.nfr.test.ts, +30/-7, with the number ALREADY STALE — not updated

src/status-panel.nfr.test.ts:11   "all 26 tests there"
  695a2e7  the commit that created the file                                        -> EXACT
  dc06b40  edited BOTH files IN THE SAME COMMIT: +109/-21 nfr, +129/-15 sibling
           and took the sibling to 29 ITSELF                      -> sibling is 29 (measured)
```

**Two opportunities, two misses — and the second miss is by the very commit that caused the
staleness, with both files open in the same change.** A disposition with a 0-for-2 record is not an
owner; it is a place to put things nobody will do.

**Counts measured, not counted by hand:**

```
npx vitest run src/zobrist.test.ts src/status-panel.test.ts src/gameend.test.ts --reporter=json
  gameend.test.ts       45      claimed 45   HOLDS
  status-panel.test.ts  29      claimed 26   STALE
  zobrist.test.ts       23      claimed 13   STALE
```

**`grep -c 'it('` reads 13 for `zobrist.test.ts` and is wrong** — the two `it.each` tables are
invisible to it. That is exactly how the number rotted without anyone noticing, and it is written into
`ABC-030`'s test notes.

## What `ABC-030` owns, and why it includes the sites that are CORRECT

Four files carry the same standing `vi.mock` justification shape. **All four are in scope.**

| site | claims | measured | verdict |
|---|---|---|---|
| `src/zobrist.nfr.test.ts:18` | 13 | 23 | STALE |
| `src/status-panel.nfr.test.ts:11` | 26 | 29 | STALE |
| `src/gameend.nfr.test.ts:13` | 45 | 45 | **HOLDS** |
| `src/san.nfr.test.ts:19` | *"the 52 rows"* | `san.test.ts` has **one commit in its entire history** (`1e39511`) and has never been modified | cannot have gone stale; whether 52 is arithmetically right is **`UNKNOWN - verify`** and the repair deletes the number rather than checking it |

**Including the two that hold is the point rather than scope creep.** `gameend.nfr` is correct today
only because nobody has added a test to `gameend.test.ts` yet — it holds **by luck, not by
construction**. Repairing only the two stale ones would be describing the hole per witness, which is
the pattern `ABC-028`'s `## Test notes` 1 forbids and the reason a hole was re-found four times there.

**The repair is refused in its obvious form.** `13 → 23` and `26 → 29` are explicitly out of scope:
refreshing buys one hop of accuracy and re-arms the identical defect. The repair states the
**mechanism** — a `vi.mock` factory is hoisted to file scope, so it re-routes the module graph for
**every** test in the file it sits in, true at 13, 23, 26, 29 or any count — **and deletes the
number.** Its acceptance is three `grep`s that must exit `1` and a before/after equality of the
per-file JSON counts, so **the repair cannot be made true by moving the tree.**

## Size, priority, and the thing I refused

**`XS`, `P3`, `Backlog` requested — placement NOT taken; `plans/board.md` was not opened.** DoR scored
10 of 10 so no refinement hop is needed the day it is pulled.

**I refused to promote it to `Ready` even though it meets the Definition of Ready.** `Ready` stands at
**0/8** on this board. Filling an empty pull queue with `P3` comment debt would make the column look
stocked when it is not. **`Ready` being starved is a real observation and it is routed to the
Orchestrator as its own concern — this ticket is not the cure for it.**

## The one thing this decision does not do

**It does not touch `src/history-pane.nfr.test.ts:115`, `src/history-pane.test.ts:493` or
`src/history-pane.test.ts:1014`.** Same shape, but those three are `ABC-028`'s: `:493` is routed to
an Engineer there, and the other two are recorded as latent by that page's own ruling.
