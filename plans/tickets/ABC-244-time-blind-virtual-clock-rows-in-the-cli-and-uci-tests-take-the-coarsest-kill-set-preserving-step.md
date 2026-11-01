---
id: ABC-244
title: "Time-blind virtual-clock rows in `src/cli.test.ts` and `src/uci-session.test.ts` take the coarsest step that keeps QE's caught-mutant set (`ADR-0046` § Addendum 2026-10-30, tranche 1; test-only)"
status: done
column: Done
closed: "2026-10-30, merged to main at 24b22339; QE PASS (qe-ABC-244, 4fe9bfe1); Security/NFR PASS (secnfr-ABC-244, 9087cb39); test-only, UAT waived"
size: S
priority: P1
epic: EPIC-010
feature: —
---

# ABC-244: give the time-blind `ABC-230` / `ABC-241` rows the coarsest kill-set-preserving step, on both surfaces at once. Two test files

> **CLOSED, Done, folded 2026-11-01 by BA/PM** (task `bapm-page-closes`, records only, at `main` `55fbc90e`; nothing
> run, because `qe-ABC-246` holds the host). The page read `ready` / `Backlog` after the merge; this fold closes it.
> QE's verdict is **PASS** (`qe-ABC-244` `…4fe9bfe1`, PREREG and frozen list `5b4961e1` before any head run) at
> `25282ad4`. Security/NFR's gate is **PASS** (`secnfr-ABC-244` `…9087cb39`; security not triggered). It was **merged
> at `24b22339`** on 2026-10-30. Two `*.test.ts` files and 0 production lines, so **UAT is waived**; the QE verdict
> signs (Test note 6).
>
> - **A6–A9 MET, A10 green, A3–A5 MET on QE's spot check.** A1–A2 are the SE's build note, re-confirmed by A6. U1
>   took step 1 000 on both surfaces; U2 kept 100 (it loses mutants at 1 000); no census unit joined. A6: 24 frozen
>   mutants, 0 U1 rows differ base to head. A7: 1 014 507 → 223 432 nodes. A8 `N8-LANE` −1.145 s CPU. A9 `G8` H
>   9.25 s, B 9.69 s: `NFR-008` MET and the 9.4 s design target MET, so tranche 2 did not fire here.
> - **QE's, Security/NFR's and the SE's gaps, dispositioned** (`qe-ABC-244` `…98d5d2e4`, `secnfr-ABC-244` `…619ead26`):
>   - **QE-244-a** (LOW; SE-244-a widened: at step 1 000 CLI `ABC-241` A4 and A7 lose F230, QSEAMRAW, QPRIOROFF, QMATCH3,
>     QTRIM1). **Carried, with two named carriers.** (1) BA/PM at every cut, through the R4 DoR line in § BA/PM ruling:
>     a ticket that moves those rows' step, cuts `LEVELS[5].budgetMs`, or raises `NODES_PER_CLOCK_CHECK` re-runs A6 on
>     CLI `ABC-241` A4 and A7 with at least those five mutants. (2) Tranche 2, `ABC-248`: its § Out of scope already
>     fences the `ABC-241` U2 rows out ("the ep guard's only killers"), so the carry holds there with no edit.
>   - **QE-244-b** (INFO; SE-244-b). **Closed.** CLI `ABC-230` A3 kills none of the 24, as `qe-ABC-230` recorded; parity
>     holds on it vacuously. The other row SE-244-b named does discriminate on QE's list.
>   - **QE-244-c** (INFO: 9 mutants survive all 18 rows at both trees). **Closed for this ticket**, which asked for
>     parity, not more kills. Four of the nine are killed elsewhere on record: QM1, QM2 and QM4 turned `npm test` red
>     at `qe-ABC-241`, and QM3 is killed by `ABC-243`'s A6 row (`qe-ABC-243` `…2d790e40`). Whether any other row kills
>     the other five (S241M5, QPARITY, QCLOCK, QPLY4, QPATHOFF) stays `UNKNOWN - verify`. A whole-lane read of them is
>     proposed in `bapm-page-closes`' Result, as a read in a later QE hop, not a ticket.
>   - **QE-244-d** (INFO: 9.25 s sits 0.15 s under the target, inside window drift). **Closed, overtaken.** The standing
>     trigger fired later: `qe-ABC-245` read H 9.82 s, and tranche 2 is cut as `ABC-248`.
>   - **QE-244-e** (twin near the 1.5 % edge), **QE-244-f** (the U1 comment stays true). **Closed**, no action.
>   - **SE-244-c, SE-244-d** (saving and informal wall, `UNKNOWN - verify`). **Closed:** A8 and A9 read them.
>     **SE-244-e** (two reconstructed mutants). **Closed:** QE adopted the SE's 9 into the frozen 24.
>   - **Security/NFR's carries.** The `NFR-008` state and the two-file set's first `F` (0.250 s CPU) are in
>     `plans/nfr-catalog.md`. **Closed.** QE-244-a is the carry above.
> - **§ Dependencies' records item is met:** `ADR-0046`'s status block records this page's word (§ Addendum: BA/PM's word
>   given, `arch-qe242a-ruling`, 2026-10-31).
> - No follow-up ticket cut here. Notes: `.grugops/context/bapm-page-closes/notes/`.

