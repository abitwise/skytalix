---
id: ABC-197
title: "One step-100 UCI row restores the 100 ms dropped-token budget band `ABC-177` widened to 1 000 ms (QE-177-b)"
status: in-development
column: In Development
size: XS
priority: P3
epic: EPIC-007
feature: —
---

# ABC-197: add one dropped-token time row (R2) to `src/uci-session.test.ts`. Test-only, additive, one file. Pulled only when the lane reads ≤ 9.2 s

> **Cut 2026-10-22 by BA/PM** (task `bapm-rerule-ABC-178`, records only, at `main` `a7857e0b`). It is cut from `ABC-178`'s
> R2. This follows the owner's word of 2026-10-22, *"ABC-178, go ahead, send to BA/PM"* (`uat-ABC-168` `…0b63d92f`, a
> transcription, not a stamp). The ruling and its headroom arithmetic are in `ABC-178`'s 2026-10-22 block and in
> `.grugops/context/bapm-rerule-ABC-178/notes/`. This hop ran no lane, took no timing and ran no probe. Every cost
> below is an estimate taken from published readings.
>
> **Source:** QE `…02deb2e2` (QE-177-b, QP6), the original cut `bapm-rule-QE-177-ab` `…7c41e9a2`, and Architect
> `…74d39535` (do not drop QE-177-b on an unproven reading).

## Problem

*User:* the owner, and every agent hop that relies on the default lane to catch a wrong UCI session build.

*Pain:* a `go` that drops its `depth`/`nodes`/`mate` token and has no time token gets the default 3 000 ms budget G.
Before `ABC-177`, the six U7 rows (step 100, `time ≥ 3 000`) caught any G on that path at or below 2 900 ms. At step
1 000 they catch only G at or below 2 000 ms. **The blind band grew from about 100 ms to about 1 000 ms.** QP6
(G = 2 500) passes the whole default lane at `ABC-177`'s tip (QE `gp-tip-lane.jsonl`, 0/1 987 red). No upper bound on
that path was ever pinned.

*Value:* the 100 ms band comes back, and the upper side gets pinned too, for an estimated **≈ +0.075 s of lane wall**.

> **Erratum 2026-10-23, BA/PM (`bapm-rerule-ABC-197-A5`, `…4df5ef95`), records only.** The band figures above, in the
> title and in § Scope are off by a factor of two. The value is unchanged in kind, and no bound moves. The slip came
> from QE `…02deb2e2` and was carried into this page.
> - **The rule (read from `src/`, confirmed in scratch).** The virtual clock returns its reading and then adds the
>   step `s`. `chooseMove` stops at the first reading ≥ G and reads once more for `elapsedMs`. So
>   `time = (⌈G/s⌉ + 1) · s` for the capped G, and a `time ≥ 3 000` row is blind on **(3 000 − 2s, 3 000)**. The band
>   is **twice the step**, not the step.
> - **Step 100** (U7 before `ABC-177`, and R2): red for **G ≤ 2 800 only**. G 2 801 and G 2 900 read 3 000 and pass.
>   The band is **200 ms**. "Caught any G at or below 2 900 ms" reads **"at or below 2 800 ms"**.
> - **Step 1 000** (U7 since `ABC-177`): red for **G ≤ 1 000 only**. G 2 000 reads 3 000 and passes. "Catch only G at
>   or below 2 000 ms" reads **"at or below 1 000 ms"**. The band grew from **200 ms to 2 000 ms**, not from 100 ms to
>   1 000 ms. The title's "100 ms … 1 000 ms" reads "200 ms … 2 000 ms".
> - **§ Scope's "the band equals the step"** reads "the band is twice the step". Its conclusion holds: any step above
>   100 leaves a band wider than the one at base.
> - **Value.** R2 gives back the base's 200 ms band. **"The upper side gets pinned too" is struck.** On this path, G
>   above 3 000 is clipped by `go`'s `Math.min(request.budgetMs, level.budgetMs)`, and no level allows more than
>   3 000. So no upper-side wrong G on the path is observable. The only observable upper-side defect is a broken cap,
>   and 16 rows at base already red it (a skipped cap reds R2 and 16 others, 17/128). R2's `≤ 3 200` stays as the house
>   `G ≤ time ≤ G + 2s` shape (A1 unchanged). It adds no new kill.

## Scope

One file: `src/uci-session.test.ts`. **One new row. The diff only adds lines.**

