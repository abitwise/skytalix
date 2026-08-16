---
id: ABC-021
title: Draw-claim interaction — the player having the move claims, the loop ends the game, the engine does not
status: done
column: Done
size: S
priority: P1
epic: EPIC-002
feature: —
---

# ABC-021 — Draw-claim interaction: the player having the move claims, the loop ends the game, the engine does not

## Problem

*User*: the human player, who under FIDE 9.2 and 9.3 holds a right — and a right nobody can exercise
is not a right.

*Pain*: `ABC-020` makes threefold repetition and the fifty-move rule **claimable** rather than
automatic, which is what the Laws require. On its own that leaves the product reporting that a draw
is available to the side to move and giving that player **no way to take it**. The game then runs on
to the fivefold / 75-move backstop, which is legal but is not what the player asked for.

*Value*: this is the half of the owner's directive that faces the player. `ABC-020` stops the
product imposing a draw the Laws do not impose; this ticket lets the player claim the draw the Laws
do grant. Together they are FIDE 9.2/9.3/9.6; separately, one is a rules library and the other is a
gap.

## The product ruling this ticket implements

BA/PM ruled on 2026-07-31, under the owner's standing legality-first priority. Four questions, four
answers, each with the reason it was answered that way rather than the other way.

**1. Who claims? The player having the move — and in this slice that means the human only.**
FIDE 9.2.1 gives the claim to the claimant having the move, and `ABC-020` computes availability
against the side to move. The human asks for it explicitly; nothing claims on the human's behalf.

**2. Does the engine claim on its own behalf? No — and the reason is that it cannot yet.**
A claim policy worth having is *"claim when the position is not better for me"*, and that needs an
evaluation function. **`EPIC-004` does not exist**, and `ABC-019`'s engine stub is seeded-random with
no evaluation at all. The only policy implementable today is *"always claim when available"*, which
is **strictly worse chess** — it would throw away won games by claiming a draw in a winning position.
Not claiming is always legal under FIDE (a claim is a right, never an obligation), and the 9.6
backstops still terminate the game four plies later, so declining to claim costs conformance
nothing. **The policy is therefore a named seam handed to `EPIC-004`'s decomposition**, recorded in
this ticket's *Dependencies* so it is not rediscovered. This is a deferral with a named owner, not an
omission.

**3. Is a claim offered when one is available? No prompt, no interruption — the frame states it.**
The status panel gains one indicator (`ABC-016`, amended today) naming what is claimable by the side
to move; the player types `claim` when they want it. **An offer prompt was rejected on product
grounds:** `EPIC-002` acceptance `4a` requires every frame to have an identical row count, and a
modal offer breaks that; and this product's value is *one command, five seconds, and you are
playing* — the same reasoning that rejected the first-run glyph prompt in epic amendment `[A1]`
(`2c`). A player who never learns the command loses nothing they had before this pair of tickets:
the game still ends automatically under 9.6.

**4. What does the status panel show? Availability, attributed to the side to move.** Not "you may
claim" — the panel renders on the engine's plies too, and the claim genuinely belongs to whoever has
the move. One rule, no special case, and it matches `gameStatus`'s own semantics exactly. `ABC-016`
owns the rendering; this ticket owns the value it renders.

## Scope

**The loop's claim path**, built on `ABC-019`'s state machine and its two stub seams.

