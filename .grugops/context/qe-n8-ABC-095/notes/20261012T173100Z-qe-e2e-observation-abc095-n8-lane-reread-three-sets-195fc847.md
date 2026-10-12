---
id: 20261012T173100Z-qe-e2e-observation-abc095-n8-lane-reread-three-sets-195fc847
kind: observation
by: qe-e2e
task: qe-n8-ABC-095
at: 2026-10-12T17:31:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - NFR-008
  - N8-LANE
  - QE-095-N8
  - QE-095-h
  - ADR-0035
  - 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
supersedes:
---

# `N8-LANE` re-read for `ABC-095`, base `0974102f`, head `2307fc11`: **S1 MET, S2 MET, S3 MET** at 650 ms CPU. Each set read clean in its first window, n = 8, 0 rounds discarded

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **Every figure
here comes from a pre-registered window. Nothing was estimated, no window was pooled, and no void window was
graded. None was void.**

**Pre-registration.** `probe/preregistration.txt` was committed as `8f4f75e5` at 17:16:42Z on
`grugops/qe-n8-ABC-095` (off `7b93c973`), before any run of any arm. The `ADR-0035` addenda A1 (`3017115c`) and
B1 (`0fe43646`) are ancestors of that commit. A count-only smoke ran after the commit and before the master
(17:16:51Z–17:17:06Z, 9 runs, exit 0, no time recorded: `probe/smoke-counts.out.txt`). QE was the only grugops hop
running. Machine: Apple M3 Mac15,13, Node v26.11.0, vitest 4.1.11, low-power mode 0. **The laptop was on battery
for the whole hop:** the gate, the sampler and every run log `Battery Power` (120 + 14 + 14 sampler rows, 81 runs).
Per the brief, power is logged and is not a void clause (readout change R1, pre-registered).

**Instrument.** The harness was `secnfr-ABC-144-window-b/probe/lane144b.mjs` and the gate was
`secnfr-ABC-152-window/probe/gate.sh`, both in place and unchanged (sha256 `652b7793…c80c7c` and `5335905a…352b6f`).
The window script `probe/window-n8r.sh` and the readout `probe/readout-n8r.py` are copies of qe-ABC-095's, with
only the changes the pre-registration lists. The readout self-test on recorded TSVs reproduces qe-ABC-154 w1's
graded line exactly (`probe/readout-selftest.out.txt`). Arms were built outside the repository: B is
`git archive 0974102f`, T is a `diff -r`-identical `cp -R` of B, and H is `git archive 2307fc11`. S3's B/T add the
one-assertion placeholder at `src/book-engine.test.ts`.

## The window log (`probe/windows/master.log`; budget 45 min, 17:17:13Z → deadline 18:02:13Z)

