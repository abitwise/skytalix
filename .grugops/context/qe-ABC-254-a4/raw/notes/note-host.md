# ABC-254 A4 re-read: admissibility and load evidence. Lock held for the whole read; started ALONE twice; within 1 min the host turned busy with short-lived foreign work (foreign cores up to 5.15) and four foreign-vitest pauses, which voided position-6 and position-4 under the 5 % rule

QE/E2E, task `qe-ABC-254-a4`, by the PREREG `…2e86c6f1`. Raw: `raw/a4/a4.jsonl`, `raw/a4/a4-rerun.jsonl`, `raw/a4/times.txt`.

## Lock (admissible: held for the whole read, never bypassed)
- I requested the lock at 17:33:18Z. qe-ABC-255's game read (`qe-255/scripts/read.sh`) held it, and I waited.
- **I acquired it at 17:54:28Z** and held it until the job exited at 18:05:25Z.
- The whole read was one `flock …/host-test.lock bash run.sh` job: the clear wait, the main schedule, the grader, the board re-run and the grade. The job was never suspended or signalled. No foreign process was killed. Nothing of this hop was left running.
- Lock wait: 21 min, excluded.

## Start precondition (met both times, ALONE)
The precondition, with the fixed detector:
- 0 running foreign vitest (`comm` node or vitest; waiters ignored);
- 0 `cutechess-cli`;
- no foreign process above 50 % of one core over a 3 s `/proc` sample;
- load1 ≤ 2.0;
- Tctl ≤ 60 °C.

| schedule | first poll | clear | reading at clear |
|---|---|---|---|
| main | 17:54:31Z: Tctl 75.6 (residual heat from the previous holder), hot none, vitest none | **17:54:49Z** | load1 1.39, Tctl 42.0, hot none |
| re-run | 17:59:19Z: Tctl 75.8 (from the main schedule) | **17:59:37Z** | load1 1.47, Tctl 58.5, hot none |

Both were well before the cap of 18:39:28Z (lock + 45 min). Neither reading is SHARED.

## Mid-read load (the spread rule decides, as the brief says)
- **Pairs not clear**, meaning foreign cores > 1.0 on a run or a foreign vitest present after the pair:
  - main: 7 of 20 first attempts, and 4 of the 7 second attempts;
  - re-run: 6 of 15 first attempts, and 5 of the 6 second attempts.
  - In each not-clear pair, the busier run read **foreign cores 1.31–5.15** (main 1.31–2.49, re-run 1.37–5.15). Runs in clear pairs read 0.24–0.70.
- **Foreign vitest pauses** (the gate waited by PID; logged PIDs only, because the processes had exited before anyone could identify the repo, so the source is UNKNOWN - verify):
  - 17:56:44Z, PIDs 3099975 and 3100054, about 45 s;
  - 18:01:08Z, PIDs 3124717, 3125118 and 3125133, about 25 s;
  - 18:01:41Z, PID 3128062, about 110 s;
  - 18:04:52Z, PIDs 3152154, 3152407 and 3152414, about 25 s.
  - In the re-run, load1 rose from 1.4 to 3.67 around the 18:01–18:04 vitest.
- **Thermal pause:** one, at 18:04:28Z (Tctl 85.1, about 16 s). The median after-run Tctl was 77.8 °C (main) and 79.7 °C (re-run). No STOP.
- **Who was busy:** the per-run `/proc` snapshot diff (above 20 % of one core, alive at both ends of the run) caught only one process, `node-MainThread` PID 3114106 at 200 %, during main round 5's kiwipete second attempt.
  - The rest of the foreign CPU came from processes that started and ended inside a 4 s run. `/proc/stat`'s foreign cores counts them, but the snapshot method cannot name them.
  - Their identity is UNKNOWN - verify. Short `node` and `git` processes from other sessions fit the pattern qe-ABC-254 saw.
- **Who is affected:** the boards that voided are the ones whose graded attempts landed in those bursts.
  - position-6 re-run rounds 1, 3 and 5: base 705 814, 709 063; head 750 091, 828 408.
  - position-4 re-run rounds 3–4: base 865 675; head 938 657.
  - Clear-only spreads on the same boards are ≤ 4.5 % (timing note, INFO).

## Run time
- Lock held 10.95 min. Waits inside the job were about 4.4 min: 36 s of clear waits, about 205 s of vitest pauses and about 16 s of thermal pause.
- **Timed run time was about 6.6 min**, inside the brief's 30 min excluding waits.
