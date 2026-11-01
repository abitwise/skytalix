---
id: ABC-262
title: "The lazy-legality rows read the board shapes they missed: `hasLegalMove`'s early exit on a pawns-first board, and the in-check quiet queen promotion with black to move (test-only, from QE-261-a and QE-261-b)"
status: done
column: Done
closed: "2026-11-01, merged to main at 2cf2bb69; QE PASS_WITH_GAPS (qe-ABC-262, ed4d02a5; A4 waived by the Orchestrator); test-only, UAT waived; front matter aligned to the board by bapm-epic010-close"
size: XS
priority: P3
epic: EPIC-011
feature: —
---

# ABC-262: two more default-lane rows for the lazy legality filter (QE-261-a, QE-261-b)

> **A4 WAIVED; dated line 2026-11-01 by BA/PM** (task `bapm-spike-accel`, records only, at `main` `7c67d3ad`; nothing
> run). It closes QE-262-b (`qe-ABC-262` gaps `…16924bec`), so this page is no contract the code silently breaks.
> **`ABC-262` is Done,** merged `2cf2bb69` on QE's PASS_WITH_GAPS (`qe-ABC-262` verdict `…ed4d02a5`). A4 read NOT MET
> as written and was **WAIVED by the Orchestrator** (brief `qe-ABC-262`, § Orchestrator ruling on A4).
> - **Why the waiver holds:** production is correct. `src/legal.ts:429` reads `(inCheck || pinStamp[from] === epoch)`,
>   so in check `inCheck ||` short-circuits and every quiet queen promotion is tested (`qe-ABC-262` `…918ca02e`).
> - **Why QB survives the row:** the hole is in the plant. In check `epoch` stays 0, and a never-stamped `pinStamp`
>   square reads 0, so QB's leftover operand still takes the test on P1′.
> - **Where QB dies:** the `ENGINE_DEEP` `ABC-254` A1 walk turns red on it (`kiwipete 20-65 39-22 65-99`, an extra
>   black g2–g1=Q). QE's own QBe (QB without the alias) turns this row red on P1′, and QKb turns it red on P2′
>   (`…064f5f07`).
> - **What stays open:** QE-262-a (LOW) is carried to any rewrite of the quiet-promotion guard or `pinStamp`/`epoch`
>   (`ABC-252` is dropped, so it is "any rewrite"). Nothing else on this page changes.

> **Cut 2026-11-01 by BA/PM** (task `bapm-qe-gaps-1101b`, records only, at `main` `aaccbbf8`; nothing run, built or
> timed). Source: `qe-ABC-261` gaps note `…c385f9a2` and verdict `…4c6e9ee5` (PASS_WITH_GAPS; both gaps LOW). Counts
> below are from QE's probe at that hop (`qe-ABC-261` `raw/plants/*.probe.json`). **`EPIC-011` phase 0 (M0), tickets
> row 14**, under the Orchestrator's rule for this hop: it does not have to land before `ABC-251`, which does not touch
> `src/legal.ts` or generation order. **DoR 10/10.** Column moves are the Orchestrator's.

## Problem

- **User:** the SE and reviewer of the next rewrites of `src/legal.ts` (`ABC-250` packs the lazy filter now;
  `ABC-252` rebuilds the object functions on the packed path after it).
- **Pain:** QE planted regressions in `src/legal.ts` that the whole default lane (2 374/2 374) did not see after
  `ABC-261`:
  - **QE-261-a (QX2, QX1):** `ABC-261`'s early-exit row reads one board, where the first generated move is a king move.
    On a board where the first move is a pawn move, QX2 (the early exit lost there) pays the full lazy list, and QX1
    (the untested move does not return at once) pays one extra attack test. Both survive. QX2 on QE's board B2 costs
    1 → 10 attack tests in `hasLegalMove`.
  - **QE-261-b (QB):** `ABC-261`'s in-check promotion row reads white to move only. QB (the in-check test dropped for
    black's quiet promotions only) survives the default lane; only the `ENGINE_DEEP` `ABC-254` A1 walk catches it.
