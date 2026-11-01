---
id: ABC-261
title: "The default lane turns red when `hasLegalMove` loses its early exit, and reads `legalCapturesAndQueenPromotions`' quiet queen promotions while in check (test-only, from QE-254-b and QE-254-c)"
status: done
column: Done
closed: "2026-11-01, merged to main at 12e78c4d; QE PASS_WITH_GAPS (qe-ABC-261, 4c6e9ee5); test-only, UAT waived; front matter aligned to the board by bapm-epic010-close"
size: XS
priority: P3
epic: EPIC-010
feature: —
---

# ABC-261: two default-lane rows for the lazy legality filter (QE-254-b, QE-254-c)

> **Cut 2026-11-01 by BA/PM** (task `bapm-qe-gaps-1101`, records only, at `main` `661828d5`; nothing run, built or
> timed). Source: `qe-ABC-254` findings note `…dede949b` and verdict `…1c801504` (UNRESOLVED on A4 only; both gaps
> LOW), read on branch `grugops/qe-ABC-254` at `15eadd7a`. `EPIC-010` milestone 1b, row 32. **DoR 10/10 on the
> condition that `ABC-254` merges** (§ Dependencies). It stays in `Backlog` until then; column moves are the
> Orchestrator's.

## Problem

- **User:** the SE and reviewer of milestone 1b, where `ABC-250` packs the lazy filter `ABC-254` adds and
  `ABC-251`/`ABC-252` build on it.
- **Pain:** QE planted two regressions in `ABC-254`'s `src/legal.ts` that the whole default lane did not see:
  - **QE-254-b (PL3a):** `hasLegalMove` rebuilt as `legalMoves(position).length > 0`, the lazy list with no early
    exit. `src/gameend.nfr.test.ts` stayed 10/10 and `npm test` 2 368/2 368. Its tightened bar (no `makeMove` on
    the start position) cannot tell the two apart, because the lazy list plays no `makeMove` there either. This is
    the `ABC-217` A2 / `ABC-206` class: the leaf's game-end check paying for a full list.
  - **QE-254-c (PQ2):** `legalCapturesAndQueenPromotions` with quiet promotions not tested while in check. The
    default `src/legal.test.ts` stayed 42/42. Only the `ENGINE_DEEP` A1 walks (2 red) and QE's fuzz (988
    mismatches) caught it.
- **Value:** both regressions turn the default lane red on every `npm test`, before `ABC-250` rewrites the file, at
  the cost of two rows.

## Scope

1. **Early-exit row (QE-254-b):** one row that counts cross-module `isSquareAttackedBy` calls (spied, as
   `src/gameend.nfr.test.ts` spies `makeMove`) during one `hasLegalMove` call, on a board out of check where the
   first generated move is a king move that is legal and the king has at least three moves. Production stops after
   that first move; the lazy list tests every king move. QE's suggestion; the board is the SE's pick.
2. **In-check promotion row (QE-254-c):** one row in `src/legal.test.ts` that compares
   `legalCapturesAndQueenPromotions` with `fullLegalCapturesAndQueenPromotions` (same list, same order) on two
   boards where the side to move is in check and has a pawn on its seventh rank with an empty square ahead:
   - **board P1:** the quiet queen promotion neither blocks nor captures, so it is illegal and absent;
   - **board P2:** the promotion square blocks the check, so it is legal and present.
3. The early-exit row sits in `src/gameend.nfr.test.ts` or `src/legal.test.ts`, the SE's pick.

## Out of scope

