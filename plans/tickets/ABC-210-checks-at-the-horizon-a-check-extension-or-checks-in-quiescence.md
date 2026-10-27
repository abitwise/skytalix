---
id: ABC-210
title: "Checks at the horizon: a check extension, or checks in the first quiescence ply, behind an ADR-0026 door and bounded in growth"
status: ready
column: Ready
size: M
priority: P3
epic: EPIC-008
feature: —
adr: "reverses ABC-079's recorded decision (src/quiescence.ts:21-24): an ADR plus an ADR-0026 door; route the text to the owner when it lands (…7feb0553)"
---

# ABC-210: checks at the horizon

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
2. **An `ADR-0026` door:** every pre-existing door turns it off, and one new door turns it off on the shipped path.
3. **A growth bound.** `QUIESCENCE_MAX_PLY` stays a runaway guard, and an extension cap is stated as a number.
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
- **`A2` (it does what it says).**
  - **(a):** **Given** a position in check at the frontier, **then** the instrumented search goes one ply deeper there,
    and a line never gets more than the cap's extra plies.
  - **(b):** **Given** a position whose only good move is a quiet check that wins material in the next quiescence ply,
    **then** quiescence returns a score that reflects the win, where base stands pat.
  - At least 4 rows for each form shipped.
- **`A3` (growth stays bounded).**
  - **Given** `kiwipete` and `position-6` at fixed depth 6, **then** nodes ≤ **1.5 × base**. The figure is BA/PM's bar,
    the `ADR-0024` decision 3 headroom precedent.
  - **Given** the 3 s budget, **then** `G6`'s `NFR-005` levels hold: depth ≥ 6 (FAIL floor), 7 (WARN). `G6`'s "≥ base"
    clause is relaxed to **≥ base − 1, for this ticket only**. That is BA/PM's ruling: an extension spends nominal depth
    by design, and the D reading judges whether the trade pays.
  - **The depth-6 FAIL floor does not move.**
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
- **`A6` (the ADR).** The ADR exists, states the form and the cap, and records that it was reported to the owner.

## NFR triggers

- **`NFR-005`:** at risk from node growth. `A3` reads it with a depth floor of 6 that does not move. **If the form
  cannot meet `A3`, it is NOT MET. No bound moves.**
- `NFR-004`: unchanged. `NFR-008`: reported.
- **Security:** no limb, no hop.
- *2026-10-27 (BA/PM, `bapm-ready-ABC-210`):* carried forward unchanged. The depth-6 floor does not move.

## Test notes

1. Instrument the extension and quiescence depth in tests only. No production counter.
2. UAT is owed (production lines). The QE verdict signs it.
3. **Frozen-clock pre-check (a process step, no bound).** *Added 2026-10-27 by BA/PM (`bapm-ready-ABC-210`), the same
   step as `ABC-208` test note 4 (`…84a05b3a`).* Before the real-clock `G6` reading, QE reports the nodes each build
   needs to complete depths 7 and 8 on `kiwipete` and `position-6` (`chooseMove`, `now: () => 0`, `maxDepth: k`;
   `src/engine.ts:166`, `:173`), base and head: 8 counts. An extension or checks in quiescence should raise head's
   counts (`UNKNOWN - verify`). If head is predicted to miss the `G6` bar in force for this ticket at a depth base
   straddles at 3 s (that bar turns on the flagged "≥ base − 1" question under `A3`), QE stops to Architect/Design
   before the run. It grades nothing.
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
