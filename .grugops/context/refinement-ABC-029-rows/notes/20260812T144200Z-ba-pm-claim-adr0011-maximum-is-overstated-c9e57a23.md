---
id: 20260812T144200Z-ba-pm-claim-adr0011-maximum-is-overstated-c9e57a23
kind: claim
by: ba-pm
at: 2026-08-12T14:42:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-029
  - ADR-0011
  - D27
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/perft-bench.ts
  - src/gameend.ts
  - src/perft.ts
  - src/zobrist.ts
supersedes:
---

# `ADR-0011`'s *"the MAXIMUM a textual guard may recover"* is overstated, and it is overstated in the SAME SHAPE as the word *"non-static"* this amendment exists to correct

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the only honest kind.** **I did not
> construct this and I did not run it.** `src/` was not opened at this hop — the brief forbade it — and
> BA/PM does not write instruments. **It is a counterexample to a SENTENCE, offered as one.** No
> `finding` is written at this hop: no `§14-gate` verdict record exists under this task and
> `human_admission` is **`off`**.

## The sentence

`ADR-0011`'s containment section rules: *"So 6 of 12 is not a compromise; it is the **maximum a textual
guard may recover without breaking an accepted criterion**."* Architect/Design's `observation` at
`design-ABC-029-loss-record` says of it: *"That is a ruling, and it is in the ADR."*

## Why the argument supports something narrower

The binding reason given is that a pattern reaching the dynamic literal turns **`WPERFT-DYN` RED**
while `A3` requires it to pass. **That holds for any expression that treats every scanned file
ALIKE** — which the delivered and the ruled expressions both do. **It does not hold for an expression
that keys on a textual, filename-free property of the scanned file, and `ADR-0011` clause 4 supplies
exactly one:**

> **an ENTRY POINT is a production module that exports nothing** — and *"`src/perft-bench.ts` is the
> only production module with ZERO exports (the other 16 have 1 to 23)"*, measured by Architect/Design
> at the ruling hop.

**A rule of the shape *"a dynamic `import("./history.ts")` counts as a runtime importer only in a
module that exports something"* would keep `WPERFT-DYN` GREEN** — `perft-bench.ts` exports nothing —
**while turning `WOFFFRAME-DYN` and `WQUERY-OFFFRAME` RED in `gameend.ts`, `perft.ts` and
`zobrist.ts`, which all export.** That is **the remaining six recovered without breaking `A3`**, with
no filename, using the ADR's own clause 4.

**The shape is the one this amendment exists to correct.** *"Non-static"* described the class the
delivered regex **happened to match** rather than the class it **named**. *"The maximum a textual guard
may recover"* describes the ceiling for the class of guard **that was considered**, and states it as
the ceiling for **all** textual guards. Same circularity, one section apart, in the same file.

## What this does NOT change — checked before it was written down

- **The RULING stands and is not reopened.** Alternative 9 **as the ADR states it** — *"widen the regex
  to the DYNAMIC literal spellings too"* — is **correctly rejected**: a plain dynamic widening does red
  `WPERFT-DYN`.
- **The ADR's SECOND ground survives intact and is the stronger one.** A dynamic rule catches only the
  literal spelling and is evaded by a computed specifier (`import(someVar)`) — **which the two static
  forms cannot be, because `export … from` and a bare `import` require a literal specifier by ESM
  syntax.** So *"it buys false confidence"* genuinely discriminates the dynamic case; *"it is the
  maximum"* does not. **The conclusion is right; one of its two reasons is not.**
- **No criterion row changes.** `A6.2` is written as a required VERDICT (`WPERFT-DYN` green), which the
  counterexample also satisfies. **Had it been written as the ADR's universal — *no pattern may reach
  the dynamic form* — it would have forbidden a build that breaks nothing.** That is the practical
  consequence of the overstatement and it is the reason this note exists rather than being swallowed.
- **Nothing in `ABC-029`'s scope moves and the Engineer's hop is unchanged**: the ruled expression is
  what is built.

## Owner, trigger, and why this was FLAGGED and not a STOP

**Owner: Architect/Design.** The ADR is `accepted` and was **not opened for edit**.
**Trigger: the next edit to `ADR-0011` for any reason, OR the first hop that cites *"the maximum"* as a
reason not to look further — whichever is first.**

The brief instructs this role to **say so and stop** if the row writing implies the ADR is still wrong.
**The rows are writable, correct and unchanged by this**, and what is overstated is a **rationale
sentence in the Consequences/containment section** — not clause 1, 2, 3 or 4, not the adoption of the
containment, and **not a single verdict in the kill ledger**. Stopping would hold a `P0`'s dependency
on a one-sentence amendment that changes no verdict, no row and no line of the Engineer's hop.
**I flagged it in the ticket and here, did not stop, and am naming the call so the Orchestrator can
overrule it rather than discover it.**

**If Architect/Design takes this up, the cheap repair is one clause**: bound the sentence to *"any
expression that treats every scanned file alike"*, and let the second ground — false confidence
against a computed specifier — carry the ruling, which it does on its own.
