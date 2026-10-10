---
id: 20261010T152604Z-qe-e2e-observation-abc129-readings-exit-gates-1d84da40
kind: observation
by: qe-e2e
at: 2026-10-10T15:26:04Z
verified_by:
confidence: high
refs:
  - ABC-129
  - N8-LANE
  - src/turn-loop.ts
  - .grugops/context/qe-ABC-129/probe/exit-probe.mjs
  - .grugops/context/qe-ABC-129/probe/controls.mjs
  - 20261010T152604Z-qe-e2e-decision-abc129-verdict-and-site-10-20af9428
supersedes:
---

# QE `ABC-129` readings: criteria, cite-by-cite judgment, exit measurements, controls, gates

This note is hand-authored and unsealed. The worktree `.claude/worktrees/qe-ABC-129` is at
`0ee6424e`, against base `dc90f42d`. Toolchain: Node v26.11.0, TypeScript 5.9.3. `src/turn-loop.ts`
is unchanged between base and tip.

## `A1`: MET

`git grep -nE 'turn-loop\.ts:[0-9]' <rev> -- src` gives **15** at `dc90f42d` and **0** at
`0ee6424e`. The 15 base lines are the table's sites, with #1/#2 at `src/cli.test.ts:590`/`:749` and
#6/#7/#8 at `src/command-input.test.ts:533` and `src/command-input.ts:59`/`:60`. QE also probed
other shapes ("line N" near `turn-loop`, a cite wrapped onto the next line, a bare `:N` comment
line). All gave 0.

## `A2`: MET (one deviation, ruled ACCEPT in `…20af9428`)

`grep -cF <anchor> src/turn-loop.ts` at the tip, with each hit's line:

