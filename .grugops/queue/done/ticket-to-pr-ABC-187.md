---
subtask: ticket-to-pr-ABC-187
role: software-engineer
tickets: [ABC-187]
branch: grugops/ABC-187 (from main @ the main tip at your start); worktree ../wt-ABC-187
ref: .grugops/context/ticket-to-pr-ABC-187/
width: 2 (beside ticket-to-pr-ABC-185; disjoint files)
---

# SE: ABC-187: lower `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` from 24,576 to 18,432, rewrite its one-line JSDoc, and fix the stale closer count at `:2242` (QE-164-h). Test file only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-187-the-agents-md-byte-guard-still-allows-24576-b-so-abc-164s-cut-can-grow-back-unflagged.md`: every criterion, § Scope (three lines), § Out of scope.
- BA/PM notes `…669853d9` (readings), `…d74b218a` (the cut), `…52428ef9` (the owed `AGENTS.md:7` line); owner decision `…cba9c8eb`.

## Orchestrator ruling on the owed `AGENTS.md:7` line
- Folded in: after your commit, the Orchestrator sends the Scribe onto **your branch** to change `AGENTS.md:7` (`24,576` → `18,432`, byte-neutral). **You do not touch `AGENTS.md`.** `A6` is then read with its "only if folded in" clause.

## Do
- Create the worktree `../wt-ABC-187` on `grugops/ABC-187` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Show the guard's teeth first, in a scratch copy outside the repo with a private `TMPDIR`: an `AGENTS.md` of 18,433 B passes the base guard and fails the head guard; 18,432 B passes head; the real `AGENTS.md` passes head.
- Implement exactly the three Scope lines. 0 lines added or removed net.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987, equal to base); skip-integrity `--skip-count 0`. One-file vitest runs use `NODE_OPTIONS=--max-old-space-size=400`; whole-suite runs 128 (as `npm test` sets). No timing.
- Measure the UAT waiver in AGENTS.md's form (must print nothing).

## Fences
- Only `src/cli.test.ts`, only the three lines. Never touch `AGENTS.md`, `plans/`, `memory-bank/`, other worktrees.
- Commit on `grugops/ABC-187` only. Never push or merge.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-187`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-187.md` (brief + `## Result`: tip, per-criterion results, the scratch guard readings, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-187 (SE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**Tip `1151e7c8`** on `grugops/ABC-187` (local, not pushed), from `main` `94c4b510`. Commits: `494f7862` (the edit, `src/cli.test.ts` +3/−3) and `1151e7c8` (notes). `main` moved to `a78c353a` during the hop (ABC-185 close: `.grugops/queue/`, `plans/` only; `AGENTS.md` still 15,606 B), disjoint from this branch, so no merge was made. The Scribe's `AGENTS.md:7` hop comes next on this branch. Verdict: **A1, A2, A3, A5, A6 MET. A4: no production lines, but the page's A4 command prints `src/cli.test.ts` as written (see below). Ready for the Scribe hop, then In Review / QE.**

**Edits** (decision `…decision-45ccc2b7`), lines as at base:
- `:2242` `carries 13 further closers` → `carries 8 further closers`. I kept a number because the script gives 8 at base and head, and the sentence's argument relies on a count.
- `:2483` JSDoc, one line: ``/** The owner's ceiling (`ABC-187`, decision `…cba9c8eb`): 18,432 B, so the `ABC-164` cut cannot regrow unflagged. */``
- `:2484` `const AGENTS_MD_BUDGET_BYTES = 18_432;`

**Per criterion** (observation `…observation-291ee80a`):
- **A1 MET.** Forbidden-pattern grep `2` → `0`. The constant line count goes `0` → `1`. `:2483` contains `ABC-187`.
- **A2 MET.** These ran on scratch `git archive` exports outside the repo, with `node_modules` symlinked and a private `TMPDIR`, using `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-109"`:
  - Base `94c4b510` at 18,433 B: `1 passed | 87 skipped`.
  - Head `494f7862` at 18,433 B: `1 failed | 87 skipped`, with `AGENTS.md bytes against its 18432 B budget (ABC-109): expected 18433 to be less than or equal to 18432`.
  - Head at 18,432 B: `1 passed`.
  - Head with the real `AGENTS.md` (15,606 B): `1 passed`.
- **A3 MET.** `npm test` rc 0: 59 files / 1987 tests passed, equal to base. `last-run.json` reads success true, 0 failed, 0 pending. skip-integrity `--skip-count 0` printed `No findings.`. `wc -c AGENTS.md` is 15606 (also 15606 on `main` `a78c353a`).
- **A4: the intent is met, but the command as written does not print empty.** `git diff --name-only main...HEAD -- src/ ':!src/**/*.test.ts' ':!src/__snapshots__'` prints `src/cli.test.ts`. Git's default (non-glob) pathspec needs a directory level between `src/` and `*.test.ts` for `**/` to match, so a top-level `src/*.test.ts` file is not excluded.
  - The AGENTS.md reference waiver form prints nothing.
  - The glob-magic form `':(exclude,glob)src/**/*.test.ts' ':(exclude,glob)src/__snapshots__/**'` prints nothing.
  - So there are 0 production lines. This is a defect in the page's command, not in the diff. QE should re-measure with the reference form.
- **A5 MET.** The script prints `8`, and the comment says 8. `grep -c "carries 13 further closers"` goes `1` → `0`.
- **A6 MET (before the Scribe hop).** Excluding `.grugops/`, the diff lists only `src/cli.test.ts`. numstat is `3 3`. The hunks are `@@ -2242 +2242 @@` and `@@ -2483,2 +2483,2 @@` only. Net 0. `AGENTS.md` was not touched; it is the Scribe's, so the "only if folded in" clause is still open.

**Gates on `494f7862`** (observation `…observation-92522336`). The tip `1151e7c8` adds only `.grugops/` notes.
- lint:fix printed `No fixes applied`; lint rc 0 (116 files)
- typecheck rc 0
- build rc 0
- `npm test` rc 0: 59 / 1987
- skip-integrity `No findings.`
- No timing was taken.

**UAT waiver.** `git diff --name-only HEAD~1 HEAD | grep -v '\.test\.ts$' | grep '^src/'` on `494f7862` printed nothing (rc 1). 0 production lines, so the waiver applies.

**Notes** (task `ticket-to-pr-ABC-187`, on the branch, sealed via `admitAndAppend` with the worktree's context root, `at` 2026-10-21T13:44:09Z from `date -u`): `20261021T134409Z-software-engineer-decision-45ccc2b7`, `…-observation-291ee80a` (criteria), and `…-observation-92522336` (gates and the A4 risk).

**`node_modules`:** a symlink into the main checkout. It is git-ignored (`.git/info/exclude`), so I left it in place.

**Trace row** (10 cells, not appended):
`| ABC-187 (SE) | Lowered the AGENTS.md byte guard 24,576 → 18,432, re-sourced its JSDoc to ABC-187 / …cba9c8eb, fixed the stale closer count 13 → 8 (QE-164-h) | — | — | QE-164-h | grugops/ABC-187 @ 1151e7c8<br>src/cli.test.ts (+3 −3) | lint, typecheck, build rc 0; npm test 59 / 1987 passed; skip-integrity 0; A2 18,433 B base pass / head fail, 18,432 B head pass; A4 command as written prints src/cli.test.ts (pathspec defect), reference form empty | waiver (0 production lines) | — | In Development → Scribe hop (AGENTS.md:7), then In Review |`
