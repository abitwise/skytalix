---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T13:34:59Z
subtask: arch-ABC-282
role: architect-design
ref: .grugops/context/arch-ABC-282/
branch: new grugops/arch-ABC-282 from main — worktree .claude/worktrees/arch-ABC-282
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes small: each ≤ 30 min, ≤ 1 h in all; no games beyond what a PREREG names. Host paths only as placeholders.
---
# Design ABC-282 (W1: time use under a clock)
Read plans/tickets/ABC-282*.md (scope 1–5, A0–A6, F1–F7, and what the ADR must fix), ABC-078 (A3, which W1 amends), ADR-0056 (W1), EPIC-011 § Phases W1, the clock modes in src (uci go wtime/btime/movestogo, the levels), and the BA/PM notes bapm-W1-bundle-cut …a5a31e4c.
Write an ADR PROPOSED (the next free id). It must fix:
- the "will the next iteration finish" rule;
- the soft and hard limits per mode;
- the test for keeping a partial iteration's root move;
- which modes it covers, (a) clock modes only or (b) every mode, with a recommendation;
- the ABC-078 A3 amendment;
- A0's node counts;
- A1 (c)'s corpus and clock;
- the read's control and its intent class.
Check whether ABC-255's game harness (tools/) can play games under a real clock (wtime/btime/inc). If it can't, say so and name the tools ticket that must come first. Take that ticket's scope as an owed line for BA/PM; do not cut it.
Note: ABC-283 (being built now on grugops/ABC-283) also edits the deepening loop in src/engine.ts. Design against main and name the merge interaction.
A PREREG goes before any measured probe.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or tools; no ticket, EPIC or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-282, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed lines for BA/PM; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
