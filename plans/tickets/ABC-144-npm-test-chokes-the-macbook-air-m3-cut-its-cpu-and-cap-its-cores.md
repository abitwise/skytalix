---
id: ABC-144
title: "`npm test` chokes the MacBook Air M3 — cut the default lane's CPU and cap the cores it holds, and let the wall rise only to a number the owner accepts"
status: backlog
column: Backlog
size: M
priority: P1
epic: —
feature: —
---

# ABC-144 — reduce `npm test`'s CPU load on the reference M3, with the wall allowed to rise "a bit", to a number

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-batch-2026-10-11`, Workflow 07),
> on the owner's word of 2026-10-10 (note `…owner-word-six-answers-b7c41e09`, answer 1, verbatim):
> *"10s limit can be increased a bit, i have issues that vitest is choking the macbook air m3, reduce
> cpu usage"*.
>
> **The routing is the owner's**, as the Orchestrator mapped it:
> - **Security/NFR** proposes the new wall number from fresh readings;
> - **Architect/Design** owns the pool and worker settings;
> - `isolate: false` stays forbidden (`ADR-0008` decision 7).
>
> **This hop measured nothing.** Other agents were loading the machine. Every figure below is
> cited with its source and date.
>
> **`ABC-111`'s surviving trigger is folded in as `A4`.** See § Dependencies.

## Problem

*User*: the owner, at the keyboard of the reference machine while `npm test` runs. Behind him are
every agent hop, which runs `npm test` "several times per hop" (`NFR-008` Applies-to), at
Orchestrator width 3.

*Pain*: **vitest saturates the MacBook Air M3** (Apple M3, Mac15,13, 8 logical cores; a MacBook Air
has no fan). The owner's word is "choking". What is on record:
- **The lane costs ~25 s of CPU for ~7 s of wall.** That is 24.86 / 26.04 s CPU against 6.52 /
  7.16 s wall (`ABC-084` runs 1 and 3, load1 median 7.1 / 7.5, Node v26.11.0; `NFR-008` row,
  `ADR-0035` § Context). Arithmetic gives an average **3.6–3.8 cores busy for the whole run**.
- **Today's runner uses up to 7 workers on 8 logical cores** (`ABC-111` page, 2026-08-19: "8 logical
  cores, 7 workers"). That is vitest's default, and `vitest.config.ts` sets no cap.
- **At width 3, three concurrent hops can hold up to 21 workers on 8 cores.** That is arithmetic
  from the default, not a reading. QE's `ABC-142` hop logged load1 6.98–14.16 with two other agents
  running `npm test` in parallel (`…298ed173`).
- **CPU has had no level since R-1.** It is REPORTED, not gated (`ADR-0035` decision 6, accepted
  2026-10-10). Nothing on the board pushes it down, and it grew 14.9 s → ~25 s in three weeks
  (`ADR-0035` § Alternatives).

*Value*: the owner's machine stays usable while the gate runs. Every hop's inner loop costs less
machine. The owner has priced this: he allows the wall to rise "a bit" to get it.

## What is already established — read before designing

| lever | effect on record | status |
|---|---|---|
| `isolate: false` | −30.7 % to −36.5 % CPU | **FORBIDDEN** (`ADR-0008` decision 7). Green in 4 of 21 runs; it breaks the spied call-count guards of `NFR-001`, `NFR-005` and `ABC-025` `N1`. The config file's header says why |
| `--no-file-parallelism` (1 worker) | **−30.1 % CPU, 2.4x wall** | measured 2026-08 on a smaller tree (`NFR-008` row). The one recorded point on the CPU-versus-wall frontier |
| `pool: "threads"` with isolation kept | −7.3 % / −7.7 % CPU, −14 % / −23 % wall | **ADOPTED** 2026-08-13 (`ADR-0008` addendum). The current setting |
| fewer test files (R-3, opt-in lanes) | ~40 % of default-lane CPU to close ~10 s | **out of scope here**; the owner chose R-1, not R-3, on 2026-10-10, and moving tests is his call |

**"Quiet" cannot be bought on this machine.** The measuring harness alone lifts load1 above 1.0
(`ABC-108` `A1`), and `ADR-0035` rejected gating on load. In this ticket, **"fresh quiet-machine
readings" means a window with no other agent hop running**. The Orchestrator runs width 1 for it.
load1 is logged before every run and is not gated. R-1's own condition, load1 ≤ 8, still applies
to the wall reading.

## Scope

1. **Architect/Design** measures the CPU-versus-wall frontier of the runner settings and rules one
   setting in an ADR. The settings are the worker cap, the pool, and file parallelism, **with
   `isolate` kept `true`**. The ADR names the setting, why it was chosen, and the pin that holds it
   (`A5`).
2. **Software Engineer** applies the ruled setting. It goes in `vitest.config.ts`, or in the `test`
   script if the ADR says so. If it goes in the script, the `ABC-042` A10 pin and the
   `run-bounded.js:10` quote follow, as on `ABC-142`.
3. **Security/NFR** takes fresh base and head readings of the full lane in that window, and
   **proposes `W_new`**, `NFR-008`'s new wall level in seconds, for the owner to accept. **The owner
   moves the level. No agent does.**
4. **`AR-N8SPAWN-DRIFT`'s discharge point** *(folded 2026-10-11 from Architect/Design `…36088a35`,
   `ADR-0017` § Pointers 2026-10-11; it moved here when the owner dropped `ABC-108`)*.
   - In the same window, read `src/cli.test.ts`'s CPU on its narrow set against its last admissible
     base reading.
   - **If it reads within its `F` = 1.097 s, `AR-N8SPAWN-DRIFT` is DISCHARGED for that tree.**
   - **If it reads over `F`,** check each of its 27 children against its criterion's priced shape
     (`T2`: the substitution hook present, not the real engine). Any child that grew is a finding
     against the hop that grew it.
   - A discharge on one tree does not close the risk for later trees.

## Out of scope

- **`isolate: false`, in any form** (`--no-isolate`, a per-project override, a "just for this
  file"). `ADR-0008` decision 7.
- **Deleting, skipping, moving to an opt-in lane, or merging any test file or test.** That is lever
  R-3, a different ticket and the owner's.
- **Test content changes made to save CPU.** They belong to the content account, ticket by ticket.
- **Re-levelling `NFR-008`'s CPU clause.** R-1 reports CPU. Whether to level it again is an owner
  question (below), not this ticket's deliverable.
- Other machines, CI and a git remote. The reference stack is the one machine.
- The `*_DEEP` lanes as a target. They inherit `vitest.config.ts` and are checked for no regression
  only (`A6`).

## Acceptance (Given/When/Then)

**The instrument for `A1`–`A4`** is `ADR-0035` decision 2's harness shape applied to the full lane:
- three out-of-tree trees: base, head, and a `cmp`/`diff -r` identity twin;
- `npm test` as the command, which is the set `tools/grugops/lane-inventory.js` collects, `tools/`
  tests included. A `--dir src` run is one file short and is not a reading of the clause
  (Architect `…7bf3d1ce`, `ADR-0035` § Pointers P1);
- CPU = user + sys, one fresh process per run, **n ≥ 8 scored rounds**, rotated order, round 0
  discarded;
- file and test counts asserted on every run, load1 logged before every run.
- *(2026-10-11, BA/PM, `ADR-0040` addendum, note `…7974985e`.)* **Window B also logs
  `com.apple.system.thermalpressurelevel` before and after every run**, beside load1. `pmset -g
  therm` prints no `CPU_Speed_Limit` line on this M3, so that column is kept only as the record that it
  is empty, and it is never reported as a reading. A background `ABC-085` ladder verdict run
  (`ABC-146`) is another hop, and it never overlaps this window.

A reading is used only if it is admissible (the twin's median delta is ≤ 1.5 % with its sign at
chance) and it resolves the bound (twin R ≤ the bound, in its unit; `ADR-0035` decision 1). All
readings are taken in the no-other-hop window (§ What is established).

- **`A1` (CPU goes down by a number).** **Given** base and head on the reference stack, **when**
  the full lane is read, **then** head's median CPU is **≤ 0.85 × base's median**, a cut of at least
  **15 %**, and the reading resolves that delta.
  - **Where 15 % comes from.** It is BA/PM's proposal, about half of the one recorded frontier point
    (−30.1 % at 1 worker). It sits above `pool: "threads"`'s −7 %.
  - **If no setting the Architect measures reaches 15 % with the wall inside `A3`,** the
    Architect's frontier table goes to the owner. He picks the point, and his word replaces this
    number on this page, dated. **The number is never weakened silently.**
- **`A2` (the machine keeps cores free).** **Given** head, **then** the runner's resolved
  configuration holds **at most 4 test workers at once**, a fixed number that does not scale with
  the core count. That leaves at least half of the 8 logical cores free of test workers.
  - The median effective parallelism (CPU ÷ wall) is reported for base and head.
  - **4 is BA/PM's proposal.** The owner may move it from the Architect's frontier, as in `A1`.
  - *(2026-10-11, BA/PM.)* **Expected reading at head: 3 workers** (`effectiveWorkers: 3` from
    `resolved-workers.mjs`, and 7 at base). Window A ruled k = 3 under `ADR-0040` decision 2 (addendum,
    note `…7974985e`, still PROPOSED). **`A2`'s bar is unchanged at ≤ 4.** If the owner picks another
    k when he accepts `ADR-0040`, his k is the expected reading.
- **`A3` (the wall stays inside the owner's allowance).** **Given** head, **then** its median
  wall is **≤ W**.
  - **W = 10 s** (R-1, today's level), **unless the owner has accepted Security/NFR's `W_new`**
    before this merges. Then W = `W_new`.
  - **A head wall over 10 s with no owner word waits in `In Security/NFR` for that word.** It does
    not merge on a proposal.
- **`A4` (the warm/cold choice cannot flip the verdict — `ABC-111`'s trigger, folded).** **Given**
  head, **when** `A3` is read in **both** states from `ABC-111`, each with its **own** identity twin:
  - **warm, interleaved:** the row's round-0 rule;
  - **cooled:** a 90 s idle gap before each run;

  **then** both medians are ≤ W, each by at least that state's twin R.
  - The record states the **cooled/warm wall factor re-measured at head**, because the worker cap
    changes parallelism, which is where `ABC-111` found the effect.
  - It also states the **re-open trigger re-derived against W**: W ÷ that factor. That replaces
    `ABC-111`'s "8.76 s".
  - If one state lands over W, the protocol choice decides the verdict. That is recorded and goes
    to the owner. **It is never settled by picking a state.**
- **`A5` (the proposal is a number with its readings).** **Then** Security/NFR's `W_new` proposal
  states:
  - `W_new` in seconds, and as a ratio of 10 s, so the owner sees what "a bit" became;
  - base and head medians for wall and CPU in both states, with n, load1 medians and twin R;
  - the reference stack (Apple M3 Mac15,13 / 8 cores / Darwin 25.5.0 / Node v26.11.0 / vitest
    3.2.7);
  - the commit;
  - the `A4` re-open trigger as wording for the `NFR-008` row;
  - the `AR-N8SPAWN-DRIFT` result from § Scope 4: discharged, or the children that grew;
  - **if the owner levels a CPU total again** (owner question 2), the `N8-LANE` re-derivation at
    that level, by the row's own "where 5 % comes from" rule (`ADR-0035` § Pointers 2026-10-11 P3,
    Architect `…5ad29a76`). With no CPU level, `N8-LANE` stays ≤ 650 ms as a fixed number.

  The row itself is written by its owner, Security/NFR, in a catalog hop after the owner's word.
- **`A6` (no guard disarmed, nothing moved between lanes).**
  - `isolate` is `true` in the resolved configuration.
  - **≥ 20 consecutive green runs of `npm test` at head**, every one with **every `*.nfr.test.ts`
    file passing**. That is `ADR-0008` decision 8's screen for a runner change, and it applies here
    because a worker cap changes scheduling.
  - The default lane's file count and test count equal the base's on every run. Skip count is 0.
    *(2026-10-11, BA/PM, `ADR-0040` decision 3, declared before any reading:)* **the test count reads
    base + 1**, the `A7` pin's one new `it` in `src/cli.test.ts`. The file count reads base. Any other
    delta fails `A6`.
  - Each opt-in lane (`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`,
    `PUZZLE_DEEP`, `CLI_DEEP`, plus any added before this merges) collects the same files and tests
    as at base and exits 0. Their wall is reported, not bounded.
  - **Zero production `src/` lines.**
- **`A7` (the setting is pinned, by a value, never by a timing).** **Then** a check in the default
  lane fails if the worker cap is raised above `A2`'s number, or if `isolate` is set to `false`. It
  is the Architect's to name, and it may extend an existing guard. Removing the cap on a scratch
  copy turns it red. **No wall-clock or CPU assertion is added to the suite** (standing rule).

## Dependencies

- **Architect/Design ruling first — `In Design`.** The setting is the Architect's (owner's
  routing), and it amends the configuration `ADR-0008` governs.
- **A no-other-hop window for the readings** (`A1`–`A4`). It is the Orchestrator's to schedule:
  width 1 while Security/NFR (and the Architect's frontier) read.
- **The owner's word on `W_new`**, only if head's wall exceeds 10 s (`A3`).
- **`ABC-111` — FOLDED here, then dropped.** Its surviving trigger was "re-open the warm/cold
  question when a warm wall median reaches 8.76 s". This ticket will move the wall toward exactly
  that zone, so `A4` takes the trigger. `ABC-111` itself recommends `DROP` (its 2026-10-11 page
  note). The `NFR-008` row has never carried the trigger (no "8.76" in `plans/nfr-catalog.md` at
  `506550f3`). `A5` gives it a carrier.
- **Per-ticket readings in flight.** `ADR-0035` decision 3's floors `F` and every narrow-set
  `N8-LANE` reading run `npx vitest run <set>`, which reads `vitest.config.ts`. **A worker cap may
  move them.**
  - The Architect states whether the recorded `F` values carry over or must be re-read after this
    merges.
  - **`ABC-083`** (`Blocked`, with an `N8-LANE` +1.08 s CPU reading open) re-reads on whichever base
    it rebases onto.
- **`ABC-143`** — merge order only, if the setting lands in the `test` script (same pinned line).
- **`ABC-085`** — its `LADDER_DEEP` wall changes with a worker cap, and its games do not (virtual
  clock).

## Security / NFR triggers

- **`NFR-008` — this ticket's subject.** The level W is the owner's (`A3`, `A5`). CPU is reported
  per R-1, and `A1` is a ticket target, not a standing level.
- **`NFR-001`, `NFR-005`, `ABC-025` `N1`** — their spied call-count guards are what `isolate: false`
  breaks. `A6`'s screen covers them for any scheduling change.
- **`N8-LANE`** — this ticket adds at most a pin row (`A7`), 0 test files if it extends an existing
  guard, and 0 spawns. That is a count pin.
- **Security: not triggered.** It is a runner setting with no input surface, no dependency and no
  network.

## Test notes

1. **Every reading lives in the notes, with its machine, its load1 and its commit, never in an
   assertion.**
2. **Read the frontier before choosing.** The Architect reads at least: the current setting (7
   workers), caps of 4, 2 and 1, and any pool variant considered. CPU and wall go side by side for
   each. One green run is not evidence for a scheduling change (`vitest.config.ts` header). The
   mechanism and the 20-run screen are.
3. **Do not read the lane while another hop runs.** That reading fails admissibility, or worse, it
   passes it and misleads. The QE-094 run 2 at load1 9.43 was inadmissible (`QE-094-f`).
4. **`A2`'s cap is read from the resolved configuration**, not from a process count under load.
5. **Mandatory gates:** lint, typecheck, build, `npm test`. QE hop, then `In Security/NFR` for
   `A1`–`A5`.

## Size and priority

**`M`.** It needs:
- an Architect frontier (5+ settings × n ≥ 8 × 3 trees);
- one configuration change and one pin;
- Security/NFR readings in two states with twins, plus a 20-run screen;
- an owner word, possibly.

Most of the cost is machine time in a no-other-hop window, not code.
- **Not `S`:** the cooled state alone is ~3 trees × 9 runs × ~100 s ≈ 45 min, before warm or the
  screen.
- **Not `L`:** one setting and no test content.

**`P1`, the owner's.** It is his stated goal, and it costs every hop's inner loop every day.
- **Not `P0`:** nothing is broken; the lane is under its 10 s level.
- **Not `P2`:** he asked for it by name, and at width 3 the cost is multiplied.

## Owner questions (for the Orchestrator to put to him; none blocks the design hop)

1. **Are "≥ 15 % less CPU" and "at most 4 of 8 cores" what "stop choking the Air" means to you?**
   If the felt problem is heat (no fan) or lag when you switch apps, the numbers may want to differ.
   The Architect's frontier table will show the trade.
2. **CPU level.** Recommended: **no new CPU level.** `A7`'s pin holds the cap, and CPU stays reported
   (R-1). A third CPU level would repeat the 13 → 15 s arc that `ADR-0035` § Alternatives warns about.

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: **`Ready`, then straight to `In
Design`** for the Architect hop (In Design WIP allows it).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the owner's verbatim pain; ~25 s CPU for ~7 s wall; 7 workers on 8 cores; no CPU level since R-1 |
| 2 | scope and out-of-scope clear | **✅** three roles' parts; `isolate: false`, R-3, test content and CPU re-levelling fenced out |
| 3 | INVEST-shaped | **✅** independent; one setting; negotiable numbers with a stated owner fork; testable by the `ADR-0035` instrument |
| 4 | acceptance testable and measurable | **✅** ≤ 0.85 × base CPU; ≤ 4 workers; wall ≤ W (10 s or the owner's `W_new`); both states ≤ W by R; 20 consecutive green runs; equal counts; a red-on-removal pin |
| 5 | dependencies known | **✅** (+ `AR-N8SPAWN-DRIFT` discharge carried, § Scope 4) Architect first, a no-other-hop window, the owner's word only above 10 s, `ABC-111` folded, `F` floors and `ABC-083` re-reads named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` W; `A6` guards; count pin |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `M`, machine-time heavy |
| 9 | priority assigned | **✅** `P1`, the owner's goal, with both directions argued |
| 10 | no major unresolved blocker | **✅** the owner questions refine numbers on a stated fork and do not block the design hop |

