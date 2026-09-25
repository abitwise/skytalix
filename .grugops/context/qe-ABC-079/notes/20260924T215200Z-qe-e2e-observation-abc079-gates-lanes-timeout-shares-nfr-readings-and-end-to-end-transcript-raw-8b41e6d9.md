---
id: 20260924T215200Z-qe-e2e-observation-abc079-gates-lanes-timeout-shares-nfr-readings-and-end-to-end-transcript-raw-8b41e6d9
kind: observation
by: qe-e2e
at: 2026-09-24T21:52:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-004
  - NFR-005
  - NFR-008
  - N8-LANE
  - src/search.test.ts
  - src/quiescence.test.ts
  - src/engine.test.ts
  - src/cli.ts
supersedes:
---

# `ABC-079` at `6b7b2c8`: gates, every lane with each case's share of its timeout, NFR readings, and the product end to end

All runs used the clean tree (`git status --porcelain -- src` empty before and after). CPU is
`/usr/bin/time -p` user+sys over the whole process tree, which includes the vitest worker
threads. Every case's timeout is read from the runner (`task.timeout`), not guessed from the
source, by `raw-harness-share-reporter.mjs.txt`. Each figure is one run unless stated otherwise.
The machine is 8 cores, and load is the 1-min average.

## Gates (`raw-out-gates-summary.json.txt`), load 4.2

