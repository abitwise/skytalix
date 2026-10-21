---
subtask: qe-ABC-163
role: qe-e2e
ticket: plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
ref: .grugops/context/qe-ABC-163/
branch: grugops/ABC-163 (tip dc4d4f15; instrument 87d3897d; ADR d8c073e2; base ccccc6bb); SE worktree ../wt-ABC-163 (read only)
width: 3 (beside ticket-to-pr-ABC-180 and qe-ABC-179)
---

# QE gate for ABC-163: Ruling 2 folded into `clause-b.mjs`

## Do
- **A1–A5.** Verify each against the page.
  - Re-plant P2b, P2c and the comment-only edit yourself, on a scratch `git archive` repo outside the working tree.
  - Run OLD (`341da4c1`) and NEW (`87d3897d`) on each plant.
  - Read A3 (no-holder pair) and A4 (both recorded pairs vs the record) yourself.
  - Don't copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-163/` on the branch) until yours are taken.
- **Regression.** Limbs 2 and 3 must stay byte-identical, OLD vs NEW, on the real pairs. Pick your own pairs, including at least the 9 the SE used, if you can identify them.
- **Edge cases.**
  - A holder present only at head.
  - A holder present only at base. The SE planted this one; re-plant it yourself.
  - A rename. The instrument uses `--no-renames`; check what Ruling 2 says on a rename.
- **Consumers.** The SE notes that older probe scripts grepping `(b1)` will now also match the new Ruling 2 line. Find every consumer of `clause-b.mjs` output in the repo. Grade whether any current gate or recorded reading changes meaning.
- **Lint.** Biome ignores `.grugops/`, so nothing lints the instrument. Record that as a gap if it matters.
- **Gates** on the tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
  - Heap rule: 400 for one-file runs, 128 for multi-file runs. Run one at a time. No timing.
- **UAT waiver.** Measure it in AGENTS.md's form, with no `.snap` filter.
- **Verdict.** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-163`, branched from the tip. Commit there: your notes (written inside the worktree) and a `## QE` section on the ABC-163 page.
- Do not touch `clause-b.mjs`, the ADR, `src/`, `plans/board.md` or `AGENTS.md`.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (task `qe-ABC-163`).
- Write `.grugops/queue/done/qe-ABC-163.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.
