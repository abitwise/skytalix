---
kind: adr
id: ADR-0026
---
# ADR-0026: PVS and LMR arrive behind test-only off doors that keep every existing oracle byte-valid; LMR is judged by a bounded oracle, not identity

## Status

**accepted** 2026-09-25 by the owner (Olger Oeselg), **with the independent review's four
amendments**. Owner's word, verbatim: *"4. accept"* (recorded in
`20260925T234000Z-orchestrator-decision-6a63f2b7`). The review is
`20260925T145700Z-architect-design-decision-adr0026-accept-with-amendments-9a3f6e21`
(`.grugops/context/validate-adr0026/notes/`); its decision 5 is the one-door alternative.

- Written 2026-09-25 by Architect/Design at task `wave-2026-09-25`, subtask
  `ruling-abc121-lmr-oracle` (Workflow 07, a design ruling owed to `ABC-121`'s DoR before BA/PM
  re-scores it). Proposed at that hop.
- Amended 2026-09-25 at subtask `amend-adr0026`. The amended text is decision 6 (the predicate's
  contract), decision 9 (depth, both recursions, the mate floor, the oracle's scope), the `A4`
  consequence, and the one-door alternative. Each is marked *(amended 2026-09-25)*. Decisions
  1–5, 7, 8 and 10 and the Rollback are unchanged.
- BA/PM folds the amendments into `ABC-121` `A1` / `A3` / `A4`. This ADR does not edit the ticket.
- Amended 2026-09-26 at subtask `adr-amend-0026-0006`, on the owner's word (Olger Oeselg,
  2026-09-26, verbatim: *"3. accept"*, recorded in `20260926T201000Z-orchestrator-decision-52aaf5f3`).
  These are the clarifying amendments proposed in `ruling-abc121-g6`
  (`…0a3528d1`, `…ea306e58`, `…408249af`), applied as proposed. The amended text is decision 7
  (a row belongs to the decision its assertion matches; the `G6` knight pair is struck from its
  examples), a note in decision 9's mate-floor clause (the PVS figures), and the Consequences
  guard list (the drift and the mate floor overclaimed PVS window bugs). Each is marked
  *(amended 2026-09-26, `ruling-abc121-g6`)*. No other decision changes. The status stays
  **accepted**.
- Amended 2026-10-24 at subtask `arch-accept-owner-words-2026-10-24`, on the owner's word (Olger Oeselg,
  2026-10-24, verbatim: *"accept your recommendations, other session paused"*, recorded in
  `20261024T105800Z-orchestrator-decision-fb0468ff`; `OD-205-2`). This is the amendment proposed in
  § Proposed amendment 2026-10-24 (task `arch-rule-ABC-205-stop`), applied as proposed. The amended text is decision
  9's drift maximum, 75 → 118 cp in both recursions, marked *(amended 2026-10-24, `OD-205-2`)*. No other decision
  changes. The status stays **accepted**.

- It builds on `ADR-0024` decision 7 and `ADR-0025` decision 6 (the test-only door precedent and
  the ladder rule) and amends neither.
- No code changes because of this ADR. `ABC-121` builds against it once `ABC-122` lands.
- The probe and its raw output are in `.grugops/context/ruling-abc121-lmr-oracle/probe/`, and
  the readings are in that task's `notes/`. They are cited here, not restated in full.

## Context

Every search heuristic this project has shipped so far changes the WORK and not the VALUE:
alpha-beta (`ABC-077`), move ordering (`ABC-080`) and the transposition table (`ABC-081`). The
suite rests on that fact in two kinds of row:

- **Identity rows.** These compare a search with a test-only door, or the engine with `search()`,
  and demand the same score:
  - `ABC-077` `A1`: pruned vs unpruned (the only window-bug detector);
  - `ABC-079` `A4`: quiescence vs bare leaf, on quiet positions;
  - `ABC-080` `A1`: ordered vs unordered;
  - `ABC-081` `A1`: table vs `searchWithoutTable`;
  - `ABC-078` `A3`: `chooseMove`'s completed iteration vs `search()`, move and score, with an
    equal-score licence on the move.
- **Work rows.** These are node ratios and exact node pins between the same pairs:
  - `ABC-077` `A2`;
  - `ABC-079` `A5`;
  - `ABC-080` `A3`/`A4`;
  - `ABC-081` `A2`/`A3`/`A5`.

