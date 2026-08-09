---
id: 20260809T220312Z-software-engineer-decision-be2f2f71
kind: decision
by: software-engineer
at: 2026-08-09T22:03:12Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 20260809T213843Z-software-engineer-decision-742769bd
---

# `A11` IS NOW FULLY DISCHARGED — and two sites beyond its citation table were fixed under its binding clause, named rather than absorbed

This supersedes my `21:38:43Z` note, which reported `A11` partially discharged with site 7 blocked.
The boundary was lifted, site 7 is applied, and **all five open sites are done**. The superseded note
stays in `notes/` as the record of why the escalation was raised — it was answered, not withdrawn.

## The judgement call this hop actually had to make

`A11` has two parts and they are not the same size. The **criterion** is one sentence: *no comment or
doc comment anywhere under `src/` states, as current behaviour, anything about `generateMoves`'s
en-passant branch that this fix has made false.* The **table** of seven sites is the sweep's evidence
for it, and BA/PM wrote plainly that the set is not certified complete — *"every count on this ticket
has been a floor: 2, then 7, then 8, now 11."*

Reading `src/moves.enpassant.test.ts` line by line rather than only at the two cited ranges turned up
**two more present-tense claims the fix falsified**, both in comments, both in the one file this hop
was given:

| line (pre-hop) | the statement | measured |
| --- | --- | --- |
| 82-83, the `A1` table comment | *"**Today** every row offers the capture and `legalMoves` passes it through"* | `gen_ep=1 legal_ep=1` before the fix, **`0/0` after**, on all four rows |
| 95-97, the `A3` table comment | *"the black-to-move mirror that **creates** a phantom WHITE pawn"*, *"the self-masking witness whose corruption **is healed** later in the same pass"* | those rows: 1 ep move and 1 dirty make/unmake pair before, **0 and 0 after** |

## Why I fixed them instead of flagging them, when flagging was this ticket's precedent

The precedent that produced two extra hops was hop one flagging `src/legal.ts:69-70`. It was right
**because that line sat outside the criterion's citation AND outside the hop's file boundary.**
Neither is true here:

1. **Inside the boundary.** This hop's remit is *"`src/moves.enpassant.test.ts` comment text ONLY"*.
   Both sites are comment text in that file. Fixing them widens the diff by **four lines in the file
   I was told to edit** — it does not reach a file I was not given.
2. **Inside the criterion.** They are exactly what the binding sentence prohibits. The table does not
   list them; the criterion does.
3. **The ruling's own reasoning covers them verbatim.** Site 7 was not dropped because *"shipping it
   would leave a brand-new file making a false present-tense claim about current behaviour, which is
   the exact defect class `ABC-022` exists to remove."* Line 82-83 is that sentence's description of
   itself.
4. **The alternative was a fourth hop for one sentence in a file I had open.** Leaving them would
   force me to answer this hop's own question — *is `A11` discharged?* — with **no**, on the
   criterion's plain words, for the sake of a citation table BA/PM explicitly called a floor.

**What I did NOT do is let it pass unmarked.** Both sites are named with their measurements in the
ticket's `## Implementation`, in the traceability row, and here. A reviewer who reads `A11`'s table as
exhaustive disagrees with a judgement, not with a number, and the remedy is reverting two sentences —
which is why this was the cheap direction to be wrong in. Had they needed an executable line, or a
second file, this would have been an escalation instead.

## What is NOT claimed

That the file is now provably free of falsified statements. I read every comment line in it and
measured every candidate, but that is a **sweep of one file**, and this ticket's counts have been
floors five times running. `A11` is discharged **against its criterion as I can measure it**, not
certified complete — and one further site of the same shape, in a different file and out of `A11`'s
remit, is flagged in a separate note rather than fixed.
