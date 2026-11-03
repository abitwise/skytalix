---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:19:37Z
subtask: qe-ABC-270-freeze
role: qe-e2e
ref: .grugops/context/qe-ABC-270-freeze/
branch: new grugops/qe-ABC-270-freeze from main — worktree .claude/worktrees/qe-ABC-270-freeze
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Small reads only (≤ 30 min); no games. Host paths only as placeholders.
---
# Freeze ABC-270's K1 (c) rows before the build (ADR-0068 ACCEPTED)
Read plans/tickets/ABC-270*.md (structure only, K0–K4), ADR-0068 (K1 (c): ≥ 6 queen pairs — positions with the enemy queen on/off and the expected per-file queen-on feature counts; ADR-0067's tracer row reuses them), ADR-0064 B0 counts.
Freeze, in a sealed decision note before any SE build exists: ≥ 6 queen pairs (FEN, side, expected counts for KING_SHELTER_MISSING_QUEEN / KING_FILE_HALF_OPEN_QUEEN / KING_FILE_OPEN_QUEEN per king, derived by hand from the ADR's definitions, not from code), plus K0's node-identity numbers as the ADR lists them. Include at least one pair where the queen is removed and counts must drop to 0, one mirrored pair, and one with both queens. These rows are what se-ABC-270 must implement and what QE grades later; SE may not change them.
## Fences
Your records only (notes + raw/). No src/tools edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task qe-ABC-270-freeze, contextRoot = worktree's .grugops/context, `at` from `date -u`); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
