---
id: 20260815T222226Z-agents-md-scribe-observation-four-gaps-found-at-the-scribe-hop-223095f2
kind: observation
by: agents-md-scribe
at: 2026-08-15T22:22:26Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - src/cli-options.ts
  - src/cli.test.ts
  - AGENTS.md
  - .grugops/context/pull-abc065-066-2026-08-16/notes/
supersedes: 
---

# Four gaps found at the Scribe hop — one of them will red the guard block if nobody reads this

Numbered from `G4` so they do not collide with `G1`–`G3` in the Orchestrator's `Ready for Dev` exit
note (`parent_ref:`). None of them blocked this hop; none was repaired here, because none is the
Scribe's pen.

## `G4` — `A3`'s token collector now sees FOUR `--`-prefixed tokens, not three (severity: MEDIUM, owner: the Software Engineer writing the `ABC-065` guard, routed via the Orchestrator)

**This is the one that bites.** `A3` reads: *"when its `--`-prefixed tokens are collected, then that
set **equals** the `--`-prefixed elements of `ACCEPTED_ARGUMENTS`, both ways — 3 of 3."*

Measured on the slot as it now stands (`grep -o -- '--[a-z]*' | sort -u` over the span from
`- Dev / run:` to its `-->`):

```
--
--ascii
--colour
--unicode
```

**Four.** The fourth is the **bare separator itself** — and it is there because `A1` put it there.
`A1` and `A3` are in tension on a literal reading: satisfying `A1` introduces a `--`-prefixed token
that is not an element of `ACCEPTED_ARGUMENTS`, so a guard that collects tokens naively fails set
equality **on correct documentation**.

The repair is the guard author's and it is small — collect `--` followed by at least one letter
(`/--[a-z]+/`), or filter the bare `--` out explicitly and say in a comment why. **It must not be
repaired by removing the separator from the slot**, which would un-fix the ticket. Flagged, not
fixed: I do not write the test, and I will not pre-empt the criterion's reading.

## `G5` — one working tree, one git index, two concurrent hops (severity: MEDIUM, owner: Orchestrator)

`ABC-066`'s Software Engineer is running in parallel and handled the checkout collision correctly —
it created a **linked worktree** (`git worktree list` shows `…/scratchpad/wt-ABC-066` on
`grugops/ticket-to-pr-ABC-066`), so neither branch's `HEAD` moves under the other and `src/` is
genuinely untouched here. Good practice, recorded so it is reused.

**But the queue claim is taken in the SHARED tree by design** — the queue is the live coordination
substrate — so both hops' `pending/`→`claimed/` renames are staged in **one shared git index**.
`git status --porcelain` in this tree showed `ticket-to-pr-ABC-066`'s rename staged alongside mine.
A bare `git commit` or a `git commit -a` from either hop would have swallowed the other's staged
rename into the wrong branch. **I avoided it by committing with explicit pathspecs only**; nothing
prevents the next hop from not knowing. The schedule assumed disjoint file sets and the *index* is
not disjoint. Worth a line in the enqueue template.

## `G6` — `A6` cannot be scored as written on a two-hop ticket (severity: MEDIUM, owner: BA/PM for the wording, Orchestrator for the ruling)

`A6` requires `git diff --name-only <commit>~1 <commit>` to show **exactly** `AGENTS.md` and
`src/cli.test.ts` — **two paths**. My delivered commit carries **seven**: `AGENTS.md`, the queue
transition (3 paths: the `pending/` deletion, the moved subtask file, `claim.md`) and three context
notes. Every one of the six non-`AGENTS.md` paths is process substrate under `.grugops/` that
Workflows 16 and 17 **require** be committed, and `ABC-065` was deliberately split across two hops
and therefore two commits — so no single commit can ever show that two-path diff.

What `A6` is actually protecting is intact and I state it as measured: **zero paths under `src/`,
zero production lines, zero new child processes from this hop.** The criterion needs to say
"excluding `.grugops/` process substrate, and evaluated across the ticket's commits" or the gate
scores a false RED against a compliant hop.

## `G7` — the subtask front matter's `base:` was stale on arrival (severity: LOW, owner: Orchestrator)

`.grugops/queue/claimed/ticket-to-pr-ABC-065-scribe/ticket-to-pr-ABC-065-scribe.md` front matter says
`base: main @ 3fb6ebd`. `main` was at **`4e9ed1d`** when this hop started — the board move committed
after the file was written. Branching from `3fb6ebd` would have left this hop's own subtask file out
of its tree. I based on `4e9ed1d` and recorded the divergence in `claim.md`; `ABC-066`'s hop hit the
identical staleness and made the identical call, independently. Two hops correcting the same field by
hand is the signal: the enqueue step should stamp `base:` at enqueue time or omit it and say "current
`main` tip".

## Confirmed still open, not re-reported

`G1` (the ticket's § Dependencies still says `AGENTS.md` *"IS CLAIMED RIGHT NOW BY ANOTHER HOP"*,
contradicting its own DoR row 10) is **unrepaired and I did not touch it** — ticket prose is BA/PM's.
It is now doubly wrong: the file it names as claimed is the one I just edited under a different
claim. `G2`'s conflict risk did not materialise, for the worktree reason in `G5`. `G3` is untouched by
this hop.
