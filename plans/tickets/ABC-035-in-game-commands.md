---
id: ABC-035
title: In-game commands — `help`, `board`, `quit`, `claim`: the grammar, the tolerance, and the teaching rejection
status: in-development
column: In Development
size: S
priority: P1
epic: EPIC-003
feature: —
---

# ABC-035 — four command tokens at the move prompt, and the one that is a right the player cannot otherwise exercise

> **Cut 2026-08-12 by BA/PM** (task `post-abc030-2026-08-12`, subtask `refinement-post-abc030`,
> Workflow 03) at `EPIC-003`'s decomposition. **`moves` is deliberately NOT in this ticket** — it is
> `ABC-036`, split out because it is the only command whose display promise the merged frame cannot
> keep. See that page.

> ## REPAIRED 2026-08-13 by BA/PM at `refinement-home-the-gaps` — six statements, and `ABC-021` MERGED between the cut and this repair
>
> `quality-gate-ABC-021` reported this page as *"contradicting itself three ways"* about who owns the
> unavailable-claim message. **Re-verified at source against MERGED code, it was SIX statements, and
> the two nobody reported are the two that would have broken the build.** The page was cut on
> 2026-08-12 against a ticket that had not landed; `ABC-021` merged to `main` on 2026-08-13, and
> merged code now answers questions this page was guessing at.
>
> | # | site | was | is, verified at source |
> |---|---|---|---|
> | 1 | `## Scope` `:36` | the `command` arm is at `src/turn-loop.ts:122` | **`:129`** — moved by `ABC-021`'s seventh arm |
> | 2 | `## Scope` table, `claim` row | `claim` returns the **`command`** outcome when unavailable | **FALSE against merged code.** `PromptOutcome` has a dedicated **payload-free `{ kind: "claim" }`** arm (`src/turn-loop.ts:130`) and the LOOP adjudicates it (`:319`). **A parser returning `command` for `claim` never reaches transition 16** — this is the one that would have broken the build |
> | 3 | `## Scope` prose `:52-54` | this ticket writes the two teaching sentences | **FALSE against merged code.** `claimShortfall` (`src/turn-loop.ts:234`) produces them and `ABC-021`'s `A3` asserts them |
> | 4 | `## Out of scope` | *"This ticket supplies the token **and the unavailable-case message**"* | **FALSE**, same reason. The scope table's `ABC-021` owner cell was RIGHT |
> | 5 | `## Out of scope` | forbids `repetitionCounts` **and** mandates `gameStatusOf(history)` | **self-contradictory**: `gameStatusOf` **is** a `repetitionCounts` call (`src/history.ts:152-153`) |
> | 6 | `## Dependencies` | *"This ticket produces the token and the unavailable message"* — third instance | **FALSE**, and `PromptOutcome` is cited at `:118` (a doc-comment line); the declaration is **`:125`** |
>
> **The ruling did NOT rest on precedence.** `plans/board.md:100` does side with the scope table, but
> that is now beside the point: **the message is merged, running and asserted.** Ownership was decided
> by the tree, not by two pages arguing.
>
> **And one inherited fear is corrected rather than carried.** The Engineer's note said a parser
> deriving availability per prompt would be *invisible to the loop's call-count spy*. **Measured at
> `quality-gate-ABC-021` (`M17`): it turns SEVEN tests RED, four of them `ABC-019`'s own.** The hazard
> **fails LOUDLY**. `A6` still forbids the second derive — but it is a cost rule, not a tripwire, and
> nobody should write this ticket believing a mistake here would be silent.
>
> **Size `S` and priority `P1` both HOLD** — re-derived below, on a changed premise.

## Problem

*User*: every player, and specifically the player holding a FIDE 9.2 / 9.3 draw claim.

*Pain*: `ABC-020` made threefold repetition and the fifty-move rule **claimable by the player having
the move**, `ABC-016` renders that availability, and `ABC-021` builds the loop's claim path — **and
there is still no token a human can type.** `EPIC-003`'s `## Scope` was amended on 2026-07-31 for
exactly this: *"a right the player cannot type is not a right"*. The other three commands are the
smaller half: today an input that is not a move is a rejection, so `help` is answered with *that is not
a legal move*.

*Value*: it closes the last gap in the `ABC-020` → `ABC-016` → `ABC-021` chain, all three of which are
already merged or cut, and it costs one token table.

## Scope

