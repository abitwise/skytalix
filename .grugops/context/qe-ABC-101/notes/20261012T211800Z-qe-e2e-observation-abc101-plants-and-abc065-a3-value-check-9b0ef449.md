---
id: 20261012T211800Z-qe-e2e-observation-abc101-plants-and-abc065-a3-value-check-9b0ef449
kind: observation
by: qe-e2e
task: qe-ABC-101
at: 2026-10-12T21:18:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-065
  - ABC-042
  - ABC-043
  - ABC-087
  - QE-101-a
  - QE-101-b
  - QE-101-c
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
  - 20261012T211700Z-qe-e2e-observation-abc101-criteria-children-cli-deep-8ca2ab34
supersedes:
---

# `ABC-101` plants: 19 planted, 15 caught; one product regression caught by nothing (`QE-101-a`), and `ABC-065` `A3`'s value check is load-bearing for one level digit of five (`QE-101-b`)

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install).

**Count.** 19 plants (P1–P11 with variants, P9a–P9d) plus 2 fix probes (Q1, Q2): 21 scratch copies. Caught: 15. Green: P11
(`QE-101-a`) and the three slot plants P9a–P9c (`QE-101-b`, BA/PM's own LOW).

**Method.** Each plant is exact-string edits (`probe/plants/plant_edits.py`, every old string asserted to occur
once) to a fresh `git archive 98ea0a84` in the session scratchpad (`qe101plants/<name>`), OUTSIDE the
repository, with one `node_modules` symlink. In each copy: the full `npx vitest run` (58 files, 1789 tests,
`CLI_DEEP`/`ENGINE_DEEP`/`SEARCH_DEEP` unset) and `npx tsc --noEmit`. The copy is then removed by the exact path
the runner created. **Plant directories: 0 before and 0 after every plant; `abc095-book-absent-*`: 0 before and 0
after every plant.** The full log, with each plant's diff, is `probe/plants/plants.out.txt`. `tsc` was exit 0 on
every plant, so the type system catches none of them; every catch below is a test row.

| plant | what it does | rows that red (of 1789) |
|---|---|---|
| P1 the seam ignores the level | `createLevel(LEVELS[3], options)` for every level | 1: `ABC-101` `A8′` equivalence ("level 1, call 0") |
| P2 `in` instead of `Object.hasOwn` | `if (!(level in LEVELS))` | 1: `ABC-101` `A8′` own-key row (the `hasOwn` text pin, and `constructor`/`toString`/`__proto__` build) |
| P3 a `Number()` range check | `Number(next)`, integer, 1 ≤ n ≤ 5 | 1: `ABC-101` `A3` (`"3.0"` accepted first) |
| P4 the root passes a fixed level | `createLevelSeam(3, …)` | 4: (i′) check 1; `ABC-043` `A1` `engine:` pin; `ABC-101` `A8′` read-once count (1 ≠ 2); `ABC-042` `A8` numbers (a new `3`) |
| P4b fixed level, shadowed | `difficulty: chosen` destructured, `const difficulty = 3` | 2: `ABC-101` `A8′` read-once count (3 ≠ 2); `ABC-042` `A8` numbers |
| P5 `now` at the root | `{ seed: …, now: Date.now }` | 2: (i′) check 1; `ABC-043` `A1` |
| P5b `now` at the root, old literal kept in a comment | the call passes `now`; a `// was: createLevelSeam(difficulty, { seed: … })` line above it | 1: `ABC-043` `A1` only. **(i′) stays green** (`QE-101-c`) |
| P6 `LEVELS[DEFAULT_LEVEL]` blunders (copy of `levels.ts`) | level 3 `blunderRate: 0.05` | 6: (i′) check 3; `ABC-101` `A8′` default row and equivalence non-vacuity; `levels.test.ts` `A6` ×2, `QE-087-a` |
| P6b `LEVELS[DEFAULT_LEVEL]` other budget (copy) | level 3 `budgetMs: 2_000` | 3: (i′) check 3; `ABC-101` `A8′` default row; `levels.test.ts` `A6` 3 s budget |
| P7 the book moved inside the level seam | `engine: createLevelSeam(difficulty, {seed}, book)`, the seam consults the probe first; no `withBook` | 8: (i′) check 1; `ABC-043` `A1`, `A2` (scripted mate), `A5`, `A7`; `ABC-044` `A3`, `A6`; `ABC-045` `A4` — the doubled children no longer reach their double |
| P8 a constant seed at the root | `{ seed: 42 }` | 3: (i′) check 1; `ABC-043` `A1`; `ABC-042` `A8` numbers |
| P8b constant seed, old literal kept in a comment | `{ seed: 0x2a }` + `// was: …` line | 2: `ABC-043` `A1`; `ABC-042` `A8` (`0x2a`). **(i′) stays green** (`QE-101-c`) |
| P8c constant seed INSIDE the adapter | `createLevel(…, { ...options, seed: 0 })`; the root's literal intact | 1: `ABC-101` `A8′` equivalence ("level 2, call 0") |
| P10 `--difficulty` honoured only first | `token === DIFFICULTY && index === 0` | 2: `ABC-101` `A1` (reverse order refused), `A3` (bare flag after `--colour black`) |
| **P11 a fresh level per move** | the seam calls `createLevel(…)(position)` on every call, so the generator restarts at every move | **0. NOTHING CATCHES IT** (`QE-101-a`) |
| P9a slot `--difficulty 1\|2\|3\|4` | `AGENTS.md` copy | 0 |
| P9b slot `--difficulty 1\|2\|3\|4\|9` | `AGENTS.md` copy | 0 |
| P9c slot `--difficulty 1\|3\|4\|5` | `AGENTS.md` copy | 0 |
| P9d slot `--difficulty 1\|2\|3\|5` | `AGENTS.md` copy | 1: `ABC-065` `A3` ("documented value 4") |
| Q1 (fix probe) `A8′` row with 3 calls, delivered seam | `call < 3` in a copy of `src/cli.test.ts` | 0 (green) |
| Q2 (fix probe) `A8′` row with 3 calls + P11 | as Q1, plus P11 | 1: `ABC-101` `A8′` equivalence ("level 1, call 2") |

## `QE-101-a` (LOW): the `A8′` row does not discriminate a level rebuilt on every move

- The row says "Twice on one instance: the seam keeps the level's own generator across calls". At seed 7 the
  generator's first three draws are 0.0117, 0.0620, 0.9769 (`probe/readings/draws.out.txt`). Levels 1 (rate 0.4)
  and 2 (rate 0.2) both decide blunder, blunder, engine. So calls 0 and 1 decide the same whether the generator
  persists or restarts, and P11 is green on all 1789 rows.
- What P11 would ship: every move of a session draws the generator's FIRST number again, so level 1 or 2 either
  blunders on every engine move or on none, for the whole game. That is a real product defect the suite cannot see.
- The delivered seam is correct: `createLevel` is called once, at construction (`src/level-seam.ts:15`). QE's
  60-comparison check (3 calls per seam, two seeds) has 0 mismatches.
- **The fix is measured, not proposed blind:** a third call (Q1) stays green on the delivered seam and reds P11
  (Q2). A seed whose first two draws differ for level 1 (seed 1 or 4294967295: engine, blunder) would do too.
- **Owner: Software Engineer** (the row). Not a blocker: no shipped behaviour is wrong.

## `QE-101-b` (LOW, BA/PM ruling 6, graded as asked; not fixed)

`ABC-065` `A3`'s last clause checks `slot.toContain(value)` for each value word. The slot already contains, outside
the `--difficulty` span: `1` ×3 ("1 refused", "(1)", `ABC-071`), `2` ×1 ("(2)" in the writing rules), `3` ×2
("level 3", "≤3"), `5` ×1 (`ABC-065`), `9` ×1 (`90-agents-md…`), and **`4` ×0**. So **only `4` is load-bearing**:
dropping `5` (P9a), adding `9` (P9b) or dropping `2` (P9c) stays green; dropping `4` (P9d) reds. **Grade: LOW, as
BA/PM said.** The option-equality half of `A3` is unaffected. The five level words are also read, independently,
off `USAGE` by `ABC-101` `A5`'s row, so the code-side advertisement cannot drift silently. What can drift is the
`AGENTS.md` text. Owner: BA/PM (`ABC-065`'s criterion), at the next `AGENTS.md`-touching ticket.

## `QE-101-c` (INFO): (i′) assertion 1 is satisfied by its literal kept in a comment

(i′)1 is a raw-source `toContain` over `src/cli.ts`, the same instrument as the original row. With the literal kept in
a comment, a root that passes `now` (P5b) or a constant seed (P8b) leaves (i′) green. Both are caught by
`ABC-043` `A1` (the `engine:` regex over `executableCodeOf`) and P8b also by `ABC-042` `A8`. So the property is
covered by composition, and nothing is open. BA/PM refused SE alternative 3 ("the literal in a comment") as a
faked green; this plant shows that alternative would also have been red elsewhere. Owner: BA/PM, to read. No
action is owed.
