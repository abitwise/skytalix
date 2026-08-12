---
id: 20260812T232500Z-ba-pm-decision-f4-my-own-rule-is-a-convention-and-the-page-now-says-so-422c4238
kind: decision
by: ba-pm
at: 2026-08-12T23:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `F4` RULED: the forbidden-formulation rule is a **CONVENTION**, it is scoped to one region, its blacklist is demoted to examples, and what replaces it is a priced precondition on the ACT — which is also unenforced and says so

> **Hand-authored, no stamp** — see the sibling note. **I wrote the rule this note demotes.** The
> Orchestrator asked me to read it as adversarially as I read `A2` two hops ago, when I removed my own
> clause for being false. That is what this is.

## The verdict, in one line

**CONVENTION. Not a control, not a guard, and the ticket now says so in the same breath it states the
rule — so no later hop can cite it as one.**

## What was struck, and it was mine

> *"THE RULE THIS LEAVES, **so the sixth occurrence has to get past a written bar rather than past a
> reader's attention**…"*

**That clause is struck.** QE restored both banned sentences in the merged comment — comment text
only — and ran everything this project has: **lint 0, typecheck 0, `752/752`, skip 0, all five criteria
MET.** There is no CI here, no lint rule reads a comment, and `A2`'s and `A5`'s comment obligations are
**one-time verdicts** discharged at the hop that took them. **A written bar that nothing reads is a
reader's attention with an extra step.**

**The diagnosis under the rule is still right and this ruling does not touch it:** *a rule about
EVIDENCE would have caught none of the five occurrences, because the evidence was fine every time.*
**What I got wrong is that I let the strength of the diagnosis transfer to the object I built from it,
and I named an instrument — *"checkable by `grep`"* — without running it.** That is `## Test notes` 14,
added at this hop, and it is the note that would have caught this.

## The instrument, run — and the number that decides it

Census of the four formulations across `plans/`, `src/`, `memory-bank/` and `.grugops/`, this tip:

```
"freely"                  49        "no longer load-bearing"  21
"nothing is lost"         32        "the class is closed"     15
                                    TOTAL                    117   (QE measured 103)
src/                       0        the ABC-028 page          15
```

**117 hits on a tree whose live assertions are all correct**, because this page's method is to QUOTE
the banned sentence in order to STRIKE it. **And the count RISES every hop: QE measured 103, I measure
117, and the difference is the notes QE and I wrote ABOUT the rule.** *An instrument whose
false-positive count grows monotonically with the number of times its own rule is discussed is not an
instrument.*

## The three changes made to the rule

1. **SCOPE cut from three regions to one.** It binds **only** the comment block in
   `src/history-pane.nfr.test.ts` — `grep -n '^// Built ONCE' …` → `:103` through
   `grep -n 'declined — as it was at' …` → `:123`. That region contains **zero** occurrences of all
   four formulations (measured), never quotes them, and is the one site with a causal path to the
   harm: it is the text a later engineer reads before tidying. **Dropped for the ticket page (where
   quotation IS the method) and for context notes (append-only prose, in a directory no check runs
   over).** Keeping a rule over a region where it cannot be checked even BY HAND is how a convention
   gets mistaken for a control.
2. **The four-string blacklist is demoted to an EXAMPLE LIST. *Name the keys it is true of* is the
   rule.** The positive, enumerating half is the load-bearing one — it is what the landed comment
   actually does — and it is robust to a defect that arrives in a new sentence.
3. **A priced precondition on the ACT replaces it at the level that matters, and is labelled NOT
   ENFORCED.** The standing obligation under `RISK-ABC028-02` now also fires on the rebuild: any hop
   that rebuilds the `:124`+ `AT_*` fixtures per test must, in the same change, **either land
   `ABC-028 A5` rows for `preservedTail` 3…15 — thirteen rows, one row of pure data each — or record
   that it is choosing not to, WITH THE COUNT.** Banning a sentence guards the warning label; this
   guards the hazard.

## Why the blacklist had to go — measured, not argued

**I hunted the sixth occurrence by SHAPE instead of by string, and found two live instances in `src/`,
in the region the census calls CLEAN, neither containing any of the four banned strings.** They are in
the sibling `observation` note. **A four-string blacklist would have caught the five occurrences of the
past in their historical shapes and catches neither instance that is live today. It is a lint of the
rearview mirror.**

## The two candidate controls — named, priced `UNKNOWN - verify`, NOT bought

| candidate | guards | why not here | cost |
|---|---|---|---|
| **(a) comment-content guard** (QE's; precedent in the same file — `productionModulesIn`, the `LICENSED_DRIVERS` regex, both `ADR-0011`'s) | the **LABEL** | a string blacklist against an unbounded defect class; catches neither live instance; **self-reference trap** — a guard that greps for *"freely"* contains *"freely"*, so it must scan a delimited region or kill itself | `UNKNOWN - verify` |
| **(b) structural guard** — assert `A11`'s `AT_*` fixtures are still module-scope | the **ACT** | no quotation problem (reads code structure, not prose), but it **freezes an accident into a contract by test**; the right closure is to OWN the rungs, not to forbid the tidy-up forever | `UNKNOWN - verify` |

**Both are `A6`-shaped work on a built, gated ticket whose five criteria are MET, and `A6` is exactly
what `RISK-ABC028-03` exists to refuse. Neither is bought. Neither is forbidden.** **Owner: the
Orchestrator** — to cut as its own ticket or to refuse **with the number attached**. This is the note
that says both were on the table and neither was taken.

## What this decision does NOT say

- **Not that the rule is worthless.** Scoped to the comment block it is a one-command check a human or
  an agent can run, and the enumerating half is the right shape.
- **Not that a criterion is unmet.** `A1`–`A5` are all MET. **The gap was in what the page CLAIMED for
  its own repair**, which is this ticket's own thesis pointed at itself.
- **Not that the comment should be edited.** This ticket writes zero bytes under `src/`, and mandating
  a comment edit on a green ticket is the smoothing move wearing the opposite coat.
