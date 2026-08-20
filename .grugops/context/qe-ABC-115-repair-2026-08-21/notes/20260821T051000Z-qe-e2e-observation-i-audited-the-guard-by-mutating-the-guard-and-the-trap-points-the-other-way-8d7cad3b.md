---
id: 20260821T051000Z-qe-e2e-observation-i-audited-the-guard-by-mutating-the-guard-and-the-trap-points-the-other-way-8d7cad3b
kind: observation
by: qe-e2e
at: 2026-08-21T05:10:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - A10
  - G-QE115-1
  - G-QE115-4
  - src/cli.test.ts
supersedes:
---

# `A10` IS NOW THE ONLY GUARD ON THE NON-`EPIPE` BRANCH, SO I MUTATED THE GUARD ITSELF — IT HAS TEETH, AND ITS OWN TRAP WARNING POINTS THE WRONG WAY

A guard that cannot fail is worse than no guard, because it reads as coverage. `A10` was therefore
audited as a subject, not used as an instrument.

## The engineer's claim, confirmed from source

`src/cli.test.ts:2900-2901`:

```ts
const child = CHILDREN.unwritableStdout;
const status = productStatusOf(child);
```

**The status is read through `productStatusOf`, which parses the `NODE_EXIT=` marker the wrapper
echoes, and never from `child.status`.** `productStatusOf` **throws** when the marker is absent, so
reaching the assertions is structural proof the product ran and exited — the row cannot pass by the
child having failed to start. Confirmed as reported.

## I mutated the row to read the wrapper instead, and measured both builds

| `A10` reads | production build | result |
|---|---|---|
| `productStatusOf(child)` (delivered) | delivered arm | **GREEN** — `NODE_EXIT=1` |
| `productStatusOf(child)` (delivered) | one-token mutant | **RED** — `NODE_EXIT=0`, and the only red of 61 |
| `child.status` (my mutation of the row) | delivered arm | **RED** — `"NODE_EXIT=1\n": expected +0 not to be +0` |
| `child.status` (my mutation of the row) | one-token mutant | **RED** — `"NODE_EXIT=0\n": expected +0 not to be +0` |

**The delivered form discriminates the production token. The wrapper form discriminates nothing.**
That is the audit and it passes.

## `G-QE115-4` — THE TRAP WARNING IN `A10`'s OWN DOCBLOCK STATES THE WRONG FAILURE DIRECTION

`src/cli.test.ts:469-471` (the `unwritableStdout` docblock):

> **THE TRAP, AND A ROW THAT FALLS IN IT IS GREEN ON EVERY BUILD:** the redirection binds `node`
> alone, so the wrapper's own status is the trailing `echo`'s and is `0` on the fixed, the unfixed
> and the swallowing build alike. The status is read from `NODE_EXIT=` and NEVER from
> `child.status`.

**The premise is true and the consequence is false for this row.** The wrapper's status is indeed
`0` on every build — I measured it. But this row asserts `not.toBe(0)`, so a version of it that
falls into the trap is **RED on every build**, not green: rows 3 and 4 of the table above, measured.
A row that is green on every build is what you get when the assertion is `toBe(0)`; that is the
classic shape of the trap and it is not the shape here.

**Severity, stated so this is not read as bigger than it is.** The *instruction* the block gives —
read `NODE_EXIT=`, never `child.status` — is correct, is what the code does, and is what a reader
would follow. A hop obeying this docblock is led to the right place. Nothing is mis-taught about
the budget, the delivery or the contract, and no measurement is misstated.

**Recorded as `G-QE115-4` and explicitly NOT part of my verdict.** It is the same species as
`G-QE115-2` — a true-sounding sentence that is not true, in this file, in this diff — but it is not
the same *severity*: `G-QE115-2` taught a superseded ceiling and accused the delivery of a breach it
had not committed, which is materially misleading; this one gets the direction of a warning wrong
while giving the right instruction. Sending a ticket back on it would be the rule applied
capriciously rather than evenly, and I decline to do that. The one-clause fix — *"a row that falls
in it discriminates nothing"* — belongs to whoever next opens this docblock.

## One more shape I checked, because "it reds against the mutant" is not the whole audit

`A10` is deliberately shaped to survive a later ticket routing non-`EPIPE` to `70`: it asserts
non-zero and non-empty stderr, never `1`. I confirm that is what the assertions say, and I confirm
the corollary the residual ruling relies on — **a future fix of the exit-code collision leaves this
row green and needs no re-cut.**
