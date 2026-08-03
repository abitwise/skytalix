---
id: 20260803T180000Z-orchestrator-observation-917fbd39
kind: observation
by: orchestrator
at: 2026-08-03T18:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - ABC-012
  - ABC-010
  - ABC-014
  - ABC-015
  - ADR-0005
  - ADR-0006
  - plans/board.md
  - memory-bank/60-progress.md
  - 20260803T113000Z-orchestrator-decision-913e6028
supersedes: 
---

# ABC-011 second pass closed: the MEDIUM defect is fixed and re-gated. The merge is the owner's.

## State at close, verified by this role rather than accepted

Working tree **clean**. Suite re-run here: **214 passing / 9 files / 0 skipped**; `npm run lint`,
`npm run typecheck`, `npm run build` all **exit 0**. `Ready` 4/8 · every column from `In Design`
through `In Security/NFR` **empty** · `Ready for UAT` 1/4. Board headings agree with their rows and
the ticket front matter agrees with the board. **No WIP limit was approached at any point across
either pass and no override was taken.** Width never exceeded **1** against `queue.wip_limit: 3`.

Nine subtasks over two passes, each claimed by hand, each publishing its own notes; **nothing was
relayed between them.**

## What the second pass actually cost, and what it bought

The owner declined the accepted risk this ticket carried, sending a gates-passed ticket backward
from `Ready for UAT`. That decision is vindicated by what the second pass found — **every stage
found something the first pass had not, on code the first pass had already passed three gates:**

- **The design hop** found a **fourth** reproduction nobody had
  (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1`) and proved the fix is **two guards, not one**: the guard
  Security/NFR had sketched in one line was neither sufficient nor the one that fixes the
  corruption. It also found two divergences where the predicate is already byte-pure.
- **The engineer** caught **its own benchmark protocol** reading 1.26x on a delta that is
  structurally zero, and discarded it rather than shipping the number.
- **QE** rebuilt the mutant set (49, not the first pass's 22) and found **two more real survivors**
  green against all 206 tests: a relaxed guard (b) that permanently **rewrites a black knight into a
  black pawn**, and a relaxed guard (a) answering `true` where the ruling specifies `false`.

The lesson is not "the first gates were sloppy" — they named this defect in the open and sized it.
It is that **a defect's neighbourhood is only explored once someone commits to fixing it.**

## The interrupted gate — recorded because it is the useful part

The second Security/NFR run was cut off mid-flight (the machine slept). It left the board asserting
a **PASS with detailed figures and zero published notes**, no `claim.md`, the queue task stranded in
`claimed/`, nothing committed, and `src/zobrist.nfr.test.ts` half-edited. The Orchestrator refused
it on the standing rule — **no published notes, no advance** — and sent the column back to either
back the verdict or reverse it.

It upheld the verdict **and corrected it**: it reverted the stranded prose rather than patching it
("editing its numbers into place would have produced a record that read as mine and wasn't"),
reproduced the sub-bar to the node, and **could not reproduce several of the interrupted run's
figures** — startpos, kiwipete, worst-case ratio, an adversarial input count off by 2.5x, and a "2.5x
Proxy deoptimisation" that in fact **throws outright** un-shimmed. Its own numbers are now the
record. It also found the interrupted run's `claim.md` had asserted a queue transition that had not
happened.

**Had that unbacked PASS been accepted, the ticket would have merged on figures nobody could
reproduce.** The rule that caught it costs one sentence.

## Rulings that outlive this ticket

- **`ADR-0005` `accepted` with an amendment** — one of its own statements was false as written — and
  **`ADR-0006` written and `accepted`**: castling is **not** the en-passant case, so `zobristKey`
  keeps hashing castling **rights**. Both carry per-clause falsifier tables. First two ADRs ratified
  under the owner's 2026-08-03 delegation.
- **Two open items retired**, not reworded: QE's first-pass residuals Z1/Z4 are killed by
  `src/zobrist.nfr.test.ts`, verified by running them.
- **QE's two cost-shaped mutants: declined and owned.** Pinning a cost no instrument here can
  resolve is pinning noise — the honest *opposite* of the ABC-020 precedent, which pins stated bars.

## Open items with owners — none blocking the merge

1. **`generateMoves` offers a capture onto the mover's own piece.** Found at the design hop,
   re-verified twice since. **Routed to BA/PM by three roles and owned by nobody until they act** —
   the exact shape of gap this project keeps catching late. Note that guard (a) is *not* merely a
   workaround for it: QE corrected the engineer on this, and guard (a) stays load-bearing for a
   second class even if the generator is fixed.
2. **The `ABC-014` / `ABC-015` / `RISK-005` knot** — `ABC-015` must merge "with or before `ABC-014`
   reaches `Done`" while the board holds it *behind* `ABC-014`. Reads as a cycle; gates a P0.
   **Owner: BA/PM.**
3. **`ABC-010`** still owns the FEN semantic gap; `ABC-009` still carried.

## UAT

**Deferred to EPIC-006, recorded as deferred and not passed** — unchanged posture and unchanged
reason: rules-core-only work with no surface a human can exercise.

## Next action

**A human merges `grugops/ticket-to-pr-ABC-011`, or does not.** `autonomy=pr`; an agent supplies the
keystroke only on explicit instruction and that is never standing. After it lands, **`ABC-012` is
the next pull** — the ticket this one was sequenced ahead of, now able to be built against a key
that means what FIDE means.
