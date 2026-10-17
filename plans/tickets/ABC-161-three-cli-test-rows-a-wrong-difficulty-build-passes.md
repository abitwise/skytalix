---
id: ABC-161
title: "Three `src/cli.test.ts` rows that a wrong build passes: a level rebuilt on every move, a `/m` regex that accepts `3\\n`, and an `AGENTS.md` slot that drops a level"
status: backlog
column: Backlog
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

## Problem

*User:* the next hop that edits `src/level-seam.ts`, the `--difficulty` parse in `src/cli-options.ts`, or the
`AGENTS.md` `Dev / run` slot.

*Pain:* at `1671f24f`, each of these wrong builds passes the whole default lane, **1810 of 1810**:

| plant | what it ships | why the row is blind |
|---|---|---|
| **P11**: `createLevelSeam` calls `createLevel(…)` inside the returned function, once per move | level 1 or 2 blunders on every engine move or on none, for the whole game | `A8′` (`src/cli.test.ts:3665`) compares 2 calls; at seed 7 the first two draws decide the same for levels 1 and 2 |
| **S2c**: the `--difficulty` lookup becomes `next !== undefined && /^[1-5]$/m.test(next)` | `--difficulty $'3\nx'` is accepted | no refused value (`:3592`) holds a newline |
| **P9a**: the `AGENTS.md` slot reads `--difficulty 1\|2\|3\|4` | the documented level set drops `5` | `ABC-065` `A3` (`:2262`) checks `slot.toContain(value)`, and `1`, `2`, `3`, `5` occur elsewhere in the slot |

QE's P9b (`1|2|3|4|9`) and P9c (`1|3|4|5`) are blind the same way. Only P9d (dropping `4`) is red. **New at this
cut:** the `--colour` list is blind the same way for one word. **P9e**, the slot reading `--colour white|random`,
passes `src/cli.test.ts` 78 of 78 at `1671f24f`, because `black` also occurs in the slot's `-- --colour black` example.

*Value:* the three rows catch the regressions they were written against. The delivered code and text are correct.

## Scope

All edits are inside existing `it` blocks of `src/cli.test.ts`:
1. **`A8′` equivalence:** make the row discriminate P11. QE measured two fixes: a third call (`call < 3`), or a seed
   whose first two draws differ for level 1 (seed `1` or `4294967295`). The Engineer picks one.
2. **`A3` refused values:** add `"3\n"`. It reds S2c and a `.trim()` implementation.
3. **`ABC-065` `A3` value check:** read each documented value list from the text after its option in the slot
   (`--colour …`, `--difficulty …`), and compare it **set-equal** to that option's accepted values
   (`COLOUR_VALUES`, `DIFFICULTY_VALUES` in `src/cli-options.ts`, or the same words derived from
   `ACCEPTED_ARGUMENTS`). The option-equality half of the row is unchanged.

## Out of scope

- **Any production file**, and `AGENTS.md`.
- `QE-101-c`/`-d`/`-e` (INFO): unchanged.
- Re-wording the slot. The `-- --colour black` example stays; it is load-bearing (`ABC-065`).

## Acceptance (Given/When/Then)

Each plant goes in a scratch copy outside the repository. The lane is the whole default `npx vitest run`.
- **`A1` (`QE-101-a`).** P11 is **green on base and red on head**. The failing row is `A8′`'s equivalence row. The
  delivered seam is green on head.
- **`A2` (`SEC-101-a`).** S2c, with the text above, is **green on base and red on head**. `resolveOptions(["--difficulty",
  "3\n"])` is refused with `offending: ["3\n"]` on the delivered build.
- **`A3` (`QE-101-b`).** On a scratch copy of `AGENTS.md`, P9a, P9b, P9c and P9e are each **green on base and red on
  head**, 4 of 4. P9d is red on both. The real `AGENTS.md` is green on head.
- **`A4` (fences).**
  - `git diff --name-only <base>` lists exactly `src/cli.test.ts`. The production-`src/` grep is empty.
  - Every changed line lies inside the three named `it` blocks.
  - `npm test`: the file count and the test count equal base, and skips are **0**. `CLI_DEEP=1 npx vitest run
    src/cli.real-engine.test.ts` is green.

## Dependencies

- **`ABC-096` (`In Development`) edits `src/cli.test.ts`** (`ADR-0043`'s code fence). **Branch from a `main` that
  contains `ABC-096`'s merge.** This decides the pull order and does not block the cut.
- `ABC-101` and `ABC-065` — `Done`.

## Security / NFR triggers

- **`NFR-008` / `N8-LANE`:** 0 test files, 0 tests, 0 spawns. Fix 1 adds one engine call per level (5 levels, an
  injected clock). The count pin is the bar; no wall bound.
- **Security:** test-only. `SEC-101-a`'s hardening is the reason for fix 2. No input path or dependency changes.

## Test notes

1. **Show each gap first** on the base test, then on head.
2. **Plants in scratch copies only**, including the `AGENTS.md` plants. `git status --porcelain` is empty afterwards.
3. **Mandatory gates:** lint, typecheck, build, `npm test`, plus `CLI_DEEP` (the file is `src/cli.test.ts`'s
   neighbour lane). A QE hop is owed. The UAT waiver is expected; it is measured at the exit.

## Size and priority

**`XS`:** three edits inside three existing rows of one file, about ten scratch plants. **Not `S`:** no production
code, no new test.

**`P3`:**
- **Not `P2`:** every delivered build is correct: `createLevel` is called once (`src/level-seam.ts:15`), the parse is
  an exact-equality lookup (`src/cli-options.ts:158`), and the slot lists `1|2|3|4|5`.
- **Promotion trigger (`P2`):** a ticket that edits `src/level-seam.ts`, the `--difficulty` parse, or the slot's
  `--difficulty` text is cut or pulled.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** P11, S2c and P9a each 1810/1810 at `1671f24f`; P9e 78/78 on the file |
| 2 | scope and out-of-scope clear | **✅** three rows in one file; production and `AGENTS.md` fenced |
| 3 | INVEST-shaped | **✅** small; pull order after `ABC-096` |
| 4 | acceptance testable and measurable | **✅** six plants green → red, one red on both, equal counts |
| 5 | dependencies known | **✅** `ABC-096` shares the file |
| 6 | security/NFR triggers with a measurable target | **✅** 0 / 0 / 0; test-only |
| 7 | test notes present | **✅** three |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3`, promotion trigger named |
| 10 | no major unresolved blocker | **✅** none |

Column moves are the Orchestrator's.
