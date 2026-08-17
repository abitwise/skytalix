---
id: 20260817T143212Z-ba-pm-decision-the-three-counting-rules-i-adopted-before-counting-anything-4a1c9e70
kind: decision
by: ba-pm
at: 2026-08-17T14:32:12Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - plans/metrics.md
  - .grugops/queue/pending/rule1-control-measurement.md
supersedes:
---

# The three counting rules, stated BEFORE the count, because rule 1's control names three terms and defines none of them

`AGENTS.md` § "Process rules (this project)" rule 1 states its control as:

> *"gaps found at QE fall below 3 per ticket for five consecutive tickets and backward moves below
> 0.5 per ticket, while gaps recorded at the `Ready for Dev` exit RISE."*

Three terms, **none of which carries a counting rule anywhere in this repository**. I searched:
`AGENTS.md`, `.grugops/context/audit-delivery/notes/` (which rule 1 names as where its control
lives), `plans/metrics.md`, `plans/board.md` and the eight exit-review notes. Only one of the three
has a written definition anywhere, and it is not in rule 1's own paragraph.

**A control whose terms are undefined is not a control until someone defines them, and whoever
defines them chooses the answer.** So the definitions are published here, separately from and ahead
of the numbers, and every count in the sibling `observation` note obeys them.

---

## Definition E — "gaps recorded at the `Ready for Dev` exit"

**An item that the ticket's rule-1 exit-review note itself enumerates as a gap, counted in the unit
the note enumerates it in.** Where the note states a total, the note's total is used.

**And here is the problem that makes E the weakest of the three: the unit is not stable across the
record, and the instability is large.**

- `ABC-061`'s note numbers `G-A`…`G-F` and calls that **six**. `G-A` is *"EVERY `src/cli.test.ts`
  line number on the page has drifted"* and tabulates **five** drifted anchors. So one gap = one
  **class**.
- `ABC-063`/`ABC-064`'s note reports *"**9 stale line anchors + 1 unresolvable anchor**, across two
  tickets"*. Under `ABC-061`'s convention that is **one class per ticket**. Under its own it is nine.

Same author, same week, same defect, **a 5:1 difference in the number depending on which note you
read.** I therefore report series 1 **twice**, under both readings, and neither is "the" answer:

- **E-class** — one gap per distinct defect class the note raises.
- **E-item** — one gap per distinct defect instance the note names.

**`ABC-042` cannot be put on either scale honestly.** Its exit produced *"14 gaps"* summed across
**four role hops** (Security/NFR, Architect/Design, BA/PM, Orchestrator) — a different denominator
from every other ticket, all of which count one Orchestrator reading pass. It is reported with both
figures and a flag, not silently normalised.

**Rejected alternative: count only gaps that changed a criterion.** It gives a clean, stable unit
(`ABC-062` re-cut, everything else 0) and it is wrong for this control, because rule 1's exit is
explicitly *"record the gaps found there"*, not *"repair them"* — five of the eight reviews state
that no criterion was edited and that this is correct.

## Definition Q — "gaps found at QE"

**An item enumerated by the `qe-e2e` role, in that ticket's `quality-gate-*` notes, at the quality
gate.** The role's own notes are titled *"gaps found at QE for `<ticket>`"* and number them
`Q1`, `Q2`, … — so unlike E, this unit **is** written down and is stable, and I adopt it verbatim.

**The decisive clause, and it is the whole finding: where no `qe-e2e` hop ran, Q is `UNKNOWN -
verify`. It is NOT zero.** The brief forbids inventing a number to fill a slot, and "no measurement
was taken" recorded as 0 is the most expensive fabrication available here — it is the one that makes
this control read as PASSED.

**Rejected alternative: substitute the Orchestrator's own gate note for a missing QE hop.** It is
tempting, it would fill five empty cells, and it is not the same measurement. The QE hops that exist
built **13, 20, 12 and 18 mutants** respectively and counted survivors; the Orchestrator gate notes
on `ABC-061`–`ABC-064` reproduce the **criteria's own** named witnesses (2, 1, 4 and 3 conditions)
and confirm the build. Those are different instruments pointed at different things. Splicing them
into one series would manufacture a trend out of a change of method.

## Definition B — "backward moves"

**This one I did not have to invent, and I deliberately did not.** `plans/metrics.md`'s `Rework
rate` row already defines it and already carries a measured pre-rule-1 baseline:

> *"tickets bounced back a column (e.g. Review -> Development)"* — measured 2026-08-12,
> *"de-duplicated by ticket and date (a shared hop header is archived into several files, so a raw
> string count over-counts)"*.

I adopt that definition and that de-duplication rule unchanged, so the post-rule-1 number is
comparable to the pre-rule-1 number that already exists. Using my own definition here would have
discarded the only baseline this project owns.

**B's known blind spot, stated now rather than discovered in the number:** it counts *column
transitions*, so rework that is routed as a repair subtask **while the ticket stays in its column**
is invisible to it. That is not hypothetical on this record; see the sibling `observation` note,
series 3.

---

## What I refused to define

**"Consecutive tickets."** Rule 1 says *"five consecutive tickets"* and this project merges tickets
out of numeric order, in overlapping pairs (`ABC-065`/`ABC-066` share one exit review and one hop;
`ABC-063`/`ABC-064` likewise), and re-gates the same ticket days later. Consecutive by **merge
date**, by **exit-review date** and by **ticket number** give three different windows over the same
nine tickets. I ordered every series by **exit-review date** and said so on each table, but I am not
recording that as *the* definition — it is a choice I made to be able to draw a line at all, and a
different honest reader would draw a different one.
