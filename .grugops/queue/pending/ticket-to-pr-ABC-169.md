---
subtask: ticket-to-pr-ABC-169
role: software-engineer
ticket: ABC-169
page: plans/tickets/ABC-169-declare-the-engine-private.md
from: main a0c6db6c
branch: grugops/ABC-169
worktree: ../wt-ABC-169
---

# Implement ABC-169 end to end

The ticket page `plans/tickets/ABC-169-declare-the-engine-private.md` is the contract: its scope, acceptance criteria and fences. Read it, ADR-0044 (ACCEPTED) and the notes it cites.

- Write the tests first where the page asks for them, and stay within the page's scope.
- Gates on your tip, each green:
  - `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`;
  - `.test-results/last-run.json` success;
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`;
  - `PERFT_DEEP=1 npx vitest run src/perft.test.ts`.
- **No timing readings at this hop.** A parallel engineer is running vitest, so the window is not quiet.
  - Any timing criterion, for example ABC-170 `A6` (NFR-005 `ENGINE_DEEP=1`), is left OPEN and reported as "owed in a quiet window".
  - The Orchestrator takes that reading later. Do not estimate it.
- Do not touch `plans/board.md`, `plans/traceability.md`, the `wt-ABC-146` worktree, or any process you did not start.
- Never push, never merge, never `git push -f`.
- When done, write `.grugops/queue/done/ticket-to-pr-ABC-169.md` and `.claim.md`, uncommitted, in main's working tree. The handoff includes:
  - the tip;
  - the result for each acceptance criterion;
  - the gate output;
  - the zero-production-lines measurement: `git diff --name-only a0c6db6c...<tip> | grep -v '\.test\.ts$' | grep '^src/'`, plus a comment-only check where it applies;
  - a trace row.
