---
id: 20260812T000000Z-orchestrator-decision-b6d29e15
kind: decision
by: orchestrator
at: 2026-08-12T00:00:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-019
  - ABC-027
supersedes:
---

# `ABC-019` → `In Review` and HELD; `ABC-017` pulled — the last unbuilt ticket in the chain

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtasks that reference it.

## Verified, not accepted

| claim | how | result |
|---|---|---|
| `A10b` is one check and a throw | read `src/turn-loop.ts:282-285` | **confirmed** — `wasGenerated(...)` guard, `throw`, nothing else |
| no new file | `git diff --name-status -- src/` for adds | **none** — `N8-LANE` unmoved |
| gates | re-ran after rebasing onto `main` | lint/typecheck/build **0**, **723/723 on 24 files**, skip **0** |
| `ABC-017` DoR | re-read the latest table against the checklist | **all ten ✅**, `S` (2), `P2`, front matter agrees, not `XL` |

## `ABC-019` is HELD in `In Review`, and the hold is the decision

26 of 27 criteria met. **`A20` is expected-red and deferred** — it cannot be satisfied until
`ABC-027` merges, because clause 1's production change lives in `src/frame.ts`.

The Engineer handled that better than I specified: it wrote **no failing test and no skipped test**,
recording the reason as a comment where row 18 will sit. A skipped test would have breached the
zero-skip gate; a failing one would have breached the blocking gate. **The criterion is simply unmet
and deferred, which is the honest third option and the one I did not name in the brief.**

**I am running no further hop on `ABC-019` until its upstream merges.** It owes `ADR-0009` cl. 9f's
real-panel re-gate after rebasing onto merged `ABC-016`, `ABC-027` and `ABC-017`. Running Security/NFR
now would measure a build that is about to change, and this project has already recorded the cost of
a gate that runs before the thing it measures has settled. **`ABC-019` waits.**

## `ABC-017` pulled — and why now rather than later

`Ready for Dev` → `In Development`. It is **the only unbuilt ticket left in the merge chain**
(`ABC-016` → `ABC-027` → `ABC-017` → `ABC-019`), so it is the longest remaining pole and everything
downstream of it is idle while it waits.

**The concurrency is safe and it was measured, not assumed.** `ABC-017` owns `src/frame.test.ts`'s
composition fit-check (`ADR-0009` cl. 5) and `ABC-027` also edits that file — but BA/PM measured that
**no line is claimed by both**: `ABC-017`'s `A13` touches `:38-45`, `:288`, `:633`; `ABC-027` touches
the screen model, `:374`, `:376`, `:419`, `:735-771`. `ABC-027` merges first, so `ABC-017` rebases
onto it, and the rebase should be clean by construction.

DoR was re-run against the checklist rather than taken from the row: all ten hold after BA/PM's
`ADR-0010` amendment, which struck the widest-panel/SET-`W` claim in **three** places while keeping
the constant-width assertion character for character.

## Eleven wrong builds, and eight of them were QE's

The `ABC-019` Engineer wrote **eleven** wrong builds and killed all eleven — **eight are QE's own
surviving mutants** (`Q2`, `Q3`, `Q4`, `Q4b`, `Q5`, `Q5b`, `Q8`, `Q11`), now dead. `Q7` stopped being
a mutant because it *is* the delivered build.

That is the cleanest possible closure of a QE hop: the survivors were not argued away, they were
killed and named.

## Declined, with a reason recorded

The Engineer **declined a defensive `takeBack` on the input-guard path**: the seam returns normally,
so the position is intact (asserted byte-identical), and repair there would have been scope beyond
the guard. **The sizing tripwire did not fire** — `A10b` cost exactly the one membership check and
throw BA/PM measured, so no `SPLIT_REQUIRED` re-derivation was owed.

## Board

`ABC-019`: `In Development` → `In Review` (held). `ABC-017`: `Ready for Dev` → `In Development`.
In Development **1/3**, In Review **2/3**, In Security/NFR **1/2**, Ready for Dev **0/6**.

## Carried, still undispatched

The two Architect/Design documentation items — `ADR-0009` cl. 9b + evidence (vii), and `ADR-0010`'s
`## Consequences`, now confirmed defective by **three** roles. Still documentation accuracy on
accepted ADRs whose **rulings are unaffected**; still no free slot that would not displace work on
the critical path. Also open: `A17`'s out-of-tree timing half, `UNKNOWN - verify`, and a duplicate
`## Test notes` bullet at `ABC-019` lines 1530/1535 that needs BA/PM's mandate.
