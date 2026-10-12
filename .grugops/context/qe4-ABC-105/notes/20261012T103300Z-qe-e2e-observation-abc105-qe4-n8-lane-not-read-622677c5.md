---
id: 20261012T103300Z-qe-e2e-observation-abc105-qe4-n8-lane-not-read-622677c5
kind: observation
by: qe-e2e
task: qe4-ABC-105
at: 2026-10-12T10:33:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - QE-105-x
  - QE-105-ab
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T095451Z-qe-e2e-observation-abc105-qe3-n8-lane-reread-fc1f4a7c
  - 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
supersedes:
---

# QE4 `ABC-105` `N8-LANE` at `8fd0c233`: **NOT READ**. Window 1 was void and window 2 (the one re-attempt) was inadmissible

This is a hand-authored, unsealed note (`AGENTS.md`). QE4 was the only hop running (width 1). Every number was
read from the files in `probe/w1/` and `probe/w2/`. **None is estimated, and no grade is drawn from either
window.**

## Method: QE3's, unchanged (`probe/preregistration.txt`, committed `9ed227fa` before window 1)

- **Set:** `tools/grugops/qe-hop-integrity.test.ts` only.
- **Arms:** three out-of-tree `git archive cfcd59af` trees in the session scratchpad, with the shared
  `node_modules` symlinked. Each holds 2641 note files.
  - **H** is the file at `8fd0c233` (sha256 `6b8d03bd…0e772b2a`, `cmp` 0 to `git show 8fd0c233:<file>`), 32
    tests.
  - **B** is the same tree with the one-assertion placeholder at that path. It is `cmp` 0 to `qe-ABC-105`'s and
    QE3's.
  - **T** is a twin of B. `/usr/bin/diff -r` reports them identical.
- **Harness, used in place and unchanged:**
  - `secnfr-ABC-144-window-b/probe/lane144b.mjs` (sha256 `652b7793…c80c7c`), with `CONDS=B,H,T`, `ROUNDS=9`
    (round 0 discarded, n = 8), rotated order, `GAP=0`.
  - Gate `secnfr-ABC-152-window/probe/gate.sh` (sha256 `5335905a…352b6f`): thermal 0, no vitest runner, 4 × 15 s,
    `MAXLOAD=""` (load1 logged and not gated), `GMAX` 45 min.
- **Window and readout:** `probe/window-qe4.sh` and `probe/readout-qe4.py` are QE3's scripts. The window script
  changes only CTX, TAG, the console name and a comment. The readout changes only the TSV name.
- **Stack:** node v26.11.0, vitest 4.1.11, Mac15,13 (Apple M3), AC power, `lowpowermode 0`, 0 `VITEST_` env vars.
- **Fixed before window 1:**
  - Any discarded round voids the window (n must be 8).
  - Admissible means a twin CPU median ≤ 1.5 % of B, with the sign test at chance.
  - One window, plus one re-attempt if the first is void or inadmissible. No pooling and no third window.
- **Addendum.** It was written at 10:13:14Z, after window 1 and before window 2, and committed as `5a3748a3`. It
  changes no rule.

## Windows

| window | gate | lane | load1 at runs | foreign / thermal / power | discarded | state |
|---|---|---|---|---|---|---|
| w1 | passed 10:11:42→10:12:27Z | 10:12:27–10:12:50Z | 4.87–5.28 | **the grugops kit's own `vitest run`** (`~/Projects/public/grugops`, another session) from 10:12:41Z, 1–5 runner processes / 0 / AC | **6 of 8** (rounds 3–8) | **VOID** (n = 2; its summary is not used) |
| w2 | passed 10:13:21→10:30:00Z (the kit runner was in 59 gate rows; the last gate row with it was 10:28:59Z, and the last sampler row 10:29:09Z) | 10:30:00–10:30:20Z | 3.30–3.91 | 0→0 / 0→0 / AC on every run; sampler 0 bad over the lane span | 0 | **INADMISSIBLE**: twin CPU median **+0.010 s = 1.75 %** of the 0.570 s base (> 1.5 %); sign 5/8 (p 0.727) |

**Under the pre-registration, `N8-LANE` is NOT READ by this hop.** No third window was run.

## What window 2 read: no state, listed as read and not graded

| arm / delta | CPU | wall |
|---|---|---|
| B median | 0.570 s | 0.420 s |
| H median | 0.950 s | 0.705 s |
| T median | 0.580 s | 0.425 s |
| twin T − B: median, sign, R | +0.010 s (1.75 %), 5/8, R 0.030 s | +0.010 s (2.38 %), 5/8, R 0.020 s |
| treatment H − B: median, interval x(2)..x(7) | +0.370 s, +0.370..+0.400 | +0.290 s, +0.280..+0.300 |

- **Sorted twin CPU deltas:** −0.02, −0.01, 0.00, +0.01, +0.01, +0.03, +0.03, +0.06.
- **Sorted treatment CPU deltas:** +0.37 (×5), +0.40, +0.40, +0.41.
- Under `ADR-0035` decision 1, an inadmissible set has no state. **These numbers are not a MET, and they are not
  a margin.** They are not pooled with anything, and QE does not grade 650 ms from them.

## Per-test in-worker durations (report only)

These come from window 2's last H run (round 8, `probe/w2/h-last-run.json`). They are in-worker wall
milliseconds from **one** run, so they are not CPU and not a paired delta.

- `A9` "--sweep lists ABC-073" (the first `plainSweep()` call): **110.4 ms**.
- `A3` "coverage() over EVERY real note" (the first `allNotes()` call): **109.0 ms**.
- `A4` "prints each count line…" (reuses both memos): **17.2 ms**.
- The other 29 tests take ≤ 4.4 ms each.
- The file total is **273.8 ms**. QE3's run at `db1cfb6c` read 538.3 ms, with its 5 reads at 499.5 ms.

## `QE-105-ab` (INFO, method; Architect/Design's under `ADR-0035`)

`/usr/bin/time -p` reports CPU in 10 ms ticks. On this set the B median is about 0.57 s, so the 1.5 % twin limit
is **8.6 ms, which is under one tick**. Any twin median of ±0.010 s is therefore inadmissible, and only a median
of 0.000 or ±0.005 s passes.

Two of the four non-void windows on this set came out inadmissible at almost the same value: QE3 w1 at +1.74 %
and QE4 w2 at +1.75 %. QE reports this and does not change the rule.
