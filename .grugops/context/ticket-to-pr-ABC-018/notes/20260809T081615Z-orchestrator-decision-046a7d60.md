---
id: 20260809T081615Z-orchestrator-decision-046a7d60
kind: decision
by: orchestrator
at: 2026-08-09T08:16:15Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-014
  - ABC-015
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-002
  - EPIC-003
  - EPIC-006
  - RISK-005
  - NFR-002
  - NFR-007
  - src/render.ts
  - plans/board.md
  - plans/tickets/ABC-018-frame-output-and-redraw.md
supersedes: 
---

# `ABC-018` opened as `ticket-to-pr` — routed to BA/PM first, because it is still in `Backlog`

## The request

Project owner **Olger Oeselg** said, in session on 2026-08-09: **"continue with ABC-018"**. An owner
pull-order call, taken as one.

**What it displaces, named rather than silently absorbed.** `ABC-009` (S, P1) and `ABC-022` (S, P1)
— the two rules-core defects — have sat in `Ready` since 2026-07-31 and 2026-08-04, and this is the
**second consecutive** owner call that puts renderer work in front of them (`ABC-015` was the
first). Neither defect is cancelled, re-sized or de-prioritised; both keep `P1` and their place in
`Ready`. This role records the displacement, and notes that the count is now two — not to argue with
it, but so the pattern is visible on the record rather than re-derived later.

## `ABC-018` is NOT in `Ready`, so this role cannot pull it yet

`plans/board.md:88` has `ABC-018` in **`Backlog`**. The board's column table gives the `Backlog`
exit to **BA/PM**, not to this role, and the ticket file says the same in its own words: *"Sits in
`Backlog` behind `ABC-014`. Promotion to `Ready` is a separate BA/PM step."*

So the first subtask is a **BA/PM promotion**. Only after it lands can this role apply the
Definition of Ready and pull `Ready → In Development`. This role will not shortcut a column exit it
does not own, and will not pull a ticket out of `Backlog` because the owner is waiting.

**This is not ceremonial, and the board says so.** When `ABC-015` was promoted on 2026-08-08, BA/PM
found **two real acceptance defects** at that exact gate — in a ticket a previous Orchestrator's
pre-check had ticked green on the `acceptance testable` row. The board comment under `Backlog`
records the scope of that promotion explicitly: *"`ABC-016..ABC-019` were NOT re-checked here — this
subtask promoted one ticket and does not vouch for the other four."* `ABC-018` is one of the four.
Its own `## Definition of Ready` block, which ticks every row green, was written on **2026-07-30**
by the decomposition and has never been re-checked by anything.

## Both blockers ARE discharged — verified at the source, not inherited

The board row carries two constraints. Both are checked, neither is taken from a close-out note:

1. **`blocked-until: ABC-014`** — `ABC-014` merged 2026-08-08 (`ed42d26` → `c1d694f`) and sits in
   `Done`. `src/render.ts` is on `main`.
2. **`merge-order: after ABC-015` (`RISK-005`)** — `ABC-015` merged 2026-08-08 (`f1743a3` →
   `f4d5d31`) and sits in `Done`. `git status` is clean, `git branch --no-merged main` is empty.

**`RISK-005`'s constraint is therefore already satisfied for this ticket and cannot be violated by
it.** The constraint read *"`ABC-015` merges with or before `ABC-018`"*; `ABC-015` merged while
`ABC-018` was unstarted in `Backlog`. What survives it is **not** a sequencing rule but a *build*
obligation the ticket spells out and which binds whoever implements this: the writer **takes the
glyph mode as an argument from `ABC-015`'s selection function** — it must not default it, hardcode
it, or re-derive it from the environment. A writer that emits a board with a hardcoded mode is the
retrofit `RISK-005` rules out, and it would be a live defect even though the merge order is clean.

## `ABC-016` and `ABC-017` are unbuilt, and that is NOT a blocker — by the ticket's own design

