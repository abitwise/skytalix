---
id: 20260821T031000Z-ba-pm-observation-the-two-builds-part-on-a-read-only-fd-and-the-re-throw-is-genuinely-reached-7e2d5a91
kind: observation
by: ba-pm
at: 2026-08-21T03:10:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - A10
  - ADR-0016
  - src/cli.ts
supersedes:
---

# THE BRANCH IS NOT DEAD CODE — TWO BUILDS, TWO OBSERVABLE BEHAVIOURS, AND THE CARET LANDS ON THE `throw`

A non-`EPIPE` stdout failure is producible without a full disk: hand the child a **read-only fd as
its stdout**. Two independent instruments, both mine.

## Instrument 1 — `spawnSync` with a read-only fd (QE's shape, re-run)

`fs.openSync("/dev/null", "r")` passed as the child's stdout, `stdio: ["ignore", fd, "pipe"]`.

| build | status | signal | stderr |
|---|---|---|---|
| delivered | **1** | `null` | **1507 bytes** |
| mutant | **0** | `null` | **0 bytes** |

3/3 each, byte-identical across runs.

## Instrument 2 — the shape a criterion can actually use (`childOf`-compatible)

```sh
node src/cli.ts --ascii 1</dev/null; echo NODE_EXIT=$?
```

A per-command **fd-1 input redirection** inside the single `/bin/sh -c` string `src/cli.test.ts`'s
`childOf` already spawns — **zero new `spawnSync` call sites**, so `:1480-1485`'s pin is untouched.
5/5 deterministic on each build: delivered `NODE_EXIT=1`, stderr 1507 bytes; mutant `NODE_EXIT=0`,
stderr 0 bytes.

**THE TRAP IN THAT SHAPE, and it would ship a row that cannot go red.** The redirection binds `node`
alone, so **the wrapper exits `0` on BOTH builds** (`echo`'s status). A row that asserts the
wrapper's own status is green on the fixed, the unfixed and the swallowing build alike. The status
must be read from `NODE_EXIT=` on the captured stdout. Measured, not reasoned: `wrapper_exit=0`,
10/10, both builds.

## The delivered stack, and what it proves

```
src/cli.ts:159
    if ((error                         ).code !== "EPIPE") throw error;
                                                           ^
Error: EBADF: bad file descriptor, write
    at writeSync (node:fs:922:3)
    ...
    at <checkout>/src/frame.ts:244:10
```

**The caret is on the delivered `throw error` itself**, so the re-throw branch is genuinely executed
— it is a live branch with no test, not dead code. **Read the frame list carefully**: those frames
are where the `Error` was CONSTRUCTED (`writeSync`), not where it was thrown. The throw happens later
from the `'error'` emit, **outside `main()`'s `try`**, which is why it escapes as an uncaught
exception (exit `1`, raw stack) instead of becoming the `internal error:` / `70` path — the same
asynchrony that made the original `EPIPE` defect invisible to that `catch`.

## What the mutant's behaviour actually is, stated plainly

The mutant **writes no board at all** — the very first frame write fails — and then tells the shell
**`0`**. That is the false-success end of the exit-code contract `ABC-115` exists to make honest, and
it is worse than the defect being repaired: `1` at least says *something went wrong*.