**Four tokens, classified before either resolver is asked.** Three of them return `ABC-019`'s merged
`command` outcome (`src/turn-loop.ts:129`) — non-advancing, back to the prompt. **The fourth does
not**, and that is the correction of 2026-08-13:

| token | outcome the parser returns | who owns the EFFECT |
|---|---|---|
| `help` | `command`, with the message set this ticket writes | this ticket |
| `board` | `command`, with **no** message | this ticket (see `A3` — merged code already redraws) |
| `quit` | `command` **here**; the confirmation and the exit are `EPIC-006`'s | **`EPIC-006`** |
| `claim` | **`{ kind: "claim" }`** — the dedicated payload-free arm (`src/turn-loop.ts:130`), **NEVER `command`**. It carries no article and no message: it is a **REQUEST**, and the loop adjudicates it against the status it already evaluated for that ply (`src/turn-loop.ts:319`) | **`ABC-021`** — **BOTH** edges. Available → `game-over`; refused → `rendering` carrying `claimShortfall`'s message |

- **Tolerance, and only this much:** case-insensitive, surrounding whitespace trimmed, exact token
  match. **No abbreviations, no aliases, no arguments.** `EPIC-003` names the tokens and this ticket
  ships the tokens.
- **A command is classified BEFORE the resolvers run.** `ADR-0004` (2a): *"`parseSan` does not classify
  commands … `moves` / `help` / `quit` are not SAN, and teaching `src/san.ts` the command set would
  drag `EPIC-003`'s command vocabulary into a module whose entire justification is that it owns one
  grammar."*
- **`claim` when nothing is claimable is a rejection that teaches — and `ABC-021` ALREADY WROTE IT.**
  **CORRECTED 2026-08-13:** the two sentences this page used to write out (*this position has occurred
  twice; a claim needs three* / *the halfmove clock is 41; a claim needs 100*) are produced by
  `claimShortfall` (`src/turn-loop.ts:234`, merged) off `src/gameend.ts:72,78`'s own constants, and
  `ABC-021`'s `A3` asserts them. **This ticket supplies the TOKEN and nothing else on this path.**
  Writing the message here would be duplicate work against merged, asserted code.

## The boundary ruling this ticket implements

**BA/PM, 2026-08-12. `quit` appears in TWO epics' scope lines and they do not conflict — but nothing
said so, and an unstated seam costs a hop.**

`EPIC-003` § Scope lists `quit` among its in-game commands. `EPIC-006` § Scope lists *"`quit` with
confirmation"* among its session commands. **The split is the same one the 2026-07-31 `claim`
amendment already made and it is applied unchanged:** `EPIC-003` owns **the grammar** — the token, its
tolerance, its case-insensitivity, its tab-completion target — and **the rejection message that
teaches**; `EPIC-006` owns **what happens** — the confirmation prompt, the exit, the result screen.
So this ticket makes `quit` a recognised command that does not advance the ply, and `EPIC-006` gives
it its effect. **The same rule already governs `claim`** (grammar here, transition in `ABC-021`), which
is why one rule covers both rather than two special cases.

## Out of scope

- **The `moves` command** — `ABC-036`. Split out with its reason.
- **What `quit` does** — `EPIC-006` (confirmation, exit code, result screen).
- **EVERYTHING a `claim` does to the loop — BOTH edges — is `ABC-021`'s, and it is MERGED.** The
  `claim` arm, the terminal transition, the claimed reason **and the unavailable-case message**
  (`claimShortfall`, `src/turn-loop.ts:234`). **CORRECTED 2026-08-13: this ticket supplies the TOKEN
  ONLY.** The parser classifies the literal `claim` and returns `{ kind: "claim" }`; it decides
  nothing about availability, writes no message, and names no article.
- **Whether a claim is available** — `ABC-020` computes it, the **LOOP** reads it.
  **CORRECTED 2026-08-13: this ticket does not even ASK.** The original wording forbade
  `repetitionCounts` while mandating `gameStatusOf(history)`, which is self-contradictory —
  `gameStatusOf` **is** a `repetitionCounts` call (`src/history.ts:152-153`, read at source). The
  contradiction dissolves once `claim` is a request: **the parser is availability-BLIND and calls
  NEITHER.** `ADR-0002` clause 4's *"one supplier"* is satisfied by the loop's single existing call
  per ply. A second derive would cost **46–50 µs at 120 plies**, half the whole per-ply budget, for a
  value the loop already holds.
- **`undo`, `resign`, `new`** — `EPIC-006`'s command set. Not tokens here, not tab-completion targets
  here.
