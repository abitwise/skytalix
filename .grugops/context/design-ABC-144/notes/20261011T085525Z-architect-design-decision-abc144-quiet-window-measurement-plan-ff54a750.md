---
id: 20261011T085525Z-architect-design-decision-abc144-quiet-window-measurement-plan-ff54a750
kind: decision
by: architect-design
at: 2026-10-11T08:55:25Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ABC-111
  - ADR-0040
  - ADR-0035
  - ADR-0017
  - NFR-008
  - AR-N8SPAWN-DRIFT
  - .grugops/context/design-ABC-144/probe/lane144.mjs
  - .grugops/context/design-ABC-144/probe/resolved-workers.mjs
  - .grugops/context/secnfr-ABC-084/notes/raw-harness-lane.mjs.txt
supersedes:
---

# `ABC-144`: the measurement plan for the no-other-hop window. 135 timed runs in two windows, ≈ 75 min

Anyone can run it at width 1: the Architect or Engineer (Window A), and Security/NFR (Window B). The
harness is `probe/lane144.mjs`, which is `ADR-0035` decision 2's shape with the changes in its header. It
self-tested on a stub (`…222e288c`). **Nothing in this plan has been run on the lane.**

## Preconditions, for the Orchestrator to schedule

- **Width 1. No other agent hop runs during either window.** That is the ticket's definition of "quiet".
  Quiet cannot be bought by a load gate (`ABC-108` `A1`, `ADR-0035`).
- **Logged, never gated, on every run:** load1 before and after (`sysctl -n vm.loadavg`, field 1), the count
  of foreign `vitest` processes, `pmset -g therm` `CPU_Speed_Limit`, and the power source.
- **Logged once per window:** `pmset -g | grep lowpowermode` (expect 0), `node --version` (v26.11.0), and the
  vitest version (3.2.7).
- **R-1's load1 ≤ 8 condition:** the summary counts runs with load1 > 8 per arm. If more than half of an
  arm's scored runs are over 8, that arm's wall is labelled "not a reading of the clause". Its CPU still
  counts.

## Trees (as `secnfr-ABC-084`)

- Out of tree: `git archive <commit> | tar -x -C <dir>/<arm>`, then
  `ln -s <main checkout>/node_modules <dir>/<arm>/node_modules`.
- The twin `T` is a second copy of `B`, and `diff -rq -x node_modules B T` is clean.
- A cap arm `Kk` is `B` with one line `    maxWorkers: k,` added after `    pool: "threads",`.
  `diff B/vitest.config.ts Kk/vitest.config.ts` shows exactly that one line.
- **Before any timed run,** in every tree: `node <probe>/resolved-workers.mjs`. Record `effectiveWorkers`:
  B = T = 7, Kk = k.
- `lane-inventory.js` needs git, so it is not run in archive trees. Its role is taken by the harness: round 0
  fixes each arm's file and test counts, every later run must equal them, and the arms must equal each
  other.

## Window A: the frontier (`ABC-144` § Scope 1, test note 2), BEFORE the build

- **Commit:** the wave tip the build will branch from.
- **Arms:** `B, T, K4, K3, K2, K1`. Add `K4m1` (K4 + `minWorkers: 1`) if there is time.
- **Command:**
  `ARMS=<dir> CONDS=B,T,K4,K3,K2,K1 BASE=B TWIN=T ROUNDS=9 GAP=0 TAG=abc144-frontier-warm node lane144.mjs`
- **Warm, interleaved:** 9 rounds, order rotated each round, round 0 discarded, **n = 8**.
- **Runs: 6 × 9 = 54** (63 with `K4m1`).
- **Expected duration ≈ 10–12 min.** One round ≈ B 7 + T 7 + K4 7.5 + K3 8.5 + K2 10.5 + K1 16.5 ≈ 57 s,
  plus ~1 s start-up per run. These are projections from `…c33f4ab8`. Add ~5 min to build the trees, so
  **≈ 15 min**.
- **Read out:** per arm, the median CPU, wall and CPU/wall; the paired delta against B, with sign and R
  (k = 2 at n = 8); the twin's admissibility; load1 medians.
