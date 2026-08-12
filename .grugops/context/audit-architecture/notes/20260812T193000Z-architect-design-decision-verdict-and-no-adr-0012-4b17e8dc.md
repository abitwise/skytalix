---
id: 20260812T193000Z-architect-design-decision-verdict-and-no-adr-0012-4b17e8dc
kind: decision
by: architect-design
at: 2026-08-12T19:30:00Z
verified_by:
confidence: high
refs:
  - arch-audit-2026-08-12
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0008
  - ADR-0011
supersedes:
---

# VERDICT: yes, the structure is on the correct path — with three named conditions. And NO `ADR-0012` is written.

> **Hand-authored, not a `finding`.** A `decision` kind because the ruling *not* to write an ADR is
> itself a decision that constrains later work, and because leaving it unrecorded would invite the
> next hop to re-ask it.

## The verdict, in one paragraph

**Yes — with named conditions.** The structure is sound and the evidence is that it is *boring in
the right places*: **17 modules, 49 edges, zero cycles, depth 8, one leaf that is also the hub, and
every dependency pointing down.** Thirty tickets and two epics in, nothing has bent — `EPIC-002`
added six modules and produced no cycle, no upward edge and no god module, and the one place a cycle
was possible (`ADR-0005`'s en-passant predicate, which would have made `apply → moves → apply`) was
identified in advance and homed to avoid it. **The seams the next three epics need mostly already
exist and are unused on purpose**: `turn-loop.ts` takes all four of its collaborators by injection,
`san.ts` reserves `parseSan` in its own header, `frame.ts` composes by injection so it imports
nothing. **Five modules with zero importers is not rot — it is a top layer waiting for its entry
point**, and `EPIC-006` imports four of the five. The code contradicts **none** of the eleven ADRs.
**The binding constraint on this project is not its module structure at all; it is the ratified test
budget** — ~66% of the CPU clause consumed with roughly **14 planning-grade test files** left, while
`EPIC-003` (M) and `EPIC-004` (L) both add files and the one decomposed epic produced nine tickets.
**The structure will scale to the remaining plan; the lane budget may not, and that is where the
next architectural attention belongs.**

## The three conditions

1. **The entry point lands FLAT in `src/` and is the only module that names `process.stdout`**,
   passing it as the injected `FrameSink`. A subdirectory trips `ADR-0011` clause 1's known
   non-recursive-enumeration + depth-fixed-specifier gap and silently drops the licence guard's
   reach; flat costs nothing and the trigger never fires.
2. **`EPIC-004` builds an incremental Zobrist update before it builds a transposition table**, and
   makes its threading decision explicitly. Today's key is a full 128-square `bigint` recompute
   (~295–304 ns) that transiently mutates the board — `ADR-0005` already records both the per-node
   cost and that it forecloses one shape of parallel search (`UNKNOWN - verify`).
3. **The lane budget is treated as the real constraint from the next ticket onward.** ~14 files of
   planning headroom, `pool: "threads"` worth about 5 more, and the per-file floor unchanged after
   it. **The floor account's owner is Architect/Design and this is that owner saying it binds.**

## Why NO `ADR-0012` — and this is the deliberate answer, not an omission

The brief permits at most one new ADR *"if, and only if, a real decision must be made now"* and warns
that **an audit inventing a decision to justify itself is the failure mode.** I checked four
candidates and **every one is already decided, already owned, or not yet owed**:

| candidate | why no ADR |
|---|---|
| **Where the CLI entry point attaches / who owns stdout** | **Already ruled three times over.** `ADR-0011` clause 4 classifies an entry point mechanically; `ABC-029`'s `A2` already contained the stdout channel on fd 3 (**measured: the hazard no longer reproduces**); `turn-loop.ts` already takes an injected `FrameSink`. A fourth statement would be ceremony, and `EPIC-006` is **P2 and undecomposed** — deciding its internals now is speculative architecture for load that has not arrived |
| **Restructure `src/` into subdirectories** | **Contraindicated by measurement.** Zero cycles, depth 8, clean layering, no god module — there is no structural pain to relieve, and a move would break `ADR-0011`'s depth-fixed specifier. **This is precisely the confident "we should restructure" the brief warned this hop was most likely to get wrong, and the graph refutes it** |
| **Adopt `pool: "threads"` / move the lane budget** | **Already owned and explicitly parked.** `ADR-0008` Decision 8 hands it to `ABC-026`'s dev hop with a required screen, owner Architect/Design. The level is **Olger Oeselg's, ratified in person** — an audit does not move it, and `ABC-026`'s `H5` is open work I was told not to collide with |
| **The stale `*.nfr.test.ts` census in `ADR-0008`'s screen** | **A stale census is not a decision.** It needs a corrected reading, which is recorded as a note in `plans/nfr-catalog.md` with no target moved. **Amending an accepted, owner-ratified ADR to fix a count would be the "amend the rule to match what shipped" move this project has repeatedly and correctly refused** |

**So: zero new ADRs. `ADR-0012` remains the next free id.** The most useful thing this hop could
produce was not a new decision — it was making the *existing* record true again, which is why the
output is a rewritten `30-architecture.md`, a corrected `00-index.md`, and one additive catalog note.

## What I deliberately did NOT touch

`plans/board.md` (Orchestrator's), `plans/metrics.md` (the Coach lane's), `plans/tickets/` and all ID
allocation (BA/PM holds `ABC-031`+ this hop). **No production code and no tests were written.**
**`plans/traceability.md` was also left alone**: my role would normally append rows there, but BA/PM
is cutting tickets concurrently and that file is the highest-collision surface on the board. **The
trace rows for this audit are therefore OWED and unwritten — flagging it rather than racing for it.**
