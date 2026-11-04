---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T20:57:17Z
subtask: se-ABC-301-s0
role: software-engineer
ref: .grugops/context/se-ABC-301-s0/
branch: new grugops/ABC-301 from main — worktree .claude/worktrees/se-ABC-301
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. No games, and no fit: stop after scope 0. Host paths only as placeholders.
---
# ABC-301 scope 0 only: the second pull's preconditions
Read plans/tickets/ABC-301*.md (Scope 0), arch-second-pull-1104 …4917f0f7, qe-ABC-271's gaps …d0f7af61, ADR-0067 d5, and the Orchestrator notes …264e420e and …f30bd604.
Build, and do not go beyond:
- QE-271-h: the hot-path row at live values, exact on 44 of 44 fixtures; it must kill mutants E14–E16.
- QE-271-g: a guard row: no caller of pawnStructureForTest or passerTermsForTest outside test files.
- QE-271-i: tools/tune's emitter writes 17 exports, equal to main's values value for value, and the tracer traces E4a's features; typecheck passes; B-T1 reads 0 misses.
- QE-271-f is the PREREG's line, written at the fit, not here.
Lane budget: all of ABC-301 holds ≤ +0.10 s, so scope 0's rows should cost as little as they can; aim ≤ 90 ms in-thread; none added to src/cli.test.ts; rows ≥ 50 ms go deep; no new default-lane file.
Stay out of src/engine.ts and move ordering (se-ABC-282 is in them). No production value moves.
Fences: tools/tune, test files, your records. No ticket, EPIC, ADR or board edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task se-ABC-301-s0, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: software-engineer (claude-opus-5-5), at: 2026-11-04T21:19:29Z. Branch `grugops/ABC-301` from `main` `bbd0d54a`. Scope 0 only: tools/tune and test files, no production line, no fit, no game. Nothing left running. Scratch copies are outside the repo.
- **Commits:** `3d6d786e` claim; `57e942fb` the P1 and P2 rows; `df7d07a2` the tool; then records (this one).
- **P1 (`QE-271-h`): green in a corrected form; QE must read this.** As written (`evaluateAtPhase(p, 0)`) it reads **31 / 44**: all 13 misses are ± 400 on fixtures of phase 1–5, because U fires on the phase argument and the seam reads `phaseOf`. The build is right. The row runs each fixture at its own phase, mg + trunc((D + e) × (24 − k) / 24), which is the ticket's equation at k = 0: **exact on 44 / 44** at the full probed values. E14, E15, E16 and an own mutant H1 (U firing off phase 0, which the written form cannot see) are each red on this row.
- **P2 (`QE-271-g`):** 0 callers; five planted callers red (`src/`, nested `tools/`, `scripts/`, `package.json`, a second call in `src/evaluate.ts`).
- **P3 (`QE-271-i`):** 17 value exports (20 `export const` with the three phase constants, as on `main`), equal value for value, U at 0; typecheck 0; tracer rows green, on QE's frozen record since no tools/ file may name the seams; `TUNE_DEEP` 22 passed; tool mutants 9 / 9 red. A 13-export file fails typecheck. **B-T1: 0 misses over 1 494 610 keys, worst 0.9583 cp.**
- **P4 (`QE-271-f`):** the PREREG's line, not here.
- **Lane:** 2 684 → 2 685, 71 files, 0 skipped; no new file; none in `src/cli.test.ts`; no row ≥ 50 ms; about **+2.4 ms** in-thread. `npm test` 9.37 s once, ungraded.
- **Gates:** `npm test`, lint, typecheck, build green; skip count 0; `test-skip-integrity` No findings.
- **Notes:** `…8fb36960` (decision), `…f68982f4` (results), `…534a582c` (carry), `…d7893f7d` (artifact record, sealed as an observation).
- **Owed by the next hops (`…534a582c`):** a dated line on P1's form; a ruling on two `ABC-271` rows that go red at any fit and are not on test note 4's retire list; the fit's cost with E4a freed is `UNKNOWN - verify`.
