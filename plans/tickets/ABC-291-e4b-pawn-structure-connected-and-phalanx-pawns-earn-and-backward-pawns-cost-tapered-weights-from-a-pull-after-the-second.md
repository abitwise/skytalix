---
id: ABC-291
title: "E4b: pawn structure. Connected and phalanx pawns earn a tapered bonus and backward pawns a tapered penalty; their weights come from a tuning pull after the second, not from the second pull"
status: backlog
column: Backlog
size: S–M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation: the definitions of connected, phalanx and backward, whether they sit in the pawn memo and its size, the form ((a) structure at 0 as ADR-0068 / ADR-0070; or (b) rule values on their own C2′), the G2 ratio, the free-set lines owed to ADR-0067 d6 and the intent if (b). A new ADR is the owner's to accept (reading (b))"
---

# ABC-291: connected, phalanx and backward pawns (E4b)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E4, the rest after E4a (`ABC-271`, Ready).
> - **Hold:** after E2's second pull (the ruled order `ABC-271` → the second pull). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game with pawns on the board.
- **Pain:** `main` scores pawns by material, PSTs, passed by rank, doubled and isolated (`src/evaluate-params.ts`).
  `src/evaluate.ts`'s header leaves backward pawns, chains and connected passers out. A defended pawn chain and a
  backward pawn on a half-open file read the same as loose pawns.
- **Value:** `ADR-0056` D2 row E4 estimates **+20–60 Elo** for the whole row (E4a and E4b; an estimate, [B] 7.3 /
  7.4). Not a reading.

## Where the weights come from (under the tuner)

- **Not from the second pull.** Its free set is the first pull's plus `ABC-271`'s king distance and free path, eg only
  (`ADR-0067` d6, dated 2026-11-04). These terms are not on `main` at that fit.
- **The second pull does fit the pawn terms already on `main`:** passed by rank, doubled and isolated (each mg / eg)
  and the pawn PSTs.
- **These weights come from a later pull** (a third, no ticket yet) under `ADR-0067`, with its own PREREG (F6); each
  new export is owed to that pull's emitter change (`…6ccd8243` item 3).
- **Alternative, the Orchestrator's:** land the structure before the second pull's fit, named in its PREREG. Not
  recommended: it changes what the ruled single read judges.

## Scope

The ADR governs each line.

1. Connected (defended by a friendly pawn) and phalanx (a friendly pawn beside on the same rank) pawns: a tapered bonus,
   by rank or flat, by the ADR's rule.
2. Backward pawns: a tapered penalty by the ADR's definition and rule.
3. Pawn-only features, so the ADR says whether they sit in the pawn memo (576 KiB after `ABC-271`, `ADR-0070` d2) and
   at what size.
4. Form (a) or (b); under (b) one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Passer terms (E4a, `ABC-271`), pawn storms, king shelter, tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **Under form (a), structure at 0** (`ADR-0070` d5's shape): K0 node identity at `main`'s counts; K1 the mirror,
  `Object.is` value identity on frozen corpora, and each definition read through a seam at probed values by
  arithmetic (one row per definition and one per edge file); K2 only the re-pins the ADR lists (the memo's byte size
  if it grows); K3 `G2` at or below the ADR's ratio (precedent 1.05 ×); K4 `G6` ≥ base. No games.
- **Under form (b), rule values:** the seam rows and the mirror; `ADR-0064` d7's safety rows (mate floor 0 violations,
  zugzwang 7 / 7 at recorded depths, `G1` no NEWLY-missed line); C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at
  E 1 810, the Levels deep lane; `G6` under `Q-3K-4` (b): every run ≥ 6, "≥ base" reported.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | K0 or K1 red (a) | a defect |
| F2 | K3 over the ratio | STOP to Architect/Design; one value-identical cost cut |
| F3 | a safety row red (b) | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET (b) | not merged |

## NFR triggers

- **`NFR-009`** (`G7`): any memo growth stated in bytes; ≤ 16 MiB in all, ≤ 1 MiB growth between a 1 s and a 4 s
  search.
- **`NFR-001` / `G2`:** K3. **`NFR-005`:** per form. **`NFR-008`** (≤ 10 s): units only.

## Test notes

1. QE freezes the seam fixtures (or the (b) rows) before the build.
2. Form (a): UAT by the standing rule on the delivered diff; (b): owed, the QE verdict signs it.

## Size and priority

- **Size: S–M.** **Priority: P3.**

## Dependencies

- **E2's second pull merged or closed. The ADR.** DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-271`, `ABC-272`, `ABC-290`,
  `ABC-292`–`ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no chain or backward terms; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ S–M; pawn-only terms |
| 4 | testable, measurable acceptance | ✅ per form: K0 exact, `Object.is`, K3 ratio, `G6`; or safety rows and C2′. Counts owed with the ADR |
| 5 | dependencies known | ✅ the second pull; the memo; the shared files |
| 6 | NFR triggers with targets | ✅ `NFR-009` ≤ 16 MiB; `G2` ratio; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S–M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed**; after the second pull |

**DoR 9/10. Backlog.**
