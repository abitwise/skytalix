---
id: 20261021T091814Z-qe-e2e-observation-b571ef5f
kind: observation
by: qe-e2e
at: 2026-10-21T09:18:14Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-095-CWD
  - grugops/ABC-180
  - acb52edf
  - d9c3cca3
  - ccccc6bb
  - e68962d6
  - grugops/qe-ABC-180
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - NFR-008
supersedes: 
seal: sha256:9507a53ee90ba5069751b5f05c1e272f6642e5d29ae20aba7d5e999a6f9f49aa
---

# `ABC-180` gates on the code tip: all green; UAT waiver measured, the non-test `src/` list is empty

**Where:** the QE worktree `../wt-qe-ABC-180` at `d9c3cca3`. Its tree outside `.grugops/` equals `acb52edf` (`git diff --stat acb52edf HEAD -- . ':!.grugops'` is empty). One run at a time, no timing taken.

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | rc 0, 116 files, no fixes |
| typecheck | `npm run typecheck` | rc 0 |
| build | `npm run build` | rc 0 |
| unit | `npm test` (its own heap 128) | rc 0, **59 files, 1987 tests** |
| result file | `.test-results/last-run.json` | `success: true`, 1987 passed, 0 failed, 0 pending, 0 todo |
| skip count | `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| skip integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, rc 0 |
| `CLI_DEEP` | `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts` | rc 0, **11/11** |
| `PERFT_DEEP` | `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts` | rc 0, **32/32** |

- **Base `npm test`:** a scratch `git archive ccccc6bb` (the whole tree) gives rc 0, **59 files, 1987 tests**, `success: true`, which equals the tip.
  - A first base run on a partial archive failed (1 file) on a missing `.grugops/qe-cutover-2026-08-17.txt`. That was QE's own setup error, not a code result. It was redone on the full archive.
- **Heap:** 400 for the one-file runs, 128 for the multi-file runs.
- **`git status --porcelain`:** empty after the gates.
- **UAT waiver (AGENTS.md's form, no `.snap` filter):**
  - `git diff --name-only acb52edf~1 acb52edf | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (grep exits 1). `acb52edf~1` is `ccccc6bb`.
  - `git diff --name-only ccccc6bb d9c3cca3 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1).
  - `.snap` files changed: **none**.
  - So 0 production lines, and the waiver condition holds.
- **Puzzle suite not triggered:** no engine file changed.
