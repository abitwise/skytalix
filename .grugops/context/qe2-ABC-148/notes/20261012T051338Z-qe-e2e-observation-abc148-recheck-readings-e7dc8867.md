---
id: 20261012T051338Z-qe-e2e-observation-abc148-recheck-readings-e7dc8867
kind: observation
by: qe-e2e
role: qe-e2e
task: qe2-ABC-148
at: 2026-10-12T05:13:38Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
  - ABC-043
  - QE-148-a
  - QE-148-b
supersedes:
---

# QE re-check `ABC-148`: my own plant readings at tip `9c3efd62`, taken before the SE's repair note was read

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.
It was taken on 2026-10-12 in worktree `../cli-chess-example-qe2-ABC-148` (branch
`grugops/qe2-ABC-148` off `9c3efd62`), on Darwin 25.5.0 with Node v26.11.0. No timing was read.

## Method (my own generator, not the SE's)

- **Host.** `plant.mjs` (session scratchpad, not committed) inserts `const spare = { ...history };`
  directly after `const history = newGame(START_FEN);`. This is in the OUTER scope, where the SE put it
  inside the IIFE. The generator then replaces `const outcome = await runTurnLoop({ … });` with
  `const outcome = await <host>;`. The six option lines are verbatim, so `history,` stays a shorthand
  inside the `runTurnLoop(` window.
- **Callback host.** `Promise.resolve(spare).then(…)`.
- **Destructure host.** An async IIFE. The loop host is an async IIFE with `throw new Error("unreachable")`
  after the loop.
- **Each build.** `tsc --noEmit`, then `vitest run src/cli.test.ts --reporter=json`, then
  `git restore src/cli.ts`. `git status --porcelain` was empty before and after each build, 13 times
  out of 13.

## Readings

| # | form planted | `tsc` | `src/cli.test.ts` (69 rows) | reading |
|---|---|---|---|---|
| 0 | unplanted tip | 0 | 69 / 69 | baseline |
| C | control, bare `.then(history => runTurnLoop({…}))` | 0 | 1 failed: `ABC-043` `A1`, "expected [ 'history =', 'history =' ] to have a length of 1 but got 2" | counted |
| 1 | destructure, `const [history] = [spare];` | 0 | 69 / 69 | **open** |
| 2 | callback, `.then(function (history) { return runTurnLoop({…}); })` | 0 | 69 / 69 | **open** |
| 3 | loop object destructure, `for (const { spare: history } of [{ spare }]) { return runTurnLoop({…}); }` | 0 | 69 / 69 | **open** |
| 4 | parenthesised arrow, `.then((history) => runTurnLoop({…}))` | 0 | 69 / 69 | **open** |
| 5 | `for (const history in { spare })` | **2**: TS2322 "Type 'string' is not assignable to type 'GameHistory'" | 26 failed (spawn rows, child exit 70; the count row is green) | closed by `tsc` |
| 6 | `try { throw spare; } catch (history) { return runTurnLoop({…}); }` | **2**: TS2322 "Type 'unknown' is not assignable to type 'GameHistory'" | 69 / 69 | closed by `tsc` only |

**Seventh-family hunt** (step 3 of the subtask):

| # | form planted | `tsc` | `src/cli.test.ts` | reading |
|---|---|---|---|---|
| 7 | declare, then assign as a `for…of` target: `let history; for (history of [spare]) { return runTurnLoop({…}); }` | 0 | 69 / 69 | **open** |
| 8 | declare, then destructuring assignment: `let history; [history] = [spare]; return runTurnLoop({…});` | 0 | 69 / 69 | **open** |
| 9 | its counted twin: `let history; history = spare;` | 0 | 1 failed: `ABC-043` `A1`, `[ 'history =', 'history =' ]` | counted |
| 10 | object-method-shorthand parameter, contextually typed through `satisfies`: `(({ run(history) { return runTurnLoop({…}); } }) satisfies { run(h: typeof spare): unknown }).run(spare)` | 0 | 69 / 69 | **open** |
| 11 | class parameter property: `new (class { constructor(readonly history: typeof spare) {} go() { const { history } = this; return runTurnLoop({…}); } })(spare).go()` | 0 | 31 failed: the count row (`[ 'history =', 'history:' ]`), and every spawn row with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` ("parameter property is not supported in strip-only mode") | closed twice: by the count and by Node's type stripping |

No `using` or labelled-IIFE parameter default was planted. Both put `=` straight after the name
(`using history = …`, `(history = spare)`), so the regex counts them by construction. That reading is
inferred from the regex, not measured.

## The fence, from git, against base `3537fe48`

- `git diff --name-only 3537fe48 9c3efd62 -- src/` lists `src/cli.test.ts` only (+14 / −3).
- Non-`//` added or removed lines under `src/`: **0**. The filter was self-tested on plant 1's diff,
  where it printed 6.
- Anchored counts: `\bit(` 69 and `\bexpect(` 324, at both base and tip.
- `ABC-113` page:
  - Lines 1–66 `cmp` 0 against base. This covers line 64 and its narrowing.
  - Lines 67–70 with `~~` stripped `cmp` 0 against base, so the struck words are kept.
  - The `ABC-148` `A3` correction (lines 71–75) is byte-unchanged since `238acd95`.
  - The text after the corrections `cmp` 0 against base.
  - The repair appends one dated correction (+8 / −0) and strikes nothing.

## Gates at tip `9c3efd62`

- `npm run -s lint`, `typecheck` and `build` each exited 0. Lint reported "Checked 107 files".
- `npm test` exited 0: 56 files and 1741 tests passed. `.test-results/last-run.json` reads
  `success: true`, 0 pending, 0 todo.
- Base `3537fe48` (detached worktree, since removed): `npm test` exited 0, 56 / 1741, 0 pending, 0 todo.
  The lane counts are equal.
- Skip count (`jq '.numPendingTests + .numTodoTests'`) is 0. `test-skip-integrity.js … --skip-count 0`
  printed `No findings.` and exited 0.
- `host-protection.js` exited 2 (`UNKNOWN - verify`, no remote; standing as `QE-148-d`).

## UAT-waiver predicate (measured)

`git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'` is **empty** for `7acd8db2`,
`2208d2a0`, `9c3efd62` and the whole branch `3537fe48..9c3efd62`.
