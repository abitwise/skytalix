# arch-E1 probe (scratch, reproducible)

- Base: `git archive HEAD src package.json` at `grugops/arch-E1` (from `main` `a2b593d5`; `src/` tree `58fa3eb4`, the
  tree `arch-next-pull` measured), unpacked into a scratch directory outside the repository; deleted after the readings.
- `python3 patch_e1.py <root>`: `E1CFG` in `src/evaluate.ts` (`on = 0` is `main`, node for node). Forms in
  `e1probe.ts`: BASE (`on 0`), L (phase 24 / 0, linear), P (phase 22 / 6, plateau).
- PREREG `…01c2d6a5` was sealed and committed (`b11b802f`) before batch A.
- `batchA.sh` (instrument check; the `G6` shape: `chooseMove` nodes to complete depth 7–9 on kiwipete, 7–10 on
  position-6; `search()` d8), `batchB.sh` (work proxy for BASE; mate floor, zugzwang, `G1`, static shapes, reach,
  drift for L and P; the evaluation instrument's skytalix side at 47 000 nodes for BASE, L and P), `batchC.sh`
  (`sf.py`, `arch-next-pull`'s, unchanged: Stockfish 19 depth 16 labels for L's and P's moves).
- **Reports added after the PREREG (decide nothing):** `batchD.sh` (`ADR-0061` decision 8's futility drift and mate
  floor re-read on each form's scale, BASE as the control) and `batchE.sh` (the default test lane on two full scratch
  copies, the patch with `on 0` and with `on 1` hard-wired; the reds in `on 1` only are the rows the evaluation moves
  when every path, the doors included, is tapered: an upper bound on migration).
- One counter-only fix after batch A: the mobility-squares counter's `sub` was missing (`reachPerCall` read 0 in batch
  A). No value is touched by it; batch B re-read BASE's counters with it. Marked in `patch_e1.py`.
- `batchE.sh`'s first attempt omitted `NODE_OPTIONS=--max-old-space-size=128` and the heap guard refused both runs
  (no test ran); the second attempt is the reading. Marked in the file.
- Each batch ran as `flock <host-test.lock> timeout 300 bash batchX.sh …`, every job under `timeout ≤ 290`. Batch walls:
  A 9 s, B 18 s, C 11 s, D 30 s, E 1 s (refused) + 19 s. Deterministic counts only; no timing is read.
- Outputs: `out/A-*`, `out/B-*`, `out/D-*`, `out/play-*.jsonl`, `out/sf16-LP.jsonl`, `out/eval-metrics-e1.json`
  (`analyze_e1.py`; BASE's labels are `arch-next-pull`'s `out/sf16.jsonl`), `out/E-lane-reds.txt`, `out/exits.txt`
  (every exit 0 except the refused lane attempt and the `on 1` lane's expected reds).
