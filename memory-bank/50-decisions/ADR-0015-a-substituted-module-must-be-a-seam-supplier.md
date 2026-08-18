# ADR-0015: a substituted module must be a SEAM SUPPLIER; anything reached only by a static import is a product rewrite

## Status

accepted

Written and ratified 2026-08-19 by Architect/Design at task `design-rig-licence-2026-08-19`, ruling
`ABC-043` `G-01`. This ADR **adds** a conformance rule. It re-opens nothing: `ADR-0009` clause 9c,
`ADR-0011` clause 4, `ADR-0013` clause 3 and `ADR-0014` are all byte-unchanged and none of their
clauses is narrowed or widened.

## Context

`ABC-043` spawns the delivered entry point as a child process and substitutes one module inside that
child with `node:module`'s `registerHooks`, carried on a `data:text/javascript,…` URL that lives as a
string in `src/cli.test.ts`. No file is created, nothing under `src/` changes, `src/cli.ts` still
exports **0** symbols (`ADR-0011` clause 4 intact), and the seven merged modules are byte-identical.
BA/PM licensed that rig at `refine-ABC-043-2026-08-19` with three limits, of which two matter here:

> *"The rig is licensed for the **ENGINE seam** under `A2`/`A5` **only**. Substituting
> `./line-input.ts`, `./frame.ts` or `./turn-loop.ts` would test the harness instead of the product."*

`A3` — *"Given an `InputSeam` that throws … the process writes a line that marks it an internal
error … and the exit code is non-zero"* — was then built by substituting **`./command-input.ts`**,
which appears on neither side of that sentence. The engineer flagged its own instrument as an
**extension** rather than an application. QE declined to grant the extension and stopped. Both
refusals were correct: this is a question about **where a test double ends and a rewritten product
begins**, which is `ADR-0009` clause 9c and `ADR-0013` clause 3 territory, and both are
Architect/Design's.

**The question is real, not procedural**, because of a fact QE measured rather than assumed: the
delivered reader is **total**. 71 pathological lines — empty, `\r`, 10,000 characters, `😀`,
`\x1b[2J`, `__proto__`, SAN edge cases, format specifiers — produced **exit 0, zero internal-error
lines, 37,526 bytes** through the delivered product, and the one real throw below the seam
(`src/turn-loop.ts:362`) is unreachable from that reader. **No human input can reach `A3`.** So `A3`
cannot be evidenced without constructing a fault somewhere, and the only question is *where a
constructed fault may be placed*.

### What was measured at this hop, first-hand

On `grugops/design-rig-licence` — `main` merged into the `ABC-043` QE tip, so `src/` is the QE tip's.

| measurement | result |
|---|---|
| `src/cli.ts` exports | **0** (`grep -c` over `^export`/`export ` → `0`) |
| the delivered composition's injection points | `runTurnLoop({ history, humanColour, render, input, engine, sink })` at `src/cli.ts:150-157` |
| supplier named at `input:` | **`createLineInputSeam` from `./line-input.ts`** (`src/cli.ts:73,155`) — an INJECTED SEAM, exactly like `engine:` |
| supplier named at `engine:` | `createEngine` from `./engine.ts` (`src/cli.ts:70,156`) |
| production importers of `./command-input.ts` | **exactly one — `src/line-input.ts:56`**, a hard static import. It is named nowhere in `src/cli.ts` |
| production importers of `./frame.ts` | **`src/render-seam.ts:41` and `src/turn-loop.ts:50`.** Named nowhere in `src/cli.ts` |
| full suite at this branch tip | **1189 passed / skip 0**, `success: true` — unchanged from the QE record |

**The load-bearing measurement is the last pair.** `./frame.ts` — refused by BA/PM **by name** — sits
below a seam supplier, reached only by a static import. `./command-input.ts` sits in **exactly the
same structural position**, one static import below the seam supplier `./line-input.ts`. They are the
same shape, measured, not argued.

## Decision

**The fence is the SEAM, not the module list.** BA/PM's three names are worked examples of a rule;
`only` is the fence, and this ADR states the rule the examples were examples of.

### The rule

> A module substitution inside a spawned child is a **TEST DOUBLE** — and therefore admissible under
> `ADR-0009` clause 9c and `ADR-0013` clause 3 — only if **all three** hold. Fail any one and it is a
> **PRODUCT REWRITE**, refused however clean its diff is.
>
> **(S) SEAM.** The substituted module is a **supplier named at an injection point of the delivered
> composition**: its specifier is imported by `src/cli.ts` **and** the binding it supplies is passed
> as an option in the `runTurnLoop({ … })` bag. Mechanically checkable, filename-free, and it names
> no module — it reads the composition.
>
> **(C) CONTRACT-REALISABLE.** The double satisfies the **published type** of the seam it stands at.
> What it constructs is then a composition the production contract **already permits**.
>
> **(N) NOT THE SUBJECT.** The criterion the double serves does not assert the substituted module's
> **own** behaviour. **(N) is BA/PM's to apply**, not this role's: it is a criteria-integrity test,
> and BA/PM's *"would test the harness instead of the product"* is its statement.

