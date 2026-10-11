---
id: 20261011T100239Z-architect-design-decision-abc144-adr0040-addendum-window-a-rules-k3-7974985e
kind: decision
by: architect-design
at: 2026-10-11T10:02:39Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ABC-085
  - ADR-0040
  - ADR-0035
  - NFR-008
  - AR-N8SPAWN-DRIFT
  - memory-bank/50-decisions/ADR-0040-the-default-lane-holds-at-most-four-test-workers-pinned-by-value-and-isolation-stays-on.md
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-decision-abc144-window-a-adr0040-d2-applied-largest-eligible-k-is-3-b66453e7.md
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-observation-abc144-window-a-frontier-readings-a898a14a.md
  - .grugops/context/secnfr-ABC-144-window-a/notes/20261011T095343Z-security-nfr-observation-abc144-window-a-heat-power-and-caveats-41ff7c05.md
  - .grugops/context/design-ABC-144/notes/20261011T085525Z-architect-design-decision-abc144-recommend-maxworkers-4-and-the-value-pin-df7355cf.md
supersedes:
---

# `ABC-144`: `ADR-0040` addendum written. Window A rules **k = 3**. Still PROPOSED. The vitest ~4.3x overhead changes none of it

This note is hand-authored and unsealed. The full text is `ADR-0040` § Addendum 2026-10-11. **Nothing was timed
at this hop.**

## What the addendum records

- **Decision 2 applied (Security/NFR `…b66453e7`).**
  - K4 is −10.66 %, with its whole interval short of −15 %, so it is **not eligible**.
  - K3 is −16.48 % with a wall of 7.37 s, so it is eligible.
  - K2 is −22.71 % with a wall of 8.38 s, so it is eligible.
  - **The largest eligible k is 3.**
- **What changes. These amend `…df7355cf`'s hand-off for the Engineer and QE; the rest of that note stands:**
  - `vitest.config.ts`: `test.maxWorkers: 3`.
  - The pin: `expect(test.maxWorkers).toBe(3)`, the environment check `toBeLessThanOrEqual(3)`, and the
    titles say 3.
  - **Add red r3b:** `VITEST_MAX_THREADS=4 npx vitest run src/cli.test.ts -t "ABC-144"` → red. That is the
    boundary a stale `≤ 4` would pass.
  - QE `A2`: `resolved-workers.mjs` at head reads `effectiveWorkers: 3`, and 7 at base.
  - Decision 4's carry-over threshold follows k: ≤ 3 files. **No recorded `F` moves**, because every recorded
    set has 1 or 2 files.
- **"Why 4" becomes "Why 3".**
  - It is the largest eligible k, which is the pre-registered reason.
  - It keeps `A2` (≤ 4).
  - The performance-core-count reason no longer carries anything. The per-worker CPU cut grows below 4
    (−3.6, then −5.8, −6.2, −6.5 points), with no knee at 4.
- **The heat field is missing.** `CPU_Speed_Limit` is absent from `pmset -g therm` on this M3, and was
  logged `none` 54 times. Plan item 7 is not delivered.
  - `thermalpressurelevel` read 0 until 09:50:48Z, then 1 for about the last 9 runs.
  - Rounds 1–6 alone (all started at level 0) give K4 −10.74 %, K3 −16.85 % and K2 −22.75 %. **That is the
    same ruling.**
  - Window B logs `thermalpressurelevel` before and after every run, in place of `CPU_Speed_Limit`.
- **What is unchanged:** `isolate`, `pool`, the plain-object form, the placement, d5 and d6.
  - `A1` is still owed on the built head in Window B.
  - Owner acceptance of `ADR-0040` is still owed. It covers this addendum.

## Does the ~4.3x vitest runner overhead (`ABC-085` `…70684a78`) matter to `ABC-144`? Not to its bar or its ruling

- **The bar is paired default-lane CPU, with the same runner on base and head.** A per-node runner overhead
  multiplies both sides, so it cannot move a paired % or an eligibility cell. The K3 ruling stands.
- **The cap does not reach it.** It is per node inside a worker. The cap limits how many workers run.
- **`LADDER_DEEP`:** one file runs on one worker under any cap. Only the idle boots differ (7 → 3). The games
  do not change. `ADR-0040` d5's line is narrowed to say so.
- **Not ruled; routed (`…be323233`).** The share of the default lane's 27 s of CPU that is engine hot paths
  paying the overhead is `UNKNOWN - verify`, and nobody has read it. If it is large, removing the overhead
  would be a CPU lever for the owner's "reduce cpu usage". It sits outside `ABC-144`'s three settings, so it
  is BA/PM's to cut or not.
