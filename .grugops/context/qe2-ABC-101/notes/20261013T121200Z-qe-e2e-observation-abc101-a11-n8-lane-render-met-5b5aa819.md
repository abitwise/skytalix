---
id: 20261013T121200Z-qe-e2e-observation-abc101-a11-n8-lane-render-met-5b5aa819
kind: observation
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:12:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - NFR-008
  - N8-LANE
  - ADR-0035
  - QE2-101-a
  - 20261012T211900Z-qe-e2e-observation-abc101-n8-lane-three-sets-met-bdcdfb6b
supersedes:
---

# `N8-LANE` for `A11`, set `src/render.test.ts`, base `081c3715`, head `d22a709f`: **MET** at 650 ms CPU (H−B +0.005 s, −0.010..+0.010). w1 was clean but INADMISSIBLE and w2 was clean, admissible and graded. n = 8, 0 rounds discarded

This note is hand-authored and unsealed. **Every figure here comes from a pre-registered window. Nothing was estimated, no
window was pooled, and the inadmissible window is reported as read, not graded.**

**Pre-registration (B1).** `probe/preregistration.txt` and the instruments were committed as **`ee688564`** at 12:03:03Z on
`grugops/qe2-ABC-101` (off `36378ccf`; the `ADR-0035` addenda A1 `3017115c` and B1 `0fe43646` are ancestors). That was
before any test run of this hop. Then came the count-only smoke (12:03:12Z, 3 runs, exit 0, no time recorded: B/T/H 27/27/30;
`probe/smoke-counts.out.txt`), and then the master at 12:03:19Z. QE was the only grugops hop running. Machine Apple M3
Mac15,13, Node v26.11.0, vitest 4.1.11, low-power mode 0. **AC power for the whole hop** (every gate sample, sampler row
and run row read `AC Power`). Power is logged, not a void clause.

**Instrument.** Gate `secnfr-ABC-152-window/probe/gate.sh` (sha256 `5335905a…352b6f`) and harness
`secnfr-ABC-144-window-b/probe/lane144b.mjs` (`652b7793…c80c7c`) were used in place, unchanged, and re-hashed in each
`window-once.txt`.
- `probe/readout-n8.py` is **byte-identical** to qe-ABC-101's (`8b18f27e…c5215`). Self-test on recorded TSVs: 4/4
  cmp-identical to qe-ABC-101's readouts (`probe/readout-selftest.out.txt`).
- `probe/window-n8.sh` and `probe/master-n8.sh` are qe-ABC-101's, with only the stated changes: CTX, one set, a 30 min budget, and
  `cli_procs` logged.
- S1 is read in R4 "changed" mode, because `A11` adds 3 `it`s (B = T = 27, H = 30).
- Arms are outside the repository: B = `git archive 081c3715`, T = `cp -R` of B (`diff -r` identical), H = `git archive d22a709f`.

## The window log (`probe/windows/master.log`; budget 30 min, 12:03:19Z → deadline 12:33:19Z)

| window | gate first sample → pass | lane | sampler rows: runner / platform / thermal ≠ 0 | `cli_procs` | load1 before scored runs | discarded | state |
|---|---|---|---|---|---|---|---|
| `n8-render-w1` | 12:03:20Z → 12:04:05Z (4 samples, the minimum) | 12:04:05Z–12:04:24Z | 0 / 0 / 0 of 14 | 3 on 14/14 rows | 2.44–2.88 | 0 of 8 | **clean, INADMISSIBLE**: CPU twin median +0.020 s = +3.101 % of B, over max(1.5 % = 9.68 ms, one tick) |
| `n8-render-w2` (the one re-attempt) | 12:04:31Z → 12:05:17Z (4) | 12:05:17Z–12:05:36Z | 0 / 0 / 0 of 13 | 3 on 13/13 rows | 2.65–2.80 | 0 of 8 | **clean, admissible** |

- The master ended at 12:05:43Z, **2 min 24 s of the 30 min budget**. No third window.
- **No foreign test runner and no `oeselg-labs/platform` process at any sample.** This covers the master before/after lines, the gates, the
  samplers and the per-run columns.
- **The three known idle `node src/cli.ts` leftovers** (PIDs 69785, 71584, 72301; started 14:13 local; the Orchestrator's own pty
  probes) were present at every sample and in every before/after snapshot. They are logged, not a void clause, and untouched.
  Other sessions' grugops `install.js`/`script` and admission-server processes were idle and are not runners.
- `abc095-book-absent-*` in `os.tmpdir()` read 0 before and 0 after both windows.
- Self-match hazard (pre-registered): the runner count greps for the runner's name, which also matches any command line
  that only *contains* it. A first ad-hoc count at 12:02:10Z read 3 for that reason (this hop's own shell). A recount
  that could not match itself read 0. During the master, this hop ran no command naming the runner.

## Readings (CPU = user + sys, `/usr/bin/time -p`, 10 ms tick; n = 8, k = 2; graded at 650 ms CPU, wall reported only)

| window | counts B / T / H | B median | twin T−B: median (% of B), sign on non-zero, R | admissible (A1) | **H − B median**, x(2)..x(7) | F | **state** |
|---|---|---|---|---|---|---|---|
| `n8-render-w1` (read, not graded) | 27 · 27 · 30 | 0.645 s | +0.020 s (+3.101 %), +5/−2 (1 zero), p 0.453, R 0.030 s | **no** | (+0.010 s, −0.010..+0.020; not used) | 0.103 s | **INADMISSIBLE** |
| **`n8-render-w2`** | 27 · 27 · 30 | 0.640 s | +0.000 s (0.000 %), +3/−3 (2 zero), p 1.000, **R 0.030 s** | yes | **+0.005 s**, −0.010..+0.010 | 0.102 s (16 %, provisional) | **MET** |

- **Wall, reported and not graded:** w2 H−B +0.000 s (+0.000..+0.010), twin +0.000 s, R 0.020 s, admissible. w1's wall twin
  was +0.010 s (+2.222 %, at the 10 ms limit), R 0.020 s. It is not used.
- 650 ms ≥ F (0.102 s): the bound is graded, not refused.

**Ticket line.** `A11`'s set costs **+0.005 s** median (x(7) +0.010 s). qe-ABC-101's three sets (+0.095 s medians, +0.270 s
x(7)) are cited, not re-read. **Arithmetic, NOT A READING:** the four sets sum to +0.100 s in medians and +0.280 s in x(7). Every
summed set is MET and the x(7) sum is ≤ 650 ms, so by the pre-registered rule the costs sit under the bar. These are
figures from this machine only, `UNKNOWN - verify` elsewhere, and no test asserts them. The count pins hold: 0 new test files
and 0 new spawns (`A11` is in-process rendering).

## For Architect/Design to fold (`QE2-101-a`, INFO; this hop folds nothing)

- **`src/render.test.ts`'s first 4.1 twin reading:** R **0.030 s CPU / 0.020 s wall** (w2, admissible). It is a candidate to
  replace the provisional 16 % (0.102 s on this base). w1's R (0.030 s CPU) was inadmissible and is not a reading. No state moves under
  either floor.
- At this set's B median (0.64 s), A1's limit is 1 tick. On w1 a +2-tick twin median made the window inadmissible while R was
  3 ticks. Short sets will spend their one re-attempt this way more often than long ones. This is an observation, not a proposal.
