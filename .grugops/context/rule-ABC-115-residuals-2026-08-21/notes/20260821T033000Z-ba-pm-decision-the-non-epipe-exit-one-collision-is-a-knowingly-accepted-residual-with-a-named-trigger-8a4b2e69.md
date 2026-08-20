---
id: 20260821T033000Z-ba-pm-decision-the-non-epipe-exit-one-collision-is-a-knowingly-accepted-residual-with-a-named-trigger-8a4b2e69
kind: decision
by: ba-pm
at: 2026-08-21T03:30:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ADR-0016
  - A10
  - A1
  - A2
supersedes:
---

# ACCEPTED, NAMED, AND GIVEN A TRIGGER: THE NON-`EPIPE` PATH STILL EXITS `1` AND STILL PRINTS THE CHECKOUT PATH

Measured today, delivered build, read-only fd as stdout: **exit `1`, 1507 bytes of raw Node stack
naming the absolute checkout path**. `1` is `USAGE_EXIT_CODE`. **So the collision `ABC-115` was cut
for still exists — off the `EPIPE` path — and so does the path disclosure `A1` closes on the `EPIPE`
path.**

**This is accepted knowingly. It is NOT a criterion failure and NOT a defect of the delivery.**
`## Out of scope` scopes this ticket to the `EPIPE`-shaped Given, `ADR-0016` clause 3 chose *"behaves
exactly as it does today"* for every other errno **on purpose**, and `A1`/`A2` are written against
that Given. A hop reading this note as a reason to re-open the exit code is reading it wrong: **I did
not re-open `ADR-0016`, I did not propose a wider arm, and I did not grade the delivery down.**

**Why accepting is defensible today.** No non-`EPIPE` stdout failure has ever been observed on this
product outside a deliberately constructed probe; the ordinary shapes — `| head`, `| less` + `q`, a
closed pager — are all `EPIPE`, and `EPIPE` is the one this ticket fixes. Widening the arm now would
mean deciding what `ENOSPC` and `EIO` owe the shell, which is a fourth-code question (`## Ruling` 4
sent that class to Architect/Design and the owner) and a different ticket's value.

**The accepted risk in one sentence, so nobody has to reconstruct it:** on a genuine failed stdout
write that is not `EPIPE`, this product prints a stack that discloses its checkout path and returns
`1`, which a shell cannot tell from a refused command line.

**`A10` is deliberately shaped so this can be closed later without touching it** — it asserts
*non-zero and non-empty*, never `1`. A future ticket routing non-`EPIPE` to `70` leaves `A10` green
and needs no re-cut of this page.

**What would make it a cut, pre-registered so it is not a silent inheritance:** a real non-`EPIPE`
stdout failure observed outside a probe, **or** any hop, gate or script measured taking a wrong
routing decision off this path's `1`. That is the same trigger shape `## Priority` already carries
for `P0` promotion. **Until one fires, it stays a written-down residual and not a ticket** — this
board already carries three items that went unowned by drifting, and this one is owned by being
written down with a trigger.
