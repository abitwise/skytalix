---
id: 20261012T050500Z-software-engineer-artifact-ref-abc117-branch-files-and-gates-66ee87ce
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-117
at: 2026-10-12T05:05:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - plans/traceability.md
  - plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
supersedes:
---

# SE `ABC-117`: what this hop wrote

- Branch `grugops/ABC-117-exit-one-correction` from `main` @ `3537fe48`, in worktree
  `../wt-ticket-to-pr-ABC-117` (`node_modules` symlinked). Not pushed and not merged.
- Corrections commit `59000c87`: `src/cli.test.ts` (S8, the `A10` comment, comment lines only),
  `plans/board.md` (one appended block after the S6 header, which also corrects S9),
  `plans/tickets/ABC-115-…md` (S7, one appended block after `## RESIDUAL`), and four notes in this
  folder: `…5d86529e` (A1 readings), `…0081a95a` (S1/S2, supersedes `…8a4b2e69`), `…92514474` (S3–S5),
  and `…7f8b9026` (placement calls).
- Docs commit after it: `## Delivery` on the `ABC-117` page, one row appended to the end of
  `plans/traceability.md` (12 pipe-fields), and this note.
- Gates on the tree of the docs commit: `npm run -s lint`, `typecheck`, `build` and `npm test` all exit
  0. `npm test` ran 56 files and 1741 tests with 0 skipped; `.test-results/last-run.json` has
  `success: true`. `test-skip-integrity` at 0 reads `No findings.`. No timing was read (width 3).
- Not touched: `AGENTS.md`, `ADR-0016`, `plans/nfr-catalog.md`, production `src/`,
  `.grugops/test-skips.md`, and every existing note file. On `plans/board.md` nothing was touched
  beyond the one block. The probe script and its stderr captures stay in the session scratchpad,
  outside the repository.
