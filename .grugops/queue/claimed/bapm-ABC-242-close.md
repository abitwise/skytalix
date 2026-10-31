---
subtask: bapm-ABC-242-close
role: ba-pm
ticket: ABC-242, ABC-225, EPIC-010
ref: .grugops/context/bapm-ABC-242-close/
branch: new grugops/bapm-ABC-242-close from main (worktree .claude/worktrees/bapm-ABC-242-close)
width: records only; no vitest, no timing.
---
# BA/PM (records): close ABC-242; fold ABC-225 merge; restate the EPIC-010 milestone-1 total
## Read
qe-ABC-242's and se-ABC-242's notes and done/ briefs on main; qe-ABC-225-w1's decision note (…d0807789) and se-ABC-225-main's notes;
bapm-ABC-222-epic009-m1's observation …e84baed7 (the ~18.5 h width-1 pair restatement); the owner notes …65848126 and …f4673b9f
(under .grugops/context/orch-2026-10-30a/).
## Do
1. **ABC-242** page: mark it Done, merged af5b2b49, QE PASS_WITH_GAPS signs UAT. Fold SE-242-a (the probe moved at the ABC-228 merge, e42b637b, per QE), SE-242-b, QE-242-b (LOW: a cap lowered to 8 or 50 survives the lane; cut a small test ticket if you judge it worth it, else record the disposition) and QE-242-c (INFO).
   - QE-242-a is with the Architect (`arch-qe242a-ruling`). Note it as pending; do not rule it.
2. **ABC-225** page: it still says in-development; it is merged and Done. Record the dispositions of QE-225w1-a/c/d/e.
3. **EPIC-010:** restate milestone 1's total (≈ 15 h, stale) to the width-1 figure, ~18.5 h (17.5–19.4 h) plus ~1 h of QE, citing the owner's "one at a time".
## Fences
Records only: plans/tickets/, plans/epics/. No board edits (the Orchestrator's), no ADRs, no src/, tools/ or data/. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-242-close`, contextRoot = worktree), commit, `## Result` + trace row(s) here, brief + claim to done/.
