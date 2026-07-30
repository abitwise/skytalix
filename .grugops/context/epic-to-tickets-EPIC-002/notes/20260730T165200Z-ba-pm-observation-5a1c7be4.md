---
id: 20260730T165200Z-ba-pm-observation-5a1c7be4
kind: observation
by: ba-pm
at: 2026-07-30T16:52:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ABC-009
  - ABC-010
  - ABC-011
  - ABC-013
  - ADR-0004
  - NFR-002
  - NFR-003
  - RISK-005
  - plans/board.md
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
  - 20260730T154100Z-system-analyst-claim-a4b7a2d2
  - 20260730T161000Z-ba-pm-decision-9c4e1d83
  - 20260730T162500Z-ba-pm-decision-b7f20a56
  - 20260730T164000Z-ba-pm-decision-3ef8c1d2
supersedes: 
---

# What I escalated instead of ruling, and the disposition of all eight items on the System Analyst's stop list

Subtask `ba-pm-epic002-tickets`. Two purposes: name exactly what went to a named human rather than
being ruled, and account for **every** item the System Analyst stopped on so none is quietly
absorbed. The System Analyst's `claim` note listed eight; I ruled four, deferred three to the epics
that own them, and escalated one — plus one that was already escalated by wave 1.

## Escalated to a named human — two items, and neither blocks the tickets

**1. `ADR-0004` ratification. Hard, named, and on the board.**
`memory-bank/50-decisions/ADR-0004-san-ownership.md` is **`proposed`**. It states of itself that it
does not block cutting tickets but **does block the merge of the first line of `src/san.ts`**.
**No agent may mark an ADR `accepted`** — `ADR-0002` and `ADR-0003` were each ratified in session by
a named human and this needs the same. `ABC-013` therefore sits in the **`Blocked` column**
(`blocked-by: ADR-0004 unratified`, dated 2026-07-30, time-tracked against
`blocked_escalation_days: 2` → escalates 2026-08-01), not in `Ready` where it would be pullable
into work that cannot land. `ABC-016` and `ABC-017` inherit the wait through it and stay in
`Backlog`, because their blocker is a ticket rather than a decision — one outstanding human ruling
should appear once, not three times.
**This is not mine to decide and I did not decide it.** Ratification alone clears the ticket;
everything else on its Definition of Ready is met.

