---
id: 20260813T124000Z-qe-e2e-observation-the-engineers-seven-claims-attacked-at-source-and-three-he-missed-8a17d4c6
kind: observation
by: qe-e2e
at: 2026-08-13T12:40:00Z
verified_by:
confidence: high
refs:
  - ABC-021
  - ABC-019
  - ABC-035
  - src/turn-loop.ts
  - plans/traceability.md
  - plans/tickets/ABC-019-turn-loop-skeleton.md
  - plans/tickets/ABC-035-in-game-commands.md
  - plans/tickets/ABC-021-draw-claim-interaction.md
supersedes:
---

# His five ticket-text claims and two `ABC-035` conflicts, re-derived at source — plus THREE stale sentences he wrote himself

> **Hand-authored.** Not a `finding`. Every line below was opened at the file and line named. I
> attacked these; I did not relay them.

## The two `ABC-035` conflicts — BOTH CONFIRMED, at source

**1. `ABC-035` contradicts ITSELF about who owns the "nothing is claimable" message.** Three
statements on one page:

- **`## Scope` table** (`:38-43`) — the `claim` row's *who owns the EFFECT* column reads
  **`ABC-021`**;
- **`## Scope` prose** (`:52-54`) — *"`claim` when nothing is claimable is a rejection that teaches …
  it quotes numbers `ABC-021` already specifies"*, and then **writes both sentences out**;
- **`## Out of scope`** (`:74-75`) — *"This ticket supplies the token **and the unavailable-case
  message**."*

`plans/board.md` sides with the table — *"`claim`: grammar only, effects stay with
EPIC-006/ABC-021"*. The Engineer cited that as `plans/board.md:97`; on `main`'s current tip it is
**`:100`**, moved by two commits that landed after he read it. The substance is unchanged.

**Duplicate-work risk, LIVE, and it needs a BA/PM ruling before `ABC-035` is built** — not a defect in
what shipped. The loop must be TOTAL over its own outcome union: a seam can hand it `{kind:"claim"}`
in a position with nothing claimable and the loop can neither crash, nor end the game, nor go silent.
Building it here was correct.

**2. `ABC-035`'s `## Out of scope` (`:76-78`) forbids its parser to call `repetitionCounts` while
telling it to ask availability *"through `gameStatusOf(history)`"* — and `gameStatusOf` IS a
`repetitionCounts` call** (`history.ts:152-153`, read at source). **CONFIRMED, and it is a genuine
self-contradiction in that ticket.** But his second sentence about it is **FALSE and I measured it**:
that derive is *not* invisible to the loop's spy — a parser built that way turns **seven** tests red.
The measurement is in the derive note. **The correction matters to the ruling:** the hazard fails
LOUDLY rather than costing 46-50 µs silently, which is a better position than the record held.

## His five "things wrong in the ticket" — four confirmed, one over-stated

| # | his claim | verdict at source |
|---|---|---|
| 1 | *"A **fifth** prompt outcome"* is stale — `PromptOutcome` had **six** arms before this hop | **CONFIRMED.** `06c5427:src/turn-loop.ts` — `move`, `rejected`, `ambiguous`, `command`, `eof`, `game-over`. Six. Seven now |
| 2 | *"this widens the loop's [terminal-reason type]"* is stale — `ABC-019` shipped it already admitting both | **CONFIRMED.** `06c5427` has `TerminalReason = EndReason \| ClaimableDraw \| "resignation" \| …`, with the doc comment already naming `ABC-021` |
| 3 | *"The claim-availability value reaches the frame"* needed zero production lines | **CONFIRMED.** `RenderSeam` already takes the ply's `GameStatus`; what was owed was `A6`, not a line |
| 4 | *"The engine seam is never asked for a claim"* is true by construction | **CONFIRMED.** `EngineSeam = (history) => Promise<Move>` has no channel to ask through; `A4` spies the shape |
| 5 | the module header said *"fifteen transitions"* and *"FOUR outcomes are non-advancing"* and both are now false | **CONFIRMED that they were false. His replacements are not right either — see below** |

