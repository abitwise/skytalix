---
id: 20261030T121603Z-software-engineer-decision-2148e9cf
kind: decision
by: software-engineer
at: 2026-10-30T12:16:03Z
verified_by: 
confidence: high: built to ADR-0020 § AMENDMENT 2026-10-30 as accepted; every choice is pinned by a row
refs:
  - se-ABC-241
  - ABC-241
  - EPIC-010
  - ADR-0020
  - ADR-0054
  - ADR-0044
  - ADR-0002
  - ABC-230
  - grugops/ABC-241
  - 33540592
  - e42b637b
  - src/gameend.ts
  - src/zobrist.ts
  - src/history.ts
  - src/turn-loop.ts
  - src/cli.ts
  - src/uci-session.ts
  - src/levels.ts
supersedes: 
seal: sha256:87c36da48948df01c01997462cff4f98f904012fb28b3b77aae1c3eb43281306
---

# Software Engineer decisions, se-ABC-241: how ADR-0020 § AMENDMENT 2026-10-30 (C1–C3) was built

Built at `grugops/ABC-241` `33540592` from `main` `e42b637b` (ABC-228 merged, level 5 = 4 000 ms). The hash, TT, book, perft and the search's own per-ply array are untouched.

## The choices the ADR left to the SE
- **The helper (C2):** `repetitionKey(position: Position, key: bigint): bigint` in `src/gameend.ts`, exported. It returns `key` when `epSquare === NO_SQUARE` or `hasLegalEnPassant(position)`, else `key ^ epFileKey(position.epSquare)`. The caller hands the Zobrist key in, so each call site does one hash read. `gameend.ts` already imported `legal.ts` and `zobrist.ts`; it now also imports `NO_SQUARE`, `hasLegalEnPassant` and `epFileKey`. No module gained a `legal.ts` import.
- **The zobrist export (C2):** `epFileKey(epSquare: number): bigint`, a pure read of `EP_FILE[fileOf(epSquare)]`. No import edge changed.
- **The list (C3, game end):** `repetitionKeyHistory(history): bigint[]` in `src/history.ts`, `keyHistory`'s replay with the helper on each position. `keyHistory` is unchanged and stays the hash list. `repetitionCounts` counts the new list and is still the one `positionCounts` supplier. `history.ts`'s import modules are unchanged (it adds a name from `gameend.ts`, already imported).
- **The lookup (C3):** `gameStatus` looks the live position up with `repetitionKey(position, zobristKey(position))`, only when a counts map is passed.
- **claimShortfall (C3):** counts `repetitionKeyHistory`. `turn-loop.ts` imports that name instead of `keyHistory`.
- **CLI (C3):** `cli.ts` injects `repetitionKeyHistory` as `createLevelSeam`'s third argument, in place of `keyHistory`. Biome breaks the call over lines.
- **UCI (C3):** `parsePosition` pushes `repetitionKey(position, zobristKey(position))` for every position it keeps. `uci-session.ts`'s one new import is `gameend.ts`, which is `ADR-0044` D2's dated line.
- **The blunder path:** this resolves the ticket's `UNKNOWN - verify`: the module is `src/levels.ts` (`createLevel`). The appended root key is `repetitionKey(position, zobristKey(position))`. Its import list is unchanged (`gameend.ts` was already there).

## Re-pins (none in A2's or A8's protected set)
- `src/cli.test.ts` `ABC-043 A1` and `src/engine.test.ts` `ABC-086 A5 (i′)`: the `cli.ts` construction text now names `repetitionKeyHistory` and spans lines. The options object is unchanged. A new row pins `cli.ts`'s history import by name, which closes an alias evasion (`keyHistory as repetitionKeyHistory`) that the text pins alone would let through. Red-checked.
- `src/turn-loop.test.ts` `ABC-021 A8`: the ledgered refused-claim derive moved from `keyHistory` to `repetitionKeyHistory`. Both are spied, `keyHistory` is held at 0 and the counts are unchanged. `src/turn-loop.nfr.test.ts` gains the same zero on `repetitionKeyHistory`, so a per-ply replay through the new door is still caught.
- `src/uci-session.test.ts` `ABC-230 A5` (the window starts at the last pawn move): the oracle is now `repetitionKeyHistory`. The oldest key, after `e7e5`, carries an uncapturable e6, so it is the one key that differs from the hash list. That is asserted.
- **Unedited and green:** the `zobrist.test.ts` ep rows, the `ABC-075` oracle walk, book rows, every node pin, `LICENSED_DRIVERS` (`history-pane.nfr.test.ts`), `A11-g1`, the `ABC-081` `A6` rows, the `levels.test.ts` `A8` import list, and `QE-087-a`.
