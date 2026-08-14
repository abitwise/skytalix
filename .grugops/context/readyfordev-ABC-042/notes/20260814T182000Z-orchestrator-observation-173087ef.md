---
id: 20260814T182000Z-orchestrator-observation-173087ef
kind: observation
by: orchestrator
at: 2026-08-14T18:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-055
  - plans/board.md
  - AGENTS.md
supersedes: 
---

# Rule 1's exit was run this hop against a column that does not exist, and I did not fold the fix in

`AGENTS.md` § Process rules, rule 1 puts the criteria review at the **`Ready for Dev` exit** and
names the Orchestrator as its owner. `plans/board.md` defines that column in its table (`:73-87`,
WIP limit 6) and **renders no H2 heading for it** — along with `In Analysis` and `In Design`. That
is `ABC-055`, cut 2026-08-13 at DoR **10/10**, `S`, `P2`, and its row already says the sharp part
out loud: *"`Ready for Dev` is where `AGENTS.md` rule 1 puts the criteria review."*

## What I did about it

**Nothing to the board's structure. I did not add the three headings.**

The temptation was real: I own this file, the fix is three lines, and I needed the column this hop.
But those three headings **are** `ABC-055`'s entire deliverable. Adding them here would have closed
a cut, ready, unpulled ticket as a side effect of a different ticket's hop — and left `ABC-055`
un-citable, neither `Done` nor honestly `Backlog`. The last decomposition cut four tickets and
**folded none of them in**; that discipline is worth more than my convenience on one hop.

## What I did instead, and what it cost

The review **ran in full** — it is the whole substance of this hop, and it is recorded in this task's
notes rather than in a board cell. The column's absence blocked **recording a residence**, not
performing the exit. `ABC-042` therefore moves `Backlog` → `Ready` (BA/PM's exit, DoR met) and will
move `Ready` → `In Development` when dev is pulled, with the `Ready for Dev` waypoint traversed and
its exit review cited from the notes.

**The honest cost:** for the duration, this board shows no evidence that a `Ready for Dev` exit
happened at all. Anyone auditing WIP from the single source of WIP truth sees a ticket skip from
`Ready` to `In Development`. That is exactly the invisibility `ABC-055` describes.

## Evidence for `ABC-055`, now that it has some

`ABC-055` was cut from an **observation** — the Orchestrator noticing the gap while placing
`ABC-041`. It now has a **measured obstruction**: a `P0` ticket ran the rule-1 exit with no column
to sit in, and the exit produced **fourteen recorded gaps** across four role hops. The ticket's own
stated trigger for promotion is unrelated (*"promote to `P1` the moment anyone opens
`vitest.config.ts`"*), so this does not fire it.

**Priority is BA/PM's, not mine.** I am recording the evidence and routing it, not re-prioritising
another role's ticket from the chair. Recommendation to BA/PM at the next refinement: `ABC-055`'s
`P2` was set when the gap was theoretical; it is no longer theoretical, and the next `EPIC-006`
ticket (`ABC-043`) will hit the same wall.
