---
subtask: bapm-ABC-220-merge-fold
role: ba-pm
ticket: ABC-220
ref: .grugops/context/bapm-ABC-220-merge-fold/
branch: new grugops/bapm-ABC-220-merge-fold from main (commit this brief's sha or later)
width: records only, no CPU
---
# BA/PM: ABC-220 merged (ec1e835b) — fold
## Read
ABC-220 ticket Test note 4 + FOLDED blocks; qe-ABC-220 verdict `…7a09c5e1` and gaps `…c6bdd364`; secnfr-ABC-220 Result in
.grugops/queue/done/secnfr-ABC-220.md; EPIC-009; ABC-221, ABC-222.
## Do
- Close ABC-220 (Done, merge ec1e835b; QE verdict signs UAT; gate PASS_WITH_RISKS).
- ADR-0044: dated fold lines in D3, D4 (new D4.5), D5, D11 per ADR-0052 § Consequences (Test note 4).
- SEC-220-a: ADR-0052's quoted NFR-004 sentence still says "≤ 3 s" — dated pointer to 4 s (ADR-0045 FOLDED).
- QE-220-a (LOW): fold into ABC-221 as a row (QE-A3a's 4 asymmetric-increment rows into src/uci-session.test.ts); SEC-220-b (comment) as an ABC-221 note.
- EPIC-009: milestone-1 state (ABC-220 Done; ABC-222 now pullable). Re-score ABC-222 DoR (wait met).
## Fences
Records only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
Run no builds, tests or node scripts (an SE is timing); if sealing needs node, draft + seal script and give me the command.
Waiting rule: never `while pgrep -f …` loops.
## Publish
Notes (task `bapm-ABC-220-merge-fold`), commit, `## Result` + trace row here, brief + claim to done/.
