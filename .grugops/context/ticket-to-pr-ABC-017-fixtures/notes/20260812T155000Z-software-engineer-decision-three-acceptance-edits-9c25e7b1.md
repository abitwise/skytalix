---
id: 20260812T155000Z-software-engineer-decision-three-acceptance-edits-9c25e7b1
kind: decision
by: software-engineer
at: 2026-08-12T15:50:00Z
refs:
  - ticket-to-pr-ABC-017-fixtures
  - ABC-017
  - ABC-019
  - src/history-pane.test.ts
  - src/history.ts
  - 20260812T143500Z-ba-pm-decision-five-gap-rulings-8d2f4b61
  - 20260812T144000Z-ba-pm-observation-g2-trap-resolved-6e13a8d5
verified_by:
confidence: high
supersedes:
---

# The three acceptance-file edits: the choices that were mine, and why `A9`'s THIRD timing repair is a pattern

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## `A6` — a separate `it`, and the delivered loop left byte-identical

The fourth anchor is its own `it` rather than three more assertions inside the existing three-anchor
test. The reason is not style: the existing test ends with the `not.toContain(1)` loop that QE proved
is the **sole** acceptance-table catcher for `WPHANTOM`, and a failing assertion ends a test. Adding
the fourth anchor above that loop would put it behind two new failure modes. **The loop is unchanged
character for character, and the fourth anchor is deliberately NOT added to it** — `A6` says *"in none
of the FIRST three"*, and the delivered loop already iterates exactly those three. Only the comment
above it changed, to match the criterion's new wording and to record why the loop must keep firing.

The three new assertions **do** share one `it`, on BA/PM's explicit ruling: all three are requirements
on the pane's output and they discriminate different builds, so each reports on the build it catches.
Verified rather than assumed — `WLEAD-A` fails the row count, `WLEAD-B` fails the white cell, and
neither masks the other.

## `A9` — freezing the caller's array, and why an *instrument* rather than an *observation*

The criterion says the caller's `moves` is not mutated **at any point DURING a render**. A before/after
comparison cannot express that, which is the whole of `D26`. I had two shapes available: watch the
array live (a `Proxy` recording mutation attempts) or make a mutation impossible and let it announce
itself (`Object.freeze`). I took the freeze — BA/PM named it as one option and left the instrument to
me — because it is four lines against roughly forty, it needs no bookkeeping about which trap fired,
and ESM's strict mode turns every mutating array operation into a `TypeError` at the exact call that
made it.

**The one hazard of a freeze is that it can silently become a no-op** — if `history.moves` were a
getter returning a fresh copy, freezing would guard nothing and the test would pass forever. So it is
**armed rather than assumed**: `expect(Object.isFrozen(history.moves)).toBe(true)` after the freeze
and before the render. Read at source, `moves` is a real array on the object (`src/history.ts:34-46`,
with `moveListOf` at `:54` casting away the `readonly` in one named place), so the freeze bites — but
the assertion means a future change to `GameHistory` cannot quietly disarm it.

## `A9`'s THIRD timing repair — the pattern, since BA/PM asked whether I see why

I do, and I think it is one thing rather than three coincidences.

| repair | what was wrong | shape |
|---|---|---|
| `D10`/`D11` | the snapshot was taken **too late** — between the two renders | a comparison at the wrong TIME |
| `D23` | the fixtures were rendered **too early** — by other tests, before the snapshot | a comparison at the wrong TIME |
| `D26` | the comparison is **too coarse** — only at the call's two ends | a comparison at the wrong GRANULARITY |

All three are the same underlying fact: **`A9` is trying to state a property of an INTERVAL using
measurements taken at POINTS.** A snapshot pair can only ever say "these two instants agree", and
every one of the three defects is a build that arranges for exactly those instants to agree. That is
why each fix moved a point rather than solving the class, and why a fourth would be predictable.

**The escape is not another point — it is an instrument that is live across the interval**, which is
what the freeze is: it does not compare anything, it makes the forbidden event raise at the moment it
happens. So I read `D26`'s fix as the one that finally changes the *kind* of measurement rather than
its position, and I would expect the "fourth timing repair" BA/PM was watching for not to arrive — the
non-mutation clauses now have a point-in-time guard for state (`position`, `moves.length`,
`initialFen`) and an interval guard for the array. **The remaining exposure is that the interval guard
covers only `moves`**: a build mutating `history.position` mid-render and restoring it before the
return is still invisible, and `position` is a `Uint8Array`-bearing object that `Object.freeze` would
not protect deeply. Nothing on this ticket asks for that and I did not build it; I am recording it so
the gap is a known one rather than a discovered one.

## `A14` — placed last, sharing on purpose

Placed after `A10` because this file is in ticket order and `A14` is the fourteenth criterion; the
header docblock was corrected to say so, since my own edit is what made it false. Its object is built
by the same `blackAnchorTo(20)` builder `A6` uses but is **a separate object**, because `A14` plays a
move on it and a shared one would corrupt `A6` depending on test order — the shared-fixture hazard
this ticket has already paid for twice.

Its first assertion pins the first render's last row before the `playMove`. That is a precondition, not
a second copy of `A6`: without it, "the second pane differs from the first" could pass on two equally
wrong panes.

**The `playMove`-succeeds assertion goes first** because it is the failure that stops `ABC-019`'s loop
dead, and the comparison second. Verified: `WFREEZE` fails at the first, `WCACHE` at the second, so
each reports its own diagnosis.

## The pane needed no production line, and I confirm the ruling rather than merely obeying it

The brief said to stop and report if I found a production line genuinely required. **I did not.** All
nine wrong builds were killed by test-side assertions over the pane's existing outputs and existing
behaviour, and the delivered pane passed every new assertion on the first run. `src/history-pane.ts`
md5 is unchanged. **BA/PM's ruling that the Engineer was owed fixtures and not a fix is confirmed by
this hop's own measurements.**

One thing named on the ticket as *available and not required* was deliberately **not** taken:
`src/history-pane.ts:30`'s comment *"so `src/history.ts` keeps its zero runtime importers"* carries the
same unqualified phrasing `A11` was corrected for. The ticket offers it as "an optional one-word
clarification" and says **no criterion requires it**. Changing it would have been a production line —
one byte or a hundred, the md5 moves and the boundary is gone. **Flagged, not changed.**
