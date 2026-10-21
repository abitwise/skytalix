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

## Result

**Software Engineer, 2026-10-21.** Branch `grugops/ABC-159` @ **`3c505abe`**. It is one commit on base `main` `4ab5b453`, which contains ABC-096's merge `b20eb451`. Not pushed, not merged.

### Criteria
| # | reading on tip `3c505abe` | verdict |
|---|---|---|
| A1 | the page's joined-text search prints nothing. At base it printed the history-pane, san and status-panel sites | PASS |
| A2 | `grep -nE '…bar on this project' src/*.ts` exits 1. At base it printed `src/turn-loop.nfr.test.ts:9` | PASS |
| A3 | each sentence states the bar is a count because a timing bar cannot fail on the regression it exists to catch. The words are in the decision note | QE's read (owed) |
| A4 diff | `git diff --numstat 4ab5b453` lists exactly the 4 files (+12/−10), and every hunk is inside the header `/** */` | PASS |
| A4 counts | 59 files, 1987 tests, byte-identical at base and head (`cmp` 0), skips 0. Taken as **59 one-file runs at 400**, because the whole-suite command at 400 is refused by `ABC-173`'s heap guard (see the `…c7a671d8` note) | PASS (method deviation stated) |

### Gates (tip)
- lint 0, typecheck 0, build 0.
- `npm test`: 59 files, 1987/1987, exit 0. `last-run.json` reads `success: true`, with 0 pending and 0 todo.
- skip-integrity `--skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP`: 11/11, exit 0.
- `PERFT_DEEP`: 32/32, exit 0.
- No timing taken.

### Production lines
`src/` excluding tests: **0 files, +0 −0**. The UAT waiver applies.

### Notes (`.grugops/context/ticket-to-pr-ABC-159/notes/`; hand-authored and unsealed, because the writer is absent per AGENTS.md)
- `20261021T081014Z-software-engineer-decision-abc159-lesson-not-tally-69b2939c`
- `20261021T081014Z-software-engineer-artifact-ref-abc159-branch-files-commands-d0c070f1`
- `20261021T081014Z-software-engineer-observation-abc159-criteria-gates-12c79e3b`
- `20261021T081014Z-software-engineer-observation-abc159-heap-guard-vs-brief-prefix-c7a671d8`

Evidence lives in `probe/`.

### Trace row (for the Orchestrator to append)
| ABC-159 | `grugops/ABC-159` @ `3c505abe` | `src/status-panel.nfr.test.ts`, `src/history-pane.nfr.test.ts`, `src/turn-loop.nfr.test.ts`, `src/san.nfr.test.ts` (header comments only) | no tests added; A1 empty, A2 exit 1, A4 counts identical 59/1987 | QE owed (A3); UAT waiver (0 prod lines) | In Review |
