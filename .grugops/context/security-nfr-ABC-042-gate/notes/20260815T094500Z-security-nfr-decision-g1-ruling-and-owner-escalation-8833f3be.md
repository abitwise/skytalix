---
id: 20260815T094500Z-security-nfr-decision-g1-ruling-and-owner-escalation-8833f3be
kind: decision
by: security-nfr
at: 2026-08-15T09:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - N8-LANE
  - NFR-008
  - ADR-0008
  - ABC-025
  - plans/nfr-catalog.md
supersedes: 
---

# RULING 4 — `G1`: `N8-LANE` **NOT MET at 2.00x**, the breach is **criteria-forced and unreachable**, and **this ESCALATES TO THE PROJECT OWNER**

**Stated first, because it is the thing I am forbidden to blur.** I may rule and I may recommend. **I
may not move this bar, and I have not.** `plans/nfr-catalog.md` is untouched by this hop; so is
`ADR-0008`. The catalog says it in its own words, and I read it there rather than being told it:

> *"**Owner: BA/PM at each cut** (who writes the ticket's NFR trigger). **Checked by Security/NFR at
> each gate** against this wording rather than against a per-ticket invention. **A gate does not move
> this bar** — that rule is unchanged and it is why `ABC-025`'s gate was right to stop where it did."*

I am the "checked by" role. This is the check, and it stops where that sentence says it stops.

## The ruling, in four parts

### 1. Does `N8-LANE`'s per-ticket allocation BIND a ticket whose criteria mandate spawning? **YES.**

The bar's text is *"the tests a ticket adds may cost at most 5% of `NFR-008`'s TOTAL"*, its scope is
*"every file the branch adds under `src/`"*, and its instrument is CPU of the default lane. **There is
no spawn clause, no exemption, and no carve-out anywhere in it.** `ABC-042` adds one file under
`src/`; that file costs 1300 ms CPU net; the bar is 650 ms.

**It binds. It is breached. 2.00x. NOT MET.**

I want to be explicit about the thing I declined to do, because it is the quiet move that would have
made this go away. I could have read a spawn exemption into "the tests a ticket adds" — the children
are the operating system's cost, not test content, and there is a real argument for it (I make it
below as a *recommendation*). **Reading that exemption in at a gate would be moving the bar by
interpretation, which is exactly what "a gate does not move this bar" forbids.** An unwritten
exemption discovered by the role being measured against it is not a ruling; it is a loophole with a
justification attached.

### 2. Does `NFR-008`'s 13 s total do the real work instead? **NO — and this is where the allocation earns its keep.**

Measured this hop: **10.590 s of 13 s = 81.5%. The total is MET.** So on the total alone this ticket
sails through.

But a **total cannot tell you which ticket spent the budget**, and the allocation exists precisely to
attribute it. The attribution here:

```
lane before ABC-042 (29 files)     9.170 s      headroom 3.830 s
lane after           (30 files)   10.590 s      headroom 2.410 s
ABC-042's charge                  1.460 s gross  =  38% of all remaining headroom, in ONE ticket
```

**One ticket took 38% of what was left.** At the catalog's own arithmetic, 2.410 s buys ~3.7 more
tickets at full `N8-LANE` content, or ~6.8 more files at today's all-in cost — and `EPIC-003` alone was
decomposed into eight tickets implying 7–8 new test files. **The per-ticket bar caught exactly the
thing it was invented to catch, on the first ticket in this repository's history whose criteria mandate
child processes.** Saying "the total still holds" and moving on would be reading the headroom off the
instrument that cannot see the problem — the same error the catalog records about reading headroom off
the wall clock.

### 3. What GIVES? Four candidates, priced. **Only one can, and it is not mine.**

**(a) The criteria give — REFUSED.** The ten children are countable off the criterion text (`A1` 1,
`A4` 3, `A5` 1, `A6`(iii) 4, bar 3 1) and I verified the count against the criteria rather than the
build. What each costs and what deleting it costs:

| criterion | children | what deleting it costs |
|---|---|---|
| `A1` | 1 (220 ms) | **the entire reason the ticket exists** — *"a human types one command and sees a chess board"*. An imported-function assertion proves composition, not that a human can start it |
| `A4` e2e | 3 (300 ms) | the proof that the resolved colour reaches the board and that `random` reaches no renderer |
| `A5` e2e | 1 (90 ms) | the end-to-end half of the obligation `src/glyph-mode.ts:76-80` assigns to this epic by name |
| `A6`(iii) | 4 (370 ms) | **the end-to-end half of the `V2.2.1` repair that discharged my own HIGH block** |
| bar 3 | 1 (90 ms) | a security bar, and the only place an argv-derived byte is observed reaching a terminal |

**Three of the five are the security instrument.** Deleting criteria to fit a bar is *cutting the
instrument to make the measurement pass* — the move Architect/Design refused on this same ticket when
it declined to write an ADR widening a rule so that what ships passes. **And `A10` and bar 1 were
deleted earlier on this ticket because the defect was in the WORDING. Here the criteria are not
defective. They are expensive, and the bar is what they are spent against.** That is the difference the
routing note named, and it holds.

**(b) The file split gives — MEASURED, and it does NOT.** The ticket's own `N8-LANE` note contemplates
a split (*"if the shared file cannot hold both, split the file rather than raise the bar"*, `ABC-043`'s
row). **Splitting `src/cli.test.ts` in two changes nothing about this ticket's charge.** The bar is
per-**ticket**, scoped to *every* file the branch adds, and it is taken **net of 160 ms per added
file**. Two files means one more floor subtraction and one more floor charge — they cancel. The ten
children are unchanged; the content is unchanged. **A split moves the FLOOR ACCOUNT, not the charge.**
Its real purpose in `ABC-043`'s row is *attribution* between two tickets sharing one file, which is a
different problem from this one. **Not a lever. Priced at zero.**

