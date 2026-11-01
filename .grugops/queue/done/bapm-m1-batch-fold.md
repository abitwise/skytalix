---
subtask: bapm-m1-batch-fold
role: ba-pm
ref: .grugops/context/bapm-m1-batch-fold/
branch: new grugops/bapm-m1-batch-fold from main (worktree .claude/worktrees/bapm-m1-batch-fold)
width: records only (no vitest, no engine, no games). An SE hop (ABC-246) runs beside you.
---
# BA/PM: fold the EPIC-010 milestone-1 batch verdict (records only)
## Read
- .grugops/context/qe-EPIC-010-m1-batch-2/ notes: verdict …1a53a7f9, run …428e3797, findings …f9a3c308, PREREG …316833e1, VOID …3fb3b1fd; .grugops/queue/done/qe-EPIC-010-m1-batch-2.md § Result.
- plans/epics/EPIC-010-*.md (milestone 1, tickets table, trend reference), ABC-225 / ABC-247 pages, ADR-0053 d10.
## Do
1. EPIC-010 milestone 1: record NOT LOSS (NEUTRAL), X −58.3, Y 77.9 (base ca6e675c 78.25 % ± 5.48; head 51902be5 72.00 % ± 6.11). Grade the milestone as its own rule says.
2. New 4 000 ms trend reference: 72.00 % ± 6.11 points (head 51902be5, 200 R games), flag 52.00 %, pool restarts here. Retire the old reference where it is written (dated line, not a rewrite).
3. Fold stale EPIC-010 tickets-table rows 19–21 (ABC-243/244/245: all Done) and any other row whose state the board contradicts.
4. QE-M1B2-b (MEDIUM): add a rule for every later batch PREREG (the harness launches detached from the agent task runner when a SIGSTOP pause is in the PREREG). Place it where batch PREREGs read it (EPIC-010 page or ADR-0053 note via a line for the Architect — your call; if an ADR edit is needed, say so, do not edit ADRs).
5. QE-M1B2-c (MEDIUM, host shared with another repo's vitest): record it; the Orchestrator has routed it to the owner. No ticket unless you see a delivery need.
6. QE-M1B2-d (INFO): note it on the milestone line.
## Fences
- Records only: plans/epics, plans/tickets, plans/traceability.md (append). No src/, tools/, data/, ADRs, AGENTS.md, board. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-m1-batch-fold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
