---
id: ABC-177
title: "`npm test` back under NFR-008's 10 s (ADR-0046)"
status: ready
column: Backlog
size: S
priority: P1
epic: EPIC-007
feature: —
---

# ABC-177: fold the two A6 prefix dialogues, and give the UCI rows whose bounds read no step the coarsest step that keeps their kill set. One test file

> **Cut 2026-10-20 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-ABC-177`), at `main` `a0b145dc`. It answers
> the owner's word on `ADR-0046`, verbatim *"accept"* (Orchestrator note
> `.grugops/context/wave-2026-09-25/notes/20261020T142000Z-orchestrator-decision-9fc95cac.md`, a transcription, not a
> stamp).
>
> **Design:** [`ADR-0046`](../../memory-bank/50-decisions/ADR-0046-the-default-lane-gets-under-10-s-by-coarser-virtual-clock-steps-on-the-uci-rows-whose-bounds-read-no-step.md),
> accepted 2026-10-20. The scope and draft criteria are the Architect's (`arch-lane-under-10s` decision `…58fa35f0`,
> data `…534e376f`, `probe/uci-rows.out`). **This hop ran no lane and took no timing.** Line numbers were read at
> `a0b145dc`; `src/uci-session.test.ts` was last changed at `be6a5599`.

## Problem

*User:* the owner, and every agent hop that runs the default lane at a gate.

*Pain:* `npm test` reads a **10.010 s** median wall against `NFR-008`'s 10 s (`QE-174-b`, `…5d9a0f63`; NOT MET,
`…6b1e94d2`). The owner accepted that as `R-174-1` (`…bdff4d33`), so **every gate that reads the lane inherits NOT
MET** until a reading of 10 s or less discharges it. `src/uci-session.test.ts` is 6.27 s of the lane's 10.34 s of
test time (60.7 %). The lane is throughput-bound on its 2 slots. About 2.2 s of the file is virtual-clock search
that no assertion reads.

*Value:* `R-174-1` is discharged, with about 0.8 s of headroom under the bar. Nothing is loosened: no cap, pin,
bound, row or lane line moves.

## Scope

One file: `src/uci-session.test.ts`. Fifteen rows in eight **change units**. A unit is one call site: rows that
share a loop share a step and move together.

| unit | rows | lines at `a0b145dc` | class (`ADR-0046`) | step today | admitted steps | ms today (`probe/uci-rows.out`) |
|---|---|---|---|---:|---|---:|
| **U1** | `ABC-167` A6 "go infinite holds the bestmove until stop / until ponderhit; a second … writes nothing" (2 rows, one loop) | 264–275 | H, **plus the fold** | 100 | {100, 1 000} | 908 |
| **U2** | A6-e1 | 291–303 | H | 100 | {100, 1 000} | 151 |
| **U3** | A6-j1 | 324–330 | H | 100 | {100, 1 000} | 147 |
| **U4** | A6-e4 | 332–337 | H | 100 | {100, 1 000} | 153 |
| **U5** | A6-e5 | 339–356 | H | 100 | {100, 1 000} | 152 |
| **U6** | A7-i5, A7-i6 (one loop) | 501–513 | H | 100 | {100, 1 000} | 303 |
| **U7** | `ABC-167` A7's six dropped-token rows: `go depth 0`, `nodes x`, `depth 2.5`, `mate 0`, `nodes -5`, `depth` (one loop) | 400–416 | L | 100 | {100, 1 000} | 889 |
| **U8** | `ABC-171` A7 "two sessions on the same seededRandom(k) write the same bestmove sequence" (its step lives in `levelOneMoves`, used by this row only) | 829–844 (`levelOneMoves`; the step is at 831) and 852–857 (the row). The precondition row at 846–850 is not in the unit | H′ | 10 | {10, 100}. **Not 1 000** (see the ruling) | 385 |

- **The fold (U1, lever (a)).** Each of the two rows runs one dialogue instead of three. The first two are exact
  prefixes of the third, and `handleLine` is synchronous and the session deterministic.
- **The steps (lever (b)).** Each unit takes the coarsest admitted step at which its kill set equals base.

## Out of scope

- Every other row, byte-identical. This includes class P (all of A5, A6-d1, A7-f1/f2/f3/h1/i2/i3), class C (A7
  `go depth 3`, A7 `searchmoves`), A6-e2/e3 (not in `ADR-0046`'s classes), and `ABC-171` "go depth 3 at level 1".
- The shared helpers, byte-identical: `dialogue` (and its default `stepMs = 10`), `talk`, `rig`, `expectWithin`.
- Every other file: production `src/*.ts`, `vitest.config.ts`, `package.json`, `AGENTS.md`, `tools/`,
  `plans/nfr-catalog.md`.
- Options O2–O5 of `ADR-0046`. O3 (`UCI_DEEP`) is tranche 2, opened only by A11.
- Moving `F`, and the "outright" / "on MET" wording conflict. Both are Architect/Design's at the D5.4 hop.
- The AC-power rule for `NFR-008` readings. That is the owner's (OQ-177-1).
- Re-levelling W. That is the owner's alone.

## BA/PM ruling: step 1 000 joins the set for classes H and L, and not for H′

**Ruling.** The step set for `ABC-177`'s class H, H′ and L units is {1, 10, 100, 1 000}, under three conditions:

1. **Kill-set parity decides the step.** This is `bapm-amend2-ABC-167`'s rule (`…5c7a1e30`) with one more decade.
   A unit takes the coarsest admitted step at which every row's killed set equals its base killed set (A6). It is
   never finer than today's step. A unit whose set changes at every coarser step keeps today's step.
2. **1 000 never turns a multi-check search into a one-check search.** Step 1 000 is admitted for a unit only if
   every search in its dialogue that runs 2 or more clock-check intervals at today's step (⌈budget ÷ step⌉ ≥ 2)
   still runs 2 or more at 1 000.
   - U1–U7 pass. Their governing search is the level-5 capped ceiling, 3 000 ms: 30 intervals today, 3 at 1 000.
     A6-e1's second search, `go movetime 100`, is already one interval at step 100, and stays one.
   - **U8 fails.** Its searches run on level 1's 100 ms budget: 10 intervals at step 10, 1 at step 1 000. U8
     keeps {10, 100}, which the owner accepted with the ADR. This word does not reach it.
3. **The mutant list is frozen before any head run** (A6). The step is never chosen against a list that was
   shortened after the fact.

**Why.**
- **The bounds cannot see the step on these classes.** Class H rows read no `time` and assert protocol: hold,
  release, line order, and the info string. Class L reads only `time ≥ 3 000`. The correct build stops at the first
  clock reading at or past G, so its `time` is ≥ G at any step. So the bound cannot catch a bad step, and kill-set
  parity is the only guard. That is the same footing as the `{1, 10, 100}` ruling.
- **What a coarser step does lose is search, and condition 2 caps it.** A search that its first clock reading ends
  runs one 1 024-node block whatever its budget. The row then no longer exercises the time-limited loop it was
  written over. A wrong build outside QE's named list (a loop that ignores the budget after one check, say) would
  pass it unseen. Parity counts only named mutants, so it cannot see that loss. Condition 2 can.
- **The set closes at 1 000.** At 10 000, every governing budget in this file (3 000 ms at most, and 5 000 ms
  `HARD_CEILING_MS`) is one interval, so condition 2 excludes it.
- **The price is small.** The ADR's H′ saving was 0 to −0.35 s of in-thread time, and U8 can still take step 100
  under the owner's word. U1–U7 carry the lever: about 2.7 s of today's in-thread time falls to about 3 checks per
  search (an estimate; A7 measures it in nodes).

## Acceptance criteria

The base is `main` at the commit the build branches from (`a0b145dc` or later, with `src/uci-session.test.ts`
unchanged from `be6a5599`). The tip is `ABC-177`'s delivered commit.

**Build (Software Engineer)**

- **`A1` (the fold).** **Given** U1 at the tip, **when** each of its two rows runs (release R = `stop`, then
  `ponderhit`), **then** it calls `talk` **once**, on `["position startpos", "go infinite", R, R]`, and asserts all
  three of:
  - (a) `perLine[0]` and `perLine[1]` hold no line starting `bestmove`;
  - (b) `perLine[2]` holds exactly one line starting `bestmove`, and that line is `perLine[2]`'s last;
  - (c) `perLine[3]` is `[]`.

  Today the row calls `talk` three times.
- **`A2` (the step per unit).** **Given** each unit U1–U8, **when** the SE builds the tip, **then** its step is the
  coarsest step in its admitted set (§ Scope) at which A6 holds for every row in the unit, and it is never finer
  than today's.
  - The delivery note records one line per unit: the chosen step, and the parity result at each coarser admitted
    step tried.
  - A unit that loses a mutant at 1 000 stays at 100, or at 10 for U8.
- **`A3` (row count 126).** **Given** the vitest JSON report of the default lane at base and at the tip, **then**
  `src/uci-session.test.ts` reports **126** tests at each, all passed, 0 skipped.
  - The sorted list of full test names (describe path plus title) is byte-identical at base and tip.
  - The lane's total test count is equal at base and tip (1 987 on `main` at `8522609d`).
- **`A4` (no assertion bound or title changed).** **Given** `git diff -U0 <base> <tip> -- src/uci-session.test.ts`,
  **then**:
  - outside U1, every changed non-comment line differs from its base line **only in the step literal**: the second
    argument to `talk(…)`, or `stepMs` in U8's `rig({ … })`;
  - no `expect(` line outside U1 changes, and no `it(` or `describe(` title, budget or bound literal changes
    anywhere;
  - within U1, the `it` title template is byte-identical, and the change is A1's restructure plus its step.
- **`A5` (everything else byte-identical, one file).** **Given** the same diff, **then** every hunk falls inside the
  base line ranges of U1–U8, plus comment lines that cite `ABC-177` or `ADR-0046`. So:
  - the class P rows, the class C rows and the shared helpers named in Out of scope are byte-identical;
  - `git diff --name-only <base> <tip>` prints exactly `src/uci-session.test.ts`;
  - any census instrumentation (A7) lives in scratch and is not committed.
- **`A7` (node census, not timing).** **Given** `deepen`'s return instrumented in scratch, as at `ABC-173`
  (`…a7c3d910`), **when** the 15 changed rows run at base and at the tip, **then** a table gives nodes per row at
  each.
  - Every row whose step or dialogue changed reads strictly fewer nodes at the tip.
  - A row the build left unchanged is listed as unchanged.
  - The summed delta is reported, in nodes.

**Gate (QE, then Security/NFR)**

- **`A6` (the same kill set per changed row).** **Given** a mutant list **frozen before any head run** and recorded
  in the gate report:
  - `M01`–`M11`;
  - the wrong builds named by `ABC-167` and `ABC-171` for these rows;
  - the two hold/release mutants: a `bestmove` written on `go infinite`, and a second release that writes.

  **When** each mutant is applied to production at base and at the tip and the changed rows run, **then** every
  changed row kills the same mutant ids at the tip as at base. The SE's own parity run (A2) is re-confirmed by QE.
- **`A8` (`N8-LANE`, one-file set).** **Given** `ADR-0035` D2 as amended, set `src/uci-session.test.ts`, shape
  ONE-FILE:
  - command: `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`;
  - arms: B = `git archive` of base, T = `cp -R B` (clean under `diff -r`), H = `git archive` of the tip;
  - runner: `lane174.mjs` (byte copy), 9 rounds, round 0 discarded, rotated order, GAP 0, k = 2, CPU from
    `/usr/bin/time -p`.

  **When** QE runs it, **then** the charge is ≤ **650 ms CPU** (`N8-LANE` MET). H−B CPU and wall medians with
  intervals are reported as the remedy's narrow-set saving. The set's `F` is the provisional 16 % unless a reading
  exists (`UNKNOWN - verify`).
- **`A9` (full-lane twin, protocol).** **Given** base and tip, **when** QE reads the full lane, **then**:
  - the command is `npm test` as spelled;
  - the arms are B with T, and H with H2;
  - **each of the four arms gets its own `node_modules` from its own `npm ci`.** No arm shares, symlinks or
    copies another's;
  - the readings are taken in a quiet window: `window.mjs`, 180 s foreground, 1 s polls, 0 foreign polls;
  - the instruments are `sampler174.mjs` and `readout-nfr008-174.py`;
  - load1 is ≤ 8 on every scored run;
  - **the power source is recorded per scored run** (AC or battery, and `speed_limit`, as `SEC-174-2` recorded
    them). A run with no power record is not scored;
  - the statistic is `NFR-008` R-1's (`ADR-0035` D1; as `QE-174-b` read it: n 8, k 2, round 0 discarded);
  - `R-173-1` and `R-173-2` are **not** read on these arms.
- **`A10` (the readout).** **Then** the report gives:
  - (i) H's median wall and the `NFR-008` state on H. ≤ 10 s is MET and discharges `R-174-1`. Security/NFR rules
    on it;
  - (ii) H−B wall and CPU medians, with intervals;
  - (iii) each pair's twin R (B/T and H/H2). This is the own-install R Architect/Design may use to move `F`.
- **`A11` (the target, and where a miss goes).** **Then** H's median wall is **≤ 9.2 s** (`ADR-0046` D4: 10 s − 3 ×
  0.28 s; a design target, not an NFR level). If it reads more:
  - **> 9.2 s and ≤ 10 s:** `NFR-008` is MET and `ABC-177` may close on its other criteria. Architect/Design re-opens
    with **O3** for a BA/PM ruling, as tranche 2 under a **new** ticket. This one is not widened.
  - **> 10 s:** the reading goes to the **owner** (`ADR-0035` D6). `ABC-177` holds at the gate until his word. No
    cap, pin, bar or W moves to get under ("the cap does not give way", his Q4).
- **`A12` (gates).** **Given** the tip, **then**:
  - lint, typecheck, unit and build are green;
  - the default lane runs with 0 skips;
  - `ABC-167` `A11`'s M4 sweep row ("every line written in every row starts with an M4 prefix") is green and still
    kills M4. The fold removes only duplicate lines from `everyLine`.

## NFR triggers

- **`NFR-008`** (R-1): `npm test` median wall **≤ 10 s** at load1 ≤ 8 on the declared stack. CPU is reported. This
  ticket's reading is `R-174-1`'s discharge test.
- **Design target:** H median wall ≤ **9.2 s** (A11).
- **`N8-LANE`:** charge ≤ **650 ms CPU** on the ONE-FILE set (A8).
- **`NFR-010`** / heap caps: untouched, because no config or flag moves (A5).
- **Security:** not triggered. Test-only, no input surface.

## Test notes

1. **Watch the fold go red once, then revert** (two armed reds; both are A6 mutants): write a `bestmove` on
   `go infinite` → U1 red on (a); let a second release write → U1 red on (c).
2. **The parity list is fixed first** (A6). Base kill sets are recorded before any step is changed.
3. **U7 and U6 are loops.** Their rows move together, so splitting a loop to give one row its own step is out of
   scope.
4. **U8's step lives in `levelOneMoves`** (`rig({ k, stepMs: 10 })`, line 831), which only the "two sessions" row
   calls. The precondition row between them (846–850) reads `firstDraws(2, 3)` and no clock, so U8's step cannot
   move it. This settles the precondition row that `ADR-0046` marked `UNKNOWN - verify`, by reading the code; nothing
   was run.
5. **Step 1 000 lowers depth on U1–U7 to about 2–3 plies** (`ADR-0046` Consequences). No changed row asserts depth.
   A future row that needs depth on a hold picks its own step under the same rule.
6. **UAT:** the delivered diff carries zero production lines, so `AGENTS.md`'s standing rule (2026-08-17) waives UAT
   if `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty. That is
   measured at delivery, not asserted here.

## Size and priority

**`S`:** one test file, 15 rows in 8 units: one restructure and 8 step literals. The scratch census and parity
runs are the work. **Not `XS`:** parity per unit at up to two candidate steps, and a two-part gate reading.

**`P1`:** every gate inherits `NFR-008` NOT MET under `R-174-1` until this lands. **Not `P0`:** `R-174-1` is MEDIUM
and non-blocking (`security.block_on` is `high`), and no user-visible behaviour is wrong.

**Epic: `EPIC-007`.** Every changed row is an `EPIC-007` ticket's (`ABC-167` A6/A7, `ABC-171` A7). The pain is
lane-level (`NFR-008`), but the code it touches is the UCI session's. `EPIC-007`'s page is not edited by this cut.

## Dependencies

- `ADR-0046` ACCEPTED, 2026-10-20 (`…9fc95cac`). Done.
- The step-set word (§ BA/PM ruling). Given here.
- **OQ-177-1 (owner): this is needed before QE's `A9` twin, not before the build.** If it is still open when QE
  dispatches `A9`, QE records power per run as written and the reading stands as taken, as `QE-174-b`'s did. If he
  later rules AC-only, a battery reading would need re-taking.
- No ticket in flight touches `src/uci-session.test.ts`. The board's in-flight list is this hop only. `ABC-176`
  (Backlog) does not touch it.
- Owners (`ADR-0046` D6):
  - Software Engineer: A1–A5 and A7;
  - QE: A6, A8–A10;
  - Security/NFR: the `NFR-008` state and `R-174-1`'s discharge;
  - Architect/Design: any `F` move, the wording conflict, and tranche 2 if A11 reads > 9.2 s.

## Owner questions

- **OQ-177-1. Must `NFR-008` readings be taken on AC power?** (`SEC-174-2`; asked with the ADR, and **not answered**:
  the word "accept" is read as answering `ADR-0046` only, per `…9fc95cac`.)
  - **Open. BA/PM does not decide it.**
  - Architect/Design recommended yes, AC from the next reading on, forward-only, with readings already taken
    standing as taken (`…58fa35f0`).
  - It matters for `A9`/`A10`. `QE-174-b`'s 10.010 s was on battery, and whether AC would move a 10 ms breach is
    `UNKNOWN - verify`.
  - **Ask before QE dispatches `A9`.**

## Definition of Ready

BA/PM, 2026-10-20, at `main` `a0b145dc`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 10.010 s against 10 s, NOT MET; `R-174-1` on every later gate; 60.7 % of test time in one file |
| 2 | scope and out-of-scope clear | **✅** one file, 8 units and 15 rows by line range; P/C rows, helpers, other files, O2–O5, `F` and power fenced off |
| 3 | INVEST-shaped | **✅** independent (nothing in flight on the file); one slice. Tranche 2 is a separate ticket if A11 misses |
| 4 | acceptance testable and measurable | **✅** 1 `talk` call and 3 named facts; 126 tests and identical names; a step-literal-only diff; one file; the same mutant ids; fewer nodes per row; 650 ms CPU; four own `npm ci`s; power per run; ≤ 10 s; ≤ 9.2 s, with both miss routes |
| 5 | dependencies known | **✅** ADR accepted; step word given; OQ-177-1 placed before `A9`; owners named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` ≤ 10 s at load1 ≤ 8; 9.2 s target; `N8-LANE` 650 ms; security not triggered |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `S` |
| 9 | priority assigned | **✅** `P1`, both directions argued |
| 10 | no major unresolved blocker | **✅** OQ-177-1 governs the admissibility of the `A9` reading. It does not block the build, the census, parity or `N8-LANE` (which pairs arms within a round). It is a dependency of the `A9` hop, not of `Ready`. |

**Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.
