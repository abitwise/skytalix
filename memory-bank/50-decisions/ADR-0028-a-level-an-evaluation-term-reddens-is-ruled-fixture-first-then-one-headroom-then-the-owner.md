---
kind: adr
id: ADR-0028
---
# ADR-0028: A code-bar level that a value-changing evaluation term reddens is ruled fixture first, then one 1.5x headroom, and a level the owner accepted moves only on his word

## Status

**proposed** 2026-10-09 by Architect/Design. Acceptance is the owner's.

- Written at task `wave-2026-09-25`, subtask `ruling-abc082-levels` (Workflow 04, stop condition
  → design ruling). It rules the two class-R rows `ABC-082` reddened on the `SEARCH_DEEP` lanes
  (build `grugops/ABC-082-pawn-structure` @ `bef7d43`, Engineer notes `…9bdc69b3`, `…7040acad`).
- It extends `ADR-0024` decision 3's 1.5x headroom (accepted 2026-09-19) beyond `ABC-079` `A5`, as
  ruling `…f7e66060` (R1) already did for `ABC-080` `A3` before that ticket was built. It amends
  no accepted ADR. `ADR-0026` decision 10 is untouched: this ADR covers evaluation terms, which
  `ADR-0026` does not reach (`ABC-082` Out of scope; that reading is upheld).
- **No production code changes because of this ADR.** One test literal set changes (decision 3).
- Probes and raw readings: `.grugops/context/ruling-abc082-levels/probe/`. Readings and rulings:
  that task's `notes/`. Cited here, not restated.

## Context

`ABC-082` is the first value-changing evaluation term on a search whose tests pin values. Its page
split the merged rows into P (exact pins: re-pin), F (fixtures: re-find if the property is lost)
and R (levels: nobody re-levels; red = stop). Two R rows went red, both on opt-in deep lanes:

- **`ABC-079` `A1` deep** (`src/quiescence.test.ts`): 2/24 losing captures at depth 3 against a
  level of 1. Both are one pair, "R takes a pawn a bishop defends" and its mirror.
- **`ABC-081` `A2` deep** (`src/transposition.test.ts`): position-6 fixed-depth-5 hit rate 14.46%
  against ≥ 15%. Base 15.38%. The bar was written before any build and met by 0.38 pp.

Re-weighting does not clear either one (Engineer's sensitivity, `r-rows-diagnosis.txt`). The two
reds are different in kind, and the next evaluation ticket (`ABC-083`) will meet both kinds again.
So the rule is written once, here, rather than ruled again per ticket.

What the probes found (notes `…d25a0383`, `…39129557`):

1. **Row 21's label was never a property of quiescence at depth 3.** Rxb2 Bxb2 leaves K+B v K,
   which `gameStatus` scores as an exact 0 (insufficient material). At depth 3 the search sees the
   whole exchange. So the row asks "is a forced dead draw worse than what else White has?". At
   base the answer was yes by **50 cp**, the thinnest margin in the corpus. A 7th-rank passer
   bonus of any size measured (60, 80, 100) turns it to −40. The engine is not missing the
   recapture. It sees it, and with its own evaluation it prefers the draw.
2. **Row 17 moves with the tree, and the property it guards is intact.** Every A2 reading moved
   with the evaluator. position-3 default guard 21.80% → 16.22%, kiwipete 15.95% → 15.63%,
   position-6 15.38% → 14.46%. The engine-shape readings barely moved (39.58% → 40.54%, 45.08% →
   44.98%). `ABC-081` `A1` (scores identical with the table on and off) stays green. The mutant
   A2 exists to catch, a table that never hits, reads **0.00%** on all three rows.

## Decision

1. **Not-a-defect first.** Before any fixture or level moves, the ruling shows three things:
   - the identity and oracle rows that cover the reddened code are green on the branch;
   - the red reading is explained by the term's mechanism, or does not change with the weights;
   - the bar's own mutant is still red after the move.
   If any of the three fails, the red is a defect and the build is fixed instead.
2. **A row whose LABEL depends on an evaluator margin is a fixture, not a level.**
   - It is re-found: same theme, confound removed, measured on base and branch.
   - The level stays byte-identical.
   - Applied by ruling 1 to `ABC-079` `A1`'s "R takes a pawn a bishop defends" pair (note
     `…f0115510`). One black pawn is added on g7, and a white pawn on g2 in the mirror. The
     recapture then lands in K+B+P v K, which is a real loss and not a dead draw. The margin is
     370 cp on base and 280 cp on the branch.
