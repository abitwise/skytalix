---
id: ABC-210
title: "Checks at the horizon: a check extension, or checks in the first quiescence ply, behind an ADR-0026 door and bounded in growth"
status: backlog
column: Backlog
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
- **`A4` (existing gates).** `G1` (mate rows may newly solve; raising the baseline is QE's), `G5`, `G8`, `G9`, and
  `G10` for any red.
- **`A5` (the reading).** **Given** `ABC-204` is Done, **then** D meets ship rule **S1**. **Reported:** X ± Y, and
  `G11`.
- **`A6` (the ADR).** The ADR exists, states the form and the cap, and records that it was reported to the owner.

## NFR triggers

- **`NFR-005`:** at risk from node growth. `A3` reads it with a depth floor of 6 that does not move. **If the form
  cannot meet `A3`, it is NOT MET. No bound moves.**
- `NFR-004`: unchanged. `NFR-008`: reported.
- **Security:** no limb, no hop.

## Test notes

1. Instrument the extension and quiescence depth in tests only. No production counter.
2. UAT is owed (production lines). The QE verdict signs it.

## Dependencies

- **`ABC-209` merged.** They share `src/engine.ts`, and its merge is the D base.
- `ABC-204` Done.
- **Ready trigger:** `ABC-209` reaches Done, or BA/PM closes it under S1.

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
