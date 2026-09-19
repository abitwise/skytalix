---
id: ABC-107
title: The message region cannot show a 7-candidate ambiguity — decide what the frame does when a list does not fit, without truncating it and without widening the frame
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-002
feature: —
---

# ABC-107 — the frame's 2-row message region hides candidates at 7, and `EPIC-002` owns the answer

> **Cut 2026-08-18 by BA/PM** (task `cut-frame-overflow-2026-08-18`, Workflow 07) from `ABC-033`'s
> falsified `A4`. **The measurements are QE's and the Orchestrator's, taken independently of each
> other; this page copies them and derives nothing new.**
> `.grugops/context/quality-gate-ABC-033-qe-2026-08-18/notes/` (`G1`) and
> `.grugops/context/repair-ABC-033-2026-08-18/notes/`.

> **RULED 2026-09-19 by Architect/Design — `ADR-0022`, option 4 (documented, tested bound).**
> On the owner's word *"6. implement best guess for now"* (delegation, verbatim in
> `.grugops/context/owner-rulings-2026-09-19/notes/`). **Measured at this hop through the real
> pipeline:** `W` = 21; the current rendering fits **6** (hidden 0), **7 → hidden 2**, **8 → hidden
> 3**; and **every candidate of every fixture is reachable by typing its full-origin SAN (`Nb3d4`)
> or coordinate form (`b3d4`) — 8/8 — without reading the list.** Seven of one piece needs five
> promotions. Option 3 (`Nb3`) would fit 10 but makes the everyday two-candidate list non-retypeable
> and must be built in `src/move-input.ts` against `A4`; priced and rejected in the ADR with 1 and 2.
> **Consequences on this page:** size `M` → **`XS`**; `A1` → **`A1'`** below; DoR items 3 and 10
> re-scored (**10/10, PULLABLE**); `A2`–`A5` unchanged. **Nothing under `src/` changes for the
> build except ONE new test file** — the `A5` fixtures through `resolveMoveInput` → `assembleFrame`
> with the delivered panels, asserting hidden **0 / 2 / 3**. Zero production lines, so the
> 2026-08-17 UAT waiver applies once measured from git; QE's hop is still owed. Falsifiers that
> flip the ruling are in `ADR-0022` `## Consequences` (F1–F4).

## Problem

*User*: a player who typed an ambiguous move and is being asked which one they meant.

*Pain*: the message region is **2 rows** (`MESSAGE_ROWS`, `src/frame.ts:45`) and the packer appends
`(+N more)` for whatever it cannot fit (`markerFor`/`withMarker`, `src/frame.ts:134-142`). A
candidate list of **7 or more** SAN moves does not fit. The player is then shown *some* of the
moves they could have meant and a count of the ones they cannot see — and there is no way for them
to see the rest, because nothing scrolls, pages or re-prompts. **Measured, both independently:**

| knights attacking `d4` | FEN | candidates | hidden |
|---|---|---|---|
| 8 | `7k/8/2N1N3/1N3N2/8/1N3N2/2N1N3/K7 w - - 0 1` | 8 | **3** |
| **7** | `7k/8/2N1N3/1N3N2/8/1N3N2/2N5/K7 w - - 0 1` | 7 | **2** |
| 6 | `7k/8/2N1N3/1N3N2/8/1N6/2N5/K7 w - - 0 1` | 6 | **0** |

**Six is the last size that fits.** Both overflowing FENs round-trip byte-identically through
`toFen`, so neither is a mis-transcription.

*Value*: `EPIC-002`'s frame promises the player reads the position at a glance, and `ABC-033`'s
`A4` promised **the frame hides nothing**. Today that promise holds to 6 candidates and fails at 7
with no signal to the player and no test that catches it. This ticket makes the promise true, or
replaces it with a bound that is written down.

## Why this is not `ABC-033`'s and not `src/move-input.ts`'s

`ABC-033`'s `A4` pre-assigned this outcome in its own words, and that instruction is followed here
rather than reinterpreted:

> *"If any reachable ambiguity cannot fit, that is a finding for `EPIC-002`'s frame owner and a new
> ticket — **not a silent truncation and not a widening of the frame**, which would break epic
> acceptance `4a`."*

The delivered dispatcher is on the correct side of that line: it produced the full 7- and
8-candidate lists and handed them over intact. **It truncated nothing and widened nothing.** What
failed is the frame's packing meeting a list longer than 2 rows can hold.

