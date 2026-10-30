---
id: 20261030T093252Z-software-engineer-decision-c8c1e541
kind: decision
by: software-engineer
at: 2026-10-30T09:32:52Z
verified_by: 
confidence: high: ticket Scope 5 and ADR-0053 d10 name the three literals; followers found by grep and by the full npm test
refs:
  - se-ABC-228-ii
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 8c82399f
  - d9c5bcde
  - 61d5d629
  - qe-ABC-228/20261030T091456Z-qe-e2e-decision-70c4723b
  - qe-ABC-228/20261030T091456Z-qe-e2e-observation-8829bc22
  - qe-ABC-228/20261030T073301Z-qe-e2e-observation-bcf2fd7c
  - QE-228-c
  - QE-228-b
  - A9
  - G9
  - OQ-228-1
supersedes: 
seal: sha256:d92b79ca80cffd0bc49a813ef5a884ef009d7e3ba1479a011c27f487534d75ea
---

# Software Engineer decision, se-ABC-228-ii: Scope 5 is three literals, not two. DEFAULT_BUDGET_MS moves with LEVELS[5]; the test followers found by grep

## Production literals (data only, `8c82399f`)
- `src/levels.ts` `LEVELS[5]`: `{ budgetMs: 3_000 → 4_000, blunderRate: 0 }`.
- `src/engine.ts` `DEFAULT_BUDGET_MS`: 3_000 → 4_000.
- `tools/rating/rating.ts:405` R mode: `mode === "r" ? 4000`. So `st=4` and `timemargin = 5000 − 4000 = 1000`.

## Why three, when the brief says "LEVELS[5]; the R literal; nothing else"
- The ticket's Scope 5 and `ADR-0053` d10 name `DEFAULT_BUDGET_MS` → 4 000 explicitly, so that `ADR-0045` D2's equality `LEVELS[DEFAULT_LEVEL] = { DEFAULT_BUDGET_MS, 0 }` holds.
- The brief also says "Scope 5 exactly as the ticket says". The ticket rules.
- Moving only `LEVELS[5]` would red the D2 equality rows: `levels.test.ts` A2/A6, `engine.test.ts` `LEVELS[DEFAULT_LEVEL]`, and `cli.test.ts` A8′.

## Byte-identical to base (G9 waived on LEVELS[5] only)
- `LEVELS[1..4]`, `LEVELS[6..7]`, `DEFAULT_LEVEL`, `HARDEST_LEVEL`, `HARD_CEILING_MS`, and the `ADR-0045` D3 mechanism.
- The Stockfish side of R (`st=0.5`, `timemargin=2000`) and D's budgets.

## Test followers (the ADR's list was `UNKNOWN - verify`; the grep found more)
- **`src/levels.test.ts`:**
  - D1 table row and A1-212 base row: 4_000.
  - ABC-174 A3 reference: `chooseMove` at 4_000. Clause A: 4_000. A6: 4_000.
  - **Clause B's margin at level 5 is 1 000**; every other level keeps 2 000 (d10: § AMENDMENT A3, "1 000 at 5").
- **`src/engine.test.ts`:**
  - `DEFAULT_BUDGET_MS` pin: 4_000.
  - The deep G5 row's "over budget" counter now reads `DEFAULT_BUDGET_MS`, not a literal 3_000. It is reported, not asserted.
- **`src/uci-session.test.ts`, NOT in the ADR's list.** These are the UCI rows whose time is level 5's cap:
  - Bare go, ponder, a dropped token, A7-f2/f3 and the ABC-174 A5 bare go: 4 000.
  - ABC-197 R2: [4 000, 4 200].
  - The `GO_G3500` rows (ABC-167 A5's "capped" row, ABC-171 A6 level 5, the setoption row): 3 500, because `min(3500, 4000)` now binds on G. The "capped by the default level 5" row was relabelled to "G = 3 500, under the default level 5's 4 000".
- `src/cli.test.ts:4505` and `src/engine.test.ts:924` read the constant and needed no edit.
- Comments that say "3 s" elsewhere (for example the `engine.ts` doc line "rather than each caller spelling 3000") were left alone: no value changes.
