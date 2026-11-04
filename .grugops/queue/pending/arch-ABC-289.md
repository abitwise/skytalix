---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T19:57:33Z
subtask: arch-ABC-289
role: architect-design
ref: .grugops/context/arch-ABC-289/
branch: new grugops/arch-ABC-289 from main — worktree .claude/worktrees/arch-ABC-289
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes on scratch copies, each ≤ 30 min, ≤ 1 h in all; no games beyond what a PREREG names. Host paths only as placeholders.
---
# Design ABC-289 (Q2: delta pruning in quiescence): re-measure over Q1, then ADR-0074
Read plans/tickets/ABC-289*.md, ADR-0024's fourth Status block (the nine things Q2's ADR must show), ADR-0069 as the precedent, and src/quiescence.ts and src/see.ts on main (ABC-283 and Q1 are in force).
- PREREG sealed before any measured probe.
- Re-measure the premise on main with Q1 in it. If it is not met, say so plainly and recommend parking; the owner decides any override.
- Write ADR-0074 PROPOSED, amending ADR-0024 d4, showing all nine items.
- Respect the lane budget: rows ≥ 50 ms go deep; no new default-lane file.
- In your decision note, list the owed BA/PM lines and the owner question.
Fences: memory-bank/50-decisions, your records, scratch. No committed src or tools; no ticket, EPIC or board edits. Do not edit ADR-0056 (arch-bundle-1 holds it) and do not use ADR-0072 or ADR-0073. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-289, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
