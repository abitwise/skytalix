---
id: 20261026T122350Z-qe-e2e-observation-ce697bc8
kind: observation
by: qe-e2e
at: 2026-10-26T12:23:50Z
verified_by: 
confidence: high: cutechess-cli's own line, reproduced by QE's elo.cpp port; 400 of 400 games, 0 faults; grade unchanged overlap-free and load-free
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0034
  - ADR-0031
  - ADR-0049
  - NFR-004
  - NFR-005
  - NFR-008
  - G1
  - G2
  - G4
  - G5
  - G6
  - G8
  - G9
  - G10
  - G11
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - S1
  - QE-208-a
  - QE-208-b
  - QE-208-c
  - QE-208-e
  - QE-208-g
  - QE-208-h
  - QE-208-i
  - QE-207-g
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-decision-8c4f3e57
  - se-fix-ABC-208/20261026T041121Z-software-engineer-decision-2beeb930
  - owner-word-2026-10-26/20261026T055855Z-orchestrator-decision-58bcd17c
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - bapm-epic008-g6-rule/20261025T122057Z-ba-pm-decision-8e51ba1e
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - grugops/qe-ABC-208
  - grugops/ABC-208
  - 2e9eb9a7
  - ba74b71d
  - 3a87f9d7
supersedes: 
seal: sha256:fe3dd868b0ff1aaa06009edd8a827de8c0bd64d5940db74db697fbeffe0b8953
---

# ABC-208 D (A5, ship rule S1): d1 GAIN, +38.4 ± 23.3 (116/72/212, 400 of 400, 0 faults). S1 is MET without the extension. The grade holds without the 18 games a foreign vitest met (+40.2 ± 23.9) and without the 78 games that touched load1 > 8 (+30.3 ± 25.7)

QE/E2E, task `qe-ABC-208`. **One run under `…4c3f7639`**, pre-registered (`raw/PREREG.txt`) before any game. Power logged per
`…10e61802`: AC throughout.

## The reading
- Command: `node tools/rating/rating.ts d 3a87f9d7 ba74b71d <scratchpad>/qe208/d1/out --budget-ms 1500 --rounds 200`, from the
  QE worktree via `raw/qe-scripts/driver.sh` (harness = `main`'s, unchanged on this branch). ABC-204 pins: `st=1.5
  timemargin=3500` both sides, `-concurrency 3`, `openings.epd` (sha256 `0d7f7a72…2666`) sequential `-repeat -games 2`,
  `-maxmoves 200` only. `cutechess-cli 1.5.1` and Stockfish 19 at their pins (`= pin` in `machine.txt`).
- Artifacts: candidate `dist/` tree `a4cba481…e2a2` (22 files) at `3a87f9d7`; base `efd67bd9…045a` (22 files) at `ba74b71d`. Base's
  tree equals `qe-ABC-207`'s base tree (same `src`). The two sides differ.
- **d1** 06:28:37Z–12:20:50Z (5.87 h), 68.2 games/h, median game 157.0 s, median 106.5 plies. **Tool line: `Elo difference:
  38.4 +/- 23.3, LOS: 99.9 %, DrawRatio: 53.0 %`**; `Score of skytalix vs base: 116 - 72 - 212 [0.555] 400`. Harness: `state:
  GAIN`, faults 0, unclassified 0, move-cap draws 0, both stderr files empty.
- QE's port of `elo.cpp` (`analyse.py`) gives +38.37 ± 23.32 on the PGN, equal to the tool line.
- A first start attempt at 06:28:25Z exited rc 126 before anything ran (the driver script lacked its execute bit: no poll, no
  harness, no build, no game). Disclosed in the PREREG addendum; it is not a run.

## Grade (EPIC-008 ship rule S1, as pre-registered)
- d1: **X − Y = +15.1 > 0: GAIN.** S1: GAIN is MET. **A5 MET.** No extension is owed or run.
- `main` moved records-only after the merge (`ba74b71d..12270c02`: `git diff -- src data tools package*.json` empty), so the
  reading is not stale (EPIC-008 § "When a D reading goes stale").

## Host and overlap accounting (`raw/d1/overlap.txt`)
- 2 097 samples (10 s); load1 2.44–86.61, median 5.44; thermal 0 / 1 / 2 in 12 / 1 021 / 1 064 samples; AC, battery 100 %.
- Preconditions met at the start (06:28:37Z: load1 2.44, 0 vitest).
- **Foreign vitest:** 64 samples in 4 bursts, 12:03:46Z–12:15:18Z. Class: one test run of another repository on this host (class
  and count only, ADR-0049 d4). It meets **18 games (rounds 191–199)**. Without them (382 games): 112/68/202, **+40.20 ± 23.90,
  GAIN**.
- **load1 > 8:** 171 samples, touching 78 games. Without them (322 games): 88/60/174, **+30.29 ± 25.72, GAIN** (X − Y = +4.6).
  The load1 > 20 samples sit at 09:29:27Z–09:29:47Z (max 25.9) and inside the foreign burst (max 86.6).
- **The grade does not depend on the overlap.** All games are graded, as the page states.

## QE-owned checks (reported)
- 400 started, 400 finished; White mates 103, Black mates 85, 3-fold 208, insufficient material 4. No fault text in any result
  or `.out` line.
- `[FEN]` pairs: 200 rounds, 0 bad, colours swapped in every pair (46 rounds' ep square dropped by `cutechess-cli`, as at
  `ABC-204` and `qe-ABC-207`). Book moves per side (no PGN comment): candidate 371, base 373.
- go→bestmove gaps: median 1 501 ms on both sides. Over budget + 31 ms: candidate 40 of 21 012 (max 3 717 ms), base 44 of
  20 982 (max 3 327 ms). 65 of the 84 lie within 60 s of a load1 > 8 sample, and the two sides are near equal. Every gap is
  under the 5 000 ms limit, so there is no time forfeit.
- Raw: `raw/d1/` (`d.out.gz` redacted, `d.pgn`, host, sampler and game logs, `qe-analysis.json`, `qe-load-free.txt`,
  `overlap.txt`, `SHA256SUMS`).