> **Cut 2026-10-30 by BA/PM** (task `bapm-g8-headroom-cut`, records only, at `main` `161e940d`; `src/`, `tools/`,
> `data/`, the board and the ADRs untouched). It answers `QE-229-a` (MEDIUM, `qe-ABC-229` `…0b7fd4f6`): `G8` read
> head 9.90 s and base 9.90 s, so `NFR-008` has 0.10 s of headroom.
>
> **Design:** `ADR-0046` § Addendum 2026-10-30 (R1–R4), PROPOSED by Architect/Design (`arch-g8-headroom`, branch
> `grugops/arch-g8-headroom` @ `5fd3eee7`; Result in `.grugops/queue/done/arch-g8-headroom.md`; decision note drafted
> in `.grugops/context/arch-g8-headroom/raw/note-decision.md`). **This page gives BA/PM's word on R1–R4** (§ BA/PM
> ruling), as `ABC-177`'s page gave the D2(b) word. **This hop ran nothing and timed nothing.** Line numbers were read
> at `161e940d`.

## Problem

- **User:** the owner, and every agent hop that runs the default lane at a gate.
- **Pain:** `npm test` reads **9.90 s** against `NFR-008`'s 10 s (`qe-ABC-229`, head and base medians alike).
  - The headroom, 0.10 s, is inside the lane's own spread. `ABC-229`'s base runs span 9.64–10.09 s. The same lane
    inputs read 9.73 s and then 9.90 s in two windows, +0.17 s with no code change (`ADR-0046` § Addendum, Context).
  - Three Ready tickets add default-lane rows: `ABC-242`, `ABC-221` and `ABC-243`. Without headroom the next gate
    that reads `G8` is a coin toss on NOT MET.
- **Why there is slack to take:** the `ABC-230` and `ABC-241` blocks in the two files search the default level
  (4 000 ms) at virtual step 100, which is 40 clock reads per search, about 41 000 nodes. **None of their
  assertions reads time.** They read a move, a score (0, or not 0) or the keys handed. They cost about 1.43 s of
  in-thread time (`arch-g8-headroom` observation, `raw/probe/rows.out`).
- **Value:** an estimated **−0.3 to −0.65 s** of lane wall (an estimate, `UNKNOWN - verify` until A9 reads it), with
  no row, bound, title, cap, pin or lane line moved. The cost of these rows also stops tracking `LEVELS` re-cuts: at
  step 1 000, a level-5 search makes 4 reads, and a re-cut to 5 000 ms makes 5.

## Scope

