---
id: 20260924T201600Z-qe-e2e-decision-abc046-delta-pass-d1-d2-true-disarm-exactly-as-licensed-a8-holds-42-1364-0-66ca031f
kind: decision
by: qe-e2e
at: 2026-09-24T20:16:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - ABC-114
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/line-input.test.ts
  - src/cli.test.ts
  - src/turn-loop.ts
  - plans/tickets/ABC-046-quit-and-new.md
  - .grugops/context/ruling-abc046-clause6/notes/20260924T195500Z-architect-design-decision-clause-6-stands-as-written-license-the-disarm-a8-amended-to-five-named-edits-no-new-adr-8d2f4b61.md
  - .grugops/context/ticket-to-pr-ABC-046/notes/20260924T200800Z-software-engineer-artifact-ref-rehop-branch-commit-four-files-exactly-the-ruled-list-and-what-was-not-touched-7b0acc2f.md
supersedes: 20260924T194000Z-qe-e2e-decision-abc046-fail-on-two-false-docblock-sentences-behaviour-meets-a1-a8-reading-2-routed-to-architect-m9-guard-enough-d74bb036
---

# `ABC-046` delta re-QE verdict: **PASS**. D1 and D2 now read true. The `disarm` is exactly what the ruling licensed. `A8`'s twice-amended list holds. Gates 42 / 1364 / 0.

**NOT A STAMP.** `context.human_admission` is `off`, and no `finding` is admissible on this install.
This is QE's hand-authored `decision`. It supersedes the first-pass FAIL (`d74bb036`). Everything
below was RUN on branch `grugops/qe-ABC-046-delta`, created from `grugops/wave-2026-09-24` @
`9aec523`. That base carries the re-hop `85b66c6` through merge `d8de765`. `git diff --name-only
5d0fdb0 9aec523 -- src` lists exactly the 4 ruled files. The run used an isolated worktree with the
main checkout's `node_modules` symlinked in (ignored, not committed). The 1-minute load was 4.3–8.5.
**QE added zero tests and changed zero lines under `src/`.** There were 11 mutant rounds plus 3
docblock-probe rounds. After each one the pristine bytes were written back, `sha256` was asserted
equal, and `git status --porcelain -- src` was asserted empty. The harness throws if either check
fails, and none did. The raw files are next to this note as `raw-delta-*.txt`. `A1`–`A7` were MET
in the first pass. This delta pass re-confirms them through the gates and does not re-argue them.

## Ruling 1: D1 and D2 are now TRUE. Every sentence the re-hop added is true under the `ABC-114` standard.

- **D1, `src/command-input.ts:4-5`:** the sentence now reads *"one of **six** commands and, for
  **five** of them"*. `COMMAND_TABLE.length` is **6** (`help, board, quit, claim, resign, new`), and
  `helpMessages()` has 7 items (the heading + 6). This agrees with `:69` and `:75` ("six tokens").
  **TRUE.**
- **D2, `src/command-input.ts:225-227`:** the second armed `quit` answers `{ kind: "quit" }`
  *"without calling `resolvePromptLine` or reading the row's `outcome`, though it has still
  classified the line through `COMMAND_TABLE` by `classifyCommand`, as it does every line."* I
  re-ran the first-pass probe against the new wording and added two probes, each written into the
  file and then restored:
  - **The `quit` row is dropped** (the first-pass probe). `quit` / `quit` answers `rejected` /
    `rejected`, so the path does classify through the table. The "though it has still classified"
    clause is **TRUE**. This is the probe that made the old sentence false.
  - **Counters are placed at the top of `resolvePromptLine` and `classifyCommand`.** On the
    delivered code, the first `quit` makes 1 call to `resolvePromptLine` and 2 to `classifyCommand`
    (one from the wrapper, one inside the pure function). The second `quit` makes **0** calls to
    `resolvePromptLine` and **1** to `classifyCommand`. A third line (`zzz`) makes 1 and 2. So
    "without calling `resolvePromptLine`" is **TRUE**, and so is "as it does every line" (≥ 1 wrapper
    classification per line).
  - **The `quit` row's `outcome` is changed** from `command` to `take-back`. The first `quit` now
    answers `take-back`, which shows the pure function does read the outcome. The second `quit`
    still answers `{ kind: "quit" }`, again with 0 `resolvePromptLine` calls. So "without … reading
    the row's `outcome`" is **TRUE**.
