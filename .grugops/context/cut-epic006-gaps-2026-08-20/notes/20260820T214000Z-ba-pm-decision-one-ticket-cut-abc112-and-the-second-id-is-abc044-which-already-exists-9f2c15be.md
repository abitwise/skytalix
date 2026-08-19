---
id: 20260820T214000Z-ba-pm-decision-one-ticket-cut-abc112-and-the-second-id-is-abc044-which-already-exists-9f2c15be
kind: decision
by: ba-pm
at: 2026-08-20T21:40:00Z
verified_by: 
confidence: high
refs:
  - EPIC-006
  - ABC-112
  - ABC-044
  - ABC-046
  - ABC-035
  - plans/tickets/ABC-112-help-advertises-a-command-the-build-does-not-honour.md
  - plans/board.md
  - plans/traceability.md
supersedes: 
---

# THE IDS: one new ticket, `ABC-112`. The second gap's id is `ABC-044`, and it was cut on 2026-08-13.

**Hand-authored `decision`, unstamped.** `context.human_admission` is `off`; no `finding` is
admissible on this install and none is claimed.

## Stated explicitly, because the brief asked for both ids

- **`ABC-112` — NEW, cut at this hop.** *The product advertises `quit` in its own `help` output and
  does not honour it — the PROMISE, not the effect.* `EPIC-006`, size **`XS`**, priority **`P1`**,
  **DoR 9/10, ⚠️×1**, `Backlog`, no open dependency.
- **`ABC-044` — NOT NEW, and not re-cut.** *The result screen — eight reasons, two faults, the full
  move list.* `EPIC-006`, size **`S`**, priority **`P1`**, **DoR 8/10, ⚠️×1**, `Backlog`, cut
  **2026-08-13**. **This is the second gap's ticket. I did not allocate a second new id for it.**

**ONE new ticket was cut where the brief fenced EXACTLY TWO. That is a deliberate, recorded
departure, and the reason is on the record above and below rather than smoothed into a second page.**

## Why the second ticket was not cut

`ABC-044`'s `## Problem` is the checkmate gap in the same words, and its `A1` (eight reasons as a set
of size 8), `A2` (`ABC-021`'s claimed-vs-automatic draws) and `A6` (a scripted game driven to
checkmate through the entry point) already cover **every** terminal outcome the brief asked a new
ticket to cover — the evidence is in the sibling `observation` note and is not restated here.

**Writing a second page would have produced a duplicate of a `P1` ticket in the same column, split
one epic's result screen across two ids, and left an engineer to discover the collision at pull
time.** My role's one hard limit is *cut scope, protect the MVP, say no to bloat*. **A ticket quota is
not a reason to cut a ticket.** The authorisation the owner gave was a ceiling on how many tickets
this hop may create, not an obligation to create them; nothing in it can have authorised a duplicate
of a ticket he was not told already existed.

**What the gap actually needs is a pull, not a cut, and that is the Orchestrator's.** `ABC-044`'s only
⚠️ is `ABC-043`, whose code is merged to `main` (`6091212`) — the entry point its wiring attaches to
now exists. **I did not re-score its DoR and I did not move its column**; I annotated its `Backlog`
row in place so the finding cannot be lost the way `NFR-008`'s restatement arithmetic was.

## What `ABC-112` is, and what it deliberately is not

**It is the PROMISE.** `helpMessages()` folds out of `COMMAND_TABLE` (`src/command-input.ts:82,94`),
so every token is advertised whether or not anything honours it. **It is not the EFFECT** — the
effect is `ABC-046`, which is `P2`, drop-first, and blocked by an open Architect/Design ruling, and
which **already rules the confirmation, the EOF distinction and the exit code**. The brief asked for
those three to be ruled; they were ruled on 2026-08-13 and **they are not re-ruled here.**

### The one ruling this hop makes

**A token whose effect is not implemented is NOT printed by `help`. The token stays recognised.**

Two shapes were priced and rejected, on the page:

- **A caveat in the help text** — rejected on a **measured** budget, not on taste: `MESSAGE_ROWS = 2`
  (`src/frame.ts:45`) at a delivered panel width of 21 columns, where QE measured **seven items fit at
  exactly 21/21 and eight overflow**; `ABC-107` is already open on that overflow and `ABC-035` `A7`'s
  standing instruction is *shorten the help, never widen the frame*.
- **Honouring `quit` here** — rejected as **deciding `ABC-046`'s open ruling by delivery**, which is
  the one thing that ticket was cut to prevent.

### The ⚠️, named rather than smoothed

**Delivering `ABC-112` falsifies the four-token half of `ABC-035` `A4`** — a `Done`, owner-accepted,
QE-controlled criterion. That is a criterion **superseded by a later product ruling**, not a criterion
failed, and it is authorised in writing on `ABC-112`'s page **so the engineer who edits a closed
ticket's assertions can point at the sentence that let them.** The negative half of `A7` ("no token
outside the table") is untouched and still binds.

**`ABC-033`, `ABC-035`, `ABC-037` and `ABC-078` were NOT re-opened, NOT re-scored and NOT amended.
No page of theirs was written to at this hop** — `git diff --name-only` is the check, and it names
none of them. **The owner's "All four, pass forward" is not read here as a ruling on either gap**; it
accepted four tickets and answered neither question, and neither new-or-annotated row claims
otherwise.

## Priority arguments, since both are `P1` and they are `P1` for different reasons

- **`ABC-112` `P1`:** the exposure is **live** and the fix is **unblocked** — the two things `ABC-046`
  is not. `ABC-046`'s `P2` rests on the measured fact that *the player already has a working exit*
  (Ctrl-D, exit 0). That argument holds for the **capability** and does not hold for the **promise**:
  a player who has been told `quit` works does not know about Ctrl-D. **Not `P0`** — nothing is
  broken, no data is at risk, the session ends cleanly at EOF. **Pre-registered de-prioritisation
  trigger: if `ABC-046`'s ruling lands and `ABC-046` is scheduled, `ABC-112` drops to `P3` and should
  be CANCELLED, not delivered.**
- **`ABC-044` `P1`, unchanged since 2026-08-13** and not re-argued by me: the epic's third acceptance
  criterion depends on it, and *without it a finished game just stops*.

## What the Orchestrator is being handed

1. **Promote `ABC-112` to `Ready`** — it is pullable today; the column move is his.
2. **Pull `ABC-044`** — its blocker's code is on `main`. That, not a new ticket, is what closes the
   checkmate gap.
3. **Route `ABC-046`'s (a)/(b)/(c) ruling to Architect/Design** — it blocks `ABC-046` and `ABC-102`
   both, and it is still nobody's scheduled work. **I did not decide it and `ABC-112` does not
   pre-empt it.**
