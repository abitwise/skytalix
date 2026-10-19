---
id: 20261019T161500Z-software-engineer-artifact-ref-abc173-branch-files-tests-8d42b6f1
kind: artifact-ref
by: software-engineer
at: 2026-10-19T16:15:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-173
refs: [ABC-173, ADR-0008, NFR-008]
---

# `ABC-173` artifacts

- **Branch** `grugops/ABC-173` from `68bbf33f`, worktree `../wt-ABC-173`. Not pushed, not merged.
- **New:** `tools/grugops/heap-guard.js`.
- **Changed:**
  - `package.json` (`test`, `test:watch` only);
  - `tools/grugops/run-bounded.js` (header quote);
  - `vitest.config.ts` (`globalSetup` + one header paragraph);
  - `src/cli.test.ts`;
  - `src/cli.real-engine.test.ts`;
  - `src/line-input.test.ts` (comment);
  - `AGENTS.md`;
  - `memory-bank/90-agents-md-command-log.md`.
- **Tests added**, default lane +5 (1915 -> 1920):
  - `src/cli.test.ts` `ABC-173` block: `A4`, `A6`, `A6 (static)`, `C2`, `A3`;
  - `CLI_DEEP` +1 (10 -> 11): `ABC-173` `A6`.
- **Re-pins:**
  - `ABC-042` `A10` (`test`, `test:watch` values);
  - `N8_SPAWN` 27 -> 28 (`17 + 7 + 1 + 2 + 1`, the `heapProbe` child), with its row title.
- **Production lines under `src/`:** none. `git diff --name-only 68bbf33f...<tip> | grep -v '\.test\.ts$' | grep '^src/'`
  prints nothing.
