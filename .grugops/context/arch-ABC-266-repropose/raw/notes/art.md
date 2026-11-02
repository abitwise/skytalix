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
