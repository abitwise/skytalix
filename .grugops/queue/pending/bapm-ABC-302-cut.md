---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T17:25:10Z
subtask: bapm-ABC-302-cut
role: ba-pm
ref: .grugops/context/bapm-ABC-302-cut/
branch: new grugops/bapm-ABC-302-cut from main — worktree .claude/worktrees/bapm-ABC-302-cut
width: records only; nothing run.
---
# Cut ABC-302: NFR-008 headroom, about −0.55 s (form S, test-only)
Source: Security/NFR decision secnfr-nfr008-1104 …1184fec4 (rows, ms each, the per-row proposed remnants, the must-stay list) and the Orchestrator ruling …112cd856. Precedent: ABC-281's page.
Cut ABC-302 (S, P1, test-only, no src production lines):
- Part 1: the seven named rows to their own files' existing deep lanes.
- Part 2: the two no-gate rows (cli.test ABC-241 A4; engine.capacity ABC-122 A8) to existing lanes in other files, placement by the Architect.
- Each moved row keeps a default-lane remnant where the decision proposes one, confirmed by the Architect with mutant reads.
- AC: QE re-grades NFR-008 with twin arms, target median ≤ 9.4 s (the probe says ~9.3 s), and every moved row passes in its lane with expected counts.
- No new test file and no new AGENTS.md lane line.
DoR: row 10 waits on the Architect's remnant confirmation (arch-ABC-302), so Backlog 9/10.
Also add lines to ABC-282 and ABC-301: a default-lane budget of ≤ +0.1 s each, rows ≥ 50 ms go deep, no new default-lane file, W1's identity slice goes deep; both build after ABC-302 merges. Add EPIC-011 (or the epic that owns NFR-008 work; check ABC-281's) rows and the ids line.
Fences: plans/tickets, plans/epics, your records. No board, ADR, catalog or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task bapm-ABC-302-cut, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
