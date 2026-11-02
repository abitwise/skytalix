# arch-ABC-233 probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `main` `60b76b52` (`src/` tree `58fa3eb4` = `e72487e1`'s, futility in
  force), unpacked into a scratch directory outside the repository; deleted after the readings.
- `python3 patch_post268.py <root>` (arch-post-268's, unchanged), then `python3 patch_233.py <root>`: the history
  knobs in both recursions (table, d² bonus / malus with gravity 16 384, cleared per search, read after the killers;
  `hhIndex` cft / ft / pt, `hhMalus`, `hhRoot`), cutoff and order counters, and the history audit mark (with a table
  snapshot). Defaults (`hh: 0`) = `main`, node for node (the door reproduced `ADR-0061` d9's counts exactly).
- `probe.ts`: arch-post-268's driver plus the history audit (snapshot loaded before the head's re-search), the cutoff
  counters in `fire`, and a `table` mode (A2's shape). Then copied into `<root>`.
- `job.sh`: one job; ids `DOOR`, `H1`, `H0`, `H2`, `H3`, `H1nr`, and `P1H1` (ADR-0060 decision 1 over H1); `X@Y` runs
  head X against door Y.
- `batch1.sh` (instrument check, pay gate, reach), `batch2.sh` (safety gate), `batch3.sh` (reports, audit, table),
  `batch4.sh` (DIAGNOSTIC, added after the pay-gate miss: d10 nodes; P1 over H1). PREREG `…4d5a0fe3` was sealed and
  committed (`ec2ed472`) before batch 1.
- Each batch ran as `flock <host-test.lock> timeout 300 bash batchN.sh <root> <out>`, each job under `timeout 300`.
  Wall: 33 s, 21 s, 127 s, 58 s. Deterministic counts only; no timing is read.
- Outputs: `out/<id>-<mode>[-<env>].out`, `out/exits.txt` (66 jobs, every exit 0). `../s-prime-dry-run-1810.txt`:
  `rating.ts r … --elo 1810 --dry-run` at `e72487e1`, host paths redacted.
