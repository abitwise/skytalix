---
id: 20260819T222500Z-qe-e2e-artifact-ref-what-this-hop-touched-b6c7d8e9
kind: artifact-ref
by: qe-e2e
at: 2026-08-19T22:25:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# What this hop touched, what it refused to touch, and how to re-run every number in it

## Branch and commits

`grugops/quality-gate-ABC-043-qe-2026-08-19`, branched off **`grugops/abc043-the-live-session` @
`46457b8`** — the DELIVERY branch, not `main`, as the brief requires.

| commit | what |
|---|---|
| `d7f57cc` | `chore(queue)` — the claim taken by hand (bare `mkdir`), subtask placed under `claimed/` |
| `1b3cf47` | `docs(context)` — the ruling note on the rig extension |
| `439b5f4` | `docs(context)` — nine mutants, five survivors, the third blind guard |
| `299e4ca` | `docs(context)` — the gate I ran and the game I played; the instant-opponent assessment |
| `cc17743` | `docs(context)` — the verdict and the seven-gap register |

## The delivered diff, measured rather than described

```
git diff --numstat 54cbb23 46457b8 -- src
704  54  src/cli.test.ts
 91  17  src/cli.ts
```

`git diff --stat 54cbb23 46457b8` over `turn-loop.ts`, `frame.ts`, `render-seam.ts`, `line-input.ts`,
`engine.ts`, `move-input.ts`, `command-input.ts` — **empty. All seven byte-identical.**
`grep -n "export" src/cli.ts` — **nothing.** `ADR-0011` clause 4 intact.

## What THIS hop changed

**Zero lines under `src/`.** Zero lines anywhere outside `.grugops/context/` and `.grugops/queue/`.

Every mutant was applied to a copy-backed tree and reverted; `git status --short` is empty and the
restored tree re-ran **1189 passed / 39 files**, `user 13.86 s`.

- **`plans/board.md`** — NOT opened. The `In Review` exit this role owns is **not taken**: `G-01` is
  unruled and the brief forbids moving a column.
- **`plans/traceability.md`** — NOT edited.
- **`plans/tickets/ABC-043-the-live-session.md`** — NOT edited.
- **No ADR opened.** `G-01` may need one; opening it is Architect/Design's.
- **`.grugops/test-skips.md`** — NOT written. It is human-owned; I read it and ran the checker.
- **Not merged. Not deployed.**

## How to re-run every number in these notes

In a contained agent worktree (`npm install` first — a fresh worktree has no `node_modules`; the repo
root is contaminated and has cost three bad measurements):

```
npx vitest run                                                            # 1189 / 39
npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'   # 0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0      # No findings.
PERFT_DEEP=1 npx vitest run src/perft.test.ts                             # 32
npm run lint && npm run typecheck && npm run build                        # clean
printf 'e2e4\n' | npm run chess --silent -- --colour white                # e4 / Nc6 / exit 0
```

**The five surviving mutants, to reproduce them:**

1. `G-02` — in `src/cli.ts`, ``process.stderr.write(`${INTERNAL_ERROR}\n`)`` →
   ``process.stderr.write(`${INTERNAL_ERROR.padEnd(23)}\n`)``. `npx vitest run src/cli.test.ts` → 50 passed.
2. `G-04` — hoist the `runTurnLoop` options into `const options = ({ … });`, add
   `humanColour: colour as "white" | "black"`, call `runTurnLoop(options)`. `tsc` clean, 50 passed.
   **The parentheses are load-bearing** — without them `ABC-042`'s `sink,\s*\}\)` row reds.
3. `G-03` — the same hoist (parentheses optional) plus `void options.input(newGame(START_FEN));`
   before the loop. `G6`'s own row stays **green**; five other rows red. For the hang, run it on a
   FIFO held open, not on `/dev/null`.
4. `G-05` — swap the two `process.exitCode` assignments between the usage arm and the catch arm.
   50 passed; `node src/cli.ts --colour purple` then exits 70.
5. `G-07` — delete `timeout: 30_000` from `childOf`. Green.

The totality fuzz and the hang probe are throwaway scripts written outside the repository, under the
session scratchpad. **Nothing was written into `src/`, `plans/` or `memory-bank/` at this hop.**

## Queue

Claimed by hand per the install's recorded protocol: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir .grugops/queue/claimed/abc043-qe`. The subtask file and a `claim.md` registry record sit under
it, and it is moved to `.grugops/queue/done/` as the last act of this hop.

**One piece of queue hygiene observed and NOT fixed:** `abc043-the-live-session` was transitioned
`pending` → `done` but its `claimed/abc043-the-live-session/claim.md` directory was left in place. It
is a stale registry record on a finished subtask, harmless to the sweep's TTL logic, and it is the
Orchestrator's to tidy.
