---
task: wave-2026-09-25
subtask: secnfr-ABC-144-window-b
role: security-nfr
ticket: plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
ref: .grugops/context/secnfr-ABC-144-window-b/
enqueued_by: orchestrator
enqueued_at: 2026-10-11T00:00:00Z
branch: grugops/ABC-144-cap-test-workers (tip 5ddf150e; code d4468fd3; base 5ed308a8)
---

# Subtask: ABC-144 Window B. You are the ONLY hop running (width 1).

Run Window B exactly as pre-registered: the Architect's plan `…ff54a750` (`.grugops/context/design-ABC-144/notes/`), the harness `.grugops/context/design-ABC-144/probe/lane144.mjs`,
and the ADR-0040 addendum (k = 3), with BA/PM's page edits:
- warm runs (27), cooled runs with 90 s idle before each (27), and the `src/cli.test.ts` drift check (27);
- base = `5ed308a8`, head = the branch tip.

Log before AND after every run: load1, `com.apple.system.thermalpressurelevel` (never `CPU_Speed_Limit`), other vitest processes, and the power source.
Grade A1, A3, A4 and A5 against the page's bars, plus the `AR-N8SPAWN-DRIFT` discharge (`src/cli.test.ts` within 1.097 s of base), the CPU ÷ wall reading for A2, and the `*_DEEP` lane walls if the page asks.
**The owner's goal is "choking cpu and generating heat".** Report the thermal-pressure distribution, base vs head. If moderate (≥ 1) pressure persists at k = 3, say so plainly; the k = 2 option goes back to the owner.
Run in your own worktree. Commit raw TSVs and notes on the ticket branch. Never merge or push. Do not touch `src/`, `vitest.config.ts` or `plans/board.md`.
