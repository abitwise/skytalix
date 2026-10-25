---
id: 20261025T025833Z-qe-e2e-observation-bfffcf4c
kind: observation
by: qe-e2e
at: 2026-10-25T02:58:33Z
verified_by: 
confidence: high (raw .out/.pgn read; tool figures re-derived; clean host for the baseline)
refs:
  - ABC-204
  - EPIC-008
  - NFR-004
  - NFR-008
  - ADR-0049
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - arch-design-ABC-204/20261023T205749Z-architect-design-decision-13faedbc
  - ticket-to-pr-ABC-204/20261023T211610Z-software-engineer-decision-f0a579a0
  - ticket-to-pr-ABC-204/20261023T211610Z-software-engineer-observation-74a2bc03
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - qe-ABC-212/20261024T123135Z-orchestrator-decision-55691ad1
  - grugops/qe-ABC-204
  - e546e124
  - 3497aad2
  - 0e88c5df
  - ABC-202
supersedes: 
seal: sha256:4c4d59b6cc78ec82c8f248f222adcf873b9fa91ef3b562651a2a798d0c8a06bc
---

# ABC-204 A4 baseline R: 2 061.3 ± 50.3 at UCI_Elo E = 1 910 (frozen), 200 games, 0 faults, on a clean host; A6 R 4.40 h ≤ 10 h

QE/E2E, task `qe-ABC-204`. One run under `…4c3f7639`. The page-defined E step (one move of E, then one re-run that is
the baseline) is part of that one run. S = `main` `3497aad2`. The build's `dist/` tree sha256 is `726e5225…` (22 files),
the same tree as A5's two clones. The `dist/uci.js` hash `877e9595…` is not evidence (QE-204-b).

## The first R, at E = 1 650 (the page-defined step; not the baseline)
- **Run.** `rating.ts r <S> <scratchpad>/qe204/a4/out --elo 1650`. It started 18:25:47Z, once AC returned (the
  driver waited 17:41–18:25Z on battery), and ended 22:30:00Z, rc 0.
- **Printed, raw:**
  - `Elo difference: 263.4 +/- 61.8, LOS: 100.0 %, DrawRatio: 4.0 %`;
  - `W/L/D: 160/32/8  score: 0.820  games: 200 of 200`;
  - `faults: 0  unclassified: 0  move-cap draws: 0`;
  - both `stderr` files 0 bytes;
  - `stockfish depth guard: 0 of 8382 moves below depth 3`;
  - `state: rating E + X ± Y = 1650 + 263.4 ± 61.8 = 1913.4 ± 61.8`.
- **QE's port of `elo.cpp`** gives the same figures: 263.42 ± 61.85.
- **The score 82.0 % is outside 25–75 %.** By the Design ruling's E′ rule, E′ = 1 650 + 263.4 = 1 913.4, rounded to
  **1 910** (inside 1 320–3 190). R was re-run once at 1 910, and that run is the baseline whatever it scores.
- **Results:** 90 White mates, 102 Black mates, 6 threefold repetitions, 2 fifty-move draws, 0 move-cap draws.
- **Host:** 1 459 samples, all AC. load1 2.21–10.77 (median 4.10). 6 samples were above 8, in a 40 s spike at
  20:40:27Z with no vitest. Thermal: 38 at 0, 714 at 1, 707 at 2. **0 foreign-vitest samples, so 0 overlap games.**
- **Checks:**
  - `[FEN]`: 100/100 rounds pair, colours swapped, and equal `openings.epd` (23 en-passant squares dropped,
    QE-204-c).
  - Q2 depth guard, re-derived by QE's own PGN parser: 0 misses in 8 382 Stockfish moves, minimum depth 8, floor 3.
  - 1 000 `setoption` lines, all to Stockfish: Hash 16, Ponder false, Threads 1, UCI_Elo 1650 and
    UCI_LimitStrength true, once per game. 0 to `skytalix`.
  - First `go` raw: `204 >skytalix(0): go movetime 3000` and `208 >stockfish(1): go movetime 500`.
- **Book moves:** 87 `skytalix` book replies (`.out`), equal to the 87 PGN moves with no comment.
- **go→bestmove gap** (reported, not graded):
  - `skytalix`: n 8 359, median 3 001 ms, p99 3 003 ms, **max 3 206 ms, 5 over 3 031 ms** (3 038, 3 059, 3 060,
    3 061 and 3 206 ms);
  - Stockfish: median 500 ms, max 536 ms, 1 over 531 ms.
  - On the 3 206 ms move, the engine's own `info … time 3000` arrived at +3 001 ms and `bestmove` at +3 206 ms. So
    the 205 ms falls after the search (process, GC or pipe), not in it. The 3 060 ms move coincides with the 20:40Z
    load spike; the rest sat at load1 about 4.
  - This is for Security/NFR's reading of `NFR-004` (QE-204-d). It is not graded here. A5 had 0 over 3 031 ms in
    5 664 moves.
