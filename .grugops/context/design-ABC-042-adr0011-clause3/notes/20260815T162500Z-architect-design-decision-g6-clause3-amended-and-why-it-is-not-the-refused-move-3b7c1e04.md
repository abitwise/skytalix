---
id: 20260815T162500Z-architect-design-decision-g6-clause3-amended-and-why-it-is-not-the-refused-move-3b7c1e04
kind: decision
by: architect-design
at: 2026-08-15T16:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G6
  - ADR-0011
  - ADR-0002
  - R2
  - A12
  - src/history-pane.nfr.test.ts
supersedes: 
---

# `G6` RULED — `ADR-0011` clause 3 IS AMENDED: the admission test is struck and replaced. The wording was not narrow, it was WRONG, and correcting it is not the move I refused last hop

> **Hand-authored `decision`.** No `kind: finding` is admissible on this install and no `§14-gate#<id>`
> stamp is emittable; nothing here claims one.

## The ruling

> **`ADR-0011` clause 3's sentence *"A module may hold a runtime import of the history module only if
> it is the game-owning driver `ADR-0002` clause 4's single-supplier rule requires"* is STRUCK and
> replaced by a two-part property test discharged in the per-entry citation the clause already
> requires. The equality, the scanned set, the detection reach, clauses 1/2/4, `R1`–`R4`, every
> instrument and every criterion are UNCHANGED. Zero production lines, zero test lines, zero criteria.**

The amendment is written into `memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md`
as a dated block under clause 3, with the struck text preserved — the mechanism this file has used for
its three previous self-corrections, not a rewrite in place.

## Why I amended, when my own last hop refused to touch this

**What I refused at `design-ABC-042-stderr` was the VEHICLE and the HOP, not the repair.** That note
says it in its own words: *"If clause 3's criterion sentence is to move, the route is a dedicated
amendment hop **on `ADR-0011`**, by its owner, as `design-ABC-029-loss-record` and
`design-ABC-029-maximum` both did — not a new file, and not by me on a hop whose limits forbid touching
it."* **This is that hop**, by that owner, on that file, with BA/PM's concurrent criteria work merged
into my base so the interacting-rules failure that deferred it a fourth time cannot happen.

What I refused on principle was **widening clause 3 so today's build passes**. That refusal stands and
is enforced inside the amendment itself — see below.

## The three findings that decide it, each checkable against text rather than intent

**1. The sentence misattributes a requirement to `ADR-0002` clause 4.** Clause 4 in full
(`ADR-0002-game-history-ownership.md:146-147`): *"`gameStatus`'s `positionCounts` gets exactly one
supplier: the history module. No other caller constructs that map. The signature does not change."*
It constrains **who constructs the map**. It says nothing about who may **import** the history module,
and it requires **no driver at all**. Clause 3 asks for a party clause 4 never asks for.

**2. It attaches `ADR-0002`'s own phrase to the WRONG SIDE of the import edge.** `ADR-0002` clause 2:
*"One module above the core owns the game, and its authoritative state is the move list"* — that module
is **`src/history.ts`**, the module being **imported**. So *"game-owning driver"* names the importee's
property and applies it to the importer. `src/history.ts` cannot be its own runtime importer, so read
strictly **the licence set is empty and `turn-loop.ts` was never licensed either**. A test that refuses
both of its own entries is not narrow; it is broken.

**3. The sentence is the ONLY gate there is, which is why leaving it broken is not the cheap option.**
The equality catches an unlicensed importer and a stale licence. It does **not** catch a *wrongly*
licensed importer — a hop that adds a bad import and its licence entry in one commit is green. The
admission test is enforced by a human or agent reading clause 3 at the declaration site and by review.
**The equality is machine-checked; the admission is not.** So the choice was never "correct the prose or
leave a harmless inaccuracy" — it was "state the gate or leave the gate undefined", and an undefined
gate is filled by whatever the next hop under pressure substitutes.

## The replacement, and what it deliberately does NOT include

Two parts, both discharged in the citation clause 3 already demands per entry:

- **(i) NECESSITY** — the runtime import is unavoidable given what the module must do; it constructs or
  advances the game. A module that can take `GameHistory` as a **type** or receive it **injected** is
  not licensable. Those two forms are what the rest of the tree uses, so an entry owes an argument for
  why neither is available.
- **(ii) SINGLE SUPPLIER INTACT** — it never constructs a `positionCounts` map; status comes from
  `gameStatusOf(history)`, never bare `gameStatus`, never a literal. This is `ADR-0002` clause 4 stated
  as what it says.

**Being off the frame path is NOT part of the test.** That is clause 2's property and the probe's kill.
A licence does not make a module frame-legal. Conflating the two is the defect this ADR exists to
separate and the replacement must not re-import it.

## The temptation, named and refused IN the amendment so it cannot be cited later

The obvious replacement — *"a module that does not itself construct a `positionCounts` map"* — is **true
of every production module in this tree except `history.ts`**. It licenses `zobrist.ts`, `gameend.ts`,
`perft.ts` and every renderer, and it makes **`WLAUNDER`** — the build this file's own containment was
adopted to kill — licensable in one sentence. **Part (i) is the entire gate and it is the part a hop in
a hurry will drop.** The refusal is written into the ADR, priced, and named, rather than left as my
private reasoning.

## The uncomfortable fact, stated rather than buried

**Exactly one verdict moves under the replacement, and it is the one that shipped: `cli.ts`.** Read over
today's 20 production modules the replacement refuses everything the struck sentence refused — the
`zobrist.ts` re-export, a laundering consumer in `perft.ts`, a renderer, `cli-options.ts` — and admits
one module the struck sentence refused: the delivered entry point.

**The test that separates a correction from a widening.** A widening-to-fit moves the **property**, so a
**breaching** build now passes. A correction moves a **description** that was never the property. Here
the property is `ADR-0002` clause 4; `cli.ts` satisfied it the day it landed and satisfies it now, and
not one word of the amendment changes what it must do to keep satisfying it. The struck sentence refused
a build that **breaches nothing**, on a role-name borrowed from the wrong side of an import edge.

**The honest statement of the residual risk in my own ruling:** a future hop can cite "Architect/Design
moved clause 3 at `ABC-042`" as precedent for moving it again. That is why the wide reading is refused
by name in the file, why the struck text is preserved rather than deleted, and why this note records the
separating test instead of asserting good faith.

## What I did not do

- **No new ADR.** `ADR-0012` remains the next free id and `memory-bank/00-index.md` is not touched —
  its line reads `ADR-0001`–`ADR-0011`, which is still true.
- **No criterion moved**, on `ABC-042` or anywhere. `A12` is not widened; see the `Q3` decision.
- **No instrument, no expression, no production line.** `src/history-pane.nfr.test.ts` was **read only**
  and is byte-identical.
- **`plans/nfr-catalog.md`, `ADR-0008`, `plans/board.md`, `plans/traceability.md` — not opened.**
