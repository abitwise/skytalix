---
id: ABC-112
title: The product advertises `quit` in its own `help` output and does not honour it — the PROMISE, not the effect
status: backlog
column: Backlog
size: XS
priority: P1
epic: EPIC-006
feature: —
---

# ABC-112 — `help` prints a token the build ignores: stop promising it until `ABC-046` honours it

> **Cut 2026-08-20 by BA/PM** (task `cut-epic006-gaps-2026-08-20`, subtask `cut-epic006-gaps`,
> Workflow 07), out of the conducted UAT of `ABC-035` (2026-08-20), which measured it **playing the
> real product** and deliberately did **not** file it as that ticket's defect.
>
> **THIS TICKET IS THE PROMISE, NOT THE EFFECT.** `quit`'s effect — confirmation, the end of the
> session, the message that is not `input ended`, the exit code — **is `ABC-046`, which was cut
> 2026-08-13, is `P2`, and is blocked by an open Architect/Design ruling.** Nothing here re-cuts,
> re-scores or amends it. **This ticket exists because the product ships TODAY telling the player it
> has a command it does not have, and closing that is not blocked by that ruling.**
>
> **`ABC-035` is `Done` and is NOT re-opened.** Its grammar is correct and this gap was never its
> defect: it owns the token, `EPIC-006` owns the effect, ruled 2026-08-12 and accepted by the owner
> on that understanding. **What this ticket does touch is two of its delivered ASSERTIONS — see
> `## The Done criterion this ticket falsifies, named rather than smoothed`.**

## Problem

*User*: the first-time player, in the first thirty seconds, who types the one word every terminal
program has taught them to type.

*Pain, measured on `main` @ `d849da9` on 2026-08-20 by running the product, not by reading it:*

```
$ printf 'help\nquit\nquit\n' | node src/cli.ts
...
commands: help board
quit claim
...
> input ended        exit 0
```

**`help` prints `quit`. Two `quit`s later the session is still running.** 4 frames for 3 typed lines
plus end-of-input — one redraw per prompt, no message, no exit. The session ended at **EOF**, and the
last thing the player is told is `input ended`, which is not what they did.

**The advertisement is automatic and therefore cannot drift back into truth on its own.**
`helpMessages()` is folded out of `COMMAND_TABLE` — `[HELP_HEADING, ...COMMAND_TABLE.map(spec =>
spec.token)]` (`src/command-input.ts:82,94`) — so **any token in the table is advertised, whether or
not anything honours it.** The table is the vocabulary; it is not, and has never been, a list of
capabilities.

*Value*: a product that lists a command it ignores is lying to the person using it, and it is the
one thing this build does that a player will call broken outright. **`ABC-046` will fix the lie by
making it true; that is the right fix and it is blocked. This ticket makes the product honest in the
meantime, at a cost of one filter.** It is also the cheapest defence this codebase has against the
same shape recurring: `ABC-045` (`resign`) and `ABC-102` (`undo`) both add tokens to that table
ahead of their effects.

## The ruling this ticket makes, on the page rather than implicitly

**BA/PM, 2026-08-20. A token whose effect is not implemented is NOT printed by `help`. The token
stays recognised.**

Three shapes were priced. **The ruling is (a).**

| shape | cost |
|---|---|
| **(a) `help` prints only honoured tokens; `quit` stays recognised and inert** | **ADOPTED.** One filter over `COMMAND_TABLE`, no ruling needed, reversible by one flag flip when `ABC-046` lands, and it removes the promise without removing the word. **The player who types `quit` is no better off — they are simply no longer told they should.** |
| **(b) `help` prints `quit` with a caveat ("not yet", "soon")** | **REJECTED, on a measured budget.** The message region is `MESSAGE_ROWS = 2` (`src/frame.ts:45`) at a delivered panel width of **21 columns**, and QE measured the real ceiling at `ABC-035`'s gate: **seven items fit at exactly 21/21, eight overflow.** The region holds five items today. `ABC-107` is already open on that overflow, and `ABC-035` `A7`'s standing instruction is *"shorten the help, never widen the frame"*. **Buying honesty with the frame budget spends a resource two other tickets are already short of.** |
| **(c) honour `quit` here — end the session, exit 0** | **REJECTED as a scope breach.** That is `ABC-046` `A2`/`A3` verbatim, and it is blocked by a ruling that is Architect/Design's. **Doing it quietly here would be deciding that ruling by delivery**, which is the one thing `ABC-046` was cut to prevent. |