- **Then apply `ADR-0040` d2:** rule the largest eligible k, or send the table to the owner. Publish the
  `.tsv` and `.summary.txt` as `raw-*.txt` beside the notes, and record the result as an `ADR-0040`
  addendum.

## Window B: Security/NFR's `A1`–`A5`, on the BUILT head

**Trees:** `B` (the build's base commit), `H` (the build tip), `T` (twin of `B`).

| step | command (add `ARMS=<dir> CONDS=B,H,T BASE=B TWIN=T ROUNDS=9`) | runs | expected |
|---|---|---|---|
| B1 warm | `GAP=0 TAG=abc144-warm` | 27 | ~4–5 min |
| B2 cooled | `GAP=90 TAG=abc144-cooled`: 90 s idle before **every** run | 27 | 27 × (90 + ~8) s ≈ **44 min** |
| B3 `AR-N8SPAWN-DRIFT` | `GAP=0 NARROW=src/cli.test.ts TAG=abc144-cli-narrow` | 27 | ~3 min |

**Window B: 81 runs ≈ 52 min, ≈ 60 min with setup.**
- Each state has **its own** identity twin: T−B within that state's runs (`A4`).
- B3 compares H's `src/cli.test.ts` CPU with its last admissible base reading, against `F` = 1.097 s
  (`ADR-0017` § Pointers 2026-10-11).
  - H carries the cap (idle boots 7 → 4, so it reads lower) and the pin (milliseconds). Say so beside the
    result.
  - Over `F` → check the 27 children under `T2`.

**Derived numbers that Window B owes `A5`:**
- `A1`: H−B CPU, as % of B's median, with R and sign, warm (and cooled for the record).
- `A2`: `resolved-workers.mjs` at H = 4, at B = 7. Median CPU/wall for B and H.
- `A3`: H's warm wall median against W.
- `A4`, per state: H median + that state's twin wall R ≤ W.
  - **Cooled/warm wall factor** = H cooled median ÷ H warm median.
  - **Re-open trigger** = W ÷ that factor. It replaces 8.76 s.
- The full-lane `F` re-read under the cap (`ADR-0040` d4).

## Outside the windows (counts, not timings; any width)

- **`A6`:** 20 consecutive green `npm test` runs at H.
  - Every `*.nfr.test.ts` file passes. Read it from `.test-results/last-run.json` per file.
  - The file count equals base. The test count equals **base + 1** (the pin). Skips are 0.
  - ~20 × 8 s of machine time.
- **`A6` opt-in lanes:** each `*_DEEP` variable once at B and once at H. Same files and tests, exit 0. Their
  wall is reported with its load1, not bounded. Duration `UNKNOWN`: some deep lanes run for minutes.
- **`A7`:** the three armed reds (r1–r3) in `…df7355cf`.

## Total

- **135 timed runs in no-other-hop windows** (144 with `K4m1`).
- **≈ 75 min of machine time:** Window A ≈ 15 min, Window B ≈ 60 min, of which 44 min is the cooled gaps.
- The two windows can be separate. The build between them needs no quiet.

## Readings this plan still owes (none exists today)

1. The frontier: CPU, wall and CPU/wall for B, T, K4, K3, K2, K1 (and K4m1), with the twin R. This is the
   first lane reading on v26.11.0 taken with no other hop running.
2. Whether any cap reaches −15 % CPU (`A1`). That decides `ADR-0040` d2.
3. H against B, warm and cooled: CPU, wall, CPU/wall, n, load1 medians, twin R per state (`A1`, `A3`, `A4`,
   `A5`).
4. The cooled/warm wall factor at H, and the re-derived re-open trigger (`A4`).
5. `src/cli.test.ts`'s narrow-set CPU at H (`AR-N8SPAWN-DRIFT`).
6. Full-lane `F` under the cap. The first three narrow-set readings per set after the merge (`ADR-0040` d4).
7. `CPU_Speed_Limit` per run. This is the first heat evidence on record (owner question 1).
8. The `A6` screen and the opt-in lane counts and walls.
9. `W_new`, Security/NFR's proposal, and only if H's wall exceeds 10 s or the owner asks for one.
