# arch-next-pull probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `main` `a6039c5b` (`src/` tree `58fa3eb4` = `e72487e1`'s, futility in
  force), unpacked into a scratch directory outside the repository; deleted after the readings.
- `python3 patch_post268.py <root>` and `python3 patch_233.py <root>` (both `arch-ABC-233`'s, unchanged), then
  `python3 patch_joint.py <root>`: `ADR-0060` decision 11's history term inside the log-table predicate (knobs `hT`,
  `hLess`, `hZero`, `hMore`, `hNegCap`; all off by default). `probe.ts` is `arch-ABC-233`'s, unchanged.
- `job2.sh`: one job, forms composed from components (H1, R0, t1–t4); ids `DOOR`, `H1`, `P1H1`, `J1`–`J4`; `X@Y`
  runs head X against door Y.
- PREREG `…4de572aa` was sealed and committed (`b6deb4e4`) before batch A.
- `batchA.sh` (instrument check, `A4` (a) against H1 and `main`, reach), `batchB.sh` (drift against H1 and `main`,
  mate floor, zugzwang, `G1`), `batchC.sh` (the pre-registered `zugd` report, plus `diag.ts`, a DIAGNOSTIC added after
  batch B on the 69 cp drift row), `batchE.sh` (the evaluation-lever probe: `evalprobe.ts` at 47 000 / 94 000 /
  188 000 nodes on `positions.jsonl`, then `sf.py`, Stockfish 19 depth 16, 8 workers at Threads 1).
- Each batch ran as `flock <host-test.lock> timeout 300 bash batchX.sh …`, each job under `timeout ≤ 300`. Batch
  walls: 35 s, 26 s, 6 s, 47 s (≈ 2 min of the 30 min cap). Deterministic counts only; no timing is read.
- `analyze_eval.py` had one scoping bug at the first run (a `NameError`, `p` out of scope in the per-budget loop);
  it was fixed by iterating `zip(labels, plays)` and no metric changed. The fix is marked in the file.
- Outputs: `out/<id>-<mode>[-<env>].out`, `out/exits.txt` (every exit 0), `out/play<N>.jsonl`, `out/sf16.jsonl`,
  `out/eval-metrics.json`, `out/diag-f3h4.out`. The positions come from `qe-EPIC-010-close/raw/c3/d.pgn` (games 1, 9,
  17, …; after plies 20 / 40 / 60).
