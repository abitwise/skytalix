---
type: decision
task: slot-guard-anchor-2026-08-16
author: Orchestrator
date: 2026-08-16
subject: ABC-067 + ABC-071 — the one-hop-or-fold question both tickets escalated
---

# Ruling: ONE HOP, TWO TICKETS, ONE ENGINEER. Not folded, not parallel.

## What was asked of me

Both pages escalate the **identical** decision, in near-identical words, and both explicitly refuse
to decide it themselves:

- `ABC-067` § Dependencies: *"Recommendation: build the two in ONE hop, or fold them before either is
  pulled — built separately, the second hop rewrites the first hop's function. **The Orchestrator
  decides; do not widen this ticket's scope on your own authority, and do not assume the sibling
  ticket's id — I could not read it.**"*
- `ABC-071` § Dependencies: *"**`ABC-067`'s recommendation is reproduced here as this ticket's own:
  build the two in ONE hop, or fold them before either is pulled.** ... **The Orchestrator decides;
  neither ticket widens its scope on its own authority.**"*

The two tickets were cut **concurrently by two different hops**, each from one end of the same
defect, and neither could read the other's id. They converged on the same recommendation
independently. That convergence is evidence, not duplication.

## The collision is real and I measured it rather than trusting the pages

`src/cli.test.ts` lines **899–906**, `devRunSlot()`, read from the branch tip:

```
899    const agents = readFileSync(`${REPOSITORY}AGENTS.md`, "utf8");
900    const start = agents.indexOf("- Dev / run:");     <- Q7  / ABC-071: no START anchor
901    const end = agents.indexOf(COMMENT_CLOSE, start); <- Q8  / ABC-067: no END bound
902    // A GUARD MUST NEVER PASS BY BEING UNABLE TO LOOK: ...
904    if (start < 0 || end < 0)
906    return agents.slice(start, end + COMMENT_CLOSE.length);
```

Both repairs land in these lines. `ABC-067`'s `A3` additionally targets the comment at `:902-903`
and `ABC-071`'s `A4` may add a sentence in the same block. **The claim "the same six lines" is
CONFIRMED, not relayed.**

## Why ONE HOP and not FOLD

Folding was genuinely available — both pages offer it — and I declined it, for reasons that are
about evidence, not tidiness:

1. **The two defects have separately measured mutants with opposite verdicts.** `ABC-067` carries
   `A1`'s one-closer-removed case (GREEN 32/32 today) and `A4`'s two-closer case; `ABC-071` carries
   `N3a` (GREEN, duplicate appended after) and `N3b` (RED, same content placed before). A fold
   collapses four measured mutants into one page and the *asymmetry* argument — `ABC-071`'s whole
   point, that the same content passes or fails on ordering — stops being separately scorable.
2. **`ABC-071` carries a DECISION, `ABC-067` carries a BOUND.** `ABC-071` § Scope: *"Decide the
   uniqueness question and write the decision into a criterion of THIS ticket ... **A decision, not a
   tidy.**"* That decision (must the slot label occur exactly once?) is a new obligation on a new
   page precisely because `ABC-065`'s merged `A1` says *"the slot"*, singular, and does **not**
   require uniqueness. Folding re-homes that obligation and loses the reason it was given its own
   page.
3. **Folding costs a BA/PM hop and buys nothing the one-hop route does not.** The only thing the
   fold prevents is the second hop rewriting the first — and one hop prevents that outright.

## Why ONE ENGINEER and not two in parallel

This is the failure mode both tickets predicted and it is the one I would have walked into by
scheduling to width. **Two agents in one worktree editing `devRunSlot()` is the collision, not the
mitigation.** Width here is 1 by the work's shape, not by the WIP cap (`queue.wip_limit` 3, `In
Development` 3 — neither binds). I am deliberately scheduling BELOW my cap.

`ABC-067` test note 1 makes this structural, not merely prudent: it requires the locator be **split
from the reader** — a pure function over a string, driven by in-memory fixtures — so neither ticket's
mutants have to mutate the repository's own `AGENTS.md` on disk. **That refactor is shared.** Two
agents would each perform it, against each other.

## The OTHER dependency both pages named is now DISCHARGED, and I checked rather than assumed

Both tickets' § Dependencies name `ABC-065`'s **pending** UAT as the second sequencing question:
*"building it before that UAT changes the UAT's subject underneath the UAT Planner."* Both pages were
written while `ABC-065` sat in `Ready for UAT`.

**`ABC-065` is now accepted and `Done`** — the owner accepted it in session on 2026-08-16 and the
board's current header records it. **There is no UAT left to undercut.** This was the live half of
both tickets' item-10 ⚠️ and it is discharged by events, not by argument.

I also verified the tree has not moved underneath the pages: `git log 5cf86d3..HEAD -- src/cli.test.ts
AGENTS.md` returns exactly one commit, `a8edb11`, which is the **docs** commit recording that
acceptance. No code changed. `ABC-067`'s `A5` baseline (slot 9 lines / 800 bytes) and its warning to
re-read `ABC-065`'s `A2` fence still stand against the current tree — and `A2`'s stale `:193-204`
range was already repaired on `ABC-065`'s page at `ABC-066`'s merge, so the trap `ABC-067` § 
Dependencies warns about has already been sprung and cleared by someone else.

## What this ruling does NOT do

- It does **not** merge the two tickets. Both keep their own page, their own criteria and their own
  row. **One commit may satisfy both; it must say which criterion it satisfied on which page** —
  `ABC-071` test note 5 requires exactly this.
- It does **not** widen either ticket's scope. Every fence on both pages binds unchanged — above all
  the one both share: **`AGENTS.md` is NOT edited.** *"The defect is in the reader, not the read."*
- It does **not** authorise the drive-by. `ABC-068`, `ABC-069` and `ABC-070` touch adjacent things in
  the same block and the same slot. They are **not** in this hop.
- It does **not** pre-authorise Security/NFR. `ABC-067` deliberately carries no fail-safe "run it
  anyway" sentence, stating that scheduling is mine. I read that as written: both pages answer
  `ABC-041`'s four clauses at **0 production lines, 0 new files, 0 new spawns**, so Security/NFR is
  **not** triggered and I am not running it. If the delivered diff touches anything outside
  `src/cli.test.ts`, that judgement is void and the ticket comes back to me.

## Board effect

`Backlog → In Development` for both. `In Development` 0/3 → **2/3**. Both DoR ⚠️s were item 10
sequencing only; one is discharged by `ABC-065`'s acceptance and the other is discharged by this
ruling. **Neither page was re-scored — re-scoring another role's DoR is not mine.** What changed is
that the questions item 10 flagged now have answers.
