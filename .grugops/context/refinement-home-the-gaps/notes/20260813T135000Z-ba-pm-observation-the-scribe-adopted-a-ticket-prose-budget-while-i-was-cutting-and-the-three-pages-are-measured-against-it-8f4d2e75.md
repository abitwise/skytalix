---
id: 20260813T135000Z-ba-pm-observation-the-scribe-adopted-a-ticket-prose-budget-while-i-was-cutting-and-the-three-pages-are-measured-against-it-8f4d2e75
kind: observation
by: ba-pm
at: 2026-08-13T13:50:00Z
verified_by:
confidence: high
refs:
  - ABC-050
  - ABC-051
  - ABC-052
  - agents-md-process-rules
  - audit-delivery
  - AGENTS.md
supersedes:
---

# A ticket-prose budget was ADOPTED on `main` while I was cutting these three pages. **I did not know, and the pages comply** — measured, after the fact

> **Hand-authored, no stamp.** Found after this hop's own commit, by checking my boundary list against
> `main` rather than against my branch point. Recorded as a new note rather than by editing the
> earlier one — notes are append-only, and nothing in the earlier note is wrong.

## What landed, and when relative to me

`main` advanced from `6375fae` (my branch point) to **`e1a44d2`** — *"grug write down the two rule the
owner adopt, B then A"* — the `agents-md-process-rules` lane, running concurrently with mine.
**`AGENTS.md` gained 24 lines.** My branch is still cut from `6375fae`, so **none of it was visible to
me while I worked**, and no agent relayed it: the shared context is the only channel and I read the
folders that existed when I started.

The rule that lands on my role:

> **2. Ticket prose has a size budget; overflow goes to context notes.** … **Control: median length of
> the next ten cut tickets ≤ 300 lines (720 today) and criterion gaps at QE do not rise.** Shorter
> tickets bought with worse gaps mean the budget cut rigour instead of prose — revert it.

## The measurement — the first three tickets cut under the new rule, and they are the "next ten"

```
ABC-050   203 lines
ABC-051   207 lines
ABC-052   203 lines
                                median 203   against a budget of <= 300
                                             against a stated 720 today
```

**All three are inside the budget, and the median is 32% under it.** They were written to the method
the `refinement-cut-039-040` hop recommended after measuring its own pages at 271 and 312 and
admitting *"I did not beat the trend I am criticising, I only slowed it"*: **keep the measurement
tables, cut the rationale prose.** Every named site in all three pages carries its `file:line` so the
next hop does not re-derive what I measured; the arguments are one paragraph each.

**Convergent, not coordinated.** Two lanes reached the same conclusion from the same delivery-audit
finding without exchanging a word, which is the substrate working as designed.

## The half of the control I cannot satisfy, and I will not pretend otherwise

The rule's control has **two** clauses: median ≤ 300 lines **and criterion gaps at QE do not rise.**
**I can report the first and not the second.** These three tickets have not been built or gated, so
whether their criteria hold up is unmeasured and **`UNKNOWN - verify` until they are.** A short page
is only evidence of a shorter page.

**What I can put on the record about rigour, so the next reader can judge rather than trust the line
count:** the shortening came out of prose, not obligations. All three carry a plausible **wrong
build** that a criterion must catch (`ABC-050`'s `A2` green-suite config defect and `A5`'s armed
control; `ABC-051`'s `M2` mutant quoted verbatim; `ABC-052`'s `A2` deliberately un-repaired cell);
none carries a **literal count inside a criterion** (`ABC-024`'s `A4` lesson); and one of the three
records a DoR of **8/10 NOT MET** rather than a smoothed pass.

## And the other adopted rule touches these pages too

> **1. Criteria review happens at the `Ready for Dev` exit, not at a gate.**

All three pages sit in `Backlog` and none was promoted, so that exit is ahead of them. **The
`refinement-cut-039-040` hop's flag stands and applies here unchanged: the same role (BA/PM) is on
both sides of that check for tickets BA/PM cut, and on these three nobody but me has read the
criteria.** That is not a reason to hold them — it is a reason the `Ready for Dev` exit should be run
by someone who did not write the page, and I cannot arrange it from inside this hop. **Flagged to the
Orchestrator, for the second time by this role.**
