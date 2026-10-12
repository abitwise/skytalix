---
id: 20261012T045304Z-software-engineer-observation-abc148-a1-five-forms-3f61c0a2
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-148
at: 2026-10-12T04:53:04Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-114
  - ABC-113
  - ABC-043
  - EPIC-006
supersedes:
---

# SE `ABC-148`: `A1` five binder forms, re-planted (code `7acd8db2`, base `3537fe48`)

This note is hand-authored and unsealed (there is no writer or stamp issuer on this install; see
`AGENTS.md`). I ran every reading on 2026-10-12 in my own worktree, on Darwin 25.5.0 with Node
v26.11.0. **I am the author of the sentences these readings support, and they are not validated
(`A5`).** The QE hop must re-plant the forms itself and must not quote these numbers.

## Method

A script in the session scratchpad replaced the `runTurnLoop({ … })` call in `src/cli.ts` with this
scaffold: `const spare = { ...history };`, then `const outcome = await (async () => { <binder>
throw new Error("unreachable"); })();`. The six options were unchanged, and `history,` stayed
shorthand inside the `runTurnLoop(` … `sink,` window. The binders:

- `for (const history of [spare]) return runTurnLoop({…});`
- `for (const run of [spare].map((history) => runTurnLoop({…}))) return run;`
- the same, with the bare `history =>`
- `for (const history in { spare }) return runTurnLoop({…});`
- `try { throw spare; } catch (history) { return runTurnLoop({…}); }`

Each build ran `npx tsc --noEmit` and `npx vitest run src/cli.test.ts`. It was then reverted with
`git checkout -- src/cli.ts`, and `git status --porcelain` was empty every time. The unplanted base
gave `tsc` 0 and 69 / 69.

## Readings

| form | `tsc` exit | file result |
|---|---|---|
| `for…of` (`D4`) | 0 | 69 passed (69) |
| `(history) =>` | 0 | 69 passed (69) |
| bare `history =>` | 0 | 1 failed / 68 passed. `ABC-043` `A1`: "the entry point binds `history` more than once …: expected [ 'history =', 'history =' ] to have a length of 1 but got 2" |
| `for…in` | 2: `src/cli.ts(173,11): TS2322 Type 'string' is not assignable to type 'GameHistory'` | 26 failed / 43 passed. The reds are spawn rows; the first is `ABC-042` `A1`, "expected 70 to be +0" (internal error). `ABC-043` `A1` is green |
| `catch (history)` | 2: `src/cli.ts(173,11): TS2322 Type 'unknown' is not assignable to type 'GameHistory'` | 69 passed (69) |

## Against QE-114's table (`…94a87a28`)

There is no disagreement on any `tsc` exit or on the open/closed split. Differences:

1. The file's totals are 69, not 67, because the file has grown.
2. QE did not record a file result for `for…in` and `catch`. Mine shows that `catch (history)` is
   green on every row, so the typecheck is its only guard. `for…in` also reds 26 behavioural rows,
   which is a runtime consequence of the string key, not this count seeing it.
