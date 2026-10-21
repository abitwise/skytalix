---
subtask: qe-ABC-193
role: qe-e2e
ticket: plans/tickets/ABC-193-git-config-or-environment-can-blind-clause-bs-one-diff-call-and-a-non-ascii-production-file-goes-unseen.md
ref: .grugops/context/qe-ABC-193/
branch: grugops/ABC-193 (tip 3d734fa1; harness e6f91f1d, code 63eadabe, ADR+out 6b83874c; base 47a3c9a1); worktree ../wt-ABC-193 (read only)
width: 2 (beside qe-ABC-192)
---

# QE gate for ABC-193 (diff call immune to config/env routes; `-c core.quotePath=false` on every git call; still-quoted paths fire as disputes; 20-row harness; ADR-0036 § S1 block). Your read of A2–A7 closes `AR-191-GITENV` and AR-191-QUOTEPATH's instrument half

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A9 (incl. the by-hand A6) against the page with your own runs, before opening the Architect's notes (`…2b7be2e6`, `…c1511dfb` on the branch).
- **Re-plant independently:** the harness against (i) head (20 of 20), (ii) base's instrument (fails on exactly the 7 rows), (iii) each part-removed copy (the page's table). Build your own routes beyond the harness rows — e.g. `color.ui=always`, `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0` injection, a global attributes file with a `diff=<drv>` command, `diff.mnemonicPrefix`, `diff.noprefix`, `GIT_DIFF_OPTS`, other quoted names (newline, backslash, non-ASCII + `"`) — and say for each whether head fires and base is blind. Also probe R-193-a (a hunk line beginning `-- "` / `++ "`): does it really raise a false dispute, and is it only ever on the safe side?
- **Every route only inside scratch clones** with their own `.git` and private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`, or a run's own environment. **Never** in this repository, any worktree (they share one `.git/config`), or your real `HOME`. Run the stand-in below before you finish.
- **`ADR-0036` § S1 block:** dated, after ABC-191's, 0 lines edited, consistent with the code; it retires the GITENV stand-in only as far as the instrument now covers it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files; base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing. Note `/usr/bin/diff` (this host's shell defines `diff` as a function).
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether AR-191-GITENV's close condition is met and whether AR-191-QUOTEPATH's instrument half is met.

## Fences
- Work in your own worktree `../wt-qe-ABC-193` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-193 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-192`, `../wt-qe-ABC-192`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-193`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-193.md` + `.claim.md`, main's tree, uncommitted).