| row | where | dialogue | step | bound |
|---|---|---|---:|---|
| **R2** | `describe("ABC-167 A7 — the D12 limits")`, **outside** U7's loop | `["position startpos", "go depth 0"]` | **100** | `out` has 3 lines; `out[0]` is an `info string`; `3 000 ≤ time ≤ 3 200`; `out[2]` is `bestmove <info.move>` |

- **Step 100 is finer than U7's 1 000.** This is a new row, not a step change to U7. Step 100 is in `ADR-0046`'s
  `{1, 10, 100, 1 000}` set, under "a row that needs X picks its own step". For G on this path the band equals the
  step, so any step above 100 leaves a band wider than the one at base.

## Out of scope

- Every existing line of `src/uci-session.test.ts`, byte-identical. That includes U1–U8 and their steps, the shared
  helpers, every class P/C row, and `ABC-178`'s R1.
- U7 back to step 100 (≈ 0.9 s in-thread; rejected in `…7c41e9a2`).
- One row per dropped keyword (`nodes`, `mate`). QP6 sits on the shared warn path.
- Every other file, `NFR-008`'s level, `F`, the ADRs, and O3 (`UCI_DEEP`).

## Acceptance criteria

**The base** is `main` at the commit that merges `ABC-178`. **The tip** is `ABC-197`'s delivered commit.
> **2026-10-22, BA/PM (`bapm-rule-QE-198`, `…479ce351`):** `ABC-199` also edits `src/uci-session.test.ts` (`ABC-167
> A7` row 1's step), and it may merge after `ABC-178` and before this ticket. If it does, the base for A2/A3 is `main`
> at this ticket's own branch point, so `ABC-199`'s lines are not read as `-` lines here. Nothing else on this page
> moves.

**Build (Software Engineer)**

- **`A1` (R2).** **Given** R2 at the tip, **when** it runs `["position startpos", "go depth 0"]` at step 100, **then**:
  - `out` has exactly 3 lines;
  - `out[0]` starts `info string `;
  - the `time` of `out[1]` is **≥ 3 000 and ≤ 3 200**;
  - `out[2]` is `bestmove ${move}` of `out[1]`.
- **`A2` (additive only, one file).** **Given** `git diff <base> <tip>`, **then**:
  - `--name-only` prints exactly `src/uci-session.test.ts`;
  - `-U0` shows **no `-` line**. Hunks add only R2 and comment lines citing `ABC-197` or `QE-177-b`.
- **`A3` (row count).** **Given** the vitest JSON report of the default lane at base and at the tip, **then**:
  - `src/uci-session.test.ts` reports N at base and **N + 1** at the tip, all passed, 0 skipped;
  - the sorted base name list is a subset of the tip list, and the difference is exactly R2's name;
  - the lane total at the tip is the base total + 1.
- **`A4` (node census, not timing).** **Given** `deepen`'s return instrumented in scratch, as at `ABC-177` A7, **then**
  R2 reads ≤ **26 000** nodes (expected 25 621, as the U7 rows read at step 100 in
  `qe-ABC-177/probe/census/census-base.tsv`). More goes to BA/PM before the gate. The census is not committed.

**Gate (QE, then Security/NFR)**

- **`A5` (the kill comes back).** **Given** QE's `qe-ABC-177/probe/gap/gp.mjs`, byte-copied, plus one variant added to
  a scratch copy before any tip run and recorded in the gate report, **when** each wrong build is applied to
  production at the tip, **then**:

  | probe | wrong build | R2 | whole default lane at the tip |
  |---|---|---|---|
  | QP0 | none | green | 0 red |
  | **QP6** | G = 2 500 on the dropped-token path | **red** | **≥ 1 red** |
  | **QP6-2800** | 2 800 in place of 2 500 | **red** | ≥ 1 red |

  > **Re-ruled 2026-10-23, BA/PM (`bapm-rerule-ABC-197-A5`, `…4df5ef95`).** As cut, the table had four probes. Two
  > could not go red under A1, through no fault in the build (SE `…ba08acdc`, verified from `src/` and in scratch).
  > A1 does not move, and R2 is not re-built.
  > - **`QP6-2900` → `QP6-2800`.** G 2 900 reads `time 3000`, inside the band A1's `≥ 3 000` leaves (Problem
  >   erratum). G 2 800 is the largest whole-ms G that R2 catches. It reads 2 900 and reds R2 alone in the file
  >   (1/128), and the base file survives it (127/127). The variant is QP6's two edits with `2_800` in place of `2_500`.
  > - **`QP6-3300` dropped as equivalent by design.** `go` caps G with `Math.min(request.budgetMs, level.budgetMs)`,
  >   and no level exceeds 3 000 (`levels.ts`). So any G ≥ 3 000 on this path searches exactly as the correct build
  >   does: `time 3100`, 25 621 nodes, `bestmove g1f3`. No row on any level can kill it. It is not replaced. A
  >   skipped cap does red R2, but 16 rows at base red it too, so it shows no kill R2 adds.
  > - **Accepted residual:** G in (2 800, 3 000) on this path stays blind. That is the same 200 ms band U7 had at
  >   step 100 before `ABC-177`.

