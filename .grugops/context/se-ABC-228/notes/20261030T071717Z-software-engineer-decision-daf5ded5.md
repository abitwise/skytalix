---
id: 20261030T071717Z-software-engineer-decision-daf5ded5
kind: decision
by: software-engineer
at: 2026-10-30T07:17:17Z
verified_by: 
confidence: high: built to ADR-0053 as accepted; every choice is pinned by a row; Q-SET not QE-frozen
refs:
  - se-ABC-228
  - ABC-228
  - EPIC-010
  - ADR-0053
  - grugops/ABC-228
  - 9bd3c519
  - 61d5d629
  - ADR-0024
  - ADR-0026
  - ADR-0050
  - ABC-081
  - ABC-080
  - ABC-079
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/transposition.ts
supersedes: 
seal: sha256:7260c4252e8beca81c4331982ac6471df68fd28b0ddee4fd7ed4b74f4a92f3fe
---

# Software Engineer decisions, se-ABC-228: how ADR-0053 decisions 2–4 and 6–9 were built

Built to `ADR-0053` (ACCEPTED 2026-10-30) at `grugops/ABC-228` `9bd3c519`, from `main` `61d5d629`. `A8` read ≤ 100 % on both boards, so Scope 5 (reading (ii)) is not built (see the `A8` observation note).

## The choices the ADR left to the SE
- **One loop, two move lists.** `quiesce` keeps a single search loop. In check below the cap it takes `legalMoves(position)`, returns `-(MATE_SCORE - (ply + qply))` when the list is empty, and starts `best` at `-Infinity` (no stand pat, no static bound). Otherwise it takes the pre-ticket path unchanged: stand pat, the cap, then `legalCaptures`. Both lists go through the same `orderCaptures` (the stable `mvvLvaKey` sort, `ADR-0024` decision 2), so capturing evasions lead by victim and quiet king moves lead the quiet ones. No helper function was added.
- **The test order** is `rules.evasions && qply < QUIESCENCE_MAX_PLY && isInCheck(position)`, at node entry after `visit`. So `isInCheck` is never called with the switch off (the door's work is base's), and never at the cap (decision 4: at the cap a node stands pat, in check or not).
- **The signature** is `quiesce(position, alpha, beta, qply, ply, rules, visit)`. `ply` and `rules` have no default. Every caller passes both, test callers included.
- **`MATE_SCORE`** is defined in `src/quiescence.ts`. `src/search.ts` imports it and re-exports it (`export { MATE_SCORE }`). `src/engine.ts`, `src/levels.ts` and `src/uci-session.ts` still import it from `src/search.ts`, unchanged.
- **The records:** each recursion holds two module constants, `EVASIONS_ON = { evasions: true }` and `EVASIONS_OFF = { evasions: false }`. The leaf picks one from its switch, so no record is built per leaf.
- **The doors:** `searchWithoutQuiescenceEvasions` turns `quiescenceEvasions` off and keeps everything else on, null move included. `chooseMoveWithoutQuiescenceEvasions` does the same and also keeps `priorKeys: true`, so it is the pre-`ABC-228` `chooseMove` node for node (`ABC-230` landed first). Every older door turns `quiescenceEvasions` off.

## Re-pins and re-points
None is in an accepted ADR's table.
- **Export lists:** `ABC-077` `A6` (`src/search.test.ts`) and `ABC-078` `A4` (`src/engine.test.ts`) grow by the doors.
- **`QE-208-c` door maps** grow by the two doors, each with `nullMove: true`. The sibling `quiescenceEvasions` literal row is in `src/quiescence.test.ts`.
- **`ADR-0053` decision 7, the shipped side re-pointed to the new doors** (`src/search.null-move.test.ts`): the d5 drift pair, the mate floor, and the two "changes the work" rows. Their bars are unchanged.
- **`ABC-081` `A5` "the fixture bites":** −485 → **−392**, as decision 7 and finding 6 say. The premise holds.
- **`ABC-080` tie row** (`src/search.ordering.test.ts`): `search()` now reads a4b3 at −224, and the evasion-off ordering door reads −221. The ordered side is re-pointed to `searchWithoutQuiescenceEvasions`, and the tie at −221 holds. `search()`'s move, a4b3, is still asserted, as is the engine row below it.
- **`ABC-079` `A2` "queen vs rook, nothing en prise"** (`src/quiescence.test.ts`): its board `4k3/8/8/8/8/8/8/Q3K2r w` had White IN CHECK (Rh1+), so the row's premise was false. Under evasions it reads −544, not the static 423. The rook moved one square to h2 (387 = static, 0 nodes). The old board became an `ABC-228` `A2` row: "an evasion that loses material to a follow-up capture". Reported, not routed silently.
- **Direct `quiesce` callers:**
  - The capacity oracles (`src/engine.capacity.test.ts`, `src/search.capacity.test.ts`) pass the shipped rules and `ply` = `KEY_ARRAY_CAPACITY`, as their leaf is scored.
  - `src/gameend.nfr.test.ts`'s "never builds the full move list" passes the pre-ticket record. It is a work reading, and in check the full list is the rule.

## Q-SET: not frozen by QE
`EPIC-010` § Common gates and `ABC-228` test note 1 ask QE to freeze `Q-SET` before the build. No such freeze was found in the shared context. So the SE wrote the 12 rows (Q1, Q2 and the kinds `ADR-0053` decision 9 lists) and checked each against a brute-force reference that lives in the test. **QE's freeze or review of those rows is owed.**