Column moves are the Orchestrator's.

## Delivery

Software Engineer, 2026-10-11 (subtask `ticket-to-pr-ABC-144`). Branch `grugops/ABC-144-cap-test-workers`,
code commit `d4468fd3`, base `5ed308a8`. The detail is in `.grugops/context/ticket-to-pr-ABC-144/notes/`.

- **The setting, as `ADR-0040` and its Window A addendum rule it (k = 3).** `vitest.config.ts` gets
  `test.maxWorkers: 3`. `pool: "threads"` stays, `isolate` is not written (default `true`), and there is no
  `poolOptions`. The export is a plain object, `satisfies ViteUserConfig`, using a type-only import.
  `npm run typecheck` exits 0 on that form. One header paragraph names `ADR-0040`. `scripts.test` is unchanged.
- **The pin (`A7`).** One `it` in its own `describe` at the end of `src/cli.test.ts`. It checks:
  - pool `threads`;
  - `maxWorkers` `toBe(3)`;
  - `fileParallelism` and `isolate` are not `false`;
  - `poolOptions` is undefined;
  - `VITEST_MAX_THREADS` / `VITEST_MAX_FORKS` are ≤ 3 if set.

  It has no timing assertion.
- **Armed.** On a scratch copy each of these went red: r1 (cap deleted), r2 (`isolate: false`),
  r3 (`VITEST_MAX_THREADS=8`) and r3b (`VITEST_MAX_THREADS=4`). So did `maxWorkers: 4`,
  `fileParallelism: false`, `poolOptions.threads.maxThreads: 8` and `VITEST_MAX_FORKS=8`.
  `VITEST_MAX_THREADS=2` stays green. The env half is kept.
- **`A2` read from the resolved configuration:** `effectiveWorkers: 3`, `isolate: true`.
- **`A6` counts, from one run:** 55 files (= base) and 1729 tests (= base 1728 + 1), with 0 skipped.
  The 20-run screen is still owed.
- **Gates:** lint, typecheck, build and `npm test` all exit 0. 0 production `src/` lines.
- **No timing read.** Lane cost is **not graded**. `A1`, `A3`, `A4`, `A5` and the `AR-N8SPAWN-DRIFT`
  discharge belong to Window B (Security/NFR, width 1).
