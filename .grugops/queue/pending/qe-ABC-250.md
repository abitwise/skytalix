---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T19:31:13Z
subtask: qe-ABC-250
role: qe-e2e
ref: .grugops/context/qe-ABC-250/
branch: new grugops/qe-ABC-250 from grugops/ABC-250 (head 35139b31; code 2e04eee5; base ceb28780) — worktree .claude/worktrees/qe-ABC-250
width: ALONE WINDOW — dispatched only when no other hop of this session runs; nothing else dispatched until you report. Hold `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock` for every run and for the whole A4 read.
---
# QE: grade ABC-250 (packed moves, perft first) — S2, no smoke
## Ticket
plans/tickets/ABC-250*.md, A1–A7 and "What happens on a miss" (GO ≥ 1.25× merge; HOLD/NO-GO → not merged, ABC-251 narrows to O1-c, ABC-252 dropped). SE notes on the branch .grugops/context/se-ABC-250/ (…e36367dd, …de63198a, …2107ec2a, …ff7ffb6e informal speed: perft 1.07–1.14×, search 1.00×). ADR-0055 O1-b and addendum D3-V2 (on main).
## Do
- A1/A2 re-read (spot); A3/G4 out of tree byte-equal vs base; plants of your own on the packed path (at least: promotion piece, castling rights in undo, ep square in undo).
- A4 on a sealed PREREG implementing D3-V2 for the page's perft boards and depths (if perft runs are too short for the 5 % spread, follow the page's stated depth/repetition method; if the page does not state one, choose a pre-registered repetition count BEFORE any run and say so). A5 search-nps guard under the same rule. Grade by script.
- Gates: G1 (PUZZLE_DEEP=1), G5, G6, G7 growth 0, G8, G9, lint/typecheck/build, npm test ×3, skip-integrity, lane-inventory.
- Verdict per the page: GO (PASS / PASS_WITH_GAPS) / HOLD / NO-GO / UNRESOLVED (VOID-LOAD). Record the window start/end UTC.
- Run time ≤ 45 min excluding waits; if your estimate exceeds 60 min, STOP and report first. Thermal stop. Never kill foreign processes.
## Fences
Tests and your records only; no src/ production edits, no board/plans/memory-bank. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-250, contextRoot = worktree's .grugops/context, never the plugin cache); commit; ## Result + trace row; brief + claim to done/.
