---
id: 20261026T030739Z-software-engineer-decision-e0666f5b
kind: decision
by: software-engineer
at: 2026-10-26T03:07:39Z
verified_by: 
confidence: high: built to ADR-0050 (PROPOSED) and the page's ruling; pins matched to the ruling's table; ADR status is the owner's
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0020
  - ADR-0034
  - NFR-004
  - NFR-005
  - NFR-008
  - G1
  - G6
  - A1
  - A2
  - A3
  - A4
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - bapm-amend-ABC-208/20261026T023835Z-ba-pm-decision-e8505f19
  - grugops/ABC-208
  - 2e7899fc
  - afb6b32f
supersedes: 
seal: sha256:b0bb8555435967e382dd7b6f44ec92e11f2281fcdd51463ca99c959d1c346697
---

# Software Engineer: ABC-208 built to the ruling (ADR-0050, PROPOSED). Null move at null-window nodes, R = 3, no verification, guarded below three non-pawn pieces; doors searchWithoutNullMove / chooseMoveWithoutNullMove; 2 export lists grown, 12 ABC-121 rows re-pointed, no value pin, relation, level or bound moved

Task `ticket-to-pr-ABC-208`, branch `grugops/ABC-208` from `main` `2e7899fc`, code commit `afb6b32f`. Built to the page's
`## Design ruling`, its dated amendment lines and `ADR-0050` (Architect `…012b1053` / `…bae20026`; BA/PM `…e8505f19`). ADR-0050's
status is not touched; it stays PROPOSED.

## What was built (the four Scope files)
- `src/search.ts`: the pure exported predicate `nullMoveReduction(position, depth, ply, afterNull)` → 3 or 0 (0 at ply 0,
  after a null, depth < 2, in check, or < 3 knights/bishops/rooks/queens for the side to move; check and material are
  derived inside). Switch `nullMove`, on in `search()` only. In `negamax`, after the table probe and before move
  generation: `if (switches.nullMove && alpha + 1 === beta)`, null child at `depth - 1 - nullReduction` with
  `(0 - beta, 0 - beta + 1)` and `afterNull` true; `nullScore >= beta` returns beta, no table store. Every other
  `negamax` call passes `false`. New door `searchWithoutNullMove`; all 8 older doors carry `nullMove: false`. Header
  paragraph (Scope 5).
- `src/engine.ts`: the same block in the abortable recursion, the null move unmade in a `finally` like the move loop; the
  clock is counted inside the null subtree as anywhere else (NFR-004). New door `chooseMoveWithoutNullMove`; the two
  older doors carry `nullMove: false`. The header's "null-move pruning … (none requested)" line is replaced by a
  null-move paragraph (Scope 5).
- `src/apply.ts`: `NullUndo`, `makeNullMove` (side flips, ep clears, halfmove clock 0, fullmove as `makeMove`),
  `unmakeNullMove`.
- `src/zobrist.ts`: `zobristKeyAfterNullMove(keyBefore, undo)` = side key, plus the ep file if one was set.
- Production diff: +256 / −25 lines (comments included) in those four files.

## Choices made inside the ruling (named, not silent)
1. **Predicate check order** is the ADR's listing (root, after-null, depth, check, then the material scan with an early
   exit at 3). The order changes no answer.
2. **No try/finally in `src/search.ts`**: that recursion has no abort and its move loop has none; the engine copy has
   one, as its move loop does.
3. **The instrument is a factory call-through mock** (`vi.mock("./apply.ts", importOriginal)`) wrapping `makeNullMove`
   only. It is the ADR's "call-through module mock of `src/apply.ts`". A `{ spy: true }` automock would also wrap
   `makeMove` and keep every call's arguments, at millions of calls, under the 128 MB heap of the whole-suite run.
4. **The new rows live in one new file, `src/search.null-move.test.ts`**, so no other file changes beyond the 14 ruled
   rows. Lanes: 33 default rows (≈1 s), 6 more under `SEARCH_DEEP=1` (A2 `.004` d11 and `.005` d12, A3 drift ×2,
   mate floor, the 190 length pin).
5. **The door instrument rows list the PVS-on doors only** (`searchWithoutNullMove`, `searchWithoutReductions`, and
   their engine pair). A PVS-off door gives every node an infinite bound, so no node of theirs is a null-window node and
   the switch cannot show. Their `nullMove: false` is in source, and the cross-build check covers them.
6. **The A3 engine side is deepened with `maxDepth: 5` on a frozen clock** rather than `ABC-121`'s
   `onRootStore` stop. It completes the same iteration 5.

## Pins (matched against the ruling's moved-pin table)
- Red and grown: `search.test.ts` `ABC-077` `A6` export list (+ `nullMoveReduction`, `searchWithoutNullMove`) and
  `engine.test.ts` `ABC-078` `A4` export list (+ `chooseMoveWithoutNullMove`, and its arity line inside that row). = rows 1–2.
- Re-pointed in `search.pvs-lmr.test.ts` (8 call sites, 12 rows), each with a `RE-POINTED at ABC-208` comment and
  titles kept (the `ABC-121` precedent): the engine door bite; `A4` ×2; `A5` (the default guard and two deep rows, one
  helper); the mate floor ×2 (seeds, all 287, one helper); the d5 drift ×2; the `A2` clock-free companion ×2. = rows 3–14.
- **0 value pins, 0 relations, 0 levels, 0 NFR bounds, no `ADR-0026` level moved. No STOP.** The `ABC-121` d5 drift
  literal stays 75 cp (the Architect's flag to the Orchestrator; not touched).
- Not re-pointed, by the ruling's list: the `ENGINE_DEEP` real-clock "A2 — depth completed in the default budget"
  report row still reads `chooseMove`. It is a report, not a bar, and was not run (no real clock).

## Not done here (out of the fences)
- `AGENTS.md` § Commands has no line for the new file's deep lane:
  `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`. Owed by the
  Orchestrator / AGENTS.md scribe.
- `plans/board.md`, `plans/traceability.md`, the ticket page and ADR-0050 are untouched; the trace row is in the brief's
  Result.
