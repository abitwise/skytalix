---
id: ABC-272
title: "E7a: won and drawish endings. A mop-up term drives the lone king to the edge in pawnless wins (KQK, KRK, KBNK), and a scale factor pulls drawish material toward 0 (the stronger side has no pawns and is less than a rook up; pure opposite-coloured bishops), each premise-gated, behind an ADR-0026 test-only off-door pair"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a premise probe first (pre-registered, below), then a new ADR on ABC-269's base if either premise holds (rules by ABC-215's provenance rule, the configurations, the door names, the firing figure at 100 ms and the intent). Its acceptance is the owner's (reading (b)). If neither premise holds, the ticket closes as dropped (premise not met), nothing built"
---

# ABC-272: won and drawish endings (E7a)

> **Cut 2026-11-03 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-cut`, records only, at `main` `17725732`; nothing
> run, built or timed). Source: the owner's *"Analyze and create tickets under EPIC-011"* and this task's gap analysis
> (`EPIC-011` top block of 2026-11-03). **Rank 3 of the uncut items. Premise-gated:** its support on the evidence is
> the weakest of the three evaluation cuts, so the probe below runs before any design is written.
> - **`EPIC-011` Phase 4, row E7, first slice.** Other endgame knowledge (rook-pawn and wrong-bishop draws, specific
>   rook endings) stays in the E7 stub.
> - **Intent: named by the ADR before Ready.** GAIN by default. "NEUTRAL (invisible at 100 ms)" only if the ADR's firing
>   figure shows the terms barely fire in a 100-game read at 100 ms, with its own measured bar (the conversion and
>   scaling rows below), under `ADR-0056` C2′'s 2026-11-02 line. Never re-classed after a score is seen.

## Problem

- **User:** the owner at level 5, in a won or drawn ending; and every self-play read that reaches one.
- **Pain:**
  - **No tablebases** (Syzygy deferred by the owner, `EPIC-010` Q1; `EPIC-011` § Out of scope) and **no mop-up term**:
    a pawnless win is converted only by what a depth-6 search (the 100 ms median) can see. Whether `skytalix` converts
    KQK, KRK and KBNK at 100 ms is **`UNKNOWN - verify`**; the probe below reads it.
  - **No scaling:** `src/evaluate.ts` scores material as if every edge wins. Only terminal insufficient material is a
    draw (`src/gameend.ts`, read at the leaf through `leafEndReason`). A rook against a minor with no pawns, or a pure
    opposite-coloured-bishop ending a pawn up, reads as a clear edge. Which configurations the leaf rule already covers
    is **`UNKNOWN - verify`**; the ADR lists them.
- **On the evaluation instrument** (information only): 3 of the 25 persistent errors on the 123 unique positions sit
  at phase ≤ 6, and none is a pawnless win. The corpus says little either way, so this ticket stands on its premise
  probe, not on the instrument.
- **Value:** E7's row is +10–30 Elo (`ADR-0056` D2, an estimate, [B] 6.1 and 8.0). Not a reading.

## The premise probe (pre-registered here; the Architect runs it before any design, host-locked, ≤ 15 min)

- **M-premise (mop-up).** QE freezes **12 pawnless won starts**: 4 KQK, 4 KRK, 4 KBNK, lone king near the centre, the
  stronger side to move. Base `main` (with `ABC-269` merged) plays both sides at **47 000 nodes a move** (the 100 ms
  node budget). **The mop-up half has a premise only if base mates within 50 moves in ≤ 10 of the 12.** At ≥ 11 of 12,
  the mop-up half is struck from scope with a dated line.
- **S-premise (scaling).** QE freezes **10 drawish positions**, each a known draw (5 pawnless: KRKB, KRKN, KBKN and
  two more the freeze names; 5 pure opposite-coloured-bishop endings with the stronger side one pawn up, Stockfish 19
  at depth 16 within ± 50 cp of 0). **The scaling half has a premise only if base's static `evaluate` reads ≥ 100 cp
  from the stronger side on ≥ 5 of the 10.** Below that, the scaling half is struck.
- **If both halves are struck, the ticket closes as dropped (premise not met).** Nothing is built and no read is spent.
- The counts are deterministic node-budget runs and static evaluations. No timing is read.

## Scope (for each half whose premise holds; the ADR governs each line)

1. **Mop-up:** with no pawns on the board and the stronger side's edge at least a rook (or B + N), a term in the lone
   king's distance from the centre (or, for KBNK, from the bishop's corner) and in the kings' distance, by a stated
   rule. It is 0 in every other configuration.
2. **Scaling:** a scale factor (< 1) on the blended score when the stronger side has no pawns and an edge below a rook,
   and when the minor pieces are one bishop each on opposite colours with no other pieces; the configurations and the
   factors are the ADR's stated rules. It is 1 everywhere else.
3. **One switch and a door pair** (`ADR-0026` d10's pattern); older doors turn it off. Rows by reference (`ADR-0064`
   d7's list); no zugzwang depth is re-pinned.

## Out of scope

- Tablebases (the owner's deferral stands). Rook-pawn and wrong-bishop draws, rook-ending knowledge (E7 stub).
- Any change to `src/gameend.ts`'s terminal rules (`ABC-024` / FIDE 5.2.2 subset). Tuning (E2).

## Acceptance criteria (rows for the halves in scope; the ADR fixes exact counts before Ready)

- **N0 (node identity with the design):** frozen-clock counts on kiwipete and position-6, exact; doors read `main`'s.
- **N1 (relations; default-lane units, no search):**
  - (a) **Mirror**, `Object.is`, over `G3`'s corpus plus both frozen sets: 0 mismatches.
  - (b) **Nothing changes outside the configurations:** over `G3`'s corpus, the 190 and the 123 unique instrument
    positions, `evaluate` equals `ABC-269`'s exactly on every position outside scope 1 and 2's configurations.
  - (c) **Scaling** (if in scope): on each of the 10 frozen drawish positions, |`evaluate`| is ≤ half of base's.
- **N2 (conversion; if mop-up is in scope; `ENGINE_DEEP=1`):** the build, both sides at 47 000 nodes a move, mates
  within 50 moves in **≥ 11 of the 12** frozen starts, and in no group (KQK, KRK, KBNK) fewer than base.
- **N3 (mate floor):** door d4 → head d5 and d5 → d5 on the 287, **0 violations**.
- **N4 (zugzwang, hard):** `ADR-0050` d9's seven rows, **7 / 7** (four are KPK rows: the scale must not touch them).
- **N5 (`G1`):** **≥ 54 / 58, no NEWLY-MISSED line.**
- **N6 (`G2`):** complete evaluation **≤ 1.05 ×** the base head's per call.
- **N7 (`G6`, `Q-3K-4` (b)):** every run ≥ depth 6 at `LEVELS[5]`; medians reported, not graded.
- **N8 (the read; `EPIC-011` § The per-change rule, by reference):** C2′ 100 games at 100 ms, **≥ 50.0** (GAIN) or,
  only if named before Ready, **≥ 43.0** with N1 (c) and N2 as its own measured bar; S′ at `--elo 1810` (or the E in
  force), S-4; the Levels deep lane exit 0; R-TC part 1 item 2 at review. A miss is NOT MET, not re-played.
- **Reports, not bars:** the firing count in the 100-game read (positions in a configuration), drift at d5.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F0 | both premises fail | closed as dropped, nothing built |
| F1 | N0 not reproduced; a mirror or door mismatch; N1 (b) changes a position outside the configurations | a defect |
| F2 | N1 (c) or N2 missed | STOP to Architect/Design; no value tuned to pass |
| F3 | N3–N5 red | defect check; if real, NOT MET; no deeper re-pin |
| F4 | N6 > 1.05 × or a run below depth 6 | STOP; one value-identical cost cut |
| F5 | N8 NOT MET | not merged |

## NFR triggers

- **`NFR-005`:** N7. **`NFR-001` / `G2`:** N6 ≤ 1.05 ×. **`NFR-009`:** no table expected.
- **`NFR-008`:** N1 units only in the default lane; N2 behind `ENGINE_DEEP=1` (a play-out, never in `npm test`).
- **Security:** none.

## Test notes

1. **QE freezes both premise sets before the probe** (FEN, side to move, the known result), never changed to fit.
2. The premise probe's outputs are the design's evidence; the ADR cites them.
3. **UAT is owed** if anything merges; the QE verdict signs it.

## Size and priority

- **Size: M** (both halves); S if one half is struck.
- **Priority: P3.** Rank 3: pullable after E1 without E2, falsifiable cheaply, but the instrument gives it little
  support.

## Dependencies

- **`ABC-269` merged** (the base the probe reads). Hard.
- **The premise probe, then the ADR** (the Architect's), after the owner's design order unless re-ordered.
- **One at a time** with `ABC-270`, `ABC-271`, `ABC-239` on `src/evaluate.ts` / `src/evaluate-params.ts`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no tablebases, no mop-up, no scaling; instrument support weak and said so; estimate labelled |
| 2 | scope and out-of-scope | ✅ two halves, each premise-gated; tablebases and gameend rules out |
| 3 | INVEST | ✅ M (S per half); each half alone is valuable and testable |
| 4 | testable, measurable acceptance | ✅ premise ≤ 10 / 12 and ≥ 5 / 10; N1 0 mismatches / exact outside / ≤ half; N2 ≥ 11 / 12; N3 0; N4 7 / 7; N5 ≥ 54 / 58; N6 ≤ 1.05 ×; N7 ≥ 6; N8 ≥ 50.0 or the named NEUTRAL |
| 5 | dependencies known | ✅ |
| 6 | NFR triggers with targets | ✅ |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ the premise probe and the ADR are owed; `ABC-269` not merged |

**DoR 9/10. Backlog.**
