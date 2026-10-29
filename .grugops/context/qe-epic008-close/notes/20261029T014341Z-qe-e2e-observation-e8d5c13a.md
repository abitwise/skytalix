---
id: 20261029T014341Z-qe-e2e-observation-e8d5c13a
kind: observation
by: qe-e2e
at: 2026-10-29T01:43:41Z
verified_by: 
confidence: high: the tool line and the raw files read; QE elo.cpp port equal to the tool
refs:
  - EPIC-008
  - ABC-204
  - M1
  - M3
  - G1
  - G5
  - G6
  - G8
  - G9
  - 3497aad2
  - 38536a34
  - b5c67ab7
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - se-tools-rating-host/20261028T211542Z-software-engineer-decision-f55b4cdf
  - bapm-epic008-hostB/20261028T211452Z-ba-pm-decision-f0c8fedb
  - owner-word-2026-10-24/…4c3f7639
  - owner-word-2026-10-26b/…2ae5fc12
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - grugops/qe-epic008-close
  - ADR-0049
  - qe-epic008-close/20261028T212209Z-qe-e2e-observation-8fb860a9
supersedes: 
seal: sha256:540203f49a65055de1e6134dd0fb22e53acfbe3595c0c09abbf87fd875dcafd9
---

# Reading 1, R(baseline) at 3497aad2 on this host: 1 910 + 188.5 ± 54.8 = 2 098.5 ± 54.8, score 74.8 % (in band), 200/200, 0 faults; one run, final

Pre-registered in `20261028T212209Z-qe-e2e-observation-8fb860a9` (PREREG). Raw files, redacted (ADR-0049 d4): `.grugops/context/qe-epic008-close/raw/r1/` (`SHA256SUMS`; `r.out.gz`, `r.pgn`, `cmd.txt`, `machine.txt`, `artifacts.txt`, host and monitor logs, `qe-analysis.json`).

## The reading
- Command: `node tools/rating/rating.ts r 3497aad21fd089f29fe1791d42f81c47ac7ca522 <out> --elo 1910 --rounds 100`, from the worktree at `38536a34`. `cmd.txt` is the pinned shape (skytalix `st=3 timemargin=2000 restart=on`; Stockfish `st=0.5 timemargin=2000 restart=on`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`, `UCI_Elo 1910`; `openings.epd` sequential, `-repeat -games 2 -rounds 100`, `-concurrency 2`, `-maxmoves 200`).
- Pins, as the harness printed them: `cutechess-cli 1.5.1 … dc776901…f40a = pin`; `id name Stockfish 19 … c78c22a9…52d2 = pin`; openings `0d7f7a72…2666`. The clone's HEAD is `3497aad2`; its `dist/` (22 files) tree sha256 is `726e5225…1ce4`.
- **Tool line, raw:** `Elo difference: 188.5 +/- 54.8, LOS: 100.0 %, DrawRatio: 3.5 %`; `Score of skytalix vs stockfish: 146 - 47 - 7  [0.748] 200`.
- **Harness state, raw:** `rating E + X ± Y = 1910 + 188.5 ± 54.8 = 2098.5 ± 54.8`. **R(baseline) = 2 098.5 ± 54.8** (X1 = 188.5, Y1 = 54.8).
- **Score 74.75 % (W/L/D 146/47/7): inside 25–75 %**, by 0.25 points. E stays 1 910 (frozen; no E step).
- **No UNRESOLVED cause:** 200 started, 200 finished, 200 in the PGN; 0 faults, 0 unclassified result texts, 0 move-cap draws; both stderr files empty; the Stockfish depth guard has 0 of 8 991 moves below depth 4 (min depth 10). Result texts: White mates 98, Black mates 95, 3-fold repetition 7. Harness exit 0; no watchdog stop.
- QE's port of `elo.cpp` on 146/47/7 gives X 188.54, Y 54.82, equal to the tool's line.

## Host and overlap (all games = overlap-free = load-free here)
- 21:22:19Z → 01:42:44Z (match span 4.34 h); 1 556 samples at 10 s. Power `none` in every sample (no `power_supply` entry). load1 0.93–3.71 (median 2.07); 0 samples above 8. Foreign `node … vitest` in 0 samples; foreign `cutechess-cli` in 0 samples. **0 of 200 games overlap.** The overlap-free and load-free figures are therefore the all-games figure: 188.54 ± 54.82.
- CPU temperature (k10temp Tctl) median 83 °C, max 87 °C, under the 2-game load. Reported; nothing in the protocol reads it.

## QE-owned checks (reported)
- `[FEN]` pairs: 100 rounds, 0 bad, 0 incomplete; games 2k−1/2k swap colours. cutechess dropped the en-passant square in 23 rounds' FEN (as on the previous host: 23).
- Book moves: 87 `skytalix` moves from the book (`info string book`, = the PGN moves without a comment).
- `go`→`bestmove` gap: `skytalix` 8 955 searched moves, median 3 001 ms, max 3 005 ms, 0 over 3 031 ms; Stockfish median 500 ms, max 502 ms, 0 over 531 ms. First `go` lines, raw: `226 >skytalix(0): go movetime 3000`, `229 >stockfish(1): go movetime 500`. One result line, raw: `Finished game 2 (stockfish vs skytalix): 0-1 {Black mates}`.
- **This host's `A6` rate:** median game 128 s (mean 155 s), 46.1 games/h at concurrency 2, 4.34 h for 200 games (previous host: 131 s, 45.5 games/h, 4.40 h). Within ABC-204 `A6`'s 10 h.

## Against the previous host (context only; option B says it is not the comparison)
The same sha read 2 061.3 ± 50.3 (70.5 %) on the Apple M3. Here it reads 2 098.5 ± 54.8 (74.75 %). R is defined per host, so this is reported, not compared.

## Disclosure
The reading ran as pre-registered, unattended, in one detached chain. While reading 2 ran, QE ran this reading's analysis (python, about 2 s) and its packaging (gzip, about 2 s, `nice 19`), and sealed this note. Nothing else ran.
