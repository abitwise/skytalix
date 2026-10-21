---
subtask: qe-ABC-172
role: qe-e2e
ticket: plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md
ref: .grugops/context/qe-ABC-172/
branch: grugops/ABC-172 (tip 2eaf1a1c; code 0bddbb43; base 3e617b26); SE worktree ../wt-ABC-172 (read only)
width: 3 (beside qe-ABC-187 and arch-ABC-168-D8)
---

# QE gate for ABC-172 (package name → `skytalix`; 0 production lines)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run every criterion at that merge and report the merge sha and any conflict (`package.json`/`package-lock.json` are shared with ABC-168, which is blocked, and ABC-187 may land).
- Verify `A1`–`A5` against the page with your own runs, before opening the SE's notes.
- **Rule on the lock deviation.** The page says regenerate `package-lock.json` with `npm install --package-lock-only`, not hand-edit; `A2` allows exactly two changed lines. Regeneration also adds `packages[""].license: "UNLICENSED"` (ABC-169 added `license` to `package.json` without regenerating the lock). The SE removed that third line by hand to meet `A2`, checked no resolved version moved, and ran `npm ci` (rc 0) on a scratch copy. Say which reading of the page is right (A2 literal vs the regenerate rule), and whether the license line should land here, separately, or not at all.
- **No name left behind:** search the repo (outside `node_modules`, `.grugops/`, `plans/` history and dated records) for `cli-chess` as a package name and judge each hit against the page's Scope and Out of scope (Q14: `npm run chess` keeps its name; directory and remote are the owner's).
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`; `CLI_DEEP` (11/11, 6 children with `--reporter=verbose`) and `PERFT_DEEP`. Heap 400 one-file, 128 multi-file. No timing. UAT waiver in AGENTS.md's form.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-172` on a branch from the tip. Lock experiments only in scratch copies.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-172 page there.
- No edits to `package.json`, `package-lock.json`, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-172`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-172.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-172 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
