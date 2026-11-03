---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T14:59:13Z
subtask: se-ABC-277
role: software-engineer
ref: .grugops/context/se-ABC-277/
branch: new grugops/ABC-277 from main — worktree .claude/worktrees/se-ABC-277
width: wrap EVERY test/build run (every vitest too) in flock on the host lock (<scratch>/host-test.lock; the real path is in your dispatch message). One core. No games. Write <home>/<repo>/<scratch> placeholders in committed files.
---
# Build ABC-277
Build per plans/tickets/ABC-277*.md and sec-host-paths decision …72b4070b. A1–A7 per the page (A7 SEC-HP-2 redaction ONLY if the owner says yes — he has not yet; skip it). Also QE-274-d: make .gitignore ignore a node_modules symlink (`node_modules` without the trailing slash). The check must pass on main as it is today (A2).
Fences: new tools/grugops/ script + its test, memory-bank/45-standing-rulings.md, memory-bank/70-runbook.md, 40-contributing.md, .gitignore. No src/ changes. Another Engineer builds ABC-276 in parallel (no file overlap). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-277, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: ABC-277 built. Branch `grugops/ABC-277`, code commit `861de9c5`** (from `main` `b62e8049`). It is not pushed and not merged. Finished 2026-11-03T15:09:01Z.

- **Change:**
  - `tools/grugops/records-path-check.js` (+293, new). It runs `node tools/grugops/records-path-check.js [--base main] [--head HEAD]` over the committed diff against the merge base, under `.grugops/`, `plans/` and `memory-bank/`. It reads added lines, and decompresses `.gz` files whole; renames are detected. A hit prints only the file, the line and the class. The five classes are home-path, home-slug, users-path, scratch-path and foreign-argv. Exit 0 means clean, 1 a finding, 2 cannot run.
  - `tools/grugops/records-path-check.proof.js` (+216, new). It holds 18 `node --test` rows, outside the lane, with synthetic fixtures built at run time.
  - The runbook gets a new section, § Before a merge into main.
  - `40-contributing.md` § Conventions gets one paragraph.
  - `45-standing-rulings.md` gets one entry, under a new `## Dated entries (2026-11-03)` section. The entry exempts the hostname.
  - `.gitignore` now ignores a `node_modules` symlink (QE-274-d).
- **A1** MET: 16/16 line hits plus 1 path hit, and 0 of the 6 planted values printed. **A2** MET: all 5 cases exit 0. **A3** MET: the branch exits 0, `--head main` exits 0, and no merge base, outside a repository and a bad argument each exit 2. **A4** MET. **A5** MET. **A6** MET:
  - lint is clean (138 files);
  - typecheck and build are clean;
  - `npm test` passes 66 files, 2566/2566;
  - lane-inventory reads 66 = 66;
  - `src/ data/ vitest.config.ts` show 0 lines.
- **A7 SKIPPED:** the owner has not answered SEC-HP-2.
- **Positive controls on history:**
  - The SEC-HP-2 file, line 5, is caught as home-path and foreign-argv.
  - `--base HEAD~40` (281 files) gives 62 findings in 155 ms, with 0 values printed.
- **Test note 2:** the foreign-argv pattern was broadened after it missed the SEC-HP-2 shape. The note `c0e2df87` names the pattern, the excluded case and the accepted false-positive cases.
- **Not done:** the board move from In Development to In Review is left to the Orchestrator, because of the parallel ABC-276 branch.
- **Notes:** written with grugops `admitAndAppend` under the worktree context root, 0 findings, index rendered. They are `20261103T150842Z-software-engineer-decision-c0e2df87`, `…-observation-8efecc46` (acceptance as run) and `…-observation-c68b59ef` (branch and files).
- **STOP:** none. Nothing is left running, and the node_modules symlink is removed.
