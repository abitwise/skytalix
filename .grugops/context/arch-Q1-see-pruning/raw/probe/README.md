# arch-Q1-see-pruning probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `main` `dc7dc15d` (`src/` tree `4cb84035`: E1 taper + ABC-274 packed
  blend, futility in force), unpacked into a scratch directory outside the repository; deleted after.
- `python3 patch_q1.py <root>`: `see()` / `isLosingCapture()` (arch-ABC-234's `patch_234.py` code, unchanged) and a
  scratch `Q1` knob record in `quiescence.ts`; the quiescence rule in `quiesce`; the main-search rule after the futility
  skip in both `negamax` bodies; counters; audit marks; `probeNode` in `search.ts`. Every knob off = `main`, node for
  node. Then copy `probe.ts` into `<root>`.
- `job.sh`: one job; ids `DOOR`, `QS`, `QSc`, `QSM`; `X@Y` runs head X against door Y.
- `batch1.sh` (SEE check, pay gate, premise counters), `batch2.sh` (safety gate), `batch3.sh` (reports, audits).
  PREREG `…1f71e417` was sealed and committed before batch 1.
- Each batch ran as `flock <host-test.lock> timeout 1800 bash batchN.sh <root> <out>`, one job at a time, each job
  under `timeout 600`. Deterministic counts only; no timing is read.
- Outputs: `out/<id>-<mode>[-<env>].out` and `out/exits.txt`.
