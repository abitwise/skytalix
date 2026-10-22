---
id: ABC-199
title: "Two coverage-heavy rows time out at vitest's 5 s default under load: lighten them and keep the timeout (QE-198-a)"
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-007
feature: —
---

# ABC-199: lighten `ABC-170 A2`'s node budget and `ABC-167 A7`'s `go depth 3` step. Test-only, two files, no timeout added

> **Cut 2026-10-22 by BA/PM** (task `bapm-rule-QE-198`, records only, at `main` `147f8c82`). The ruling is in
> `.grugops/context/bapm-rule-QE-198/notes/` (decision `…479ce351`, observation `…1563f813`) and in the dated block
> on `ABC-198`'s page. This hop ran no test, took no
> timing and ran no probe. Every cost below is an estimate from published readings.
>
> **Source:** QE `…0b183705` (gap register, `QE-198-a`), `…0751bfeb` (the intermittent, 146 runs), `…1478c7fc`
> (`QE-198-b`); Orchestrator `…2c4d34bd` (interim accept). **Precedent:** the owner's word of 2026-10-19,
> *"Lighten the rows, keep cap"* (`…6e1d9b47`): "The per-test timeout is not raised. The heavy rows that timed out
> move to coarser virtual-clock steps … The same goes for any row with the same profile." `ABC-173` applied it to
> `ABC-170 A3` and `ABC-167 A5` (`48842a1f`).

## Problem

*User:* every agent hop (SE, QE, Security/NFR) that runs a coverage lane on this shared host, and the owner, who reads
their verdicts.

*Pain:* two rows are synchronous, deterministic and coverage-heavy. Under coverage plus CPU pressure they cross vitest's
5 000 ms default per-test bound and go red with `Test timed out in 5000ms`. No code is wrong when that happens.
- `src/engine.test.ts` `ABC-170 A2` row 2 (`describe` at line 1265): about 160 ms plain, 1.0–1.6 s under coverage,
  3 655 ms in one host burst (73 % of the bound). Red 3/3 at base and at head when CPU-starved.
- `src/uci-session.test.ts` `ABC-167 A7` row 1, "go depth 3 reports depth 3 on a clock where an unlimited go reaches
  depth >= 5" (line 362): about 0.33 s plain (`ADR-0046` class table), about 2.4 s under coverage, the heaviest row
  in the suite. It timed out without starvation, under concurrent load: base 1/12, head 2/12 (5 141–5 404 ms).

Each red costs a re-run and an investigation. `ABC-198`'s SE lost a red log, and QE spent 146 runs proving the red was
pre-existing. The same class stopped `ABC-173` on 2026-10-19. `QE-198-b` (`@vitest/mocker` 4.1.12) adds about 5 %
to coverage-mode CPU, which narrows the margin further.

*Value:* the two rows keep their kills and stop eating the shared host's coverage margin. The default lane gets
slightly cheaper too: an estimated ≈ −0.2 s of in-thread CPU, ≈ −0.1 s of lane wall (half, as for 2 slots). That is an estimate, not a reading, and it goes in the direction `NFR-008` and `ABC-197` need.

## Scope

Two files, two `describe` blocks, test parameters only.

| row | file | today | change |
|---|---|---|---|
| `ABC-170 A2` rows 1 and 2 (they share one `MAX_NODES`) | `src/engine.test.ts` | `MAX_NODES = 20_000` → depth 3, 20 058 nodes (`ABC-170` A2 MET) | a smaller `MAX_NODES`, chosen by the SE under A1 and A3 |
| `ABC-167 A7` row 1 | `src/uci-session.test.ts` | unlimited `go` and `go depth 3` at step 50; free depth ≥ 5 | step 100 for the unlimited `go`; the free-depth floor stays strictly above 3 (A2) |

- Step 100 is in `ADR-0046`'s set {1, 10, 100, 1 000}, under its rule: the coarsest step that keeps the row's kill
  set. This row is `ADR-0046`'s class C ("the step is a precondition"), so the precondition must still hold. Step
  1 000 is not tried: G = 3 000 ms gives 3 clock checks, which cannot reach depth 4.
