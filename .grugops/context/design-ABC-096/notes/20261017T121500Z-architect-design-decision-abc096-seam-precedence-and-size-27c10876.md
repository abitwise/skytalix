---
id: 20261017T121500Z-architect-design-decision-abc096-seam-precedence-and-size-27c10876
kind: decision
by: architect-design
task: design-ABC-096
at: 2026-10-17T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-096
  - ABC-095
  - ABC-043
  - ADR-0043
  - ADR-0009
  - ADR-0029
  - ADR-0037
  - NFR-002
  - NFR-007
  - 20261017T120920Z-architect-design-observation-abc096-seam-premises-and-costs-7d7f6de3
  - 20261017T120435Z-orchestrator-decision-owner-word-abc096-specifics-delegated-a793f166
supersedes:
---

# ABC-096 DoR item 10 is ruled. ADR-0043 is accepted under the owner's delegation, and the ticket stays `S`

Owner, 2026-10-17: *"i would let you decide on ABC-096 specifics"* (the Orchestrator's note at `main` `3e0fd998`). UAT is not delegated.
The full ruling is in `memory-bank/50-decisions/ADR-0043-…md`. The readings are in the observation note `…7d7f6de3`.

## Q1: where the name is looked up

**Through the render seam.** The session's single book probe is injected when the seam is built:

- `makeRenderSeam(mode, orientation, book)`.
- `book` is required and typed `Pick<BookProbe, "openingName">`.
- The seam calls `book.openingName(history.position)` inside the frame call.
- The type keeps the frame path away from `bookMove`, which draws randomness, and from `inBook`, which runs `legalMoves`.

The other routes:

- **Root wrapper:** fenced. It breaks `ABC-043` `A1` (`S-WRAP-CLI`).
- **Loop route:** it changes `src/turn-loop.ts`, which is the page's trigger for `M`.

## Q2: when the rejection line and the name both want the message region

**The rejection line wins, and so does any other item the loop supplies.**

- The seam shows the name only when the loop passed no message items.
- If any item was passed, the seam does not look the name up.
- So every frame that carries messages today stays byte-identical.

## The other specifics, decided here

- **Display form.**
  - The family is the text before the first `": "`.
  - The cut is by code point, to `HISTORY_COLS`. A longer family keeps its first `HISTORY_COLS - ELLIPSIS.length` code points, then `"..."`.
  - This is written without a digit.
  - An empty family means no name.
  - The text is neutralised only by `assembleFrame`'s existing `sanitize`.
- **The probe.**
  - `openingName` returns `n` only when it is a non-empty string, and emits no warning otherwise (`A7`).
  - It also reads names on entries whose `m` is empty (1,764 of them).
  - It shares the probe's one lazy load.
  - `inBook` and `bookMove` are unchanged, and `src/book.test.ts` runs unmodified.
- **`A5`: the current position's own name, or nothing.** The seam holds no state.
  - At the ply where the game leaves book at the end of a line, the name still shows.
  - "Last known" would need one of these:
    - a replay on the frame path, which voids `NFR-002`;
    - a memo, which shows a discarded line's name after a take-back;
    - a change to the loop, which makes the ticket `M`.
- **The frame-path guard (`ADR-0029`).**
  - The per-frame phase builds its seam with a real `createBookProbe` over in-memory bytes.
  - Those bytes name at least one position that gets framed.
  - There is no filesystem read and no new spawn.

## The re-size trigger does not fire

- `RenderSeam`'s type is unchanged, and so is `src/turn-loop.ts`. **`S` holds.**
- **Production files: 3.** `src/book.ts`, `src/render-seam.ts`, `src/cli.ts`.
- **Test files: 4 edited, 0 new.**
  - `src/render-seam.test.ts` carries the new acceptance rows.
  - `src/history-pane.nfr.test.ts`, `src/cli.test.ts` and `src/book-engine.test.ts` change call sites, plus the `A1` pin.

## Cost

- **Per frame:** about +0.33 µs on 8.25 µs (`NFR-002`, `O(1)` in plies).
- **Once per process:** the probe's parse moves to before frame 0, adding 6.4–6.9 ms. One disk-cache-cold run read 24.4 ms.
  - This is charged to **`NFR-007`** (`< 2 s`, unchanged).
  - **The page's "`NFR-007` not triggered" is wrong under this design.**

## Owed by others

- **BA/PM re-scores the page.** No ticket edit is made by this hop. The re-score covers:
  - item 10 is discharged;
  - `NFR-007` is touched;
  - `A5`'s "nothing" branch is the buildable one at `S`;
  - `A6` gains "names on entries with an empty `m` are kept";
  - the files above.
- **The Engineer builds per ADR-0043 D1–D7.** That includes correcting `src/cli.ts:173-176`'s "Nothing is read until the engine's first ply asks" and the "DERIVES NOTHING" header sentence.
- **Security/NFR:** `A3`, `A4` and `A7` are hostile-input criteria. The first-frame parse should be measured on the delivered build.

## Product recommendations to the Orchestrator

These are outside the Architect's remit. The Orchestrator decides them under the delegation.

1. **Accept the on/off display.**
   - The name appears or disappears about 3 times in each book game, because only 62.6 % of in-book positions are named.
   - Keeping the last known name instead costs `M`, and the page prices this ticket as droppable.
   - Recommendation: accept.
2. **Accept that the absent-book warning becomes invisible on an in-place TTY.**
   - It is written just before frame 0, which erases it. This was derived, not run.
   - Stderr still carries it exactly once, so `ABC-095` `A5` and `A8` hold.
   - The case is rare: the artifact is missing or corrupt.
   - Recommendation: accept, and have UAT observe it.
