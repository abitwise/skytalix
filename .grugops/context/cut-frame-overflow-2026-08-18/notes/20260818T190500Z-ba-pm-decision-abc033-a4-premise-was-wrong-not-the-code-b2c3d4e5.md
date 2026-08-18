---
id: 20260818T190500Z-ba-pm-decision-abc033-a4-premise-was-wrong-not-the-code-b2c3d4e5
kind: decision
by: ba-pm
at: 2026-08-18T19:05:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - ABC-107
  - EPIC-002
  - EPIC-003
  - src/move-input.ts
supersedes:
---

# `ABC-033` `A4` corrected: **a criterion whose PREMISE was wrong, not an implementation defect**

`A4` was written as an unconditional promise — *hidden count is exactly 0 for **any** `ambiguous`
outcome this ticket can produce* — and this ticket can produce an outcome for which it is not 0.
**7 knights attacking `d4` → `(+2 more)`, 8 → `(+3 more)`, 6 is the last size that fits.** I took
those numbers from QE's `G1` and the Orchestrator's independent reproduction and **did not re-derive
them and did not soften them.**

**The words the brief asked for, and I mean them literally.** The delivered module is on the correct
side of the line `A4` itself draws: it produced the full 7- and 8-candidate lists and handed them
over intact — **it truncated nothing and it widened nothing**. What failed is the premise the
criterion rested on: *"exactly six squares attack any given square by knight move"*, true of `d2` —
the square every `A4` knight fixture used — and false of a central square, where the count is eight.
**That is a bound generalised from the case in hand, which is the ordinary way a bound goes wrong,
and it is not fabrication.**

## What I did to the page

- **`A4` is NOT marked met and is NOT deleted.** It is annotated in place, with the falsification,
  the three FENs, the corrected `src/frame.ts` anchor (`:134-142`, not `:182-188`), and the
  re-scoped reading: **hidden count 0 for every ambiguity up to 6 candidates — which is every
  ambiguity a game reaches — and the 7+ case is `EPIC-002`'s, cut as `ABC-107`.**
- **The disposition is the criterion's own.** `A4` pre-assigned it in advance of being broken. That
  is why this took one hop and produced a ticket rather than an argument, and it is worth saying out
  loud that the criterion's *design* is what made its own falsification cheap.

## The DoR score does NOT move, and that is a judgement I am putting my name to

**`ABC-033` stays 10/10, 0 ⚠️.** Only item 4 is annotated, and only to say why it stayed ✅.

The Definition of Ready asks whether a criterion is **well formed** — testable and measurable. It
does not ask whether the criterion turns out to be **true**. `A4` named an instrument
(`assembleFrame`), a quantity (the hidden count), a threshold (**0**) and a disposition for failing
it. **It was measurable, it was measured, and it came back false. That is the DoR working, not the
DoR failing** — and the alternative reading, docking a page for having written a criterion sharp
enough to be broken, is exactly the incentive this project should not create.

**The failure this hop was really guarding against is different**: `A4` being quietly marked met
because six of seven criteria passed and the seventh is inconvenient. It is not marked met on the
ticket page, on the board row, or in `plans/traceability.md` — I checked all three.

## What I did NOT do

I did not touch `A1`–`A3` or `A5`–`A7`, I did not touch anything under `src/`, and I did not act on
QE's `G2`–`G6`. Those are elsewhere (see the sibling `observation`).
