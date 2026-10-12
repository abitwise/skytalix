---
id: 20261012T050010Z-qe-e2e-observation-abc148-readings-cb622f01
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-148
at: 2026-10-12T05:00:10Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
  - ABC-114
  - ABC-043
  - QE-114-c
  - src/cli.ts
  - src/cli.test.ts
  - plans/tickets/ABC-113-two-instrument-residuals-in-epic-006s-own-test-files.md
supersedes:
---

# QE `ABC-148`: my own readings for `A1`–`A4` and the sixth-form hunt (tip `94ca6c7e`, code `7acd8db2`, base `3537fe48`)

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

I am a separate dispatch from the Software Engineer (Claude Opus 5.5, subagent of the Orchestrator).
I took every reading below on 2026-10-12 in my own worktree `../wt-qe-ABC-148`, on branch
`grugops/qe-ABC-148` off `94ca6c7e`. The machine was Darwin 25.5.0 with Node v26.11.0. I wrote my own
plant generator, and I read the SE's readings note only after these runs. No timing figure was taken.

## Plant method (mine)

A script in the session scratchpad replaced the one `const outcome = await runTurnLoop({ … });` in
`src/cli.ts` with `const outcome = await (async () => { const spare = { ...history }; <binder> })();`.
The six option lines were kept verbatim. `history,` stays shorthand inside the `runTurnLoop(` … `sink,`
window, so only the binder differs. The callback forms use `Promise.resolve(spare).then(<callback>)` as
the host. The SE used `[spare].map(…)`. Each build ran `npx tsc --noEmit` and then
`npx vitest run src/cli.test.ts --reporter=json`. Each was reverted with `git checkout -- src/cli.ts`.
`git status --porcelain` printed 0 lines after every revert, for all 14 builds below. The tip with
nothing planted read `tsc` 0, 69 / 69.

## `A1`: the five forms

| form (binder as planted) | `tsc --noEmit` | `src/cli.test.ts` |
|---|---|---|
| `for (const history of [spare])` (`D4`) | 0 | 69 / 69 passed: **open** |
| `.then((history) => runTurnLoop({…}))` | 0 | 69 / 69 passed: **open** |
| `.then(history => runTurnLoop({…}))` (bare) | 0 | 1 failed / 68 passed. The red is `ABC-043` `A1`: "expected [ 'history =', 'history =' ] to have a length of 1 but got 2" — **counted** |
| `for (const history in { spare })` | **2**, one error, TS2322 "Type 'string' is not assignable to type 'GameHistory'" | 26 failed / 43 passed. The reds by describe: `ABC-042` 5, `ABC-043` 6, `ABC-044` 3, `ABC-045` 1, `ABC-046` 3, `ABC-064` 3, `ABC-115` 5. The child exits 70 (internal error). `ABC-043` `A1` (the count row) is **green** |
| `try { throw spare; } catch (history)` | **2**, one error, TS2322 "Type 'unknown' is not assignable to type 'GameHistory'" | 69 / 69 passed: closed by the typecheck **only** |

The bare-arrow red is my control. It shows that the count row reads the planted source in this
harness, so a green row on the other plants is a real reading and not a stale file.

## Sixth-form hunt (my own; not in the ticket)

The same scaffold was used for these. The three `const` destructures and the renamed binder sit in a
nested `{ … }` block, so `spare` is not read in the inner binder's TDZ.

| form | `tsc` | file |
|---|---|---|
| `H1` `const [history]: [typeof spare] = [spare];` | 0 | 69 / 69: **open** |
| `H2` `const [history] = [spare];` | 0 | 69 / 69: **open** (`noUncheckedIndexedAccess` does not close it) |
| `H3` `const { spare: history } = { spare };` | 0 | 69 / 69: **open** |
| `H4` `.then(function (history) { return runTurnLoop({…}); })` | 0 | 69 / 69: **open** |
| `H5` `.then(({ spare: history }) => runTurnLoop({…}))` | 0 | 69 / 69: **open** |
| `H6` `for (const { spare: history } of [{ spare }])` | 0 | 69 / 69: **open** |

