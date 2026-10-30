---
id: 20261030T161118Z-software-engineer-decision-666b62b1
kind: decision
by: software-engineer
at: 2026-10-30T16:11:18Z
verified_by: 
confidence: high: built to ADR-0053 d5-d8 as accepted; every choice pinned by a row; Q-SET QE-frozen and held
refs:
  - se-ABC-229
  - ABC-229
  - EPIC-010
  - ADR-0053
  - grugops/ABC-229
  - f6ff1c4a
  - 01c37946
  - ADR-0024
  - ADR-0026
  - ABC-235
  - ABC-228
  - qe-ABC-229-qset/20261030T144215Z-qe-e2e-decision-fd9819a5
  - src/legal.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
supersedes: 
seal: sha256:bc96e826c68814436afb232ab940177f3c2fb62d48c8c6bc1981e53133d6b362
---

# Software Engineer decisions, se-ABC-229: how ADR-0053 decisions 5–8 were built

Built to `ADR-0053` (ACCEPTED 2026-10-30) d5–d8 at `grugops/ABC-229` `f6ff1c4a`, from `main` `01c37946`. Q-SET is QE-frozen (`qe-ABC-229-qset` `…fd9819a5`); every frozen value was placed unchanged and every one held on this build.

## The choices the ADR left to the SE
- **One generation pass, over `ABC-235`'s generator.** `legalCaptures` builds from `generateCaptures` (ABC-235 cut 3), not `generateMoves`, and `generateCaptures` emits no quiet promotion. So the new `legalCapturesAndQueenPromotions` (in `src/legal.ts`, beside `legalCaptures`, as d5 places it) makes the ONE `generateCaptures` call, legality-filters the captures exactly as `legalCaptures` does, then scans the eight squares one push from queening (rank 7 for white, rank 2 for black) for the mover's pawn with an empty square ahead, and appends a quiet queen promotion for each that passes the same make/test/unmake check. No second `generateMoves`/`legalMoves` call. `src/moves.ts` is untouched (not in the ADR's file list), so perft and `NFR-001` are untouched.
- **Order.** Captures in generation order, then quiet queen promotions by `from` ascending (the order `generateMoves` would emit them), then the one stable `orderCaptures` sort (`mvvLvaKey`, 899.9 for a quiet queen promotion; a tie keeps the capture first). Pinned by "is the legal captures, then the legal quiet queen promotions" against `legalMoves` filtered.
- **The one-pass spy row adapts d9's wording.** d9 says "`generateMoves` called once per quiescence node". Since `ABC-235` the capture pass is `generateCaptures`, so the row asserts, at a node one ply below the cap (its children stand pat without generating): `generateCaptures` ×1, `generateMoves` ×0, `legalMoves` ×0, `legalCaptures` ×0, `legalCapturesAndQueenPromotions` ×1. It lives in `src/gameend.nfr.test.ts`, the file that already mocks `./legal.ts` and `./moves.ts` (a `vi.mock` is file-scoped).
- **The records.** `QuiescenceRules` gains `quietPromotions`. Each recursion holds four module constants (`RULES_SHIPPED`, `RULES_NO_QUIET_PROMOTIONS`, `RULES_NO_EVASIONS`, `RULES_NEITHER`) and picks one by a nested ternary on its two switches, so no record is built per leaf. `RULES_NO_EVASIONS` is reached by no entry today; it keeps the map total.
- **The doors.** `searchWithoutQuietPromotions` and `chooseMoveWithoutQuietPromotions`: evasions on, everything else on (null move; the engine door keeps `priorKeys: true`). Every older door, `ABC-228`'s pair included, passes `quietPromotions: false` (d6 ladder).

## Re-pins and re-points (none in an accepted ADR's table)
- **The `ABC-228` rule row that expected 212** ("out of check the node still stands pat: Q3's free quiet promotion is not searched") now reads the pre-`ABC-229` record `{ evasions: true, quietPromotions: false }` (d7, the brief's instruction). It still reds evasions searched out of check.
- **`ABC-228`'s deep oracle rows** (A4 node ratio, the d5 drift pair, the mate floor) re-point their shipped side from `search()`/`chooseMove` to `ABC-229`'s doors, so they keep measuring evasions alone (d7).
- **`ABC-228`'s source row** now pins the four constant records and the two-switch pick; its switch-literal row now expects `quiescenceEvasions: true` on the shipped entry AND the `ABC-229` door. A sibling row pins `quietPromotions: true` on `search`/`chooseMove` only.
- **Export lists** `ABC-077` `A6` (`src/search.test.ts`) and `ABC-078` `A4` (`src/engine.test.ts`) and the `QE-208-c` door maps (`src/search.null-move.test.ts`) grow by the two doors (nullMove true on them).
- **Direct `quiesce` callers:** the capacity oracles pass the shipped record (both on); `src/gameend.nfr.test.ts`'s work reading passes both off.
- **The brute-force twin** (`bruteForce` in `src/quiescence.test.ts`) takes the rules record; with `quietPromotions` it adds the quiet queen promotions found by filtering `legalMoves` (an independent derivation, not the one-pass function). The `ABC-228` callers pass the shipped record; no `ABC-228` value moved (QE's 47-FEN read said only Q3 moves, and the default lane agrees).
