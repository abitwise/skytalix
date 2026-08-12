---
id: 20260812T212000Z-qe-e2e-observation-the-forbidden-formulation-rule-is-unenforceable-measured-c1b8ee47
kind: observation
by: qe-e2e
at: 2026-08-12T21:20:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# THE FORBIDDEN-FORMULATION RULE IS UNENFORCEABLE — a build can satisfy every criterion and restore the false generalisation, and I ran it

> **Hand-authored, no stamp.** The restoration below was made in an out-of-tree lane only. The
> worktree's `src/history-pane.nfr.test.ts` is `1d33bea6…`, byte-unchanged, at the start and the end
> of this hop.

**This is the ticket's central repair, so it was tested rather than admired.** The rule bans SENTENCE
SHAPES — *"freely"*, *"nothing is lost"*, *"no longer load-bearing"*, *"the class is closed"* — on the
reasoning that a rule about evidence would have caught none of the five occurrences, because the
evidence was fine every time. **That reasoning is right. The rule built on it is not enforced by
anything, and cannot be enforced in its present form by the one mechanism the ledger names for it.**

## The measurement: put the banned sentence back, then run every gate the project has

The smallest possible edit — **comment text only, both changed lines begin `//`** — restoring exactly
the generalisation `ABC-028` was cut to remove:

```
THE SHARING HERE IS STILL LOAD-BEARING           ->  THE SHARING HERE IS NO LONGER LOAD-BEARING
rebuilding these per test STILL LOSES A GUARD    ->  rebuilding these per test loses NOTHING —
                                                     the class is closed
```

```
lint       npm run lint        exit 0
typecheck  npm run typecheck   exit 0
unit       vitest run          0 failed / 752 on 26 files, skip 0
```

**Every `mandatory_gate` is green. All five criteria pass. The suite is 752/752 with skip 0. The
merged tree once again tells the next engineer that the guard is free to delete, and NOTHING IN THIS
PROJECT NOTICES.**

`A2`'s and `A5`'s comment obligations are one-time verdicts on the comment **as landed**, discharged
at `refinement-ABC-028-anchors`. They are not standing assertions and there is no test, no lint rule
and no CI (this repo has none) that reads that comment. **So the answer to *"can a build satisfy every
criterion and still restore a false generalisation?"* is YES, measured, in the exact file and the
exact sentence the ticket exists for.**

## And the enforcement the ledger names for it — grep — cannot work either

The ledger says the rule *"is checkable by grep, which is what let me find the two sites"*. It found
sites; it cannot GATE them. Census of the four banned formulations across `plans/`, `src/`,
`memory-bank/` and `.grugops/`:

```
"freely"                  45 lines      "no longer load-bearing"  16 lines
"nothing is lost"         30 lines      "the class is closed"     12 lines
                                        TOTAL                    103 lines
```

**A grep-based gate would fire 103 times on a tree whose live assertions are all correct**, because
this page's whole method is to QUOTE the banned sentence in order to strike it. On the ticket page
alone, all fifteen occurrences are quotations, strikeouts, statements of the rule itself, or explicit
negations (*"The rebuild MAY NOT be done freely"*, *"NOT that the class is closed"*) — **and one is a
different subject entirely**: *"`src/` was READ freely"*, a hop describing its own permissions. **Grep
cannot distinguish an assertion from a quotation, or even the subject of the sentence. The rule bans
assertions; the only instrument named for it counts mentions.**

## The honest positive: there is NO sixth occurrence on this tip

I looked for one rather than assuming.

- **`src/` contains ZERO occurrences of any of the four formulations** — the merged tree is clean.
- **The ticket page's fifteen occurrences are every one a quotation, a strike, the rule itself, an
  explicit negation, or a different subject.** No live assertion.
- The comment at `:103-123` says *"THE SHARING HERE IS STILL LOAD-BEARING"* with three cells
  attached, and I re-measured all three on this tip: `2 failed / 752`, `26/26` alone, `752/752`
  rebuilt. **The comment describes the tree it lives in.**

**So the gap is in the rule's ENFORCEABILITY, not a new occurrence.** The record is true today and
nothing holds it true tomorrow.

## The closure that exists, named and priced as UNPRICED rather than mandated

**The machinery to enforce a text rule already lives in this very file, ~180 lines below the
comment.** `src/history-pane.nfr.test.ts` already reads source text and asserts named rules about it —
`productionModulesIn` (`readdirSync` over `src/`) and the `LICENSED_DRIVERS` regex guard, both written
for `ADR-0011` at `:299`+ and `:381`+. **A comment-content guard would not be a new pattern here; it
would be the pattern this file already carries, pointed at the block that has now lied twice.**

*Claimed:* the mechanism exists in-file and the precedent is `ADR-0011`'s own guards. **NOT claimed:**
that it is cheap, correct, or free of lane cost — I did not build it, did not measure it, and it is
not mandated by anything. **And it is materially narrower than the problem, which I state because it
is the half that would be oversold:** it can only reach the FILE COMMENT. Of the occurrences on
record, the file comment is two or three; the rest were in `ABC-017`'s merged text, a `P1`
re-derivation on the ticket page, and an Engineer's context note — **none of which any test can
reach.** A guard would cover the site a later engineer actually reads before tidying, and less than
half of the sites the defect has actually used.

**Owner: BA/PM for the rule, and whoever next opens `src/history-pane.nfr.test.ts` for the guard — or
a ticket cut for it. This is the note that says it was on the table and was not taken.** Not this
gate's to build: the ticket is green, the ledger is BA/PM's page, and growing a green file from a
gate hop is the smoothing move wearing the opposite coat.

## What I am NOT saying

- **Not that the rule is worthless.** It is the right diagnosis and the right level of description,
  and it is the reason this hop found no sixth occurrence to report.
- **Not that it should be enforced by the suite.** That is a real decision with a real cost and it is
  not mine.
- **Not that a criterion is unmet.** `A2` and `A5` asked for a comment that says only what is true at
  the moment it was written, and it does. **The gap is that the ticket's central repair is a rule
  whose only enforcement is a reader's attention — which is precisely what failed five times.**
