---
id: 20261106T225544Z-qe-e2e-observation-2f762abf
kind: observation
by: qe-e2e
at: 2026-11-06T22:55:44Z
verified_by: 
confidence: high on the totals, the exclusions and the arithmetic, read by script from the runs' own files; medium that the matched excess lies in the gaps; low on the split of fixed, per-term and common; the lanes are inferred, the class rows rest on them; nothing was run
refs:
  - qe-ABC-291
  - qe-ABC-291-where
  - ABC-291
  - ABC-290
  - ABC-292
  - ABC-293
  - NFR-008
  - R-N8H-3
  - ADR-0075
  - 70d931ab
  - 780d9021
  - qe-ABC-291/20261106T222838Z-qe-e2e-observation-024bbd63
  - qe-ABC-291/20261106T222838Z-qe-e2e-decision-5826dcf6
  - arch-ABC-291-n8/20261106T224309Z-architect-design-observation-64648b53
  - arch-ABC-291-n8/20261106T224309Z-architect-design-decision-61a939d3
  - orch-2026-10-30a/20261106T223014Z-orchestrator-decision-a9e7118e
supersedes: 
seal: sha256:99a5ec2e9de2a65c452d4c50f4c9434e8be37d12f37ef8971c89da8ef93c22ef
---

# qe-ABC-291-where: **the wall the rows do not explain lies in the gaps before each file's first row, +0.088 s of +0.133 s, and H2 matches H there. It is neither the new rows nor test code. Fixed versus per-term is only partly resolvable: +0.02 to +0.03 s is fixed, +0.01 to +0.06 s can be tied to the production change, and at least +0.05 s sits in files with no changed line, cause not readable here. +0.16 s stands as a median, not as a sharp figure. 11 to 18 % stands only if the centre is taken as true**

QE/E2E, task `qe-ABC-291`, brief `qe-ABC-291-where`, on `…024bbd63`'s read. **No test, build or engine ran.** No verdict, no state change, no merge call. `NFR-008` stays as `…024bbd63` read it. Sources: `<scratch>/qe291/out/a1/n8/runs`, 8 scored rounds, 24 runs. Each arm's source was read only to class files; the split itself is from the runs. Raw: `raw/out/where/`, scripts `raw/scripts/where/`.

## What these files can and cannot split
- **Per file, the JSON holds first-row start, last-row end and row durations. It holds no per-file collect, import or setup.** Those are one line per run in `out-*.txt`. vitest's `import` is the sum of file `collectDuration`, so there is no separate collect figure.
- **So the per-file split is the gap:** first row less the end of the last row before it on that lane. It holds the previous file's teardown, worker start, import, collect and hooks, undivided.
- **CPU is per run only,** `user` and `sys`. No file or phase split of CPU exists in these files.
- **Lanes are inferred.** `census`'s `timeline.cjs` rule put `src/cli.test.ts`'s start on the wrong lane in 12 of 24 runs, with 54 overlaps. I replaced it with a least-cost assignment that forbids overlap (`lanes2.py`): 0 overlaps, least gap 69.8 ms, `src/cli.test.ts`'s gap 3.44 to 3.75 s in all 24. Totals do not depend on it: 2 × span = gaps + slots + lane end difference held to 0.0 ms in every run. Only the class rows do.

## The split
ms of wall, the mean paired change against B over 8 rounds. Lane parts are half the worker-ms change, which is exact here: the lane end difference moved 0 (se 10). "both" is the per-round mean of the two arms; se is over rounds.

