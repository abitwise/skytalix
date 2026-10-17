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

## Delivery — 2026-10-17 (Software Engineer, subtask `ticket-to-pr-ABC-157`)

Branch `grugops/ABC-157-castling-one-right`, cut from `aa37f9cb`. The code commit is `968a5843`: +90/−0 to
`src/moves.castling.hardening.test.ts` and nothing else. No timing was read. Evidence is in
`.grugops/context/ticket-to-pr-ABC-157/notes/`; the instrument and raw logs are in `…/probe/`.

- **The gap, shown first, at base `aa37f9cb` (1824 tests on 58 files).** `X-any-right` passes 1824/1824
  with `PERFT_DEEP` unset. `src/moves.ts` md5 is `6335b452fc21ffe2d0f902ecab930840`.
- **`A1` MET.** There are 4 rows (`w K`, `w Q`, `b k`, `b q`). Each first asserts the single right bit, then that
  both of the mover's castles are alive but for the right. Then it checks the one castle by name at
  `generateMoves` and at `legalMoves`, then the count 25, then that the position is unchanged.
- **`A2` MET.** There are 2 rows (`w kq`, `b KQ`). Each first asserts that the mover holds 0 of its own bits and
  the opponent holds both. Then it checks that no castle is offered at either layer, and the count 24.
- **`A3` MET.** The committed ABC-024 harness was re-run with `X-any-right` added: 32 tree states per tree,
  0 harness errors.
  - `X-any-right` is green at base and **red at head on exactly the six new rows**.
  - The seven named ABC-024 mutants and both class controls are killed at base and head, and their
    failure lists are identical apart from ABC-157 rows.
  - EQ01–EQ15 survive at base and head, so this ticket adds 0 kills.
  - Witness on the any-right build: 26 on all six rows.
- **`A4` MET.** `git diff --name-only aa37f9cb 968a5843` lists the one test file, and `-U0` shows 0 removed lines.
  The md5 is unchanged. `npm test` gives 58 files, 1830/1830 (base 58/1824, +6), skip 0, integrity
  `No findings.` Deep perft is 32/32.
- **Gates on `968a5843`:** lint, typecheck, build and `npm test`, all exit 0.
- **Security trigger not fired:** a test-only diff in one file, with no input path, network or dependency.

## QE — 2026-10-17 (QE/E2E, subtask `qe-ABC-157`): **PASS_WITH_GAPS**

I reviewed tip `2202b8eb` (code `968a5843`, base `aa37f9cb`). No timing was read. I planted `X-any-right` from this page's
text on my own runner before I opened the SE's harness. The runs used `git archive` trees outside the repo, the whole
default lane, every `*_DEEP` unset, and the md5 restored after every state. Evidence: `.grugops/context/qe-ABC-157/notes/`
(decision `…5e19b0c3`) and `…/probe/`.

- **`A1` MET.** The 4 one-right rows each give the named castle at both layers, then 25.
- **`A2` MET.** The 2 opponent-only rows each give no castle at either layer, then 24. Each asserts its setup first.
- **`A3` MET.**
  - `X-any-right` survives base 1824/1824. At head it fails 6: exactly the six rows.
  - The committed catalogue, re-run, is byte-identical to the SE's `mutants.base.out` / `mutants.head.out`.
  - The 7 named mutants are killed at base and head with the same lists.
  - 15/15 controls survive at both: 0 kills added.
- **`A4` MET.**
  - One `src/` file, 0 removed lines.
  - md5 `6335b452…` at base, code and tip.
  - 58/1824 → 58/1830 (+6), skip 0, `No findings.`
  - `PERFT_DEEP=1` perft 32/32.
- **Gates at `2202b8eb`:** lint, typecheck, build and `npm test`, all exit 0. `merge-tree` against `main` is clean.
- **UAT-waiver reading:** the production-`src/` grep on `aa37f9cb...2202b8eb` is empty, so the waiver applies.
  Waived, not signed.
- **Gaps, none blocking:**
  - `QE-157-a` LOW: a conjunction variant passes the default lane **and** the deep lane 32/32. It offers the other
    wing's castle only when the mover holds its other right and the opponent holds a right (`w Qk` → `e1g1 e1c1`).
    No row holds mixed rights. Outside this ticket's one-right class.
  - `QE-157-b` INFO: several weaker variants die on one row per colour.
