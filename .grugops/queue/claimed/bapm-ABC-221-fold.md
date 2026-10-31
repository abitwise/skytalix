---
subtask: bapm-ABC-221-fold
role: ba-pm
ticket: ABC-221, ABC-223, EPIC-009
ref: .grugops/context/bapm-ABC-221-fold/
branch: new grugops/bapm-ABC-221-fold from main (worktree .claude/worktrees/bapm-ABC-221-fold)
width: records only; no vitest, no timing, no long-running scripts. Leave no process running.
---
# BA/PM (records): close ABC-221; owed folds; ABC-223 re-score
## Read
qe-ABC-221, se-ABC-221 and secnfr-ABC-221's notes and done/ briefs on main; the ABC-221 page (Test note 4); ABC-223's page; EPIC-009.
## Do
1. **ABC-221** page: mark it Done (merged af32f82c + 9395d8dc). QE PASS_WITH_GAPS signs UAT; Security/NFR PASS.
   - Fix A6's "(≥ 117 s)" to 17 205 ms, or state the +900 000 shape (SE-221-a, confirmed by QE).
   - Dispositions: QE-221-a (LOW: cut an XS test ticket with QE's two rows, or record why not), QE-221-b (INFO: the stale levels.ts comment; it can join that ticket or ABC-245's successor), SE-221-b..g, SEC-221-a/b.
2. **Test note 4 folds:** ADR-0045 § AMENDMENT A3's dated line (HARD_CEILING_MS 60 000), and ADR-0044's uci-clock-mode halves (D3's third value, D4.5's clock-mode line with D4.4's clamp at 60 000, D5's ≤ 60 s). These are the ADR folds the page assigns to BA/PM. Do not edit ADR-0052; it is the Architect's.
3. **ABC-223:** its wait (ABC-221 merged) is met. Re-score its DoR. The board move is the Orchestrator's.
4. **EPIC-009:** milestone 2 status line (ABC-221 Done; ABC-223 next).
5. G8: the Orchestrator ruled ABC-221's 9.84 s inadmissible (contended host; base also read +0.41 s). Record it as such, not as a trigger.
## Fences
Records only: plans/tickets/, plans/epics/, and the ADR-0045/ADR-0044 fold lines. No board, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-221-fold`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.
