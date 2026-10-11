---
id: 20261011T111107Z-software-engineer-artifact-ref-abc147-branch-probe-and-raw-files-a0414b23
kind: artifact-ref
by: software-engineer
at: 2026-10-11T11:11:07Z
verified_by:
confidence: high
refs:
  - ABC-147
  - plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
  - plans/traceability.md
supersedes:
---

# `ABC-147` artifacts: branch `grugops/ABC-147-vitest-overhead-probe`, from `63ac790f`

This note is hand-authored and unsealed. Not merged, not pushed.

- **Commits:**
  - `d152298f`: `METHOD.md`, `analyze.mjs` and `a147-lane.mjs`, **before the first graded run**;
  - `188cb6c3`: the `A2` scripts, before any `A2` run;
  - the delivery commit: these notes, `probe/raw/`, the scheduling-gate edits to both drivers, the
    ticket's § Delivery, and one trace row appended at the end of `plans/traceability.md`.
- **Probe:** `.grugops/context/ticket-to-pr-ABC-147/probe/`.
  - `METHOD.md` and `analyze.mjs`.
  - `a147-lane.mjs`. Command: `REPO=<worktree> OUT=<dir> START=12 ROUNDS=6 WAIT_LOAD=6 node a147-lane.mjs`.
  - `workload.mjs`, `a2-node.mjs`, `a2.probe.test.mjs` and `vitest.probe.config.mjs`.
  - `a2-pairs.mjs`. Command: `REPO=<worktree> OUT=<dir> WORK=E,S PAIRS=5 WAIT_LOAD=6 node a2-pairs.mjs`.
- **Raw:** `probe/raw/`.
  - every lane run in `a1-lane.tsv.txt`;
  - per-run bucket JSON, `a1-<round>.json.txt`;
  - `a1-summary.txt`;
  - one hung run's output and one good run's output;
  - the ungraded feasibility output;
  - the `A2` pairs and their summary;
  - `a3-estimate.txt`.
  - The raw `.cpuprofile` files (~13 MB a run) were analysed and deleted. They were not kept.
- **Fences (`A5`):** `git diff --name-only 63ac790f` lists only `plans/` and `.grugops/` paths.
  - **0** under `src/`, `tools/` or the root;
  - **0** changes to `package.json` or `vitest.config.ts`;
  - `plans/board.md` is untouched.
- **Tests:** none added, none changed. 0 files, 0 tests and 0 spawns added to the lane.
