---
id: 20261030T223127Z-qe-e2e-observation-7e9bd36f
kind: observation
by: qe-e2e
at: 2026-10-30T22:31:27Z
verified_by: 
confidence: high: one real run, read against the sealed PREREG bars by QE's own scripts; Elo is INFO
refs:
  - ABC-225
  - EPIC-010
  - EPIC-008
  - tools/rating/rating.ts
  - tools/rating/pair.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-225
  - 933d9f35
  - 3dca0e67
  - 02fa9556
  - baf99a7c
  - b4d7d5d5
  - qe-ABC-225-w1/20261030T203618Z-qe-e2e-decision-6d1d5bff
  - se-ABC-225-main/20261030T202846Z-software-engineer-decision-0813b232
  - se-ABC-225-main/20261030T202846Z-software-engineer-observation-a9f5834c
  - se-ABC-225-main/20261030T202846Z-software-engineer-observation-2f0a5298
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
  - qe-ABC-225/20261030T003823Z-qe-e2e-observation-dd39468d
  - qe-ABC-225/20261030T003823Z-qe-e2e-observation-f5b1a86e
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - ADR-0049
  - NFR-008
supersedes: 
seal: sha256:2e92715a04d1041b0e738546c116bb0fdef3206a17778cdc06e31072875ddf07
---

# qe-ABC-225-w1 A5 and A6: the real 40-game smoke at `--concurrency 1` ran to the end ALONE. A5 MET on all 6 points; A6 MET: 1.846 h play wall, 21.67 games/h, 400-game pair at width 1 projected at 18.5 h. The `start=51` probe is MET

QE/E2E, task `qe-ABC-225-w1`, under the sealed PREREG `…6d1d5bff`, committed at `b4d7d5d5` before any game. Raw files are in
`raw/a5/` and `raw/start-probe/`, written by the harness with placeholders (no `r.out`, no clones). QE's reader output
is `raw/a5/qe-a5read.txt`.

## The run
- `node tools/rating/rating.ts rpair 02fa9556 baf99a7c <out> --rounds 10 --concurrency 1`, from `grugops/qe-ABC-225-w1`
  @ `b4d7d5d5` (`tools/` = `933d9f35`). `machine.txt`: cutechess-cli 1.5.1 `= pin`, Stockfish 19 `= pin`, openings sha
  `0d7f7a72…2666`, `concurrency: 1 (default 2)`. `cmd.txt` shows `-concurrency 1` on both block-runs.
- **Wait-clear** 20:36:45–20:37:25Z: no foreign vitest or cutechess pid to wait on; then 3 checks with Tctl 33.6–34.0 °C and
  load1 ≤ 0.47. Precheck 20:38:03Z: load1 0.18, Tctl 33.9 °C, 0 cutechess, 0 stockfish, 0 vitest.
- **Session** 20:38:03Z → 22:29:08Z, harness exit **rc 0**, **no thermal stop**, `summary.txt` written. Post: Tctl 39.2 °C,
  0 cutechess, 0 stockfish (no orphans). So the run is neither VOID nor STOPPED.
- **Width 1 held:** in each block's `r.out`, 20 `Started game` and 20 `Finished game`, and no game started before the one
  before it finished.
