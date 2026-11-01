---
id: 20261101T181555Z-architect-design-observation-603a0ca9
kind: observation
by: architect-design
at: 2026-11-01T18:15:55Z
verified_by: 
confidence: high for the figures as read from the committed raw files; the slowdown mechanism is UNKNOWN - verify
refs:
  - arch-d3-under-load
  - ADR-0055
  - ABC-254
  - QE-254-a
  - QE-254-d
  - ABC-250
  - ABC-251
  - ABC-253
  - EPIC-010
  - grugops/arch-d3-under-load
  - 4a896e3f
  - 83b0ff2d
  - grugops/qe-ABC-254
  - grugops/qe-ABC-254-a4
  - qe-ABC-254/20261101T172756Z-qe-e2e-decision-1c801504
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-09221f68
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-decision-ab3062eb
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-observation-d9649ce2
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-observation-f704f071
supersedes: 
seal: sha256:70f9292514bcec92ab2dd19f2df4438e4c730df2fafa2865d0c3911327b9758b
---

# Evidence behind D3-V2, from the seen A4 runs of both ABC-254 reads (calibration only, not a re-grade). The probe's CPU time is flat under load, so the loss is per cycle. Slowdown tracks per-run foreign cores. The host has 4 fast and 8 slow cores

Architect/Design, task `arch-d3-under-load`. Read with `git show`. No test, build or engine was run.
- Sources:
  - `grugops/qe-ABC-254-a4`: `.grugops/context/qe-ABC-254-a4/raw/a4/a4.jsonl`, `a4-rerun.jsonl`;
  - `grugops/qe-ABC-254`: `.grugops/context/qe-ABC-254/raw/a4/a4.jsonl`, `a4-rerun2.jsonl`. The aborted re-run file was excluded.
- Records: 194 runs.
- Host topology was read from sysfs this hop.

## Scope
These figures calibrate the ADR-0055 D3-V2 ruling (decision note of this task) and nothing else. No hypothetical grade of either read under D3-V2 was computed. Both reads stay UNRESOLVED as graded.

## Readings
- **CPU time is flat under load.** The probe's own user + sys time is 4.30–4.54 s for a 4 000 ms search (process wall about 4.06–4.10 s) at every load level. The extra over wall is V8 helper threads.
  - Example: `qe-ABC-254-a4` re-run, round 5, position-6, base, at foreign cores 5.15. It read 667 079 nps by wall time and 600 576 nodes per CPU-second. Clean runs on that board read about 790 000 and 715 000.
  - So CPU-time nps does not remove the load effect.
- **Deviation from each board and build's median at ≤ 0.6 foreign cores:**

| foreign cores | runs | min | median | max | runs below −3 % |
|---|---:|---:|---:|---:|---:|
| ≤ 0.6 | 121 | −4.3 % | 0.0 % | +2.4 % | 5 |
| 0.6–0.8 | 9 | −2.6 % | −0.2 % | +0.5 % | 0 |
| 0.8–1.0 | 2 | −3.1 % | −3.0 % | −2.8 % | 1 |
| 1.0–1.5 | 16 | −6.3 % | −2.8 % | −0.8 % | 7 |
| 1.5–2.5 | 37 | −17.1 % | −5.6 % | −0.6 % | 30 |
| > 2.5 | 9 | −15.2 % | −9.1 % | −5.6 % | 9 |

- **Admission yield.** Per file, pair attempts were clear at 1.0, and admitted at 0.8:
  - a4-main: 27 attempts, 16 clear and 16 admitted;
  - a4-rerun: 21, 10 and 10;
  - q1-main: 30, 16 and 16;
  - q1-rerun2: 19, 11 and 11.

  Tightening to 0.8 dropped no pair in the seen runs. The overall rate was about 55 %.
- **Host:**
  - AMD Ryzen AI 9 HX 370, 24 CPUs;
  - CPUs 0–3 (siblings 12–15) `cpuinfo_max_freq` 5 157 895 kHz;
  - CPUs 4–11 (siblings 16–23) 3 289 474 kHz;
  - `taskset` present at `/usr/bin/taskset`.
- **Paired-ratio spread on clear pairs** (QE's INFO in `…d9649ce2`): position-6 ranged 1.070–1.165, about 8.4 %. That is why a ratio-spread bar would be a new number.
- **Who loads the host.** QE's host notes name the owner's `grugops` full-suite vitest (`…09221f68`). They also name short-lived `node` and `git` processes the per-run snapshot cannot name (`…f704f071`, QE-254-d). This session's own hops fit the second pattern (`UNKNOWN - verify`).

## Risks
- The bins are from 2 reads on one day. The threshold and cap generalise to other load mixes only by assumption (`UNKNOWN - verify`).
- The reference medians include the ≤ 0.6 runs that were themselves slightly contaminated, which understates the deviations a little.
