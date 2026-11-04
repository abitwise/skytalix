---
id: ABC-271
title: "E4a: passed pawns read the kings and the path. An endgame-weighted king-distance term, a free-path term, and the unstoppable passer in a pawn ending by the rule of the square, each by a stated rule on E1's parameter table, behind an ADR-0026 test-only off-door pair"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR for E4a on ABC-269's base (the rules, the values by ABC-215's provenance rule, where the king-dependent part is computed given the pawn memo is keyed by pawn masks only, the door names, the premise PREREG and the firing figure at 100 ms). Its acceptance is the owner's (reading (b))"
---

# ABC-271: passed pawns that know about the kings (E4a)

> **NEXT, AND BEFORE A SECOND TUNING PULL, 2026-11-04, by BA/PM** (task `bapm-ABC-239-close`, records only, at `main`
> `ac55ddf6`; nothing run). `ABC-239`'s first pull closed NOT MET (`orch-2026-10-30a` `…4c76bf7a`). The Architect traced
> its F4 miss (`zugzwang.001`, e1e5 at depth 9) to the fitted endgame halves of the pawn, passer and king terms, and
> found that the passer part needs this ticket's free-path and king-distance terms (`arch-ABC-239-f3f4` `…4eae0fd3`,
> `…69f22167` § 1). The Orchestrator orders this ticket next, in design now (`arch-ABC-271`). See § Dependencies. **No
> bar on this page moved. DoR stays 9/10** (row 10: the ADR).

