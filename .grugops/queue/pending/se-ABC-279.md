---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:19:37Z
subtask: se-ABC-279
role: software-engineer
ref: .grugops/context/se-ABC-279/
branch: new grugops/ABC-279 from main — worktree .claude/worktrees/se-ABC-279
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No game reads in this hop (A6 is QE's). Hop host ≤ 2 h; any single run > 1 h: stop and ask. Host paths only as placeholders.
---
# Build ABC-279 (Q1: quiescence skips SEE-losing captures out of check) per ADR-0069 (ACCEPTED)
Read plans/tickets/ABC-279*.md (A1–A6), ADR-0069 in full (src/see.ts pure module, 288-byte scratch, no per-call allocation; seePruning via an optional field on the quiescence rules record — a caller that builds its own rules record does not opt in; test-only off-doors searchWithoutSeePruning / chooseMoveWithoutSeePruning; ordering and TT unchanged), ADR-0024 d4 as amended, the probe patch in .grugops/context/arch-Q1-see-pruning/raw/probe/ (reference, not to be pasted blindly).
Build it with tests (SEE hand rows, hanging corpus 24/24, off-door identity to main, rules-record opt-in row). Grade locally what's offline: drift, mate floor at d5 (0 misses), zugzwang 7/7, G1 ≥ 54/58 none newly missed, d8 nodes ≤ 0.78× on all four readings, reach ≥ main + 0.55 ply, G6/NFR-005; G2 by byte identity of the evaluation files. Gates: lint, typecheck, unit, build, npm test, the deep lanes AGENTS.md names for search changes. Hand the frozen sha to QE for A6 (100 games at 100 ms, S′ E1810, Levels).
## Fences
src/see.ts, src/search.ts (the quiescence/rules-record seam only), their tests, your records. No evaluation file edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-279, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