- Each changed `describe` gets one comment naming `ABC-199`, `QE-198-a` and the owner's word `…6e1d9b47`, in the shape
  of `ABC-170 A3`'s `ABC-173` comment.

## Out of scope

- **Any timeout.** No per-test `timeout` argument, no `testTimeout`/`hookTimeout`, and no `vitest.config.ts` edit. The
  owner ruled "the per-test timeout is not raised" (`…6e1d9b47`). Raising it is his call, not this ticket's.
- Every other row in both files, including `ABC-170 A2` row 3 (`maxNodes: 1`), `ABC-170 A3`, and `ABC-167 A7`'s other
  rows. `ABC-171 A7`'s "go depth 3 at level 5" row is also out of scope: it is capped at depth 3 and is not heavy.
- Production code, `tools/`, `package*.json`, `AGENTS.md`, the heap caps, `maxWorkers`.
- `QE-198-b`'s cause (ruled INFO, `bapm-rule-QE-198`).
- An `NFR-008` full-lane reading. This ticket removes work. The next full-lane reading after it merges includes it.

## Acceptance criteria

**The base** is `main` at the commit this ticket's branch is cut from, after `ABC-178` has merged (see Dependencies).
**The tip** is `ABC-199`'s delivered commit. **The node census** is `deepen`'s return instrumented in scratch, as at
`ABC-173` and `ABC-177` A7. It counts nodes, not time, and it is not committed.

**Build (Software Engineer)**

- **`A1` (`ABC-170 A2` is lighter, and the abort is still a real one).** **Given** the tip's `MAX_NODES` = N,
  **when** the census reads rows 1 and 2, **then**:
  - rows 1 and 2 pass; row 1's bound is unchanged in form (`nodes ≤ N + NODES_PER_CLOCK_CHECK`);
  - row 2's reported depth d is **≥ 2**, and `limited.nodes > completedOnly.nodes` (the d + 1 iteration was entered and
    discarded, not the always-complete first one);
  - row 2's census (its three searches together) is **≤ 60 %** of the same census at base;
  - row 3 (`maxNodes: 1`), `LONG_MS` and `tickingClock(1)` are byte-identical.
- **`A2` (`ABC-167 A7` row 1 is lighter, and its precondition holds).** **Given** the tip, **when** the census reads
  the row, **then**:
  - the unlimited `go` runs at step **100**;
  - its depth floor is **≥ 5** if the step-100 census reads ≥ 5, otherwise **≥ 4**. It never goes to 3 or below. The
    row's title states the floor it asserts;
  - the capped half is unchanged: `go depth 3` gives 2 lines, and the info line reads depth 3;
  - the row's census is **≤ 60 %** of the same census at base.
- **`A3` (the kill set is kept).** **Given** each wrong build below applied to production in a scratch copy, red first
  at base, **when** the changed row runs at the tip, **then** it is red at the tip whenever it is red at base:

  | plant | wrong build | row that must stay red |
  |---|---|---|
  | K1 | `chooseMove` returns the aborted iteration's best-so-far move and score (`ABC-170` test note 2) | `ABC-170 A2` row 2 |
  | K2 | `maxNodes` is ignored, so the search never aborts on nodes | `ABC-170 A2` row 1 |
  | K3 | UCI `go depth N` is ignored (unlimited search) | `ABC-167 A7` row 1 |
  | K4 | UCI `go depth N` searches to N + 1 | `ABC-167 A7` row 1 |

  A plant that is green at base is reported and not counted.
- **`A4` (pre-registered fallback).** A row that cannot meet its ≤ 60 % census without losing a kill from A3 or its
  precondition (A1: d ≥ 2; A2: floor > 3) **keeps its base values byte-identical**. The delivery note reports it with
  the census readings. For that row `QE-198-a` stays accepted under the re-run rule in BA/PM's decision
  `…479ce351`. If both rows fall back, the ticket is reported to BA/PM to re-rule, not delivered empty.
