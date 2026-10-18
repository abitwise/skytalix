---
id: 20261018T122617Z-software-engineer-artifact-ref-delivery-e8f04d26
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-170
at: 2026-10-18T12:26:17Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-170
  - ABC-170
  - EPIC-007
  - ADR-0044
  - ABC-167
supersedes:
---

# ABC-170 delivery: branch `grugops/ABC-170`, code `e29f7951`

- **Worktree:** `../wt-ABC-170`, from `main` `358810ac`. Not pushed, not merged.
- **Files (`src/`):** `src/engine.ts` (+28/-2: two optional `EngineOptions` fields, `Budget.maxNodes`, the
  `countNode` condition, the loop header), `src/engine.test.ts` (+175/-5: 5 lines replaced inside `A4` at `:517`, `:520-523`, plus
  149 appended lines: `ABC-170 A1`, `A2`, `A3`, `A5`, 9 rows).
- **No new export** (`Object.keys(engineModule)` still seven names), `chooseMove.length` 2, `budgetMs` required.
- **ADR-0036 (b1):** `git diff` `+` lines of `src/engine.ts` grep for `process.`, `from "node:`, `require(`: none.
- **Remaining:** `A6` (`NFR-005`, `ENGINE_DEEP=1` depth ≥ 6 in 3 s on Kiwipete and `position-6`) owed in a quiet
  window, Orchestrator's reading. Unblocks `ABC-167`.
