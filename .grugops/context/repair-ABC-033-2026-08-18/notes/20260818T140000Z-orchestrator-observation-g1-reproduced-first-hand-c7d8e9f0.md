---
id: 20260818T140000Z-orchestrator-observation-g1-reproduced-first-hand-c7d8e9f0
kind: observation
by: orchestrator
at: 2026-08-18T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-002
  - src/frame.ts
  - src/move-input.ts
supersedes:
---

# `G1` reproduced by the Orchestrator, independently, before anything was decided on it

QE reported `A4` falsified. I did not take the report — I ran it. Numbers below are mine, from a
throwaway probe in QE's worktree at `8c84265`, since deleted.

Three positions, `Nd4` submitted, candidate lists rendered through `assembleFrame` with the real
panels at whatever width they set (no width asserted — the criterion is the hidden count merged
code computes):

| knights on `d4` | FEN | candidates | message row 1 | message row 2 |
|---|---|---|---|---|
| 8 | `7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1` | 8 | `Nc2d4 Ne2d4 Nb3d4` | `Nf3d4 Nb5d4 `**`(+3 more)`** |
| 7 | `7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1` | 7 | `N2d4 Nb3d4 Nf3d4` | `Nb5d4 Nf5d4 `**`(+2 more)`** |
| 6 | `7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1` | 6 | `N2d4 N3d4 Nb5d4 Nfd4` | `Nc6d4 Ned4` — **hidden 0** |

Both overflow FENs round-trip byte-identically through `toFen`. **Seven is the threshold**, exactly
as QE reported, and QE's hidden counts (3 and 2) are exact.

## The engineer's stated reason is false, and it is false for a simple reason

`src/move-input.test.ts` carried *"exactly six squares attack any given square by knight move."*
That is true of `d2` — the square every `A4` knight fixture used — and false of a **central**
square: `d4` has **eight** knight-attackers. The fixture chose the square that made the bound hold.
This is not fabrication; it is a generalisation taken from the case in hand, which is the ordinary
way a bound goes wrong.

## What this does and does not condemn

**It does not condemn `src/move-input.ts`.** The module produced the full 7- and 8-candidate lists
and handed them over intact. It did not truncate and it did not widen the frame — which is exactly
the side of the line `ABC-033`'s own `A4` prose requires. The overflow is `assembleFrame`'s
documented packing behaviour (`withMarker`, `src/frame.ts:134-141`) meeting a list longer than the
2-row region can hold.

**What is falsified is the criterion's premise** — that no reachable ambiguity can overflow. `A4`
anticipated this exact outcome and pre-assigned it: *"a finding for `EPIC-002`'s frame owner and a
new ticket — not a silent truncation and not a widening of the frame."* That instruction is
followed, not reinterpreted.

## Reachability, stated honestly

Eight knights of one colour requires six promotions. It is legal, it round-trips, and this project
has shipped adversarial fixtures before (`FIVE_KNIGHTS_FEN`, `SIX_QUEENS_FEN` are the engineer's
own). **It is not a position that arises in ordinary play.** The severity is therefore about the
FRAME's contract, not about a player being misled tomorrow — and the six-queen case was already
passing with **one column of headroom**, which is the part that should worry the frame's owner.
