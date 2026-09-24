---
id: 20260924T195500Z-architect-design-decision-clause-6-stands-as-written-license-the-disarm-a8-amended-to-five-named-edits-no-new-adr-8d2f4b61
kind: decision
by: architect-design
at: 2026-09-24T19:55:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/line-input.test.ts
  - plans/tickets/ABC-046-quit-and-new.md
  - memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md
  - .grugops/context/qe-ABC-046/notes/20260924T194000Z-qe-e2e-decision-abc046-fail-on-two-false-docblock-sentences-behaviour-meets-a1-a8-reading-2-routed-to-architect-m9-guard-enough-d74bb036.md
  - .grugops/context/ruling-abc046-clause6/notes/20260924T195200Z-architect-design-observation-disarm-shape-probed-out-of-tree-bar-2-stays-green-three-rows-each-watched-red-on-its-mutant-5c1a7e93.md
supersedes:
---

# `ADR-0021` clause 6 stands as written. The `disarm` is licensed. `A8` is amended to name five edits. No new ADR.

**NOT A STAMP** (`human_admission: off`). This decision is hand-authored. The measurements behind it
are in the sibling `observation` (`5c1a7e93`).

## The ruling

**License the disarm. Do not narrow clause 6.** The flag is *"cleared by any other line"*, and the
over-cap line counts as a line. Every line the player submits must either reach the wrapper's
resolve or call its `disarm`. `eof` is exempt because the session ends there.

## Why: what the player sees

