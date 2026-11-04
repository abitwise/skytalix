---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T02:03:06Z
subtask: arch-ABC-271
role: architect-design
ref: .grugops/context/arch-ABC-271/
branch: new grugops/arch-ABC-271 from main — worktree .claude/worktrees/arch-ABC-271
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. Probes small: each ≤ 30 min, hop ≤ 2 h; no games beyond what a PREREG names and ≤ 1 h total. Host paths only as placeholders.
---
# Design ABC-271 (E4a: passed pawns read the kings and the path — king distance, free path, rule of the square)
Why now: ABC-239's first pull closed NOT MET (…4c76bf7a); arch-ABC-239-f3f4 (…4eae0fd3, …69f22167) traced zugzwang.001's e1e5 to endgame halves of pawn/rook/king/passer and found no relation can hold it with today's features — the passer part needs free-path / king-distance terms.
Read plans/tickets/ABC-271*.md, ADR-0064 (mg/eg pairs), ADR-0067 (tuner; the second pull will fit E4a's terms), ADR-0068 (structure-only precedent), ADR-0069 (Q1 now in quiescence), ADR-0056 Phase 4.
Decide and write an ADR PROPOSED (next free id after ADR-0069): the terms (king distance own/enemy to the stop square, free path / blocked, unstoppable passer by the rule of the square, eg-weighted), cost per leaf (G2), whether ABC-271 ships hand values judged on play (100 games at 100 ms GAIN 50.0) or lands structure-only for the tuner (ADR-0068 form) — decide by a PREREG'd probe including zugzwang.001 at d9 and the mate floor; say which order (271 values → second pull, or structure → second pull) wins more for less host time. Also write ADR-0056's row E2 status line (first pull NOT MET; E4a before a second pull).
Fences: memory-bank/50-decisions + your records + scratch. No committed src/tools; no ticket/EPIC edits (BA/PM is closing ABC-239 in parallel). No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task arch-ABC-271, contextRoot = worktree's .grugops/context, `at` from `date -u`); PREREG before any measured probe; queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