| gate | command | result |
|---|---|---|
| lint | `npx biome check .` | exit 0, `Checked 78 files in 94ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit 0, 1.06 s |
| build | `npx tsc --noEmit` (the build slot) | exit 0, 0.99 s |
| unit | `npx vitest run --dir src` | exit 0: **43 files / 1392 passed / 0 failed / 0 skipped**, 5.38 s wall, 21.25 s CPU |
| skip count | JSON reporter `numPendingTests + numTodoTests` | **0** (0 + 0) |
| integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, **`No findings.`** |

The four `ABC-079` files in the default lane took 515 / 1 360 / 661 / 353 ms of test time
(quiescence / search / search.qe / engine). The largest default-lane share is `A1`
position-4 d2 at 545 ms of 5 000.

## `SEARCH_DEEP=1 npx vitest run src/search.test.ts`: exit 0, **43 passed**, 110.7 s wall, 110.1 s CPU, load 5.5 → 5.1

| case | ms / timeout | share |
|---|---|---|
| **`A4` deep** (default d2 + broad d1 + broad d2) | **66 949 / 120 000** | **55.8%** |
| `A1` kiwipete d2 (quiescence leaf) | 11 081 / 30 000 | 36.9% |
| `A7` deep (memo warmed by `A4`) | 16 499 / 120 000 | 13.7% |
| `A1` kiwipete d3 bare | 3 473 / 30 000 | 11.6% |
| `A1` position-6 d3 bare | 2 998 / 30 000 | 10.0% |
| `A1` position-6 d2 | 2 922 / 30 000 | 9.7% |
| `A1` position-5 d3 bare | 1 848 / 30 000 | 6.2% |
| `A3` mate-in-2 vs mate-in-4, d7 | 1 379 / 30 000 | 4.6% |
| `A1` position-5 d2 | 1 152 / 30 000 | 3.8% |
| `A1` startpos d3 (quiescence) / position-4 d3 bare | 358 / 374 of 30 000 | 1.2% |
| `A1` startpos d3 bare / position-3 d3 bare / `A3` d5 | 185 / 54 / 60 of 30 000 | ≤ 0.6% |
| `A2` kiwipete d3 bare | 0 / 30 000 | 0% (reads `A1`'s memoised pair) |

Only `A4` deep is over 50%. Each default-timeout case sits under 10% of its 5 s.

**Readings run alone** (`-t`, the same file):

- `A4` deep: **65 207 ms (54.3%)** at load 9.8 and **60 242 ms (50.2%)** at load 5.8.
- **`A7` deep: 92 905 ms of 120 000 (77.4%)** at load 3.8–4.6. Run on its own it has no warm
  memo, so it pays the corpus work that `A4` normally pays
  (`raw-out-a4alone-*.json.txt`, `raw-out-a7alone.json.txt`).

## `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts`: exit 0, **37 passed**, 10.6 s wall, 11.2 s CPU, load 5.1

| case | ms / timeout | share |
|---|---|---|
| `A5` kiwipete d3 | 5 538 / 120 000 | 4.6% |
| `A5` position-6 d3 | 2 190 / 120 000 | 1.8% |
| `A4` position-6 d3 fingerprint | 393 / 30 000 | 1.3% |
| `A1` depth 3 | 529 / 60 000 | 0.9% |
| `A3` broad | 552 / 60 000 | 0.9% |
| `A5` kiwipete d2 / position-6 d2 | 158 / 167 of 120 000 | 0.1% |
| `A6` broad | 0 / 60 000 | 0% (memo) |

Console: `A1 depth 3: 0/24 with quiescence, 0/24 without`. The `A5` readings are
5878/49 = 119.96x, 10249/313 = 32.74x and 405945/9016 = 45.02x on kiwipete, and 297/47 =
6.32x, 9804/562 = 17.44x and 120239/14565 = 8.26x on position-6.

## `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`: exit 0, **33 passed**, 120.5 s wall, 120.9 s CPU, load 5.0 → 4.0

| case | ms / timeout | share |
|---|---|---|
| `A1` 30 positions at the default budget | 90 302 / 300 000 | 30.1% |
| `NFR-005` depth-in-budget | 6 007 / 60 000 | 10.0% |
| `A3` identity, six roots + children | 16 783 / 300 000 | 5.6% |
| `A5` 100 ms step | 725 / 30 000 | 2.4% |
| `A3` identity, endgame corpus | 2 035 / 120 000 | 1.7% |
| `A4` behavioural depth guard | 427 / 30 000 | 1.4% |
| `A7` 1 ms budget | 1 262 / 120 000 | 1.1% |
| `A3` depth-3 literal | 232 / 30 000 | 0.8% |

Console:

- `A1 worst case: startpos 3021 ms at completed depth 5; over 3 s: 28/30`.
- `NFR-005 kiwipete: completed depth 2, 229109 nodes, 3007 ms`.
- `NFR-005 position-6: completed depth 3, 191784 nodes, 3000 ms`.
- `A2 real clock: 79 ms at completed depth 1`. That case is the 50 ms budget, and its asserted
  bar is 100 ms, so it read **79% of its bar**.

## `NFR-004` / `NFR-005`: `chooseMove` at `DEFAULT_BUDGET_MS`, real clock, plain node, 3 rounds × 6 roots, load 4.3–4.7 (`raw-out-nfr.json.txt`)

| root | wall ms (3 rounds) | completed depth | nodes |
|---|---|---|---|
| startpos | 3002.4 / 3002.3 / 3002.4 | 6 / 6 / 6 | 733–754k |
| kiwipete | 3000.2 / 3001.9 / 3003.2 | **3 / 3 / 3** | 1.07–1.08M |
| position-3 | 3003.6 / 3000.8 / 3000.3 | 6 / 6 / 6 | 929–944k |
| position-4 | 3000.2 / 3000.5 / 3002.9 | 4 / 4 / 4 | 1.12–1.13M |
| position-5 | 3001.3 / 3002.2 / 3003.5 | 3 / 3 / 3 | 738–750k |
| position-6 | 3000.8 / 3001.4 / 2999.5 | **3 / 3 / 3** | 929–941k |

`NFR-004`'s 3 s clause holds, at +3.6 ms worst, and the 5 s hard ceiling is never approached.
`NFR-005`: kiwipete reaches **3**, and position-6 reaches **3** in plain node. Under the vitest
worker (`ENGINE_DEEP`) kiwipete reaches 2, because the node rate there is about 4.7x lower.
Reported, not ruled.

## `NFR-008`: REPORTED, NOT RULED (fence)

`npx vitest run --dir src`, 43 files / 1392 tests, four runs at load 4.2–9.8:

- **wall** 5.38 / 6.29 / 6.53 / 6.35 s, **median 6.32 s**;
- **CPU** 21.25 / 23.29 / 23.74 / 23.84 s, **median 23.5 s**.

`vitest.config.ts`'s header quotes the bar as ≤ 3 s wall AND ≤ 13 s CPU, and the Engineer's
note quotes 15 s. The catalog was not opened, so that is not reconciled here. Both readings are
over either figure, as they were on both arms at the Engineer's hop. `N8-LANE`: QE added 0
files and 0 rows.

## The product end to end (`raw-out-e2e-white.txt.txt`, `raw-out-e2e-black.txt.txt`)

`node src/cli.ts` ran on a pipe. Each scripted move is written only after `> ` appears, and the
reply time runs from that write to the next prompt, so it covers the engine's think plus the
render.

```
# node src/cli.ts            (load 4.06)            # node src/cli.ts --colour black
first prompt 75 ms                                   first prompt 3 066 ms (engine opens: 1. Nc3)
>>> e2e4   reply 3005.1 ms   1... e5                 >>> e7e5   reply 3000.9 ms   2. Nf3
>>> g1f3   reply 3004.1 ms   2... Nc6                >>> b8c6   reply 3003.5 ms   3. d4
>>> f1c4   reply 3003.5 ms   3... Nf6                >>> g8f6   reply 3002.3 ms   4. dxe5
>>> d2d3   reply 3001.6 ms   4... d5                 >>> f8c5   reply 3000.3 ms   5. exf6
>>> b1c3   reply 3003.5 ms   5... dxc4 (material -3) >>> d7d6   reply 3001.6 ms   6. fxg7 (material +5)
>>> c1e3   reply 3000.8 ms   6... Bb4                (stdin closed) -> "input ended", exit 0, 18.08 s
(stdin closed) -> "input ended", exit 0, 18.10 s
```

Eleven engine replies came in at 3000.3–3005.1 ms. There was no crash, nothing on stderr, and
both runs exited 0. The engine's replies look sane for this game: it took the loose bishop
(`dxc4` after QE's scripted `d3 … Nc3`), and as white it converted QE's blunders into +5
material.
