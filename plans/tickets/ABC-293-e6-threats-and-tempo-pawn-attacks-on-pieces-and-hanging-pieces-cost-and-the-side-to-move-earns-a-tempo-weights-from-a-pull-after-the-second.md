---
id: ABC-293
title: "E6: threats and tempo. A piece attacked by an enemy pawn and a hanging piece (attacked and not defended) cost the side that owns it, and the side to move earns a tempo bonus, each tapered; their weights come from a tuning pull after the second"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation: the threat definitions, the tempo term and how it meets the null move and the mirror relation, the form ((a) structure at 0 as ADR-0068 / ADR-0070; or (b) rule values on their own C2′), the G2 ratio, the free-set lines owed to ADR-0067 d6 and the intent if (b). A new ADR is the owner's to accept (reading (b))"
---

# ABC-293: threats and tempo (E6)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E6 ("not cut: weights from the tuner; id at E2's merge" is superseded by the ruling).
> - **Hold:** after E2's second pull (`ADR-0056` D2: E6 depends on E2). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every game; tactics at the leaves.
- **Pain:** `main`'s static score does not see a piece attacked by a pawn or left hanging. Quiescence resolves captures
  (`ADR-0024`, `ADR-0069`), but at a quiet leaf the threat is scored as if absent. There is no tempo term.
- **Value:** `ADR-0056` D2 row E6 estimates **+20–50 Elo** (an estimate, [J], lowest confidence). Not a reading.

## Where the weights come from (under the tuner)

- **Not from the second pull.** None of these terms is on `main` at that fit (`ADR-0067` d6, dated 2026-11-04).
- **They come from a later pull** (a third, no ticket yet) under `ADR-0067`, with its own PREREG (F6); each new export
  is owed to that pull's emitter change (`…6ccd8243` item 3).
- **Alternative, the Orchestrator's:** land the structure before the second pull's fit, named in its PREREG. Not
  recommended: it changes what the ruled single read judges.

## Scope

The ADR governs each line.

1. A penalty per piece attacked by an enemy pawn, by piece type, tapered.
2. A penalty per hanging piece (attacked, not defended), by the ADR's definition, tapered.
3. A tempo bonus for the side to move, tapered.
4. Form (a) or (b); under (b) one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- SEE in the evaluation, king attack (`ABC-290`), piece terms (`ABC-292`), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **Under form (a), structure at 0** (`ADR-0070` d5's shape): K0 node identity at `main`'s counts; K1 the mirror,
  `Object.is` value identity on frozen corpora, each term read through a seam at probed values by arithmetic; K2 only
  the re-pins the ADR lists; K3 `G2` at or below the ADR's ratio (precedent 1.05 ×); K4 `G6` ≥ base. No games.
- **Under form (b), rule values:** the seam rows and the mirror; `ADR-0064` d7's safety rows (mate floor 0 violations,
  zugzwang 7 / 7 at recorded depths, `G1` no NEWLY-missed line); C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of 100, S′ at
  E 1 810, the Levels deep lane; `G6` under `Q-3K-4` (b): every run ≥ 6, "≥ base" reported.
- **Tempo, named open:** a side-to-move term changes the static score the null move compares with beta and how the
  mirror relation (`G3`, `ABC-083` A1, exact equality) is stated. Which relation rows it touches is `UNKNOWN - verify`;
  the ADR lists them before Ready.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | K0 or K1 red (a) | a defect |
| F2 | K3 over the ratio | STOP to Architect/Design; one value-identical cost cut |
| F3 | a `G3` row or a safety row red | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET (b) | not merged |

## NFR triggers

- **`NFR-001` / `G2`:** K3; attack and defence maps cost per call. **`NFR-005`:** per form.
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures (or the (b) rows) before the build.
2. Form (a): UAT by the standing rule on the delivered diff; (b): owed, the QE verdict signs it.

## Size and priority

- **Size: M.** **Priority: P3** (the lowest-confidence estimate).

## Dependencies

- **E2's second pull merged or closed. The ADR.** DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-271`, `ABC-272`, `ABC-290`–`ABC-292`,
  `ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ threats unseen at quiet leaves; no tempo; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–4 |
| 3 | INVEST | ✅ M |
| 4 | testable, measurable acceptance | ✅ per form: K0 exact, `Object.is`, K3 ratio, `G6`; or safety rows and C2′. The tempo relation rows owed with the ADR |
| 5 | dependencies known | ✅ the second pull; the shared files; the emitter |
| 6 | NFR triggers with targets | ✅ `G2` ratio; `NFR-005` per form; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed**; after the second pull |

**DoR 9/10. Backlog.**
