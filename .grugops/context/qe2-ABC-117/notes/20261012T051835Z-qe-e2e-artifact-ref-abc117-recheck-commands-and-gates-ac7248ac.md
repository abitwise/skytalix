---
id: 20261012T051835Z-qe-e2e-artifact-ref-abc117-recheck-commands-and-gates-ac7248ac
kind: artifact-ref
by: qe-e2e
task: qe2-ABC-117
at: 2026-10-12T05:18:35Z
verified_by:
confidence: high
refs:
  - ABC-117
  - grugops/ABC-117-exit-one-correction@86bf76b5
  - grugops/qe2-ABC-117
  - plans/traceability.md
  - plans/tickets/ABC-117-that-exit-one-is-an-unhandled-exception-not-the-usage-code.md
supersedes:
---

# QE re-check `ABC-117`: commands, gates and the UAT-waiver reading

- **Worktree:** `../cli-chess-example-qe2-ABC-117` on `grugops/qe2-ABC-117` off `86bf76b5`.
  `node_modules` was symlinked from the main checkout; `package.json` and `package-lock.json` are
  identical at base, tip and `main`. A detached base worktree at `3537fe48` was used for the base
  lane only. Both worktrees were removed when the hop finished. The Engineer's branch was never
  written.
- **Gates at the tip `86bf76b5`:** `npm run lint` exit 0 (107 files, no fixes); `npm run typecheck`
  exit 0; `npm run build` exit 0; `npm test` exit 0, 56 files / 1741 tests, and
  `.test-results/last-run.json` `success: true`, `numPendingTests` 0, `numTodoTests` 0.
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No
  findings.`, exit 0.
- **Base `3537fe48`:** `npm test` exit 0, 56 / 1741 / 0 / 0, `success: true`.
- **UAT-waiver reading, measured:** `git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep
  '^src/'` is **empty** for each of `59000c87`, `00741431`, `d5afab3f`, `8e679aed`, `7bf4c61e` and
  `86bf76b5`, over `3537fe48..86bf76b5`, and over `main...86bf76b5`. The merge-base is still
  `3537fe48`, although `main` advanced to `389da079` during this hop. **The waiver applies.**
- **Out-of-product scripts** are in the session scratchpad, outside the repo, and are not committed.
  Their bodies are summarised in `…da88891b`.