Two files: `src/cli.test.ts` and `src/uci-session.test.ts`. A **change unit** is one step value. Rows that read one
`STEP_MS` constant share it, and R3 joins a CLI constant with its UCI pair, so each unit is one value written in
two places.

| unit | file | block (line at `161e940d`) | its `STEP_MS` (line) | rows that read it | step today | admitted |
|---|---|---|---|---|---:|---|
| **U1** | `src/cli.test.ts` | `ABC-230 A1, A3` (`:4546`) | `:4555` | A1 "plays the third occurrence, at 0"; "keyHistory is read once per engine move"; A3 "a game started from a FEN … base's" | 100 | {100, 1 000} |
| (U1, R3 pair) | `src/uci-session.test.ts` | `ABC-230 A2, A3, A5` (`:1277`) | `:1286` | A2 "bestmove is byte-equal to the CLI level seam's move on the same game and clock" | 100 | same value as the CLI half |
| **U2** | `src/cli.test.ts` | `ABC-241 A4, A7` (`:4621`) | `:4626` | A4 "plays d8e8 at exactly 0; base does not"; A4 "with a legal ep capture available … not a draw"; A7 "the move the search scores 0 is the move after which gameStatusOf reports the claim" | 100 | {100, 1 000} |
| (U2, R3 pair) | `src/uci-session.test.ts` | `ABC-241 A4, A5` (`:1408`) | `:1413` | A5 "the CLI level seam's injected list equals UCI's, key for key, and both play d8e8" | 100 | same value as the CLI half |

- **The four blocks hold 18 rows** (3 + 4 + 7 + 4, `arch-g8-headroom` `rows.out`). **Eight of them read a
  `STEP_MS`** and are the units above. The other ten either search at fixed depth (`go depth 1`/`4`, or
  `budgetMs: 1e9, maxDepth: 4`), or do not search at all (the source-text import pin). They are byte-identical.
- **Census-found units (optional, bounded).** The R1 census (A1) also covers every row added to the two files after
  `ABC-177`'s merge (`4debc07d`) that searches on a virtual clock. Sites read at `161e940d`, as candidates only:
  `src/uci-session.test.ts` `:298`, `:392`, `:452`, `:1033`, `:1051`, the `session220` default `stepMs = 1_000`
  (`:1543`), `:1748`, `:1804`, `:1910`, `:1989`. A candidate joins as a unit **U3…** only if all of these hold:
  - the census classes every row it governs as time-blind (R2);
  - its step is one literal at one call site, so no shared helper default moves;
  - its step today is finer than 1 000;
  - it passes the same rule as U1/U2.

  **At most four census units join.** If the census finds more, none joins, and the list goes to the build note for
  a follow-up ticket. This keeps the ticket `S`.

## Out of scope

- Every row that reads time (class P or C under `ADR-0046`): it keeps its step (R2).
- The shared helpers, byte-identical: `dialogue` (and its default `stepMs = 10`), `talk`, `rig`, `session220`'s
  default, `virtualClock`, `expectWithin`.
- Every other file: production `src/*.ts`, `vitest.config.ts`, `package.json`, `AGENTS.md`, `tools/`, `data/`,
  `plans/nfr-catalog.md`.