**What this ruling deliberately does NOT decide:** whether `quit` confirms, whether its message
differs from `INPUT_ENDED_NOTICE`, and what exit code it carries. **All three are already ruled on
`ABC-046`'s page** (two-state confirmation, no result recorded, exit **0**, `A3` explicitly
falsifiable against the merged constant). **They are not re-ruled here and this ticket must not be
read as re-opening them.**

## Scope

- **`helpMessages()` prints only tokens the build honours.** Today that is `help`, `board` and
  `claim`; `quit` is excluded. The exclusion is **data on the table**, not a hard-coded name — so
  `ABC-046` restores `quit` by flipping one field, and `ABC-045`/`ABC-102` add their tokens
  unadvertised until their effects land.
- **`quit` stays a recognised token with an unchanged outcome.** `classifyCommand("quit")` still
  returns the `command` arm; it is not deleted, not made `unreadable`, and not made a move.
- **The two `ABC-035` assertions this changes**, in the same ticket. See below.

## The `Done` criterion this ticket falsifies, named rather than smoothed

**`ABC-035` `A4`/`A7` assert that `help`'s output carries ALL FOUR tokens and no token outside the
table.** They were correct when written and QE broke their controls and they held. **After this
ticket the four-token half of `A4` is false by design.**

**That is a criterion SUPERSEDED by a later product ruling, not a criterion failed.** It is recorded
here so the engineer who edits `src/command-input.test.ts` is doing something this page authorised in
writing rather than something they talked themselves into at 2am. **`ABC-035`'s page is NOT edited,
its DoR is NOT re-scored, and its column does NOT move** — a closed ticket is not re-opened to carry
a gap it never owned, and this ticket is that gap's home. **The "no token outside the table" half of
`A7` is untouched and still binds.**

## Out of scope

- **`quit`'s effect, confirmation, message and exit code — `ABC-046`.** Fenced above.
- **`new`, `resign`, `undo`** — `ABC-046`, `ABC-045`, `ABC-102`.
- **Widening the frame or the message region** — `ABC-107` owns the overflow, and `ABC-035` `A7`
  forbids widening as the answer.
- **Any change to `src/turn-loop.ts`, `src/frame.ts` or `src/status-panel.ts`.** Nothing here reaches
  the loop or the frame; this is one list, filtered.
- **Re-opening, re-scoring or amending `ABC-035`.** Its two assertions are edited; its page is not.

## Acceptance (Given/When/Then)

- **`A1` (the advertisement matches the build).** **Given** a running session, **when** `help` is
  entered, **then** the message region's items are exactly `commands:` plus the tokens the build
  honours, and **`quit` is not among them** — asserted as a **set equality** against the honoured
  subset of `COMMAND_TABLE`, not by a `not-contains` on the literal string `"quit"`. *(A
  `not-contains` passes on a build that prints nothing at all.)*
