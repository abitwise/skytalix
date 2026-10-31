---
id: 20261031T025851Z-software-engineer-observation-9c3d34df
kind: observation
by: software-engineer
at: 2026-10-31T02:58:51Z
verified_by: 
confidence: high: reads per search are arithmetic from the budget and step in the code
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
seal: sha256:fab90dc0d05f12be21a1fe9118290a428e51e87d7299be451bba7dfa098741af
---

# `ABC-243` R1 census (`ADR-0046` § Addendum 2026-10-30): one changed real-search row, one added

| row (tip line) | surface | search | budget | step | reads per search | class | note |
|---|---|---|---|---|---|---|---|
| `src/uci-session.test.ts:757` "setoption name Hash value 64 writes nothing and changes nothing" (level half, changed) | UCI, virtual clock (`rig()`) | bare `go`, level 5, startpos | 4 000 ms (`LEVELS[5].budgetMs`) | 100 | ⌈4 000 ÷ 100⌉ = **40** | P (reads `time`, `G ≤ time ≤ G + 2 × step`) | was `GO_G3500`: 3 500 ms, 35 reads. R2 does not apply. |
| `src/uci-session.test.ts:1493` "A6: a FEN carrying an uncapturable ep square …" (added) | UCI `talk()` + direct `chooseMove` | `go depth 4` and `maxDepth 4`, budget 1e9 | none (fixed depth) | n/a (no clock bound read) | n/a | depth | 5 pieces; reads score and move only |

- The book half of the Hash row does not search (book hit), so it is not a census row.
- `src/transposition.test.ts`: no row's code, budget or bound changed (title/comment text only); the deep row runs only
  under `ENGINE_DEEP=1`.
- No real-clock row added (`NFR-008`).
