---
id: 20261012T125600Z-software-engineer-artifact-ref-branch-files-gates-2cc11fef
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-095
at: 2026-10-12T12:56:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - src/book-engine.ts
  - src/book-engine.test.ts
  - 20261012T125400Z-software-engineer-decision-deliver-decorator-stop-at-wiring-1e971b4d
supersedes:
---

# Branch, files and gates

This note is hand-authored and unsealed.

- **Branch:** `grugops/ABC-095-book-before-engine`, worktree `../wt-ticket-to-pr-ABC-095`, base `main` `e9b1c50a`. Not
  merged, not pushed.
- **Code commit:** `521a8513`. Files:
  - `src/book-engine.ts`: +20, new production module, flat in `src/`.
  - `src/book-engine.test.ts`: +186, 5 tests.
- **Records commit:** the next commit on the branch holds these notes, `probe/`, the trace row at the end of
  `plans/traceability.md`, and `## Delivery` on the ticket page.
- **`probe/`:**
  - `cli-wiring-not-committed.diff` is the reverted wiring, kept as evidence.
  - `time.ts` is the out-of-suite timing script (`node probe/time.ts <worktree> cold-hit|cold-miss|warm`).
- **Gates**, on the code tree and run before the code commit. The records commit adds no `.ts`:
  - `npm run -s lint`: Biome, 111 files, no fixes, exit 0.
  - `npm run -s typecheck`: exit 0.
  - `npm run -s build`: exit 0.
  - `npm test`: exit 0, **58 files, 1780 passed, 0 failed, 0 pending, 0 todo**. `.test-results/last-run.json` has
    `success: true`. Before this hop it was 57 files and 1775 tests.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: 7 passed. This ticket adds no row, because both of its
    rows need the wiring.
- **`NFR-008` pins:** 1 new test file, and 0 new spawned processes in the default lane.
- **`A6` git reading:** `git diff --numstat main..521a8513` over `src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`,
  `src/quiescence.ts`, `src/transposition.ts`, `src/levels.ts`, `src/virtual-clock.ts`, `src/turn-loop.ts`,
  `src/book.ts` and `data/` gives **0 lines**.
