---
id: 20261011T143751Z-qe-e2e-decision-abc083-seed5061-class-l-refind-route-b631991b
kind: decision
by: qe-e2e
at: 2026-10-11T14:37:51Z
verified_by:
confidence: high
refs:
  - ABC-083
  - ABC-084
  - ADR-0034
  - ADR-0028
  - ADR-0026
  - ADR-0031
  - ADR-0039
  - src/puzzle-corpus.ts
  - src/puzzle-suite.baseline.json
  - .grugops/context/qe-ABC-083-seed5061/notes/20261011T143751Z-qe-e2e-observation-abc083-seed5061-readings-lmr-near-tie-at-d5-67b0c99a.md
  - .grugops/context/design-abc083-r-reds-2026-10-11/notes/20261011T083630Z-architect-design-decision-abc083-routes-puzzle-deep-qe-n8-lane-secnfr-072c2994.md
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-stop-two-class-r-levels-and-puzzle-red-e3f81b07.md
  - .grugops/context/qe-ABC-083-seed5061/probe/scope.txt
supersedes:
---

# Seed 5061 is class **L** under `ADR-0034` decision 3. It is not a load artefact, not budget drift, and not an evaluator regression. A10 requires an Architect/Design-ruled re-find of the row, not a level move, not a fix, and not the owner's word

This note is hand-authored and unsealed. The class is QE's word (`ADR-0034` decision 3). Readings:
`…67b0c99a`.

## The class, read on the table

- **Scope (decision 2).** QE ran the instrument at `5ed308a8..67c189b9` (`probe/scope.txt`). It prints
  `src/evaluate.ts` only, so D and L are available. A correction to the task's wording: the scope command
  does not class a row. It only decides whether a drift class exists.
- **No other `PUZZLE_DEEP` row is red.** ABC-084 `A1`/`A2` and both ABC-127 oracle rows are green, so the
  red is not B as a whole.
- **D? No.** The row is not solved at any rung up to +25 %. It is not solved at +50 % either.
- **L? Yes.** It is a `win-material` row, still missed at +25 %, at d5, which is base's depth.
- **B? No.** It is not a mate-in-N row, and it reaches base's depth on every rung.

**Class L.** That agrees with the Engineer's reading.

## What the table's "read as" column gets wrong for this row, which Architect/Design needs

The L row reads: "the evaluation prefers another move, because the row's label carries an evaluator
margin". **For seed 5061 that premise is false, as measured.** The branch's evaluator, searched cleanly at
d4, d5 and d6 (every no-reduction, no-PVS, no-table and no-killer door), plays the label's `f5e6`. It leads
`g2e1` by 55 cp. The miss comes from the shipped LMR's d5 iteration in `chooseMove`. That iteration
over-scores `g2e1` by 60 cp and lands 5 cp above `f5e6`. This is within `ADR-0026` decision 9's accepted
bounded drift. The same flip exists on base, in fixed-depth `search()` at d5.

**So the answers to the task's question:**
- **Load or clock artefact? No.** The lines are byte-identical at load1 2.4–3.9 and thermal 0, three rounds
  per side, and they equal the build's lines taken under load.
- **Budget-edge drift (D)? No.** The row is still missed at +25 % and +50 % at base's depth.
- **Real evaluator regression? No.** The evaluator still ranks the label first at every depth read. What
  changed is that king safety's leaf values now put a 55 cp near-tie into LMR's accepted drift window at d5.
  King safety at 0.75x–1.5x does the same, so this is not a weight artefact.

## `ADR-0028` decision 1, the three proofs the L route needs before a re-find

1. **Identity and oracle rows green on the branch: MET.** The ABC-127 win-material oracle accepts exactly
   `f5e6`/`g1a7` for this row. ABC-084 `A1`/`A2` are green. The ABC-121 drift and mate floor
   (`SEARCH_DEEP` pvs-lmr 29/29) were read at `79248602`. No engine-loadable file changed between that
   commit and the tip (`probe/scope.txt`). Every `SEARCH_DEEP`/`ENGINE_DEEP` lane QE ran on the tip is
   green (`…6b2e2f3b`).
2. **Explained by mechanism, or unchanged by the weights: MET on both limbs.** The term's leaf values move
   a 55 cp near-tie inside LMR's bounded drift. The miss holds from 0.75x to 1.5x king-safety weight.
3. **The bar's own mutant still red after the move: OWED with the re-find.** In the re-find commit,
   `PUZZLE_DEEP=weakened` must still exit 1 and solve fewer than the baseline. On the tip it does
   (`…6b2e2f3b`).

## What A10's puzzle clause now requires

**Not "green as is", not a re-level, and not an Engineer fix.** The route is `ADR-0034` decision 4's for L:
1. **Architect/Design rules a re-find of seed 5061** (`ADR-0028` decision 2). No owner word is needed
   (`ADR-0028` decision 5). The count and total do not change, and the baseline file does not move.
2. **The re-found row keeps its class and tag** (`win-material`, `quiescence`, re-measured with `W1`/`W5`).
   It takes its answer from the oracle (`materialBest`). It is solved on base and on the branch, and it meets
   decision 5's 0.8x margin on base.
3. **It lands in its own commit.** That commit touches no trigger-list file and not
   `src/puzzle-suite.baseline.json`. `src/puzzle-corpus.ts` is not on the list.
4. **QE's recommendation for the re-find, since the confound here is an LMR near-tie and not a label
   margin.** The label move should lead the best non-accepted move, in a clean search at the solving depth
   (`searchWithoutReductions`, and `chooseMoveWithoutReductions`), by more than `ADR-0026` decision 9's
   75 cp ceiling. That should hold on base and on the branch, and the row should be solved by both
   `search()` and `chooseMove` at that depth. Seed 5061 leads by 55 cp on the branch, and base's fixed-depth
   `search()` already flips it. The ruling is Architect/Design's.
5. **Then QE re-reads:** `PUZZLE_DEEP=1` must read **54/58** (exit 0), with no other row changing
   solved state, and `PUZZLE_DEEP=weakened` must read exit 1 (proof 3).

**Not routes** (`ADR-0034` decision 6): no `ADR-0031` cut, no re-weight (the weight band above is a
diagnostic only), and no change to the baseline. `ADR-0039` decision 3's re-level stands. A puzzle red is
not a cut trigger.

## For Architect/Design, outside this ticket (INFO, not a gap of `ABC-083`)

`ABC-131`'s 0.8x margin rule measures readings only. It does not check whether the move is stable at the
solving depth across `search()` and `chooseMove`. Seed 5061 passed that rule on base while base's
fixed-depth `search()` already flipped it. Other retained rows may sit on the same kind of LMR near-tie.
Whether to screen them is Architect/Design's call. QE did not scan the corpus for this.
