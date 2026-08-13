---
id: 20260813T123000Z-ba-pm-decision-what-writing-without-a-qe-net-actually-changed-4f1b8d27
kind: decision
by: ba-pm
at: 2026-08-13T12:30:00Z
verified_by:
confidence: medium
refs:
  - ABC-039
  - ABC-040
  - ABC-017
  - agent-factory/checklists/definition-of-ready.md
supersedes:
---

# The owner's process change lands on my role first — what it actually changed about these two tickets, and what it did not

> **Hand-authored, no stamp.** No `context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off` — **no `finding` on this hop**. `confidence: medium` because this note
> reports what I *did differently*; whether it works is not something this hop can measure.

**The instruction:** criteria review moves from the QE gate to the `Ready for Dev` exit, because the
measured rework is almost entirely **criterion** gaps on code with **zero defects** (`ABC-017`
alone: 18). Write these two as if QE will not save you.

## Four things it changed. All four are visible in the acceptance sections.

**1. Every criterion states its own instrument, not the property it hopes for.** The old failure
mode on this board is a criterion an engineer and a tester read differently and QE catches at the
gate. So `A1` on `ABC-040` is not *"the duplicates are gone"* — it is three named commands whose
outputs must be **equal**, plus a `comm -3` that must be empty. `ABC-039`'s `A5` is a
`git diff --numstat` **file list**, not "nothing else was touched."

**2. No criterion carries a number that this page owns.** This is the change I would not have made
as strongly with QE downstream. `ABC-040`'s `A1` is a **three-way equality with no literal count in
it**, precisely so it stays true after its own two rows land — and after `ABC-041` and everything
after. The counter-example was already on the board: `ABC-024`'s `A4` carries `625` **inside a
criterion** and went false when the lane grew around it. **A criterion holding a constant is a
criterion with an expiry date, and there is now nobody downstream to notice it expired.**

**3. Two criteria fail SAFE rather than fail LOUD.** `ABC-040`'s `A2` re-runs the prefix check **at
repair time** and says: *if it fails, STOP and do not delete — this page is wrong and says so.* With
QE downstream I would have written the check and let the gate catch a bad delete. Without one, a
wrong delete on a trace file is unrecoverable in the same hop, so the criterion has to carry its own
abort. Same shape in `A3`/`A4`: *re-derive the offset, do not paste 2705 from this page.*

**4. I put the arithmetic in the ticket instead of the reasoning.** `ABC-039`'s `A3` makes each
corrected ordinal **equal that move's 1-based position in a chronology table in the same file** —
checkable inside one document with no outside input and no judgement. `A4` then names the specific
wrong build: **a register that fixes only the false FIRST and not the double-booked SECOND fails
the criterion.** That is the "plausible wrong build" discipline this board already uses, applied to
a records ticket because no mutant net is coming.

## Two things it did NOT change, and I want that on the record

- **It did not make me smooth a DoR score to compensate.** `ABC-039` is **9/10, NOT MET**, with the
  ⚠️ on INVEST *valuable*: the register is **citable but not reachable**, and closing that gap would
  require editing the archived headers of four `Done` tickets, which is forbidden. The honest
  disposition is a partial fix, recorded as partial. `ABC-040` is **10/10 MET** because it genuinely
  is — the precedence question that blocked three hops is ruled on the page, with an escalation
  valve at `R5` for same-dated contradictions. **A gate moving upstream is a reason to write better
  criteria, not a reason to report better scores.**
- **It did not grow either ticket.** Both are `S`. The temptation with no downstream net is to
  over-specify; the delivery audit's headline is that **the record is this factory's waste** (142
  ticket-lines per production line against 0.46:1 at `ABC-001`–`008`). So `ABC-039` carries `A6`:
  the register must be **≤ 60 lines**, as a criterion. **A 300-line register correcting four labels
  would be the defect, not the fix.**

  **And I should hold myself to that, so here is the measurement rather than the intention:
  `ABC-039` is 271 lines and `ABC-040` is 312, against `ABC-030`'s 248 for an `XS`.** Both are `S`
  and **both are longer than the `XS` analogue — I did not beat the trend I am criticising, I only
  slowed it.** The honest split: roughly half of each page is a **measurement table** that stops the
  next hop re-deriving what I measured — the eight ordinal statements with `file:line`, the per-cell
  comparison of the four trace rows — which is the opposite of waste, it is the re-derivation tax
  paid once instead of five times. The rest is DoR and rationale, which the checklist requires.
  **Anyone trimming these should cut the rationale prose and keep the measurement tables.**

## The one risk I am naming rather than solving

Moving criteria review to `Ready for Dev` puts the same role (BA/PM) on both sides of the check for
tickets BA/PM cut. **On these two, nobody but me has read the criteria.** That is not a reason to
hold them — it is a reason the `Ready for Dev` exit should be run by someone who did not write the
page, and I cannot arrange that from inside this hop. Flagged to the Orchestrator.
