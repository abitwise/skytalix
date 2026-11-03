---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:22:09Z
subtask: bapm-gaps-1103
role: ba-pm
ref: .grugops/context/bapm-gaps-1103/
branch: grugops/bapm-gaps-1103 — worktree .claude/worktrees/bapm-gaps-1103 (from main)
width: records only. Placeholders in committed files; run `node tools/grugops/records-path-check.js --base main` before your final commit (must exit 0).
---
# Route the ABC-276 / ABC-277 QE gaps
From qe-ABC-276 (gaps …1cbc2325) and qe-ABC-277 (gaps …7d149fbd):
- Cut **ABC-278** (S, P2): the path check hardened — QE-277-a MEDIUM (.gitattributes can hide records: pass --text to the diff and/or treat any .gitattributes change as a finding), QE-277-c (foreign-argv misses), QE-277-d (home path followed by . - _), QE-277-e (quoted file-name cosmetic + unquote test), QE-277-b (.xz decompression) — each an acceptance row; must still exit 0 on main.
- QE-276-a (no offline row for main()'s seal call) and QE-276-b (placeholder-word / < 3-char names): record on the ABC-276 page as accepted LOW with a re-open note, or fold into ABC-278 if cheap — your call, state why.
- QE-277-f (run the check with the real HOME): note in the runbook text owed to ABC-278 (you don't edit memory-bank).
- ABC-276 and ABC-277 pages → Done (merged 3dd27cfc / 541ddf45; QE …a79db6c1 / …98c1d275).
Fences: plans/tickets, plans/epics/EPIC-011*, plans/traceability.md + your records. Not board.md, ADRs, src, tools, memory-bank. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-gaps-1103, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/. Return proposed board lines.