- Any production line. `src/legal.ts` does not change.
- Re-pinning `ABC-254`'s rows, or any existing title or bar.
- QE-254-a (A4's re-read, `qe-ABC-254-a4`), and the D3 spread-rule question QE sent to BA/PM or the Architect: that
  is a PREREG method question for the re-read, not a ticket.
- The 512 B shared scratch (QE INFO, untested): no row asked.

## Acceptance criteria

The base is `main` at the commit the build branches from, which holds `ABC-254`. The tip is this ticket's delivered
commit. Plants are made in a scratch copy of the tip.

- **`A1` (green at production).** **Given** the tip, **when** `npm test` runs, **then** both new rows pass.
- **`A2` (non-vacuous boards).** The early-exit row asserts that its board is out of check, that the first move from
  `generateMoves` is a king move, and that the king has ≥ 3 generated moves. The promotion row asserts, on both
  boards, that the side to move is in check, the pawn stands on its seventh rank, and the square ahead is empty; it
  asserts the promotion is absent on P1 and present on P2.
- **`A3` (PL3a turns red).** **Given** `return legalMoves(position).length > 0;` as the first line of
  `hasLegalMove` (QE's PL3a, `plant.py`), **then** the early-exit row fails. The build note reports production's
  count and PL3a's count on the chosen board; they differ by **≥ 2** calls, and the row's bar sits between them.
- **`A4` (PQ2 turns red).** **Given** `legalCapturesAndQueenPromotions` with the in-check test removed from its quiet
  promotions (QE's PQ2, `plant.py`: `(inCheck || pinStamp[from] === epoch)` becomes
  `(!inCheck && pinStamp[from] === epoch)`), **then** the promotion row fails on P1.
- **`A5` (the full-filter plants stay red).** **Given** QE's PL1 (`hasLegalMove` → `fullHasLegalMove`), **then** the
  default lane is still red, as at `qe-ABC-254`.
- **`A6` (plants never committed).** A3–A5 are read out of tree by the SE and re-read by QE; the build note lists each
  plant and the failing row. No plant is in any commit.
- **`A7` (what the diff may touch).** **Given** `git diff <base> <tip> --name-only`, **then** it prints only
  `src/legal.test.ts`, `src/gameend.nfr.test.ts`, or both. No existing title or `expect(` line changes. Header test
  counts are raised by the rows added. Added comments cite only `ABC-261`, `ABC-254`, `ABC-217`, `ABC-206`,
  `ADR-0003`, QE-254-b or QE-254-c.
- **`A8` (cost).** **Given** the vitest JSON reports of three head runs of `npm test`, **then** the two rows' summed
  duration median is **≤ 30 ms**. `ABC-254`'s new rows read 21.7 ms together at `qe-ABC-254`.
- **`A9` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0; `npm test` is green with 0 skips and
  the count is base + 2; `test-skip-integrity` reports no findings; `G8` head median ≤ 10 s (`NFR-008`).

**If no board meets A2 for the early-exit row**, the SE stops and reports. It comes back to BA/PM; the row is not
weakened silently.

## NFR triggers

- **`NFR-008`:** default lane **≤ 10 s** (A9); rows **≤ 30 ms** (A8). `G8` read H 9.01 s on `ABC-254`'s branch.
- **`NFR-001` / `ABC-206` call-count bars:** the early-exit row is one more such bar; no existing bar moves.
- **`ADR-0046` R1–R4:** not triggered (no clock). **`NFR-004` / `G5` / `NFR-009`:** no production line moves.
- **Security (ASVS L1):** not triggered; test-only.

## Test notes

1. **`ABC-250` will rewrite `src/legal.ts`** (it packs the lazy filter). These rows are written against the exported
   functions, so they should survive it. If `ABC-250` must re-pin the early-exit bar, it keeps the gap between the
   early exit and a full lazy list (A3), and does not set the bar equal to the full-list count.
2. **The plants are QE's:** `qe-ABC-254` raw `qe-scripts/plant.py` (PL1, PL3a, PQ2) on branch
   `grugops/qe-ABC-254`. Any equivalent plant will do.
3. **No production line, so no smoke and no UAT:** the waiver (`AGENTS.md`, 2026-08-17) holds if
   `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`
   is empty at delivery. QE's verdict is the gate (`qe-e2e` hop owed).
4. **Rollback:** revert the delivered commit.

## Size and priority

- **Size: `XS`.** Two rows, three FENs, three plants, one spy pattern that exists already. **Not `S`:** no search,
  no timing, no fixture file.
- **Priority: `P3`.** Both gaps are LOW. Out of check the lazy list tests only king, en-passant and pinned moves, so
  PL3a costs little (QE), and PQ2 is caught by the deep lane already. **Not `P2`:** neither changes a value today.

## Dependencies

- **`ABC-254` merged** (In Review; QE UNRESOLVED on A4 only, re-read `qe-ABC-254-a4` queued). The rows read its lazy
  filter. **If `ABC-254` is dropped or declined, this ticket closes as dropped**: on the full filters, the rows
  compare a function with itself.
- **Order (recommended, not binding):** after `ABC-254`'s merge and before `ABC-250`, so the packing rewrite is read
  by both rows. Independent of `ABC-260`.
- **Shared files:** `src/legal.test.ts`, which `ABC-250` also edits (`UNKNOWN - verify` at pull). The pull order above
  keeps them apart.
- No ADR of its own (`ADR-0003` as amended, merged `89af8b56`). **Owners:** SE: A1–A8. QE: re-read of A3–A5 and A9.
  No owner question.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `661828d5`. **Result: 10 of 10, conditional on `ABC-254` merging** (row 5).

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ two regressions, each a QE plant the whole default lane missed (PL3a, PQ2) |
| 2 | scope and out-of-scope clear | ✅ two rows, named boards, two files at most; no production line; QE-254-a out |
| 3 | INVEST-shaped | ✅ XS, testable by plants; independent of `ABC-260`; it depends on `ABC-254`'s code, and the drop rule says what happens if that code never lands |
| 4 | acceptance testable and measurable | ✅ green at production; red on PL3a (gap ≥ 2 calls) and PQ2; PL1 still red; ≤ 30 ms; base + 2; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-254` merge (stated as the pull condition); before `ABC-250` |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; rows ≤ 30 ms |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, both directions argued |
| 10 | no major unresolved blocker | ✅ none beyond row 5's stated condition; the stop rule is stated |
