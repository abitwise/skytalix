---
id: 20261010T194248Z-software-engineer-observation-abc083-stop-two-class-r-levels-and-puzzle-red-e3f81b07
kind: observation
by: software-engineer
at: 2026-10-10T19:43:21Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-080
  - ABC-079
  - ABC-084
  - ADR-0028
  - ADR-0024
  - ADR-0031
  - ADR-0034
  - src/search.ordering.test.ts
  - src/quiescence.test.ts
  - .grugops/context/ticket-to-pr-ABC-083/probe/r15.out.jsonl
  - .grugops/context/ticket-to-pr-ABC-083/probe/r14.out.jsonl
supersedes:
---

# STOP: two class-R levels are red, and `PUZZLE_DEEP` is red. Architect/Design rules; no level, weight or fixture was moved to clear them

## The two R rows (`A10`: "R never re-levelled; red = stop")

| row | level | base | king safety alone | build | lane |
|---|---|---:|---:|---:|---|
| 15: `ABC-080` `A3` default guard, position-6 d2 full / unordered | ≤ 40.5% | 26.07% | 27.66% | **43.56%** (3 871 / 8 887) | default |
| 14: `ABC-079` `A5` `ADR-0024` multiplier, position-6 d2 | ≤ 26x | 17.86x | 18.29x | **28.46x** (3 871 / 136) | `SEARCH_DEEP` |

- **One cause.** Both rows divide the SAME number: position-6's full-ordering depth-2 search,
  2 429 → 3 871 nodes (+59%). Mobility makes it; king safety alone does not.
- **Both levels already carry their one 1.5x headroom** (row 15: ruling `…f7e66060` R1; row 14:
  `ADR-0024` decision 3). **`ADR-0028` decision 4: no second automatic headroom → stop.** Either
  Architect/Design rules a defect, or the owner re-levels by his word.
- **`ADR-0028` decision 1's evidence, gathered and not ruled:** (i) identity/oracle rows green: the
  `ABC-121` drift and mate floor (deep 29/29), `ABC-081` `A1` table on/off, `ABC-080` `A1`; the
  quiescence oracle re-run equals `search()` on both boards. (ii) It moves with the weight. Row 15
  reads 30.44 / 39.89 / 41.23 / 43.56% at 1 / 2 / 3 / 4 cp per square, and row 14 reads
  21.18 / 27.41 / 26.99 / 28.46x (scratch copies, `r15.out.jsonl`, `r14.out.jsonl`). (iii) The
  criterion's OWN reading of row 15 is green: d4 deep 1.82% (kiwipete) / 2.48% (position-6), ≤ 4%.
  Only the depth-2 proxy is red. Row 14's other five cells are green; position-6 d1 reads 9.19x / 10.
- **Not a route here:** `ADR-0031`'s cut fires on `A5` or `A9`, not on an R row. The Engineer may not
  drop mobility alone (page § cost risk). Re-weighting is not licensed.

## `PUZZLE_DEEP` (`ABC-084`'s gate): **53/58 against the recorded 54/58: RED (a QE FAIL by rule)**

- One `NEWLY-MISSED` row: **win material, seed 5061** (`8/nk1p3q/4b3/5P2/1P2P3/3r4/6NP/b4KB1 w`,
  accepts f5e6/g1a7). Base: SOLVED f5e6, d5, n20 507. Build: MISSED **g2e1, d5, n20 507** (the same
  depth and the same nodes).
- **Readings ladder** (out of tree, `stepMs` only): +5% g2e1 d5 n22 555; +10% g2e1 d5 n23 579;
  **+25% g2e1 d5 n27 675**: still missed at base's depth.
- **King safety alone also misses it** (53/58, g2e1 d5). The `ADR-0031` fallback build is red here too.
- **The `ADR-0034` scope command at `489c549e..79248602` prints `src/evaluate.ts` only.** So D and L
  are available. On decision 3's table the row reads as **L** (a win-material row still missed at
  +25%, at a depth ≥ base's). Classing is QE's. L's route is `ADR-0028` decisions 1 and 2, a re-find
  in its own commit, ruled by Architect/Design. **Not done here.** `ADR-0034` decision 6: no cut, no
  re-weight.
- Wall 32.8 s (branch), 46.2 s (base, under load); oracle rows green.
