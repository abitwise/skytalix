# bapm-ABC-239-close observation: the checks behind ABC-280's scope and acceptance (read from git at main ac55ddf6; nothing run)

BA/PM, task `bapm-ABC-239-close`. Every line below was read with git or grep. No test, build or tool was run.

- **No `src/`, `tools/` or config drift since the tool's base.** `git diff --stat a8fbade5 main -- src tools tsconfig.json biome.json vitest.config.ts package.json` is empty. So a cherry-pick of the four tool commits onto `main` `ac55ddf6` is expected to apply clean (expected, not tried). No `.pgn` path appears in `git diff --name-only a8fbade5 main`. So the own-games set the tool reads at `main` equals the set `se-ABC-239b` read, if every own PGN is tracked under a path that diff covers. That is why ABC-280 A6 reports equality with `10581fb5…`, and does not grade it.
- **The commits by file:**
  - `625b75fe`: `tools/tune/{pgn,tracer,tune,tune.test}.ts`, plus `biome.json` +1 and `tsconfig.json` +1 (`tools/tune/**/*.ts`).
  - `5ce4f870`: `tune.test.ts`.
  - `def26997`: `bounds.ts`, `tracer.ts`, `tune.test.ts` and `tune.ts`.
  - `8c03b713`: `bounds.ts` and `tune.test.ts`.
  - `954d44fb`: `src/evaluate.king-mobility.test.ts` only (`QE-270-e`: the `zeroed` helper also zeroes the `_QUEEN` pair). Excluded.
  - `26d06118`: `src/evaluate-params.ts`, `src/evaluate.taper.test.ts` and `src/evaluate.test.ts`. Excluded.
- **The tool does not need `954d44fb`.** The FEN source row needs `bounds.ts`'s FEN and row name literally in `src/evaluate.king-mobility.test.ts`. On `main`, grep finds both (3 matching lines). `954d44fb` changes only the `zeroed` helper.
- **The default lane collects the tool's test.** `vitest.config.ts` sets no `include`, and its `exclude` does not name `tools/`. `tools/grugops/qe-hop-integrity.test.ts` and `tools/opening-book/book.test.ts` already run there. In `tune.test.ts` at `8c03b713`, three `it` rows sit before `if (RUN_DEEP) {` (line 50): the source pins, the quiet filter's rules record, and the FEN source row. Every deep row is inside the `if`, so unset it is not registered (not skipped). Hence ABC-280 A3: N + 3, with the skip count unchanged.
- **The build excludes the tool.** `tsconfig.build.json` has `"files": ["src/uci.ts"]` and `"include": []`.
- **The emit stage writes `src/evaluate-params.ts` by default** (`tune.ts` header, line 20). Hence A6's "emit to a scratch path outside the tree" and A2's byte-equality.
- **Status precedent:** `ABC-210` (closed unmerged under S1) has `status: dropped`, `column: Done`. 20 pages use `dropped`, and 235 use `done`.