`ABC-018` assembles the board (`ABC-014`, merged), the status panel (`ABC-016`, `Backlog`) and the
history pane (`ABC-017`, `Backlog`). Two of its three inputs do not exist. The ticket answers this
directly: it is **built and tested against stub panels of fixed height**, because *"the height
invariant is a property of the assembler, not of the panels' content."* The board row agrees — it
lists `blocked-until: ABC-014` only.

This role accepts that reasoning for **routing** and flags it for BA/PM as the one INVEST question
worth re-asking at the gate, because it is the difference between a ticket that is buildable now and
one that is buildable in three tickets' time.

## Definition of Ready — pre-checked here, formally gated at the pull

**Not the gate.** The gate runs at `Ready → In Development` after BA/PM acts (Workflow 04 step 1).
This pre-check exists only to establish that routing to BA/PM is not routing into a wall.

| Check | State |
|---|---|
| problem clear | ✅ the player watching the board update; "a display, not a log" |
| scope / out-of-scope | ✅ two strategies, one selection, one assembler, one sanitizer; five out-of-scope items, each with a reason, two of them recorded as accepted cosmetic defects rather than silently omitted |
| INVEST | ✅ — *estimable/small* rests on the stub-panel argument above; see the flag |
| acceptance testable | ⚠️ **NOT ticked green — see below.** Mostly excellent and numeric; one criterion looks undefined and two are worth a ruling |
| dependencies known | ✅ both blockers discharged above |
| NFR triggers + measurable target | ✅ zero `\x1b` bytes from a supplied string; `< 16 ms` at 40/120/300 plies; `NFR-007` |
| test notes | ✅ unusually strong — a screen model rather than a byte assertion, assert on the emitted stream not the sanitizer's return value |
| size | ✅ `S` (2) — **not `XL`, so no `SPLIT_REQUIRED`** |
| priority | ✅ `P0` |
| no unresolved blocker | ✅ `Blocked` column is empty |

### The `acceptance testable` row is left AMBER on purpose, with three specifics

This role deliberately does **not** repeat its predecessor's move of ticking this row green. Three
items, in descending order of confidence that they are real:

1. **`(+N more)` has no defined width — this looks like a genuine defect of the same class as
   `ABC-015`'s defect 1 (an input tuple with no stated output).** The criterion reads *"the region
   holds as many candidates as fit plus a `(+N more)` marker."* **How many fit is a function of
   terminal width, and this system has no width.** Checked at the source rather than assumed:
   `grep -rn "columns\|width\|COLUMNS" src/*.ts` over merged `main` returns **zero** hits in
   non-test code. Nothing in the ticket supplies one, `process.stdout.columns` is never mentioned
   (only `.isTTY` and rows), and in **append mode there is no width at all**. As written, two
   correct implementations can disagree on N and both pass. BA/PM's ruling, not this role's.
2. **The frame's row count is never specified.** Two criteria are given against *"a 23-row frame"*,
   but 23 appears nowhere else and nothing defines the assembled height — `ABC-016` and `ABC-017`
   are unbuilt. If 23 is a stub-panel test fixture, saying so costs one line; if it is a claim about
   the real frame, it is unverifiable today.
3. **The in-place strategy's boundary is untested at equality.** The rule is *"at least as many rows
   as the frame"*, so a 23-row TTY with a 23-row frame selects in-place — but the tested cases are
   24/23 (in-place) and 10/23 (append). The equality case is where cursor-home + erase-to-end-of-
   screen is most likely to scroll, and it is exactly where a `≥` versus `>` slip hides.

Item 1 is why this row is amber rather than green. Items 2 and 3 are cheap to close and may well be
fine once ruled on.

## WIP, checked before scheduling, not after

`Ready` **3/8** → **4/8** on promotion. `In Development` **0/3** → **1/3** at the pull.
`In Analysis` **0/2** and `In Design` **0/2** are untouched — see below. **No limit is approached
and no override is taken; no written reason is owed.** Queue width this step is **1**, inside
`queue.wip_limit: 3`. `pending/` and `claimed/` were both empty at the start of this task, so the
stale-claim sweep (`queue.stale_ttl_minutes: 30`) had nothing to reclaim — a real no-op, checked.

