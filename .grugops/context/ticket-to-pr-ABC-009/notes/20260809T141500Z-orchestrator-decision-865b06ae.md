---
id: 20260809T141500Z-orchestrator-decision-865b06ae
kind: decision
by: orchestrator
at: 2026-08-09T14:15:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-022
  - ABC-013
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/board.md
  - plans/traceability.md
  - src/moves.ts
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

# The Definition-of-Ready gate, second pass: PASS. `ABC-009` pulled `Ready → In Development`

The first pass (`20260809T103247Z-orchestrator-decision-f050eb4b`) came back AMBER on four named
defects. BA/PM corrected the ticket in place inside `Ready` and found **seven**, three of which no
pre-check had named. This note is the re-run of the gate against the corrected ticket, and the
board move it authorises.

**Result: PASS.** All ten rows of `agent-factory/checklists/definition-of-ready.md` hold. `Ready`
3/8 → 2/8, `In Development` 0/3 → 1/3. No limit approached, no override taken.

## I did not take the report's word for it

BA/PM's own hand-back carried the caveat that its post-fix counts came from its candidate fixes and
that a discrepancy should be raised rather than adjusted. Those counts are now the acceptance bar, so
they were the thing most worth re-deriving rather than accepting. I wrote my own fix — the two
preconditions as identity tests, `rookFrom` added to `CastleOption` (h1=7, a1=0, h8=119, a8=112),
patched into a copy of `main`'s `src/` under `/tmp` — **from the ticket's `## Scope` text, without
reading BA/PM's patch**, which is what makes the agreement below a cross-check and not an echo.

**All fifteen post-fix counts matched on the first run:**

```
A1  4k3/8/8/8/8/8/8/K7 w KQ - 0 1        3     castles gen/legal 0/0   changed bytes 0
A2  (same, three calls)                  3
A3  4k3/8/8/8/8/8/8/4K3 w K - 0 1        5     castles gen/legal 0/0   changed bytes 0
A4  K6R w K / R6K w Q / k6r b k / r6k b q   16 / 16 / 16 / 16          changed bytes 0
A5  K3B2R / R3N2K / K3b2R / k3b2r         19 / 17 / 13 / 19            changed bytes 0
A6  4K2B / N3K3 / 4k2b / 4K2b             12 /  7 / 12 /  5            changed bytes 0
control kiwipete                          48 moves, 2 castles STILL OFFERED, position pure
```

**All twelve `today` parentheticals and all four three-call signatures matched on unpatched `main`**
at `aad6d48`: `A4` reads 17/18/18 on both kingside rows and 17/19/19 on both queenside rows with a
phantom king written; `A5` reads 20,18,18 · 18,19,19 · 14,18,18 · 20,18,18 with the occupant
**destroyed and overwritten by a king of the moving side** — including the enemy-bishop row, which
becomes a *white* king; `A6` reads 13/8/13/6 and is **byte-identical across the call on all four
rows**, confirming that no purity criterion can ever see family 3 and only a `FLAG_CASTLE` count can.
`npm test` reads **304 passed (304)** on 14 files, matching the figure BA/PM's mutant campaign was
measured against.

Two independently written fixes agreeing on fifteen counts, and twelve pre-fix figures reproducing
exactly, is why this is a pass rather than a second amber.

Structural claims re-checked at the source rather than read off the hand-back: `git diff --stat main
-- src/` empty, `src/moves.ts` still `fb4fa40934e768dffeaeed0b43548842`, `plans/board.md` untouched by
BA/PM, `main` still at `aad6d48`, `pending/` empty, five new notes present. My own scratch copy lived
in `/tmp/abc009v` and is deleted; nothing under `src/` in this repo was touched by either role.

## What the pass rests on, and what it does not

The blocking defect is discharged: `A4` now pins the king precondition on four rows with the matching
rook present, and `A5`/`A6` pin **identity over occupancy** on both home squares with two piece types
and both occupant colours. The two conditions now fail disjoint named sets — deleting either one
fails a criterion, which was false of the ticket as it stood on 2026-07-31.

Three items are handed to the engineer **open**, and none of them blocks the pull:

1. **Seven is not proven complete, and I am not treating it as complete.** BA/PM said so first and
   the board's own history is the argument: `ABC-018` went pre-check-names-three → BA/PM-finds-five →
   QE-finds-six-mutants-past-all-twelve. `A1`–`A10` is the current best net, not a proof.
2. **The post-fix counts came from candidate fixes, not the delivered diff.** Two derivations agree,
   which is strong, but it is not the real change. A discrepancy at the implementation hop is to be
   **raised**, never silently adjusted to match the code.
3. **The fix site is not ruled on.** `addCastlingMoves` and `legalMoves` are observationally
   equivalent today because `generateMoves` has no non-test caller but `legalMoves` — BA/PM recorded
   that against its own criteria, which sit at the `legalMoves` layer. `## Scope` is the requirement.

## Corrections I made to BA/PM's framing

None to its substance — every measurement I re-derived held. One thing recorded because it is a
correction of my own first note, not of BA/PM's: my defect 2 (`toFen` blindness) was **narrowed
correctly** by BA/PM. The castle route cannot write off-board — its eight reachable squares are
on-board by construction — so the 128-byte assertion is criterion strength, not a live-defect fix.
I over-implied a live risk in the first note; BA/PM checked it and reported it downward, which is the
right direction for a claim to move under scrutiny. **Nobody should hunt for an off-board write.**

## Scheduling

Tier **Reduced** (the `Agent` tool is present; no runtime allowlist is declared by this session, so
the routing grant is held by instruction, not enforcement). Width **1** of `queue.wip_limit` 3 — the
hops are serial, so QE and Security/NFR are enqueued after the engineer rather than beside it.
`queue.claim_cap` 2 unspent. Queue empty at this decision; no stale-claim sweep owed
(`queue.stale_ttl_minutes` 30, `claimed/` empty).

Enqueued: `ticket-to-pr-ABC-009-dev` → Software Engineer, Workflow 04, branch
`grugops/ticket-to-pr-ABC-009` (the branch BA/PM's correction already sits on at `ee026af`).

The substrate ruling from the first note is unchanged and still governs: no `scripts/` in the repo or
the kit, so claims are by hand and notes are hand-written to
`agent-factory/contracts/context-note.md`; **`finding` is not admissible on this task**; nothing
self-stamped; no `index.md` / `index.jsonl` hand-faked.

## What this note does NOT establish

- **No `NFR-001` measurement.** I did not run `npm run perft`. No throughput figure here is mine; the
  6.04M–6.21M range is quoted from `plans/nfr-catalog.md`, the authority, and the engineer measures
  the ratio.
- **Nothing about the deep perft lane.** I did not run `PERFT_DEEP=1`. `A9`'s 32/32 is unverified by
  me on either tree.
- **That my scratch fix is the right fix.** It existed to falsify the numbers, not to be delivered. It
  had no test, was never in the repo, and is deleted. The engineer owes a fix built test-first, not
  this one recovered.
- **That the corrected criteria are sufficient** — see open item 1. QE's hop is where that gets
  attacked.
