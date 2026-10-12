---
id: 20261012T211900Z-qe-e2e-observation-abc101-n8-lane-three-sets-met-bdcdfb6b
kind: observation
by: qe-e2e
task: qe-ABC-101
at: 2026-10-12T21:19:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - NFR-008
  - N8-LANE
  - ADR-0035
  - QE-101-e
  - 20261012T173100Z-qe-e2e-observation-abc095-n8-lane-reread-three-sets-195fc847
supersedes:
---

# `N8-LANE` for `ABC-101`, base `3ea3e352`, head `98ea0a84`: **S1 MET, S2 MET, S3 MET** at 650 ms CPU; every graded window clean, n = 8, 0 rounds discarded; S2 needed its one re-attempt (w1 clean but inadmissible)

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **Every figure
here comes from a pre-registered window. Nothing was estimated, no window was pooled, and the inadmissible window is
reported as read, not graded.**

**Pre-registration (B1).** `probe/preregistration.txt` with the instruments was committed as **`bd846627`** at
21:01:40Z on `grugops/qe-ABC-101` (off `98ea0a84`, which has the `ADR-0035` addenda A1 `3017115c` and B1 `0fe43646`
as ancestors), before any run of any arm. The count-only smoke ran after it (21:01:50Z, 9 runs, exit 0, no time
recorded: B/T/H read 69/69/78, 1/1/1, 33/33/33; `probe/smoke-counts.out.txt`), then the master at 21:02:12Z.
**Head choice:** `98ea0a84`, not `ac8deab1`. `src/` is identical, but S1 reads `AGENTS.md` at run time and at
`ac8deab1` `ABC-065` `A3` is the expected red, so every S1 H round would fail status and void. QE was the only
grugops hop running. Machine Apple M3 Mac15,13, Node v26.11.0, vitest 4.1.11, low-power mode 0. **AC power for the
whole hop** (every run, before and after, and every sampler row read `AC Power`); power is logged, not a void
clause.

**Instrument.** Gate `secnfr-ABC-152-window/probe/gate.sh` and harness `secnfr-ABC-144-window-b/probe/lane144b.mjs`
in place, unchanged (sha256 `5335905a…352b6f`, `652b7793…c80c7c`, re-hashed in every `window-once.txt`).
`probe/window-n8.sh` and `probe/master-n8.sh` are qe-n8-ABC-095's copies with paths and sets changed only;
`probe/readout-n8.py` is qe-n8-ABC-095's readout plus one pre-registered count mode, R4 "changed", used for S1
alone, because the ticket adds 9 rows to `src/cli.test.ts` (B = T = 69, H = 78). The readout self-test on recorded
TSVs reproduces qe-n8-ABC-095's three readouts byte for byte, and R4 on n8r-cli-w1 does too
(`probe/readout-selftest.out.txt`). Arms outside the repository: B = `git archive 3ea3e352`, T = `cp -R` of B
(`diff -r` identical), H = `git archive 98ea0a84`; removed by exact path after the hop.

## The window log (`probe/windows/master.log`; budget 45 min, 21:02:12Z → deadline 21:47:12Z)

| window | gate first sample → pass | lane | sampler rows: runner / platform / thermal ≠ 0 | load1 before scored runs | discarded | state |
|---|---|---|---|---|---|---|
| `n8-cli-w1` (S1) | 21:02:13Z → 21:02:58Z (4 samples, the minimum) | 21:02:58Z–21:04:58Z | 0 / 0 / 0 of 32 | 3.08–3.88 | 0 of 8 | **clean, admissible** |
| `n8-real-w1` (S2) | 21:05:05Z → 21:05:50Z (4) | 21:05:50Z–21:06:11Z | 0 / 0 / 0 of 14 | 3.20–3.45 | 0 of 8 | **clean, INADMISSIBLE**: twin −0.015 s = −2.174 % of B, over max(1.5 % = 10.35 ms, one tick) |
| `n8-real-w2` (S2, the one re-attempt) | 21:06:18Z → 21:07:03Z (4) | 21:07:03Z–21:07:23Z | 0 / 0 / 0 of 14 | 3.38–3.75 | 0 of 8 | **clean, admissible** |
| `n8-eng-w1` (S3) | 21:07:30Z → 21:08:15Z (4) | 21:08:15Z–21:08:44Z | 0 / 0 / 0 of 16 | 3.15–3.50 | 0 of 8 | **clean, admissible** |

