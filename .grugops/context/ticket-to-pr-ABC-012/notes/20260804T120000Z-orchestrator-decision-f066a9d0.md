---
id: 20260804T120000Z-orchestrator-decision-f066a9d0
kind: decision
by: orchestrator
at: 2026-08-04T12:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-011
  - ABC-014
  - ABC-009
  - ABC-022
  - ADR-0002
  - ADR-0004
  - EPIC-002
  - src/history.ts
  - src/zobrist.ts
  - src/gameend.ts
  - plans/board.md
  - refinement-2026-08-04
  - epic-to-tickets-EPIC-002
supersedes: 
---

# ABC-012 pulled `Ready` → `In Development`, and the one thing on the ticket that went stale

## The merge that came first

`grugops/refinement-2026-08-04` was merged to `main` on explicit human instruction from the project
owner — fast-forward `10b119c` → `39e260d`, one commit, no merge commit, the branch being linear and
nothing having diverged. Gates were run BEFORE the merge on the branch tip and AGAIN AFTER it on
`main`: **214/214 passed, 9 files, skip count 0** (captured with the `AGENTS.md` skip-count command
rather than eyeballed), `npm run lint` / `npm run typecheck` / `npm run build` all **exit 0**.
`git branch --no-merged main` is empty.

That merge was BA/PM's refinement output and contains **no production code** — sixteen files, all
under `plans/`, `memory-bank/` and `.grugops/`. That is why identical gate figures on both sides of
it are the expected result and not a suspicious one.

**The merge was performed by an agent on explicit human instruction and is NOT standing
authorization** — the same rule recorded for `ABC-001/002/003/008`, the `ABC-004..007` stack,
`ABC-020` and `ABC-011`. The next merge needs its own instruction. **The branch was not deleted** —
that is the owner's call and has never been standing either.

## Why `ABC-012` and why now

BA/PM's 2026-08-04 refinement fixed the pull order to **`ABC-012` → `ABC-014` → `ABC-009` →
`ABC-022` → `ABC-013`**, and the two questions that were holding the order open are both answered
in that work rather than by this pull:

- `ABC-022` (the `generateMoves` en-passant precondition defect) was **cut and ranked `P1`, not
  `P0`**, so the owner's standing legality-first directive does **not** put it ahead of `ABC-012`.
  BA/PM ruled that on this board's own `P0` test — the directive applies but the fault is not
  reachable (0 of 518,474 reachable nodes carry an occupied en-passant target; invalid-FEN only).
  That ranking is BA/PM's to make and this role does not re-open it.
- The `ABC-015` / `ABC-014` / `RISK-005` knot was untied, which makes `ABC-014` pullable — but
  `ABC-012` still precedes it on priority and on dependency, so nothing about the untying changes
  this pull.

`ABC-012` is `P0`, has **no unbuilt dependency at all**, and is the ticket `ABC-011` was deliberately
sequenced ahead of. `ABC-011` merged to `main` on 2026-08-04, so the sequencing constraint the two
tickets state about each other is now **satisfied rather than pending**: the key fix landed first,
which is the whole point of the ordering.

## Definition of Ready — re-checked AT the pull, against merged `main`

Re-checked here rather than assumed from the 2026-07-30 promotion, per the `ABC-020` and `ABC-011`
precedent. Every premise below was checked against the merged tree, not read off the ticket:

- **Problem** ✅ — and its central claim is still TRUE on `main`: `gameStatus`'s `positionCounts` is
  optional (`src/gameend.ts:135`, `positionCounts?: ReadonlyMap<bigint, number>`) and **has no
  supplier anywhere in `src/`**; `src/history.ts` does not exist.
- **Scope / out-of-scope** ✅ — six functions named, a seventh explicitly refused, eight
  out-of-scope items each with a reason.
- **INVEST** ✅ — independent: every dependency (`parseFen`/`toFen`, `makeMove`, `gameStatus`,
  `zobristKey`) is merged on `main`.
- **Acceptance measurable** ✅ — nine criteria: byte-identical FEN strings, exact array length
  `N + 1`, an exact count of `3` (not 2), an exact prefix property, a no-throw clamp, and numeric µs
  bars. Not one "works" or "looks right".
- **Dependencies** ✅ — none blocking. The `ABC-011` sequencing dependency is **discharged**, not
  merely named.
- **NFR triggers** ✅ — five numeric bars, each with its ply count and its machine class, and the
  ticket says `UNKNOWN - verify` on any other hardware. **No security trigger**, stated with its
  reason (no sink, no trust boundary, no user-supplied string).
