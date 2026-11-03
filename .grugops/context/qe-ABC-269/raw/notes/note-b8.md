# qe-ABC-269 B8 on the candidate head `be87a2f1`: **MET on all three parts.** C2′ **57.0 / 100** (W/L/D 44/30/26; Elo **+49.0 ± 59.5**, LOS 94.8 %), 100 of 100, 0 faults, **0 time losses**. S′ **7.0 / 10** at E 1 810 (7/3/0), 0 faults, 0 time losses. Levels deep lane **57 / 57**, exit 0. Bars as sealed in `…21cd76df`; nothing re-played

QE/E2E, task `qe-ABC-269`, after B5 / B7 MET (the B5 / B7 note). Host ALONE; each run under `flock host-test.lock`, concurrency 1. Raw: `raw/out/b8/`, `raw/out/smoke/`, `raw/out/levels/` (the `-debug all` engine chatter is stripped from the copied `.out` files; the full logs stayed in scratch and were deleted).

## Tools and builds
- `cutechess-cli` 1.5.1 sha256 `dc776901…2154f40a` = the tool's pin; Stockfish 19 sha256 `c78c22a9…4593e352d2` = pin; openings sha256 `0d7f7a72…e82666`; `node` v26.12.1; harness at `be87a2f1`.
- Candidate `be87a2f1` `dist/` tree sha256 `975241dc…2e2fd4` (23 files); base `01a67c5d` (= `git merge-base be87a2f1 main`) `dist/` `e0599b3f…e9fbd1a` (22 files). Both built by the tool from clean clones (`npm ci && npm run build`).
- **One launch error, recorded:** the first `d` launch (11:41:50Z) stopped at argument parsing, before any build or game, with "CUTECHESS_CLI is not set" (`raw/out/b8/b8-launch-error.txt`). The environment variables were set to the pinned binaries and the same command was launched at 11:42:35Z. No game had been played; this is not a re-play.

## C2′, the 100-game read (11:42:35Z–12:06:25Z; uptime load1 0.76 → 2.26)
- `node tools/rating/rating.ts d be87a2f1 01a67c5d <out> --budget-ms 100 --rounds 50 --concurrency 1`; exit 0. Control `st=0.1 timemargin=50` both sides; openings 1–50 sequential, both colours, `-maxmoves 200`.
- cutechess-cli, verbatim: `Elo difference: 49.0 +/- 59.5, LOS: 94.8 %, DrawRatio: 26.0 %`; `W/L/D: 44/30/26  score: 0.570  games: 100 of 100`; `faults: 0  unclassified: 0  move-cap draws: 0`; both stderr 0 bytes.
- **57.0 / 100** (as White 27.5 / 50, as Black 29.5 / 50). Terminations for the candidate: wins 44 by mate; losses 30 by mate; draws 17 fifty-move, 5 threefold, 3 insufficient material, 1 stalemate.
- **Time losses: 0** (no "on time" / forfeit line in the PGN or log). Latency go → bestmove: candidate 7 101 moves, median 101 ms, max 104, 0 above 150 ms; base 7 091, median 101, max 104.
- Host log: foreign vitest 0 at every one of 125 samples; load1 median 1.48, max 2.34 (the two-engine match itself; the host had nothing else of QE's or the factory's).
- Harness `state: NEUTRAL` printed; it does not apply (the ticket and `QE-264-p2-b`).
- **Bar: 100 / 100 complete, 0 faults, 0 time losses, ≥ 50.0: MET.** Elo interval crosses 0: the point estimate is a gain, not a proven one.
- `G11` is cited, not re-read here (B7's `G6` runs played the same move as base on both boards every run).

## S′ smoke (12:06:49Z–12:12:11Z; load1 2.00 → 1.16)
- `node tools/rating/rating.ts r be87a2f1 <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`; exit 0. skytalix `st=0.5 timemargin=50`.
- **W/L/D 7/3/0, 7.0 / 10**, 10 of 10, faults 0, both stderr 0 bytes, Stockfish depth guard 0 of 329 below depth 4. cutechess-cli `Elo difference: 147.2 +/- 385.0`; tool line `1810 + 147.2 ± 385.0 = 1957.2 ± 385.0`.
- **Time losses 0.** Latency: candidate 331 moves, median 501 ms, max 503.
- **Bar: 10 / 10, 0 faults, 0 time losses, ≥ 3.0 of 10: MET.** No second ten owed. Pooled into the S′ pool only if merged (`EPIC-011` § Close-out).

## Levels deep lane (12:12:27Z–12:22:06Z; load1 0.99 → 1.34)
- `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, in the worktree at `be87a2f1` (src tree `4d6b117b`, `src/` clean), under the lock: **exit 0, 57 passed (57), 0 skipped**, 578.6 s.
- **Bar: exit 0 with every test passed: MET.** F6 does not fire.

## R-TC part 1, item 2 (read at review)
- `git diff 01a67c5d be87a2f1 -- src` without tests and the frozen fixture: no `process.env`, no deadline, `movetime`, clock (`now(`) or `*_DEEP` flag is added. The `budget.*` hits are `engine.ts`'s existing switch record (`budget.taper`, `budget.futility`, `budget.quiescenceEvasions`, `budget.visit`) carried to the new phase argument, not a time budget. **Clean.**
