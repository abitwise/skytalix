# `ABC-244` QE artifacts: scripts, raw readings and commands (`.grugops/context/qe-ABC-244/raw/`)

- `PREREG.txt` and `frozen-mutants.json` (sha256 `9cbf279f…2fdb`), committed `5b4961e1` before any head run.
- `qe-scripts/`: `mutants.mjs`, `freeze.mjs`, `mut.mjs`, `parity.mjs` (A6); `census.mjs`, `census-table.mjs` (A7);
  `lane.mjs`, `readout.mjs` (A8, Linux port of `qe-ABC-177` `lane174.mjs`); `g8.mjs` (A9, from `qe-ABC-229`, plus child CPU);
  `host.mjs`, `waitpid.mjs`, `clear.mjs` (wait-clear by PID, never `while pgrep -f`); `seal.mjs`.
- `a6/`: `kill-base.jsonl`, `kill-head.jsonl`, `kill-t1u2at1000.jsonl`, `parity-base-vs-head.out`,
  `parity-base-vs-t1u2at1000.out`.
- `a7/`: `census-base.tsv`, `census-head.tsv`, `census-table.out`.
- `n8/`: `n8.tsv` (27 runs), `readout.txt`, `stdout.txt`.
- `g8/`: `g8.log.txt`, `g8-wait.log.txt`, `g8-perfile.txt`, `stdout.txt`, a tail of each run's output.
- `gates/`: `lint.txt`, `typecheck.txt`, `build.txt`, `skip-integrity.txt`.
- Scratch paths are written `<scratch>`. Trees were `git archive` out of the repository, so no `src/` file was touched.
- **Commands** (run from `qe-scripts/`, `QE244_NM` = the main checkout's `node_modules`):
  `node freeze.mjs B H ../frozen-mutants.json`; `node mut.mjs <tree> base|head <out> CONTROL <24 ids>`;
  `node parity.mjs <out> base head`; `node census.mjs <tree> base|head <out>`; `node census-table.mjs <out>`;
  `node clear.mjs n8-window <log> && node lane.mjs <trees> <out> 9`; `node readout.mjs n8.tsv`;
  `node g8.mjs <H> <B> <out>`. Gates were run in tree H as `npm run lint|typecheck|build`, and
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
