---
subtask: qe-ABC-160
role: qe-e2e
ticket: plans/tickets/ABC-160-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-first-character.md
ref: .grugops/context/qe-ABC-160/
branch: grugops/ABC-160 (tip 1d2fd467; base 51503331); SE worktree ../wt-ABC-160 (read only)
width: 3 (beside ticket-to-pr-ABC-162 and -159; other worktrees, other files)
---

# QE gate for ABC-160

## Do
- **Mutants.** Verify A1–A3 against the page. Re-plant the mutants yourself in scratch copies **outside** the repository, testing each at base and head:
  - `Q-SUFFIX8`, `Q-SKIP8`, `Q-PREFIX`, `Q-CASE`;
  - `M05`, `M-SWAP`, `M06`.
- **Independence.** Do not copy the SE's readings in `.grugops/context/ticket-to-pr-ABC-160/`. You may read its decision note for the case shape only.
- **Gates.** Re-run them on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Every vitest call takes `NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 51503331...1d2fd467 | grep -v '\.test\.ts$' | grep '^src/'`.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-160` on a branch from the tip. Commit typed notes and a QE section on the ABC-160 page there.
- No production files, `plans/board.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with the sanctioned writer: `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-160`). It sits in the plugin cache, not in the repo or the kit.
- Finish with `.grugops/queue/done/qe-ABC-160.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
