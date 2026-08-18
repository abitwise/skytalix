---
id: 20260818T161000Z-ba-pm-decision-abc-079-builds-the-corpus-abc-084-extends-it-4d92ee15
kind: decision
by: ba-pm
at: 2026-08-18T16:10:00Z
verified_by: 
confidence: high
refs:
  - ABC-079
  - ABC-084
  - ABC-078
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - plans/tickets/ABC-084-tactical-puzzle-suite-strength-regression-gate.md
supersedes: 
---

**RULING: `ABC-079` builds the ≥ 20-position do-not-hang corpus. `ABC-084` extends it and does not
fork it.** Ruled by BA/PM 2026-08-18 at task `refinement-p0-chain-2026-08-18`. It is deliberately
**asymmetric**, because a symmetric rule is what was wrong.

**The defect being fixed.** Both pages carried *"whichever lands first builds it, and the second
extends rather than forks"* (`ABC-079` item 10; `ABC-084` `## Dependencies`). That rule decides
nothing while both tickets are open — it is a tie-break with no tie-breaker — and this board records
two tickets each expecting the other to build a shared thing as a failure mode it has already had.
It was never a *blocker* on building or on verifying either ticket. It was an **ownership vacuum**,
and a vacuum is filled by naming an owner, not by re-stating the race.

**What decides it: the dependency graph, not preference.** At HEAD `7ea9e1b`:

- `ABC-079`'s only dependencies are `ABC-076` and `ABC-077`. **Both merged.** It is buildable now.
- `ABC-084` needs `ABC-078` (board row: *"needs ABC-078"*), and `ABC-078` is unbuilt and still in
  `Backlog`. It is **not** buildable now.

So "whichever lands first" already has an answer and only one answer is reachable. `ABC-084`'s own
page agrees on the substance — *"`ABC-079` should land first — `A2` at ≥ 19/20 is unlikely to pass
without quiescence"* — so this ruling makes explicit what that page already leans on.

**Two supporting reasons.** (a) `ABC-079` `A1` requires the corpus to be run through **both arms in
the same test**, with and without quiescence, so it cannot defer the fixture set to a later ticket
without losing its own baseline. (b) The cost was already priced: `ABC-079`'s size rationale names
*"a curated position set as the main cost"* of its `S`, so this ruling adds no scope and the size
does not move.

**Escalation was considered and is not needed.** The question was whether to rule or escalate. It is
decidable from facts in the tree and on the board, no owner outside BA/PM's remit is implicated, and
no product value is traded away — so it is ruled here rather than routed.

**Open follow-up, non-gating, the Orchestrator's to route.** `ABC-084`'s page (`## Dependencies`,
the shared-corpus bullet) and its board row still carry the old symmetric wording, and its item-3
⚠️ still reads *"three open dependencies plus a shared corpus"*. A ruling recorded on one side only
is half a ruling and re-opens the exact vacuum this closes. **I did not edit `ABC-084`** — it was
not one of the four tickets in this task's scope and its DoR score does not change — so it needs a
one-line follow-up on a later hop.