> **`ABC-269` MERGED, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main` `128e3c6c`; nothing run).
> `ABC-269` (E1) merged to local `main` at `54dee3f2` (QE PASS_WITH_GAPS `qe-ABC-269` `…eff2fe64`), so this page's wait
> on that merge is **met**. DoR stays 9/10: row 10 now waits on the ADR alone. Order unchanged: after `ABC-274` and
> `ABC-239` (`EPIC-011` § Dependencies).

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run, built or timed). Source: the owner's *"Analyze and create tickets under EPIC-011"* and this task's gap analysis
> (`EPIC-011` top block of 2026-11-03). **Rank 2 of the uncut items.**
> - **`EPIC-011` Phase 4, row E4, first slice.** It takes `ABC-232`'s "any other passer term" (closed 2026-11-02 as
>   merged into `ABC-269` and E4). Connected / phalanx and backward pawns stay in the E4 stub (E4b, weights from the
>   tuner).
> - **Intent: GAIN (≥ 50.0 of 100)** unless the ADR's firing figure at 100 ms shows the terms barely fire. Then the ADR
>   names "NEUTRAL (invisible at 100 ms)" with its own measured bar, before Ready, under `ADR-0056` C2′'s 2026-11-02
>   line. Never re-classed after a score is seen.

## Problem

- **User:** the owner at level 5, in every ending with a passed pawn.
- **Pain:**
  - Passed pawns are scored by rank only (`PASSED_PAWN_BONUS`). E1 doubles the endgame half by rank (`ADR-0064` d3),
    still blind to whether a king can catch the pawn, whether its path is blocked, or whose king is nearer.
  - In a pawn ending a passer outside the enemy king's square promotes by force. A depth-6 search (the 100 ms median,
    `qe-tc-depth-probe`) sees that only when the race is short.
- **On the evaluation instrument** (information only): 8 of the 25 persistent errors on the 123 unique positions
  have a passed pawn on the board; 2 have one on rank 5–7. E1's form fixes 1 of the 25 (this task's
  re-classification). Weak support, stated as such.
- **Value:** E4's row is +20–60 Elo for the whole of pawn and passer terms (`ADR-0056` D2, an estimate). This slice
  (king distance, free path, unstoppable) is **+10–30 (BA/PM estimate, not a reading).**

## Scope

The ADR governs each line; every value comes from a rule it states (`ABC-215`).

1. **King distance, endgame half only:** for each passer, a term in the two kings' distances to its queening square
   (the rule, the distance metric and the rank weighting are the ADR's). Its middlegame half is 0, so at phase 24 the
   evaluation equals `ABC-269`'s exactly.
2. **Free path, endgame half only:** a passer whose squares ahead are empty gets a bonus by rank (the ADR's rule).
3. **The unstoppable passer:** in a pawn ending (phase 0), a passer outside the defending king's square, with the side
   to move counted, is scored by a stated value below a queen.
4. **Where it is computed:** the pawn memo is keyed by the two pawn masks (`ADR-0064` d5), so king-dependent and
   piece-dependent parts sit outside it. The ADR states the cost.
5. **One switch and a door pair** (`ADR-0026` d10's pattern); every older door turns it off. Rows by reference
   (`ADR-0064` d7's list); no zugzwang depth is re-pinned.

## Out of scope

- Connected / phalanx, backward and candidate passers (E4b, under the tuner). Tuning (E2).
- King safety (`ABC-270`), endgame scaling (`ABC-272`), search changes.

## Acceptance criteria

The ADR fixes exact counts before Ready; none of these bars is loosened after Ready.

- **P0 (node identity with the design):** frozen-clock `chooseMove` and `search()` counts on kiwipete and position-6
  as the ADR names them, exact; every door reads `main`'s counts.
- **P1 (relations; default-lane units, no search):**
  - (a) **Mirror:** `G3`'s corpus plus `ABC-269`'s mirror set plus ≥ 10 new passer positions, `Object.is`, 0
    mismatches.
  - (b) **Phase 24 is E1:** on every full-material position in the corpus, `evaluate` equals `ABC-269`'s, exactly.
  - (c) **The square:** **given** ≥ 8 QE-frozen pawn endings (4 with the passer outside the defending king's square,
    4 the same pawn with the king one step inside, side to move stated), **then** each "outside" position scores at
    least the ADR's unstoppable value above its "inside" twin, from the passer's side.
  - (d) **King distance is monotone:** **given** ≥ 6 QE-frozen pairs that differ only by the defending king one step
    nearer the queening square, **then** the passer side's score is strictly lower with the king nearer.
  - (e) **Free path:** **given** ≥ 4 QE-frozen pairs that differ only by a piece on a square ahead of the passer,
    **then** the free-path bonus is present only when the path is empty.
- **P2 (mate floor):** door d4 → head d5 and d5 → d5 on the 287, **0 violations** each.
- **P3 (zugzwang, hard):** `ADR-0050` d9's seven rows, **7 / 7**, recorded depths.
- **P4 (`G1`):** **≥ 54 / 58, no NEWLY-MISSED line.**
- **P5 (`ADR-0061`'s cut audit on this scale):** **≤ 0.5 %** flips and **0 ≥ 200 cp.**
- **P6 (`G2`):** the complete evaluation **≤ 1.05 ×** the base head's per call, same session.
- **P7 (`G6`, by `Q-3K-4` (b)):** `LEVELS[5]`, ≥ 5 interleaved rounds a board a build: **every run ≥ depth 6**,
  depth 7 WARN; medians reported, not graded.
- **P8 (the read; `EPIC-011` § The per-change rule, by reference):** C2′ 100 games at 100 ms, **≥ 50.0 of 100**
  (GAIN) or, only if the ADR named it before Ready, ≥ 43.0 with its own measured bar; S′ `r <candidate> <out> --elo
  1810 --budget-ms 500 --rounds 5 --concurrency 1` (or the E in force, `ADR-0056` S′), S-4; the Levels deep lane exit
  0; R-TC part 1 item 2 at review. A miss is NOT MET and not re-played.
- **Reports, not bars:** drift at d5 on the 190; reach at 47 000; the evaluation instrument; the firing rate at 100 ms.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | P0 not reproduced; a mirror or door mismatch | a defect |
| F2 | P1 (c)–(e) missed | STOP to Architect/Design; no value tuned to pass |
| F3 | P2–P4 red | defect check; if real, NOT MET and the ADR re-opens; no deeper re-pin |
| F4 | P5 above bars | `ADR-0061` re-read before merge |
| F5 | P6 > 1.05 × or a run below depth 6 | STOP; one value-identical cost cut, one new reading |
| F6 | P8 NOT MET | not merged; E4 waits for E2's tuner |

## NFR triggers

- **`NFR-005`:** P7, every run ≥ 6. **`NFR-001` / `G2`:** P6 ≤ 1.05 ×.
- **`NFR-009`:** no new table expected; any growth stated by the ADR (≤ 16 MiB total, ≤ 1 MiB growth).
- **`NFR-008`:** P1 rows are units with no search; P0, P2–P4 behind deep flags; `N8-LANE` before and after.
- **Security:** none.

## Test notes

1. **QE freezes before the build** P1 (c)–(e)'s positions, each with FEN, phase and side to move, never changed to
   fit.
2. Deterministic mode holds (integer, mirror-exact).
3. **UAT is owed**; the QE verdict signs it.

## Size and priority

- **Size: M.** Three rules, an outside-the-memo computation, a switch and doors, re-pins.
- **Priority: P3.** Rank 2: rule-derived knowledge the tuner cannot create, pullable after E1; weaker instrument
  support than `ABC-270`.

## Dependencies

- **`ABC-269` merged** (E1's passer halves and table). Hard. *Met 2026-11-03: merged to local `main` at `54dee3f2` (`bapm-269-done`).*
- **The ADR** (the Architect's), after the owner's 2026-11-03 design order (`ABC-234`, `ABC-236`, `ABC-239`) unless
  the Orchestrator re-orders.
- **One at a time** with `ABC-270`, `ABC-272`, `ABC-239` on `src/evaluate.ts` / `src/evaluate-params.ts`.
- **E2:** not a wait. `ADR-0056` D2 lists E4 after E2; these three terms are rules, not fitted weights. The ADR may
  still order this after E2 if it shows a reason.
  *2026-11-03 (`bapm-E2pre-cut`):* `ADR-0067` (PROPOSED, § Consequences 5) gives that reason: king distance and free path become weights
  the tuner fits, while the rule of the square stays a rule. The recommended order (adopted on `EPIC-011`
  § Dependencies) is `ABC-269` → `ABC-274` → `ABC-239` → this ticket. The design may still keep the terms as rule
  values. That is the ADR's call.
- *2026-11-04 (`bapm-ABC-239-close`; Orchestrator `…4c76bf7a`; `arch-ABC-239-f3f4` `…69f22167`):* **the order flips:
  this ticket goes before a second `ABC-239` pull, not after the first.** The first pull closed NOT MET, and
  `main` keeps E1's table.
  - **Why:** `zugzwang.001`'s F4 miss needs this ticket's **free-path and king-distance terms**. Black's three
    h-passers there are frozen only because their paths are blocked and White's king covers g1 and g2, and no term on
    `main` reads either. The Architect measured the cause (`…4eae0fd3`, D1–D4). Whether a fit over E4a holds the row is
    `UNKNOWN - verify`.
  - **The second pull** is a new attempt under `ADR-0067` F6, with its own PREREG, on a `main` that contains this
    ticket. It needs the owner's word then on `ADR-0067` d6's amendment. It is not a wait of this ticket.
  - **Whether the terms ship as hand values judged on play, or land structure-only for the tuner (`ADR-0068`'s form),**
    is the ADR's call (the Orchestrator's brief `arch-ABC-271`).
  - **`ABC-280`** (the tuner landing alone, tools only) edits no file this ticket edits. If this ticket adds terms to
    `main` first, `ABC-280`'s identity gate may miss on them (its STOP). The tracer's extension to E4a belongs to the
    second pull.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ rank-only passers; the square; 8 of 25 persistent errors with a passer (weak, stated); estimate labelled |
| 2 | scope and out-of-scope | ✅ scope 1–5; E4b, E2 out |
| 3 | INVEST | ✅ M; one mechanism behind a switch |
| 4 | testable, measurable acceptance | ✅ P0 exact; P1 0 mismatches / exact / ≥ the stated value / strict monotone / present-only-when-empty; P2 0; P3 7 / 7; P4 ≥ 54 / 58; P5 ≤ 0.5 %, 0 ≥ 200 cp; P6 ≤ 1.05 ×; P7 ≥ 6; P8 ≥ 50.0 |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the ADR is owed (rules, values, P0 counts, intent check); ~~`ABC-269` not merged~~ *(merged 2026-11-03, `54dee3f2`)* |

**DoR 9/10. Backlog.**
