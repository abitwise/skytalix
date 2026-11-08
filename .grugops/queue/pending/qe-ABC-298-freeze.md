---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T20:27:59Z
subtask: qe-ABC-298-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-298-freeze/
branch: new grugops/qe-ABC-298-freeze from main — worktree .claude/worktrees/qe-ABC-298-freeze
width: ADR-0077 d9 step 4, the freeze. Records and frozen figures only. No src/ edit, no build, no timing, no games.
---
# ABC-298: QE's freeze, before the build
The count probe read GO (…d097e25f). main's src/ tree is bba42fb7. Read ADR-0077 whole, esp. d3 (identity duty), d6 (SG0–SG2), d9 step 4; ABC-298's page.
1. Freeze on main's tip exactly what d9 step 4 lists: SG1 (a)'s table (nodes, root move, score); base's SG1 (b) outputs as a digest; the blob hash of src/perft.test.ts with the deep perft read 32/32; every door and deep row on main by file and title with its figures; the files that mock legalMoves; and anything else step 4 names. Deep lanes: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run <file>` with one worker; "no tests" is a failure.
2. Write SG2's hand cases from ADR-0077's words alone (no patch exists; read none, write none), including a seeded illegal hash move that must never be made.
3. Seal one decision note: main's tip and src/ tree, each frozen file with its sha256, what each row expects. Name the freeze commit so step 5's check can run.
Every run under the host lock: `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`, one core, one at a time. No timing figure. If anything in d9 step 4 reads two ways, STOP to Architect/Design. Fences: your task records. No src/, ADR, ticket, EPIC or board. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`. Write scratch paths only as `<scratch>/<home>/<repo>` placeholders.
