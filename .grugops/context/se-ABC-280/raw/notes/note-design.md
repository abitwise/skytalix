# se-ABC-280 decision: four separate cherry-picks (`-x`), no tool edit; A6 emits through the tool's own `emit()` to a scratch target

Software Engineer, task `se-ABC-280`, ticket `ABC-280`.

1. **Four cherry-picks, not one squash.** `625b75fe`, `5ce4f870`, `def26997`, `8c03b713` were picked in order with `git cherry-pick -x`, onto `main` `dcc1bae0` plus the claim. They applied clean, with no conflict. They land as `ee4c4c84`, `66798b22`, `f831c04d` and `edb9fddd`, and each message names its source commit. That keeps each commit's history and makes A1's byte-equality check direct. `954d44fb` and `26d06118` were not taken.
2. **No line of the tool changed.** `git diff 8c03b713 HEAD -- tools/tune` is empty.
3. **A6 without touching `src/`.** The CLI's `emit` stage always writes `src/evaluate-params.ts`. A6 needs the emission outside the tree, and the tool must stay byte-equal, so it cannot get an output flag. The scratch driver `raw/scripts/emit-to.ts` imports the tool's exported `emit(outDir, target, commit)` and passes a scratch target. The commit it passes is the one the CLI's `toolCommit()` would pass: `git log -1 --format=%H -- tools/tune`, which is `edb9fddd…`, with a clean-tree check first in `run.sh`. `extract` and `fit` ran through the CLI as written. `src/` was checked clean before and after each run.
4. **Why A6's sha256 is not `10581fb5…`.** The provenance header (d7) carries the tool's commit hash. Cherry-picking gives the tool a new commit (`edb9fddd`, not `8c03b713`). So the emitted file differs from `26d06118`'s in that one header line, even on identical data. A comparison emission checks this: `emit()` on the same fit output, with the commit string `8c03b713…`, gives a file byte-equal to `26d06118`'s (`10581fb5…95af`). That comparison is reported, not graded. The A6 emission of record is the one carrying `edb9fddd`.

Deviation from the plan: none in the code. Item 3 is a choice about how to run A6, which the ticket did not spell out.
