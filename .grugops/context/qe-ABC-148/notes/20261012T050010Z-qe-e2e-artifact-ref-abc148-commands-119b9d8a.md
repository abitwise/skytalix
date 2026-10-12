---
id: 20261012T050010Z-qe-e2e-artifact-ref-abc148-commands-119b9d8a
kind: artifact-ref
by: qe-e2e
role: qe-e2e
task: qe-ABC-148
at: 2026-10-12T05:00:10Z
verified_by:
confidence: high
refs:
  - ABC-148
  - 20261012T050010Z-qe-e2e-observation-abc148-readings-cb622f01
supersedes:
---

# QE `ABC-148`: commands run and where the work happened

This note is hand-authored and unsealed.

- **Worktrees.**
  - `../wt-qe-ABC-148` is on `grugops/qe-ABC-148`, off `94ca6c7e`.
  - `../wt-qe-ABC-148-base` is detached at `3537fe48`, for the base `npm test`.
  - Both used a `node_modules` symlink to the main checkout. Both were removed at exit.
  - The SE's branch was not touched (no `update-ref`, no checkout of it).
- **The plant generator.** It lived in the session scratchpad (`plant.mjs`, not committed). It found
  the unique `const outcome = await runTurnLoop({` … `sink,\n    });` anchor and threw if the anchor
  was not unique. The forms were `F1-for-of`, `F2-paren-arrow`, `F3-bare-arrow`, `F4-for-in`,
  `F5-catch`, `H1`–`H6`.
- **The per-form loop:** `node plant.mjs <wt> <form>`, `git diff src/cli.ts`, `npx tsc --noEmit`,
  `npx vitest run src/cli.test.ts --reporter=json --outputFile=<scratch>`, `git checkout --
  src/cli.ts`, then `git status --porcelain | wc -l` (0 every time).
- **`A3`:**
  - `git show 3537fe48:<page> | sed -n 64p` against the tip's and `main`'s line 64, with `cmp`.
  - Tip lines 67–70 with `~~` stripped against base lines 67–70, with `cmp`.
- **`A4`:**
  - `git diff --name-only 3537fe48 94ca6c7e -- src/`.
  - `git diff -U0 … -- src/ | grep -E '^[-+]' | grep -vE '^(\+\+\+|---) ' | grep -vE '^[-+]\s*//'`.
    This was also run on the `F1` plant diff as a self-test, and printed 8 lines.
  - `grep -o '\bit(' / '\bexpect('` on `git show <rev>:src/cli.test.ts`.
  - `npm test` in both worktrees, read from `.test-results/last-run.json`.
- **Gates:** `npm run -s lint`, `npm run -s typecheck`, `npm run -s build`, `npm test`, then
  `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`, then
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, then
  `node tools/grugops/host-protection.js`.
- **The UAT-waiver predicate:** run over `94ca6c7e~1..94ca6c7e`, `7acd8db2~1..7acd8db2` and
  `3537fe48..94ca6c7e`.
- **Totals.** 14 planted `src/cli.test.ts` runs: 5 forms, 6 hunt forms, and 3 defective first runs of
  `H1`–`H3`. 2 full `npm test` runs, plus one JSON-reporter full run for the skip count. No timing
  reading was taken.
