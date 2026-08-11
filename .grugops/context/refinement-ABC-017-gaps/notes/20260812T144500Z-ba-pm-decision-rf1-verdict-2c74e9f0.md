---
id: 20260812T144500Z-ba-pm-decision-rf1-verdict-2c74e9f0
kind: decision
by: ba-pm
at: 2026-08-12T14:45:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-gaps
  - ABC-017
  - ABC-016
  - ABC-019
  - NFR-002
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history.ts
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
  - 20260812T101000Z-qe-e2e-observation-criteria-gaps-3d81f6a4
supersedes:
---

# `RF-1` verdict: THE CRITERION MOVES — but for a defect NEITHER GATE NAMED, and the ruling SPLITS in two

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, no
> self-attested stamp.

## The question I was asked

Security/NFR was explicit that the clause **may already be right and the guard simply weaker than
it** — *"in which case this is the Engineer's alone and you say so"*. QE went further and
recommended leaving it: *"the criterion is right; I would leave it and record the choice."*

**Verdict: the criterion moves. But NOT on the axis either gate was looking at, and on the axis they
WERE looking at they are both correct and I add nothing.**

## Half one — REACH. The gates are RIGHT. This is the ENGINEER's alone.

`A11`'s in-suite guard is
`/^import\s+(?!type\b)[^;]*from\s+"\.\/history\.ts";/m` (`src/history-pane.nfr.test.ts:219-242`, read
at source here). It implements **one of five** runtime-importer forms:

| form | guard sees it? | witness |
|---|---|---|
| static **value** import | **yes** | the realistic regression, caught |
| multi-line `import { … }` block, `import * as ns` | **yes** | checked HEALTHY by both gates — recorded so nobody re-sweeps it |
| **dynamic** `import()` in value position | **NO** | `WDYNIMP` **survives 740/740** |
| **bare side-effect** `import "./history.ts";` | **NO** | `WBAREIMP` **survives 740/740** — the regex requires a `from` clause |
| `vi.mock` + `importOriginal()` | **NO** | same class |

Both survivors are **genuine runtime pulls** that void `NFR-002`'s premise; Security/NFR's
module-graph load probe catches both. **The clause was already stronger than the guard, so closing
this gap needs a better instrument, not better words. No criterion is required for it and I write
none.** That half of `RF-1` stays exactly where the gate put it: **the Software Engineer, at the
fixture hop.**

## Half two — SCOPE. The clause was MEASURABLY FALSE, and that is BA/PM's defect. `D27`.

The clause read, unqualified:

> *"after this ticket, `src/history.ts` still has **zero runtime importers**"*

**`src/history.ts` has FOUR runtime importers.** Counted independently at this hop (statement-scoped,
textual surface enumerated exhaustively first), reaching the same number as both gates:
`src/history.test.ts`, `src/status-panel.nfr.test.ts` (`ABC-016`'s, already on `main`),
`src/history-pane.test.ts`, `src/history-pane.nfr.test.ts`.

So **the criterion is breached on the delivered tree by a build everyone agrees is correct.** A
future reader checking it literally counts four and reports a violation that is not one — and this
project has spent whole hops on exactly that: a symptom surfacing where it did not originate.

**The delivered guard was the half that was right.** It is scoped to **production** modules and says
so in its own comment. The Engineer implemented what the criterion **meant**; the criterion is what
was wrong. **This clause is BA/PM's** — added at `D1`/`D2`/`D10` — so this is my defect, found by
reading my own words against a measurement two other roles made.

**Corrected to:** *"zero runtime importers **AMONG THE PRODUCTION MODULES**"*.

## Half three — DEFINITION. Also mine, and it is why half one could happen at all.

**"Runtime importer" was defined nowhere on this ticket.** Security/NFR stated its five-form rule
**before** producing its number, which is the right order and is the reason its count is trustworthy.
Without that definition on the ticket, `A11` cannot discriminate a guard implementing one form from
one implementing all five — **and a criterion that cannot discriminate its own guard is not
testable**, which is the Definition of Ready bar this role holds.

**The definition is adopted verbatim into `A11`:** a file is a runtime importer if evaluating it
causes `src/history.ts`'s module body to be evaluated — covering static value import (incl.
`import * as ns` and mixed `{ type T, value }`), bare side-effect import, re-export, dynamic
`import()` in value position, and `vi.mock` whose factory calls `importOriginal()`. **`import type`
is not one**, erased by `verbatimModuleSyntax`.

**This is what makes the Engineer's half specifiable.** Before it, "fix the guard" had no bar. After
it, any instrument that discriminates all five satisfies `A11`, and the criterion mandates no
particular instrument.

## One trap for whoever writes the replacement — read at source, and not obvious

**The file that must hold the guard is ITSELF a runtime importer of `src/history.ts`.**
`src/history-pane.nfr.test.ts:43-44` is `vi.mock("./history.ts")` + `importOriginal()`, and `:58-60`
is `await import("./history.ts")` — which this file's own spies and `A7`'s `takeBack` require.

> **So a load-closure assertion phrased as *"`history.ts` never loads in this process"* would FAIL in
> the very file that asserts it.**

The property is about the **pane's runtime closure** — exactly seven modules, `history.ts` not among
them — and not about the test process. **This is also the second, independent reason the criterion
needed the word `PRODUCTION`: without it, the correct fix looks like it contradicts the criterion.**

## What did NOT move

**No bar, target, level or `UNKNOWN - verify` marker was touched.** `NFR-002`'s `< 16 ms` target,
the 150 µs pane bar, the 3x ratio and `N8-LANE` are all untouched. **`NFR-002`'s structural premise is
INTACT and is stronger than the ticket asked for**: production runtime importers are **ZERO**,
measured by Security/NFR through module-graph closure with a positive control and an armed negative
control, rather than by the `grep` this ticket requested. `plans/nfr-catalog.md` was **not** edited.

**`A11`'s assertions do not move.** The spied call-count table — the six zero-count clauses,
`parseFen` ≤ 1, `toSan` exactly once per rendered ply and never above 16 — is **unchanged character
for character**. Only the structural clause's scope and definition changed, and **no delivered test
of `A11` changes as a result of my half**; the guard changes because of the Engineer's half.

## Severity and blocking — unchanged, and I do not raise it

`RF-1` is **`medium`** and `security.block_on` is **`high`**, so **it blocks nothing**, and the
scope defect I found does not change that: nothing is broken today, production importers are zero,
and this is regression detection rather than a violated bar. **I am not escalating it** — a criterion
that was wrong about its own scope is a documentation defect with a real consequence, not a security
finding.
