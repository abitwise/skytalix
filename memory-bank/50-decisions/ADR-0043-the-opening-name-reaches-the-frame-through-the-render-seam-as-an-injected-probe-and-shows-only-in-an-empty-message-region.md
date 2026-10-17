---
kind: adr
id: ADR-0043
---
# ADR-0043: The opening name reaches the frame through the render seam, as the session's one book probe injected at construction, and it shows only when the message region is empty

## Status

**accepted** 2026-10-17 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-096`), ruling
`ABC-096`'s open DoR item 10.

- **No target and no level moves.** `NFR-002` `< 16 ms`, `NFR-007` `< 2 s`, and `ADR-0009`'s `= 23` and `≤ 24`
  all stay where they are. Under this project's rule, no owner ratification is owed for that (`ADR-0009`
  § Status, `ADR-0011`).
- **The owner delegated `ABC-096`'s specifics** on 2026-10-17 (*"i would let you decide on ABC-096
  specifics"*, Orchestrator note at `main` `3e0fd998`). UAT is not delegated.
- **Zero production lines are written by this hop.** The build is the Engineer's.

## Context

`ABC-096` puts text from the book on the terminal: the family of the opening for the current position.
The page asked two questions (§ Re-score 2026-10-12):

1. Does the name reach the frame through the render seam, or as an item the turn loop or the composition
   root passes in?
2. When a rejection line and the name both want the 2-row message region, which one wins?

**Read at `31e8d38e`. Measured by a scratch script outside the repository, Node v26.11.1 darwin-arm64,
load average about 4. `UNKNOWN - verify` on any other machine.**

| fact | reading |
|---|---|
| `RenderSeam` | `(history, status, thinking, messages) => readonly string[]` (`src/turn-loop.ts:97`) |
| what `makeRenderSeam(mode, orientation)` binds | values bound once at construction (`ABC-019` `[D30]`); the frame path's one declared root (`ADR-0029` decision 2) |
| root-wrapper route | **fenced.** `src/cli.test.ts` `ABC-043` `A1` pins `render:\s*makeRenderSeam(mode,\s*orientation)`. It also refuses any `=>` inside the `runTurnLoop(` call, so a wrapper there is red (`S-WRAP-CLI`) |
| loop route | needs `TurnLoopOptions` to carry the probe, plus a lookup every ply in `src/turn-loop.ts` (`Done`, mutation-tested). This is the page's `S`→`M` trigger |
| digit pin | the executable text of `src/render-seam.ts` must contain no digit (`src/render-seam.test.ts:268`, `ADR-0009` clause 9) |
| `parseBook` | keeps `m` only, and drops entries whose `m` is empty (`src/book.ts:100`) |
| names in the artifact | 2,853 named entries out of 5,390. **1,764 of them have an empty `m`**, so today's parse throws them away. 149 families, 31 of them longer than 21 characters, 5 with a code point above `U+007F`, 0 with an astral code point, 0 matching `/book/i` |
| start position | not named |
| the frame | 23 rows, `W` = 21 = `HISTORY_COLS` at the start position (both modes) |
| per-frame lookup (`zobristKey` + hex + `Map.get`) | **0.33 µs** warm, against a base frame of 8.25 µs |
| the probe's one-time parse (read + JSON + validation) | **6.4–6.9 ms** in a fresh process (5 of 6 runs). The first run read **24.4 ms**, which was disk-cache cold. A frame alone, cold, reads 0.29–0.31 ms |
| names along book lines (500 weighted walks, stopping at the last position with moves) | 62.6 % of in-book positions are named. The display switches between a name and nothing 1,578 times, about 3 per game |

## Decision

### D1. The name reaches the frame through the render seam. The book probe is injected at construction

- **`makeRenderSeam(mode, orientation, book)`.** `book` has the type `Pick<BookProbe, "openingName">` and is
  required. The seam calls `book.openingName(history.position)` inside the frame call.
- **`RenderSeam`'s type does not change, and `src/turn-loop.ts` does not change.** So the page's re-size
  trigger does not fire. **`ABC-096` stays `S`.**
- **`Pick`, not `BookProbe`.** The type keeps the frame path away from the probe's other two methods:
  - `bookMove` draws from the session's randomness. A frame that called it would change which move the
    engine plays.
  - `inBook` runs `legalMoves` on every call.
- **Required, not optional.** The seam cannot be built without being given the session's probe. That puts
  `A8` (one probe per process) in the type. Production would never take an optional branch with no book.
  - Test call sites pass a one-method double, for example `{ openingName: () => undefined }`.
  - The import stays `import type { BookProbe } from "./book.ts"`. The root's load closure does not grow.
- **`src/cli.ts`.** The wiring line becomes `render: makeRenderSeam(mode, orientation, book)`, and `book` is
  the same `const book = createBookProbe({…})` the engine decorator already gets. The `ABC-043` `A1` pin
  moves with it and stays an arrow-free call.

### D2. The probe keeps names, and its public behaviour does not move

`BookProbe` gains `openingName(position): string | undefined`:

- **It returns `n` only when `n` is a non-empty string** (`A7`). Any other value means no name, with
  **no warning**, and that entry's moves are still served.
- **It reads names from entries with an empty `m` too.** Those 1,764 entries exist for their names
  (`ADR-0037` D1(e)). They stay out of book: `inBook` and `bookMove` do not change.
- **It shares the probe's single lazy load.** A missing or refused artifact warns once, and from then on
  `openingName` returns `undefined`, the same as the other two methods.
- **It calls neither `legalMoves` nor `random`.**
- **`src/book.test.ts` runs unmodified and green** (`A6` as amended).

### D3. The display form is built in the seam and neutralised by the frame

- **The seam builds the shown text** from the name: the family (`A1`), cut so it is at most
  `HISTORY_COLS` code points long. A family longer than that keeps its first
  `HISTORY_COLS - ELLIPSIS.length` code points and gets `"..."` appended. An empty family is no name.
  - `HISTORY_COLS` is imported from `./history-pane.ts`, which the seam already imports, so no edge is
    added.
  - The cut is written without a digit (the pin above).
  - The cut counts code points, so it never splits a surrogate pair.
- **Why `HISTORY_COLS`.** Every history row is exactly that wide, so every frame's `W` is at least that.
  An item that fits is never dropped by `packRegion`, and messages never set `W` (`src/frame.ts:198-201`).
- **Neutralising is `assembleFrame`'s existing `sanitize`, and nothing else.** The name enters as a
  message item, and every message item already passes through it (C0, `U+007F`, and above `U+007F` in
  ASCII mode). **No second sanitizer is written.** `A3` is asserted on the emitted frame (test note 1).

### D4. Precedence: the name is shown only when the loop supplied no message items

- **If `messages` is non-empty, the seam passes `messages` through unchanged and does not look the name
  up.** If it is empty, the seam passes the shown name as the only item, or `[]` when there is no name.
- **So the rejection line wins** (BA/PM's product answer), and so does every other item the loop supplies:
  ambiguity lists, command output, take-back lines, the claim shortfall.
- **Every frame that carries messages is byte-identical to today's.**
- **Messages last one frame** (`src/turn-loop.ts:317`), so the name comes back on the next frame.

### D5. Leaving book: the name is the current position's own, or nothing. The seam holds no state

- **The frame shows the name the book gives the position on the board, and nothing when it gives none.**
  That is `A5`'s "nothing" branch, and it is the page's "does not infer" rule applied per frame.
- **At the ply where a game leaves book through a line end, the name still shows.** Those positions are
  the 1,764 named entries with an empty `m`. From the next ply on, nothing shows.
- **"Last known" is not buildable at `S`.** All three ways to build it fail:
  - **Derive it** from the move list. That is an `O(plies)` replay or `keyHistory` on the frame path,
    which is `NFR-002`'s void condition.
  - **Memoise it in the seam.** After a take-back or a new game, the seam would show a name from a line
    that was discarded. The memo would also depend on the loop's render cadence, which the seam does not
    own.
  - **Carry it in the loop.** That changes `src/turn-loop.ts`, which re-sizes the ticket to `M`.

### D6. The frame-path guard sees the new per-frame code

- **What `ADR-0029`'s membership rule says.** `book.ts` is loaded by `src/cli.ts`, not by the seam, so it
  is off the frame path. Its `openingName` still runs inside every frame.
- **The ruling.** The per-frame phase of `src/history-pane.nfr.test.ts` builds its seam with a **real**
  `createBookProbe` over **in-memory** bytes. Those bytes name at least one framed position, for example
  the start position's key. The book module must be imported before the recorder clears.
  - **Why.** The lookup's code, and any load it triggers lazily, then runs inside the recorder window.
  - **Constraints.** No filesystem read and no new spawn. The probe child is granted read on `src/` only.
- **The static side is already guarded.** A runtime import of `history.ts` added to `book.ts` reds the
  `ADR-0011` clause 3 licence regex. `book.ts` imports `legal`, `moves`, `position` and `zobrist`, and none
  of them import `history.ts`.

### D7. The cost, and where it is charged

- **Per frame (`NFR-002`).** About **+0.33 µs** (one `zobristKey`, its hex, one `Map.get`), against a base
  frame of 8.25 µs. That is about 0.002 % of the 16 ms budget. The lookup is `O(1)` in plies, so
  `NFR-002`'s `O(window)` statement stands.
  - **The header must be amended.** `src/render-seam.ts`'s "IT DERIVES NOTHING" header gets one sentence:
    the seam derives nothing from the game's history, and makes one constant-cost lookup through the probe
    it was given.
- **Once per process (`NFR-007`'s window).** The probe's lazy parse moves from the engine's first ply to
  just before the first frame: **+6.4–6.9 ms**, and 24.4 ms on a disk-cache-cold run, against `< 2 s`.
  **This is a startup cost, not a redraw**, so it is charged to `NFR-007`.
  - The page's "`NFR-007` not triggered" is therefore **wrong under this design**. It is touched, and its
    target does not move.
  - The `src/cli.ts:173-176` comment "Nothing is read until the engine's first ply asks" becomes false.
    The build corrects it.

## Alternatives

| # | alternative | verdict |
|---|---|---|
| 1 | **The turn loop looks the name up and passes it as a message item** | **Rejected.** `TurnLoopOptions` gains the probe and `src/turn-loop.ts` gains a per-ply lookup. That is the page's `M` trigger, for no reach the seam lacks |
| 2 | **The composition root wraps the seam** (`render: (h, s, t, m) => seam(h, s, t, [...m, name])`) | **Rejected, and fenced.** It reds `ABC-043` `A1` (no `=>` in the call) and is exactly `S-WRAP-CLI`. It moves per-frame code outside the declared root, and it fires `AR-053-COMPOSER`'s trigger (an edit of the pinned `render:` line) |
| 3 | **A fifth `RenderSeam` argument** | **Rejected.** It changes `RenderSeam`'s type and the loop: the page's `M` trigger |
| 4 | **Append the name after the loop's items** and let `packRegion` drop it | **Rejected.** A rejection that fills the region then shows a `(+1 more)` marker that counts the name, which tells the player a message is hidden when none is. It also changes frames that carry messages today |
| 5 | **The name first** | **Rejected.** It contradicts the product answer: a cosmetic label would push the player's own feedback out |
| 6 | **`openingName` does not trigger the load** (it returns nothing until the engine has asked) | **Rejected.** With `--colour white`, frame 1 (after the human's first move) would miss a name the book holds, depending on whether the engine has asked yet. That is the accidental behaviour `A5` forbids |
| 7 | **The name in a status-panel row** | **Rejected.** All three rows are the panel's (`src/status-panel.ts:30-35`). Splitting one edits a `Done` panel and its snapshot for a `P3` label, and the free message region already exists |
| 8 | **Inject `BookProbe` whole, or make the parameter optional** | **Rejected.** See D1: the frame path must be unable to draw randomness or run `legalMoves`, and an optional parameter is a branch production never takes |

## Consequences

- **Size `S` holds.** `RenderSeam`'s type and `src/turn-loop.ts` are unchanged, and there is no new module,
  data or dependency.
- **Production files a build touches (3):**
  - `src/book.ts`: keep `n`, add `openingName`;
  - `src/render-seam.ts`: the third parameter, the precedence rule, the family and cut, and the header
    sentence;
  - `src/cli.ts`: the wiring line and the stale comment.
  - **No other production file.** `src/frame.ts` and `src/turn-loop.ts` are untouched.
- **Test files a build touches (no new file):**
  - `src/render-seam.test.ts`: `A1`–`A5` and `A7` on emitted frames, with `A4`'s 100,000-character name
    built in the test, and 2 call sites;
  - `src/history-pane.nfr.test.ts`: the per-frame seam, per D6;
  - `src/cli.test.ts`: the `A1` pin, plus 3 call sites;
  - `src/book-engine.test.ts`: 1 call site.
  - Spawned CLI children that pass through a named position with an empty message region will now show a
    name in message row 1. The Engineer runs the full lane and `CLI_DEEP=1`, and reads every red.
  - Snapshots do not move. `src/__snapshots__/` holds the board and status-panel snapshots only.
- **`ADR-0009`: row identity unchanged.** The message region is a fixed 2 rows in every branch (`ADR-0009`
  9(i), re-measured at `ABC-019`). The name only replaces `[]` with one item that fits.
- **`ADR-0029`: unchanged.** D6 is an obligation on the probe's per-frame fixture, not a change to its
  membership rule.
- **The UX cost, named rather than hidden:**
  - **The display switches on and off** between a name and nothing about 3 times per book game (D5).
  - **The absent-book warning becomes invisible on an in-place TTY.** It is now emitted just before frame 0,
    whose cursor-home and per-row erase overwrite it on an in-place TTY. That was derived from
    `beginFrameSession`'s write sequence and **not run on a real terminal** (`UNKNOWN - verify`). Stderr
    still carries it exactly once, so `ABC-095` `A5` and `ABC-096` `A8` hold to the letter. Today it is
    visible while the engine thinks.
  - Both are product effects, and both are recommended to the Orchestrator, who decides them under the
    owner's delegation.

## Rollback

- **Revert the build commit.** The seam goes back to two parameters, and the probe drops `n` again.
- **Nothing persistent depends on the change.** No data shape, artifact byte or dependency changes, and the
  `src/book.test.ts` behaviour stays pinned.
- **What would re-open D1.** A product decision for "last known" (D5), which goes to the loop and re-sizes
  the ticket to `M`. Or a measured first-frame parse that approaches `NFR-007`'s bar.
