---
id: ABC-237
title: "The transposition table prefers deeper entries when it replaces, still cleared per search and still 4 MiB"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
---

# ABC-237: depth-preferred TT replacement

> **REFINED 2026-11-01 by BA/PM: DoR 9/10, Backlog, held by sequence only** (task `bapm-phase1-wording`, records only,
> at `main` `b19af469`; nothing run). The design is written: the `ADR-0025` T2 amendment, PROPOSED
> (`arch-epic011-phase1` `…3209a6d0`, `…1dcdd8c7`). **Reading (b):** once this ticket is pulled, the build and its gates
> may proceed while the amendment is PROPOSED; **the read (A6) and the merge wait on the owner's acceptance.** With no
> answer, always-replace stands and this ticket does not merge. Row 10 keeps one hold, `EPIC-011`'s sequence:
> **`ABC-238` merged or closed** (shared `src/transposition.ts`; the `ABC-208` precedent). The acceptance below is
> aligned to the amendment (A2 rows, the drift row, the read, falsifiers T6/T7), with dated marks.

> **RE-HOMED 2026-11-01 to `EPIC-011` by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). The
> owner asked for a new epic for the 3 000 path, started after the open epics close, and for no work done twice
> (`orch-2026-10-30a` `…022fb66f`). `ADR-0056` D4 maps this ticket to its gap list, so it leaves `EPIC-010` rather
> than holding that epic's close. **Id unchanged; nothing below this block is edited.** `ADR-0056` row T2. `EPIC-011`
> Phase 1, **second: after `ABC-238`** (`ADR-0056` D6 orders T1 → T2, "T1 order free"; the only coupling is the shared
> `src/transposition.ts`). `EPIC-010`'s order `ABC-237` → `ABC-238` is replaced. Keeping the table across moves is
> `ABC-257`, size is `ABC-258`; both stay out of scope here. Line cites are re-read at refinement ~~(`ABC-253` moves the
> TT keys to two 32-bit halves first)~~ *(stale: `ABC-253` was dropped, "nothing to cut", `…27ddb1fb`; the keys stay `bigint`)*.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 9, the
> replacement half (SA `…306a4012` rows 9a, 9b). **Not `ABC-209`:** the table is still cleared per search
> (`ADR-0025` d4 as in force). **Waits in Backlog on** an `ADR-0025` amendment and the owner's Q4. Milestone 2.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only): the owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`). This ticket's reading is now the smoke pair before merge (`EPIC-010` § The
> merge rule), with a batched validation later. Q4 no longer holds it. **Next real wait:** an `ADR-0025` amendment. Milestone 2. DoR 8/10 → 9/10.

## Problem

- **User:** the owner at level 5.
- **Pain:** the table always replaces (`src/transposition.ts:22-26`, ~~`:135-147`~~ *`:136-148`, re-read 2026-11-01 at `b19af469`*), so a shallow entry evicts a deep one
  that cost far more to compute.
- **Value:** deep entries survive, so more hash moves and cutoffs from expensive work.

## Scope

1. Replacement by a stated rule (for example: replace if the new depth ≥ the stored depth, or the stored entry is from
   an older iteration), named in the ADR. Size unchanged: 2^18 × 16 B = 4 MiB. *(2026-11-01, the `ADR-0025` T2
   amendment names it: a store writes when (a) the slot is empty, (b) it holds the same full key, or (c) it holds
   another position whose stored depth ≤ the new depth; otherwise the store is dropped. No age or generation field, no
   new bits: 17 + 2 + 13 packing, `tableByteLength()` 4 194 304. Decision 4, clear per search, untouched.)*
