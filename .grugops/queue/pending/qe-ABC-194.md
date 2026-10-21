---
subtask: qe-ABC-194
role: qe-e2e
ticket: plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md
ref: .grugops/context/qe-ABC-194/
branch: grugops/ABC-194 (tip fcf47534; code 5e0839fd; base 99d07d32); worktree ../wt-ABC-194 (read only)
width: 2 (beside arch-build-ABC-195)
---

# QE gate for ABC-194 (the guard call must be a direct statement of `setup`'s body, and `setup` holds no `return`; plant table 5 → 9). A1–A5

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A5 against the page with your own runs, before opening the SE's notes on the branch.
- **Re-plant independently** in scratch copies outside the repository (private `TMPDIR`; copy `node_modules` in full with `cp -R` — a symlinked layout gives two vitest instances and false snapshot failures): the page's builds, M4/M4b, plus your own — e.g. the call inside a block `{ … }`, `void guard(…)`, `guard(…) || 0`, a `throw` before the call, `process.exitCode`/`process.exit` before the call, a `finally`, an `await` of a never-resolving promise before the call, `HEAP_GUARD_OFF` checked inside `guard` itself, a second `setup` body path via `arguments`. Say which survive and whether a survivor matters against QE-192-a's intent (the run is no longer stopped). Re-check that base's `if (!isMainThread) throw …` still passes.
- A4: no new spawned child (`N8_SPAWN` 28), no timing.
- **Gates** on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs heap 400, whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing. AR-193-HUNKHDR stand-in: `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-194` on a branch from the tip. Scratch copies only outside the repository. Never set git config; never touch `node_modules/` in main's checkout.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-194 page there.
- No edits to `tools/`, `src/`, `AGENTS.md`, `memory-bank/`, `package*.json`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-195`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-194`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). Append-only; `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/qe-ABC-194.md` + `.claim.md`, main's tree, uncommitted).
