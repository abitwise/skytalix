---
id: 20261011T085525Z-architect-design-decision-abc144-tradeoff-table-and-what-choking-means-c33f4ab8
kind: decision
by: architect-design
at: 2026-10-11T08:55:25Z
verified_by:
confidence: medium
refs:
  - ABC-144
  - ABC-111
  - ADR-0040
  - ADR-0008
  - ADR-0035
  - NFR-008
  - .grugops/context/refinement-ABC-026/notes/20260810T202912Z-architect-design-observation-28788b30.md
  - .grugops/context/secnfr-ABC-084/notes/raw-out-lane-run3.tsv.txt
  - plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-144`: the trade-off table of runner settings, and what it says about "choking" (BA/PM open question 1)

Confidence is `medium` because the table's CPU and wall cells for the caps are **projections**. The
frontier in `…ff54a750` Window A replaces them. The evidence column cites only recorded readings, plus
reads that time nothing (`…222e288c`).

## Recorded readings used (E) and source reads (S)

| id | reading | where |
|---|---|---|
| E1 | `isolate: false`: −30.7 / −36.5 % CPU (forks); green 4 of 21 | `ADR-0008` d7; `plans/nfr-catalog.md` `NFR-008` 2026-08-10 |
| E2 | `--no-file-parallelism`: CPU −30.09 % (sign 0/8), wall +140.54 % (8/8); CPU/wall 4.15–5.07x parallel, **1.32x serial**. 22 files, forks, Node v24.12.0, 2026-08-10 | `refinement-ABC-026` `…28788b30` § 7 |
| E3 | `pool: "threads"` vs forks: −7.32 / −7.70 % CPU, −14.09 / −23.08 % wall, 24/24 green | `ADR-0008` addendum 2026-08-13 |
| E4 | today: 24.86 / 26.04 s CPU, 6.52 / 7.16 s wall, load1 median 7.1 / 7.5, 49 files, v26.11.0 | `ABC-084` runs 1, 3 (`ADR-0035` § Context, P2) |
| E5 | warm CPU/wall 5.291, cooled 4.637 (factor 1.141), 39 files, v24.12.0, 2026-08-19 | `ABC-111` page |
| E6 | default 7 workers; wall sawtooth +70–75 ms at each multiple of 7 files | `plans/nfr-catalog.md` `NFR-008` (line ~1011) |
| E7 | load1 6.98–14.16 with two other agents running `npm test` (width 3) | QE `ABC-142` (`…298ed173`, cited on the `ABC-144` page) |
| S1 | vitest precedence; `VITEST_MAX_THREADS` outranks the config; tinypool eager and refilled `minThreads` | `…222e288c` items 1–3 |
| S2 | 4 Performance + 4 Efficiency cores | `…222e288c` item 4 |

## The table

The bars: CPU ≤ 0.85 × base (`A1`), ≤ 4 workers (`A2`), wall ≤ 10 s (`A3`), `isolate` true. "Projection" =
the arithmetic below. It is not a reading.

| # | setting | expected CPU | expected wall | evidence | risk | meets bars? | helps with |
|---|---|---|---|---|---|---|---|
| B | 7 workers, threads (today) | 24.86 / 26.04 s | 6.52 / 7.16 s; CPU/wall 3.6–3.8 under load, 5.29 best warm | E4, E5, E6 | — | fails `A2` | — |
| **K4** | **`maxWorkers: 4`** (`ADR-0040`) | between 0 and −30 %: `UNKNOWN`. Mechanism: the 4 workers fit the 4 performance cores | projection **4.2–9.5 s** | E2 bounds it; S1, S2 | may miss −15 %. Top of the wall range is inside `ABC-111`'s 8.76 s zone | `A2` yes. `A1`/`A3` owed to Window A | CPU-seconds; heat partly; lag partly (efficiency cores freed) |
| K3 | `maxWorkers: 3` | between K4 and −30 % | projection 5.6–12.6 s | as K4 | may cross 10 s | `A2` yes. `A1`/`A3` owed | as K4, plus one performance core free for the foreground (**lag**) |
| K2 | `maxWorkers: 2` | between K3 and −30 % | projection 8.0–18.0 s | as K4 | likely over 10 s → `W_new` | `A2` yes. `A3` likely needs the owner | heat, lag |
| K1 | 1 worker (`maxWorkers: 1` ≡ `fileParallelism: false` in 3.2.7) | **−30.1 %** recorded | **×2.4** recorded → 15.6–17.2 s | E2 (old tree, forks, v24.12.0) | over 10 s; the recorded point predates threads and 27 more files | `A3` needs the owner | most per run, short of QoS |
| K4m1 | K4 + `minWorkers: 1` | K4 minus up to 3 idle boots per run: small, `UNKNOWN` | ≈ K4 | S1 | one more key to pin | optional arm | CPU |
| — | `isolate: false` | −30.7 / −36.5 % | −14 / −24 % | E1 | **FORBIDDEN**, `ADR-0008` d7 | no | — |
| — | `pool: "forks"` + cap | worse than threads by ~7 % | — | E3 | undoes an adopted saving | — | — |
| — | `pool: "vmThreads"` | no reading | no reading | — | different isolation mechanism; no screen | not proposed | — |
| L1 | lower priority: `nice -n 10`, or `os.setPriority(child.pid, 10)` in `tools/grugops/run-bounded.js` | ≈ 0, no reading | ≈ 0 when idle; rises only when the foreground wants the cores | none | macOS foreground QoS may make it small; edits `run-bounded.js` or the `A10`-pinned script (`ABC-143` merge order) | does not move `A1` | **lag** |
| L2 | background QoS: `taskpolicy -b` (macOS) | likely **up**: efficiency cores bill more CPU-seconds | large rise, `UNKNOWN` | none | fails `A1` as written; macOS-only line in the script | no (`A1`) | **heat** (lowest power per run), lag |
| L3 | fewer concurrent hops, or `VITEST_MAX_THREADS=2` for agent hops at width ≥ 2 | per hop ≈ K2. Machine total: 21 → 12 workers (cap 4) → 6 (env 2) | per hop up | E7 | factory throughput; it is the Orchestrator's and the owner's, not a runner setting | n/a (per process) | **heat** and **lag**: the largest lever for both |

### The projection, so it can be checked

`wall_k ≈ wall_B × (CPU_k / CPU_B) × (P_B / P_k)`.
- `wall_B` = 6.52–7.16 s (E4).
- `CPU_k / CPU_B` ∈ [0.70, 1.00] (E2 bounds it).
- `P_B` ∈ [3.7, 5.29]: E4's loaded value and E5's best warm value.
- `P_k` ≈ (k + 0.32 serial overhead, E2) × ~0.93 packing ≈ 4.0 / 3.0 / 2.1 for k = 4 / 3 / 2.
- **The envelope is deliberately wide.** Its top pairs the loaded base wall with the best recorded
  parallelism. The window replaces every cell.

## Answer to BA/PM open question 1: what "choking" may mean, and which row answers it

- **CPU-seconds, battery, "the machine is busy":** `A1`/`A2` as written. Row **K4**, or K3/K2 if K4 misses
  −15 % (`ADR-0040` decision 2).
- **Lag when switching apps:** K4 frees the efficiency cores, and K3 also frees one performance core. **L1**
  is the targeted add-on. It cuts no CPU, so `A1` cannot see it.
- **Heat (the Air has no fan):** what matters is sustained power across all hops. At width 3, K4 still
  loads 12 workers on 8 cores. **L3 is the largest lever, and L2 is the strongest per run.** Neither is a
  runner setting `A1` can score. The window logs `pmset -g therm` `CPU_Speed_Limit` on every run. A speed
  limit below 100 on B runs and not on K runs would be the first heat reading on record.
- **The owner's pick, if he wants more than K4:** K3 (lag), L3 (heat), or both. Each is one line or an
  Orchestrator setting. None of them is needed to ship K4.
