# qe-ABC-254-a4v2 artifacts: branch, commits, scripts, raw files and hashes

QE/E2E, task `qe-ABC-254-a4v2`.

## Scope
Pointers only. The evidence is in the timing and host notes of this task.

## Branch and commits
- Branch `grugops/qe-ABC-254-a4v2` from `grugops/qe-ABC-254-a4` (`c5da6514`), worktree `.claude/worktrees/qe-ABC-254-a4v2`. Not pushed, not merged.
- `af26e437`: claim. `acc092ca`: PREREG `…a1136cf6` and scripts, before any timed run. The evidence and notes commit, and the done move, follow.

## Trees
- `git archive 09d1f675 src package.json` (B) and `git archive 600d8de3 src package.json` (H), into the scratchpad `qe-254-a4v2/trees/{B,H}`.
- Production difference: `src/legal.ts` only.

## Scripts (`raw/qe-scripts/`, sha256 prefixes, unchanged since the PREREG)
`a4v2.mjs 764b75e474ee17cc`, `host.mjs d2b80f7823dc3b0a`, `probe.mjs a9742d21999959ae`, `analyse.mjs fe22e5a20ec8fe15`, `grade.mjs 9d74bc7b59046c24`, `run.sh 5cede7603e1eab03`, `seal.mjs ef92d4298f9ed71c`. Test-only: `test/stub-probe.mjs 7a2fa7fd36527719`, `test/grade-cases.mjs e5fd4ce27c4efbd0`.

## Raw (`raw/a4/`)
- `a4.jsonl` `2d404bd8011b4289`: every attempt, admitted or discarded, with per-run host readings;
- `analysis-main.jsonl` `f333f6907dad93ed`;
- `grade.json` `8be96d1f27b9a176`;
- `times.txt` `aeddd7c931745492`.

There is no re-run file, because no re-run was owed.

## Commands
- `flock <scratchpad>/host-test.lock bash raw/qe-scripts/run.sh <scratchpad>/qe-254-a4v2 raw raw/qe-scripts`, run with `A4_PROBE` unset. The start event logs `probe.mjs`.
- `AT=$(date -u +%FT%TZ) node raw/qe-scripts/seal.mjs <worktree>/.grugops/context qe-ABC-254-a4v2 raw/notes/<spec>.json`.
