---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-09T21:50:26Z
subtask: bapm-group-retest
role: ba-pm
ref: .grugops/context/bapm-group-retest/
branch: new grugops/bapm-group-retest from main
width: records only — one new ticket, its traceability row. No src/, ADR, board, test or run.
---
# Cut the group re-test ticket
Read my note …092956f8 (2026-11-09T21:37:44Z, the owner's words and the groups) and QE's strategy …720e934d (.grugops/context/qe-group-strategy/), both whole.
1. **Cut one ticket, the next id (ABC-310):** "Re-test the dropped work in groups: one branch per group, one graded read per group, then one closing read vs Stockfish".
   - Its body carries QE's strategy: a table per group A–H covering members, how the branch is formed (merge or re-port), the untimed gates, the graded read and its bar, the wall-time estimate, and the miss rule.
   - It also carries the order, the closing read and the totals (about 14.1 h, up to about 19 h, every figure an estimate).
   - Cite the strategy note rather than restating its reasoning.
2. **Confirm the group member lists** against the dropped pages (QE flagged this). Groups I and J are excluded, with the reasons.
3. **Status:** Backlog, held. "No test, build or game runs until the owner's word" (…092956f8). DoR is scored honestly. Row 10 fails until the owner answers QE's five questions, which go in a § Owner questions section, numbered, each with QE's default:
   - the 400-game reading;
   - whether E runs, with its four yeses;
   - G's cores, N and ADR-0062;
   - H's re-opens and the book source;
   - the total time approved once as a program.
   Also list what the Architect owes: D's one form, and the ADRs for 284, 285, 296, 297, 272/294 and E's structure.
4. **Per-group child tickets are cut later,** when a group is picked. Say so; do not cut them now.
5. Add a traceability row. No epic is open. Either cut a small new EPIC-012 page for the re-test programme, or mark the ticket epic-less; choose by the repo's convention and say which.
Publish sealed notes (contextRoot = your worktree's .grugops/context; `at` from `date -u` run immediately before each note). Commit after running `node tools/grugops/records-path-check.js --base main`. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