- **Reading the line** — `ABC-037`. **Tab-completion of these tokens** — `ABC-038`.

## Acceptance (Given/When/Then)

- **`A1` (the four tokens, case-insensitive, exact).** **Given** any position, **when** each of `help`,
  `HELP`, `  help  `, `board`, `quit`, `claim` and their upper-case forms is submitted, **then** each
  returns `kind: "command"`, the ply is **not** advanced, `toFen(position)` is byte-identical, and
  `gameStatus` is **not** re-evaluated. **When** `hel`, `helpme`, `h` or `boards` is submitted, **then**
  none is a command — each falls through to the resolvers. *(The negative half is the criterion; a
  prefix matcher passes the positive half and turns `b4` into `board`.)*
- **`A2` (a command never reaches a resolver).** **Given** each of the four tokens, **when** it is
  submitted, **then** the SAN and coordinate resolvers are **each called exactly 0 times**, asserted by
  spy. *(A build that asks the parser first and falls back to the command table is behaviour-equivalent
  on every string above and produces a rejection reason for `help` in the one case that matters — when
  a future token collides with legal notation. `b4` is a legal move; `board` must never be reachable
  from it and no resolver may ever see `help`.)*
- **`A3` (`board` is honest about being nearly free).** **Given** the merged loop, **when** `board` is
  submitted, **then** the outcome carries **zero** messages and the next frame is drawn by the loop's
  normal `rendering` transition — **no second render is triggered by this ticket**, asserted by
  counting render-seam calls: exactly **one** per prompt cycle. *(`ADR-0009` clause 9 and
  `src/turn-loop.ts:28-31`: the loop renders every ply and hands the writer the seam's rows unchanged.
  A `board` command that renders again writes two frames for one ply and is invisible to every content
  assertion.)*
- **`A4` (`help` names every token it accepts, and the list is derived not typed).** **Given** the
  delivered `help` output, **when** it is read, **then** it names **every** token in this ticket's
  command table and **no token that is not in it** — asserted **over the table**, so a token added
  later without a help line turns the criterion red. *(Quantifier form, `ABC-024` `A3` / `ABC-030` `A2`;
  a hand-written help string goes stale the first time the table changes, which is `ABC-030`'s entire
  subject.)*
- **`A5` (`claim` is a REQUEST — the parser classifies it and adjudicates NOTHING). REWRITTEN
  2026-08-13.** **Given** a position where **no** draw is claimable, **when** `claim` is submitted,
  **then** the parser returns **`{ kind: "claim" }`** — **not** `command`, **not** `rejected` —
  carrying **no message and no article**, and the teaching text that reaches the frame is
  `claimShortfall`'s merged output, **contributed to by zero message items from this ticket's
  module**. **Given** a position where a claim **IS** available, **when** `claim` is submitted,
  **then** the parser returns the **identical** outcome value, and the run terminates through
  `ABC-021`'s transition. *(The PAIR is the criterion and one half alone proves nothing. A parser
  that inspects availability and branches passes the first half and **fails the second** — and that
  wrong build is exactly what this page specified until 2026-08-13.)*
- **`A6` (the parser adds ZERO derives — it does not ask). REWRITTEN 2026-08-13.** **Given** one
  prompt cycle in which `claim` is submitted, **when** the spies are read, **then** this ticket's
  module calls `gameStatusOf` **zero** times and `repetitionCounts` **zero** times, and the ply's
  total is **exactly one** `gameStatusOf` — the loop's own, unchanged. *(`ABC-019`'s `NFR-002` bar —
  *derive the counts once per ply, not once per call site*. The old form asked the parser to make the
  ply's one call; under merged code the loop already made it before the prompt was issued.)*
- **`A7` (message fits the frame).** **Given** the `help` output and each `claim` rejection, **when**
  passed to `assembleFrame` at the delivered panel width, **then** the message region's **hidden count
  is exactly 0** (`MESSAGE_ROWS` = 2, `src/frame.ts:45`). **If `help` cannot fit two rows, it is
  shortened here — not the frame widened**, which would break epic acceptance `4a`.