- **A fifth prompt outcome, `claim`,** alongside `ABC-019`'s four non-advancing outcomes (rejected,
  ambiguous, non-mutating command, input unavailable). It is the only command outcome that
  **terminates**; the other four return to the prompt.

  > **BOUNDARY CORRECTED 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask
  > `refinement-post-abc030`, Workflow 07). This is the paragraph the board row recorded as *"flagged
  > by BA/PM at `refinement-ABC-019`, not taken"*. **Taken here, and re-derived from merged code rather
  > than transcribed from the row.**
  >
  > **`ABC-019` shipped, and the outcome union already has six arms** — `move`, `rejected`,
  > `ambiguous`, `command`, `eof`, `game-over` (`src/turn-loop.ts:118-124`). So *"a fifth prompt
  > outcome"* is no longer an accurate description of what this ticket adds: **the arm exists**.
  >
  > **The split, stated once.** `ABC-019` owns **only that the transition exists** — that `game-over`
  > is reachable from `awaiting-human` at all — and says so in merged code
  > (`src/turn-loop.ts:114-116`: *"`game-over` is the transition `EPIC-006`'s `resign` and `ABC-021`'s
  > `claim` both drive. THIS TICKET OWNS ONLY THAT THE TRANSITION EXISTS … Neither verb, its
  > availability nor its wording is decided here."*). **This ticket owns transition 16**: driving
  > `game-over` from `awaiting-human` **with a claimed reason**, plus the availability value and the
  > incorrect-claim rejection.
  >
  > **No size change.** `S` (2) stands: the arm being present makes this ticket smaller, not larger,
  > and the re-sizing condition below (an `ABC-019` design hop landing the terminal-reason type in a
  > non-additive shape) is **discharged** — `TerminalReason` shipped as a union
  > (`src/turn-loop.ts:78`) and admits additional reasons additively.
  >
  > **One further boundary, recorded because it did not exist when this ticket was cut:** the `claim`
  > **token** at the real prompt is `ABC-035`'s (cut 2026-08-12 under `EPIC-003`), which owns its
  > grammar, its tolerance and the teaching rejection when nothing is claimable. That ticket and this
  > one have **no build-time dependency in either direction** — this ticket builds against `ABC-019`'s
  > stub input seam, exactly as its `## Out of scope` already says.
- **A correct claim ends the game.** The loop stops with a terminal reason naming the claimed article
  (threefold repetition claimed, or fifty-move claimed), the final frame shows the claimed position,
  and the process exits **0** — the same termination shape `ABC-019` already specifies for checkmate.
- **An incorrect claim is rejected with a reason that teaches**, and is otherwise `ABC-019`'s
  existing `rejected` path unchanged: the ply is not advanced, the position is byte-identical by
  `toFen`, `gameStatus` is **not** re-evaluated, and the prompt is re-issued. The message names the
  gap — *this position has occurred twice; a claim needs three* / *the halfmove clock is 41; a claim
  needs 100* — never a bare "cannot claim". That is `EPIC-003`'s "reject with a reason that teaches"
  standard applied to a command.
- **The claim-availability value reaches the frame.** The loop already calls `gameStatusOf(history)`
  exactly once per ply (`ABC-019`'s `NFR-002` bar: *derive the counts once per ply, not once per
  call site*). Availability is read off **that same call**. No second derive, no second
  `repetitionCounts`.
- **The engine seam is never asked for a claim** in this slice, and the loop never claims on the
  engine's behalf.
- **The loop's terminal-reason type admits the claimed reasons** in addition to the automatic ones
  and `resignation`. `ABC-019` already requires that type to be a superset of the rules core's;
  `ABC-020` widens the core's set and this widens the loop's.

## Out of scope

- **The `claim` verb's grammar, aliases, tolerance and tab-completion** — `EPIC-003`, whose `## Scope`
  was amended today to name the command. This ticket builds against `ABC-019`'s **stub** input seam,
  which matches a literal token, exactly as that ticket builds its coordinate reader from merged code
  alone. The stub is a test seam, not a design for the parser.
- **Rendering the availability indicator** — `ABC-016`, amended today to carry it as item 7.
- **The result screen's wording for a claimed draw** — `EPIC-006`.
- **The engine's claim policy** — `EPIC-004`, per the ruling above.
- **What is claimable, and when** — `ABC-020`. This ticket asks the rules core; it does not decide.
- **Draw offers (FIDE 9.1), claiming a draw that will arise after an intended move (9.2.1.1 /
  9.3.1), and any penalty for a false claim (9.5.3)** — all three cut in `ABC-020`'s
  `## Out of scope` with their reasons. Named again here only so nobody re-opens them at the prompt
  layer, where they would look like input features rather than rules.
- **`undo` after a claim, `new`, `resign`** — `EPIC-006`'s command set.

## Acceptance (Given/When/Then)

- **Given** a scripted game driven to `ABC-020`'s A1 position (`6k1/5ppp/8/b7/8/8/5PPP/4R1K1` with
  the shuffle `Kh1 Bb6 Kg1 Ba5 Kh1 Bb6 Kg1 Ba5`) with the **human** playing White, **when** the human
  types `claim` at the prompt, **then** the loop terminates with a reason naming a **claimed
  threefold repetition**, the final frame shows that position, and the process exits **0**.
