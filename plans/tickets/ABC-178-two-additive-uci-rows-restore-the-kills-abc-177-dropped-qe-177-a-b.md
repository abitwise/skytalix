---
id: ABC-178
title: "Two additive UCI rows restore the two default-lane kills `ABC-177` dropped (QE-177-a, QE-177-b)"
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-007
feature: —
---

# ABC-178: add one cross-session hold row and one dropped-token time row to `src/uci-session.test.ts`. Test-only, additive, one file

> **Cut 2026-10-20 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-rule-QE-177-ab`), at `main` `e6be5106`. This
> cut follows the owner's word of 2026-10-21, *"yes, BA/PM can rule on QE-177-a and -b"*, as the Orchestrator
> transcribed it in the brief. That is a transcription, not a stamp.
>
> **Source:** QE's open-points note
> `.grugops/context/qe-ABC-177/notes/20261020T192200Z-qe-e2e-observation-abc177-open-points-u8-u1-u7-gap-probes-02deb2e2.md`
> and its gap probes `.grugops/context/qe-ABC-177/probe/gap/` (`gp.mjs`; QP1 and QP6).
>
> **Ruling:** `.grugops/context/bapm-rule-QE-177-ab/notes/20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2.md`.
>
> **This hop ran no lane, took no timing and ran no probe.** Every millisecond on this page is an estimate taken from
> readings already published. Line numbers were read at `grugops/ABC-177` @ `f81bf03c`, which is not merged.

## Problem

*User:* the owner, and every agent hop that relies on the default lane to catch a wrong UCI session build.

*Pain:* `ABC-177` (In Review, `f81bf03c`) met every build criterion as written. But two wrong builds that the default
lane caught at base now pass the whole lane at the tip (QE `…02deb2e2`; `gp-tip-lane.jsonl`, 0/1 987 red for each):
- **QE-177-a (QP1):** `held` is hoisted to module scope, so a hold in one session leaks into the next. Before
  `ABC-177`, the U1 rows ran three sessions and compared them, and they killed QP1. The fold (A1) kept every fact
  within one session but dropped that comparison across sessions. Today no row in the lane leaves a hold unreleased
  before another session starts.
- **QE-177-b (QP6):** a `go` that drops its `depth`/`nodes`/`mate` token and has no time token has its budget G cut
  to 2 500 ms. Before `ABC-177`, the six U7 rows (step 100, `time ≥ 3 000`) caught any G on that path at or below
  2 900 ms. At step 1 000 they catch only G at or below 2 000 ms. The blind band grew from about 100 ms to about
  1 000 ms. Parity could not see this, because no frozen mutant cuts G on that path. Ruling condition 2 could not see
  it either, because it counts clock checks and 3 ≥ 2.

*Value:* both kills come back, the second one with its old 100 ms band, at an estimated **+0.08 s of lane wall**.
`ABC-177`'s rows, steps and saving stay as they are.

## Scope

One file: `src/uci-session.test.ts`. **Two new rows. The diff only adds lines.**

| row | gap | where | dialogue | step | bound |
|---|---|---|---|---:|---|
| **R1** | QE-177-a | `describe("ABC-167 A6 — infinite waits for stop")` | session 1: `["position startpos", "go infinite"]`, left holding. Then a **fresh** session 2: `["stop", "ponderhit"]` | 1 000 (U1's step) | session 1 writes no `bestmove`; session 2's `out` is `[]` |
| **R2** | QE-177-b | `describe("ABC-167 A7 — the D12 limits")`, **outside** U7's loop | `["position startpos", "go depth 0"]` | **100** | `out` has 3 lines; `out[0]` is an `info string`; `3 000 ≤ time ≤ 3 000 + 2 × 100`; `out[2]` is `bestmove <info.move>` |

- **R2 runs at a step finer than `ABC-177`'s.** U7 took 1 000; R2 takes 100. This is a new row, not a step change
  to U7. It is the only way to get the band back below 1 000 ms without moving U7. The bound has the same shape as
  A6-d1 and A5's "a bare go" (`budget ≤ time ≤ budget + 2 × step`). So it also pins the upper side, which U7's
  `≥ 3 000` never did.
- **R1 needs no finer step.** It reads no clock. Its one search is U1's, at 1 000.

## Out of scope

- **Every existing line of `src/uci-session.test.ts`, byte-identical.** This includes U1–U8 and their steps as
  `ABC-177` delivered them, the shared helpers (`dialogue`, `talk`, `rig`, `expectWithin`), and every class P/C row.
  `ABC-177`'s scope is not reopened.
- **U7 back to step 100** (about 0.9 s in-thread; `arch-lane-under-10s/probe/uci-rows.out`, 6 × 146–153 ms). It is
  rejected as too dear: one row buys the same band.
- **U8 back to step 10** (QE-177-c). BA/PM ruled it stays at 100 (the ruling note above).
- One R2 row per dropped keyword (`nodes`, `mate`). QP6 sits on the shared warn path, so one row covers the path.
  A mutant that touches only one keyword is not named by any gap.
- Every other file: production `src/*.ts`, `vitest.config.ts`, `package.json`, `AGENTS.md`, `tools/`,
  `plans/nfr-catalog.md`, and the ADRs.
- Option O3 (`UCI_DEEP`) and `F`. Those are Architect/Design's.

## Acceptance criteria

**The base** is `main` at the commit that merges `ABC-177`, with `src/uci-session.test.ts` as `f81bf03c` left it.
**The tip** is `ABC-178`'s delivered commit.

**Build (Software Engineer)**

- **`B1` (R1, the cross-session hold).** **Given** R1 at the tip, **when** it runs, **then**:
  - session 1's output holds no line starting `bestmove`;
  - session 2 is a fresh `talk` (a new session), not a continuation of session 1;
  - session 2's `out` is `[]`.
- **`B2` (R2, the dropped-token time).** **Given** R2 at the tip, **when** it runs `["position startpos", "go depth 0"]`
  at step 100, **then**:
  - `out` has exactly 3 lines;
  - `out[0]` starts `info string `;
  - the `time` of `out[1]` is **≥ 3 000 and ≤ 3 200**;
  - `out[2]` is `bestmove ${move}` of `out[1]`.
- **`B3` (additive only, one file).** **Given** `git diff <base> <tip>`, **then**:
  - `--name-only` prints exactly `src/uci-session.test.ts`;
  - `-U0` shows **no `-` line**. Every hunk only adds lines: R1, R2, and comment lines citing `ABC-178`,
    `QE-177-a` or `QE-177-b`.
- **`B4` (row count).** **Given** the vitest JSON report of the default lane at base and at the tip, **then**:
  - `src/uci-session.test.ts` reports 126 tests at base and **128** at the tip, all passed, 0 skipped;
  - the sorted base name list is a subset of the tip list, and the difference is exactly R1's and R2's names;
  - the lane's total at the tip is the base total + 2 (1 987 → 1 989 if `main` has not moved).
- **`B5` (node census, not timing).** **Given** `deepen`'s return instrumented in scratch, as at `ABC-177` A7, **then**
  the delivery note gives nodes for R1 and R2 at the tip:
  - R1 ≤ **1 000** nodes (expected 655, as U2–U6 read at `f81bf03c`);
  - R2 ≤ **26 000** nodes (expected 25 621, as the U7 rows read at step 100 in `qe-ABC-177/probe/census/census-base.tsv`).

  If either one reads more, it goes to BA/PM before the gate. The census stays in scratch and is not committed.

**Gate (QE, then Security/NFR)**

- **`B6` (the kills come back).** **Given** QE's gap-probe harness `qe-ABC-177/probe/gap/gp.mjs`, byte-copied, with
  these wrong builds, **when** each one is applied to production at the tip, **then**:

  | probe | wrong build | R1 | R2 | whole default lane at the tip |
  |---|---|---|---|---|
  | QP0 | none | green | green | 0 red |
  | **QP1** | `held` at module scope | **red** | — | **≥ 1 red** (was 0/1 987 at `f81bf03c`) |
  | **QP6** | G = 2 500 on the dropped-token path | — | **red** | **≥ 1 red** (was 0/1 987 at `f81bf03c`) |
  | **QP6-2900** | QP6 with 2 900 in place of 2 500 | — | **red** | ≥ 1 red |
  | **QP6-3300** | QP6 with 3 300 in place of 2 500 | — | **red** | ≥ 1 red |

  QP6-2900 shows the band is back to 100 ms. QP6-3300 shows the new upper bound works. QE adds the two variants to a
  scratch copy of `gp.mjs` before any tip run, and records them in the gate report.
- **`B7` (`N8-LANE`, one-file set).** **Given** `ADR-0035` D2 as amended, set `src/uci-session.test.ts`, shape
  ONE-FILE, run exactly as `ABC-177` A8 (`lane174.mjs` byte copy, 9 rounds, round 0 discarded, rotated, GAP 0,
  k = 2, CPU from `/usr/bin/time -p`), with B = `git archive` of the base and H = `git archive` of the tip, **then**:
  - the charge is ≤ **650 ms CPU**;
  - H−B CPU and wall medians are reported, with intervals. They are expected positive, at about +155 ms in-thread.
- **`B8` (`NFR-008` is not re-broken).** **Given** the tip, **when** QE reads the full lane under `ABC-177` A9's
  protocol, **then** H's `NFR-008` R-1 median wall is **≤ 10 s**. The protocol is:
  - `npm test` as spelled;
  - B and H, each with its own `npm ci`. The T/H2 twins are QE's option, not required: this ticket moves no `F`;
  - `window.mjs`, 180 s foreground, 0 foreign polls;
  - load1 ≤ 8;
  - **AC power on every scored run** (owner, `…bfdc97e5`). A battery reading is not admissible.

  Security/NFR rules on the `NFR-008` state. **If it reads > 10 s, the reading goes to the owner** (`ADR-0035` D6).
  BA/PM's recommended fallback is to drop R2 and accept QE-177-b. R1 alone costs about 4 ms. No cap, pin, bar or W
  moves.
- **`B9` (gates).** **Given** the tip, **then**:
  - lint, typecheck, unit and build are green;
  - the default lane runs with 0 skips;
  - `ABC-167` A11's M4 sweep row is green and still kills M4.

## NFR triggers

- **`NFR-008`** (R-1): `npm test` median wall **≤ 10 s** at load1 ≤ 8, on AC (B8). This ticket must not re-break
  what `ABC-177` discharges.
- **`N8-LANE`:** charge ≤ **650 ms CPU** on the ONE-FILE set (B7).
- **Cost estimate (not a reading):**

  | row | nodes | in-thread | source |
  |---|---:|---:|---|
  | R2 | 25 621 | ≈ 150 ms | the U7 rows at step 100 read 146–153 ms (`uci-rows.out`) |
  | R1 | 655 | ≈ 4 ms | ≈ 5.9 µs/node from the same rows |
  | **total** | | **≈ 155 ms** | |

  Under `ADR-0046` D3's 2-slot model (wall ≈ in-thread ÷ 2), that is **≈ +0.08 s of wall**. This is about 10 % of
  the ADR's predicted ≈ 0.8 s of headroom, and about 2.5 × `ABC-174`'s +0.03 s.
- **`NFR-010`** / heap caps: untouched. No config or flag moves.
- **Security:** not triggered. Test-only, no input surface.

## Test notes

1. **Watch each row go red once, then revert.** Run QP1 against R1 and QP6 against R2, using `gp.mjs` from QE's
   probe. Do this before the rows are final.
2. **R1 must use two `talk` calls.** One `talk` with four lines is one session, and that is the gap itself. Do not
   release session 1 before session 2 runs.
3. **R2's position is the SE's choice.** The bound must not depend on it. `startpos` matches U7, and its cost is
   known (25 621 nodes). A smaller tree is welcome if B2 and B6 still hold and B5 reads fewer nodes.
4. **R2 is not inside U7's `for` loop.** U7's loop and its step are `ABC-177`'s and stay byte-identical (B3).
5. **The probes are not the frozen A6 list.** `ABC-177`'s parity stands as QE read it. B6 is a separate kill check
   on two named gaps.
6. **UAT:** the diff carries zero production lines, so `AGENTS.md`'s standing rule (2026-08-17) waives UAT if
   `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty. That is measured
   at delivery.

## Size and priority

**`XS`:** two additive rows in one file. The probe harness already exists (`gp.mjs`), and the census is the
`ABC-177` instrument. The gate's timing hop (B7/B8) is the long part of the work, not the build.

**`P2`:** it restores two kills that our own lane change dropped, and both gaps stay open on every default-lane
gate until it lands. **Not `P1`:** both gaps are LOW, there is one UCI session per process today, and no
user-visible behaviour is wrong. **Not `P3`:** the cost is small and known, and the gap is a regression we made, not
a new wish.

**Epic: `EPIC-007`.** Both rows pin `ABC-167` behaviour: A6 (hold/release) and A7 (dropped tokens). `EPIC-007`'s page
is not edited by this cut.

## Dependencies

- **`ABC-177` merged to `main`** (the owner holds merge). Both tickets touch `src/uci-session.test.ts`, and B3/B4
  diff against `ABC-177`'s merged file. **Not met today**: `ABC-177` is In Review at `f81bf03c`.
- **`ABC-177`'s A10 reading exists** (QE-177-g, OWED twice: on battery, then because of a foreign
  `oeselg-labs/platform` session).
  - If it reads ≤ 9.2 s, `ABC-178` may be pulled.
  - If it reads > 9.2 s (tranche 2, O3, opens), `ABC-178` waits. BA/PM re-rules R2 against tranche 2's measured
    headroom before any pull. R1 can then go alone.
- The AC-power rule (`…bfdc97e5`) applies to B7 and B8. The quiet window has failed twice; the owner pausing the
  platform session is the open precondition (board, 2026-10-21).
- Owners: Software Engineer for B1–B5; QE for B6–B8; Security/NFR for the `NFR-008` state.

## Owner questions

None new. The timing window (pause `oeselg-labs/platform`) is already owed to the owner for `ABC-177`. `ABC-178`
reuses it.

## Definition of Ready

BA/PM, 2026-10-20, at `main` `e6be5106`. **Result: 9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** two named wrong builds, each killed at base and surviving the whole lane at the tip (QE, `gp-tip-lane.jsonl`) |
| 2 | scope and out-of-scope clear | **✅** two additive rows in one file; every existing line fenced; U7→100 and U8→10 rejected by name |
| 3 | INVEST-shaped | **✅** small and valuable, and testable through named probes. It is sequenced after `ABC-177` (same file), not entangled with it. R1 and R2 can be split if B8 forces it |
| 4 | acceptance testable and measurable | **✅** an empty `out`; `3 000 ≤ time ≤ 3 200`; no `-` line in the diff; 128 rows; node ceilings; five probes with red/green; 650 ms CPU; ≤ 10 s on AC |
| 5 | dependencies known | **✅** `ABC-177` merge, its A10 reading and the 9.2 s fork, the AC rule, the quiet window, owners |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` ≤ 10 s; `N8-LANE` 650 ms CPU; cost estimated at ≈ +0.08 s wall; security not triggered |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`, both directions argued |
| 10 | no major unresolved blocker | **❌** `ABC-177` is not merged, so B3/B4's base does not exist yet. Its A10 reading is OWED, and that decides whether R2 fits |

**Recommended:** keep it in `Backlog`. When `ABC-177` merges and its A10 reads ≤ 9.2 s, item 10 flips and the ticket
is **10/10 with no re-cut**. The Orchestrator then moves it `Backlog → Ready`. Column moves are the Orchestrator's.

## Trace row (for the Orchestrator to append; this hop is fenced off `plans/traceability.md`)

`| ABC-178 (B1–B9) | QE-177-a, QE-177-b (QE …02deb2e2); BA/PM …7c41e9a2; EPIC-007 / ABC-167 A6, A7 | — (Backlog, DoR 9/10; after ABC-177 merges) | src/uci-session.test.ts (+2 rows, additive) | — | — |`
