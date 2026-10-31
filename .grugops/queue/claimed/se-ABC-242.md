---
subtask: se-ABC-242
role: software-engineer
ticket: ABC-242
ref: .grugops/context/se-ABC-242/
branch: new grugops/ABC-242 from main 3628fe99 (worktree .claude/worktrees/se-ABC-242)
width: alone on the host; no other hop runs while you time anything
---
# SE ABC-242 (S, P3): on a blunder level, a root move making the third occurrence scores exactly 0
## Read
plans/tickets/ABC-242-on-a-blunder-level-a-root-move-that-makes-the-third-occurrence-scores-exactly-0.md (every block; A1–A8; NFR triggers R1–R4; Test notes 1–5),
ADR-0054 (§ Proposed amendment 2026-10-30, now ACCEPTED) and ADR-0032 d1/d2, ADR-0046 § Addendum 2026-10-30 R1–R4,
qe-ABC-230's probe (.grugops/context/qe-ABC-230/raw/qe-scripts/blunder-probe.mjs and raw/spot/blunder-probe.txt) and the QE-244-a carry
(do not make the ABC-230/241 rows shallower). Where the ADR and the ticket differ, the ADR rules.
## Do
- The check goes in src/levels.ts `blunder`, as the ADR says: a private helper and a named 100-key constant pointing at the ADR. No new import or export. src/engine.ts and src/search.ts stay byte-identical.
- Tests: A1/A2/A3/A5/A6 in src/levels.test.ts; A4 in src/cli.test.ts + src/uci-session.test.ts (rebase-order file shared with ABC-243, now merged).
- Lane form: level 1's own 100 ms at the coarsest kill-set-preserving step (R2). Never the probe's 2 000 ms / virtualClock(1) (R4). One step across A4's three callers (R3). One R1 census line per row in the build note.
- Pin against base in the same run (Test note 2). Record UNKNOWN - verify values as read; do not pin them.
- Gates via `npm run …` (lint, typecheck, build, test). Report the test count. Take an informal G8 wall with the host clear (G8 now 9.28 s; estimate +0.05..+0.15 s; > 9.6 s fires tranche 2, so report it, don't fix it).
- Run ENGINE_DEEP levels lane and LADDER_DEEP short once.
## Fences
- Touch only the 4 files named. No push, force, amend, rebase, or merge into main. No board edits.
- Never bare npx or npm exec. No host paths in committed files.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait (QE-243-a).
- Scratch `se-242/`.
- STOP and hand back if the design cannot be met as the ADR words it.
## Publish
Sealed notes (task `se-ABC-242`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
