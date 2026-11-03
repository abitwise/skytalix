---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T11:02:09Z
subtask: se-ABC-269-cut
role: software-engineer
ref: .grugops/context/se-ABC-269-cut/
branch: grugops/ABC-269 (on 110292d4, with main merged in) — worktree .claude/worktrees/se-ABC-269
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core. Single vitest file needs NODE_OPTIONS=--max-old-space-size=400. NO timing reading (G2 is QE's, under PREREG …e36ee7ca).
---
# ABC-269: build cut C1 (F3's one value-identical cost cut)
Build exactly what the Architect ordered in decision …a0468a78 (.grugops/context/arch-ABC-269-F3; ADR-0064 dated block "F3 on G2"):
- C1: the phase leaves the board walk. Seed once by phaseOf(position) at the root; children get phase − PHASE_WEIGHT[captured & 7] + PHASE_WEIGHT[promotion]; null move keeps it; carried as a number argument through the recursion (or a per-ply Int32Array beside keys). NEVER on Position, UndoRecord or module state. The tapered evaluate takes the phase as an argument; king Δ read after the walk from the two king squares.
- Files: src/evaluate.ts, src/quiescence.ts (quiesce trailing phase), src/search.ts, src/engine.ts (futilityNode 7th arg); tests calling quiesce/futilityNode directly gain the argument; ABC-268's .length pin 6 → 7.
- Untouched (show in diff stat): position.ts, apply.ts, legal.ts, moves.ts, zobrist.ts, evaluate-params.ts, QE's fixture (sha256 05ed9e81…6e96339).
- Proof rows P1–P7 exactly as the decision lists (B0 exact 11 counts; phase oracle walk; Object.is equal to uncut src b8b44ff3; cross-build 190 + 8 360 rows 0 mismatches; guard + 4 planted defects red; ZERO re-pins — any re-pin is a defect → stop to Architect; typecheck/lint/build clean). Full npm test count and deep lanes.
Fences: the listed files + tests. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-269-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**2026-11-03, Software Engineer. Cut C1 built exactly as decision `…a0468a78` orders, and P1–P7 are all MET with zero re-pins. Branch `grugops/ABC-269`, worktree `.claude/worktrees/se-ABC-269`, on `be1aa535`. Code commit `561fc028`, then the records commit. Nothing pushed or merged, and nothing left running. No timing reading was taken: `G2` is QE's, under PREREG `…e36ee7ca`.**

- **Built (decision `…8e00e712`):**
  - `phaseOf` / `phaseAfterMove` / `evaluateAtPhase` in `src/evaluate.ts`. The walk holds no phase add and no king Δ, and the king Δ is read after the walk from the two king squares.
  - The phase is carried as a number argument through `negamax` / `searchMove` / `leafScore` / the root in `src/search.ts` and `src/engine.ts`, and as `quiesce`'s trailing argument. It is seeded once per search call / `chooseMove` call. The null move keeps it.
  - `futilityNode` takes it as a seventh argument.
  - Nothing on `Position`, `UndoRecord` or module state. `position.ts`, `apply.ts`, `legal.ts`, `moves.ts`, `zobrist.ts` and `evaluate-params.ts` are untouched, and QE's fixture still hashes `05ed9e81…6e96339`.
- **Acceptance (observation `…c9da2d0f`):**
  - **P1:** B0 exact on all 11 counts.
  - **P2:** 0 mismatches over 6 637 perft-walk moves (277 949 deep), plus 40 targeted rows with exact weights. Every move kind was seen.
  - **P3:** 0 / 2 200 `Object.is` differences against the uncut build.
  - **P4:** 0 / 1 140 shipped rows and 0 / 8 360 door rows against uncut; 0 / 8 360 rows against `main`.
  - **P5:** a source guard, and all 4 plants red.
  - **P6:** `npm test` 2 566 / 2 566. Deep lanes all green: taper 146, null-move 44, futility 53, search 57, quiescence 116, tt 40 / 26, pvs-lmr 29, ordering 43, engine 82, pawns 44, puzzle 18. B2 0 / 163 and 0 / 189, B3 7 / 7, B4 54 / 58 with the same lines.
  - **P7:** typecheck, lint and build all 0.
- **Migration (observation `…08e71099`):**
  - Argument additions and the `.length` pin 6 → 7.
  - Three source pins re-written as pins.
  - The `evaluate` stubs also cover `evaluateAtPhase`.
  - The puzzle suite's `{ spy: true }` was narrowed to the two evaluation entries, because spying the hot `phaseAfterMove` made the worker exit on heap.
  - No figure moved.
- **Owed:**
  - **QE (`qe-ABC-269`):** the one PREREG `G2` reading on this build, then B5 / B7 / B8 / UAT on a met result.
  - **Orchestrator:** dispatch QE.
