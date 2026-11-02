---
id: 20261102T174241Z-architect-design-observation-ac6714ff
kind: observation
by: architect-design
at: 2026-11-02T17:42:41Z
verified_by: 
confidence: high (artifact list)
refs:
  - ABC-266
  - arch-ABC-266-repropose
  - grugops/arch-ABC-266-repropose
  - 6413f91f
  - 6e749801
  - 7f110a31
  - arch-ABC-266-repropose/20261102T173019Z-architect-design-decision-3c920b97
  - ADR-0062
  - ADR-0058
  - ADR-0057
  - ADR-0044
  - grugops/ABC-265-fix
  - 28ad3a8d
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-decision-9f9aeb87
  - qe-ABC-266-d12/20261102T172256Z-qe-e2e-observation-cc1de664
  - ABC-257
  - EPIC-011
supersedes: 
seal: sha256:103bf34126ad53c57203d546dc65734ade9eb0ca762d7dadc681cb96093df2a2
---

# Artifacts of arch-ABC-266-repropose: probe scripts, scratch edit, raw runs, grader output

Recorded as an observation: an artifact-ref needs a §14-gate run id, and this probe has none (`qe-ABC-266-d12` precedent).

## In this task's `raw/`
- `probe/edit.py`: the scratch knobs (D, S, P), all off by default, applied on top of `qe-ABC-266-d12`'s `scratch-edit.diff` (`adoptTable`). Applied only in the session scratchpad.
- `probe/driver.mjs`, `probe/worker.mjs`: built on D12's driver and worker, with the same corpus, sample, pool, D5 order and D6 rule.
- `probe/ident.mjs`: the T1 identity check.
- `probe/analyse.mjs`: the grader.
- `probe/seal.mjs`: the sealer (`admitAndAppend`, contextRoot is this worktree's `.grugops/context`).
- `out/*.jsonl`: every run (ref, r1, r2, confirm-T4SDP, r2b, r3, r4, and both smokes). `out/analysis.json` is the grader's output, and `out/window.txt` holds the UTC windows and exit codes.
- `notes/`: the note bodies as sealed.

## Reproduce
1. `git archive 28ad3a8d src package.json tsconfig.json | tar -x -C <tree>`
2. `patch -p1 -d <tree> < ../qe-ABC-266-d12/raw/probe/scratch-edit.diff`
3. `python3 edit.py <tree>`
4. `flock <lock> timeout 300 [taskset -c 0-3] node driver.mjs <tree> <out> run <set> <movetime> <passes>`
5. `node analyse.mjs ref.jsonl <runs…>`

## Hygiene
- The scratch tree was deleted at hop end. The pools were `terminate()`d, and every process exited 0.
- No process was killed.
- No push, merge, force, amend or rebase.
