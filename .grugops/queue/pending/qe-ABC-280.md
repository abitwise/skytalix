---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:28:35Z
subtask: qe-ABC-280
role: qe-e2e
ref: .grugops/context/qe-ABC-280/
branch: grugops/ABC-280 (frozen edb9fddd; tip d3080707) — worktree .claude/worktrees/se-ABC-280
width: wrap EVERY test/build/engine/fit run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Hop host ≤ 45 min (one full extract|fit|emit ≈ 5 min is enough; re-run only what you need). No games. Host paths only as placeholders.
---
# QE ABC-280 (tools/tune lands alone) — A8
Read plans/tickets/ABC-280*.md (A1–A8), se-ABC-280 notes (…85c1bab5, …443095be, …bd5e26f5). Re-grade A1 (7 paths; tools/tune byte-equal to 8c03b713), A2 (src/ diff vs main empty → UAT waived), A3 (npm test N+3, skips 0, lint/typecheck/build, dist/ has no tool file), A4 (TUNE_DEEP lane), A5 (B-T1 0 misses on main's table), A6 (two byte-identical emissions; judge the SE's emit-to scratch script deviation — it must call the tool's own emit() unchanged), A7 (path check). Check the tool reads PGN comments unread (no engine labels) and refuses a sha256 mismatch (A1 rows of ABC-239's pin). Verdict PASS / PASS_WITH_GAPS / FAIL.
## Fences
tests and your records on that branch; no src/tools edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-280, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
