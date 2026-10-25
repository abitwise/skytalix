---
id: 20261025T121200Z-qe-e2e-observation-0c9bab9a
kind: observation
by: qe-e2e
at: 2026-10-25T12:12:00Z
verified_by: 
confidence: high (every command run by QE at 7d4cea3e; pre-registered; raw files read)
refs:
  - ABC-215
  - EPIC-008
  - NFR-005
  - NFR-004
  - NFR-008
  - ADR-0028
  - ADR-0048
  - ADR-0049
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-205/20261025T034500Z-orchestrator-decision-10e61802
  - ticket-to-pr-ABC-215/20261025T054000Z-orchestrator-decision-1976d0e9
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-decision-3c66f0d7
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-decision-cfb55b57
  - ticket-to-pr-ABC-215/20261025T053234Z-software-engineer-observation-c43e10a0
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - qe-ABC-204/20261025T030130Z-orchestrator-decision-f9d109ea
  - grugops/qe-ABC-215
  - 7d4cea3e
  - cac2b4e9
  - b778ab13
  - S3
  - A7
  - M2
  - ABC-204
  - qe-ABC-204/20261025T025833Z-qe-e2e-decision-b5f4d5a1
supersedes: 
seal: sha256:3aa7ccdd2b663b805d5f2f75e0cecb7a55001d2412dcaa4410267b344f9ce57a
---

# ABC-215 D (A7, ship rule S3): NEUTRAL, X = +15.6 ± 23.8 Elo for the candidate, 400 of 400 games, 0 faults. Not LOSS and X ≥ 0, so S3 is MET with no extension

QE/E2E, task `qe-ABC-215`. **One run under `…4c3f7639`** (scope reading `…1976d0e9`), pre-registered (`raw/PREREG.txt`) before
any game. Power logged per `…10e61802` (AC throughout).

## The reading
- `node tools/rating/rating.ts d 7d4cea3e cac2b4e9 <scratchpad>/qe215/d1/out --budget-ms 1500 --rounds 200`, from the QE
  worktree (harness = `main`'s, unchanged on this branch). ABC-204 pins: `st=1.5 timemargin=3500` both sides,
  `-concurrency 3`, `openings.epd` (sha256 `0d7f7a72…2666`) sequential `-repeat -games 2`, `-maxmoves 200` only.
  `cutechess-cli 1.5.1` and Stockfish 19 at their pins. Candidate `dist/` tree `efd67bd9…045a`, base `a5cf1de6…4121` (22
  files each; the manifests differ, `QE-204-b` fixed).
- Span 06:07:32Z–12:09:12Z (6.03 h), 66.4 games/h, median game 162 s.
- **Tool line: `Elo difference: 15.6 +/- 23.8, LOS: 90.1 %, DrawRatio: 51.0 %`.** `Score of skytalix vs base: 107 - 89 - 204
  [0.522] 400`. The harness printed `state: NEUTRAL`, faults 0, unclassified 0, move-cap draws 0, both stderr files empty.
- QE's port of `elo.cpp` (`analyse.py`) gives 15.65 ± 23.84 on the PGN, equal to the tool line.

## Grade (page § Ship rule S3, as pre-registered)
- X + Y = +39.4 ≥ 0: **not LOSS**. X − Y = −8.2: not GAIN, so **NEUTRAL**. X = +15.6 ≥ 0, so the one extension (owed only
  for NEUTRAL with X < 0) is **not run**. **A7 MET.** `G11` is reported in this task's G6 observation.

## Host and overlap accounting
- 2 156 samples (10 s): AC 100 %; load1 2.44–14.96, median 5.21; thermal 0 / 1 / 2 in 19 / 1 044 / 1 093 samples.
- **Foreign vitest: 0 samples, 0 bursts, 0 overlapping games.** The overlap-free statistic is the all-games one.
- **load1 > 8: 10 samples** (08:39:27–08:40:28Z and 08:51:23–08:51:43Z), touching 8 games (rounds 83–86, 91, 92). Without
  them: 392 games, W/L/D 104/87/201, **+15.1 ± 24.0**, still NEUTRAL with X ≥ 0. Grade unchanged.

## QE-owned checks (reported)
- 400 started, 400 finished; results: 3-fold 201, white mates 100, black mates 96, insufficient material 2, fifty moves 1.
- `[FEN]` pairs: 200 rounds, 0 bad, colours swapped in every pair (46 rounds' ep square dropped by `cutechess-cli`, as at
  `ABC-204`). Book moves 374 per side (no PGN comment), equal.
- go→bestmove gaps: median 1 501 ms both; over budget + 31 ms: candidate 5 of 21 606 (max 1 668), base 4 of 21 604 (max
  1 624). No time forfeit.
- Raw: `raw/d1/` (`d.out.gz` redacted, `d.pgn`, host and sampler logs, `qe-analysis.json`, `qe-load-free.txt`, `SHA256SUMS`).