## Scope

- **Decide and build what the frame does when the message region is handed more than it can show.**
- The one thing the answer must deliver: **every candidate reachable by the player**, or a
  **written, tested bound** on how many are shown and what happens beyond it.
- **`EPIC-002` acceptance `4a` (identical row count on every frame) is a constraint on the answer,
  not a thing this ticket may renegotiate.**

## The shape is NOT decided here, and it is Architect/Design's

**BA/PM cuts the problem; the shape is a frame/interaction decision that straddles `EPIC-002` and
`EPIC-003` and it is Architect/Design's at `In Design`.** Four live options, none preferred here:

1. **A paged or scrollable message region** — the region gains a "more" affordance the player can
   advance.
2. **A "list continues" prompt** — the ambiguity becomes a second question (*"which one? 1-8"*)
   rather than a message.
3. **A narrower candidate rendering** — the SAN disambiguator alone (`Nc2`, `Ne2`, …) instead of
   full `Nc2d4`, buying roughly 40% more items per row. **Cheap, and it moves the threshold rather
   than removing it.**
4. **An accepted-risk ruling** — 7+ identical-piece ambiguities are declared out of scope, the
   bound is documented, and the `(+N more)` marker stays as the honest signal. **This is a
   legitimate outcome and it would re-shape this page to `XS`; it is not a failure to deliver.**

**Two shapes are ruled out before design starts**, by `ABC-033` `A4` and by `EPIC-002` `4a`:
silent truncation, and widening the frame.

## Out of scope

- **`src/move-input.ts` and the dispatcher's behaviour.** It hands over a correct, complete list.
  **Do not fix this by truncating there** — that is the exact failure `ABC-033` `A4` names.
- **Changing `MESSAGE_ROWS` or the frame's total row count.** Breaks `EPIC-002` `4a` and
  `ADR-0009`'s row-identity tripwire.
- **The rejection/message *wording*** — `ABC-034`.
- **Any other `(+N more)` consumer** than the message region.

## Acceptance (Given/When/Then)

Written to hold under options 1-3. **If Architect/Design rules option 4, `A1` is replaced by a
documented-bound criterion and this page is re-scored — that is a re-scope, not a pass.**

- ~~**`A1` (nothing is hidden without a way to reach it).** **Given** the 7-knight and 8-knight FENs
  above with `Nd4` submitted, **when** the frame is assembled at the width the delivered panels
  set, **then** every one of the 7 / 8 candidates is reachable by the player, and the number of
  candidates that are unreachable is **0**.~~ **REPLACED 2026-09-19 by `ADR-0022` (option 4):**
- **`A1'` (the bound is written and every candidate stays reachable by typing).** **Given** the
  6-, 7- and 8-knight FENs above with `Nd4` submitted, **when** the frame is assembled at the width
  the delivered panels set, **then** the hidden count is exactly **0 / 2 / 3**, the `(+N more)`
  marker is present exactly when hidden > 0, **and** for every one of the 6 / 7 / 8 candidates,
  submitting its full-origin SAN (`N<from>d4`) AND its coordinate form (`<from>d4`) each resolve to
  that candidate as a `move` — measured 8/8 at the ruling hop, to be pinned by the same test file
  `A5` names. The bound (6 at `W` = 21) is stated on `ADR-0022` and nowhere else.
