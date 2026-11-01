---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:17:00Z
subtask: bapm-abc250-close
role: ba-pm
ref: .grugops/context/bapm-abc250-close/
branch: new grugops/bapm-abc250-close from main (worktree .claude/worktrees/bapm-abc250-close)
width: records only, beside arch-abc250-close (memory-bank only) and se-ABC-262 (tests under the lock).
---
# BA/PM: close ABC-250 by routing, drop ABC-252, narrow ABC-251, record E1650
## Inputs
- Orchestrator decision .grugops/context/orch-2026-10-30a/notes/20261101T201645Z-orchestrator-decision-d2571be5.md (ABC-250 CLOSED NOT MERGED by routing, NOT a graded miss; ABC-251 → O1-c alone; ABC-252 dropped; branch kept).
- Owner word .grugops/context/orch-2026-10-30a/notes/20261101T201630Z-orchestrator-decision-1f5e3b27.md (smoke stays E1650; raise when pooled evidence shows too easy).
- qe-ABC-250 records on main: .grugops/context/qe-ABC-250/ (verdict …4fe9c469, gaps …f2befa65).
## Do
1. ABC-250 page: dated close block — "closed not merged by routing; A4 not graded (UNRESOLVED)"; never "missed". Front matter per the repo's dropped convention (cf. ABC-256). List what was green.
2. ABC-252 page: dropped (consequence), same convention.
3. ABC-251: re-scope to O1-c alone per its own page's miss branch; drop dependencies on packed generation; DoR honest (Architect design input may be owed — say so); keep the QE-259-c/QE-260-a review notes.
4. EPIC-010: rows for 250/251/252 and milestone 1b status; note O1-b part 1 closed. Remaining 1b: ABC-251 (narrowed), ABC-253, ABC-262 is EPIC-011 (no change). EPIC-010 and EPIC-011: the smoke's E1650 is owner-confirmed with the raise rule.
## Fences
plans/tickets/ABC-250*, ABC-251*, ABC-252*, plans/epics/EPIC-010*/EPIC-011* (rows/blocks only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-abc250-close, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.
