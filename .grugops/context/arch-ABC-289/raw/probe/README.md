# arch-ABC-289 probe (scratch, reproducible)

- Base: `git archive 0cc9afd1 src package.json`, `main` with Q1 (`ABC-279`), the `ABC-283` bundle and `ABC-271`, unpacked
  into a scratch directory outside the repository.
- `python3 patch_q2.py <root>`: a scratch `DP` knob record in `quiescence.ts`, the rule in `quiesce`'s loop, counters, an
  audit mark, and a call counter in `see.ts`. With `DP.d` 0 it is `main`, node for node. Then copy `probe.ts` into `<root>`.
- `probe.ts` derives from `arch-Q1-see-pruning`'s driver: the SEE check and the main-rule audit are gone; `premise`,
  `fire100` and `doors` are new; `mate` reads both recursions.
- `job.sh`: one job; ids `DOOR`, `D300`, `D200`, `D100`, `D200c`, `D200e`, `D200b`.
- `batch1.sh` (instrument, premise, pay gate), `batch2.sh` (safety gate), `batch3.sh` (reports, for the forms it is given).
- Each batch runs as `flock <host-test.lock> timeout 1800 bash batchN.sh <root> <out>`, one job at a time, each job under
  `timeout 600`. Deterministic counts only; no timing is read.
- Outputs: `out/<id>-<mode>[-<env>].out` and `out/exits.txt`.
