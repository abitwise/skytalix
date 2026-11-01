---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:25:05Z
subtask: qe-ABC-254
role: qe-e2e
ref: .grugops/context/qe-ABC-254/
branch: new grugops/qe-ABC-254 from grugops/ABC-254 (head fe53dbda; code 600d8de3; base = main's merge-base 09d1f675) — worktree .claude/worktrees/qe-ABC-254
width: TESTS ARE SERIALIZED. Wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`; hold the lock for your whole A4 timing window. se-ABC-249 may queue on the same lock; records hops run beside you (no CPU).
---
# QE: grade ABC-254 (lazy legality) — S2, no smoke
## Ticket
plans/tickets/ABC-254*.md, Acceptance A1–A6. SE hand-back: se-ABC-254 notes in its branch (.grugops/context/se-ABC-254/, decisions …cb525705, …7f5312e8; observations …4a50887c, …1b77dfbe (SE's SHARED nps: 1.10–1.13×, decides nothing), …d672f92e).
## Do
- Re-read A1/A2/perft (spot-run; SE claims green) and own A3/G4 out of tree (byte-equal vs base 09d1f675), A5 gates (G1 54/58 PUZZLE_DEEP=1, G5, G6 ≥ base, G7 growth 0, G8 ≤ 10 s / new rows ≤ 0.1 s, G9), and A4 on a sealed PREREG: 5 interleaved fresh-process runs per board per build at 4 000 ms on kiwipete, position-6, start, plus position-4 in-check guard ≥ 0.97×; bar ≥ 1.10× on two boards, ≥ 1.00× on the third; ADR-0055 D3 validity rule; Tctl thermal stop > 85 °C median.
- ALONE: before A4, wait for the host to be clear of foreign CPU load (a foreign vitest from another repo recurs); wait cap 45 min, then proceed and mark SHARED, or if margins are thin vs the bar under SHARED, say so and recommend a re-read. Never kill foreign processes.
- Review the SE's out-of-ticket edit: src/gameend.nfr.test.ts two call-count bars tightened 1→0 and 8→0 (Orchestrator reviewed: tightening, guard kept; confirm the planted full-filter rebuild turns them red).
- Total run time (excluding waiting for clear) must stay ≤ 60 min; if your PREREG estimate exceeds it, STOP and report before running (owner rule: > 1 h asks first).
- Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
## Fences
Tests and your records only (.grugops/context/qe-ABC-254/, this brief). You may add test rows only if a gap needs proof; no src/ production edits. No board, plans/, memory-bank/. No push, force, amend, rebase, or merge into main. Leave no process running.
## Publish
Verdict PASS / PASS_WITH_GAPS / FAIL with gap ids; sealed notes (task qe-ABC-254, contextRoot = worktree); commit; ## Result + trace row here; brief + claim to done/.
