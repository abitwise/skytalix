# arch-ABC-291 items 1, 2, 4 and 5: `ADR-0075` PROPOSED. E4b's definitions, rule and values are fixed at `b99d10a0` before any row or game is read. Memo 640 KiB, `G2` ≤ 1.03 ×, intent GAIN, the probe written and not run

Architect/Design, task `arch-ABC-291`, records only, on `grugops/arch-ABC-291` from `main` `148fd329`. No test, build, engine or probe ran: A4 holds the host. The text of record is `ADR-0075` at `b99d10a0`.

## What is decided
- **Definitions (d1).** Connected: a friendly pawn on a diagonal behind it. Phalanx: a friendly pawn beside it, R ≥ 2. Backward: not isolated, no friendly neighbour on its rank or behind it, and its stop square holds or is attacked by an enemy pawn. Backward excludes the other two, isolated and passed, by arithmetic.
- **The rule (d2).** `PAWN_BACKWARD` = `ISOLATED`. `PAWN_CONNECTED`[R] = `PASSED`[R] × `ISOLATED` / `PASSED`[4], flooring, R = 2 … 6. `PAWN_PHALANX` = half of it, because a phalanx pair earns twice and a chain pair once.
- **The values.** Connected 2, 5, 10, 17, 28 and phalanx 1, 2, 5, 8, 14 at R = 2 … 6, backward 10. **mg = eg:** the rule's ratio cancels, so "tapered" on the page reads "a pair that enters the blend", and the blend changes nothing at today's table.
- **The one judgment in the rule** is the anchor, R = 4, the first rank of the enemy half.
- **Memo (d3).** All three sit in it, as one new packed part, kept out of `pawnStructure`'s return value so the off door reads the same memo. 2^14 × 40 bytes = 655 360 bytes, 640 KiB, + 65 536.
- **Switch and doors (d4).** `pawnShape`, `searchWithoutPawnShape`, `chooseMoveWithoutPawnShape`, `evaluateAtPhaseWithoutPawnShape`, the seam `pawnShapeForTest`.
- **`G2` (d5): ≤ 1.03 ×.** The nearest recorded bar, and the edge of the instrument's void window. Blind spot, stated: `G2` reads the hit path, so the miss path is reported and C2′ prices it. F2's cut: merge `doubled` and `isolated` into one memo word.
- **Intent (d6): GAIN.**
- **Bars (d7, K0–K7) and the fault rule's table (d8).** No bar is new. d8 fills the block's third column for this ticket.
- **What a pass means (d9):** "not seen worse", not "proven better". A term worth nothing passes 50 % of the time.
- **Probe (d10).** Rows PR1–PR11, sealed before any measured run. Safe, cheap, fires. **It cannot change a definition, rule, value, memo form, ratio, intent, bar or the order.** It can set K0 (c), K2's list, the forecasts, and whether the ticket is built. No margin and no per-part read of `zugzwang.001`.

## Blindness
`zugzwang.001` played no part. I read what `ADR-0070` and the wait's notes say of it. I did not open its FEN or work any term through it. d2's inputs are `PASSED` and `ISOLATED`.

## Readings of mine, each open to overruling
- Equal halves answer the page's "tapered". No record gives a rule for a different endgame half.
- No subset fallback in the probe: dropping a term after a safety read is choosing with the row in hand.
- PR9 below 5.0 % stops an own read. The intent stays GAIN and no value is raised. The page has no such stop, so this is new at the probe, not a bar on the build.
- K5's run below depth 6 goes to F2, in `ADR-0070`'s form. The page's F2 names `G2` only.

## The owner's question, as `ADR-0075` puts it
Do you accept ADR-0075? Three pawn ideas, with numbers from a fixed rule, nothing tested. A yes locks the numbers before any test sees them. A short host check follows, then 100 games after `ABC-303` and `ABC-289`. If it loses, it is dropped with no second try on new numbers. **Recommended: yes.**