- **`A5` (only what is named changed).** **Given** `git diff <base> <tip>`, **then**:
  - `--name-only` lists `src/engine.test.ts` and `src/uci-session.test.ts`, plus records under `plans/` and
    `.grugops/`, and nothing else;
  - no `+` line contains `timeout` (any case), and `vitest.config.ts` is unchanged;
  - every hunk in `src/` sits inside the `ABC-170 A2` or the `ABC-167 A7` `describe`;
  - the test count per file is unchanged. The sorted name lists are equal, except `ABC-167 A7` row 1's title when A2
    moves its floor to 4.
- **`A6` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0. `npm test` passes, with file and
  test counts equal to base. The skip count is 0, and `test-skip-integrity` prints `No findings.` Both coverage
  commands, as `AGENTS.md` spells them, read `numFailedTests` 0 on 2 runs of 2 each. Classify them by
  `numFailedTests`, never by rc (`QE-198-d`). `ENGINE_DEEP=1` on `src/engine.test.ts` and `UCI_DEEP=1` on
  `src/uci.real-engine.test.ts` are green.

**Gate (QE, then Security/NFR)**

- **`A7` (QE re-reads A1–A6).** QE re-plants K1–K4 at base and at the tip on its own scratch copies and re-reads both
  censuses. QE confirms A4's fallback was not taken without the readings that justify it.
- **`A8` (`N8-LANE`).** Security/NFR rules whether a CPU reading is owed for a diff that only removes search work and
  adds no row, file or spawn. If one is owed, the bound is **≤ 650 ms CPU** on each one-file set (`src/engine.test.ts`,
  `src/uci-session.test.ts`), read under `ADR-0035` D2 as amended. The expected charge is negative.

## NFR triggers

- **`N8-LANE`:** ≤ **650 ms CPU** per one-file set, if Security/NFR rules a reading owed (A8).
- **`NFR-008`** (R-1, `npm test` wall ≤ 10 s at load1 ≤ 8): **not re-read by this ticket.** The expected effect is
  ≤ 0. The estimate is ≈ −0.2 s of in-thread CPU at the ≤ 60 % census: `ABC-167 A7` row 1 0.33 s → ≤ 0.20 s
  (`ADR-0046`), `ABC-170 A2` row 2 about 0.16 s → ≤ 0.10 s (QE `…0751bfeb`). Row 1's own cost is unread
  (`UNKNOWN - verify`); it only adds to the saving. Wall ≈ −0.1 s. This is not a reading.
- **Coverage-mode margin (the point of the ticket, an estimate):** at ≤ 60 % of the census, `ABC-170 A2` row 2's
  coverage median goes from about 1.4 s to about 0.85 s (≥ 5.8× margin to 5 s), and `ABC-167 A7` row 1's from about
  2.4 s to about 1.45 s (about 3.4×). No coverage bound exists, and this ticket does not create one.
- **Security:** not triggered. Test-only, no input surface. `NFR-010` and the heap caps are untouched.

## Test notes

1. Plant K1–K4 at base **first** (red-first), then pick N and the floor. The A3 kill set decides the values, and the
   ≤ 60 % census is the target.
2. For `ABC-170 A2`, N must stay above the depth-1 iteration's nodes on Kiwipete, or row 1's `N + 1 024` bound breaks
   (the first iteration always completes). The census reads that floor.
