---
id: ABC-151
title: "Heat: the owner picks 2 test workers. Lower the lane's cap 3 → 2, re-pin it by value, and read the wall and the heat at k = 2"
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-151 — `test.maxWorkers` 3 → 2 on the owner's word, with the pin, the record and one width-1 reading following it

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-k2-vitest41`), on the owner's word
> of 2026-10-11 (note `.grugops/context/wave-2026-09-25/notes/…fbbdde16`, item 3, verbatim):
> *"Heat 2 workers is fine"*. It answers the heat question `ABC-144` Window B sent back to him.
>
> **This hop measured nothing.** Every figure is cited from `ABC-144`'s Window A or Window B, from
> `ADR-0040` and its addendum, or is labelled as arithmetic.

## Problem

*User*: the owner at the fanless MacBook Air M3 (Mac15,13, 4 Performance + 4 Efficiency cores) while
`npm test` runs, plus every agent hop that runs it several times.

*Pain*: **heat at k = 3.** In `ABC-144` Window B's warm, back-to-back arm, `thermalpressurelevel` read
**1 (moderate)** from the 21st run on, and 13 of 54 reads were at level 1. Window B could not separate
k = 3's own heat from the heat of the uncapped arms beside it (`ABC-144` § Security/NFR, `…1ff56629`).
`RISK-ABC144-HEAT` is the owner's, and he answered it with k = 2.

*What k = 2 is expected to cost and buy* (Window A, `…a898a14a`, read against the **7-worker** base):

| arm | paired CPU vs 7 workers | warm wall median |
|---|---|---|
| K3 (today) | −16.48 % | 7.22 s |
| K2 | −22.71 % | 8.23 s |

- **Arithmetic, not a reading:** K2 against K3 is 0.7729 ÷ 0.8352 − 1 ≈ **−7.5 % CPU**, at about **+1.0 s
  wall**.
- At Orchestrator width 3, the cap holds up to 6 workers on 8 cores. That is also arithmetic.

*Value*: less heat on the owner's machine, at a wall he has already priced as "fine".

## Scope

1. **Architect/Design: an `ADR-0040` addendum, with no readings.** It records:
   - the owner's word, verbatim and dated;
   - k = 2, which is the owner's pick for heat and not decision 2's rule;
   - the literals that follow under decision 3 and the addendum's Rollback;
   - decision 4's threshold at k = 2.
2. **Software Engineer: the build.**
   - Set `vitest.config.ts` `test.maxWorkers: 2`.
   - Change the `ABC-144` `A7` pin in `src/cli.test.ts` to 2 (its title, its `toBe`, its env bound, and its
     comment).
   - Update the config's header paragraph so it says why the value is 2.
3. **Security/NFR: one width-1 window** (`A3`–`A5`).
4. **AGENTS.md Scribe:** the worker-cap line says 2.

## Out of scope

- **Any other runner setting:** pool, `isolate` (`ADR-0008` d7), `fileParallelism`, `poolOptions` and
  `minWorkers`. **The vitest version** is `ABC-152`'s.
- **Re-running `ADR-0040` decision 2's frontier.** The owner picked the point.
- **A CPU level.** CPU stays reported (R-1, `ADR-0040` d6).
- **Moving, skipping or deleting tests.** That is R-3.
- **`ABC-146`, `ABC-095` and `ABC-096`.** Nothing on those rows changes. `ABC-146`'s verdict runs under
  plain `node`, and `src/ladder.test.ts` is one file on one worker under any cap (`ADR-0040` addendum d5).

## Acceptance (Given/When/Then)

**Instrument for `A3`–`A5`:** `ABC-144`'s, as it stands.
- The harness is `.grugops/context/design-ABC-144/probe/lane144.mjs` (`ADR-0035` d2).
- **base** = the wave tip with k = 3; **head** = base + this ticket; plus an identity twin.
- `npm test`, n ≥ 8 scored rounds, rotated, round 0 discarded, unprofiled.
- File and test counts are asserted on every run. load1 and `thermalpressurelevel` are logged before and
  after every run. The `pmset -g therm` column is kept only as the record that it is empty.
- The window is width 1 (no other hop runs).

- **`A1` (the setting).** **Given** head, **then**:
  - `vitest.config.ts` has `maxWorkers: 2`, `pool: "threads"`, no `isolate` key and no `poolOptions`;
  - `resolved-workers.mjs` reads **`effectiveWorkers: 2`** at head and 3 at base, with `isolate: true`.
- **`A2` (the pin moves with it, and is armed).** **Given** head, **then** the `ABC-144` `A7` pin asserts:
  - `toBe(2)`;
  - `toBeLessThanOrEqual(2)` for `VITEST_MAX_THREADS` and `VITEST_MAX_FORKS`;
  - "2" in its `describe` and `it` titles.

  **On a scratch copy**, each of the following is shown **red**:
  - r1: delete the cap;
  - r2: add `isolate: false`;
  - r3: `VITEST_MAX_THREADS=8`;
  - **r3b: `VITEST_MAX_THREADS=3`**. This is the new boundary that a stale `≤ 3` would let through;
  - `maxWorkers: 3`.

  `VITEST_MAX_THREADS=2` and `=1` stay **green**. No timing or CPU assertion is added.
- **`A3` (the wall stays inside W).** **Given** the window, **then** head's warm median wall + the twin's wall
  R is **≤ 10 s** (`NFR-008`'s W).
  - **Expected (not the bar):** about 8.2 s (Window A K2).
  - **Cooled reading, owed only on a narrow margin.** If head's warm median + R is **> 9.0 s**, the cooled
    state is read too, with a 90 s idle gap and its own twin, as in `ABC-144` `A4`. Both states must then be
    ≤ W.
    - **Why 9.0 s:** at k = 3 warm was the binding state (cooled ÷ warm = 0.939, Window B). `ABC-111` found
      that this factor moves with parallelism, so it is re-read only where the margin is under 10 %.
  - **Every single run over 10 s is listed,** even when the median passes. `RISK-ABC144-STALL` had one at
    12.04 s.
  - **A head over W does not merge.** It waits in `In Security/NFR` for the owner's word.
- **`A4` (CPU, reported, with its direction checked).** **Then** head's paired median CPU delta against base
  is reported with its interval.
  - **Expected:** about −7.5 %.
  - **There is no 15 % bar.** The owner chose k for heat, not CPU.
  - **If the interval does not lie wholly below 0,** the ticket holds in `In Security/NFR` for the owner's
    word: k = 2 would then cost wall and buy nothing measurable on CPU.
- **`A5` (heat, reported, with no bar).** Two **head-only, back-to-back** sequences of **27 `npm test`
  runs each**. That is Window B's warm-arm count.
  - The k = 2 sequence (head) runs first, then the k = 3 sequence (base).
  - Each sequence starts only after `thermalpressurelevel` has read 0 on 4 consecutive 15 s samples.
  - `thermalpressurelevel` is read before and after every run, with a 15 s sampler running alongside.
  - **Reported per sequence:**
    - the run index of the first read at level ≥ 1;
    - the count of reads at level ≥ 1, out of 54;
    - each run's wall and CPU.
  - **If k = 2 reaches level ≥ 1 no later than k = 3, and on no fewer reads, that goes to the owner.** In that
    case k = 2 did not buy the heat he asked for.
  - The level is system-wide and is not a clock speed. It is never written as more than that, and "no speed
    limit was observed" is never written (`ADR-0040` addendum).
- **`A6` (no guard disarmed, nothing moved).** At head:
  - `isolate` is `true` in the resolved configuration;
  - **≥ 20 consecutive green `npm test` runs**, each with every `*.nfr.test.ts` file passing (`ADR-0008`
    d8: a scheduling change). `A5`'s 27 head runs count toward the 20 if they are consecutive, all green,
    and log that the `*.nfr` files passed;
  - the file count and test count **equal base** (the pin changes literals and adds no `it`), with 0 skips;
  - each opt-in lane (`PERFT_DEEP`, `SEARCH_DEEP`, `ENGINE_DEEP`, `INPUT_DEEP`, `ZOBRIST_DEEP`,
    `PUZZLE_DEEP`, `CLI_DEEP`, `LADDER_DEEP=1`) collects the same files and tests as base and exits 0. Its
    wall is reported, not bounded;
  - **0 production lines:** `git diff --name-only <base> <head> | grep -v '\.test\.ts$' | grep '^src/'`
    is empty.
- **`A7` (the record follows the number).** **Then**:
  - the `ADR-0040` addendum exists as in § Scope 1. It states decision 4 at k = 2: sets of **≤ 2 files** carry
    their floors `F` over, and larger sets and the full lane are re-read. The addendum confirms whether any
    recorded `F` moves. On the addendum's own list (`src/cli.test.ts` 1 file, `history-pane.nfr` 1 file,
    the two-file set 2 files), none should;
  - `vitest.config.ts`'s header paragraph names the owner's pick and the addendum;
  - `AGENTS.md`'s worker-cap line reads `test.maxWorkers: 2` and `VITEST_MAX_THREADS` ≤ 2, and the file stays
    **≤ 24,576 B**;
  - `NFR-008`'s row is unchanged unless `A3` goes to the owner.

## Dependencies

- **Architect's addendum first** (`In Design`). The pin's comment cites it.
- **The no-other-hop window for `A3`–`A5`**, scheduled by the Orchestrator. It never overlaps `ABC-146`'s
  verdict run.
- **`ABC-152` merges after this ticket.** Both edit `vitest.config.ts` and the `A7` pin. `ABC-152`'s base
  carries k = 2.
- **`ADR-0040` d5, the straddle rule.** A paired reading on another ticket whose base and head sit on
  opposite sides of this merge is not a reading. Rebase first.

## Security / NFR triggers

- **`NFR-008`:** wall ≤ W = 10 s (`A3`); CPU is reported (`A4`).
- **`NFR-001`, `NFR-005`, `ABC-025` `N1`:** covered by `A6`'s 20-run screen.
- **`N8-LANE`:** 0 test files, 0 tests and 0 spawns. Only the literals change.
- **`RISK-ABC144-HEAT`** (owner Olger Oeselg) gets its first separable reading (`A5`).
- **Security: not triggered.** This is a config value: no input surface, no dependency, no network.

## Test notes

1. **Every reading lives in the notes**, with its machine, load1, thermal level and commit. None is an
   assertion.
2. **`A5`'s order is fixed (k = 2 first) and recorded.** Do not re-run a sequence to get a better one.
3. **`A2` reads the cap from the resolved configuration**, never from a process count under load.
4. **Mandatory gates:** lint, typecheck, build, `npm test`. Then the QE hop, then `In Security/NFR`.
5. **UAT:** the zero-production-lines waiver applies if `A6`'s diff check is empty.

## Size and priority

**`S`.** One literal in the config, three literals in the pin, one addendum, one AGENTS.md line, and one
window: about 2 × 9 runs paired, plus 2 × 27 back-to-back runs, plus the opt-in lanes once.
- **Not `XS`:** the window and the 20-run screen are machine time that has to be scheduled.
- **Not `M`:** there is no frontier and no design choice to make.

**`P1`.** Heat is half of the owner's stated "choking cpu and generating heat" (`ABC-144`/`ABC-150`, P1), and
`ABC-152` queues behind this ticket.
- **Not `P0`:** nothing is broken.
- **Not `P2`:** he answered it by name today.

## Design

Architect/Design, 2026-10-11 (subtask `design-ABC-151`): **`ADR-0040` addendum 2**, which governs as written. No
owner word is owed for it. The literals, the reds and decision 4 at k = 2 are in the addendum. So is the window's
fixed step order: warm paired → `A5` k = 2 → `A5` k = 3 on the base tree → cooled if owed → lanes. **Nothing
was measured.** Notes: `.grugops/context/design-ABC-151/notes/` (`…5c4c4ef2`, `…6cc7b91d`).

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: **`Ready`, then straight to `In Design`**
for the Architect's addendum (In Design WIP 0/2).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the owner's verbatim word; Window B's level-1 heat at k = 3 |
| 2 | scope and out-of-scope clear | **✅** one literal; the frontier, the pool, `isolate`, the version and R-3 are fenced off |
| 3 | INVEST-shaped | **✅** independent of `ABC-152` (which follows it); testable by `ABC-144`'s instrument |
| 4 | acceptance testable and measurable | **✅** resolved 2; five armed reds; wall + R ≤ 10 s; CPU interval below 0; heat counts out of 54; 20 green runs; equal counts |
| 5 | dependencies known | **✅** addendum first, a window, `ABC-152` after, the straddle rule |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` W; 20-run screen; count pin |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** the owner has answered; nothing else is open |

Column moves are the Orchestrator's.
