---
id: 20261012T211700Z-qe-e2e-observation-abc101-criteria-children-cli-deep-8ca2ab34
kind: observation
by: qe-e2e
task: qe-ABC-101
at: 2026-10-12T21:17:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - ABC-086
  - ABC-065
  - ABC-042
  - ABC-043
  - ABC-095
  - RISK-002
  - plans/tickets/ABC-101-difficulty-selection.md
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
  - 20261012T205400Z-software-engineer-observation-criteria-a5i-prime-a7-a9-clause-b-c243b4f0
  - 20261012T205700Z-agents-md-scribe-decision-dev-run-slot-landed-le3-wording-3c7e1a90
supersedes:
---

# `ABC-101` criteria re-read by QE on the delivered pair `3ea3e352..98ea0a84` (code `ac8deab1`): every live criterion MET, `CLI_DEEP` 10/10, the 10 doubled children reach their doubles

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Every
reading below was taken by QE at this hop on the tree `98ea0a84` (worktree `../wt-qe-ABC-101`), against the
ticket's criteria, not against the SE's rows. Where QE's own instrument is named, it is in
`probe/readings/` (`*.mts` + `*.out.txt`). `src/` is byte-identical between `ac8deab1` and `98ea0a84`
(`git diff --stat` touches `AGENTS.md`, notes, the page and the trace only).

