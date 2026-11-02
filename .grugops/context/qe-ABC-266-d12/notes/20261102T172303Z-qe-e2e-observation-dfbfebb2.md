---
id: 20261102T172303Z-qe-e2e-observation-dfbfebb2
kind: observation
by: qe-e2e
at: 2026-11-02T17:23:03Z
verified_by: 
confidence: high (artifact list; recorded as an observation because an artifact-ref needs a §14-gate run id this probe has none of)
refs:
  - ABC-266
  - qe-ABC-266-d12
  - grugops/qe-ABC-266-d12
  - b082549a
  - d7aaea5e
  - qe-ABC-266-d12/20261102T172016Z-qe-e2e-decision-6231db75
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-observation-cc1de664
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-decision-9f9aeb87
  - ADR-0062
  - 28ad3a8d
  - EPIC-011
supersedes: 
seal: sha256:fe08f216d5561979cb03e9e65de343ea23a31f305892bf3fd646ea5eceeb937b
---

# Artifacts of qe-ABC-266-d12: the D12 probe prototype, its scratch edit, the raw run and the grader

## Artifacts (this task's `raw/`)
- `probe/scratch-edit.diff`: the one scratch edit to the `28ad3a8d` tree, `adoptTable` with D4's contract. It was applied only in the session scratchpad and never in a worktree `src/`.
- `probe/driver.mjs`: the driver for T1 on the main thread, the 4- and 12-pools (D3–D6), the corpus build and sample, and the host readings.
- `probe/worker.mjs`: the worker.
- `probe/analyse.mjs`: the grader, which applies the sealed rule.
- `probe/seal.mjs`: the sealer (`admitAndAppend`; `at` from `date -u`).
- `out/full.jsonl`: the measured run, 169 lines (corpus, start, warm-ups, 120 gos, 40 blocks, 2 phases, done).
- `out/analysis.json`: the grader's output.
- `out/smoke.jsonl`: the pre-seal smoke on the non-corpus board.
- `out/window.txt`: the run's UTC start, end and exit code.
- `notes/`: the note bodies as sealed.

## Reproduce
`git archive 28ad3a8d src package.json tsconfig.json | tar -x -C <scratch>/tree`, then `patch -p1 -d <scratch>/tree < scratch-edit.diff`, then `flock <lock> timeout 600 node driver.mjs <scratch>/tree <out.jsonl> full` and `node analyse.mjs <out.jsonl>`. Depths vary by ±1 on timing; the sealed reading is `out/full.jsonl`.

## Hop hygiene
- The scratch tree and outputs were deleted at the end of the hop. No process is left running: the pools were `terminate()`d and the process exited 0.
- No process was killed. No push, merge, force, amend or rebase.
- Commits on `grugops/qe-ABC-266-d12`:
  - claim `b082549a`;
  - pre-registration `d7aaea5e`;
  - results and notes in the following commits.

## For the Orchestrator
- Route to the Architect, who re-proposes before any build (ADR-0062 D12, MISS).
- Board: no move by this hop. `ABC-266` does not enter build on ADR-0062 as written.

## Scope
Records and scratch only.

## Risks
None beyond the decision note's.