- **The confirmation is a promise on the screen.** `quit again to end` holds for one prompt. On
  every other line the product keeps that promise and then drops it:
  - `zzz` → `type e2e4 or Nf3`, then `quit` asks again;
  - `quit now` → rejected, then `quit` asks again;
  - a 1024-character line → rejected, then `quit` asks again (QE's control);
  - a move or any command → `quit` asks again.
- **The 1025-character line is the one exception.** Its frame says `line too long`, which is
  another rejection with no confirmation on screen. Yet the next `quit` ends the game (QE edge 7,
  reproduced in the sibling note). From the frame, the player cannot tell this rejection from the
  others. Whether `quit` ends the session would hang on one character past the cap. **That is the
  surprise.** It is small. The player did type `quit`, and a lost game in progress is the whole cost.
  But the rule it teaches is false.
- **Narrowing would turn a code seam into a product rule.** "Any other line *the resolver sees*"
  names where the cap happens to sit in `src/line-input.ts`. A player cannot see that.
- **Narrowing also costs more paper.** `ADR-0021` ends with *"Superseding this ADR is done by
  writing a later ADR, not by editing this file"*. An in-place clarification is not open, so
  narrowing means a superseding ADR, which is more words than the fix.
- **The fix is small and measured.**
  - It is +14 / −3 production lines and passes `tsc` and `biome`.
  - It turns 0 of 1361 existing rows red, and 0 of 33 deep `line-input` rows.
  - `ABC-037` security bar 2 stays green. The three rows that `Q9` turns red stay green, and so do
    the three deep flood/breadth rows. `disarm` takes no line and calls no resolver.
  - The real entry point now asks again after `line too long`.

## If a human overrides this and narrows instead (rejected here, recorded so it is not re-derived)

Replacement sentence for clause 6: *"… is cleared by any other line the command layer resolves. A
line the reader refuses at the cap (over 1024 UTF-16 units) is never resolved and leaves the flag
as it was."* That needs a **superseding ADR**. Clause 6 cannot be clarified in place under the
ADR's own last line. The ticket needs no code change under that reading.

## `A8`, amended a second time: the exact files and edits `ABC-046` may make

Every line not named here stays byte-identical, including all of `src/turn-loop.ts` and
`src/cli.test.ts` (the spawn pin stays `17 + 7 + 1 + 2`). No new file and no new child process.

1. **`src/command-input.ts`**
   - **D1 (`:4-5`), prose:** "one of seven commands and, for six of them" → **"one of six commands
     and, for five of them"**.
   - **D2 (`:222-223`), prose:** replace "and never consults the table" with a TRUE sentence. On
     that path the wrapper never calls `resolvePromptLine` and never reads the row's `outcome`, but
     it still classifies the line through `COMMAND_TABLE` via `classifyCommand`.
   - **Disarm (`:215-216`, `:231-238`):**
     - `PromptLineResolver` gains `readonly disarm: () => void`.
     - `createPromptLineResolver` returns its unchanged resolve closure with `disarm` attached
       (`Object.assign(resolve, { disarm })`, the shape probed).
     - `disarm` sets `quitArmed = false` and does nothing else: no argument, no return value, no
       call below the wrapper.
     - The resolve body stays byte-identical.
   - **Docblock (`:218-230`):** add one or two true sentences. They say what `disarm` does, and
     that the reader calls it on a line it refuses to resolve. The wrapper's docblock must not claim
     that the wrapper sees every line.
2. **`src/line-input.ts`**
   - **`:245`:** the over-cap branch becomes a block. It calls `resolve.disarm()` and then returns
     the SAME `{ kind: "rejected", messages: LINE_TOO_LONG_MESSAGES }`.
   - **The cap docblock (`:85-88`):** add one true sentence saying that an over-cap line also clears
     the `quit` confirmation, through `disarm`, and still reaches no resolver.
   - Nothing else in this file changes. The header's "holds the `quit` confirmation flag and nothing
     else" is still true of the wrapper's state.
3. **`src/command-input.test.ts`** gains two rows, and nothing else changes:
   - **`G1` (kills `Q3`):** `quit` / `quit now` / `quit` gives confirmation, then `rejected`, then
     confirmation. On a fresh resolver, `quit now` twice is `rejected` twice.
   - **The disarm unit row:**
     - armed `quit`, then `disarm()`, then `quit` gives confirmation, then `quit` gives `{ kind: "quit" }`;
     - `disarm()` on an unarmed resolver is harmless;
     - all four `deps` spies are called 0 times.
4. **`src/line-input.test.ts`**, **NEW to `A8`'s list**, gains one row:
   - `quit` / 1025×`z` / `quit` / `quit` through `createLineInputSeam` answers confirmation, then
     `rejected` + `LINE_TOO_LONG_MESSAGES`, then confirmation, then `{ kind: "quit" }`.
   - `texts` is `[]` and `legalMoves` is called 0 times.
   - The existing import from `./command-input.ts` gains `QUIT_CONFIRMATION_MESSAGES`.
   - This row is the clause-6 row nobody wrote. It also closes QE's `G2-INFO`: `M9` goes red in
     this file.
5. **Every other `src/` file** stays byte-identical.

The probe watched each of the three rows go red on its own mutant before relying on it (sibling
note):

| row | mutants that turn it red |
|---|---|
| R1 | `Q3` |
| R2 | `X1` (no-op disarm), `X3` (disarm arms) |
| R3 | `X1`, `X2` (disarm unwired), `X3`, `M9` |

**`A1` stays unchanged.** Its third clause is still met as written. The new row enforces
`ADR-0021` clause 6 and is not a new acceptance criterion, so BA/PM's pen is not needed. `A3`–`A7`
stay unchanged.

## The re-QE this implies (the Orchestrator schedules it; not ruled here)

It is a delta, not a full QE:

- D1 and D2 read true;
- the disarm diff matches the shape above;
- the three rows are present, and each goes red on its mutant (`Q3`, `X1`, `X2`, `X3`, `M9`);
- `ABC-037` bar 2 is green in the default lane AND with `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc`;
- through the real entry point, `quit` / 1025×`x` / `quit` / EOF ends on `input ended` after
  2 confirmations;
- the four gates pass.

## NFR and security

- **No bar moves and no NFR row is seeded.**
- **`N8-LANE`:** +3 rows in 2 existing files, 0 files, 0 children.
- **`NFR-002`:** untouched. `disarm` is one assignment per over-cap line, off the per-ply path.
- **Security:** no new input path. `disarm` takes no input. Bar 2's "never passes it to a resolver"
  is kept, and was measured in both lanes.

## Rollback, and what would falsify this

- **Rollback:** revert the two production edits and the three rows. The product returns to reading
  (2). No data or format depends on it.
- **Pre-registered falsifier:** a future reader-side refusal path that returns without calling
  `resolve`. A control-character filter would be one; so would a rate limit. Such a path must call
  `disarm` too, and this ruling predicts it will. If a refusal is ever meant to leave the
  confirmation standing, the invariant "every submitted line resolves or disarms" is wrong, and
  clause 6 needs a superseding ADR at that point.