- **Test notes** ✅ — six tests mapping 1:1 onto the acceptance criteria, plus three named traps.
- **Size `M`** ✅ (3) — not XL, so no `SPLIT_REQUIRED`.
- **Priority `P0`** ✅.
- **No blocker** ✅ — `ADR-0002` is ratified on all four clauses and `ADR-0004` is ratified; neither
  is `proposed`, so the `ABC-013`-in-`Blocked` situation does not repeat here.

**The pull is clean rather than conditional.** Unlike `ABC-020` and `ABC-011`, this ticket has no
`### Open design question`: its two seams were closed by Architect/Design at decomposition (SEAM 1,
the exact API — note `20260730T143500Z-architect-design-decision-d7a42f7a`; SEAM 2, no memoization —
note `20260730T143800Z-architect-design-decision-38b772b6`, both in the `epic-to-tickets-EPIC-002`
context folder), and the ticket says in its own `## Source` that it implements those decisions and
does not re-open them.

**Therefore NO design hop is owed and none was taken.** `In Design` stays 0/2. Both prior occupants
of that column were pulled there for a written reason quoted from the ticket itself; this ticket
carries no such line, and inventing a design hop for a ticket whose design is already recorded would
be waste, not caution.

## The one thing on the ticket that is now STALE, named rather than left for the Engineer to trip on

`ABC-012`'s `## Test notes` trap 1 says test 1 **must** use a repeated line that never sets an
en-passant square, because `src/zobrist.ts:71` hashes the ep file whenever `epSquare` is set — so a
repeated line containing a double push would hash two FIDE-identical positions differently. It adds
that this makes the test **"blind to `ABC-011`"**.

**That rationale describes the pre-`ABC-011` tree and no longer holds.** Verified on merged `main`:
`src/zobrist.ts:85` now reads `if (position.epSquare !== NO_SQUARE && hasLegalEnPassant(position))`,
so the ep file is hashed only when a **legal** en-passant capture exists. A repeated line containing
a double push with no available capture now hashes **equal**.

Three consequences, stated precisely so nobody over-reads this:

1. **This is NOT a blocker and NOT a ticket change.** Following the instruction as written is still
   correct, still safe, and still cheap — `src/gameend.test.ts:27-58` already holds the knight cycle
   the ticket says to reuse. What changed is the *reason*, not the *instruction*.
2. **The "blind to `ABC-011`" sentence is stale** and should not be carried forward into this
   ticket's own notes or trace rows as if it were current.
3. **Whether to ADD a double-push repetition test is deliberately NOT ordered here.** It is not in
   this ticket's acceptance criteria, and rules 5 and 9 in `AGENTS.md` say an engineer does not add
   unrequested work. It is named as an observation for the QE gate, which owns adversarial coverage
   and may take it or decline it on its own reasoning.

The Orchestrator does not edit ticket text — that is BA/PM's — so `ABC-012` is being handed over
unamended, with this note as the correction of record.

## Scheduling

**One ticket, not several.** `In Development` goes 0/3 → 1/3 against a limit of 3. `ABC-014` is
pullable for the first time and `ABC-009`/`ABC-022` are unblocked, but `ABC-019` (the turn loop)
blocks on `ABC-012` and this is a new module four epics rest on — a second concurrent ticket buys
throughput this project has no way to spend and costs review attention it does. **No WIP limit is
approached, no override is taken, and no written reason is owed.**

Width for this task is effectively 1 regardless: `ticket-to-pr` is a chain (engineer → QE →
Security/NFR), each stage reading what the last one published. `queue.wip_limit` is 3 and
`queue.claim_cap` is 2; neither is reached.

**Substrate degradation, recorded not glossed:** this install still has no `scripts/claim.js` and no
`scripts/context-io.ts`. Workflow 17 step 2's atomic `claimTask` cannot be executed and Workflow
16's sanctioned writer does not exist, so queue files move by hand and notes are hand-written in the
schema's exact shape. **`finding` is not admissible here — no §14 gate exists to issue a stamp, and
no role may self-stamp.** This note is a `decision`, which needs none.

## What is NOT authorized by this pull

- **No merge.** `autonomy=pr` holds. The `main` merge above was one instruction and is spent.
- **No deploy.** `production_requires_human_confirmation: true`, and no environment exists yet.
- **No re-prioritisation.** BA/PM's pull order stands; this pull takes its first item and nothing
  else.
- **`ABC-009`, `ABC-010` and `ABC-022` are carried, not fixed**, exactly as `ABC-011` carried them.

## Next action

The Software Engineer implements `ABC-012` on `grugops/ticket-to-pr-ABC-012` and owns the
`In Development → In Review` exit. QE/E2E then owns the `In Review` exit; Security/NFR gates the
five numeric NFR bars after it, the ticket having NFR triggers and no security trigger.
