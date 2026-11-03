# arch-ABC-236 probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `main` `70db0e7f` (`src/` tree `58fa3eb4`, futility in force; the tree
  `ADR-0063` and `ADR-0065` measured), unpacked into a scratch directory outside the repository; deleted after.
- `python3 patch_236.py <root>`: root aspiration windows in scratch `src/engine.ts` only (`runIteration` takes a window
  and reports a fail; `aspirate` widens; knobs and counters in an exported `ASP`). With `on: 0` it is `main`, node for
  node (the door reproduced `ADR-0061` d9's / `ADR-0065`'s counts exactly). Then copy `probe.ts` into `<root>`.
- `job.sh`: one job; ids `DOOR`, `A25`, `A50`, `A100`, `A50F`; every head runs against `DOOR` in `chooseMove`.
- `batch1.sh` (door check, pay gate on six roots at d8, rates at d7 over the 190, reach at 47 000), `batch2.sh`
  (safety: zugzwang, `G1`, mate floor d5 / d6, drift d5 / d6 with A2), `batch3.sh` (reports: d7, d9, reach at 20 000).
  PREREG `…69cfcb4a` was sealed and committed (`d5d360e1`) before batch 1.
- Each batch ran as `flock <host-test.lock> timeout 3000 bash batchN.sh <root> <out>`, one job at a time, each job
  under `timeout 600`. Deterministic counts only; no timing is read.
- Outputs: `out1/` (13 jobs), `out2/` (26), `out3/` (12), each with `exits.txt`; all 51 exit 0.
