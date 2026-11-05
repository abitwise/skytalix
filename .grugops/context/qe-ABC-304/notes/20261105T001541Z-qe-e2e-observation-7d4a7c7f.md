---
id: 20261105T001541Z-qe-e2e-observation-7d4a7c7f
kind: observation
by: qe-e2e
at: 2026-11-05T00:15:41Z
verified_by: 
confidence: high: every reading is from QE's own runs, outputs non-empty, each named row seen passed with a duration; probe figures are labelled and reproduce the lane's lines
refs:
  - qe-ABC-304
  - ABC-304
  - ABC-271
  - ABC-279
  - ABC-283
  - ADR-0070
  - ADR-0069
  - ADR-0072
  - ADR-0063
  - NFR-009
  - EPIC-011
  - grugops/ABC-304
  - e1ac9209
  - 9e0d4044
  - se-ABC-304/20261105T000021Z-software-engineer-decision-aa228da0
  - se-ABC-304/20261105T000021Z-software-engineer-observation-26228fe3
  - se-ABC-304/20261105T000021Z-software-engineer-observation-74a63e3d
  - arch-ABC-303-open/20261104T233924Z-architect-design-observation-261ea757
  - arch-ABC-303-open/20261104T233811Z-architect-design-decision-84f9bae1
  - ADR-0058
  - NFR-008
  - src/evaluate.passer.test.ts
  - src/see.test.ts
  - src/transposition.test.ts
supersedes: 
seal: sha256:3cb99d650969b2dde710db175b98e605973b39a23ba095626c29531d1ed85e6a
---

# qe-ABC-304 readings: A1 to A5 all read on QE's own runs at `e1ac9209`, `src/` tree `52c37499`. K0 28 / 28, seven figures exact; A3 (a) 96.26 % / 95.72 %, 66 / 96 cp, 0 changes; the term is in the sum; the fence prints nothing; nine rows

QE/E2E, task `qe-ABC-304`, branch `grugops/qe-ABC-304` from `grugops/ABC-304` `e1ac9209`. Every run was under the host lock, on one core with one worker, one at a time. Every output was non-empty. The engineer's logs were not used for any reading below. Logs are in `raw/`. `exits.txt` holds the lanes and gates, `probe-exits.txt` the probes. `json-counts.txt` and `deep-rows-status.txt` hold each lane's counts and each named row's status and duration from the JSON reporter.

**The tree.** `9e0d4044` and `e1ac9209` carry the same `src/` tree, `52c37499`. `main` moved `df426688` -> `3f2b29ae` by `plans/board.md` and this brief only, so no test file came from the other side and test note 3's re-read is not owed. K0's block is on `main`, `ABC-301` and `ABC-303` have not merged, and the ticket does not shrink.

**A1, `SEARCH_DEEP=1 src/evaluate.passer.test.ts`: MET.** Exit 0, 28 / 28, 0 failed, 0 pending, 0 todo.

| row | door | `FROZEN.k0` | read in the lane | ms | shipped path (probe) |
|---|---|---|---|---|---|
| `kiwipete_chooseMove_d8` | `chooseMoveWithoutBundle` | 766 275 | 766 275 | 1 315 | 707 548 |
| `kiwipete_chooseMove_d9` | `chooseMoveWithoutBundle` | 1 725 150 | 1 725 150 | 2 591 | 1 595 095 |
| `pos6_chooseMove_d8` | `chooseMoveWithoutBundle` | 87 475 | 87 475 | 147 | 101 425 |
| `pos6_chooseMove_d9` | `chooseMoveWithoutBundle` | 253 724 | 253 724 | 425 | 226 171 |
| `pos6_chooseMove_d10` | `chooseMoveWithoutBundle` | 533 916 | 533 916 | 887 | 471 434 |
| `kiwipete_search_d8` | `searchWithoutBundle` | 605 117 | 605 117 | 942 | 523 847 |
| `pos6_search_d8` | `searchWithoutBundle` | 406 787 | 406 787 | 671 | 234 214 |

