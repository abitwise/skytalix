---
id: ABC-292
title: "E5: piece terms. A bishop pair bonus, rooks on open and semi-open files, outposts, and mobility weighted per piece type in place of one shared weight (a re-try of dropped ABC-207 by the tuner; rook activity was fenced out of EPIC-010); the new weights come from a tuning pull after the second"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation (an ADR-0031 change where mobility's form changes): the four terms' definitions, mobility per piece against ADR-0031 D2's attack-map form and MOBILITY_CAP, the form ((a) structure at 0 as ADR-0068 / ADR-0070; or (b) rule values on their own C2′), the G2 ratio, the free-set lines owed to ADR-0067 d6, the intent if (b), and whether the four land as one ticket or split. A new or changed ADR is the owner's to accept (reading (b))"
---

# ABC-292: bishop pair, rook files, outposts and mobility per piece (E5)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E5 ("not cut: weights from the tuner; id at E2's merge" is superseded by the ruling).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **Split rule:** if the ADR gives the four terms different forms or orders, BA/PM splits this page per term
>   (E5a…E5d) before Ready. One page now, because one structure-at-0 landing would carry all four.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every middlegame.
- **Pain, read on `main`** (`src/evaluate-params.ts`):
  - no bishop pair term, no open-file term ("open files are left to mobility"; only a rule of 20 on the seventh rank
    for the rook), no outposts;
  - mobility is one shared weight (`MOBILITY_WEIGHT` mg 4 / eg 4, `MOBILITY_CAP` 100) for every piece type.
- **History:** `ABC-207` (mobility per piece with hand weights) lost and was dropped (`EPIC-008`); `ADR-0056` D2 puts
  this row under the tuner for that reason.
- **Value:** `ADR-0056` D2 row E5 estimates **+30–80 Elo** (an estimate, [B] 7.4 / 8.0). Not a reading.

## Where the weights come from (under the tuner)

- **From the second pull: only the shared mobility weight** (mg / eg), already in the first pull's free set
  (`ADR-0067` d6), with `MOBILITY_CAP` fixed. Nothing else on this page.
- **The new weights (bishop pair, rook files, outposts, the per-piece mobility split) come from a later pull** (a
  third, no ticket yet) under `ADR-0067`, with its own PREREG (F6); each new export is owed to that pull's emitter change
  (`…6ccd8243` item 3).
- **Alternative, the Orchestrator's:** land the structure before the second pull's fit, named in its PREREG. Not
  recommended: it changes what the ruled single read judges.

## Scope

The ADR governs each line.

1. A bishop pair bonus, tapered.
2. A rook on an open file and on a semi-open file, tapered, beside the seventh-rank rule (kept or folded, the ADR's
   call).
3. Outposts (a knight or bishop on a square no enemy pawn can attack, defended by a pawn), tapered, by the ADR's
   definition.
4. Mobility weighted per piece type. Under form (a) the split must leave every value identical to `main` (for
   example, each per-piece weight equal to today's shared weight); the ADR states how.
5. Form (a) or (b); under (b) one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- An early-queen term (`ABC-207`'s other half), threats (`ABC-293`), king attack (`ABC-290`), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **Under form (a), structure at 0** (`ADR-0070` d5's shape): K0 node identity at `main`'s counts; K1 the mirror,
  `Object.is` value identity on frozen corpora, each term read through a seam at probed values by arithmetic; K2 only
  the re-pins the ADR lists; K3 `G2` at or below the ADR's ratio (precedent 1.05 ×); K4 `G6` ≥ base. `G3`'s relation
  rows stay green, `ABC-083` A4 (mobility within ± 100 cp) included. No games.
- **Under form (b), rule values:** the seam rows and the mirror; `ADR-0064` d7's safety rows (mate floor 0 violations,
  zugzwang 7 / 7 at recorded depths, `G1` no NEWLY-missed line); C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at
  E 1 810, the Levels deep lane; `G6` under `Q-3K-4` (b): every run ≥ 6, "≥ base" reported.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | K0 or K1 red (a) | a defect |
| F2 | K3 over the ratio | STOP to Architect/Design; one value-identical cost cut |
| F3 | a `G3` row or a safety row red | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET (b) | not merged |

## NFR triggers

- **`NFR-001` / `G2`:** K3; per-piece mobility and outposts cost per call. **`NFR-005`:** per form.
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures (or the (b) rows) before the build.
2. Form (a): UAT by the standing rule on the delivered diff; (b): owed, the QE verdict signs it.

## Size and priority

- **Size: M** (four terms; split per the rule above). **Priority: P2**, the second-largest evaluation estimate after
  E3.

## Dependencies

- **E2's second pull merged or closed. The ADR.** DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-271`, `ABC-272`, `ABC-290`, `ABC-291`,
  `ABC-293`, `ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the four absent terms, read on `main`; `ABC-207`'s loss; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–5 |
| 3 | INVEST | ✅ M, with a split rule named |
| 4 | testable, measurable acceptance | ✅ per form: K0 exact, `Object.is`, K3 ratio, `G3`, `G6`; or safety rows and C2′. Counts owed with the ADR |
| 5 | dependencies known | ✅ the second pull; the shared files; the emitter |
| 6 | NFR triggers with targets | ✅ `G2` ratio; `NFR-005` per form; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** (an `ADR-0031` change for mobility's form); after the second pull |

**DoR 9/10. Backlog.**