- **`A8` (no production change outside this ticket's module).** `git diff --numstat` shows this
  ticket's module and test file(s) and nothing else under `src/`; suite green, skip **0**,
  `PERFT_DEEP=1` **32/32**.

## Dependencies

- **`ABC-033` must land first — OPEN.** It owns the entry point a command is classified in front of.
  An **ordering** dependency, one direction.
- **`ABC-034` — soft, and stated in the direction it runs.** `A5`'s message is written to that ticket's
  standard. If `ABC-034` has not landed, `A5` is still testable (it asserts the numbers, not a shared
  vocabulary) — so this is a **quality** dependency, not a blocker.
- **`ABC-021` — MERGED to `main` 2026-08-13, and the direction has CHANGED. CORRECTED 2026-08-13.**
  It is no longer a deliberate non-dependency: `ABC-021` is **merged code this ticket builds
  against**, and it owns the `claim` arm, both edges and the unavailable-case message. **This ticket
  produces the TOKEN.** There is still no dependency in the other direction, and `A5` remains
  checkable in isolation because it asserts the outcome **kind**.
- **Merged:** `gameStatusOf` (`src/history.ts:152`), `PromptOutcome` (**`src/turn-loop.ts:125`** —
  corrected from `:118`, which is a doc-comment line), the `claim` arm (`src/turn-loop.ts:130`), the
  loop's adjudication (`src/turn-loop.ts:319-341`), `claimShortfall` (`src/turn-loop.ts:234`),
  `assembleFrame` (`src/frame.ts:194`), `ABC-020`'s claimable-draw set.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU** (5% of `NFR-008`'s 13 s clause), CPU instrument,
  median of paired per-round deltas, n ≥ 7 interleaved, identity null control ≤ 1.5%, net of 160 ms per
  test file added.
- **`NFR-002` — `ABC-019`'s per-ply bar of ≤ 100 µs (excluding render, input wait and engine call) is
  unchanged by this ticket, and that is the measurable requirement.** `A6` is what holds it: zero
  additional derives. A second `repetitionCounts` per ply costs **46–50 µs at 120 plies** (measured,
  Apple M3 / Node v24.12.0 / darwin-arm64, carried from `ABC-021`) — half the budget for a value
  already in hand.
- **`NFR-003` — routed to `ABC-037`**, which owns the keystroke.
- **Security: no trigger, not pre-waived.** The command table matches literal tokens; nothing is
  evaluated, spawned or interpolated. **CORRECTED 2026-08-13:** the `claim` rejection text is no
  longer this ticket's output at all — it is `claimShortfall`'s, merged, and carries **no user text**
  (two integers and two literal rule names, verified at `quality-gate-ABC-021`). This ticket's only
  output to the terminal is `help`, which reaches it through `assembleFrame`'s **sanitized** message
  region (`src/frame.ts:202`); **no second path to that sink is added.** **Firing threshold:** any
  direct stream write, any file touched under `src/` other than this ticket's module and test file(s),
  or any runtime dependency added.

## Test notes

1. **`A1`'s negative half is the ticket.** `hel`, `helpme`, `h`, `boards` — and `b4`, which is a legal
   move and must never be read as `board`.
2. **Spy the resolvers at zero** (`A2`). Content assertions cannot see the fall-back-after-parse build.
3. **Count render-seam calls** (`A3`). One per prompt cycle. `board` adds none.
4. **Derive `help` from the table** (`A4`). A typed help string is `ABC-030`'s defect with a different
   file name.
5. **`A5` needs two fixtures, not one:** a position two occurrences from a claim and a position with a
   claim available. The pair is the criterion; one alone proves nothing about the boundary — and the
   thing it proves is that the **outcome value is the same in both**.
6. **Do not call `gameStatusOf` and do not call `repetitionCounts`. REWRITTEN 2026-08-13.** The
   original note told the parser to *"ask `gameStatusOf(history)` once and read availability off it"*
   — which contradicted the fence beside it and, since `ABC-021` merged, asks for a call the loop has
   already made. **The parser is availability-blind.** `ABC-019`'s bar, `ABC-021`'s ruling and
   `ADR-0002` clause 4's *"`positionCounts` gets exactly one supplier"* are all satisfied by making
   **no** call at all.
7. **The `ABC-035` hazard was MEASURED and it fails LOUDLY, not silently.** `quality-gate-ABC-021`
   built the parser this page used to specify (`M17`: `gameStatusOf` on every prompt) and it turns
   **seven tests RED, four of them `ABC-019`'s own**. `derivesMade()` counts `gameStatus`
   process-wide. **Nobody should write this ticket believing a second derive would slip through
   green.**

## Lane cost — how many test FILES this ticket implies

**One.** The spies in `A2`, `A3` and `A6` are `vi.spyOn` over injected seams, not hoisted `vi.mock`
factories, so **no `*.nfr.test.ts` file is added**. ≈ 160 ms CPU, **≈ 1.2% of the 13 s clause**
(arithmetic over the published floor, not a new measurement).

