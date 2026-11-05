---
id: ABC-303
title: "Bundle 1: P4 move-count pruning (ADR-0072, form M3) and the countermove (ADR-0073, form C1), built on one branch, each behind its own ADR door plus one door that turns both off; the bars are ADR-0056 D5's dated block, tables 1–3: all-off equals the merge-base exactly, the safety rows, L4, G6, NFR-008 ≤ 10 s and ≤ +0.10 s; then ONE read, 100 games at 100 ms against the merge-base, GAIN ≥ 50.0, never re-played, after ABC-282 and ABC-301 have settled"
status: ready
column: Ready
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0072 (form M3; ABC-286) and ADR-0073 (form C1; ABC-288) ACCEPTED 2026-11-04 by the owner's word, OVER MISSED PREMISES (orch-2026-10-30a …3e73f9f9; Status lines arch-owner-answers-1104b …88ca95bd). F1 stays fired on both. Not in force until this ticket merges on its read; on NOT MET, B6 returns each to PROPOSED, premise not met. The bars are ADR-0056 D5's dated block of 2026-11-04, tables 1–3; B5's line naming this ticket and the read is owed at QE's verdict"
---

# ABC-303: bundle 1, P4 + the countermove, one branch, one read

> **§ OPEN 1 ANSWERED: THE STRICT READING IS REPLACED BY CF1–CF10; `ABC-301`'S HALF OF THE SLOT IS MET; § OPEN 3 RULED; § OPEN 4'S
> MOVED-BASE WORRY GONE FOR THAT HALF, 2026-11-05, by BA/PM** (task `bapm-wait-lines-1105`, records only, at `main` `a38315bf`; nothing
> run). Sources: the owner's word `orch-2026-10-30a` `…b836b85c` item 2, `ADR-0056`'s dated block of `arch-owner-answers-1105`
> (CF1–CF10), `…4844df37`, `…2b3440cf` item 4, `…3c67d3c4`, and his later word of the same day, `…0f1ab02e`.
> - **Written at** The read, § What happens on a miss, § Open 1, 3 and 4, § Dependencies and § Definition of Ready. Tables 1–3 stay
>   word for word. CF1–CF10 are cited, not copied: the block governs, and QE copies from it.
> - **The form does not stop at this ticket.** `…4844df37` bound it here; the owner then widened it to later single-read reads and bundles
>   (`…0f1ab02e` item 1). ~~Which reads, and whether a line adapts, is `arch-owner-answers-1105b`'s, in flight.~~ *2026-11-05 (`bapm-pointers-1105`): **settled** by `ADR-0056` D5's dated block of
>   `arch-owner-answers-1105b` (`…65557abd`): every later C2′ read, of one change or of a bundle, and six phrases that read through its table on any read but this one.* This ticket's form does not change.
> - **CF7 is owner-accepted** (`…0f1ab02e` item 3), so the Architect's-carry mark the brief asked for is off (§ Open 1).
> - **The slot:** `ABC-301` closed NOT MET, so C2′ waits on `ABC-282` alone, and through it on A4.
> - No bar, size or priority moves. **DoR 10/10, unchanged.** The column moves are the Orchestrator's.

