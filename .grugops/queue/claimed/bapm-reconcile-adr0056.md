---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:37:57Z
subtask: bapm-reconcile-adr0056
role: ba-pm
ref: .grugops/context/bapm-reconcile-adr0056/
branch: new grugops/bapm-reconcile-adr0056 from main (worktree .claude/worktrees/bapm-reconcile-adr0056)
width: records only, beside qe-ABC-254 / qe-ABC-249 (tests under the lock).
---
# BA/PM: reconcile pages with ADR-0056's owner-answers fold (now on main, merged 5e5fdb1e's parent) and cut the two gaps
## Inputs
- ADR-0056 on main: C3″ (400 head-to-head, pass ≥ 200.0/400), smoke (10 games vs SF E1650 at 0.5 s, `r <cand> <out> --budget-ms 500 --rounds 5 --concurrency 1`), rule R-TC, difficulty-settings check (levels deep lane per strength ticket; + ladder short + UCI session deep per epic), gaps G-1, G-2; ABC-256 drop recommended; ABC-255 item 2 re-pointed to `r --budget-ms 500`. Architect notes: .grugops/context/arch-adr0056-owner-answers/ (…d3c756d1, …c8c38f1e).
- Your previous hop: .grugops/queue/done/bapm-owner-answers.md (open items).
## Orchestrator rulings
- "0.5s difficulty" = skytalix at st=0.5 per move on level 5 (a time setting, not a level). Smoke opponent E1650 per ADR; the owner has been told and may revert to 1910.
- C1 claim timing / C4 anchors: per the ADR fold (each anchor takes its own 100 ms reading vs SF). Drop references to "latest C3′ head figure".
- **ABC-256: close as superseded** (by C3″); front matter/status and a dated line.
- ABC-255: align to the ADR (d 100 ms; r/rpair 0.5 s smoke only) → DoR 10/10, Ready recommended.
- ±24 Elo with duplicated openings: record as RISK/open note for QE to verify at the first epic read; do not change the shape.
## Do
1. Replace "pending fold"/UNKNOWN lines in EPIC-010/011 and tickets with the ADR's figures (pass ≥ 200.0/400; smoke E1650, bar per ADR).
2. Add the levels deep lane (ENGINE_DEEP=1 src/levels.test.ts, ~9 min) to each strength ticket's reading rows (ABC-231..234, 236..239, 257, 258) and the per-epic close lanes (ladder short, UCI session deep) to EPIC-010/011 close lines, as the owner's "works on different difficulty settings" condition.
3. Cut G-1 as a new ticket (next free ABC id): one default-suite source-scan row that fails if src/ engine code reads the budget other than as the deadline, a test flag, or process.env (test-only, XS; acceptance with a planted violation turning it red). Tag EPIC-010 (milestone 1b) unless you argue EPIC-011 M0. DoR honest.
4. G-2: fix the levels deep lane's recorded trigger list wherever it lives in plans/ (add search.ts, evaluate.ts, quiescence.ts, transposition.ts, move ordering). If it lives outside plans/ (e.g. AGENTS.md or memory-bank), say so in Result instead.
## Fences
plans/epics/EPIC-010*, EPIC-011*, plans/tickets/ (named + new), plans/traceability.md (append), your notes. Not plans/board.md, memory-bank/, src/, tools/, data/, AGENTS.md. Run nothing. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task bapm-reconcile-adr0056, contextRoot = worktree, never the plugin cache, cite only commits that exist), commit, ## Result + trace row, brief + claim to done/.
