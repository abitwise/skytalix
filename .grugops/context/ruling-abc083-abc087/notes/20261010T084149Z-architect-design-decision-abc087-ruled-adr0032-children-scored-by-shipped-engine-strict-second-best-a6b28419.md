---
id: 20261010T084149Z-architect-design-decision-abc087-ruled-adr0032-children-scored-by-shipped-engine-strict-second-best-a6b28419
kind: decision
by: architect-design
at: 2026-10-10T08:41:49Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ADR-0032
  - ADR-0027
  - ADR-0026
  - ADR-0024
  - ABC-078
  - NFR-004
  - NFR-005
  - memory-bank/50-decisions/ADR-0032-a-blunder-scores-every-root-move-with-the-shipped-engine-and-plays-the-strict-second-best.md
  - plans/tickets/ABC-087-difficulty-levels-as-budget-plus-blunder-rate.md
  - 20261010T084149Z-architect-design-observation-r1-r3-measured-mobility-forms-root-window-price-blunder-rules-748b4f7b
  - .grugops/context/rescore-batch-2026-10-10/notes/20261010T081343Z-ba-pm-decision-six-ticket-rescore-three-ready-four-rulings-owed-973fd389.md
supersedes:
---

# `ABC-087` R3 ruled in `ADR-0032` (proposed): **(a)**, scored by the SHIPPED engine on each child; the blunder plays the **strict second-best**; "worst" is the minimum class of that move's own list. Size stays `M`

This note is hand-authored. The evidence is `…748b4f7b`. The ADR is the authority.

## The three answers

1. **Construction: (a).**
   - Draw first. Not a blunder: `chooseMove`, as shipped.
   - A blunder: every legal root move is scored as minus the shipped `chooseMove`'s score on its child, on one
     clock and one shared deadline (`start + B(i+1)/N`).
   - `B` is the level budget clamped to `HARD_CEILING_MS` **by the level layer**, because the engine's clamp is
     per call and does not bound a sum.
   - `src/engine.ts` and `src/search.ts` do not change. The seed never reaches `chooseMove`.
2. **The pick: the strict second-best.** That is the best move scoring strictly below the best and strictly
   above the worst. Ties go to the first move scored. If no move qualifies, the best-class move is played and
   the decision records that there was no candidate. `n` is fixed, not a level field.
3. **"Worst" for `A4`:** every move whose score equals the minimum of the list the blunder used, when that
   minimum is below the maximum. It is asserted per blunder move, on the list the module returns with the move.

## Evidence in one line each

- **(b) is not +3.3–5.2%.** That figure is `ADR-0027`'s tie window. Exact scores for every root move cost
  **5.7–13.3x** the nodes on `kiwipete` and 5.9–12.4x on `position-6` (depths 3–5). The root lacks scores
  because of alpha-beta, not only PVS.
- **Uniform over non-worst moves loses a minor piece or more on 58% of picks** (corpus184). The strict
  second-best does so on 10.9%, with a median loss of 55 cp. Rank 2 ties the best on 16% of positions, which
  is why the second-best is strict.
- **(a) holds its budget:** 3,015 virtual ms against the main path's 3,005. Children reach 2–3 plies less than
  the main search.

## Size and Ready

**No re-size: `M`.** The page says `Ready` (10/10) under (a) once the answer is on the page. Item 10 is marked
with `ADR-0032`. **Not re-scored.** The verdict is BA/PM's.

## Owed elsewhere, not done here

- **BA/PM folds four things into the criteria** (`ADR-0032` Consequences):
  - `A4`'s denominator and its no-candidate report;
  - `A4` asserted per blunder move on its returned list;
  - `A2` covers a blunder move at the easiest level;
  - `A5` covers the blunder path if the hardest level's rate is above 0.
- **Security/NFR, optional:** the `NFR-004` catalog wording, now that the level layer owns the clamp on the total.
- **Owner:** accept `ADR-0032`, or not.
