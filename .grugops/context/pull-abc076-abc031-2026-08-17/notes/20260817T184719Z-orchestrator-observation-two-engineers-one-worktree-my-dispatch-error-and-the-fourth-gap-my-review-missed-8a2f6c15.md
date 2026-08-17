---
id: 20260817T184719Z-orchestrator-observation-two-engineers-one-worktree-my-dispatch-error-and-the-fourth-gap-my-review-missed-8a2f6c15
kind: observation
by: orchestrator
at: 2026-08-17T18:47:19Z
verified_by:
confidence: high
refs:
  - .grugops/context/ticket-to-pr-ABC-031-2026-08-17/notes/
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/legal.ts
  - src/fen.ts
supersedes:
---

# Two engineers in one worktree — MY dispatch error — and the fourth gap MY exit review missed

Two findings, both against my own work this session. Recorded first-hand and before the second
engineer has landed, so neither is written with hindsight's advantage.

## 1. I dispatched two concurrent engineers into ONE shared worktree. That is my error.

The `Agent` tool takes `isolation: "worktree"`, which gives an agent its own git worktree. **I did not
use it.** I dispatched `ticket-to-pr-ABC-031-2026-08-17` and `ticket-to-pr-ABC-076-2026-08-17`
concurrently into the same checkout, told each "branch off `main`, do not touch the other's files",
and treated an instruction as if it were an isolation mechanism. **It is not. `git checkout` is
process-global; no instruction to an agent can make two branches current at once.**

**What actually happened**, reported by the `ABC-031` engineer and verified by me from git: the
`ABC-076` engineer checked out its branch in the shared worktree mid-hop, so the `ABC-031` engineer's
third commit landed on `grugops/ticket-to-pr-ABC-076-2026-08-17`. It repaired this itself with
`commit-tree` / `update-ref`, then `reset --mixed` the other branch back to `dba8648`. **Verified
now: `ABC-031`'s branch tip is `42ecc27` with its three commits intact; `ABC-076`'s branch is at
`dba8648`; `src/evaluate.ts` sits untracked in the shared tree — the second engineer's
work-in-progress, not lost.**

**The residual risk, named while it is still live:** my own uncommitted board / ticket / note edits
are in that shared tree, and the running engineer may sweep them into its commit with `git add -A`.
**I am deliberately taking NO git action while it runs** — `checkout`, `stash` and `commit` all move
state under a live process, and every one of them could destroy `src/evaluate.ts`. Recoverable
afterward; not recoverable if I flail now. **The correct fix for next time is
`isolation: "worktree"` on every concurrent code-writing dispatch, not a firmer instruction.**

## 2. `ABC-031` `A2`'s FEN cannot carry its criterion — and my `Ready for Dev` exit review MISSED it

The engineer found it at build time. **I verified it independently rather than taking the report**,
by running the merged generator against both FENs:

| FEN | legal moves |
|---|---|
| `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` — **the ticket's printed FEN** | **1** — `e1e2` |
| `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` — the engineer's minimal correction | **6** — `e1f1`, `e1d1`, and **four `e7e8`** |

**The printed FEN puts the kings on `e1` and `e2` — adjacent, so the position is illegal and no
promotion is legal in it.** `A2` demands `e7e8q` resolve to a queen promotion and `e7e8` return
`ambiguous` with exactly 4 candidates. **No correct implementation can produce that from the FEN as
printed.** The engineer proved the substance against the corrected FEN, pinned the printed FEN's
single legal move in a test so the repair is verifiable, and — correctly — **did not edit the ticket
or pick the repair.** Criteria are BA/PM's.

**Now the part that is about me.** My exit review two hops ago checked `A2`'s *"exactly 4 candidates"*
premise against `src/moves.ts`'s `addPromotions` and confirmed it. **It never evaluated the FEN that
premise rides on.** I verified the cited *code* and not the cited *test data*.

**That is a systematic blind spot in how I ran rule 1's exit review, not a one-off miss.** A criterion
carries three kinds of citation — code paths, measurements, and **fixtures** (FENs, inputs, expected
counts) — and I checked the first two on both tickets and the third on neither. `ABC-076`'s `A1` gap
was a *measurement* gap and I caught it; `ABC-031`'s `A2` gap is a *fixture* gap and I did not.

**The cheap repair, stated so it can be adopted or refused rather than admired:** at the
`Ready for Dev` exit, every FEN or literal input a criterion names gets executed against the merged
generator before the ticket is pulled. On this ticket that would have cost one `node -e` invocation —
the same one I have now run after the fact.

## What this means for rule 1's control, stated narrowly

This session has now produced **four** gaps at the `Ready for Dev` exit — and **the fourth was found
at BUILD time, not at the exit**, which is precisely the arm rule 1 promises to shorten. Counting it
as an exit gap would flatter the rule. **It is a MISS by the exit review and should be counted
against it, not for it.** Escalation #2 (re-specifying that control) is still open with the owner,
and this is a data point for it: **the control has no term for "gaps the exit review should have
caught and did not."**
