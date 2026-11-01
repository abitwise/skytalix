# The A4 read's window, lock and load: ALONE start at 18:57:51Z (0 vitest, 0 cutechess, 0 hot processes, load1 0.46, Tctl 36 °C); lock held 18:57:48–19:00:43Z; 21 attempts, 20 admitted, 1 discarded (a foreign `claude` process, foreign cores 1.05); no gate pause; no SHARED label

QE/E2E, task `qe-ABC-254-a4v2`. Read from `raw/a4/times.txt` (sha256 `aeddd7c931745492`) and `raw/a4/a4.jsonl`. Timestamps are `date -u` (shell) and the driver's ISO clock.

## Scope
The host conditions of the A4 read graded in this task's timing note, under PREREG `…a1136cf6`.

## Window
- **Hop start:** first `date -u` at 18:52:25Z (worktree created). The Orchestrator dispatched the hop as an ALONE window (brief at 18:16:56Z, `main` `f4a85039`).
- **Lock:** `flock …/scratchpad/host-test.lock` was requested at 18:57:48Z and acquired at once, with no other holder. The whole read ran as one job, and the lock was **held 18:57:48–19:00:43Z** (job exit 0). It was never bypassed, suspended or signalled.
- **Timed schedule:** 18:57:51–19:00:43Z, 172.3 s. Gate waits inside it totalled 0.5 s (checks only, no pause). The 45-min cap (19:42:48Z) was never approached.
- **Window end:** the hop's report time, recorded in the brief's Result.
- **No other hop of this session ran.**
  - This hop ran one command while the job held the lock: a `cat` of `times.txt` and the job's output file, at about 18:57:5xZ in round 1. That breaks the PREREG's "no command while the job runs". It is disclosed here. It was a single short read, and the pair running then (kiwipete, attempt 1) was admitted at 0.36 / 0.37 foreign cores.
  - After the `cat`, this hop's agent ended its turn and waited for the completion notification.

## Start precondition (unchanged from qe-ABC-254-a4)
It was clear on the first poll at 18:57:51Z: 0 running vitest, 0 `cutechess-cli`, no foreign process above 50 % over the 3 s `/proc` sample, load1 0.46 and Tctl 36.4 °C. **Not SHARED.**

## Per-attempt load
- **Admitted pairs (20):** foreign cores 0.24–0.53 on every counted run, all under the 0.8 threshold. The maximum per board was kiwipete 0.44, position-6 0.46, start 0.53 and position-4 0.43.
- **load1** rose from 0.46 to 1.31 over the read, as expected from the probe's own V8 threads. After-run Tctl was 68.3–78.6 °C.
- **Discarded (1 of 21):** position-4, round 1, attempt 1 (BH), at 18:58:16–24Z. Head read foreign cores **1.05**, and base 0.35.
  - `busyWithChildren` named `claude:4469:77%`. PID 4469 is a `claude` process under a different parent (3506, tmux) that had been up for about 59 h. This session's agent process is 6693. So it is a **foreign** Claude Code session.
  - The retry kept order BH and was admitted at 0.37 / 0.40. The discarded pair never entered a median, spread or ratio.
- **No** foreign vitest, `cutechess-cli`, thermal pause or STOP-identity during the read.

## The V2-INFO instrument (QE-254-d)
Of 42 runs, the reaped-children list named one process: the one above. The self-only list named none. This window carried little short-lived load, so this read does not show whether the children view names the `git` / `node` bursts that voided the earlier reads. QE-254-d stays INFO (`UNKNOWN - verify`).

## Risks
- The `cat` during the job is a protocol slip, disclosed above. The evidence says it did not touch a counted run: the concurrent pair was admitted at ≤ 0.37 foreign cores, and admission is blind to its values. The read is not re-run for it, because the PREREG allows one read.
