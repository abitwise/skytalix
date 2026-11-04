---
id: ABC-294
title: "E7b: endgame knowledge beyond E7a. Rook-pawn and wrong-coloured-bishop draws and named rook-ending rules scale or correct the score, each premise-gated by a pre-registered probe, behind an ADR-0026 test-only off-door pair; after ABC-272's premise probe"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's): a premise probe first (pre-registered, ABC-272's shape: which configurations base misjudges at the 100 ms node budget), then a new ADR (or an extension of ABC-272's) if a premise holds: the configurations, the rules and factors (ABC-215's provenance rule), the door names, the firing figure at 100 ms and the intent. A new ADR is the owner's to accept (reading (b)). If no premise holds, the ticket closes as dropped"
---

# ABC-294: rook-pawn, wrong-bishop and rook-ending knowledge (E7b)

> **Cut 2026-11-04 by BA/PM: DoR 9/10, Backlog, PREMISE-GATED** (task `bapm-epic011-areas`, records only, at `main`
> `b274711c`; nothing run, built or timed). Source: the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`). `EPIC-011`
> Phase 4, stub row E7, the rest after E7a (`ABC-272`: "rook-pawn, wrong-bishop and rook-ending knowledge stay this
> stub").
> - **Hold:** after `ABC-272`'s premise probe (not yet run). E7a may build the scale seam this ticket would use; its
>   probe says whether it does.
> - **Re-open trigger:** `ABC-272`'s probe is read. Then the Architect pre-registers this page's probe on `main`.
> - **Order:** free relative to the tuner (`ADR-0067` § Consequences 6, written for E7a: a rule and a multiplicative
>   factor are neither fitted nor blocked by the tuner, and the tracer applies the factor). Whether E7b's terms are of
>   that kind is the ADR's (`UNKNOWN - verify`).
> - **The board move is the Orchestrator's.**

## Problem

- **User:** the owner in a drawn or won ending; every self-play read that reaches one.
- **Pain:** no tablebases (Syzygy deferred by the owner; `EPIC-011` § Out of scope). A king and rook pawn against a
  king in the corner, or a bishop of the wrong colour for the rook pawn's queening square, is a draw that material
  scores as a win. Rook endings have known rules (for example the defending king in front of the pawn) that a depth-6
  search may not see. Which of these base misjudges at 100 ms is **`UNKNOWN - verify`**; the probe reads it.
- **Value:** `ADR-0056` D2 row E7 estimates **+10–30 Elo** for the whole row (E7a and E7b; an estimate, [B] 6.1 /
  8.0). Not a reading.

## The premise probe (owed to the Architect; `ABC-272`'s shape)

- QE freezes the positions per configuration (rook-pawn KPK, wrong-bishop KBPK, the rook-ending rules the ADR names),
  each with a known result (Lichess tablebase or Stockfish 19 at depth 16, as `ABC-272` froze its sets).
- The probe reads base's static `evaluate` and its play at 47 000 nodes. A configuration has a premise only if base
  misjudges it on a share the Architect pre-registers. Counts and static evaluations only; no timing.
- **If no configuration holds a premise, this ticket closes as dropped.** Nothing is built.

## Scope (for each configuration whose premise holds; the ADR governs each line)

1. A scale factor or a correction for the configuration, by a stated rule.
2. If `ABC-272`'s scaling half merged, its seam is reused; if not, this ticket carries its own.
3. One switch and a test-only off-door pair (`ADR-0026` d10).

## Out of scope

- Tablebases (the owner's deferral stands). Mop-up and E7a's drawish material (`ABC-272`). `src/gameend.ts`'s terminal
  rules. Tuning.

## Acceptance criteria (rows for the configurations in scope; the ADR fixes exact counts before Ready)

- **N0 (identity):** switch off, node counts equal `main`'s exactly; every pre-ticket door reproduces its counts
  (`G4`).
- **N1 (nothing changes outside the configurations):** `Object.is` over `G3`'s corpus, the 190 and the frozen sets'
  non-matching positions: 0 mismatches. The mirror: 0 mismatches.
- **N2 (the configurations):** on the frozen sets, the head's score or play reaches the bar the probe pre-registers.
- **N3 (safety, `ADR-0064` d7's list):** mate floor 0 violations; zugzwang 7 / 7 at recorded depths; `G1` no
  NEWLY-missed line.
- **N4 (the read; `EPIC-011` § The per-change rule, by reference).** Intent named by the ADR before Ready; NEUTRAL
  (invisible at 100 ms) only with a firing figure and N2 as its measured bar. C2′ ≥ 50.0 (GAIN) or ≥ 43.0 (NEUTRAL) of
  100, S′ at E 1 810, the Levels deep lane.
- **N5:** `G6` under `Q-3K-4` (b): every run ≥ 6, "≥ base" reported.

### Falsifiers

| # | fires when | disposition |
|---|---|---|
| F1 | no premise holds | closed as dropped; nothing built |
| F2 | N0 or N1 red | a defect |
| F3 | N2 missed | NOT MET for that configuration |
| F4 | N3 red | a defect check first; if real, NOT MET |
| F5 | N4 NOT MET | not merged |

## NFR triggers

- **`NFR-001` / `G2`:** the configuration test costs per call; the ratio is the ADR's. **`NFR-005`:** N5.
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table.

## Test notes

1. QE freezes the probe sets before the probe, and never changes them to fit.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: M** (S per configuration). **Priority: P3.**

## Dependencies

- **`ABC-272`'s premise probe read.** **The probe and the ADR** (the Architect's). DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with the other evaluation tickets.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ known draws scored as wins; base's misjudgement `UNKNOWN - verify`, read by the probe; the value is an estimate |
| 2 | scope and out-of-scope | ✅ scope 1–3; tablebases, E7a, `gameend` out |
| 3 | INVEST | ✅ M, S per configuration |
| 4 | testable, measurable acceptance | ✅ N0 exact; N1 0 mismatches; N3 0 / 7 of 7; N4 ≥ 50.0 or ≥ 43.0. N2's bar owed with the probe |
| 5 | dependencies known | ✅ `ABC-272`'s probe; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` ratio; `NFR-005`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **premise-gated:** the probe and the ADR are owed |

**DoR 9/10. Backlog, premise-gated.**
