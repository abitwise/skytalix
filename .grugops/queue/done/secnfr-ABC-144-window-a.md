---
task: wave-2026-09-25
subtask: secnfr-ABC-144-window-a
role: security-nfr
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/secnfr-ABC-144-window-a/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: run ABC-144's quiet Window A. You are the ONLY hop running (width 1).

Run the window exactly as the Architect pre-registered it: note `…ff54a750` under `.grugops/context/design-ABC-144/notes/`, with the harness at
`.grugops/context/design-ABC-144/probe/lane144.mjs`. That is 6 arms (7 today plus a control, 4, 3, 2, 1 workers) × 9 rounds = 54 warm runs, with round 0 dropped. Log
load1 before and after every run, other vitest processes, `pmset -g therm`, and the power source. Never use load1 to hold back a run.

Run in a worktree at the wave tip. Change the worker count only per the plan's arm mechanism. Do NOT commit a config change; that belongs to the build.
Apply ADR-0040's pre-registered selection rule to the readings and report the arm it picks, or "none qualifies → owner". Do not grade
beyond the rule. Publish raw TSVs and notes per Workflow 16 into `ref:` on branch `grugops/secnfr-ABC-144-window-a`. Never merge or push.
Do not touch `src/`, `vitest.config.ts` or `plans/board.md`.