**And one of his own is over-stated in the safe direction:** `ABC-021`'s security note says the
message carries *"at most the literal command token"*. It carries **no** user text at all — two
integers and two literal rule names. Nothing to sanitize, and no second path to the sink.

## THREE stale sentences HE wrote, found at source. This is the class of defect this board keeps producing

**S1 — `src/turn-loop.ts` now contradicts itself about the same set, in one file, 150 lines apart.**

```
:105  "What a prompt returns. FOUR of these do not advance a ply, …"      <- NOT amended
:255  "FIVE outcomes are non-advancing and only four of them emit a frame" <- amended this hop
```

Under the convention `:255` uses (non-advancing = returns to the prompt without a ply; `game-over`
excluded because it terminates), `:105` must now read **FIVE**. He amended the cadence paragraph and
left the type's own doc comment, which is the sentence a reader of `PromptOutcome` actually meets.
**He reported amending two now-false sentences; there were three.**

**S2 — *"Eight states and sixteen transitions"* (`:247`) undercounts by one, and the file says so
itself.** `ABC-019`'s ratified table (`plans/tickets/ABC-019-turn-loop-skeleton.md:363-379`)
enumerates **by trigger, not by state pair** — transitions **7, 8 and 9 are three separate rows for
the one pair `awaiting-human` → `rendering`**. By that rule `ABC-021` adds **two**: `awaiting-human`
→ `game-over` (the allowed claim) **and** `awaiting-human` → `rendering` (the refused claim, its own
trigger, its own code path, its own `continue`). **Seventeen, not sixteen.** The module's own new
paragraph states the premise — *"One outcome, **two edges**"* — and then counts one of them.

The file is inconsistent under **either** reading, which is the cleanest way to put it: if the
refusal is a new trigger, `:247` should read seventeen; if it is transition 7 reused, `:255`'s
*"FIVE outcomes are non-advancing"* should not have moved. It cannot be both.

**S3 — `plans/traceability.md` disagrees with itself about this ticket's own diff, and one line
disproves itself.**

```
:2    "`git diff --stat` on this file reads exactly `1 insertion(+), 1 deletion(-)`"
      MEASURED: 3 insertions, 1 deletion.  Writing that _Updated: line IS two of the three.
:2    "ONE production file (`src/turn-loop.ts`, +88/−10)"
:198  "ONE production file, `src/turn-loop.ts`, +89/−10 lines"
      MEASURED: 89 10.  The ROW is right; the HEADER he wrote in the same file is wrong.
```

His own correction note (`…-observation-b70c4d15` § 2) says *"Corrected in `plans/traceability.md`"*
— true of the row, false of the header. **Same shape as S1: the sibling instance in the same file was
left behind.** He also names `main` at `87e771a` there; it is at `be0f92b`, and the board move he
records as still owed (`In Development → In Review`) **has already been made** by `02fe652`.

## Two claims I could not fault

- **`draws[0]` is READING a ratified order, not picking one.** `gameend.ts:53` states it as a
  contract, `status-panel.ts:169` reads it the same way, `A7` drives `AT_92_FEN` so both grounds are
  live at once, and **M13** (`draws[draws.length - 1]`) is red at `A7` and nowhere else. Sound.
- **`claimable.by` is deliberately not guarded.** **M14** overwrites it to the wrong side and the
  suite stays green — because the loop never reads it. That is the mutant *confirming* his rule-8
  argument, and I report it as corroboration rather than as a survivor.

## What is owed, and to whom

**S1 and S2 are comment text in `src/turn-loop.ts`. I did not touch them** — my boundary forbids
changing production, and a comment in that file is the Engineer's line to write. **Owner: Software
Engineer, one hop, zero behaviour.** **S3 is `plans/traceability.md`, which this role owns**, and I
correct the two numbers in my own append rather than editing his header block: notes and headers here
are append-only by this file's own convention.
