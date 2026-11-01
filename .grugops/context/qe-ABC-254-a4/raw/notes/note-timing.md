# ABC-254 A4 re-read: UNRESOLVED by the pre-registered D3 spread rule, again. kiwipete 1.120 and start 1.105 valid (both ≥ 1.10); position-6 (10.5 % / 15.4 %) and the in-check guard position-4 (5.9 % / 6.7 %) VOID after the one re-run

QE/E2E, task `qe-ABC-254-a4`. Read by the PREREG `…2e86c6f1`, sealed and committed in `9f6e64b1` before any timed run. Graded mechanically by `grade.mjs` (`raw/a4/grade.json`), with no hand grading.

Setup:
- Trees: `git archive` of base `09d1f675` and head `600d8de3`.
- node v26.12.1. One fresh process per search, running `chooseMove` at 4 000 ms on the real clock. nps = nodes / elapsedMs × 1000.
- Raw logs: `raw/a4/`. Scripts: `raw/qe-scripts/`.

## Main schedule (17:54:49–17:59:16Z; 5 rounds × kiwipete, position-6, start, position-4; base first in odd rounds)
13 of 20 pairs were clear on the first attempt. The other 7 were re-run once, at once, and 4 of those second attempts were still not clear; they are graded as the PREREG says. In the re-run, 9 of 15 pairs were clear on the first attempt, and 5 of the 6 second attempts were still not clear.

| board | base median | head median | head ÷ base | spread B / H | clear graded pairs | validity |
|---|---:|---:|---:|---|---|---|
| kiwipete | 770 043 | 875 232 | 1.137 | **9.0 %** / **13.1 %** | 4/5 | over 5 % → re-run |
| position-6 | 789 703 | 879 303 | 1.113 | 4.9 % / **8.1 %** | 4/5 | over 5 % → re-run |
| start | 600 581 | 663 647 | **1.105** | 3.6 % / 3.6 % | 4/5 | **valid** |
| position-4 (in check) | 910 219 | 996 747 | 1.095 | **5.3 %** / 1.8 % | 4/5 | over 5 % → re-run |

## Board re-run (17:59:37–18:05:25Z; kiwipete, position-6, position-4; the PREREG's one re-run, launched by `run.sh` from the grader's list)

| board | base median | head median | head ÷ base | spread B / H | clear graded pairs | validity |
|---|---:|---:|---:|---|---|---|
| kiwipete | 773 819 | 866 747 | **1.120** | 3.8 % / 3.0 % | 5/5 | **valid** |
| position-6 | 773 831 | 874 951 | 1.131 | **10.5 %** / **15.4 %** | 2/5 | **VOID** (over 5 % again) |
| position-4 (in check) | 892 299 | 990 091 | 1.110 | **5.9 %** / **6.7 %** | 3/5 | **VOID** (over 5 % again) |

## A4 grade, as pre-registered
- **(v1) values: held.**
  - At equal completed depth, every pair chose the same move and score:
    - kiwipete 20-80: −59 at depth 8, and −72 when head reached depth 9;
    - position-6 34-67, 73;
    - start 1-34, 9;
    - position-4 50-66, −482.
  - Every position was unchanged after the search. No STOP.
- **(v2) spread:** kiwipete valid (re-run), start valid (main). **position-6 VOID. position-4 VOID.**
- **(v3) thermal: held.** The median after-run Tctl over the graded runs was 77.8 °C (main) and 79.7 °C (re-run), both ≤ 85.
- **Label:** ALONE. The start precondition was met at 17:54:49Z and again at 17:59:37Z, both before the 18:39:28Z cap. `sharedAfterCap` never latched.
- **A4 = UNRESOLVED** (`grade.json`). One of the three main boards and the in-check guard are void, so the bar cannot be graded.
  - Both valid main boards clear 1.10: kiwipete 1.120 and start 1.105.
  - The bar still needs the third board (≥ 1.00) and the guard (≥ 0.97), and neither has a valid reading.

## INFO only: post hoc, not a grade (`raw/a4/posthoc-info.txt`)
- **Paired ratios, head ÷ base, per round** (graded attempt; `*` marks a pair that was not clear):
  - position-6, 10 rounds: 1.113 1.165 1.140 1.020* 1.070 | 1.240* 1.144 1.058* 1.128 1.052*. Range 1.020–1.240.
  - position-4, 10 rounds: 1.088 1.102 1.106 1.136* 1.065 | 1.088 1.127 1.084* 1.060* 1.116. Range 1.060–1.136.
- **Medians over the clear attempts only:**
  - position-6: 1.126 (4 pairs) and 1.136 (2 pairs);
  - position-4: 1.089 (4) and 1.116 (3);
  - every clear-only spread is ≤ 4.5 %.
- Across the 35 graded pairs on all four boards in both reads (20 main, 15 re-run), no single pair fell below 1.00 on any board, or below 0.97 on position-4. The voids are noise from foreign load, not a speed miss. This is the same pattern as qe-ABC-254 (`…09221f68`). It is reported, not graded.

## G6 / G5 (INFO from these runs; both stay MET from qe-ABC-254)
- **G6 depths:**
  - kiwipete: base 8 in every run, head 9 in most runs and 8 in the rest (head median 9 in main, 9 in the re-run);
  - position-6: 10 = 10;
  - start: 11 = 11;
  - position-4: 11 = 11.
  - Floor 6 held, and there is no depth-7 WARN.
- **G5:** the max wall over all 96 runs (54 main, 42 re-run, every attempt) was 4 001.6 ms, under the 5 000 ms ceiling.