- **Given** that same position, **when** the human instead plays `Re8`, **then** the game ends
  `white-wins` / `checkmate` and **no draw is reported at any point in the run**. *(This is the
  owner's directive end to end: the draw is available and it is never imposed. Assert on the whole
  run's terminal verdict, not only the final one.)*
- **Given** a position in which nothing is claimable, **when** the human types `claim`, **then** the
  ply is **not** advanced, `toFen(position)` is byte-identical, `gameStatus` is **not** re-evaluated,
  the message names how far the position is from a claim, and the prompt is re-issued. *(Same
  assertions `ABC-019` makes for `rejected`; this is that path, not a new one.)*
- **Given** a claim is available and the **engine** has the move, **when** the engine seam runs,
  **then** the engine plays a move and **no claim is made** — assert by spy that the engine seam is
  never asked for one — and the game continues.
- **Given** a repeated line driven to a **fifth** occurrence with neither side ever claiming, **when**
  the loop evaluates, **then** it terminates automatically with the **fivefold** reason and exits 0.
  *(The 9.6.1 backstop reached through the loop rather than through the rules core in isolation —
  the end-to-end proof that declining to claim cannot hang the game.)*
- **Given** any ply, **when** the frame is composed, **then** the claim-availability value is present
  and was read from the **single** `gameStatusOf` call that ply already makes. *(Assert the call
  count, not just the value. A second derive per ply is the easy wrong implementation and it is
  invisible to every content assertion.)*
- **Given** the loop's terminal-reason type, **when** it is inspected, **then** it admits both claimed
  reasons **and** `resignation` **and** the automatic reasons, **without** `src/gameend.ts` being
  changed by this ticket.
- **Given** `ABC-019`'s per-ply overhead bar, **when** measured after this ticket, **then** it still
  holds. *(See NFR triggers.)*

## Dependencies

- **`ABC-020`** — hard. There is nothing to claim until the rules core reports a claimable set, and
  building this against today's automatic semantics is meaningless.
- **`ABC-019`** — hard. This is one outcome added to that ticket's eight-state machine and one
  terminal transition; it is not a loop of its own. `ABC-019` was amended today to remove its
  "no claim draw" `## Out of scope` block and to carry this ticket by name.
- **`ABC-012`** — the counts supplier behind `gameStatusOf`.
- **`ABC-016`** — no dependency in either direction at build time. The panel reads availability from
  `gameStatusOf(history)` itself; this ticket does not render and that ticket does not decide.
- **Handed to `EPIC-004`'s decomposition, recorded here so it is not lost:** the engine's claim
  policy. The requirement to cut there is *the engine claims a draw when one is available to it and
  its evaluation of the position is not better than a draw* — one ticket-sized decision that needs
  the evaluation function and nothing else.
- **Handed to `EPIC-003`'s decomposition:** the `claim` verb at the real prompt (amended into that
  epic's `## Scope` today).

## Security / NFR triggers

- `NFR-002` — `ABC-019`'s bar of **loop overhead ≤ 100 µs per ply at 120 plies** (excluding render,
  input wait and engine call) is **unchanged by this ticket**, and that is the measurable
  requirement: availability is read from the `gameStatusOf` call the ply already makes, so this adds
  **zero** derives. A second `repetitionCounts` per ply would cost 46–50 µs at 120 plies (measured,
  Apple M3 / Node v24.12.0 / darwin-arm64) — half the whole per-ply budget for a value already in
  hand.
- `NFR-003` (input responsiveness, 50 ms keystroke) — the claim path does no work the prompt did not
  already do. No bar of its own.
- **Security: the rejection message.** It reports counts and clock values derived from the position,
  plus at most the literal command token. Any echo of user-supplied text goes through the frame's
  message region, which **`ABC-018` sanitizes** — that ticket owns terminal escape-sequence
  injection for the whole frame, and this ticket introduces no second path to the sink.

## Test notes

Everything here is testable **today's way** — through `ABC-019`'s stub seams, with no parser and no
engine. The stub input seam matches a literal token, so `claim` is one more token beside a
coordinate.

