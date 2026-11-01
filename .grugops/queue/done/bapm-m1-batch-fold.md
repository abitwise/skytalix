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

## Result

**2026-11-01, BA/PM. Milestone 1 DONE and MET** (EPIC-010's own rule: the close batch is not LOSS). Records only, at `main` `832ff246`, branch `grugops/bapm-m1-batch-fold`. Nothing run, built or timed; no `src/`, `tools/`, `data/`, ADR, `AGENTS.md`, board or `plans/traceability.md` edit (the Orchestrator writes the merge row). Not merged, nothing pushed.

- **Commits:** records `f0b57fc0`; notes `505d2f3d`; this Result and the move to `done/` in the next commit.
- **Notes (sealed, task `bapm-m1-batch-fold`):** decision `20261101T070357Z-ba-pm-decision-3de5629d`, observation `20261101T070357Z-ba-pm-observation-a7094119`.
- **Do 1:** the EPIC-010 top block records NOT LOSS (NEUTRAL), X −58.3, Y 77.9 (base `ca6e675c` 78.25 % ± 5.48, head `51902be5` 72.00 % ± 6.11). Grade: close MET; M1 MET for milestone 1's part (4 / 4 smoke pairs, 2 / 2 S2); M2 not read (epic close); M3 and M4 read at the close; M5 MET so far. The milestones table's close row is dated.
- **Do 2:** the reference is 72.00 % ± 6.11 (head `51902be5`, 200 R games) and the flag is 52.00 %. The pool restarted empty, and the waiting rows `ABC-228`, `ABC-241` and `ABC-229` close unpooled. The 3 000 ms reference is retired with dated lines in four places, and nothing was rewritten.
- **Do 3:** tickets-table rows 7 (`ABC-235`), 8 (`ABC-240`), 19–21 (`ABC-243`, `ABC-244`, `ABC-245`) and 22 (`ABC-247`) read Done, and row 23 (`ABC-248`) reads Ready. The other rows agree with the board. `ABC-247`'s page is closed, and `ABC-225`'s page has a dated USED line.
- **Do 4:** the QE-M1B2-b rule is in EPIC-010 § The batch: what: the harness and watcher launch detached, the harness's parent pid is recorded before game 1, and a SIGSTOP / SIGCONT test on a detached process is recorded first. **No ADR edit is needed.**
- **Do 5:** QE-M1B2-c is recorded on the milestone line, with the score effect `UNKNOWN - verify`. The owner was routed by the Orchestrator. No ticket.
- **Do 6:** QE-M1B2-d is on the milestone line. The reference now carries any real fall of tens of Elo. Information for the owner; nothing is asked.
- **Owed (LOW, outside this brief):** the `ABC-243`, `ABC-244`, `ABC-245` and `ABC-248` pages still carry stale `status` / `column`. The board's `ABC-246` row sits inside the template comment, and `## In Development` reads 0/3. Optional for the Architect: a dated line on `ADR-0053` d10's "wall time `UNKNOWN - verify`", which now reads 22.22 h.

### Trace row (10 cells, header order)

| EPIC-010 m1 close | Milestone 1 graded DONE / MET on its batch (NOT LOSS (NEUTRAL)); 4 000 ms trend reference folded | EPIC-010 | ADR-0053 d10; EPIC-008 merge rule; ABC-225, ABC-247 | none (records only) | plans/epics/EPIC-010 (top block, trend, ledger, rule, table rows 7, 8, 19–23); plans/tickets/ABC-247 (closed), ABC-225 (used line) — f0b57fc0 | qe-EPIC-010-m1-batch-2 …1a53a7f9: X −58.3 ± 77.9; head 72.00 % ± 6.11 | no UAT (records) | — | Milestone 1 DONE; reference 72.00 %, flag 52.00 %, pool empty; QE-M1B2-b rule in force for batch PREREGs |
