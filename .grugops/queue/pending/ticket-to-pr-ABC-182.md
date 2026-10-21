---
subtask: ticket-to-pr-ABC-182
role: software-engineer
tickets: [ABC-182]
branch: grugops/ABC-182 (from main @ the main tip at your start); worktree ../wt-ABC-182
ref: .grugops/context/ticket-to-pr-ABC-182/
width: 3 (beside two other ticket-to-pr hops in their own worktrees; disjoint files)
---

# SE: ABC-182: commit `r2-mutants.sh` and `r2-mutants.out.txt` beside `clause-b.mjs` (7 Ruling 2 plants). ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md`: every criterion, its § Scope and § Out of scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-182` on `grugops/ABC-182` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope. Where the page asks for a kill or a red, show it first: base green / head red (or the harness red on the named wrong copy), planted in scratch copies outside the repo with a private `TMPDIR`.
- Build the harness in `f-mutants.sh`'s shape, with the 7 plants and the expected verdicts exactly as the page's table states (Architect `…34e592ac`; plant bodies from QE `…7f56f339`). Read limb 1 from the `(b1) capability` and `(b1) Ruling 2` lines, never a bare `(b1)` grep.
- Run `A3` first (the `341da4c1` copy: nonzero, exactly `P2b`, `P2c`, `CMT`, `X1` named), then `A2` (green, exit 0, repo status and refs unchanged), then `A4` (`ALT`, scratch only, names limb 2). `A5`: re-run `A2` and show the committed output reproduces.
- Do not edit `clause-b.mjs`, `ADR-0036`, `src/` or `biome.json`. Any temporary copy placed so `typescript` resolves must be gone before you finish.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 tests at base);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md):
  - `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only.
  - Whole-suite or multi-file runs use 128, as `npm test` does.
  - Run them one at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only the files the page scopes.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-182` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-182`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-182.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-182 | … |` line) and `.claim.md`, uncommitted on main.
