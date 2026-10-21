---
subtask: qe-ABC-182
role: qe-e2e
ticket: plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md
ref: .grugops/context/qe-ABC-182/
branch: grugops/ABC-182 (tip a7adaf21; code 053595af; base 19abbdb1); SE worktree ../wt-ABC-182 (read only)
width: 3 (beside qe-ABC-181 and qe-ABC-183)
---

# QE gate for ABC-182 (the committed Ruling 2 plant harness; 0 `src/` lines)

## Do
- Verify A1–A6 against the page, running the harness yourself. Order:
  - **A3 first:** the `341da4c1` copy of `clause-b.mjs`, placed where `typescript` resolves. Exit nonzero, with exactly `P2b`, `P2c`, `CMT`, `X1` named on limb 1.
  - **A2:** the folded instrument at the code tip. 7 rows as the page's table states, limbs 2 and 3 identical to `341da4c1` on 7 of 7, exit 0, and the repo's `git status --porcelain`, `HEAD` and refs unchanged afterwards.
  - **A4:** your own `ALT` (one byte of limb 2's output changed, scratch only). It must exit nonzero and name limb 2. Delete it afterwards.
  - **A5:** re-run A2 at the same tip; diff against the committed `r2-mutants.out.txt` byte for byte.
- **Grade the plants, not just the exit code.** Read each plant body in the script against the page's table and against your own `ABC-163` plants (`…7f56f339`). In particular:
  - limb 1 is read from the `(b1) capability` and `(b1) Ruling 2` lines, never a bare `(b1)` grep (Architect decision 2, G-3);
  - `NOH` sits at `f00038ef^1` (`619abc14`);
  - the `G1-*` rows are labelled as the `AR-163-DELONLY` gap.
- **A1:** the SE says A1 holds exactly at the code commit `053595af`; at the tip the diff also lists the SE's 3 notes. Rule on whether that meets A1 as the page intends.
- **Independence.** Do your own runs and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-182/` on the branch).
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success (1987);
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-182` on a branch from the tip. Plants only in clones under a private scratch dir.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-182 page there.
- No edits to `clause-b.mjs`, `r2-mutants.*`, `src/`, `biome.json`, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-182`).
- Write `.grugops/queue/done/qe-ABC-182.md` (brief + `## Result` + trace row as one `| ABC-182 | … |` line) and `.claim.md`, uncommitted on main.
