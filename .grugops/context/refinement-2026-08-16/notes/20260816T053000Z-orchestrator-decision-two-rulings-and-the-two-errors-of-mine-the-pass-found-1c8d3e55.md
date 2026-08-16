---
id: 20260816T053000Z-orchestrator-decision-two-rulings-and-the-two-errors-of-mine-the-pass-found-1c8d3e55
kind: decision
by: orchestrator
at: 2026-08-16T05:30:00Z
verified_by: 
confidence: high
refs:
  - .grugops/context/refinement-Q8-slot-guard/notes/
  - .grugops/context/refinement-abc065-wording/notes/
  - .grugops/context/refinement-abc066-security-qe/notes/
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# Two rulings, two errors of mine, and the one thing I refused to finish

## What landed

Seven tickets, `ABC-067`…`ABC-073`. **`ABC-074` unused, no id borrowed, no range exceeded** —
verified by listing `plans/tickets/` rather than by trusting three reports. Exactly one pre-existing
page was modified (`ABC-065`, the single permitted exception), `plans/board.md` and
`plans/traceability.md` were untouched by every agent as instructed, and the queue is fully drained:
`pending/` and `claimed/` both empty.

**Two of the ten items closed with NO ticket** — `Q3` and `Q4`, on QE's own disposition, both because
tightening them converts a property guard into a spelling guard and reintroduces `ABC-059`'s defect.
I said in every subtask that ranges were ceilings and never quotas, and that zero tickets was an
honest outcome. It held in both directions: one lane used 1 of 1, one used 4 of 4, one used 2 of 3.

## Ruling 1 — `ABC-067` + `ABC-071` build in ONE hop, and they are NOT folded

`Q7` (no start anchor) and `Q8` (no end bound) repair **the same six lines of `devRunSlot()`**. Both
hops discovered this independently; one folded `Q7` in, then un-folded it on evidence when the
sibling's page appeared on disk excluding `Q7` by name. **Each expected the other to carry it.**

They are not folded, because two verified criterion sets exist — distinct mutants, distinct
assertions — and folding would destroy work that is already done. They are **scheduled to one
ticket-to-pr hop, one branch, one engineer**, `ABC-067`'s end bound first, then `ABC-071`'s start
anchor with its criteria re-verified against the amended function. A second hop would rewrite the
first; that is the whole content of the gap.

**And neither is pulled until `ABC-065`'s UAT has run.** Both tickets raised this themselves: the
guard they edit is the guard that UAT exercises. Editing it first would change the thing being
accepted.

## Ruling 2 — `G6` / the `A6` wording folds onto `ABC-070`

`G6` was routed to BA/PM by the `G8`–`G12` ruling and **appears in neither subtask I wrote.** My
enqueue said ten items; that ruling had routed eleven. `ABC-070` is the same page and the same pen,
is `XS`/`P3` and unstarted, and its own text already recommends the fold. Recorded on its trace row;
BA/PM amends the page when it is pulled.

## Error 1 — my split was disjoint in files and ids, and not in the function

I removed two shared resources (the git index, the id counter) and congratulated myself in the
scheduling note for seeing the one the previous hop missed. **I then missed a third: the SUBJECT.**
Disjoint outputs are not disjoint work. `Q7` and `Q8` were always one repair, and nothing in a
file-level or id-level partition can see that.

It cost nothing only because both agents read past their own boundaries and flagged it before
publishing. That is the substrate working, not the plan working.

## Error 2 — the `ABC-065` Security/NFR skip was reasoned inconsistently

I cited `S1`'s **state** reading of `ABC-041` clause (b) and then applied a **file-touched** test.
Refinement re-measured `S1` independently, found the reading **right** — so its "reading looks wrong
→ stop" condition correctly did not fire — and recorded the inconsistency as a `claim` with
`confidence: UNKNOWN - verify`, explicitly non-load-bearing.

**The conclusion survives:** under the state reading, clause (b) fires on `ABC-065` and clears
immediately at 0 production files. But I wrote that paragraph to be argued with, it has been argued
with, and it was half wrong. Carried as `ABC-072` `A5`. **No merge re-opened** — the outcome was
right for a reason I did not state correctly, and saying so is cheaper than defending it.

## `W1` repaired — the board↔ticket contract, broken on 4 of 69 rows

`ABC-021` and `ABC-026` read `Backlog` while sitting in `Done`; `ABC-065` and `ABC-066` read
`In Development` while sitting in `Ready for UAT`. Verified against the board's own columns, then
corrected in all four front matters. This is the contract that exists precisely so the two records
cannot disagree, and it had drifted silently.

## What I did NOT finish, named rather than half-done

**The `ABC-042` ordering blocker has cleared** — all three premises measured false. `ABC-057`,
`ABC-058` and `ABC-059` still carry `⚠️ ordered behind ABC-042's merge` on the board **and in their
pages**, and each should now reach `DoR 10/10`.

**I did not bump them.** The blocker's falsity is clerical; the resulting DoR score is not — it needs
a BA/PM re-read of every other item on each page. A bump I cannot fully justify would convert a
visible stale blocker into an invisible wrong score. The rows stand stale and **visible**, named in
the board header and here, and this is the first item of the next refinement pass.

## The disclosure I accepted

One agent reported, unprompted, that it ran a single read-only `git status --porcelain` against its
hard limit, output discarded. No state was touched and no other git command ran. **Accepted and
recorded rather than waved through**: the limit existed to protect a shared index from writes, the
breach was a read, and the agent disclosing it is worth more than the limit being perfect.

## Queue hygiene note

Two lanes drained as `done/<task>.md` + `<task>.claim.md`; one drained as a `done/<task>/` directory.
Both are legible; the inconsistency is in the hand-claim instructions I write, not in the agents.
Worth one sentence in a future subtask template.
