---
subtask: bapm-ABC-241-merge-fold
role: ba-pm
ticket: ABC-241
ref: .grugops/context/bapm-ABC-241-merge-fold/
branch: new grugops/bapm-ABC-241-merge-fold from main a649fbc4 (worktree .claude/worktrees/bapm-ABC-241-merge-fold)
width: records only, no CPU
---
# BA/PM: ABC-241 merged (1f6abec4) — fold
## Read
qe-ABC-241 verdict `…2368b03f`, smokes `…5d70bb7c`, findings `…e6523bfb`; ABC-241 ticket; ABC-243; EPIC-010 ledger.
## Do
- Close ABC-241 front-matter (Done, merge 1f6abec4, verdict signs UAT).
- EPIC-010 smoke ledger: ABC-241 row (D 6.0/10, R 6.5/10 at 4 000 ms; recorded, not pooled); tickets table.
- QE-241-a (LOW): fold into ABC-243 as a new row (UCI `position fen` carrying an uncapturable ep square — QE-A4e into
  src/uci-session.test.ts). ABC-243's ordering wait (after ABC-241) is now met → re-score DoR.
- QE-241-c (INFO): correct ABC-241 A3's wording (in play the claim/game end moves by one ply, not four) — dated, old kept.
- ADR-0044 D11's 2026-10-19 fold still says level 5 "at 3 s": dated pointer line to 4 000 ms (no decision change).
## Fences
Records only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `bapm-ABC-241-merge-fold`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
