# arch-ABC-234 probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `main` `17725732` (`src/` tree `58fa3eb4` = `e72487e1`'s, futility in
  force; the tree `ADR-0063` measured), unpacked into a scratch directory outside the repository; deleted after.
- `python3 patch_post268.py <root>` (arch-post-268's, unchanged), then `python3 patch_234.py <root>`: `see()` and
  `isLosingCapture()` plus quiescence counters in scratch `quiescence.ts`; `orderKey` / `orderMoves` take the node's
  position at all four call sites; knobs `see` (0 off / 1 after the killers / 2 after every quiet) and `seeMargin`;
  premise counters; the SEE audit mark. Defaults (`see: 0`) = `main`, node for node (the door reproduced `ADR-0061`
  d9's counts exactly). Then copy `probe.ts` into `<root>`.
- `job.sh`: one job; ids `DOOR`, `S1`, `S2`, `S1m`; `X@Y` runs head X against door Y.
- `batch1.sh` (SEE check, pay gate, premise counters, reach), `batch2.sh` (safety gate), `batch3.sh` (reports,
  audit, counters for S2 / S1m). PREREG `…9ac61a7a` was sealed and committed (`9ca30923`) before batch 1.
- `batch4.sh` (DIAGNOSTIC, written after the pay-gate miss; cannot change the verdict) runs on a second copy with
  `patch_diag_q1.py` applied on top (Q1: quiescence skips `see < 0` captures out of check), through `job_diag.sh`.
- Each batch ran as `flock <host-test.lock> timeout 3000 bash batchN.sh <root> <out>`, one job at a time, each job
  under `timeout 600`. Deterministic counts only; no timing is read.
- Outputs: `out/<id>-<mode>[-<env>].out` and `out/exits.txt` (42 jobs, every exit 0); `out4/` (8 jobs, every exit 0).
