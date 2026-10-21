---
subtask: ticket-to-pr-ABC-184
role: software-engineer
tickets: [ABC-184]
branch: grugops/ABC-184 (from main @ the main tip at your start); worktree ../wt-ABC-184
ref: .grugops/context/ticket-to-pr-ABC-184/
width: 2 (beside bapm-rescope-ABC-165, records only; disjoint files)
---

# SE: ABC-184: `RealChild` records the cwd it spawned with, and A7 asserts `booked.cwd` is `neutral`, labelled `AR-183-CWDARG`. Closes AR-183-CWDARG on QE's read. ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md`: every criterion, § Scope and § Out of scope.
- The notes it cites (BA/PM `…f5fcdaf5`; Security/NFR `…41f70925`, `…d5fd47e1`; QE `…cbd50a13`, `…be7c2c82`).
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-184` on `grugops/ABC-184` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Run the page's plant table yourself, base test vs head test, in scratch copies outside the repo with a private `TMPDIR`: none, P6f, **TCWD + P6f** (the close row: green on base, red on head at the new assertion, `AR-183-CWDARG` in the failure output), TCWD alone, TMO + P6f. P6f's body is QE `…567002e7` (`ABC-162`). Record each plant's sha256.
- The page marks two readings `UNKNOWN - verify`: TCWD alone on the base test, and whether the change typechecks. Measure both and report them.
- Implement exactly the page's scope, then prove each criterion (including every grep count A1, A2 and A5 name, base and head).
- Run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (59 / 1987 at base; must stay equal);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` (11 tests, 6 children) and `PERFT_DEEP`.
- Heap rule (AGENTS.md): `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only; whole-suite or multi-file runs use 128, as `npm test` does. One run at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only `src/cli.real-engine.test.ts`. `src/book-file.ts` and every production file are read-only.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-184` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-184`. **Pass your worktree as the context root explicitly** (the writer's default root is the plugin's own directory). Take every `at` from `date -u` (UTC).
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-184.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-184 | … |` line) and `.claim.md`, uncommitted on main.