- **Drive the A1 line twice from the same fixture**, once ending in `claim` and once ending in `Re8`.
  The pair is the ticket: same position, two legal continuations, two different correct results. A
  single test proves half of it.
- **Assert the whole run's verdicts, not only the last one.** The `Re8` case must show that no draw
  was reported at the third occurrence either — that is the regression that would mean `ABC-020` had
  been undone underneath this ticket.
- **Assert the engine seam is never asked to claim, by spy.** A future engine that starts claiming is
  a behaviour change that must fail a test rather than surprise a player, and the spy is the only
  thing that can catch "the loop quietly claimed for it".
- **Assert the `gameStatusOf` call count per ply.** One. This is the same shape as `ABC-019`'s
  spy-assertion that every `gameStatus` call carries a counts map, and it belongs in the same test
  harness.
- **Reuse an en-passant-free repeated line** (`src/gameend.test.ts:26-50`'s `knightCycles` shape) for
  every repetition fixture, for `ABC-011`'s reason — the same instruction `ABC-012`, `ABC-019` and
  `ABC-020` all carry.

  > **CITATION CORRECTED 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask
  > `refinement-post-abc030`, Workflow 07). This line read **`src/gameend.test.ts:27-58`** and that
  > range was wrong in both directions. **Re-measured at the source on `main` at `43d5a9d`, not
  > repeated from the board row that flagged it:** `knightCycles` runs from its doc comment at line
  > **26** to its closing brace at line **50** — `27-58` starts one line inside the comment and runs
  > eight lines past the function, into `describe("ABC-007 acceptance")`. The correction was flagged
  > by BA/PM at `refinement-ABC-019` and **not taken**; it is taken here. Nothing else in this bullet
  > moved and no fixture changes.

## Size and priority rationale

**Size `S` (2).** One new prompt outcome, one terminal transition, one rejection message, and one
value passed to the frame — all on a state machine `ABC-019` has already specified in full, and all
testable through stubs that ticket already builds. No new module, no chess logic (the rules core
answers every question), no new dependency edge. Calibrated against `ABC-017` (layout over an
existing list, `S`) and `ABC-011` (one guarded condition plus two test shapes, `S`).

**One re-sizing condition, named now rather than improvised later:** if `ABC-019`'s design hop lands
the terminal-reason type in a shape where adding two claimed reasons is not additive, re-size at that
hop — at most `M`, and never split, because it is one outcome in one state machine.

**Priority `P1`, deliberately not `P0`.** `ABC-020` alone leaves the product **fully FIDE-conformant**:
no draw is imposed that the Laws do not impose, and every game terminates under 9.6. The directive is
satisfied without this ticket. What is missing without it is the player's *ability to exercise* a
right the Laws grant — half a rule, not a broken one.

- **Not `P0`:** nothing illegal or non-FIDE happens without it, and it cannot be built until
  `ABC-019` exists.
- **Not `P2`:** `P2` on this board is the drop-first tier (`ABC-017`). This is not droppable — a
  product that tells the player a draw is claimable and offers no way to claim it is worse than one
  that never mentions claims, and the panel indicator `ABC-016` now carries would be a dead end.

## Definition of Ready