- **Value:** both turn the default lane red on every `npm test` before `ABC-252` rebuilds the file, at the cost of
  two cheap rows (`ABC-261`'s two rows read 0.47 ms together).

## Scope

1. **Pawns-first early-exit row (QE-261-a):** one row that counts cross-module `isSquareAttackedBy` calls during one
   `hasLegalMove` call (spied, as `ABC-261`'s row does), on QE's board **B2** `4k3/8/8/8/8/4K3/PPP5/8 w - - 0 1`: out of
   check, the first generated move is a pawn move, the white king on e3 has 8 generated moves.
2. **Black-to-move promotion row (QE-261-b):** one row that compares `legalCapturesAndQueenPromotions` with
   `fullLegalCapturesAndQueenPromotions` (same list, same order) on the colour mirrors of `ABC-261`'s P1 and P2:
   - **P1′** `4k3/8/8/8/8/8/p7/4R2K b - - 0 1`: the e1 rook checks; a2–a1=Q neither blocks nor captures, so it is
     illegal and absent;
   - **P2′** `7K/8/8/8/8/8/1p6/R3k3 b - - 0 1`: the a1 rook checks along the first rank; b2–b1=Q blocks, so it is
     legal and present.
   - QE marked both FENs `UNKNOWN - verify`. BA/PM checked them by hand (ranks sum to 8; the check line and the block
     hold); nothing was run. A2's asserts are the proof at build.
3. **New rows, not edits:** each sits beside its `ABC-261` row (`src/gameend.nfr.test.ts`, `src/legal.test.ts`). The
   `ABC-261` rows are not edited.

## Out of scope

- Any production line. `src/legal.ts` does not change.
- Editing or re-pinning `ABC-261`'s rows, titles or bars.
- QE-261-c (the order-bound precondition): carried as dated notes on `ABC-250` and `ABC-252`, not a row.
- QE-255-a (`machine.txt`'s `control:` line, `tools/rating/`): declined at this hop (another module, lane and epic).

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit. Plants are made
in a scratch copy of the tip.

- **`A1` (green at production).** **Given** the tip, **when** `npm test` runs, **then** both new rows pass.
- **`A2` (non-vacuous boards).** The early-exit row asserts that B2 is out of check, that the first move from
  `generateMoves` is a pawn move, that the king has ≥ 3 generated moves, and that the spied count is > 0. The promotion
  row asserts, on P1′ and P2′, that black is to move and in check, that a black pawn stands on black's seventh rank
  (`from >> 4` is 1), and that the square ahead is empty. It asserts the promotion is absent on P1′ and present on P2′.
- **`A3` (QX2, QX1 and PL3a turn red).** The early-exit row's bar is **≤ 1** attack test. **Given** each of QE's plants
  QX2, QX1 and PL3a (`qe-ABC-261` `raw/plants/*.diff`, or equivalents), **then** the early-exit row fails. The build
  note reports production's count and each plant's count on B2. QE's probe read production 1, QX1 2, PL3a 9, QX2 10.
- ~~**`A4` (QB turns red).**~~ **WAIVED 2026-11-01 (Orchestrator; top block): NOT MET as written; production correct at
  `src/legal.ts:429`; QB caught by the `ENGINE_DEEP` `ABC-254` A1 walk.** **Given** QE's plant QB (`raw/plants/QB.diff`: `(inCheck || pinStamp[from] === epoch)`
  becomes `((inCheck && !moverIsBlack) || pinStamp[from] === epoch)`), **then** the promotion row fails on P1′.
- **`A5` (plants never committed).** A3 and A4 are read out of tree by the SE and re-read by QE. The build note lists
  each plant and the failing row. No plant is in any commit.
- **`A6` (what the diff may touch).** **Given** `git diff <base> <tip> --name-only`, **then** it prints only
  `src/gameend.nfr.test.ts`, `src/legal.test.ts`, or both. No existing title or `expect(` line changes. Header test
  counts are raised by the rows added. Added comments cite only `ABC-262`, `ABC-261`, `ABC-254`, QE-261-a or QE-261-b.
- **`A7` (cost).** **Given** the vitest JSON reports of three head runs of `npm test`, **then** the two rows' summed
  duration median is **≤ 20 ms**.
- **`A8` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0. `npm test` is green with 0 skips, and
  the count is base + 2. `test-skip-integrity` reports no findings. `G8` head median is ≤ 10 s (`NFR-008`).

**Stop rule.** If production on B2 does not read exactly 1 at the base, or a mirror board fails an A2 assert, the SE
stops and reports. The ticket comes back to BA/PM. The bar is not loosened and the board is not swapped silently.

## NFR triggers

- **`NFR-008`:** default lane **≤ 10 s** (A8); rows **≤ 20 ms** (A7). `G8` read H 8.84 s at `qe-ABC-261`.
- **`NFR-001` / `ABC-206` call-count bars:** the early-exit row is one more such bar. No existing bar moves.
- **`NFR-004` / `G5` / `NFR-009`:** no production line moves. **Security (ASVS L1):** not triggered; test-only.

## Test notes

1. **Same order rule as `ABC-261` (QE-261-c).** B2's precondition ("the first generated move is a pawn move") is bound
   to `generateMoves`' a1-upward scan, as `ABC-261`'s king-first precondition is. A reorder turns the row red loudly
   (production would read 2). The fix is to re-pick the board or assert an order-free precondition, never to drop the
   bar.
2. **The plants are QE's:** `qe-ABC-261` `raw/plants/` (QX1, QX2, PL3a, QB diffs). Any equivalent plant will do.
3. **No production line, so no smoke and no UAT:** the waiver (`AGENTS.md`, 2026-08-17) holds if
   `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`
   is empty at delivery. QE's verdict is the gate (`qe-e2e` hop owed).
4. **Rollback:** revert the delivered commit.

## Size and priority

- **Size: `XS`.** Two rows, three FENs, four plants that exist already, a spy pattern that exists already. **Not
  `S`:** no search, no timing, no fixture file.
- **Priority: `P3`.** Both gaps are LOW. Out of check the lazy list tests only king, en-passant and pinned moves, so
  QX2 costs a few attack tests, and QB is caught by the deep lane already. **Not `P2`:** neither changes a value today.

## Dependencies

- **`ABC-261` merged** (`12e78c4d`): the rows sit beside its rows. No other hard dependency.
- **Order (recommended, not binding):** after `ABC-250` merges or is dropped, and before `ABC-252`. The early-exit row
  then reads the packed filter as it lands, and the files do not collide with the running `se-ABC-250`.
- **Shared files:** `src/legal.test.ts`, which `ABC-250` may also edit (`UNKNOWN - verify` at pull).
- No ADR of its own (`ADR-0003` as amended). **Owners:** SE: A1–A7. QE: re-read of A3, A4 and A8. No owner question.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `aaccbbf8`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ three QE plants (QX1, QX2, QB) the whole default lane missed after `ABC-261` |
| 2 | scope and out-of-scope clear | ✅ two new rows, named FENs, two test files at most; no production line; QE-261-c and QE-255-a out |
| 3 | INVEST-shaped | ✅ XS, testable by plants; independent (`ABC-261` merged); the pull order is a recommendation |
| 4 | acceptance testable and measurable | ✅ green at production; bar ≤ 1 (production 1, plants 2 / 9 / 10); QB red on P1′; ≤ 20 ms; base + 2; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-261` merged; shared test file with `ABC-250` named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; rows ≤ 20 ms |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, both directions argued |
| 10 | no major unresolved blocker | ✅ none; the stop rule covers the hand-checked FENs and the base count |
