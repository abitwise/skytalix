---
id: 20260816T063500Z-ba-pm-decision-is-epic-005-pullable-before-epic-004-8b3d5e02
kind: decision
by: ba-pm
at: 2026-08-16T06:35:00Z
verified_by: 
confidence: high
refs:
  - EPIC-005
  - EPIC-004
  - EPIC-001
  - ABC-092
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-096
supersedes: 
---

# Is `EPIC-005` pullable at all before `EPIC-004` delivers a move interface?

**My subtask asked for a plain answer. Here it is, in two sentences, because it is genuinely two
answers and collapsing them into one is how a board starts lying.**

> **The WORK is pullable today — four of five tickets, and the four largest by size, need nothing
> from `EPIC-004`. The VALUE is not deliverable until `EPIC-004` lands, because there is no engine
> turn to put a book in front of.**

## Measured, per ticket

| ticket | blocked by `EPIC-004`? | what it actually needs | state of that need |
|---|---|---|---|
| `ABC-092` licence | **No** | a human decision | **available today** |
| `ABC-093` compile | **No** | `parseFen` / `toFen`, `legalMoves`, `apply`, SAN, `zobristKey` | **all on `main`** |
| `ABC-094` probe | **No** | `ABC-093`'s artifact, `legalMoves` | artifact pending; the rest on `main` |
| `ABC-095` wire | **YES, HARD** | a callable move-choice entry point a caller can bypass | **does not exist** |
| `ABC-096` name | **No** | `ABC-093`/`094` + the frame path | frame path on `main` |

`EPIC-005` § Dependencies lists two epics. **`EPIC-001` is discharged** — I verified it by reading
the tree at this hop rather than trusting the epic's `status: backlog` front matter, which is stale
for `EPIC-001` in the same way `plans/board.md`'s `W1` repair found four ticket rows stale on
2026-08-16: `src/fen.ts` (`parseFen:143`, `toFen:185`), `src/legal.ts` (`legalMoves:42`),
`src/apply.ts`, `src/san.ts` and `src/zobrist.ts` (`zobristKey:67`, returning `bigint`) are all
present. *"Book keys are positions; needs FEN/position hashing"* is satisfied.
**`EPIC-004` is not discharged and is the whole of the block, concentrated in one ticket.**

## The honest consequence for the board

**`P1` work that cannot start is better labelled than quietly queued** — my subtask's words, and I
agree. So:

- **`ABC-092`, `ABC-093`, `ABC-094`, `ABC-096` are `P1`/`P3` and startable**, in that order, with
  no reference to `EPIC-004` anywhere in their acceptance.
- **`ABC-095` is `P1` and NOT startable.** Its DoR is **7/10** and I did not round it up. Whether it
  sits in `Backlog` with a loud ⚠️ or in the `Blocked` column (visible, time-tracked) is the
  Orchestrator's call — I recommend `Backlog`, because `Blocked` in this project reads as *"started
  and stuck"* and nothing here has started.

## The thing I want on the record loudest

**A reasonable person could look at "`EPIC-005` depends on `EPIC-004`" in the epic header and
conclude the whole epic is parked. That conclusion is wrong and it is expensive.** `ABC-093` and
`ABC-094` are the two `M`s — the bulk of the epic's real engineering — and both are provable end to
end with no engine in existence. **If they are built while `EPIC-004` is in flight, `ABC-095`
becomes an `S` wiring hop on the day the move interface lands.** If they are not, this epic starts
from zero at exactly the moment the board is busiest.

**The counter-risk, stated so it is not discovered later:** building the read side first means
`ABC-095`'s seam assumptions are untested until `EPIC-004` arrives. That is why `ABC-095` `A6` is
written as *"0 lines changed in the engine's modules — or the ticket stops"*, and why its test note
1 says **check the search entry point is spy-able before estimating**. The risk is real, it is
named, and it is smaller than the risk of an idle epic.
