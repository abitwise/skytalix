---
id: 20261022T134243Z-software-engineer-decision-b7b1e60f
kind: decision
by: software-engineer
at: 2026-10-22T13:42:43Z
verified_by: 
confidence: high
refs:
  - ABC-168
  - grugops/ABC-168
  - merge-prep-ABC-168
  - a7857e0b
  - a2c5f673
  - 243c2fdf
  - ABC-176
  - scribe-waiver-quotepath
supersedes: 
seal: sha256:461a518405eb5df84e9a971a8a4250a80697d9c1e54bc88e2213892a2cff5d68
---

# ABC-168 merge prep: main a7857e0b merged into grugops/ABC-168 as a2c5f673, both sides kept

`git merge main` (merge commit, no rebase) from b71f8902; merge-base c98509b3, main 89 ahead.

**One conflict hunk, `memory-bank/90-agents-md-command-log.md` (~:987).** Both sides appended a dated Scribe pass entry after the `QE-164-b` paragraph: HEAD the `scribe-ABC-168` pass, main the `scribe-ABC-176` and `scribe-waiver-quotepath` passes. These are append-only history entries, and neither changes the other's meaning. **Resolution:** keep all three, `scribe-ABC-168` first (written 2026-10-21T14:16Z), then main's two in main's order. Each entry is verbatim. Its byte figures (16,090 B; 15,797 B; 15,821 B) stay true as history of their own branch. `git diff main` on the file now shows only ABC-168's Scope 5 entries (lane row, "UCI entry point", "Real-engine UCI lane", the Build rewrite and the pass entry).

**Clean auto-merges, checked against main:** `AGENTS.md` differs from main by exactly Scope 5's three lines (the `npm run uci` line in Development, the UCI_DEEP lane line and the Build comment). main's waiver form, the ABC-176 comments and the byte budget text are intact. `src/cli.test.ts` differs from main by exactly Scope 6's four pin edits (4+/2-). main's newer rows (ABC-176/187/192/194) are intact, including `AGENTS_MD_BUDGET_BYTES = 18_432`.

The QE-187-a comment fix is a separate commit, 243c2fdf. No other edit.
