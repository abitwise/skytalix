---
id: ABC-178
title: "One additive UCI row restores the cross-session hold kill `ABC-177` dropped (QE-177-a). R2 (QE-177-b) moved to `ABC-197` on 2026-10-22"
status: in-development
column: In Development
size: XS
priority: P2
epic: EPIC-007
feature: —
---

# ABC-178: add one cross-session hold row and one dropped-token time row to `src/uci-session.test.ts`. Test-only, additive, one file

> **2026-10-22 15:25Z, BA/PM, QE-178 ruling** (task `bapm-rule-QE-178`, records only, at `main` `823a9885`). Notes:
> `.grugops/context/bapm-rule-QE-178/notes/` (decision `…1f4936b2`, readings `…34bf730b`). QE verdict: `…1ad5f522`,
> PASS_WITH_GAPS at merge `80493be0`. Authority: the owner's delegation `…5aaf7cec`. This hop ran no vitest, took no timing and
> ran no probe. **This block supersedes the blocks below wherever they differ.** B7/B8 (QE-178-c/-d) are the Orchestrator's
> and are not ruled here.
>
> | gap | ruling | why |
> |---|---|---|
> | **QE-178-b** (QP1c: a fresh session's `stop` releases the other session's hold into the holder's own output) | **FOLD into this ticket** | It is R1's own claim ("not released by a fresh session"), and B1 never said when to read session 1. One added assertion kills it, searches 0 nodes and keeps QP1/QP1a red (QE scratch, `gp-r1recheck-file.jsonl`). The ticket is waiting In Review for its timing hop anyway, so the fold costs no extra timing. A cut would cost a whole ticket cycle for one line. `ABC-197` would tie it to an unrelated ≤ 9.2 s reading |
> | **QE-178-a** (QP1b: a hold leaks only after a session's second hold) | **ACCEPT, no ticket** | Not a regression (it survives before `ABC-177`, at base and at the tip). Production runs one session per process (`src/uci.ts:76`). The family has no end (a count of 2, then 3, ponder against infinite, …). A two-hold row costs ≈ 1 310 nodes ≈ +0.004 s wall (estimate) against `NFR-008` headroom that is `UNKNOWN - verify` today. **Reopen if:** production runs more than one UCI session per module instance; `uci-session.ts` gains state that counts holds or carries a hold across a `go`; or a QP1b-shaped leak is seen live |
> | **QE-178-e** (INFO) | **corrected here** | Measured: lane **1 995 → 1 996**. `main` has changed no `src/`, config or lane file since `5d3832ef` (`git diff --name-only 5d3832ef 823a9885` lists only `.grugops/` and `plans/`) |
>
> **Criteria amended by the fold.** The base is still `main` without R1: `43e4996f` today, and `main`'s code has not moved
> since. Every other criterion stands as the re-rule block below states it.
> - **B1, added limb:** after session 2 has run, R1 reads session 1's output (`held.out`, the same array, not a new session)
>   **again**, and it still holds no line starting `bestmove`. The first check, before session 2, stays.
> - **B3:** one file; no `-` line against the base. Hunks add only R1, its re-check line, and comment lines citing
>   `ABC-178`, `QE-177-a` or `QE-178-b`. The blank separator stays inside "additive only" (QE `…65ce53ef`).
> - **B4:** unchanged in shape (no new row): file 126 → **127**, lane **1 995 → 1 996**, and the difference is R1's name alone.
> - **B5:** R1 = 655 nodes, and the tip's census sum reads the same as QE's tip reading (608 965 at `80493be0`). The re-check
>   searches nothing.
> - **B6, added row:** QE's `QP1c` entry, byte-copied from `gp-qe178.mjs` (`grugops/qe-ABC-178` @ `d781e5e5`, sha256
>   `12c0b8db…`): **red on R1 in the file run, and ≥ 1 red in the whole lane at the tip**. QP0 0 red, QP1 red on R1 (as
>   now). QP1a and QP1b are reported, not graded (QP1b is expected to survive: QE-178-a is accepted).
> - **B7/B8:** unchanged, still OWED. The timing hop reads the final (folded) tip. The QE re-read (B1, B3–B6, B9) runs
>   **before** that hop, never inside its window.
> - **Test notes, added:** watch the re-check go red under QP1c (R1's first check stays green), then revert.
>
> **Size `XS`, priority `P2`: unchanged.** One added line in one file. **DoR re-scored: 10/10** (item 4 now reads
> "session 1 still holds no `bestmove` after session 2; QP1c red"; item 10: nothing blocks the re-build). **Recommended (the
> Orchestrator's move):** In Review → In Development for the re-build, then a QE re-read, then the owed timing hop.
> `ABC-197` is not changed. No ticket is cut, and the next free id stays ABC-198.

> **Re-ruled 2026-10-22 by BA/PM** (task `bapm-rerule-ABC-178`, records only, at `main` `a7857e0b`). This follows the
> owner's word of 2026-10-22, *"ABC-178, go ahead, send to BA/PM"*, as transcribed in `uat-ABC-168` `…0b63d92f`.
> That is a transcription, not a stamp. Notes: `.grugops/context/bapm-rerule-ABC-178/notes/`. **This block
> supersedes the text below wherever they differ. The text below is kept as the record of the 2026-10-20 cut.**
> This hop ran no lane, took no timing and ran no probe. Every figure below is a published reading or arithmetic
> on one.
>
> **Why a re-rule.** § Dependencies said: if `ABC-177`'s A10 reads > 9.2 s, R2 waits, BA/PM re-rules R2 before
> any pull, and R1 can go alone. `ABC-177` merged (`4debc07d`) on **9.395 s** (QE t3-r1 on `f81bf03c`; Security/NFR
> `…b4d5793f`: MET, warm-flagged 5/8, strict view VOID, AC). That is over 9.2 s, so the clause fired. Tranche 2
> (O3) was **not** opened (Architect `…ee7527cc`), so there is no "tranche 2 measured headroom". The ruling uses
> the published reading only.
>
> **Headroom arithmetic (published readings; every row cost is an estimate):**
>
> | quantity | value | source |
> |---|---:|---|
> | `NFR-008` bound W | 10.000 s | catalog |
> | H median wall at `f81bf03c` | 9.395 s (x(2)..x(7) 9.21..9.52; max 9.55) | `…4bb78960` |
> | twin wall R (H/H2) | 0.250 s | `…b4d5793f` |
> | headroom to W | **0.605 s** (≈ 2.4 R) | 10.000 − 9.395 |
> | against `ADR-0046` D4's 9.2 s | **−0.195 s** (over) | 9.2 − 9.395 |
> | R2 ≈ 25 621 nodes ≈ 150 ms in-thread | **≈ +0.075 s wall**, ≈ 12 % of the headroom, 2.5 × `ABC-174`'s +0.03 s | page § NFR, 2-slot model |
> | R1 ≈ 655 nodes ≈ 4 ms in-thread | **≈ +0.002 s wall**, ≈ 0.3 % of the headroom | same |
> | after R1 + R2 (estimate) | ≈ 9.47 s, headroom ≈ 0.53 s (≈ 2.1 R) | arithmetic |
> | after R1 alone (estimate) | ≈ 9.40 s, headroom ≈ 0.60 s | arithmetic |
>
> **The 9.395 s is not today's lane.** Since `4debc07d`, 14 merges changed lane inputs (`src/cli.test.ts` +307
> lines, `src/cli.real-engine.test.ts`, `tools/opening-book/book.test.ts`, `tools/grugops/heap-guard.js`,
> `result-file-reporter.js`, four `*.nfr.test.ts` headers, `package.json`). The lane went from 1 987 to 1 994 tests.
> None of them was timed. **Today's full-lane wall on `main` is `UNKNOWN - verify`.** The Architect's rebased
> estimate of 8.4–8.6 s (`…e8b4d26d` § 2) is an estimate, not a reading. `src/uci-session.test.ts` is unchanged since
> `4debc07d` (126 tests).
>
> **Ruling R1: it goes alone, now.** It costs about 0.3 % of the headroom and reads no clock. The Architect
> agrees: "Headroom gives no reason to hold R1" (`…74d39535`). `ABC-178` is narrowed to R1.
>
> **Ruling R2: deferred, not dropped. It is cut to `ABC-197` (Backlog, XS, P3), with its shape unchanged** (step
> 100, `3 000 ≤ time ≤ 3 200`). Step 100 is still the only step in `ADR-0046`'s set that gives a band under
> 1 000 ms, so a cheaper shape would not restore the kill. Why it is not kept at 0.605 s of headroom:
> - **The fork was registered before the reading.** Keeping R2 now would move this page's own gate after the reading
>   missed it. That is the habit the 9.2 s target exists to stop (Architect `…74d39535`).
> - **Today's headroom is unread** (above). The only reading is warm-flagged, its strict view is VOID, and it was taken
>   on a lane that 14 later merges have changed.
> - **R2 buys a LOW band** (1 000 ms → 100 ms on one warn path; no user-visible behaviour). Its price is about 12 % of
>   the lane's measured margin, with no lever ready behind it (O3 is MEDIUM risk and unopened).
> - **Not dropped:** the reading that would justify a drop is not shown to be real (Architect `…74d39535`). `ABC-197`'s
>   pull condition is an admissible full-lane reading ≤ 9.2 s. `ABC-178`'s own B8 below is meant to produce one.
>   **Cost of the split, stated:** if that reading is ≤ 9.2 s, `ABC-197` needs its own B7/B8 timing hop later.
>
> **Criteria changed by this re-rule:**
> - **Scope:** R1 only. R2's row, its B2, its QP6 probes and its test notes 3–4 move to `ABC-197`.
> - **B1:** unchanged.
> - **B2:** removed from this ticket (now `ABC-197` A1).
> - **B3:** every hunk adds only R1 and comment lines citing `ABC-178` or `QE-177-a`. One file, no `-` line.
> - **B4:** `src/uci-session.test.ts` reports N at base (126 at `main` today) and **N + 1** at the tip. The name
>   difference is exactly R1's name. The lane total at the tip is **the base total + 1** (1 994 → 1 995 if `main` has
>   not moved; `ABC-168`'s merge would move it).
> - **B5:** R1 only, ≤ 1 000 nodes.
> - **B6:** rows QP0 and QP1 only. QP0 is green and 0 red. QP1 is red on R1 and gives ≥ 1 red on the whole lane at the
>   tip.
> - **B7:** the bound stands (charge ≤ 650 ms CPU). H−B is expected at about +4 ms in-thread, below the set's
>   floor. It is reported, not resolved.
> - **B8:** `NFR-008` R-1 median wall ≤ 10 s, as written, **plus**:
>   - **all four arms (B/T, H/H2) are required**, as at `ABC-177` A9. This reading doubles as the Architect's clean
>     owner-quiet re-read (`…ee7527cc`). It reports the B and H medians with their intervals, and each twin's
>     admissibility;
>   - **H ≤ 9.2 s** (admissible): this is the input `ABC-197`'s DoR item 10 waits on;
>   - **9.2 s < H ≤ 10 s:** O3 routes per the Architect (`…ee7527cc`), and `ABC-197` waits for tranche 2's reading;
>   - **H > 10 s:** the owner (`ADR-0035` D6). R1 alone (≈ +0.002 s) cannot plausibly cause it.
> - **B9:** unchanged.
> - **Test notes:** note 1 runs QP1 against R1 only. Notes 3 and 4 move to `ABC-197`. Notes 2, 5 and 6 stand.
> - **NFR triggers:** R1 ≈ 4 ms in-thread, ≈ +0.002 s wall (estimate). `NFR-008` ≤ 10 s and `N8-LANE` ≤ 650 ms stand.
>
> **Preconditions on QE's timing hop (B7/B8). They are the owner's call, and they do not block the build (B1–B6, B9):**
> - **P1, AC power** on every scored run (`…bfdc97e5`);
> - **P2, owner-quiet:** the owner pauses his other sessions (`oeselg-labs/platform`). Twelve of twelve windows failed
>   without that (`qe-ABC-177-timing`);
> - **P3, the thermal rule for this reading**, still open from the Architect's question (`…74d39535`). Under the strict
>   registered rule, four of four full stages VOIDed on this host. **Recommended (the Architect's):** "thermal kept and
>   flagged" for this reading only, comparable with t3-r1. A cooled-state protocol costs about 1 h per stage, and
>   Architect/Design must re-register it first.
>
> `FIX-177-1` (the sampler crash) is already folded (`qe-redact-SEC-177-1` `…dae138b1`).
>
> **Size `XS`, priority `P2`.** Both are unchanged: it restores a kill our own change dropped, at negligible cost.
>
> **Dependencies now:** `ABC-177` merged ✅ (`4debc07d`). A10 read ✅ (9.395 s; the fork fired and is resolved by this
> re-rule). P1–P3 come before QE's timing hop. `ABC-197` follows this ticket in the same file.
>
> **Definition of Ready, re-scored 2026-10-22: 10 of 10 → `Ready`.**
>
> | # | item | verdict |
> |---|---|---|
> | 1 | problem clear | ✅ QE-177-a: QP1 survives the whole lane at `f81bf03c` (QE `…02deb2e2`) |
> | 2 | scope and out-of-scope clear | ✅ one additive row in one file. R2 is out, in `ABC-197` |
> | 3 | INVEST-shaped | ✅ independent of `ABC-197` (which follows it), small, testable through QP1 |
> | 4 | acceptance testable and measurable | ✅ an empty `out`; no `-` line; N + 1 rows; ≤ 1 000 nodes; QP0/QP1 red/green; ≤ 650 ms CPU; ≤ 10 s on AC, four arms |
> | 5 | dependencies known | ✅ `ABC-177` merged; the fork is resolved; P1–P3 are named with their owner |
> | 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; `N8-LANE` ≤ 650 ms CPU; ≈ +0.002 s wall estimated; security not triggered |
> | 7 | test notes present | ✅ notes 1, 2, 5, 6 |
> | 8 | size assigned | ✅ `XS` |
> | 9 | priority assigned | ✅ `P2` |
> | 10 | no major unresolved blocker | ✅ nothing blocks the pull or the build. P1–P3 are gate-time preconditions owed by the owner, as `ABC-177`'s OQ-177-1 was owed before its A9 |
>
> Column moves after `Ready` are the Orchestrator's. The pull is the owner's.

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

## QE

**QE/E2E, 2026-10-22 (subtask `qe-ABC-178`), at `grugops/qe-ABC-178` merge `80493be0` (tip `efaa0a76`, base `43e4996f`, `main` `5d3832ef` merged, no conflict). Verdict: PASS_WITH_GAPS.** I read B1, B3–B5 and B9 with my own runs before I opened the SE's notes. Probes and plants ran only in scratch copies outside the repository; each production file was restored and compared. Notes: `.grugops/context/qe-ABC-178/notes/` (verdict `…1ad5f522`).

- **B1 MET.** Session 1 searches 655 nodes and writes no `bestmove`. Session 2 is a fresh `talk`, and its `out` is `[]`.
- **B3 MET.** One file, 0 `-` lines, 7 `+` lines. The one blank separator line is inside "additive only" (`…65ce53ef`): it carries no token, and all 40 `it` blocks in the file are blank-separated.
- **B4 MET.** File 126 → 127; lane 1 995 → 1 996 (`ABC-168` moved the base); the difference is R1's name alone; 0 skipped.
- **B5 MET.** R1 = 655 nodes; every other row unchanged.
- **B6 MET.** `gp.mjs` byte copy: QP0 0 red; QP1 0/1 995 at base, 1/1 996 at the tip (R1 alone). QE's variants: R1 kills QP1a (ponderhit-only leak). QP1b (leak after a second hold) and QP1c (release into the holder's stream) survive the whole lane, as they did before `ABC-177`.
- **B7 OWED.** Three windows failed on foreign vitest polls (2, 71, 1); no B7 stage ran before the 15:15Z deadline.
- **B8 OWED.** One admitted window (0 foreign polls, AC). The stage reads NOT APPLICABLE under `174b`: load1 9.03 > 8 before scored round 7 H, while the owner's other session ran vitest. Warm 5/8. Instrument medians from that stage are not readings. `NFR-008` NOT READ; `ABC-197`'s input not produced.
- **B9 MET.** Lint, typecheck, build, `npm test` 60/1 996 (`success` true), skip count 0 → `No findings.`, `UCI_DEEP` 5/5, M4 sweep green and still kills M4.

**Gap register** (0 blocking as QE reads this page; severities proposed):
- **QE-178-a (LOW).** QP1b survives the lane. Route: BA/PM — accept, or a test-only row later (same file as `ABC-197`).
- **QE-178-b (LOW).** QP1c survives the lane: R1 reads session 1 before session 2 runs. One re-check assertion kills it (scratch). Route: BA/PM — accept, or a one-line follow-up.
- **QE-178-c (MEDIUM).** B7 OWED. Route: Orchestrator — a timing hop at width 1 with the owner's session paused (P2).
- **QE-178-d (MEDIUM).** B8 OWED; `NFR-008` stays at t3-r1's 9.395 s on `f81bf03c`. Route: the same timing hop; it can read `main` after a merge (H = `main` + R1). Security/NFR rules on the state.
- **QE-178-e (INFO).** The page's 1 994 → 1 995 predates `ABC-168`; measured 1 995 → 1 996.

UAT waived (0 production lines); a waiver is not a signature. The `In Review` exit is the Orchestrator's.