`ABC-121` adds principal-variation search (PVS) and late-move reductions (LMR). Measured at this
hop with a probe that reproduces `search()` to the node: 0 mismatches in 48 cells, and it
reproduces the shipped ratio figures exactly. The corpus is 190 positions: the six roots, every
position one move away, and six endgames.

- **PVS is value-preserving.**
  - 0 of 190 score divergences at depth 3 and at depth 4, on all three identity shapes: PVS vs
    `search()`, table on vs off, and deepening vs fixed depth.
  - All five of the suite's mate rows hold.
- **PVS breaks the work rows when it is on both sides.** It saves more on the weaker side of each
  pair, so it shrinks the denominators:
  - `ABC-080` `A3`: 47.5% vs its 40.5% bar (default lane), 6.59% / 4.19% vs its 4% bar (depth 4);
  - `ABC-081` `A3`: 77.3% / 77.0% vs its 70% bar.

  With PVS on neither side, those rows read their shipped figures, to the node.
- **LMR is not value-preserving, and its value depends on move order.** Whether a move gets
  reduced depends on its index in the ordered list, and the index depends on the hash move and
  the killers. With LMR on BOTH sides:
  - deepening vs fixed depth diverges on 5/190 (depth 4) and 6/190 (depth 5);
  - table on vs off diverges on 3/190 (depth 5).

  So `ABC-078` `A3` and `ABC-081` `A1` cannot hold as identities with LMR on.
- **LMR only acts from root depth 4.** The rule is remaining depth >= 3, and the root is never
  reduced.

## Decision

1. **Two switches, `pvs` and `reductions`, in BOTH recursions.**
   - Both switches are on in `search()` and `chooseMove`.
   - `reductions` implies `pvs`, because the reduced null-window search lives inside PVS's frame.
   - A null window is a cutoff, so the unpruned doors carry neither switch.
2. **Four TEST-ONLY doors, two per recursion.**
   - **`src/search.ts`:**
     - `searchWithoutReductions`: PVS on, LMR off.
     - `searchWithoutPvsOrReductions`: both off. This is the pre-`ABC-121` `search()`, node for
       node. The name follows `searchWithoutPruningOrQuiescence`.
   - **`src/engine.ts`:**
     - `chooseMoveWithoutReductions(position, options)`: PVS on, LMR off.
     - `chooseMoveWithoutPvsOrReductions(position, options)`: both off. This is the
       pre-`ABC-121` `chooseMove`.
     - Neither takes a depth, so `ABC-078` `A4`'s rule holds. Its export list grows by these two
       names.
   - `ABC-077` `A6`'s export list grows by the two `search.ts` doors and by decision 6's
     predicate.
   - Rejected: an `EngineOptions` field or an options parameter on `search()`, because either
     becomes an engine option in production (`ADR-0024` decision 7, coding rule 7). Also
     rejected: a module-level hook, because it is global mutable state.
3. **Every door that exists before `ABC-121` turns PVS and LMR off,** so each one reproduces its
   pre-`ABC-121` self node for node. This is `ADR-0025` decision 6's ladder rule: a door removes
   its rung and every rung above it, and PVS and LMR are the top two rungs.
4. **Every existing WORK reading re-points its shipped side to the pre-`ABC-121` door of the same
   recursion** (`searchWithoutPvsOrReductions` / `chooseMoveWithoutPvsOrReductions`).
   - A work reading is a node count, a node ratio, a hit rate, or any row that compares the
     shipped path with a door.
   - This includes the rows that switch the table off through `transposition.test.ts`'s `vi.mock`
     instrument (`deepenTo`, `hitRate`).
   - It is a mechanical rename. **Not one existing bar, ratio or node pin is re-levelled or
     re-pinned.** The probe reproduces them with PVS off on both sides. With PVS on both sides,
     three of them fail (Context).