- **`A6` (`N8-LANE`, one-file set).** As `ABC-177` A8 (`lane174.mjs` byte copy, 9 rounds, round 0 discarded, rotated,
  GAP 0, k = 2, CPU from `/usr/bin/time -p`), with B = `git archive` of the base and H = `git archive` of the tip:
  the charge is **≤ 650 ms CPU**; H−B CPU and wall medians are reported with intervals (expected ≈ +150 ms in-thread).
- **`A7` (`NFR-008` is not re-broken).** **Given** the tip, under `ABC-177` A9's protocol (`npm test` as spelled; each
  arm its own `npm ci`; `window.mjs` 180 s foreground, 0 foreign polls; load1 ≤ 8; **AC on every scored run**,
  `…bfdc97e5`; the thermal rule the owner rules for it), **then** H's R-1 median wall is **≤ 10 s**. Over 10 s goes
  to the owner (`ADR-0035` D6), and the recommended fallback is to drop R2 and accept QE-177-b.
- **`A8` (gates).** Lint, typecheck, unit and build green; default lane 0 skips; `ABC-167` A11's M4 sweep row green and
  still killing M4.

> **2026-10-23, Architect/Design (`arch-floor-reread`, `…578a9290`), records only. `A6`'s bound passes the cut
> check. No criterion, bound or estimate on this page moves.**
> - **The per-set `F` of `src/uci-session.test.ts` (ONE-FILE) is 0.070 s CPU / 0.090 s wall.** It is the larger R of
>   the set's two admissible twins: `ABC-177` A8 (vitest 4.1.11) read 0.070 / 0.090 s, and `ABC-178` B7 (4.1.12) read
>   0.030 / 0.050 s. The vitest 4.1.11 → 4.1.12 bump does not start a new series. This replaces the provisional
>   0.654 s (`R-178-1`).
> - **Cut check:** `A6`'s 650 ms CPU ≥ `F` 0.070 s (≈ 9.3×), so the bound is not refused. `A6` sets no wall bound,
>   and `A7`'s 10 s is `NFR-008`'s own level, not a per-ticket bound.
> - **For `A6`'s pre-registration:** name `F` = 0.070 s and pass it to the readout in place of `16pct`
>   (`readout174a.py <dir> n8-lane 0.070 changed`). With `16pct` the readout prints a provisional ≈ 0.66 s and
>   `650 ms >= F: False` again.
> - If `A6`'s twin is admissible, it is the set's third reading, and from then on the median of the three most recent
>   Rs governs `F`. `A6`'s grade does not wait on that.

## NFR triggers

- **`NFR-008`** (R-1): `npm test` median wall **≤ 10 s** at load1 ≤ 8, on AC (A7).
- **`N8-LANE`:** ≤ **650 ms CPU** on the ONE-FILE set (A6).
- **Cost estimate (not a reading):** 25 621 nodes, ≈ 150 ms in-thread (the U7 rows read 146–153 ms at step 100,
  `arch-lane-under-10s/probe/uci-rows.out`). That is ≈ **+0.075 s of wall** under `ADR-0046` D3's 2-slot model, about
  **7.6 % of the 0.990 s published headroom** at `00f77f26` (Security/NFR `…d0c770b5`; refreshed 2026-10-23 by BA/PM
  from "12 % of the 0.605 s at `f81bf03c`"). The estimate itself is unchanged.
- **Security:** not triggered. Test-only, no input surface. `NFR-010`/heap caps untouched.

## Test notes

1. Watch R2 go red once under QP6, then revert, before the row is final.
2. R2's position is the SE's choice. The bound must not depend on it. `startpos` matches U7 and its cost is known; a
   smaller tree is welcome if A1 and A5 still hold and A4 reads fewer nodes.
3. R2 is not inside U7's `for` loop. U7's loop and step stay byte-identical (A2).
4. The probes are not `ABC-177`'s frozen A6 list. A5 is a separate kill check on one named gap.
5. **UAT:** zero production lines, so `AGENTS.md`'s standing waiver applies if the waiver probe prints nothing at
   delivery.

