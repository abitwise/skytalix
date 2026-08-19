---
kind: observation
role: orchestrator
task: cut-epic006-gaps-2026-08-20
at: 2026-08-20T23:00:00Z
id: e5f6a7b8
---

# I briefed a duplicate of a live P1 ticket, and BA/PM refused it before writing the page

## What I got wrong

My brief asserted that **neither gap is anybody's ticket** and instructed BA/PM to cut **two**. That
premise was false for one of them and half-false for the other, and **BA/PM checked
`plans/tickets/` before writing a page rather than taking my word for it.**

- **The checkmate gap is `ABC-044`**, cut 2026-08-13 at `EPIC-006`'s own decomposition — `S`, `P1`,
  in `Backlog`, *"the loop's exit test returns a `LoopOutcome` and nothing renders it"*. Its `A1`
  already asserts all eight terminal reasons as a set of size 8, its `A2` covers claimed-vs-automatic
  draws — the `ABC-021` widening I told BA/PM to invent — and its `A6` drives a scripted game to
  checkmate through the entry point. **A second page would have been a duplicate of a live P1 ticket
  sitting in the same column.**
- **`quit`'s EFFECT is `ABC-046`** (`P2`, blocked on an open Architect/Design ruling), and **the
  three questions I instructed BA/PM to rule — confirmation, differ-from-EOF, exit code — were
  already ruled on that page on 2026-08-13**: two-state confirmation, `A3` must not be
  `INPUT_ENDED_NOTICE`, exit 0 with no result recorded. I asked for a re-ruling of settled work.

## The cause, named rather than softened

**I had `plans/board.md` open in this session and never searched `plans/tickets/` for existing
coverage before enqueuing.** I built the brief out of what the UAT reported and out of my own memory
of the board, and my memory of a 250-row board is not an instrument. **The board even carries both
rows — `ABC-044` at line 188 and `ABC-046` at line 190, four rows apart.** Two greps would have cost
nothing.

This is the third scheduling error I have made in this session — the branch guard, the shared tree,
and now a duplicate brief. **The first two cost tidiness. This one would have cost a duplicated P1
ticket in the backlog**, which is the kind of debris that makes a backlog stop being trustworthy.

## What made the refusal possible, and it should be kept

The brief carried a fence — *"if you find a third thing, name it and leave it uncut"* — and an
instruction to state the ids explicitly. It did **not** carry an instruction to verify my premise.
BA/PM verified it anyway. **The lesson is not that the agent was clever; it is that a brief asserting
"nothing owns this" must carry the search that establishes it, or the agent must be told to run it.**
Recorded as owed against the standing brief, alongside worktree-per-agent from earlier today.

## What the residue actually was, and why one ticket was still right

`ABC-112` is not a consolation prize. **`helpMessages()` folds out of `COMMAND_TABLE`
(`src/command-input.ts:82,94`), so every token is advertised whether or not anything honours it** —
that is a PROMISE defect, distinct from `ABC-046`'s EFFECT defect, unblocked while `ABC-046` is
blocked, and owned by nobody. It survives the duplicate check on its own merits.

Its ⚠️ is real and BA/PM did not smooth it: **delivering `ABC-112` falsifies the four-token half of
`ABC-035` `A4`** — a `Done`, owner-accepted criterion — superseded in writing on the new page rather
than by quietly editing a closed ticket.
