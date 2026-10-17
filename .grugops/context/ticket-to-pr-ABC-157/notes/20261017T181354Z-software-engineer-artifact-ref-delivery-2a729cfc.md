---
id: 20261017T181354Z-software-engineer-artifact-ref-delivery-2a729cfc
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-157
at: 2026-10-17T18:13:54Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-157
  - ABC-157
  - 20261017T181352Z-software-engineer-observation-readings-da7f6206
  - 20261017T181353Z-software-engineer-decision-row-shape-14459646
supersedes:
---

# Delivery: branch, commit, gates

- Branch `grugops/ABC-157-castling-one-right`, cut from `main` `aa37f9cb`, in the worktree `wt-ABC-157`. The code
  commit is `968a5843`: `src/moves.castling.hardening.test.ts` +90/−0 and nothing else.
  - `git diff --name-only aa37f9cb 968a5843` lists that one file.
  - `git diff -U0` has 0 removed lines.
  - `… | grep -v '\.test\.ts$' | grep '^src/'` is empty, so there are 0 production lines.
  - `md5 -q src/moves.ts` is `6335b452fc21ffe2d0f902ecab930840` at base and at head.
- The gates ran on `968a5843`, all with exit 0: `npm run -s lint`, `npm run -s typecheck`, `npm run -s build` and
  `npm test`.
  - `npm test` gave 58 files and 1830/1830 tests, against 58/1824 at base: +6.
  - `.test-results/last-run.json` has `success: true`, 0 pending and 0 todo.
  - The skip count is 0, and `test-skip-integrity.js … --skip-count 0` gave `No findings.`
  - `PERFT_DEEP=1 npx vitest run src/perft.test.ts` passed 32/32.
- The docs commit on top carries these notes, `probe/`, and a `## Delivery` section on the ticket page.
- Not done here: `plans/board.md` and `plans/traceability.md` (the trace row is in the handoff). The ticket's
  frontmatter `status`/`column` is left for the Orchestrator.
