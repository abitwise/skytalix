---
id: 20261021T081210Z-software-engineer-observation-9e1095de
kind: observation
by: software-engineer
at: 2026-10-21T08:12:10Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - QE-095-a
  - grugops/ABC-162
  - 3d05e230
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - 51503331
  - NFR-008
supersedes: 
seal: sha256:a0995c11c26b8032a6b5f947058fa3d3c2df58044904ce5208ff5e1a10794d86
---

# `ABC-162` branch, diff and gates: `grugops/ABC-162` tip `3d05e230`, one test file, 0 production lines, every gate green

- **Branch:** `grugops/ABC-162`, worktree `../wt-ABC-162`, cut from `main` `51503331`. One commit: `3d05e230` `test(ABC-162): run A7's booked child from a neutral working directory`. Not pushed, not merged.
- **Diff:** `git diff --name-only 51503331 3d05e230` gives exactly `src/cli.real-engine.test.ts` (numstat +36 −9).
- **Production lines under `src/`, excluding tests and snapshots:** `git diff --name-only 51503331 3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'` is **empty**, so **0 lines**. The UAT waiver applies on this measure.
- **Gates at the tip** (each run once, one at a time, in the worktree):
  - `npm run lint`: exit 0, 116 files, no fixes.
  - `npm run typecheck`: exit 0.
  - `npm run build`: exit 0.
  - `NODE_OPTIONS=--max-old-space-size=400 npm test`: exit 0, 59 files / 1987 tests, and `last-run.json` has `success: true`, 0 failed, 0 pending, 0 todo.
  - Skip count (`--reporter=json` jq): **0**. `test-skip-integrity.js --skip-count 0`: `No findings.`, exit 0.
  - `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`: exit 0, 11 passed (10 deep + 1 default), 6 children.
  - `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`: exit 0, 32 passed.
- **No timing was taken.** `N8` and `NFR-008` readings are QE's.
- **Untouched:** `plans/board.md`, `plans/traceability.md`, every other worktree. The worktree's `git status --porcelain` is empty at the tip.
