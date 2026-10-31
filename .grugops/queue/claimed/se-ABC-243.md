---
subtask: se-ABC-243
role: software-engineer
ticket: ABC-243
ref: .grugops/context/se-ABC-243/
branch: new grugops/ABC-243 from main ae7211c3 (worktree .claude/worktrees/se-ABC-243)
width: shared with a records-only BA/PM; no timed reads owed by the SE
---
# SE ABC-243 (XS, test-only): setoption-Hash row reads a bare go; TT memory row names its budget; QE-241-a UCI fen row
## Read
plans/tickets/ABC-243-the-setoption-hash-row-reads-a-bare-go-at-level-5-and-the-tt-memory-row-names-the-budget-it-reads.md (all FOLDED blocks; A1–A6; the ABC-244 census note: A1's bare go keeps step 100, census line owed), ADR-0046 § Addendum
2026-10-30 R1–R4, qe-ABC-241 QE-A4e and QM3 (on main under .grugops/context/qe-ABC-241/), QE-244-a carry (do not make ABC-241 A4/A7 shallower).
## Do
Build A1–A6 test-only; census line per new/changed real-search row; gates via `npm run …`; npm test count and an informal wall
(G8 headroom: 9.25 s; ABC-243 estimate ≈ +0.03 s). Reproduce QM3 red on the new A6 row (scratch only).
## Fences
Only the two test files the ticket names. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host paths. Wait on jobs via output file or `kill -0 <pid>`, never `while pgrep -f`. Scratch `se-243/`.
## Publish
Sealed notes (task `se-ABC-243`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
