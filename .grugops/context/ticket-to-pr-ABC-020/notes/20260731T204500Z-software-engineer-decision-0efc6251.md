---
id: 20260731T204500Z-software-engineer-decision-0efc6251
kind: decision
by: software-engineer
at: 2026-07-31T20:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - ABC-020
  - ABC-009
  - ABC-011
  - ABC-016
  - ABC-019
  - ABC-021
  - EPIC-001
  - EPIC-002
  - NFR-001
  - ADR-0002
  - src/gameend.ts
  - src/gameend.test.ts
  - plans/tickets/ABC-020-claimable-draws-and-fide-96-backstops.md
  - plans/board.md
  - plans/traceability.md
  - 20260731T181000Z-architect-design-decision-f95614ca
  - 20260731T151500Z-qe-e2e-observation-36373ca4
  - 20260731T152200Z-qe-e2e-observation-1a02d912
supersedes: 
---

# The five calls I had to make implementing ABC-020 — none of them the return shape, which was ratified and built as written

The design hop settled the shape and I did not touch it. `GameStatus` is the two-arm union on the
existing `result` field, `claimable` is absent when nothing is claimable, `DrawClaims.by` is
required, one shared key read, and the check order is zero-legal-moves → insufficient material →
150-ply clock → fivefold → build the claim set. **Every line of the ratified block is in
`src/gameend.ts` as written, and the `gameStatus` signature is byte-identical.** What follows is
only the decisions the ticket and the design hop left open.

## 1. A5's drive is the NO-PROGRESS line, not "any legal move" — and QE's 117 is why

**This is the one place where a criterion, read literally against an arbitrary legal line, does not
hold.** It is worth stating precisely because A5 is the coupling criterion.

QE's wall (`8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1`) is described in the ticket as *"three legal
king moves, forever, no capture and no pawn move available to either side"*. The first clause is
true at the starting position; **the last is true only locally.** Both kings start on rank 1 (a1 and
h1) and share the half-board below the wall. Neither king can cross it — every square beyond is
covered by a pawn — but a king that walks to rank 3 can step onto rank 4 and **capture a loose white
pawn**, which resets the halfmove clock.

I reproduced it read-only against merged `src/` before writing any code. Driving the wall with the
first legal move each ply:

```
  wall(first-legal-move) : at ply 150 clock=133   (the clock reset at ply 17 — a king took a pawn)
  wall(last-legal-move)  : at ply 150 clock=150   (no capture; the clock never reset)
```

`150 − 133 = 17`, so under the first-legal-move policy the clock reaches 100 at ply 117 — **which is
exactly the "terminal after 117 plies" QE published.** That single arithmetic identity tells us
QE drove this line with the first-legal-move policy and that its drive contained a capture. It also
means that under the new code, the same policy would reach 150 at ply **167**, not within 150.

So: A5's bound is *150 plies from the last irreversible move*, which is what FIDE 9.6.2 actually
says, not 150 plies from an arbitrary start. **The test drives the no-progress line the criterion's
Given describes** — at each ply the first legal move that is neither a capture nor a pawn move,
which on this board is always a king shuffle — and asserts termination at **exactly ply 150** with
`seventy-five-move`. That is a stricter assertion than "within 150", not a weaker one: the drive
fails if the game ends early (as it does today, at ply 100 with `fifty-move`) and fails if it
does not end.

**A5 needs no amendment and I did not touch it.** The criterion's substance — the game terminates
automatically, with no claim, and it terminates on the 75-move backstop — is exactly what is
asserted. Recording the wording gap so nobody re-derives it and nobody "fixes" the test by
loosening the bound.

## 2. A5 is driven BARE, which is what makes it A8's second half too

A5 says *"no claim is ever made"*; A8's second half says *"that same bare caller on the A5 locked
wall"*. They are the same drive and I wrote one test, not two.

