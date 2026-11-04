---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:13:06Z
subtask: se-ABC-280
role: software-engineer
ref: .grugops/context/se-ABC-280/
branch: new grugops/ABC-280 from main — worktree .claude/worktrees/se-ABC-280
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Hop host ≤ 1 h. Lichess file at <scratch>/lichess/ (sha256sum -c first). No games. Host paths only as placeholders.
---
# Build ABC-280: tools/tune lands alone (src/ byte-identical to main)
Read plans/tickets/ABC-280*.md (A1–A8, on-a-miss = STOP to Architect). Cherry-pick grugops/ABC-239b's tool commits 625b75fe, 5ce4f870, def26997, 8c03b713 only (not 954d44fb, not 26d06118). Show A1 (exactly 7 paths; tools/tune byte-equal to 8c03b713), A2 (src diff vs main empty), A3 (npm test N+3, lint, typecheck, build, dist/ has no tool file), A4 (TUNE_DEEP lane), A5 (B-T1 0 misses on main's table, full own + Lichess set), A6 (B-T3 two byte-identical emissions to scratch; report vs 10581fb5…), A7 (path check). Hand to QE (A8).
## Fences
tools/tune/**, tsconfig.json, biome.json, your records. No src. Do not edit plans/board.md. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-280, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
