---
id: 20261011T111107Z-software-engineer-observation-abc147-a1-five-bucket-readings-7769faa0
kind: observation
by: software-engineer
at: 2026-10-11T11:11:07Z
verified_by:
confidence: medium
refs:
  - ABC-147
  - NFR-008
  - .grugops/context/ticket-to-pr-ABC-147/probe/METHOD.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/a147-lane.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/analyze.mjs
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-lane.tsv.txt
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a1-summary.txt
supersedes:
---

# `ABC-147` `A1`: where `npm test`'s CPU goes. Production code under `src/` is **42.9 %** of sampled CPU, and 42.6 % of it is inside vitest workers

This note is hand-authored and unsealed. The raw readings are in `probe/raw/` (`a1-lane.tsv.txt` lists every run,
including the unused ones).

## Setting

- **Tree:** wave tip `63ac790f`, in a worktree with `node_modules` symlinked.
- **Workers:** **uncapped** (`pool: "threads"`, `isolate` true, no `maxWorkers` → 7). `ABC-144`'s cap has
  not merged.
- **Machine:** Apple M3, Node v26.11.0, vitest 3.2.7. Two QE hops were running at the same time. The
  power source moved from battery to AC at 11:01Z.
- **Method:** as declared in `METHOD.md` before the first graded run. Profiled runs (P) use
  `NODE_OPTIONS=--cpu-prof` in every process and thread. Unprofiled runs (U) are interleaved with them.

## Runs used (load1 and `thermalpressurelevel` before each run)

| run | load1 | thermal | user+sys s | files | tests |
|---|---|---|---|---|---|
| 6 P | 4.76 | 0 | 32.43 | 54 | 1715 |
| 13 P | 5.54 | 0 | 32.30 | 54 | 1715 |
| 14 P | 5.48 | 0 | 32.43 | 54 | 1715 |
| 15 P | 5.76 | 0 | 33.85 | 54 | 1715 |
| 16 P | 6.00 | 0 | 33.10 | 54 | 1715 |
| 17 P | 5.44 | **2** | 42.22 | 54 | 1715 |
| 7 U | 7.60 | 0 | 28.10 | 54 | 1715 |
| 8 U | 7.96 | 0 | 27.51 | 54 | 1715 |
| 10 U | 5.74 | 1 | 29.10 | 54 | 1715 |
| 12 U | 5.58 | 0 | 26.88 | 54 | 1715 |
| 13 U | 5.29 | 0 | 27.84 | 54 | 1715 |
| 14 U | 5.99 | 0 | 28.81 | 54 | 1715 |
| 15 U | 5.85 | 0 | 26.89 | 54 | 1715 |
| 16 U | 5.80 | 1 | 30.78 | 54 | 1715 |
| 17 U | 5.72 | 2 | 28.63 | 54 | 1715 |

- **Every completed run had exit 0, 0 failed, and 54 files / 1715 tests.** That is the commit's own
  `npm test` count; the unprofiled runs read the same. Note that `ABC-144`'s 53 / 1680 was read at
  `af6ada41`.
- **Recorded and not used (24 runs):**
  - rounds 0–5, all 12 runs, at load1 11.8–23.5 (round 0 is also the warm-up);
  - 6 U (8.18), 8 P (8.51), 9 U (10.12), 9 P (9.24), 11 U (10.64), 11 P (10.80);
  - 7 P, 10 P and 12 P, which hit the 60 s bound (exit 124). 12 P hung at load1 5.79.
  - See the caveats note `…144c6b5d`.

## Buckets: share of sampled busy CPU, n = 6, median (min–max)

| bucket | median % | min–max % |
|---|---|---|
| (i) production, `src/` and not `*.test.ts` | **42.93** | 37.68–44.19 |
| (ii) test files (outside-`src/` code within it: 0.02) | 1.43 | 1.21–1.68 |
| (iii) vitest / vite / tinypool / chai / npm runtime and transform | 12.15 | 11.02–14.13 |
| (iv) Node internals and GC | 42.08 | 41.10–44.21 |
| (v) unattributed (`(program)`, `(root)`, orphan natives) | 1.82 | 1.56–2.30 |
| **sum of medians** | **100.41** | (bar: 100 ± 2) |

- **(i-w)**, production inside vitest worker threads: **42.62 (37.27–43.91)**.
- Production in child `node` processes spawned by tests: 0.29 (0.24–0.41). In the vitest main
  process: 0.
- **Where the CPU ran:**
  - worker threads 89.92 % (88.69–90.18);
  - vitest main 3.34 % (2.36–3.49);
  - child processes 6.97 % (6.63–7.87).
- **Bucket (i)'s top five files**, median % of sampled busy:
  1. `src/moves.ts` 19.62 (16.97–21.45)
  2. `src/legal.ts` 7.06 (5.57–7.60)
  3. `src/position.ts` 5.51 (4.47–6.17)
  4. `src/apply.ts` 2.29 (2.11–2.56)
  5. `src/evaluate.ts` 2.24 (1.95–2.76)
- **Test files by (i-w)**, median rank:
  1. `src/engine.test.ts`, 9.83 %
  2. `src/search.test.ts`, 4.69 %
  3. `src/transposition.test.ts`, 3.34 %
  - Ranks 4.5 (tied): `src/perft.test.ts` and `src/search.ordering.test.ts`.
  - **The top two go to `A2`.**
- **Every run profiled every worker:** 61 worker-thread profiles in every run. In 7–8 of them no single
  test file was named, and they held 0 % of (i).
- **Lane CPU and coverage:**
  - unprofiled lane CPU 28.10 s (26.88–30.78), n = 9;
  - the profiler adds ~16.6 % CPU (P median 32.77 s);
  - sampled busy ÷ user+sys is 0.96 (0.93–1.37). The 1.37 is run 17 at thermal pressure 2, where
    samples count descheduled time.
- **Bucket (iv) is large** (42 %): module loading per isolated file, plus built-ins billed to `node:`
  frames. Test note 3 holds: **bucket (iii) is not read as the overhead**.
