---
id: 20261012T050640Z-software-engineer-observation-abc148-six-forms-ade9973f
kind: observation
by: software-engineer
task: fix-ABC-148
at: 2026-10-12T05:06:40Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
  - ABC-043
  - QE-148-a
  - QE-148-b
  - 20261012T050010Z-qe-e2e-observation-abc148-readings-cb622f01
supersedes:
---

# SE `fix-ABC-148`: the six extra binders, re-planted by this hop (tip before repair `238acd95`)

Hand-authored and unsealed (no writer or stamp issuer on this install; see `AGENTS.md`). Taken
2026-10-12 in worktree `../cli-chess-example-fix-ABC-148`, Darwin 25.5.0, Node v26.11.0. I am the
SE, the author of the repaired sentence; it is not validated. The six forms are QE's (`…cb622f01`);
the readings below are mine, from my own plant script. No timing taken.

## Method

A scratchpad script replaced `const outcome = await runTurnLoop({ … });` in `src/cli.ts` with
`const outcome = await (async () => { const spare = { ...history }; <form> })();`, the six option
lines verbatim (`history,` stays shorthand). Destructures sit in a nested `{ … }` block (no TDZ read
of the outer `history`). Each build: `npx tsc --noEmit`, then `npx vitest run src/cli.test.ts
--reporter=json`, then `git checkout -- src/cli.ts`; `git status --porcelain` was 0 lines every time.

| form | `tsc` | `src/cli.test.ts` |
|---|---|---|
| unplanted base | 0 | 69 / 69 |
| control: bare `.then(history => runTurnLoop({…}))` | 0 | 1 failed / 68: `ABC-043` `A1`, "expected [ 'history =', 'history =' ] to have a length of 1 but got 2" |
| `H1` `{ const [history]: [typeof spare] = [spare]; return runTurnLoop({…}); }` | 0 | 69 / 69: open |
| `H2` `{ const [history] = [spare]; return runTurnLoop({…}); }` | 0 | 69 / 69: open |
| `H3` `{ const { spare: history } = { spare }; return runTurnLoop({…}); }` | 0 | 69 / 69: open |
| `H4` `return Promise.resolve(spare).then(function (history) { return runTurnLoop({…}); });` | 0 | 69 / 69: open |
| `H5` `return Promise.resolve({ spare }).then(({ spare: history }) => runTurnLoop({…}));` | 0 | 69 / 69: open |
| `H6` `for (const { spare: history } of [{ spare }]) return runTurnLoop({…}); throw …` | 0 | 69 / 69: open |

All six agree with QE's `H1`–`H6`. The control red shows the count row reads the planted source.
Not tried: any seventh family (for example a class field) — `UNKNOWN - verify`;
the repaired wording does not claim completeness for that reason.
