---
id: 20261010T194248Z-software-engineer-observation-abc083-a10-repin-ledger-a8-mutants-fixture-bites-4a6d2c88
kind: observation
by: software-engineer
at: 2026-10-10T19:44:22Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-082
  - ADR-0028
  - src/search.ordering.test.ts
  - src/search.pvs-lmr.test.ts
  - src/engine.test.ts
  - src/transposition.test.ts
  - src/quiescence.test.ts
  - src/evaluate.pawns.test.ts
  - .grugops/context/ticket-to-pr-ABC-083/probe/rows.ts
  - .grugops/context/ticket-to-pr-ABC-083/probe/mutants.mjs
  - .grugops/context/ticket-to-pr-ABC-083/probe/mutants.out.txt
  - .grugops/context/ticket-to-pr-ABC-083/probe/mutants-ledger.json
supersedes:
---

# `A10` re-pin ledger and `A8`'s mutant runs. Every value measured on base and build, never read off a failure message

Rows numbered as `ABC-082`'s § Merged bars. Values by `probe/rows.ts` on `489c549e` and the build
(`rows-base.json`, `rows-branch.json`, `rows-ks.json`), deep values with `DEEP=1`.

| # | file:row | class | old → new | measured by | lane |
|---|---|---|---|---|---|
| 1 | `search.ordering` `A4` d2 | P | 9 319 / 3 286 / 2 429 → **8 887 / 4 419 / 3 871** | rows r1 | default |
| 2 | `search.ordering` `G4` | P | 261 → **262**. Bite: `M13` reads 282, red | rows r2; mutants M13 | default |
| 3 | `search.ordering` `G1` | P+F | 360 → **354**. Bite: `N3` reads 350, red | rows r3; mutants N3 | default |
| 4 | `transposition` `A1` position-3 d4 | P | 1 319 / 1 474 → **1 325 / 1 523** | rows r4 | default |
| 5 | `transposition` `A5` | P | 7 251 → **7 832**; −470 → **−488**; 0 / f7f8 hold | rows r5 | default |
| 6 | `quiescence` `A4` | P | d2 136 / g5f6 unchanged; deep d3 2 273 → **2 355** / c3d5 | rows r6 (DEEP) | default / `SEARCH_DEEP` |
| 7 | `quiescence` `A5` oracle | P | kiwipete 55 → **70** / e2a6 (398 s); position-6 55 → **84** / c3d5 (63 s). Oracle equals `search()` and the door on both | `oracle.ts` | `SEARCH_DEEP` |
| 8 | `search.pvs-lmr` `A4` | P+F | **re-found, both rows**: `A4_FEN` → position-3 after 1. Rb3 Rd5, `[19, "b3f3"]` both shapes; `A4_SEARCH_FEN` = `A4_FEN`. Bite: all six re-search variants red | `a4scan.ts` (467 positions, 8 hits), `a4engine.ts`; mutants | default |
| 9 | `engine` `A3` | F | **re-fixtured**: 1. g4 Nf6 (e2e3 at d1/d2, g4g5 at d3, budget 3). Bite: keepBestSoFar red (−42 vs −78) | `a3scan.ts` (6 731 positions); mutants | default / `ENGINE_DEEP` |
| 10 | `search.ordering` Scope tie | F | **re-found**: position-6 after 1. Rfc1 Bxe3, g5e3 vs e2e3 tie at 373. Bite: `M11` red | `tiescan.ts` (42 ties); mutants | default |
| 11 | `engine` `A2` | F (bound R) | 3 666 → 3 674 ≤ 10 240. Bite: `M1` reads 69 437, red | rows r11; mutants M1 | default |
| 12 | `engine` `A4` | F | 4 / 6 / 9 → **4 / 7 / 9**. Bite: `ceiling4` red | rows r12; mutants | default / `ENGINE_DEEP` |
| 13 | `transposition` `A5` ticks | F | holds (4, 0, f7f8; deep 6, 0, a3f8). Bite: repetitionBlind (−387) and rootIgnoresHashMove (depth 3) red | rows r13; mutants | default |
| G6 | `transposition` knight-g1 pair (pawnless) | P | 830 / 820 → **894 / 894** at d4 (d5 928 / 910). The premise sentence corrected and the "G6 bites" row title too; the key row is the guard and is unchanged | `g6.mjs` | default |
| rig | `quiescence` `A3` cap rig (pawnless) | F | 16 queens stood pat at ply 4 → **re-found**: 20 queens (rank-4 black queens, kings a1/e1): deepest 8 on base / king safety / build, 6 878 nodes. Bite: `noCap` reads 16, red | `rigscan.mjs`; mutants | default |
| `ABC-082` `A2` | `evaluate.pawns` doubled ≤ 50 | F (`ADR-0028` d2) | **re-found**: kings e1/e8 → h1/h8 (king safety added 25 cp via the d-file). Gap 35 on base and build; the level is byte-identical. Bite: doubled40 reads 60, red | `ev.mjs` readings; mutants | default |
| 14, 15 | R levels | R | **RED, not touched** (`…e3f81b07`) | `r14.mjs`, `r15.mjs` | `SEARCH_DEEP` / default |

- **Other R rows green on the build:** 16 (`ABC-077` `A2`), 17 (`ABC-081` `A2` ≥ 10%), 18 (the delete rule),
  19 (`ABC-121` drift: search 97.33%, chooseMove 97.86% within 25 cp, max 51 cp; mate floor 0 / 180),
  20, 21 (hanging corpus d3 0/24, bare d1 24/24, min margin 160 → 173 cp), and `QE-G3`.
- **The A10 pawnless group:** `src/search.mate-corpus.ts` rows green (`SEARCH_DEEP` search 57/57; pvs-lmr
  mate floor 0 of 180). The depth-10 rook ending is green. The `G6` pair is re-pinned (above).
- **`A8`** (`src/evaluate.pawns.test.ts`, default lane): LEFT row (d4 + c3 against d4 + a3) and RIGHT row
  (d4 + e3 against d4 + b4). Command `MUTDIR=<scratch> node .grugops/context/ticket-to-pr-ABC-083/probe/mutants.mjs <out> E8`
  (then `E9`). **E8: vitest exit 1, red rows = both `ABC-083 A8` rows** (LEFT 230 vs 235, RIGHT 240 vs 240).
  **E9: exit 1, the same two rows.** Unmutated: both green. They are relation rows on the default lane, not
  class-P pins.
- `src/evaluate.pawns.test.ts` is touched (the page does not name it): A8's rows, and `ABC-082` `A2`'s re-found kings.
