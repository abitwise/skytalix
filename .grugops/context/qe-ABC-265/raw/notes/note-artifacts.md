# qe-ABC-265 host, window and artifacts (filed as observation; an artifact-ref needs a gate_run this hop has not got)

- **Branch:** `grugops/qe-ABC-265` in worktree `.claude/worktrees/qe-ABC-265`, from `grugops/ABC-265` `cad6ae13`. Code `e5694864`, base `main` engine `94be445f`. Claim commit `bf484356`, then this records commit. Not pushed, not merged. No `src/` file and no test file was edited. The test count stays 2 387.
- **Trees:** base = `git archive 94be445f`, head = `git archive e5694864`, P (the plant copy) = another `git archive e5694864`. Each has its own copied `node_modules`, under the session scratchpad (`…/scratchpad/q265/`). P's `src/` was diffed equal to head's after every plant batch.
- **Window:** claim 15:30:35Z. A3 smoke 15:34–15:42Z. PREREG sealed 15:39Z. Gates 15:43–15:49Z. Deep lanes, G7, A3 and plants 15:50–16:29Z. G6 and G11 16:29:47–16:39:21Z. Extra A3 reads on QP2, QP3 and QP6 after it. All UTC, 2026-11-02.
- **Host:** load1 1.3–2.9 during the untimed batches. Another agent's probe runs shared the host between my runs, under the same lock. G6 reads were taken at load1 0.42–0.98 and Tctl 39.0–44.6 °C before each read.
- **Lock:** every test, build and engine run was `flock host-test.lock <cmd>`, one at a time, one core. Nothing of mine is left running.
- **raw/ of this task:**
  - `scripts/`: `a3q.mjs` (QE's A3), `plant.py`, `plants.sh`, `gates.sh`, `batch2.sh`, `g7.mjs`, `edge.mjs`, and qe-ABC-264's `g6.mjs`, `host.mjs`, `timed.mjs`, `grade56.mjs` and `seal.mjs`, unchanged;
  - `a3/` (`a3.txt`, `a3-quick-smoke.txt`);
  - `gates/` (lint, typecheck, build, `g8/`, skip count, integrity, inventory, G9, tests touched);
  - `deep/` (each lane's summary and verbose lines);
  - `g6/` (`g6.jsonl`, `g11.jsonl`, `grade.json`, `wait.log`, `start.txt`);
  - `g7/g7.jsonl`;
  - `plants/` (the summaries, each plant's diff line and lane output);
  - `edge/edge.jsonl`;
  - `notes/` (the note sources and specs).
