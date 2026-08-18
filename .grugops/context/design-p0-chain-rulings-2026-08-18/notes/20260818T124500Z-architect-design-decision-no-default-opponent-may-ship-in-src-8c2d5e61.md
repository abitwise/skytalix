---
id: 20260818T124500Z-architect-design-decision-no-default-opponent-may-ship-in-src-8c2d5e61
kind: decision
by: architect-design
at: 2026-08-18T12:45:00Z
verified_by:
confidence: high
refs:
  - ADR-0013
  - ADR-0009
  - ADR-0011
  - ABC-043
  - ABC-042
  - src/cli.ts
  - src/turn-loop.ts
supersedes:
---

# Ruling 2 — NO. The composition root may not supply a default opponent before `EPIC-004` lands. `ADR-0013`, `accepted`.

## Scope

`ABC-043` § "The named decision this ticket cannot make for itself", which names **Architect/Design**
by name. Ruled at task `design-p0-chain-rulings-2026-08-18`. Full reasoning:
`memory-bank/50-decisions/ADR-0013-no-placeholder-opponent-ships-in-src.md`.

## The ruling

**NO** — not as a `src/` module, not as a one-line `EngineSeam` literal inside the non-exporting entry
point, not behind a flag. `ABC-043` waits for a real `EngineSeam`, which is what its own
`## Dependencies` already says. **The Factory Coach's presumption ("even if the opponent is a stub that
plays the first legal move") does not hold here.**

## The honest part, which the ticket asked for and which most readings would skip

**`ADR-0009` clause 9c does NOT decide this by its letter, and I say so rather than stretching it.**
9c's subject is a test double for the render seam and the thing it forbids is a **`src/` stub
MODULE**; `src/cli.ts` exports nothing (`ADR-0011` clause 4, `ABC-042` `A2`), so a one-liner there is
not a module and cannot be imported. Reading 9c as already covering it would make 9c unfalsifiable.
**So `ADR-0013` ADDS the rule instead of pretending to read it out of 9c**, and `ADR-0009`'s own words
are byte-unchanged (a pointer block was added under 9c so the next reader finds this).

## The rule added, and its discriminator — this is the part that will be asked again

**Placeholder behaviour for an unbuilt module may not ship in `src/` at all. The discriminator is WHO
CAN EXERCISE IT:**

- **only tests can** → it is a **test double**; clause 9c binds it to a test file. Unchanged.
- **a human running the delivered product can** → it is **not a stub**; it is an **undelivered feature
  shipped early**, and it needs a cut ticket, a criterion and the **owner**.

A default opponent is the second kind: `npm run chess` would play a human against it. The container
(module vs. one line) changes only the lingering cost and the import surface — never the class.

## Why NO, and not "ask the owner"

**A YES was not mine to give**: it decides what the shipped product promises a human, which the
who-decides directive keeps with the owner. **A NO is** — it grants nothing, ships nothing, changes no
promise. **The door is not shut**: the owner may license a placeholder, and it then arrives as a cut
ticket with criteria, not as a line under a design ruling. Three merits reasons stand on their own —
9c's *ratio* (dead-on-arrival code that rule 12 flags rather than deletes, in the one file the whole
composition lives in); testability (behaviour in `src/cli.ts` is provable only by **spawning**, and
`ABC-043` shares `ABC-042`'s file under `N8-LANE` ≤ **650 ms** with a **single-digit** spawn budget);
and coding rules 5/7 (no cut ticket needs it).

## Schedule independence — stated so it can be checked, not trusted

**The brief warned that `ABC-078` merging would make a default opponent unnecessary in practice and
that this must not shape the answer. It did not.** `ABC-078` appears in **none** of the ruling's
reasons (`ADR-0013` clauses 1–5, and clause 6 records this). The answer would be identical if
`EPIC-004` were a year away; what `ABC-078` changes is **how long `ABC-043` waits**, not what is
permitted.

## Risks

- **The reversibility argument is the tie-breaker and should be attacked there if anywhere.** Waiting
  is reversible in one line; a human who has already played against a placeholder cannot un-play it.
- **`ABC-043`'s `A5` may not be satisfiable as written** — it needs an `EngineSeam` that throws,
  driven *"through the real entry point"*, and the entry point exports nothing to inject through.
  **That is a criterion question and is BA/PM's**; it is flagged in this hop's `observation` note and
  **deliberately not ruled**. It is **not** a licence to inject a placeholder: a fault seam for a test
  and a default opponent for a human are different objects.