**(S) and (C) are Architect/Design's and are ruled here. (N) is BA/PM's and is not ruled here.**

### Why (S) and (C) are the right line, in one paragraph

**An injected seam is a contract; a static import is not.** Any supplier satisfying the seam's type
is a legal composition, so a double at a seam constructs a product that **could really exist** — which
is exactly BA/PM's own reasoning, *"a constructed fault at a seam is a test double by definition"*,
and exactly why the engine grant was right. A module reached only by a static import has no contract:
**its source IS its behaviour**. Replacing that source constructs a composition that could never
exist, and the test then asserts a property of the harness's fiction rather than of the product.
`ADR-0009` clause 9c's *"a test double lives in a test file"* fences the double's **container**; this
rule fences its **position**, which 9c never had to state while every double sat at a seam.

### What the rule decides, applied

| module | (S) seam supplier? | verdict |
|---|---|---|
| `./engine.ts` | **yes** — `engine:` | **double.** BA/PM's grant is reproduced by the rule, not overturned |
| `./render-seam.ts`, `./history.ts`, `./cli-options.ts` | yes | doubles, structurally — subject to (N) |
| `./line-input.ts` | **yes** — `input:` | **structurally admissible.** Refused for `A2`/`A5` by (N), which is BA/PM's call and stands |
| `./frame.ts` | **no** — below `render-seam.ts` / `turn-loop.ts` | **product rewrite.** BA/PM's name reproduced mechanically |
| `./turn-loop.ts` | **no** — it is the callee, the subject | **product rewrite** |
| **`./command-input.ts`** | **no** — below `./line-input.ts` at `src/line-input.ts:56` | **PRODUCT REWRITE. `ABC-043` `A3`'s instrument is REFUSED** |

**Two of BA/PM's three names fall out of clause (S) mechanically.** That is the evidence the rule is
the correct generalisation of the licence rather than an invention convenient to this hop — and it is
why refusing `./command-input.ts` is **not an extension of BA/PM's refusals but one of them**,
correctly generalised: `./command-input.ts` stands in the identical structural position to
`./frame.ts`, which BA/PM refused outright.

### The reductio that decides it, and it is QE's

If a substitution is admissible whenever the substituted module is not on a list of three, then every
module in `src/` is substitutable in a child, and *"never substitute `./line-input.ts`"* is satisfied
by substituting whatever `./line-input.ts` imports. **A fence that is walked around by going one
import deeper is not a fence**, and the boundary between product-under-test and harness would then be
drawn by whatever the test author needs — which is the precise failure mode `ADR-0013` clause 3 and
`ADR-0009` clause 9c exist to prevent.

### Clause 2 — a criterion that needs a fault no seam can construct is NOT a licence to widen this

**When a criterion demands a fault that the delivered product cannot produce AND that no seam can
construct, the criterion is not testable in contract.** The answer is to **re-scope the criterion, or
move it to an opt-in lane, with BA/PM and where the product's promise moves with the owner** — never
to widen this fence at the point of need. **A widening bought to unblock a ticket is a precedent, not
a rule**, and the next ticket inherits the precedent and none of the reasoning. QE flagged that
`ABC-044` will ask this again; this clause is the answer prepared in advance.

### Clause 3 — `A3` has an in-contract instrument, so `A3` is not unbuildable

The premise that refusing the rig leaves `A3` UNBUILT rests on reading BA/PM's three names as
absolute. Under clause (S) it does not hold: **`./line-input.ts` IS a seam supplier** (`src/cli.ts:73`
→ `input:` at `:155`), so a double whose `createLineInputSeam` returns an `InputSeam` that throws
passes (S) and (C). It is **structurally identical to `A5`'s engine double** — a constructed fault at
an injected seam, driven through the real spawned entry point, with `src/turn-loop.ts`'s real
repair-and-rethrow and `src/cli.ts`'s real handler and the process's own exit code all intact.

**It also matches `A3`'s own words more exactly than the built rig does.** `A3`'s Given is *"an
`InputSeam` that throws"* — the seam, by name. The built rig produces a *parser* that throws, one
layer below the seam; higher fidelity to `ABC-019` `[D31]`'s *"a parser bug"* narrative, but not what
the criterion says and not a composition the contract permits.

