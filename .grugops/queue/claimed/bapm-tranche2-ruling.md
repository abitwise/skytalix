---
subtask: bapm-tranche2-ruling
role: ba-pm
ticket: ADR-0046 tranche 2; ABC-246; ABC-229; EPIC-010
ref: .grugops/context/bapm-tranche2-ruling/
branch: new grugops/bapm-tranche2-ruling from main (worktree .claude/worktrees/bapm-tranche2-ruling)
width: records only; no vitest, no engine, no timing (QE holds the host ALONE). Leave no process running.
---
# BA/PM (records): rule on tranche 2 and W1; cut the tranche-2 ticket; owed folds
## Read
ADR-0046 § Addendum 2026-10-31 (arch-g8-tranche2: candidates, recommendation, W1) and its notes (…28d7bc3b, …f1e25b52); qe-ABC-245's G8 note; ABC-246's page; ABC-229's page and qe-ABC-229's notes; EPIC-010's tickets table; ADR-0035 B3 (T-QEHOP-GROWTH).
## Do
1. **Rule on the Architect's PROPOSED tranche-2 design** (T2c + T2a narrow + T2d, one S test-only ticket, no coverage lost by construction). Accept, amend or reject, with reasons, in a dated line. If accepted, cut the ticket (next free id, S, P1, EPIC-010), ordered after ABC-246 (same file).
2. **Rule on W1** (a reading over 9.7 s is confirmed by a second window of 3 head runs; the median of all 6 decides). It moves no level. Dated line.
3. **ABC-246's page:** update the line that expects its own G8 to fire the 9.6 s trigger (that trigger is spent).
4. **ABC-229:** close the page (merged 5953c631, QE PASS_WITH_GAPS) and update EPIC-010's tickets row 5.
5. **T-QEHOP-GROWTH** (fired: notes on main > 4 000): record a disposition, a ticket or a QE re-read hop, per ADR-0035 B3, or say why none is owed.
## Fences
Records only: plans/tickets/, plans/epics/, and dated ruling lines in ADR-0046 if your ruling must sit there. No board, src/, tools/ or data/ edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-tranche2-ruling`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.
