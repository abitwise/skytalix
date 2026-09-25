---
id: 20260925T145700Z-architect-design-decision-adr0026-accept-with-amendments-9a3f6e21
kind: decision
by: architect-design
at: 2026-09-25T14:57:00Z
verified_by:
confidence: high
refs:
  - ADR-0026
  - ADR-0024
  - ADR-0025
  - ABC-121
  - ABC-077
  - ABC-078
  - ABC-080
  - ABC-081
  - ABC-084
  - memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
  - 20260925T145500Z-architect-design-observation-probe-reproduced-every-number-plus-pvs-identity-d5-4e2b9c70
  - 20260925T145600Z-architect-design-observation-bounded-oracle-misses-three-of-six-wrong-lmrs-7c1d05ab
supersedes:
---

# Verdict: `ADR-0026` — ACCEPT WITH AMENDMENTS. The doors are right. The LMR oracle, as written, is not

Hand-authored, no `seal`. This is an independent review; I did not write `ADR-0026`. Its status
stays **proposed**, and only the owner accepts it. `ADR-0026` itself is not edited. The amendment
text is below for the owner, or for the ADR's author, to fold in.

## The LMR drift, for the owner, in plain words

- **What LMR does.** Late-move reductions search the late, quiet moves in each node one ply
  shallower. They re-search at full depth only when the shallow look says the move might be best.
  So a move whose worth appears only at full depth can be under-searched, and the score at a
  fixed depth moves.
- **How far it moves, on 187 non-mate positions:**
  - identical at depth 4 in 93.05% of positions, and at depth 5 in 95.72%;
  - within 25 cp in 98.40% (d4) and 99.47% (d5);
  - worst single drift 50 cp (d4, the start position, 0 → +50) and 45 cp (d5).
  - In every worst case I looked at but one, LMR reads the side to move BETTER off. The reason is
    that the opponent's late quiet replies, including the refutations, are the ones reduced.
    This is read from the worst-5 lists only, not from a signed statistic over the corpus.
- **It depends on move order.** The same position can read differently when searched cold and
  when deepened warm: 5 of 190 differ at d4 and 6 of 190 at d5. That is why no identity row
  survives LMR.
- **It loses horizon mates.** At the same depth, a correct LMR misses 15 of 205 mates that PVS
  sees (d5), because the mating line's quiet moves are the ones reduced. **Every one of them is
  found one ply deeper.** LMR pays for that ply: the depth-7 node margin is 1.68x / 1.83x.
- **In short:** a small, optimistic, order-dependent wobble in the evaluation, plus a one-ply
  delay on some mates. Both are paid back by the depth it buys.

## Design challenge: are two test-only doors per recursion the simplest honest shape? Yes

- **`…WithoutPvsOrReductions` is required by measurement.** With PVS on both sides, `ABC-080`
  `A3` and `ABC-081` `A3` fail their merged bars. I reproduced this to the node (`…4e2b9c70`).
- **`…WithoutReductions` is required** because it is the only exact (identity) detector PVS gets:
  - `ABC-077` `A1` in `search.ts`;
  - `ABC-078` `A3` across the engine's copied recursion.
  - Without it, PVS in the engine copy would be judged only by bounded drift. The blatant PVS bug
    I planted (`pvsNoResearch`) is caught by the drift bars too (45.99% within 25 cp at d5), but
    only because it is blatant. The identity row costs one name, and it is exact.
- **"One door with an options record"** (`searchWith(position, depth, { pvs, reductions })`) has
  the same number of configurations and fewer names. But:
  - it admits `{ pvs: false, reductions: true }`, which decision 1 declares invalid;
  - it breaks the file's six-named-door pattern;
  - the `A6` / `A4` export-list assertions pin names, not options.
  
  Named doors make the illegal state unrepresentable, and that is the leaner design. **Rejected.**
  The ADR's own reason for rejecting options (it "becomes an engine option in production")
  applies to options on `search()` / `chooseMove`, not to a separate test-only door. The
  Alternatives amendment below corrects the reason.

## Does the bounded oracle catch a broken LMR? Mostly no, and the ADR should say so

