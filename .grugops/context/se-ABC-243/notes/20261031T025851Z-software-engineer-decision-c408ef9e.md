---
id: 20261031T025851Z-software-engineer-decision-c408ef9e
kind: decision
by: software-engineer
at: 2026-10-31T02:58:51Z
verified_by: 
confidence: high: the rows were written, run green, and each plant was run red on scratch copies
refs:
  - se-ABC-243
  - ABC-243
  - EPIC-010
  - ADR-0046
  - NFR-008
  - NFR-009
  - ABC-228
  - ABC-241
  - ABC-244
  - SE-228ii-a
  - QE-228ii-b
  - QE-241-a
  - QM3
  - QE-244-a
  - grugops/ABC-243
  - 8772cf36
  - 4bd9ac6a
  - src/uci-session.test.ts
  - src/transposition.test.ts
supersedes: 
seal: sha256:e483b960e27c22bbbb8fb0efb0337ce39f5541fb07730b8f269b1d8dbdf168da
---

# `ABC-243`: the Hash row reads a bare `go` on `LEVELS[5].budgetMs`; the memory row names `DEFAULT_BUDGET_MS`; one UCI row for a FEN carrying an uncapturable ep square. Code `8772cf36`

Branch `grugops/ABC-243`, from `main` `4bd9ac6a` (the Orchestrator's setup line; the brief names `ae7211c3`, and
`git diff ae7211c3 4bd9ac6a -- src tools data` is empty, so the two bases are the same code). Test-only. Not merged,
nothing pushed. No prior `se-ABC-243` context existed to read (WF16 step 1): started from the ticket, `ADR-0046`
§ Addendum 2026-10-30 R1–R4, `qe-ABC-241` (QE-A4e, QM3) and `qe-ABC-244` (QE-244-a).

## Choices
- **A1 (Scope 1).** `src/uci-session.test.ts`, the row "setoption name Hash value 64 writes nothing and changes nothing"
  (`:757`), level half only: `position startpos`, bare `go`, 2 lines, `time` read with `/ time (\d+) /` and bounded by
  `expectWithin(time, LEVELS[5].budgetMs)` (step 100: 4 000..4 200), then `bestmove` shape. Book half untouched. Edited
  in place, title unchanged.
  - The `time` is read with a format-blind regex, not `parseInfo`, so a plant to levels 1–4 (whose info line has no
    `score`, `LEVEL_INFO`) fails on the time bound and not on a parse. All three plants fail on the bound (readings note).
  - Step stays 100 (class P, reads `time`; `ADR-0046` § Addendum R1/R2, ticket NOTED block).
- **A3 (Scope 2).** Wording "a 1 s and a `DEFAULT_BUDGET_MS` (4 s)" on the three lines (header `:19`, doc `:660`, title
  `:667`; in the title without backticks). The header line was not re-wrapped, so the diff is exactly 3 lines.
- **A6 (Scope 3).** One row inside `ABC-241`'s UCI describe block, after its A5 seam row: the ticket's `position fen …
  b - a3 0 1 moves …` then `go depth 4` → `cp 0` and `bestmove d1e1`; base half: `chooseMove` at the same root,
  `maxDepth 4`, `priorKeys = trimPriorKeys(keyHistory(game), halfmoveClock)` → score not 0 (the A4 row's base-half
  shape). Depth 4: the ticket allows one N in 1–5 and A4 uses 4. The game is built inline (the block's `gameOf` is
  bound to its own `MOVES`).
- **QE-244-a carry.** No `ABC-241` A4/A5/A7 row, step or depth was edited; the only removed line in the diff is the
  Hash row's old `levelTime` read.
