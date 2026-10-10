---
id: 20261010T133349Z-qe-e2e-observation-abc104-readings-probe-diff-gates-f3d29d14
kind: observation
by: qe-e2e
at: 2026-10-10T13:33:49Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ABC-031
  - ADR-0004
  - N8-LANE
  - src/coordinate-move.ts
  - 20261010T132825Z-software-engineer-observation-abc104-gates-and-throws-a2addac5
  - 20261010T133349Z-qe-e2e-decision-abc104-verdict-pass-with-gaps-1ad3f484
  - 20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19
supersedes:
---

# `ABC-104` QE readings: probe, the comment-only check three ways, and the gates

This note is hand-authored and unsealed. Branch `grugops/ABC-104-coordinate-move-docblock`, read at
`76237852` (the code commit is `7707f61f`, base `b7cffc52`). QE worked in its own worktree
`.claude/worktrees/qe-ABC-104`. Node v26.11.0, TypeScript 5.9.3. The Engineer's numbers were used
only as pointers. Every reading below is QE's own.

## Probe (`../probe/qe-probe.mts`, output `../probe/qe-probe.out.txt`)

QE wrote its own probe. It does not reuse the Engineer's `probe.mts`. Run it as
`node .grugops/context/qe-ABC-104/probe/qe-probe.mts <worktree-root>`.

| case | call | result |
|---|---|---|
| A2.1 | `(null, "e2e4")` | THREW `TypeError: Cannot read properties of null (reading 'blackToMove')` |
| A2.2 | `(startpos, "e2e4", 42)` | THREW `TypeError: (legal ?? legalMoves(...)).filter is not a function` |
| control | `(startpos, "e2e4")` and `(startpos, "e2e4", legalMoves(startpos))` | `move` both |
| B1 | `(null, "hello")` | `rejected/unreadable`, **no throw** |
| B2 | `(undefined, "")` | `rejected/unreadable`, **no throw** |
| B3 | `(startpos, "hello", 42)` | `rejected/unreadable`, **no throw** |
| B4 | `(null, "e2e4", L)` | `move`, **no throw**: `position` is never read when `legal` is supplied |
| B5 | `(42, "e2e4", L)` | `move`, **no throw** |
| B6 | `(startpos, "e2e4", null)` | `move`: `??` falls back to `legalMoves` |
| B7 / B8 | `legal = "abc"` / `legal = {}` | THREW `TypeError` (`.filter is not a function`) |
| B9 | `({}, "e2e4")` | THREW `TypeError` (`reading '0'`) |
| B10 | `(startpos, "e2e4", [42])` | `rejected/no-such-move`, **no throw** |
| B11 | `(startpos, "e2e4", [null])` | THREW `TypeError` (`reading 'from'`) |
| text domain | 19 hostile `text` values × with/without `legal`, valid `position` | **0 of 38 threw** |

The 19 `text` values are `null`, `undefined`, `42`, `NaN`, `10n`, a `Symbol`, an object with a throwing
`toString`, a `Proxy` whose every trap throws, `["e2e4"]`, `new String("e2e4")`, a lone surrogate, an RTL
override, 10,000,000 `e`s, 10,000,000 spaces followed by `e2e4`, `" E2-E4 "`, `e7e8q`, `e2e4q`, `e2--e4`
and `""`.

## Comment-only (`A3`): three independent checks

1. **Git.** `git log b7cffc52..76237852 -- src/` lists one commit, `7707f61f`.
   `git diff --name-only 7707f61f~1 7707f61f` lists only `src/coordinate-move.ts`. numstat is `8 3`.
   `-U0` shows one hunk, `@@ -30,3 +30,8 @@`. The header closes at `:33` (` */`) at `f76e041`.
   `git diff f76e041 b7cffc52 -- src/coordinate-move.ts` is empty, so the 1–33 frame applies at base.
   The commit `76237852` touches no `src/` file.
2. **Line shape.** Every `+`/`−` line in the `-U0` diff matches `^[+-] \*( |$)`. The filter for
   non-matching lines printed nothing.
3. **Emit.** `ts.transpileModule(..., { removeComments: true })` was run on `b7cffc52:src/coordinate-move.ts`
   and on `76237852:src/coordinate-move.ts`. Both emit 1291 bytes. They are byte-identical, sha256 prefix
   `f59e2c3244e8da62` on both. The compiled code did not change.

## Accuracy against `ADR-0004` clause 2 (`memory-bank/50-decisions/ADR-0004-san-ownership.md:179-204`)

- Clause 2 states **one** caller obligation: "*the supplied list must be the legal moves of the supplied
  position*" (`:201-204`). The new text's "when supplied, the legal move array of that position" matches it.
- Clause 2 states **no** obligation that `position` be "a real `Position`", and **no** type obligation.
  `grep -n -i "real .Position\|real Position\|wrong type\|TypeError\|null position\|validated"` on the
  ADR prints nothing. So "in the same terms `ADR-0004` clause 2 states … a real `Position`" is only half
  sourced. This is gap QE-104-b.
- Clause (2a) `:206` says that `parseSan` "is a total function: every input produces one of the three arms
  and none of them throws". That claim is unscoped, the same width as the sentence this ticket repairs.
  This is INFO item QE-104-d.

## Gates at `76237852` (in QE's worktree; load1 5.2–5.6 before `npm test`)

| command | result |
|---|---|
| `npm run lint` | exit 0, "Checked 98 files in 106ms. No fixes applied." |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 (`tsc --noEmit`; emits nothing) |
| `npm test` | exit 0, **51 files / 1583 passed**, 6.13 s |
| skip count (`vitest --reporter=json`, `numPendingTests + numTodoTests`) | **0**, measured |
| `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `npx vitest run src/coordinate-move.test.ts` | 45 passed |

These lanes were not triggered. `PUZZLE_DEEP` is not triggered because no engine file changed.
`CLI_DEEP` is not triggered because neither `src/cli.ts` nor `src/engine.ts` changed. No deep lane
covers `src/coordinate-move.ts`, and the emit is byte-identical, so no lane result can move.

## UAT waiver, measured

`git diff --name-only 7707f61f~1 7707f61f | grep -v '\.test\.ts$' | grep '^src/'` prints
`src/coordinate-move.ts`. **The waiver does not apply.** The owner's word is needed at `In UAT`, as the
ticket's § Size and priority predicted.
