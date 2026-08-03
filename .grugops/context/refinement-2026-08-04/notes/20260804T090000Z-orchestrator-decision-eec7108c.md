---
id: 20260804T090000Z-orchestrator-decision-eec7108c
kind: decision
by: orchestrator
at: 2026-08-04T09:00:00Z
verified_by: 
confidence: high
refs:
  - refinement-2026-08-04
  - ABC-011
  - ABC-012
  - ABC-014
  - ABC-015
  - ABC-009
  - RISK-005
  - EPIC-002
  - src/moves.ts
  - plans/board.md
  - memory-bank/60-progress.md
  - ticket-to-pr-ABC-011
supersedes: 
---

# TWO ITEMS TO BA/PM before the next pull, because one of them may outrank it

## Why this task exists and why it comes before `ABC-012`

`ABC-011` merged to `main` on 2026-08-04 and the board has no work in flight. The obvious next pull
is `ABC-012` — it is P0, it has no unbuilt dependency, and `ABC-011` was deliberately sequenced ahead
of it precisely so it could be built next.

**It is not pulled yet, and the reason is a real one rather than caution.** Two items are sitting
unowned, and the first of them is a **move-generation legality defect in merged, `Done`,
perft-proven code**. Under the owner's standing legality-first directive that class outranks feature
work, so if BA/PM sizes and ranks it P0 it goes **ahead** of `ABC-012`. Fixing the pull order before
that ranking exists would be guessing, and the Orchestrator does not size or prioritise — that is
BA/PM's, and the owner's 2026-08-03 directive says so in general terms as well.

## Item 1 — `generateMoves` offers an en-passant capture onto the mover's OWN piece

**Found** at `ABC-011`'s second design hop (2026-08-03), while ruling why the shipped predicate and
the ruled oracle disagreed. **Re-verified independently twice since** — by the Software Engineer
during the fix and by QE/E2E during the second review. The reproduction FEN and the full reasoning
are in the `ticket-to-pr-ABC-011` context folder; read them there rather than from this note.

**It has been routed to BA/PM by three separate roles and cut by none, so it is currently owned by
nobody.** That is the exact shape of gap this project has now caught late three times (`ABC-009`,
`ABC-010`, `ABC-011` all came out of an audit of code that was already `Done` and 100% covered).

Two things a reader should not skip:

- **Perft cannot clear this, and its silence is not evidence.** Perft counts nodes. A generator that
  offers an extra move which the legality filter later rejects can still produce exact perft counts,
  which is why `32/32 exact at depth` did not catch it. Do not treat "perft-proven" as covering it.
- **It is entangled with `ABC-011`'s shipped guard (a), and QE corrected the Engineer on exactly
  this.** Guard (a) is **not** merely a workaround that becomes deletable once the generator is
  fixed: it is load-bearing for a second class as well, where the generator is not defective and the
  correct answer is still `false`. Whoever cuts this ticket should carry that correction rather than
  the Engineer's original framing.

## Item 2 — the `ABC-014` / `ABC-015` / `RISK-005` knot

`ABC-015` states a sequencing constraint from `RISK-005` that it merges **"with or before `ABC-014`
reaches `Done`, never after"**, while `plans/board.md` holds `ABC-015` in `Backlog` with
`blocked-until: ABC-014`. Those two read as a cycle.

**Flagged twice by the Orchestrator (2026-08-02 and 2026-08-03) and untied zero times.** It gates
`ABC-014`, which is a P0 the product's existence rests on — so it is not a documentation nit, it is
a stopped lane. The Orchestrator has declined to pull `ABC-014` twice rather than walk into it, and
declining a third time without resolving it would be the Orchestrator managing its own comfort
rather than the board.

## What is NOT being asked

- **No re-prioritisation of the whole board.** The 2026-07-31 re-sequencing comment under `Ready`
  stands; this is two items, not a sweep.
- **No decision that belongs to another role.** If the generator defect turns out to need an
  architecture ruling (the predicate-vs-oracle seam), that goes to Architect/Design under the
  owner's standing delegation, not to BA/PM by default.
- **No merge.** `main` is current; the next ticket branches from it.

## Next action

BA/PM sizes and ranks item 1, unties item 2, and states the resulting pull order. The Orchestrator
then takes the `Ready → In Development` pull against that order.