| anchor | count | lines |
|---|---|---|
| `wasGenerated` | 3 | 212 411 432 |
| `INPUT_ENDED_NOTICE` | 3 | 189 193 348 |
| `claimShortfall` | 2 | 255 378 |
| `EngineSeam` | 2 | 150 162 |
| `PromptOutcome` | 3 | 135 147 325 |
| `InputSeam` (#10) | 3 | 147 161 402 |
| `` `A9b` `` | 2 | 329 409 |
| "TRANSITION 16" | **1** | 361 |
| "The render cadence" | **1** | 279 |
| "Transition 1 → 2" | **1** | 303 |
| "OWNS ONLY THAT THE TRANSITION EXISTS" | **1** | 125 |

Each quoted phrase also gives 1 under `grep -ci`. QE checked that no quoted anchor is split across
lines at its site.

**Cite-by-cite: does the anchor carry the sentence's claim?** Each cite's write-time line was traced
with `git log --reverse -S'<cite>' -- <site file>`, and each was read in `src/turn-loop.ts` at the
tip.

| # | write-time target | anchor at tip | claim carried? |
|---|---|---|---|
| 1 | `c2c5da1e` `:191` `const wasGenerated` | `wasGenerated` `:212` | yes. "all six fields" |
| 2 | `c2c5da1e` `:191-200` `wasGenerated` body | `wasGenerated` (docblock `:207-209` says "wrong `captured` corrupts … exactly as a foreign move") | yes |
| 3 | `c2c5da1e` `:293-309` `A9b` catch | `runTurnLoop`'s `` `A9b` `` arm `:329-343` (repair, then `throw error`) | yes |
| 4 | `db389618` `:312` "Transition 10" line | `INPUT_ENDED_NOTICE` `:189`/write `:348` | yes. The write sits on a non-frame `sink.write` |
| 5 | `753556a4` `:246` `runTurnLoop` docblock | "The render cadence" `:279` | yes for the paragraph. The quoted formula is stale (`QE-129-a`) |
| 6 | `753556a4` `:269` `let status = gameStatusOf` | "Transition 1 → 2" `:303` | yes for "once before the first frame" (`QE-129-d`) |
| 7 | `753556a4` `:319-341` claim branch | "TRANSITION 16" `:361-365` ("adjudicated against … this ply's own evaluation") | yes |
| 8 | `753556a4` `:234` `claimShortfall` | `claimShortfall` `:255` | yes |
| 9 | `91d852e3` `:138` `EngineSeam` | `EngineSeam` `:150` | yes |
| 10 | `69bb1e38` `:135` **`InputSeam`** | `InputSeam` `:147` ("`EPIC-003` replaces it" `:146`) | yes. **Deviation from the table, ACCEPTED** |
| 11 | `69bb1e38` `:291-309` `A9b` catch | as #3 | yes |
| 12 | `69bb1e38` `:176` `INPUT_ENDED_NOTICE` | `INPUT_ENDED_NOTICE` | yes |
| 13 | `a83b933d` `:125` `PromptOutcome` | `PromptOutcome` `:135` | yes |
| 14 | `db389618` `:312` | as #4 | yes |
| 15 | `fd4d374a` `:114-116` `game-over` paragraph | "OWNS ONLY THAT THE TRANSITION EXISTS" `:125` | yes |

**Correction of the SE's record (trivial).** At `db389618`, `:312` is the "Transition 10" comment
line directly above the write, not the write line itself.

## `A3`: MET

- `grep -c 'the seven tokens' src/command-input.ts` gives 1 at base and **0** at the tip.
- Importing `src/command-input.ts` at the tip gives `COMMAND_TABLE.length` **8** and **4** rows with
  `outcome: "command"` (`help`, `board`, `quit`, `moves`). The rows are the same at base, because
  the diff is comment-only.
- The docblock says "the eight tokens … Four are `command`". Its enumeration (4 `command`, `claim`,
  `resign`, `new` and `undo`) sums to 8.

## `A4`: MET

- `git diff --numstat dc90f42d...0ee6424e -- src` lists **9 files**, all of them site files. Outside
  `src/` the branch touches only SE notes, the ticket page and `plans/traceability.md`.
- The ticket's non-comment pipeline prints **0 lines** at the tip commit and at the worktree. No
  `^[+-][+-]` content line escapes the pipeline's first filter.
- Word-level diff: only cite tokens, `seven`→`eight`, `Three`→`Four`, and re-wrap carries
  (`returns`, `deterministic`, and `//` markers moved lines).
- Test note 4: the added lines of `src/cli.ts` contain **0** barred tokens.
- Test files: 52 at base and 52 at the tip. Suite at base (temporary detached worktree, since
  removed): `npm test` exit 0, **52 / 1608**. Suite at the tip: exit 0, **52 / 1608**. The two are
  equal.

## Exit measurements (owner Q4), per production file

These come from `probe/exit-probe.mjs`. Hashes are sha256, first 16 hex characters, of the emit.

| file | (i) changed / regex-comment / AST-comment | (ii) `transpileModule` emit, base = tip | (iii) stripped TS print |
|---|---|---|---|
| `src/cli.ts` | 23 / 23 / 23 | `eb8a971137c3a81c` (2286 B) IDENTICAL | IDENTICAL |
| `src/command-input.ts` | 10 / 10 / 10 | `09a98a56feac5249` (2744 B) IDENTICAL | IDENTICAL |
| `src/engine.ts` | 2 / 2 / 2 | `2cf76b41814806a7` (6787 B) IDENTICAL | IDENTICAL |
| `src/line-input.ts` | 15 / 15 / 15 | `de1c870639dd88f5` (2750 B) IDENTICAL | IDENTICAL |
| `src/move-input.ts` | 3 / 3 / 3 | `1206a1e6f551c3ff` (2270 B) IDENTICAL | IDENTICAL |
| `src/result-screen.ts` | 9 / 9 / 9 | `3dce8d0657339010` (2211 B) IDENTICAL | IDENTICAL |

The test files hold the same way: `src/cli.test.ts` 9/9/9, `src/command-input.test.ts` 8/8/8 and
`src/turn-loop.test.ts` 7/7/7, all IDENTICAL under (ii) and (iii). The QE hashes equal the SE's.

**Controls** (`probe/controls.mjs`, in memory, run against the tip blobs):

| control | (i) changed / regex / AST | (ii) | (iii) | reading |
|---|---|---|---|---|
| N1 `moves` outcome `"command"`→`"claim"` (`command-input.ts`) | 2 / 0 / 0 | DIFFERENT | DIFFERENT | a code change is seen by all |
| N2 `DEFAULT_BUDGET_MS` → `+ 1` (`cli.ts`) | 2 / 0 / 0 | DIFFERENT | DIFFERENT | seen by all |
| P1 comment "eight"→"nine" | 2 / 2 / 2 | IDENTICAL | IDENTICAL | a comment edit passes |
| P2 #10 `InputSeam`→`PromptOutcome` | 2 / 2 / 2 | IDENTICAL | IDENTICAL | the site #10 choice cannot move the exit |
| N3 type-only `text: string`→`String` (`move-input.ts`) | 2 / 0 / 0 | **IDENTICAL** | DIFFERENT | **(ii) is blind to types**, (i) sees it |
| N4 `// a`→`// b` inside a template literal | 2 / **2** / 0 | DIFFERENT | DIFFERENT | **the regex (i) is fooled**, (ii) sees it |

## Gates (worktree at `0ee6424e`; load1 10.7 to 15.9 with sibling hops live)

| command | result |
|---|---|
| `npm run lint` | exit 0, "Checked 100 files … No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, 52 files / **1608 passed**, 6.79 s |
| skip count (`vitest --reporter=json`, pending + todo) | **0**. `success: true`, 1608 / 1608 |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `node tools/grugops/lane-inventory.js` | "The lane collects 52 test files; git tracks 52." `No findings.`, exit 0 |
| `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` | exit 0, **7 passed**, 6.43 s |
| `PUZZLE_DEEP=1 npx vitest run src/puzzle-suite.test.ts` | exit 0, **17 passed**, 35.4 s; solved **58/62** = baseline 58/62. QE ran it because the owner's trigger names `src/engine.ts` literally |

The gates were re-run after the QE commit: see the trace row.

**Lanes NOT run, by QE's call:**
- `ENGINE_DEEP=1` on `src/engine.test.ts`. The SE ran it: 46 passed, 312 s.
- `ENGINE_DEEP=1` on `src/levels.test.ts`.

Reasons:
1. (ii) and (iii) prove the executable and the typed code of `src/engine.ts` are identical.
2. Every raw-source read of an edited file sits in the DEFAULT lane, and that lane ran green: the
   `engine.test.ts` A4 / ABC-086 A5 block reads `engine.ts`/`cli.ts`, and `line-input.test.ts`'s
   `deliveredCode` reads `line-input.ts`.
3. The deep blocks (`engine.test.ts` `if (RUN_DEEP)` from `:931`) are behavioural, with no source
   reads.
4. `levels.test.ts` reads only `levels.ts`, which is unchanged.

`vitest list` collects 46 (33 default) for `ENGINE_DEEP` `engine.test.ts`, and 28 for the levels
lane. AGENTS.md records 45 (32) for the engine lane (`QE-129-e`).

`N8-LANE`: 0 test files added, so 0 ms. Security is not triggered: no executable line changed.
