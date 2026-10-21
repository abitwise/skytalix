---
subtask: qe-ABC-159
role: qe-e2e
ticket: plans/tickets/ABC-159-four-nfr-test-headers-carry-a-running-tally-of-the-catalog-and-they-disagree.md
ref: .grugops/context/qe-ABC-159/
branch: grugops/ABC-159 (tip 3c505abe; base 4ab5b453); SE worktree ../wt-ABC-159 (read only)
width: 3 (beside qe-ABC-160 and qe-ABC-162; other worktrees, other files)
---

# QE gate for ABC-159 (header comments only)

## Do
- Verify A1–A4 against the page. **A3 is yours to grade:** the wording of the four rewritten headers.
  - **The bar:** each says the bar is a count because a timing bar cannot fail on its regression.
  - **No tally:** no count or ordinal of catalog citations remains, including ones A1's search misses (e.g. "both times").
  - **Independence:** do not copy the SE's readings in `.grugops/context/ticket-to-pr-ABC-159/`.
- **A4 counts.** Read them literally as the page writes them. The heap rule:
  - `--max-old-space-size=400` is for ONE-file vitest runs only.
  - A whole-suite or multi-file vitest call uses 128, which is what `npm test` sets itself. The repo's heap guard (`tools/grugops/heap-guard.js`) refuses 400 there.
  - The SE's per-file 400 workaround is in `…c7a671d8`. Grade whether it is equivalent; it's not a substitute for your literal read.
- **Diff.** Confirm the diff is four files, every hunk inside a `/** */` header, and that no executable line changes.
- **Gates.** Run on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Those two deep lanes are one-file runs at 400. Run one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 4ab5b453...3c505abe -- src | grep -vE '\.test\.ts$|__snapshots__'`.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-159` on a branch from the tip. Commit typed notes and a QE section on the ABC-159 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-159`). `AGENTS.md` wrongly says that writer is absent; that line is a known stale entry owed to the Scribe.
- Finish with `.grugops/queue/done/qe-ABC-159.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
