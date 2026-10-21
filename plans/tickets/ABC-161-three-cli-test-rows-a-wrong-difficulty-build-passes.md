---
id: ABC-161
title: "Three `src/cli.test.ts` rows that a wrong build passes: a level rebuilt on every move, a `/m` regex that accepts `3\\n`, and an `AGENTS.md` slot that drops a level"
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-006
feature: —
---

# ABC-161 — sharpen three existing rows in `src/cli.test.ts` until each wrong build goes red. ZERO production lines, ZERO new tests

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), bundling three LOW gaps that
> sit in one file and go to one builder (the Software Engineer):
> - **`QE-101-a`** (`.grugops/context/qe-ABC-101/notes/…9b0ef449`, verdict `…2fa04d14`): `ABC-101` `A8′`'s
>   equivalence row does not discriminate a level rebuilt on every move;
> - **`SEC-101-a`** (`.grugops/context/secnfr-ABC-101/notes/…4bed890a`): `A3`'s refused values cannot see a `/m`
>   regex;
> - **`QE-101-b`** (`…9b0ef449`): `ABC-065` `A3`'s value check is load-bearing for the digit `4` only.
>
> `QE2-101-a` and `QE2-101-b` (INFO) are closed with no ticket; the reasons are in the decision note. Every gap was
> re-planted at `main` `1671f24f` in a scratch copy outside the repository (`…bapm-cut-followups/notes/…readings-85e8dfdd`).
>
> **Re-worded 2026-10-21 by BA/PM** (subtask `bapm-rework-ABC-161`, decision `…decision-b0020834`, readings
> `…observation-8425f6db`). The SE stopped `ticket-to-pr-ABC-161` before any code (`…67e9ccc1`, readings `…b56b418c`).
> Two merges after the cut had changed what the plants do on base:
> - **`ABC-174`** (`be6a5599`) set level 4 to `blunderRate: 0.05`, so `A8′` already reds P11, at level 4 only.
> - **`f6b63c1c`** put "ADR-0045" into the slot, so P9d went green.
>
> `A1`, `A3`, the problem table and the stale pointers below are rewritten for `main` `afc8d43a`. Its `src/` and
> `AGENTS.md` are byte-identical to `69610c5b`'s. Every base cell was re-taken there in a scratch copy. `A2` and the
> scope of fixes 2 and 3 are unchanged.

## Problem

*User:* the next hop that edits `src/level-seam.ts`, the `--difficulty` parse in `src/cli-options.ts`, the
`AGENTS.md` `Dev / run` slot, or a level's rate in `LEVELS`.

*Pain:* at `afc8d43a`, each of these wrong builds passes the whole default lane, **1987 of 1987** (59 files):

| plant | what it ships | why the row is blind |
|---|---|---|
| **P11-L1, P11-L2, P11-L3**: `createLevelSeam` rebuilds `createLevel(…)` once per move at that one level | level 1, 2 or 3 blunders on every engine move, or on none, for the whole game | `ABC-101` `A8′` (equivalence row) makes 2 calls at seed 7. Draws 0.0117 and 0.0620 both fall below 0.4, 0.2 and 0.1, so both calls decide alike |
| **S2c**: the `--difficulty` lookup becomes `next !== undefined && /^[1-5]$/m.test(next)` | `--difficulty $'3\nx'` is accepted | no value refused by `ABC-101` `A3` holds a newline |
| **P9a–P9e**: the slot's value list drops or adds a word (table below) | the documented level set or colour set is wrong | `ABC-065` `A3` checks `slot.toContain(value)`. Each digit `1`–`5` and the word `black` also occur elsewhere in the slot (`4` in "ADR-0045"; `black` in `-- --colour black`) |

**What the lane already catches, and why fix 1 still stands.**
- P11 (a rebuild at every level) and P11-L4 are **red on base**, at `A8′` "level 4, call 1".
- That catch rests on level 4's rate 0.05 sitting between seed 7's first two draws. A re-cut of level 4 to ≤ 0.0117
  or above 0.0620 blinds the row to P11 again, silently.
- P9d is now blind like the rest: 5 of 5 slot plants pass.

*Value:* the three rows catch the regressions they were written against, at every level and every value word,
without depending on the level table. The delivered code and text are correct.

## Scope