3. **A level set without measured headroom gets `ADR-0024` decision 3's headroom ONCE.**
   - The new level is computed from the figure recorded when the bar merged, never from the red
     reading: recorded ÷ 1.5 for a floor, × 1.5 for a ceiling.
   - Applied by ruling 2 to `ABC-081` `A2`: ≥ 15% becomes **≥ 10%** on all three of its rows
     (15.38 / 1.5 = 10.25, position-6, the lower of the criterion's two positions). See note
     `…8c0fee21`.
   - The position-3 default guard takes the same number. It is the same criterion, and it now
     reads 16.22%.
4. **No second automatic headroom.** If a level that already carries this headroom (from
   `ADR-0024`, R1 or decision 3 here) goes red again on a value change, that is a stop. Either
   Architect/Design rules a defect, or the owner re-levels it by his word.
5. **Whose word.**
   - A level in the criteria of a ticket the owner accepted moves only on his word. Accepting this
     ADR is that word for `ABC-081` `A2`, which he accepted on 2026-09-25 ("1. accept").
   - A fixture re-found under decision 2 needs no owner word. No level moves, and `ABC-082`'s
     F-class rule already licenses it.
   - `plans/nfr-catalog.md` levels (`NFR-005` and the rest) never move under this ADR. They stay
     with Security/NFR and the owner's word.
6. **Scope.** This ADR covers value-changing evaluation terms: `ABC-082` now, `ABC-083` next.
   Value-changing search heuristics stay under `ADR-0026` decision 10.

## Alternatives

- **Tune the weights until both rows pass. Rejected.** It is forbidden by the page, and it also
  does not work. Passed-pawn bonuses of 60, 80 and 100 all read 2/24 and 14.46%. Only removing a
  scoped term clears either row.
- **An evaluator off-door, so the old rows keep running on the pre-`ABC-082` evaluator.
  Rejected.** `ABC-082`'s page fences it out. It would put a test-only switch into `evaluate`, the
  hottest function in the engine. It would also freeze the rows on an evaluator nobody ships.
- **Rule row 21 "label holds" and change the build. Rejected.** The only change that clears it is
  a blockade or "passer stopped on its queening square" refinement. That is a fourth pawn term,
  which the page fences out (coding rule 5). The engine's choice is consistent with its own
  evaluation, and it is not a horizon error, which is the thing `A1` exists to catch.
- **Drop the red pair and keep 22 rows. Rejected.** `floor(22/20)` is still 1, but the corpus loses
  its only bishop-defends-a-pawn theme. Re-finding it is cheaper than explaining the gap later.
- **Keep A2 at 15% but read it in the engine's iterative-deepening shape (40–45%). Rejected.** That
  changes what is measured, not just the bar. A 15% floor under a 40–45% reading would let the
  table lose two thirds of its hits without a red, so it is looser than ≥ 10% fixed.
- **Per-row A2 levels (14.5% / 10.6% / 10.25%). Rejected.** Three numbers for one criterion. The
  one mutant A2 names reads 0.00% on every row, so splitting catches nothing extra.
- **Keep A2 at 15% and keep `ABC-082` blocked. Rejected.** Every evaluation ticket would hit a bar
  that had 0.38 pp of margin at its own merge, and the first red would carry no information.

## Consequences

- `ABC-082` can meet `A8` once the owner accepts this ADR and BA/PM folds the A2 carve-out
  (decision note `…33e5e0a3`). Until then the A2 literal edit sits on an unmerged branch.
- A table that silently loses about a third of its fixed-depth hits now passes A2. That is
  accepted. `ABC-081` `A3` (≤ 70% nodes in the engine's shape) is the bar that sees a table that
  stops paying, and it reads 60.60% / 47.97% on the branch.
- `ABC-079` `A1` keeps 24 rows and its level. Four other pairs also recapture into a dead draw.
  They hold by 390–655 cp on the branch. They are named, not changed: decision 2 handles them if
  `ABC-083` thins them.
- `NFR-005`'s kiwipete depth-7 WARN is unchanged by anything here. It remains with Security/NFR
  and then the owner.

## Rollback

- Ruling 2: set the three A2 literals back to `0.15` and restore the describe text. `ABC-082`
  then stays Blocked on A2. The only remaining route is a scope change to the term, which is
  BA/PM's and the owner's.
- Ruling 1: restore the two FENs. `ABC-082` then stays Blocked on row 21.
- Nothing in production depends on this ADR.