**(c) The build gives — MEASURED, and it does not reach.** I rebuilt the deferred-import variant rather
than take the build hop's figure: **~990 ms net, 1.52x, still NOT MET** (and the saving is 50 ms per
rejection child, not the 75 ms the build hop estimated). My verdict on the trade is below.

**(d) The bar gives — the only candidate that can, and it is OWNER-RATIFIED.** `N8-LANE` is 5% of
`NFR-008`'s CPU clause, and that clause is **Olger Oeselg's, ratified in person 2026-08-11**.

### 4. Therefore: **ESCALATION TO THE PROJECT OWNER.** Named as such.

> **`ABC-042` cannot both conform to its criteria and meet `N8-LANE`. The criteria are not defective
> and I will not cut them. The bar is owner-ratified and I may not move it. That is a decision only
> Olger Oeselg can take, and it is escalated, not buried and not decided here.**

**What the owner is actually being asked.** Not "raise the bar". One of three:

1. **Accept the breach as an owned risk and merge** — the `ABC-025` shape. That precedent is exact in
   form: `N5` NOT MET at 1.6x, *"the gate reported the number and correctly stopped"*, the bar's author
   accepted the breach as an owned risk, no coverage was cut, `plans/nfr-catalog.md` untouched, the
   ticket merged. The one difference is who owns the acceptance: `N5` was BA/PM's own bar, and
   `N8-LANE` runs back to an owner-ratified clause.
2. **Create a SPAWN ACCOUNT, the way the FLOOR ACCOUNT already exists** — this is my recommendation,
   and it is a recommendation, not an act. The catalog already carved out one cost class on exactly
   this reasoning: *"The floor is the runner's cost, not the ticket's; charging a ticket for it makes a
   bar that two EMPTY files trip"* — owner Architect/Design. **A criteria-forced child process is the
   same species of cost: it is the operating system's price of proving a command runs, not test
   content**, and `N8-LANE` was calibrated on files that import things, never on a file that spawns —
   there had never been one. A spawn account would charge the ~1070 ms of children somewhere other than
   the ticket and leave the ~230 ms of real content at **0.35x** the bar, comfortably MET. **I did not
   create it. I have no authority to and I am not going to invent one at a gate.**
3. **Re-derive the 5%.** The catalog invites this in its own text — *"Re-derive it when the plan
   changes; the arithmetic is one line and it is meant to be re-run, not preserved"* — but it addresses
   that invitation to the cut, not to the gate, and pairs it with *"a gate does not move this bar"*.
   **So it is named here and NOT done here.** It is BA/PM's at a cut hop, under the owner's
   ratification.

**Severity: MEDIUM, and I am stating the reason so the grading is auditable.** I am not inflating it to
high to force a block — `security.block_on` is `high`, and inflating a performance breach into a
security-blocking severity to get leverage would be exactly the move I refused when I declined to
inflate `RF-3`. And I am not deflating it to low to wave it through: a stated, owner-ratified bar is
breached at 2.00x by a build that cannot be made to meet it, and it consumed 38% of the remaining lane
in one ticket. **It does not block the security gate. It does block a quiet merge**, in the sense that
the Orchestrator cannot record `ABC-042` as clean on `N8-LANE`, and the owner's answer is owed before
the merge decision is taken.

## The deferred-import trade — **the engineer was right to decline it, and I agree for a second reason it did not give**

The build hop measured a deferred-import build, found it *still misses the bar*, and declined it
because it adds top-level `await` and an argv-adjacent dynamic `import()` to the module bar 1 reads
line by line. **I rebuilt it and I agree. Three grounds, in order of weight:**

1. **It does not buy the thing it is bought for.** 1.52x on my rebuild, worse than the ~1.2x it
   expected. Paying real complexity for a still-failing number is the worst trade on the board: you
   take the cost and keep the breach, and the next reader sees a strange composition root with no
   surviving justification.
2. **It puts a dynamic `import()` into the module bar 1 reads.** Bar 1's token list is `eval`,
   `Function`, `child_process`, **dynamic `import(` of anything derived from argv**, and no shell. The
   deferred build's `import()` specifiers are static strings and are **not** argv-derived, so it does
   not literally violate bar 1 — but the delivered in-suite instrument asserts
   `not.toContain("import(")` over the whole source, so **the correct-under-the-bar build would RED the
   bar-1 row**. That is a second, independent reason it cannot be taken without also touching the
   security instrument, and *"change the security assertion so the faster build passes"* is a sentence
   that should stop a hop cold. **This is a ground the build hop did not name and it strengthens its
   own conclusion.**
3. **Coding rules 5 and 7.** Unrequested flexibility, added for a performance target it does not reach.

**Recorded as considered, rebuilt, measured and declined — by both hops, independently, and for
overlapping but not identical reasons.**

## What I did NOT do

- **I did not touch `plans/nfr-catalog.md` or `ADR-0008`.** No target, bar, level or measured figure
  moved anywhere.
- **I did not read a spawn exemption into `N8-LANE`.** I recommended one to the owner instead.
- **I did not delete, narrow or propose deleting a single criterion**, and no coverage is cut.
- **I did not touch `plans/board.md`** or the ticket page.
- **I did not grade `G1` high to force a block, or low to avoid one.**
