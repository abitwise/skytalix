# qe-ABC-301-s0 artifact record: branch grugops/qe-ABC-301-s0, records only, and the raw evidence

Sealed as an observation: an `artifact-ref` needs a section-14 `gate_run` this hop does not have.

- **Branch:** `grugops/qe-ABC-301-s0` from `grugops/ABC-301` `704e331f`, worktree `.claude/worktrees/qe-ABC-301-s0`. Not pushed, not merged. No `src/` or `tools/` file changed.
- **Commands, each under `flock <scratch>/host-test.lock`:** the mutant and plant loops `raw/batch1.sh`, `raw/batch2.sh`, `raw/batch4.sh`, `raw/batch5.sh`; `raw/batch3.sh`, which holds `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`, `npm run typecheck`, `npm run lint`, `npm run build`, `VITEST_MAX_WORKERS=1 npm test`, the skip-count capture, `test-skip-integrity`, the lane-cost loop and B-T1 (`node --max-old-space-size=3000 tools/tune/tune.ts extract <out dir> --lichess <file>`).
- **Raw:** `raw/formprobe.ts`, `raw/forms.jsonl`, `raw/summary.txt` (P1); `raw/plant.py`, `raw/plants.txt` (P2); `raw/emitprobe.ts`, `raw/emitprobe.clean.json`, `raw/bt1-extract.json`, `raw/b3.log` (P3); `raw/tracerdirect.ts`, `raw/tracerdirect.json`, `raw/mut301t.py`, `raw/toolmut.txt`, `raw/emitlane.txt`, `raw/gate-h5.txt` (the tracer and the emitter); `raw/mut301.py`, `raw/params.py`, `raw/fit-shape.txt`; `raw/lane-cost.txt`.
- **Left running:** nothing. Scratch copies are outside the repository.