**A scaffold defect, recorded and not counted.** My first run of `H1`–`H3` declared the destructure in
the same scope as `const spare = { ...history }`. That read the inner `history` in its TDZ (TS2448,
TS7022, `tsc` 2, 26 reds). That was my plant's fault, not the guard's. The table above is the re-run
with a nested block.

In every `H` form, `history` is followed by `]`, `}`, or `)`, never by `:` or `=`. A rename puts the
`:` **before** the name. So the regex `/\bhistory\s*[:=]/g` does not see any of them, and `tsc` accepts
each one, because each binds a real `GameHistory`-shaped object.

## `A2` / `A3`: what the delivered text says, against the readings above

- **The comment paragraph** (`src/cli.test.ts`, `ABC-043` `A1`).
  - It names `for…of` and a parenthesised `(history) =>` as open.
  - It says the bare `history =>` is counted ("this row reds it with 2 binders").
  - It names `for…in` and `catch (history)` as closed by the typecheck (`tsc` exit 2: "a `string` key
    and an `unknown` catch binding are not a `GameHistory`").
  - It quotes `/\bhistory\s*[:=]/g`.
  - **All of that matches the five-form table.** It does **not** name `H1`–`H6`, and its sentence
    "The open remainder … is the two" reads as the whole open set. See gap `QE-148-a`.
- **The `ABC-113` page note.** It is dated 2026-10-12 and scoped "of those four forms". It lists the
  same open, closed, and counted split. It matches my readings, and its scope words keep it true.
- **Page line 64 is byte-unchanged.** `cmp` exits 0 for base against tip, and 0 for base against
  `main` @ `0237f9ff`. The line is "false too. `A1` below closes ~~`D3`~~ **the annotated-rebind
  spelling of `D3`** while keeping the".
- **Struck words kept.** At the tip, after `sed 's/~~//g'`, page lines 67–70 are byte-equal (`cmp` 0)
  to base lines 67–70. The page hunks are `-68,2 +68,2` (strike marks) and `+71,5` (the new dated
  correction).

## `A4`: the fence, from git

- `git diff --name-only 3537fe48 94ca6c7e -- src/` lists `src/cli.test.ts` only. Numstat is +7 / −2.
- The added or removed lines under `src/` that do not match `^[-+]\s*//` number **0**.
  - **Filter self-test:** the same predicate on my `F1` plant diff prints 8 lines, so it does catch
    code.
- **Counts at base and tip:**
  - `\bit(` is 69 at both. The unanchored `it(` is 101 at both; it also counts `exit(`, `split(` and
    the like.
  - `\bexpect(` is 324 at both.
  - `(it|describe|test).(skip|only|todo)` is 0 at both.
- **`npm test`:**
  - At base (a detached worktree at `3537fe48`): exit 0, 56 files, 1741 tests, all passed, 0 pending,
    0 todo, `success: true`.
  - At the tip: the identical reading.

## Gates at the tip

- `npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0.
- Skip count (`--reporter=json`, pending + todo) is 0.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No
  findings.` and exited 0.
- `node tools/grugops/host-protection.js` exited **2**. It read 0 protected, 0 unprotected and 1
  `UNKNOWN - verify` (no git remote, no readable HTTP status). The production environment is not
  checked, by design (D-31).

## UAT waiver, measured

`git diff --name-only <A>~1 <B> | grep -v '\.test\.ts$' | grep '^src/'` is **empty** for three
ranges:

- the delivered commit `94ca6c7e~1..94ca6c7e`;
- the code commit `7acd8db2~1..7acd8db2`;
- the whole branch `3537fe48..94ca6c7e`.

The zero-production-lines waiver applies on my reading.
