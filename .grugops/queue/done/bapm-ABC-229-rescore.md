---
subtask: bapm-ABC-229-rescore
role: ba-pm
ticket: ABC-229
ref: .grugops/context/bapm-ABC-229-rescore/
branch: new grugops/bapm-ABC-229-rescore from main (worktree .claude/worktrees/bapm-ABC-229-rescore)
width: records only, no CPU
---
# BA/PM: ABC-229 re-score after ABC-228; ADR-0044 D4.2 stale default
## Do
1. ABC-229: its waits (ADR-0053 accepted; ABC-228 merged e42b637b with (ii), level 5 = 4 000 ms) are met. Re-score DoR,
   fold what (ii) changes in its rows (R smoke at 4 000 ms, the unpooled ledger, any 3 000 ms reference), and say if it
   is Ready. Note any shared-file ordering with ABC-241/ABC-220/ABC-243.
2. ADR-0044 D4.2 still says "a bare `go` at the default level is therefore 3 000 ms": add a dated fold line (4 000 ms
   since ABC-228, ADR-0053 d10, ADR-0045 FOLDED). Pointer only, no decision change.
## Fences
Records only (the ABC-229 page, ADR-0044, EPIC-010 table row if needed). No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-229-rescore`), commit on the branch, `## Result` + trace row here, brief + claim to done/.
