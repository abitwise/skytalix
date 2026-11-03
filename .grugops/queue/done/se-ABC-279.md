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

## Result

**2026-11-03, Software Engineer. ABC-279 (Q1) built per ADR-0069 decisions 1-9. Every bar this hop can grade offline is MET, and the build reproduces the probe's faithful build exactly on every instrument count. Branch `grugops/ABC-279`, worktree `.claude/worktrees/se-ABC-279`, from `main` `00e99db8` (`src/` `4cb84035`). Code `cd9ccd10`, tests `1feb7560` (**frozen for QE**: `src/` tree `9e50717b`, production lines unchanged since `cd9ccd10`), then this records commit. Nothing pushed or merged, nothing left running.**

- **Built (decision `…821f0628`):**
  - `src/see.ts`: `see`, `isLosingCapture`, `seeScratchByteLength`. It uses fixed scratch (288 B, no per-call allocation) and the probe's attacker order exactly.
  - `quiesce` skips a LOSING capture on the stand-pat branch only, after the one sort, through `QuiescenceRules.seePruning?`. A caller's own record does not opt in.
  - `seePruning` lives in `Switches` / `Heuristics` as `RULES_SEE_PRUNING`. The doors are `searchWithoutSeePruning` / `chooseMoveWithoutSeePruning`, and every older door is off.
  - The quiescence header line was corrected.
  - The evaluation files are blob-identical to `main`.
  - The brief's fence names search.ts only. `src/quiescence.ts` and `src/engine.ts` were also edited, at the seam, as the ticket's Files line and d6/d7/d9 require.
- **Offline bars (observation `…a2b9d7c5`):**
  - **A1:** 23 / 23 hand rows; HANGING 24 / 24; the truth table; the source, in-check and opt-in rows; purity; 288 B; 3 exports.
  - **A3:** drift 96.26 % / 95.72 % within 25 cp, max 66 / 96, 0 sign changes. Mate floor 0 / 190. Zugzwang 7 / 7.
  - **A4 (a):** d8 0.7208 / 0.2652 / 0.5909 / 0.2160, with head 605 117 / 406 787 / 766 275 / 87 475 and doors 839 514 / 1 533 901 / 1 296 788 / 404 930, exactly the ADR's.
  - **A4 (b):** reach 5.879 → 6.716 (+0.837; 121 deeper, 1 shallower, 22 moves).
  - **A4 (c) G6 at 4 000 ms:** kiwipete 9 / 9 and position-6 10 / 12 (medians, base / head). Every run is the same depth and move, no run is < 7, and 0 WARN. Head nps is about 0.78-0.82 × base, so kiwipete is at parity: F9's margin there is zero.
  - **A4 (d) G2:** byte identity.
  - **A5:** G1 54 / 58, with none newly missed.
- **Gates on `1feb7560`:**
  - lint, typecheck and build: 0.
  - `npm test`: 2 631 / 2 631 (+43, all `src/see.test.ts`).
  - `SEARCH_DEEP`: search 57, quiescence 116, futility 53, null-move 44, pvs-lmr 29, taper 168, tt 40, ordering 43, see 52.
  - `ENGINE_DEEP`: tt 26, engine 82, ordering 30.
  - `PUZZLE_DEEP`: 18. Every lane exits 0.
  - **N8-LANE:** base median 9.91 s, head 9.77 s; one head run 10.13 s > NFR-008's 10 s, and base reaches 9.96 s. `UNKNOWN - verify` on a quiet host.
- **Rows moved (observation `…f4c7c263`):**
  - Re-pointed to the door pair, figures unchanged: ABC-170 A2 row 2; the ABC-080 tie rows (shipped now a1b1, door a4b3); ABC-269 B0.
  - Re-pinned: ABC-122 A6's leaf (capture nodes 10 → 0, total 139 → 129).
  - Five source ladders gained the door. The export lists gained +1 / +1.
  - The NFR-009 sum gained 288 B.
  - No zugzwang depth was re-pinned.
- **Owed:**
  - **QE:** A2 / G4 cross-build node identity, out of tree; A6 (C2′ 100 at 100 ms GAIN ≥ 50.0, S′ E 1 810, Levels lane, host ALONE) on `1feb7560`; UAT.
  - **Orchestrator:** board move to In Review. Consider an AGENTS.md lane line for `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/see.test.ts` (A3 / A4's committed rows, 52 tests, about 55 s).