**2. The promise reduction in acceptance #2 (`[A1]` / criterion `2c`). Flagged, non-blocking.**
I ruled the mechanism — default, signal set, `--unicode` override — because that is squarely a
product call. What I flagged rather than settled is the **reduction of a user-facing promise**: the
product no longer promises that a replacement glyph never appears. This repo's standing convention
is that a material promise change is ratified by a named human (`ADR-0002`, `ADR-0003`, and
`NFR-005`'s amendment all were), so the epic marks `[A1]` as awaiting ratification.
**It blocks nothing** — the amended criterion is testable either way, so tickets are cut, sized and
promoted against it. A human who wants the original promise back reverses **exactly one choice**:
the rejection of "ask the player once on first run and remember", which is the only option that
observes what the terminal actually drew. That is stated in the epic so the reversal is a
one-decision change rather than a re-litigation.

**What I did NOT do:** manufacture a ruling to unblock myself, and invent a detection mechanism.
Every signal in the glyph-mode table was named observable by wave 1. Nothing probes a font. One
candidate signal (`WT_SESSION` as a Windows Terminal marker) was considered and **left out because
I could not verify it** — recorded as `UNKNOWN - verify` on the ruling note rather than shipped as
a table row I would have been guessing at.

## The stop list, item by item

| # | Item | Disposition |
|---|---|---|
| 1 | Glyph-mode detection — **BLOCKER for acceptance #2** | **RULED** — `…-ba-pm-decision-9c4e1d83`; epic amendment `[A1]`; `ABC-015`. Residual escalated (above). |
| 2 | Fixed-region vs scroll, bounded history — **BLOCKER for acceptance #4** | **RULED** — `…-ba-pm-decision-b7f20a56`; epic amendment `[A2]`; `ABC-017` + `ABC-018`. |
| 3 | Whether the engine seam yields (thinking indicator static vs updating) | **RULED for `EPIC-002` only: static.** See below. |
| 4 | Colour/shading conflated with glyph mode; `NO_COLOR`; pipes | **RULED — ANSI colour cut from the MVP**, shading by character. See below. |
| 5 | Terminal resize (SIGWINCH) | **RULED — out of scope**, as an accepted cosmetic defect with its reasoning. |
| 6 | Stdin EOF / non-interactive input | **RULED — exit 0 with a notice**; the safety lives in the test's assertion. `ABC-019`. |
| 7 | `NFR-002`'s write half is `UNKNOWN - verify` | **NOT a ruling — needs measurement.** Given a home: `ABC-018`. |
| 8 | `NFR-003`'s 50 ms echo may break during the engine's turn | **NOT mine — cross-epic, and the chain is unverified.** Handed to `EPIC-003`. See below. |

### Item 3 — static, and what that hands to `EPIC-004`

Node is single-threaded, so an **updating** indicator requires `EPIC-004` either to yield once per
iterative-deepening iteration or to run in a worker — a constraint that must be stated *before*
that epic is designed, not retrofitted into a finished search. **Ruling: `EPIC-002` does not impose
it.** A static indicator (shown on entering the thinking state, cleared on leaving, its row present
and blank otherwise) satisfies the epic's scope line literally, needs nothing from `EPIC-004`, and
is fully testable against a stub that merely takes time. Recorded in the epic's `## Out of scope`
so `EPIC-004`'s decomposition inherits a **decision**, not an assumption. If a human later wants an
animated indicator, that is a new requirement on `EPIC-004`'s internals and it must be stated
before that epic is designed.

### Item 4 — colour cut, which is what makes the ASCII criterion complete

ANSI escapes are themselves ASCII, so a coloured frame satisfies "no code point above `U+007F`"
while still being unusable in a pipe and unassertable in a snapshot. Cutting colour disposes of
`NO_COLOR`, of the TTY/pipe divergence, and of the whole question, while keeping the epic's stated
scope item (*"light/dark square shading"*) by delivering it with a **character**. Deferred, not
deleted — `RISK-005` still names colour and the epic records where it went.

### Item 7 — not a ruling, a measurement, and it now has an owner

The System Analyst is right that no render-latency number may be quoted from wave 1: nothing is
built and nothing about a frame was measured. `plans/nfr-catalog.md`'s NFR-002 row already says the
write half is *"the half nobody has measured"*. **`ABC-018` is where it gets measured** — compute
and write separately, at 40/120/300 plies, against a non-TTY sink, recorded with its machine, which
is exactly what the catalog row prescribes.

**Related, and owed to Architect/Design:** bounding the history pane changes the frame from
`O(plies)` to `O(window)`, which makes the NFR-002 row's statement that *"the history panel is
O(plies)"* stale. **That row is not mine to rewrite — flagged, not fixed** (AGENTS.md rules 9 and
12). It is owed an Architect/Design update when the renderer is built.

### Item 8 — genuinely not mine, and it is not `EPIC-002`'s trigger at all

The chain is: tab-completion → raw mode → the *process* echoes → a synchronous search blocks the
event loop for up to 3 s → a **60x** breach of `NFR-003`'s 50 ms echo budget. **Step 2 is the weak
link and it is not a recorded decision**, which is why the System Analyst filed this as a claim.
`EPIC-002` owns no prompt, so `NFR-003` is not this epic's trigger and there is nothing here for me
to rule. **Handed forward to `EPIC-003`'s decomposition**, whose terminal-mode decision resolves it,
and it shares its resolution with item 3: a yielding or worker-based engine removes the breach
entirely. Verify by measurement once both epics exist — not by argument.

## Carried, not owned — the two merged-code defects this epic will be running on

Neither is re-scoped here; both are named on the tickets that inherit them.

- **`ABC-009`** (`legalMoves` mutates a semantically-invalid position). `ABC-019`'s loop calls it
  once per frame through `gameStatus`. Safe while every position comes from legal play out of a
  validated start. Its own escalation trigger — *"any epic begins accepting a position from outside
  the rules core before `ABC-010` lands"* — **has not fired**: `EPIC-002` accepts no FEN from a
  user. It fires at `EPIC-003`'s FEN entry, and this loop is the runtime that will be executing when
  it does. **Sequencing input for `EPIC-003`'s decomposition.**
- **`ABC-011`** (en-passant hashing). Its trigger **has** fired, and it was acted on — escalated
  `P2` → `P1` and promoted to `Ready`, recorded in `…-ba-pm-decision-3ef8c1d2`. Every repetition
  verdict the loop renders inherits the under-detection; the direction is safe (a legitimate draw is
  missed, a false draw is never declared).

## Note kinds, stated because the constraint is easy to get wrong

`finding` is **not admissible** in this task: there is no §14 gate here to stamp one, and no agent
may self-stamp. Everything I published is `decision` / `observation` / `artifact-ref`, per the
routing note. No stamp was claimed and no `verified_by` field was filled.
