---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:30:43Z
subtask: se-ABC-278
role: software-engineer
ref: .grugops/context/se-ABC-278/
branch: new grugops/ABC-278 from main — worktree .claude/worktrees/se-ABC-278
width: wrap EVERY test/build run (every vitest / node --test too) in flock on the host lock (<scratch>/host-test.lock; real path in your dispatch message). One core. No games. Placeholders in committed files; fixtures synthetic, built at run time.
---
# Build ABC-278 (records path check hardened)
Build per plans/tickets/ABC-278*.md (A1–A9) and qe-ABC-277 gaps …7d149fbd: text diff regardless of .gitattributes (QE-277-a MEDIUM), .xz decompression, wider foreign-argv (≤ 10 new non-process hits at base), home path before . - _, clean quoted names + unquote test, both homes (HOME and account home), runbook real-HOME line. Must exit 0 with --base main and --head main.
Fences: tools/grugops/records-path-check*.js + one line of memory-bank/70-runbook.md. No src/. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-278, contextRoot = worktree's .grugops/context); queue moves inside your worktree; run the check before your final commit (exit 0); commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: ABC-278 built. Branch `grugops/ABC-278`, code commit `d7c0b3ce`** (from `main` `361a5af3`). It is not pushed and not merged. Finished 2026-11-03T15:37:47Z.

- **Change:** `tools/grugops/records-path-check.js` (+127 −46):
  - `--text` on the added-lines diff (QE-277-a);
  - `.xz` decompressed by `xz -dc`, with no shell and a 256 MiB cap; a missing xz is one UNKNOWN finding (-b);
  - foreign-argv shapes c–f: flags before the absolute path, an absolute executable alone, `ps -ef` and `ps aux` (-c);
  - home-path also hits before `.`, `-` and `_` (-d);
  - the `+++` header's trailing TAB is dropped before `unquote`, and `unquote` is exported (-e);
  - the home classes cover both `os.homedir()` and `os.userInfo().homedir` (-f).
  The proof file gains 23 rows (+255 −7); the 18 old rows are unedited, only the `run` helper was split into `runIn`. `70-runbook.md` gets 1 line naming "the real `HOME`".
- **A1–A10 MET.** **Proof: 41/41.** Every fix has a row that goes red without it (mutations checked).
- **A1:** the four checkouts × two attribute settings all exit 1 with the same finding set. A NUL-byte record and `info/attributes` each exit 1.
- **A4:** at `361a5af3`, foreign-argv hits 77 lines before and 80 after. Of the 3 new hits, 2 are process lines and 1 is not. **New false positives: 1** (bar ≤ 10).
- **A9:** the check exits 0 on the branch with `--base main`, on `main..main`, and on the `541ddf45^1..541ddf45` range (**0 findings**).
- **A10:** lint, typecheck and build are green. **`npm test` passes 66 files, 2566/2566.** `src/ data/ vitest.config.ts` show 0 lines.
- **Speed:** 0.09 s at 200 files, including 1 `.xz`.
- **Notes** (sealed with `admitAndAppend`, 0 findings):
  - `20261103T153716Z-software-engineer-decision-5b424fec`
  - `…-observation-476142cf` (acceptance as run)
  - `…-observation-ada9e5a7` (branch and files)
- **Not done:** the board move from In Development to In Review is left to the Orchestrator.
- **STOP:** none. Nothing is left running, and the node_modules symlink is removed.
