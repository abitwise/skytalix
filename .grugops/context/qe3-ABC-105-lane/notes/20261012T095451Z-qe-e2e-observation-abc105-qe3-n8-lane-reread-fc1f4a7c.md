---
id: 20261012T095451Z-qe-e2e-observation-abc105-qe3-n8-lane-reread-fc1f4a7c
kind: observation
by: qe-e2e
task: qe3-ABC-105-lane
at: 2026-10-12T09:54:51Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - NFR-008
  - ADR-0035
  - QE-105-x
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T080100Z-qe-e2e-observation-abc105-n8-lane-narrow-set-met-7177253b
  - 20261012T091901Z-qe-e2e-decision-abc105-qe2-verdict-p-q-closed-3bc30c08
supersedes:
---

# QE3 `ABC-105` `N8-LANE` re-read at `db1cfb6c`: H − B +0.690 s CPU (+0.670..+0.700), twin R 0.020 s, admissible

Hand-authored and unsealed (`AGENTS.md`). QE was the only hop running (width 1). Every number below was read
from the files in `probe/`; none is estimated.

## Method: `qe-ABC-105`'s, repeated

- **Set:** `tools/grugops/qe-hop-integrity.test.ts` only (no `src/` file, so no `vitest related`).
- **Arms:** three out-of-tree `git archive db1cfb6c` trees with the shared `node_modules` symlinked.
  - **H** = the file at `db1cfb6c` (sha256 `5a9f0eb2…dc2e367a`, `cmp` 0 to `git show db1cfb6c:<file>`), 32 tests.
  - **B** = the same tree with `qe-ABC-105/probe/placeholder.test.ts` (one assertion) at that path.
  - **T** = a twin of B. `/usr/bin/diff -r` reports them identical.
  - The H arm holds 2636 note files (`find .grugops/context -path '*/notes/*.md'`).
- **Harness:** `secnfr-ABC-144-window-b/probe/lane144b.mjs`, in place and unchanged (sha256 `652b7793…c80c7c`).
  Settings: `CONDS=B,H,T`, `ROUNDS=9` (round 0 discarded, n = 8), rotated order, `GAP=0`.
- **Gate:** `secnfr-ABC-152-window/probe/gate.sh`, in place and unchanged (sha256 `5335905a…352b6f`). It is
  attempt 2's gate: thermal 0, no runner process, 4 × 15 s, load logged and not gated.
- **Logging and overlap:** load1, thermal, foreign runners and power are logged before and after every run, and
  the 5 s sampler ran throughout.
- **Readout:** `probe/readout-qe3.py`. It is `qe-ABC-105`'s `readout105.py` with two changes: the TSV name, and
  the expected H count (28 → 32). `probe/window-qe3.sh` is `window105.sh` with CTX, TAG, the console file name
  and the arm-tip comment changed.
- **Stack:** vitest 4.1.11, `pool: "threads"`, `maxWorkers: 2`, `viteModuleRunner: false`, node v26.11.0,
  Mac15,13 (Apple M3), AC power, `lowpowermode 0`, 0 `VITEST_` env vars.

## Windows: three attempts, one graded

| window | gate | lane | load1 at runs | foreign / thermal / power | discarded | state |
|---|---|---|---|---|---|---|
| w1 | passed 09:23:14→09:24:00Z | 09:24:00–09:24:23Z | 2.44–2.64 | 0 / 0→0 / AC on every run; sampler 14 rows, 0 bad | 0 | **INADMISSIBLE**: twin CPU median +0.010 s = 1.74 % of the 0.575 s base (> 1.5 %), sign 7/8 (p 0.070) |
| w2 | passed 09:25:16→09:26:01Z | 09:26:01–09:26:26Z | 2.90–3.85 | a foreign vitest (the grugops kit's own `vitest run` under `~/Projects/public/grugops`, another session) started in round 0, with 1–4 runner processes from then on | **8 of 8** | **VOID** (n = 0; the readout raises on the empty set; its summary is not used) |
| w3 | passed 09:26:58→09:53:42Z (waited out that runner; last foreign sample 09:52:53Z) | 09:53:42–09:54:05Z | 3.08–3.28 | 0→0 / 0→0 / AC on every run; sampler 0 bad over the lane span | 0 | **admissible**, graded below |

- **Pre-declaration.** Window 2 was declared before it started (`probe/w2-declaration.txt`, 09:25:11Z): one
  replication only, never pooled, and graded only if admissible.
- **Addendum.** When window 2 came back void, an addendum was written before window 3 started (09:26:50Z): one
  re-attempt, and no window 4. Window 3 is that re-attempt.

## Reading: window 3 (n = 8, k = 2)

| arm / delta | CPU | wall |
|---|---|---|
| B (placeholder) median | 0.570 s | 0.415 s |
| H (the file at `db1cfb6c`) median | 1.250 s | 0.980 s |
| T (twin) median | 0.575 s | 0.420 s |
| **twin T − B**: median, sign, R | +0.000 s (0.00 %), 2/8 (p 0.289), **R 0.020 s** | +0.000 s, 3/8, R 0.020 s |
| **treatment H − B**: median, interval x(2)..x(7) | **+0.690 s**, **+0.670..+0.700** | +0.560 s, +0.550..+0.570 |

- **Sorted twin CPU deltas:** −0.01, −0.01, 0.00, 0.00, 0.00, 0.00, +0.02, +0.03.
- **Sorted treatment CPU deltas:** +0.66, +0.67, +0.68, +0.69, +0.69, +0.69, +0.70, +0.70.
- **Provisional `F`:** 16 % × 0.570 s = 0.091 s.
- **Window 1, which has no state:** treatment +0.670 s (+0.660..+0.700), twin R 0.010 s. Under the
  2026-10-10 amendment, an inadmissible set's R is listed but not used.

## What drives it: per-test durations, read and not timed

These durations come from the vitest JSON of window 3's last H run (round 8, `probe/w3/h-last-run.json`). They are
in-worker wall milliseconds from **one** run. They are **not** CPU, and they are **not** a paired delta.

| test (line of the read in the file) | whole-tree real-notes reads | ms |
|---|---|---|
| `A4` "prints each count line…" (`--sweep` at 149, 157, 173) | 3 | 282.0 |
| `A9` "--sweep lists ABC-073" (141; **added by the fix**) | 1 | 109.4 |
| `A3` "coverage() over EVERY real note" (116; **added by the fix**) | 1 | 108.1 |
| the other 29 tests | 0 | ≤ 4.5 each |
| file total | 5 | 538.3 |

- **The five reads take 499.5 of the file's 538.3 ms** in that run. The two reads the fix added take 217.5 ms.
- **Across hops:** `qe-ABC-105` read +0.475 s at `60415a8a` (28 tests, 3 reads), and this hop reads +0.690 s at
  `db1cfb6c` (32 tests, 5 reads). That gap of +0.215 s compares two windows. It is **not** a paired reading of
  the fix's increment.
