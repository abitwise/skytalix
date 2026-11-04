# se-ABC-300 observation (artifact record): the ABC-300 build

- **Branch:** `grugops/ABC-300` (worktree `.claude/worktrees/se-ABC-300`), from `main` `6af55341`.
- **Commits:** `e01c6a30` claim; `9835859d` feat (rating.ts + pair-check.ts); then records only (these notes, raw, the queue moves, the trace row).
- **Files:** `tools/rating/rating.ts` (+`D_TC`, `ArgSpec.tc`, three tokens in `sky()`, refusals, `control:` line, usage, header doc), `tools/rating/pair-check.ts` (ABC-300 describe of 5 tests; ABC-276 A5 usage text). 0 lines under `src/`, `data/`, `vitest.config.ts`.
- **Commands:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `node --test tools/rating/pair-check.ts`, 12 + 1 dry runs before/after, three scratch mutants with `--test-name-pattern=ABC-300`.
- **Remaining:** QE hop (offline rows; A6 at `ABC-282` A6). No UAT: tools only; `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty.
- Sealed as an observation, not an `artifact-ref`: no section-14 gate_run exists at this hop.
