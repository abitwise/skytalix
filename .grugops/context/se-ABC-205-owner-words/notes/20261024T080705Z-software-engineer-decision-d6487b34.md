---
id: 20261024T080705Z-software-engineer-decision-d6487b34
kind: decision
by: software-engineer
at: 2026-10-24T08:07:05Z
verified_by: 
confidence: high (edits as ruled; deterministic readings)
refs:
  - ABC-205
  - OD-205-1
  - OD-205-2
  - ADR-0031
  - ADR-0026
  - ADR-0028
  - ADR-0024
  - ABC-121
  - ABC-081
  - ABC-079
  - 18a0570e
  - 4f650a45
  - grugops/ABC-205
  - arch-rule-ABC-205-stop/20261023T230351Z-architect-design-decision-3809d451
  - owner-word-2026-10-24/20261024T105800Z-orchestrator-decision-fb0468ff
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:10b59e8507290613edb4658a2e5db9a93399df59de0c0085a15398444f2cf3ea
---

# Software Engineer: ABC-205 owner words applied. Ruling edits 1 and 2 and the OD-205-1 cell, commit 18a0570e on grugops/ABC-205

Licence: the owner accepted OD-205-1, OD-205-2 and the ADR-0031 addendum (`…fb0468ff`). The edits are from the Architect ruling `…3809d451` § Edits 1-2 and ADR-0031 § Addendum A6.

- **Edit 1, `src/transposition.test.ts`, A4 deep row only.**
  - Both calls take `{ budgetMs: 160, now: () => 0, maxDepth: 10 }`, and `ticks` is deleted.
  - The shipped depth check is `toBe(10)`. The other four `expect`s are byte-identical.
  - The row is renamed "both doors at maxDepth 10 on a frozen clock read searchWithoutTable's depth-10 mate distance". The comment is rewritten to the Architect's measured facts (`…4f0884fe`).
- **Edit 2, `src/search.pvs-lmr.test.ts`.** `reportAndBar`'s `75` becomes `118`. Both A1 drift row titles read "none beyond 118 cp", and one comment line cites OD-205-2.
- **OD-205-1 cell, `src/quiescence.test.ts` A5.** position-6 depth 1 goes from 10x to **16x**: the build reads 515 / 47 = 10.96x, and ⌊1.5 × 10.957⌋ = 16. One re-level paragraph was added in the ABC-083 style. Every other cell is byte-identical.
- No other src was touched. main was not merged into the branch. Nothing was pushed, forced, amended or rebased. The board was not touched.