- **The new sentences, all checked TRUE:**
  - `:217`, type docblock: *"Clear the `quit` flag without resolving a line: the reader's over-cap
    branch."* `disarm` only assigns `quitArmed = false`. Its only production caller is
    `src/line-input.ts:248`, on that branch.
  - `:231-234`, wrapper docblock:
    - *"The wrapper does not see every line."* True: the over-cap line returns before the wrapper
      is called.
    - *"… today only the over-cap line … never reaches it"*. Of the reader's three return paths
      (`eof`, over-cap, `resolve`), only over-cap is a submitted line that bypasses the resolve.
      `eof` is not a line, and the ruling exempts it.
    - *"so the reader calls `disarm` instead. `disarm` sets the flag to false and does nothing else:
      it takes no line, returns nothing and calls no resolver."* True by the code (`(): void =>
      { quitArmed = false; }`) and by the disarm unit row's four `deps` spies, which read 0.
  - `line-input.ts:89-91`, cap docblock: *"It is still a line the player submitted, so it clears the
    `quit` confirmation … through the wrapper's `disarm`, which takes no line — the over-cap text
    still reaches no resolver."* True. Sequences S1 and S2 below show the flag cleared. `ABC-037`
    bar 2's "never passes it to a resolver" row is green in both lanes, and `texts` is `[]` in the
    clause-6 reader row.
  - The unchanged sentences in the re-hop's hunks still read true. `:224-225` ("ANY other line …
    clears it") now sits above the new paragraph, which scopes it to the lines the wrapper sees.
    `line-input.ts:10-11` ("holds the `quit` confirmation flag and nothing else") is still true of
    its STATE.

## Ruling 2: the `disarm` is exactly what the ruling licensed. `A8`'s twice-amended list holds.

- **It only clears the flag.** The whole body is `quitArmed = false;`. It takes no argument,
  returns `void` and calls nothing. The resolve body is unchanged apart from its binding line
  (`return (history, line) => {` became `const resolve = (history: GameHistory, line: string):
  PromptLineOutcome => {`). It is attached by `Object.assign(resolve, { disarm })`, which is the
  probed shape.
- **It is called only on the over-cap branch, and has no other callers.** `grep` over `src/` finds
  one production call site, `src/line-input.ts:248`, inside `if (line.overlong) { … }` and before
  the unchanged `return { kind: "rejected", messages: LINE_TOO_LONG_MESSAGES }`. The other two calls
  are in the disarm unit row (`src/command-input.test.ts:866`, `:871`).
- **`A8`:**
  - `git diff --name-only 5d0fdb0 9aec523 -- src` lists exactly the four ruled files.
  - `git diff --stat 5d0fdb0 9aec523` is **empty** over `src/turn-loop.ts`, `src/cli.test.ts`,
    `src/search.ts`, `src/quiescence.ts`, `src/engine.ts` and `src/zobrist.ts`. So `src/turn-loop.ts`
    and `src/cli.test.ts` are **byte-identical**, and the spawn pin is unchanged.
  - The whole ticket, from the pre-build base `d1d431f` to `9aec523`, touches 5 files under `src/`,
    and every one is on the list: `command-input.ts`, `command-input.test.ts`, `cli.test.ts`
    (build), `line-input.ts` (first amendment), and `line-input.test.ts` (second amendment).
    `turn-loop.ts` is not among them.
  - The three rows are exactly the ruled three: `G1`, the disarm unit row, and the clause-6 reader
    row. The reader row sits inside the bar-2 `describe`, and its only import change is
    `QUIT_CONFIRMATION_MESSAGES`.
- **`G5-INFO`, a paper count and not the code:** the non-comment production diff is **+13 / −3**
  (`raw-delta-count.mjs.txt`): `command-input.ts` +9 / −2 and `line-input.ts` +4 / −1. The Engineer's
  artifact-ref, the Delivery (re-hop) section and this subtask brief all say +12 / −3. The Engineer's
  own itemisation (3 + 1 + 5 = 9, not 8) adds up to 13. The ruling's probe said +14 / −3. Nothing
  licensed is exceeded, because the licence names edits and not a line count. Recorded, not
  corrected (`ABC-114`).

## Ruling 3: verdict on the whole ticket is **PASS**

- The two FAIL causes, D1 and D2, are closed: both sentences are true.
- Reading (2) is closed as the ruling decided:
  - `quit` / over-cap / `quit` now asks again. This holds at the seam (S1, S2) and through
    `node src/cli.ts`, where there are 2 confirmations and the run ends on `> input ended`.
  - The clause-6 reader row pins it.
- `G1` is closed: `Q3` is now red on 1 row, the `G1` row.
- `G2-INFO` is closed: `M9` is now red in `src/line-input.test.ts`, not only through the child.
- Gates, run from a node script (`raw-delta-gates-*.txt`):
  - `npx biome check .`: 76 files, no fixes.
  - `npx tsc --noEmit`: 0 for typecheck and 0 for build.
  - `npx vitest run --dir src`: **42 files / 1364 tests**, exit 0, 4.56 s.
  - JSON reporter: pending 0 and todo 0, so the skip count is **0**; 269 suites.
  - `test-skip-integrity`: **`No findings.`**
- `ABC-037` bar 2 is green in both lanes: default file 30 / 30 (8 bar-2 rows); deep lane
  (`INPUT_DEEP=1 NODE_OPTIONS=--expose-gc`) file 34 / 34 (8 bar-2 rows + 4 breadth rows), with 0
  skipped.
- The mutants are in the sibling `observation`. All five ruled mutants (`Q3`, `X1`, `X2`, `X3`, `M9`)
  reproduce the Engineer's table row for row. Of QE's five, four are red. `X6` survives because it
  is **equivalent** (`classifyCommand("")` is always `undefined`), not because of a gap.

## Still open, and none is a FAIL cause

- **`G3-INFO`, still open.** `A6` is asserted for White only: `CHILDREN.renews` runs
  `--colour white`, and `src/cli.test.ts` is byte-identical at this hop and outside the re-hop's
  licence. The behaviour as Black was verified correct in the first pass.
- **`G4-INFO`, still open.** `src/command-input.test.ts:778-779` still reads *"A2/A3/A6 also as
  entry-point children"*, but no `A6` row is in that file. `:205` still titles the sweep *"ABC-035
  A1 — four tokens"*. That is a test comment, not a production docblock.
- **`G5-INFO`, new.** The +12 / −3 paper count (above).
- **`X6` is an equivalent mutant.** It is not a gap.

## Board / fences

The column move is the Orchestrator's. On this verdict the ticket can leave `In Review`. Production
lines are > 0, so the UAT waiver does not apply and the owner's word is still needed at `In UAT`.
`NFR-008` is not ruled. I did not open `src/search.*`, `src/quiescence.*`, `src/engine.*`,
`plans/board.md`, `AGENTS.md` or `plans/nfr-catalog.md`. The fenced files were checked only by
`git diff --stat` and never read. Nothing was merged and nothing was deployed.
