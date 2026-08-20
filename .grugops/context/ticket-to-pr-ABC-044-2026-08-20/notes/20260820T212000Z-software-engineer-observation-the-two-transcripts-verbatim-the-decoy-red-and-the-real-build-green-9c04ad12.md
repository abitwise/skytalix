---
id: 20260820T212000Z-software-engineer-observation-the-two-transcripts-verbatim-the-decoy-red-and-the-real-build-green-9c04ad12
kind: observation
by: software-engineer
role: software-engineer
task: fix-abc043-a1-adjacency-2026-08-20
at: 2026-08-20T21:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043/A1
  - ABC-044
supersedes:
---

# The two transcripts, verbatim: the decoy build RED on exactly one row, the real build GREEN on all 1207

## (1) The decoy build — `src/cli.ts` mutated, repair in place

Planted exactly as adjudicated:

```ts
const history = newGame(START_FEN);
const decoy = { ...history };
const both = [history, decoy];
void both;
...
await runTurnLoop({ history: decoy, ... });
```

```
$ npx tsc --noEmit
TSC EXIT=0

$ npx vitest run --dir src
 FAIL  src/cli.test.ts > ABC-043 — the live session > A1 — `runTurnLoop` is called ONCE,
       with all six options, and with no cast and no adapter
AssertionError: the `history` option is not the shorthand for the game the entry point built:
  expected 'runTurnLoop({\n      history: decoy,\…' to match /\bhistory,/

- Expected:
/\bhistory,/

+ Received:
"runTurnLoop({
      history: decoy,
      humanColour: colour,
      render: makeRenderSeam(mode, orientation),

      input: createLineInputSeam({ source: process.stdin, output: sink }),
      engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
      sink,"

 ❯ src/cli.test.ts:2055:7

 Test Files  1 failed | 39 passed (40)
      Tests  1 failed | 1206 passed (1207)
```

**`tsc` still 0 — the decoy is a legal build, which is the whole reason it was dangerous.** The
failure is `ABC-043` `A1` and nothing else. Note the received value: the window is the call's own
argument list, so the array element `[history, decoy]` that satisfied the old unanchored row is not
in it. That is the adjacency, restored and observed doing its job.

## (2) The real build — decoy reverted, repair in place

`src/cli.ts` restored byte-identical; `git status --porcelain` showed `M src/cli.test.ts` and nothing
else before the run.

```
$ npx tsc --noEmit
TSC EXIT=0

$ npx vitest run --dir src
 ✓ src/cli.test.ts (55 tests) 24ms
 Test Files  40 passed (40)
      Tests  1207 passed (1207)
   Duration  2.21s

$ npx biome check src/
Checked 68 files in 72ms. No fixes applied.
BIOME EXIT=0
```

**`npm run lint` was NOT run and is NOT claimed.** It is red for the already-adjudicated environmental
reason — 32 gitignored sibling worktrees with nested biome configs — and `npx biome check src/` is the
scoped instrument that answers the same question about this repository's own source. This is the same
substitution recorded on my delivery hop.

## The diff, after the repair

```
$ git diff --numstat 30482cd HEAD -- src/
116     1       src/cli.test.ts   ->  127  1  after this hop
15      1       src/cli.ts        ->  unchanged
281     0       src/result-screen.test.ts
172     0       src/result-screen.ts
```

`src/gameend.ts`, `src/turn-loop.ts`, `src/history-pane.ts` and `src/frame.ts` do not appear — the
four frozen files are byte-identical to `30482cd`, as is `src/result-screen.ts` to my delivery hop.
The repair's whole footprint is +11/-1 in one test file.
