---
id: ABC-157
title: "The castling right test can be weakened to read ANY right: a build that castles on the other wing's or the opponent's right passes the whole default lane"
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-001
feature: —
---

# ABC-157 — six default-lane rows that hold exactly ONE right that is not the castle's own. ZERO production lines

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from `ABC-024`'s QE gap
> `QE-024-a` (MEDIUM; `.grugops/context/qe-ABC-024/notes/…9c3a7f12`, verdict `…e84b25c9`). Re-measured at `main`
> `1671f24f` in a scratch copy outside the repository (`.grugops/context/bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* the next hop that edits the castling generator in `src/moves.ts`.

*Pain:* the right test at `src/moves.ts:337` is `if ((position.castling & option.right) === 0) continue;`. The mutant
**`X-any-right`** (`position.castling === 0`) offers a castle whenever **any** right is held: the other wing's right,
or a right only the opponent holds. At `1671f24f` it passes the default lane **1810 of 1810** (58 files). Only
`PERFT_DEEP=1` catches it, on one assertion (`position-5 perft(4)`; QE read 31/32). Every default row holds either
castling `0` or the right of each castle it expects, so the bit the test reads is never varied.

*Value:* `ABC-024` § The judgement ruled that a guard protected only by the opt-in deep lane is owed a default-lane
row. This is that row for the right **mask** axis. `ABC-024` covered the scalar axis only.

## Scope

- A new `describe` block in `src/moves.castling.hardening.test.ts`, appended after the `ABC-024` blocks, with six
  rows on `r3k2r/8/8/8/8/8/8/R3K2R`. In each row, every corridor is empty and no square is attacked, so the right
  is the only thing that decides. Readings at `1671f24f` (delivered build, then `X-any-right`):

  | FEN | castles offered | `legalMoves` | under `X-any-right` |
  |---|---|---:|---:|
  | `… w K - 0 1` | `e1g1` only | 25 | 26 |
  | `… w Q - 0 1` | `e1c1` only | 25 | 26 |
  | `… b k - 0 1` | `e8g8` only | 25 | 26 |
  | `… b q - 0 1` | `e8c8` only | 25 | 26 |
  | `… w kq - 0 1` | none | 24 | 26 |
  | `… b KQ - 0 1` | none | 24 | 26 |

- Each row asserts the castle list (by name, at the `generateMoves` and `legalMoves` layers, as the `ABC-024` `A2`
  control does) and the exact count.

## Out of scope

- **Any byte of `src/moves.ts`** or of any other production file.
- `src/perft.test.ts` and the deep lane.
- `QE-024-b` (accepted residual) and `QE-024-c`/`-d` (INFO): unchanged.
- Rows on other axes (scalars, corridor, occupants): `ABC-009`, `ABC-023`, `ABC-024` own them.

## Acceptance (Given/When/Then)

- **`A1` (one wing's right gives one castle).** **Given** each of the four one-right rows above, **when**
  `generateMoves` and `legalMoves` run on the parsed FEN, **then** the castle list is exactly the one named move
  and the `legalMoves` count is **25**. The row first asserts `parseFen(fen).castling` equals the single right
  bit it names.
- **`A2` (the opponent's rights give none).** **Given** the two opponent-only rows, **when** the same two calls
  run, **then** the castle list is **empty** and the count is **24**. The row first asserts that the side to move
  holds **0** of its own right bits and the opponent holds **both** of theirs.
- **`A3` (the gap is closed: mutants).** Each mutant is planted in a scratch copy outside the repository, and the
  lane is the whole default `npx vitest run`, with `PERFT_DEEP` unset.
  - **`X-any-right`:** green on the base tree, **red** on the head tree. Every one of the six new rows fails.
  - **The seven named `ABC-024` mutants** and **the 15 `ABC-023` `A5` controls**, with the encodings committed at
    `ticket-to-pr-ABC-024/probe/harness.mjs`: the same reading at base and head (each named mutant red, each
    control green). The six rows add **0** kills among the controls.
  - The delivery note records the readings.
- **`A4` (fences).**
  - `git diff --name-only <base>` lists exactly `src/moves.castling.hardening.test.ts`, and the diff removes
    **0** lines (`-U0`).
  - `md5 src/moves.ts` is equal at base and head.
  - `npm test`: the file count equals base, the test count is base **+ 6**, and skips are **0**.
  - `PERFT_DEEP=1 npx vitest run src/perft.test.ts` passes 32/32 at head.

## Dependencies

- **`ABC-024` — `Done`.** `src/moves.castling.hardening.test.ts` holds its blocks at `1671f24f`
  (`:1706`–`:1808`). Branch from the `main` that is current at pull.
- **None blocking.** No open ticket edits `src/moves.ts` or this test file. `ABC-096` (in flight) does not touch
  either.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** the count is the pin: **0 test files, +6 in-process rows, 0 spawns.** Each row is
  one parse plus two move-generation calls on a 24–26-move position. No wall bound (`ADR-0035` decision 3).
- **Security:** not triggered. Test-only diff, no input path, network or dependency.

## Test notes

1. **Show the gap first:** run `X-any-right` against the base test before writing a row.
2. **Plant in scratch copies, never in the worktree.** `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. With 0 production lines the UAT
   waiver is expected; it is measured at the exit, not asserted here.

## Size and priority

**`XS`:** six rows in one existing file, one mutant plus the committed catalogue re-run. **Not `S`:** no
production code and no new file.

**`P2`:**
- **Not `P3`:** QE graded it MEDIUM, and the guard has the same one-assertion margin `ABC-024` (`P2`) ruled on.
  The wrong build would offer an illegal castle in ordinary play: a rook leaves home and returns while the other
  wing's right is still held.
- **Not `P1`:** the delivered code is correct (the base tree reads 25/25/25/25/24/24), so nothing shipped is
  wrong.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** `X-any-right` 1810/1810 at `1671f24f`, deep lane only |
| 2 | scope and out-of-scope clear | **✅** six rows in one file; `src/moves.ts` and other axes fenced |
| 3 | INVEST-shaped | **✅** independent; testable by one mutant |
| 4 | acceptance testable and measurable | **✅** named castles, counts 25 and 24, mutant green → red, controls unchanged, +6 tests |
| 5 | dependencies known | **✅** `ABC-024` `Done`; none blocking |
| 6 | security/NFR triggers with a measurable target | **✅** count pin 0 / +6 / 0; security not triggered |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`, both directions argued |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
