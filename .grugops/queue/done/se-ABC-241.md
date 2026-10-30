---
subtask: se-ABC-241
role: software-engineer
ticket: ABC-241
ref: .grugops/context/se-ABC-241/
branch: new grugops/ABC-241 from main e42b637b (worktree .claude/worktrees/se-ABC-241)
width: shared (no timed reads at this stage; do not run games or ENGINE_DEEP timing)
---
# SE ABC-241: repetition ignores an uncapturable ep square (ADR-0020 § AMENDMENT 2026-10-30)
## Read
The ticket (all FOLDED blocks; note line ~123: ABC-228 merged with (ii), level 5 = 4 000 ms), ADR-0020 § AMENDMENT
2026-10-30 C1–C4, ADR-0054, ADR-0044 D2 list, how se-ABC-230 built (task `se-ABC-230` notes).
## Do
Build to A1–A9 (test-first encouraged). Gates via `npm run …` (lint, typecheck, unit, build); npm test count.
A10 (smokes) is QE's, ALONE — do not play games. Another session (records only) runs beside you.
## Fences
Only the files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare
`npx`/`npm exec`. No host paths in commits. Scratch in scratchpad `se-241/`.
## Publish
Sealed notes (task `se-ABC-241`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
brief + claim to done/ (tracked copy on your branch if the guard refuses).

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-241` (from main `e42b637b`): code `33540592`; notes, brief and claim in the next commit. Not merged; nothing pushed. No game was played; no timed read was taken.**

- **Build** (decision `…2148e9cf`, artifact observation `…44d5b061`):
  - `repetitionKey(position, key)` in `src/gameend.ts` is the one helper. It removes the ep file iff an ep square is set and `hasLegalEnPassant` is false.
  - `epFileKey(epSquare)` is `src/zobrist.ts`'s one new export.
  - `repetitionKeyHistory(history)` in `src/history.ts`. `repetitionCounts` counts it; `keyHistory` is unchanged.
  - `gameStatus` looks the live position up through the helper. `claimShortfall` counts the new list.
  - `cli.ts` injects `repetitionKeyHistory`. UCI `parsePosition` keeps repetition keys. The blunder root key in `src/levels.ts` is a repetition key: `levels.ts` is the "which module" the ticket left `UNKNOWN - verify`.
- **Acceptance rows** (observation `…887921ba`):
  - A1: 11 rows, including the F8 walk.
  - A3: claim at 5.Ng1, fivefold at 9.Ng1, "2 of 3" after 3.Ng1; base pinned in the same run (7 / 11 / "1 of 3"); the d4xe3 twin keeps base's counts.
  - A4: CLI and UCI play d8e8 at exactly 0; the g5xh6 twin is not 0.
  - A5: CLI list = UCI list key for key; the blunder root = `repetitionKey(root)`.
  - A6: game side, ep-free lists are equal; the search is untouched.
  - A7: after the 0-scored d8e8, `gameStatusOf` reports the claim.
  - A8: the `history.ts` and `uci-session.ts` import lists are pinned.
- **Re-pins** (none protected):
  - the `cli.ts` construction text, in `cli.test.ts` and `engine.test.ts`;
  - the turn-loop `A8` spy door (`keyHistory` → `repetitionKeyHistory`, with `keyHistory` held at 0) and the NFR-002 zero;
  - the UCI `ABC-230 A5` window oracle.
  - An import pin closes the alias evasion.
  - Unedited and green: the zobrist ep rows, the ABC-075 walk, book rows, node pins, `LICENSED_DRIVERS`, `A11-g1`, `ABC-081` A6.
- **Red checks:** 8 mutants, all red. M1 rollback: 17 red. M2 legality ignored: 12. M3 lookup raw: 1. M4 counts raw: 2. M5 claimShortfall raw: 2. M6 UCI raw: 4. M7 blunder raw: 1. M8 aliased import: 1.
- **Gates:** lint, typecheck and build clean. `npm test`: 63 files, 2 245 / 2 245 (base 2 219). Skips 0, `No findings.`
  - G4: fenced src unchanged; identity and node pins green unedited.
  - G9: `LEVELS` / `DEFAULT_LEVEL` / `HARD_CEILING_MS` byte-identical.
  - G10: nothing reddened.
  - G8: informal 9.14–9.65 s under shared width; QE reads it.
- **Findings** (observation `…2136c82c`):
  - SE-241-a LOW: the lookup is unobservable via a real game; pinned on a crafted map.
  - SE-241-b LOW `UNKNOWN - verify`: the NFR-002 per-derive `hasLegalEnPassant` cost.
  - SE-241-c INFO: the C4 cases stay one late.
  - SE-241-d INFO: G8 is informal.
  - SE-241-e INFO: the text pins became regexes, with an import pin added.
- **QE owes:** A10, the smoke pair, ALONE, on the head rebased on main. R at level 5 = 4 000 ms. Report S-1 to S-4, W/L/D, the pooled R, and the count of repetition-ending games, candidate against base. UAT on both surfaces (the QE verdict signs).
- STOP: none.

### Trace row (10 cells, header order)

| ABC-241 | A repetition against the game's earlier positions ignores an ep square no pawn can legally take, in the game-end count and in the search's prior keys; the hash does not change | EPIC-010 | ADR-0020 § AMENDMENT 2026-10-30 C1–C4 (ADR-0054 and ADR-0044 D2 pointer lines) | NFR-002 one hasLegalEnPassant per double push per derive (UNKNOWN - verify); NFR-005 identity (search untouched); NFR-008 G8 informal 9.6 s; NFR-009 list length unchanged | grugops/ABC-241 @ 33540592: src/gameend.ts, src/zobrist.ts, src/history.ts, src/turn-loop.ts, src/cli.ts, src/uci-session.ts, src/levels.ts | src/gameend.test.ts, src/history.test.ts, src/turn-loop.test.ts, src/turn-loop.nfr.test.ts, src/cli.test.ts, src/engine.test.ts, src/uci-session.test.ts, src/levels.test.ts; npm test 63 files / 2 245 pass, skips 0; 8 mutants red | — (UAT owed; QE verdict signs; A10 smokes QE's) | — | In Review (branch, not merged; A10 smokes pending) |