5. **The two DRIFT DETECTORS take the `…WithoutReductions` pair instead,** so PVS sits under them.
   - **`ABC-077` `A1`** (pruned vs unpruned, the only window-bug detector, score only): its
     pruned side becomes `searchWithoutReductions`.
   - **`ABC-078` `A3`** (engine vs `search()`, move and score, equal-score licence, including the
     abort row's `search()` reference): it compares `chooseMoveWithoutReductions` with
     `searchWithoutReductions`.
   - PVS keeps both identities: 0/190 at depths 3 and 4, in the fixed and deepening shapes.
6. **The reduction rule is ONE exported pure predicate in `src/search.ts`, and both recursions
   route every reduction through it.** This has `orderMoves`'s shape: it decides and picks no
   move. The rule is the scope R5 measured:
   - reduce by one ply;
   - remaining depth >= 3;
   - index >= 3, 0-based in the ordered list, which is R5's "move >= 4";
   - the move neither captures nor promotes;
   - the side to move is not in check;
   - the move does not give check;
   - never at the root.

   The rule cannot drift between the recursions. It is tested as a pure function plus a source
   assertion that both recursions call it. No production counter or hook is added.

   *(amended 2026-09-25)* **The predicate's contract:**
   - **It returns the reduction in PLIES: 0 or 1.** Each recursion subtracts exactly the
     returned value from the remaining depth, never a literal. So "reduce by one ply" lives in
     one place, and the table test that pins "exactly 1" also pins what the recursions do.
   - **It classifies the move itself.** From the position and the move it is given, it derives
     every tactical fact it tests: capture, promotion, gives check, and side to move in check.
   - **The caller passes only three facts:** remaining depth, move index (0-based in the
     ordered list) and whether the node is the root.
   - *Why:* an LMR that reduces tactical moves, or reduces by 2, passes the drift bars at
     depths 4 and 5 (`…7c1d05ab`, variants `tactical` and `r2`). Only the predicate's table test
     can red those two bugs, and it can red a mis-wired tactical fact only if the recursion
     cannot supply that fact itself.
7. **VALUE and behaviour rows on the shipped path stay where they are, with PVS and LMR on.**
   - Examples: mate found, shorter mate preferred (the depth-5 and depth-7 mate rows already
     exercise LMR), stalemate and repetition exactly 0, legal root move, position unchanged, the
     ~~`G6` knight pair,~~ *(struck 2026-09-26, see below)* `QE-G2`/`QE-G3`, the quiescence
     hanging-piece count, and the engine's clock, abort and budget rows. They bind the engine the player gets.
   - Where one row asserts both a literal value and a door comparison, the literal half may stay
     on the shipped path. An example is `transposition.test.ts`'s depth-10 rook ending: the
     probe reads -29 992 under every configuration.
   - *(amended 2026-09-26, `ruling-abc121-g6`)* **A row belongs to the decision that matches its
     assertion, not its name.** A row that compares a search or the engine with a test-only door
     belongs to decision 4, or to decision 5 for the two drift detectors. That holds for identity,
     ratio, hit rate and node pin alike, and it holds even when the row also pins a value. Decision
     7 covers only assertions made on the shipped path alone. **The `G6` knight pair is struck from
     the examples above.** It is `ABC-081` `A1`'s table-on-vs-off identity, and at depth 4 LMR moves
     `knight-g1 w -` from 820 to 830, so it re-points under decision 4. `G6`'s guarantee does not
     rest on it. The table lives one search (`ADR-0025` decision 4), so the score pair reds no
     castling-key bug on any path. The guarantee rests on the key rows (`transposition.test.ts` "G6
     bites", `zobrist.test.ts`'s castling-rights rows), which no search switch reaches
     (`ruling-abc121-g6` `…0a3528d1`, `…ea306e58`).
8. **The identity chain covers what decision 4 moved off the shipped search.** The chain is:
   - `search()` ≈ `searchWithoutReductions`, bounded (decision 9);
   - `searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`, a score-identity row
     `ABC-121` adds at depth 4 on the corpus;
   - `searchWithoutPvsOrReductions` ≡ every old door and the unpruned search.

   Every link is a test.
9. **With LMR on, the oracle is bounded, never identity.** *(amended 2026-09-25)* Its clauses:
   - **Centipawn drift at depth 5, in BOTH recursions,** on the 190 corpus:
     - `search()` vs `searchWithoutReductions` at a fixed depth 5;
     - `chooseMove` vs `chooseMoveWithoutReductions`, each iterated to depth 5.
     - The bars are `ABC-121` `A1`'s: at least 95% of non-mate positions within 25 cp, none
       beyond 118 cp.
     - *(amended 2026-10-24, `OD-205-2`)* The maximum was 75 cp, `ABC-121`'s level. It became 118 cp
       (⌊1.5 × 79⌋, `ABC-205`'s reading) in both recursions. The 95% clause is unchanged.
     - *Why depth 5:* at depth 4 alone, an LMR with no re-search at all (`noResearch`) reads
       96.79% / 65 cp and stays green. Depth 5 reds it at 89.30% (`…7c1d05ab`).
   - **A one-extra-ply mate floor on the mate-rich corpus** (named below). For every position
     that `searchWithoutReductions` scores as a mate at depth d = 4, the shipped `search()`
     scores a mate of the same sign, no longer, at depth d + 1 = 5.
     - *Measured:* the correct rule flips 0 of 180 (d4→5) and 0 of 205 (d5→6). A 2-ply reduction
       (`r2`) flips 17 / 16, `gross` flips 19 / 24, and a PVS window bug flips 3 / 4.
     - *(amended 2026-09-26, `ruling-abc121-g6`)* Those PVS figures come from the review's probe,
       whose reference had no PVS. As decided, the floor's reference is `searchWithoutReductions`,
       which carries PVS (decision 5). A PVS window bug therefore breaks both sides of the floor,
       and the floor does not detect it (measured on `pvsNoResearch`: the floor over the 287 stays
       green).
     - *Why not the same depth:* a correct LMR loses 15–16 horizon mates at equal depth, and finds
       every one of them one ply later. That ply is what LMR buys, so a same-depth floor would
       fail the correct build.
   - **"0 mate-status flips on the 190 corpus" is a REPORT, not a bar.** That corpus holds 3
     mates, and the clause held for every wrong variant tried, `gross` included. The test prints
     the count and does not fail on it.
   - **Every mate row on the shipped search stays green,** and depth-in-budget holds (unchanged).
   - **Scope, said plainly: this bounded oracle is a regression net for gross drift and window
     bugs. It is NOT a proof that the reduction rule is correct.** Three of six deliberately
     wrong LMRs pass the drift bars at both depths (`tactical`, `r2`, `noLmrResearch`). The rule's
     correctness rests on decision 6's predicate table and on `ABC-121` `A4`'s re-search row
     (Consequences). Do not tighten the centipawn bars to chase rule bugs: correct and wrong
     builds overlap (the correct max is 50 cp at d4; wrong builds read 35–70 cp).

   **The mate-rich corpus is a checked-in fixture: `src/search.mate-corpus.ts`.** The Engineer
   owns it and builds it under `ABC-121`; this ADR only names it.
   - It is a test-only data module. It is not named `*.test.ts`, so vitest does not collect it.
     It sits under `src/`, so `tsconfig.json` and `biome.json` already typecheck and lint it.
     No production module imports it.
   - It holds the seven seed FENs: the five mate-row FENs already in the suite plus the ruling's
     KQK/KRK endgames. It also holds, as a frozen literal list, every in-progress position within
     two plies of those seeds, deduplicated on the first four FEN fields. The review's probe
     (`.grugops/context/validate-adr0026/probe/matecorpus.ts`) is the reference derivation. It
     read 287 positions.
   - Frozen, not generated at test time, so that a move-generator change cannot silently shrink
     the net. A pin on the list's length guards it.
   - Its lane is `UNKNOWN - verify`. The probe paid 11–19 s per depth pair under load, so it is
     deep-lane work unless the Engineer measures otherwise.

   The numbers are `ABC-121`'s criteria. BA/PM writes them from these readings.
10. **The next value-changing heuristic follows the same pattern.** That includes `C2` null move.
    It gets a switch, a pair of doors, and joins the "off in every older door" set, and it is
    judged by a bounded oracle. It cites this ADR rather than re-deriving it.

## Alternatives

- **PVS on in every pruned door, and re-point old rows to a PVS-on door only** (one door per
  recursion, not two). This was the first draft at this hop, and it is **rejected by
  measurement**. With PVS on both sides, `ABC-080` `A3` and `ABC-081` `A3` fail their bars:
  47.5% vs 40.5%, 6.59% vs 4%, 77.3% vs 70%. Keeping it would force a re-level of merged bars
  that measure something PVS is not.
- **Keep LMR out of `search()` and put it only in the engine.** Rejected. `ABC-078` `A3` would
  then compare two algorithms, and it breaks `ABC-080`'s ruling (`…f7e66060`, R1 point 3).
- **Relax the identity rows to a tolerance.** Rejected. It blinds `ABC-077` `A1`, the only
  window-bug detector, exactly when PVS adds windows.
- **Make the reduction independent of move order.** Rejected. The hash move and the killers
  still differ between a warm and a cold table.
- **Rely on "LMR cannot fire below depth 4" and compare `search()` at depth <= 3 instead of
  adding a door.** Rejected. Every row's meaning would hang silently on one threshold constant.
- **An options parameter on `search()` / `chooseMove`.** Rejected, as in `ADR-0024` decision 7.
  That reason is about options on the SHIPPED entry points, which would become an engine option
  in production. It does not cover a separate test-only door, so that case has its own entry
  below.
- *(amended 2026-09-25)* **One test-only door per recursion that takes an options record**, for
  example `searchWith(position, depth, { pvs, reductions })`. It has the same number of
  configurations as the four named doors and fewer names. **Rejected**, for three reasons:
  - It admits `{ pvs: false, reductions: true }`, which decision 1 declares invalid. Two named
    doors cannot express that state.
  - It breaks the pattern of named doors already in `src/search.ts`.
  - `ABC-077` `A6` and `ABC-078` `A4` pin export NAMES. An options record would move the door's
    configurations out of those lists and out of their reach.

## Consequences

- **Every existing bar, ratio, hit rate and node pin survives unchanged.** It is re-pointed at
  a door that IS the pre-`ABC-121` search or engine. The shipped search's own node counts are
  then pinned only by `ABC-121`'s new rows. A mutant in shared code (for example, dropping the
  hash move) is still caught, because the doors run the same recursion.
- **Three exports are added to `src/search.ts`** (two doors and the predicate) **and two to
  `src/engine.ts`** (two doors). All are test-only or pure. None has a production caller, and
  none picks a move without a caller-supplied depth or budget.
- **PVS alone is not a depth lever.** It gives 0 plies: 1 640 040 / 1 452 406 cumulative nodes to
  depth 7, against a 3 s capacity of about 0.85–0.89 M. Its value is inside LMR: position-6 to
  depth 7 costs 755 013 nodes with LMR and no PVS, and 467 461 with both.
- **LMR's effect on playing strength is BOUNDED, not proven neutral.** `ABC-084` is unbuilt. The
  drift row and the mate rows are the best oracle this codebase has today.
- *(amended 2026-09-25)* **`ABC-121` `A4`'s constructed fail-high must happen at a NULL-WINDOW
  node, where alpha + 1 = beta.**
  - At a PV node, PVS's own full-width re-search hides a missing LMR re-search whenever the score
    stays below beta. So an `A4` built at a PV node passes on a build with no LMR re-search.
  - `noLmrResearch` passes every drift bar at depths 4 and 5 and the mate floor (`…7c1d05ab`).
    `A4` at a null-window node is the only row that reds it.
  - So the reduction rule is guarded by the rows, not by the oracle:
    - decision 6's predicate table reds `tactical`, `early` and `r2`;
    - `A4` reds `noLmrResearch` and `noResearch`;
    - the depth-5 drift bars red `noResearch`, `early` and `gross`. They also redded
      `pvsNoResearch` in the build, but only incidentally: their reference carries PVS;
    - the one-extra-ply mate floor reds `r2` and `gross`;
    - PVS window bugs are red by construction on the rows that compare a PVS search with one that
      has none: `ABC-077` `A1` (default lane) and decision 8's `searchWithoutReductions` ≡
      `searchWithoutPvsOrReductions` link (its deep 190 row; the default guard is blind to
      `pvsNoResearch`) (`ruling-abc121-g6` `…408249af`).
    - *(amended 2026-09-26, `ruling-abc121-g6`: the three sub-bullets above replace two that read
      "the depth-5 drift bars red `noResearch`, `early`, `gross` and PVS window bugs;" and "the
      one-extra-ply mate floor reds `r2`, `gross` and PVS window bugs." Both overclaimed: the
      reference of each carries PVS.)*
  - Each wrong LMR the review planted is red in at least one row.
- **Some pruned trees get BIGGER under PVS.** Position-4 at depth 4 reads 9 054 nodes base,
  12 227 with PVS and 9 581 with PVS+LMR. Any "nodes fall" row is scoped to named positions,
  never "every position".

## Rollback

- **To drop LMR:** delete the `reductions` switch, the predicate and the two
  `…WithoutReductions` doors. Point decision 5's two drift detectors back at `search()` /
  `chooseMove`. No work row changes.
- **To drop PVS too:** revert `ABC-121`. Every old row then points at a door identical to
  `search()`, so the rename can be reverted or left.
- No stored data, format or dependency depends on this ADR.

## Proposed amendment 2026-10-24 (`ABC-205`, `OD-205-2`): the depth-5 drift maximum, 75 → 118 cp. ACCEPTED 2026-10-24 and applied

### Status

**ACCEPTED** 2026-10-24 by the owner (`OD-205-2`, `…fb0468ff`) and applied into decision 9 as proposed (task
`arch-accept-owner-words-2026-10-24`). The text below is kept as the amendment's record.

Was: **PROPOSED** 2026-10-24 by Architect/Design (task `arch-rule-ABC-205-stop`). **Acceptance is the owner's**
(`ADR-0028` decisions 4 and 5). The Orchestrator reports it with `OD-205-1`, through the `ADR-0031` addendum `A7`.
Until he accepts, decision 9 reads as written, and `ABC-205`'s two drift rows stay red.

### Context

- `ABC-205` (king safety scaled by the enemy queen, a tapered king square, and a shelter gate on the castled bonus)
  reads the depth-5 drift on the 190 at **96.79 % / 97.33 % within 25 cp, maximum 79 cp**, in both recursions.
  Base reads 97.33 % / 97.86 % with a 51 cp maximum. The maximum is position-6/e2d2 on both, and it moves 51 → 79 cp.
- Variants, maximum in both recursions: shelter gate alone 87 cp; blend alone 55 cp; queen scale alone 107 cp, on
  position-5/h1f1.
- History of the maximum: 45 cp at `ABC-121`'s build, 45 cp at `ABC-082`'s, 51 cp at `ABC-083`'s (and on base),
  79 cp now.
- Readings and the not-a-defect proofs: `ABC-205` § Addendum 2026-10-24 and
  `.grugops/context/arch-rule-ABC-205-stop/notes/`.

### Decision (as proposed; applied 2026-10-24)

1. **Decision 9's "none beyond 75 cp" becomes "none beyond 118 cp",** in both recursions. 118 is ⌊1.5 × 79⌋, which
   is `ADR-0039` decision 3's pattern.
2. **Nothing else in decision 9 moves.** That covers the ≥ 95 % within 25 cp clause, depth 5, the 190 corpus, the
   mate floor and the report-only mate flips.
3. **`ADR-0034` addendum decision 1's clean-lead bar follows,** because it is defined as this maximum. It reads
   118 cp for later L re-finds only. No retained puzzle row changes (that addendum's decision 2).

### Alternatives

- **Re-tune the gate or the scale until the maximum passes. Rejected.** Decision 9 says not to chase the bar with
  the build. Also, each term alone already reds it (87 and 107 cp).
- **Drop the maximum and keep the 95 % clause. Rejected.** On the build's `chooseMove`, the maximum still reds
  `early` at 198 cp, so it is not dead weight. A smaller change is enough.
- **A lower new maximum, such as 100 cp. Not proposed.** No reading separates 100 from 118. The 1.5x rule is the
  one the owner already uses (`ADR-0039`, `OD-205-1`).

### Consequences

- The maximum no longer separates `early` in the `search()` recursion: it reads 79 cp there, the same as the correct
  build. `early` stays red on the 95 % clause in both recursions (93.05 % / 91.44 %). Its `chooseMove` maximum is
  198 cp.
- The next value-changing evaluation term meets 118 cp. That level then carries its headroom, so a red is again a
  stop (`ADR-0028` decision 4).

### Rollback

Set the literal back to 75 and restore the two row titles. `ABC-205` then stops to BA/PM.
