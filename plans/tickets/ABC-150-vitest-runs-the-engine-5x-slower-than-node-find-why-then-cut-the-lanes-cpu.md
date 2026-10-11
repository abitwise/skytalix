---
id: ABC-150
title: "vitest runs the engine ~5x slower than plain `node`: find why, then cut the default lane's CPU by ≥ 15 % on top of `ADR-0040`'s 3 workers, with isolation kept"
status: backlog
column: Backlog
size: M
priority: P1
epic: —
feature: —
---

# ABC-150 — the second CPU lever: diagnose vitest's ~5x per-node factor, then remove what a runner setting can remove

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-abc147-lever`, Workflow 07). This is
> **`ABC-147` `A4`'s pre-registered ≥ 15 % arm**: "BA/PM cuts a lever ticket at `P1`, routed to Architect/Design
> for the setting". The arm was picked by the rule, not argued into (`ABC-147` decision note `…d689c50d`).
>
> **This hop ran nothing and timed nothing.** Every figure is cited from `ABC-147`'s notes on branch
> `grugops/ABC-147-vitest-overhead-probe` @ `4c634f09` (`…d689c50d`, `…a6122481`, `…7769faa0`, `…144c6b5d`), from
> `ABC-144` Window A (`…a898a14a`), or from `ABC-085`'s `RUN.txt` item 4.
>
> **Security/NFR reviewed `ABC-147` (in QE's slot): PASS_WITH_GAPS, and the ≥ 15 % arm holds under every allowed
> reading** (`…ff01ca7a`). `ABC-147` is merged (`9ac44156`). The review routed two items here, and both are
> folded in: **`RISK-ABC147-02`** (R is an estimated ceiling, so the bar is a measured cut: `L1`, `D1`) and
> **G4** (no independent re-measure yet: `D1` and `L1` are that re-measure) (`…44c6cd6d`).

## Problem

*User*: the owner at the keyboard of the fanless MacBook Air M3. His goal, verbatim: **"it was choking cpu and
generating heat"** (2026-10-11, note `…owner-word-quiet-window-choking-cleanup-cb6772e0`), after "reduce cpu
usage" (2026-10-10, `…owner-word-six-answers-b7c41e09`). Behind him, every agent hop that runs `npm test`
several times.

*Pain*: inside vitest, production code costs **~5x the CPU it costs under plain `node`**, for the same work.
- `ABC-147` `A2`, paired, interleaved, digests equal on 10 of 10 pairs: **5.09x (4.93–5.38)** on
  `src/engine.test.ts`'s workload and **5.03x (4.95–5.18)** on `src/search.test.ts`'s (`…a6122481`).
- `ABC-085` read **~4.3x** on one `chooseMove`, the same 145 765 nodes, **under both `threads` and `forks`**
  (`RUN.txt` item 4). So the pool type is already ruled out as the cause.
- Production code under `src/` is **42.9 %** of the lane's sampled CPU (`A1`, `…7769faa0`).
- **R, the CPU that removing the factor could recover: 34.2 % of lane CPU (9.6 s of 28.10 s), band 29.7–35.8 %;
  26.0 % at the cold-call edge** (`A3`, uncapped, 7 workers). That is an estimate and a ceiling, not a cut.
- **`RISK-ABC147-02` (Medium, owned here):** the ratio was read on 2 files that hold 14.52 % of sampled CPU,
  about a third of (i-w). If the factor held only there, R would be **11.65 %** (lower edge 10.63 %), the
  middle arm. The page's rule does not allow that reading, but it is why **this ticket's bar is a measured
  lane-CPU cut, never R** (`L1`).
- **The cause is `UNKNOWN - verify`.** No A/B on it has been run.
- `ADR-0040`'s worker cap cannot reach it: the cap limits how many workers run, and the factor is per node
  inside one worker (`ADR-0040` addendum, "Does the vitest runner's ~4.3x … change any of this? No").

*Value*: a lever about twice the size of `ABC-144`'s (K3: −16.48 %, `…a898a14a`), and it stacks on it. CPU
that is never spent is heat that is never made, which is the half of "choking" the cap only partly answers.

## Scope

1. **Diagnosis first (Architect/Design).** Find out why the factor is ~5x, one candidate at a time, on
   `ABC-147`'s own paired workloads (`D1`, `D2`). The candidates to start from, all `UNKNOWN - verify`:
   - **C1, transform and source maps:** what vitest's module transform does to a `src/*.ts` file (and the
     source maps it attaches), against Node's own type stripping;
   - **C2, worker thread flags:** the `execArgv`, environment and limits the runner gives a worker, against
     a plain `node` process;
   - **C3, module interop:** how a call from one `src/` module into another is resolved at run time under
     the runner (`ABC-085`'s guess: import indirection in hot paths).

   The Architect may add candidates, declared before the first graded run.
2. **A ruling (Architect/Design, `D3`):** an ADR, or an addendum, that names the cause found, the one setting
   that removes it, how it composes with `ADR-0040`, and the pin that holds it.
3. **The lever (Software Engineer):** apply the ruled setting and its pin.
4. **The readings (Security/NFR, `L1`–`L4`):** base and head of the full lane in a no-other-hop window, with
   `ABC-144`'s instrument.

## Out of scope

- **`isolate: false` in any form**, and any setting that changes the isolation mechanism (`pool: "vmThreads"`,
  `"vmForks"`). `ADR-0008` decision 7.
- **Re-ruling `k`.** `ADR-0040` (k = 3, accepted) stands. If this lever changes the frontier, re-reading it is
  a separate question for the owner.
- **Changing `src/` to dodge the runner** (restructuring production modules for the test runner's sake), and
  **changing test content to save CPU** (`ABC-144` § Out of scope; R-3 is the owner's). If `D3` finds that only
  one of these removes the factor, the ticket stops there (`D3`).
- **`ABC-146`'s verdict route.** Plain `node` already pays no factor there. This ticket does not re-open it.
- **The `*_DEEP` lanes as a target.** They are checked for no regression only (`L5`).
- **A CPU level.** CPU stays reported (R-1, `ADR-0040` d6).

## Acceptance (Given/When/Then)

**Probe rules for `D1`–`D2` and `L2`** (as `ABC-147` `A2`): `ABC-147`'s probe scripts and workloads E and S,
reused from `.grugops/context/ticket-to-pr-ABC-147/probe/`; new probe files only under
`.grugops/context/<task>/probe/`; paired and interleaved; one warm-up call, then the median of 5 timed calls;
**a pair whose output digest differs between the two sides is void, not averaged**. load1 and
`com.apple.system.thermalpressurelevel` are logged before every process; a process at load1 > 8 is recorded
and not used.

- **`D1` (the factor, re-read at the base).** **Given** the base tree, **when** E and S run under `node` and
  under vitest, **n ≥ 5 pairs per file**, **then** the ratio vitest ÷ `node` is reported per file as median
  (min–max).
  - **A third workload, for `RISK-ABC147-02`:** one call from a default-lane file outside E and S whose
    bucket-(i) CPU is mostly `moves.ts`/`legal.ts` (for example `src/perft.test.ts`, `ABC-147`'s rank 4.5),
    named in the method before it runs, read the same way. Its ratio is reported. It is not a stop rule: it
    tells the Architect whether the factor reaches the rest of (i-w), and `L1` settles the risk.
  - **Stop rule, pre-registered:** if the lowest pair on E or S reads **below 1.67x**, the ticket goes back to
    BA/PM before `D2`. (At 1.67x, `ABC-147`'s formula at its lowest share, 37.27 %, gives R = 15 %. The review
    derived the same break-even, `…ff01ca7a`.)
- **`D2` (the cause: one candidate at a time).** **Given** the candidates declared in a committed method
  file before the first graded run, **when** each is varied **alone** on the vitest side, with the `node`
  side unchanged, n ≥ 5 pairs per file, **then** a table reports, per candidate and file:
  - the ratio, median (min–max);
  - **the share of the excess it removes**, (r_base − r_cand) ÷ (r_base − 1), with r_base from `D1`.

  A candidate **explains** the factor when it removes **≥ 50 % of the excess on both files**. If none does,
  pairs of candidates may be tried, declared before they run. If still none does, the cause stays
  `UNKNOWN - verify` and the table is the evidence.
- **`D3` (the ruling).** **Then** the Architect records, in an ADR or addendum:
  - the cause, or `UNKNOWN - verify` with the `D2` table;
  - **one setting**, read from `D2`, that is a value in `vitest.config.ts`, in the `test` script, or a
    dependency version. Nothing under `src/`, and no test content;
  - how it composes with `ADR-0040` (`L5`), and whether `ADR-0035`'s recorded floors `F` carry over
    (as `ADR-0040` d4 did);
  - the pin that holds it.

  **Split rule, pre-registered:** if no such setting exists, **no lever is built here.** The ticket closes on
  `D1`–`D3`, and the ruling goes to BA/PM with the table. A `src/` or test-content route is a new ticket and
  the owner's call.
- **`L1` (CPU goes down by a number — the bar).** **Given** base = the tree with `ABC-144` merged
  (`maxWorkers: 3`) and head = base + the ruled setting and its pin only, **when** the full lane is read
  with `ABC-144`'s instrument (`ADR-0035` d2 harness, `.grugops/context/design-ABC-144/probe/lane144.mjs`:
  three out-of-tree trees with an identity twin, `npm test`, n ≥ 8 scored rounds, rotated, round 0 discarded,
  unprofiled), **then**:
  - the twin is admissible (`ADR-0035` d1) and its CPU R is ≤ 15 % of base CPU;
  - **head's paired median CPU delta is ≤ −15 % of base's median CPU**, the same form as `ADR-0040` d2.
  - **The bar is this measured lane CPU, never R** (`RISK-ABC147-02`). R, the `D1`–`D2` ratios and any
    profile share are never quoted as `L1`.
  - **Expectation, not the bar:** `ABC-147`'s band (26.0–35.8 %) was read at 7 workers. At 3 it is
    `UNKNOWN - verify`, and the 2-file extrapolation allows as little as ~11.7 %.
  - **This is `ABC-147` G4's independent re-measure.** `L1` and `D1` are new runs by other roles, not quotes
    of `ABC-147`'s numbers.
  - **If the setting misses 15 %,** it does not merge. The `D2` table and the `L1` reading go to the owner.
    **The number is never weakened silently.**
- **`L2` (the cut came from the factor).** **Given** head, **when** `D1`'s probe re-runs, **then** each file's
  median ratio is **below the lowest pair `D1` read at base for that file**, and the digests still match
  `node`. The residual factor is reported.
- **`L3` (the wall does not rise).** **Given** `L1`'s readings, **then** head's paired median wall delta is
  **≤ + the twin's wall R** (no rise beyond noise), and head's median wall + twin wall R is **≤ W** (10 s, or
  `NFR-008`'s `W_new` if the owner has accepted one).
- **`L4` (heat, reported — the owner's "generating heat").** **Given** `L1`'s window, **then**
  `thermalpressurelevel` is logged before and after every run, and the count of runs at level ≥ 1 is reported
  for base and head. **There is no bar.** The level is system-wide, and `CPU_Speed_Limit` does not exist on
  this M3 (`ADR-0040` addendum), so it is never written as a heat reading it is not. If head reads level ≥ 1
  on more runs than base, it goes to the owner.
- **`L5` (composition and fences).**
  - **`ADR-0040`'s pin passes at head unchanged** (`pool` `"threads"`, `maxWorkers` 3, `fileParallelism` and
    `isolate` true, `poolOptions` undefined, the env may lower and never raise). If the ruled setting needs a
    key that pin forbids (for example `poolOptions`), `D3` amends `ADR-0040`, and the pin's reds r1, r2, r3
    and r3b are shown red again on a scratch copy.
  - **The lever's own pin:** a value check in the default lane that turns red when the setting is removed,
    shown on a scratch copy. **No wall-clock or CPU assertion is added.**
  - `isolate` is `true` in the resolved configuration. **≥ 20 consecutive green `npm test` runs at head**,
    each with every `*.nfr.test.ts` passing (`ADR-0008` d8: a runner change).
  - File count equals base. Test count equals base + the pin's tests, declared before any reading. Skips 0.
  - **0 production lines:** `git diff --name-only <base> | grep -v '\.test\.ts$' | grep '^src/'` is empty.
  - If the `test` script changes, the `ABC-042` `A10` byte pin and the `run-bounded.js:10` quote follow.
  - Each `*_DEEP` lane collects the same files and tests as base and exits 0. Its wall is reported. A lane
    whose result rests on a wall-clock budget may read differently because the engine runs faster under
    the runner. That difference is reported, routed through the Orchestrator, and **never fixed by moving a
    baseline in this ticket** (`PUZZLE_DEEP`'s baseline moves only in its own commit).
- **`L6` (manners and the profiler).**
  - `L1`–`L4` run only in a no-other-hop window the Orchestrator schedules. Never during `ABC-146`'s verdict
    run.
  - `D1`, `D2` and `L2` read paired ratios. They need no quiet window, and they never run inside one.
  - **Profiler caveat (`…144c6b5d`):** under `NODE_OPTIONS=--cpu-prof`, **5 of 18** profiled lane runs hit
    `run-bounded.js`'s 60 s bound (exit 124), against **0 of 18** unprofiled. The cause is `UNKNOWN - verify`.
    A hung profiled run is void, not a reading. **No `L` reading is profiled** (the profiler adds ~16.6 %
    CPU). Any hop that profiles the lane here logs its own hang rate and **never raises the 60 s bound
    silently** (`RISK-ABC147-01`, owner QE/E2E).

## Dependencies

- **`ABC-147`'s review exit — MET 2026-10-11.** Security/NFR, PASS_WITH_GAPS, arm confirmed (`…ff01ca7a`);
  merged `9ac44156`, `Done`. Its probe scripts are on the wave tip. `D1` checks the ratio again either way.
- **`ABC-144` merged — for `L1`–`L5` only.** The base must carry `maxWorkers: 3`. `ADR-0040` d5's straddle rule
  applies: a base before that merge and a head after it is not a reading. `D1`–`D3` may run before it merges.
- **A no-other-hop window for `L1`–`L4`**, the Orchestrator's. It is not `ABC-144`'s Window B, which reads
  `ABC-144`'s own head.
- **`ABC-149`, if the ruled setting is a `vitest` or `@vitest/*` major version** (`RISK-ABC143-01`: the bump
  breaks the result-file reporter, silently on 4.x). Then `ABC-149` merges first.
- **Readings in flight on other tickets** (`ADR-0035` floors `F`, narrow `N8-LANE` sets) move with this
  setting, as they did with the cap. `D3` says which carry over.
- **`ABC-146`: none, either way.**

## Security / NFR triggers

- **`NFR-008`:** CPU is reported (R-1); `L1` is a ticket target, not a level. The wall level is W (`L3`).
- **`NFR-001`, `NFR-005`, `ABC-025` `N1`:** their spied call-count guards need isolation. `L5`'s 20-run screen
  covers them.
- **`N8-LANE`:** a count pin. 0 test files if the pin extends an existing guard, + the pin's declared tests,
  0 spawns.
- **Security: triggered only if `D3` rules a dependency change.** Then Security/NFR reviews the lockfile diff,
  the new version's licence and its install scripts. A config value alone has no input surface and no
  network: not triggered.

## Test notes

1. **Commit the `D2` method and candidate list before the first graded run.** A candidate chosen after seeing
   numbers is a choice of numbers (`ABC-147` test note 1).
2. **The digest check is the floor.** A faster run that does different work is not a faster run.
3. **One candidate at a time in `D2`.** A combined change that reads well is a lever, not a diagnosis.
4. **Do not read the runner's own bucket as the overhead** (`ABC-147` test note 3). Cost paid inside a
   production function is billed to that function.
5. **Every reading lives in the notes, with its machine, load1, thermal level and commit**, never in an
   assertion.
6. **Mandatory gates:** lint, typecheck, build, `npm test`. Then the QE hop, then `In Security/NFR` for
   `L1`–`L4`.

## Size and priority

**`M`.** Like `ABC-144`: a diagnosis of 3+ candidates × 2 files × n ≥ 5 pairs (minutes each), one ruling, one
setting and one pin, a window of 3 trees × n ≥ 8, a 20-run screen and the `*_DEEP` lanes. Most of it is
machine time.
- **Not `S`:** the window and the screen alone are ABC-144-sized.
- **Not `L`:** one setting, no test content, no production code.
- **Considered and not split:** a diagnosis ticket and a lever ticket. The split rule in `D3` closes the
  ticket at the ruling when no setting exists, so no long chain hides behind it.

**`P1`, pre-registered** (`ABC-147` `A4`) and the owner's goal.
- **Not `P0`:** nothing is broken. The lane is green and under its wall level.
- **Not `P2`:** the arm fixed `P1` before the reading, and R's lower edge (29.7 %) is about twice the 15 % bar.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: **`Ready`**, then straight to **`In Design`**
for the Architect's `D1`–`D3` (`ABC-147` is `Done` with its arm confirmed; In Design WIP allows it).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a ~5x factor with equal digests; R 34.2 % (band 29.7–35.8 %); the owner's "choking cpu and generating heat" |
| 2 | scope and out-of-scope clear | **✅** diagnosis, ruling, one setting, readings; isolation, `k`, `src/`, test content and `ABC-146` fenced off |
| 3 | INVEST-shaped | **✅** one setting; negotiable on the owner's fork in `L1`; a pre-registered split in `D3` |
| 4 | acceptance testable and measurable | **✅** ratios with digests on 3 workloads, ≥ 50 % of the excess, ≤ −15 % **measured** paired CPU (never R), wall ≤ + twin R and ≤ W, 20 green runs, equal counts, red-on-removal pins |
| 5 | dependencies known | **✅** `ABC-147`'s review (met), `ABC-144`'s merge for `L`, a window, `ABC-149` on a major bump; `RISK-ABC147-01`/`-02` and G4 carried |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` ≤ W; −15 % CPU; count pin; Security only on a dependency change |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `M`, machine-time heavy |
| 9 | priority assigned | **✅** `P1`, pre-registered |
| 10 | no major unresolved blocker | **✅** `D1`–`D3` can start now; `ABC-144`'s merge gates only `L1`–`L5` |

Column moves are the Orchestrator's.
