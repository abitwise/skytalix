# se-ABC-280 artifact record: branch `grugops/ABC-280`, four tool commits, A1/A2/A7, the frozen sha for QE

Published as an `observation`, because an `artifact-ref` needs a §14 gate_run that this hop does not have (`se-ABC-239b` precedent).

- **Branch** `grugops/ABC-280` from `main` `dcc1bae0`, worktree `.claude/worktrees/se-ABC-280`. Not pushed, not merged.
- **Commits:** `fb69c017` (claim). Then the tool: `ee4c4c84` (from `625b75fe`), `66798b22` (from `5ce4f870`), `f831c04d` (from `def26997`) and **`edb9fddd` (from `8c03b713`), the code tip for QE**. Then the records commit.
- **A1:** `git diff --name-only main...HEAD`, outside `.grugops/`, `plans/` and `memory-bank/`, lists exactly seven paths: `tools/tune/{bounds,pgn,tracer,tune,tune.test}.ts`, `tsconfig.json` and `biome.json`. `git diff 8c03b713 HEAD -- tools/tune` is empty. `tsconfig.json` and `biome.json` each gain one line, `"tools/tune/**/*.ts",`, equal to `625b75fe`'s.
- **A2:** `git diff --stat main HEAD -- src` is empty. `git -c core.quotePath=false diff --name-only main HEAD | grep '^src/'` prints nothing. Zero production lines, so the UAT waiver applies.
- **A7:** `node tools/grugops/records-path-check.js --base main` exits 0 on the records commit. Host paths appear as `<scratch>` and `<worktree>` only.
- **Tests:** none written (test note 1). The tool's 3 default rows and 14 `TUNE_DEEP` rows land as they were.
- **Commands** (every run under `flock <scratch>/host-test.lock`):
  - `npm test` at the pre-ticket head and at the tip;
  - the skip-count capture at both;
  - `test-skip-integrity.js`;
  - `npm run lint`, `npm run typecheck` and `npm run build`;
  - the `TUNE_DEEP` lane;
  - `sha256sum -c` on the Lichess file;
  - `raw/scripts/run.sh <scratch> <worktree> <out>`, twice. It runs `tools/tune/tune.ts extract … --lichess …`, then `fit`, then `raw/scripts/emit-to.ts`, each stage under `timeout 1800` and `--max-old-space-size=3000`;
  - one comparison `emit-to.ts` with the commit string `8c03b713…`.
- **Not done (out of scope):** any fit of record, any game, `954d44fb`, `26d06118`, any `src/` change.
- **Remaining work:** the QE hop, A8 (`qe-e2e`), on `edb9fddd`; UAT is waived by A2. The board move In Development → In Review is the Orchestrator's, because this brief fences `plans/board.md`.
