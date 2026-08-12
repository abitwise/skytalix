---
id: 20260812T192000Z-ba-pm-decision-two-tickets-one-a5-ruled-accept-on-a-measurement-be7ba02c
kind: decision
by: ba-pm
at: 2026-08-12T19:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-017
  - ABC-028-A5
  - AR-2
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# Two tickets' `A5` in one file: ruled ACCEPT, on a measurement — nothing routes to the Engineer

> Hand-authored `decision`, deliberately **not** a `finding` — see the sibling `observation` for why
> nothing on this hop can carry a stamp.

## The collision is real and was reported by no role

`src/history-pane.test.ts` now holds `ABC-017`'s `A5` at **`:381`** (*"the most recent 8 move numbers
of the 80-ply deterministic game: 33..40"*) and `ABC-028`'s `it.each(A5_SHAPES)("A5 — %s")` table at
**`:1062`**. Both were read at source at this hop. Finding it was worth the report on its own.

## The consequence claimed for it is FALSE, and that is measured rather than argued

The concern put to me: *both emit `A5 — …` on failure, so a red does not say which ticket's criterion
broke* — and this board has already paid once for an assertion naming the wrong subsystem (`AR-2`). **I
forced each one red in the out-of-tree replica and read what the runner actually printed:**

```
default reporter   FAIL  src/history-pane.test.ts > ABC-017 acceptance > A5 — the most recent 8 …
                   FAIL  src/history-pane.test.ts > ABC-028 acceptance > A5 — the last move's …
json reporter      ancestorTitles = ["ABC-017 acceptance"] / ["ABC-028 acceptance"]
                   fullName       = "ABC-017 acceptance A5 — …" / "ABC-028 acceptance A5 — …"
```

*(The `ABC-017` red was forced with a throwaway one-line window mutation in the replica, purely to make
the reporter print that line. It is not offered as a mutant result — the emitted NAME is what was being
measured, and it does not depend on why the test failed.)*

**On both channels this project uses, the failure line carries the ticket-qualified ancestor path.**
The two `describe` blocks are already `ABC-017 acceptance` and `ABC-028 acceptance`, and the text after
`A5 — ` differs in every character. **A red says which ticket's criterion broke, twice over.**

## The ruling

**ACCEPT. No rename, no qualifier, no test file change — so this routes to NOBODY and the Engineer is
not scheduled.**

- Renaming a green test to fix a problem measurement says does not exist is `AGENTS.md` rules 8 and 10
  in a single move: handling an impossible scenario, by refactoring working code.
- **`AR-2` is not the precedent.** That was an assertion whose own message named the wrong subsystem.
  This is two correctly-named criteria inside two correctly-named `describe` blocks — the qualifier is
  already there and the runner already prints it.
- The `describe`-per-ticket convention this file already follows is what makes the collision harmless,
  and it is worth noticing that **the convention did its job before anybody asked it to.**

## The residual, which is real and is in PROSE rather than in the runner

**This ticket page says "`A5`" more than fifty times, and two of them now mean different things.** That
is a documentation hazard, not a test hazard, and it is mine. **The rule is set in the ticket at
`## Test notes` 12: whenever `src/history-pane.test.ts` is in scope, write `ABC-028 A5` or
`ABC-017 A5` — never bare `A5`.** Zero cost, no test touched, and it is the half of the concern that
survives measurement.

**If a later hop wants the rename anyway, the thing to dispute is the measurement above, not the
inconvenience.**
