---
id: 20261104T142409Z-software-engineer-observation-33a60189
kind: observation
by: software-engineer
at: 2026-11-04T14:24:09Z
verified_by: 
confidence: high (git, as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - se-ABC-300
  - ABC-300
  - ABC-282
  - EPIC-011
  - ADR-0071
  - ADR-0056
  - NFR-008
  - R-281-a
  - ABC-276
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-300
  - 6af55341
  - 9835859d
supersedes: 
seal: sha256:a583d7dde341c72b0d3bf40b5cdbcda799e99d4bb9334f56e0110144d8be2f2f
---

# se-ABC-300 observation (artifact record): the ABC-300 build

- **Branch:** `grugops/ABC-300` (worktree `.claude/worktrees/se-ABC-300`), from `main` `6af55341`.
- **Commits:** `e01c6a30` claim; `9835859d` feat (rating.ts + pair-check.ts); then records only (these notes, raw, the queue moves, the trace row).
- **Files:** `tools/rating/rating.ts` (+`D_TC`, `ArgSpec.tc`, three tokens in `sky()`, refusals, `control:` line, usage, header doc), `tools/rating/pair-check.ts` (ABC-300 describe of 5 tests; ABC-276 A5 usage text). 0 lines under `src/`, `data/`, `vitest.config.ts`.
- **Commands:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `node --test tools/rating/pair-check.ts`, 12 + 1 dry runs before/after, three scratch mutants with `--test-name-pattern=ABC-300`.
- **Remaining:** QE hop (offline rows; A6 at `ABC-282` A6). No UAT: tools only; `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty.
- Sealed as an observation, not an `artifact-ref`: no section-14 gate_run exists at this hop.
