---
id: 20260817T203500Z-ba-pm-decision-abc031-zero-call-claim-withdrawn-and-accepted-as-unwatched-7d3ea416
kind: decision
by: ba-pm
at: 2026-08-17T20:35:00Z
verified_by:
confidence: high
refs:
  - ABC-031
  - ABC-036
  - NFR-003
  - plans/tickets/ABC-031-coordinate-move-input.md
  - plans/traceability.md
  - .grugops/context/quality-gate-ABC-031-qe-2026-08-17/notes/20260817T190536Z-qe-e2e-observation-abc031-behaviour-shipped-with-no-criterion-watching-it-5cf89ed2.md
supersedes:
---

# The zero-call claim is **WITHDRAWN**, the property is `UNKNOWN - verify`, and it is **accepted as unwatched**

## What the page claimed, and what QE proved

`## Security / NFR triggers` said: *"This module's own cost bar is `A6`: with `legal` supplied it
performs **zero** additional `legalMoves` calls."* **`A6` cannot carry that.** It asserts reference
identity of the RESULT. QE's mutant **`M6`** — call `legalMoves(position)`, discard the result, then
still select from `legal` — **survived 895/895 green**. A wasted call disturbs no reference.

**`A6` proves provenance, not call count.** Those are two statements and only the first is true.

## The ruling — stated as the task required, without ambiguity

**ACCEPTED AS UNWATCHED. No follow-up ticket is cut for the zero-call property.** The property is
recorded on the page as **`UNKNOWN - verify`**, which is what `AGENTS.md` requires of an unverifiable
claim, and the false bar is deleted rather than softened.

Three reasons, in order of weight:

1. **What `M6` models is not a defect, it is a waste.** The mutant still returns the right move from
   the right array — `A6`, `A1`, `A2` and `A5` all stay green *correctly*. The cost is one extra move
   generation per line a **human types**. There is no correctness exposure and no `ADR-0004` (2b)
   exposure; the fabrication mutants (`M1`, `M2`, `M5`, `M9`) all die.
2. **The watch costs more than the thing watched.** A call count needs a spy, a spy needs `vi.mock`,
   `vi.mock` is hoisted to file scope and re-routes the module graph for every test in its file — so
   it forces a **second test file**, which `## Lane cost` refuses and prices at **160 ms CPU**
   against a 650 ms `N8-LANE` allowance. **Spending a quarter of this ticket's lane budget to watch a
   correctness-neutral micro-cost is exactly the bloat this role exists to refuse.** QE reached the
   same conclusion and declined to close it for the same reason; I am not overruling QE, I am ruling
   the routing it left open.
3. **There is already a ticket that owns the bar that would make it matter, and it already pays for
   the file.** `NFR-003` (keystroke echo < 50 ms) belongs to **`ABC-036`**, the prompt, which owns the
   keystroke and will carry its own `*.nfr.test.ts`. **If `ABC-036` ever misses 50 ms, the call-count
   probe rides in that ticket at marginal cost.** Cutting it now would be a ticket whose only
   deliverable is a file another ticket is going to add anyway.

**The falsifier, stated so this ruling is not permanent by default:** if `ABC-036` measures its input
path over budget and `legalMoves` appears in the profile, this is reopened there — not here.

## What I repaired on the page, so nothing states the withdrawn bar anywhere

The claim appeared in **three** places and all three are corrected; leaving one would have made the
withdrawal cosmetic.

1. **`## Security / NFR triggers`, `NFR-003` bullet** — the claim itself. Replaced with the
   withdrawal, the `M6` evidence, the `UNKNOWN - verify` marking and this ruling.
2. **`A6`'s parenthetical** — said *"this is a call-count guard without a spy"*. Corrected to *"a
   provenance guard, not a call-count guard"*, spelling out that a function generating its own list
   and returning from it fails, while one generating and discarding passes. **`A6`'s Given/When/Then
   is untouched — the assertion is unchanged and the criterion is not re-scoped.**
3. **`## Lane cost`** — justified one file *because `A6` makes the call count observable*. **The
   one-file decision stands; its reason did not.** Rewritten to the reason that survives: a `vi.mock`
   factory is what forces a second file and nothing here needs one.
4. **`plans/traceability.md`'s `ABC-031` row** repeated the claim in its test column. Corrected.
5. **The DoR table, row 6**, scored a bar that does not exist. Corrected in place with the reason;
   row 6 stands ✅ on `N8-LANE`, `NFR-002` and the security threshold, which are unaffected.

## The general point, kept short because it is not this ticket's

**A rationale in a parenthetical is a claim, and this page's parentheticals were never checked.**
Both defects repaired at this hop — the illegal FEN and the false call-count bar — are the same
shape: prose *about* a criterion that nobody executed. `A6` was verified as *written* and never as
*advertised*.
