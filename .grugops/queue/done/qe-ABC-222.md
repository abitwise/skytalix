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

## Result

**2026-10-31, QE/E2E. PASS. Branch `grugops/qe-ABC-222` (worktree `.claude/worktrees/qe-ABC-222`, from `19d18df1`):
PREREG `9138d0a5` (sealed before any game), records `4cbd9ea6`. Records only: `src/`, `tools/` and `data/` are
untouched. Not merged, nothing pushed.**

- **Build:** the tip `19d18df1`, by the RE-SCORED rule. Over the 3 named files only `engine.ts` differs from
  `ec1e835b` (`ABC-229`'s switch), and the timing path is unchanged.
- **Run:** 5 games, `tc=40/900 timemargin=0 -maxmoves 80`, `option.TimeMode=simple-tournament`, `OwnBook` on,
  width 1. It ran 23:23:19Z → 02:49:27Z (3.44 h), rc 0, with no thermal stop. It is not VOID.
- **Results:**
  - g01: ½–½, 3-fold, 87 plies;
  - g02: 0–1, mate, 128 plies;
  - g03: 1–0, mate, 59 plies;
  - g04: ½–½, the cap, 160 plies;
  - g05: 0–1, mate, 140 plies.
- **A1 MET:** the pins hold (cutechess `dc776901…` = the `ABC-204` re-pin; openings = `OPENINGS_SHA256`), and the
  `setoption name TimeMode value simple-tournament` line is in game 1 for both engines.
- **A2 MET:** 5 of 5 games are kept, with 0 faults.
- **A3 MET:** 0 losses on time. The closest call is **19 991 ms**.
- **A4 MET:** 10 side-periods are complete, and the minimum use is **88.00 %**.
- **A5 MET:** the longest move is **22 002 ms** (< 22 500), +2 ms over 22 000.
- **A6:**
  - clock left after each period's 40th move: 19 991–107 990 ms;
  - `movestogo` on 574/574 `go` lines;
  - 0 `isready` during a search;
  - overhead median 0 ms, max +2 ms.
- **A7 MET:** ALONE; Tctl median **73.9 °C**, max **76.1 °C**; frequency fall ≤ 0.01 %.
- **Notes:** PREREG `…63f93685`, reading `…00cc4db1`, artifacts `…1311e4dc`, observations `…4daf292f`
  (QE-222-a…h, all INFO), verdict `…cc542c76`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-222 | Smoke reading: simple-tournament plays 5 games at 40/15 over UCI with 0 losses on time, closest call ≥ 500 ms and ≥ 75 % clock use | EPIC-009 | — | NFR-004 (22 s: longest move 22 002 ms < 22 500; AR-NFR004-A +2 ms); heat: width 1 Tctl median 73.9 °C / max 76.1 °C under the 85 °C line; ADR-0049 d4 (0 host-path hits) | main @ 19d18df1: dist/uci.js from src/uci-session.ts, src/engine.ts (unchanged by QE) | cutechess-cli 1.5.1 self-play, 5 games tc=40/900 timemargin=0 ALONE: A1–A5, A7 MET, A6 reported (0 losses on time, closest call 19 991 ms, min use 88.00 % over 10 side-periods); QE records grugops/qe-ABC-222 @ 4cbd9ea6 | QE PASS signs UAT (verdict …cc542c76) | — | QE PASS |
