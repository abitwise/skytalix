---
id: 20260813T112448Z-software-engineer-observation-a347e08a
kind: observation
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-035
  - ABC-034
  - ABC-019
  - EPIC-002
  - plans/board.md
  - plans/tickets/ABC-035-in-game-commands.md
supersedes:
---

# Four disagreements found on the page, and two boundaries I could not act on

> **Hand-authored**, per the sibling `decision` notes. Not a `finding`. Every claim below was
> checked at the source named, not read off a row that carries it.

## 1. `ABC-035` and `ABC-021` BOTH claim the "nothing is claimable" teaching message — LIVE, unresolved

This is the one that needs a BA/PM ruling before `ABC-035` is built, and it is a duplicate-work risk
rather than a defect in what shipped.

- **`ABC-021` (this page)** — `## Scope` bullet 3 and acceptance criterion 3 both require the loop to
  refuse an unavailable claim with a message naming how far the position is from one. The
  2026-08-12 `BOUNDARY CORRECTED` block re-affirms it: *"This ticket owns transition 16 … plus the
  availability value **and the incorrect-claim rejection**."*
- **The SAME block, four paragraphs later**, says `ABC-035` *"owns its grammar, its tolerance and
  **the teaching rejection when nothing is claimable**."*
- **`ABC-035`'s own page disagrees with ITSELF on the same question.** Its scope table (`:38-43`)
  routes `claim` when unavailable to a `command` outcome and names the effect owner **`ABC-021`** —
  while its prose two bullets later (`:52-54`) writes that message itself, quoting the same two
  example sentences this ticket quotes, and its `## Out of scope` (`:74-75`) says *"This ticket
  supplies the token **and the unavailable-case message**"*, with an `A5` to prove it.
- **`plans/board.md:97` sides with the table**: *"`help`, `board`, `quit`, `claim`: **grammar only**,
  effects stay with EPIC-006/ABC-021"*.

**Built here, and the reason is not "my page said so".** The loop must be TOTAL over its own outcome
union: a seam can hand it `{kind:"claim"}` in a position with nothing claimable, and the loop cannot
crash, cannot end the game, and cannot go silent. `ABC-019` settled the same question for the input
seam the other way for a different reason (`A10b`: a `{kind:"move"}` that is not legal is a PARSER
BUG and THROWS) — a claim is a REQUEST rather than an assertion, so refusing it with a reason is the
correct answer where throwing was correct there.

**What is owed to `ABC-035`**, and it is cheap if taken before that ticket is built: if its parser
returns `{kind: "command", messages: [...]}` for an unavailable claim, the loop's refusal path
becomes unreachable through it and its `A5` re-asserts, at the parser layer, a behaviour that is
already tested at the loop layer. Either amend `ABC-035` to ASK the loop (return `{kind:"claim"}`
and let transition 16 answer), or record deliberately that the two layers each hold their own
message. **Not my call, not taken here.**

**And there is a measured reason to prefer the first option.** `ABC-035` `## Out of scope` `:76-78`
has its parser ask availability *"through `gameStatusOf(history)`"* while forbidding it to call
`repetitionCounts` itself — but **`gameStatusOf` IS a `repetitionCounts` call**
(`history.ts:152-153`). A parser that asks on every prompt therefore makes a SECOND derive on every
**advancing** human ply: precisely the 46-50 µs at 120 plies that `ABC-021` prices and `NFR-002`
bars, arriving through a door the loop's own call-count spy cannot see, because the derive happens
inside the seam rather than in `runTurnLoop`. A parser that returns `{kind:"claim"}` and lets
transition 16 answer needs **no** derive at all. Flagged, not acted on — `ABC-035` is not this
subtask's file.

## 2. Three of the six `## Scope` bullets needed ZERO production lines — they were already true

Checked against merged `main` at `06c5427`, not assumed:

- *"The claim-availability value reaches the frame"* — already true. `RenderSeam` takes the
  `GameStatus` the loop evaluated, and `ABC-020` put `claimable` on it. `ABC-019`'s `A13` already
  asserted the claim reaches the render seam. What was owed was a TEST that the value reaches the
  frame's own text and comes off the single derive — `A6` — not a line of production code.
- *"The engine seam is never asked for a claim"* — already true by construction: `EngineSeam` is
  `(history) => Promise<Move>` and has no channel to ask through. Owed: the spy (`A4`).
- *"The loop's terminal-reason type admits the claimed reasons … `ABC-020` widens the core's set and
  **this widens the loop's**"* — **stale.** `ABC-019` shipped `TerminalReason` already including
  `ClaimableDraw`, and its own header says so. Nothing was widened by this ticket; nothing needed to
  be. The `BOUNDARY CORRECTED` block already discharges the re-sizing condition on exactly this
  ground, so the `## Scope` sentence simply was not updated with it.

Consequence for sizing calibration rather than for the build: `S` (2) was right and, in production
terms, generous — the ticket is one type arm, one branch and one message helper.

## 3. Two more stale phrasings, both harmless, both from before the 2026-08-12 correction

- *"A **fifth** prompt outcome, `claim`"* (`## Scope`, and `ABC-035` `## Out of scope` repeats it):
  `PromptOutcome` had six arms before this hop and has **seven** after. The `BOUNDARY CORRECTED`
  block says the phrase is no longer accurate; `## Size and priority rationale` still carries it.
- *"the sixteenth [transition] … is `ABC-021`'s"* in `src/turn-loop.ts`'s own header said *"Eight
  states and **fifteen** transitions"*. Amended in this diff to sixteen, along with the render-cadence
  paragraph, which counted *"FOUR outcomes are non-advancing and only three of them emit a frame"* —
  a refused claim makes that **five and four**. That paragraph was falsified by this change, so it
  was corrected rather than left to be true-yesterday.
- **One citation elsewhere is invalidated BY this diff and is named rather than left to be
  discovered:** `ABC-035` `## Scope` `:36` cites the `command` outcome as `src/turn-loop.ts:122`. On
  this branch that arm is at **`:129`** — the seventh arm and the amended doc comment moved it.
  `ABC-035` is not this subtask's file and was not edited.

## 4. Two boundaries this subtask forbade me, so the work is owed elsewhere

- **`plans/board.md` NOT opened.** `ABC-021` still sits in `Ready` (WIP 2/8) there. The Software
  Engineer's own board move is `In Development → In Review`; the ticket was never moved INTO
  `In Development`, and both moves are the Orchestrator's under this subtask's boundaries. Recorded
  in `plans/traceability.md`'s `Status` cell instead, which says explicitly that the board still
  reads `Ready`. **`EPIC-002`'s last open ticket is implemented and the epic cannot be closed from
  here.**
- **`plans/metrics.md` NOT written.** Workflow 04 emits `Cycle time` and `WIP`; the file is outside
  this subtask's boundaries.

## 5. Protocol deviation, declared

Workflow 16 names `scripts/context-io.ts` the only sanctioned writer of this folder. **It exists in
neither this repo nor the kit** (`ls scripts` → no such directory; the kit has `roles/`,
`workflows/`, `checklists/`, `contracts/`, `config/`, `packaging/`, `seed/`), and
`mcp__grugops__propose_note` is not in this session's tools. These notes are hand-authored in the
schema `agent-factory/contracts/context-note.md` defines, **no `index.md` / `index.jsonl` was
fabricated** (they are DERIVED files and there is no deriver), and **nothing is a `finding`** — no
§14 gate exists here to stamp one and `context.human_admission` is `off`. The queue claim was
performed the same way: `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-021/` is atomic and IS
the claim, `scripts/claim.js` being equally absent.
