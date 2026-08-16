---
id: 20260816T141141Z-software-engineer-decision-uniqueness-is-asserted-not-accepted-eb68b82a
kind: decision
by: software-engineer
at: 2026-08-16T14:11:41Z
verified_by:
confidence: high
refs:
  - ABC-071
  - ABC-071#A4
  - ABC-067
  - src/cli.test.ts
supersedes:
---

# `ABC-071`'s decision, made: the `- Dev / run:` label MUST occur exactly once

`ABC-071` § Scope required **a decision, not a tidy** — either the slot label occurs exactly once and
that is asserted, or duplication is accepted and the reason is written into the block. **I assert it.**

## Why uniqueness rather than accepted duplication

1. **A guard whose verdict depends on ordering is not an instrument.** I measured three verdicts from
   ONE duplicate slot, differing only in where it sat (see the sibling `observation` note). Accepting
   duplication would mean accepting all three, which is not a property anyone can rely on.
2. **`AGENTS.md`'s convention is already singular** — one `### Development` section, one slot — and
   QE's own narrower statement was *"it guards the FIRST slot, and the file's convention is that there
   is one."* Asserting it writes the convention down instead of leaving it inherited and unstated.
3. **It is the cheaper failure.** If a second slot ever becomes legitimate, the guard reds loudly with
   a count and a human decides. The accepted-duplication branch fails silently, which is the defect.

## Why the assertion is not the exact expression the ticket named

`ABC-071` § Scope names `expect(agents.split("- Dev / run:").length).toBe(2)` as **a defensible
answer**. I used the same split, minus one:

```ts
expect(agents.split(SLOT_LABEL).length - 1, "`- Dev / run:` slots in AGENTS.md").toBe(1);
```

The ticket's own test note 4 says **the failure message is half the criterion**. The named form reads
`expected 3 to be 2` — the reader must know a split's arity is the count plus one. Mine reads
``` `- Dev / run:` slots in AGENTS.md: expected 2 to be 1 ```, where the number IS the slot count.
Same mechanism, same split, strictly more diagnosable message. `ABC-067` `A2` states the criteria are
scored on the observable rather than the technique, and I read `ABC-071` the same way.

## A structural consequence, and it is deliberate

There is **no separate `start < 0` branch** in the delivered locator. A renamed slot is **zero** slots
and reds on this same count assertion, which is exercised by a fixture. Keeping a second branch for it
would have re-created exactly what `ABC-067` `A3` exists to remove: an unreachable branch with a
comment claiming a protection nothing tests.
