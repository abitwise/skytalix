# secnfr-census-1105 readings: **`NFR-008` MET, graded, on `main` `572edf13` with W1 in: H median 9.515 s [9.31, 9.63], max 9.64.** Below 9.6 s by 0.085 s, above 9.5 s by 0.015 s. **The probe's nine rows save −0.365 s [−0.49, −0.33], 8 / 8,** which reaches the −0.31 s skip bar

Security/NFR, task `secnfr-census-1105`. Method, rules and row list as sealed in `…b9038a14`, `…6315faad` and `…1d72a218`. Records: `raw/out/n8/`, `raw/out/census-H.txt`, `raw/out/timeline-H.txt`, `raw/out/probe/`, and the two probe diffs.

## The holds
| hold | start → end | lock | what |
|---|---|---:|---|
| session 1 | 12:00:17Z → 12:05:04Z | 4 min 47 s | not ALONE, ungraded (`…6315faad`) |
| the re-read | 12:11:40Z → 12:16:13Z | 4 min 33 s | **the grade** |
| smoke | 12:21:26Z → 12:21:35Z | 9 s | one P2 run, counts only |
| probe | 12:22:24Z → 12:26:51Z | 4 min 27 s | the estimate |

**About 14 min of lock against the brief's 50.** `…6315faad` said 5 min 7 s for session 1. That added the 20 s wait-clear twice; 4 min 47 s is right. No output file was empty in any session, and each stage was one hold.

## The graded read
- 9 rounds, round 0 discarded, **n = 8, k = 2.** Every one of the 27 runs exited 0 with its expected counts (B 71 / 2 684; H and H2 71 / 2 709; 0 skipped, 0 failed).
- **ALONE held.** 86 samples named no foreign vitest, no run was flagged, and `foreign_cpu_s` read a median of 3.31 s, max 5.39 s, against 15.21 s in session 1. load1 1.06–4.47, under the gate of 8. No power-supply entry (mains).

| arm | wall median | interval [x(2), x(7)] | max | CPU median |
|---|---:|---|---:|---:|
| **H (`572edf13`)** | **9.515 s** (prints 9.52) | **[9.31, 9.63]** | **9.64 s** | 32.45 s |
| H2 (twin) | 9.495 s | [9.38, 9.66] | 9.71 s | 32.54 s |
| B (`7117ce75`) | 9.405 s | [9.32, 9.64] | 9.69 s | 31.95 s |

- **Twin H2 − H:** CPU −0.040 s = 0.12 % of H's CPU (limit 0.487 s), sign 4 / 8, wall median +0.075 s, R 0.100 s. **ADMISSIBLE.**
- **State by ADR-0035 D1: MET, graded.**
- **H − B, what W1 cost on `main`:** wall +0.015 s [−0.120, +0.200], 4 / 8 positive; CPU +0.370 s [−0.340, +0.930], 6 / 8. The arm medians differ by +0.110 s. It agrees with QE's +0.020 s and cannot tell that from +0.10 s.

| line | H 9.515 s | margin |
|---|---|---|
| 10 s (`NFR-008` W) | MET | −0.485 s on the median, −0.37 s at the interval top |
| 9.6 s | below | −0.085 s |
| 9.5 s (`R-N8H-1`) | **above** | +0.015 s |

- **Spread.** This tree read 9.48 s at QE's graded read and 9.46 s as the probe's H arm, an hour apart at most on the last two. Runs fall into two groups near 9.3 s and 9.6 s, in every arm, so the interval is wide and the median can land in the gap. Why is `UNKNOWN - verify`.
- **Does it hold for `main` now?** `main` moved during the hop to `bffb23c4` (35 records commits). Over the lane inputs only `AGENTS.md` differs, a text trim. `src`, `tools`, `package.json`, `package-lock.json`, `vitest.config.ts` and `tsconfig.json` are unchanged. The trim was not timed. I expect no lane effect, because `AGENTS.md` is read by a byte pin; that is an inference.

