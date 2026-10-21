---
subtask: ticket-to-pr-ABC-159
role: software-engineer
tickets: [ABC-159]
branch: grugops/ABC-159 (from main @ c83fd575 or the main tip at your start); worktree ../wt-ABC-159
ref: .grugops/context/ticket-to-pr-ABC-159/
---

# SE: ABC-159 — the `ABC-030` repair, one class over: state the lesson, drop the tally. Comment lines only

## Read first
- The ticket page `plans/tickets/ABC-159-four-nfr-test-headers-carry-a-running-tally-of-the-catalog-and-they-disagree.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: the lanes, their heap prefixes, and the 12 coding rules.

## Do
- Create the worktree `../wt-ABC-159` on branch `grugops/ABC-159` from the current `main`. A `node_modules` symlink to main's is fine.
- Implement exactly the page's scope, test-first where the page asks for a kill: show the new row fails on the named wrong build, then passes.
- **Prove each criterion you own** and run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` with `last-run.json` success;
  - skip-integrity 0;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Every vitest command carries its `NODE_OPTIONS=--max-old-space-size=400` prefix and runs one at a time. Other SE agents run in parallel on other tickets.
- Take no timing; N8 and NFR-008 readings are QE's.
- Measure production lines changed under `src/` excluding tests. If that's empty, the UAT waiver applies.

## Fences
- Only the files the page scopes.
- Don't touch `plans/board.md`, `plans/traceability.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-159` only. Never push or merge.
- Touch no process you didn't start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Sealed notes via the sanctioned writer (`context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-159`), including a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-159.md` (this brief + `## Result`) and `.claim.md` on main, uncommitted. Include:
  - the tip sha;
  - per-criterion results;
  - the gates;
  - the production-lines measurement;
  - a trace row.
