---
id: 20260821T042000Z-software-engineer-decision-the-false-sentences-are-corrected-out-loud-and-a-third-one-was-found-7e3b1a58
kind: decision
by: software-engineer
at: 2026-08-21T04:20:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - ABC-114
  - G-QE115-2
  - N8-SPAWN
  - A6
  - ADR-0009
  - src/cli.test.ts
supersedes:
---

# `G-QE115-2` CLOSED BY SAYING WHAT HAPPENED, NOT BY QUIETLY OVERWRITING IT — AND A THIRD FALSE SENTENCE WAS FOUND IN THE SAME BLOCK'S NEIGHBOURHOOD

## The two sentences, and what replaced them

The `N8-LANE` pin's comment block carried the **superseded** `<= 0.5 s added CPU` lump clause and
the sentence **"THE CPU CLAUSE IS BREACHED AND IT IS SAID HERE RATHER THAN SHIPPED QUIETLY."** Both
were true when written and neither was true when read: the 2026-08-21 budget ruling re-derived the
clause and never reached `src/`.

They are replaced by **the clause in force** — `<= 7 added children` AND `<= 2.0 s added wall` AND
`<= 0.30 s added CPU (user+sys) PER ADDED CHILD`, with its instrument and protocol — and by **this
hop's own measured figures against it**, which are MET on all three.

**THE CORRECTION IS ANNOUNCED IN THE BLOCK RATHER THAN SMOOTHED AWAY.** The new text says that the
block carried a superseded clause and a false breach for a day, that QE found it as `G-QE115-2`, and
that **the breach does not exist**. A silent overwrite would have left the next reader no way to
know the file had ever lied, in a comment block that invokes `ABC-114`'s defect class twice about
other sentences. It also keeps the *reason* the lump form was impossible — a wall coefficient
applied to a CPU clause — because that is the part worth not repeating.

## What did NOT move, and it is the fence QE drew

**No assertion and no production line.** `expect(spawned)`, `expect(Object.keys(CHILDREN))`, the
import census and the call-site count are untouched in substance; the only executable change in that
row is the pin `17 + 6` → `17 + 7`, which is the ceiling raise the residual ruling made, not a
budget judgement of mine.

## The pin's form: the reason for it CHANGED, and the comment now says so

At `17 + 6` the derivation form was **forced** — `A6`'s `ADR-0009` clause 9a bars a literal equal to
a frame's height from this file's executable code, the frame is 23 rows and the budget was 23
children. **At 24 that collision is gone.** Keeping `17 + 7` is now a choice, and the comment says
that plainly instead of repeating a justification that has stopped applying — which would have been
the same defect class again, committed in the act of fixing it. The brief asked for the derivation
form and clause 9a as its reason; **the form is kept, and the reason is stated as it now stands.**

## A THIRD false sentence, found unprompted and corrected

The file **header** read: *"`ABC-115`'s six children need a REAL `head` on the other end of a REAL
pipe."* There are now **seven**, and the seventh needs **no pipe at all** — it needs a per-command
fd-1 redirection, because its reader never goes away; the descriptor is simply unusable. Left
standing it would have been false in exactly the way `G-QE115-2` was, in a paragraph that cites
`ABC-114` in its own first line. It is amended to state the narrower thing that is true: all seven
need a shell construct `spawnSync` cannot express, six of them a real `head`, and the seventh a
redirection.

## What I did NOT do

I did not re-open the CPU clause, the count ceiling or the exit code; I did not touch
`plans/nfr-catalog.md`, `AGENTS.md`, `ADR-0016` or `ABC-108`; and I did not restate any clause to
fit a measurement.
