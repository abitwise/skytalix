---
id: 20261009T161000Z-qe-e2e-observation-abc102-criteria-a1-a9-reproduced-gates-48-1485-0-coverage-100-90c804d2
kind: observation
by: qe-e2e
at: 2026-10-09T16:10:00Z
verified_by:
confidence: high
refs:
  - ABC-102
  - ADR-0021
  - ABC-035
  - src/command-input.ts
  - src/command-input.test.ts
  - grugops/qe-ABC-102
supersedes:
---

# `ABC-102` criteria `A1`–`A9`, reproduced independently on `7caead3` (src at `53fd3d2`): all MET

This note is hand-authored and has no `seal`. This install has no sanctioned writer (`AGENTS.md`), so
no `§14-gate#<id>` exists to cite. QE ran this in its own worktree,
`.claude/worktrees/qe-ABC-102`, on branch `grugops/qe-ABC-102`, off `grugops/ABC-102-undo` @
`7caead3`. The main checkout's `node_modules` is symlinked in. 1-min load was 3.1 to 6.5 while this
ran. The `ABC-082` engineer was live on the same machine.

## Gates (reproduced, not read)

| gate | result |
| --- | --- |
| `npm run lint` | exit 0, `Checked 92 files … No fixes applied.` |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 (`tsc --noEmit`) |
| `npm test` | exit 0: **48 files, 1485 passed, 0 failed**, 6.07 s wall, load 3.1–5.1 |
| skip count (`--reporter=json \| jq`) | **0** (1485 total, 0 failed) |
| `test-skip-integrity.js … --skip-count 0` | exit 0, `No findings.` |
| coverage of `src/command-input.ts` from its own test file | **100 / 100 / 100 / 100** (stmts/branch/funcs/lines), 151 tests |

## Criteria. Each was read against the ticket, not against the implementation.

| # | reading | how |
| --- | --- | --- |
| `A1` | **MET.** At ply 4 the outcome is exactly `{kind:"take-back",plies:2,messages:[]}` (key order too). Through the loop, `moves.length` is −2 exactly and the FEN is byte-identical to the one before the human's move. | build rows green; QE probe S1 with the **real engine**: ply 2 → 0, ply 6 → 4 → 2 → 0, and every step matches a fresh replay. S6 covers O-O and an e.p. capture: KQkq, the `d6` e.p. square and the clocks all come back byte-for-byte. |
| `A2` | **MET.** At 0 plies (White) and at 1 ply (Black, engine opened) the outcome is exactly `{kind:"command",messages:["nothing to undo"]}`. Length and FEN unchanged, zero extra derives. | build rows. Probe S1/S2/S4/S5 refuse at 0 and at 1, also right after a successful undo, after `new` and at the floor. Real entry point: `nothing to undo` shown 3× (White) and 2× (Black). Mutant M1 (`>= 1`) turns both 1-ply rows red. |
| `A3` | **MET.** Three undos from ply 6 give length 0, `keyHistory` length 1, `START_FEN`, and a fourth is refused. | build row; probe S1. **Black's floor is ply 1**: probe S2 goes 5 → 3 → 1, then refused. That follows ruling 3; `A3`'s "start position" applies to White only. |
| `A4` | **MET.** After `undo` on the threefold fixture, `repetitionCounts` equals a fresh replay entry for entry, and `keys = plies + 1`. | build row; the probe checks this at **every prompt of every session** (242 checks). S3: `claim` after undo reads `repetition 2 of 3`, so the counts really did rewind. |
| `A5` | **MET.** The frame before had a claim; the frame after has `claimable` undefined, for exactly one derive. | build row; probe S3. Replaying the two undone plies brings the claim back, and `claim` then draws by `threefold-repetition`. |
| `A6` | **MET.** `undo`/` UNDO `/`Undo` are classified before the grammars, with 0 calls to either resolver and 0 derives. `und`/`undoo`/`undo 2` fall through. The table is consulted before either grammar (`resolvePromptLine` calls `classifyCommand` first). | build rows; probe S7 through the **real reader**: `UNDO`, ` undo `, `undo\t`, `undo\r\n`, `\tUnDo\r\n` all undo. `undo2`, `un do`, `undo 2`, `und`, `undoo`, `u`, `undo!` are rejected with `type e2e4 or Nf3`, and nothing changes. S8: no SAN of 144 legal moves over 6 positions (promotions included) folds to a table token, and `resolveMoveInput("undo"…)` is never a move. |
| `A7` | **MET.** The take-back lands on its own line with no confirmation, and `undo` clears an armed `quit`. | build rows; probe S5: quit → undo (takes back 2) → quit asks again; quit → **refused** undo → quit asks again; quit quit exits with the `quit` notice. |
| `A8` | **MET.** `helpMessages()` is exactly the table's tokens with no heading. `ABC-035` `A7` stays green, with hidden count 0. | build rows; probe S9 renders `help` on the **real** render seam: unicode/ascii × white/black-bottom × start/ply1/ply6/claimable, hidden 0 in all 16. Real entry point: `help board quit claim` / `resign new undo`, no `(+`. |
| `A9` | **MET.** `git diff --name-only 4c5eddc 7caead3 -- src/` lists exactly `src/command-input.test.ts` and `src/command-input.ts`. `turn-loop.ts`, `history.ts`, `line-input.ts`, `cli.ts`, `cli.test.ts` and `frame.ts` are blob-identical at `4c5eddc` and `7caead3`. Skips 0. | `git rev-parse <rev>:<file>` per file |

## The three superseded rows: each one has an equivalent guard

- **Foreign-list row `["moves","undo"]` → `["moves"]`.** The old negative assertion on `undo` is
  now a positive one: `A8` `toContain("undo")` plus `ABC-035` `A4`'s positive half, which loops
  over the table. Mutant Q3 drops `undo` from help, and both of those rows go red.
- **`:459` / `:1121` `COMMAND_TABLE.length + 1` → `COMMAND_TABLE.length`.** Kept in place, with a
  comment naming ruling 6. On their own, these rows cannot see Q3 ("heading kept AND `undo`
  dropped" keeps the length at 7). That gap is closed by `A8`'s
  `toEqual(COMMAND_TABLE.map(token))` / `not.toContain("commands:")` and `ABC-035` `A4`. Mutant
  Q3 is red on both. M3 (heading kept) turns all four help rows red, including `ABC-035` `A7` at
  the start position.

## Docblocks (`ABC-114`)

Every sentence that the page's Scope list names was re-read against the code, and each one is true.
"`history` consulted on THREE command paths" is true: `resign`, `new` and `undo`. The header's
"seven commands … for six of them" is true under the module's established reading, where `help`'s
message set is the exception. The out-of-scope files' mentions of `undo` (`turn-loop.ts:121`,
`:382`; `history.ts:93`; `turn-loop.test.ts:259-262`; `coordinate-move.ts:23`) are all still true.
