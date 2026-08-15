---
id: 20260815T233000Z-orchestrator-observation-one-defect-class-four-times-8e2f4a17
kind: observation
by: orchestrator
at: 2026-08-15T23:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-041
  - S6
  - Q13
  - Q2
  - E1
supersedes: 
---

# One defect class, four times on two tickets — named here because nobody has named it as a class

## The instances

| # | ticket | criterion | what it asserted | what it should have asserted | found by |
|---|---|---|---|---|---|
| 1 | `ABC-041` | `A6` | one spelling (`process.`) | the property, four spellings | QE, mutant `X8` |
| 2 | `ABC-042` | `A9`(2) | `/process\.argv/` | the identifier, any spelling | QE `Q2` → fixed by **counting `\bprocess\b`** |
| 3 | `ABC-042` | `A6`(i) | three near-miss derivations | the family, complete over position | fix hop's own mutants → `E1` |
| 4 | `ABC-042` | `A1` | the **list-item spelling** `- Dev / run: \`UNKNOWN - verify\`` | that the file does not claim there is no entry point | Scribe `S6`, after QE found the symptom as `Q13` |

**Four instances, two tickets, four different criteria, four different authors.** Each was found by
attack rather than by review, and each time the fix was local to that criterion.

## Why it is one class and not four coincidences

Every instance has the same shape: **a criterion names a PROPERTY in prose, and its instrument
asserts one SPELLING of that property.** The instrument is green. The property is unguarded. Nothing
in the gate can tell the difference, because the gate runs the instrument.

`S6` is the sharpest illustration and the reason I am writing this down. `A1` required
`AGENTS.md`'s `Dev / run` line to stop saying `UNKNOWN - verify`. It asserted
`not.toContain("- Dev / run: \`UNKNOWN - verify\`")` — the list-item spelling. **`AGENTS.md` then
spent a day contradicting itself in prose, two sections down, containing neither token adjacently,
and `A1` was GREEN the entire time.** The criterion was satisfied. The property was not.

## What has actually worked, measured across the four

- **Instance 2's repair generalises: count the IDENTIFIER, not the spellings.** QE later proved it
  incomplete in one direction (`MP8` reads argv once and branches after the resolver — the count is
  blind to it) and that the exact-shape row covers exactly that gap. **Two complementary instruments
  beat one clever one.**
- **Instance 3's repair generalises differently: fix the DIMENSION.** BA/PM found the enumeration had
  not missed a transformation but *half the string*, and refused the instance-2 move here because it
  would bind a criterion to a local variable name. **The right answer twice running was not the same
  answer**, which is why this is not a template.
- **What found all four was mutation, not reading.** No review pass, DoR score or gate caught any of
  them. Every one died to somebody building the thing that should red and watching whether it did.

## What I am NOT doing about it

**I am not spawning a Factory Coach and I am not writing a process rule.** `mode` is `lean`, the
Coach's trigger is enterprise/sprint-end/on-demand, and "on-demand" is the owner's call, not mine.
Turning a four-instance pattern into a standing rule on my own authority would be exactly the
over-reach this ticket has repeatedly caught in others — and `AGENTS.md`'s process rules already
carry two owner-adopted rules whose controls are being measured, one of which (`B2`) is currently
failing in a way nobody can honestly fix.

**This note is the record.** If the owner wants it acted on, the shape of the ask is: *does this
project want a criterion-authoring rule that says an instrument must assert the property, and if the
property cannot be asserted, the criterion must say which spellings it covers and which it does
not?* Three of the four repairs already did the second half voluntarily.

**Owner: Factory Coach, on-demand — the project owner's call.**

## One thing that is mine and is not in the table
All four were found *inside* the factory, by roles attacking their own or each other's work, before
anything merged. **That is the system working, not failing.** The cost was six hops; the alternative
was four unguarded properties shipping green.
