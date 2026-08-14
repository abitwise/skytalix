---
id: 20260814T191400Z-orchestrator-observation-pull-gate-measured-4b1c07e9
kind: observation
by: orchestrator
at: 2026-08-14T19:14:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-055
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - src/history-pane.nfr.test.ts
supersedes: 
---

# The pull check for `ABC-042` — what I measured, and what I deliberately did NOT re-run

## The WIP arithmetic, stated so it can be checked

| column | before | after | limit | source |
|---|---|---|---|---|
| `Ready` | 1 | **0** | 8 | `wip_limits` |
| `In Development` | 0 | **1** | 3 | `wip_limits`, `== max parallel tickets` |

Scheduling width for this hop is **1** subtask against `queue.wip_limit` **3**. No limit is
approached, so **no written reason is owed** and none is invented. `claim_cap` 2 is not reached at
one delegation.

## Rule 1's `Ready for Dev` exit is NOT re-run here, and that is a decision

Four role hops ran it on 2026-08-14 — Security/NFR ×2, Architect/Design, BA/PM ×2 — and recorded
**fourteen gaps**. The tree has not moved since (`HEAD` is `5b85d31`, the hop that recorded them).
**Re-reading fourteen freshly repaired criteria against an unchanged tree is theatre**, and rule 1's
control measures gaps recorded AT the exit, not the number of times the exit is run. Running it
twice in one day would inflate that control while finding nothing.

**`ABC-041`'s precedent does not apply.** That ticket's entry review found 2 gaps in a 10/10 ticket
because its exit had **never** been run — rule 1 did not exist when it was cut. `ABC-042`'s has.

## What I DID measure — the three facts the build rests on, verified in the tree

I re-verified only the facts that **fail silently**: an engineer who builds on a stale one gets a
green suite and a wrong build. Commands and results, 2026-08-14 at `5b85d31`:

| fact | command | result | why it fails silently |
|---|---|---|---|
| `A12`'s target | `grep -n LICENSED_DRIVERS src/history-pane.nfr.test.ts` | `:213`, `readonly string[] = ["turn-loop.ts"]` — **ONE element** | if it already held two, "+1 element" would not identify the edit, and `A12`'s byte budget would be unauditable |
| `A3`'s trigger check | `find src -mindepth 2 -name '*.ts'` | **0** | `ADR-0011` clause 1's placement trigger fires on the FIRST such file. Zero today means the deferred fix is still not owed — and that **the entry point is the file that could trip it** |
| `A12`'s byte-identity clause | `ls src/*.ts \| grep -v '\.test\.ts' \| wc -l` | **18** | the criterion names a count; a drifted count makes it unfalsifiable |

**All three held.** `LICENSED_DRIVERS` at `:213` is also cited by the equality assertion at `:329`,
so the array is live, not vestigial — the red `A12` anticipates is reachable.

## What I did NOT verify, said plainly

I did **not** reproduce Architect/Design's out-of-tree measurement that the flat build reds the guard
and the `src/cli/main.ts` build greens it. That measurement is theirs, it is recorded with its method
in `.grugops/context/design-ABC-042-stderr/notes/`, and reproducing it would mean writing the entry
point — which is the Software Engineer's work, not the Orchestrator's. **I am relying on it, and this
line records that reliance rather than dressing it up as my own measurement.**

## Board hygiene, flagged not fixed

`plans/board.md` still carries the `ABC-041` archival comment from two header generations back
(`md5 349969923d…`). It is stale but it is another hop's record and removing it is not this hop's —
flagged here, not silently deleted. **`ABC-055` (no `Ready for Dev` heading) is untouched again**:
this pull moves `Ready` → `In Development` and skips a column that does not exist on the board.
Folding `ABC-055` into a pull hop would be the Orchestrator quietly cutting itself a column.
