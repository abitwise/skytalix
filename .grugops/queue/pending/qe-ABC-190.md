---
subtask: qe-ABC-190
role: qe-e2e
ticket: plans/tickets/ABC-190-the-lock-root-lacks-the-license-and-bin-that-package-json-carries.md
ref: .grugops/context/qe-ABC-190/
branch: grugops/ABC-190 (tip d79f4684; lock commit 15766056; base 823a9885); worktree ../wt-ABC-190 (read only)
width: 3 (beside ticket-to-pr-ABC-189 and bapm-rule-QE-178)
---

# QE gate for ABC-190: `package-lock.json` regenerated so the lock root carries `license` and `bin`. One file, 4 added lines, ZERO `src/` lines

## Do
- Create your own worktree `../wt-qe-ABC-190` on `grugops/qe-ABC-190` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the merge sha. If `main` moved its lock, regenerate nothing: report the conflict and stop.
- Verify every criterion on the page (A1–A3 and any others) with your own runs **before** opening the SE's notes (`…723e5ad8`, `…a451fa4c`, `…c86e3c83` on the branch).
- Independently: run the page's regeneration command on a fresh clone of base and confirm it produces byte-for-byte the same 4 lines, and that re-running it at the tip is a no-op. `npm ci --ignore-scripts` on a fresh clone of the tip exits 0 with a clean status. Check that no `version`/`resolved`/`integrity` line or dependency entry moved. Run `npm audit --json` at base and tip and compare the counts (expected 7 both; AR-1 is not yours to re-state).
- Check whether any test or tool reads the lock root (e.g. grep `package-lock` in `src/` and `tools/`) and whether this change can turn one red.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture as spelled → `test-skip-integrity.js`. Heap 128. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-190-x`). Say whether QE-172-a's close condition is met.

## Fences
- Work only in `../wt-qe-ABC-190`, plus fresh clones in your scratch area. Run npm only there, never in main's checkout. Commit typed notes inside your worktree (context root: `../wt-qe-ABC-190/.grugops/context`) and a `## QE` section on the ABC-190 page there.
- No edits to `package*.json` on the tip, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-190`). Pass your worktree's `.grugops/context` explicitly. Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-190.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