3. A row that turns flaky or loses a plant after the change goes back to its base values alone (`ADR-0046`'s rule).
4. No timing is read by the SE. The census is node counts only.
5. **UAT:** zero production lines, so `AGENTS.md`'s standing waiver applies if the waiver probe prints nothing at
   delivery.

## Size and priority

**`XS`:** two constants and one step argument in two `describe` blocks, plus comments. The census instrument and the
`ABC-173` pattern already exist. The plants are four one-line production edits in scratch.

**`P3`:** the gap is LOW. It is pre-existing, against no criterion, and a re-run clears it. The value is a recurring
tax removed on a shared, often-loaded host, and the class has now hit two hops (it stopped `ABC-173`; it gave `ABC-198`'s SE an unexplained red).

**Epic: `EPIC-007`** (both rows pin `EPIC-007` tickets: `ABC-170` A2, `ABC-167` A7). `EPIC-007`'s page is not edited
by this cut.

## Dependencies

- **`ABC-178` merged to `main` before this ticket merges.** `ABC-178`'s B7/B8 timing hop must read a tree without this
  change, and both edit `src/uci-session.test.ts`. The build may start earlier on a branch, but the branch merges
  `main` after `ABC-178` lands and before its gate. A5's base is then that `main`.
- **`ABC-197`** (Backlog) edits the same file. If this ticket merges first, `ABC-197`'s base becomes its own branch
  point (dated note on `ABC-197`'s page). This ticket does not wait for `ABC-197`.
- Owners: Software Engineer for A1–A6; QE for A7; Security/NFR for A8.

## Owner questions

None. The owner's word `…6e1d9b47` covers "any row with the same profile". The delegation `…5aaf7cec` puts LOW-gap
delivery with the Orchestrator. No NFR bound, level or requirement moves.

## Definition of Ready

BA/PM, 2026-10-22, at `main` `147f8c82`. **Result: 10 of 10. `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ two named rows, pre-existing timeout reds at base and head (QE `…0751bfeb`); the cost per red is a re-run plus an investigation |
| 2 | scope and out-of-scope clear | ✅ two describes, two files; no timeout, no other row, no production line |
| 3 | INVEST-shaped | ✅ independent of production; valuable (removes a recurring red); small; testable by census and four plants |
| 4 | acceptance testable and measurable | ✅ d ≥ 2; floor > 3; census ≤ 60 % of base; K1–K4 red at the tip when red at base; no `timeout` on a `+` line; counts equal; coverage `numFailedTests` 0 on 2 of 2 runs |
| 5 | dependencies known | ✅ `ABC-178` merges first; `ABC-197`'s base noted |
| 6 | security/NFR triggers with a measurable target | ✅ `N8-LANE` ≤ 650 ms CPU if owed; `NFR-008` not re-read, expected ≤ 0 (estimate stated); security not triggered |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, argued |
| 10 | no major unresolved blocker | ✅ `ABC-178`'s merge orders the merge, not the build. The fallback (A4) is pre-registered |

## QE

**2026-10-22, QE/E2E (`qe-ABC-199`): PASS_WITH_GAPS.** Every gap is INFO and none blocks. QE releases `In Review` → `In Security/NFR`, where A8 is owed. The Orchestrator moves the board.

- **Where it ran:** merge `d4b2536e` (tip `8c0c5c81` plus `main` `8bd75e46`), base `08d42d01`, QE's own worktree, node_modules and scratch.
- **Notes:** `.grugops/context/qe-ABC-199/notes/`:
  - census `…b763e8a0`
  - plants `…658d4ad2`
  - A5/A6 `…7ab55568`
  - gaps `…1593ea77`
  - verdict `…be6588e4`
- **A1 MET:** N 6 000; d = 2; 6 746 > 2 538; row 2 census 35 759 → 11 221 (31.4 %).
- **A2 MET:** step 100; free depth 5, so the floor stays 5; census 55 972 → 26 276 (46.9 %).
- **A3 MET:** QE's K1, K2, K3 and K4 are red at base and at the tip. K1 is QE's own shape: the partial is played and the aborted depth is reported.
- **A4:** the fallback was not taken, and the readings justify that.
- **A5 MET:** only the two files changed; hunks sit inside both blocks; names are equal; `timeout` count in `src/` is 0.
- **A6 MET:**
  - lint, typecheck and build 0;
  - `npm test` 60 / 1 995 = base, success true;
  - skips 0, `No findings.`;
  - coverage, 2 forms × 2 runs: 0 failed;
  - ENGINE_DEEP 60, UCI_DEEP 5.
- **Gaps:**
  - `QE-199-a`: `ABC-178` is not on `main` yet. The trial merge is clean; merge after it lands and re-gate.
  - `QE-199-b`: d ≥ 2 is not asserted.
  - `QE-199-c`: the A7 floor margin is now 0 plies, and the row fails closed.
  - `QE-199-d`: K1's kill depends on the plant's shape. Move-only survives at both ends.
  - `QE-199-e`: A5's `timeout` wording also matches 2 prose lines in the notes.
- **UAT:** waived. Zero production lines, and the form is empty. A waiver is not a signature.
- **Not claimed:** no timing and no `NFR-008` reading.
