---
id: 20261105T000021Z-software-engineer-observation-26228fe3
kind: observation
by: software-engineer
at: 2026-11-05T00:00:21Z
verified_by: 
confidence: high: read as run, outputs non-empty, each deep row seen run; the 4.60 MiB is arithmetic; the two rows left as found are UNKNOWN - verify
refs:
  - se-ABC-304
  - ABC-304
  - ABC-271
  - ABC-279
  - ABC-283
  - ADR-0070
  - ADR-0069
  - ADR-0072
  - ADR-0063
  - NFR-009
  - arch-ABC-303-open/20261104T233941Z-architect-design-decision-e28552ac
  - bapm-K0-cut/20261104T235027Z-ba-pm-decision-555a9a9e
  - grugops/ABC-304
  - df426688
  - 9e0d4044
  - ADR-0058
  - NFR-008
  - arch-ABC-303-open/20261104T233811Z-architect-design-decision-84f9bae1
  - arch-ABC-303-open/20261104T233924Z-architect-design-observation-261ea757
supersedes: 
seal: sha256:224d78fe529396be8b11291e9e5f4521814a1b8d9af780070ddc9d60f5e14954
---

# se-ABC-304: every row read on its door. K0 28 / 28 with all seven figures exact; A3 (a) 96.26 % / 95.72 %, 66 / 96 cp, 0 changes; all gates green

Run at `9e0d4044`'s content, `src/` tree `52c37499`. The deep lanes ran on that content just before it was committed, and nothing changed between. Every run was under the host lock, on one core with one worker. Each output was non-empty, and the JSON reporter showed 0 failed, 0 pending, 0 todo in each deep lane. Logs are in `raw/`.

**K0, `SEARCH_DEEP=1 src/evaluate.passer.test.ts`: exit 0, 28 / 28.** Each count below is the row's own printed line, and each row shows a tick in the verbose log.

| row | door | frozen | read |
|---|---|---|---|
| `kiwipete_chooseMove_d8` | `chooseMoveWithoutBundle` | 766 275 | 766 275 |
| `kiwipete_chooseMove_d9` | `chooseMoveWithoutBundle` | 1 725 150 | 1 725 150 |
| `pos6_chooseMove_d8` | `chooseMoveWithoutBundle` | 87 475 | 87 475 |
| `pos6_chooseMove_d9` | `chooseMoveWithoutBundle` | 253 724 | 253 724 |
| `pos6_chooseMove_d10` | `chooseMoveWithoutBundle` | 533 916 | 533 916 |
| `kiwipete_search_d8` | `searchWithoutBundle` | 605 117 | 605 117 |
| `pos6_search_d8` | `searchWithoutBundle` | 406 787 | 406 787 |

**A3 (a), `SEARCH_DEEP=1 src/see.test.ts`: exit 0, 52 / 52.**

| row | door | within 25 cp | of | max | sign changes |
|---|---|---|---|---|---|
| `search()` title | `searchWithoutBundle` | 96.26 % | 187 | 66 cp (kiwipete/a1d1, 298 -> 232) | 0 |
| `chooseMove` title | `chooseMoveWithoutBundle` | 95.72 % | 187 | 96 cp (kiwipete/f3f4, 555 -> 459) | 0 |

Both clear ≥ 93 %, ≤ 144 cp, 0 changes and ≥ 100 compared, and both equal the expected figures, so that `UNKNOWN - verify` closes.

**`NFR-009` (a), `src/transposition.test.ts`:** the A7 sum row passed in all three lanes: `SEARCH_DEEP=1` 40 / 40, `ENGINE_DEEP=1` 26 / 26, default. By arithmetic from the terms, not a printed read, the sum is 4 822 312 bytes, about 4.60 MiB. The row is green with or without the term, so QE reads the term in the diff.

**Gates at `9e0d4044`:** lint, typecheck and build exit 0. `npm test` exit 0, 2 684 / 2 684 in 71 files, unchanged from `ABC-302`'s count. Skip count 0, `test-skip-integrity` No findings. The default lane took 26.68 s on one core and one worker: not `NFR-008`'s measuring form, so not a graded read.

**A4:** the fence pipeline prints nothing. Three files change. `it` counts per file are equal before and after (22, 27, 32), and the fixture JSON has no diff.

**Seen, left as found, not settled by what I read.** `src/see.test.ts` has two more rows whose shipped side is `search` / `chooseMove` and whose other side is `…WithoutSeePruning`: A3 (b), the mate floor, at `search(parseFen(fen), 5)`, and A4 (b), the reach, at `reach(chooseMove)`. Neither is in scope 2, and both pass. `ADR-0069` d11's dated line lists "mates" among rows that "compare with no door", yet A3 (b) does compare with one. A4 (b) is a reach row on the same shape as A3 (a). QE's A5 grep will show A3 (b)'s line. Whether either owes a re-point: `UNKNOWN - verify`, the Architect's to say.
