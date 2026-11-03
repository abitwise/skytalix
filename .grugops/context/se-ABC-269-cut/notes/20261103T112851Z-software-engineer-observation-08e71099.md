---
id: 20261103T112851Z-software-engineer-observation-08e71099
kind: observation
by: software-engineer
at: 2026-11-03T11:28:51Z
verified_by: 
confidence: high (every test edit listed from git diff; no figure changed: npm test 2566/2566 and deep lanes green, report lines equal to se-ABC-269's)
refs:
  - se-ABC-269-cut
  - grugops/ABC-269
  - ABC-269
  - EPIC-011
  - E1
  - ADR-0064
  - ADR-0020
  - ADR-0002
  - ADR-0061
  - C1
  - F3
  - B0
  - B1
  - B2
  - B3
  - B4
  - G2
  - P1
  - P2
  - P3
  - P4
  - P5
  - P6
  - P7
  - be1aa535
  - b8b44ff3
  - 58fa3eb4
  - 561fc028
  - src/evaluate.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/evaluate.taper.test.ts
  - src/search.futility.test.ts
  - src/search.null-move.test.ts
  - src/puzzle-suite.test.ts
  - src/evaluate.taper-corpus.ts
  - arch-ABC-269-F3/20261103T105957Z-architect-design-decision-a0468a78
  - se-ABC-269/20261103T104753Z-software-engineer-decision-7445784f
  - se-ABC-269/20261103T104753Z-software-engineer-observation-669f366c
supersedes: 
seal: sha256:c7cefe6a2c2179963024f8c8071697faecf0135f8cb8be6dbf6feeb14a2e3aad
---

# se-ABC-269-cut test migration: no figure moved. Five kinds of edit: (1) direct `quiesce` / `futilityNode` callers gained the phase argument; (2) `ABC-268`'s `.length` pin went 6 → 7; (3) three source pins that read a changed call site were re-written as pins; (4) the two `evaluate` stubs also cover `evaluateAtPhase`; (5) the puzzle suite's module spy was narrowed after a heap exit. Each one is listed below with its reason

Software Engineer, task `se-ABC-269-cut`, on `561fc028`. The decision allows (1)–(3) by name. (4) and (5) are the same kind of change: a hook moved to the entry the recursions now call, with no value changed.

1. **The argument** (`phaseOf(<the call's position>)` appended):
   - `src/quiescence.test.ts` (9 calls), `src/gameend.nfr.test.ts` (2), `src/search.capacity.test.ts` (1), `src/engine.capacity.test.ts` (1);
   - `src/search.futility.test.ts`: 10 `futilityNode` calls.
2. **`futilityNode.length`:** `toBe(6)` → `toBe(7)` (`src/search.futility.test.ts`).
3. **Source pins re-written as pins:**
   - `src/evaluate.taper.test.ts`, the "call sites" row. It now reads `futilityNode(…, switches.taper, phase)` / `(…, budget.taper, phase)` and `evaluateAtPhase(position, phase)` at the futility, leaf and stand-pat sites. Its counts went from `evaluate(` 2 / 0 / 1 to `evaluate(` none, with `evaluateAtPhase(` 2 / 0 / 1 (search / engine / quiescence).
   - `src/search.futility.test.ts`, the node-call pin: `…, ${on}.taper, phase);`.
   - `src/search.null-move.test.ts`, the null-child pin. The child regex now ends `true, phase`. The flag is read as the second-to-last argument, and the pair (flag, phase argument) must be `true phase` once and `false childPhase` everywhere else. That makes the pin stricter.
4. **Stubs:**
   - `src/search.futility.test.ts`'s call-through `vi.mock` stubs `evaluateAtPhase` on the same counter and value as `evaluate`. Without that, the mate-band edge row would lose its stub, and the "guarded: no evaluation paid" rows would pass vacuously.
   - `src/puzzle-suite.test.ts` A3 also mocks `evaluateAtPhase` to 0.
5. **Puzzle spy:**
   - The first `PUZZLE_DEEP=1` and `weakened` runs ended with "Worker exited unexpectedly" (reproduced once).
   - The cause: `vi.mock("./evaluate.ts", { spy: true })` spies every export, and that now includes `phaseAfterMove`, which is called once per made move. Recording those calls exhausts the one-file heap row (400).
   - The fix: a call-through mock of `evaluate` and `evaluateAtPhase` only, which records what the old spy recorded on the shipped path.
   - After the fix: 18 / 18, 54 / 58; weakened 16 / 58 with its gate red, as designed.
- **New rows:** 47 in `src/evaluate.taper.test.ts`, the P2 / P3 / P5 rows the decision orders.
- **Not edited:** QE's frozen fixture. No bar, no figure, no baseline JSON.