| part | B level | H | H2 | both | se |
|---|---:|---:|---:|---:|---:|
| **wall** | 9 130 | **+175** | **+90** | **+133** | 56 |
| npm, start and exit, outside vitest's Duration | 275 | +1 | −5 | −2 | 8 |
| Duration past the last row | −5 | +8 | 0 | +4 | 2 |
| lane end difference | 41 worker | −6 | +6 | 0 | 10 |
| **slots: first row to last row of each file** | 5 789 worker | +60 | +26 | **+43** | 31 |
| of which added rows | 0 | +18 | +19 | +18 | 0.5 |
| of which shared rows, 27 files reaching changed production | 4 218 | +22 | −4 | +9 | 28 |
| of which `src/cli.test.ts` | 433 | +6 | −6 | 0 | 4 |
| of which 42 files with no changed line | 1 118 | +14 | +16 | +15 | 4 |
| **gaps** | 11 783 worker | **+112** | **+64** | **+88** | 39 |
| of which `src/cli.test.ts` | 3 593 | +16 | +3 | +10 | 13 |
| of which 27 files reaching changed production | 3 551 | +49 | +35 | +42 | 17 |
| of which `tools/tune/tune.test.ts` | 88 | +2 | +2 | +2 | 2 |
| of which 42 files with no changed line | 4 543 | +45 | +22 | +34 | 22 |

**The gaps by vitest's phase line:**

| phase | B, worker ms | H | H2 | both | se |
|---|---:|---:|---:|---:|---:|
| import (= collect), `src/cli.test.ts`'s children inside it | 6 735 | +45 | +14 | +29 | 30 |
| gaps outside any named phase | 4 987 | +67 | +50 | +58 | 36 |
| transform | 0 | 0 | 0 | 0 | |
| setup | 0 | 0 | 0 | 0 | |
| environment | 5 | 0 | 0 | 0 | |

The 42 files read `sha256`-equal at B and H over their whole static import closure, the test file included. `src/history-pane.nfr.test.ts` left that class: its A11 row imports `book.ts` at run time, which reaches changed production, and it is the largest single row there, +14 worker ms. Per-file figures: `final.txt`, `groups.txt`, `control.txt`, `lanes.tsv`.

## Where the wall lies, and whether H2 matches
- **In the gaps. Not outside vitest** (−2 ms), not past the last row (+4 ms), not in lane imbalance (0), not in transform, setup or environment (0).
- **H2 matches H in the gaps, by median:** +150 and +143 worker ms, positive 7 of 8 and 6 of 8. By mean H2 is about half, +225 and +127, inside the twin's own noise (twin sd 210, se 74).
- **H2 does not match H in the slots:** median +137 and −33, positive 6 of 8 and 3 of 8. H's lead over H2 is noise on this evidence. Its parts sit in both gaps and slots, and the twin's wall sd is 142 ms.
- **Inside the gaps the larger part is the unnamed one,** +58 against +29 for import, where project source loads. The two se overlap, so that ordering is weak. The unnamed part is where H and H2 agree best.
- **`src/uci-session.test.ts`'s +83 ms has a twin after all:** its slot reads +71 on H and +72 on H2 by median, +38 and +46 by mean, se 49, positive 5 of 8 each. Not separated from zero.

## Fixed, per-term, or not resolvable
**Partly resolvable, and not to one cause.**
1. **Fixed, new rows and test code: +0.02 to +0.03 s. High confidence that it is not the bulk.** Added rows +18 ms, se 0.5. `src/evaluate.pawns.test.ts`, the one large test change, reads only +9 worker ms of gap. The most that changed test text could hold is about +14 ms: the per-file gap excess of the 12 reaching files with a changed test file over the 14 with the same one.
2. **Per-term, from the production change: +0.01 to +0.06 s. Low confidence.** Files reaching changed production gain +3.1 ms of gap each, files that do not gain +1.6: a difference of +1.5 ms per file, se 1.6, positive 3 of 8. Taken less each file's own mean it is smaller, +0.5 ms, se 1.3. Over 27 files that is +7 to +20 ms, not separated from zero. Across B's 70 files gap rises 0.166 ms per KiB of statically loaded source (r 0.59, a correlation), and H adds 7 to 12 KiB to most of these files, which predicts +27 ms. The high end takes every gap in those files and `src/cli.test.ts`, +52 ms, and shared rows there, +9 ms, se 28. The tree's share of those rows is not separable.
3. **Not resolvable from these files: at least +0.05 s.** +34 ms of gap and +15 ms of slot, +49 ms in all, se 24, in 42 files whose every statically loaded line is the same in B and H. That is 37 % of the wall figure. The same rise of about +2 ms of gap per file shows in every cell of file class by previous-file class, so it looks common to all 71 files, and counting it in the changed files too makes it about +0.07 s. Parts 2 and 3 share those gaps, so their ranges overlap and do not add.
   - **The slot part is the firmer:** +28 and +33 worker ms, positive 7 of 8 for the two arms together, spread thinly over about 1 500 rows.
   - **No line in those files can cause it directly.** It is read noise, B having run fast, or an indirect effect of H on files running beside it. These files cannot tell those apart.
   - **Teardown of a heavier previous file does not explain it:** a changed-production predecessor adds +0.7 ms to the next gap, se 1.4, with each gap taken less that file's own mean (`cells.txt`). Raw means looked larger, and that was which files landed where.