Each row is `passed` in the JSON report, with a duration that a real search takes, and printed its own count. `FROZEN.k0` read from the JSON file equals the ticket's seven. The file's sha256 is `bf3c205b…`, the pinned one. The last column is a scratch probe: all seven differ from the door and equal `…261ea757`'s reds, so the rows can tell the two searches apart. They are green because of the re-point.

**A2, `SEARCH_DEEP=1 src/see.test.ts`: MET.** Exit 0, 52 / 52, 0 failed, 0 pending, 0 todo.

| row | door | within 25 cp | compared | max | sign changes | ms |
|---|---|---|---|---|---|---|
| `search()` title | `searchWithoutBundle` | 96.26 % | 187 | 66 cp (kiwipete/a1d1, 298 -> 232) | 0 | 10 615 |
| `chooseMove` title | `chooseMoveWithoutBundle` | 95.72 % | 187 | 96 cp (kiwipete/f3f4, 555 -> 459) | 0 | 8 980 |

Both clear ≥ 93 %, ≤ 144 cp, 0 changes, ≥ 100 compared, and both equal `ADR-0069`'s figures, so A2's `UNKNOWN - verify` closes.

For the record, not asked for: on the shipped path of this tree the same arithmetic reads `search()` 95.72 %, 66 cp and `chooseMove` 96.26 %, 96 cp, 0 changes, each of 187. That is the figure `…84f9bae1` called not on record. It is a scratch probe, not a lane read. The probe's door side reproduces the lane's two rows exactly.

**A3, `NFR-009`: MET.** The row is green either way, so it was read in the diff. `src/transposition.test.ts` lines 659 to 667, inside `expect(...)`, add `historyByteLength()` as a seventh term, imported from `./search.ts`. It is not a comment and not a side `expect`. The `toBeLessThanOrEqual(16 * 1024 * 1024)` is unchanged. The row is `passed` in both deep lanes and the default lane: `SEARCH_DEEP=1` 40 / 40, `ENGINE_DEEP=1` 26 / 26.

The terms, printed by a probe after one search: table 4 194 304, keys 1 032, pawn 589 824, order 2 048, capture 2 048, SEE 288, history 32 768. The sum is **4 822 312 bytes, 4.599 MiB**, and 4 789 544 without the term. The engineer's arithmetic stands, and this is now a printed read. 32 768 is pinned at `src/search.bundle.test.ts:129`.

**A4, the fence: MET.** The pipeline prints nothing at `9e0d4044~1 9e0d4044`, and nothing over the whole branch, `df426688 e1ac9209`. `src/` changes in the three named test files only. The JSON has no diff. `it` counts are equal before and after: 22, 27, 32. No `it` or `describe` line is added or removed, and no `skip`, `only` or `todo` is added.

**A5, the list: MET.** The nine rows of `…74a63e3d` match the diff and the grep.
- `src/evaluate.passer.test.ts` at the base has three shipped-side call lines: 399, the helper under five rows, then 406 and 407. All three moved, and the file has no `search(` or `chooseMove(` left.
- `src/see.test.ts` at the base has four shipped-side code lines. 565 and 575 moved: A3 (a)'s two. 590 is A3 (b), and 651 is A4 (b); both stay, as out of scope 2. The rest of the hits are titles and log strings.
- 5 + 2 + 2 = 9. No row is on the list that is not in the diff, and no row in the diff is off the list.
- Line 651 reads `reach(chooseMove)`, so the grep as written, `chooseMove(`, does not find it. QE found it by widening the pattern.

**Standing gates at the tip.** Lint exit 0, typecheck exit 0, build exit 0. `npm test` exit 0, 2 684 / 2 684, 71 files, 27.16 s on one core: not `NFR-008`'s measuring form, so not a graded read. Skip count 0, `test-skip-integrity` No findings.

**Two rows left as found, read on both sides by scratch probe.** No test file was edited; `raw/probe.mjs` imports the worktree's `src/`.
- A3 (b), the mate floor: 0 of 190 on `search()` (also the lane's line) and 0 of 190 on `searchWithoutBundle`.
- A4 (b), the reach: `chooseMove` 5.879 -> 6.868, +0.989 (also the lane's line); `chooseMoveWithoutBundle` 5.879 -> 6.716, +0.837, which is `ADR-0069` d12's figure.
