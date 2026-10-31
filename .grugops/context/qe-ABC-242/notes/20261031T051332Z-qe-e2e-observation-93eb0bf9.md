---
id: 20261031T051332Z-qe-e2e-observation-93eb0bf9
kind: observation
by: qe-e2e
at: 2026-10-31T05:13:32Z
verified_by: 
confidence: high: 20 plants, whole lane each, on a scratch tree; all as pre-registered; equivalence by reasoning
refs:
  - qe-ABC-242
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - ADR-0046
  - NFR-004
  - NFR-008
  - NFR-009
  - QE-230-a
  - ABC-230
  - ABC-241
  - ABC-244
  - ABC-228
  - R1
  - R2
  - R3
  - R4
  - QE-242-a
  - QE-242-b
  - QE-242-c
  - SE-242-a
  - SE-242-c
  - SE-242-e
  - se-ABC-242/20261031T043705Z-software-engineer-decision-8b42a94e
  - se-ABC-242/20261031T043705Z-software-engineer-observation-712a6bb4
  - se-ABC-242/20261031T043705Z-software-engineer-observation-76069fd1
  - se-ABC-242/20261031T043705Z-software-engineer-observation-c0e5e0fa
  - grugops/ABC-242
  - 6884d61a
  - 4387d4e8
  - grugops/qe-ABC-242
  - 5da281c9
  - src/levels.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:922dcfbfa90ab35727403c79841369d4c03b375749422cd79ac2ff7db80461de
---

# `ABC-242` plants at head `6884d61a` (base `4387d4e8`): every pre-registered red holds. 7 lane survivors: 4 are equivalent, and 3 are not (cap 8, cap 50, a clock read)

**Harness.** `raw/qe-scripts/plant.mjs`, frozen in `PREREG.txt` (`5da281c9`) before any head run. Each plant is one exact
string edit of `src/levels.ts`, checked to occur exactly once. It is applied to a scratch tree `P` built from `H`. For
each plant the run is the WHOLE default lane plus QE's scratch file `qe-extra.test.ts` (X1–X4, synthetic key lists),
with vitest called through node, the json reporter and heap 128. The raw output is in `raw/plants/plant-*.red.txt` and
`plant-*.json`.
- **Post-PREREG harness fix:** the scratch quota could not hold a full copy of `H` (146 MB of `.grugops`). So `P` is a
  hard-link tree of `H` whose `src/` is a real copy. No plant or expectation changed. After the run, `H` was compared
  with `git archive 6884d61a` (tar `--compare`) and reads **clean** (`raw/plants/h-integrity.txt`).

| plant | edit | lane reds (2 333 rows) | X reds | as pre-registered |
|---|---|---|---|---|
| none | — | 0 (2 337 passed with X) | 0 | yes |
| Q1 | `++matches === 1` (one match scores 0) | **levels A2** | X3, X4 | yes (**REQUIRED A2 red: held**) |
| Q2 | the clock dropped from the oldest bound | **levels A3** | — | yes (**REQUIRED A3 red: held**) |
| Q3 | the skip becomes a search (child searched, then 0) | **levels A1 ×3** (child count) | — | yes (**REQUIRED: held**) |
| Q4 | the check never fires | A1 ×3, A5, CLI A4, UCI A4 | X2 | yes |
| QB | B's real `src/levels.ts` under H's tests | A1 ×3, A5, CLI A4, UCI A4 (A2, A3, A6 green) | X2 | yes |
| Q5 | cap 100 → 6 | = Q4 | X2 | yes |
| **Q6** | cap 100 → 8 | **none (survives)** | X2 | yes |
| Q7 | cap 100 → +∞ | none (survives) | X1, X3 | yes |
| **Q8** | cap 100 → 50 | **none (survives)** | X2 | yes |
| Q9 | the root's clock (child clock − 1) | = Q4 | — | yes |
| Q10 | three matches needed | = Q4 | X2 | yes |
| Q11 | the walk starts at −2 (SE M7) | none (survives) | X4 | yes |
| Q12 | raw `zobristKey` (SE M8) | none (survives) | — | yes |
| Q13 | index off by one (odd offsets) | = Q4 | X2 | yes |
| Q14 | the skip scores 1 | = Q4 | X2 | yes |
| Q15 | `earlier > oldest` (SE M6) | = Q4 | X2 | yes |
| Q16a | early exit at `oldest > −8` | none (survives) | — | yes |
| Q16b | early exit at `oldest > −9` | = Q4 | — | yes |
| **Q18** | the check spends one clock read | **none (survives)** | — | yes |

All 20 runs matched the pre-registered expectation row for row. **PLANTS MET**: `none` is 0 failed, and every REQUIRED
red holds. The ticket's brief asked for four plants: two matches → one (A2 red), the clock bound dropped (A3 red), the
skip turned into a search (A1 child count red), and a plant on the 100 cap (survivors reported below).

## Survivors, judged (SE-242-c)
- **Equivalent; QE agrees with the SE:**
  - **Q11 = M7** (the walk starts at −2). `K[−2]` is the position before the opponent's last move. The child is
    reached from it by one move of each side, and the first of those moves changes that side's own pieces, which the
    second move cannot put back. So `K[−2]` never equals the child on any list taken from a game. Only a synthetic list
    kills it (X4).
  - **Q12 = M8** (raw key). The child is made by `makeMove`, which sets an ep square only on a double push, and a double
    push resets the clock to 0. So wherever the walk reads anything (clock ≥ 4), the child has no ep square and
    `repetitionKey` returns the raw key. No input kills it.
- **Equivalent; QE's addition:**
  - **Q16a** (early exit widened to −8). Two matches need offsets −4 and −8 at least, because `K[−4] = K[−6]` would be a
    2-ply cycle, which is impossible.
  - **Q7** (cap removed). Every production caller hands at most 100 trimmed keys plus the root key, so the walk's last
    even offset is −100 with or without the cap. Only an untrimmed list longer than 101 keys kills it (X1, X3). This is
    the SE's "the cap changes nothing", and QE agrees.
- **NOT equivalent, and unpinned by the lane:**
  - **Q6 (cap 8) and Q8 (cap 50)** survive every lane row. All five `ABC-242` fixtures have 7-ply histories, with their two
    earlier occurrences at −4 and −8, so no row reads a match older than −8.
    - A real game can hand the level a third occurrence whose oldest earlier occurrence sits more than 8, or more than
      50, plies back inside the reversible window. Clocks up to 149 are legal before the 75-move rule.
    - QE's synthetic X2 (matches at −98 and −100) kills both.
    - QE's differential sweep as built did not reach far repeats: a post-hoc run against a cap-50 copy read 0 FAIL, and
      against a cap-6 copy 280 FAIL (`raw/oracle/posthoc-oracle-cap{6,50}.txt`).
    - The code reads 100 today, so this is a regression gap, not a fault: **QE-242-b, LOW.**
  - **Q18** (the check spends one clock read) survives. `ADR-0054` amendment A3 says the check reads no clock, so the
    skipped slice passes to the next child whole. That only changes the entries after the skip. The ticket marks those
    entries `UNKNOWN - verify` and pins nothing about them, by design (the Architect's reading). **INFO** (in QE-242-b).
- **The SE's kill table** (M1–M8, identical at steps 1, 10, 100 and 1 000) agrees with QE's on the shared mutants: M2 = Q1,
  M3 = Q2, M4 = Q3, M5 = Q14, M6 = Q15, M7 = Q11, M8 = Q12.
