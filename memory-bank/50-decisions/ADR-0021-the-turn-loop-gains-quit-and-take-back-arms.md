# ADR-0021: the turn loop gains a `quit` arm and a `take-back` arm; `resign` stays its own command

## Status

accepted

Written 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
`ruling-abc046-quit-arm`, on the project owner's word taken in session the same day. The authority is
`.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`,
ruling 5, and the owner's word is quoted verbatim:

> "5. b, resign should be separate"
> — Olger Oeselg, project owner, in session, 2026-09-19

"b" is shape **(b)** of `ABC-046`'s three priced shapes — *the loop gains an arm*. It closes the ruling
`ABC-046` (2026-08-13) and `ABC-102` (2026-08-16) both routed to Architect/Design and both said should
be made **once**; it is made once here, for `quit`, `new` and `undo` together. **Shape (c) — `quit` ≡
resignation — stays rejected**, now on the owner's word as well as BA/PM's. `ABC-045` (`resign`) is a
separate command with a chess result and is not touched by this ADR.

**This ADR authorises re-opening `src/turn-loop.ts` — under a ticket, gated — and nothing else.** Zero
files under `src/` change at this hop. `ADR-0002`, `ADR-0009`, `ADR-0012`, `ADR-0016` are
byte-unchanged and no clause of any of them is narrowed or widened.

## Context

Read at source at this hop (`src/turn-loop.ts` @ `2c96dbd`, 392 lines):

1. **`quit` has no outcome.** `PromptOutcome` has seven arms (`:125-132`). The only terminal arm with
   no chess result is `{ kind: "eof" }`, and its notice is the literal `"input ended"` (`:176,:313`),
   which is not what happened when a player typed `quit`. Every `game-over` carries a `FinalResult`
   (`:57`). `LoopOutcome` is `{ result: FinalResult | null; reason: TerminalReason | null; exitCode: 0 }`
   and `renderResultScreen` returns **zero rows** when `reason === null` (`src/result-screen.ts:167`).
2. **`new` and `undo` have no outcome that re-evaluates.** Transitions 7, 8, 9 go from `awaiting-human`
   straight back to `rendering` **without** `evaluating-terminal` (`:342-346`) — by design, so that
   `ABC-019` `A5`/`A6`'s "not re-evaluated" is a property of the machine. `renderStatusPanel` reads
   side, move number, check and material live from `history.position` but the **draw-claim cell from
   the passed `status`** (`src/status-panel.ts:187-216`), so a reset or a take-back that returns a
   `command` outcome shows the discarded game's claim for one frame (`new`) or until the next move
   (`undo`).
3. **The machine is enumerated at 8 states / 16 transitions** — `ABC-019` `## Scope` (15) plus
   `ABC-021`'s transition 16 (`claim`), and the docblock at `:247` says so. `ABC-019`'s `A14` pins
   `TerminalReason` at exactly **ten** values and `A9b` (iii) asserts no eleventh is invented.
4. **The state mechanism exists and is merged.** `takeBack(history, plies)` truncates the list and
   replays from `initialFen`, clamping at zero (`src/history.ts:95-105`); position, Zobrist key list
   and repetition counts rewind together (`ADR-0002` clause 2). The loop already calls
   `takeBack(history, 0)` on both seam-failure paths (`:307`, `:374`).
5. **The command layer was built for an effect owner.** `classifyCommand` is exported *"because the
   TOKEN is what an effect owner needs … `EPIC-006` binds this to decide which effect to run"*
   (`src/command-input.ts:97-107`); `resolvePromptLine` is a pure function over a string; the reader
   (`src/line-input.ts:238-244`) calls it once per line and holds no grammar.
6. **Measured at this hop, in a scratch copy of `src/` outside the repository** (numbers and method in
   `.grugops/context/ruling-abc046-quit-arm/notes/`): the two arms below are **+16 lines** in
   `src/turn-loop.ts`, typecheck green, and the default lane stays **40 files / 1213 tests / 0 red** —
   i.e. adding the arms reddens **no existing guard**. A scripted eight-ply knight shuffle reaches a
   claimable third occurrence; a `take-back` of all eight plies renders the next frame with **no
   claim cell**, `moves.length` 0, `keyHistory` 1, one repetition entry, and **one** extra derive. The
   mutant that skips the re-evaluation reads the stale `{ by: "white" }` claim on that frame and one
   derive short — the guard was watched go red before it was relied on.

## Decision

