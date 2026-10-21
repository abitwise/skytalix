---
subtask: qe-ABC-195
role: qe-e2e
ticket: plans/tickets/ABC-195-an-added-line-starting-plus-plus-hides-later-hunks-from-clause-b-and-a-production-file-whose-name-holds-a-space-goes-unseen.md
ref: .grugops/context/qe-ABC-195/
branch: grugops/ABC-195 (tip f9709ed8; harness 5e840c58, code 0dfd17b3, ADR+out 6b0f8575; base 99d07d32); worktree ../wt-ABC-195 (read only)
width: 2 (beside qe-ABC-194)
---

# QE gate for ABC-195 (headers only before a file's first `@@`; one trailing TAB stripped from unquoted header paths; 25-row harness with control twins and a plant check; ADR-0036 § S1 block). Your read closes `AR-193-HUNKHDR` and `AR-193-SPACEPATH`

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion against the page with your own runs, before opening the Architect's notes (`…6a068acf`, `…1bafd98d` on the branch).
- **Re-plant independently:** the harness against (i) head (25 of 25), (ii) base's instrument (the page's base-red table), (iii) each half-removed copy. Build your own beyond the rows — e.g. `++ ` / `-- ` lines at the first and last line of a hunk, several in one file, in a deleted file, a `+++ b/<other file>` redirect inside a new file, a `diff --git` look-alike line inside a hunk, names with two spaces / a trailing space / a leading space, a name with a space and non-ASCII, a name with a real TAB (must be C-quoted and dispute). Say for each whether head reads right and base was wrong. Check the twins and the plant check really guard against a drifting anchor.
- Plants only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff`.
- **`ADR-0036` § S1 block:** dated, after ABC-193's, 0 lines edited, consistent with the code; it retires the HUNKHDR stand-in only as far as the instrument now covers it, and states block (i)'s scope exactly (QE-193-c). Note the Architect spelled the heading id in backticks.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files; base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. HUNKHDR stand-in: `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether AR-193-HUNKHDR's and AR-193-SPACEPATH's close conditions are met.

## Fences
- Work in your own worktree `../wt-qe-ABC-195` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-195 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-194`, `../wt-qe-ABC-194`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-195`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-195.md` + `.claim.md`, main's tree, uncommitted).
