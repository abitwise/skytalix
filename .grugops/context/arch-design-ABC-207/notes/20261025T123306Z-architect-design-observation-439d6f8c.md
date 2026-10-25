---
id: 20261025T123306Z-architect-design-observation-439d6f8c
kind: observation
by: architect-design
at: 2026-10-25T12:33:06Z
verified_by: 
confidence: high: deterministic counts on four scratch clones; the base reproduces QE a34270bf exactly; no real-clock reading
refs:
  - ABC-207
  - EPIC-008
  - ADR-0031
  - ADR-0028
  - ADR-0026
  - NFR-005
  - NFR-004
  - NFR-008
  - G2
  - G6
  - QE-205-c
  - QE-215-d
  - plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
  - arch-design-ABC-215/20261025T045829Z-architect-design-decision-e04234f4
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - arch-rule-ABC-205-g6/20261025T042840Z-architect-design-decision-912bcb0d
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-a34270bf
  - orch-2026-10-25w/20261025T121545Z-orchestrator-decision-ccf209d9
  - grugops/arch-design-ABC-207
  - 0e2358ce
  - 5c91e2e4
supersedes: 
seal: sha256:7147697ab768604689ea4389860ef4a33bb94599dc4fddca5a82067574da1795
---

# Architect/Design: ABC-207 design probes. Default and deterministic deep lanes, frozen-clock nodes d6–d8, the oracle, A1/A2 premises, mirror and relation margins on four scratch trees. No real-clock timing

Task `arch-design-ABC-207`, records only. The trees are `git clone`s of `main` `0e2358ce` in `<scratchpad>/arch207/trees/`:
`base`; `h` (head as designed); `w` (weights alone); `q` (the 25 cp queen term alone, weights 4). `probe/patch.mjs` wrote
the variants into the clones' `src/evaluate.ts`, never into a worktree. Plain node v26.11.1. The scripts are not
committed: `patch.mjs`, `a12.mts`, `mirror.mts`, `values.mts`, `nodes.mts`, `oracle.mts`, `rows.mts`, `deep.sh` and
`fails.sh`, in `<scratchpad>/arch207/probe/`.
- **Identity:** base's frozen-clock counts equal `qe-ABC-215` `…a34270bf`'s head row exactly.

## Lanes
- **Default** (`vitest run`, heap 128):
  - base 2 090/2 090;
  - `h` 2 081 (9 reds, 3 files);
  - `w` 2 081 (the same 9, the same values);
  - `q` 2 090.
- **Deep** (`PUZZLE_DEEP`; `SEARCH_DEEP` search, ordering, transposition, quiescence and pvs-lmr; `ENGINE_DEEP` engine
  and levels; `-t` excluding `real clock|REAL clock|wall clock|NFR-005`):
  - base: all green (6 + 4 rows filtered);
  - `h`: the default rows again, plus `quiescence` `A4` 2 398 → 2 358 and `A5` oracle kiwipete 8 → 20 and position-6
    85 → 78;
  - `q`: all green on every deep file (rc 0, no failed rows).
- **`h` reds:**
  - `ordering` `A4` p6 d2: none/mvv/full 10 371/3 266/3 177 → 11 220/1 317/1 317;
  - `ordering` `G1` 342 → 364;
  - `pvs-lmr` `A4` `search()`: shipped 10 ≠ unreduced 2, a premise lost;
  - `pvs-lmr` `A4` `chooseMove()`: the property holds, and the pin −7/b3f3 → −12/b3h3;
  - `transposition` `A1` knight-g1 939 → 911 ×2, position-3 1 377 → 1 355;
  - `transposition` `A5` 7 295 → 7 629 and −485 → −498.

## Readings on `h` (deterministic)
- Multiplier cells, base → `h` (level):
  - kiwipete d1 17.92 → 13.27 (180), d2 20.48 → 19.32 (50), d3 3.51 → 2.98 (70);
  - position-6 d1 8.96 → 4.19 (10), d2 23.36 → 9.68 (42), d3 5.20 → 1.93 (13).
- `ABC-121` `A1` d5 drift: base 97.86 % / 97.86 %, max 63. `h` 98.93 % / 98.93 %, max 45 (position-6/f3h4). 0 mate
  flips; mate floor 0 of 180.
- `G1` puzzle suite (virtual clock): base 54/58; `h` 54/58.
- Oracle (`searchWithoutPruning(p, 3)` against `searchWithoutPvsOrReductions` and `search()`): `equal: true` on both
  boards.
  - position-6: 78/c3d5 (14 332 220 oracle nodes);
  - kiwipete: 20/e2a6 (70 389 552).
- Relation margins, base → `h`:
  - `ABC-076` `A2` 0 → 0, `A3` 309 → 311, `A4` 70 → 70;
  - `ABC-083` `A2` g2 141 → 141 and g6 3 → 3, `A3` 121 → 121 and e5/f5 14 → 14, `A4` 0/60 → 0/32;
  - `QE-G2` −556 → −528; `QE-G3` 858 → 786.
- `A1`/`A2` premises on `h`:
  - lone piece mobility open/blocked: N 32/28, R 28/22, Q 27/24 (base Q 100/96, clamped);
  - the `A2` term read through `evaluateWithoutMobility`: −25 / 0 / 0;
  - `evaluate` minors-home pair: −7 (base +60; at 20 cp it was −2).
- Mirror on `h`: 12/12 positions exercising both terms.

## Frozen-clock nodes to complete depth k (`chooseMove`, `now: () => 0`, `maxDepth: k`)
| tree | kiwipete d6 / d7 / d8 | position-6 d6 / d7 / d8 |
|---|---|---|
| base | 248 056 / 609 900 / 1 735 339 | 180 658 / 586 333 / 1 355 149 |
| `h` | 238 941 / 602 091 / 1 700 946 | 158 592 / 469 639 / 1 111 000 |
| `w` | 238 941 / 602 038 / 1 700 917 | 158 591 / 469 637 / 1 110 997 |
| `q` | 248 056 / 609 876 / 1 735 311 | 180 652 / 586 330 / 1 355 148 |

## Not run
- Any real-clock search, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D, `N8-LANE`, and the real-clock rows named above.
