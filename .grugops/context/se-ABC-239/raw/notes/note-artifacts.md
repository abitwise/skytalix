# se-ABC-239 artifact-ref: branch `grugops/ABC-239`, the tool commit, the candidate commit, files, tests and commands

- **Branch** `grugops/ABC-239` from `main` `441c547e`, worktree `.claude/worktrees/se-ABC-239`. Not pushed, not merged.
- **Commits:** `c93d9319` (claim), `9eeb0314` (tools/tune, tsconfig and biome includes), `03fcaaa0` (the tool test's S3 fix; the **green** tool-only tip: `npm test` 2 589 / 2 589), `da3f8599` (the **CANDIDATE, red**: the emitted `src/evaluate-params.ts`, the provenance row, and `ABC-215` A2's rule rows retired), then this records commit.
- **Files added:** `tools/tune/tracer.ts`, `tools/tune/pgn.ts`, `tools/tune/tune.ts`, `tools/tune/tune.test.ts`.
- **Files changed:** `tsconfig.json`, `biome.json` (+ `tools/tune/**/*.ts`), `src/evaluate-params.ts` (emitted, sha256 `71610196…58e2`), `src/evaluate.test.ts` (A2 rule row retired; provenance describe: 2 rows), `src/evaluate.taper.test.ts` (the two endgame-half rule rows retired).
- **Tests added:** `tools/tune/tune.test.ts`, 1 default-lane source row plus 10 `TUNE_DEEP=1` rows. They cover: the identity gate over G3's 184 and over extract's rows; comment blindness; the export's known issue; filter counts with the reader-drop STOP; the sha256 refusal writes nothing; leakage runs one way; the zstd stream; split disjointness; B-T3 determinism with emission round-trip and values sha. Plus the 2 provenance rows in `src/evaluate.test.ts`.
- **Commands** (each under `flock <host-test.lock>`):
  - `node --max-old-space-size=3000 tools/tune/tune.ts extract <out> --lichess <scratch>/lichess/lichess_db_standard_rated_2017-03.pgn.zst`, then `… fit <out>`, then `… emit <out>`, each under `timeout 1800`, run twice by `raw/bt3.sh`;
  - `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune` (11 / 11);
  - `npm test` (base table 2 589 / 2 589; candidate 93 failed / 2 489 passed);
  - `npm run lint`, `npm run typecheck` and `npm run build` (clean; `dist/` holds no tools code, and its only "tune" text is the header comment).
- **The manual data step:** `curl` the pinned URL into `<scratch>/lichess/` (kept outside the repository), then `sha256sum -c` against `b319297e…4320`: OK.
- **Remaining work:** the Architect's rulings (failed-attempt note); then the re-pin and F3 refit hop; then the deep lanes, B-T4–B-T6 and QE's B-T7/B-T8. The freeze for B-T7/B-T8 also waits on the owner's ADR-0069 answer (Orchestrator ruling).