- The master ended at 21:08:51Z: **6 min 39 s of the 45 min budget**. No third window for any set.
- **No foreign vitest and no `oeselg-labs/platform` process at any sample** (master before/after lines, gates,
  samplers, per-run columns). Another session's grugops installer processes (`install.js --target …`) were present
  and idle throughout; they are not test runners, no void clause names them, and QE did not touch them.
- `abc095-book-absent-*` in `os.tmpdir()`: 0 before and 0 after every window (master lines).
- Thermal 0 on every row. load1 is logged, not gated (decision 2, B4).

## Readings (CPU = user + sys, `/usr/bin/time -p`, 10 ms tick; n = 8, k = 2; graded at 650 ms CPU, wall reported only)

| set | counts B / T / H | B median | twin T−B: median (% of B), sign on non-zero, R | admissible (A1) | **H − B median**, x(2)..x(7) | F | **state** |
|---|---|---|---|---|---|---|---|
| **S1** `src/cli.test.ts` (`n8-cli-w1`) | 69 · 69 · 78 | 6.060 s | −0.035 s (−0.578 %), +2/−6, p 0.289, **R 0.120 s** | yes | **+0.105 s**, −0.010..+0.240 | 0.100 s (recorded) | **MET** |
| **S2** `src/cli.real-engine.test.ts`, default lane (`n8-real-w2`) | 1 · 1 · 1 | 0.680 s | +0.000 s (0.000 %), +4/−4, p 1.000, **R 0.020 s** | yes | **+0.005 s**, −0.010..+0.030 | 0.109 s (16 %, provisional) | **MET** |
| **S3** `src/engine.test.ts` (`n8-eng-w1`) | 33 · 33 · 33 | 1.130 s | −0.015 s (−1.327 %), +2/−4 (2 zero), p 0.688, **R 0.030 s** | yes | **−0.015 s**, −0.040..+0.000 | 0.181 s (16 %, provisional) | **MET** |

- `n8-real-w1`, read and not graded: B 0.690 s, twin −0.015 s, +3/−5, R 0.030 s; it would not be graded under A1,
  and no figure from it is used.
- **Wall, reported and not graded:** S1 H−B +0.030 s (−0.040..+0.080), twin −0.085 s (−2.041 %), R 0.160 s,
  wall twin INADMISSIBLE; S2 (w2) +0.000 s (+0.000..+0.010), R 0.010 s; S3 −0.015 s (−0.030..+0.010), R 0.030 s.

**Ticket line. Arithmetic, NOT A READING:** the three H−B medians sum to **+0.095 s** and the three x(7) ends to
**+0.270 s**. Every summed set is MET and the x(7) sum is ≤ 650 ms, so by the pre-registered rule **the costs sit
under the bar**. These are notes figures on this machine only, `UNKNOWN - verify` elsewhere; no test asserts them.
The count pins also hold: 0 new test files, 0 new default-lane spawns (`A10` is `CLI_DEEP`).

## What a reader must not over-read (`QE-101-e`, INFO)

1. **S2's first window was clean and inadmissible.** Its twin median (−15 ms) was 1.5 ticks off on a 0.69 s base,
   where A1's limit is 10.35 ms. The re-attempt was admissible with a 0.000 s twin. Nothing was pooled.
2. **New 4.1 twin readings for Architect/Design to fold** (this hop folds none):
   - S1 `src/cli.test.ts` R **0.120 s CPU** / 0.160 s wall. This is the set's **third** 4.1 reading after
     `ABC-116`'s 0.100 / 0.180 and qe-n8-ABC-095's 0.340 / 0.330. Under § Status "from the third 4.1 reading on,
     the median of the three most recent governs", `F` would become 0.120 s CPU / 0.180 s wall. 650 ms ≥ F
     either way.
   - S2 R 0.020 s CPU (second reading, after 0.030 s). S3 `src/engine.test.ts` R 0.030 s CPU / 0.030 s wall, its
     first 4.1 reading, a candidate to replace the provisional 16 % (0.181 s).
