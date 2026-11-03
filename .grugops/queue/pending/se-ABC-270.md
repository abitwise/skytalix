---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:27:55Z
subtask: se-ABC-270
role: software-engineer
ref: .grugops/context/se-ABC-270/
branch: new grugops/ABC-270 from main — worktree .claude/worktrees/se-ABC-270
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core; the lock is shared with se-ABC-279. No games. Hop host ≤ 1 h. Host paths only as placeholders.
---
# Build ABC-270 (E3a structure only) per ADR-0068 (ACCEPTED)
Read plans/tickets/ABC-270*.md (K0–K4), ADR-0068 in full, QE's frozen rows: .grugops/context/qe-ABC-270-freeze/notes/20261103T222633Z-qe-e2e-decision-fa82b3f3.md and raw/pairs.json (sha256 68769ea9…c681) — copy the rows unchanged; QE-270-a: add a test-only per-king exposure read (behind the existing seam style, ABC-274 S1–S3 conditions) so QP2 can be graded per king.
- Three queen-on pairs at {0,0} in src/evaluate-params.ts; the flags from the walk's existing king test (type >= QUEEN), no new per-piece op; linear terms the tuner can fit.
- K0 node identity (counts in the ticket / ADR-0068 d6), K1 unit rows incl. the frozen pairs at ×2 through the seam, K2 zero re-pins in every lane, K3 G2 ≤ 1.05× (ALONE-ish: run it when the lock is yours, two sessions as ABC-274 did), K4 G6 ≥ base with every run at depth ≥ 6. S2 nps reported only.
- Phase-24 re-find of ABC-083 A2 (b) and A3 (b) per scope 5.
- Gates: lint, typecheck, unit, build, npm test, the deep lanes AGENTS.md names for evaluation changes.
## Fences
src/evaluate.ts, src/evaluate-params.ts, their tests, your records. No search edits (se-ABC-279 is in src/search.ts). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-270, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
