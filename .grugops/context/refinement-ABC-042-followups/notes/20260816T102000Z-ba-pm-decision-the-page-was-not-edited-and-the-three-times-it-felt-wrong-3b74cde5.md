---
id: 20260816T102000Z-ba-pm-decision-the-page-was-not-edited-and-the-three-times-it-felt-wrong-3b74cde5
kind: decision
by: ba-pm
at: 2026-08-16T10:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-058
  - ABC-059
  - ABC-060
  - A1
  - A8
  - A12
  - Q5
  - Q8
  - Q12
  - S4
  - B2
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
supersedes: 
---

# `ABC-042`'s page: **zero lines changed** — and the three moments that argued for changing it

**Measured before starting and again at the end: the page is 328 lines** against rule 2's 300-line
budget — **28 over, `B2`, unchanged by this hop.** `git status` shows it untouched on this branch.

The rule is not hard to obey once; it is hard to obey **three times in a row when each individual
edit looks like an improvement**. Recording the three, because a future hop will meet them again and
the reasoning is the whole value.

## 1. `Q5` — bar 1b's regexes do not say which text they apply to (page `:247-253`)

**The temptation.** One clause — *"applied to the file's executable code, comments stripped"* — makes
a correct bar readable. Security/NFR called it *"a clarification of an already-decided rule"* that
**never blocked anything**. It is five words on a page that already carries the rule.

**Why not.** A clarification and a decision are indistinguishable **to a reader of the diff after the
fact**. Both gates ran against `:247-253` as written; adding words there means the gate that read the
bar read a bar that no longer exists, and this ticket spent six hops establishing that a moving page
makes a gate meaningless. **And the page is 28 lines over budget: the honest way to describe adding a
clause is "making a measured overflow worse in the same breath as failing to close it".**

**Where it went instead.** `ABC-058`'s criteria `A4` and its `## How the wording is repaired without
touching a gated page`, plus the instrument's comment at the site — which is where a reviewer runs
the regexes.

## 2. `S4` — bar 3's spawn clause exercises one of the three classes it forbids (page `:254-263`)

**The temptation.** This one is sharper than `Q5` because the bar is **wrong, not merely unclear**:
it names C0, `U+007F` and ESC, and specifies a probe token carrying only ESC. `M3h` ships **29/29
green while `U+007F` reaches the terminal**. Fixing the clause is one phrase.

**Why not.** Same reason, and one more: `S4` is **Security/NFR's own bar**, and Security/NFR chose to
record it as a finding with an owner rather than edit its own bar at the re-check. Me editing another
role's bar on a gated page, after that role deliberately did not, would be the third time on this
ticket that a non-owner re-words a criterion — the previous two were both refused and both refusals
were right.

**Where it went instead.** `ABC-058` `A5`/`A6`, with the mutant that proves the clause cannot fire
and the compensating control (`A8`'s number transcription) fenced as out of scope.

## 3. `Q12` — `A12` does not say WHICH diff (page `:190-200`)

**The temptation.** The Orchestrator ruled it, recorded the exact command, and wrote *"the wording
genuinely would be better if it said WHICH diff — that is a BA/PM item"*. I am BA/PM. The item is
mine. The edit is one clause.

**Why not.** `A12` is **MET on the ruled reading** and the ruling is recorded. Editing the criterion
now would change the text a passing gate was run against, in exchange for zero change in verdict.
**The value of the repair is entirely in the future**, and the future is where four sibling tickets
copy the clause.

**Where it went instead.** `ABC-060`, which repairs the **four copies in `Backlog` tickets** — where
the wording still has effect and where no gate has run.

## The general form, stated once so it is not re-derived a ninth time

**After a gate passes, a criterion's wording stops being editable and starts being historical.** The
repair does not disappear; it moves to (a) the next ticket's criteria, (b) the instrument's comment at
the site, and (c) the copies of the wording that have not been gated yet. **All three were used this
hop.**

**Nothing was found that cannot wait.** I looked for the case that would have forced me to stop and
say so — a residual that is a live defect on the delivered build, or one whose repair `ABC-042` must
carry to be correct. There is none: all four bars are MET at `d011df4`, all three of Security/NFR's
instrument findings are LOW with the delivered build correct on each, and the two `MEDIUM`-graded
items (`G1`, `Q3`) are the owner's and Architect/Design's respectively, both already routed.
