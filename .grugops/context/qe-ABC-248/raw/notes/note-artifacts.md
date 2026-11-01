# `qe-ABC-248` artifacts: branch `grugops/qe-ABC-248` (from `18bad5fb`), PREREG `af00650c`, raw evidence and scripts under `.grugops/context/qe-ABC-248/raw/`

- **Branch:** `grugops/qe-ABC-248`, worktree `.claude/worktrees/qe-ABC-248`, from the SE's tip `18bad5fb`.
  - Code under test: `71700836`. Base: `main` `46365ed0`.
  - Nothing was pushed and nothing was merged.
- **Files edited:** none under `src/`, `tools/`, `data/` or `plans/board.md`.
- **`raw/PREREG.txt`:** lists, rules and runner hash, committed as `af00650c` before any run.
- **`raw/qe-scripts/`:**
  - `mut.mjs` — QE's kill runner.
  - `parity.mjs`
  - `census.mjs` and `census-table.mjs` — A7 and non-vacuity.
  - `helpers.mjs` — A4 helper identity.
  - `names.mjs` — A3.
  - `g8.mjs`, `host.mjs`, `clear.mjs`, `waitpid.mjs` — `qe-ABC-246`'s, unchanged.
  - `lane.mjs` and `readout.mjs` — `qe-ABC-244`'s. `lane.mjs` has its file set changed.
  - `seal.mjs`
- **`raw/kill/`:** `kill-{B,H}-{uci,nm}.jsonl`, `parity-uci.out`, `parity-nm.out`, `run-k.sh`.
- **`raw/census/`:** `census-{B,H}.tsv`, `probe-{B,H}.txt` (`insideNull` / `underNull` / A4-a2 info line),
  `census-table.out`.
- **`raw/deep/`:** `escaped.txt` (4 passed), `unescaped.txt` (241 skipped, rc 0), `unset.txt`.
- **`raw/p2/`:** `kill-H-p2.jsonl`, `p2.log`, `qpathoff-npm-test.txt`.
- **`raw/gates/`:** `lint.txt`, `typecheck.txt`, `build.txt`, `skip.txt`, `inv.txt`.
- **`raw/a4/`:** `helpers.txt`, plus the A5 and pinned loop bodies at B and at H (deep block, de-indented).
- **`raw/g8/`:** `g8.log`, `g8-wait.log`, `stdout.txt`, `g8-perfile.txt`, `names.txt`, `pre-g8-top.txt`, a tail of each
  run, and the `last-run.json` hashes.
- **`raw/n8/`:** `n8.tsv`, `readout.txt`, `stdout.txt`, `wait.log`.
- **Commands run:**
  - `npm run lint`, `npm run typecheck`, `npm run build`.
  - `npm test`: ×6 in `G8`, ×6 in P-2, and 1 capture re-run.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
  - `node tools/grugops/lane-inventory.js`.
  - `node_modules/.bin/vitest`, for the per-file kill runs, the census, the deep lane and `N8-LANE`. Never npx.
- **Not run:** coverage (not asked), any `*_DEEP` lane other than ruling 6's describe, and the deep lanes against the P-2
  survivors.
