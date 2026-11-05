---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T13:43:00Z
subtask: bapm-ABC-307-lines
role: ba-pm
ref: .grugops/context/bapm-ABC-307-lines/
branch: new grugops/bapm-ABC-307-lines from main — worktree .claude/worktrees/bapm-ABC-307-lines
width: records only; nothing run. No test, build or engine.
---
# ABC-307 to DoR 10/10
Read Architect decision …727e0d0c and the Orchestrator's latest decision note.
1. Write the page lines …727e0d0c lists, once, in full.
2. C1's A7 line per ruling 1: MC1 lane-only, C1 (d) on M6, QE adds one order-independent MC1 read at base and tip, a miss is a STOP.
3. F1 to F4 on the page per ruling 2: F1 in the deep lane, qe-hop deep count 36. Add them to A4's counts and the bars they belong to.
4. A6 and the target line per ruling 3. Score DoR.
No other ticket's bar moves. Fences: plans/tickets, plans/epics and your records only. No ADR, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-ABC-307-lines, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-05, BA/PM. All four items done. Records only, on `grugops/bapm-ABC-307-lines` from `main` `91c21a9f`. Text of record `812c8b9a`. Nothing run, nothing pushed or merged, no ADR, board, `src/` or tool edit, nothing left running. No other ticket's bar moved.**

- **DoR 10/10, Ready** in the page's front matter and `EPIC-011` row 59. Row 10 closes on `…db111535` 1. The board's card is the Orchestrator's.
- **1 (page lines):** every line of `…727e0d0c` once: § Scope's measured table and titles, A2's exceptions, A3, A4's nine lines and counts, A5's sentinel, A7's table and holders, A8's 22 and two trigger files, § The Architect's confirmation, § Open 1 and 2, the risks, A10.
- **2 (C1):** MC1 lane-only, C1 (d) on M6, QE's one order-independent MC1 read at base and tip, a miss a STOP.
- **3 (`F1`–`F4`):** `F1` on A4, deep, in its own describe; `qe-hop` deep 36; `F2` and `F3` on A7, read under `ENGINE_DEEP=1`; `F4` on A5.
- **4 (A6, target):** the 11 ms reading, any K but B1 to the Orchestrator; −0.215 s a target; ≥ 9.6 s after all budgets takes the standing rule.
- **Corrected against the raw reads (`…b7b5333d`):** A4's counts are `vitest list`'s, not passed; P2b has five holders, not four (`ABC-220` A13); six memo plants read 0 in the tip's default lane, so A7 names them; A8's "plus A4's lines" would count nine twice.
- **Open, none blocks the build (`…99127e12`, page § Open 3–5):** `F1`'s A2 exception comes from the ruling, not the Architect. `F4`'s cost clause is read as having nothing to read, which is my reading, not a ruling. `F1` is on none of the 22 lines, so a later tool edit would not run it. The standing rule starts with a row move and the census names none. "A miss" on the new MC1 is read as A7's own rule.
- **Stale elsewhere:** `ADR-0046` still reads `qe-hop` 35 and row 10 open; the page's header ranks the rulings first. The title keeps "about 0.25 s".
- **Path check:** `node tools/grugops/records-path-check.js --base main` exited 0 before the last commit.