| window | gate first sample → pass | gate wait | lane | sampler rows after the pass: runner / platform / thermal ≠ 0 | discarded | state |
|---|---|---|---|---|---|---|
| `n8r-cli-w1` (S1) | 17:17:14Z → **17:25:48Z** | 8 min 34 s, 35 samples. A foreign grugops-kit runner (another session's; 4–5 processes in 30 of 35 samples) blocked the gate until 17:24:48Z. There was one lone clean sample at 17:20:15Z, and the passing streak ran 17:25:03Z–17:25:48Z. QE did not touch it | 17:25:48Z–17:27:47Z | 0 / 0 / 0 (of 120 rows) | 0 of 8 | **clean** |
| `n8r-real-w1` (S2) | 17:27:53Z → **17:28:39Z** | 46 s (4 samples, the minimum) | 17:28:39Z–17:28:58Z | 0 / 0 / 0 (of 14) | 0 of 8 | **clean** |
| `n8r-be-w1` (S3) | 17:29:05Z → **17:29:50Z** | 45 s (4 samples) | 17:29:50Z–17:30:09Z | 0 / 0 / 0 (of 14) | 0 of 8 | **clean** |

- **No re-attempt was needed**, so no w2 ran. The master ended at 17:30:15Z, 32 minutes inside the budget.
- **No `oeselg-labs/platform` process appeared at any sample** (master before/after lines, gate, sampler and bracket
  log). PID 63446 was gone before the hop started. `QE-095-i`'s void clause was carried unchanged and did not bear.
- **load1 is logged and not gated** (decision 2, B4). Before the scored runs it read 3.77–9.83 on S1 (it peaked at
  9.83 between rounds 1 and 2; the cause was not identified, and no sampler row shows a runner or platform process),
  3.32–3.54 on S2 and 3.87–4.20 on S3. Thermal was 0 on every row.
- The per-round before/after brackets (load1, thermal, power, runner, platform) are in each window's `readout.out.txt`
  (change R3).

## Readings (CPU = user + sys, `/usr/bin/time -p`, 10 ms tick; n = 8, k = 2; graded at 650 ms CPU, wall reported only)

| set | counts B / T / H | B median | twin T−B: median (% of B), sign on non-zero, R | admissible (A1) | **H − B median**, x(2)..x(7) | F | **state** |
|---|---|---|---|---|---|---|---|
| **S1** `src/cli.test.ts` | 1/69 · 1/69 · 1/69 | 5.685 s | +0.020 s (+0.352 %), +4/−4, p 1.000, **R 0.340 s** | yes | **+0.225 s**, −0.100..+0.690 | 0.100 s (recorded) | **MET** |
| **S2** `src/cli.real-engine.test.ts`, default lane | 1/1 · 1/1 · 1/1 | 0.655 s | −0.010 s (−1.527 %), +3/−4 (1 zero), p 1.000, **R 0.030 s** | yes, **by A1's one-tick floor only** | **+0.025 s**, +0.020..+0.050 | 0.105 s (16 %, provisional) | **MET** |
| **S3** `src/book-engine.test.ts` vs placeholder (`QE-095-h`) | 1/1 · 1/1 · 1/5 | 0.570 s | +0.010 s (+1.754 %), +5/−2 (1 zero), p 0.453, **R 0.030 s** | yes, **by A1's one-tick floor only** | **+0.115 s**, +0.100..+0.120 | 0.091 s (16 %, provisional) | **MET** |

Wall, reported and not graded: S1 H−B +0.035 s (−0.330..+0.440), twin R 0.330 s; S2 +0.020 s (+0.020..+0.030),
R 0.020 s; S3 +0.045 s (+0.040..+0.050), R 0.020 s. Every wall twin is admissible.

**Ticket line. This is arithmetic, NOT A READING:**
- **S1 + S2 (the two named costs):** the medians sum to **0.250 s**. The x(7) ends sum to **0.740 s**, which is
  over 650 ms, so the sum is reported as it is. It is not "under the bar".
- **S1 + S2 + S3:** the medians sum to **0.365 s**, and the x(7) ends sum to **0.860 s**.
- S3's reading is already net of start-up (decision 2: the placeholder carries it). Its 160 ms floor is charged by
  count (+1 file), not here.

## What a reader must not over-read

1. **S1 is MET by the ladder, and its interval reaches past the bar.** R is 0.340 ≤ 0.650 and the median is
   +0.225 ≤ 0.650, so it is MET. But x(7) is +0.690 s > 0.650 s, so this window does not exclude a cost above 650 ms
   at the upper end. Two H rounds read +0.690. That is the protocol's grade, written as it ran.
2. **S2 and S3 are admitted only by A1's one-tick floor.** Their twin medians are −1.527 % and +1.754 % of B. Under
   the pre-A1 1.5 % rule both would be INADMISSIBLE. A1 (forward-only) is the rule in force and these windows
   qualify under B1. A1's rollback test is a floor-only twin followed by readings that flip sides of a bound.
   Neither set is near 650 ms (+0.025 and +0.115 s), so nothing flips. This is recorded for Architect/Design.
3. **S1's twin R (0.340 s CPU / 0.330 s wall) is this set's second 4.1 reading.** The recorded `F` is
   0.100 / 0.180 s, from `ABC-116`. Under § Status "with fewer than three readings the largest is used", folding
   this reading would raise `F` to 0.340 s CPU / 0.330 s wall. This hop does not fold it. That is Architect/Design's
   call, and the conditions differ: this run was on battery with load1 up to 9.83. 650 ms ≥ 0.340 s either way, so
   the bound is not refused.
4. **S2's and S3's twin R (0.030 s CPU / 0.020 s wall each) are each set's first 4.1 reading.** They are candidates
   to replace the provisional 16 %, and that fold is Architect/Design's. Neither changes a state here.
5. **These are notes figures on this machine only, and `UNKNOWN - verify` elsewhere.** No test asserts them.
