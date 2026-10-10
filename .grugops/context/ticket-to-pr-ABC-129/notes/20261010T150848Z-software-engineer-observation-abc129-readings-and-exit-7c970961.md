---
id: 20261010T150848Z-software-engineer-observation-abc129-readings-and-exit-7c970961
kind: observation
by: software-engineer
at: 2026-10-10T15:08:48Z
verified_by:
confidence: high
refs:
  - ABC-129
  - QE-051-c
  - QE-051-d
  - N8-LANE
  - 20261010T150848Z-software-engineer-decision-abc129-cite-shape-and-site-10-0ec65506
  - 20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17
supersedes:
---

# `ABC-129` readings: premise, gates, criteria, and the Q4 exit measurements

This note is hand-authored and unsealed. Branch `grugops/ABC-129-turn-loop-cites-by-symbol`, base
`dc90f42d`, code `ed402c1e`. Node v26.11.0, TypeScript 5.9.3.

## Premise at `dc90f42d`, read before editing

- `git grep -nE 'turn-loop\.ts:[0-9]' -- src` printed **15** lines, the same 15 sites as the table.
- Two of those lines moved: #1 is now `src/cli.test.ts:590` and #2 is `:749`, after `ABC-133`. #6 is
  at `src/command-input.test.ts:533`, and #7/#8 are at `src/command-input.ts:59`/`:60`.
- Every anchor resolved in `src/turn-loop.ts` on the re-score's lines (`:212`, `:189`, `:255`,
  `:150`, `:135`, `:329`, `:361`, `:279`, `:303`, `:125`).
- `src/command-input.ts:91` read "the seven tokens … Three are `command`". `COMMAND_TABLE` has 8
  rows, and 4 have `outcome: "command"`.

## Gate (worktree, code as committed at `ed402c1e`)

| command | result |
|---|---|
| `npm run lint` | exit 0, "Checked 100 files … No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **52 files / 1608 passed**, 6.1 s, load1 5.80 before the run. **Base (stash): 52 / 1608**, exit 0 |
| skip count (`vitest --reporter=json`, pending + todo) | **0** |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | "The lane collects 52 test files; git tracks 52." `No findings.`, exit 0 |
| `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` (AGENTS.md trigger: `src/cli.ts`/`src/engine.ts` changed) | exit 0, 7 passed, 6.4 s |
| `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` (AGENTS.md trigger: `src/engine.ts` changed) | exit 0, **46 passed**, 312 s. AGENTS.md still records 45; the count is reported as read |

Lanes NOT run: `ENGINE_DEEP` on `src/levels.test.ts`, and `PUZZLE_DEEP` (QE's trigger). The
comment-stripped emit of `src/engine.ts` is byte-identical (below), so they would execute the same JS.
Running them is QE's call.

**Test note 4 (`src/cli.ts` bar 1 reads comments):** the new words in `src/cli.ts` are `runTurnLoop`,
`` `A9b` `` and `INPUT_ENDED_NOTICE`. None contains a barred token, and the whole suite is green,
including `src/cli.test.ts` (67).

## Criteria

- **`A1`:** 15 on the base, **0** at `ed402c1e`.
- **`A2`:** `grep -cF` in `src/turn-loop.ts` at the tip:

  | anchor | count |
  |---|---|
  | `wasGenerated` | 3 |
  | `INPUT_ENDED_NOTICE` | 3 |
  | `claimShortfall` | 2 |
  | `EngineSeam` | 2 |
  | `PromptOutcome` | 3 |
  | `InputSeam` | 3 |
  | `` `A9b` `` | 2 |
  | "TRANSITION 16" | 1 |
  | "The render cadence" | 1 |
  | "Transition 1 → 2" | 1 |
  | "OWNS ONLY THAT THE TRANSITION EXISTS" | 1 |

  - Anchors by site: #1/#2 `wasGenerated`; #3/#11 `` `A9b` ``; #4/#12/#14 `INPUT_ENDED_NOTICE`;
    #5 "The render cadence"; #6 "Transition 1 → 2"; #7 "TRANSITION 16"; #8 `claimShortfall`;
    #9 `EngineSeam`; **#10 `InputSeam`** (a deviation, see decision `…0ec65506` §3); #13
    `PromptOutcome`; #15 "OWNS ONLY THAT THE TRANSITION EXISTS".
  - No quoted anchor is split across lines at its site.
- **`A3`:** `grep -c 'the seven tokens' src/command-input.ts` = 0. The docblock says "eight" and
  "Four", and importing `src/command-input.ts` gives `COMMAND_TABLE.length` 8 and 4 `command` rows.
- **`A4`:** `git diff --numstat dc90f42d ed402c1e -- src` lists 9 files, all of them site files, and
  the ticket's non-comment pipeline prints nothing:

  | file | + | − |
  |---|---|---|
  | `src/cli.test.ts` | 5 | 4 |
  | `src/cli.ts` | 12 | 11 |
  | `src/command-input.test.ts` | 5 | 3 |
  | `src/command-input.ts` | 5 | 5 |
  | `src/engine.ts` | 1 | 1 |
  | `src/line-input.ts` | 8 | 7 |
  | `src/move-input.ts` | 2 | 1 |
  | `src/result-screen.ts` | 5 | 4 |
  | `src/turn-loop.test.ts` | 4 | 3 |

## Exit measurements (owner Q4, `…5c8e2a17`), per production file

- **(i) changed lines** are `+`/`−` lines in `git diff -U0`. **Comment lines** are those that match
  `^[+-][[:space:]]*(\*|/\*\*|\*/|//)`.
- **(ii)** is `ts.transpileModule(src, { removeComments: true, target: ESNext, module: ESNext })` at
  `dc90f42d` and at `ed402c1e`. The hash is sha256, first 16 hex characters.

| file | (i) changed / comment | (ii) base | (ii) tip | (ii) |
|---|---|---|---|---|
| `src/cli.ts` | 23 / 23 | `eb8a971137c3a81c` (2286 B) | same | IDENTICAL |
| `src/command-input.ts` | 10 / 10 | `09a98a56feac5249` (2744 B) | same | IDENTICAL |
| `src/engine.ts` | 2 / 2 | `2cf76b41814806a7` (6787 B) | same | IDENTICAL |
| `src/line-input.ts` | 15 / 15 | `de1c870639dd88f5` (2750 B) | same | IDENTICAL |
| `src/move-input.ts` | 3 / 3 | `1206a1e6f551c3ff` (2270 B) | same | IDENTICAL |
| `src/result-screen.ts` | 9 / 9 | `3dce8d0657339010` (2211 B) | same | IDENTICAL |

- **The test files are identical as well:** `src/cli.test.ts` 9/9, `src/command-input.test.ts` 8/8
  and `src/turn-loop.test.ts` 7/7.
- **Negative control:** on `src/command-input.ts`, changing `moves`'s `outcome` to `"claim"` makes (ii)
  DIFFERENT, and changing "eight" to "nine" in the comment leaves it IDENTICAL. The measurement can see
  a code change.
- **Both measurements hold for all 6 production files.** On the Q4 ruling, the diff counts as zero
  production lines and UAT is WAIVED. The Orchestrator applies the waiver at `Done`.
- **The literal 2026-08-17 git filter** (`grep -v '\.test\.ts$' | grep '^src/'`) still lists the 6
  files. That is exactly the case Q4 rules on.

`N8-LANE`: 0 test files added, so 0 ms. Security is not triggered: no executable line changed.