- **Foreign process:** a vitest run from another session on this host (`scripts/…` tests, not this repo's lane) showed up in
  **1 of 111** watcher samples (20:53:04Z) and in 1 per-block `host.log` line. It was gone by the next sample, about 60 s later. As the PREREG
  says, it was logged and was not a stop. Its effect on the wall is at most about a minute.
- **Power:** the host has no `power_supply` device (no battery), so it runs on mains by construction. The harness's `thermal=?`
  `power=?` fields are macOS-only and read `?` on Linux, as designed.

## Thermal
- `thermal.log`: 666 samples, k10temp Tctl numeric on every line. **Median 74.10 °C, max 78.8 °C**, min 58.1 °C (the first
  sample), p90 75.4 °C. Only 2 samples were above 77 °C. The watcher's running median never passed 74.2 °C, far below the
  85 °C line.
- Busy-core MHz median 5 034 (dips to about 2 340 in 3 samples, which are idle moments between moves). load1 median 1.08, max 1.75.
- Against width 2 in `qe-ABC-225`: there the host reached 83–84 °C within 50 s ALONE. Width 1 sat about 10 °C lower.

## A5 (host log): MET, point by point (PREREG bars)
1. **`nps.log`: exactly 2 lines.** `block 01 base stockfish_nps_median=1635048 moves_ge_400ms=862` and
   `block 01 candidate stockfish_nps_median=1753018 moves_ge_400ms=962`. QE re-ran the tool's `stockfishNps` on each block's
   `r.out` and got the same numbers. Raw counts: 912 and 1 009 Stockfish `bestmove` lines; 29 618 and 33 683 `info … nps`
   lines. **So real `-debug all` yields an nps value per block.**
2. **`thermal.log`:** 666 samples over a 6 645 s schedule span (need ≥ 664). The largest gap is 11 s (≤ 12). The smallest is
   2 s: the final `finally` sample at block end. **So k10temp Tctl reads, and ≥ 1 sample per 10 s holds.**
3. **Formula:** base 10-7-3 → printed `52.5 +/- 151.0`. QE's own copy of cutechess-cli 1.5.1's formula (`raw/scripts/elo.py`)
   gives `52.5 +/- 151.0`. Candidate 9-10-1 → printed `-17.4 +/- 158.6`, and QE also gets `-17.4 +/- 158.6`. The tool raised
   no formula cause, and each pooled build line equals its single block line. **So a real block's Elo line matches the pooled
   formula.**
4. **Coverage:** each build has 20 PGN games. Rounds 1–10 start from EPD lines 1–10 (placement and side to move), and
   skytalix plays once per colour each. No coverage cause.
5. **Host-path scan** of every file under `<out>` except `clone-*` (patterns kept in session): 0 case-sensitive hits for
   home, temp, scratch, system-binary or node-manager prefixes, or for the login, host name or e-mail. The only
   case-insensitive hits are the engine's `id author` line (20 in each `r.out`, 1 in each `artifacts.txt`), already ruled
   ACCEPTABLE in `qe-ABC-225` `…3a53bdfc` and not re-ruled. `sha256sum -c SHA256SUMS`: 24 files, all OK.
6. **`summary.txt`:** both builds, the pair line, the pair state and the pentanomial line are present, with no `halted:` line.
   Faults 0, unclassified 0, move-cap draws 0, stderr 0 bytes, and the Stockfish depth guard shows 0 misses in both blocks.

## The `start=S` point: MET by the direct probe (`raw/start-probe/`), not by A5
- `--rounds 10` plays only `start=1`, so A5 cannot show this point. The pre-registered probe was the pinned cutechess-cli,
  Stockfish against Stockfish, `order=sequential start=51 -repeat -games 2 -rounds 2`, run 20:37:36–20:37:38Z.
- Its 4 PGN `FEN` tags are EPD line 51 (round 1, both colour orders) and line 52 (round 2, both colour orders). None is
  line 1. **So cutechess-cli 1.5.1 honours `start=S` for S > 1.**

## A6 (cost at width 1): MET; both numbers come from the run's own times
- **Play wall:** `schedule.log` runs from 20:38:07Z (start, block 01 base) to 22:28:52Z (end, block 01 candidate) = 6 645 s =
  **110.8 min (1.846 h)**. Base took 52.6 min and candidate 58.1 min, with a 1 s gap between blocks. Build time
  (`host.log` before → first start) was 4 s, and the session total was 6 665 s.
- **Rate:** 40 games / 1.846 h = **21.67 games/h**, 2.77 min a game.
- **Projected 400-game pair at width 1:** play wall × 10 + build = **18.46 h**. The per-block range 52.6–58.1 min × 20
  block-runs gives 17.5–19.4 h, and the 18 extra inter-block gaps add about 18 s. That is **below the ticket's estimate of about 22–24 h**.
  The estimate was built on 3.3–3.6 min a game from the `qe-ABC-228-ii`/`qe-ABC-241` smokes. This run played 2.77 min a
  game, likely because of game length (36 of 40 games ended in mate, 4 by repetition). The figure is reported, not graded. No width-2 figure
  is projected (QE-225-b (iii)).

## Elo (INFO, graded by nothing; 40 games decide nothing)
- Base `02fa9556`: 52.5 ± 151.0 (E + X = 1 962.5). Candidate `baf99a7c`: −17.4 ± 158.6 (1 892.6).
- **Pair:** −69.9 ± 219.0, **NEUTRAL**. **Pentanomial (information):** −69.9 ± 214.0 (95 %, 10 openings, r = 0.184).
  QE's own script (`raw/scripts/penta.py`, population variance) gives the same −69.9 ± 214.0 and −69.9 ± 219.0.
- The speed gauge: Stockfish nps was 1.635 M in the base block and 1.753 M in the candidate block (+7 %). It is the same
  Stockfish on the same host, so that swing is the host's speed between consecutive blocks at about 74 °C (INFO). The cool
  base block matches r1/r2's 1.64 M.
