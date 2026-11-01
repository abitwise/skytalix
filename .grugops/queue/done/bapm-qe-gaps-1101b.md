---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:28:55Z
subtask: bapm-qe-gaps-1101b
role: ba-pm
ref: .grugops/context/bapm-qe-gaps-1101b/
branch: new grugops/bapm-qe-gaps-1101b from main (worktree .claude/worktrees/bapm-qe-gaps-1101b)
width: records only, beside se-ABC-250.
---
# BA/PM: route the second batch of QE gaps (all LOW/INFO)
## Gaps (notes on main)
- QE-260-a LOW (qe-ABC-260 …be1935aa): regex literals holding a quote or \/\/ can still hide code from the source scans; none exists today. Orchestrator ruling: no ticket — add a dated review note on ABC-251 (beside QE-259-c's note).
- QE-261-a LOW (qe-ABC-261 …c385f9a2): early-exit row reads only a king-move-first board; add a pawns-first board (e.g. 4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1).
- QE-261-b LOW: promotion row is white-only; add colour-mirrored boards.
- QE-261-c LOW: add a dated note on ABC-250 (and ABC-251/252 if they touch generation order): a generator reorder breaks ABC-261's precondition — re-board, never drop the bar.
- QE-255-a LOW (qe-ABC-255 …f41a5b6e): no offline row covers machine.txt's control: line.
## Do
Decide: bundle QE-261-a/b (+ QE-255-a if natural) into one XS test-only ticket, or decline with reason (diminishing returns is an acceptable reason; say which plants then stay uncaught). Add the notes to ABC-250/251(/252). Keep DoR honest; tag EPIC-010 milestone 1b only if it must land before ABC-251, else EPIC-011 M0.
## Fences
plans/tickets/ (named + new), plans/epics/EPIC-010*/EPIC-011* (rows only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-qe-gaps-1101b, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.

## Result
- **Cut: `ABC-262`** (QE-261-a + QE-261-b), XS, **P3**, `EPIC-011` phase 0 (M0), tickets row 14, Backlog, **DoR 10/10,
  Ready recommended**. It adds two new default-lane rows beside `ABC-261`'s and edits none of them.
  - The early-exit row reads the pawns-first board B2 `4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1`, with a bar of **≤ 1** attack
    test. QE's probe read production 1, QX1 2, PL3a 9, QX2 10, so all three turn red.
  - The in-check promotion row reads black to move on the mirrors P1′/P2′; QB turns it red.
  - Rows ≤ 20 ms; base + 2; `G8` ≤ 10 s. A stop rule covers the base count and the hand-checked FENs.
- **Placement, by the brief's rule:** M0, not 1b. `ABC-251` touches neither `src/legal.ts` nor generation order, so
  nothing forces the ticket ahead of it. Recommended order (not binding): after `ABC-250` merges or is dropped, before
  `ABC-252`. It does not hold `EPIC-010`'s close.
- **Notes carried:**
  - QE-261-c as dated re-board notes: `ABC-250` test note 6, `ABC-252` test note 5. Re-pick the board or use an
    order-free precondition; never drop the bar. Not on `ABC-251`: its scope keeps generation order (C1) and does not
    touch `generateMoves`.
  - QE-260-a as `ABC-251` test note 7 (review habit, beside QE-259-c), with one QE-260-b clause (same remedy, not
    briefed).
  - **Relay:** `se-ABC-250` is running; the Orchestrator may pass the QE-261-c note to it before this branch merges.
- **Declined: QE-255-a.** It is not natural to bundle (`tools/rating/`, another lane and epic). Alone it is diminishing
  returns: a records line QE saw correct in 3/3 real reads, and it changes no reading. **M8** (the `control:` line
  dropped) stays uncaught offline. Re-open trigger: an edit to `rating.ts`'s `machine.txt` writer, or a reading whose
  `machine.txt` lacks the line.
- **Commits:** claim `770a5046`; records `f4621970`; notes, this Result and the move to done/ in the closing commit.
- **Notes (sealed, contextRoot = this worktree; `at` from `date -u`):** decision
  `20261101T193428Z-ba-pm-decision-a475f2c3`, observation `20261101T193428Z-ba-pm-observation-4602dcb9`.
- **Trace rows (appended to `plans/traceability.md`):** ABC-262 ← QE-261-a/b ← `ABC-261` ← `ADR-0003` ← EPIC-011 M0;
  bapm-qe-gaps-1101b → ABC-262 and the notes. Refs on both notes.
- No board, `memory-bank/`, `src/`, `tools/`, `data/` or `EPIC-010` edit. Nothing run, built, timed, pushed or merged.
