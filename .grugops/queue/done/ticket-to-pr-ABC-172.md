---
subtask: ticket-to-pr-ABC-172
role: software-engineer
tickets: [ABC-172]
branch: grugops/ABC-172 (from main @ the main tip at your start); worktree ../wt-ABC-172
ref: .grugops/context/ticket-to-pr-ABC-172/
width: 3 (beside ticket-to-pr-ABC-168 and qe-ABC-187)
---

# SE: ABC-172: rename the package and every in-repo name to `skytalix`; the directory and the remote are owner steps. Owner go (pull next, 2026-10-21)

## Read first
- The ticket page `plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md`: every criterion, § Scope, § Out of scope, § Dependencies (Q14: `npm run chess` keeps its name).
- `AGENTS.md` and the ABC-164 layout (`memory-bank/45-standing-rulings.md`, `memory-bank/90-agents-md-command-log.md`).

## The page was cut on 2026-10-18. Re-read it against today's `main` first
- `AGENTS.md` was split (ABC-164) and its guard is 18,432 B (ABC-187). Any name in `AGENTS.md` may now live in `memory-bank/45` or `90` instead; find every occurrence by content. If the page's file list misses a file the rename must touch, or names one that no longer holds the name, **stop and report** rather than widen scope.
- `package.json` is shared with ABC-168 (in development: adds `bin`, `build`, `uci`). Different keys; whichever merges later merges `main` and keeps both.
- Edits to `AGENTS.md` are the Scribe's unless the page assigns them to you; if the page assigns them to you, keep the byte count ≤ 18,432.

## Do
- **ABC-187 (in QE now) edits `AGENTS.md:7` and `src/cli.test.ts` (`:2242`, `:2483-2484`) and may merge during your hop.** Before you finish, merge the current `main` into your branch (a merge, not a rebase), resolve by keeping both changes, and re-run every criterion and gate at that merge. Report the merge sha.
- Create the worktree `../wt-ABC-172` on `grugops/ABC-172` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Read every criterion at base first. Implement exactly the page's scope.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (counts equal base); skip-integrity `--skip-count 0`; `CLI_DEEP` (6 children with `--reporter=verbose`) and `PERFT_DEEP`. Heap 400 one-file, 128 multi-file. No timing.
- Measure the UAT waiver in AGENTS.md's form.

## Fences
- Only the files the page scopes. Never touch `plans/`, other worktrees. Commit on `grugops/ABC-172` only. Never push or merge; never rename the directory or the remote.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-172`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-172.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**SE, 2026-10-21T13:54:08Z. Verdict: implemented. A1–A5 met, gates green and equal to base, UAT waived (0 production lines). Ready for In Review (column moves are the Orchestrator's).**

- Branch `grugops/ABC-172` in worktree `../wt-ABC-172`, base `main` `3e617b26`. Code `0bddbb4358b918c5d9540ebad72cd90c287dbb63`, tip (notes) `2eaf1a1c4b13f812a2dc076b204e20b66e523ebc`.
- **Merge of main: none.** `main` was still `3e617b26` (the base) when the hop finished, and ABC-187 had not merged. If ABC-187 or ABC-168 lands first, a merge of main is still owed before this branch merges. Expected conflict surface: `package.json` / `package-lock.json` with ABC-168 (different keys).
- Page re-read against today's main: no scope drift. `AGENTS.md`, `memory-bank/45` and `memory-bank/90` hold no `cli-chess`. The only live hits were the three the page names. `AGENTS.md` was not touched (15,606 B).
- **Deviation, recorded as a decision (`…decision-e3f11766`):** `npm install --package-lock-only` (npm 11.20.0) also back-filled `packages[""].license: "UNLICENSED"`. I removed that one line to hold A2's "exactly two lines". No version or integrity moved. `npm ci` exit 0 ran on a scratch copy, not in the worktree, because its `node_modules` is a symlink to main's.
- The `node_modules` symlink is left in the worktree. It is ignored (`.git/info/exclude:9`).
- Notes (sealed, committed on the branch): `.grugops/context/ticket-to-pr-ABC-172/notes/` — `20261021T135341Z-software-engineer-decision-e3f11766`, `20261021T135347Z-software-engineer-observation-1e8b0ee9` (delivery), `20261021T135347Z-software-engineer-observation-98b0c36a` (criteria and gates).

Trace row (10 cells, not appended):

| ABC-172 (SE) | package renamed `cli-chess` → `skytalix` in package.json and package-lock.json (two name lines); `npm run chess` kept (Q14) | EPIC-007 | — | decision e3f11766 (lock license back-fill removed to hold A2); ABC-041 (a) fires: security short hop owed | grugops/ABC-172 @ 0bddbb43 (code), 2eaf1a1c (notes); no merge of main (main = base 3e617b26)<br>package.json, package-lock.json | lint 0, typecheck 0, build 0; npm test 59 files 1987/1987 = base, last-run success; skip-count 0, integrity No findings; CLI_DEEP 11/11 (6 children); PERFT_DEEP 32/32; npm ci 0 | UAT WAIVED (0 production lines, AGENTS.md form empty at 0bddbb43) | — | In Development → In Review |
