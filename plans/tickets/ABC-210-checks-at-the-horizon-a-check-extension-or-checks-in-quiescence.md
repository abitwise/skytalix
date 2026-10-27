---
id: ABC-210
title: "Checks at the horizon: a check extension, or checks in the first quiescence ply, behind an ADR-0026 door and bounded in growth"
status: dropped
column: Done
size: M
priority: P3
epic: EPIC-008
feature: —
adr: "ADR-0051 (form (a) at the horizon plus an ADR-0026 off-door pair): ACCEPTED by the owner 2026-10-27 (…047d411f), with P2 (ADR-0050 d9, zugzwang.005 d12 → d13); NOT in force on main: ABC-210 closed unmerged under S1 on 2026-10-27, and P2 did not land (the ADRs' dated lines are the Architect's, arch-adr0051-not-in-force)"
---

# ABC-210: checks at the horizon

> **CLOSED UNMERGED 2026-10-27 under ship rule S1. Not delivered.** BA/PM, task `bapm-s1-ABC-210`. D was NEUTRAL
> (pooled over 800 games, −4.8 ± 16.2), so S1 is NOT MET. `A1`–`A4` and `A6` were MET, `G6` and `G2` included. S1's
> one re-tune round is not taken. The code stays on `grugops/ABC-210` `a96f36b0`. This was the epic's last engine
> change. See § Close.
>
> **Cut 2026-10-23 by BA/PM** (task `bapm-cut-engine-strength`, records only, at `main` `55a8f4ef`). Proposal 7 of
> `…f1771bb3`; owner word `…7feb0553`.
>
> **ADR touch point: this reverses a recorded decision.** `src/quiescence.ts:21-24` lists "checks in quiescence" as a
> recorded decision of `ABC-079` (`ADR-0024`'s ticket), not an omission. Architect/Design writes the ADR, a new one or
> an `ADR-0024` amendment (the Architect's call), plus an `ADR-0026` door, because the change alters values. The
> owner's acceptance of the proposal is the go-ahead (`…7feb0553` item 2). **The Orchestrator reports the ADR text to
> the owner when it lands.**
>
> *Re-read 2026-10-27 at `main` `3050d2b4` (BA/PM, `bapm-ready-ABC-210`):* the cite `src/quiescence.ts:21-24` holds,
> byte-equal to the cut `55a8f4ef`. `ABC-206` (`5ff2a129`) touched the file below the header, and `ABC-208` touched it
> not at all. The same fence is held in an accepted ADR: `ADR-0024` decision 4 ("Still out of scope … checks in
> quiescence"). **An ADR is still needed, but "reverses `ABC-079`'s recorded decision" describes form (b) only.** Form
> (a), a full-width check extension, is not named by either fence; it needs a new ADR as a new value-changing heuristic
> (`ADR-0026` decision 10, the `ADR-0050` precedent). This is flagged for Architect/Design's design hop (§ Definition of
> Ready, re-score) and not decided here.

## Problem

- **User:** the owner at level 5.
- **Pain:** quiescence searches no checks, and the full-width search does not extend a node in check. 29.Bd2 allowed a
  mate in 8 that `skytalix` first saw three moves later.
- **Honest evidence:** in game 1 a check-extension probe changed **none** of the five errors. The gain is low and
  `UNKNOWN - verify`, so this ticket ships only on a GAIN.

## Scope

1. **One of two forms, or both, as the Architect rules:**
   - **(a)** a check extension: +1 ply at a node in check, with a total extension cap per line;
   - **(b)** quiet checking moves searched in the **first** quiescence ply only.
   - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* **form (a) only, at a horizon node:** remaining depth ≤ 0 and the side
     to move in check, +1 ply (`ADR-0051` d1–d2). Form (b) is not shipped.
2. **An `ADR-0026` door:** every pre-existing door turns it off, and one new door turns it off on the shipped path.
3. **A growth bound.** `QUIESCENCE_MAX_PLY` stays a runaway guard, and an extension cap is stated as a number.
   - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* the cap is **1 per line** (`CHECK_EXTENSION_MAX_PER_LINE`, `ADR-0051`
     d3). `QUIESCENCE_MAX_PLY` (8) and `src/quiescence.ts` are untouched.
4. The ADR.
5. *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* the sites at `main` `3050d2b4`, after null move (`ABC-208`):
   - the frontier calls `quiesce` at `src/search.ts:356` and `src/engine.ts:263`; `QUIESCENCE_MAX_PLY` is
     `src/quiescence.ts:76` (8), read at `:102`;
   - two predicates already read check and must be squared with an extension: `lateMoveReduction` (no reduction in
     check or for a checking move, `src/search.ts:278-279`, `ADR-0026` decision 6) and `nullMoveReduction` (none in
     check, `src/search.ts:305`, `ADR-0050` decision 6);
   - a full-width line is bounded by `KEY_ARRAY_CAPACITY` (128, `src/search.ts:121`, `ADR-0025` decision 7), so the
     extension cap sits inside it.

## Out of scope

- Other extensions (singular, recapture, pawn-to-7th), SEE, and delta pruning.

## Acceptance criteria

- **`A1` (the door reproduces the pre-ticket engine).** The same as `ABC-208` `A1`: node-equal on the `ABC-078` `A3`
  corpus, with every pre-existing door node-equal to its pre-ticket self.
  - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* both sentences are **cross-build**: head's doors against base's shipped
    path and base's doors. QE runs `A1` out of tree, as `ABC-208`'s was (the probe: 300/300 cells, `ADR-0051` d5).
- **`A2` (it does what it says).**
  - **(a):** **Given** a position in check at the frontier, **then** the instrumented search goes one ply deeper there,
    and a line never gets more than the cap's extra plies.
  - ~~**(b):** **Given** a position whose only good move is a quiet check that wins material in the next quiescence ply,
    **then** quiescence returns a score that reflects the win, where base stands pat.~~ *Struck 2026-10-27 (BA/PM,
    `bapm-amend-ABC-210`): form (b) is not shipped (Scope 1).*
  - At least 4 rows for each form shipped.
  - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* the (a) rows are **`ADR-0051` d8's**: the five horizon rows at depth 1
    in both recursions (each plays the check; each door plays another move), the line-length instrument (the four roots
    at depth 5 reach ply 6, never 7), and the cap row (depth 1 never reaches ply 3). Five rows meet "at least 4".
- **`A3` (growth stays bounded).**
  - **Given** `kiwipete` and `position-6` at fixed depth 6, **then** nodes ≤ **1.5 × base**. The figure is BA/PM's bar,
    the `ADR-0024` decision 3 headroom precedent.
  - **Given** the 3 s budget, **then** `G6`'s `NFR-005` levels hold: depth ≥ 6 (FAIL floor), 7 (WARN). ~~`G6`'s "≥ base"
    clause is relaxed to **≥ base − 1, for this ticket only**. That is BA/PM's ruling: an extension spends nominal depth
    by design, and the D reading judges whether the trade pays.~~ *Struck 2026-10-27 (BA/PM, `bapm-amend-ABC-210`):
    `G6` reads **"≥ base"** (rule A), unrelaxed. The design is predicted to meet it on both boards (`UNKNOWN - verify`),
    so the − 1 is not needed. Striking it tightens the bar, so no owner word is needed (`…828d5794`, `…75af453c`).*
  - **The depth-6 FAIL floor does not move.**
  - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* **"fixed depth 6" reads `search(position, 6).nodes` against
    `searchWithoutCheckExtension(position, 6).nodes`** (`ADR-0051` d8). The door is base node for node (`A1`), so the
    bar stays ≤ 1.5 × base with no cross-build. Probe: 1.054× kiwipete, 1.007× position-6.
  - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* **two oracle bars are added** (`ADR-0051` d7; both new, none loosened):
    - **drift at depth 5, both recursions, on `ABC-121`'s 190:** `search()` against `searchWithoutCheckExtension` and
      `chooseMove` against `chooseMoveWithoutCheckExtension`. At least **90 %** of non-mate positions are within
      **25 cp**, and none is beyond **174 cp**. Probe: 93.58 % / 94.12 %, max 116. Mate-status flips are a report.
    - **a same-depth mate floor on the 287:** wherever the door scores a mate at depth 5, `search()` at depth 5 scores
      a mate of the same sign, no longer. Probe: 0 of 189.
    - The 90 % is `ADR-0051`'s own, below the 95 % of `ADR-0026` d9 and `ADR-0050` d8. It is the owner's within his
      yes/no on `ADR-0051` (`…75af453c`). `ADR-0026` d9's 118 cp and `ADR-0050`'s 37 cp keep measuring LMR and null
      move alone (`ADR-0051` d6).
  - *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* `G6` is read by `EPIC-008`'s rule (`…8e51ba1e`): 5 interleaved runs
    per board per build, graded by the median, any run below depth 6 FAILs. "≥ base" stays a graded pass/fail rule
    on the owner's word (rule A, `…2ae5fc12` item 2; `QE-205-c` closed). Unlike `ABC-209`, this ticket changes values,
    so head is not node-equal to base and `G6` reads the change.
  - *2026-10-27 (BA/PM, `bapm-ready-ABC-210`), **flagged, not decided:** is this page's "≥ base − 1" clause still
    consistent with rule A?* On the axis the owner answered, yes: the clause is still graded pass/fail, and a miss is
    NOT MET. On the threshold, his word is silent. The clause was cut on 2026-10-23, before rule A; the `EPIC-008`
    `G6` row carries "≥ the base build's" with "No bound or reading rule moves", and `M3` reads `G6` green on `main` at
    the epic's close. Whether a per-ticket − 1 stays BA/PM's ruling inside the epic or is a gate-bar change that is
    the owner's (`…5aaf7cec` item 3) is the Orchestrator's to route. The design probe's d7/d8 counts (test note 3) show
    whether the clause is ever exercised; if head is predicted to meet "≥ base", the question is moot. Until it is
    answered, the page reads as written.
    - *Answered 2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* moot. Head is predicted to meet "≥ base" (`…c5d0e464`), and
      the clause is struck above (`…75af453c`).
- **`A4` (existing gates).** `G1` (mate rows may newly solve; raising the baseline is QE's), `G5`, `G8`, `G9`, and
  `G10` for any red.
  - *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* `G1`: the diff touches `src/search.ts`, `src/engine.ts` or
    `src/quiescence.ts`, so `ADR-0034` decision 2 gives it no drift class, and every missed row is class B (that ADR's
    `ABC-079` control row reads the same three files).
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, and
  `G11`.
  - *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* one reading, final (`…4c3f7639`). The D budget is `ABC-204`'s frozen
    1 500 ms. Not GAIN after the one extension means not merged, as with `ABC-205`, `ABC-207` and `ABC-209`, each
    closed under S1. A re-tune reading needs the owner's word.
  - *2026-10-27 (BA/PM, `bapm-s1-ABC-210`):* **NOT MET.** d1 NEUTRAL −1.7 ± 22.8, the one extension d2 NEUTRAL
    −7.8 ± 23.0, pooled over 800 games NEUTRAL −4.78 ± 16.21 (`…b953e670`, `…86b45c13`). Not merged; § Close.
- **`A6` (the ADR).** The ADR exists, states the form and the cap, and records that it was reported to the owner.

## NFR triggers

- **`NFR-005`:** at risk from node growth. `A3` reads it with a depth floor of 6 that does not move. **If the form
  cannot meet `A3`, it is NOT MET. No bound moves.**
- `NFR-004`: unchanged. `NFR-008`: reported.
- **Security:** no limb, no hop.
- *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* carried forward unchanged. The depth-6 floor does not move.

## Test notes

1. Instrument the extension and quiescence depth in tests only. No production counter.
   - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* the instrument is call-through module spies on `src/apply.ts` (make and
     unmake, null included) and `src/quiescence.ts` (`quiesce`). The line length at each qply-0 `quiesce` call is
     replayed from the spies' global invocation order (`ADR-0051` d8).
2. UAT is owed (production lines). The QE verdict signs it.
3. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-27 by BA/PM (`bapm-ready-ABC-210`), the same
   step as `ABC-208` test note 4 (`…84a05b3a`).* Before the real-clock `G6` reading, QE reports the nodes each build
   needs to complete depths 7 and 8 on `kiwipete` and `position-6` (`chooseMove`, `now: () => 0`, `maxDepth: k`;
   `src/engine.ts:166`, `:173`), base and head: 8 counts. An extension or checks in quiescence should raise head's
   counts (`UNKNOWN - verify`). If head is predicted to miss the `G6` bar in force for this ticket at a depth base
   straddles at 3 s (that bar turns on the flagged "≥ base − 1" question under `A3`), QE stops to Architect/Design
   before the run. It grades nothing.
   - *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* the stop reads against **"≥ base"**, since "≥ base − 1" is struck.
     The design probe's counts are the reference (§ Design ruling): base 590 489 / 1 259 463 (kiwipete d7 / d8) and
     180 941 / 355 565 (position-6). Base does not straddle a depth at 3 s (`…c5d0e464`).
4. **The reading runs ALONE** (width 1, a quiet host; host power as the owner's word allows, see `QE-209-f`). `QE-207-g`
   (an ALONE claim can outlive `queue.stale_ttl_minutes`, 30) and `QE-209-f` (host power) are open as the
   Orchestrator's kit, config or host matters, and neither blocks this ticket.

## Dependencies

- **`ABC-209` merged.** They share `src/engine.ts`, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-209` reaches Done, or BA/PM closes it under S1.
- *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* **the Ready trigger is met.** `ABC-209` is closed unmerged under S1
  (`bapm-s1-ABC-209`, `…492fb6ce`, on `main` at `1c5fd14d`), and `ABC-204` is Done.
  - "`ABC-209` merged" reads as met by that close. Nothing of `ABC-209` is on `main`.
  - **D base:** "its merge is the D base" now reads as this ticket's own merge-base on `main` (`EPIC-008` § D). That
    merge-base carries `ABC-208` (`b5c67ab7`) and not `ABC-209`. No commit since `b5c67ab7` touches `src/`, `data/`
    or `tools/`.
  - It is the epic's last engine change. The closing `M1` R reading comes after it.
- *2026-10-27 (BA/PM, `bapm-amend-ABC-210`):* **`ADR-0051` is PROPOSED, and accepting it is the owner's call.** The
  Orchestrator **holds the build** until he answers, as for `ABC-209`: the build has to move P2, an owner-held row
  (`…75af453c`). The ALONE reading and the merge also wait on his acceptance.
- *2026-10-27 (BA/PM, `bapm-amend-ABC-210`), **the moved-pin rulings** (§ Design ruling, P1 and P2):*
  - **P1: accepted by the Orchestrator** (`…75af453c`, MEDIUM). In `transposition.test.ts`, `ABC-081` `A5` "the fixture
    bites" is re-pinned from depth 3 (−485) to depth 2 (**−502**) on the shipped path (`ADR-0026` d7). The row tests
    that its fixture bites, not engine strength. **QE re-plants the fixture bug at depth 2 and checks that the row goes
    red.**
  - **P2: waits on the owner.** `search.null-move.test.ts` `ABC-208` `A2` `zugzwang.005`, depth 12 → 13. This edits
    accepted `ADR-0050` d9, so it is his. His answer comes with his answer on `ADR-0051`, as one yes/no.
  - The other moved rows re-point to the new doors inside `ADR-0026` d4/d5 (accepted, `…75af453c`). Those are the 2
    export lists, the 2 `QE-208-c` door maps and the `ABC-208` drift, mate-floor and "changes the work" rows. No level,
    relation or NFR bound moves.

## Size and priority

- **`M`:** two candidate forms, a door, a cap, an ADR.
- **`P3`:** the gain is low on the only evidence there is.

## Definition of Ready

BA/PM, 2026-10-23, at `main` `55a8f4ef`. **Result: 9 of 10. `Backlog`** until the Ready trigger above.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ no checks at the horizon; the recorded decision cited; the probe's null result stated |
| 2 | scope and out-of-scope clear | ✅ two forms, door, cap; other extensions fenced |
| 3 | INVEST-shaped | ✅ valuable alone if GAIN; `M`; testable |
| 4 | acceptance testable and measurable | ✅ node-equal door; ≥ 4 rows per form; ≤ 1.5 × base nodes; depth ≥ 6 and ≥ base − 1; S1 |
| 5 | dependencies known | ✅ `ABC-209`, `ABC-204` |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-005` floor 6, unmoved |
| 7 | test notes present | ✅ two |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P3` |
| 10 | no major unresolved blocker | ⏳ held by sequence: `ABC-209` |

**Re-scored 2026-10-27 by BA/PM** (task `bapm-ready-ABC-210`, at `main` `3050d2b4`). **Result: 10 of 10. `Ready`.** In
Design comes first. Only these rows changed:

| # | item | verdict |
|---|---|---|
| 3 | INVEST-shaped | ✅ now independent: `ABC-209` is closed under S1, and nothing of it is on `main` |
| 4 | acceptance testable and measurable | ✅ the criteria are unchanged. Dated reading lines add `G1` class B (`ADR-0034` d2), the `EPIC-008` `G6` rule with rule A, the flagged "≥ base − 1" question, and `A5` one reading |
| 5 | dependencies known | ✅ `ABC-209` closed (S1) and `ABC-204` Done. The D base is its own merge-base on `main`, which carries `ABC-208` and not `ABC-209` |
| 7 | test notes present | ✅ four (the frozen-clock pre-check, and ALONE with `QE-207-g` and `QE-209-f`) |
| 10 | no major unresolved blocker | ✅ the sequence hold is gone. The ADR is In Design's work, and the owner's acceptance gates the ALONE reading and the merge. The "≥ base − 1" question is flagged for routing. `QE-207-g` and `QE-209-f` are the Orchestrator's, and none of these blocks the pull |

- **The ADR is still needed. "As written" fits form (b) only.**
  - **Form (b), checks in the first quiescence ply,** reverses a fence held twice: `src/quiescence.ts:21-24` and
    `ADR-0024` decision 4, accepted by the owner 2026-09-19. Changing or reversing an accepted ADR is the owner's call
    (`…5aaf7cec` item 3). New ADR or `ADR-0024` amendment stays the Architect's call, as the page says.
  - **Form (a), a check extension in the full-width search,** is named by neither fence, so it reverses no recorded
    decision. It still needs a new ADR: it is a new value-changing heuristic (`ADR-0026` decision 10; `ADR-0050` is
    the precedent), and a new ADR is the owner's (`…5aaf7cec` item 3).
  - **Either way the text goes to the owner.** `…7feb0553` item 2 gives the go-ahead for the work, and the text is
    reported when it lands. The `ADR-0026` door fits inside decision 10 and needs no amendment of its own.
  - **Flagged for Architect/Design's design hop, not decided here:**
    - which form ships, (a), (b) or both, and so which ADR shape;
    - the page's `adr:` line, which names only the (b) reversal;
    - the ADR's status at the reading and at merge. `ABC-208`'s precedent is reading (b) (`…d25ab770`), and applying
      it is the Orchestrator's routing.
- **In Design carries** (the ADR's calls; not blockers):
  - the extension cap as a number, inside `KEY_ARRAY_CAPACITY` (`ADR-0025` decision 7);
  - `QUIESCENCE_MAX_PLY` stays a runaway guard (Scope 3);
  - how the extension meets `lateMoveReduction` (`ADR-0026` decision 6) and `nullMoveReduction` (`ADR-0050` decision 6),
    which both read check today;
  - the door names and the "off in every older door" set, including `ABC-208`'s pair;
  - the bounded oracle's bar. A change to `ADR-0026` decision 9's 118 cp bar is an NFR-bound call and the owner's
    (`…d25ab770`);
  - the design probe's frozen-clock d7/d8 counts, which feed test note 3 and the "≥ base − 1" question;
  - the source comment at `src/quiescence.ts:21-24` (form (b)).

**Re-scored 2026-10-27 by BA/PM** (task `bapm-amend-ABC-210`, at `main` `5a9855b7`, after the design ruling). **Result:
10 of 10. In Design → `Ready for Dev`, build held on the owner.** Only these rows changed:

| # | item | verdict |
|---|---|---|
| 2 | scope and out-of-scope clear | ✅ form (a) at a horizon node in check, +1 ply; cap 1 per line; (b) not shipped; `src/quiescence.ts` untouched |
| 4 | acceptance testable and measurable | ✅ `A1` cross-build (QE, out of tree); `A2` = `ADR-0051` d8's five rows, instrument and cap row; `A3` d6 against the door, "≥ base − 1" struck (`G6` "≥ base"), drift ≥ 90 % / 25 cp / max 174 cp, same-depth mate floor. No bar loosened beyond `ADR-0051` |
| 7 | test notes present | ✅ four; note 1 names the instrument; note 3 stops against "≥ base" |
| 8 | size assigned | ✅ `M`, confirmed by the probe (about 100–150 production lines in two files); no split |
| 10 | no major unresolved blocker | ✅ design ruled (`…c5d0e464`); P1 ruled (`…75af453c`). One owner yes/no remains (`ADR-0051` + P2). It holds the pull into In Development, the ALONE reading and the merge, not the page. `QE-207-g`, `QE-209-f` open, not blocking |

## Design ruling

> **Architect/Design, 2026-10-27** (task `arch-design-ABC-210`, records plus probes, at `main` `f0c50046`, whose
> code is `b5c67ab7`'s). The ADR is **`ADR-0051`, PROPOSED**. Acceptance is the owner's; the build may proceed, and
> the ALONE reading and the merge wait on it (`…828d5794`, reading b). Notes: `.grugops/context/arch-design-ABC-210/notes/`.
> The probes ran on scratch clones in `<scratchpad>/arch210/`, never on `src/`: `base`; `h`, both forms with probe-only
> switches; `hd`, the design with no switches; and five planted mutants. Plain node v26.11.1. **No real-clock search was
> run and no timing is quoted.** Real-clock deep rows were filtered out by name. No `G2`, `G5`, `G6`, game or D. Every
> count below is deterministic.

**Result.** **Form (a), at the horizon only:** a full-width node whose remaining depth is ≤ 0 and whose side to move is
in check is searched **one ply deeper, at most once per line**. Form (b) is not built, and `ADR-0024` decision 4 and
`src/quiescence.ts:21-24` stand. The doors are **`searchWithoutCheckExtension`** and **`chooseMoveWithoutCheckExtension`**.
`A1` 300/300 cells node-equal. `A3` at fixed depth 6: **1.054× / 1.007×**. `G1` 54/58 (= baseline). **`G6` is predicted
MET against "≥ base", so the "≥ base − 1" clause can be struck.** **STOP to the Orchestrator: two shipped-path pins move
(P1, P2) under every form probed.** No level, no relation and no NFR bound moves. **Size `M` holds; no split.**

### The form: (a) at the horizon, and why

- **It fixes the unsound case.** `quiesce` stands pat first even when the side to move is in check, so a check given on
  the last full-width ply is scored as if the checked side could pass. At depth 1 the door misses five forks and skewers
  (`A2` below); the design plays all five.
- **It is the only form that meets `A3`** under the fixed-depth reading. An extension at every node in check (any cap)
  costs position-6 1.69× at depth 6; nearly all of that is the interior extensions (319 of 1 583).
- **It reverses no accepted ADR** and does not touch `src/quiescence.ts`, the shared leaf (`ADR-0024` d1). Form (b)
  reverses `ADR-0024` d4, reads `G1` 53/58, loses `zugzwang.005` through depth 13, and needs a mate score, a ply and a
  full move generation at each non-cut quiescence leaf (61 452 generations to kiwipete depth 8, unpriced by a frozen
  clock).
- **`G1` holds:** 54/58, base's four misses, no NEWLY line. The every-node form reads 53/58 (seed 1163).

### The ruling, point by point (text and evidence: `ADR-0051`)

| point | ruling | why, in one line |
|---|---|---|
| where | only at a **horizon** node: remaining depth ≤ 0, side to move in check | interior extensions cost the growth; the horizon is where the stand-pat error is |
| how much, cap | **+1 ply; at most 1 per line** (`CHECK_EXTENSION_MAX_PER_LINE = 1`) | caps 1, 2, 3 and none count within 0.1 %; 1 is the simplest bound and the cap row reds "none" |
| limits | a line is at most root depth + 1 full-width plies, inside `KEY_ARRAY_CAPACITY` 128 (`ADR-0025` d7); `QUIESCENCE_MAX_PLY` 8 unchanged | no ply budget is needed beyond the cap |
| rule | one exported pure predicate, `checkExtensionPlies(position, depth, extensions)` → 1 or 0, called at node entry (after the repetition scan, before the leaf test and the probe) in both recursions; they add exactly its value | `ADR-0026` d6's contract: check is derived inside |
| state | `extensions` is an argument, placed **before** `afterNull` | nothing held between nodes; `ABC-208`'s source row reads the null flag as the last argument |
| null move | **confirmed: no null move in check** (`src/search.ts:305`, `ADR-0050` d6). An extended node has depth 1 < 2; a null child is never in check, so it is never extended | no predicate changes |
| LMR | no reduction in check or for a checking move (`ADR-0026` d6); an extended node's depth 1 < 3 | no predicate changes |
| table | an extended node probes and stores at depth 1, the depth it searched | — |
| doors | `searchWithoutCheckExtension(position, depth)`, `chooseMoveWithoutCheckExtension(position, options)`: the pre-ticket shipped path with null move on, node for node; every older door turns the extension off (top rung) | `A1`: 300/300 cells (10 search doors at d1–6, 4 engine doors at d3/5/6, six roots) |
| re-points | `ADR-0050`'s rows that compare the shipped path with a null-move door: the d5 drift ×2, the mate floor, "makes null moves … changes the work" ×2 | they then read their pre-ticket values: **37 cp keeps measuring null move alone; 118 cp (`ADR-0026` d9) is untouched** |
| `A3` oracle | d5 on the 190, both recursions: **≥ 90 % within 25 cp, none beyond 174 cp**; a **same-depth** mate floor at d5 on the 287 | measured 93.58 % / 94.12 %, max 116 / 116; mate floor 0 of 189. 95 % fails the correct build: the heuristic is meant to move horizon values |
| `A3` nodes | "fixed depth 6" reads `search(position, 6).nodes` against `searchWithoutCheckExtension(position, 6).nodes` (the door is base) | measured 1.054× kiwipete, 1.007× position-6 |
| `A2` | five horizon rows at depth 1 (both recursions), the line-length instrument on four roots at 5, and the cross-check cap row (FENs in `ADR-0051` d8) | each door plays a different move; mutants below |
| files | `src/search.ts`, `src/engine.ts` only | — |

**Planted mutants** (each on its own scratch clone):

| mutant | `A2` rows / instrument | cap row | `A3` nodes (pos-6 d6) | d5 drift (search / chooseMove) | mate floor | `G1` |
|---|---|---|---|---|---|---|
| design | green | green | 1.007× | 93.58 % / 94.12 %, 116 | 0/189 | 54 |
| every node in check (cap 1) | green | green | **1.69×** | **87.17 % / 88.24 %**, 145 | 0 | **53** |
| no cap | green | **red (ply 3)** | 1.007× | = design | 0 | — |
| +2 plies | **red (ply 3 / 7)** | red | 1.44× | 91.98 % / 92.51 % | 0 | — |
| dead switch | **red (ply 1 / 5)** | red | 1.000× | 100 % | 0 | — |
| every horizon node, check or not | (out of memory) | — | **4.44×** | **56.68 % / 49.73 %** | 0 | — |

- The oracle is a regression net: "no cap", "+2 plies" and a dead switch pass it. The predicate table, the `A2` rows and
  the cap row catch them.

### Moved-pin probe (`hd` against `main`'s tests)

- **Base:** default lane 2 128 / 2 128. Deterministic deep lanes green (`PUZZLE_DEEP`; `SEARCH_DEEP` null-move,
  quiescence, search, pvs-lmr, transposition, ordering; `ENGINE_DEEP` engine, gameend, legal, levels, pvs-lmr,
  transposition; real-clock rows filtered by name).
- **`hd`:** default 2 123 / 2 128; deep adds 3 more. 8 rows, plus 3 green-either-way re-points:

| # | row | change | route |
|---|---|---|---|
| 1 | `search.test.ts` `ABC-077` `A6` export list | + `searchWithoutCheckExtension`, `checkExtensionPlies` | export-list growth (`ADR-0050` d2 precedent) |
| 2 | `engine.test.ts` `ABC-078` `A4` export list | + `chooseMoveWithoutCheckExtension` | the same |
| 3–4 | `search.null-move.test.ts` `QE-208-c` door maps (search.ts, engine.ts) | + the two doors, `nullMove: true` | door-map growth; title reads "only the shipped path and the `ABC-210` doors" |
| 5–6 | `search.null-move.test.ts` `ABC-208` `A3` d5 drift ×2 (deep) | read 94.12 % against 95 %: they measure null move + extension | **re-point** the shipped side to the `ABC-210` door (`ADR-0051` d6) |
| 7–9 | the same file: the `A3` mate floor (deep) and "makes null moves … changes the work" ×2 | green either way | re-point, the same |
| **P1** | `transposition.test.ts` `ABC-081` `A5` "the fixture bites: at depth 3 …" (`:513-517`) | `search(…, 3).score` **−485 → 0** | **STOP.** Proposed: re-pin per `ADR-0026` d7 to depth 2, −502 (base and head both), where the repetition is still past the horizon |
| **P2** | `search.null-move.test.ts` `ABC-208` `A2` `zugzwang.005` (`:572`, deep) | `chooseMove` to 12 plays **Ne2 (0), not Nxd5**; Nxd5 from 13 (59) | **STOP.** Proposed: the row's depth 12 → 13; that edits accepted `ADR-0050` d9's table, so it is the owner's, bundled with `ADR-0051` |

- **P1 and P2 move under every form probed.** P1: every-node 0, PV-only 0, form (b) −511. P2: every-node Ne2 at 12
  (Nxd5 at 13), form (b) Ne2 through 13; only PV-only keeps it, and PV-only moves P1. So no form avoids the STOP.
- **0 levels, 0 relations, 0 NFR bounds, no `ADR-0026` level.** `G1`, the `ABC-121` rows and the `ABC-208` rows not
  listed read as base.
- The other six zugzwang/K+P rows (`zugzwang.001` d9, `.004` d11, four K+P d8) stay green.

### Frozen-clock counts (test note 3; a count, not a reading)

`chooseMove`, `now: () => 0`, `maxDepth: k`; nodes to complete depth k.

| form | kiwipete d7 | kiwipete d8 | kiwipete d9 | position-6 d7 | position-6 d8 | position-6 d9 |
|---|---:|---:|---:|---:|---:|---:|
| base (`main`) | 590 489 | 1 259 463 | 2 907 475 | 180 941 | 355 565 | 940 109 |
| **(a) horizon, cap 1 (the design)** | 610 577 (+3.4 %) | **1 302 377 (+3.4 %)** | 2 830 006 (−2.7 %) | 181 191 (+0.1 %) | 358 872 (+0.9 %) | **993 871 (+5.7 %)** |
| (a) every node, cap 1 | 641 891 (+8.7 %) | 1 369 820 (+8.8 %) | 3 256 498 (+12.0 %) | 212 224 (+17.3 %) | 418 255 (+17.6 %) | 1 202 218 (+27.9 %) |
| (a) every node, no cap | 683 366 (+15.7 %) | 1 449 940 (+15.1 %) | 3 470 023 (+19.3 %) | 219 621 (+21.4 %) | 438 514 (+23.3 %) | 1 435 732 (+52.7 %) |
| (b) first-ply quiet checks | 605 140 (+2.5 %) | 1 327 228 (+5.4 %) | 3 083 740 (+6.1 %) | 190 443 (+5.3 %) | 376 904 (+6.0 %) | 990 916 (+5.4 %) |

- Base equals `ADR-0050`'s head counts and `qe-ABC-209`'s pre-check. Base position-6 d10 needs 1 765 861.
- Form (b) also makes a full move generation at 24 090 / 61 452 leaves (kiwipete d7 / d8) and 10 039 / 20 718 / 57 087
  (position-6 d7 / d8 / d9).

**Nodes at fixed depth 6 (`A3`, ≤ 1.5 × base):**

| form | `search(…, 6)` kiwipete | `search(…, 6)` position-6 | `chooseMove` to 6 kiwipete | `chooseMove` to 6 position-6 |
|---|---:|---:|---:|---:|
| base | 237 007 | 109 912 | 309 541 | 52 265 |
| **(a) horizon (design)** | 249 811 (**1.054×**) | 110 654 (**1.007×**) | 324 937 (1.050×) | 52 341 (1.001×) |
| (a) every node, cap 1 | 271 653 (1.146×) | 185 584 (**1.689×, over**) | 343 711 (1.110×) | 58 478 (1.119×) |
| (a) every node, no cap | 278 039 (1.173×) | 192 190 (**1.749×, over**) | 348 436 (1.126×) | 60 995 (1.167×) |
| (a) PV nodes only | 245 336 (1.035×) | 141 047 (1.283×) | 311 101 (1.005×) | 52 244 (1.000×) |
| (b) | 244 286 (1.031×) | 121 453 (1.105×) | 317 174 (1.025×) | 55 111 (1.054×) |

### `G6` prediction against "≥ base" (rule A; `UNKNOWN - verify`)

- Base on `main` read kiwipete **8** ×5 and position-6 **9** ×5 at 3 s, with medians of 1 572 717 – 1 574 765 and
  1 645 154 nodes (`qe-ABC-209` `…7c874c4e`, `qe-ABC-208` `…3d6a4c99`). Base does not straddle a depth: kiwipete d9
  needs 2.91 M, and position-6 d10 needs 1.77 M.
- **The design is predicted to meet "≥ base" on both boards:**
  - kiwipete reaches 8 (1 302 377 nodes) while head's cost per node rises less than about **20 %**;
  - position-6 reaches 9 (993 871) while it rises less than about **65 %**.
  - The added work is one `isInCheck` at each horizon node not yet extended (14.6 % of kiwipete's nodes to d8, 18.6 % of
    position-6's to d9), plus 0.83 % / 0.97 % of nodes extended into a full move generation. That is far inside 20 %.
- The other forms also predict "≥ base", with less margin on kiwipete: every node about 15 %; (b) about 18 %, before
  its move generations are priced.
- **So the page's "≥ base − 1" clause can be struck.** It is stricter, so no owner word is needed (`…828d5794`). No form
  needed the − 1. The pre-check (test note 3) reads against "≥ base": head needs more nodes than base at d7 and d8 on
  both boards, but stays inside base's 3 s counts at base's depths.

### Size

**`M` holds; no split.** About 100–150 production lines in two files: the predicate, the switch and argument, and a door
per recursion. Tests: the predicate table, a source row, the `checkExtension` literal row, 5 `A2` rows plus the
instrument and the cap row, the `A3` node row, 2 drift rows and the mate floor, 5 re-points, 2 export lists, 2 door maps,
and P1 / P2 once routed. A split would ship a door with nothing behind it, and it would need a second D.

### Owed by others

- **Orchestrator: the STOP.** Route P1 (proposed: re-pin to depth 2, −502, under `ADR-0026` d7) and P2 (proposed:
  depth 12 → 13, which edits accepted `ADR-0050` d9, so it is the owner's). The build should wait on that routing, since
  both rows are in its lanes.
- **Owner (one question, as `…828d5794` asks):** accept or decline `ADR-0051`, with P2's `ADR-0050` d9 depth change.
  "≥ base − 1" is not part of it: it is struck as unneeded.
- **BA/PM, page lines (criteria tightened or read, none loosened):**
  - front-matter `adr:` reads "new `ADR-0051` (PROPOSED): form (a) at the horizon; it reverses no recorded decision";
  - Scope 1: form (a) only, at a horizon node (remaining depth ≤ 0) in check; (b) is not shipped;
  - Scope 3: the cap is 1 per line; `QUIESCENCE_MAX_PLY` and `src/quiescence.ts` are untouched;
  - `A2`: the (a) rows are `ADR-0051` d8's (five horizon rows, the instrument, the cap row); the (b) bullet is struck;
  - `A3`: "fixed depth 6" reads `search(position, 6)` against `searchWithoutCheckExtension`; **strike "≥ base − 1"**
    (`G6` reads "≥ base", rule A); add the drift bars (≥ 90 % / 174 cp) and the same-depth mate floor;
  - `A1`: a cross-build comparison QE runs out of tree, as `ABC-208`'s;
  - test note 1: the instrument is call-through spies on `src/apply.ts` and `src/quiescence.ts`, replayed by invocation
    order;
  - test note 3: the stop reads against "≥ base".
- **Engineer:** `src/search.ts`'s and `src/engine.ts`'s headers gain the extension paragraph; `src/quiescence.ts:21-24`
  stays as written.

## Close

> **BA/PM, 2026-10-27** (task `bapm-s1-ABC-210`, records only, at `main` `06c1ecc8`). Inputs: QE `…b953e670`,
> `…86b45c13`, `…e7597a78` (and `…8b5e45fd`, `…bd87e22e`; `QE-210-a` to `-d`), and the Orchestrator's routing
> `…85e9c9b2`. The form follows `bapm-s1-ABC-209` (`…492fb6ce`). The call is a delivery call under `…5aaf7cec`. The
> owner is told, and his veto is open. Notes: `.grugops/context/bapm-s1-ABC-210/notes/`.

**Closed unmerged under S1.** S1 says that anything other than GAIN is NOT MET, and that BA/PM then "closes or re-cuts
it". This ticket is closed.

- **The reading.** `A5` NOT MET. d1 was NEUTRAL, −1.7 ± 22.8, so the one extension ran. d2 read −7.8 ± 23.0. Pooled
  over 800 games (176/187/437), it is **−4.78 ± 16.21: NEUTRAL** (X − Y = −20.98). The grade is the same without the
  games that overlapped a foreign test lane, without the games at load1 > 8, and split by power source (`QE-210-d`).
  `A1`–`A4` and `A6` were MET: `A1` 6 156 of 6 156 cross-build cells, the pre-check 8 of 8 equal, `G6` MET against
  "≥ base" (8 = 8, 9 = 9), `G2` MET, `G1` 54 of 58. Under `…4c3f7639` the reading is final.
- **It was a fair test.** The candidate's built `dist/` carried the extension and the base's did not, and `G6` read the
  change (head is not node-equal to base). No production-code defect was found. The idea was measured, and no gain
  showed.
- **S1's one re-tune round is not taken, and no re-tune question goes to the owner.** Four reasons:
  - **No variant is predicted to clear.** The design probe already tried the knobs (`…c5d0e464`): caps 1, 2, 3 and
    none count within 0.1 %, so the cap tunes nothing. +2 plies fails `A2`. An extension at every node in check fails
    `A3` (1.69×) and reads `G1` 53/58. A PV-only form was close to a no-op and still moves P1. Form (b) reverses
    `ADR-0024` d4 (the owner's) and reads `G1` 53/58. Each of these is a new design or a failed bar, not a re-tune.
    In game 1 a check-extension probe changed none of the five errors (§ Problem).
  - **Reading the same build again is barred.** `…86b45c13` says "do not retry as is", and `…4c3f7639` makes this
    reading final. If the true effect were the −4.8 point estimate, a new 800-game reading would show GAIN about 1 time
    in 180 (my arithmetic: X needs about +21 more, against a standard error of about 8.3).
  - **The cost.** The two D halves took about 11.5 h (d1 5.7 h, d2 5.8 h), and the ALONE claim was held about 12.7 h.
    A re-tune adds a build, an ADR change, a QE hop and a second real-clock reading beyond `…4c3f7639`, which needs the
    owner's word.
  - **`P3`, low value, and it holds the epic's close.** The closing `M1` R reading waits on this ticket (`EPIC-008`
    § Tickets, the close path).
- **What is kept.**
  - `grugops/ABC-210` at `a96f36b0` (the build) and `grugops/qe-ABC-210` at `16032408` (QE's records, brought to `main`
    by path only). Neither is merged or deleted.
  - The failed attempt `…86b45c13`. `a96f36b0` is not read again as it is.
- **`main` is clean.** `git diff a17d5945 06c1ecc8 -- src data tools` is empty, so no revert is owed. On `main`,
  `zugzwang.005` stays at depth 12 and P1's fixture row stays at depth 3 (both moved only on the unmerged branch).
- **`ADR-0051`:** accepted by the owner (`…047d411f`), and not in force on `main`. P2's `ADR-0050` d9 change did not
  land. Both dated lines are the Architect's (`arch-adr0051-not-in-force`, as `ADR-0025` D4 and `ADR-0026` d9 did).
  This page's `adr:` line says the same. The `AGENTS.md` check-extension lane line does not land (`…85e9c9b2` item 3).
- **Not owed.** `QE-210-a` and `-c` are INFO. `QE-210-d` (host) does not change the grade. `QE-207-g` (the ALONE claim
  TTL) is the Orchestrator's, and it recurred here.
- **`QE-210-b` (LOW, closed as a blind spot), for any re-cut.** An extended node does not itself test the
  dead-position or 75-move draws, and no row exercises that. QE found no value effect: a dead position cannot change
  value, and 942 cells at clock 149 showed none. A value could move only at clock ≥ 150, the same class as every
  interior node today, and D games never get there. A re-cut that extends at the horizon carries this line into its
  test notes, with the decision (a row, or the blind spot stated again) left to its design hop.
- **The re-open path.**
  - **The owner vetoes the close.** The page goes back to Backlog (Blocked), and one re-tune round is cut on his
    word. It names what changes (a form or a bar the probe has not already failed), and it owes its own pre-check,
    `A1`–`A4`, `G2`, `G6`, D under S1 and the `QE-210-b` line. The epic's closing R reading then waits for its verdict.
  - **A later re-cut.** BA/PM cuts a new ticket from `a96f36b0`. Whether that counts as a new ticket's single reading
    or a second reading of this one is the owner's reading of `…4c3f7639`. Until he says, it is read as a second one.
- **Not touched here:** `src/`, `NFR-005`, `ADR-0051`, `ADR-0050`, `AGENTS.md`, and `EPIC-008`'s gate rows.
