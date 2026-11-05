# arch-ABC-291-probe: the premise stands under rule 3. The work does not stop. The build carries d5's named cut, K2's list is written, DoR row 10 closes, size M

Architect/Design, on the readings `…65c7a9c9`, under the PREREG `…2a579895`. `ADR-0075` § "The probe's reading" holds the same text for the build.

## What the rule says
- **Rule 1 does not fire.** PR1 to PR4 hold, with 0 mismatches. PR3 shows d1's words right.
- **Rule 2 does not fire.** PR5, PR6 and PR7 hold.
- **Rule 3 fires.** PR8 reads R = 1.04287, above 1.03, on two sessions that stand. **The premise stands.** The build carries d5's named cut, and QE reads K4 on the build. The forecast "under 1 %" was wrong, and this replaces it.
- **Rule 4 does not fire.** PR9 reads 14.72 %, against 5.0 % as sealed.
- **Rule 5's words do not apply:** not every row holds. So the line reads "the premise stands under rule 3", not "MET". `ABC-291` is built. **No value, rule, definition, ratio, intent or bar moved.**

## K2's list
Read at `src/` tree `cc6e64d1`: 58 rows red on `cand` and none on `main`, in six groups. Rows follow `ADR-0064` d7 by reference, as d4 says. **"Off" below means `evaluateAtPhaseWithoutPawnShape`, or `chooseMoveWithoutPawnShape` where the row calls the engine.**

1. **The byte rows (2).** `src/evaluate.pawns.test.ts` "is a fixed 576 KiB…" (its slot formula and its `576 * 1024` line) and `src/transposition.test.ts` A7 "stays inside NFR-009's 16 MiB…" (its `576 * 1024` line). d7 reads them 589 824 → 655 360. **With d5's cut in the build, which rule 3 requires, the memo is 2^14 × 36 bytes = 589 824 and neither row moves.** They re-pin to 655 360 only if the cut is not in the build.
2. **Value rows, re-pinned old → new (2).** Both on `chooseMove`, shipped side, moves unchanged.
   - `src/engine.test.ts` `ABC-249` "Qe5+ at ply 4…": f1e1 441 → 443, f1g1 520 → 522, and the row's title with them.
   - `src/engine.test.ts` `ABC-282` A2 (c) "a completed mate above the incumbent…": incumbent e4d3 1 070 → 1 075.
3. **A lost fixture property (1).** `src/engine.test.ts` `ABC-282` A2 (b) "stopped before any root move beat it…". The incumbent reads a3b4 521, not 531. Behind that pin, `head.nodes` reads 1 157 against the base's 3 197: the head no longer aborts at the base's node, so the row no longer reads what its title says. **This is not a re-pin.** The fixture is re-found under `ADR-0028` d2, by the row's own scan (`se-ABC-282`'s `raw/scan.mjs`). The other rows of that table stay.
4. **Re-points to off, figures unchanged (26).**
   - `src/evaluate.passer.test.ts` `ABC-271` K1 (b): 4 rows.
   - `src/evaluate.queen-on.test.ts` `ABC-270` K1 (b): 3 rows.
   - `src/evaluate.taper.test.ts`: `ABC-269` B1 (a) "the frozen rows span phases 0 to 24…" (`M-negzero-b` is no longer 0 on the shipped entry; `M-negzero-a` still is); B1 (b), 2 rows; `ABC-274` A3, 13 rows, one loop body. That loop's other two rows, `PST.queen` and `KING_FILE_OPEN`, are green and move with it.
   - `src/search.bundle.test.ts` `ABC-283` (a): "iterations 1-4 are the door's…" and "a non-mate fail high…", the head to `chooseMoveWithoutPawnShape`. The loop's mate row is green and moves with it.
   - `src/see.test.ts` `ABC-279` A1 (c) "a node whose every capture is losing…": the row's record has no `pawnShape`, so its expected value re-points.
5. **The new door joins a list (14).** Exports: `src/engine.test.ts` A4 and `src/search.test.ts` A6. Door lists, one row per recursion: `src/evaluate.taper.test.ts` `ABC-269` taper rows (2), `src/quiescence.test.ts` `ABC-228` and `ABC-229` (4), `src/search.futility.test.ts` (2), `src/search.null-move.test.ts` `QE-208-c` (2), `src/see.test.ts` `ABC-279` (2). The new door carries every older switch on, as `searchWithoutBundle` does.
6. **The switch's call sites (13), all figures unchanged.**
   - `src/evaluate.taper.test.ts` "the call sites…" (1); `src/quiescence.test.ts` "the leaf passes its ply…" (2); `src/search.futility.test.ts` "one futilityNode call gated…" (2).
   - `futilityNode` gains an argument: the arity row, 7 → 8 (1); the boundary rows (6); "the mate band's edges" (1).
   - **Four more call lines stay green while wrong**, and only `tsc` shows them: `src/search.futility.test.ts` lines 275, 439, 440 and 698 at `main`. They take the same argument. They are on the list.
   - This group assumes the prototype's signature, `futilityNode(…, taper, pawnShape, phase)`. If the build passes the switch another way, these rows change with it. The rows stay the same rows.

