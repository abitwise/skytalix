---
subtask: ticket-to-pr-ABC-208
role: software-engineer
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/ticket-to-pr-ABC-208/
branch: new grugops/ABC-208 from main, worktree ../wt-ABC-208
width: 1 of 3 (no real-clock timing, no G6, no games)
---

# Build ABC-208: null-move pruning (ADR-0050, PROPOSED)

## Do
- Own worktree and `npm ci --ignore-scripts`. Build exactly to the page's `## Design ruling` and ADR-0050 (Architect `arch-design-ABC-208/…012b1053`, `…bae20026`) as amended on the page (BA/PM `bapm-amend-ABC-208/…e8505f19`). That covers:
  - the pure `nullMoveReduction` predicate (R = 3, depth ≥ 2, null-window only; never in check, after a null, at the root, or below three non-pawn pieces);
  - the null move in `src/apply.ts` (halfmove reset) and its key in `src/zobrist.ts`;
  - both recursions, with a cut returning beta and storing nothing;
  - the door pair `searchWithoutNullMove` / `chooseMoveWithoutNullMove`, with every older door turning null move off;
  - the Scope 5 header lines in `src/engine.ts` and `src/search.ts`.
- Tests:
  - A2's 7 zugzwang rows at their per-row depths.
  - A3's oracle: d5 drift ≥ 95 % ≤ 25 cp, none > 37 cp, on the 190 for both recursions; and the mate floor at d5 on the 287.
  - The predicate table, the source row and the unit rows that catch the oracle's named blind spots.
