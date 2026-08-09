---
id: 20260809T151028Z-orchestrator-decision-22b59d96
kind: decision
by: orchestrator
at: 2026-08-09T15:10:28Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# One more pass, and it TERMINATES — the byte space is finite and this exhausts it. Then close.

`A11` is met and its marker is properly retired (the three remaining `NOT YET SATISFIED` strings are the
dated retirement record and QE's historical risk entry, checked). BA/PM's verification was independent
by construction — it derived its mutant set from `A11`'s own text rather than from QE's table — and it
found **the fourth class QE predicted**: `A11`'s enemy-colour exclusion is measurably false for two piece
types.

Verified by me before deciding anything:

```
DELIVERED code, 4k3/8/8/8/8/8/8/K3n2R w K - 0 1  →  13 moves, 0 castles, pure   ← code is CORRECT
DELIVERED code, 4k3/8/8/8/8/8/8/K3p2R w K - 0 1  →  13 moves, 0 castles, pure   ← code is CORRECT
mutant admitting an ENEMY KNIGHT on the king's home square:
  compiles (not a broken build) · full suite 371/371 PASSES · gap is LIVE
  harm: 14 moves, → 4k3/8/8/8/8/8/8/K3K2R w K - 0 1
        the BLACK knight destroyed and a WHITE king written over it
        — material loss AND a colour change, worse than the own-colour family
```

`src/moves.ts` still md5 `0e247853ab2c05887c76105ff83d8621`, untouched since the engineer's first commit
across four verification hops. **Zero production lines are owed. This is a test-net gap, not a defect.**

## Why I am authorising one more pass instead of closing with an accepted risk

I was ready to close. The argument that changed it is that **this pass terminates the sequence, and I can
prove the termination rather than hope for it.**

Four consecutive hops each found one more *sample* class — engineer 5 mutants → QE 62 → BA/PM 10 → QE 20
→ BA/PM 17+12 — and BA/PM says to expect a fifth. **It is right that a fifth sample class exists, and
wrong that the sequence is open-ended, because the space is finite and small.** Each home square holds
exactly one byte. The values it can hold are `EMPTY` plus 6 piece types × 2 colours = **13 total**, of
which **1** is correct. So there are **12 wrong values per square, and that is the whole space.**
Accounting for all of them from the measurements now on record:

```
EMPTY                        → A3 / A4 (the absence rows)           COVERED
own QUEEN/ROOK/BISHOP/KNIGHT/PAWN  → A11 (own-type quantifier)      COVERED, this task
enemy BISHOP                 → killed by A5 row 3 and A6 row 4      COVERED
enemy KNIGHT, enemy PAWN     → survive 371/371, harm live           ← THE GAP
enemy KING/QUEEN/ROOK        → behaviour-equivalent, measured        UNFALSIFIABLE, correctly untestable
```

Every one of the 13 values is accounted for. **Close enemy KNIGHT and enemy PAWN and the observable byte
space is exhausted — there is no fifth region for a fifth class to live in.** So the criterion should stop
being a list of sample classes and become a **quantifier over the full byte space with a named, measured
equivalence carve-out**. That is a structural end to this sequence, not one more sample.

The enemy KING/QUEEN/ROOK carve-out is the same shape as guard ordering: admitting them changes no
observable behaviour because the through-check masks them, so no test could ever fail on them and a
criterion would be unfalsifiable. It must be **named and measured, never silently omitted** — BA/PM
already established why colour-blindness is equivalent, and this is the same fact from the other side.

BA/PM's judgement call on the false clause was right and worth preserving: the exclusion as written read
*"so nobody adds a row for them"* — a false instruction aimed at exactly the missing rows, which would
have survived the merge. It corrected the clause without adding a criterion or writing a row, which is
the boundary its subtask set.

## The stopping rule, written down now rather than improvised later

**This is the last hardening pass on `ABC-009`.** After it, the observable byte space for both home
squares is exhausted by construction. If anything further is found in this module, it goes to a
**follow-up hardening ticket for `src/moves.ts`**, not another `ABC-009` hop — the ticket's `## Scope` is
three bullets about the castling preconditions, all three verified across five independent derivations,
and an unbounded mutation net is not in it. Recorded so that a sixth hop has to argue against a written
rule instead of drifting into existence.

## Scheduling

Two hops, serial, in this order, because the seam requires it:

1. `ticket-to-pr-ABC-009-bapm4` → BA/PM: restate the criterion as the **full-byte-space quantifier** with
   the three-value equivalence carve-out named and measured, and state the exhaustiveness argument. It
   holds all the measurements already.
2. `ticket-to-pr-ABC-009-qe3` → QE/E2E: write the rows (enemy KNIGHT and enemy PAWN, both squares, at
   `A11`'s established doubling — up to 8 rows), zero production lines.

Width 1 throughout, same reason as every prior hop: one `plans/traceability.md` row. `pending/` and
`claimed/` were empty at this decision; no stale-claim sweep owed.

**Then, and only then:** the UAT ruling (deferred → `EPIC-006`, explicitly NOT passed), the merge under
the owner's standing directive of 2026-08-06 with gates run and recorded on the branch tip before and on
`main` after, and the close to `Done` **including the ticket frontmatter**.

## `ABC-018`'s frontmatter drift — BA/PM's call accepted

BA/PM declined to cut a ticket for it and wrote the trigger down instead: **if `ABC-009`'s own close also
misses the frontmatter step, it is a pattern and earns a process item.** That is better than a ticket for
a one-line defect, and it puts the test on the very next event. Accepted. `ABC-009`'s close must not miss
that step, and this note is the second place that is written down.

## What this note does NOT establish

- **That the delivered code needs any change.** It does not. Four hops have left `src/moves.ts`
  byte-identical, and I verified the two enemy FENs answer correctly on it.
- **That the equivalence carve-out is exactly three values.** BA/PM measured enemy KING/QUEEN/ROOK as
  equivalent on both squares; I re-derived none of those three. QE should confirm they still survive
  after the new rows land, as it did for the nine.
- **Any `NFR-001`, perft or deep-lane figure of mine.** Still none, on any hop.