Problem ✅ · scope + out-of-scope ✅ · INVEST ✅ (testable end-to-end through `ABC-019`'s stubs) ·
acceptance measurable ✅ (exact fixture line, exact terminal reasons, byte-identical FEN on
rejection, exact call counts, exit code) · dependencies ✅ (`ABC-020` and `ABC-019` hard and named;
two hand-offs recorded with their owners) · NFR triggers ✅ (`ABC-019`'s per-ply bar, unchanged, with
the cost of the wrong implementation quantified) · test notes ✅ · size `S` ✅ · priority `P1` ✅ ·
no blocker ✅ *(its dependencies are tickets, not unresolved decisions)*

Sits in `Backlog` behind `ABC-020` and `ABC-019`. Promotion to `Ready` is a separate BA/PM step and
has not been taken.

### RE-VERIFIED 2026-08-12 by BA/PM — **both hard dependencies are MERGED; the `blocked-until` is FULLY discharged and this is the SIXTH stale reference on this board**

Task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`, Workflow 07. **Checked at the source,
not read off the row that carries the claim.**

- **`ABC-020` — merged 2026-08-02** (`d53ce31` → `cb62c9f`). That half was already recorded as
  discharged on 2026-08-11.
- **`ABC-019` — MERGED, and it is in `Done`.** `src/turn-loop.ts` exists on `main` at `43d5a9d` with
  `InputSeam`, `PromptOutcome`, `TerminalReason` and `runTurnLoop` all exported. **The board row still
  reads `blocked-until: ABC-019 only`.** That row was corrected on 2026-08-11 and was accurate that
  day; `ABC-019` landed after it. **This is the sixth stale `blocked-until` reference found on this
  board — the fifth was found on 2026-08-11 and the reason it keeps happening is structural: the row
  is corrected when the blocker is checked, not when the blocker merges.**
- **Nothing else blocks it.** `ABC-012` and `ABC-016` are both in `Done`.

**Definition of Ready, re-scored item by item against
`agent-factory/checklists/definition-of-ready.md`: 10 of 10 MET.** Problem ✅ · scope + out-of-scope ✅
*(both corrected at this hop — the transition-16 boundary and the `gameend.test.ts` citation)* ·
INVEST ✅ *(and now genuinely **independent**: both hard dependencies are merged, so nothing is in
flight beneath it)* · acceptance measurable ✅ *(exact fixture line, exact terminal reasons,
byte-identical FEN on rejection, exact call counts, exit code)* · dependencies ✅ *(both merged;
two hand-offs recorded with owners; one new non-dependency named — `ABC-035`)* · NFR triggers ✅
*(`ABC-019`'s ≤ 100 µs per-ply bar, unchanged, with the wrong implementation priced at 46–50 µs)* ·
test notes ✅ · size `S` ✅ · priority `P1` ✅ · no blocker ✅.

**One NFR note added at this hop and it changes nothing on this page:** `N8-LANE`
(`plans/nfr-catalog.md`) did not exist when this ticket was cut, and its own rule is that *"a ticket
that states nothing has stated this one"*. So this ticket inherits **≤ 650 ms CPU** (5% of
`NFR-008`'s 13 s clause), net of 160 ms per test file added. **Expected new test files: 0–1** — the
claim path's rows belong beside `ABC-019`'s in `src/turn-loop.test.ts`, which already exists.

**`Backlog → Ready` REQUESTED 2026-08-12 by BA/PM.** `plans/board.md` was **not** opened for edit — it
is the Orchestrator's. `Ready` stands at 0/8, so no WIP limit is approached.

## QE gate 2026-08-13 — `READY_FOR_HUMAN_REVIEW`: all eight criteria MET, zero code defects, seven gaps

Task `abc021-qe-2026-08-13`, subtask `quality-gate-ABC-021`, Workflow 05, on the branch tip
`4601f14`. **Every figure below was run; the full evidence is in `.grugops/context/quality-gate-ABC-021/`.**

**Gates:** lint **0** (49 files, 2 pre-existing infos, green on the FIRST run — `self_fix_attempts`
**0 of 2** consumed by QE), typecheck **0**, build **0**, `npm test` **0** — **816 passed / 816 on 28
files**, skip **0**. **`test-integrity` exit `2` = COULD NOT RUN** (`.grugops/test-skips.md` absent —
`H2`'s, a named human's, and NOT created here); recorded as an error distinct from a clean fail and
never as a pass. **`PERFT_DEEP` ruled NOT REQUIRED** — the rules-core diff is empty for the branch and
for this hop — **and run anyway: 32/32 exact, 37.47 s.** Coverage of `src/turn-loop.ts` **100 %** on
all four v8 counters; with this ticket's `describe` skipped, **81.11 %**, uncovered at `234-244` and
`335-341` — exactly the ticket's own lines and nothing else. **`git merge-tree --write-tree main
HEAD` exits 0 with a clean tree: no rebase conflict.**

**All eight acceptance criteria MET, each against a named wrong build with a measured verdict** —
seventeen mutants on an md5-pinned tree, full suite each, restored in a `finally`. Fifteen killed.
**Seven of them die at criterion 3's row and nowhere else, two of those being criterion-1 and
boundary defects: that row is this ticket's load-bearing one and a later hop must not simplify it.**
The build this ticket's own page literally asks for — the illustrative prose at **53** and **43**
columns — is RED at criterion 3, because an over-wide item is dropped whole behind `(+2 more)` at
every `W` this product can produce (18 board-only, 21–23 at the real panels). **The delivered
numbers max at 17 columns against a floor of 18: one column, and it is structural.**

**The no-second-derive deduction SURVIVES; the bar guarding it did not.** Zero derives on any
advancing ply, confirmed. But a build calling `keyHistory` once per ply passed **814/814** with
`repetitionCounts` at 0 and `gameStatus` at `plies + 1` — both bars at their exact correct-build
values while paying the second 46-50 µs replay `NFR-002` forbids. This ticket opened the first
production import edge from the loop to `keyHistory`; the hole pre-existed and this is the first code
through it. Two rows were added to the existing `src/turn-loop.test.ts` (**zero new test FILES**,
+73/−1, ≤ ~200 ms CPU and not distinguishable from a null control) and both survivors now die.

**Seven gaps, none blocking, each with an owner:**

- **`G-1` (MEDIUM) — `ABC-030`.** `src/turn-loop.nfr.test.ts`'s *"`repetitionCounts` at 0 proves the
  loop derives nothing on its own"* is now false, and its bar cannot see `keyHistory`. One line, in
  the file the bar lives in. **That file was NOT opened here** — the bar is proved by it unedited.
- **`G-2` (MEDIUM) — BA/PM, before `ABC-035` is built.** `ABC-035` contradicts itself three ways on
  who owns the unavailable-claim message. Its `gameStatusOf`-is-a-`repetitionCounts`-call defect is
  confirmed; **the claim that such a derive is invisible to the loop's spy is FALSE — measured, seven
  tests go red, four of them `ABC-019`'s.** The ruling rests on ownership, not on invisibility.
- **`G-3` (LOW-MEDIUM) — Software Engineer, comment text, zero behaviour.** `src/turn-loop.ts`
  contradicts itself: `:105` *"FOUR of these do not advance a ply"* against `:255` *"FIVE outcomes are
  non-advancing"*; and `:247`'s *"sixteen transitions"* is **seventeen** under `ABC-019`'s ratified
  by-trigger table, since the refused claim is its own trigger and its own path — the module's own
  new paragraph says *"one outcome, TWO EDGES"* and then counts one.
- **`G-4` (LOW).** `plans/traceability.md`'s own 2026-08-13 header claims `git diff --stat` reads
  `1 insertion(+), 1 deletion(-)` (measured **3/1**) and `+88/−10` where its `ABC-021` row correctly
  reads **+89/−10**. Corrected in the QE append, not by rewriting the header.
- **`G-5` (LOW, criterion gap not a defect) — BA/PM.** No criterion says in falsifiable form that the
  **loop** owns transition 16. A build with the loop's arm deleted and the seam adjudicating from
  `keyHistory` passed 814/814. The new `A8` (iv) falsifies it now; this page still does not.
- **`G-6` (LOW) — whoever is next in `src/turn-loop.test.ts`.** The human playing **black** and
  claiming on its own ply is covered by no row here (all drive `humanColour: "white"`; criterion 4's
  black run puts the claim on the *engine's* side). Driven by hand this hop: correct. One row.
- **`G-7` (INFO) — `H2`, a named human.** No skip registry, so `test-integrity` exits `2` every gate.

**`src/turn-loop.ts` md5 `347755ed…` unmoved across the whole hop: QE wrote no production line, in
any file.** `plans/board.md` NOT opened (the Orchestrator's), `plans/metrics.md` not written,
`.grugops/test-skips.md` not created, the four `*.nfr.test.ts` files `ABC-030` owns not opened.
**The `In Review` exit is REQUESTED, not taken. Nothing merged, pushed or deployed.**

## Board history

Every `plans/board.md` entry ever written about this ticket — column entries and exits, the WIP
counts at each move, and what each gate recorded — is in
[`history/ABC-021-board-history.md`](history/ABC-021-board-history.md) (3,264 bytes), moved there **verbatim** on 2026-08-10 when the board
was tidied. It is not duplicated on the board and nothing was summarised or dropped.