The reason is forced, not stylistic: **a caller that does pass a counts map does not reach 150 on
this wall.** Measured on merged `src/`, the shuffle repeats a position five times by ply 22–37 —
so a full-history caller correctly gets `fivefold-repetition` (9.6.1) long before the clock
backstop, which is right under FIDE and is *not* what A5 asserts. Only the bare caller — the
search leaf `ADR-0002` clause 3 describes — reaches the 75-move verdict A5 names. Writing A5 with
a counts map would have made the criterion false.

## 3. `GameResult` is now referenced by nothing — FLAGGED, not deleted

`export type GameResult` was used by the merged `GameStatus` interface. The ratified two-arm union
spells its `result` members out as literals, so after this change **`GameResult` is referenced
nowhere in `src/`** — not by `gameend.ts`, not by any other module (there are none: `gameStatus`
still has zero production callers).

Coding rule 12 says flag pre-existing dead code rather than delete it; the corollary says remove
what *my* edits made unused. Those pull opposite ways here. **I kept it**, on the ground that the
ratified shape block spells `GameResult` out verbatim as its first line, and "build exactly this"
outranks a tidy-up. Deleting a line of the ratified shape would be exactly the silent substitution
the task told me not to make. **Flagged in the trace's Code cell and here; the keep-or-drop call
belongs with whoever owns the `ADR-0002` seam, and it is one line either way.**

## 4. No permanent spy test for the NFR call counts — measured in a harness instead

`plans/nfr-catalog.md` says the call-count bars *"must be spied, not inferred"*, and the design note
says the same. I spied them (see the `artifact-ref` note), but **in a throwaway harness outside the
repo, not as a test in the suite.**

The alternative was `vi.mock("./legal.ts", importOriginal)` inside `src/gameend.test.ts`. Rejected:
the mock factory is hoisted to file scope, so it would re-route the module graph for all 39 tests in
the file to buy one assertion, and A10 asks for the bars to be **measured**, not regression-tested.
That is a judgment about scope, and it is reversible in one small commit if Security/NFR wants the
guard permanent. **Stating it because an absent guard should be visible, not discovered.**

## 5. Three test helpers extracted; the line-27 test's own closures were the seed

`play`, `record` and `knightCycles` are now module-level in `src/gameend.test.ts`. The first two
were closures inside the line-27 test, which is one of the five the ticket permits changing; the
new A1, A8 and clock-100 tests need the same three. The extraction was made and the suite re-run
**before** any behaviour changed, so it is a refactor with a green suite either side of it, and it
is confined to a permitted test.

`knightCycles` carries the ABC-011 instruction in its doc comment — *knights, not pawns, because a
repeated line must never set an en-passant square* — so the next person reusing the fixture inherits
the reason and not just the shape.

## What I did NOT do, each because the ticket says not to

- **No fix for `ABC-009`** (`legalMoves` mutating its argument) or **`ABC-011`** (en-passant
  hashing). Carried, not owned. Every repeated line in the new tests is en-passant-free so that
  `ABC-011` cannot decide a repetition verdict.
- **No FIDE 5.2.2 dead-position detection.** The module header and `isInsufficientMaterial`'s doc
  now say honestly that this is the material-count SUBSET of 5.2.2 and that a dead position which is
  not material-thin plays on to the 9.6.2 backstop. That is QE's G-3 recommendation in full —
  documentation, not code.
- **No re-ordering of the terminal checks.** The zero-legal-moves branch is untouched and still
  first, which is what R-4 measured as load-bearing. A6 now pins it at clock **150** as well as 100.
- **`positionCounts` is NOT made required.** The signature is byte-identical.
- **No new dependency edge and no new state on `Position`.** The import list is byte-for-byte the
  merged one.
- **Nothing merged, nothing deployed.** `autonomy=pr`; a human holds both.

## Provenance

Written directly into `notes/`. **This install has no `scripts/context-io.ts` and no
`mcp__grugops__propose_note` tool**, so Workflow 16's sanctioned writer does not exist here; QE
recorded the same degradation on 2026-07-31 and Architect/Design recorded it again at the design
hop. This is a `decision` — a soft kind with an empty `verified_by` — so no admission stamp was
required and none was bypassed. **No `finding` was recorded or attempted: there is no §14 gate in
this task to stamp one, and nothing here is self-stamped.**
