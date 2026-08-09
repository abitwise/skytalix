---
id: 20260809T185706Z-orchestrator-decision-114ce17f
kind: decision
by: orchestrator
at: 2026-08-09T18:57:06Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-023
  - ABC-018
  - EPIC-001
  - NFR-001
  - src/moves.ts
  - plans/board.md
  - plans/traceability.md
  - memory-bank/60-progress.md
supersedes: 
---

# `ABC-009` CLOSED — merged by the owner, gates recorded both sides, UAT deferred

`Ready for UAT` 1/4 → 0/4, `Done`. Ticket frontmatter `done` / `Done`. This closes the task.

## The merge, and the one thing I did not do

I attempted the merge under the owner's standing directive of 2026-08-06 and **the host classifier denied
it**. I stopped and returned it to the owner rather than working around it — the **third** such denial in
this project's history and the **third** returned, following `ABC-015` and `ABC-018`. The owner merged and
deleted the branch.

That is the correct behaviour and it is worth stating why in one line: a delegated keystroke is not a
mandate to find another route when the host says no. The alternative — reaching for a different mechanism
because the standing directive says I *may* merge — would have converted a permission into an obligation.

**Fast-forward confirmed after the fact:** `aad6d48` → `5ee84e8`, 19 commits, **0 merge commits**, branch
gone, tree clean.

## Limit 2 of the standing directive, discharged: gates on both sides, recorded

```
BRANCH TIP  5ee84e8  2026-08-09T16:51:39Z
  install 0 · lint 0 · typecheck 0 · unit 381/381 on 16 files · build 0 · skip 0 · package-lock unchanged

ON main     5ee84e8  2026-08-09T18:54:21Z   (after the owner's merge)
  install 0 · lint 0 · typecheck 0 · unit 381/381 on 16 files · build 0 · skip 0
  PERFT_DEEP=1  32/32 exact, 40.15 s   ← the Orchestrator's FIRST and ONLY measurement of that lane
                                          on this ticket, after noting its absence four times
```

**Module integrity, the check that matters most on a ticket gated by agents:** `src/moves.ts` md5
`0e247853ab2c05887c76105ff83d8621` at the engineer's first commit (`8f540cf`) and on `main` now —
**identical across all six hops.** No gate repaired the module to make its own verdict green. QE and BA/PM
changed tests and ticket text only, and **every hop after the first added zero production lines.**

## UAT ruling

**Deferred → `EPIC-006`, explicitly NOT passed.** There is still no CLI entry point, so no surface a human
can exercise. Same ruling and same words as `ABC-011`, `ABC-015` and `ABC-018`. Recorded as deferred rather
than passed because "nobody could test it" is not "somebody accepted it."

## What the ticket actually cost, and where the cost went

The code was finished at the first hop and never changed again: **two guard conditions, `+30/−8`**, with
`rookFrom` added to the precomputed `CastleOption` table and a module cycle through `apply.ts` rejected as
the alternative. Everything after was the **net**: 33 → 371 → 381 tests, zero production lines.

Seven role hops, and **five defect classes found after the code was already correct** — each by the role
checking the previous one, never by the role that made the mistake:

1. The rook precondition alone passed all six original criteria (BA/PM, on a mutant).
2. Identity-vs-occupancy — passed all six *and* the four rows the pre-check proposed (BA/PM).
3. `G-1`/`G-2` — five mutants past all twelve criteria (QE, 62 mutants).
4. `A11`'s own-type quantifier — three mutants past the entire net (BA/PM), after **I** had declared the
   dimension closed on the queen instance alone.
5. `A11`'s enemy-colour exclusion false for two types (BA/PM), closed by `A13`.

**Every one was a gap in the criteria, never a defect in the code.** That is the finding of this ticket,
and it is the same finding the ticket opened with: `src/legal.ts` was at 100% coverage when the original
defect shipped. Coverage measured execution; nothing asserted the contract. Seven hops later the same
lesson arrived five more times in a different costume.

## My five errors

Recorded together because the pattern matters more than any one of them: the queen-instance conclusion
(declaring a dimension closed from one sample); a `plans/traceability.md` defect that **did not exist**,
whose stated cause was the opposite of the truth, and whose proposed fix would have corrupted two rows; a
`pieceTypeOf` control that did not compile, producing 147 failures I nearly read as "QE over-fit"; a
byte-space probe that returned `11` for **exactly the reason BA/PM had warned about in the hand-back I was
checking**; and an assert that read the constant declaration instead of the table row.

All five are one shape: **believing an instrument without checking the instrument.** Every one was caught
by the role I was checking, not by me. That is the strongest evidence I have that the seams did real work
here — and it is why I left the last two criteria stamps to BA/PM instead of clearing them myself, and why
QE's decision to **design the 11-vs-13 trap out** rather than remember it is the best single artifact of
this task.

## Handed forward

- **`ABC-023`** (`Backlog`, `S`, `P2`) — three measured leftovers. The sharpest: **the castle's destination
  square is pinned by nothing.** Verified by me — dropping the landing square from `kingPath` passes all 381
  tests **and** the deep 32/32 lane while offering a castle into an attacked square. It is **the only class
  across six hops whose position is legally reachable**, and the delivered code is correct on it. Its
  escalation trigger to `P1` fires the moment any ticket proposes to touch `addCastlingMoves`, the
  `CastleOption` tables or the through-check loop.
- **`ABC-022`** — half (b) still live **by design**; this ticket fenced it and closed nothing there. It is
  now the displaced `P1` rules-core defect, in `Ready` since 2026-08-04, with its own trigger unspent.
- **`ABC-018`'s frontmatter drift** — board says `Done`, its ticket still says `ready-for-uat`. BA/PM's
  trigger was *"if `ABC-009`'s close also misses the frontmatter step, it is a pattern."* **It did not
  miss it** — verified mechanically across all three `Done` tickets — so the trigger did **not** fire and
  no process item is owed. It remains a single-instance one-line defect, flagged for the fourth time and
  still not fixed, because it is another ticket's row and not this ticket's scope.
- **The lesson for `AGENTS.md`** — *print the input, not the verdict*, and prefer designing a trap out over
  remembering it. Not written there by me; it belongs to the AGENTS.md Scribe if the owner wants it durable.

## What this note does NOT establish

- **That the criteria set is complete.** It is not, and `ABC-023` is the honest record of that. Two regions
  are reserved there and one residual is measured.
- **That `NFR-001` was measured by me.** It was not, on any hop. The floor, the ratio and the count-based
  argument are the engineer's and Security/NFR's. The deep lane is the one measurement I finally made.
- **That the stopping rule was cost-free.** It stopped a sixth hardening pass, and the fifth class was found
  *because* a verification hop ran. A different rule would have found more and cost more; this one is a
  judgement, not a proof.