All edits are inside existing `it` blocks of `src/cli.test.ts`:
1. **`ABC-101` `A8′` equivalence:** make the row discriminate a per-move rebuild **at each blunder level, 1 to 4**,
   not at level 4 alone.
   - *Measured option* (scratch prototype, `…observation-8425f6db`; not a delivered head): `call < 3` at seed 7. The
     third draw is 0.9769, so each of levels 1–4 decides differently across the three calls.
   - *Seed `4294967295` no longer qualifies.* It was the old page's other option, but levels 3 and 4 decide alike on
     its draws.
   - *Another seed* is allowed if it meets `A1` and keeps the row's non-vacuity block.
   - The Engineer picks.
2. **`ABC-101` `A3` refused values:** add `"3\n"`. It reds S2c and a `.trim()` implementation.
3. **`ABC-065` `A3` value check:** read each documented value list from the text after its option in the slot
   (`--colour …`, `--difficulty …`), and compare it **set-equal** to that option's accepted values (the same words
   derived from `ACCEPTED_ARGUMENTS`; `COLOUR_VALUES` and `DIFFICULTY_VALUES` in `src/cli-options.ts` are not
   exported). The option-equality half of the row is unchanged. The list is the `|`-joined run; the
   `-- --colour black` example is not a list (P9e's head red in `A3` decides this).

## Out of scope

- **Any production file**, and `AGENTS.md`.
- Re-cutting `LEVELS` or any level's rate.
- `QE-101-c`/`-d`/`-e` (INFO): unchanged.
- Re-wording the slot. The `-- --colour black` example stays; it is load-bearing (`ABC-065`).

## Acceptance (Given/When/Then)

Each plant goes in a scratch copy outside the repository, as one exact-string edit that occurs once. The lane is the
whole default `npx vitest run` (heap 128, multi-file). "Base" is the branch base; "head" is the delivered tip.

| plant | file | the line or text as delivered | becomes |
|---|---|---|---|
| P11 | `src/level-seam.ts` | `const choice = choose(history.position);` | `const choice = createLevel(LEVELS[level as keyof typeof LEVELS], options)(history.position);` |
| P11-L*K*, *K* = 1, 2, 3, 4 | `src/level-seam.ts` | `const choice = choose(history.position);` | `const choice = (level === K ? createLevel(LEVELS[level as keyof typeof LEVELS], options) : choose)(history.position);` |
| S2c | `src/cli-options.ts` | `const value = DIFFICULTY_VALUES.find((candidate) => candidate === next);` | `const value = next !== undefined && /^[1-5]$/m.test(next) ? next : undefined;` |
| P9a / P9b / P9c / P9d | `AGENTS.md` | `--difficulty 1\|2\|3\|4\|5` | `1\|2\|3\|4` / `1\|2\|3\|4\|9` / `1\|3\|4\|5` / `1\|2\|3\|5` |
| P9e | `AGENTS.md` | `--colour white\|black\|random` | `--colour white\|random` |

- **`A1` (`QE-101-a`).**
  - P11-L1, P11-L2 and P11-L3 are each **green on base and red on head**, 3 of 3. On head the failing row is
    `ABC-101` `A8′`'s equivalence row, and its message names that plant's level.
  - P11 and P11-L4 are **red on base and red on head**, at the same row.
  - The delivered seam is green on head.
  - The row's non-vacuity block (level 1's first move at the row's seed is a blunder, and differs from
    `DEFAULT_LEVEL`'s) is kept and green.
- **`A2` (`SEC-101-a`).** S2c is **green on base and red on head**. `resolveOptions(["--difficulty",
  "3\n"])` is refused with `offending: ["3\n"]` on the delivered build.
- **`A3` (`QE-101-b`).** On a scratch copy of `AGENTS.md`, P9a, P9b, P9c, P9d and P9e are each **green on base and red
  on head**, 5 of 5. On head the failing row is `ABC-065` `A3`. The real `AGENTS.md` is green on head.
- **`A4` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.test.ts`. The production-`src/` grep is empty.
  - Every changed line lies inside the three named `it` blocks.
  - `npm test`: the file count and the test count equal base (59 / 1987 at `afc8d43a`; re-read at the branch base),
    and skips are **0**. `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400
    npx vitest run src/cli.real-engine.test.ts` is green. *(Heap prefix added 2026-10-21 by BA/PM, `bapm-rule-QE-159`
    ruling `QE-159-b`: `ABC-173`'s heap guard refuses the bare command. The criterion is unchanged.)*

**Base readings at `afc8d43a`** (`…observation-8425f6db`; they agree with the SE's `…b56b418c` on every shared plant):

| plant | base, whole lane |
|---|---|
| none | 1987/1987, 0 skipped |
| P11, P11-L4 | 1 failed: `A8′` equivalence, "level 4, call 1" |
| P11-L1, P11-L2, P11-L3 | 1987/1987 green |
| S2c | 1987/1987 green |
| P9a, P9b, P9c, P9d, P9e | 1987/1987 green |

On the scratch prototype (`call < 3`, `src/cli.test.ts` alone, 88 tests):
- the unplanted file was 88/88;
- P11-L1, P11-L2 and P11-L3 red at "level N, call 2";
- P11-L4 red at "level 4, call 1".

Fixes 2 and 3 were not prototyped. Their head reds are expected, not measured.

## Dependencies

- **`ABC-096`:** `Done`, merged `b20eb451`. The old "branch after `ABC-096`" order is discharged.
- **`ABC-168` (`Backlog`)** also edits `src/cli.test.ts`, but only `ABC-042` `A10`'s `package.json` pin, a different
  `it` block. Its `AGENTS.md` edit lands outside the `Dev / run` slot. No order is needed; the second to merge rebases.
- `ABC-101`, `ABC-065` and `ABC-174` — `Done`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** 0 test files, 0 tests, 0 spawns. With `call < 3`, fix 1 adds one engine call per level
  (5 levels, an injected clock). The count pin is the bar; no wall bound.
- **Security:** test-only. `SEC-101-a`'s hardening is the reason for fix 2. No input path or dependency changes.

## Test notes

1. **Show each gap first** on the base test, then on head.
2. **Plants in scratch copies only**, including the `AGENTS.md` plants. `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`, plus `CLI_DEEP` (the file is `src/cli.test.ts`'s
   neighbour lane). A QE hop is owed. The UAT waiver is expected; it is measured at the exit.
4. **P11-L*K* is a scratch plant, never a delivered line.** If the Engineer picks a seed over `call < 3`, record that
   seed's first draws in the notes so QE can re-read the per-level reds.

## Size and priority

**`XS`:** three edits inside three existing rows of one file, about thirteen scratch plants. **Not `S`:** no
production code, no new test.

**`P3`:**
- **Not `P2`:** every delivered build is correct. `createLevel` is called once (`src/level-seam.ts:15`), the parse is
  an exact-equality lookup (`src/cli-options.ts:158`), and the slot lists `1|2|3|4|5` (all three re-read at
  `afc8d43a`).
- **Promotion trigger (`P2`):** a ticket is cut or pulled that edits `src/level-seam.ts`, the `--difficulty` parse,
  or the slot's `--difficulty` text. **Added 2026-10-21:** the same holds for a ticket that re-cuts a level's
  `blunderRate` in `LEVELS` (`src/levels.ts`). Until fix 1 merges, the level-4 catch rests on that table.

## Definition of Ready

BA/PM, re-scored 2026-10-21 (`bapm-rework-ABC-161`) at `main` `afc8d43a`. **Result: 10 of 10.** (Was 10 of 10 on
2026-10-17. The SE's stop showed items 1 and 4 had gone stale at the new base, and both are re-met above.)

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** P11-L1..L3, S2c and P9a–P9e each 1987/1987 at `afc8d43a`; P11/P11-L4 red on base, named |
| 2 | scope and out-of-scope clear | **✅** three rows in one file; production, `AGENTS.md` and `LEVELS` fenced |
| 3 | INVEST-shaped | **✅** small; no pull order left |
| 4 | acceptance testable and measurable | **✅** exact plant strings; 9 plants green → red, 2 red on both, equal counts |
| 5 | dependencies known | **✅** `ABC-096` discharged; `ABC-168` named, disjoint row |
| 6 | security/NFR triggers with a measurable target | **✅** 0 / 0 / 0; test-only |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger kept and widened by one clause |
| 10 | no major unresolved blocker | **✅** none; fix 1 is shown meetable on a scratch prototype |

Column moves are the Orchestrator's, except `Backlog → Ready`, which is BA/PM's (made 2026-10-21).
