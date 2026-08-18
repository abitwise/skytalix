---
id: 20260819T233000Z-architect-design-decision-the-fence-is-the-seam-not-the-module-list-a1c4e7b2
kind: decision
by: architect-design
at: 2026-08-19T23:30:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-035
  - ABC-019
  - ADR-0009
  - ADR-0011
  - ADR-0013
  - ADR-0015
  - src/cli.ts
  - src/cli.test.ts
  - src/line-input.ts
  - src/command-input.ts
supersedes:
---

# `G-01` RULED: the fence is the **SEAM**, not the module list. `A3`'s substitution of `./command-input.ts` is an **EXTENSION and it is REFUSED**.

**QE asked for one thing explicitly — *does the licence fence the MODULE LIST or the SEAM?* — and the
answer is the SEAM.** The rule is `ADR-0015`, written at this hop. This note carries the reasoning and
the two things the ADR is too general to say: why the refusal is not a new refusal, and why it does
not leave `A3` unbuildable.

## The rule, stated once (full text and its clauses are `ADR-0015`)

> A module substitution inside a spawned child is a **test double** only if **(S)** the substituted
> module is a **supplier named at an injection point of the delivered composition** — its specifier is
> imported by `src/cli.ts` and its binding is passed as an option in the `runTurnLoop({ … })` bag;
> **(C)** the double satisfies the **published type** of that seam; and **(N)** the criterion it serves
> does not assert the substituted module's own behaviour. Fail (S) or (C) and it is a **product
> rewrite**, refused however clean its diff is.

**(S) and (C) are mine and are ruled. (N) is BA/PM's** — it is a criteria-integrity test, and *"would
test the harness instead of the product"* is BA/PM's own statement of it. I did not touch it.

## Why (S) is the line, and not the list

**An injected seam is a contract; a static import is not.** Any supplier satisfying the seam's type is
a legal composition, so a double at a seam constructs a product that **could really exist** — which is
BA/PM's own *"a constructed fault at a seam is a test double by definition"*, and why the engine grant
was right. A module reached only by a static import has no contract: **its source IS its behaviour**.
Rewrite that source and you construct a composition that could never exist, and the test asserts a
property of the harness's fiction.

`ADR-0009` clause 9c fences a double's **container** (a test file). It never had to fence its
**position**, because every double in this tree until now sat at a seam. `ADR-0015` fences the
position. **9c is byte-unchanged and nothing in it is narrowed.**

## The finding that makes this a REPRODUCTION of BA/PM's refusals rather than a new one

I measured where each of BA/PM's three named modules actually sits, and where `./command-input.ts`
sits, at this branch tip:

| module | reached how | (S) |
|---|---|---|
| `./engine.ts` | `src/cli.ts:70` → `engine:` at `:156` | **seam supplier** |
| `./line-input.ts` | `src/cli.ts:73` → `input:` at `:155` | **seam supplier** — `InputSeam` is an injection point exactly like `engine` |
| `./turn-loop.ts` | it IS the callee | not a supplier |
| `./frame.ts` | `src/render-seam.ts:41`, `src/turn-loop.ts:50`. **Named nowhere in `src/cli.ts`** | **below a seam supplier** |
| **`./command-input.ts`** | **`src/line-input.ts:56` and nothing else.** Named nowhere in `src/cli.ts` | **below a seam supplier** |

**`./command-input.ts` and `./frame.ts` are the SAME SHAPE — one static import below a seam
supplier.** BA/PM refused `./frame.ts` outright. So refusing `./command-input.ts` is not an extension
of BA/PM's refusals; **it is one of them, correctly generalised.** Two of BA/PM's three names fall out
of clause (S) mechanically, which is the evidence that (S) is the rule the names were examples of
rather than a rule invented to settle this hop. Only `./line-input.ts` rested on a judgement, and that
judgement is (N) and is BA/PM's.

## QE's reductio, adopted

If what is not on a list of three is allowed, every module in `src/` is substitutable in a child, and
*"never substitute `./line-input.ts`"* is satisfied by substituting what `./line-input.ts` imports.
**A fence walked around by going one import deeper is not a fence.** The boundary between
product-under-test and harness would then be drawn by whatever the test author needs — the exact
failure `ADR-0013` clause 3 and `ADR-0009` clause 9c exist to prevent. I adopt this argument; it is
QE's and it is right.

## What I did NOT rule, and what I refused to reach for

- **I did not weaken `ADR-0011` clause 4.** `src/cli.ts` exports **0**, measured by me at this tip.
  An export, a flag or an env gate would make `A3` trivial and is refused twice over — by clause 4 and
  by `ADR-0013` clause 3. It is named in `ADR-0015`'s alternative D **only** so nobody reaches for it
  after reading a refusal.
- **I did not rule `NFR-008` or `N8-LANE`.** `ADR-0014` is not re-opened, nothing is claimed against
  the lane, and the disposition below costs **zero** additional spawns — the `N8-SPAWN` pin of 17 is
  untouched.
- **I did not re-open `ABC-035`.** `G-01` asks whether a TEST may rewrite that module's source. It
  questions nothing `ABC-035` shipped.
- **I did not lift BA/PM's name-refusal of `./line-input.ts`.** See the disposition note — that is the
  one question that leaves here, and lifting a name to unblock a ticket is precisely what the engineer
  and QE were right to decline.
- **I wrote no line under `src/`** and moved no board column.

## The clause `ABC-044` and `ABC-045` inherit — written before it is asked

`ADR-0015` clause 2: **when a criterion needs a fault the delivered product cannot produce AND no seam
can construct it, the criterion is not testable in contract.** Re-scope it, or move it to an opt-in
lane, with BA/PM and — where the product's promise moves — the owner. **Never widen the fence at the
point of need.** A widening bought to unblock a ticket is a precedent; the next ticket inherits the
precedent and none of the reasoning. QE predicted this returns at `ABC-044`; that is the answer,
prepared in advance rather than improvised then.
