---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T14:13:18Z
subtask: bapm-ABC-291-probe-lines
role: ba-pm
ref: .grugops/context/bapm-ABC-291-probe-lines/
branch: new grugops/bapm-ABC-291-probe-lines from main — worktree .claude/worktrees/bapm-ABC-291-probe-lines
width: records only; nothing run. No test, build or engine.
---
# ABC-291 after its probe
Read Architect decision …2926c26b, ADR-0075 § The probe's reading, and the Orchestrator's latest decision note.
1. ABC-291: the page lines …2926c26b lists; K2's list by pointer; d5's cut; memo stays 576 KiB and NFR-009's +65 536 reads 0; size M; rulings 1 and 2; DoR row 10 closed, status Ready. Build stays behind ABC-303, ABC-289 and ABC-305.
2. EPIC-011: its row and the "probe after A4" lines that remain, including § Phases E4.
No other ticket's bar moves. Fences: plans/tickets, plans/epics and your records only. No ADR, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-ABC-291-probe-lines, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

**2026-11-05, BA/PM. Both items done. Records only, on `grugops/bapm-ABC-291-probe-lines` from `main` `f22de7e8`. Text of record `829fa400`. No test, build, engine or probe run. Nothing pushed or merged, no ADR, board, `src/` or tool edit, nothing left running. No bar moved.**

- **1 (`ABC-291`):** DoR 10/10, row 10 closed on `…2926c26b`; status and column Ready; size M. The probe's reading is on the page as "the premise stands under rule 3", not "MET". d5's cut is in § Scope 3: 589 824 bytes, the memo stays 576 KiB, and `NFR-009`'s +65 536 reads 0. K2's list and K0 (c)'s counts are by pointer. Rulings 1 and 2 are at K4, F2, d11 (d) and K2. § `UNKNOWN - verify` is trimmed to what stays open. The build stays behind `ABC-303`, `ABC-289` and `ABC-305`.
- **2 (`EPIC-011`):** § Tickets row 43, § Phases E4, and the § Dependencies "reads queue" line. No "probe after A4" line stands unstruck for `ABC-291`.
- **Where the sources differ (`…bc1c9835`):** `ADR-0075`'s title, d3 and § Consequences still read 640 KiB and +65 536, undated, so the page says rule 3 and ruling 3 hold on those figures. The brief's "stays" is wider than the page was: the build waited on `ABC-305` alone, and only the read on `ABC-303` and `ABC-289`. The page now carries all three for the build, dated.
- **Open (`…bf92ae84`):** F2's K5 half is not ruled with the cut spent; it still stops to Architect/Design, and the page says so. Three ADR lines want a dated mark. The board row still reads In Design, and its move is the Orchestrator's. `column: Ready` is my judgement J1, beside the brief's status. `NFR-008`'s census line is unchanged. K2's 58 keeps the 2 byte rows that do not move with the cut, and the list has not been run against a build with the cut.
- **Path check:** `node tools/grugops/records-path-check.js --base main` exited 0 before the last commit.
