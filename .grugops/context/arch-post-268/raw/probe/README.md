# arch-post-268 probe (scratch, reproducible)

- Base: `git archive e72487e1 src package.json` (`main`'s merge of `ABC-268`; `src/` tree `58fa3eb4`, equal to the
  branch point `56b3782d`), unpacked into a scratch directory outside the repository; deleted after the readings.
- `python3 patch_post268.py <root>`: `arch-ADR-0060-reopen`'s `patch_reopen.py`, re-anchored on today's call sites (each
  `lateMoveReduction` call now follows the futility skip), predicate and knobs unchanged; plus `probeAuditMark` /
  `probeNode` for `ADR-0061`'s cut audit (a null-window node is marked when, on a searched move, the head's reduction
  differs from the flat rule's). Defaults = `main`, node for node (the door reproduced `ADR-0061` d9's counts exactly).
- `probe.ts`: `arch-ADR-0060-reopen`'s driver, unchanged, plus `arch-phase2-p3`'s `audit` mode (re-keyed on the LMR
  mark) and an `auditLog` / `fired` reset in `setCfg`.
- `job.sh`: one job, ids `R0` (decision 1) and `DOOR` (`main`). `batch1.sh` (d8 nodes, drift both recursions),
  `batch2.sh` (reach, mate floor, zugzwang head + door, G1 head + door, report roots, firing), `batch3.sh` (audit,
  AUD=10), `batch4.sh` (diagnostic, added after batch 2's `zugzwang.004` miss: `zugd` at d10-13).
- Each batch ran as `flock <host-test.lock> timeout 300 bash batchN.sh <root> <out>`, each job under `timeout 300`.
  Wall: batch 1 13 s, batch 2 36 s, batch 3 21 s, batch 4 5 s. Deterministic counts only; no timing is read.
- Outputs: `out/<id>-<mode>[-<env>].out`, `out/exits.txt` (every job exit 0).
