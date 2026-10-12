---
id: 20261012T203800Z-software-engineer-observation-criteria-guards-agents-line-3bfd8b9d
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-101
at: 2026-10-12T20:38:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-042
  - ABC-043
  - ABC-061
  - ABC-065
  - ABC-066
  - ABC-109
  - AGENTS.md
  - 20261012T203700Z-software-engineer-artifact-ref-branch-patch-gates-01564e07
supersedes:
---

# Criteria on the probe tree, guards that moved, the A7 reading, and the AGENTS.md line owed

This note is hand-authored and unsealed. Every reading is on the probe tree `c7fbafff`. NOTHING IS DELIVERED.

**Criteria**
- `A1` PASS: `--colour black --difficulty 3` and `--difficulty 3 --colour black` give equal options,
  `{ colour: "black", difficulty: 3, … }`.
- `A2` PASS: `[]` resolves to `DEFAULT_DIFFICULTY` (3). That is the middle of `Object.keys(LEVELS)`, it is below the
  maximum, and it equals `DEFAULT_LEVEL`.
- `A3` PASS: `1`..`5` are accepted, each resolving to its number. Refused with the token named and no options: `0`,
  `6`, `-1`, `3.5`, `three`, `3.0`, `+3`, `03`, `""`, `" 3"`, `constructor`, `__proto__`, and a bare `--difficulty`
  at the end (2 argvs). Extended: the words `--difficulty` accepts equal `Object.keys(LEVELS)`, both ways.
- `A4` STRUCK.
- `A5` PASS: `USAGE` contains `--difficulty` and the separator, every advertised `--difficulty N` resolves, and
  `ABC-066` `A1`–`A3` are green. Run before writing, stdin `/dev/null`, each exit 0: `npm run chess -- --difficulty 5`,
  `npm run chess -- --colour black --difficulty 3`, `npm run chess -- --difficulty 1 --ascii`. `--difficulty 6` and
  a bare `--difficulty` exit 1 with the usage line.
- `A6` FAIL as built: the `AGENTS.md` line is owed, see below. It PASSES in a scratch copy with the line applied.
- `A7` PASS on CODE, 0 hits over executable code. The field is `readonly difficulty: Difficulty` and
  `type Difficulty = 1 | 2 | 3 | 4 | 5`. **A reading choice, disclosed:** the literal raw `grep -niE` over the whole
  file gives **2 hits at base and the same 2 at head**. Both are older `ABC-042` comments that do not cite this
  ruling: line 8, "0.112 ms" (a recorded measurement), and "simply stops" (the `ply` in "simply"). This diff adds 0.
  A literal reading of A7 needs `ABC-042`'s measurement text edited, which is not this hop's. BA/PM/QE to rule.
- `A8′` PASS: seed 7 with `virtualClock(LEVELS[N].budgetMs)` per instance. For all five levels and two calls each, the
  seam's move equals `createLevel(LEVELS[N], { seed: 7, now })`'s. Level 1 is a `blunder` on the start position, and
  its move differs from level 3's. With no flag the level is `DEFAULT_LEVEL`, and `LEVELS[3]` equals
  `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }`. Own-key refusal: `0`, `6`, `3.5`, `NaN`, `constructor`,
  `__proto__` and `toString` each throw `RangeError`. `turn-loop.ts`, `engine.ts`, `levels.ts`, `search*.ts` and
  `evaluate*.ts` are byte-identical (0 lines in the numstat).
- `A9` PASS for the code set: the five files in `…01564e07`, with `level-seam.ts` as the one new flat module and 0 new
  test files. `AGENTS.md` is owed. Closing the ABC-086 red would need a sixth file, `src/engine.test.ts`.
- `A10` PASS: `CLI_DEEP` row, `--colour black --difficulty 1 --ascii`, run from the book-absent copy so the LEVEL
  answers the opening ply. The first frame is the start position with White to move. White's reply is legal by the
  generator. The first `> ` comes after the reply's `last:` row. stderr is exactly the book-absent warning. stdout ends
  with `quit`, exit 0.

**Guards that moved, in the patch**
- Named in advance: `ABC-042` `A6`(iii)'s `--difficulty 3` refusal child became `--level 3` (same spawn, refusal set
  still 6). `ABC-042`'s TABLE gained `--difficulty`, `1`..`5`, and their accepted forms. `ABC-043` `A1`'s `engine:` pin
  moved its inner half to `createLevelSeam(difficulty, { seed: Math.floor(Math.random() * 2 ** 32) })`, with the
  book outside.
- NOT named in advance; criterion text unchanged and nothing loosened: `ABC-061` `A2`/`A3`'s whole-object
  expectations gained `difficulty: 3`, as their comment says a new field must. `ABC-042` `A8`'s numeric-literal
  transcription gained `32` in `cli.ts` (from `2 ** 32`, `ADR-0037` D3) and `2`–`5` in `cli-options.ts`
  (`Difficulty` ordinals), each with its meaning. None is a row count.
- Not touched and red: `ABC-065` `A3` (the Scribe), `ABC-086` `A5`(i) (the stop).
- Owed and not done: an annotation on `ABC-042`'s merged page saying its "anything else, including `--difficulty`"
  row is superseded. That is page text for the resuming hop.

**The `AGENTS.md` line owed** is in `probe/agents-md-dev-run-slot.txt`, old and new byte for byte. **Delta +4 B:
24,569 → 24,573 B** against the 24,576 B budget (`ABC-109` `A5`), so 3 B of headroom are left. It also drops
"merged" and "up to 3 s/move, `DEFAULT_BUDGET_MS`", which become stale once the level can be 4.5 s. Verified in a
scratch copy: `src/cli.test.ts` 78/78.