- **`A2` (the frame's row count does not move).** **Given** the same two positions, **when** the
  frame renders in every state the answer introduces (first page, later page, exhausted), **then**
  the emitted frame's row count is **identical** to the row count of a frame with a 2-candidate
  ambiguity — `EPIC-002` `4a`, unchanged.
- **`A3` (6 still fits, and it still fits with zero hidden).** **Given** the 6-knight FEN, **then**
  the hidden count is **exactly 0** and no affordance is shown. *(The regression this ticket is
  most likely to cause: an answer that pages everything and makes the common 2-candidate case worse
  to read.)*
- **`A4` (the dispatcher is untouched).** **Then** `git diff` shows **0 changed lines** in
  `src/move-input.ts`, and `ABC-033`'s delivered test file is unchanged except for added rows.
- **`A5` (the threshold is pinned by a test, not by arithmetic).** **Then** the suite contains the
  6-, 7- and 8-knight cases as named fixtures, so the next change to panel width, SAN rendering or
  `MESSAGE_ROWS` reds a test instead of silently moving the boundary.

## Dependencies

- ~~**Architect/Design must rule the shape before this is estimable.** See above. **No ADR id is
  guessed here; none exists yet.**~~ **RULED — `ADR-0022`, 2026-09-19, option 4.** No open
  dependency remains; option 2's input-side trigger did not fire.
- **`ABC-018` (`assembleFrame`) and `ABC-033` are merged instruments.** This ticket changes the
  first and must not change the second.
- **Not blocked by `ABC-034`, `ABC-035`, `ABC-037` or `ABC-043`.** If the ruling is option 2 (a
  second prompt), it acquires an input-side dependency and must be re-sized — **named as a trigger,
  not assumed**.

## Security / NFR triggers

- **`NFR-002` (full redraw < 16 ms) — triggered**, this ticket is on the render path. Bar unchanged;
  the answer must not add a per-frame cost above the existing budget.
- **`ADR-0009`'s row-identity tripwire (`= 23`, requirement `≤ 24`) — triggered by `A2`** and it is
  the tripwire that fires if the answer buys rows.
- **`N8-LANE` — ≤ 650 ms CPU**, inherited by name. Target: **≤ 1 new test file, 0 new spawns**.
- **Security — no new surface.** Every message already reaches the terminal through the frame's
  sanitizer (`src/frame.ts:123`), and this ticket introduces no second path to that sink.
  **Firing threshold:** any write to a stream outside the existing frame path.

## Test notes

1. **The three FENs above are the fixture set, ready to paste.** They round-trip; do not construct
   new ones.
2. **Assert the hidden/unreachable count, never the width.** The width is the panels' — the same
   fence `ABC-033`'s test note 4 sets.
3. **`A3` is the guard against making the common case worse.** Two candidates is what a real game
   produces; 7 is what this ticket is about.
4. **The 6-queen fixture already passing with ONE COLUMN of headroom is the reason `A5` exists.**
   Measured at `ABC-033`: 20 and 19 of 21 columns. A narrower or wider SAN rendering moves the
   threshold, and nothing today would notice.

## Size and priority rationale

~~**Size `M`.** One decision to consume, one change inside the frame's packing, a state the frame did
not previously have, and a fixture set across two modules' tests. **Not `S`** — under options 1 and
2 the region stops being a pure function of its items. **Re-size trigger, named: if Architect/Design
rules option 4 (accepted risk), this drops to `XS`** (a documented bound plus `A5`'s guard test) and
must be re-scored, not silently absorbed.~~

**Size `XS` — RE-SCORED 2026-09-19 by Architect/Design, the trigger above having fired (`ADR-0022`,
option 4).** One new test file, four named fixtures through the delivered pipeline, zero production
lines. `A4`'s "0 changed lines in `src/move-input.ts`" now holds trivially. The size rationale of
the struck paragraph was correct for options 1–3 and is kept for the record.

**Priority `P2`, and this is the number I most expect to be argued with.**

`ABC-033` `A4` came back **falsified** and QE scored `G1` **HIGH**. That severity is about a
criterion being false, and **I do not carry it across to priority, because the player-facing risk is
not high**: 8 knights of one colour requires **six promotions**, 7 requires five. Both are legal,
both round-trip, and **neither arises in ordinary play** — no game in which a player types `Nd4` and
means one of seven knights has ever been played. Today's player is not misled.

**Not `P3`**, for a reason that is measured rather than felt: the accepted 6-queen case passes with
**one column of headroom**, and 6 same-piece attackers is not exotic — a central square has exactly
8 knight-attackers, so the margin between "fits" and "hides" is one item wide and nothing guards it.
A wider figurine, a longer disambiguator, one more status column, and the frame starts hiding
candidates in positions closer to real play, silently. **Not `P1`**: nothing is blocked behind this,
no epic acceptance is held open by it, and `EPIC-002` is `Done` on every criterion a real game
reaches.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-18**. ~~**Result: 8 of 10 — items 3 and 10 carry a ⚠️. NOT READY TO PULL, and the two ⚠️ are
the same fact: the shape is unruled.**~~ **RE-SCORED 2026-09-19 by Architect/Design against
`ADR-0022`: 10 of 10, 0 ⚠️ — PULLABLE.** Items 3 and 10 are re-scored in place below (the original
verdict struck, not deleted); items 1, 2, 4–9 were not re-assessed and stand as BA/PM scored them.
Item 4's `A1` replacement, named in advance there, is now `A1'`. **Recommendation to the
Orchestrator: pull now, not behind `ABC-034`** — the build touches no wording, no production line
and no module `ABC-034` will change; parking it buys nothing and leaves `ABC-033` `A4`'s falsified
sentence standing longer than it needs to.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** user, pain and value stated; three FENs, two independent reproductions, threshold at 7 |
| 2 | scope and out-of-scope clear | **✅** four fences, two shapes ruled out before design starts |
| 3 | INVEST-shaped | ~~**⚠️ NOT estimable with confidence.** Valuable, negotiable, small and testable — but the size spans `XS` to `M` across four live shapes, and the re-size trigger is named rather than averaged away~~ **✅ RE-SCORED 2026-09-19:** one shape (`ADR-0022`, option 4), one size (`XS`), one test file; the span collapsed exactly as the named trigger said it would |
| 4 | acceptance testable and measurable | **✅** five: unreachable count **0**, identical row count, hidden **0** at six, **0** changed lines in `src/move-input.ts`, three pinned fixtures. `A1`'s replacement under option 4 is named in advance |
| 5 | dependencies known | **✅** the unmade decision is named **with an owner** — Architect/Design at `In Design`; two merged instruments named; the one dependency option 2 would add is named as a trigger |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-002` < 16 ms; `ADR-0009` `= 23` / `≤ 24`; `N8-LANE` ≤ 650 ms; security firing threshold falsifiable |
| 7 | test notes present | **✅** four, with the fixture set ready to paste |
| 8 | size assigned | **✅** `M`, conditional, with the re-size trigger written down |
| 9 | priority assigned | **✅** `P2`, with the reasons it is neither `P1` nor `P3` |
| 10 | no major unresolved blocker | ~~**⚠️ ONE.** *What the frame does when a list does not fit* is an unmade design decision straddling `EPIC-002` and `EPIC-003`. **BA/PM does not take it** — taking it on a ticket page would be product deciding the frame's interaction — and no owner was invented: it is Architect/Design's by the same route `ADR-0012` took~~ **✅ RE-SCORED 2026-09-19:** ruled by Architect/Design at `ADR-0022` on the owner's delegation; no blocker remains |

Column moves are the Orchestrator's.

## Delivery

**Built 2026-09-19 by the Software Engineer** (task `wave-2026-09-19`, subtask
`ticket-to-pr-ABC-107`, Workflow 04) on branch `grugops/ABC-107-overflow-bound` @ **`a5a9178`**,
off `grugops/wave-2026-09-19` @ `475d559`. **Unmerged; not deployed.**

- **One new file, zero production lines:** `src/frame.overflow-bound.test.ts` (+202 / −0), 25
  rows. **`A4` measured from git:** `git diff --name-only a5a9178~1 a5a9178 | grep -v
  '\.test\.ts$' | grep '^src/'` → empty; `src/move-input.ts` 0 changed lines.
- **`A1'` / `A5`:** the 6-, 7-, 8-knight FENs above (plus `ADR-0022`'s 8-queen fixture) through
  `newGame` → `resolveMoveInput` → `assembleFrame` with the delivered panels: hidden **0 / 2 / 3**
  (/ 3), marker present exactly when hidden > 0; full-origin SAN and coordinate form each resolve
  every candidate as a `move` — **6/6, 7/7, 8/8, 8/8**. **`A3`:** six shown in full, no marker.
  **`A2`:** 23 rows on every fixture, equal to a two-candidate ambiguity's frame. Tripwire
  watched red at `MESSAGE_ROWS` = 3 (7 of 25 fail) before shipping; reverted.
- **Gates at the tip:** lint clean (74 files), typecheck 0, build 0, `npx vitest run --dir src`
  **41 / 1238 / 0 skipped** (baseline 40 / 1213 / 0), test-skip-integrity `No findings.`
- **`NFR-008` / `N8-LANE`:** in-file test content 15 ms. Whole-lane CPU (`/usr/bin/time -p`,
  n = 3, load 2.6–6.0, two sibling hops live): **before 17.16 s, after 16.70 s** — above 15 s in
  every run INCLUDING the three before the file existed; not a conforming `ADR-0019` reading.
  Handed up, not trimmed. Numbers and the confounders:
  `.grugops/context/ticket-to-pr-ABC-107/notes/`.
- Board move, QE hop and the UAT waiver measurement are the Orchestrator's / QE's.