- **Wall:** median game 118.5 s (118.6 s from the ms times), mean 144.8 s, 49–640 s, median 68.5 plies. The match
  span was 14 647 s, 4.07 h, for 200 games: **49.2 games/h at concurrency 2**.
- **gzip -9** of the `.out`: 55 279 756 B → 6 963 687 B (7.9×; about 276 KB a game).

## The baseline R, at E′ = 1 910 (A4's reading)
- **Run.** `rating.ts r <S> <scratchpad>/qe204/a4b/out --elo 1910`. It started 22:30:22Z (preconditions held at the first
  poll) and ended 02:54:29Z, rc 0.
- **Printed, raw:**
  - `Elo difference: 151.3 +/- 50.3, LOS: 100.0 %, DrawRatio: 9.0 %`;
  - `W/L/D: 132/50/18  score: 0.705  games: 200 of 200`;
  - `faults: 0  unclassified: 0  move-cap draws: 0`;
  - both `stderr` files 0 bytes;
  - `stockfish depth guard: 0 of 9115 moves below depth 4`;
  - `state: rating E + X ± Y = 1910 + 151.3 ± 50.3 = 2061.3 ± 50.3`.
- **The tool's score line, raw:** `Score of skytalix vs stockfish: 132 - 50 - 18  [0.705] 200`. **One result line,
  raw:** `Finished game 1 (skytalix vs stockfish): 1-0 {White mates}`.
- **QE's port of `elo.cpp`** gives 151.35 ± 50.31, equal to the tool.
- **A4 graded MET.**
  - 200 finished games, with 0 illegal moves, 0 disconnects, 0 stalls and 0 time forfeits (no fault text and no such
    line in the `.out`);
  - the score, 70.5 %, is inside 25–75 % (not needed: the re-run is the baseline whatever it scores);
  - Q2's guard: 0 of 9 115 Stockfish moves below depth 1 + int(level(1 910)) = 4, re-derived by QE (level 3.826,
    minimum depth seen 8).
- **Results:** 103 White mates, 79 Black mates, 15 threefold repetitions, 2 fifty-move draws, 1 insufficient
  material, 0 move-cap draws.
- **Host:** 1 577 samples, all AC. load1 2.63–7.62 (median 4.07), 0 above 8. Thermal: 6 at 0, 769 at 1, 802 at 2.
  **0 foreign-vitest samples, so 0 overlap games.** The statistic over the games with no overlap is the statistic.
- **Checks:**
  - `[FEN]`: 100/100 rounds pair, colours swapped, and equal `openings.epd`.
  - 1 000 `setoption` lines, all to Stockfish (`UCI_Elo value 1910` × 200 and the four other pins × 200). 0 to
    `skytalix`, so it plays its defaults, `OwnBook` true and `Skill Level` 5.
  - First `go` raw: `193 >skytalix(0): go movetime 3000` and `197 >stockfish(1): go movetime 500`.
- **Book moves:** 78 `skytalix` book replies, equal to the 78 PGN moves with no comment.
- **go→bestmove gap** (reported, not graded):
  - `skytalix`: n 9 084, median 3 001 ms, p99 3 003 ms, max 3 060 ms, **2 over 3 031 ms** (3 059 and 3 060 ms).
    On both, the engine's own `info … time 3000` arrived at the same +3 059 / 3 060 ms, so the extra time is outside
    the engine's search clock.
  - Stockfish: median 500 ms, max 507 ms, 0 over 531 ms.
- **Wall:** median game 131.0 s (131.4 s from the ms times), mean 157.6 s, 24–504 s, median 75.5 plies.
- **gzip -9** of the `.out`: 59 248 492 B → 7 497 346 B (7.9×).

## A6, the R half: MET
- **Baseline R:** the match took 15 840 s (**4.40 h**) for 200 games at concurrency 2, which is **45.5 games/h**. That
  is within 10 h. The first R took 4.07 h.
- The Design ruling's estimate was 170 s a game and 4.7 h. The measurement is 131 s a game and 4.40 h.

## The rating's anchor (QE-204-e, INFO)
- The same build read **1 913.4 ± 61.8 at E 1 650** and **2 061.3 ± 50.3 at E 1 910**. The difference is 148 ± 80
  (√(61.8² + 50.3²)), so its interval excludes 0.
- The `UCI_Elo` scale at this time control does not map one-to-one onto the logistic Elo the tool computes. An R is
  comparable only at the same E.
- `M1` already requires "E, the openings and the pins unchanged", so nothing moves. The record says
  "**2 061.3 ± 50.3 at E = 1 910**", never a bare 2 061.