## No design hop, and the reason is on the record rather than assumed

`ABC-014` (an `M`, the epic's headline) took none; `ABC-015` (an `S`) took none. `ABC-018` is an `S`
whose structural choices are **already made and justified inside the ticket**: erase-to-end-of-screen
rather than cursor-up-by-counted-lines (with the reason — a counted redraw is correct only while
consecutive frames have equal height, which is the exact bug being prevented), the strategy chosen
once at startup and never re-chosen, the message region frame-owned rather than printed beside the
frame by `EPIC-003`. There is no structure left to decide and no ADR owed. `In Analysis` and
`In Design` are skipped **deliberately, not overlooked**.

## `NFR-002` — the half nobody has measured, and a rule about quoting numbers

This is the only ticket where `NFR-002`'s write half can be measured. The catalog row calls it
`UNKNOWN - verify` and the ticket is explicit: **no number for the write half may be quoted from any
existing note** — the compute-side figures (171–1,318 µs for the SAN derive on Apple M3 / Node
v24.12.0 / darwin-arm64) are a different measurement and are not a substitute. Both halves get
recorded separately, each with its ply count and its machine. A "frame took X ms" number with no
denominator is not comparable to the next one.

## Substrate: degraded, same as every prior task on this board

This install has **no `scripts/` directory at all** — verified, not assumed: `ls scripts` returns
`No such file or directory`, and the kit has no `scripts/` either. So there is no `scripts/claim.js`
(Workflow 17 step 2's atomic `claimTask` cannot be executed) and no `scripts/context-io.ts`
(Workflow 16's sanctioned writer does not exist). Queue transitions are moved by hand with plain
`mkdir`/`mv` — still atomic, still `EEXIST` on a second writer — and notes are hand-written in the
schema's exact shape. No derived `index.md` / `index.jsonl` is hand-faked, because the renderer that
produces them is absent.

**`finding` is NOT admissible on this task.** No §14 gate exists here to issue a `§14-gate#<id>`
stamp, and `context.human_admission` is `off`, so no `human:<name>` stamp is available either.
Nothing is self-stamped. Verified results are recorded as `observation` or as `claim` with
`confidence: UNKNOWN - verify`, per Workflow 16's escape hatch.

## Branch

`grugops/ticket-to-pr-ABC-018`, cut from merged `main` at `7e0923c`. Every commit for this ticket —
BA/PM's promotion included — lands there. **Never on `main` directly**: the commit-side branch guard
is untouched by the owner's standing merge directive, which governs what happens *after* a green
gate, not how work is produced.

## Plan of record for this task

1. **BA/PM** — rule on the three acceptance items, then `Backlog → Ready` (their exit).
2. **Orchestrator** — Definition of Ready at the pull, then `Ready → In Development`.
3. **Software Engineer** — implement on this branch, `In Development → In Review`. Takes the glyph
   mode as an argument from `ABC-015`'s selection function; stubs the unbuilt panels.
4. **QE/E2E** — break it, `In Review → In Security/NFR` or back. The screen model is the piece most
   likely to be faked into a byte assertion.
5. **Security/NFR** — gate the escape-stripping bar on the **emitted stream**, and measure
   `NFR-002`'s write half on its own instruments rather than ratifying the Engineer's figures.
6. **Orchestrator** — gates on both sides, merge, `Done`.

## Items open and NOT touched by this task

1. **The self-healing snapshot net** — routed to the AGENTS.md Scribe, still open.
2. **`ABC-012`'s ticket frontmatter is a column behind the board** — still the board sweep's.
3. **`ABC-009` and `ABC-022`** — displaced a second time, see above.

## Next action

BA/PM rules on the three acceptance items and decides `Backlog → Ready` for `ABC-018` on branch
`grugops/ticket-to-pr-ABC-018`.
