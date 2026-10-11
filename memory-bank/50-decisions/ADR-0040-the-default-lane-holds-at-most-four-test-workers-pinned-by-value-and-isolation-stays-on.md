---
kind: adr
id: ADR-0040
---
# ADR-0040: The default lane holds at most 3 test workers (`test.maxWorkers: 3` in `vitest.config.ts`), pinned by value. Isolation stays on. Proposed at 4; the quiet-window frontier stepped it down to 3 by the rule written here first (addendum 2026-10-11)

## Status

**accepted** 2026-10-11 by Olger Oeselg (owner), with the Window A addendum (k = 3), verbatim "accepr ADR-0040 and ADR-0038" (note `.grugops/context/wave-2026-09-25/notes/20261011T102346Z-orchestrator-decision-owner-word-accept-adr0040-adr0038-addendum-7089c972.md`).

Previously **proposed** 2026-10-11 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-144`, ticket `ABC-144`).
~~**Owner acceptance owed.**~~ Owner accepted (above).

**Addendum 2026-10-11 (Window A, ACCEPTED with the ADR): decision 2's rule rules k = 3, not 4.** The addendum at
the end of this file governs. Where decisions 1, 3 and 4 below say 4, read 3; each place is marked
"→ 3, addendum". The file name keeps "four" so that existing links still resolve.

- It sets a runner option in the file `ADR-0008` governs. It amends no decision of `ADR-0008` or `ADR-0035`.
  `ADR-0008` decision 7 (`isolate: false` forbidden) binds and is restated in the pin (decision 3).
- **No timing or CPU reading was taken at this hop.** Two Engineer builds were running `npm test`. Every
  number below is cited from a recorded reading, or labelled **projection** (arithmetic over recorded
  readings), or comes from a read that times nothing:
  - the installed `vitest` 3.2.7 and `tinypool` 1.1.1 source;
  - `sysctl hw.perflevel0/1`;
  - a resolved-configuration read (`.grugops/context/design-ABC-144/probe/resolved-workers.mjs`).
- **The number 4 is provisional until the frontier is read** (decision 2). The frontier is the ticket's
  § Scope 1 and is owed. The plan is note `…ff54a750`.
- Notes: `.grugops/context/design-ABC-144/notes/`. The trade-off table is in `…c33f4ab8`.

## Context

**The owner's word (2026-10-10):** *"10s limit can be increased a bit, i have issues that vitest is choking
the macbook air m3, reduce cpu usage"*.

**What the runner does today, read from source** (`vitest` 3.2.7, `createThreadsPool`):
- `vitest run` uses `availableParallelism() − 1` = **7** threads. Watch mode uses half the cores, which is 4.
- The precedence is:
  1. `fileParallelism: false` gives 1;
  2. otherwise `poolOptions.threads.maxThreads`;
  3. otherwise `maxWorkers`;
  4. otherwise 7.
- **The environment variable `VITEST_MAX_THREADS` writes `poolOptions.threads.maxThreads`, so it overrides
  the config file.** Read at this hop:
  - base resolves to 7;
  - a copy with `maxWorkers: 4` resolves to 4;
  - the same copy under `VITEST_MAX_THREADS=8` resolves to **8**.
- **`tinypool` spawns `minThreads` workers at start, and refills to `minThreads` after every isolated
  task.** `minThreads` defaults to `min(7, max)`. So every run boots idle workers at its tail, and a cap
  lowers that count too.

**The machine:** Apple M3 (Mac15,13), no fan. `sysctl` reads **4 Performance + 4 Efficiency cores**.
- With 7 workers, the main vitest process and `src/cli.test.ts`'s 27 children, some runnable threads
  must sit on efficiency cores at peak. With 4 workers, the workers fit the performance cores.
- **Hypothesis, not a reading:** that is how a cap can cut CPU-seconds rather than only spread them.
  Work on an efficiency core, or on cores clocked down under an all-core load, is billed more user + sys.
  It agrees with the one recorded frontier point (1 worker: −30.1 % CPU) and does not prove it.

**The recorded frontier** (the trade-off note `…c33f4ab8` has every source):

| setting | CPU | wall | source |
|---|---|---|---|
| 7 workers (today, `pool: "threads"`) | 24.86 / 26.04 s | 6.52 / 7.16 s, CPU/wall 3.6–3.8x, load1 7.1/7.5 | `ABC-084` runs 1, 3 (`ADR-0035` § Context) |
| 1 worker (`--no-file-parallelism`) | **−30.1 %** | **×2.4** (+140.5 %), CPU/wall 1.32x | 2026-08-10, 22 files, forks, v24.12.0 (`…28788b30` § 7) |
| `pool: "threads"` vs forks | −7.3 / −7.7 % | −14 / −23 % | `ADR-0008` addendum (adopted) |
| `isolate: false` | −30.7 / −36.5 % | — | **forbidden**, `ADR-0008` d7 |

**At width 3,** three hops hold up to 21 workers on 8 cores (arithmetic). QE logged load1 6.98–14.16 with
two other agents running `npm test` (`ABC-144` page). A cap of 4 makes that 12, which is still more than 8.

## Decision

**1. The setting: `test.maxWorkers: 4` in `vitest.config.ts`.** `pool: "threads"` stays. `isolate` is not
written and stays at its default `true`. No `minWorkers`, no `poolOptions` and no flag in `scripts.test`.
- **A fixed integer**, not `"50%"`. `ABC-144` `A2` wants a number that does not scale with the core count.
- **In the config, not in the `test` script:**
  - every vitest invocation reads the config: `npm test`, every narrow set (`npx vitest run <set>`), every
    `*_DEEP` lane and watch mode;
  - `scripts.test` is byte-pinned by `ABC-042` `A10` (`src/cli.test.ts`), and `ABC-143` edits the same
    line. The config placement gives no merge-order coupling with `ABC-143`.
- **`maxWorkers`, not `poolOptions.threads.maxThreads`:** it does not depend on the pool. The pool-specific
  key silently outranks it, so the pin forbids that key (decision 3).
- **Why 4:** *(→ 3, addendum. Window A ruled 3 under decision 2. The three reasons below are re-read there.)*
  - it is `A2`'s bar;
  - it is this machine's performance-core count, which is the mechanism above;
  - it is the largest cap `A2` allows, so it buys the most wall headroom against `A3`.
- **The config's form changes.** The default export becomes a plain object, written
  `export default { test: { … } } satisfies ViteUserConfig`, with `import type { ViteUserConfig } from
  "vitest/config"`. Then the pin's import of this file loads nothing at run time. The current
  `defineConfig` import pulls in `vite`, because `vitest/config` re-exports `mergeConfig` from it.
  - **Read at this hop:** vitest resolves the plain-object form (effective 4), and Node imports it with
    no run-time dependency.
  - **`npm run typecheck` on that form is `UNKNOWN - verify`** (the Engineer). If it fails, keep
    `defineConfig`, and read the pin's narrow-set cost under `N8-LANE`.
- The config's header comment gains one paragraph that names this ADR and the cap. The isolation
  warning stays word for word.

**2. The selection rule, pre-registered. It is applied to the frontier readings (plan Window A) before
the build.** Each arm is the base tree with one changed line, `maxWorkers: k`.
- **An arm `K4`, `K3` or `K2` is ELIGIBLE when all of these hold:**
  - the identity twin is admissible (`ADR-0035` decision 1);
  - its paired CPU median is ≤ −15 % of base's median, and the twin's CPU R is ≤ 15 % of base CPU;
  - its warm wall median + the twin's wall R is ≤ 10 s.
- **Rule the LARGEST eligible k.** Expected: 4. The ADR records the result as an addendum while it is
  `proposed`, and the Engineer builds that k.
- **No arm eligible → no agent rules a setting.** The frontier table goes to the owner, with `K1` and the
  heat and lag rows, as `A1`'s fork says. His pick is written on the page, dated.
- **A smaller k changes the pin's literal and nothing else.**

**3. The value check (`A7`). The suite gains no timing and no CPU assertion.** One new `it`, in its own
`describe`, in `src/cli.test.ts`. That file already pins `scripts.test` byte for byte (`ABC-042` `A10`),
so the two pins close the CLI-flag route and the config route together.
- It reads `const { default: lane } = await import("../vitest.config.ts")` and asserts on `lane.test`:
  - `pool` is `"threads"`;
  - `maxWorkers` is **exactly** `4` *(→ `3`, addendum)*, ADR-0040's number. A raise breaks `A2`. A lowering moves `A3`/`A4`'s
    wall and the floors `F`. Both are rulings, not drive-by edits;
  - `fileParallelism ?? true` is `true`;
  - `isolate ?? true` is `true` (`ADR-0008` d7);
  - `poolOptions` is `undefined`. No per-pool `maxThreads` outranks the cap, and no per-pool `isolate`
    turns isolation off;
  - for `VITEST_MAX_THREADS` and `VITEST_MAX_FORKS`: if set, `parseInt` is ≤ 4 *(→ ≤ 3, addendum)*. **The environment may
    lower the cap, never raise it.**
- **Armed before it is trusted.** The Engineer shows each red on a scratch copy and records them:
  - (r1) delete `maxWorkers: 4` → red;
  - (r2) add `isolate: false` → red;
  - (r3) `VITEST_MAX_THREADS=8 npx vitest run src/cli.test.ts -t "ABC-144"` → red.

  **If (r3) stays green,** the worker does not see that variable. Drop the env half, record
  "an exported `VITEST_MAX_THREADS` raises the cap unseen" as a residual in the notes, and keep the rest.
- **The account:**
  - 0 test files and 0 spawns (`N8_SPAWN` stays 27). The `ABC-138` spawn pin counts calls that name
    `child_process`, and this import names a config file;
  - **+1 test.** `A6`'s "test count equals base" is read as **base + 1**, declared here before any reading.
    Any other delta fails `A6`;
  - the pin's cost is one in-process import of a module with no run-time imports, expected in
    milliseconds. It lands inside `AR-N8SPAWN-DRIFT`'s narrow set (`src/cli.test.ts`, `F` = 1.097 s), far
    below that `F`. Security/NFR reports it under § Scope 4.

**4. The recorded floors `F` (`ABC-144` § Dependencies asks whether they carry over).**
- **Narrow sets of ≤ 4 files *(→ ≤ 3, addendum)*: CARRY OVER, provisionally.** Each file already had its own worker. The only
  scheduling change is `tinypool`'s idle boots (7 → 4), a per-run constant that base, head and twin all
  share. `ADR-0035` Rollback says floors are data, so the first three readings after the merge replace
  them by decision 3's own rule.
- **Sets of more than 4 files *(→ 3, addendum)*, and the full lane: NOT carried.** The cap changes how their files queue.
  - A set with more than 4 files is "a set with none" until its first admissible reading under the cap.
    It takes the provisional 16 % of base CPU (`ADR-0035` decision 3, amended).
  - Full-lane `F` (1.72 s CPU / 3.25 s wall) is re-read from the window's twin R. Until three readings
    exist, it is the largest R recorded under the cap.

**5. The straddle rule.** A paired reading is not a reading of a ticket when its base and head differ in
`vitest.config.ts`, that is, when one side is before `ABC-144`'s merge and the other after. The cap would
land in the delta.
- Rebase first, so both arms carry the same config.
- `ABC-083`'s open `N8-LANE` +1.08 s re-reads on its rebased base, as its page already says.
- `ABC-085`'s `LADDER_DEEP` wall changes. Its games do not (virtual clock). *(Narrowed, addendum: one file
  runs on one worker under any cap, so only the idle boots differ.)*

**6. Not decided here:**
- **`W_new`.** Security/NFR proposes it from the window readings (`A5`), and the owner moves the level.
- **A CPU level.** That is owner question 2. This ADR agrees with BA/PM: none. The pin holds the cap,
  and CPU stays reported (R-1).
- **Orchestrator width.** That is the owner's and the Orchestrator's (the trade-off note, row L3).

## Alternatives

Full table with evidence and risks: note `…c33f4ab8`. Condensed:

| setting | why not ruled |
|---|---|
| `isolate: false` | **forbidden**, `ADR-0008` d7 |
| 1 worker / `fileParallelism: false` | recorded wall ×2.4 → ~15.6–17.2 s, over 10 s. It is a point for the owner, not an agent ruling |
| `K3`, `K2` | they keep `A2` too, at more wall. Decision 2 steps down to them only if `K4` misses `A1` |
| `maxWorkers: "50%"` | it scales with the core count, so `A2` refuses it |
| `poolOptions.threads.maxThreads` | it depends on the pool, and it silently outranks `maxWorkers` |
| `--maxWorkers=4` in `scripts.test` | it touches the `A10` byte pin and `ABC-143`'s line, and narrow sets and `*_DEEP` lanes never read it |
| `pool: "forks"` + cap | threads measured −7 % CPU against forks |
| `pool: "vmThreads"` | a different isolation mechanism that `ADR-0008` d8's screen never covered. No reading |
| `minWorkers: 1` with the cap | it removes idle boots. The saving was never measured. It is an optional frontier arm (`K4m1`), not part of this ruling |
| `nice` / `os.setPriority` on the lane | it targets **lag**, not CPU-seconds. No reading. Offered to the owner as an add-on |
| `taskpolicy -b` (background QoS, efficiency cores only) | it targets **heat**. CPU-seconds probably rise, so it fails `A1` as written. It is the owner's pick |

## Consequences

- **CPU is `UNKNOWN - verify` until Window A is read.** Recorded bounds: between 0 % and the −30.1 % that
  1 worker bought. Whether 4 reaches −15 % is the frontier's first question.
- **Wall, projection only (recorded inputs; the trade-off note shows the arithmetic):**
  - `K4` ≈ 4–9.5 s. It is under 10 s on every combination of the recorded inputs, but its top end is
    inside `ABC-111`'s 8.76 s re-open zone. That is why `A4` reads both states.
  - `K3` ≈ 5.6–12.6 s.
  - `K2` ≈ 8–18 s.
- **`A4` can be unreachable on noise alone.** Recent loaded full-lane wall R is 3.25 s (`ADR-0035` `F`). At
  that R, any head wall above ~6.75 s fails "≤ W by R". The no-other-hop window should shrink R, and the
  plan reports it either way.
- **At width 3 the machine is still oversubscribed** (12 workers on 8 cores). The cap is per process. The
  pin lets the environment lower it, so an Orchestrator at width ≥ 2 can run hops with
  `VITEST_MAX_THREADS=2` without a code change. That is the Orchestrator's and the owner's call.
- **Flake risk does not rise.** Fewer concurrent files means less contention. `A6`'s 20-run screen still
  applies, because scheduling changes (`ADR-0008` d8).
- **`*_DEEP` lanes** inherit the cap. Their wall is reported, not bounded (`A6`).

## Rollback

- **The setting:** delete the `maxWorkers: 4` line and the pin's `describe`. The plain-object form can stay.
  It is a no-op at run time, as `ADR-0008`'s Rollback measured for `defineConfig({})`.
- **The ADR:** nothing else is built on it. The floors fall back to the recorded values by decision 4's
  own rule.

## ADDENDUM 2026-10-11: Window A read the frontier, and decision 2 rules k = 3. Still `proposed`

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-abc085-verdict-cost`), on the wave tip
`8639effb`. **This addendum is part of the proposal. The owner's acceptance of `ADR-0040` covers it, and is
still owed.** **No timing or CPU reading was taken at this hop.** A QE hop and an Engineer hop were running.
Every figure below is quoted from Security/NFR's Window A notes, or is arithmetic on their raw `.tsv`:
- the decision, `…b66453e7`;
- the readings, `…a898a14a`;
- the heat, power and caveats, `…41ff7c05`;
- the raw files beside them, `.grugops/context/secnfr-ABC-144-window-a/notes/raw-*`.

