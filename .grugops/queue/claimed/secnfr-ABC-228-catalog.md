---
subtask: secnfr-ABC-228-catalog
role: security-nfr
ticket: ABC-228
ref: .grugops/context/secnfr-ABC-228-catalog/
branch: new grugops/secnfr-ABC-228-catalog from main (worktree .claude/worktrees/secnfr-ABC-228-catalog)
width: records only, no CPU
---
# Security/NFR: catalog text after ABC-228 (ii) — level 5 = 4 000 ms
## Read
ABC-228 ticket § NFR triggers, § Follow-ups and "State at the merge"; ADR-0053 d10; ADR-0045 FOLDED block; qe-ABC-228-ii
verdict `…e39d190c` (G5 4 001 ms; G8 +0.70 s); plans/nfr-catalog.md.
## Do
Amend, dated, in plans/nfr-catalog.md: NFR-004 (default ≤ 4 s; 5 s ceiling at levels 1–5 unchanged), NFR-005, and
NFR-009's "1 s and a 3 s search" wording (now DEFAULT_BUDGET_MS = 4 000). Re-state AR-NFR004-A only if its reading
changes. Rule whether any of this is a NFR-bound change needing the owner (the owner accepted (ii) on 2026-10-30).
## Fences
plans/nfr-catalog.md and your notes only. No src/, tools/, data/. No board edits. Never push/force/amend/rebase/merge into main. No host paths.
## Publish
Sealed notes (task `secnfr-ABC-228-catalog`), commit on the branch, `## Result` + trace row here, brief + claim to done/.
