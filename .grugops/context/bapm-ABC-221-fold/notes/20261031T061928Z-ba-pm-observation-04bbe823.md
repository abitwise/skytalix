---
id: 20261031T061928Z-ba-pm-observation-04bbe823
kind: observation
by: ba-pm
at: 2026-10-31T06:19:28Z
verified_by: 
confidence: high: git and grep reads at main 9c008db4, nothing executed
refs:
  - bapm-ABC-221-fold
  - ABC-221
  - ABC-223
  - ABC-246
  - EPIC-009
  - ADR-0045
  - ADR-0044
  - ADR-0052
  - ADR-0046
  - NFR-004
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - AR-UCI-BUSY
  - ABC-244
  - ABC-245
  - SE-221-a
  - SE-221-b
  - SE-221-c
  - SE-221-d
  - SE-221-e
  - SE-221-f
  - SE-221-g
  - QE-221-a
  - QE-221-b
  - QE-221-c
  - SEC-221-a
  - SEC-221-b
  - qe-ABC-221/20261031T060935Z-qe-e2e-decision-861e737d
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-b348899a
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-f9b43b6d
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - secnfr-ABC-221/20261031T055207Z-security-nfr-decision-ef060512
  - secnfr-ABC-221/20261031T055207Z-security-nfr-observation-8881d726
  - af32f82c
  - 9395d8dc
  - c48a6f83
  - 9c008db4
  - 787820c3
supersedes: 
seal: sha256:6a3d5a42cb5de4e884f18e9a40d402b66f36d511adbdb5e932565b61e3eaea5c
---

# BA/PM observation, bapm-ABC-221-fold: the re-reads behind the fold, at `main` `9c008db4`

Read with git and grep only; nothing executed.

- `git merge-base --is-ancestor c48a6f83 af32f82c`: true. `af32f82c`'s parents are `6b0da921` and `f5dfe15f`. `git diff --stat c48a6f83 9c008db4 -- src data tools`: empty.
- `git merge-base --is-ancestor 787820c3 9c008db4`: true (Security/NFR's catalog commit is on `main`).
- `src/engine.ts:160`: `export const HARD_CEILING_MS = 60_000;`.
- `src/uci-session.ts`: `TIME_MODES` is `["level", "simple-tournament", "uci-clock-mode"]` (line 99); `CLOCK_MODE_CEILING_MS = 60_000` and `CLOCK_MODE_MAX_BUDGET_MS = CLOCK_MODE_CEILING_MS - 500` (lines 111, 113). `parseGo`: not `level` → budget T; `movetime` → `min(movetime, cap)`; else a clock → `min(cap, safeClockShare(...))`. So `movetime` is read first. The refusal text is `TimeMode takes ${spokenList(TIME_MODES)} …`, which the test file pins as `info string TimeMode takes level, simple-tournament or uci-clock-mode, got <v>; kept <old>`.
- `src/uci-session.ts` `info(...)` calls: `book`, the three option refusals, the level's "ignores go" notice, and `position refused`. None names the budget, so `ABC-223` A6 derives it.
- `src/levels.ts` lines 49–50 still say "`HARD_CEILING_MS` is the largest of them" (QE-221-b, stale).
- `src/engine.test.ts:1296`: "The ceiling, on a 1 ms step: about 5 000 consultations, so the clock never binds first." over `LONG_MS = HARD_CEILING_MS` and `MAX_NODES = 6_000` (SE-221-g, stale).
- `src/uci-session.test.ts`: `ABC-221`'s A5 rows send no increment; no row in the mode sends `movetime` with a clock (QE-221-a stands at `main`). The A6 block holds both shapes: 17 205 after move 80, and 117 735 after move 40 with `addAfter: { 40: PERIOD_MS }`.
- Board (read only): In Development holds `ABC-245` only (`src/levels.test.ts`). No in-flight ticket edits `src/uci-session.test.ts` or `src/engine.test.ts`. `ABC-246` was free (no page, branch or queue entry).
- The Orchestrator's `G8` ruling is in `plans/board.md`'s `_Updated` line and commit `9c008db4`'s message; no sealed Orchestrator note carries it.