This hop's decision note is `.grugops/context/design-abc085-verdict-cost/notes/…7974985e`, and its arithmetic is in `…5d70d79e`.

### What Window A read (wave tip `af6ada41`, width 1, n = 8, 54 runs, 0 harness errors)

| arm | workers | paired CPU delta vs B (% of B's 27.15 s) | CPU interval | wall median | (c) wall + twin R 0.150 s | eligible under d2 |
|---|---:|---|---|---:|---:|---|
| K4 | 4 | −10.66 % | [−13.85 %, −8.88 %] | 6.57 s | 6.72 s | **no**: the whole interval is short of −15 % |
| K3 | 3 | −16.48 % | [−19.08 %, −16.02 %] | 7.22 s | 7.37 s | **yes** |
| K2 | 2 | −22.71 % | — | 8.23 s | 8.38 s | yes |
| K1 | 1 | −29.26 % | — | 14.68 s | — | not a d2 candidate; reported only |

- The twin was admissible: +0.72 % of base, sign 5/8. Twin CPU R was 0.640 s (2.36 %), and twin wall R
  0.150 s.
- **The largest eligible k is 3.** The rule needed no owner word.

### What changes. Decision 2 says "a smaller k changes the pin's literal and nothing else"; these are the literals

1. **Decision 1, the setting:** `test.maxWorkers: 3`. `pool: "threads"` stays, `isolate` stays unwritten, the
   plain-object form stays, and so does the placement in the config.
2. **Decision 1, "Why 4" becomes "Why 3":**
   - **It is the largest k that decision 2 found eligible.** That is the pre-registered reason, and it is the
     only one that decides.
   - **It keeps `A2`.** `A2` asks for at most 4 workers, a fixed number. 3 is a fixed number below it.
   - **The reason "4 = the M3's performance-core count" no longer carries the choice.** K4 missed the CPU
     clause. Arithmetic on the paired medians gives the CPU cut per worker removed:
     - from 7 down to 4, about −3.6 points per worker (−10.66 % over 3 workers);
     - 4 → 3: −5.82 points;
     - 3 → 2: −6.23 points;
     - 2 → 1: −6.55 points.

     **This shows no knee at the performance-core count.** The hypothesis in § Context, that work spilled
     onto efficiency cores is billed more, is neither confirmed nor refuted by this shape. It stays a
     hypothesis, and nothing rests on it.
3. **Decision 3, the pin (`A7`):**
   - `expect(test.maxWorkers).toBe(3)`;
   - the environment loop checks `toBeLessThanOrEqual(3)` for `VITEST_MAX_THREADS` and `VITEST_MAX_FORKS`;
   - the `describe` / `it` titles say 3.

   In the sketch in note `…df7355cf`, only these three literals change. "A raise breaks `A2`" now reads:
   a raise to 4 keeps `A2` but breaks decision 2, because K4 is not eligible. A raise above 4 breaks both.
4. **Decision 3, the armed reds:** r1 deletes `maxWorkers: 3`; r2 adds `isolate: false`; r3 sets
   `VITEST_MAX_THREADS=8`.
   - **Add r3b: `VITEST_MAX_THREADS=4 npx vitest run src/cli.test.ts -t "ABC-144"` → red.** 4 is the
     boundary that a stale `≤ 4` literal would let through, and 8 cannot see it.
   - If r3 stays green, the worker does not see the variable. r3b is then moot, and the residual in decision 3
     applies as written.
5. **QE's `A2` read** (`resolved-workers.mjs` at head): expect `effectiveWorkers: 3`, and 7 at base.
6. **Decision 4, the floors.** The threshold follows k, by decision 4's own reason: each file had its own
   worker.
   - Narrow sets of **≤ 3** files carry over provisionally.
   - Sets of **more than 3** files, and the full lane, are re-read under the cap.
   - **No recorded `F` moves.** `src/cli.test.ts` (1.097 s) and `history-pane.nfr` (0.058 s) are 1 file each,
     and the two-file set (0.038 s) is 2 files. All are ≤ 3.
7. **§ Consequences, width:** at Orchestrator width 3, the cap holds up to 9 workers on 8 cores (it was 12
   at K4). That is arithmetic, not a reading.

### What this does NOT change

- `isolate`, `pool`, the plain-object form, the placement, the straddle rule (d5), and d6 (`W_new`, no CPU
  level, width). All stand as written.
- **`ABC-144` `A1` is still owed on the built head, in Window B.** Window A is the frontier on the wave tip,
  and Window B reads H against B. K3's −16.48 % is the expectation, not the reading.
- **The wall.** The projection in § Consequences (K3 ≈ 5.6–12.6 s) is replaced by Window A's warm reading:
  median 7.22 s (6.99–7.30), paired +0.95 s against B, interval [+0.84, +0.98] s.
  - That is under 10 s with the twin R added.
  - It is under `ABC-111`'s 8.76 s warm re-open zone.
  - The cooled wall and the cooled/warm factor are still Window B's (`A4`).
  - "`A4` can be unreachable on noise alone" assumed the loaded R of 3.25 s. Window A's quiet twin wall R
    was 0.150 s, so `A4` is reachable at W = 10 s on this reading.

### The missing heat field: `CPU_Speed_Limit` does not exist on this machine

- **`pmset -g therm` on this Mac15,13 (M3, Darwin 25.5.0) prints no `CPU_Speed_Limit` line.** The harness
  logged `none` on all 54 runs (`…41ff7c05` § 1).
  - So readings-owed item 7 of the measurement plan `…ff54a750` is **not delivered**, and that instrument
    cannot deliver it.
  - **"No speed limit below 100 was observed" must never be written.** The field was never there to read.
- **The substitute that was read:** Security/NFR's own 15-second sampler of
  `notifyutil -g com.apple.system.thermalpressurelevel`, with no sudo (`raw-sampler.sh.txt`).
  - It read **0** (nominal) from 09:44:47Z to 09:50:48Z.
  - It read **1** (moderate) from 09:51:03Z to the end, which covers about the last 9 runs. Rounds 7–8 were
    running then: 8 of the 48 scored runs, or 9 if round 7's K2 is counted.
  - It is a system-wide level sampled every 15 s. It is not per run, and not a clock speed.
- **It moves no eligibility cell.** Arithmetic on the raw `.tsv`, rounds 1–6 only, where every run started
  before the 09:50:48Z sample read 0:
  - K4 −10.74 %, K3 −16.85 %, K2 −22.75 % paired median CPU;
  - K3's wall median is 7.18 s.

  The ruling is the same.
- **For Window B, this replaces plan item 7.** Log `com.apple.system.thermalpressurelevel` before and after
  **every** run, beside load1. Keep the `pmset -g therm` column only as the record that it is empty.
  - **This is the first heat evidence on record.** About 6 minutes of back-to-back lane runs moved the
    fanless M3 from nominal to moderate.
  - Its bearing on owner question 2 in `…f3beb336` ("which is choking: CPU, lag or heat?") is for the owner.
  - It is not a reason for this ADR to pick a smaller k. Decision 2 rules on CPU and wall, and the owner may
    still pick K2 for heat when he accepts.

### Does the vitest runner's ~4.3x per-node overhead (`ABC-085`, note `…70684a78`) change any of this? No

- **Decision 2 reads paired ratios between arms of the same runner,** with the same transform on both sides.
  A per-node runner overhead multiplies base and head alike, so it cannot move a paired percentage or an
  eligibility cell.
- **The cap does not reach it.** The overhead is per node inside one worker, and the cap limits how many
  workers run at once.
- **One open question, routed and not ruled here:** how much of the default lane's 27 s of CPU is engine
  hot paths paying that overhead. It is `UNKNOWN - verify`, with no reading. If it is large, a runner setting
  that removes it would be a CPU lever outside this ADR's three settings (`ABC-144` § Scope 1). It is for
  BA/PM to decide whether to cut it (routing in note `…be323233`).
- **`LADDER_DEEP` and decision 5, narrowed.** `src/ladder.test.ts` is one file, so it runs on one worker
  under any cap. Only `tinypool`'s idle boots differ (7 → 3). The ladder's wall is not expected to move by
  more than that. Its games do not move at all.

### Rollback, extended for this addendum

Set the literal back to the k the owner names, in the config and in the pin's three literals. Decision 4's
threshold follows that k. Nothing else in this addendum depends on 3.
