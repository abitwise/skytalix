---
id: ABC-290
title: "E3b: king attack. Pieces attacking the enemy king's zone add a weighted, tapered term (a re-try of dropped ABC-205's term); its weights come from a tuning pull after the second, not from the second pull"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a new ADR on main's tapered evaluation: the zone, the attacker weights by piece, the count-to-score rule, the form ((a) structure at 0 as ADR-0068 / ADR-0070, values from a later pull judged in its read; or (b) rule values judged on their own C2′), the G2 ratio, the free-set lines owed to ADR-0067 d6 and the intent if (b). A new ADR is the owner's to accept (reading (b))"
---

# ABC-290: king attack, attackers on the king zone (E3b)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog** (task `bapm-epic011-areas`, records only, at `main` `b274711c`;
> nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011` Phase 4,
> stub row E3, the rest after E3a (`ABC-270`, merged).
> - **Hold:** after E2's second pull (the ruled Phase 4 order is `ABC-271` → the second pull, one read judging both;
>   `ADR-0056` D6's dated line of 2026-11-04). The ADR is owed.
> - **Re-open trigger:** the second pull merges or closes. Then the Architect designs on that `main`.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** the owner at level 5 and every game in which the kings are attacked with queens on.
- **Pain:** `main` scores king safety by shelter and open files only (`KING_SHELTER_MISSING`, `KING_FILE_HALF_OPEN`,
  `KING_FILE_OPEN`, and their queen-on pairs at 0 from `ABC-270`). Nothing counts the pieces bearing on the king.
- **History:** `ABC-205`'s king-safety term died on `G6` cost alone (`EPIC-008`). Under `Q-3K-4` (b) an evaluation
  ticket is judged on play with `NFR-005`'s floor, so that cause no longer gates it the same way (`ADR-0056` D2's dated
  line of 2026-11-03, row E3).
- **Supporting information, not a bar:** every tuner fit weights the king's square tables about 3–3.6 × (mg) and
  2.2–2.8 × (eg) above E1's rule tables (`ADR-0067` § Context).
- **Value:** `ADR-0056` D2 row E3 estimates **+40–100 Elo** for the whole row (E3a and E3b; an estimate, [B] 7.3 /
  7.4). Not a reading.

## Where the weights come from (under the tuner)

- **Not from the second pull.** Its free set is the first pull's plus `ABC-271`'s king distance and free path, eg only
  (`ADR-0067` d6, dated 2026-11-04). This term is not on `main` at that fit.
- **The second pull does fit the king terms already on `main`:** the three base exposure pairs (both halves), the
  three queen-on pairs (mg ≥ 0, eg 0) and the king PSTs.
- **This term's weights come from a later pull** (a third, no ticket yet) under `ADR-0067`, in force as the method for
  every later pull, with its own PREREG (F6). The `tools/tune` emitter writes 13 named exports today, so each new
  export is owed to that pull's tools change (`orch-2026-10-30a` `…6ccd8243` item 3).
- **Alternative, the Orchestrator's:** land this structure before the second pull's fit, and that PREREG names it. It
  would change what the ruled single read judges, so this page does not recommend it.

## Scope

The ADR governs each line.

1. For each side, the enemy pieces that attack squares of its king's zone are counted by piece type, and a stated rule
   turns the weighted count into a score, tapered by phase (mg / eg halves in `src/evaluate-params.ts`).
2. Form (a) or (b), as the front matter names; the two owner-accepted precedents (`ADR-0068`, `ADR-0070`) took (a).
3. Under (b) only: one switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Pawn storms, shelter rules (on `main`), tuning itself (`ADR-0067`), any search change.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **Under form (a), structure at 0** (`ADR-0070` d5's shape):
  - **K0:** node identity at `main`'s counts on the frozen positions the ADR names.
  - **K1:** the mirror; `Object.is` value identity on the frozen corpora; the structure read through a seam at probed
    values (attacker counts per piece, the zone) by arithmetic.
  - **K2:** only the re-pins the ADR lists.
  - **K3:** `G2` per call against base at or below the ADR's ratio (precedent 1.05 ×). **K4:** `G6` ≥ base.
  - No games; the later pull's read judges the values.
- **Under form (b), rule values:**
  - rule rows through the seam; the mirror; `ADR-0064` d7's safety rows (mate floor 0 violations, zugzwang 7 / 7 at
    recorded depths, `G1` no NEWLY-missed line);
  - QE's castled-corner rows S1–S3 (`TAPER_KP_SHELTER_STRESS`, frozen on `grugops/ABC-269` `d6a57653`) are on offer as
    graded rows at ≥ 20 cp (`ADR-0056` D2's dated line, row E3), the ADR's to take;
  - C2′ GAIN ≥ 50.0 or NEUTRAL ≥ 43.0 of 100 (intent named by the ADR), S′ at E 1 810, the Levels deep lane;
  - `G6` under `Q-3K-4` (b): every run at depth ≥ 6, depth 7 a WARN, "≥ base" reported.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | K0 or K1 red (a) | a defect: the build is not value-identical |
| F2 | K3 over the ratio | STOP to Architect/Design; one value-identical cost cut, as `ADR-0064` F3 |
| F3 | a safety row red (b) | a defect check first; if real, NOT MET |
| F4 | C2′ NOT MET (b) | not merged |

## NFR triggers

- **`NFR-001` / `G2`:** attacker counting costs per call. A lazy evaluation of costly terms is recorded as the cost cut
  to weigh (`EPIC-011` § Phases, "Not cut, recorded"; `ADR-0057` D8.7).
- **`NFR-005`:** per form, above. **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the K1 corpora and seam fixtures (or the (b) rows) before the build.
2. Form (a): UAT owed or waived by the standing rule on the delivered diff; (b): owed, the QE verdict signs it.

## Size and priority

- **Size: M.** **Priority: P2**, the largest evaluation estimate after E2.

## Dependencies

- **E2's second pull merged or closed** (it follows `ABC-271`). **The ADR.** DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-271`, `ABC-272`, `ABC-291`–`ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no attacker term; `ABC-205`'s cause stated; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3; storms, shelter, tuning out |
| 3 | INVEST | ✅ M; one term |
| 4 | testable, measurable acceptance | ✅ per form: K0 exact, `Object.is`, K3 ratio, `G6`; or safety rows and C2′ ≥ 50.0 / ≥ 43.0. Counts owed with the ADR |
| 5 | dependencies known | ✅ the second pull; the shared files; the emitter |
| 6 | NFR triggers with targets | ✅ `G2` ratio; `NFR-005` per form; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the ADR is owed** (form, zone, weights rule); after the second pull |

**DoR 9/10. Backlog.**
