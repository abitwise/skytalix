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

## Result

**2026-10-31, Software Engineer. Done. Branch `grugops/ABC-242`, from `main` `4387d4e8`. Code `6884d61a`; the notes, brief and claim are in the next commit. Not merged, nothing pushed.**

- **Build:** in `src/levels.ts` `blunder`, before each child search, the private `standsTwiceBefore(child, keys)` runs. It is the engine's pre-root walk at ply 0: `−4, −6, …` down to `−min(c, |K|, PRIOR_KEYS_WINDOW = 100)`, true at the second match. When it is true the move scores 0 and its child is not searched. No new import or export. `engine.ts` and `search.ts` are byte-identical. Decision `…8b42a94e`.
- **Rows:** `src/levels.test.ts` has 8 (A1 ×3, A2, A3, A5, A6 ×2), checked against a test-local base oracle in the same run. That oracle's agreement with the level is asserted wherever the check cannot fire. `src/cli.test.ts` and `src/uci-session.test.ts` have 1 A4 row each: seed 7 (draw 0.0117 < 0.4), one step on all three callers, the same move from all three, UCI's `depth`/`nodes` equal to the direct call's, and the direct list carries the 0.
- **Lane form (R1–R4):** level 1's 100 ms at step 10 on every row. Kill sets on the frozen M1–M8 are identical at steps 1, 10, 100 and 1 000. Condition 2 refuses 100, because it gives 1 read per blunder call. Census `…712a6bb4`: 10 reads per blunder call, 2 per child.
- **Gates:** lint, typecheck and build exit 0. `npm test` 63 files, **2 333 passed**, skips 0 (was 2 323). Informal wall 9.22 / 9.39 / 9.18 s (median 9.22 s, no base this window), so tranche 2 does not fire. `G8` is QE's.
- **Deep:** `ENGINE_DEEP` levels 53/53 green (577.66 s). `LADDER_DEEP=1` short 18/18 green; levels 1–5 still ordered.
- **A1 readings** (not pinned; `…76069fd1`): probe at the lane form `[0, −990, −1012, −1003, −1002]`, plays `d8c8`. QE's set-up gives head `[0, −1041, −1030, −1015, −1031]` (plays `d8e7`) and base `[−1020, …]`, not −1013 (SE-242-a).
- **Findings** `…c0e5e0fa`: SE-242-a..f, INFO/LOW. SE-242-b: on a plain 2-cycle, base already reads the winner's third occurrence as 0. UAT is owed; the QE verdict signs it.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-242 | On a blunder (levels 1–4), a root move whose child is the third occurrence scores exactly 0 and is not searched (CLI and UCI through createLevel) | EPIC-010 | ADR-0054 § Proposed amendment 2026-10-30 (accepted); ADR-0032 d1 added bullet; ADR-0046 § Addendum R1–R4 | NFR-004 ≤ 49 comparisons per root move, none allocated; NFR-008 informal tip 9.22 s, G8 owed; R1 census 10 reads per call at step 10 | grugops/ABC-242 @ 6884d61a: src/levels.ts, src/levels.test.ts, src/cli.test.ts, src/uci-session.test.ts | npm test 63 files / 2 333 pass, skips 0; parity M1–M8 identical at steps 1/10/100/1000; ENGINE_DEEP levels 53/53; LADDER_DEEP short 18/18 | UAT owed (prod lines in src/levels.ts); QE verdict signs | — | In Review (branch, not merged; QE and G8 owed) |
