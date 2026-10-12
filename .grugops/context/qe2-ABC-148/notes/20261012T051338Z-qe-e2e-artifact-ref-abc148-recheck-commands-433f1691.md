---
id: 20261012T051338Z-qe-e2e-artifact-ref-abc148-recheck-commands-433f1691
kind: artifact-ref
by: qe-e2e
role: qe-e2e
task: qe2-ABC-148
at: 2026-10-12T05:13:38Z
verified_by:
confidence: high
refs:
  - ABC-148
  - plans/traceability.md
supersedes:
---

# QE re-check `ABC-148`: where the work happened and the commands run

This note is hand-authored and unsealed.

- **Worktrees.**
  - `../cli-chess-example-qe2-ABC-148` is on `grugops/qe2-ABC-148`, off `9c3efd62`.
  - `../cli-chess-example-qe2-ABC-148-base` was detached at `3537fe48`, for the base `npm test`. It was
    removed after use.
  - Both used a `node_modules` symlink to the main checkout.
  - The SE's branch was not checked out and not `update-ref`'d.
  - `grugops/ABC-117-exit-one-correction` and its worktree were not touched.
- **Generator and runner.** `plant.mjs` and `run.sh` live in the session scratchpad and are not
  committed. The anchor is the unique `const history = newGame(START_FEN);` and the
  `const outcome = await runTurnLoop({` … `    });` call, and the generator throws if either is not
  found. The forms are `bare-arrow`, `array-destructure`, `function-callback`,
  `forof-object-destructure`, `paren-arrow`, `for-in`, `catch-binding`, `let-forof-assign`,
  `let-destructure-assign`, `let-plain-assign`, `object-method-satisfies` and `param-property`, plus
  `none`.
- **Per-form loop.**
  1. Check that `git status --porcelain` is empty.
  2. `node plant.mjs <wt> <form>`.
  3. `git diff -- src/cli.ts`.
  4. `node_modules/.bin/tsc --noEmit`.
  5. `node_modules/.bin/vitest run src/cli.test.ts --reporter=json --outputFile=<scratch>`.
  6. `git restore src/cli.ts`.
  7. `git status --porcelain`, which was empty 13 times out of 13.
- **Fence.**
  - `git diff --name-only 3537fe48 9c3efd62 -- src/`.
  - `git diff -U0 … -- src/ | grep -E '^[-+]' | grep -vE '^(\+\+\+|---) ' | grep -vcE '^[-+]\s*//'`.
  - `grep -oE '\bit\('` and `grep -oE '\bexpect\('` on `git show <rev>:src/cli.test.ts`.
  - `cmp` on `ABC-113` page regions: 1–66 raw; 67–70 with `~~` stripped; 71–75 against `238acd95`;
    the tail against base.
- **Gates.**
  - `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`.
  - `npm test` at the tip and at base, read from the summary and from `.test-results/last-run.json`.
  - `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`.
  - `node tools/grugops/host-protection.js`.
- **UAT-waiver predicate.** Run over `7acd8db2`, `2208d2a0` and `9c3efd62` (each `~1..`), and over
  `3537fe48..9c3efd62`.
- **Totals.** 13 single-file runs (12 plants and 1 baseline). 2 full `npm test` runs (tip and base),
  plus 1 JSON-reporter full run for the skip count. No timing reading was taken.
