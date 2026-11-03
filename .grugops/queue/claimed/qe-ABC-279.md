---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T22:59:31Z
subtask: qe-ABC-279
role: qe-e2e
ref: .grugops/context/qe-ABC-279/
branch: grugops/ABC-279 (frozen 1feb7560, src tree 9e50717b; tip d00d00a8) — worktree .claude/worktrees/se-ABC-279; merge main into it first if needed
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **Game reads ALONE: wrap each whole match (C2′ 100 games, S′ 10 games) in ONE flock so nothing else runs during it**; record uptime/load at start and end. Set CUTECHESS_CLI and STOCKFISH (QE-269-j). C2′ ~100 games at 100 ms is well under 1 h; any single run forecast > 1 h: stop and ask. Host paths only as placeholders.
---
# QE ABC-279 (Q1, ADR-0069 ACCEPTED): verify the build and run A6 — one read, final
Read plans/tickets/ABC-279*.md (A1–A6), ADR-0069 bars, se-ABC-279 notes (…821f0628, …a2b9d7c5, …f4c7c263 rows moved), ADR-0067/0064 B-T4-style re-pin rule (…42c82347 for the pin/bar line).
- Seal a PREREG before any game: C2′ = 100 games at 100 ms vs main's merge-base (rating tool `d` / per-change form), GAIN ≥ 50.0 / 100; S′ 10 games at 0.5 s vs Stockfish E 1 810; Levels deep lane. A miss is final — no re-play, no margin, no form change.
- Re-grade offline: A1 (incl. the A1 (b) wording point — rule it as a gap, not a bar move), A2/G4 cross-build node identity (out of tree), A3, A4, A5, G6, G2 by byte identity. Check the rows moved (re-pointed vs re-pinned) obey pin/bar: no zugzwang, mate floor, G1 or relation row re-pinned.
- Orchestrator ruling recorded here: the SE's edits to src/quiescence.ts and src/engine.ts at the seam are within scope (ticket Files line, ADR-0069 d6/d7/d9) — check they touch nothing else.
- Re-read N8-LANE (NFR-008 10 s) ALONE: base and head, ≥ 5 interleaved runs each; report vs bound; a pre-existing base breach is recorded as such.
- Verdict PASS / PASS_WITH_GAPS / FAIL; your verdict signs UAT (owner delegation).
## Fences
tests and your records on that branch; no production src edits (a defect goes back to SE). No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-279, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.
