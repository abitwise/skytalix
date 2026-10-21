---
subtask: qe-ABC-192
role: qe-e2e
ticket: plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md
ref: .grugops/context/qe-ABC-192/
branch: grugops/ABC-192 (tip b5b8b0f9; code 5d1fbaa7; base 47a3c9a1); worktree ../wt-ABC-192 (read only)
width: 2 (beside arch-build-ABC-193)
---

# QE gate for ABC-192 (parser-read pin that `setup` hands the guard `process.stdout`; vitest version pin with the re-run list as its message). A1–A4

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A4 against the page with your own runs, before opening the SE's notes on the branch.
- **Re-plant independently** in scratch copies outside the repository (private `TMPDIR`; copy `node_modules` in full — the SE found a symlinked layout gives two vitest instances and 23 false snapshot failures): M4 `process.stderr`, M4b `{ write() {} }`, a vitest version bump; plus your own — e.g. `guard` called through an alias or spread, `process["stdout"]`, a second `setup` export, a stdout wrapper, the call moved out of `setup`, the version read from the lockfile instead. Say which survive and whether a survivor matters against QE-176-a/-b's intent.
- A3: no new spawned child (`N8_SPAWN` 28), no timing.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs heap 400, whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-192` on a branch from the tip. Scratch copies only outside the repository. Never set git config.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-192 page there.
- No edits to `src/` (other than nothing), `tools/`, `AGENTS.md`, `memory-bank/`, `package*.json`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-193`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-192`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-192.md` + `.claim.md`, main's tree, uncommitted).