**So a later term's cost is not readable from this one.** The record supports a load cost of +0.01 to +0.06 s for about 10 KiB of source, comments included, plus that term's own rows. Whether the third part returns is `UNKNOWN - verify`. The rows at +0.155 s in `…61a939d3`'s term table are not shown, and not excluded.

**CPU:** both arms +0.671 s, se 0.173, of which user +0.654 and sys +0.018. Rows hold about +0.085. So the rise outside rows is user time, not kernel time, which fits compile, JIT and GC and does not show them. The change is 2.6 CPU per lane second against 1.77 at level, not separated at these se. Any file or phase split is not resolvable.

## The Architect's figures
- **+0.16 s: stands as a median, and it is the high side of what the read supports.** H +0.155, H2 +0.180, per-round median +0.165, but per-round mean **+0.133**, se 0.056, t 2.36 on 7 degrees of freedom, 95 % interval −0.000 to +0.265. Carry it as **about +0.13 to +0.165 s**. "Give or take 0.06 s" is a one-sigma figure, and a low one: the read's own bootstrap sd of a median of 8 is 0.063 to 0.085.
- **"The cost is real": firm on CPU** (t 3.9, 8 of 8 and 7 of 8). On wall alone it sits at the edge of a 95 % interval. He had the sign counts right.
- **11 to 18 %: the arithmetic stands, the reading does not.** It takes +0.155 to +0.175 s as the true value. Resampling this read's own pairs gives the same answer, 0.16 to 0.18, under the same assumption. With the centre's own uncertainty, sigma 0.082, the chance of a re-read landing at or under +0.10 s is **about 0.18 to 0.34** across centres +0.175 to +0.133. A rough figure from 8 rounds, and still more likely a miss than a pass. I propose no re-read; `…a9e7118e` stands.
- **His wall table:** added rows +0.017 stands (+0.018). The return of 0.5 stands exactly. Shared rows +0.03 to +0.05 reads high: paired slots less added rows give +0.042 on H, +0.007 on H2, +0.024 both, and over half of that is in unchanged files. "Everything else +0.09 to +0.13" reads +0.064 to +0.112, +0.088 both.
- **His build candidates:** larger production files in short-lived workers fit part 2 at most. They cannot reach part 3, by construction. `R-N8H-3`'s per-file figure holds: 117 worker ms of gap per file outside `src/cli.test.ts`, about 0.058 s of wall.

## Read conditions and limits
- **The arms share one vitest result cache.** `node_modules` is a link, so all three read and write one `results.json`, and each run's dispatch order comes from the run before it, whichever arm that was. The lane end difference moved 0, so I read no cost from it. It is a condition of this read, not a fault in it, and voids nothing.
- **One B arm.** Same-code twin reads exist for H only, so the third part has no B-side control.
- **n = 8,** and I looked at many classes. Nothing here is a bar or a grade.
- **What would resolve part 3 needs a run,** so none was done: a second B arm in the rotation, and a reporter printing each file's `collectDuration` and `prepareDuration`. Whether it is worth a hold is the Orchestrator's.
