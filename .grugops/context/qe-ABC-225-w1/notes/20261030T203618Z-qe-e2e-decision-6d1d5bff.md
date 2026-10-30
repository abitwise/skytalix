---
id: 20261030T203618Z-qe-e2e-decision-6d1d5bff
kind: decision
by: qe-e2e
at: 2026-10-30T20:36:18Z
verified_by: 
confidence: high (written and sealed before any game; A1-A4 and gates already re-run by QE)
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
  - se-ABC-225-main/20261030T202846Z-software-engineer-decision-0813b232
  - se-ABC-225-main/20261030T202846Z-software-engineer-observation-a9f5834c
  - se-ABC-225-main/20261030T202846Z-software-engineer-observation-2f0a5298
  - qe-ABC-225/20261030T002019Z-qe-e2e-decision-1c31ccc4
  - qe-ABC-225/20261030T003823Z-qe-e2e-decision-3a53bdfc
  - orch-2026-10-30a/20261030T180500Z-orchestrator-decision-65848126
  - bapm-ABC-242-225-owner/20261030T202446Z-ba-pm-decision-e2a5929b
  - ADR-0049
  - NFR-008
supersedes: 
seal: sha256:1a36861c5acc43f675bb778e91ec0c6d9b4f62b1d9980f7364c3c5f2004af5e2
---

# qe-ABC-225-w1 pre-registration: one real `rpair --rounds 10 --concurrency 1` (40 games, ALONE, width 1) reads A5 and A6; one 4-game `start=51` probe reads the `start=S` point; the Elo figure is INFO

QE/E2E, task `qe-ABC-225-w1`. Written and sealed **before any game**. Supersedes nothing; `qe-ABC-225`'s PREREG
(`…1c31ccc4`) was for width 2 and is closed by its own FAIL (`…3a53bdfc`).

## What is under test
- **Harness:** `grugops/ABC-225` @ `933d9f35` (code `3dca0e67`, `main` `14c8aafa` merged in; `rpair` plays skytalix
  `st=4 timemargin=1000`). Run from `grugops/qe-ABC-225-w1`, which adds QE records only. `git diff 933d9f35 HEAD -- tools src data`
  stays empty.
- **Base** = `02fa9556`, **candidate** = `baf99a7c`: the same pair as `qe-ABC-225`'s PREREG (`main` before and after
  `ABC-235`, value-identical moves). The ticket names no shas for A5; QE keeps the earlier pair for continuity.
  **40 games decide nothing about Elo**: the figure is INFO, graded by nothing.
- **Tools:** `CUTECHESS_CLI` and `STOCKFISH` from an env file outside the repo (mode 600). Both binaries' sha256 were
  verified against the harness pins (`dc776901…f40a`, `c78c22a9…52d2`) before this note.

## Already run (before this note, no game)
- `node --test tools/rating/pair-check.ts`: 22 tests, 22 pass, 0 fail, 0 skipped.
- `npm run lint`, `npm run typecheck`, `npm run build`: exit 0. `npm test`: 63 files, 2 322 / 2 322, 0 skipped;
  `test-skip-integrity.js … --skip-count 0` prints `No findings.` `git diff 14c8aafa 933d9f35 -- src data` is empty.
