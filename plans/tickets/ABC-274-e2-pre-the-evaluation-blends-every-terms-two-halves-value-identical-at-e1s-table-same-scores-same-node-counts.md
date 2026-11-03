---
id: ABC-274
title: "E2-pre: the evaluation blends every term's middlegame and endgame halves, not only the king's and the passers'. Value-identical at E1's table: the same scores and the same node counts, with a packed score recommended. No games"
status: backlog
column: Backlog
size: S
priority: P2
epic: EPIC-011
feature: —
adr: "ADR-0067 decision 8 (PROPOSED 2026-11-03, arch-ABC-239 decision …e4c34239, results …48ae6a93; acceptance is the owner's, PENDING). Builds on ADR-0064 d2 (the delta form, unchanged), d4 (the parameter table) and d6 (\"the two-accumulator form … E2's\"). Q-3K-4 (b) does not apply: this is not a value change (ADR-0056 D7 dated 2026-11-03: \"a value-identical ticket keeps its own cost bar as before\"; ADR-0067 d8: G6 \"≥ base\")"
---

# ABC-274: every term enters the blend, at E1's values (E2-pre)

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-E2pre-cut`, records only, at `main` `0b87f2d5`; `src/`
> tree `58fa3eb4`; nothing run, built or timed). Source: `ADR-0067` decision 8 (PROPOSED) and the Architect's decision
> note `arch-ABC-239` `…e4c34239` § 5 ("New ticket 'E2-pre' (BA/PM)") and § 3 (the order). The Orchestrator's brief
> fixes the id, size S and P2.
> - **`EPIC-011` Phase 4, between E1 (`ABC-269`) and E2 (`ABC-239`).** Order: `ABC-269` → **`ABC-274`** → `ABC-239`
>   → `ABC-270` / `ABC-271`; `ABC-272` any order.
> - **Intent: none. It is value-identical.** It plays no games (`ADR-0067` d8; `EPIC-011` § The per-change rule,
>   "Value-identical tickets … play no games"). Its proof is node identity, and its cost bars are `G2` and `G6`.
> - **Waits on:** `ABC-269` merged, for the build (hard). That merge is held today: `ADR-0064` F3 fired on `G2` (1.071 ×
>   / 1.067 ×), and `arch-ABC-269-F3` is choosing the one allowed cost cut. The owner's *"accept ADR-0067"* gates the
>   merge only (reading (b): `ADR-0067` § Status says "the build (E2-pre, then the tool) may start while this ADR is
>   PROPOSED"). **Pending, not assumed.**

## Problem

- **User:** the owner at level 5, through `ABC-239` (E2, the tuner) and every evaluation ticket after it. This ticket
  gains no Elo by itself. It is the logic change E2 needs, split out so that it can be checked on its own.
- **Pain:**
  - After E1, `src/evaluate.ts` blends only the terms whose two halves differ: the king's square table and the passed
    pawns (`ADR-0064` d6). Every other term reads its middlegame half at every phase, because at E1 its endgame half
    is equal.
  - A tuned set makes every half differ (`ADR-0067` § Context). With today's blend those endgame halves would be
    ignored. E2 would then need a logic change in `src/`, and two of `ABC-239`'s rows would become false as written:
    A3 ("`src/` gains constants only") and A4 (`G2` ≤ 1.02 × "only constants change").
  - Folded into `ABC-239`, the blend's cost would be mixed with the tuned values' effect in one reading
    (`ADR-0067` § Alternatives, "Fold the general blend into `ABC-239`").
- **Value:**
  - `ABC-239`'s A3 and A4 hold as written.
  - The blend's cost is read alone, on a change whose node counts must be exactly unchanged.
  - The tuner's identity gate (`ADR-0067` d5) reads a model of an evaluation that already blends every term.
- **Evidence:** the prototype's tracer modelled every term as blended. It matched E1 as built on 254 485 positions with 0
  misses (worst 0.958 cp, `…48ae6a93`), because at E1's values the two forms give the same number.

## Scope

`ADR-0067` decision 8, cited and not restated. The ADR governs each line.

1. **Every term enters the blend** in `src/evaluate.ts`: score = mg + trunc(Δ × (D − w) / D), where Δ = eg − mg summed
   over **all** terms (material, every square table, doubled, isolated, passed, the three king-file terms, mobility).
   This is `ADR-0064` d2's delta form, unchanged. Truncation is toward zero, never `Math.floor`, and the negamax flip
   stays `0 − score`.
2. **The form is the Engineer's choice, within value identity.** `ADR-0067` d8 recommends a packed score: one int32 per
   table entry, eg in the high 16 bits and mg in the low, so each square table is read once. The form is not a bar.
3. **`src/evaluate-params.ts` is byte-unchanged.** No value moves. `ABC-239`'s tool writes that file "in its present
   shape" (`ADR-0067` d7), so any packed or derived arrays are built from it at load, in `src/evaluate.ts`.
4. **No new switch and no new door.** The change is value-identical, so no test-only off-door pair is needed. `ABC-269`'s
   `taper` switch and its three doors keep their meaning and their counts.

## Out of scope

- **Any value change.** No weight, table or phase constant moves.
- **Tuning, the tool and its data** (`ABC-239`, `tools/tune/`, Q-3K-7).
- **New terms** (E3–E7: `ABC-270`, `ABC-271`, `ABC-272` and the stubs).
- **O1-e** (incremental material and square tables in `Position`) and **lazy evaluation**: recorded on `EPIC-011`
  § Phases, "Not cut, recorded", not here.
- **`ABC-215` A2's rebuild-from-rule rows.** They stay green here. `ABC-239` replaces them with a provenance row.
- **Any production hook, counter or flag.**

## Acceptance criteria

"Pre-ticket head" means `main` with `ABC-269` merged (including whatever cost cut `arch-ABC-269-F3` lands), read in
the same process or session as the candidate. The bars come from `ADR-0067` d8 and are not loosened after Ready.

- **A1 (node identity: the instrument check, read first; `ADR-0067` d8, "node identity (B0's rows)").**
  - **Given** the candidate and the pre-ticket head, **when** `ABC-269` B0's 11 readings are taken, **then** every count
    is equal, exactly. The 11 readings are `chooseMove` deepened on a frozen clock (kiwipete d8 and d9; position-6 d8,
    d9 and d10), `search()` at depth 8 on both boards, and the four door readings (`chooseMoveWithoutTaper`,
    `searchWithoutTaper`, depth 8, both boards).
  - **And** the cross-build check, `ABC-269`'s G4 shape: on the 190 positions (`G3`'s 184 plus 6 endgames), the shipped
    `search()` at d1–3, `chooseMove` to d3, and every door at its depths read the same **nodes, score and move** as on
    the pre-ticket head: **0 mismatches** (the row count is reported; `ABC-269` read 8 360 door rows).
  - Both sets of figures go in the PR. A miss is a defect: the build is not value-identical, and nothing else is read
    until it is fixed.
- **A2 (the same evaluation; `ADR-0067` d8, "`evaluate` equal to the pre-ticket `evaluate` on the frozen corpus").**
  **Given** every position in `src/evaluate.mirror-corpus.ts` (`G3`), `src/evaluate.taper-corpus.ts` (QE's E1 fixture,
  phases 0–24) and the 190, **when** each is scored by the pre-ticket `evaluate` and by the candidate's, **then** every
  score is equal under `Object.is` (0 mismatches; the count is reported). The same holds for `evaluateWithoutTaper`.
- **A3 (the blend is live for every term).** *BA/PM's row: `ADR-0067` d8's bars hold for a blend that ignores the new
  halves too, so this row checks scope 1 itself.*
  - **Given** a table equal to E1's except that **one** term family's endgame half is offset by a non-zero constant,
    **when** each of QE's frozen positions for that family (≥ 3 per family, at phases 1–23, with the term present) is
    evaluated, **then** the score equals mg + trunc(Δ × (24 − w) / 24) computed by hand from the offset table, exactly.
  - It runs for each family in scope 1.
  - How a test reaches an offset table (a test-only seam in `src/evaluate.ts`, or a check outside `src/` as the
    prototype's tracer did) is the Engineer's call, `UNKNOWN - verify` with the Architect. `src/evaluate-params.ts`
    stays byte-unchanged either way (scope 3).
- **A4 (`G3`).** The mirror holds under `Object.is` on `G3`'s corpus and on the taper corpus's 30 mirror rows. Purity
  holds: no module state is written by `evaluate`.
- **A5 (`G2`; `ADR-0067` d8, `ADR-0064` B6's level).** The complete evaluation costs **≤ 1.05 ×** the pre-ticket head's
  per call, in the same session. The method is `ABC-076`'s, as `ADR-0031` d3 applies it, with `ADR-0031`'s near-bar
  rule. The figure is reported to 3 places. A packed score is expected to land near E1's cost (`ADR-0067` d8). That
  is an expectation, not a reading.
- **A6 (`G6`, graded "≥ base"; `ADR-0067` d8; `NFR-005`).**
  - The rule: `ABC-205`'s, as `ABC-269` B7 applies it. Both `G6` boards (kiwipete, position-6), at `LEVELS[5]`
    (4 000 ms), plain `node`, on the reference host, ≥ 5 interleaved rounds per board per build, width 1, load
    recorded.
  - **Graded:** each board's median completed depth is **≥ the pre-ticket head's**, and **no single run is below depth
    6** (FAIL below; depth 7 is a WARN).
  - `Q-3K-4` (b) does not apply, because this ticket changes no evaluation value (`ADR-0056` D7 dated 2026-11-03).
- **A7 (no row moves).**
  - No expected value in any `src/*.test.ts` file changes. The test diff adds rows only (A1–A4).
  - The default lane and every lane that reads `evaluate` pass unchanged. That includes `SEARCH_DEEP=1` (zugzwang,
    the mate floor), `PUZZLE_DEEP=1` (`G1` 54 / 58) and `quiescence.test.ts`'s deep pins. Counts are reported before
    and after.
  - A row that needs a re-pin is an A1 defect, not a re-pin.
- **A8 (no games; review).**
  - No C2′, S′ or Levels read: a value-identical ticket plays no games (`ADR-0067` d8).
  - R-TC part 1, item 2, read at review: the diff reads no budget, deadline, `movetime`, test flag or environment.
- **S2, the nps reading: the Orchestrator's ruling, pending.** `EPIC-011` § The per-change rule keeps the S2 nps
  reading for value-identical tickets unless a ticket is named as an exception (`ABC-265` was). `ADR-0067` d8 names
  `G2` and `G6` as this ticket's cost bars and no nps bar.
  - BA/PM recommends the `ABC-265` exception: this is an identity ticket, not a speed ticket, and A5 / A6 read its
    cost.
  - **Default until ruled:** the S2 nps reading is taken and reported, with no speed bar (≈ 1 h ALONE, estimate).

### Falsifiers and their dispositions

`ADR-0067`'s falsifier table has no E2-pre row, so this table states the dispositions. The Architect's line is owed
(DoR row 10).

| fires when | row | disposition |
|---|---|---|
| a count, score or move differs from the pre-ticket head | A1, A2, A4, A7 | a defect: fixed before any cost bar is read |
| a family's offset is not blended as the formula says | A3 | a defect |
| `G2` above 1.05 ×, or a `G6` median below base, or a run below depth 6 | A5, A6 | STOP to Architect/Design. The disposition is `UNKNOWN - verify` until the Architect writes it into `ADR-0067`, in the pattern of `ADR-0064` F3 (one value-identical cost cut, then one new reading). Not merged on a miss. No value is changed to pass |

## NFR triggers

- **`NFR-001` / `G2`:** A5, ≤ 1.05 × per call, same session.
- **`NFR-005`** (depth floor 6 at the default budget): A6. "≥ base" is graded, the floor is unchanged, and depth 7 is a
  WARN.
- **`NFR-009`** (≤ 16 MiB search-held; ≤ 1 MiB growth between a 1 s and a 3 s search): any packed or derived arrays are
  built once, at load, and nothing grows per search. The size added is `UNKNOWN - verify`: the Engineer reports it in
  the PR. Arithmetic bound: about 6 tables × 64 squares × 2 colours × 4 bytes ≈ 3 KiB. `G7` reports it.
- **`NFR-008`** (`npm test` ≤ 10 s): the A2–A4 rows are default-lane units with no search. A1's node readings sit
  behind `SEARCH_DEEP=1` / `ENGINE_DEEP=1`. `N8-LANE` is reported before and after.
- **`NFR-004`:** no new throw site and no clock change (`G5`).
- **Security:** none. No new input path, data, format, option or dependency. `plans/nfr-catalog.md` is untouched.

## Test notes

1. **QE freezes before the build:** A3's positions, ≥ 3 per term family at phases 1–23 with the term present, each
   with its FEN, phase and family, committed before the build's first commit. A3's offset is chosen there too. Nothing
   is changed afterwards to make a row fit.
2. **A1 is read in one process against the pre-ticket head**, as `se-ABC-269` read G4 against `main`
   (`…669f366c`). If `arch-ABC-269-F3`'s cut has changed `ABC-269`'s B0 counts, the merged head's counts govern.
   They are read, not copied from `ABC-269`'s page.
3. Deterministic mode (`ADR-0027`) holds: the evaluation is pure and integer, and trunc is odd. That is what makes A1
   exact.
4. Reuse the sourced fixtures: `G3`'s corpus, `src/evaluate.taper-corpus.ts`, the 190, `kiwipete` and `position-6`.
5. **UAT is owed** (production lines change). The QE verdict signs it (owner delegation `…5aaf7cec` item 2).

## Size and priority

- **Size: S** (`ADR-0067` d8 and § Consequences; `…e4c34239` § 6: about a day of SE work plus QE's node identity, `G2`
  and `G6`). One function's blend widens, maybe with a packed table built at load. No value, door or test expectation
  moves.
- **Priority: P2.** It is the gate in front of E2 (`ABC-239`), which `ADR-0056` D2 calls "the largest single eval
  lever", and it is the next evaluation ticket after `ABC-269` in the recommended order. *`ABC-239` itself is still P3
  on its page; raising it is the Orchestrator's call at its pull.*

## Dependencies

- **`ABC-269` merged** (hard): E1's table, phase and delta blend. Today `ADR-0064` F3 has fired on `G2`, and
  `arch-ABC-269-F3` is choosing the one allowed cost cut.
  - **If that cut is the packed score,** part of scope 2 lands in `ABC-269`. This ticket then keeps scope 1 (every
    term in the blend) and stays S. BA/PM re-reads the page at that merge.
  - **If `ABC-269` does not merge** (`ADR-0064` F6, or a second F3 miss), `ADR-0067` § Consequences item 1 applies:
    E1's structure, re-offered value-identical to `main`, becomes E2's base and is folded into this ticket. The page
    is then re-cut (larger than S), not built as written.
- **Owner: *"accept ADR-0067"* / *"decline it"*: PENDING, not assumed.** It gates the merge only (reading (b),
  `ADR-0067` § Status). Default without an answer: `main` keeps E1's blend. Q-3K-7 (a)/(b)/(c) and B-T8 do not touch
  this ticket.
- **Architect:** the E2-pre falsifier and disposition line in `ADR-0067` (above). It is owed before Ready.
- **Orchestrator:** the S2 ruling (A8's last row).
- **File collisions, one at a time:** `src/evaluate.ts` with `ABC-239` (after this), `ABC-270`, `ABC-271` and
  `ABC-272`. By the order this ticket goes first among them. Whichever follows re-reads its door counts.
- **Couplings:** `ABC-239`'s A3 / A4 hold as written once this merges. `ABC-273` (R1) is not ordered by this ticket.
  R1 stays after E1 and before E2's merge (`ADR-0067` § Consequences item 7). This ticket changes no value, but it may
  change speed within A5's bar.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ E1 blends two terms only (`ADR-0064` d6); a tuned set makes every half differ; `ABC-239` A3 / A4 need the blend first (`ADR-0067` § Context); no Elo claimed |
| 2 | scope and out-of-scope | ✅ scope 1–4 = `ADR-0067` d8; values, the tool, new terms, O1-e and lazy evaluation out |
| 3 | INVEST | ✅ S; one function's blend; checkable alone by exact node identity; valuable as E2's gate (an enabler, said plainly) |
| 4 | testable, measurable acceptance | ✅ A1 11 / 11 counts exact plus the 190 cross-build at 0 mismatches; A2 `Object.is` at 0 mismatches; A3 exact per family; A4 mirror; A5 ≤ 1.05 ×; A6 median ≥ base, every run ≥ 6; A7 0 expectations changed; A8 no games. S2 is reported until the Orchestrator rules |
| 5 | dependencies known | ✅ `ABC-269` merged (F3 open); *"accept ADR-0067"* (merge only, pending); the Architect's disposition line; the S2 ruling; file collisions |
| 6 | NFR triggers with targets | ✅ `G2` ≤ 1.05 ×; `NFR-005` floor 6 with "≥ base" graded; `NFR-009` fixed size added at load, ≤ 16 MiB, reported (≈ 3 KiB arithmetic); `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–5 (QE's A3 freeze; one-process A1; F3 coupling; UAT) |
| 8 | size | ✅ S |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ `ABC-269` is not merged (`ADR-0064` F3 fired; `arch-ABC-269-F3` open), and the build needs its head. The E2-pre disposition line in `ADR-0067` is owed by the Architect. `ADR-0067` acceptance gates the merge only (reading (b)), so it does not block Ready |

**DoR 9/10. Backlog.** Ready once `ABC-269` merges and the Architect's E2-pre disposition line is in `ADR-0067`. QE
freezes A3's positions before the build. The board move is the Orchestrator's.