> **THE COUNTERMOVE'S TERM OWED IN `NFR-009`'S SUM; A3 (a)'S COMMENT GOES WHEN `main` GOES IN; § OPEN 1, 2 AND 4 ANSWERED BY
> REFERENCE, OPEN 1 WAITING ON THE OWNER WITH THE STRICT READING IN FORCE, 2026-11-04, by BA/PM** (task `bapm-K0-cut`, records
> only, at `main` `8527e49f`; nothing run). Sources: `arch-ABC-303-open` `…84f9bae1`, `…e28552ac`, `…5aee89b7`, `ADR-0056`'s dated
> block of that task, and the Orchestrator's ruling `orch-2026-10-30a` `…681c6363` 2.
> - **Written at** § Scope item 2, The read, § What happens on a miss, § NFR triggers, test note 4, § Open 1, 2 and 4, and
>   § Definition of Ready. The block stays word for word.
> - **`ABC-271` K0's red is not this ticket's** (`ABC-304`): no row of tables 1 or 2 names it, so it gates neither the seal nor the read.
> - No bar, size or priority moves. **DoR 10/10, unchanged.** The column moves are the Orchestrator's.

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-bundle-1-cut`, records only, at `main` `3ad21218`; nothing
> run, built or timed). Sources: the owner's *"1. Bundle 1: (a)"* (`orch-2026-10-30a` `…3e73f9f9`), `ADR-0056` B7 and
> D5's dated block of 2026-11-04, the Architect's decision `arch-owner-answers-1104b` `…88ca95bd` § 6 item 3 and its
> PREREG shape `…d776c0f0`, and the Orchestrator's slot (brief `bapm-bundle-1-cut`).
> **Every bar below is copied word for word from that block.** None is added, none is loosened, and none is re-ruled.
> Where the records do not settle a point, this page says so and leaves it open (§ Open, not bars).
> - **This is an override, not a pass.** His word takes both parts past their missed premises: `ADR-0072` L2 (drift and
>   audit) and `ADR-0073` CH3. F1 stays fired on both. `ABC-286` and `ABC-288` stay as the design pages. This ticket is
>   the build and the read.
> - **`ABC-289` is not a part.** The owner named the parts. It reads alone, after this ticket's merge or `failed-attempt`.
> - **The slot:** the code may be built now; the C2′ read waits on `ABC-282` and `ABC-301` (§ Dependencies).
> - The id `ABC-303` was checked free on `main` and on every unmerged local branch at the cut.
> - **The column moves are the Orchestrator's.** The front matter reads Ready, the BA/PM exit.

## Problem

- **User:** the owner at level 5, and every later read of this epic at the 100 ms node budget.
- **Pain:** two quiet-move changes were probed over history, and each missed its own premise on `main` `0cc9afd1`.
  - **P4** (`ADR-0072`, form M3) meets L3 and L4 and misses L2: drift 93.58 % / 94.12 % within 25 cp (bar ≥ 95 %), 80 / 79 cp
    (bar ≤ 75); audit 15.27 % (bar ≤ 0.5 %), 29 errors ≥ 200 cp (bar 0).
  - **O2c** (`ADR-0073`, form C1, the countermove alone) meets CH2 and misses CH3 on all four: 1.0031 / 0.9999 / 1.0935 /
    0.9989 against ≤ 0.95.
- **Value:** whether the two together win games at 100 ms. `ADR-0056` D2 estimates P4 at +20–40 Elo and O2c at +10–30.
  Those are estimates, not readings. All on against `main`, the probe read d8 0.5947 / 0.8106 / 0.6982 / 0.9358 and reach
  +0.148 ply. **The read decides it: one read, never re-played.** Both parts fire at 100 ms (`ADR-0072` d10, `ADR-0073`
  d11), so GAIN is the intent.
- **What a pass cannot show** (`ADR-0072` § Status, R-BUNDLE-1 and what this override adds, the owner's knowingly):
  1. P4 enters past the audit and drift rows, with piece-sized errors on record.
  2. The countermove has no measured pay. A pass cannot show that it earns its place.

## Scope

Each item is built **exactly as its ADR states.** The parts' pages are the design pages.

1. **P4, `ADR-0072` (`ABC-286`), form M3:** T = 4 / 7 / 12, d ≤ 3, key-0 quiets only, three non-pawn pieces, in both
   recursions (d1–d4). Switch `moveCount`, on in `search()` and `chooseMove` only (d5). Doors
   `searchWithoutMoveCountPruning` / `chooseMoveWithoutMoveCountPruning` (d6).
2. **O2c, `ADR-0073` (`ABC-288`), form C1, the countermove alone:** one 3 072-byte table, one tier after the killers, in
   both recursions, cleared with the history table (d1–d5). Switch `countermove`, on in `search()` and `chooseMove` only
   (d6). Doors `searchWithoutCountermove` / `chooseMoveWithoutCountermove` (d7).
   *2026-11-04 (`bapm-K0-cut`; `ADR-0073` d7's dated line, `…5aee89b7` item 6): **owed under "exactly as its ADR states":
   `countermoveByteLength()` is a term in `NFR-009` (a)'s sum row of `src/transposition.test.ts`.** The build has the byte row, P5,
   and that bar is met; the sum omits the table. One line, when `main` goes in, before QE seals. It is no row of tables 1 or
   2, so it gates nothing.*
3. **One all-off door:** `searchWithoutQuietBundle` / `chooseMoveWithoutQuietBundle` turn off both parts (`ADR-0072` d6).
4. **Every older door turns both parts off** (`ADR-0026` decision 3), `searchWithoutHistory` and `searchWithoutBundle`
   included. Rows re-point by `ADR-0072` d6's references. No zugzwang row's depth is re-pinned. The export lists grow by
   `ADR-0072` d6 and `ADR-0073` d7.
5. **The rows** go where `ADR-0072` d7 and `ADR-0073` d8 place them: the existing `src/search.bundle.test.ts`.

## Out of scope

- **L2's drift share, cap and audit as bars, and CH3.** His word lifts them. They are reported (table 3), not graded.
- **A read per part, or a re-read of any subset.** There is one read, of the bundle.
- **Re-tuning after the read:** T, the three-piece clause and the tier do not change, and no form is swapped.
- **Continuation history.** Rejected (`ADR-0073` § Alternatives).
- **`ABC-289` (Q2), `ABC-284` (P1)** and any other change. `ABC-284` stays apart, so the mate floor stays attributable
  (`ADR-0056` B7's list).
- Any change to evaluation, quiescence, the transposition table or time use (`ABC-282`).

## Acceptance criteria

The bars are `ADR-0056` D5's dated block of 2026-11-04 (`arch-owner-answers-1104b`), copied word for word. They are not
loosened after Ready. If this page and that block differ, the block governs and QE reports the difference (`…d776c0f0`).
Why each open row was ruled as it was is in the block, not here.

Row ids are the block's, so QE's PREREG copies them by number. They are not the parts: row S1 is all-off identity, not
`ADR-0066`'s S1; row P1 is a door row, not LMR's P1; row P4 is the reach bar, not the part P4.

**The doors.** All on is the shipped `search()` / `chooseMove`. The all-off door is `searchWithoutQuietBundle` /
`chooseMoveWithoutQuietBundle`. P4's own door is `searchWithoutMoveCountPruning` / `chooseMoveWithoutMoveCountPruning`.
O2c's own door is `searchWithoutCountermove` / `chooseMoveWithoutCountermove`. A row is read all on unless it names a door.
Four-figure ratios run `search()` kiwipete, `chooseMove` kiwipete, `search()` position-6, `chooseMove` position-6. Figures
are the probe's, on `0cc9afd1`.

**Table 1: the safety bars.** Graded. Read all on, and per part only on a red (B3).

| # | row | bar | on `0cc9afd1` |
|---|---|---|---|
| S1 | all-off identity (P0, B2 (b)): the all-off door against the merge-base, kiwipete and position-6, d6–d8, both recursions | nodes, score and move equal, exactly | d8 523 847 / 234 214 (`search()`), 707 548 / 101 425 (`chooseMove`) |
| S2 | every older door, node-equal to itself (`G4`) | exact | as pinned |
| S3 | the mate floor at the same depth on the 287, door to head: PREREG rows B1, B2 and every B3 row | 0 violations on each | 0 / 191; 0 / 189; 0 / 190, 189, 190, 189, 163; 0 / 188 |
| S4 | zugzwang, `ADR-0050` d9's seven rows | 7 / 7 at recorded depths, none re-pinned | 7 / 7 |
| S5 | `G1` | ≥ 54 / 58, none newly missed | 54 / 58 |
| S6 | mate sign changes in the drift rows, depth 5 on the 190, both recursions: all on, and on each part's own door | 0 | 0 |
| S7 | O2c's drift, CH2, on O2c's own door, both recursions | ≥ 95 % within 25 cp, none beyond 25 cp | 100 %, 9 / 100 %, 4 |

**Table 2: the part bars and gates.** Graded, on the branch, before the read.

| # | row | bar | on `0cc9afd1` |
|---|---|---|---|
| P1 | each part's door pair and rule rows (B2 (a)) | present and green | not built |
| P2 | the forms (B2 (c)) | M3 and C1 as `ADR-0072` d1–d3 and `ADR-0073` d1–d6 state them | fixed |
| P3 | L4 (a), d8 on P4's own door | ≤ **0.89 ×** on each of the four | 0.6039 / 0.8170 / 0.7509 / 0.8363 |
| P4 | L4 (b), reach at 47 000 on P4's own door | ≥ door + **0.10** | +0.116 |
| P5 | CH1, `NFR-009` | the table reads 3 072 bytes | 3 072 |
| P6 | `G6`, all on | "≥ base" by the median, every run ≥ depth 6 | not read |
| P7 | `NFR-008`, all on | the graded median ≤ 10 s, and **≤ +0.10 s for the bundle as a whole**, head minus base | not read |
| P8 | typecheck, lint, build, the skip count, the run rule's `-t` lines | as the gates state them | not read |

**Table 3: reported only.** Read on the build and printed beside the figure on `0cc9afd1`. No verdict rides on them.

| # | row | read on | on `0cc9afd1` |
|---|---|---|---|
| R1 | L2 drift share and cap, depth 5 on the 190, both recursions | P4's own door, and all on | 93.58 %, 80 cp / 94.12 %, 79 cp, on each |
| R2 | L2 audit: flips, and errors ≥ 200, ≥ 300, ≥ 500 cp, `ADR-0061` d8 (d)'s sample | P4's own door | 288 of 1 886 (15.27 %); 29, 9, 0 |
| R3 | CH3, d8 | O2c's own door; O2c alone over the all-off door | 1.0031 / 0.9999 / 1.0935 / 0.9989; 0.9848 / 0.9922 / 0.9298 / 1.1190 |
| R4 | `chooseMove` d6 on the 287 (PREREG R1), and `krk` | all on | 0 / 209; 0 / 17, 17, 29 |
| R5 | `G2` (door / head) | all on | 0.9921 / 1.0537, mean 1.0229 |
| R6 | d8 and reach against `main`; the firing figures; O2c's and P4's node ratios (B2 (e)) | all on | 0.5947 / 0.8106 / 0.6982 / 0.9358; +0.148; P4 fires at 5.91 nodes per 1 000 |
| R7 | the head's counts, an instrument check | all on | d8 311 546 / 163 523 (`search()`), 573 518 / 94 911 (`chooseMove`); reach 7.016 |

**What "reported" means for R1 and R2.** `ADR-0072` d8 (d) has them reproduced to the count.
- **On a base whose production `src/` equals `0cc9afd1`'s,** a count that differs is a defect in the wiring (`ADR-0072` F2),
  explained before anything else is read.
- **On a moved base,** the same rows are read on the new base and both sets go in the PR, with the merge that moved them
  named. A re-derived count is a dated line in `ADR-0072`, never a moved bar.
- **There is no ceiling.** His word is on the form, not on a figure, and a bar added now would be a new bar after a read.
  So a worse R1 or R2 stops nobody. It goes in the Software Engineer's hand-off, before QE seals its PREREG. Whether a
  figure far from the one he was shown goes back to him is the Orchestrator's call, not the SE's or QE's.
- **The audit has no hook in the build.** It is read on a scratch copy of the built tree, in the shape of
  `arch-bundle-1`'s `raw/probe/` audit mode, with nothing committed to `src/` or `tools/`. The SE reads R1 and R2, and QE
  re-reads them with its own driver.

**The read.** One C2′, 100 games at 100 ms, all on against the merge-base, **GAIN ≥ 50.0 / 100**, with 100 of 100 complete,
0 candidate faults and 0 losses on time. Never re-played, no subset. Then **S′ at E 1 810, a bar:** S-1, S-2 and S-4 (≥ 3.0
of 10; below that, 10 more games and ≥ 7.0 of 20). Then **the Levels deep lane, a bar:** exit 0, every test passed.
*2026-11-04 (`bapm-K0-cut`): the sentence stands as copied. ~~On a candidate fault see § Open 1;~~ on E see § Open 2.*
*2026-11-05 (`bapm-wait-lines-1105`): **on a candidate fault, a loss on time or a Levels red, the form is CF1–CF10,** `ADR-0056`'s dated
block of `arch-owner-answers-1105`. "Never re-played" stands: a CF4 read is not a re-play, because the first read returned no verdict
and CF4 reads another tree.*

- **The PREREG is sealed first,** by QE, in the shape `…d776c0f0`, before any game. QE adds no bar and drops none. Its
  first line says the premises are not met and were overridden by the owner's word.
  *2026-11-05 (`bapm-wait-lines-1105`; `ADR-0056`'s dated block): QE copies CF1–CF10 word for word into § 6 of that shape, after § 6
  item 3, in every `ABC-303` PREREG, a CF4 read's included. They hold no blank and add no bar.*
- **The read does not start until every row of tables 1 and 2 is met** (B6).
- **Before the merge** (B4): `main` is merged into the branch, with no rewrite. Tables 1 and 2 are read again on the merged
  tree, with no games. Games run again only under C2′'s stale rule.
- **Credit is to the bundle** (B5). No per-part Elo is stated or inferred from the read.
- **Standing gates:** lint, typecheck, unit and build (`quality.mandatory_gates`), the QE hop, and merge on green.

## What happens on a miss

**A red, by row.**
- **S1, S2, P1, P2, P5:** a defect in the wiring, back to the Software Engineer.
- **S3–S7:** B3. Read per part, name the cause; a structural dated line in that part's ADR; every safety row again. If no
  single door clears it, a STOP to Architect/Design. **The lever is LMR (`R-283-LMR`), not history, T or another form.**
- **P3, P4, P6 on an exact build:** a STOP to Architect/Design (B6: a red before the read is a STOP, not a miss). The
  override does not reach them. Any lift is the owner's word.
- **P7:** a row move first (`…f30bd604` 2).
- **C2′ below 50.0, or an S′ collapse:** NOT MET, B6. **A fault, a loss on time or a Levels red:** a defect.
  ~~*2026-11-04 (`bapm-K0-cut`): for now a candidate fault closes the read unpassed. § Open 1.*~~
  *2026-11-05 (`bapm-wait-lines-1105`): **this line is read through CF1–CF10,** `ADR-0056`'s dated block of `arch-owner-answers-1105`.
  In short, and the block governs:*
  - *A candidate fault or loss on time ends that read with no pass (CF1). The verdict test comes first (CF2): if each such game
    counted as a win still leaves it under the bar, NOT MET, final, B6.*
  - *Otherwise it is a defect, fixed with nothing tuned (CF3), then one new read on the fixed tree, final (CF4). A cause nobody can
    reproduce is a STOP to Architect/Design, with no new read.*
  - *A clean low score stays final (CF5). A clean, met C2′ stands after a value-identical fix, and only the faulted S′ is replayed
    (CF6). A Levels red after a clean C2′ is CF7.*
  - *A second candidate fault is NOT MET (CF8). A case the lines do not name is a STOP to Architect/Design (CF10).*

- **NOT MET (B6):** nothing merges. QE records a `failed-attempt` naming the bundle. `ADR-0072` and `ADR-0073` return to
  PROPOSED, premise not met, and `ABC-286` and `ABC-288` to held. No re-play, no margin, no change of form, no subset. A part
  comes back only as a new attempt.
  *2026-11-05 (`bapm-wait-lines-1105`; `ADR-0056` B6's dated line): for this ticket this bullet is read through CF1–CF10. A fixed tree
  under CF4 is not a new attempt and does not need the route back.*
- **On MET and the merge (B5):** both ADRs are in force, and the Architect writes the line naming this ticket and the read.
- **Either way,** the merge or the `failed-attempt` starts `ABC-289`'s build (§ Dependencies).

## NFR triggers

- **`NFR-008`** (`npm test` ≤ 10 s): row P7. The budget is for the bundle as a whole, not per part. Aim, not a gate
  (`…f30bd604` 1): the rows the bundle adds or changes sum to ≤ 90 ms in-thread, none added to `src/cli.test.ts`. Rows of
  ≥ 50 ms go deep. No new default-lane file.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): row P5. +3 072 bytes, fixed, allocated once; about 4.6 MiB of 16 MiB in all
  (`ADR-0073` § Consequences). P4 adds one 4-entry constant and no table.
  *2026-11-04 (`bapm-K0-cut`; `…5aee89b7` item 6): the sum row understates by 35 840 bytes on this branch, and no level is near. The
  countermove's 3 072 is owed here (§ Scope item 2). The history table's 32 768 is `ABC-304`'s, on `main`. Both terms stand in the
  one sum when `main` goes in.*
- **`NFR-005`:** row P6, `G6` "≥ base" binding on the bundle, every run ≥ depth 6.
- **`NFR-004`:** none. Neither rule reads a budget, deadline or environment (R-TC). No time rule changes.
- **Security:** none.

## Test notes

1. **The PREREG before any game.** QE fills the blanks of `…d776c0f0`, seals it, then plays once. A run forecast over 1 h
   goes to the Orchestrator first. The estimates: C2′ about 0.4 h, S′ about 10 min, the Levels deep lane about 10 min.
2. **R1 and R2:** the Software Engineer reads them on the build, and QE re-reads them with its own driver. The audit is
   read on a scratch copy, as the block says.
3. **The probe** is in `.grugops/context/arch-bundle-1/raw/probe/`, measured on `0cc9afd1`. Its counts are P0's only while
   the base's production `src/` equals `0cc9afd1`'s.
4. **Re-points:** rows that pin shipped-path counts re-point to the all-off door, with old and new figures in the PR
   (`ADR-0072` d7).
   *2026-11-04 (`bapm-K0-cut`; `…84f9bae1`, `ADR-0069` d11 and `ADR-0072` d7's dated lines): **`ABC-279` A3 (a)'s comment at
   `de15cfb2` is wrong, and it goes when `main` goes in.** It says the row "measures `ABC-279`'s skip". On
   `…WithoutQuietBundle` it reads Q1 plus history, SEE ordering and aspiration. The door of record is `searchWithoutBundle` /
   `chooseMoveWithoutBundle`, which `ABC-304` brings on `main`, and this branch takes it from there. As built the row is allowed
   and green, so this gates neither QE's seal nor the read. The re-point is not a red, a STOP or an owner question. The PR lists the
   row with 90.91 %, 96 cp, 0 changes beside it. The door behind that figure is six switches behind the shipped path, not the
   "four changes" `…84f9bae1` says (`…5aee89b7`).*
5. **UAT is owed,** on production lines. The QE verdict signs it (the 2026-10-22 delegation).

## Size and priority

- **Size: M,** near its top end. `ADR-0056` D2 sizes the parts S and M, and C1 is narrower than the M it was sized as: one
  table and one tier. The bulk is three door pairs, every older door, and the re-points, in both recursions. `ABC-283`'s
  L was three designs.
- **Priority: P3,** the parts' own. Nothing on record raises it. The order is the Orchestrator's.

## Dependencies

- **None hard for the build.** `ADR-0072` and `ADR-0073` are ACCEPTED, which opens it. History is on `main` (`ABC-283`, merged
  `58e90d07`). `ABC-302`, which `ADR-0072` d11 puts first, merged `ec4edd92`.
- **The slot, by the Orchestrator (brief `bapm-bundle-1-cut`):** the bundle's code may be built now, but **its C2′ read runs
  only after `ABC-282` and `ABC-301` have each merged or been recorded as failed,** so neither makes that read stale.
  *2026-11-05 (`bapm-wait-lines-1105`): **`ABC-301`'s half is met:** recorded as failed (`…04dc7cd4`, QE `…d065fee3`), nothing merged.
  The read now waits on `ABC-282` alone, and through it on A4, the owner's yes of `…b836b85c` item 1.*
  - **What that asks of the branch** (BA/PM's reading, § Open 3): C2′ reads against the merge-base, and a read is stale when
    another value-changing merge has moved its base. So `main` is merged into the branch, with no rewrite, after the later
    of the two settles and before QE seals its PREREG. Tables 1 and 2 are read on that tree.
  - **The base will have moved if either merges.** Production `src/` on `main` still equals `0cc9afd1`'s at this cut. After
    a merge of either, the block's moved-base line applies: R1 and R2 are read on the new base and both sets go in the PR,
    the door's counts are re-read, and a re-derived count is a dated line in `ADR-0072`, never a moved bar.
- **`ABC-282` (W1, `ADR-0071`).** Both edit `src/engine.ts` and the same `runIteration` (`ADR-0072` d11, `ADR-0073` d12).
  Under the slot, if it merges, this ticket lands second, so it carries: b = 2.3 re-read by P1's method (`ADR-0071` D12
  item 3) and A0's counts, reported to the Orchestrator. Any change to b is its own ticket with its own read.
- ~~**`ABC-301` (the second pull).** B-T7 goes stale on a value-changing merge after its freeze, and a merge of `ABC-301` would
  stale this read. The slot covers both.~~ *2026-11-05 (`bapm-wait-lines-1105`): closed NOT MET, so no such merge comes. Its tools land
  as `ABC-305` with zero production lines, which stales no read (`…2b3440cf`).*
- **`ABC-289` (Q2) comes after, alone** (`ADR-0056` D5's dated block). Its build starts when this ticket's merge or
  `failed-attempt` is recorded, not before.
- **`ABC-298` (V3):** one at a time on `orderMoves`. Whichever lands second re-reads the other's identity rows (`ADR-0072`
  d11).
- **One at a time on `src/search.ts` / `src/engine.ts`** with `ABC-284`, `ABC-285`, `ABC-287`, `ABC-296` and `ABC-297`.
- **The row census** (the Orchestrator's) gates the second of `ABC-282` / `ABC-301` to merge and is sized for this ticket
  and `ABC-289` (`…5ec6c124` 1). A red on row P7 is a row move first.
  *2026-11-05 (`bapm-wait-lines-1105`; `…2b3440cf`): with `ABC-301` closed there is no second of the two to gate. Whether the census
  still gates a landing is the Orchestrator's, and the records do not settle it.*

## Open, not bars (for the Architect and the Orchestrator)

The records do not settle these. This page adds none of them as a bar, and none blocks the build.

1. **A candidate fault in the one read, for the Architect.** The block calls a fault, a loss on time or a Levels red "a
   defect", beside "never re-played". `…d776c0f0` § 6 lists MET, below 50.0, a base fault and a harness error for C2′, and
   no candidate fault. Whether a fixed candidate plays a new C2′, and whether a C2′ already played stands after a fix for an
   S′ fault or a Levels red, is `UNKNOWN - verify`.
   ~~*2026-11-04 (`bapm-K0-cut`): **answered by reference, WAITING ON THE OWNER.** The Architect's answer is `ADR-0056`'s dated
   block of `arch-ABC-303-open`, item 1 (`…5aee89b7` item 3). The Orchestrator did not rule its new C2′ against B4: "one read,
   never re-played" is the rule the owner accepted, so a second read after a candidate fault goes to him (`…681c6363` 2).
   **Until he answers the strict reading is in force: a candidate fault closes the read unpassed, and B6 governs the return.**
   Two points the records leave `UNKNOWN - verify`: whether that reading also stops the block's line that a clean C2′ stands
   and the red S′ runs again, and whether an answer after QE's seal reaches this read.*~~
   *2026-11-05 (`bapm-wait-lines-1105`): **ANSWERED.** He said yes to the new C2′ (`…b836b85c` item 2, verbatim "2. yes"). The strict
   reading is gone for this ticket. Its form is CF1–CF10, `ADR-0056`'s dated block of `arch-owner-answers-1105`.*
   - ***Both open points close** (`…4843d1f2` 1 and 2; `…4844df37`). The clean C2′ line stands as CF6. An answer reaches any read not
     yet sealed, and no `ABC-303` PREREG is sealed, so the first read and any CF4 read carry this form.*
   - ***CF7, the Levels red, is owner-accepted.** `…b836b85c` named S′ alone, so CF7 was the Architect's carry from `arch-ABC-303-open`'s
     block (`…4844df37`). The owner confirmed it the same day (`…0f1ab02e` item 3): a clean C2′ stands when the Levels test then fails
     and the fix does not change play. ~~`ADR-0056`'s line moves at `arch-owner-answers-1105b`.~~ 2026-11-05 (`bapm-pointers-1105`): **moved** (`…66724fc9`): `ADR-0056`'s dated line in the
     "Which lines are his" list, and item 3 of that task's dated block. CF7's words do not change. Its second case, a fix that does change play, is CF6's and stays on the carried list.*
2. **S′'s E, for the Architect.** The block reads E 1 810. `…d776c0f0` § 6 has a blank, "1810, or the re-pinned value and
   its record", and says the block governs a difference. If the S′ pool re-pins E before the read, this page's E needs a
   dated line.
   *2026-11-04 (`bapm-K0-cut`): **answered by reference:** `ADR-0056`'s dated block of `arch-ABC-303-open`, item 2 (`…5aee89b7`
   item 4). E is a setting, not a bar. QE fills § 6's blank with the E in force at the seal, 1 810 today. The pool stands at 30
   games, 18.5 / 30 = 61.7 %, and no step fires. A next merged S′ below 5.5 / 10 leaves the band, and that step is the owner's
   question. A step before the seal is a dated line in `ADR-0056`, which governs, and a dated line here. A step after the seal
   does not reach this read.*
3. **The slot's reading, for the Orchestrator.** That `main` goes into the branch before the PREREG is BA/PM's reading of
   "neither makes that read stale", not his words.
   *2026-11-05 (`bapm-wait-lines-1105`): **ruled** (`…3c67d3c4` 3). The reading stands: `main` goes into `grugops/ABC-303`, with no
   rewrite, after the later of `ABC-282` and `ABC-301` settles and before QE seals its PREREG. `ABC-301` has settled, so the later
   is `ABC-282`.*
4. **The moved base, for the Orchestrator.** Two of the block's reasons for reading the bundle first, that P4 stays on the
   tree it was measured on and that R1 and R2 stay comparable with what the owner was shown, assume a base near `0cc9afd1`.
   Under the slot a merged `ABC-301` moves the evaluation under both. Rows P3 and P4 are then read on a tree nobody has
   probed, with reach at +0.116 against +0.10. A red on them is a STOP. Whether a figure far from the one the owner was
   shown goes back to him is the Orchestrator's call, by the block. Nothing here moves a bar.
   *2026-11-04 (`bapm-K0-cut`): **answered by reference:** `ADR-0056`'s dated block of `arch-ABC-303-open`, item 3 (`…5aee89b7`
   item 5), and `…3c67d3c4` 4. The order stands. Reasons 1 and 2 narrow, and reason 3 reads no base and stands. **One change of
   practice:** the hop that brings R1 and R2 on the new base brings P3 and P4 too. Whether +0.116 survives a fitted evaluation
   stays `UNKNOWN - verify`; a red is a STOP and a lift is the owner's. "Materially worse" stays the Orchestrator's, with no
   figure set.*
   *2026-11-05 (`bapm-wait-lines-1105`; `…2b3440cf` item 4): **the worry is gone for `ABC-301`'s half.** It closed NOT MET, so no fitted
   evaluation arrives. By the Architect's reading R1, R2, P3, P4 and the +0.116 stay near what the owner was shown; none of them is
   read yet. **`ABC-282`'s half stands:** if it merges, the base moves, and `…3c67d3c4` 4 and the change of practice above apply. Any
   red on P3 or P4 is still a STOP.*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ two parts each short of a premise alone; the owner asks for one read of the two together; the values are estimates |
| 2 | scope and out-of-scope | ✅ scope 1–5, each as its ADR; L2's drift and audit, CH3, per-part reads, re-tuning and `ABC-289` out |
| 3 | INVEST | ✅ M, one branch and one read, by the owner's word; independent of `ABC-289`, ordered against `ABC-282` and `ABC-301` |
| 4 | testable, measurable acceptance | ✅ tables 1 and 2 row by row, each a count, a ratio or an exact equality; C2′ ≥ 50.0 of 100 once; S′ ≥ 3.0 of 10; Levels exit 0; table 3 reported with its figures |
| 5 | dependencies known | ✅ none hard for the build; the C2′ slot on `ABC-282` alone, `ABC-301`'s half met *(2026-11-05)*; `ABC-289` after; `ABC-298` and the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-008` ≤ 10 s and ≤ +0.10 s; `NFR-009` 3 072 bytes; `NFR-005` "≥ base", every run ≥ depth 6 |
| 7 | test notes | ✅ 1–5 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ `ADR-0072` and `ADR-0073` ACCEPTED over missed premises, which opens the build. ~~The four § Open items do not block it; item 1 is wanted before the read~~ *2026-11-05: § Open 1, 2 and 3 are answered, and § Open 4's `ABC-282` half blocks nothing* |

**DoR 10/10. Ready.** The column move and the build slot are the Orchestrator's. *2026-11-04 (`bapm-K0-cut`): row 10 holds. § Open
1 waits on the owner and blocks neither the build nor the read, because the strict reading stands in the meantime. **DoR 10/10,
unchanged.*** *2026-11-05 (`bapm-wait-lines-1105`): § Open 1 is answered, so the strict reading no longer stands in. **DoR 10/10,
unchanged.***
