# qe-EPIC-010-m1-batch-2 run 1 is VOID at 48 min (14 games of block 01 base). The watcher's thermal pause (SIGSTOP) was seen by the background-task runner that had launched the harness, and the runner tore the harness's process tree down. Per the PREREG (VOID, ≤ 2 h) the pair is re-run once, fresh out-dir, same command, with the harness launched detached (QE-M1B2-b)

QE/E2E, task `qe-EPIC-010-m1-batch-2`, after the PREREG `…316833e1` (commit `5d9c6b3a`). Raw: `raw/void1/` (the
watcher log, the harness's stdout, `schedule.log`, `machine.txt`, the partial block-01 base PGN and its clock read; host
paths redacted).

## What happened (times UTC)
- **07:41:24–07:42:05: wait-clear CLEAR.** 0 foreign vitest or cutechess; Tctl 32.8–33.3 °C, load1 ≤ 0.11 on 3 checks.
- **07:42:12: harness started** (pid recorded), as a background task of the agent's shell, with `exec node
  tools/rating/rating.ts rpair …` (the PREREG command, out-dir `<scratch>/qe-batch2/out`).
  - The tool built both clones. `artifacts.txt` shows base `ca6e675c` and candidate `51902be5`; both declare `Skill Level`.
  - `machine.txt` shows both binary pins `= pin`.
  - The live log shows `setoption name Skill Level value 6` to skytalix before its first `go`.
- **07:42:17: block 01 base started.**
- **07:53:09: watcher restarted, QE-M1B2-a (INFO, QE harness).** The contamination filter counted our own
  `cutechess-cli` (its argv carries `arg=…/dist/uci.js`) as a foreign skytalix engine.
  - Fixed: `cutechess-cli` is excluded from that filter. The PREREG's watcher is `raw/scripts/watch.mjs`; the committed
    copy now carries the fix, marked `QE-M1B2-a`.
  - Watcher gap: 07:51:56–07:53:09 (73 s). No thermal or guard action was due in it (median 74.45 °C).
  - The harness and `cutechess-cli` were untouched. The `FOREIGN sky=1` lines before 07:53:09 are that false positive.
- **From 08:16:50: contamination, a real foreign `vitest`.** It came from another repository on the host
  (`<home>/projects/public/grugops`, repeated `vitest run`), not from a skytalix hop.
  - It was first seen with block 01 base at 10 / 20 games, and it was logged, not killed.
  - Load1 rose from about 1.1 to 2.2–3.9. Tctl rose from a median of about 74.5 °C to 92.1 °C instantaneous.
- **08:30:30: PAUSE, as pre-registered.** The `thermal.log` median of the last 30 samples was 85.20 °C (> 85), and block 01 base
  was at 14 / 20, so the watcher sent `SIGSTOP` to the harness `node` only.
- **08:30:30–08:30:47: the run died.** The agent's background-task runner, which was the harness's parent, reported the
  stopped child as finished (exit 147 = 128 + SIGSTOP) and removed its process tree: the harness, our `cutechess-cli` and
  both engines.
  - `r.out` ends mid-game at `go movetime 4000` (game 15). No `summary.txt` was written.
  - At 08:30:50 the watcher saw the harness gone and exited. No process of this task was left; QE checked by `ps`.

## Reading
- **VOID** (the PREREG's "the harness dies without `summary.txt` and without a QE stop, e.g. an external kill"). The session
  ran 48 min, which is ≤ 2 h, so **re-run once in this hop, with a fresh out-dir and the same command**. The 14 games count
  for nothing; no score is read from them.
- The block-01 guard never fired (base block 01 never ended). As information, the partial base PGN reads 591 skytalix
  moves at 4.0 s, 0 at 3.0 s and 8 book moves over 14 games. Results: 6 / 7 / 1 by colour, as cutechess printed them; not
  a reading.

## QE-M1B2-b (MEDIUM, QE method; no tool defect)
- **What:** the PREREG's pause works by `SIGSTOP` on the harness. A process launched as the agent runner's background task
  has a parent that watches for a stopped child and tears the process tree down when one stops. The pause therefore killed
  the run instead of holding it.
- **The tool is not at fault:** `rating.ts` behaved as written, and `SIGSTOP` is the PREREG's own act.
- **Fix for the re-run (launch only; the measurement is unchanged):** the harness is started with `setsid -f`, so its
  parent is init (ppid 1) and no job-control parent sees the stop. QE tested this before the re-run: a `setsid -f` process
  went `T` on `SIGSTOP`, back to `S` on `SIGCONT`, and lived through the call that started it. The watcher is also started
  detached.
- Same command, same SHAs, same watcher rules (85 °C pause, 90 °C hard stop, the block-01 guard). Fresh out-dir
  `<scratch>/qe-batch2/out2`, and a fresh wait-clear first.
- **For later batches (records):** a PREREG that pauses by signal must start the harness detached from any agent
  job-control parent.

## Contamination note for the re-run
- The foreign `vitest` from the other repository was the main heat source here (Tctl 74.5 → 92.1 °C).
- The re-run's wait-clear waits on the pids it snapshots, and then needs Tctl < 55 °C and load1 < 1.5 on 3 checks. If that
  repository keeps starting new `vitest` runs during the batch, they are logged as contamination per the PREREG and never
  killed. The thermal pause, now working, is the guard.