**Sum: 2 + 2 + 1 + 26 + 14 + 13 = 58.** Applied as edits on a copy of `cand`, the lane reads 2 708 of 2 709 green and `tsc` reads 0 errors. The one red is group 3, which no pin can fix.

**The list binds at `cc6e64d1`.** `ABC-303`, `ABC-305` and `ABC-289` land first, and each can add a door or a row. Re-derive it the way K0 (c) re-derives its counts: re-run the patch on the new base and put both lists in the PR. A re-derived line is a dated line, never a moved bar.

## K0 (c)
The ON column of the readings' P0 table, at `cc6e64d1`. `patch_e4b.py` in `raw/scripts/` is the probe's patch. Its edits are exact-string, so a new base may need its anchors moved.

## The fixture list
The probe's 16 positions (`PAWN_SET`) meet K1 (a)'s "at least 12". They are offered to QE, who freezes K1's fixtures.

## DoR row 10
**Closes, 2026-11-05.** It asked for K2's value rows and re-point list, the Architect's dated line, after the probe. That line is written. No value, row or figure stays `UNKNOWN - verify` in the default lane except row (b)'s new fixture, which d4 sends to `ADR-0028` d2. The call on the deep lanes below does not hold it open, because d7 ties the list to PR11's lane report. It should be ruled before the build.

## Size
**M, up from S–M.** Priced from the prototype: 305 lines added in five `src/` files, with 18 removed. To that the build adds d5's cut, the tool line, QE's frozen fixtures and K1's rows (a) to (h). The list touches 58 rows and four more lines in 12 test files, and one fixture must be re-found. The memo stays where it is, but a re-read of K4 now decides the merge (call 1). No part of this is an L: the design held every exact row at the first try.

## Calls for the Orchestrator
1. **F2 after PR8. Recommended: K4 on the build is F2's one re-read.** F2 reads "K4 above 1.03 ×: STOP … d5's one value-identical cut, then one re-read under a PREREG. A second miss: not merged." Rule 3 spends the cut before the build. So one reading is that PR8 was the first miss, and a K4 above 1.03 on the build is the second: not merged, and a miss under d11 (d). The other reading treats K4 as a first miss, but then no cut is left, so it would only add a second try on the same code. I recommend the first. It moves no bar. **The risk is real:** H read about 1.00 in some rounds and 1.06 in others, and nobody has read the cut. QE should seal K4's PREREG knowing that. If you rule the other way, say so before that PREREG.
2. **The deep lanes. Recommended: rule them under d4 now.** d7 says "A re-pin outside [K2's list] is a defect", and d10's PR11 reads the default lane only. So a deep-lane row of the same kinds would read as a defect at the build. Those lanes pin `search()` and `chooseMove` values too, and their rows are `UNKNOWN - verify`. I did not run them: they are not in d10, and a probe runs as written. **My ruling to take:** deep-lane re-points and door joins follow d4 by reference, each named in the PR; a deep-lane value re-pin or lost fixture property comes to the Architect before it lands. Or brief a read of those lanes on the patched copy; that needs its own hop.
3. **`NFR-009` and the page.** With the cut the memo stays at 576 KiB, so "640 KiB" reads as d3's form before the cut, and `NFR-009`'s +65 536 falls to 0. That is d5's own named result, so no bar moves. BA/PM's lines below follow it.

**Owner question: none.** Rule 4, the one rule that tells him, did not fire. F5 did not fire, so the dated lines of `arch-ABC-291` stand.

## Owed
- **BA/PM, `ABC-291`'s page:** DoR 10/10 on this line; size M; the probe run, with its reading; K2's list by reference; § Scope 3 and § NFR triggers carrying the cut; `UNKNOWN - verify` trimmed to what stays open. Status and column are the Orchestrator's.
- **QE:** K4's PREREG, with PR8's two levels stated; K1's fixtures.
- **The Engineer:** `ABC-305` first, as d11 (a) has it. The patch, the cut and the list, on the base the build is cut from.
