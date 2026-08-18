---
id: 20260818T161500Z-software-engineer-artifact-ref-branch-diff-and-gate-numbers-9e30c7a4
kind: artifact-ref
by: software-engineer
at: 2026-08-18T16:15:00Z
verified_by:
confidence: high
refs:
  - ABC-106
  - A2
  - A3
  - src/san.parse.test.ts
  - grugops/abc106-ruled-tolerances
supersedes:
---

# Branch, diff shape and the gate numbers as they ran

**Branch** `grugops/abc106-ruled-tolerances`, cut from `main` at `7ea9e1b`. Nothing was committed on
`main` and nothing was merged.

**Diff** — one file, `src/san.parse.test.ts`, **+32 / -14**. `git diff --stat` reports exactly
`1 file changed, 32 insertions(+), 14 deletions(-)`.

**Zero changed assertion lines, measured rather than asserted.** `git diff src/san.parse.test.ts |
grep -E '^[+-].*expect\('` returns **empty**. A second filter — every added/removed line that is
NOT a `//` / `*` / `/**` comment line and NOT an `it(` or `describe(` title line — also returns
**empty**. So every changed line is inside a comment or a title string, which is `A2` as written.

**Gates, all on the branch tip, all run, none reported from memory:**

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | exit **0** — `Checked 62 files in 86ms. No fixes applied.` |
| typecheck | `npx tsc --noEmit` | exit **0**, no output |
| build | `npm run build` | exit **0** (`tsc --noEmit`, emits nothing by design) |
| unit | `npm test` | **999 passed / 999**, **35 files**, exit 0 |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |

**Baseline was captured on the same tree BEFORE the edit and matches after it exactly**: 999 passed
on 35 files, skip 0. A comment-only change had to leave that untouched and it did — the number did
not move, so nothing was reconciled.

**The single file, both sides of the edit: `npx vitest run src/san.parse.test.ts` = 30 passed / 30,
1 file.** Unchanged test count, which is `A2`'s clause.

**`PERFT_DEEP=1 npx vitest run src/perft.test.ts` = 32 passed / 32**, before and after. See the
observation note on where the `32/32` figure belongs.

**`.grugops/test-skips.md` was READ and passed to the checker, never written to.** No row was added.
No `§14-gate#<id>` stamp was emitted; `context.human_admission` is `off` and no `finding` is
admissible on this install.

**Lint did NOT red on files outside `src/`.** The known stale-worktree nested-`biome.json` artifact
did not manifest on this run; `biome.json` was not touched. `npx biome check src/` was therefore not
needed as a scope-check and no scope-check workaround is claimed.
