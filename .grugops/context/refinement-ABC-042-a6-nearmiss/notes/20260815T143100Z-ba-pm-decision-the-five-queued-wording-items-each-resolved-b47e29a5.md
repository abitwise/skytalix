---
id: 20260815T143100Z-ba-pm-decision-the-five-queued-wording-items-each-resolved-b47e29a5
kind: decision
by: ba-pm
at: 2026-08-15T14:31:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q4
  - G2
  - G5
  - G7
  - G8
  - A1
  - A6
  - A11
  - A12
  - N8-LANE
  - G1
supersedes: 
---

# The five queued wording items — all five RESOLVED on the page, none deferred

Batched into one pass as the subtask intended. Each was tested against this ticket's own precedent first:
**if a criterion is unsatisfiable as literally worded, it is DELETED, not re-worded** (`A10`'s two halves,
bar 1's sanitizer disjunct, and `ABC-041` before them). **That precedent fired on none of the five**, and
below I say why for each rather than leaving it to be assumed.

## `Q4` — the tautological control. RESOLVED, and it is the one with teeth

**Was:** *"each shape still contributes **250** after filtering, **asserted first**"*.
**Now:** *"each shape reaches its **250 within a budget of 500 DRAWS**, the **draws counted and asserted
first** (a count of items KEPT cannot fail under rejection sampling)"*.

**Why repaired and not deleted.** A vacuous control is not the same defect as an unsatisfiable clause:
the delete precedent covers criteria that are **false on a correct build**, and this one is *unfailable*,
not false. Deleting it would leave `A6`(ii) with **no** guard against an over-dropping filter at all — and
QE proved that failure mode is a **180 s hang**, the worst possible way for a suite to report a defect.
Repair costs one clause; deletion costs the only detector. **500 is measured, not chosen** (the correct
filter needs exactly 250 draws; `M17` exhausts 500 and reds) — numbers in my measurement note.

**This is the same species as `E1` and I ruled it the same way:** a control whose stated purpose is to
catch a failure must be able to *observe* that failure. Counting draws observes it; counting survivors of
a loop that cannot exit early does not.

## `G2` — spawn count 10 against *"single digits"*. RESOLVED: the guidance was wrong, not the build

Two independent derivations of the floor — the engineer's and QE's, each from the criteria rather than
from each other — agree at **ten** (`A1` 1, `A4` 3, `A5` 1, `A6`(iii) 4, bar 3 1), with no two mergeable
without changing what a criterion says. **When planning guidance and the criteria on the same page
disagree, the criteria win**: the criteria are the contract, the guidance was an estimate written before
them. The page now says **TEN**, names the five criteria that force it, and records that an eleventh child
is a defect (the fix hop pinned that mechanically under `Q6`).

**This bears on `G1` and I stop exactly here.** Ten spawns are ~1000 ms of the ~1300 ms `N8-LANE` reading,
so this wording repair **documents the driver of the breach**. It does not resolve it, does not move the
bar, and touches neither `plans/nfr-catalog.md` nor `ADR-0008`. `G1` remains the project owner's, escalated
and unanswered. **Nothing I changed makes the number better or worse** — the page now states the number
that was always true.

## `G5` — `npm`'s two banner lines. RESOLVED, because the loose wording invites a FALSE RED

`A1` said *"the process writes a frame of exactly N rows"*. That is **satisfied** as written — the process
does write such a frame — so the delete precedent does not fire. But the natural instrument a fresh reader
writes from it is `stdout.split("\n").length === N`, which the banner makes **red on a correct build**.
That is `RF-9`/`Q5`'s exact defect class, and this ticket has now paid for it twice.

`A1` now reads *"the process's stdout **ENDS WITH** a frame of exactly N rows … and **no frame row
precedes it** — `npm` writes a banner first, so it is a byte-exact TAIL"*. **That is the assertion the
build already wrote**, so the criterion is being brought up to the instrument, not the reverse; nothing
about the delivered build changes. The "no frame row precedes it" half is load-bearing and is why "ends
with" alone was not enough — without it, a build that prints a board and *then* the frame would pass.

## `G7` — `A12`'s *"citation line"*. RESOLVED in one phrase

The supplied citation is a five-line paragraph and the numstat is **+7/−1**, so a reviewer checking the
word "line" reads a **breach that does not exist**. The property (*nothing else changes in that file*) is
right and satisfiable, so this is a wording repair, not a deletion. `A12` now says *"plus **its citation
as Architect/Design supplied it, however many lines that is** (five, and the numstat is +7/−1)"* — the
criterion now points at the ruling instead of at a word narrower than it.

**Deliberately NOT touched:** `ADR-0011` clause 3's *"game-owning driver"* wording, the licence comparator
(`Q3`/`M15`), and `E2`/`G6`. Those are Architect/Design's and queued separately; `A12` bounds that file
and I did not widen the bound.

## `G8` — `A11` says *"recorded in this ticket"*, `A12` forbids touching the page. RESOLVED

The two are individually satisfiable and **jointly** unsatisfiable, so the delete precedent (which is about
a single criterion false on its own terms) does not fire. Three options were live:

1. **Paste the reading onto the page and add the ticket to `A12`'s file list.** **Refused** — it widens a
   diff bound that exists to keep this ticket's blast radius at six paths, to carry two lines of
   measurement, on a page already 28 lines over budget.
2. **Delete `A11`.** **Refused** — the property (startup cost is measured and bounded) is real, met, and
   cheap.
3. **Align `A11` with project rule 2.** **Adopted.** It now reads *"recorded **with its machine** in this
   task's context notes (rule 2, and `A12` bars this page)"*.

**The deciding argument is that rule 2 already ruled this**: *"measurements … go to
`.grugops/context/<task>/notes/`"*. `A11` was written before that rule was adopted and contradicted it.
The engineer's reading was correct, the measurement is already in the notes (68.8 ms / 150.3 ms medians,
Apple M3, Node v24.12.0) and **`A11` is MET** — its recording clause now names the place the reading
actually lives.