## Size and priority

**`XS`:** one additive row in one file. The harness and the census already exist. The timing hop (A6/A7) is the long
part.

**`P3`:** the gap is LOW (one warn path, a 1 000 ms → 100 ms band, no user-visible behaviour, one UCI session per
process). The cost lands on the scarcest shared budget the lane has. **Not dropped:** our own lane change opened
the gap, and the reading that would justify accepting it is not shown to be real (Architect `…74d39535`).

**Epic: `EPIC-007`** (pins `ABC-167` A7). `EPIC-007`'s page is not edited by this cut.

## Dependencies

- **`ABC-178` merged to `main`.** Same file; A2/A3 diff against `ABC-178`'s merged file.
- **An admissible full-lane `NFR-008` reading of `main` ≤ 9.2 s.** It must be admissible under `ADR-0035` D1 + A1 as
  Security/NFR rules. It must be read on AC and owner-quiet. This is the page's original 9.2 s fork, and it is not
  moved. `ABC-178`'s B8 (four arms, H = `main` + R1) is meant to produce it.
  - **H ≤ 9.2 s:** DoR item 10 flips. The ticket is 10/10 with no re-cut.
  - **9.2 s < H ≤ 10 s:** O3 opens as tranche 2 per the Architect (`…ee7527cc`). This ticket waits for tranche 2's
    measured reading, and the same ≤ 9.2 s test applies to it.
  - **H > 10 s:** the owner (`ADR-0035` D6). The recommended disposition is to drop R2 and accept QE-177-b.
- Owners: Software Engineer for A1–A4; QE for A5–A7; Security/NFR for the `NFR-008` state; the owner for the quiet
  window and the thermal rule.

## Owner questions

None new. The quiet window and the thermal rule are already owed for `ABC-178`'s B8 (its P2/P3), and this ticket
reuses them.

## Definition of Ready

BA/PM, 2026-10-22, at `main` `a7857e0b`. **Result: 9 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ QP6 passes the whole lane at `f81bf03c`; the band grew from ≈ 100 ms to ≈ 1 000 ms |
| 2 | scope and out-of-scope clear | ✅ one additive row in one file; U7→100 and per-keyword rows rejected by name |
| 3 | INVEST-shaped | ✅ small and valuable, and testable through four probes. It follows `ABC-178` in the same file |
| 4 | acceptance testable and measurable | ✅ 3 lines; `3 000 ≤ time ≤ 3 200`; no `-` line; N + 1 rows; ≤ 26 000 nodes; four probes; ≤ 650 ms CPU; ≤ 10 s on AC |
| 5 | dependencies known | ✅ `ABC-178` merge; the ≤ 9.2 s reading and its three routes; owners |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; `N8-LANE` ≤ 650 ms CPU; ≈ +0.075 s wall estimated |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, argued |
| 10 | no major unresolved blocker | **❌** no admissible full-lane reading of `main` ≤ 9.2 s exists. **Missing input:** that reading. **Owner:** QE/E2E reads it, at `ABC-178`'s B8. Security/NFR rules on its admissibility. It needs the owner's quiet window and thermal rule first. `ABC-178` is also not merged |

**Recommended:** keep it in `Backlog`. When `ABC-178` merges and an admissible reading of `main` is ≤ 9.2 s, item
10 flips with no re-cut. The Orchestrator then moves it `Backlog → Ready`.

> **DoR re-check 2026-10-23, BA/PM (`bapm-rerule-ABC-197-A5`, at `main` `01bf3b8d`): 10 of 10.**
> - **Item 10 is ✅.** It flipped as pre-registered, and the Orchestrator moved the ticket to `Ready` at 07:40Z
>   (`…8c94d901`). `ABC-178` merged (`564b408d`), and B's full lane on `main` reads 8.985 s ≤ 9.2 s
>   (QE `…39e59d96`).
> - **Item 1 is ✅ with the erratum.** The band grew from 200 ms to 2 000 ms.
> - **Items 3 and 4 are ✅, on three probes, not four.** Each probe now has a known, reachable outcome at the built
>   tip: QP0 green, QP6 red, QP6-2800 red.
> - **Item 6 is ✅.** The headroom is now 0.990 s, and the estimate is ≈ 7.6 % of it.
> - The other items are unchanged. No bound, level or requirement moved, so there is no owner question.
> - **No re-build.** R2 at `20e397c8` already meets the re-ruled A5 in scratch. Its comment says "U7's 1 000 band", which
>   reads 2 000 by the erratum. That is a comment only, and it is not worth a re-build.
