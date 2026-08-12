---
id: 20260813T011500Z-qe-e2e-observation-the-convention-is-honestly-labelled-and-its-scope-covers-one-fifth-9f3ec5d7
kind: observation
by: qe-e2e
at: 2026-08-13T01:15:00Z
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
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The Orchestrator's condition on `F4`: **MET at every site where the rule is stated.** The residual risk is not that a reader mistakes the convention for a control — it is that a reader mistakes its NARROWED SCOPE for a map of where the defect lives

> **Hand-authored, no stamp.** The census below was RUN on this tip through `/usr/bin/grep`. This
> note judges TEXT; it changed none — `plans/tickets/ABC-028-*.md` was not opened for edit.

The condition was: *no later hop can cite the convention as a guard.* I read the amended page the way
a later hop would — by landing on the rule, not by reading the ticket end to end.

## The label: MET, at all three sites, and I tried to break it

A hop arriving at `RISK-ABC028-02` meets the negation **in the same breath as the rule, three times
over**, and it cannot reach the rule without passing one of them:

```
site                          what a reader gets
the front-matter amendment    "IS A CONVENTION, NOT A CONTROL, AND THE PAGE NOW SAYS SO WHERE
                               IT STATES THE RULE"
the rule statement itself     "THE RULE THIS LEAVES ~~,so the sixth occurrence has to get past a
                               written bar…~~ — and it is a CONVENTION, not a control; the struck
                               clause claimed a mechanism this rule does not have"
the F4 verdict                "CONVENTION. Not a control, not a guard, and no later hop may cite
                               it as one."
the priced precondition       "It is NOT a control: no test, no lint rule and no CI reads it…
                               Do not cite this obligation as a guard."
```

**The struck clause is struck WITH its strikethrough and its reason, not deleted** — so a hop that
finds the old sentence quoted in an older note can see what happened to it and why. **That is the
part I would have got wrong**, and it is done right.

**One word still does control work, and it is the only one: *"binds"*.** Change 1 reads *"The rule
**binds** only the comment block…"*, with line numbers. "Binds a named region" is the vocabulary of a
constraint, and it sits inside a deeper blockquote level than the *"not a control"* verdict that
governs it. **I rate this LOW and I do not recommend a rewrite:** the negation is unavoidable at the
rule statement itself, and a hop that has read far enough to reach the scope sentence has already
passed two explicit denials. **Reported so it is on the record, not to be actioned.**

**So: the answer to the condition is YES.** A reader could not honestly cite this as a control. If
one did, the page contains its own refutation in four places.

## The real residual, and it is measured rather than argued

**The convention was narrowed to `src/history-pane.nfr.test.ts:103-123` on the ground that the region
contains zero occurrences of all four formulations and is *"the one site with a causal path to the
harm."* Both halves are true. The measurement I add is what the narrowing COVERS.**

```
live instances of the shape measured in src/ on this tip     5
  ...inside the region the convention binds                  1   (nfr.test.ts:115, BA/PM's)
  ...outside it                                              4   (test.ts:1014, test.ts:493,
                                                                  zobrist.nfr:18, status-panel.nfr:11)
```

**The convention as scoped reaches one fifth of the live instances of the defect it is named for.**

**That is not an argument to widen it — I think the narrowing is right, and here is why.** A rule over
a region where it cannot be checked even by hand is how a convention gets mistaken for a control, and
that is BA/PM's own sentence. Widening it back would restore exactly the object that was demoted.

**The risk is a DIFFERENT one, and it is the one I would flag to the next hop:** the page now carries
a measured statement that `src/` contains **zero** occurrences and that the bound region is **clean**.
Both are true *of strings*. **A hop that reads "the census says `src/` is clean" and concludes the
defect is not in `src/` will be wrong by five.** The page already says the blacklist is examples-only
and that the shape is the rule — **what it does not yet carry is the number.** One sentence
(*"measured this hop: `src/` scores 0 on strings and 5 on shape"*) would close it. **Owner: BA/PM.
Severity LOW-MEDIUM. Not build work, and not a criterion gap** — `A2` and `A5` are MET.

## The census, third reading — the monotone rise is now a three-point series

Run on this tip by BA/PM's own method (the SUM of four per-string line counts across `plans/`,
`src/`, `memory-bank/` and `.grugops/`), **before this hop wrote a single note**:

```
                          QE gate 41d204c   BA/PM 1e70dc2   THIS HOP 6cd2507
"freely"                      45                49                56
"nothing is lost"             30                32                35
"no longer load-bearing"      16                21                24
"the class is closed"         12                15                18
SUM                          103               117               133
```

**Three independent hops, three rises, and this hop had written nothing about the rule when the
reading was taken.** The `+16` since BA/PM is BA/PM's six notes and the ticket's own `F4` block —
**the notes written about the rule.** The ticket page alone moved from 15 to **19** through its own
demotion. **BA/PM's sentence is not a rhetorical flourish; it is a measured trend with three points:**
*an instrument whose false-positive count grows monotonically with the number of times its own rule
is discussed is not an instrument.*

**And my own notes will push it higher, which I state rather than hide.** The reading after this hop
publishes is recorded in the artifact note.

**One methodological correction, in BA/PM's favour and worth having on the record.** The `103 / 117 /
133` series counts each string separately and therefore **double-counts a line carrying two of them**.
The UNION count — distinct lines — is **94** on this tip. **Both are honest and they are different
instruments;** the gap (133 − 94 = 39 lines carrying more than one banned formulation) is itself a
measure of how concentrated the discussion has become. **The trend is the same on either instrument
and neither is a gate.**

## What holds, re-measured rather than inherited

```
src/ occurrences of the four strings                    0     (the positive finding stands)
the bound region nfr.test.ts:103-123                    0     (the ticket's claim, measured)
the region's own line map (Test notes 13, all 6 greps)  every one re-finds EXACTLY as published
`type grep` in this shell                               "grep is a function"  <- BA/PM's caveat 1
                                                        reproduces; every value above is /usr/bin/grep
```

**`## Test notes` 13's citation table is correct on this tip, cell for cell.** That is the first time
it has been re-run by a role other than its author.

## What this note does NOT say

- **Not that a criterion is unmet.** `A1`–`A5` are all MET; nothing here is build work.
- **Not that either candidate control should be bought.** Named, priced `UNKNOWN - verify`, unbought —
  and I did not price them either. **I note only that candidate (a), a comment-content guard,
  would not have caught any of the three instances I found**, because none of them contains a banned
  string; candidate (b), the structural guard, is orthogonal to all five. **That is a measurement
  against both candidates and it strengthens the decision not to buy them.**
- **Not that the demotion should be revisited.** It is the right call, made by its own author against
  its own work, and this hop's measurements support it rather than undercut it.
