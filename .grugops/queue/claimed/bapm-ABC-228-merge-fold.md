---
subtask: bapm-ABC-228-merge-fold
role: ba-pm
ticket: ABC-228
ref: .grugops/context/bapm-ABC-228-merge-fold/
branch: new grugops/bapm-ABC-228-merge-fold from main e42b637b (worktree .claude/worktrees/bapm-ABC-228-merge-fold)
width: records only, no CPU
---
# BA/PM: ABC-228 merged under (ii) — fold the records the ticket owes at merge
## Read
ABC-228 ticket § Follow-ups (the table) and Result lines; qe-ABC-228-ii verdict `…e39d190c` and smokes `…2123617d`;
se-ABC-228-ii findings `…0f553b17`; EPIC-010 § The merge rule and its smoke ledger.
## Do
- Fold your rows of § Follow-ups: ADR-0045 fold (level 5 = 4 000 ms, the D2 equality), EPIC-008 text, ABC-231 A1, the
  smoke ledger (D 5.0/10, R 7.0/10 at 4 000 ms: recorded, not pooled with 3 000 ms readings; pool closes at this merge).
- Close ABC-228's front-matter (Done, merge e42b637b).
- Cut ONE XS test-only ticket for SE-228ii-a (LOW: the setoption-Hash row reads a bare `go`, expects 4 000) + QE-228ii-b
  (INFO: stale "1 s and a 3 s" title in the TT A7 test). Backlog, P3.
- Note on ABC-225: its rpair budget 3 000 → 4 000 follow-up applies when it rebases (dated line).
- Leave NFR-004/005 catalog text (Security/NFR), AGENTS.md (Scribe) and the ladder re-take (Orchestrator) alone.
## Fences
Records only: plans/, memory-bank/ ADR text as named. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-228-merge-fold`), commit on the branch, `## Result` + trace row here, brief + claim to done/.
