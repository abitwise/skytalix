---
id: 20260926T034300Z-architect-design-decision-pvsnoresearch-consequences-overclaim-no-row-added-408249af
kind: decision
by: architect-design
at: 2026-09-26T03:43:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-077
  - ADR-0026
  - .grugops/context/ruling-abc121-g6/probe/pvs-nr.mjs
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200100Z-software-engineer-observation-abc121-23-planted-variants-23-red-one-door-gap-closed-7f29f842.md
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T200300Z-software-engineer-claim-abc121-what-this-build-did-not-verify-82816ae6.md
  - .grugops/context/ticket-to-pr-ABC-121/probe/mutants-ledger.txt
supersedes:
---

# Ruling on `pvsNoResearch`: `ADR-0026` overclaims on two lines (the mate floor and the drift); the shipped rows already catch PVS window bugs; no row is added

Hand-authored, no `seal`.

## Measured at this hop (`probe/pvs-nr.mjs`)

- **Setup.** The mutant is `pvsNoResearch`, planted in both recursions with the build hop's exact
  edit: PVS's null-window fail-high is never re-searched.
- **Scope.** `SEARCH_DEEP=1` on `search.pvs-lmr.test.ts` + `search.test.ts`, filtered to the
  PVS-identity, mate-floor, drift and `A1` rows. That is 86 rows in 1 188 s at load 30–55.
- **What the run adds.** The build hop's deep run was `-t A1` on `search.pvs-lmr.test.ts` only, so
  it never ran the decision-8 row against this mutant. This run did.

| row | lane | result |
|---|---|---|
| decision-8 PVS identity, all 190 at depth 4 | deep | **RED** |
| decision-8 PVS identity, six endgames + position-3 at depth 4 (default guard) | default | green (blind) |
| mate floor, all 287, d4 → d5 | deep | green (blind; confirms `…7f29f842`) |
| drift d5, `search()` and `chooseMove` | deep | RED ×2 |
| `ABC-077` `A1` position-4 d2 / position-6 d2 | default / deep | RED / RED |

The build hop's ledger adds `A4` ×2, `ABC-078` `A3` abort ×2, `ABC-080` Scope ×2 and `ABC-081`
`A5`, all in the default lane.

## 1. Do the Consequences overclaim? Yes, on two lines

- **The mate floor.** Consequences says "the one-extra-ply mate floor reds `r2`, `gross` and PVS
  window bugs". Decision 9's "a PVS window bug flips 3 / 4" says the same thing.
  - Those numbers belong to the review's probe, whose reference had no PVS.
  - The design as decided (decision 5) puts PVS under the floor's reference,
    `searchWithoutReductions`, on purpose. So a PVS bug breaks both sides of the floor, and the
    floor is blind to PVS bugs by construction.
- **The drift.** "The depth-5 drift bars red … PVS window bugs" overclaims for the same reason:
  its reference also carries PVS.
  - It did red this variant, but only because the broken PVS frame interacts with the
    reductions. That is incidental, and a PVS bug that does not touch a reduced move would pass.
- **What catches PVS window bugs by construction.** These rows compare a PVS search with a
  search that has no PVS:
  - `ABC-077` `A1`: its unpruned side carries no PVS (decision 1). This is decision 5's intended
    window-bug detector.
  - Decision 8's link `searchWithoutReductions` ≡ `searchWithoutPvsOrReductions`: identical
    except for PVS, so it is the purest PVS detector. Only its deep 190 row has bite on this
    variant.

## 2. Does anything need adding? No

- The variant is red in the default lane on 8 rows. `ABC-077` `A1` position-4 d2 is one of them,
  and it is a by-construction detector.
- In the deep lane it is also red on two by-construction rows (`ABC-077` `A1` position-6 d2 and
  decision 8's 190).
- Each recursion alone is red in the default lane (`…7f29f842`: 4 rows each).
- **Rejected: widening decision 8's default guard to a position that bites (for example,
  position-4 at depth 4).** It would be a third default-lane catch of a bug two default rows
  already red. That is gold plate.
- **Rejected: giving the mate floor a PVS-free reference.** That breaks decision 5's layering,
  where the floor measures LMR and PVS sits under it. Decision 8 already separates PVS.

## 3. PROPOSED text for `ADR-0026` (the owner accepts; this note does not edit the ADR)

**In decision 9's mate-floor clause, after "*Measured:* … a PVS window bug flips 3 / 4.", add:**

> *(proposed 2026-09-26, `ruling-abc121-g6`)* Those PVS figures come from the review's probe,
> whose reference had no PVS. As decided, the floor's reference is `searchWithoutReductions`, which
> carries PVS (decision 5). A PVS window bug therefore breaks both sides of the floor, and the
> floor does not detect it (measured on `pvsNoResearch`: the floor over the 287 stays green).

**In Consequences, replace the last two sub-bullets of the "So the reduction rule is guarded by
the rows" list with:**

> - the depth-5 drift bars red `noResearch`, `early` and `gross`. They also redded
>   `pvsNoResearch` in the build, but only incidentally: their reference carries PVS;
> - the one-extra-ply mate floor reds `r2` and `gross`;
> - PVS window bugs are red by construction on the rows that compare a PVS search with one that
>   has none: `ABC-077` `A1` (default lane) and decision 8's `searchWithoutReductions` ≡
>   `searchWithoutPvsOrReductions` link (its deep 190 row; the default guard is blind to
>   `pvsNoResearch`) (`ruling-abc121-g6` `…408249af`).

## 4. What the Engineer must change: nothing

No row, no comment and no literal changes for this flag. The build is correct, and only the
ADR's prose was optimistic.