- `src/cli.test.ts`'s 28 module-scope children (`C2`), per-file overhead (`ADR-0040`), `src/search.null-move.test.ts`
  (tranche 2's T2b/T2c), and moving any row to an opt-in lane (T2a). Tranche 2 is a **new** ticket, opened only by
  the triggers in § NFR triggers.
- Re-levelling `NFR-008`'s 10 s, `maxWorkers`, the heap rows, and `ADR-0035`'s load qualifier. The owner holds the
  levels. The qualifier stands (`ADR-0035` § Addendum 2026-10-30, SEC-REBASE-b).
- Splitting a shared `STEP_MS` so one row gets its own step. Rows that read one constant move together.

## BA/PM ruling: R1–R4 are given, with `ABC-177`'s three conditions

**Ruling (BA/PM, 2026-10-30).** `ADR-0046` § Addendum 2026-10-30 R1–R4 is given BA/PM's word at this cut, as D2(b)
was at `ABC-177`. The step set is **{1, 10, 100, 1 000}**, and these conditions carry over from `ABC-177`'s ruling
unchanged:

1. **Kill-set parity decides the step.** A unit takes the coarsest admitted step at which every row in it is green
   and kills exactly the mutant ids it kills at base (A6). It is never finer than today's step, so U1 and U2 choose
   between 100 and 1 000. A unit whose kill set changes at 1 000 keeps 100. This covers a gain as well as a loss: a
   row that kills **more** at the tip is recorded, and its unit keeps 100.
2. **1 000 never turns a multi-check search into a one-check search.** Step 1 000 is admitted for a unit only if
   every search in its rows that runs ≥ 2 clock-check intervals at today's step (⌈budget ÷ step⌉ ≥ 2) still runs
   ≥ 2 at 1 000.
   - U1 and U2 pass. Every one of their searches is the default level's 4 000 ms: 40 intervals at step 100, 4 at
     1 000.
   - A census unit is checked against its own budgets in the build note.
3. **The mutant list is frozen before any head run** (A6).

**R3, applied.** A unit's two halves are written with one value. That value is the coarsest step at which **every
row on both surfaces** passes conditions 1–2. If the UCI half loses a mutant at 1 000, the CLI half stays at 100
too.

**R1 and R4 bind other tickets from this cut on.** Every ticket that adds or edits a default-lane row that searches
on a virtual clock carries an R1 census line in its build note: reads per search, budget ÷ step. BA/PM checks that
the line is owed in the ticket's DoR NFR row. A new time-blind row takes its R2 step at its own ticket. A QE probe's
set-up is not a lane form. `ABC-242` and `ABC-221` are amended to say so on this hop.

**Why.**
- **The bounds cannot see the step on these rows.** Every assertion reads a move, `cp 0` / not 0, or a key list.
  The repetition is one ply deep on 3–5-piece endgames, so a search 3–4 plies deep finds it (`ADR-0046` § Addendum,
  Consequences). Only kill-set parity can catch a bad step, which is the same footing as D2(b).
- **R3 keeps the pair's claim honest.** The UCI rows' titles say "the same game and clock". Two steps would make that
  title false.
- **The price is small, and condition 2 caps it.** Four reads still run the iterative loop more than once. A wrong
  build outside the frozen list that only shows at depth ≥ 5 would pass unseen. No `ABC-230` / `ABC-241` criterion
  asks for depth.
- **No owner word is needed.** No NFR level, bar, cap, pin, row count or lane line moves (`ADR-0046` § Addendum,
  Status). The ADR's status line is not edited here. Recording this word there is a records hop's job (§ Dependencies).

## Acceptance criteria

The base is `main` at the commit the build branches from (`161e940d` or later, carrying `5fd3eee7`'s records). The
tip is `ABC-244`'s delivered commit.

**Build (Software Engineer)**

- **`A1` (R1 census).** **Given** the build note, **then** it holds one line per row in U1, U2 and every census
  candidate in § Scope. Each line gives:
  - the row's title;
  - its budget and its step, at base and at the tip;
  - its reads per search, ⌈budget ÷ step⌉, at base and at the tip;
  - its class: time-blind, or reads time (and which assertion reads it).
- **`A2` (the step per unit).** **Given** U1, U2 and any census unit, **when** the SE builds the tip, **then** each
  unit's step is the coarsest admitted step at which § BA/PM ruling conditions 1–2 hold for every row on both of its
  surfaces. It is one value in both files.
  - The build note records, per unit, the chosen step and the SE's parity result at each coarser admitted step tried.
  - A unit that fails at 1 000 stays at 100.
- **`A3` (row count and names).** **Given** the vitest JSON report of the default lane at base and at the tip,
  **then**, for each of the two files:
  - the test count is equal at base and tip, all passed, 0 skipped;
  - the sorted list of full test names (describe path plus title) is byte-identical.

  The lane's total test count is equal at base and tip.
- **`A4` (only step literals change).** **Given** `git diff -U0 <base> <tip> -- src/cli.test.ts
  src/uci-session.test.ts`, **then**:
  - every changed non-comment line differs from its base line **only in a step literal**: a unit's `STEP_MS` value,
    or a census unit's one step argument;
  - no `expect(` line changes, and no `it(` or `describe(` title, budget, depth or bound literal changes;
  - added comment lines only cite `ABC-244` or `ADR-0046` § Addendum 2026-10-30. The UCI comment "The CLI's step in
    `src/cli.test.ts`'s `ABC-230` rows" stays true.
- **`A5` (everything else byte-identical).** **Given** the same diff, **then**:
  - every hunk falls on a unit's step line or on an A4 comment line;
  - the helpers in § Out of scope are byte-identical;
  - `git diff --name-only <base> <tip>` prints only `src/cli.test.ts` and/or `src/uci-session.test.ts`;
  - census instrumentation (A7) lives in scratch and is not committed.

**Gate (QE, then Security/NFR)**

- **`A6` (the same caught-mutant set per changed row).** **Given** a mutant list **frozen before any head run** and
  recorded in the gate report, holding at least:
  - `qe-ABC-230`'s planted fault: `src/level-seam.ts` ignores the injected `keyHistory` (`…af1628d2` § 3);
  - `qe-ABC-241`'s QM1–QM4 (`…939168a8` § 2);
  - a session that hands untrimmed keys: `uci-session.ts` passes the replayed keys without `trimPriorKeys`;
  - a repetition that scores non-zero: the search's third-occurrence draw score returns a value other than 0;
  - any SE mutant ids QE names for the `ABC-230` / `ABC-241` rows;

  **when** each mutant is applied to a scratch copy of production at base and at the tip, and the changed rows run,
  **then** every changed row kills exactly the same mutant ids at the tip as at base. The SE's parity run (A2) is
  re-confirmed by QE. A row that does not discriminate at base (`qe-ABC-230`: the two R fixtures through the seam)
  is recorded as such. Parity asks for equality, not improvement.
- **`A7` (node census per changed row, not timing).** **Given** `deepen`'s return instrumented in scratch, as at
  `ABC-177` A7, **when** the changed rows run at base and at the tip, **then** a table gives nodes per row at each.
  - Every row whose step changed reads strictly fewer nodes at the tip.
  - A row in a unit that stayed at 100 is listed as unchanged.
  - The summed delta is reported, in nodes.
- **`A8` (`N8-LANE`, the two-file set).** **Given** `ADR-0035` D2 as amended, the set `src/cli.test.ts` +
  `src/uci-session.test.ts`, and the runner and arms as at `ABC-177` A8 with both files named on the command line,
  **when** QE runs it, **then** the charge is ≤ **650 ms CPU** (`N8-LANE` MET). H−B CPU and wall medians, with
  intervals, are reported as the narrow-set saving. The set's `F` is the provisional 16 % unless a reading exists
  (`UNKNOWN - verify`).
- **`A9` (`G8`, and the design target).** **Given** base and tip, **when** QE reads `npm test` interleaved b h h b b h
  after a wait-clear (load1 ≤ 2.0 and Tctl ≤ 60 °C before each run, load1 ≤ 8 on every scored run), as at
  `qe-ABC-229`, **then** the report gives:
  - H's median wall, and the `NFR-008` state on H. ≤ 10 s is MET;
  - H−B median wall;
  - H's median against the **design target ≤ 9.4 s** (`ADR-0046` § Addendum: 10 s − 3 × 0.17 s, rounded down). This is
    a design target, not an NFR level. `NFR-008` stays 10 s.

  A miss of 9.4 s with H ≤ 10 s does **not** fail this ticket. It fires the tranche-2 trigger (§ NFR triggers), and
  this ticket may close on its other criteria. H > 10 s goes to the owner (`ADR-0035` D6), and the ticket holds at
  the gate until his word. No cap, pin, bar or level moves to get under.
- **`A10` (gates).** **Given** the tip, **then**:
  - lint, typecheck, unit and build are green;
  - the default lane runs with 0 skips, and `test-skip-integrity` reports no findings;
  - `ABC-230`'s and `ABC-241`'s rows in the two files are green, with their titles and assertions unedited (A4).

## NFR triggers

- **`NFR-008`** (R-1): `npm test` median wall **≤ 10 s** at load1 ≤ 8 on the declared stack. CPU is reported. A9.
- **Design target:** H median wall **≤ 9.4 s** at this ticket's gate (A9).
- **Triggers** (`ADR-0046` § Addendum 2026-10-30), held by the Orchestrator's `NFR-008` watch:
  - **H > 9.4 s at this gate, or any later `G8` head median > 9.6 s:** tranche 2 opens. Architect/Design re-opens
    with T2a (UCI P/C rows to `UCI_DEEP`), T2b (`QE-208-a`/`-b` and A2 depth-6 rows to `SEARCH_DEEP`) and T2c (a
    sparser `QE-208-a` sweep) for a BA/PM ruling, under a **new** ticket. This one is not widened.
  - **Still > 9.7 s after tranche 2:** `NFR-008` goes to the owner (`ADR-0035` D6), with (d) and the owner-held
    levers (`maxWorkers: 3`, the heap rows, raising W) named.
  - **> 10 s at any gate:** owner, as A9 says.
- **`N8-LANE`:** charge ≤ **650 ms CPU** on the two-file set (A8).
- **R1 (census):** this ticket's A1 is the first R1 census line on record.
- **`NFR-010`** / heap caps: untouched. No config or flag moves (A5).
- **Security:** not triggered. Test-only, with no input surface.

## Test notes

1. **Freeze the list, then record base.** QE's mutant list (A6) and the base kill sets are recorded before any step
   changes. The SE's own parity run (A2) uses the same list.
2. **U1 and U2 are two values, written four times.** Change both halves of a unit in one edit, and run parity on both
   surfaces before choosing. Under R3 the weaker half decides.
3. **Expect depth to drop to about 3–4 plies on the moved rows** (`ADR-0046` § Addendum, Consequences). No moved row
   asserts depth. If a row turns red at 1 000 (for instance `ABC-241` A4's "base does not score 0" at a shallower
   depth), that is a failed step, not a bound to edit. The unit stays at 100.
4. **The census is a read, not a timing.** A1's reads per search are arithmetic (⌈budget ÷ step⌉). A7's nodes come
   from scratch instrumentation. Neither needs a quiet host. A8 and A9 do.
5. **Width.** A8 and A9 are QE timed reads, ALONE on the host, never beside a smoke, a batch or another timed read.
   The build and A6/A7 do not need ALONE.
6. **No smoke.** `EPIC-010` § The merge rule binds value-changing tickets, and this one changes no production line.
   **UAT:** the delivered diff carries zero production lines, so `AGENTS.md`'s standing rule (2026-08-17) waives UAT
   if `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` is empty. That is
   measured at delivery, not asserted here. QE's verdict is the gate.
7. **Rollback.** Revert the delivered commit. A row that turns flaky, or loses a mutant later, goes back to 100 alone
   with its R3 pair (`ADR-0046` § Addendum, Rollback).

## Size and priority

**`S`:** two files, two units (four step literals), plus at most four census literals. The work is the census, the
parity runs at one candidate step per unit, and a two-part timed gate. **Not `XS`:** parity across two surfaces per
unit, and the timed reads. **Not `M`:** the census units are capped at four.

**`P1`:** the lane has 0.10 s of headroom inside a 0.45 s spread, and three Ready tickets add rows to it, so every
gate that reads `G8` risks NOT MET until this lands. **Not `P0`:** `NFR-008` is MET today (9.90 s), and no
user-visible behaviour is wrong.

**Epic: `EPIC-010`.** Every changed row is an `EPIC-010` ticket's (`ABC-230`, `ABC-241`). The pain is lane-level
(`NFR-008`), and `EPIC-010`'s next tickets (`ABC-242`, `ABC-243`) are the ones that would spend the headroom. This
follows the `ABC-177` precedent: that ticket took the epic that owned its rows (`EPIC-007`).

## Dependencies

- **`ADR-0046` § Addendum 2026-10-30, PROPOSED** (`5fd3eee7`), and the step word (§ BA/PM ruling, given here).
  **`grugops/arch-g8-headroom` and this cut merge to `main` before the build branches.** The merges are the
  Orchestrator's. The Architect's two notes are drafted, and their seal is pending.
- **Owed by a records hop (not a wait):** the `ADR-0046` status line should record that the addendum's word was given
  on this page, as the `ABC-177` line does. That hop is the Architect's or the merge hop's. BA/PM does not edit the
  ADR here.
- **Pull order:** **before `ABC-242`, `ABC-221` and `ABC-243`.** All three edit `src/uci-session.test.ts`, and
  `ABC-242` also edits `src/cli.test.ts`. This ticket is pulled first so their `G8` reads land on the cheaper lane
  and their own R1 lines read against a settled base. Each of the three rebases on it.
- **In flight:** `ABC-225` (In Review) changes `tools/rating/` only, so it shares no file with this ticket. Nothing
  else in flight touches the two files.
- **Host:** A8 and A9 wait for an ALONE window. `qe-ABC-225-w1` holds the host now (40 games).
- **Owners:**
  - Software Engineer: A1–A5;
  - QE: A6–A9, and A10's lane;
  - Security/NFR: the `NFR-008` state;
  - Architect/Design: tranche 2, if a trigger fires.
- No owner question.

## Definition of Ready

BA/PM, 2026-10-30, at `main` `161e940d`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ `G8` 9.90 s against 10 s, headroom 0.10 s inside a 0.45 s spread (`QE-229-a`); three Ready tickets add rows; 1.43 s of time-blind virtual-clock search named by row |
| 2 | scope and out-of-scope clear | ✅ two files; 2 units, 8 rows, 4 literals by line; census candidates listed by line, at most 4 join; P/C rows, helpers, other files, tranche 2 and owner levers fenced off |
| 3 | INVEST-shaped | ✅ independent (nothing in flight on the files); one slice; tranche 2 is a separate ticket; testable by parity and counts |
| 4 | acceptance testable and measurable | ✅ a census line per row; a step-literal-only diff; equal test counts and byte-identical names per file; the same mutant ids per changed row; strictly fewer nodes per moved row; 650 ms CPU; ≤ 10 s; ≤ 9.4 s, with the miss routes |
| 5 | dependencies known | ✅ the ADR addendum on `5fd3eee7` with the word given here; merge before build; pull before `ABC-242`/`ABC-221`/`ABC-243`; ALONE host for A8/A9; owners named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s at load1 ≤ 8; target 9.4 s; triggers 9.4 / 9.6 / 9.7 / 10 s; `N8-LANE` 650 ms; R1 census owed and present (A1); security not triggered |
| 7 | test notes present | ✅ seven |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P1`, both directions argued |
| 10 | no major unresolved blocker | ✅ the step word is given here. The branch merges are the Orchestrator's routine, and the ADR status line is a records hop, not a wait |

**Recommended: `Backlog → Ready`, pulled ahead of `ABC-242`, `ABC-221` and `ABC-243`.** Column moves are the
Orchestrator's.