**One question remains and it is BA/PM's, not this role's: does BA/PM's name-refusal of
`./line-input.ts` extend to `A3`?** That refusal was reasoned — *"would test the harness instead of
the product"* — and the reasoning is **criterion-relative**: it was written for `A2` and `A5`, where
the real reader is load-bearing (`A2` feeds a scripted script through it; `A5` needs it to sit still).
`A3`'s subject is the entry point's top-level handler; the reader is its **instrument**, not its
subject. **This role finds no structural obstacle and does not lift the name.** Lifting a named
refusal to unblock a ticket is exactly what two roles already correctly declined to do.

## Alternatives

**A. Grant the extension — treat BA/PM's three names as an exhaustive deny-list.** Rejected. It loses
to BA/PM's own words (`only`; *"the rig is NOT a licence to substitute modules generally"*; the
recorded misread *"BA/PM licensed module substitution, so mock anything"*), and it loses to QE's
reductio above. It is also the cheapest wrong answer available at this hop, which is a reason to
distrust it, not to take it.

**B. Refuse it and leave `A3` UNBUILT, recorded as an uncovered anti-property.** Rejected as the
*first* answer because it is not forced — clause 3 shows an in-contract instrument exists. It survives
as the **fallback** if BA/PM declines to lift the name, and as this ruling's **default** so the ticket
cannot deadlock on a non-answer.

**C. Re-scope `A3` now.** Rejected: `A3` is `ABC-019` `[D31]`'s ruling promoted to a criterion, its
discriminating requirement is real (QE measured that the catch-and-exit-0 mutant reds on `A3` and
`A4`), and re-scoping a criterion is BA/PM's and not available to this role as a way of disposing of
an instrument question.

**D. Add an export, a flag or an env gate to `src/cli.ts` so the fault can be injected without a
hook.** Refused, and refused twice already — by `ADR-0011` clause 4 (`src/cli.ts` exports nothing) and
by `ADR-0013` clause 3 (*"exercisable by a human running the delivered product"* makes it an
undelivered feature needing a ticket, a criterion and the owner). **Named here only so nobody reaches
for it after reading a refusal above.** Nothing in this ADR weakens clause 4; preserving it is what
the rig exists for.

**E. Fence by naming modules rather than by reading the composition.** Rejected: a name list is what
just failed. It goes stale the day a seam is added, it cannot be checked mechanically, and it invites
the deny-list reading of alternative A. Clause (S) names nothing.

## Consequences

- **`ABC-043` `A3`'s current instrument must come out.** `src/cli.test.ts`'s `parserBug` child
  substitutes `./command-input.ts` and is refused by clause (S). That is a **test-file** repair, so
  the ticket's `A8` and the 2026-08-17 zero-production-lines UAT waiver are both unaffected. **This
  role wrote no line of it** — repairs are the engineer's.
- **`G-01` moves from Architect/Design to BA/PM as one bounded question**, with a stated default
  (alternative B) so nothing stalls. The structural half is closed here and does not return.
- **`ABC-044` and `ABC-045` inherit a rule, not a precedent.** Clause (S)/(C) is checkable against
  `src/cli.ts` in one read; clause 2 answers the *"but my criterion needs a fault nothing can
  produce"* case before it is asked.
- **No NFR moves and no lane cost changes.** The replacement child is one spawn, exactly as the
  current one is, so `ABC-043`'s `N8-SPAWN` pin of 17 is untouched. `NFR-008` is `ADR-0014`'s and is
  **not re-opened**; `N8-LANE` is not ruled here and nothing is claimed against it.
- **`G-06` is unaffected and is still open** — no child anywhere runs the delivered composition's real
  engine. This ADR does not close it and does not make it worse.
- **The honest cost of clause (S).** A fault below a seam can now only be evidenced by a double AT the
  seam, so the layer between the seam and the fault (`src/line-input.ts`'s own body, in `A3`'s case)
  is not exercised by that criterion. That is the price of a boundary that cannot be walked around,
  and it is paid deliberately: coverage lost to a rule is recoverable, a fence lost to a need is not.
- **Nothing about `ABC-035` is re-opened.** `G-01` concerns whether a TEST may rewrite that module's
  source; it questions nothing `ABC-035` shipped.

## Rollback

- **To un-rule it before anything depends on it:** delete this file and restore
  `memory-bank/00-index.md`'s count line to fourteen. No production code depends on it — its whole
  subject is what tests may do.
- **To reverse clause (S) later:** it would take a decision that a test may assert properties of a
  composition the production contract cannot produce. That is a larger decision than this one and
  belongs in its own ADR, superseding this file rather than amending it.
- **The asymmetry that decided the tie**, and it is `ADR-0013`'s shape reused because it fits: a
  refused instrument is fully reversible — BA/PM lifts a name, or the owner licences a widening, and
  `A3` is built the next hop. A granted one is not: once `./command-input.ts` has been rewritten in a
  child to unblock a ticket, every module below every seam is substitutable by precedent, and no later
  commit takes that back. **When one direction is reversible and the other is not, the ruling goes to
  the reversible one.**
