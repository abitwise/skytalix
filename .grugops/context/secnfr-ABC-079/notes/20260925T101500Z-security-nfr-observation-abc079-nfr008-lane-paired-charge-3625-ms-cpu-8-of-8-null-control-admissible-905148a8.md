---
id: 20260925T101500Z-security-nfr-observation-abc079-nfr008-lane-paired-charge-3625-ms-cpu-8-of-8-null-control-admissible-905148a8
kind: observation
by: security-nfr
at: 2026-09-25T10:15:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - NFR-008
  - N8-LANE
  - ADR-0019
  - ADR-0014
  - src/search.test.ts
  - src/quiescence.test.ts
  - src/search.qe.test.ts
  - src/engine.test.ts
supersedes:
---

# `NFR-008` at the delivery base: `ABC-079` charges **+3.625 s CPU** (paired median, 8 of 8 rounds positive, 3.36–3.71 s) to the default lane. The lane reads 22.29 s CPU with the ticket and **18.61 s without it**, against the 15 s level. The null control is admissible.

**Not a stamp.** A hand-authored `observation`.

## The arms (built by `raw-harness-build-arms.mjs.txt` with `git archive`, outside the repository; `node_modules` symlinked)

| arm | tree | lane |
|---|---|---|
| **A** | `cb5540d` as delivered | 43 files / 1392 tests |
| **N** | `cb5540d`, a byte-identical copy (`diff -rq` clean): the null control | 43 / 1392 |
| **B** | `cb5540d` with `ABC-079`'s seven `src` files restored to `4f0ef01` (`quiescence.ts` and `quiescence.test.ts` absent) | 42 / 1361 |

B is the **delivery base without this ticket**. It carries everything else the integration branch
holds (`ABC-034`, `045`, `046`, `075`, `107`, `118`, `120`), so A − B is `ABC-079`'s charge and
nothing else's. `diff -rq A/src B/src` lists exactly the seven files. Nothing outside those
seven files imports `quiescence.ts` or the two test doors, and `vitest.config.ts`,
`package.json`, `biome.json` and `tsconfig.json` are identical between `4f0ef01` and `cb5540d`.

## Protocol (NFR-008's row, the ADR-0019 decision 3 shape; `raw-harness-lane.mjs.txt`)

- The lane is contained: `npx vitest run --dir src`, with `/usr/bin/time -p`. CPU is user + sys.
- Each run is one fresh OS process.
- The order of A, N and B is rotated every round. There were 9 rounds, and round 0 was discarded,
  so **n = 8**.
- Every run asserted exit 0 and its own file and test counts. **Harness errors: 0 of 27.**

## Result (`raw-out-lane-summary.txt`, rows in `raw-out-lane.tsv.txt`)

```
A  cb5540d            median CPU 22.285 s (21.93-22.47)   median wall 5.340 s (5.11-5.65)
N  identity copy      median CPU 22.300 s (21.50-23.38)   median wall 5.335 s (5.11-5.72)
B  base w/o ABC-079   median CPU 18.605 s (18.41-18.88)   median wall 4.885 s (4.70-4.98)

NULL CONTROL N-A  CPU per round  -0.51 0.13 0.31 -0.29 0.13 0.19 0.09 0.91
                  median +0.130 s = 0.58% of A, sign 6/8     -> <= 1.5%: ADMISSIBLE
CHARGE A-B        CPU per round   3.48 3.62 3.36 3.70 3.71 3.63 3.64 3.59
                  median +3.625 s = 16.3% of A, sign 8/8, spread 0.35 s
                  WALL median +0.480 s (0.20-0.83)
```

- **Load.** The 1-min load before each run was min 2.34, median 4.43, max 13.30. It rose in
  rounds 6–8 as other sessions started.
  - The charge did not move with load: rounds 1–5 at load 2.3–4.7 read 3.36–3.71 s, and rounds 6–8
    at load 8.6–13.3 read 3.59–3.64 s.
  - The absolute medians carry some load inflation. The paired delta is the robust figure.
- **Sign test.** The null control's sign reads 6 of 8, which is not a perfect coin, but its
  magnitude (0.58%) is a quarter of the ADR-0019 admissibility bound. The charge's sign is 8 of 8
  with a spread (0.35 s) roughly ten times smaller than its size.

## Net of the per-file floor

`ABC-079` adds one test file, `src/quiescence.test.ts`. The catalogue's per-file floor is
**160 ms** (the `NFR-008` floor account, owned by Architect/Design, and not charged to a ticket's
content). **Net content charge ≈ 3.625 − 0.160 = 3.465 s CPU, against `N8-LANE`'s 650 ms: 5.3x.**

## Where it lands (test time, not CPU: an indicator only; `raw-out-lane-files.json.txt`, 3 alternating rounds per arm)

| file | A ms | B ms | Δ |
|---|---|---|---|
| `src/search.test.ts` | 1 541 | 343 | **+1 198** |
| `src/quiescence.test.ts` (new) | 656 | — | **+656** |
| `src/search.qe.test.ts` | 647 | 316 | **+331** |
| `src/engine.test.ts` | 401 | 942 | −541 (the re-fixture made it cheaper) |

The largest share is the EXISTING search tests. They now pay a quiescence leaf at every leaf they
reach. The engineer said the same at `ead14eb` ("the cost is the existing search/engine tests, not
the new file"). The rest of the CPU delta is vitest transform, import and worker contention, which
test time does not see.

## Clause states at this reading (reported here, ruled in the decision note)

- `NFR-008` CPU (≤ 15 s):
  - **A reads 22.29 s: BREACHED by 7.29 s.**
  - **B reads 18.61 s: BREACHED by 3.61 s before this ticket arrived.**
- `NFR-008` WALL (≤ 3 s): A 5.34 s, B 4.89 s. **Reported, not ruled**, per ADR-0019 decision 2
  (`ABC-111` owns the warm/cold protocol).
- `N8-LANE` (≤ 650 ms): about 3 465 ms net. Under ADR-0014 decision 4, `N8-LANE MET` could never
  have meant "the lane is within budget" here anyway.