## The census: where the lane's time goes (16 scored H and H2 runs)
- **vitest's own line:** duration 9.24 s, import 6.80 s, tests 6.54 s. The two summed phases run on two workers. `npm` and process start make up the rest of the 9.5 s wall.
- **The two workers' time, about 17.5 s in all, from the replayed timeline:**

| where | s | share |
|---|---:|---:|
| per-file start-up and import, 70 files at about 107 ms each | 7.46 | 43 % |
| the rows, in-thread | 6.58 | 38 % |
| `src/cli.test.ts`'s collect-time children | 3.46 | 20 % |

- **So rows are 38 % of the work.** That is the whole of what a row move can reach.
- **Largest files, in-thread:** `src/uci-session.test.ts` 1 583 ms; `src/cli.test.ts` 630; `src/search.null-move.test.ts` 561; `src/engine.test.ts` 429; `tools/grugops/qe-hop-integrity.test.ts` 377; `src/levels.test.ts` 268. Sum 6.36 s over 71 files.
- **`…25105dda`'s `UNKNOWN - verify` is answered: `src/cli.test.ts`'s worker is not a critical path now.** Its collect ends near 3.46 s and its slot at 4.16 s of 9.24 s. That worker then takes 33 more files from the shared queue, and both workers run almost to the end. The last file to end is a small one (`src/glyph-mode.nfr.test.ts` in 13 of 16 runs).
- **The note store:** 5 399 note files at `572edf13`, 5 417 at `bffb23c4`, **83 short of `T-QEHOP-GROWTH`'s 5 500.** The rate since 2026-11-04 20:37Z is about 10 an hour, so the re-arm is about 8–9 hours of busy work away. `qe-hop-integrity.test.ts` is a 378 ms slot.

## The probe (an estimate, never a grade)
One hold, 9 rounds, n = 8, k = 2, ALONE: 84 samples named no foreign vitest, nothing flagged. Every run exited 0 with its expected counts.

| arm | rows | in-thread | wall median [x(2), x(7)] | − H, wall (paired) | − H, CPU (paired) | return |
|---|---|---:|---|---|---|---:|
| H | none | | 9.46 s [9.37, 9.59] | | | |
| P1 | six rows outside `cli` | 490 ms | 9.26 s [9.18, 9.35] | −0.245 s [−0.350, −0.060], 8 / 8 | −0.870 s [−1.320, −0.190], 8 / 8 | 0.50 |
| **P2** | **all nine** | **750 ms** | 9.05 s [8.95, 9.22] | **−0.365 s [−0.490, −0.330], 8 / 8** | −0.800 s [−1.270, −0.700], 8 / 8 | **0.49** |

- **The `cli` rows do not separate.** P2 − P1 paired is −0.185 s [−0.340, −0.020], 7 / 8, a return of 0.71 on 260 ms. The difference of the two arms' H-paired medians is −0.12 s, a return of 0.46. The plan's prediction was 0.5, against 1.0 at the 2026-11-04 probe; this read does not settle it, as the plan said it might not. The structure above and the whole list's 0.49 favour 0.5.
- **The 0.45 of `…25105dda` holds up:** the whole list returned 0.49.

## Foreign load
- **Another project's vitest (working directory `grugops`), outside this repository's lock, ran 12:00:59Z to 12:04:56Z and briefly at 12:00:17Z,** by many short-lived processes, about 1.5 cores above the lane's own use. It cost session 1 its grade. This is `QE-282-k`'s pattern again. It was read and not touched.
- `se-ABC-303`'s vitest was seen only between my holds, when that hop held the lock. It is not foreign load.
- The re-read and the probe saw none.

## Slips
- I sent one `pkill -f` at a pattern naming my own dry-run path, after a false `ps` count. It matched only my own shell, which exited 144. No other process was touched, and the sampler it was aimed at had already stopped.
- The harness dry run used a stub `npm` and ran no test, so it was outside the lock.
