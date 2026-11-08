---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T21:29:44Z
subtask: se-ABC-298
role: software-engineer
ref: .grugops/context/se-ABC-298/
branch: new grugops/ABC-298 from main (673e21bc) — worktree .claude/worktrees/ABC-298
width: ABC-298 build per ADR-0077, node-identical. No timing read, no games, no merge.
---
# ABC-298: build V3 (hash move first at remaining depth 1–2)
**Freeze:** QE's note …44a6717d (task qe-ABC-298-freeze), freeze commit b9b8eee9, an ancestor of main; src/ tree bba42fb7. Your first commit must descend from b9b8eee9.
Read ADR-0077 whole (d1 gate, d2 legality seam, d3's 15-item identity duty, d4 captures-first OUT, d6 SG0–SG2, d12 stop) and ABC-298's page.
1. Build exactly d1–d3: the per-square export in moves.ts (generateMoves not edited), the single-move legality check in legal.ts, the live read in transposition.ts, the gate in negamax. No switch, no door, no captures-first.
2. Prove identity against QE's frozen figures: SG0 perft (deep 32/32, perft.test.ts byte-equal), SG1 (a)'s seven rows exactly, SG1 (b) against the frozen g4 digest using qe-ABC-254's harness, SG2's 38 cases and the seeded illegal-move rows. Add SG2's rows as tests. No existing figure may change.
3. If any identity row reddens and you cannot restore it within d1–d3, STOP to Architect/Design. Never re-pin a figure and never widen or narrow the gate on your own.
4. Gates: typecheck, lint, the default lane whole with one worker, and the four pin deep lanes (engine, uci-session, search.bundle, puzzle-suite). Report the default lane's wall time as information only; NFR-008 is QE's read.
Every run under the host lock: `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time, vitest with one worker. Deep lanes: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>`; "no tests" is a failure. No timing read (SG3 is QE's, on a held host). Fences: src/ files ADR-0077 names, new test rows, your records. No ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
