# qe-ABC-298 stage B, hold 1: SG3 by S2 under `ADR-0055` D3-V2 at `ADR-0077` d7's bar reads **NOT MET (bar)**. Head ÷ base is 0.9627 on kiwipete, 0.9738 on position-6 (its one re-run) and 0.9595 on start. Every board is valid, and V3 is slower on all three. Holds 2 (`G6`) and 3 (`NFR-008`) were not run: NOT MET ends the window (PREREG `…c981798f` § 5)

QE, task `qe-ABC-298`, stage B, on `grugops/qe-ABC-298` at `dd8e2404`. Run on PREREG `…c981798f` (sealed at `19d0ba57`) as sealed, after the Orchestrator's go line (brief § Stage B — go, 2026-11-09T08:13:08Z: the owner's word "i think all is quiet now", and his `ps` check). Raw files are under `raw/out/stage-b/`. Paths are written as `<scratch>/<home>/<repo>` and `<worktree>`.

## § 1 checks, outside the lock (`raw/out/stage-b/checks.txt`)
- **Scripts:** all 22 sha256 equal the PREREG § 8 table. `raw/scripts/` is unchanged since `19d0ba57`.
- **`main`:** `bfdff004`, `src/` `bba42fb7`.
- **B:** merge-base `2893bdde`, `src/` `bba42fb7`.
- **H:** `dd8e2404`, `src/` `b8d055c9`, which is `400c1b9e`'s tree.
- **B and H outside `src/`:** `.grugops/` only.
- **F8:** `evaluate*.ts`, `quiescence.ts` and `see.ts` are unchanged between the two trees (0 files).
- **Node:** `node` v26.12.1, one binary.
- **The trees** are built as § 1 says. `diff -r` of `trees/H/src` against the worktree's `src/` is empty, and `diff -r --no-dereference` of `arms/H` against `arms/H2` is empty.
- **INFO, not a condition:** `origin/main` (`71b2beb4`) is a stale push of 2026-11-05. It is an ancestor of `main`, 352 commits behind.

**All checks hold.**

## Host before the hold (08:15:03Z), by class and count only
- load1 0.41, Tctl 44 °C, 24 cores. The lock was free, with 0 `flock` processes.
- One monitoring tool. 0 `cutechess-cli`.
- **One idle containerised node process,** about 34 h old, 0 CPU ticks over 3 s. Its arguments name vitest, but not as a `/vitest` path, so no sealed detector counts it (`pgrep -f '[/]vitest'` matches nothing). INFO.
- No command line was written down.

## Hold 1: SG3
- **The hold:** `flock <scratch>/<home>/<repo>/host-test.lock bash session.sh sg3 …`. The lock was taken at once, at 08:15:35Z, and released at 08:18:43Z: **3 min 08 s**.
- **The start precondition** cleared at its first poll (08:15:38Z, load1 0.66, Tctl 42.25 °C, no hot foreign process). No gate reached its cap, and `shared` is false throughout.
- **The main schedule:** 15 attempts and 15 admitted, 0 discarded, in 123.1 s, with 0.36 s of gate waits.
- **`grade.mjs` owed a re-run on position-6:** H's spread was 5.508 % against 5 %. `run.sh` launched it in the same hold, under a fresh 15 min cap. It made 5 attempts, all 5 admitted, in 41.1 s.
- **Exits:** `s2.mjs` exited 0 both times, and there was no STOP-identity (exit 4).
- **Order:** `BH HB BH HB BH` on every board, as V2 item 2 sets it.

| board | reading | B median nps | H median nps | **H ÷ B (unrounded)** | paired-ratio median | spread B / H | agree | counted / attempts |
|---|---|---|---|---|---|---|---|---|
| kiwipete | main | 682 395 | 656 966 | **0.962736** | 0.969375 | 2.49 % / 3.22 % | yes | 5 / 5 |
| position-6 | main (superseded) | 622 866 | 592 914 | 0.951913 | 0.943003 | 3.08 % / **5.51 %** | yes | 5 / 5 |
| position-6 | **re-run (graded)** | 612 370 | 596 349 | **0.973838** | 0.966974 | 3.45 % / 1.95 % | yes | 5 / 5 |
| start | main | 518 019 | 497 033 | **0.959488** | 0.959488 | 1.48 % / 2.04 % | yes | 5 / 5 |

- **The paired ratios**, H ÷ B per pair:
  - kiwipete 0.9724, 0.9694, 0.9407, 0.9734, 0.9627;
  - position-6 re-run 0.9670, 0.9895, 0.9574, 0.9757, 0.9546;
  - start 0.9461, 0.9595, 0.9534, 0.9700, 0.9619.
  
  **Not one of the 15 graded pairs reads ≥ 1.00.** The superseded position-6 reading's pairs are all < 1.00 too.
- **(v1) values: held.** No pair at equal completed depth differed in move or score.
  - On position-6 and start, both builds reach depth 12 in every run, with one move and one score.
  - On kiwipete, B reached depth 10 in 4 of 5 runs, scoring −155. H reached depth 9 in all 5, scoring −128. That equals B's own depth-9 run, which is consistent with H's lower rate.
  - Every run's position was pure on return.
- **Nodes per run** are in `analysis-*.jsonl` and `s2*.jsonl`. Every run's wall was at most 4 001.3 ms.
- **Admission, foreign load:**
  - foreign cores over the 40 runs: min 0.283, median 0.431, max 0.796. All are ≤ 0.8, so every pair was admitted.
  - The max, 0.796 on kiwipete, sits near the line, and it was admitted by the sealed rule.
  - The one foreign process above 20 % in any run window was the monitoring tool, at 21–35 % of one core, in 26 of 40 run windows. A Claude session appeared 3 times, in `busyWithChildren` only.
  - 0 foreign vitest and 0 `cutechess-cli` at every pair.
- **Thermal:** after-run Tctl ran from 68.4 to 76.0 °C. The per-board medians were 74.44, 73.63 and 74.44 °C, all below 85, so there was no thermal STOP.
- **`grade.json`, mechanical:**
  - `sg3: "NOT-MET (bar)"`, `verdict: "NOT-MET (F4)"`;
  - `owed: []`, `shared: false`;
  - each board `status: "valid"`.

## Grade
**SG3: NOT MET (F4).** The bar is ≥ 1.03 on two boards and ≥ 1.00 on the third. The best board reads 0.9738. Every board is valid: in spread (position-6 after its one re-run), in agreement, in count, in admission, unshared and below 85 °C. So this is a reading, not a void. No re-read is owed or allowed, since a bar miss is not a void (PREREG § 2, d7). No term was waived or moved.

## Holds 2 and 3
**Not run.** PREREG § 5: "NOT MET ends the window. `G6` and `NFR-008` cannot change F4, so they are not run." The `g6/` links and the `arms/` B, H and H2 were built and stay unused. No `G6` figure and no paired `NFR-008` figure exists for this build.

## Lock
One hold, 08:15:35Z–08:18:43Z, 3 min 08 s, under the 1 h line. Nothing else ran in it. `session.sh`'s snapshots (`ps.txt`, by class and count, lifetime %CPU above 5):
- **At hold start:** one monitoring tool and one containerised node thread-named process. The start precondition's 3 s sample found no foreign process above 50 %.
- **After the hold:** the monitoring tool alone.
- **Both snapshots:** the vitest-name count reads 1, the idle containerised process above, and `cutechess-cli` reads 0.
