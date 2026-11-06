---
id: 20261105T125756Z-software-engineer-observation-fa727405
kind: observation
by: software-engineer
at: 2026-11-05T12:57:56Z
verified_by: 
confidence: high
refs:
  - se-ABC-303-rows
  - grugops/ABC-303
  - ABC-303
  - ABC-282
  - ABC-279
  - ABC-221
  - EPIC-011
  - ADR-0071
  - ADR-0072
  - ADR-0069
  - arch-ABC-303-w1-rows/20261105T124145Z-architect-design-decision-0f8a4f82
  - orch-2026-10-30a/20261105T124329Z-orchestrator-decision-d30513bc
supersedes: 
seal: sha256:eb237f57d93185199e0431e02260aca458d13b8edc1867692863501a91cc7de1
---

# se-ABC-303-rows artifact: `grugops/ABC-303`, the row list applied, all lanes green; not pushed, not merged. The PR's row list

Merge `2a79887d` (`main` `c9ff7ff9`); claim `d219265c`; edits `046cac35`. Raw: `.grugops/context/se-ABC-303-rows/raw/`.

**For the PR (test note 4; `…0f8a4f82` § 5). Every row, old → new.**

| file | row | old → new |
|---|---|---|
| `src/engine.test.ts` | `ABC-282` A1 (a) | budget 6 → 5, `softMs` 6 ÷ b → 5 ÷ b; no asserted figure moved |
| `src/engine.test.ts` | `ABC-282` A2 (a) | kept `a1b1`, 450 → `a1f6`, 475 |
| `src/engine.test.ts` | A0-1 kiwipete d6 | door e2a6, −59, 140 341 unchanged; shipped e2a6, −59, 140 341 → e2a6, −101, 104 780 |
| `src/engine.test.ts` | A0-1 kiwipete d7 | door d5e6, −82, 330 628 unchanged; shipped d5e6, −82, 330 628 → e2a6, −105, 244 677 |
| `src/engine.test.ts` | A0-1 kiwipete d8 | door d5e6, −89, 707 548 unchanged; shipped d5e6, −89, 707 548 → e2a6, −114, 573 518 |
| `src/engine.test.ts` | A0-1 position-6 d6 | door c3d5, 87, 14 570 unchanged; shipped c3d5, 87, 14 570 → c3d5, 87, 10 513 |
| `src/engine.test.ts` | A0-1 position-6 d7 | door c3d5, 79, 32 165 unchanged; shipped c3d5, 79, 32 165 → c3d5, 43, 39 268 |
| `src/engine.test.ts` | A0-1 position-6 d8 | door c3d5, 71, 101 425 unchanged; shipped c3d5, 71, 101 425 → c3d5, 45, 94 911 |
| `src/engine.test.ts` | A0-2 kiwipete 50 | door unchanged; shipped score −59 → −75; depth 5, e2a6, 47 384 stay |
| `src/engine.test.ts` | A0-2 kiwipete 200 | door unchanged; shipped score −59 → −101; depth 6, e2a6, 199 960 stay |
| `src/engine.test.ts` | A0-2 position-6 50 | door unchanged; shipped score 79 → 43; depth 7, c3d5, 44 105 stay |
| `src/engine.test.ts` | A0-2 position-6 200 | door unchanged; shipped score 71 → 45; depth 8, c3d5, 196 681 stay |
| `src/uci-session.test.ts` | D5 | `score cp 450` → 475; `pv a1b1` → `a1f6`; `bestmove a1b1` → `a1f6` |
| `src/uci-session.test.ts` | A0-3, four `D8` rows | `cp` 71 → 45 |
| `src/uci-session.test.ts` | A0-3, `D7` row | `cp` 79 → 43 |
| `src/uci-session.test.ts` | A0-3, `go depth 6` | `nodes 14570 time 21 nps 693810` → `nodes 10513 time 17 nps 618412`; `cp` 87 stays |
| `src/uci-session.test.ts` | `ABC-221` A10 | title "three searches" → "four searches" |
| `src/see.test.ts` | `ABC-279` A3 (a) | re-pointed to `searchWithoutBundle` / `chooseMoveWithoutBundle` (`ADR-0069` d11's dated line, `ADR-0072` d6); on the shipped path it reads **90.91 %, 96 cp, 0 changes** |

The A3 (a) figures are quoted from `ADR-0072` d7's dated line and test note 4. This hop did not re-read them, and `src/see.test.ts` is not in its width.

Titles changed with the rows: A0-1, A0-2 and A0-3's session rows, as the list gives them.

**Next:** QE seals only after `ABC-307` merges and `main` is in (`…d30513bc`).
