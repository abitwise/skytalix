---
id: 20260820T221000Z-qe-e2e-observation-three-more-wrong-builds-at-the-recheck-two-caught-one-green-and-the-transcripts-verbatim-6d40ac91
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-044-recheck-2026-08-20
at: 2026-08-20T22:10:00Z
verified_by:
confidence: high
refs:
  - ABC-043/A1
  - ABC-044
  - ABC-044/A7
supersedes:
---

# Three more wrong builds at the re-check, run against the REPAIRED instrument — two caught, one green — and the transcripts verbatim

**Method, unchanged:** mutate the delivered entry point, run `tsc` and the whole `src/` lane, record
which rows go red, revert, confirm `git status --porcelain` empty. Nothing is read and agreed with.
Every build below typechecks — a decoy that does not compile proves nothing.

| # | constructed build | `tsc` | rows RED |
|---|---|---|---|
| `D1` | the original flat copy: `const decoy = { ...history }; const both = [history, decoy];`, `history: decoy` at the call | **0** | **`ABC-043 A1` ALONE** (1 failed / 1206 passed) |
| `D2` | option order rotated so `sink,` precedes `history,` in the call | — | window truncates -> `A1` **RED** (fails safe, no blind spot) |
| `D3` | **shadowing rebinding across a function boundary** (below) | **0** | **NOTHING — 1207/1207 GREEN** |

## `D1` — the repair bites, verbatim, measured by me

```
$ npx tsc --noEmit
0
$ npx vitest run --dir src
 FAIL  src/cli.test.ts > ABC-043 — the live session > A1 — `runTurnLoop` is called ONCE, with all
       six options, and with no cast and no adapter
 Test Files  1 failed | 39 passed (40)
      Tests  1 failed | 1206 passed (1207)
```

**One row. The right row. No cascade.** This is the build that was 1207/1207 green before the repair.

## `D3` — the survivor, verbatim

```ts
const history = newGame(START_FEN);

const play = async (history: Parameters<typeof runTurnLoop>[0]["history"]) =>
  await runTurnLoop({
    history,
    humanColour: colour,
    render: makeRenderSeam(mode, orientation),
    input: createLineInputSeam({ source: process.stdin, output: sink }),
    engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
    sink,
  });

try {
  const outcome = await play({ ...history });
  const screen = renderResultScreen(outcome, history);
```

```
$ npx tsc --noEmit
0
$ npx vitest run --dir src
 Test Files  40 passed (40)
      Tests  1207 passed (1207)
```

The window's `history,` is the **parameter**, not the hoisted binding; the initializer row and the
once-only `newGame(` count are both satisfied by the untouched line above. **The loop plays a shallow
copy that shares the arrays it mutates, so no behavioural row can see it either** — `A6`'s
byte-for-byte stream comparison included. The first draft of this decoy ALSO renamed the outer
binding and was caught by `ABC-044` `A6`; that red was my scaffolding, not the shadow, so I rebuilt it
until only the shadow remained. **A decoy that is caught by an artefact of how it was built is not a
measurement.**

## The one-row close, probed rather than proposed on faith

Against the same derived view the test asserts over (`executableCodeOf("cli.ts")` — comments
stripped):

```
delivered build   entry.match(/\bhistory\s*[:=]/g)  ->  ["history ="]                 length 1
D3 (shadow)                                          ->  ["history =", "history:"]    length 2
D1 (flat copy)                                       ->  ["history =", "history:"]    length 2
```

`expect(entry.match(/\bhistory\s*[:=]/g)).toHaveLength(1)` is therefore green on the delivered entry
point and red on both decoys. **Not committed** — see the `decision`.

## The gate at the branch tip, re-run at this hop and not inherited

| command | exit | number |
|---|---|---|
| `npx tsc --noEmit` | **0** | silent |
| `npx vitest run --dir src` | **0** | **40 files / 1207 tests / 0 skipped / 2.73 s** |
| `npx biome check src/` | **0** | 68 files |
| `git status --porcelain` after every revert | — | **empty** |
| `git diff --numstat 30482cd HEAD -- <the four frozen files>` | — | **empty** |

`npm run lint` (`biome check .`) is **NOT claimed green**: it exits 1 on the 32 gitignored agent
worktrees under `.claude/worktrees/`, re-measured and unchanged, environmental, no committed file can
fix it. `node tools/grugops/test-skip-integrity.js` was **NOT re-run at this hop** — it needs its
registry argument and my invocation was wrong; the first hop's `No findings.` / exit 0 stands and
this hop added **zero** test files and **zero** skips (`0 pending / 0 todo` is re-confirmed by the
1207/1207 line, which reports no skips). **UNKNOWN - verify** is not needed for it, but the honest
statement is: not re-run here, unchanged by construction.
