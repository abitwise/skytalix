---
subtask: ticket-to-pr-ABC-161
role: software-engineer
tickets: [ABC-161]
branch: grugops/ABC-161 (from main @ the main tip at your start); worktree ../wt-ABC-161
ref: .grugops/context/ticket-to-pr-ABC-161/
width: 2 (beside bapm-cut-AR-183-CWDARG, records only)
---

# SE: ABC-161: sharpen three existing rows in `src/cli.test.ts` until P11, S2c and P9a/b/c/e go red. ZERO production lines, ZERO new tests

## Read first
- The ticket page `plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md`: every criterion, § Scope and § Out of scope.
- The notes it cites (`qe-ABC-101`, `secnfr-ABC-101`, `bapm-cut-followups` readings `…85e8dfdd` for the plant bodies).
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Stale pointers on the page
- The page was cut at `1671f24f` (1810 tests). Its line numbers (`:3665`, `:3592`, `:2262`) and counts ("1810 of 1810", "78 of 78") are from then; `main` has 1987 tests now. Find the three rows by name (`A8′` equivalence, `A3` refused values, `ABC-065` `A3` value check) and record their lines at your base. The criteria are relative (base vs head) and stand as written.
- Its Dependencies line still says `ABC-096` is In Development; ABC-096 is merged (`b20eb451`), so any current `main` satisfies it.

## Do
- Create the worktree `../wt-ABC-161` on `grugops/ABC-161` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Show each gap first on the base test, then on head: P11, S2c, P9a, P9b, P9c, P9e green → red; P9d red on both. Plants in scratch copies outside the repo with a private `TMPDIR`, including the `AGENTS.md` plants. `git status --porcelain` is empty afterwards.
- Implement exactly the page's three edits, inside the three existing `it` blocks. Fix 3 compares each documented value list set-equal to the accepted values from `src/cli-options.ts` (read-only) or derived from `ACCEPTED_ARGUMENTS`.
- Prove each criterion, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 at base; must stay equal);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md): `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only; whole-suite or multi-file runs use 128, as `npm test` does. The page's "whole default `npx vitest run`" lane is a multi-file run: use 128. One run at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only `src/cli.test.ts`. `AGENTS.md` and every production file are read-only.
- Never touch `plans/board.md`, `plans/traceability.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-161` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-161`. Take every `at` from `date -u` (UTC); never local time.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-161.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.
