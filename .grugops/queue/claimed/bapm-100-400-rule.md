---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:10:49Z
subtask: bapm-100-400-rule
role: ba-pm
ref: .grugops/context/bapm-100-400-rule/
branch: new grugops/bapm-100-400-rule from main (worktree .claude/worktrees/bapm-100-400-rule)
width: records only. Two SE hops run tests under the host lock; an Architect hop (arch-adr0056-100ms-fold) edits ADR-0056 beside you.
---
# BA/PM: write the owner's validation rule into EPIC-010/011, re-scope ABC-255, fix two stale lines
## Inputs
- Owner word (verbatim inside): .grugops/context/orch-2026-10-30a/notes/20261101T125800Z-orchestrator-decision-2896c6eb.md — no SPRT; 100 games at 100 ms per strength change (new vs base), 400 games at 100 ms per epic; any other validation run estimated > 1 h is asked of the owner first; tests on one core.
- qe-tc-depth-probe readout (merged 1d4e1649): .grugops/context/qe-tc-depth-probe/ — 259 games/h at 100 ms self-play (100 games ≈ 0.4 h, 400 ≈ 1.5 h); 100 games ≈ ±48 Elo, 400 ≈ ±24.
## Do
1. EPIC-010 and EPIC-011: add the merge/close rule (per strength change: 100 games at 100 ms new vs base; per epic: 400 games at 100 ms) and the >1 h ask rule. Strength-changing tickets in both epics: align acceptance to it where they named SPRT or other game counts (list each change).
2. ABC-255: re-scope from the SPRT lane to a fixed-count 100/400 mode on the rating harness. If the Architect's ADR-0056 ruling is not yet on main, word it as aligned to the owner rule and "pending ADR-0056 fold".
3. Fix EPIC-011 § Close-out's stale ABC-223 line (ABC-223 is Done, merged b45162fc; EPIC-009 closed) and EPIC-006's front matter status: backlog → closed (EPIC-006 is CLOSED).
## Fences
plans/epics/EPIC-010*, EPIC-011*, EPIC-006* (front matter only), plans/tickets/ for tickets you align, plans/traceability.md (append), your notes. Not plans/board.md, not memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task bapm-100-400-rule, contextRoot = worktree), commit, ## Result + trace row here, brief + claim to done/.
