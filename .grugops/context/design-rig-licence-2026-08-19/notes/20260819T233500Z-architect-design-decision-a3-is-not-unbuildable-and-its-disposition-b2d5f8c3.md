---
id: 20260819T233500Z-architect-design-decision-a3-is-not-unbuildable-and-its-disposition-b2d5f8c3
kind: decision
by: architect-design
at: 2026-08-19T23:35:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-019
  - ADR-0013
  - ADR-0015
  - src/cli.ts
  - src/cli.test.ts
  - src/line-input.ts
supersedes:
---

# `A3`'s disposition: **NOT unbuilt.** The in-contract instrument exists, it is named here, and ONE bounded question goes to BA/PM — with a default so nothing deadlocks.

**The brief, QE and the engineer all proceeded on the premise that refusing the rig leaves `A3`
UNBUILT.** *"If the rig is out of licence, the in-licence option is to leave `A3` UNBUILT — not to
build it another way."* **I ruled with that in view, and the premise does not survive the ruling.** It
rests on reading BA/PM's three names as absolute; under `ADR-0015` clause (S) they are not, and the
one that matters here is a **seam supplier**.

## The instrument, named

**`src/cli.ts:73` imports `createLineInputSeam` from `./line-input.ts`, and `src/cli.ts:155` passes it
as `input:` into the `runTurnLoop({ … })` bag.** Measured by me at this tip. **`InputSeam` is an
injected seam, structurally identical to `engine:`.**

So a child hooked with a `./line-input.ts` whose `createLineInputSeam` returns an `InputSeam` that
throws:

- **passes (S)** — the substituted module is a supplier named at an injection point;
- **passes (C)** — a throwing seam satisfies the seam's published type, so it is a composition the
  production contract already permits;
- is **structurally identical to `A5`'s engine double** — a constructed fault at an injected seam,
  driven through the real spawned entry point, with `src/turn-loop.ts`'s real repair-and-rethrow,
  `src/cli.ts`'s real handler and the process's own exit code all intact;
- keeps `A3`'s discriminating requirement **whole** — the catch-and-exit-0 build still fails it, which
  is the mutant QE measured reds on `A3` and `A4`;
- costs **one spawn**, exactly as the current `parserBug` child does. **`N8-SPAWN`'s pin of 17 does not
  move.**

**And it matches `A3`'s own words more exactly than the built rig does.** `A3`'s Given is *"an
`InputSeam` that throws"* — the seam, by name. The built rig produces a **parser** that throws, one
layer below the seam: higher fidelity to `ABC-019` `[D31]`'s *"a parser bug"* narrative, but not what
the criterion says, and not a composition the contract permits. **The in-contract instrument is not a
compromise here; it is the criterion read literally.**

## The one question that leaves this hop, and it is BA/PM's

> **Does BA/PM's name-refusal of `./line-input.ts` extend to `A3`?**

**I do not lift it and it is not mine to lift.** BA/PM's refusal was *reasoned* — *"would test the
harness instead of the product"* — and that reasoning is **criterion-relative**. It was written for
`A2` and `A5`, where the real reader is load-bearing: `A2` feeds a scripted script through it, `A5`
needs it to sit still while the engine faults. **`A3`'s subject is the entry point's top-level
handler**; the reader is `A3`'s *instrument*, not its subject. That is clause (N), and (N) is BA/PM's.

**I report that I find no structural obstacle**, so BA/PM's decision is narrow: not *"may tests
substitute modules"* but *"does my `A2`/`A5` reasoning reach a criterion whose subject is the
handler"*.

## The disposition, both branches, so `A3` is dispositioned either way

| BA/PM's answer | `A3` becomes |
|---|---|
| **name does not extend to `A3`** | `A3` is **REBUILT** with a `./line-input.ts` throwing-seam double. In contract under `ADR-0015`, one spawn, no lane cost, no `src/` production line. **`G-01` closes and `ABC-043` proceeds.** |
| **name does extend to `A3`** | `A3` has **no in-contract instrument**. It is then **re-scoped, moved to an opt-in lane, or dropped — BA/PM's, per `ADR-0015` clause 2.** Not built with the `command-input` rig under any answer. |
| **no answer given** (the default, so nothing deadlocks) | `A3` is **LEFT UNBUILT and RECORDED** as a named uncovered anti-property, the shape `G-06` already has on this ticket: *"an internal fault must not be reported as a chess outcome" is asserted nowhere.* It is a real, honest exposure and it is written down rather than closed by an instrument that does not hold. |

**Under all three, the current `parserBug` child comes out of `src/cli.test.ts`.** That is a
**test-file** repair, so `A8` and the 2026-08-17 zero-production-lines UAT waiver are both unaffected,
and **it is the engineer's — I wrote no line of it.**

## Why the refusal is worth its cost, stated plainly

The honest price of clause (S) is that the layer between the seam and the fault — `src/line-input.ts`'s
own body, in `A3`'s case — is not exercised by this criterion. That is real, and I am not going to
call it free. It is paid deliberately: **coverage lost to a rule is recoverable, a fence lost to a need
is not.** Once `./command-input.ts` has been rewritten in a child to unblock a ticket, every module
below every seam is substitutable by precedent, and no later commit takes that back. When one
direction is reversible and the other is not, the ruling goes to the reversible one — `ADR-0013`'s
asymmetry, reused because it fits.