| criterion | QE's reading | state |
|---|---|---|
| `A1` | `resolveOptions` on `--colour black --difficulty 3` and on the reverse order: `isDeepStrictEqual` true, `{ colour: "black", orientation: "black-bottom", flags: {false,false}, difficulty: 3 }`. Also both orders for levels 1, 2, 4, 5 with `--colour white`: equal | **MET** |
| `A2` | `[]` → 3 = `DEFAULT_DIFFICULTY` = middle of sorted `Object.keys(LEVELS)` (1..5) = `DEFAULT_LEVEL`; max is 5, so the default is not the top | **MET** |
| `A3` (+ extended) | 1..5 each resolve to their number. `0`, `6`, `-1`, `3.5`, `three`, bare `--difficulty` (alone and after `--ascii`): `ok: false`, the offending token named, no `options` key. Extended: the `ACCEPTED_ARGUMENTS` words that `--difficulty` accepts = `["1".."5"]` = `Object.keys(LEVELS)`. QE sweep: 300 near-number spellings outside 1..5 (`-20..39` × plain, leading space, `.0`, `+`, leading `0`): **0 accepted** | **MET** |
| `A4` | struck (ruling 4 withdrawn) | — |
| `A5` | `USAGE` reads `usage: npm run chess -- [--colour white\|black\|random] [--difficulty 1\|2\|3\|4\|5] [--ascii \| --unicode]`. Typed through npm, stdin `/dev/null`, each **exit 0, 0 stderr bytes**: `--difficulty 1`..`5` (five), `--colour black --difficulty 3`, `--difficulty 3 --colour black --unicode`, `--difficulty 1 --ascii`. Refused, exit 1, 0 stdout bytes, usage line on stderr: `--difficulty 6`, bare `--difficulty`, `03`, `three` (each named), `--difficulty=3` (unrecognised) | **MET** |
| `A6` | `npm test` green on `98ea0a84` with the Scribe's slot line (gates in the artifact-ref note); `ABC-065` `A1`/`A3` green. Slot documents `--colour`, `--difficulty 1\|2\|3\|4\|5`, `--ascii`, `--unicode`. See the plants note for how weak `A3`'s VALUE half is (`QE-101-b`) | **MET** |
| `A7`, code half | the test row over `executableCodeOf("cli-options.ts")`: green; `Difficulty = 1 \| 2 \| 3 \| 4 \| 5`, field `readonly difficulty: Difficulty` (no unit) | **MET** |
| `A7`, added-lines half | `git diff -U0 3ea3e352 98ea0a84 -- src/cli-options.ts`: 29 `+` lines, `grep -niE 'depth\|ply\|millisecond\|\bms\b\|nodes?/sec\|budget'` → **0** (exit 1). Raw whole file at the tip: the two tolerated `ABC-042` hits only, `:8` "0.112 ms" and `:149` "simply" (`:129` at base) | **MET** |
| `A8′` (i) equivalence | the row is green; QE's own check: 2 positions (start, a middlegame) × seeds 7 and 4294967295 × levels 1..5 × 3 calls on one seam, step = budget/4 virtual clock: **60 comparisons, 0 mismatches**; level 1's first draw blunders on both positions at seed 7. Gap: the ROW's two calls do not discriminate generator persistence (`QE-101-a`, plants note) | **MET** |
| `A8′` (ii) default | `LEVELS[3]` = `{ budgetMs: 3_000, blunderRate: 0 }` (`src/levels.ts:45`), `DEFAULT_BUDGET_MS = 3_000` (`src/engine.ts:122`), no flag → 3 | **MET** |
| `A8′` (iii) own key | `src/level-seam.ts:14` `Object.hasOwn(LEVELS, level)`; QE: `0`, `NaN`/`Infinity`, `valueOf`, `hasOwnProperty`, `isPrototypeOf`, `length` → `RangeError`; 1..5 build. (The string `"3"` also builds, an own key; reachable only through a cast, `createLevelSeam(level: number)`) | **MET** |
| `A8′` (iv) byte-identical | `git diff --numstat 3ea3e352 98ea0a84` over `turn-loop.ts`, `engine.ts`, `levels.ts`, `search*.ts`, `evaluate*.ts` (and `book*.ts`, `quiescence.ts`, `transposition.ts`, `virtual-clock.ts`, `data/`, `vitest.config.ts`, `package.json`, `tools/`): **empty**. `EngineSeam` unchanged | **MET** |
| `A9` (widened) | `src/` changed: `cli-options.ts`, `cli.ts`, `cli.test.ts`, `cli.real-engine.test.ts`, `engine.test.ts`, new `level-seam.ts` (the one allowed flat module); `AGENTS.md` (the Scribe's hop). New test files **0**. Outside `src/`: the page, the trace, notes only. `engine.test.ts` `-U0`: `@@ -38,0 +39 @@` and `@@ -55,0 +57 @@` (import block), `@@ -861,2 +863,20 @@` = base lines 861–862, the `(i)` `it`'s title and its one `expect`; its `});` (base :863) and `(ii)` are untouched. Count 33 = 33 (smoke) | **MET** |
| `A10` | `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`: **10 passed / 10**, run twice (once verbose: the `ABC-101` `A10` row is among them); **0 `abc095-book-absent-*` before and after each run**. QE's own child, `node src/cli.ts --colour black --difficulty 1 --ascii`, stdin `quit\nquit\n`: book present → `last: e4`, first `> ` after it, stderr empty, exit 0; book-absent scratch copy → `last: Nf3`, first `> ` after it, stderr exactly the one book-absent line, exit 0; copy removed by exact path (0 before, 0 after) | **MET** |

**`ABC-086` `A5`, re-read.** (i′)1: the literal occurs once in `src/cli.ts`. (i′)2: `\bnow\b` in `src/level-seam.ts`
(the module `cli.ts` imports `createLevelSeam` from): 0. (i′)3: as `A8′` (ii). (i′)4: `resolveOptions([])` → 3 =
`DEFAULT_LEVEL`. (ii): no `virtual-clock` import in `cli.ts`, `level-seam.ts`, `levels.ts` or `cli-options.ts`, and the
row's import walk is green. (iii): `src/engine.ts` 0 lines changed base..tip, so trivially comments-only; `ABC-078`
`A1`/`A4` green in the suite. **All MET.** Plants against (i′) are in the plants note: (1)–(4) each red, and one
blind spot (`QE-101-c`, INFO).

**The 10 children doubled at `./book-engine.ts`** (`src/cli.test.ts` :716, :718, :751, :791, :808, :826, :836, :848,
:860, :871; `ABC-095`'s re-targeting). They still reach their doubles:
- **`src/cli.test.ts` ×10** (`CLI_DEEP` unset): 10 of 10 runs exit 0, 78/78 each, 0 pending. The three `mate` rows
  (`ABC-043` `A2`, `ABC-043` `A6` one frame session / one writer, `ABC-044` `A6` the stream ends with the screen) were
  green in every run; `ABC-043` rows 9/9 every run.
- **A direct probe:** the same `registerHooks` rig, with a `./book-engine.ts` double that logs what it is handed,
  on `node src/cli.ts --colour black --difficulty {1,5} --ascii`: `withBook reached; probe function; inner function`,
  then `seam call 1`, exit 0 at both levels. The level seam is built for real and handed to the double, which
  ignores it, exactly as the rig's comment says.
- **The plant that moves the book inside the level seam** (P7) reds 6 of these children's rows, so a regression
  that bypassed the decorator would be seen.

**Edges outside the page** (`probe/readings/edges.out.txt`), for the record: a repeated flag takes the last value
(`--difficulty 3 --difficulty 5` → 5, as `--colour` does; `QE-101-d`, INFO); `--difficulty --colour black` refuses
naming `--colour`; `--difficulty 3 3` refuses the stray `3` as unrecognised; full-width `３`, Arabic-Indic `١`,
`3\n`, `3\u0000`, `1e0`, `0x3`, `Infinity`, `NaN`, `toString`, `hasOwnProperty`, `--DIFFICULTY` are all refused.
