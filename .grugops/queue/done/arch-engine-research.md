---
done_at: 2026-10-18T07:47:00Z
branch: grugops/arch-engine-research (worktree ../wt-arch-engine, from main fedb80d4)
tip: 46d43390 (parent fedb80d4; records only: ADR-0044 + three notes)
result: DONE. ADR-0044 written PROPOSED (owner acceptance owed).
  - ADR: memory-bank/50-decisions/ADR-0044-the-engine-speaks-uci-through-a-second-entry-point-over-the-unchanged-core.md
  - Decision: UCI only (2006 text), no CECP. A second entry point node src/uci.ts (exports nothing) plus a capability-free src/uci-session.ts, flat in src/, composing the UNEDITED core (parseFen, parseCoordinateMove, makeMove, chooseMove); npm run chess byte-identical. v1 = uci/id/uciok (no options), isready, ucinewgame, position startpos|fen moves, go (movetime; t/(m??20)+i/2 minus 50 ms overhead; infinite held to stop), stop, quit, ignore the rest; one info line + bestmove. Single thread; worker + SharedArrayBuffer stop flag via the existing now() clock is pre-designed, built only on a trigger. Web UI is a separate project (WebSocket bridge or Web Worker bundle); this repo only keeps the session capability-free.
  - Notes: .grugops/context/arch-engine-research/notes/ — observation ...3f1a9c20 (standards, primary-source URLs), observation ...7b2e4d18 (repo-fit map), decision ...c5d07e91 (shape, rejected, Q1-Q8, fences).
  - Owner questions Q1-Q8 (ADR § Owner questions). Q1 lifts the UCI half of EPIC-004's "permanent non-goal" — BA/PM's epic edit on his word.
  - Fences: git diff --name-only fedb80d4 HEAD -- src tools package.json package-lock.json vitest.config.ts is empty. No test/vitest/build/timing run. plans/board.md, plans/traceability.md, plans/nfr-catalog.md and EPIC-004 NOT touched (catalog candidates listed in the ADR for Security/NFR at acceptance). Nothing pushed or merged. Notes hand-authored, unsealed (no context-io.ts on this install).
  - Trace row is in the handoff.
---
