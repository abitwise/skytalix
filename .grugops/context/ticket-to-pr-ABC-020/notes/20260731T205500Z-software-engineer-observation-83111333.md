---
id: 20260731T205500Z-software-engineer-observation-83111333
kind: observation
by: software-engineer
at: 2026-07-31T20:55:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-020
  - epic-to-tickets-EPIC-002
  - ABC-020
  - ABC-016
  - ABC-019
  - ABC-021
  - EPIC-001
  - EPIC-002
  - src/gameend.ts
  - src/gameend.test.ts
  - plans/tickets/ABC-020-claimable-draws-and-fide-96-backstops.md
  - 20260731T151500Z-qe-e2e-observation-36373ca4
  - 20260731T181000Z-architect-design-decision-f95614ca
supersedes: 
---

# QE's locked wall is not permanently locked, and that arithmetic explains its published 117

A neutral fact found while implementing A5, recorded because two documents describe the position in
a way that a later reader could take further than it goes. **It changes no criterion and no ticket,
and it cost this implementation nothing** — A5 is green.

## The fact

`8/8/8/p1p1p1p1/P1P1P1P1/8/8/K6k w - - 0 1` is described in QE's G-3 and carried into `ABC-020`'s
A5 as *"three legal king moves, forever, no capture and no pawn move available to either side"*.

**The first clause is true; the last is true only at the starting position.** The pawn wall is
genuinely frozen and neither king can cross it — every square beyond the wall is covered by a pawn,
so `b4`/`d4`/`f4`/`h4` are unavailable to White and `b5`/`d5`/`f5`/`h5` to Black. But **both kings
start on rank 1** (`a1` and `h1`) and share the same half-board, and a king that walks up to rank 3
can step onto rank 4 and **capture a loose white pawn**. That resets the halfmove clock.

Measured read-only against merged `src/`, driving every ply by policy:

```
  first-legal-move : at ply 150, clock = 133   (clock reset at ply 17 — a king took a pawn)
  last-legal-move  : at ply 150, clock = 150   (no capture; the clock never reset)
```

## Why it is worth a note: it explains a published number

QE recorded *"drives to: terminal after 117 plies: fifty-move, clock=100"*. With the clock reset at
ply 17, it reaches 100 at ply **117** — `150 − 133 = 17`, and `17 + 100 = 117`. The identity is
exact. **That is a positive cross-check on QE's drive, not a criticism of it:** it tells us QE used
the first-legal-move policy and that its line contained one capture, and it is the reason the
published figure is 117 rather than the 100 a pure shuffle would give.

## The consequence, stated so nobody trips on it later

Under the merged automatic fifty-move rule the wall terminated at ply 117 on that policy. Under
`ABC-020` it terminates at ply **167** on that same policy — 150 plies from the capture, not from
the start. **A5's "within 150 plies" is a bound per irreversible-move epoch, which is exactly what
FIDE 9.6.2 says**, not a bound from an arbitrary starting FEN. The test therefore drives the
no-progress line A5's Given describes (each ply, the first legal move that is neither a capture nor
a pawn move) and asserts termination at **exactly** ply 150 — a stricter assertion than "within
150", and one that fails both if the game ends early and if it does not end.

**No criterion needs changing and none was changed.** A5's substance — the game terminates
automatically, with no claim, on the 75-move backstop, which is the criterion that would fail if
the two halves of this ticket were split — is precisely what is asserted and it is green.

## A second, smaller fact from the same drive

A caller that **does** pass a counts map never reaches the 75-move backstop on this wall: the
shuffle repeats a position five times by ply 22–37, so it draws by `fivefold-repetition` (9.6.1)
first. That is correct FIDE behaviour and it is why A5 must be driven **bare**. It is also a
concrete illustration of the two backstops covering different callers — 9.6.1 for a caller with
history, 9.6.2 for one without — which is the property that makes a non-terminating game
unreachable from either caller shape.

## Provenance

Written directly into `notes/`; no `scripts/context-io.ts` and no `mcp__grugops__propose_note` exist
in this install, the degradation QE and Architect/Design each recorded on 2026-07-31. This is an
`observation` — a neutral kind with an empty `verified_by` — so no stamp was required and none was
bypassed. **No `finding` was recorded or attempted; nothing here is self-stamped.** Both drives were
run in the session scratchpad against a read-only copy of merged `src/`.
