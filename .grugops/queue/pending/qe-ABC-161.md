---
subtask: qe-ABC-161
role: qe-e2e
ticket: plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
ref: .grugops/context/qe-ABC-161/
branch: grugops/ABC-161 (tip 5e755bcb; code ee1818bb; base 35788fd4); SE worktree ../wt-ABC-161 (read only)
width: 1
---

# QE gate for ABC-161 (three rows in `src/cli.test.ts`; 0 production lines)

## Do
- Verify A1–A4 against the page as re-worded by BA/PM (`bapm-rework-ABC-161`, `…b0020834`). **Re-plant every row yourself**, base test vs head test, scratch copies outside the repo, private `TMPDIR`:
  - **A1:** P11-L1, P11-L2, P11-L3 green → red (3 of 3); P11 and P11-L4 red on both. The row's non-vacuity block is kept.
  - **A2:** S2c green → red; `resolveOptions(["--difficulty", "3\n"])` refused with `offending: ["3\n"]` on the delivered build.
  - **A3:** P9a–P9e green → red (5 of 5) on scratch copies of `AGENTS.md`; the real `AGENTS.md` green on head.
- **Grade the new set-equal check (fix 3) beyond the plants.** It derives each option's values by calling `resolveOptions` and reads the documented list as the `|`-joined run after the option (`expect(lists.length).toBe(1)`). Find what it is blind to or over-strict about (e.g. a value list re-worded with spaces, an option that takes a value but has no `|` list, a single-value list). Record survivors with their severity.
- **A1's comment claims** seed 7 draws 0.0117, 0.0620, 0.9769 and that a rebuild at any level 1–4 differs by call 2. Check that claim against the code, not the SE's notes.
- **Independence.** Do your own plants and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-161*/` on the branch).
- **A4 fences:** exact file list; every changed line inside the three named `it` blocks; test counts equal base (59 / 1987), skips 0.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-integrity `--skip-count 0`; `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-161` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-161 page there.
- No production files, `AGENTS.md`, `plans/board.md`, or other ticket pages. Plants only in scratch copies.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-161`). **Pass your worktree as the context root explicitly**; the writer's default root is the plugin's own directory. Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-161.md` (brief + `## Result` + trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.