- **The oracle does not catch these.** Of six wrong LMRs, three stay GREEN at both d4 and d5:
  - reducing captures, checks and in-check nodes;
  - reducing by 2 plies;
  - dropping the reduced-move re-search.
- **The corpus mate-flip floor fires on no variant, the grossest included.** The 190 corpus
  holds 3 mates.
- **The same-depth floor is unattainable.** On a corpus rich in mates, the CORRECT rule flips
  16 / 15 mates at the same depth, so "0 flips, hard" cannot be kept by making the corpus
  meaningful.
- **What the evidence supports is defence in depth, where each wrong LMR is red somewhere:**
  - `A3`'s predicate table: `tactical`, `early`, and `r2` once amendment 2 holds;
  - `A4` at a null-window node: `noLmrResearch`, `noResearch`;
  - the drift bars at d5: `noResearch`, `early`, `gross`, PVS-window bugs;
  - a one-ply-slack mate floor on a mate-rich corpus: `r2`, `gross`, PVS-window bugs. Correct
    reads 0 of 180 and 0 of 205.

## Proposed amendment text (for `ADR-0026`; the owner or the ADR's author folds it in)

> **Amend decision 6 (the predicate), append:** The predicate returns the reduction in PLIES (0
> or 1), and each recursion subtracts exactly its return value — never a literal. The predicate
> derives every tactical fact it tests (capture, promotion, gives check, side to move in check)
> from the position and move it is given; the caller supplies only remaining depth, move index
> and whether the node is the root. *(Measured: an LMR that reduces tactical moves, or reduces by
> 2, passes the bounded drift bars at depths 4 and 5; only the predicate's table test can red a
> mis-wired tactical fact, and only if the recursion cannot supply that fact itself.)*
>
> **Amend decision 9 (the oracle), replace the mate floor and add depth and scope:**
> - The drift bars (≥ 95% of non-mate positions within 25 cp, none > 75 cp) run at depth **5**,
>   in both recursions: `search()` vs `searchWithoutReductions`, and `chooseMove` vs
>   `chooseMoveWithoutReductions` iterated to the same depth. *(Depth 4 alone misses an LMR with
>   no re-search at all: 96.79% / 65 cp, green; depth 5 reds it at 89.30%.)*
> - The mate floor is **one ply of slack on a mate-rich corpus**: every position
>   `searchWithoutReductions` scores as a mate at depth d, the shipped search scores as a mate of
>   the same sign, no longer, at depth d + 1. The corpus is the in-progress positions within two
>   plies of the mating-endgame FENs already in the suite (≈ 287 positions, 180–205 of them mate).
>   *(Measured: the correct rule 0 of 180 / 0 of 205; a 2-ply reduction 17 / 16; a PVS window
>   bug 3 / 4. A same-depth floor is NOT used: a correct LMR loses 15–16 horizon mates at equal
>   depth, found one ply later.)* The "0 mate flips on the 190 corpus" clause is kept as a report,
>   not a bar — it held for every wrong variant tried.
> - The bounded oracle is a **regression net for gross drift and window bugs, not a correctness
>   oracle for the reduction rule.** The rule's correctness rests on decision 6's predicate table
>   and on `A4`'s re-search row. Do not tighten the centipawn bars to chase rule bugs: correct
>   and wrong builds overlap (correct max 50 cp at d4; wrong 35–70 cp).
>
> **Amend `ABC-121` `A4`'s test note (via decision 9's consequence):** the constructed fail-high
> must occur at a **null-window** node, where alpha + 1 = beta. At a PV node PVS's own full-width
> re-search masks a missing LMR re-search whenever the score stays below beta.
>
> **Amend Alternatives, "An options parameter":** add "…or a single test-only door taking a
> `{ pvs, reductions }` record — rejected because it admits `reductions` without `pvs`, which
> decision 1 declares invalid, where two named doors cannot express it."

## What does not change

- Decisions 1–5, 7, 8 and 10 stand as written, and the Rollback stands.
- `ABC-121`'s build waits on `ABC-122` exactly as sequenced.
- `ABC-121` `A1`'s wording already names `chooseMove`. The ADR's decision 9 does not, and
  the decision 9 amendment aligns the two.
- BA/PM re-words `A1` / `A3` / `A4` from this text if the owner accepts the amendments. That is
  not this hop's job.