## Size and priority rationale

**Size `S` (2) — RE-DERIVED 2026-08-13 on a changed premise, and it HOLDS.** One token table, one
classification step in front of an existing dispatcher, one derived help string, and four spied
counts. No new chess logic, no new dependency edge, no design decision — the boundary questions
(`quit`, `claim`) are ruled on this page rather than left open. Calibrated against `ABC-021` (one
prompt outcome and one transition on a specified machine, `S`) and `ABC-015` (a selection rule with a
precedence table, `S`).

**What the repair REMOVED:** the unavailable-claim message, which was never this ticket's — it is
merged. **What it ADDED:** nothing. **So why does `S` not fall to `XS`?** Because the message was
already costed as *"a rejection message with numbers already specified elsewhere"* — near-free on
this page even when it was believed to be owed. The load-bearing work is unchanged: the classifier in
front of `ABC-033`'s entry point, the derived `help` set, and the four spies. **A size that does not
move when a deliverable is removed is a size that was carried by something else, and saying so is
better than shaving a point to look responsive.**

**Priority `P1`, deliberately not `P0` — and 2026-08-13 STRENGTHENED it.** The three `P0` tickets in
this epic (`ABC-031`, `ABC-032`, `ABC-033`) are what make a move typable at all; a player with no
command set can still play chess. It is **not** `P2`, and the argument is now **measured rather than
predicted**: `ABC-016` renders a claim indicator today and `ABC-021`'s claim path is **merged and
asserted on `main`**, so without this ticket the product **tells the player a draw is claimable, has
a working claim path behind it, and gives them no token to type.** The dead end is not hypothetical
any more — it is shipped.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-12**; **RE-SCORED item by item at `refinement-home-the-gaps`, 2026-08-13**, after six
statements on this page were corrected. **Result: unchanged at 9 of 10 clean, 1 recorded ⚠️ — NOT
fully met; stays in `Backlog`.**

**The score did not move, and that is the honest outcome rather than a comfortable one.** The repair
fixed statements that item 2 and item 4 had been scored **✅** on — so a strict reading says those two
were **over-scored on 2026-08-12**, at a time when `ABC-021` had not merged and the page's claims
were not checkable against a tree. **Recorded, not smoothed:** the cut-time scores were defensible on
the evidence then available and are wrong in hindsight; today's ✅ are earned against merged code.

| # | item | verdict (2026-08-13) |
|---|---|---|
| 1 | problem clear | **✅** the player holding a claim; a right nobody can type; `help` currently answered with *not a legal move* |
| 2 | scope and out-of-scope clear | **✅ — REPAIRED.** Four tokens with the effect-owner named per token and **the outcome kind named per token**; the `quit` / `claim` epic boundary ruled on this page; six fences. *(Was ✅ on 2026-08-12 while the `claim` row named the wrong outcome kind — over-scored, and now earned.)* |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not fully independent**: it classifies in front of `ABC-033`'s entry point and must land after it |
| 4 | acceptance testable and measurable | **✅ — `A5` and `A6` REWRITTEN.** Eight criteria: exact tokens and exact non-tokens, spied counts of **0** and **1**, a table-derived help assertion, **an outcome value that must be IDENTICAL in the claimable and unclaimable positions**, derive counts of **zero**, a **hidden count of 0**, `32/32`, skip **0**. *(The old `A5` specified a build that cannot reach the merged claim path — an acceptance criterion for the wrong product.)* |
| 5 | dependencies known | **✅ — CORRECTED.** One open ordering dependency (`ABC-033`); one soft quality dependency stated as soft; **`ABC-021` re-stated as MERGED code this ticket builds against**, not as a deliberate non-dependency |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-002`'s ≤ 100 µs per-ply bar carried with the cost of the wrong implementation quantified (**46–50 µs**) **and its failure mode measured (7 tests red, not silent)**; sanitization sink named and narrowed to `help`; firing threshold falsifiable |
| 7 | test notes present | **✅** seven |
| 8 | size assigned | **✅** `S` (2), calibrated, **re-derived on a changed premise** |
| 9 | priority assigned | **✅** `P1`, with the not-`P0` and not-`P2` arguments both stated, the latter now measured |
| 10 | no major unresolved blocker | **⚠️** **one ordering dependency is OPEN** — `ABC-033`. Named, owned, and the reason this sits in `Backlog` |
