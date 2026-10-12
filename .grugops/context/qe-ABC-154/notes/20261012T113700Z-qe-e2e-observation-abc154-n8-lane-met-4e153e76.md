---
id: 20261012T113700Z-qe-e2e-observation-abc154-n8-lane-met-4e153e76
kind: observation
by: qe-e2e
task: qe-ABC-154
at: 2026-10-12T11:37:00Z
verified_by:
confidence: high
refs:
  - ABC-154
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - RISK-ABC105-LANE
  - QE-105-x
  - QE-105-ab
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T103300Z-qe-e2e-observation-abc105-qe4-n8-lane-not-read-622677c5
  - 20261012T105616Z-architect-design-decision-qe105ab-tick-floor-forward-only-4d096b6b
supersedes:
---

# QE `ABC-154` `N8-LANE` at `0f8036f9`: window 1 is not void and is admissible. **MET at 650 ms CPU: +0.380 s (+0.350..+0.410), twin −0.005 s, R 0.030 s**

This is a hand-authored, unsealed note (`AGENTS.md`). QE was the only hop running (width 1). Every number was
read from `probe/w1/`, and none is estimated. **This is a reading of `0f8036f9`, `ABC-154`'s code. It is not a
reading of `8fd0c233`, the code merged under `ABC-105`.**

## Method: QE4's (`probe/preregistration.txt`, committed as `b9a5c957` at 11:25:18Z, before window 1)

- **Set:** `tools/grugops/qe-hop-integrity.test.ts` only.
- **Arms.** Three out-of-tree `git archive beb0991c` trees, with the shared `node_modules` symlinked. Each holds
  2656 note files.
  - **H** is the file at `0f8036f9` (sha256 `140ed0dc…590070b`, `cmp` 0), 32 tests.
  - **B** is the one-assertion placeholder at the path (`f730fdb2…`, `cmp` 0 to `qe-ABC-105`'s and QE4's).
  - **T** is a twin of B (`/usr/bin/diff -r`: identical).
- **Harness and gate, unchanged and in place.**
  - `lane144b.mjs` (`652b7793…c80c7c`) with `CONDS=B,H,T`, `ROUNDS=9` (round 0 discarded, n = 8), rotated order
    and `GAP=0`.
  - `gate.sh` (`5335905a…352b6f`): thermal 0, no vitest runner, 4 × 15 s, `MAXLOAD=""` (load1 logged and not
    gated).
- **Window script.** `window-qe5.sh` is QE4's script with only CTX, TAG, the console name and two comments
  changed.
- **Readout.** `readout-qe5.py` is QE4's with four changes:
  - integer centiseconds;
  - the **A1** admissibility rule: |twin median| ≤ max(1.5 % of B, one 10 ms tick), and the **sign test on the
    non-zero deltas only**;
  - the per-set **F = 0.020 s** (A2);
  - the TSV name.
- **The readout was self-tested before window 1** on QE4 w2's and QE3 w1's raw TSVs, and it reproduced the A1
  table exactly (`probe/readout-selftest.out.txt`).
- **Stack:** node v26.11.0, vitest 4.1.11, Mac15,13 (Apple M3), AC power, `lowpowermode 0`, 0 `VITEST_` env vars.

## The window

| window | gate | lane | load1 before runs | foreign / platform / thermal / power | discarded | state |
|---|---|---|---|---|---|---|
| w1 | passed 11:25:25→11:26:11Z (4 rows, load1 3.06–3.52) | 11:26:11–11:26:32Z | **3.21–8.88** | 0 / 0 / 0 / AC on every run; **sampler 0 bad rows over the whole window** | **0** | **admissible, graded** |

**There is no window 2.** The pre-registration allows a re-attempt only when w1 is void or inadmissible.

**Load.** load1 jumped from 3.21 to 8.88 between 11:26:14 and 11:26:19Z, during round 2, and decayed to 7.51 by
the end. No vitest runner, no `oeselg-labs/platform` process, no thermal event and no power change was seen at any
5 s sample. The cause is `UNKNOWN - verify`. Load is logged and never gated (`ADR-0035` decision 2). The twin,
which is the control for it, is admissible.

## The reading (`probe/w1/readout-qe5.out.txt`)

| arm / delta | CPU | wall |
|---|---|---|
| B median | 0.575 s | 0.415 s |
| H median | 0.960 s | 0.730 s |
| T median | 0.570 s | 0.420 s |
| twin T − B median | **−0.005 s (−0.870 % of B)**; limit max(8.62 ms, 10 ms) = 10 ms | 0.000 s |
| twin signs (non-zero only) | +1 / −4, 3 zeros dropped: **p 0.375** | +2 / −3, 3 zeros: p 1.000 |
| twin R (k = 2) | **0.030 s** | 0.030 s |
| treatment H − B median | **+0.380 s** | +0.300 s |
| treatment interval x(2)..x(7) | **+0.350..+0.410 s** | +0.280..+0.330 s |

- **Sorted twin CPU deltas:** −0.04, −0.03, −0.02, −0.01, 0.00, 0.00, 0.00, +0.02.
- **Sorted treatment CPU deltas:** +0.34, +0.35, +0.35, +0.37, +0.39, +0.41, +0.41, +0.42.
- **Grade (decision 1, b = 0.650 s CPU):**
  - it is admissible;
  - R 0.030 ≤ 0.650, so it resolves `b`;
  - the median +0.380 ≤ 0.650;
  - the lower end +0.350 is not > 0.650.
  - **→ MET.** The per-set F is 0.020 s, and 650 ms ≥ F.
- **Independent of A1.** The window is also admissible under the pre-A1 rule:
  - −0.870 % is inside 1.5 %;
  - the old convention reads 1/8 positive, p 0.070 > 0.05.
  - **So no state here depends on the forward-only clause.**

## Context (read, not compared)

- **QE4 w2** at `8fd0c233` read +0.370 s (+0.370..+0.400), ungraded and inadmissible. **This window is not paired
  with it.** It is different code, and `0f8036f9` adds 4 `expect`s over the two existing memos. No delta between
  the two is claimed.
- **H's last run** (round 8, `probe/w1/h-last-run.json`): 32/32 passed, 0 failed, 0 pending, 0 todo.
- **`F` after this reading.** This is a third admissible R for the set: CPU 0.010 (`qe-ABC-105`), 0.020 (QE3 w3)
  and **0.030** (this one). The median of the three most recent is 0.020 s, so **`F` stays 0.020 s** for CPU and
  for wall (0.010 / 0.020 / 0.030). The record is Architect/Design's to write.
- **The record's size at this reading:** 2656 note files in the arm (beb0991c). The `T-c` trigger is 4000.
