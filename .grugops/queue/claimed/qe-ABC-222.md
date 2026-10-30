---
subtask: qe-ABC-222
role: qe-e2e
ticket: ABC-222
ref: .grugops/context/qe-ABC-222/
branch: new grugops/qe-ABC-222 from main d1bd99aa (worktree .claude/worktrees/qe-ABC-222); the build under test is the sha the ticket pins (A1 / RE-SCORED block)
width: ALONE — strict (A7: no other agent hop; the Orchestrator schedules nothing beside you)
---
# QE ABC-222: smoke reading — simple-tournament, 5 games at 40/15 over UCI
## Read
plans/tickets/ABC-222-acceptance-reading-the-built-level-or-mode-plays-40-15-over-uci-with-0-losses-on-time.md (all FOLDED/RE-SCORED/CONFIRMED blocks; A1–A7), ADR-0052 (D3 22 s, whole-second reading CONFIRMED by the owner: A5 reads < 22 500 ms),
EPIC-009 M1–M4, AR-NFR004-A (this run is its next reading at 22 s), qe-ABC-220 notes (A11 overshoot ≤ 1.0 ms), how qe-ABC-225-w1 ran the harness.
## Do
- PREREG first, sealed and committed before any game.
- A1 pins, then the 5 games ALONE (concurrency 1). Wait-clear by polling `kill -0 <pid>` on any foreign vitest/cutechess (never
  `while pgrep -f`). Thermal stop: Tctl median > 85 °C → STOP (not read). If the run dies without a thermal stop, record it VOID and STOP.
- A2–A6 per the ticket: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock use per completed period, longest move < 22 500 ms
  (and its excess over 22 000 ms vs AR-NFR004-A).
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths.
Scratch `qe-222/`. Tool env file outside the repo, mode 600, pins verified.
## Publish
Sealed notes (task `qe-ABC-222`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
