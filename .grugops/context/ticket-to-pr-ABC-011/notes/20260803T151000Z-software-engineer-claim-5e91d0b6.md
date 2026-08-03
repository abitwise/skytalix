---
id: 20260803T151000Z-software-engineer-claim-5e91d0b6
kind: claim
by: software-engineer
at: 2026-08-03T15:10:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-009
  - ABC-010
  - ABC-012
  - EPIC-004
  - EPIC-006
  - NFR-005
  - ADR-0005
  - ADR-0006
  - src/legal.ts
  - src/moves.ts
  - src/apply.ts
supersedes: 
---

# What this pass could NOT settle — five items, and what I carried rather than fixed

Recorded as a `claim` at `confidence: UNKNOWN - verify` because none of it is gate-adjudicable here
and none is load-bearing for the fix. **There is no §14 gate on this install, so no `finding` is
admissible on this task, none was written, and nothing is self-stamped.** `context.human_admission`
is `off`, so the `human:<name>` escape hatch is unavailable too.

**1. Every timing figure is one machine.** Apple M3 (Mac15,13) / Node v24.12.0 / darwin-arm64. The
−0.3…+2.6 ns per call, the ≤ +0.41 ns amortized and the 20–25x on the invalid class are
`UNKNOWN - verify` on any other hardware, exactly as `NFR-005`'s depth levels already are. Owner:
`EPIC-004`'s non-M3 spike, which carries the identical obligation. What is *not* machine-dependent
is that the no-ep path is unchanged — that one is structural, not timed.

**2. My whole-key instrument cannot resolve the guard's cost either, and I can now say how badly.**
The two `NFR-005` anchors are a null control whose delta is structurally zero, and even at 9 rounds
with medians they land at +0.06 and +0.20 ns. The ep-set whole-key cells are +0.66 and −0.42 ns —
*the same size as the control's own error*. So the whole-key ratios support "not measurably slower"
and nothing finer; the isolated predicate figures are the claim. Three roles have now hit this same
wall from three protocols, which is itself the useful result: **stop trying to measure this delta
through a whole key.**

**3. Purity is now total by construction, but "total" rests on an invariant I did not prove.** The
two guards make the probe well-formed for any `Position` whose off-board squares are `EMPTY` — the
invariant `src/position.ts` states. I swept all 128 ep-square values across five boards and five
out-of-array values, and every one is pure. What I did **not** verify is a `Position` whose *board*
has been hand-corrupted so that an off-board square holds a piece; that is outside the type's stated
invariant and I did not manufacture it. Naming it because "for every input" is a strong phrase and
deserves its boundary written down.

**4. The domain restriction remains a specification, not a theorem — the design hop's item 4, and I
inherit it rather than close it.** The predicate answers `false` off-domain, and a future caller who
constructs a `Position` by hand could read that `false` as FIDE's answer rather than as "this board
contradicts itself". The mitigation is still a doc comment, which is weaker than a type. My tests pin
the *behaviour*; nothing pins the *reading*. Unchanged from the design hop's assessment, restated so
it is not lost by being ruled once.

**5. Whether guard (a) belongs in the hash layer at all.** It exists because `generateMoves` is
unsound on the class — it offers a capture onto the mover's own piece — so the hash defends itself
against a generator defect rather than the generator being fixed. That is the correct call for *this*
ticket (the defect is routed to BA/PM and cleaning the generator is not `ABC-011`'s), but it means
guard (a) is a workaround with a named owner, not a permanent design fact. If BA/PM cuts that ticket
and it is fixed, **guard (a) may become deletable — and the two tests that kill it are exactly the
ones that would then need re-deciding.** Recorded so a later reader finds the thread instead of
finding a mysterious guard. I did not act on it; deciding it is not mine.

## Carried, not fixed — each deliberate

- **`ABC-009`** and **`ABC-010`** untouched and still reproduce. Independently re-confirmed that the
  guarded predicate does not inherit `ABC-009` — its trigger FEN is in the purity test and green.
- **`generateMoves` offering an en-passant capture onto the mover's OWN piece**
  (`4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1`) — re-verified this pass and **still reproduces**. Routed
  to BA/PM by the design hop; this fix makes the hash immune to it and does not clean the generator.
  Still owned by nobody until BA/PM acts, which is worth someone noticing.
- **The `makeMove` doc-comment half of the design hop's process note** — stating on `makeMove`
  itself what a well-formed move is. The hop offered it to BA/PM rather than taking it, and it edits
  a file this ticket puts out of scope. Not taken here either.
- **`memory-bank/30-architecture.md`'s module table is still ordered by conceptual layer**, not by
  DAG level. I corrected the `Hashing` row's *content* — the one-cell edit three roles agreed on and
  none had taken — but I did not reorder the table, for the same reason the first pass gave: it
  orders by concept, and reshuffling it is an unrequested refactor of a document that is not wrong.
- **UAT stays DEFERRED to `EPIC-006`, not passed.** Nothing built renders or prompts.
- **`ADR-0005` and `ADR-0006` are `accepted` and I did not touch either.** The code now matches
  `ADR-0005`'s Decision clause 6, which was "decided but not yet built" when the hop wrote it; that
  clause is now built. Whether the ADR should record that is the Architect's, not mine.
