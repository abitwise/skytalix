---
id: 20261017T110200Z-software-engineer-artifact-ref-delivery-4b872b31
kind: artifact-ref
by: software-engineer
at: 2026-10-17T11:02:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-024
  - ABC-024
  - 20261017T110000Z-software-engineer-observation-remeasure-31f8734a
  - 20261017T110100Z-software-engineer-decision-row-shape-5d19189d
supersedes:
---

# Delivery: branch, commit, gates

- Branch `grugops/ABC-024-castling-default-lane`, cut from `b84dc637`. Code commit `a18da7f5`, which only
  touches `src/moves.castling.hardening.test.ts` (+280/-0). `git diff -U0` has 0 removed lines.
  `git diff --name-only b84dc637 a18da7f5 | grep -v '\.test\.ts$' | grep '^src/'` is empty, so there are
  0 production lines.
- The gates ran on `a18da7f5`, all with exit 0: `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`
  and `npm test`. `npm test` gave 58 files and 1810/1810 tests, against 58/1792 at base, which is +18 tests.
  `.test-results/last-run.json` has success `true`.
- Skip count 0. `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` gave
  `No findings.`
- `PERFT_DEEP=1 npx vitest run src/perft.test.ts`: 32/32, exit 0.
- Not done here: the board, `plans/traceability.md` (the trace row goes in the handoff) and `AGENTS.md`.
  The ticket's frontmatter `status`/`column` was left for the Orchestrator.
