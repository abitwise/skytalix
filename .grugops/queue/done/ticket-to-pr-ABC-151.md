---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-151
role: software-engineer
ticket: plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
ref: .grugops/context/ticket-to-pr-ABC-151/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-151-two-test-workers (create from grugops/wave-2026-09-25)
base: grugops/wave-2026-09-25
---

# Subtask: build ABC-151 (k = 2) per ADR-0040 addendum 2 (note `…5c4c4ef2`).

`vitest.config.ts` `test.maxWorkers: 2` + header paragraph; the ABC-144 A7 pin in `src/cli.test.ts` → `toBe(2)`, env
check ≤ 2, titles, comment citing addendum 2; show reds r1, r2, r3, r3b (`VITEST_MAX_THREADS=3`) and `maxWorkers: 3`,
and `VITEST_MAX_THREADS=2`/`=1` green. Nothing else in the config moves. Do NOT touch AGENTS.md (Scribe hop later).
No timing readings (other hops run; the window is Security/NFR's). Run all gates. Never merge.
Use a git worktree (symlink node_modules; remove it before removing the worktree). Use /usr/bin/diff.
