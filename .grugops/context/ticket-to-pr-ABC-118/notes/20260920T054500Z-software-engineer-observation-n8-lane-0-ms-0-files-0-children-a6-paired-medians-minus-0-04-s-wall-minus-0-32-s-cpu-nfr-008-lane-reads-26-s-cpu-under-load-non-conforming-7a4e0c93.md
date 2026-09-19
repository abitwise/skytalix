---
id: 20260920T054500Z-software-engineer-observation-n8-lane-0-ms-0-files-0-children-a6-paired-medians-minus-0-04-s-wall-minus-0-32-s-cpu-nfr-008-lane-reads-26-s-cpu-under-load-non-conforming-7a4e0c93
kind: observation
by: software-engineer
at: 2026-09-20T05:45:00Z
verified_by:
confidence: medium
refs:
  - ABC-118
  - NFR-008
  - ABC-108
  - ABC-111
  - tools/grugops/lane-inventory.js
supersedes:
---

# `ABC-118` `A6` / `N8-LANE` / `N8-SPAWN` / `NFR-008` — what the lane paid (nothing) and what it reads (over, under load)

**Hand-authored `observation`, no stamp. Confidence `medium` on the absolute numbers** because
every run was taken at load 10–22 on a box with sibling hops live; the deltas are what this note
is for, and those were paired and interleaved.

## `N8-LANE`: 0 ms, 0 files, 0 rows

The delivered diff adds **no file under `src/`** and **no row to any test file**. The lane's
collected set is 42 before and 42 after. The instrument runs in its own process
(0.33 s wall / 0.40 s CPU, load 11.0 — the ticket's cut read 0.32–0.59 s wall / ~0.45 s CPU)
and charges `NFR-008` nothing. The subtask's ≤ 650 ms line is met at **0 ms**; the ticket's
`NFR / security` says no `N8-LANE` line is CLAIMED, and none is — `ABC-108` owns the total.

## `N8-SPAWN`: 0 added children in `src/cli.test.ts`; the instrument's own children named

`src/cli.test.ts` is untouched — 0 added children, `T1`/`T2` not fired. The instrument itself
spawns three children **outside the lane**: `git rev-parse`, `git ls-files`, and
`node node_modules/vitest/vitest.mjs list --filesOnly`. The ticket asks the placement that spawns
to say so; said.

## `A6`: 5 interleaved paired runs, base `129f53d` (a `git archive`) vs tip, after a discarded warm-up

`npx vitest run --dir src`, `/usr/bin/time -p`, raw in `raw-paired-lane-runs.txt`, harness
`raw-paired-harness.mjs.txt`. Both trees green 42 / 1325 on every run.

| round | order | base wall / CPU (load) | tip wall / CPU (load) | Δ wall | Δ CPU |
|---|---|---|---|---|---|
| 1 | base first | 9.21 / 27.04 (12.4) | 9.17 / 26.95 (15.1) | −0.04 | −0.09 |
| 2 | tip first | 8.73 / 26.65 (21.0) | 9.08 / 26.67 (15.6) | +0.35 | +0.02 |
| 3 | base first | 7.46 / 26.06 (20.2) | 7.04 / 25.74 (21.0) | −0.42 | −0.32 |
| 4 | tip first | 7.25 / 26.29 (21.2) | 7.33 / 25.95 (19.7) | +0.08 | −0.34 |
| 5 | base first | 7.47 / 26.79 (18.8) | 7.14 / 25.71 (21.8) | −0.33 | −1.08 |

**Median Δ wall −0.04 s** (sign +2 / −3), **median Δ CPU −0.32 s** (sign +1 / −4). Both inside
`A6`'s ≤ 0.30 s bound in the direction the bound cares about (the tip is not slower); **the sign
rule (≥ 4 of 5 agreeing) holds for CPU (4/5 negative) and does not hold for wall (3/5)** — and it
should not, because the two lanes are byte-identical and the deltas are the noise floor of a box
at load 20. Read this table as a measurement of that noise (±0.4 s wall, ±1 s CPU), not of the
ticket. Skip count 0 both ways.

## `NFR-008`: READ, not ruled — non-conforming under this load, reported to `ABC-108`

The lane read **7.0–9.2 s wall and 25.7–27.0 s CPU** across the ten paired runs and 9.1 s /
26.4 s at the gate run, against the catalog's bar (≤ 3 s wall, ≤ 13 s CPU as the config file's
header quotes it; `70a92f9` records the owner's later 15 s word). **Over 15 s CPU under load is
REPORTED non-conforming**, as the subtask requires — with the load stated (10–22 throughout, up
to four sibling vitest lanes running concurrently) and without a ruling, which is `ABC-108`'s /
`ABC-111`'s. This ticket added nothing to the lane, so it moved nothing.
