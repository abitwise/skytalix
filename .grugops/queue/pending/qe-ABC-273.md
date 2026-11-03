---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T13:05:12Z
subtask: qe-ABC-273
role: qe-e2e
ref: .grugops/context/qe-ABC-273/
branch: new grugops/ABC-273 from main — worktree .claude/worktrees/qe-ABC-273 (records only)
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core, one game at a time, --concurrency 1. **ALONE window for games** (only a records-only Architect hop may run beside you). Set CUTECHESS_CLI and STOCKFISH to the pinned binaries (the same paths qe-ABC-269 used — see its notes …2c51ee30 / raw; verify sha256 against the tool's pins). **If your PREREG estimate exceeds 1 h, or the band rule would step E and need a second run: STOP and return the question (owner asks for > 1 h).**
---
# R1: the first EPIC-011 milestone reading after E1 (ABC-273)
Read plans/tickets/ABC-273*.md, the R1 ruling (…8136b589 in .grugops/context/arch-post-269), ADR-0056 S′/band rule and D6 R1 line, EPIC-011 G2.
1. Seal a PREREG before any game: build = main (src tree at 85a304ff), command exactly
   `node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1` (200 games), E 1810 confirmed by the band rule, the time estimate, what the reading reports (score, Elo vs E ±, time losses, faults, latency) and the band-rule consequence of each outcome.
2. Run it. Check R1-A2 (both env vars shown as set in cmd.txt / machine.txt) and ABC-275 A6 (machine.txt control line: skytalix st=0.1 timemargin=50, stockfish st=0.1 timemargin=2000).
3. Report; the result is a reading, not a merge gate. State whether the band rule steps E (and whether that needs the owner's word — downward always does).
Fences: records only (no src/tools edits). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-273, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.
