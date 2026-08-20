---
id: 20260821T072000Z-software-engineer-decision-the-wording-i-chose-and-why-the-paragraph-now-names-the-shape-the-trap-catches-6b3ad711
kind: decision
by: software-engineer
at: 2026-08-21T07:20:00Z
verified_by:
confidence: high
refs:
  - G-QE115-4
  - ABC-115
  - A10
  - src/cli.test.ts
supersedes:
---

# THE WORDING, AND THE RULING ON WHETHER TO NAME THE SHAPE THE TRAP DOES CATCH — I ADDED IT

## What the sentence said

```text
* THE TRAP, AND A ROW THAT FALLS IN IT IS GREEN ON EVERY BUILD: the redirection binds `node` alone,
* so the wrapper's own status is the trailing `echo`'s and is `0` on the fixed, the unfixed and the
* swallowing build alike. The status is read from `NODE_EXIT=` and NEVER from `child.status`.
```

## What it says now

```text
* THE TRAP, AND A ROW THAT FALLS IN IT DISCRIMINATES NOTHING — IN EITHER DIRECTION: the redirection
* binds `node` alone, so the wrapper's own status is the trailing `echo`'s and is `0` on the fixed,
* the unfixed and the swallowing build alike. A row reading `child.status` therefore measures that
* constant and not the product. MEASURED 2026-08-21 in an out-of-repo copy, delivered build against
* the one-token swallowing arm: this row's `not.toBe(0)` over `child.status` is RED on BOTH, never
* the green-on-every-build shape a reader may expect; the `toBe(0)` spelling of the same clause is
* GREEN on both, and its red against the mutant comes only from the separate non-empty-stderr
* assertion. The status is read from `NODE_EXIT=` and NEVER from `child.status`.
```

Three things are deliberate. **The true premise is kept verbatim** — the wrapper-status clause was
never the defect and I re-measured it rather than re-typing it. **The correct instruction is kept as
the last sentence, unchanged and still last**, because it is the line a hurried reader takes away.
**The headline verb changes from a colour to a capability**: `DISCRIMINATES NOTHING` is QE's
suggested clause and I kept it, because the failure of a trapped row is that it stops separating the
builds — the colour it happens to show is downstream of which way the assertion is spelled, which is
exactly the thing the old sentence got wrong. `— IN EITHER DIRECTION` is mine, and it is the clause
that stops the next reader repeating the mistake in the other direction.

## The ruling the brief asked for: YES, name the `toBe(0)` shape

I considered leaving it out. The argument for leaving it out is real — this is a docblock over one
child factory, not an essay on mutation testing, and every added sentence is a sentence a later hop
must keep true. I ruled against it for one reason that outweighs that: **`toBe(0)` is the version a
later hop is most likely to write**, because "the wrapper exited fine" is the intuitive assertion,
and it is the version that IS silently blind. A warning that only forbids the spelling nobody would
choose does not protect the file. Naming both spellings costs three lines and closes the hole.

**But I refused to state it the tidy way.** The tidy sentence — "the `toBe(0)` spelling would be
green on every build" — is FALSE OF THIS ROW, and writing it would have replaced one true-sounding
untruth with another, which is the one thing the brief forbids by name. I measured it: with
`child.status` and `toBe(0)`, the status clause passes on both builds, but the ROW still reds
against the swallowing mutant through `A10`'s third assertion, whose stderr is 0 bytes. So the text
says the CLAUSE is green on both and names where the mutant-red actually comes from. It is longer
and less quotable than the tidy version; it is the version I can show a run for.

## What I did not write

No claim about `A9`, the `EPIPE` branch, `ADR-0016`, the exit-code collision, the `N8-LANE` budget
or the spawn-count ceiling — none of them was measured at this hop and none of them is this
residual. No severity re-grading of `G-QE115-4`: QE ruled it non-blocking and PASSED the ticket, and
that judgement is not re-opened here.
