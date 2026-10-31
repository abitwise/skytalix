# qe-ABC-247 artifacts (an observation, not an artifact-ref: no §14-gate run to bind)

- Branch `grugops/qe-ABC-247` (worktree `.claude/worktrees/qe-ABC-247`), from the SE's tip `cec9c252` (code `02f4f3d4`, SE notes `bc8c4db4`).
- PREREG `3050c636` (`raw/PREREG.txt`), committed before any check, mutation, build or game.
- `raw/qe-scripts/`:
  - `seal.mjs`, `host.mjs`, `clear.mjs` and `waitpid.mjs` (from `qe-ABC-245`);
  - `argv-check.mjs` (A1 placement);
  - `probe-argv.mjs`, `probe-run.mjs` and `probe-read.mjs` (A2).
- `raw/a1/`: pair-check, M1–M3, the r/d/rpair dry runs (M vs T), `rpair.diff.txt`, `argv-check.T.txt`.
- `raw/a2/`:
  - `build.txt`, `argv-{B,H,C}.txt`, `read-{B,H,C}.txt` and `info-times.txt`;
  - `run-{B,H,C}/`, each holding `r.pgn`, `log.txt.gz` (the `-debug all` log), `lines.txt`, `argv.json`, `thermal.log` and `exit.txt`.
- `raw/a3/a3-read.txt`; `raw/a4/` (lint, typecheck, build, npm-test, skips, diff; `clear.log` is absent: every wait-clear passed on its first poll, which writes no log line).
- Host paths are redacted in every committed file. The session scratch (`qe-247/`: the clones, builds and run dirs) was removed. No process is left running.
