---
id: 20261021T162923Z-agents-md-scribe-observation-cf2e5486
kind: observation
by: agents-md-scribe
at: 2026-10-21T16:29:23Z
verified_by: 
confidence: high
refs:
  - ABC-176
  - grugops/ABC-176
  - 522bffd1
  - ffd53f41
  - AGENTS.md
  - QE-173-f
  - ABC-173
  - ABC-187
  - A5
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:46a6ac334b51b3c8383b5420e044ab19871d1748aebdc276cc6b9465fd93cf61
---

# ABC-176 A5: gates and pins on the tip after the Scribe edit (`522bffd1`)

Worktree `../wt-ABC-176`, no timing taken. `NODE_OPTIONS=--max-old-space-size=128` on the whole suite, 400 on the one-file run.

- lint exit 0; typecheck exit 0; build exit 0.
- `npm test` exit 0: 59 files passed, 1992 / 1992 tests; `.test-results/last-run.json` `success` true, `exitCode` 0, 0 failed, 0 pending, 0 todo.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `src/cli.test.ts -t "ABC-109|ABC-173|ABC-176|ABC-187"`: 15 passed (78 skipped by the filter).
- `ABC-173` `A3`: its `vitestCommandsIn` rule (backticked spans outside HTML comments that run `npx vitest`) counts **17** on `01836fff` and **17** on `522bffd1`
  (re-implemented outside vitest on both versions; the real row is green in the full run, whose floor is >= 17). Both edits sit inside HTML comments.
  No backticked `npx vitest` text was added. `A4`'s refusal-regex row is green in the same full run.
- `AGENTS.md` `wc -c` = 15,797 <= 18,432 (A5).
