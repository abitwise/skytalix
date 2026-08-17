---
id: 20260817T140700Z-software-engineer-artifact-ref-branch-commit-tests-and-the-gate-commands-as-they-ran-9c0d1e2f
kind: artifact-ref
by: software-engineer
at: 2026-08-17T14:07:00Z
verified_by:
confidence: high
refs:
  - ABC-062
  - src/cli.test.ts
  - plans/board.md
  - plans/traceability.md
supersedes:
---

# `ABC-062` delivery: branch, commit, tests, and every check as it ran

- **Branch:** `grugops/abc062-refusal-argvs`, off `main` @ `4c5e19e`. **Not merged.**
- **Delivery commit (the one `A6` is measured against):** `edf85f6`
  `test(cli): grug name the two argvs that reach the refusal path untested`.
- **Second commit** carries the queue claim, these notes, the board move and the trace row — process
  artifacts, deliberately kept **out of** the delivery commit so `A6`'s one-path diff is exact.

## `A6`, measured on the delivery commit

```
$ git diff --name-only edf85f6~1 edf85f6
src/cli.test.ts
$ git diff --numstat edf85f6~1 edf85f6
42	0	src/cli.test.ts
```

**Exactly one path. Zero production lines. Zero deletions** — so every fenced merged row is
byte-identical by construction. `expect(spawned).toBe(10)` still reads `10` at `src/cli.test.ts:933`;
no child process was added and none is read by the new block.

## The test added

`src/cli.test.ts:1171-1212` — `describe("ABC-062 — the two command lines that reach the refusal path
untested")`, one `it` covering `A1`, `A2` and `A7`:

| criterion | assertion |
|---|---|
| `A1` | `resolveOptions(["--colour"])` → `.ok` `false`; `.problem` `toContain("white|black|random")`; `.offending` `toEqual(["--colour"])` |
| `A2` | `resolveOptions(["white"])` → `.ok` `false`; `.problem` `toContain("unrecognised")`; `.offending` `toEqual(["white"])` |
| `A7` | `expect(missingValue.problem).not.toBe(unrecognised.problem)` |

The mutation witness for `A1` is in the sibling `observation` note: GREEN 863/863 with the mutant and
without this guard, RED with it.

## Checks, as they ran on the branch tip

| check | command | result |
|---|---|---|
| Test (all) | `npx vitest run` | **864 passed (864)** on **30 files** (863 before) |
| Test (this file) | `npx vitest run src/cli.test.ts` | **37 passed (37)** (36 before) |
| Lint | `npm run lint` | `Checked 54 files in 81ms. No fixes applied.` — **0** |
| Typecheck | `npm run typecheck` | `tsc --noEmit`, **0**, no output |
| Skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| Test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit **0** |

`self_fix_attempts` used: **0 of 2** — nothing needed fixing. **Build was not run separately**: it is
`tsc --noEmit`, the same command as `typecheck`, which ran clean.

## Remaining work, and what this hop did NOT touch

- **The gate has not been run by anyone but me.** These are the engineer's numbers on the branch tip;
  QE re-running them independently is the `In Review` exit.
- **Not merged, per the work order.** The board move is `In Development → In Review` only.
- **`plans/board.md:3`'s header paragraph and `ABC-042`/`ABC-066`'s pages are untouched**, and no
  merged ticket's criteria were re-opened or re-interpreted.
