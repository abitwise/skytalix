# qe-ABC-254-a4 artifacts: commits, raw logs, scripts (sha256), trees

QE/E2E, task `qe-ABC-254-a4`. All of these are on branch `grugops/qe-ABC-254-a4`, cut from `grugops/qe-ABC-254` at `15eadd7a`. Not pushed, not merged.

## Commits
- `3d201ec7`: claim the brief.
- `9f6e64b1`: PREREG sealed (`…2e86c6f1`) and the harness, before any timed run.
- The evidence and notes commit and the done move follow this note on the same branch.

## Raw (`.grugops/context/qe-ABC-254-a4/raw/`)
- `a4/a4.jsonl`: the main schedule. 54 runs plus wait, clear, pause and pair-void events.
- `a4/a4-rerun.jsonl`: the board re-run of kiwipete, position-6 and position-4. 42 runs plus events.
- `a4/analysis-main.jsonl`, `a4/analysis-rerun.jsonl`: `analyse.mjs` output (graded attempt per round).
- `a4/grade.json`: `grade.mjs` output, `"a4": "UNRESOLVED"`.
- `a4/times.txt`: the lock and schedule timeline.
- `a4/posthoc-info.txt`: the clear-only INFO medians. Not a grade.
- `qe-scripts/`, with sha256 prefixes as sealed in the PREREG: `a4.mjs ab613cf489873a86`, `host.mjs 5d59a3e4250faa90`, `probe.mjs a9742d21999959ae` (byte-identical to qe-ABC-254's), `analyse.mjs a67d2f38911acf6c`, `grade.mjs c290ab99a42f5448`, `run.sh 1ea0911bb1179574`, `seal.mjs ef92d4298f9ed71c`.
- `notes/`: note bodies and seal specs.

## Trees (scratchpad, not committed)
- `qe-254-a4/trees/B` = `git archive 09d1f675 src package.json`.
- `qe-254-a4/trees/H` = `git archive 600d8de3 src package.json`.
- They differ in `src/legal.ts`, plus two test files.