- Pins: only the 2 export-list rows (by list growth) and the 12 re-pointed rows the ruling names. Any value pin, relation, level or bound moving → STOP to Architect.
- Red-first where the page names plants. Frozen-clock d7/d8 counts on kiwipete and position-6 for base and head (must equal the ruling's), reported, not graded.
- Gates: lint, typecheck, build, `npm test` + `last-run.json` (Duration; NFR-008 headroom matters), skips, SEARCH_DEEP, ENGINE_DEEP (deterministic rows only), PUZZLE_DEEP (G1 54/58). No real-clock timing.

## Fences
- Only the files the page's Scope names, the tests the ruling names, your worktree and `<scratchpad>/se208/`. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only. ADR-0050 stays PROPOSED; do not edit its status.

## Publish
- Commit on your branch. Seal notes (task ticket-to-pr-ABC-208). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Built to the ruling. All 7 A2 rows pass, and A3 reads the ruling's measured figures. 2 export lists grew and 12 rows were re-pointed. No value pin, relation, level or bound moved. No STOP.** ADR-0050 stays PROPOSED and was not touched.
- Branch `grugops/ABC-208` in `../wt-ABC-208`, with its own `npm ci --ignore-scripts`, from `main` `2e7899fc`. Code `afb6b32f`; tip **`80345eb9`** (notes). Not pushed, not merged.
- Plants and probes ran on a scratch copy under `<scratchpad>/se208/`, never in the worktree's `src/`. No real-clock timing, no `G6`, no game.

| criterion | at the tip |
|---|---|
| Scope 1–5 | `src/search.ts` (`nullMoveReduction` → 3 or 0; switch `nullMove`; null block at `alpha + 1 === beta`, child `depth - 1 - R` with `(-beta, -beta + 1)`, cut returns beta, no store; door `searchWithoutNullMove`; 8 older doors off; header), `src/engine.ts` (same block, unmade in a `finally`; door `chooseMoveWithoutNullMove`; 2 older doors off; "none requested" line replaced), `src/apply.ts` (`makeNullMove` / `unmakeNullMove`, halfmove 0), `src/zobrist.ts` (`zobristKeyAfterNullMove`). +256 / −25 production lines |
| Pins | moved exactly the ruling's set: the `ABC-077` `A6` and `ABC-078` `A4` export lists (growth), and 12 `ABC-121` rows in `search.pvs-lmr.test.ts` re-pointed to the doors (8 call sites; titles kept, `RE-POINTED` comments). Their 8 printed readings equal base's own run line for line (drift 97.86 % / 63 cp ×2, mate floor 0 of 180, A5, A2 companion) |
| A1 | QE's, out of tree. Self-check only (the Architect's `a1.mts`, base vs head): 222/222 door cells node-, score- and move-equal. **Flag:** shipped `chooseMove` differs from base on 5/6 roots at d6, not the 6/6 that `…bae20026` states. Position-3 is equal because each side has one non-pawn piece, so the guard rules out every null move. Head's d6 counts equal that note's `hd` row |
| A2 | 7/7 at the ruled depths (`.001` d9, `.004` d11, `.005` d12, K+P ×4 d8). The instrument (a call-through mock of `makeNullMove`) saw 0 null moves in check and 0 below three pieces, and the K+P and pawn-only rows made 0 null moves |
| A3 | d5 on the 190: `search()` 100.00 % ≤ 25 cp, max 25 (position-5/e1f2); `chooseMove` 100.00 %, max 8; mate flips 0 (a report). Mate floor d5 → d5 on the 287: 0 of 189 |
| Red-first / plants | Head's tests on base's production files: 30/128 red. 18 default-lane plants, each red in ≥ 1 row: in check, double null, null score, halfmove, no guard, guards 1 and 2, R 5, R 2, min depth 3, null everywhere, cut without search, sign error, key without ep, and the 4 doors wired on. 5 deep plants match the ADR's figures: cut 42.78 %, sign 41.71 %, no guard 60/189 plus `.004` and `.005`, guard 2 `.004` and `.005`; the null score stays green (the named blind spot) |
| Test note 4 | frozen-clock nodes, base → head: kiwipete d7 609 900 → 590 489, d8 1 735 339 → 1 259 463 (d9 2 907 475); position-6 d7 586 333 → 180 941, d8 1 355 149 → 355 565 (d9 940 109). **All equal the ruling's table.** Reported, not graded |
| Gates | lint, typecheck and build rc 0. Lane inventory 63 = 63. `npm test` 63 files, **2 123 / 2 123**; `last-run.json` success, 0 failed, 0 pending, 0 todo; **Duration 7.71 s** (base 7.05 s, same host; not a reading). Skips 0, `No findings.` Deep lanes, real-clock rows filtered by name: PUZZLE **G1 54/58** (base's four misses); SEARCH_DEEP search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29, null-move 39, all green; ENGINE_DEEP engine 54 + 6 filtered, levels 37 + 4 filtered, transposition 26 |
| Owed elsewhere | `AGENTS.md` § Commands has no line for the new file's deep lane (`SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`). The `ENGINE_DEEP` real-clock "A2 — depth completed" report row still reads `chooseMove`, because it is not in the ruled 12 |

Notes are sealed via `admitAndAppend` (`contextRoot` = the worktree's `.grugops/context`) and read back 2/2, in `../wt-ABC-208/.grugops/context/ticket-to-pr-ABC-208/notes/`: decision `…e0666f5b` (the build, six in-ruling choices, pins) and observation `…83c40265` (red-first, plants, counts, gates).

### Trace row
| ABC-208 (ticket-to-pr-ABC-208) | null-move pruning in both recursions at null-window nodes, R = 3, no verification, guarded below three non-pawn pieces, behind the test-only door pair | EPIC-008 | — | ADR-0050 PROPOSED (owner's); no bound moved; NFR-005/G6 predicted MET by frozen-clock counts (UNKNOWN - verify) | grugops/ABC-208 @ 80345eb9 (code afb6b32f)<br>src/search.ts, src/engine.ts, src/apply.ts, src/zobrist.ts; src/search.null-move.test.ts (33 default + 6 SEARCH_DEEP); search.test.ts and engine.test.ts export lists; search.pvs-lmr.test.ts (12 re-points); .grugops/context/ticket-to-pr-ABC-208/notes/ (2) | red-first 30/128; 18 default + 5 deep plants bite; A2 7/7; A3 100 %/25, 100 %/8, 0/189; frozen-clock = ruling; npm test 63/2123 (7.71 s); deep lanes green (real-clock filtered); G1 54/58; skips 0, No findings. | owed: QE verdict signs (owner delegation 2026-10-22) | — | In Development → In Review (QE: A1 out of tree, G2/G5/G6/G8/G9/G10/G11, D/S1 after the owner accepts ADR-0050) |
