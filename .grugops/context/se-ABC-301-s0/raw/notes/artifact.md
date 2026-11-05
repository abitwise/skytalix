# se-ABC-301-s0 artifact record: branch grugops/ABC-301, commits 57e942fb (rows) and df7d07a2 (tool), raw evidence

Sealed as an observation: an `artifact-ref` needs a section-14 `gate_run` this hop does not have.

- **Branch:** `grugops/ABC-301` from `main` `bbd0d54a`, worktree `.claude/worktrees/se-ABC-301`. Not pushed, not merged.
- **Commits:** `3d6d786e` claim; `57e942fb` test (`src/evaluate.passer.test.ts`: the P1 row, the P2 row); `df7d07a2` tool (`tools/tune/tracer.ts`, `tools/tune/tune.ts`, `tools/tune/tune.test.ts`).
- **Tests added:** default lane, one (`ABC-301 P1`), and one row widened (P2). `TUNE_DEEP`, five (`ABC-301 QE-271-i`).
- **Commands:** `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.passer.test.ts`; `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune/tune.test.ts`; `npm test`; `npm run lint`; `npm run typecheck`; `npm run build`; the skip-count capture and `test-skip-integrity`; `raw/bt1.sh`; `raw/mutrun.sh`. Each under `flock <scratch>/host-test.lock`.
- **Raw:** `raw/forced-phase-probe.ts`, `.out`; `raw/mut.py`, `raw/mutrun.sh`, `raw/mutants-summary.txt`; `raw/guard-mutants.txt`; `raw/bt1.sh`, `raw/bt1-extract.json`; `raw/emit-base.ts`; `raw/row-durations.tsv`.
- **Migration:** none. **Docs:** the file headers touched. `AGENTS.md` is unchanged: the Tune deep lane line carries no count.
- **Left running:** nothing.
