---
id: ABC-102
title: `undo` — two plies back in one command, on the merged `take-back` arm
status: ready
column: Ready
size: S
priority: P1
epic: EPIC-006
feature: —
---

# ABC-102 — take back the human move AND the engine reply, as one step

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-006-packaging`, Workflow 03) at DoR 7/10.
> **Re-scored 2026-10-09 by BA/PM** (task `wave-2026-09-25`, subtask `rescore-abc102`, Workflow 07)
> against the merged record on `grugops/wave-2026-09-25` @ `f952983`: **DoR 10/10 — MET, `Ready`.**
> The contract ruling (`ADR-0021`), the arm (`ABC-120`), the shared table (`ABC-046`) and the engine
> reply (`ABC-078`…`ABC-081`) are all merged and were read at source this hop. Measurements and the
> reasoning behind the two new rulings (6, 7): `.grugops/context/rescore-abc102/notes/`.

## Problem

*User*: the player who fat-fingered a move, and the beginner who wants to see what the other line
does.

*Pain*: **the operation exists, is merged, and is addressed to this epic by name — and nothing can
call it.** `src/history.ts:90-105`: *"`EPIC-006`'s undo is `takeBack(history, 2)`"* (`:93`). Since
`ABC-120` the loop has the arm that carries it (`{ kind: "take-back"; plies; messages }`,
`src/turn-loop.ts:143`, transition 18 at `:377-384`) and `ABC-046`'s `new` already rides it — but
there is still **no `undo` token** in `COMMAND_TABLE` (`src/command-input.ts:98-105`), so a player
who mis-moves must restart the process and replay the game.

*Value*: the epic's user-value sentence (*"take back the move you fat-fingered"*) and its acceptance
criterion 2 — *"the position returns to before the player's own last move — two plies back, one
command"*. **It is the one command in this epic a player uses in an ordinary game rather than at the
end of one.**

## The risk this epic recorded is STRUCTURALLY ABSENT, and that is measured, not argued

`EPIC-006` § Risks: *"a shallow undo that forgets repetition history would corrupt draw detection."*
`GameHistory`'s authority is the move list (`ADR-0002` clause 2); `position`, `keyHistory` and
`repetitionCounts` are **functions of it**, recomputed by replay from `initialFen`. `takeBack` splices
the list and replays (`src/history.ts:99-105`), so all three rewind **together or not at all**.
**`A4` asserts it anyway**, because a structural argument that nothing tests is one refactor from
being wrong.

## The contract — RULED by `ADR-0021` (accepted 2026-09-19), merged by `ABC-120`

Shape (b), on the owner's word (*"5. b, resign should be separate"*). What it fixes for this ticket,
read at source today:

- **The arm is transition 18** — `awaiting-human` → `evaluating-terminal`: the loop calls
  `takeBack(history, outcome.plies)` (`src/turn-loop.ts:383`), carries `outcome.messages`, and the
  one derive (`:436`) re-evaluates before the next frame. **`A5` is met by that re-evaluation** — the
  stale-panel defect of shape (a) cannot arise.
- **Where `undo` hangs** (`ADR-0021` clause 7): `history.moves.length ≥ 2` → `{ kind: "take-back",
  plies: 2, messages }`; otherwise `{ kind: "command", messages: [<refusal>] }` — `command`, not
  `rejected`, because the line IS a command.
- **What clause 4 leaves to THIS ticket, by name:** the loop guards nothing on `plies` (`takeBack`
  clamps, `src/history.ts:95-97`), so **the 0-/1-ply boundary is the seam's product rule** (ruling 3)
  and **the refusal wording is this ticket's** (ruling 3, worded below). The loop's own comment
  already names the boundary *"nothing to undo"* (`src/turn-loop.ts:382`). Clause 7 also leaves
  `messages` on a successful `undo` unspecified — ruling 7.

## The product rulings this ticket makes (BA/PM)

1–5 from 2026-08-16, unchanged; 6–7 added 2026-10-09.

1. **One `undo` is two plies** — the human's move and the engine's reply. Never one ply.
2. **`undo` is repeatable**, back to the start of the game. No limit.
3. **`undo` with fewer than two plies played is REFUSED, with a message, and changes nothing.** A
   naive `takeBack(history, 2)` at ply 1 **silently resets the game** (the clamp) and looks like it
   worked. The refusal is **one item, exactly `nothing to undo`** (15 columns; ≤ 17 is the message
   region's bound, `ADR-0021` clause 6) — true at ply 0, and at ply 1, where the human is always
   Black and has not yet moved.
4. **No confirmation** — a mistaken `undo` is visible in the very next frame and is itself undone by
   playing the move again (`ABC-045`'s reasoning).
5. **`undo` is a command, classified before the grammars** — `ABC-035`'s merged table order.
6. **`help` drops its `commands:` heading** (`HELP_HEADING`, `src/command-input.ts:108`) so the
   seventh token fits. **Measured:** with the heading kept, `help` at the start position (the
   narrowest frame, 21 columns, `MESSAGE_ROWS` = 2, `src/frame.ts:45`) renders `commands: help board`
   / `quit claim (+3 more)` — **`ABC-035` `A7` goes red**. Without it: `help board quit claim` /
   `resign new undo`, hidden count 0. `ABC-035` `A7`'s own instruction is *"shorten the help, never
   widen the frame"*; `A4` requires every token named, not a heading. The priced alternative
   (`cmds:`) also fits, at zero headroom on both rows; dropping the heading costs two rows re-pointed
   (below) and the player who typed `help` already knows the list is the commands.
7. **A successful `undo` carries `messages: []`** — the redrawn board and the shortened history pane
   are the confirmation, the same as `new` (`ADR-0021` clause 7).

**Nothing engine-side to rewind, verified:** `ABC-081`'s transposition table is cleared at every
`chooseMove` entry (`src/engine.ts:469`) and the seam searches only `history.position` (`:515`).
A `--difficulty` level (`ABC-087`) and an opening book (`EPIC-005`) do not exist and are not ruled
here.

## Scope

- **The `undo` row** in `COMMAND_TABLE` — tolerance, no-abbreviation and no-argument rules follow
  `ABC-035` `A1` by construction (`classifyCommand`).
- **The effect** in `resolvePromptLine`: `{ kind: "take-back", plies: 2, messages: [] }` at
  `moves.length ≥ 2`, otherwise the ruling-3 refusal as `command`. **The resolver reads
  `moves.length` and mutates nothing**; the loop splices.
- **Ruling 6**: `helpMessages()` without the heading.
- **The docblocks this makes false, re-worded in the same change** (`ABC-114`): `src/command-input.ts`
  `:4-5` (six/five commands), `:21` and `:94-95` (`undo` "is not here"), `:69`/`:75` (six tokens),
  `:82-83`/`CommandSpec` (`undo`'s row answers `command` at the boundary, like `quit`'s note),
  `:107`/`:121` (the heading), `:169-172` (history consulted on TWO command paths → three).
- **Nothing else.**

## Out of scope

- **Changing `src/turn-loop.ts`, `src/history.ts`, `src/line-input.ts`, `src/cli.ts`,
  `src/frame.ts`** — the arm, the state mechanism, the reader, the wiring and the region are all
  merged and used as delivered.
- **`redo`.** In no epic's scope.
- **An `undo` that takes back only the human's move** — cannot arise (below).
- **`quit`, `new`, `resign`** — `ABC-045`, `ABC-046` (`Done`).
- **Tab-completion of `undo`** — `ABC-038` is in `Backlog`; its source is the table
  (`src/command-input.ts:92`), so it picks `undo` up by construction when built.

## Two scenarios that cannot occur, and are deliberately NOT handled

Coding rule 8, stated so nobody writes a branch for them:

- **`undo` while the engine is thinking.** Input is read only in `awaiting-human`; the human is
  always to move when `undo` is typed, so the last two plies are *engine reply, then human move*.
- **`undo` after the game has ended**, or **landing on a terminal status.** The loop has returned
  after a terminal status; and the position two plies back is one the human already moved from, so
  it was evaluated non-terminal (`ADR-0021` § Rollback's falsification trigger stays unreached).

## Acceptance (Given/When/Then)

All rows run **in-process** in `src/command-input.test.ts`: the pure resolver, and `runLines`
(`:350`) — the merged loop with `createPromptLineResolver` bound and a scripted engine.

- **`A1` (two plies, one command).** **Given** a game at ply ≥ 4 with the human to move, **when**
  `undo` is entered, **then** the resolver returns **exactly** `{ kind: "take-back", plies: 2,
  messages: [] }`, `history.moves.length` decreases by **exactly 2**, and `toFen(history.position)`
  is **byte-identical** to the FEN captured before the human's own last move.
- **`A2` (the refusal at the boundary — THE ONE THAT CATCHES THE CLAMP).** **Given** **0** plies,
  and again **exactly 1** ply (human Black, engine has opened), **when** `undo` is entered, **then**
  the outcome is **exactly** `{ kind: "command", messages: ["nothing to undo"] }` (not `rejected`,
  not `take-back`), the move list length is **unchanged**, `toFen(history.position)` is
  **byte-identical**, and the loop makes **zero** extra derives (transition 9, non-mutating).
- **`A3` (repeatable, lands on the start position exactly).** **Given** ply 6, **when** `undo` is
  entered three times, **then** `history.moves.length` is **0**, `keyHistory(history).length` is
  **1**, and a fourth `undo` is refused per `A2`.
- **`A4` (the derived state rewinds with it — the epic's own risk).** **Given** ply ≥ 6 containing a
  **repeated position**, **when** `undo` is entered, **then** `repetitionCounts(history)` equals the
  counts of a fresh game replayed to the shortened list **entry for entry**, and
  `keyHistory(history).length` equals `history.moves.length + 1`.
- **`A5` (the next frame shows the live position).** **Given** the claimable fixture (`claimable()`,
  `:124`; human to move, claim on offer), **when** `undo` is entered, **then** the status handed to
  the next frame has `claimable` **undefined**, the undo costs **exactly one** derive, and the
  status of the frame before it had `claimable` defined (the fixture is live).
- **`A6` (a command, classified before the grammars).** **Given** `undo`, ` UNDO `, `Undo`, **then**
  the command table produces the outcome and **neither move resolver is called** (spied); **given**
  `und`, `undoo`, `undo 2`, **then** they are not commands and fall through. The module calls
  `gameStatusOf` / `repetitionCounts` **zero** times on both the take-back and the refusal path.
- **`A7` (no confirmation).** **Given** one `undo` line, **then** it takes effect on that line — the
  next scripted line is never read before the take-back's frame.
- **`A8` (help names it and still fits).** `helpMessages()` names every row including `undo`, has
  **no heading item** (`COMMAND_TABLE.length` items), and `ABC-035` `A7`'s rows (`:540-575`) stay
  green — **hidden count 0** at the start position and at the claimable position.
- **`A9` (nothing else changed).** `git diff --name-only <base>.. -- src/` lists **exactly**
  `src/command-input.ts` and `src/command-input.test.ts`; `src/turn-loop.ts`, `src/history.ts`,
  `src/line-input.ts`, `src/cli.ts`, `src/cli.test.ts`, `src/frame.ts` byte-identical. Suite green,
  skip **0**.

**Rows that legitimately go red, superseded by name, not deleted silently:** the foreign-list row
(`:451-456`) — `undo` leaves `["moves", "undo"]` → `["moves"]`, as `resign` and `new` did; and the
two `COMMAND_TABLE.length + 1` rows (`:459`, `:1121`) → `COMMAND_TABLE.length` under ruling 6.

## Dependencies — ALL DISCHARGED, verified at source on `f952983`

- **The contract ruling** → `ADR-0021`, `accepted` 2026-09-19.
- **The arm ticket `ABC-120`** → `Done` (QE PASS 15/15 mutants, owner-accepted 2026-09-25);
  `take-back` arm at `src/turn-loop.ts:143`, transition 18 at `:377-384`.
- **`ABC-046`** (`COMMAND_TABLE`, the wrapper, `new` on the arm) → `Done`; this ticket is next on the
  shared table, per `ADR-0021` § Consequences' pull order. `ABC-045` → `Done`.
- **`EPIC-004`'s engine reply** → `ABC-078`…`ABC-081` `Done`; `src/cli.ts:175` wires
  `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`.
- **`ABC-035`, `ABC-037`, `ABC-043`** → `Done`. **`ABC-012`, `ABC-019`, `ADR-0002`** merged — the
  whole state mechanism; **`undo` needs no new state logic**.
- **No collision in flight:** the parallel lanes (`ABC-086`, `ABC-082`) touch `EPIC-004` engine
  code, not `src/command-input.*`.

## Security / NFR triggers

- **`N8-LANE` ≤ 650 ms CPU** — priced on today's lane: **0 new files, 0 new children**
  (`src/cli.test.ts` byte-identical; `A5` is in-process, so `N8-SPAWN` is not engaged), ~12–15 rows
  in `src/command-input.test.ts`, which runs 133 rows in **23 ms** of test time (n = 5, median,
  2026-10-09). **Expected charge ≲ 10 ms.** **Clause state, written, not inferred from passing:**
  `NFR-008` CPU was last RULED MET at 14.940 s / 15 s (`2c96dbd`, 40 files); today's lane is 48 files
  / 1467 tests and read **23.38 s CPU median** (n = 3, load 2.3–6.5, sibling hops live — NON-
  CONFORMING to the row's protocol, REPORTED, NOT RULED). The breach question is Architect/Design's
  (`ADR-0019` trigger (a)), not this ticket's; this ticket adds no file.
- **Cost of `undo`:** one `O(plies)` replay and one derive **per command, never per ply** — the
  replay the loop already runs on both seam-failure paths (`src/turn-loop.ts:336`, `:419`).
  **`NFR-002` — not triggered**; `A5` is a correctness criterion, not a latency one.
- **Security — not triggered.** One token in an existing table already covered by `ABC-037`'s three
  bars. **Firing threshold: any file under `src/` other than the two in `A9`.**

## Test notes

1. **`A2` is the whole ticket.** Test 0 and 1 ply separately; the 1-ply case is reachable in a real
   game (human Black, engine opens, human types `undo`).
2. **`A4` compares counts entry for entry** against a fresh replay — a size check passes a stale key
   list.
3. **`A1` captures the FEN before the human's move and compares bytes**; a ply count alone passes a
   build that takes back two *different* plies.
4. **Use `runLines` for `A1`, `A3`–`A5`, `A7`**: the loop is what splices; the resolver alone
   proves only the outcome value. Scripted engine (`options.engine`), never the real one.
5. **`ABC-035` `A1`'s sweep (`:205`) asserts the arm equals the row's `outcome` on `RICH_FEN` at
   ply 0** — where `undo` answers the refusal. Put `undo`'s spellings in `A6`'s own rows at ply ≥ 2,
   or in that sweep against a ply-≥-2 history; **never flip the row to `command`** to make it pass.
6. **Watch two mutants red before trusting the rows:** the unguarded `takeBack(history, 2)` at
   ply 1 (`A2` must red), and the heading kept (`A8` / `ABC-035` `A7` must red).

## Size and priority rationale

**Size `S` (2), unchanged.** One table row, one guarded branch, one refusal literal, the heading
dropped, ~8 docblock sentences re-worded, nine criteria — **no new state logic, no new file, no new
child.** Calibrated against `ABC-046` (`S`). **Not `XL`; no split line.**

**Priority `P1`, unchanged.** Named in the epic's user-value sentence and acceptance criterion 2, and
**no workaround**: a player who mis-moves today must restart. Not `P0`: the game is playable without
it.

## Definition of Ready — re-scored 2026-10-09 by BA/PM: **10 of 10, 0 ⚠️ — MET, `Ready`**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** operation at `src/history.ts:93`, arm at `src/turn-loop.ts:143`, no row at `src/command-input.ts:98-105` — all read today |
| 2 | scope and out-of-scope clear | **✅** one row, one guarded branch, one literal, the heading; five files named byte-identical |
| 3 | INVEST-shaped | **✅** independent now — every ordering dependency `Done`; no in-flight ticket touches `src/command-input.*` |
| 4 | acceptance testable and measurable | **✅** nine: exact outcome values, **exactly 2** plies, byte-identical FENs, `0`/`1` after three undos, entry-for-entry counts, `claimable` undefined with **one** derive, spies at **0**, hidden count **0**, a two-file diff |
| 5 | dependencies known | **✅** all discharged and verified at source; `ABC-038` named as picking `undo` up by construction |
| 6 | security/NFR triggers, measurable target | **✅** `N8-LANE` ≤ 650 ms priced (≲ 10 ms, 0 files, 0 children) with the lane's clause state written; security threshold falsifiable |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** both former blockers closed by merges; the two inputs this hop found open (refusal wording, the help-region collision) are BA/PM's product rulings and are made above (3, 6, 7) |

**Column:** the page says `Ready`; the board row move `Backlog → Ready` is the Orchestrator's.

<details><summary>Prior scores (history)</summary>

- **2026-08-16, BA/PM at the cut: 7/10, ⚠️ on items 3 and 10 (×2)** — not independent (three open
  orderings, an open ruling, an epic owing the engine reply); the contract ruling open (three shapes
  priced: (a) seam returns `command` — stale panel; (b) the loop gains an arm; (c) not offered —
  rejected), and `EPIC-004` owing the reply.
- **2026-09-19, Architect/Design after `ADR-0021`: 8/10, ⚠️ on items 3 and 10** — ruling and
  `EPIC-004` closed; the arm ticket uncut (cut the same day as `ABC-120`).

</details>

## Delivery

**Built 2026-10-09 by the Software Engineer** (task `wave-2026-09-25`, subtask
`ticket-to-pr-ABC-102`, Workflow 04) on branch `grugops/ABC-102-undo` @ **`53fd3d2`**, off
`grugops/wave-2026-09-25` @ `4c5eddc`. **Unmerged; not deployed.** This section is a pointer; the
numbers live in the three `20261009T17…` notes in `.grugops/context/ticket-to-pr-ABC-102/notes/`.

- **`A9`, measured:** `git diff --name-only 4c5eddc -- src/` → exactly `src/command-input.ts`
  (+40 / −19) and `src/command-input.test.ts` (+242 / −9). No stop condition hit.
- **Shape:** the `undo` row (`take-back`); one guarded branch ahead of `new`'s; the refusal
  `UNDO_REFUSAL_MESSAGES = ["nothing to undo"]`; `helpMessages()` is the bare token list (ruling 6).
- **Tests:** 18 new rows (133 → 151), `A1`–`A8`; the three rows this page named are superseded by
  name in comments. Red first, then green; four mutants red (incl. the unguarded ply-1 take-back and
  the heading kept, which reds `ABC-035` `A7` at the start position).
- **Gates:** lint 0 (one format self-fix), typecheck 0, build 0, `npm test` 48 files / 1485 passed /
  0 skips; test integrity `No findings.`
- **`N8-LANE`:** +6 ms vitest test time / +60 ms process CPU in-file, 0 files, 0 children — within
  650 ms.
- **Next:** the `qe-e2e` hop; the board move `In Development → In Review` is the Orchestrator's.
