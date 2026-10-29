---
id: 20261029T212006Z-architect-design-decision-374a0ef4
kind: decision
by: architect-design
at: 2026-10-29T21:20:06Z
verified_by: 
confidence: high on the rules and the doors; medium on the drift bars (search() side only measured); the G6 forecast is medium
refs:
  - arch-ABC-228-adr
  - ABC-228
  - ABC-229
  - EPIC-010
  - ADR-0053
  - ADR-0024
  - ADR-0026
  - ADR-0050
  - ADR-0051
  - ABC-079
  - ABC-210
  - ABC-235
  - NFR-005
  - NFR-004
  - NFR-008
  - sa-ideas-verify/20261029T200022Z-system-analyst-observation-306a4012
  - qe-epic008-close/20261029T063012Z-qe-e2e-observation-ffb593fe
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - .grugops/context/arch-ABC-228-adr/raw/
  - main 95f7369e (src = 38536a34)
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 
seal: sha256:46d395cbacca00523a00480c08190049289a28c1125cec78d8b102a57436b609
---

# ADR-0053 PROPOSED: evasions in check and quiet queen promotions in quiescence, each behind its own door pair; owner call, with OQ-228-1 on G6

File: `memory-bank/50-decisions/ADR-0053-in-check-quiescence-searches-every-evasion-and-scores-none-as-mate-and-quiet-queen-promotions-join-the-capture-list-each-behind-an-off-door-pair.md`.
Status **PROPOSED**. Readings: the sibling observation note.

## The rules
- **Amendment:** `ADR-0024` d4 loses "checks in quiescence" (evasions from check only) and "quiet promotions" (to a
  queen only). Quiet checks, quiet under-promotions, delta pruning, SEE and stalemate stay out.
- **Evasions (`ABC-228`):** at `qply < QUIESCENCE_MAX_PLY` and in check, no stand pat. Search every legal move
  (`legalMoves`, unfiltered), stable `mvvLvaKey` sort, fail-soft. With no legal move, return `−(MATE_SCORE − (ply + qply))`.
  `quiesce` gains `ply`. `MATE_SCORE` is defined in `src/quiescence.ts` and re-exported by `src/search.ts`.
- **Bound:** the cap of 8 only; an evasion ply counts. At the cap, stand pat in check or not. No separate check cap.
- **Promotions (`ABC-229`):** out of check, legal quiet queen promotions from the same generation pass as the captures,
  appended after them, then the one `mvvLvaKey` sort. Quiet under-promotions are out. Capturing under-promotions are
  unchanged. In check, all of them are searched under the evasion rule.
- **Doors:** switches `quiescenceEvasions` and `quietPromotions`. Doors `searchWithoutQuiescenceEvasions` /
  `chooseMoveWithoutQuiescenceEvasions` and `searchWithoutQuietPromotions` / `chooseMoveWithoutQuietPromotions`. Ladder:
  evasions above null move, promotions above evasions. `quiesce` takes a `QuiescenceRules` record and `ply`, both
  explicit. `ADR-0050`'s null-move comparison rows re-point to the new door.
- **Cost bar:** `ABC-228` `A4` ≤ 1.5× at depth 6 (reference 1.368× / 1.405×). `ABC-229` `A3` ≤ 1.2× (reference 1.019× /
  1.000×). A new `G6` forecast runs on `ABC-228`'s own base before the graded `G6` and the smokes. Head's frozen-clock
  nodes to base's depth, × 1.09, must be ≤ base's 3 s node count, or the SE stops and reports.
- **Oracle:** `ABC-228` d5 drift in both recursions, ≥ 83 % within 25 cp and none beyond 177 cp. Mate floor on the 287 at
  d5. `ABC-229` d5 drift ≥ 95 % within 25 cp, none beyond 12 cp.
- **Re-pin:** `ABC-081` `A5` depth 3, −485 → −392, under `ADR-0026` d7. It is the SE's.

## Not ABC-210
At quiescence ply 0, the rule is `ABC-210`'s horizon tree again: same cost (1.054× / 1.013×) and same worst drift
position. The new part is in-check nodes at ply ≥ 1, reached through a capture. They carry 83–93 % of the evasion nodes
and nearly all the cost.

## Proof the SE owes
`ADR-0053` decision 9: `A1` door identity (`G4`); in-check rows (≥ 6) against a brute-force reference; capture-mate rows
(≥ 6) with sign and distance and one non-mate guard row; rule rows (out-of-check stand pat, no stand pat in check,
stalemate stands pat, the cap, mate through the table, a source row); `A4`; the `G6` forecast; promotion rows (≥ 6); the
one-pass spy; `ABC-229` `A3`; the gates `G1`, `G4`, `G5`, `G6` per `OQ-228-1`, `G8`, `G9`, `G10`, the smokes S-1 to S-4,
and `G11` reported.

## Who accepts
**The owner, not the Orchestrator.** The standing ruling (`…5aaf7cec` item 3) keeps with him any new ADR that changes
or reverses an accepted one. `ADR-0024` is owner-accepted, and this strikes two items of its d4. Architecturally it is
small: one function and two switches. The rule's letter decides. Bundle it with `OQ-228-1` as one report. The build
may proceed behind the doors; the smokes and the merge wait.

## OQ-228-1 (owner)
On today's `main`, position-6 is forecast at depth 9 against base's 10 at 3 s, so `G6` "≥ base" (graded, `…2ae5fc12`)
would be NOT MET. `ABC-235` may lift it; the forecast re-reads it first. If it still misses, there are three answers:
- **(a) recommended:** `G6` grades floor 6 and reports "≥ base" for `ABC-228`/`229`, and `M4` reads them the same way;
- **(b):** build the mate-test-only form (1.000×; meets `A3`, not `A2`);
- **(c):** build and let `G6` close it.

## STOP
None for the build. The smokes and the merge wait on the owner's acceptance and on `OQ-228-1`.
