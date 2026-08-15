---
id: 20260815T125900Z-orchestrator-decision-the-validator-does-not-rewrite-what-it-validated-5dd97e41
kind: decision
by: orchestrator
at: 2026-08-15T12:59:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - .grugops/context/uat-ABC-042-bapm/notes/
  - .grugops/context/uat-ABC-042-qe/notes/
  - .grugops/context/uat-ABC-042-pack/notes/
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/workflows/03-epic-to-tickets.md
supersedes: 
---

# Correcting my own routing: the validator does NOT rewrite what it validated

## The owner said "queue the BA/PM hop". My own sentence was wrong, and this is the fix.

I closed the previous hop with: *"one BA/PM hop to amend the pack and cut the follow-ups."* **That
collapsed two roles into one and contradicted the recommendation it claimed to be carrying.** BA/PM's
own note says the six pack amendments are **UAT Planner** work, one hop, no product change. It did
not offer to make them, and it should not.

**The reason is the only reason this hop produced anything trustworthy.** BA/PM was sent at the
planner's self-corrected scenario as an INDEPENDENT reader, and its clearance of that correction is
load-bearing. **A validator that rewrites the artifact it validated is no longer an independent
reader of it** — the next hop would have BA/PM grading its own prose, and the separation that caught
the `random` scenario would be gone. The kit puts steps 1 and 2 of Workflow 06 in different roles for
exactly this reason.

**So two subtasks, not one. The owner's instruction is honoured — the BA/PM hop IS queued — and the
half that was misrouted goes where BA/PM said it belongs.**

| subtask | role | work |
|---|---|---|
| `uat-ABC-042-amend` | UAT Planner | the six pack amendments — the pack's author repairs the pack |
| `uat-ABC-042-cut` | BA/PM | cut the follow-up tickets from BOTH note sets, deduped |

**Parallel, width 2, inside `queue.wip_limit` 3.** The file sets are disjoint: the Planner writes
only pack notes; BA/PM writes only `plans/tickets/`, and the board and trace rows for the tickets it
cuts — which is this project's recorded BA/PM practice (`ABC-057`–`ABC-060`, 2026-08-16). Neither
touches the other's folder.

## Why the two lists must be cut by ONE role in ONE hop

BA/PM recommends nine items; QE recommends ten. **They overlap and neither role could see the
other's list** — both ran in parallel, and nothing was relayed between them, by design. At least two
pairs are the same work under different names (the `AGENTS.md` `--` separator fix; the "repeated
option, last one wins" ruling). **Cutting from one list then the other produces duplicate tickets in
a repository that already carries a live ticket about duplicate rows** (`ABC-040`, 40 trace rows for
38 tickets). One role, both note sets, one deduped cut.

## What is NOT in this hop

- **No product change and no test written.** QE's ten repairs are cut as TICKETS here, not performed.
  Nine of the ten need zero new child spawns — that is a sizing input for BA/PM, not a licence to
  start implementing.
- **No signature, and no request for one.** The pack goes to the owner after the amendments land and
  I have read them, not before.
- **No promotion past a WIP limit.** New tickets land in `Backlog` (unlimited). `Ready` is 8 and
  BA/PM does not fill it on this hop.
- **`ABC-042` does not move and its page is not edited.** It is merged, `Done`, and both gates passed
  against it. The follow-ups are new tickets; they are not a re-opening.