- **A1/A2** (QE's own script, `raw/scripts/a1a2.py`): `rpair 02fa9556 baf99a7c <out> [--rounds 10] --concurrency 1 --dry-run`
  against `r <sha> <out>/<build> --elo 1910 --concurrency 1 --dry-run`. All 20 + 2 block argvs differ from `r`'s in
  exactly 4 positions after `start=S` is dropped (2 `stderr=` paths, `-pgnout` path, `-rounds 100 → 10`). Order ABBA;
  starts 1, 11, …, 91 per build; `-repeat -games 2`. The out dir is absent after the dry runs.
- **The SE's LOW** (budget probe, `raw/scripts/budget-probe.mjs`): `cutechessArgs({mode:"r", budget})` gives
  `st=4 timemargin=1000` for budget 1 000, 3 000, 4 000 and 9 999. So on the `r` path the passed `budget` is unread.

## The `start=S` probe (before A5; not A5)
`--rounds 10` gives one block per build at `start=1`, which is cutechess's default, so A5 cannot show `start=S` for
S > 1. QE therefore runs **one direct probe of the pinned cutechess-cli**: Stockfish against Stockfish (Threads 1,
Hash 16, `st=0.05`), `-openings file=<repo>/tools/rating/openings.epd format=epd order=sequential start=51 -repeat
-games 2 -rounds 2 -maxmoves 4 -concurrency 1`. That is 4 short games, a few seconds of play.
- **MET** if the 4 PGN `FEN` tags (placement and side to move) are EPD lines 51, 51, 52, 52, with each line played
  once per colour order (`Round` 1 and 2), and not line 1.

## A5: the command
`node tools/rating/rating.ts rpair 02fa9556 baf99a7c <out> --rounds 10 --concurrency 1`. A `--dry-run` of the same
arguments was printed first (above). `<out>` is in session scratch, outside the checkout. One block per build: base on
openings 1–10, then candidate on openings 1–10, both colours: 20 + 20 games, one game at a time.

## Before game 1 (ALONE)
- **Wait-clear:** QE snapshots the pids of any foreign `vitest` (`pgrep -f "[/]vitest"`) and any `cutechess-cli`, then
  polls `kill -0 <pid>` on each until all are gone (never `while pgrep -f`). Then Tctl < 55 °C and load1 < 1.5 on 3
  checks 20 s apart. The precheck line (load1, Tctl, counts) is logged.
- Nothing else from this factory plays during the games (the records-only Architect beside QE starts no engine).

## Thermal stop and the VOID rule
- A watcher reads `thermal.log` every 60 s. Once it has ≥ 30 samples, a Tctl median (over all samples so far) above
  **85 °C** stops the run (SIGTERM to the harness and `cutechess-cli`). QE then reports **THERMAL STOP**; A5 and A6 are
  not read.
- **VOID:** if the harness exits non-zero, or dies, without a thermal stop and without a written `summary.txt`, the
  run is VOID. QE records it and **STOPS**: no re-run in this hop.
- **A game fault** (illegal move, disconnect, stall, time loss) makes the tool halt UNRESOLVED and write its summary.
  That is A4 seen on real data, not a defect. A5's points are read from what was played; if a block is missing,
  A5 is NOT MET. No re-run in this hop.
- **A foreign process joining mid-run** (another project's vitest) is logged from `host.log` and the watcher, and is
  not a stop. The thermal line is the only heat guard. It is named in the A6 report, since it can slow the wall.

## A5: what is MET (all of the following)
1. `nps.log` has **exactly 2 lines**, one per block per build, each with a numeric median and `moves_ge_400ms` > 0.
   QE re-runs the tool's parser on each block's `r.out` and counts raw `bestmove` / `info … nps` lines.
2. `thermal.log`: Tctl is numeric (k10temp) on every line; the sample count is ≥ ⌊span / 10 s⌋ over `schedule.log`'s
   span; the largest gap between consecutive samples is ≤ 12 s.
3. **Formula:** each block's printed `Elo difference` line equals the pooling formula: no formula cause from the
   tool, and QE's own copy of cutechess-cli 1.5.1's formula (`raw/scripts/elo.py`, written by QE) on the block's
   W/L/D gives the same X and Y to the printed digit. The pooled build line equals the block line (1 block each).
4. **Coverage:** neither build has a coverage cause; QE checks that each block's PGN rounds 1–10 start from EPD lines
   1–10, with skytalix once per colour.
5. **Host-path scan:** every file under `<out>` except `clone-*` has no home, temp, session-scratch, system-binary or
   node-manager path prefix and, case-sensitive, no login name, host name or e-mail (address or local part).
   `SHA256SUMS` verifies. The patterns stay in the session. The engine's `id author` line is ruled on in `…3a53bdfc`
   (ACCEPTABLE) and is not re-ruled.
6. `summary.txt` has both builds, the pair line, the pair state and the pentanomial line (INFO).

## A6: what is reported
- **Play wall:** first `start` to last `end` in `schedule.log`, with both times; **games per hour** = 40 / play wall.
- **Build time:** `host.log` `before` to the first block start. **Total:** session start to harness exit.
- **Projection, 400-game pair at width 1:** play wall × 10 + one build time (the 18 extra inter-block gaps are
  seconds and are named, not added). Set against the ticket's estimate of about 22–24 h. No width-2 figure.
- A6 is **MET** when both numbers are reported from the run's own times. A projection outside 22–24 h is reported,
  not graded.

## Verdict rules
- **PASS:** A1–A4 reproduced (above), A5 MET, A6 MET, the `start=S` probe MET, and no blocking gap.
- **PASS_WITH_GAPS:** the same, with non-blocking gaps named (e.g. the SE's LOW, a foreign process during the run).
- **FAIL:** A1–A4 not reproduced, a tool defect, a host-path leak, A5 NOT MET, a THERMAL STOP, or a VOID run
  (acceptance not evidenced).