2. An `ADR-0026` d10 off-door: under LMR a different hash move changes values (SA 6c's mechanism).

## Out of scope

- Table size (2^19 fits `NFR-009`; 2^20 is a re-level, the owner's). Buckets. Keeping the table across moves
  (`ABC-209`). Deeper-entry cutoffs (`ABC-238`).

## Acceptance criteria

- **A1 (the door).** Node-equal, cross-build, on the `ABC-078` `A3` corpus (`G4`). *(2026-11-01, the amendment.)* Two
  test-only doors, one per recursion (names the Engineer's, `…Without…` form), each node for node the pre-ticket
  `search()` / `chooseMove`; one switch in both recursions, passed to `storeEntry` as an argument. Every older door
  turns it off; if `ABC-238` merged first, `ADR-0058`'s two doors are among them and still reproduce the
  pre-`ABC-238` search. Rows re-point as `ADR-0058` d5 says, to this ticket's door.
- **A2 (the rule).** ~~**Given** a unit row that stores depth 6 then depth 2 at one slot, **then** the depth-6 entry
  remains; and the converse case replaces.~~ *(re-worded 2026-11-01 to the amendment's rows)* **Given** two DIFFERENT
  keys that share one slot, **then**: depth 6 then depth 2 keeps the depth-6 entry; depth 2 then depth 6 replaces;
  depth 4 then depth 4 replaces. **Given** ONE key stored at depth 6 then depth 2, **then** it replaces. **With the
  switch off,** every case replaces. **And the drift row:** at depth 5 on `ABC-121`'s 190, in both recursions, against
  the door, ≥ 95 % of non-mate scores within 25 cp and 0 mate scores change sign (`ADR-0058` d6's bars); the count of
  identical scores is reported (near-identity is expected at depth 5).
- **A3 (it pays).** **Given** `kiwipete` and `position-6` at 3 000 ms, 5 interleaved runs per build, **then** head's
  median completed depth ≥ base's on both (`G6`), and at fixed depth 8 nodes ≤ **0.97 ×** the door's on at least one.
  *(2026-11-01: A3 is the mechanism evidence. That fixed depth 8 loads the table enough to see it is an inference from `qe-tc-depth-probe` R1, not a measurement: kiwipete reaches depth 8 only near 4 s, ≈ 10× the slot count.)*
- **A4 (memory).** `G7`: ≤ 16 MiB, growth ≤ 1 MiB between 1 s and 3 s.
- **A5 (gates).** `G1`, `G5`, `G8`, `G9`, `G10`.
- **A6 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair of `EPIC-010` § The merge rule.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at E 1 650: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (~~41 at `ADR-0056`'s count~~ *57 at `EPIC-010`'s close read, 577 s, `qe-EPIC-010-close` `…388b3044`*; QE counts its own run). A failure is a defect, back to the Software Engineer. *(2026-11-01, the amendment's read.)* **Intent: GAIN** (bar ≥ 50.0 of 100), unless the owner answers the open NEUTRAL-bar question (`…1dcdd8c7`; the Orchestrator's to ask). The read and the merge wait on the owner's acceptance of the amendment. **The limit, stated:** at 100 ms at most 8.5 % of stores meet another position's entry (upper bound, `…3209a6d0`), so this read guards against breakage and its score sits near a coin flip for this effect; QE reports it with that limit stated (`ABC-258` `A4`'s form). A3 is what sees the mechanism. No longer-control read is asked.
- **Falsifier dispositions** *(2026-11-01, the amendment's T6/T7)*: A2 wrong in any case, or the drift row red (T7) — a
  defect, back to the Software Engineer. A3 missed, or A6 NOT MET (T6) — not merged; the amendment reads "accepted,
  not in force".

## NFR triggers

- **`NFR-009`:** A4. **`NFR-005`:** A3. **Security:** none.

## Test notes

1. UAT is owed. The QE verdict signs it.
2. *(2026-11-01, `bapm-qe-gaps-1101`, QE-249-a LOW, `qe-ABC-249` `…66371344`.)* **If this ticket re-pins
   `ABC-249`'s row** in `src/engine.test.ts` ("Qe5+ at ply 4 stood twice before the root …"), the with-keys move
   stays different from the withheld move, or the row gains the relational assert
   `expect(label(withKeys.move)).not.toBe(label(base.move))`. Equal figures mean the fixture is dead: re-run QE's
   `QPLY4` plant and rebuild the fixture before merge; never re-pin both to one value. *QE-249-b (INFO):* no
   default-lane row holds a pre-root draw scored exactly 0 below ply 1; if this ticket changes how such a draw is
   scored or stored, it adds one.

## Size and priority

- **Size: S.** One function and a door. **Priority: P3.**

## Dependencies

- **Architect/Design:** an `ADR-0025` amendment (its falsifier `T2` is the measurement that would change
  always-replace). Reported to the owner. *(2026-11-01: written, PROPOSED, `…3209a6d0`.)* **Owner:** Q4 answered 2026-10-29: (e), extended (`orch-2026-10-29g` `…278e149b`). ~~Before `ABC-238` (shared file).~~ *(reversed 2026-11-01 by the re-home: after `ABC-238`, merged or closed.)* *(2026-11-01:)* acceptance of the amendment before the read and the merge (reading (b)).
- *(2026-11-01, couplings named in `…1dcdd8c7`, not decided here:)* `ABC-257` owes an age rule, or a measured
  statement that none is needed, once the table is kept across moves (its page).

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ SA 9b |
| 2 | scope and out-of-scope | ✅ size and retention out |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ every row measurable; A6 is the 100-game read at 100 ms (`EPIC-011` § The per-change rule; its pass line is `ADR-0056` C2′) *(2026-11-01)* *2026-11-01 (`bapm-owner-answers`): plus the 10-game Stockfish smoke at 0.5 s; its no-collapse bar is the owner-answers fold's, scored as the C2′ line was while pending (the ticket leaves Backlog only after that fold merges).* *2026-11-01 (`bapm-reconcile-adr0056`): the fold merged (`a0f9297e`); the bar is S′'s S-4 at E 1 650, and the row adds the Levels deep lane (exit 0, every test passed). Score unchanged.* |
| 5 | dependencies known | ✅ *2026-11-01: amendment PROPOSED; after `ABC-238`* |
| 6 | NFR triggers with targets | ✅ ≤ 16 MiB; nodes ≤ 0.97 × |
| 7 | test notes | ✅ 1 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~ADR~~ *2026-11-01: the ADR half is met (amendment written, PROPOSED; reading (b)). Held by sequence: `ABC-238` merged or closed (`EPIC-011`)* |

**DoR 9/10 (re-scored 2026-10-29; re-read 2026-11-01, `bapm-phase1-wording`: row 10 now a sequence hold only). Backlog.**
