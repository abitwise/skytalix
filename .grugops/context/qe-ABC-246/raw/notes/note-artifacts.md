# `qe-ABC-246` artifacts (committed on `grugops/qe-ABC-246` under `.grugops/context/qe-ABC-246/raw/`)

- `PREREG.txt`: the pre-registration, commit `c95e6324`, before any run.
- `qe-scripts/`:
  - `setup.sh`: the scratch trees H and B.
  - `plant.mjs`: none, HSCM and CLOCKWINSCM on the whole lane, at H and B.
  - `a4.mjs`: the comment-only diff check.
  - `a4-readings.ts`: the `ABC-170` A2 readings count.
  - `g8.mjs`: `qe-ABC-245`'s script with an optional order argument.
  - `names.mjs`: the tree regex.
  - Copied unchanged from `qe-ABC-245`: `host.mjs`, `clear.mjs`, `waitpid.mjs` and `seal.mjs`.
- `plants/`: `plant-{H,B}-*.red.txt`, `plants-summary-{H,B}.txt`, and `json-sha256.txt` (the json stayed in scratch).
- `a4/`: `a4-diff.txt` and `a4-readings.txt`.
- `gates/`: `setup.txt`, `diff.txt`, `lint.txt`, `typecheck.txt`, `build.txt`, `skip.txt`, `inv.txt` and
  `tree-integrity.txt`.
- `g8/`:
  - `g8.log`, `g8-wait.log`, `stdout.txt` and `pre-g8-top.txt`;
  - `g8-{1..6}-{base,head}.txt`, the full `npm test` outputs;
  - `g8-perfile.txt`, `counts.txt` and `names.txt`;
  - `last-run-sha256.txt` (the last-run.json files stayed in scratch).
- `notes/`: the note bodies and `spec.json`.
- Host paths are replaced by `<scratch>`, `<repo>` or `<worktree>`.
- Scratch `qe-246/` (H, B, P and the json outputs) was removed at the end of the hop. No process was left running.