1. **Shape (b), on the owner's word.** The loop gains arms. `quit` ends the session with **no result**
   and exit **0** (`ABC-046`'s product half, BA/PM 2026-08-13, unchanged). `quit` ≠ `resign`;
   `resign` (`ABC-045`) resolves to the existing `game-over` arm with `reason: "resignation"` and is
   not re-decided here.

2. **Two new `PromptOutcome` members, and nothing else in the types.**

   ```ts
   | { readonly kind: "quit" }
   | { readonly kind: "take-back"; readonly plies: number; readonly messages: readonly string[] }
   ```

   **`LoopOutcome` is unchanged. `TerminalReason` is unchanged (ten values). `FinalResult` is
   unchanged.** The alternative form `ABC-046` offered — *"`LoopOutcome.reason` admits a no-result
   stop"* — is **rejected**: a `TerminalReason` says *why the game ended* and a quit is not a game
   ending; it would be the eleventh value `A14` and `A9b` (iii) exist to forbid; it would force
   `src/result-screen.ts` to learn a non-chess reason (today `reason === null` → zero rows, which is
   exactly `ABC-046` `A2`); and it has **no consumer** — the entry point assigns `exitCode` verbatim
   and the screen is a pure function of the outcome. Coding rules 5 and 7.

3. **Transition 17 — `quit`: `awaiting-human` → `exiting`.** A sibling of transition 10. The loop
   writes **one line**, an exported constant `QUIT_NOTICE`, to the sink — **no frame** — and returns
   `{ result: null, reason: null, exitCode: 0 }`. Constraints on the literal (its wording is the arm
   ticket's, not fixed here): it **names quitting**, it is **not equal to** `INPUT_ENDED_NOTICE`
   (`ABC-046` `A3` asserts inequality against the exported constants, never a substring), it is one
   line, and it carries none of the ten `TerminalReason` words nor `win` / `draw` / `resign` /
   `checkmate` / `stalemate` (the `src/cli.ts` `INTERNAL_ERROR` rule, applied). The `LoopOutcome` is
   **deliberately byte-identical to end-of-input**: the notice is the only place the two ever
   differed in the player's eyes, and that is the one place shape (a) was wrong. `src/cli.ts` and
   `src/result-screen.ts` are **untouched** by the arm.

4. **Transition 18 — `take-back`: `awaiting-human` → `evaluating-terminal`.** The loop calls
   `takeBack(history, outcome.plies)`, sets `messages = outcome.messages`, and falls through to the
   **one derive line transition 14 already uses** (`status = gameStatusOf(history)`), then
   `rendering`. It is the **only edge into `evaluating-terminal` that does not come from
   `applying`**, and it is not routed through `applying` because that state's trigger is *"a legal
   move was read"* and a take-back is its inverse. No ply advances. **The loop guards nothing on this
   edge:** `takeBack` clamps at zero by its own documented floor, a take-back cannot corrupt the
   board the way a foreign move can (`wasGenerated` exists for that), and the boundary refusal is a
   **product** rule (`ABC-102` ruling 3) that belongs to the seam. Coding rule 8.

5. **States stay at 8. Transitions go 16 → 18.** The enumeration `ABC-019` `## Scope` carries gains
   two rows and no state:

   | # | From → To | Trigger |
   |---|---|---|
   | 17 | `awaiting-human` → `exiting` | **`quit`** — one notice (`QUIT_NOTICE`, ≠ `INPUT_ENDED_NOTICE`), **no frame**, exit 0, **no result** |
   | 18 | `awaiting-human` → `evaluating-terminal` | **`take-back`** — `takeBack(history, plies)`, then the one derive, then `rendering` carrying `messages`; no ply advanced; **one** derive |

   Two sentences in the record narrow and are re-stated here so nobody re-derives them: *"a
   non-advancing outcome is not re-evaluated"* becomes **"a non-MUTATING outcome (7, 8, 9 and the
   refused claim) is not re-evaluated"**; and the render cadence becomes
   **`1 + plies + take-backs + re-emitting non-mutating outcomes`** — `quit`, like `eof`, re-emits
   nothing. Seven outcomes are now non-advancing and five of them emit a frame.

6. **The `quit` confirmation is the SEAM's, not the loop's.** The loop has **no** `confirming-quit`
   state and no armed flag. A per-session `quitArmed` flag lives in the command layer (`ABC-035`'s
   module, binding the `classifyCommand` it exported for exactly this), is **cleared by any other
   line**, and: first `quit` → `{ kind: "command", messages: [<confirmation item>] }` — transition 9,
   in-contract today; second **consecutive** `quit` → `{ kind: "quit" }` — transition 17. Two states,
   no second read, exactly `ABC-046` `## Scope`'s shape. The confirmation item obeys the message
   region's rule: **≤ 17 columns** (`W` is 18 at the narrowest frame; `claimShortfall`'s reasoning,
   `src/turn-loop.ts:215-225`). Why seam-side: the loop is the **mechanism** and confirmation is
   **product policy** — `ABC-045`'s named counter-argument (most chess software confirms `resign`)
   then becomes a field on a table row, not a loop state; and a stateful loop would put a UI protocol
   into a mutation-tested state machine that has none. **`resolvePromptLine` stays pure and
   exported** so `ABC-037` `A4`'s delegation spy keeps its subject; the stateful wrapper sits around
   it. This costs **one call-site line in `src/line-input.ts`** (`:243`), which `ABC-046` `A8` did not
   license — **`A8` is amended on its page at this hop** to name that one line.

7. **Where `new` and `undo` hang.** `new` → `{ kind: "take-back", plies: history.moves.length,
   messages: [] }` (`ABC-046`). `undo` → `{ kind: "take-back", plies: 2, messages }` when
   `history.moves.length ≥ 2`, otherwise `{ kind: "command", messages: [<refusal>] }` — `command`,
   not `rejected`, because the line **is** a command and `rejected` is the parser's word for a line
   that is not a move (`ABC-102` ruling 3; wording is that ticket's). Both `ABC-046` `A5` and
   `ABC-102` `A5` are satisfied by transition 18's re-evaluation and by nothing else; neither ticket
   needs a BA/PM amendment, and neither ticket touches `src/turn-loop.ts`.

8. **The loop change is its own ticket — the "arm ticket" — and it lands FIRST.** `ABC-046`
   `## Out of scope` and `ABC-102` `## Out of scope` both fence *"changing `src/turn-loop.ts` … is its
   own ticket, not a quiet edit"*, and this ADR keeps that fence. Its scope is exactly clauses 2–5 in
   `src/turn-loop.ts` plus scripted rows in `src/turn-loop.test.ts`; **nothing** in
   `src/command-input.ts`, `src/line-input.ts`, `src/cli.ts`, `src/result-screen.ts`. Cutting it is
   BA/PM's pen; its id is not guessed here.

9. **What the arm ticket must add, because nothing existing reds on the arms.** Measured: the arms
   alone leave 1213/1213 green — which means the new edges are **unguarded until the ticket writes
   their rows**. The minimum: (i) `quit` — outcome `{ null, null, 0 }`, last write `QUIT_NOTICE`,
   `INPUT_ENDED_NOTICE` absent, **no** frame, next scripted line never read, derive count unchanged;
   (ii) `take-back` on a **claimable** fixture (`src/turn-loop.test.ts` already builds threefold
   positions) — next frame's `status.claimable` undefined, `moves.length` / `keyHistory` /
   `repetitionCounts` rewound together, **exactly one** extra derive, exactly one extra frame;
   (iii) `take-back` of `0` plies at ply 0 — one derive, one frame, nothing else; (iv) the
   no-re-evaluation mutant watched **red** on (ii) before the row is trusted.

10. **What must NOT change.** The eighteen scripted rows and their frame counts; `A2`'s cadence rows;
    `A3b` and `src/turn-loop.nfr.test.ts`'s *"derives ZERO times on a non-advancing outcome"* (they
    exercise 7/8/9, which are unchanged — their sentence narrows to "non-mutating", their numbers do
    not move); `A8` (EOF) and `A8b`; `A9`/`A9b`/`A10`/`A10b` (the throw-and-repair paths);
    `A14`'s **ten**; `ABC-021`'s transition-16 rows; `INPUT_ENDED_NOTICE`'s literal; `LoopOutcome`'s
    `exitCode: 0` type; `src/cli.ts`'s single `process.exitCode = outcome.exitCode` assignment.

## Alternatives

1. **Shape (a) — `quit` returns `eof`.** REJECTED, and `ABC-046` `A3` was written so that it fails:
   the player who typed `quit` is told `input ended`. It also cannot clear the stale claim cell for
   `new` (`A5`), and `undo` under it is wrong until the next move (`ABC-102` shape (a)).
2. **Shape (c) — `quit` ≡ resignation.** REJECTED by BA/PM 2026-08-13 and now by the owner: it
   invents a rule, merges two commands, and puts a loss on a player who asked to stop.
3. **A no-result `reason` on `LoopOutcome` / an eleventh `TerminalReason`.** REJECTED — clause 2.
4. **`command` gains a `stateChanged: boolean` flag** (`ABC-102`'s other (b) form). REJECTED: it makes
   one arm mean two things and puts a boolean where a discriminant belongs; every consumer of
   `command` would have to read the flag to stay correct. A separate `take-back` arm is an
   exhaustive-union member that `tsc` checks.
5. **The seam mutates the borrowed history itself and returns a "re-evaluate" signal.** REJECTED:
   on the move path the loop owns every mutation (`playMove` after `wasGenerated`), and a seam that
   mutates makes `A16`'s "a seam that mutates while suspended" the normal case instead of the guarded
   one. The arm carries `plies`; the loop calls `takeBack`.
6. **Confirmation inside the loop (a ninth state).** REJECTED — clause 6.
7. **Route `take-back` through `applying`.** REJECTED — clause 4; it would re-word transition 6 and
   14's triggers to cover an inverse operation for the sake of one fewer table row.
8. **A loop-side `plies ≤ moves.length` guard.** REJECTED — clause 4; `takeBack` clamps, and the
   product boundary is `ABC-102`'s.

## Consequences

- **`src/turn-loop.ts` is re-opened, under one ticket, by roughly +16 lines** (two union members,
  one exported constant, two branches; the move path's four lines move inside an `else`). The
  docblocks at `:104-124` (arm census), `:155-173` (`reason` is `null` "only on end-of-input" becomes
  "on end-of-input and on quit") and `:246-262` (cadence, "five outcomes / four emit") must be
  re-worded in the same change so the file does not carry a false sentence — `ABC-114`'s lesson.
- **No existing test goes red on the arm ticket** (measured). The cost is the inverse, clause 9.
- **Tests that legitimately go red on `ABC-046`, by name:** `src/command-input.test.ts`
  `describe("ABC-035 fences — grammar only")` → `it("no token carries an effect: quit and board are
  outcome-identical and payload-free")` (`:486-495`) — its own comment says it reds the day
  `EPIC-006` gives `quit` an effect; it is superseded on `ABC-046`'s page, not deleted silently. If
  the confirmation wrapper changes what `src/line-input.ts` calls, `src/line-input.test.ts`
  `A4`/`A5`/`A7`'s delegation spy must be re-pointed at the wrapper — that is why clause 6 keeps
  `resolvePromptLine` pure and exported. Nothing in `src/turn-loop.test.ts` reds on `ABC-046` or
  `ABC-102`, because neither touches the loop.
- **`ABC-112` is now a one-line dependency, not a fix.** Its own pre-registered trigger reads: *"if
  `ABC-046`'s ruling lands and `ABC-046` is scheduled, this ticket drops to `P3` and should be
  cancelled, not delivered."* The ruling has landed. Delivering it would red the four-token half of
  `ABC-035` `A4` only to have `ABC-046` flip it back. Recommendation to the Orchestrator: cancel
  when `ABC-046` is pulled; the board move is the Orchestrator's.
- **Pull order:** `ABC-045` (XS, `game-over` arm exists, no dependency on this ADR; its three ordering
  ⚠️ are all merged) → **the arm ticket** (cut by BA/PM; lands transitions 17/18) → `ABC-046` →
  `ABC-102`. `ABC-045`, `ABC-046` and `ABC-102` all add rows to `COMMAND_TABLE` and extend
  `src/command-input.test.ts`, so they are **sequential**, never parallel.
- **NFR impact — no bar moves and no row is seeded.** `N8-LANE` (≤ 650 ms CPU, 0 new files) is
  inherited by name by every ticket here. `NFR-002` is untouched: no frame is composed and the
  per-ply derive count is unchanged — a take-back's derive is **per command**, not per ply, and its
  `O(plies)` replay is the operation the loop already runs on both failure paths. `NFR-003`'s
  *"two to four times per turn"* sentence is unaffected (a take-back is not a turn). `NFR-008` is
  breached on CPU on `main` today (`ADR-0014`, `ABC-110`) and the arm ticket adds rows to an
  existing file, not a file. Security: no new input path, no process boundary, nothing spawned.
- **`60-progress.md` § Known UNCUT work row 5** ("a turn-loop arm for state-changing, non-advancing
  commands … only exists if shape (b) is ruled") is now discharged by this ADR and becomes the arm
  ticket to cut; the row is left for BA/PM to retire at the cut.

## Rollback

Reverting the ruling before the arm ticket lands is deleting this file's `accepted` status and the
three ticket-page sections that cite it — no code exists. After the arm ticket lands, reverting is
one commit on `src/turn-loop.ts` (remove two union members, one constant, two branches) and the
product is back to today: `quit` inert, `new`/`undo` absent.

**How this ADR is falsified — pre-registered:**

- **A consumer is measured needing to tell a `quit` from an end-of-input at the `LoopOutcome`
  level** (not at the notice). Clause 2's "byte-identical outcome" is then wrong and a discriminant on
  `LoopOutcome` — not a `TerminalReason` — is re-opened.
- **A second command needs confirmation** (`resign`, on the owner's word). Clause 6 predicts it is a
  table field on the seam side; if it turns out to need loop state, clause 6 was wrong.
- **A take-back is measured landing on a terminal status.** Transition 18 already routes through
  `evaluating-terminal`, so transition 3 fires and the game ends on the true status — but the
  scenario was argued unreachable here, and finding it reachable means clause 4's "no guard" is
  re-read.
- **The arm ticket's diff is measured above ~30 lines in `src/turn-loop.ts`.** The shape is then
  larger than ruled and this ADR is re-opened before the ticket merges, not after.

Superseding this ADR is done by writing a later ADR, not by editing this file.
