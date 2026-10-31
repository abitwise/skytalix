---
id: 20261031T064950Z-qe-e2e-observation-5cff79dc
kind: observation
by: qe-e2e
at: 2026-10-31T06:49:50Z
verified_by: 
confidence: high: 6 plants, whole default lane each (2 364 rows + X1-X4), on a scratch tree; all as pre-registered
refs:
  - qe-ABC-245
  - ABC-245
  - EPIC-010
  - ADR-0046
  - ADR-0054
  - ADR-0032
  - NFR-008
  - ABC-244
  - ABC-242
  - ABC-221
  - ABC-230
  - QE-242-b
  - SE-242-f
  - SE-245-a
  - SE-245-b
  - SE-245-c
  - QE-221-c
  - QE-245-a
  - QE-245-b
  - QE-245-c
  - QE-245-d
  - R1
  - R2
  - R4
  - arch-qe242a-ruling
  - bapm-ABC-245-rescore
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-93eb0bf9
  - se-ABC-245/20261031T061812Z-software-engineer-decision-69e64b77
  - se-ABC-245/20261031T061812Z-software-engineer-observation-c1655da6
  - se-ABC-245/20261031T061812Z-software-engineer-observation-bce18931
  - se-ABC-245/20261031T061812Z-software-engineer-observation-f0b04c75
  - grugops/ABC-245
  - 7e81732e
  - 7c1721ce
  - 9c008db4
  - 4387d4e8
  - c48a6f83
  - grugops/qe-ABC-245
  - d16c7505
  - src/levels.test.ts
  - src/levels.ts
supersedes: 
seal: sha256:9bbbbe6fadf32b2681fca1ba35bc28e84125976f2b8093092f645c45c0809f01
---

# `ABC-245` plants on the whole default lane at head `7e81732e`: the new row is red under cap 8 and cap 50 and is the only change of verdict versus `qe-ABC-242`. It is green at cap 100 and red under base's `levels.ts`. All 6 plants ran as pre-registered

**Harness.** `raw/qe-scripts/plant.mjs`, frozen in `raw/PREREG.txt` (commit `d16c7505`) before any head run. Each plant is one exact
string edit of `src/levels.ts`, checked to occur exactly once. QB swaps in the whole file. The plants are applied to a scratch tree `P`
(a hard-link tree of `git archive 7e81732e` with a real `src/`). Each plant runs the **whole default lane** (2 364 rows) plus
`qe-ABC-242`'s scratch `qe-extra.test.ts` (X1–X4, 4 rows), with vitest through node, the json reporter and heap 128. Nothing is
committed to `src/`. Raw output: `raw/plants/plant-*.red.txt`, the failure messages in `raw/plants/abc245-row-messages.txt`, and
the json sha256s in `raw/plants/json-sha256.txt` (the json itself stayed in scratch, as at `qe-ABC-242`).

| plant | edit | total | lane reds | X reds | as pre-registered |
|---|---|---|---|---|---|
| none | cap 100 (as committed) | 2 368 | 0 | 0 | yes (**REQUIRED 0 failed: held**) |
| **Q6** | cap 100 → 8 | 2 368 | **the ABC-245 row only** | X2 | yes (**REQUIRED red: held**) |
| **Q8** | cap 100 → 50 | 2 368 | **the ABC-245 row only** | X2 | yes (**REQUIRED red: held**) |
| **QB** | `4387d4e8`'s real `src/levels.ts` | 2 368 | levels A1 ×3, levels A5, cli `ABC-242 A4`, uci-session `ABC-242 A4`, **the ABC-245 row** | X2 | yes (**REQUIRED red: held**) |
| Q97 | cap 100 → 97 (informative) | 2 368 | the ABC-245 row only | X2 | yes |
| Q98 | cap 100 → 98 (informative) | 2 368 | none (survives) | X2 | yes |

- **Why it is red.** Under Q6, Q8, QB and Q97 the row fails at `levels.test.ts:798`, the A1 assertion:
  `expected [ 'd7e8:-1005' ] to deeply equal [ 'd7e8:0' ]`. The far repeat is read as a searched −1005, not the check's 0.
  The red comes from the score itself, not from an incidental assertion. Under QB, base's `d7e8` reads −1005 ≠ 0 (A3).
- **No other verdict changed versus `qe-ABC-242`.** At `6884d61a`, Q6 and Q8 had 0 lane reds and X2 red. Here the only new lane
  red is the ABC-245 row. QB's lane set is `qe-ABC-242`'s six rows plus the new row, by name. The lane grew from 2 333 to 2 364
  rows in between (`ABC-221`'s rows plus this one), and none of the added rows reads the cap.
- **SE-245-a confirmed by run.** Cap 97 is red and cap 98 survives. The row kills every cap below 98, because the −98 match is
  the oldest entry it can read: min(child clock 98, list 98) = 98. Caps 98–100 and removing the cap (Q7) stay equivalent for every
  trimmed caller, as QE and the SE agreed at `ABC-242`. Only a synthetic list (X2) separates 98/99 from 100. That is not a gap,
  because no production caller hands more than 98 entries on this fixture, and none hands more than 101 on any position.
- **PLANTS MET**, and A2 MET: red under Q6 and Q8 and green at 100. Before this row both caps survived the lane, which was
  QE-242-b. **QE-242-b is closed.**
