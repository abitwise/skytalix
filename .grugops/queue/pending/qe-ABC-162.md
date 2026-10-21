---
subtask: qe-ABC-162
role: qe-e2e
ticket: plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
ref: .grugops/context/qe-ABC-162/
branch: grugops/ABC-162 (tip 3d05e230; base 51503331); SE worktree ../wt-ABC-162 (read only)
width: 3 (beside qe-ABC-160 and ticket-to-pr-ABC-159; other worktrees, other files)
---

# QE gate for ABC-162. Its close also closes AR-095-CWD.

## Do
- **Re-plant.** Verify A1–A4 against the page. Re-plant P6b, the cwd-relative book read, yourself in scratch copies **outside** the repository, testing it at base and at head. Base must be green and head red, at `A7`. Add any further wrong build you think the new row should kill.
- **Independence.** Do not copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-162/`). You may read its decision note `…fb754378` for the design only.
- **Temp directories.** Check that the per-run `mkdtemp` directory is removed by exact path. Parallel agents also create temp directories, so don't count by glob.
- **Gates.** Re-run on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Every vitest call takes `NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 51503331...3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'`.
- **SE leftover `…cdcaf82a`.** `AGENTS.md:123-126` says "Two real children" but the lane starts 6. Grade whether it is stale and route it (Scribe). Do not edit it.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-162` on a branch from the tip. Commit typed notes and a QE section on the ABC-162 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-162`).
- Finish with `.grugops/queue/done/qe-ABC-162.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
