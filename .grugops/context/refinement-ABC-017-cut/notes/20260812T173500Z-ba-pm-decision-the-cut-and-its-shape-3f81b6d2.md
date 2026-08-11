---
id: 20260812T173500Z-ba-pm-decision-the-cut-and-its-shape-3f81b6d2
kind: decision
by: ba-pm
at: 2026-08-12T17:35:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-cut
  - abc017-cut-2026-08-12
  - ABC-017
  - ABC-028
  - ABC-029
  - ABC-010
  - ABC-024
  - ABC-026
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - 20260812T164500Z-qe-e2e-observation-new-criteria-gaps-5e18a3c7
  - 20260812T165000Z-qe-e2e-decision-verdict-secgate-and-board-9f4d2b68
supersedes:
---

# The cut: TWO tickets, no spike, and the seam is not "criteria vs instrument" — it is which QUESTION each one answers

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp — the §14 gate machinery does not exist in this repo.

## The ruling

**`ABC-028`** — the history pane's three unreached input classes.
**`ABC-029`** — *"production module"* is undefined, and the two guards of `NFR-002`'s structural
premise disagree about their own file set.

Both `Backlog`, both `S` (2), **both with the Definition of Ready honestly NOT met** — `ABC-024` and
`ABC-026`'s standard, applied rather than cited.

## Why two, and what the seam actually is

The obvious seam — *"criteria to one ticket, instruments to the other"* — is **wrong**, and taking it
would have split `RISK-ABC017-04` down the middle, because that risk is a criterion's missing word
**and** an instrument's root list at the same time. The seam that survives contact is the **question
each ticket answers**:

| ticket | the question | subject |
|---|---|---|
| **`ABC-028`** | *does the pane's own OUTPUT and CALLER CONTRACT do what the criteria claim, on inputs no criterion reaches?* | the delivered pane's behaviour |
| **`ABC-029`** | *what does `A11`'s clause COVER, and do its two guards agree with it and with each other?* | a definition and the instruments that implement it |

Under that seam every one of the eight items lands in exactly one place with nothing straddling.

## Why not ONE ticket

They fail INVEST *independent* together in a way neither does alone. `ABC-029` **cannot reach
`Ready`** without an Architect/Design ruling; `ABC-028` can be worked the moment its `A4` instrument
is demonstrated, and its `P1` trigger is dated **now**. Folding them would **hold the urgent half
behind a design hop the urgent half does not need** — which is the single most expensive scheduling
mistake available here, because `ABC-019` is unblocked and is the next hop into the shared file.

They are also different sizes of risk: `ABC-028` is *"a live trap in merged code"* and `ABC-029` is
*"a word nobody defined, with nothing broken"*. One ticket carrying both would take one priority, and
either choice would be wrong for half of it.

## Why not THREE or more — one per risk

Because `RISK-ABC017-01`, `-02` and `-03` are **one hop in one file by one engineer**, and a split
must produce two **independently valuable** tickets. Three tickets over `src/history-pane.test.ts`
would serialize against each other, each rebasing on the last, and would deliver no value separately.
**They are one ticket pretending to be three** — the inverse of the "a ticket only a long chain
delivers is two tickets hiding" test, and it fails just as clearly.

## Why NOT a spike, since the brief explicitly offered one

The brief said of `RISK-ABC017-04`: *"if you judge it needs Architect/Design rather than a dev ticket,
say so and cut it that way; a spike is a legitimate answer."* **It is legitimate and it is not the
right answer here, and the reason is testable rather than stylistic.**

A spike is right when the uncertainty **prevents criteria being written**. I checked that directly by
trying to write them, and **two of `ABC-029`'s three criteria are ruling-independent**:

- **`A1` — the two guards agree about their file set.** True requirement under either reading. Today
  they disagree, measured at source.
- **`A2` — a production root that prints at import does not change the probe's verdict.** True under
  either reading, with a named discriminating build (`WSTDOUT`) and a named negative control
  (`WSTDERR`), both already measured by QE.
- **`A3` — `perft-bench.ts`.** *This* one is undecided, and its two forms assert **opposite verdicts
  on the same build.**

So the shape that fits is a **normal ticket carrying one open design question** — which is exactly
what `ABC-010` does, and which this project has therefore already ruled acceptable. Cutting a spike
would spend a whole ticket on a question whose answer changes one criterion out of three, and would
strand the two that need no answer.

**What I did borrow from the spike idea:** `ABC-029`'s `## Open design question` is written in
`ABC-010`'s own form — both readings stated so neither is smuggled in, the consequence of each named,
and *"flagged here, not answered here."*

## The one place I deliberately did NOT follow `ABC-010`'s precedent

`ABC-010` carries an open design question **and still scores DoR item 4 ✅**, because its criteria do
not depend on the answer — its question is *where a check lives*. **`ABC-029`'s question changes what
a criterion SAYS**, so item 4 is ❌ and item 10 is ❌. Recording the contrast because a reader who
knows `ABC-010` would otherwise expect the same score, and the difference is the whole reason
`ABC-029` needs a design hop before `Ready`.

## What the two tickets share, and it is a real constraint rather than a note

**Both edit `src/history-pane.nfr.test.ts`.** They must not run concurrently in two worktrees; either
order works and the second to land rebases. This is why *independent* is ⚠️ on both, and it is
recorded on both rather than on whichever is scheduled first.

**Both draw on the same ~75 ms of `N8-LANE` headroom**, and `ABC-029` owns the ~102 ms item inside it.
That contention is written into both tickets' NFR triggers as a measurable obligation on **whichever
lands second**, not as a warning.

## What was NOT cut, and it is deliberate

- **No ticket for `G5`/`AR-4`.** It stays unhomed for a fourth role running. Reasoning in the
  eight-items note.
- **No ticket for `AR-1`.** `ABC-010` receives half of it and needs one named amendment for the other
  half — which is a ruling with an owner, not a new ticket. Measurement in its own note.
- **No ticket for `N8-LANE`'s new total.** It is not work; it is a budget fact, and it is homed as a
  **measurable trigger on both new tickets** plus a pointer to `ABC-026`, which already owns the lane
  total. Cutting a ticket whose content is *"the number is now 575"* would be bloat.
- **No edit to `ABC-017`.** It is `Done`. Its text is discharged and none of it moves.
- **No edit to `ABC-010`, `ABC-024`, `ABC-026`, `ABC-016` or `ABC-019`.** Read, not written.

## Boundary

**Zero production lines and zero test lines at this hop.** `src/` aggregate md5
`19279a8fadd5302810634c172ec9b766` and `src/history-pane.ts` md5
`54fd4346dcc1a0060c4e66ae0149265d`, both unchanged; `git status --short -- src/` empty.
`plans/board.md` **not written** — the two Backlog rows are preserved verbatim in the `artifact-ref`
note for the Orchestrator to place.
