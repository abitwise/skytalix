---
id: 20261009T164755Z-architect-design-decision-ruling2-row17-legitimate-tree-move-a2-relevelled-to-10pct-owner-word-8c0fee21
kind: decision
by: architect-design
at: 2026-10-09T16:47:55Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-081
  - ADR-0024
  - ADR-0028
  - NFR-005
  - src/transposition.test.ts
  - 20260925T080616Z-architect-design-decision-r1-abc080-a3-bar-releveled-to-4pct-a4-at-depth5-f7e66060
  - 20261009T164755Z-architect-design-observation-scratch-checks-a1-replaced-a2-hit-rates-a4-discard-mutant-39129557
  - 20261009T163130Z-software-engineer-observation-abc082-stop-two-r-levels-red-on-deep-lanes-9bdc69b3
supersedes:
---

# Ruling 2: row 17 is a property this change legitimately moves, not a defect. `ABC-081` `A2` is re-levelled ≥ 15% → ≥ 10% by `ADR-0024` decision 3's headroom, ON THE OWNER'S WORD (he accepted `ABC-081` at 15%)

Hand-authored, no `seal`. `ADR-0028` decisions 1, 3 and 5.

## Not a defect: decision 1's three checks

1. **Identity and oracle rows that cover the table are green on the branch.**
   - `ABC-081` `A1` (scores identical with the table on and off) is in the default lane: 49 files,
     1504 tests green.
   - `ABC-081` `A3` reads 60.60% / 47.97%, against ≤ 70%.
   - The `ENGINE_DEEP` transposition lane is 26 / 26.
   - Evidence: the Engineer's gate (`…a0660741`).
2. **The reading follows the tree, not a fault.**
   - It does not change with the passed weights: 14.46% at 60, at 80, and with the passed term
     off (`r-rows-diagnosis.txt`).
   - Every A2 reading moved with the evaluator, in both directions in size: position-3 21.80% →
     16.22%, kiwipete 15.95% → 15.63%, position-6 15.38% → 14.46%.
   - The engine-shape readings did not move: 39.58% → 40.54%, 45.08% → 44.98%.
   - `evaluate` is pure (`A6`), and pawn structure is a function of the board, which the Zobrist
     key covers. So no table entry can go stale on this term.
3. **The bar's own mutant still reds at the new level.** A table that never hits is A2's stated
   target ("a memory leak with a lookup"). Interior stores removed from `search.ts`, it reads
   **0.00%** on all three rows (`…39129557`).

## The re-level

- **The level.** `ABC-081` `A2` becomes **hit rate ≥ 10%**. That is position-6's recorded figure
  at `ABC-081`'s merge, 15.38%, divided by 1.5 (`ADR-0024` decision 3, as ruling R1 `…f7e66060`
  applied it to `ABC-080` `A3`). It is computed from the merge figure, not from the red reading.
  Rounded down to a whole percent, the same direction R1 rounded.
- **Why the bar deserves this.** 15% was written before any build and met by 0.38 pp. Every
  evaluator change was going to be a coin flip on it, and QE named exactly that fragility at
  `ABC-081` (`qe-ABC-081` `…d4e6a1b7` item 3).
- **One criterion, one number.** The default-lane position-3 guard takes the same ≥ 10%. It is the
  same criterion, and it now reads 16.22%, 1.22 pp over the old bar.
- **Fixed-depth reading kept.** The fixed-depth reading on the pre-`ABC-121` door stays the measured
  quantity. Moving it to the iterative-deepening shape was rejected: it changes what is measured,
  and it is looser (`ADR-0028` Alternatives).

## Whose word

- **This is a code bar, not an `NFR-005` catalog level.** `plans/nfr-catalog.md` holds depth 6 /
  depth 7 only. `ABC-081` lists A2 as a contribution to `NFR-005`, not as one of its levels.
- **But the owner accepted `ABC-081` with this criterion at 15%** (board, 2026-09-25: "1. accept;
  2. yes merge to main"). `ABC-082`'s page also says no R row is re-levelled inside that ticket.
- **So the move needs the owner's word.** It is asked as one thing: accept `ADR-0028`.
  - Until he gives it, the Engineer may stage the edit on the unmerged branch, but `ABC-082`
    does not leave `In Review`.
  - If he declines, the hunk is reverted. `ABC-082` then stays Blocked, and the only route left
    is a change to the term's scope (BA/PM, then the owner).
- **No `NFR-005` level moves.** The kiwipete depth-7 WARN is not affected by this ruling and stays
  with Security/NFR, then the owner.
