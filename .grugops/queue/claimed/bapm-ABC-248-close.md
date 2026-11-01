---
subtask: bapm-ABC-248-close
role: ba-pm
ref: .grugops/context/bapm-ABC-248-close/
branch: new grugops/bapm-ABC-248-close from main (worktree .claude/worktrees/bapm-ABC-248-close)
width: records only (no vitest, no engine, no games). qe-qehop-growth holds the host for timing.
---
# BA/PM: close ABC-248 and fold its QE gaps (records only)
## Read
- ABC-248's page; .grugops/queue/done/qe-ABC-248.md and se-ABC-248.md; notes under .grugops/context/qe-ABC-248/ (decision …cf9bdabf, findings …b519324e) and se-ABC-248/.
- ADR-0046 § BA/PM ruling 2026-10-31 (your own section) and § Addendum 2026-10-31.
## Do
1. Page close: front matter done/Done (it reads column Backlog today), `closed:` line, CLOSED block (QE PASS_WITH_GAPS …cf9bdabf; merged ef4cd095; G8 H 9.09 s / B 9.37 s; UAT waived).
2. QE-248-a (MEDIUM): fix ruling 6 / A10's `-t` form (regex-escaped brackets; the check is "4 passed", not exit 0) on the page and as a dated line in ADR-0046's BA/PM ruling section. If condition 4's Architect text also needs it, name it as owed to the Architect.
3. SE-248-b / QE-248-b (INFO): record whether a step move on a row whose kills depend on search depth needs an Architect reading of "interval" first; if you add a condition, add it as a dated ruling line.
4. QE-248-c (LOW, QPLY4 survives the whole lane; pre-existing): cut a ticket (XS/test-only if it is) or fold with a named carrier.
5. QE-248-d (INFO, QPARITY likely equivalent): record. QE-248-e/f/g: record or close.
6. EPIC-010 / ADR-0046 tranche 2: mark tranche 2 delivered (dated line) where the tranche is tracked.
## Fences
- plans/tickets, plans/epics, and ADR-0046's BA/PM ruling section only. No board, trace, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `bapm-ABC-248-close`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
