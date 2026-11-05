---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-05T07:43:37Z
subtask: qe-ABC-282-a4
role: qe-e2e
ref: .grugops/context/qe-ABC-282/
branch: grugops/qe-ABC-282 (tip 9e5b39ad) — existing worktree .claude/worktrees/qe-ABC-282
width: A4 only, then the verdict. No src or test edits.
---
# Read A4 (owner-approved)
The owner approved A4 (…latest orch-2026-10-30a decision): about 3.5 h, one lock hold, ALONE. Read your hop's verdict …a6a2ba28, gaps …f75e3402, ABC-282's A4 lines and F5, ADR-0071 D11, and ABC-223's protocol.
1. Check main since your read: production src/ and tools/rating unchanged since 22931005 (ABC-304 was test-only; ABC-301's emission did not land). If either moved, stop and report.
2. Seal the PREREG before any game: 5 games, tc=40/900, ABC-223's scratch protocol, M1 (0 losses on time, closest call ≥ 500 ms), M2 (≥ 75 % of each completed period used, per side, book included), both sides reported, the miss rule, what counts as a harness error, and the one case where a re-launch is allowed.
3. Dry-run the whole command before launch, and read that dry run before sealing. Check free space in /tmp first and through the run; an empty output with exit 0 is not a reading.
4. Play once. If the run passes about 4.5 h, stop and report it.
5. Close QE-282-a. Then re-issue the verdict: with A4 MET, PASS_WITH_GAPS with no blocking gap signs UAT. With A4 missed, F5, to Architect/Design: state whether it was too little or too much. The game read is not re-played either way.
Fences: no ADR, ticket, EPIC, board, src, test or tool edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-282, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit; update ## Result and the trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0. Check every committed log for host paths before the commit, not after.