- **`A2` (the token is still recognised — the thing that must NOT change).** **Given** the line
  `quit`, **then** `classifyCommand` returns the `command` outcome for token `quit`, the board is
  redrawn exactly once, the ply does **not** advance, and the line is **not** `unreadable` and
  **not** a move. *(`ABC-035`'s grammar is `Done` and correct; this ticket must not cost it.)*
- **`A3` (the exclusion is data, and it is reversible in one field).** **Given** the honoured flag on
  `quit`'s table entry is flipped, **then** `helpMessages()` includes `quit` again with **no other
  change to any file** — asserted by flipping it in the test, not by reading the source. *(This is
  what makes `ABC-046`'s restoration a one-line change instead of a re-litigation.)*
- **`A4` (the region still fits, and the count moved in the direction we said).** **When** `help` is
  entered, **then** the message region reports **zero hidden items** and the item count is **4**
  (down from 5). *(`ABC-035` `A7`'s hidden-count-0 instrument, re-run. This ticket spends no frame
  budget and gives one slot back — stated so the movement is deliberate in both directions.)*
- **`A5` (nothing else changed).** `git diff --name-only main...HEAD -- src/` shows exactly
  `src/command-input.ts` and `src/command-input.test.ts` and **nothing else**;
  `src/turn-loop.ts`, `src/frame.ts`, `src/status-panel.ts` and `src/cli.ts` byte-identical. Suite
  green, skip **0**.

## Dependencies

- **NONE OPEN. This ticket is pullable today** — that is the entire reason it exists separately from
  `ABC-046`, which is blocked by a ruling that is Architect/Design's.
- **`ABC-035` is MERGED** and supplies `COMMAND_TABLE`, `helpMessages()` and the hidden-count
  instrument `A4` re-runs. **`ABC-043` is MERGED** and is why there is a live session to type into
  at all.
- **`ABC-046` is the successor, not a blocker.** When it lands it flips `quit`'s flag back via `A3`.
  **If `ABC-046` is pulled BEFORE this ticket, this ticket becomes unnecessary and should be
  cancelled rather than delivered** — stated so nobody delivers a filter into a build that already
  honours the command.
- **Cross-ticket check:** `ABC-107` (message-region overflow) and `ABC-036`/`ABC-038` (completion)
  touch the same table. This ticket removes a token from the *printed* list only; completion targets
  are the token list and are unaffected.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol. **This ticket
  adds zero test files** (it extends `src/command-input.test.ts`), so its own lane cost is a handful
  of pure-value assertions on an existing file.
- **`NFR-002` — not triggered.** No frame is composed here and `src/frame.ts` is byte-identical.
  `A4` is a **correctness** assertion on the region's hidden count, not a latency one — named so the
  two are not confused, the same way `ABC-046` `A5` is.
- **Security — not triggered.** One list filtered; no player byte reaches anything new, nothing is
  spawned, no dependency is added. **Firing threshold, falsifiable:** it fires if the diff touches
  any file under `src/` other than `src/command-input.ts` and its test file.

## Test notes

1. **`A1` must be a set equality, not a `not-contains`.** A build whose `helpMessages()` returns
   `[]` passes every `not-contains` check ever written for it.
2. **`A2` is the regression guard and it is the point.** The cheap wrong fix is to delete `quit` from
   `COMMAND_TABLE`, which advertises nothing, recognises nothing, and silently turns `quit` into
   `unreadable` — a *worse* player experience than today's silence, and it would falsify `ABC-035`
   `A4`'s negative half too.
3. **`A3` flips the flag in the test.** Do not assert on the source text of `command-input.ts`; a
   grep-based assertion passes on a comment.
4. **Reuse `ABC-035`'s existing command-input test file and its hidden-count helper.** Do not build a
   second harness and do not add a file — `ABC-108` has the default lane at or over `NFR-008`'s 13 s
   CPU clause and `ABC-110` is the open remedy.
5. **Run the contained lane, not the repo root.** `npx vitest run --dir src` — the root lane sweeps
   leftover agent worktrees (`ABC-050`) and reports ~1230 files / 36 443 tests. **The baseline this
   ticket is measured against is 39 files / 1190 tests / skip 0 on `main`.**

## Lane cost — how many test FILES this ticket implies

**Zero new files.** All five criteria extend `src/command-input.test.ts`. No `vi.mock`, so no
`*.nfr.test.ts`. **Weight: nil** — it adds no file, and `A4` re-runs an instrument that already
exists.

## Size and priority rationale

**Size `XS` (1).** One filter over one array, one field on one table entry, five criteria, zero new
files, zero new modules, no state, no async, no I/O, and **no open design decision** — the one
decision it needed is ruled on this page and the two rejections are priced. Calibrated against
`ABC-045` (`XS`). **It is not `S`** because unlike `ABC-046` it carries no confirmation state and no
contract question.

**Priority `P1`, and the argument is that the exposure is LIVE and the fix is UNBLOCKED — the two
things `ABC-046` is not.** `ABC-046` is `P2` on a defensible measured argument (*"the player already
has a working exit"* — Ctrl-D exits 0 today), and that argument holds for the **capability**. It does
**not** hold for the **promise**: a player who has been told `quit` works does not know about Ctrl-D,
and the drop-first tier is the wrong home for a one-line correction to something the product says out
loud in its own help text. **Not `P0`:** nothing is broken, no data is at risk, and the session does
end cleanly at EOF with exit 0. **The pre-registered de-prioritisation trigger, so this is
falsifiable:** if `ABC-046`'s ruling lands and `ABC-046` is scheduled, **this ticket drops to `P3`
and should be cancelled, not delivered.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-20**. **Result: 9 of 10 clean, 1 recorded ⚠️ — the ⚠️ is a KNOWN CONSEQUENCE that is
authorised on this page, not an open question. PULLABLE TODAY; the promotion to `Ready` is the
Orchestrator's.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the first-time player; the transcript is reproduced on `main` @ `d849da9` at this hop, and the advertisement is shown to be automatic from `src/command-input.ts:82,94` rather than argued |
| 2 | scope and out-of-scope clear | **✅** one filter plus one field; five fences, with `quit`'s effect, confirmation, message and exit code all fenced to `ABC-046` by name |
| 3 | INVEST-shaped | **✅** independent (no open dependency — the one thing that distinguishes it from `ABC-046`), negotiable, valuable, estimable, small, testable |
| 4 | acceptance testable and measurable | **✅** five criteria: a **set equality** against the honoured subset, a recognised-token regression guard, a one-field reversibility flip, **hidden count 0 / item count 4**, and a named two-file diff |
| 5 | dependencies known | **✅** none open, two merged sources named, the successor named with a cancellation condition, one cross-ticket table check |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002` not triggered with `A4` explicitly labelled correctness; security not triggered with a falsifiable firing threshold |
| 7 | test notes present | **✅** five, including the two wrong fixes that pass a lazy assertion |
| 8 | size assigned | **✅** `XS` (1), calibrated against `ABC-045`, with the reason it is not `S` |
| 9 | priority assigned | **✅** `P1`, argued from the promise/capability split rather than felt, with a pre-registered de-prioritisation trigger |
| 10 | no major unresolved blocker | **⚠️ ONE, AND IT IS A CONSEQUENCE, NOT A QUESTION: delivering this ticket falsifies the four-token half of `ABC-035` `A4`, a `Done` and owner-accepted criterion.** It is superseded by the ruling on this page, the supersession is authorised here in writing, and `ABC-035`'s page, DoR and column are untouched. **It is marked rather than smoothed because an engineer editing a closed ticket's assertions must be able to point at the sentence that let them.** |

## Design ruling 2026-09-19 — this ticket's own de-prioritisation trigger has FIRED

**Architect/Design, task `owner-rulings-2026-09-19`, subtask `ruling-abc046-quit-arm`.** `ABC-046`'s
ruling landed on the owner's word — *"5. b, resign should be separate"* (Olger Oeselg, 2026-09-19) —
as `memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md`, and `ABC-046`
is recommended for pull directly behind `ABC-045` and the arm ticket.

**`## Size and priority rationale`'s pre-registered trigger reads, verbatim:** *"if `ABC-046`'s ruling
lands and `ABC-046` is scheduled, this ticket drops to `P3` and should be cancelled, not delivered."*
The first half is true today; the second is the Orchestrator's scheduling call.

- **This ticket is now a ONE-LINE DEPENDENCY on `ABC-046`, not its own fix.** `ABC-046` makes `help`'s
  `quit` true by giving the token its effect; no `honoured` flag, no filter and no `A3` reversibility
  field is needed, because there will be nothing to reverse. Delivering this ticket first would red
  the four-token half of `ABC-035` `A4` only for `ABC-046` to flip it back.
- **Recommendation to the Orchestrator: cancel, not deliver, when `ABC-046` is pulled** — exactly what
  this page's `## Dependencies` says (*"if `ABC-046` is pulled BEFORE this ticket, this ticket becomes
  unnecessary and should be cancelled"*). If `ABC-046` is NOT scheduled inside the trigger's spirit —
  the arm ticket is uncut and BA/PM's — this page's ruling (a) remains deliverable as written and its
  `A3` flip is what `ABC-046` would then use. **The page is not re-cut; nothing above is edited.**
- **DoR: unchanged at 9/10 ⚠️×1, and moot** — readiness is not the question the trigger asks.
- **Column and priority: unchanged on this page — both moves are the Orchestrator's.**
