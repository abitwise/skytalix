---
id: 20260809T103247Z-orchestrator-decision-f050eb4b
kind: decision
by: orchestrator
at: 2026-08-09T10:32:47Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-022
  - ABC-010
  - EPIC-001
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/board.md
  - src/legal.ts
  - src/moves.ts
  - src/fen.ts
  - src/gameend.ts
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

# Routing `ABC-009`, and the Definition-of-Ready gate at the pull

Request: *"implement ABC-009"*. Classified `ticket-to-pr`, Workflow
`agent-factory/workflows/04-ticket-to-pr.md`. Mode `lean`, cadence `kanban`, autonomy `pr`.

## The gate result: AMBER — the ticket does NOT go straight to dev

Workflow 04 step 1 is the Definition-of-Ready check and it is the reason this note exists. Eight of
the ten checks in `agent-factory/checklists/definition-of-ready.md` pass. **Two fail, and one of the
two is load-bearing: the acceptance criteria as written do not require fixing the harm the ticket's
own `P1` escalation was written about.** A correct-to-acceptance implementation can therefore ship
green and leave that harm live. This is the same class of defect the `ABC-018` pre-check found on
2026-08-09, and the same route is taken: **BA/PM corrects the acceptance in place first, then the
ticket is pulled.** `ABC-009` is already in `Ready`, so the correction is an in-place edit inside
that column and moves nothing.

Nothing about the ticket's substance is disputed. The defect is real, the priority is right, the
size is right, and the reproduction is exact. What is wrong is the *net*, not the diagnosis.

## What I verified at the source, with my own tool

Every number below was produced by a throwaway script I wrote against merged `main` at `aad6d48`. I
re-derived rather than reading the ticket's numbers back, because `src/legal.ts` has been committed
to twice since the ticket was written (`988f678`, `2efe9ac`, both `ABC-011`) and a stale "today"
column would make the acceptance unfalsifiable.

**The ticket's reproduction still holds, exactly as written** — this is the half that is right:

```
4k3/8/8/8/8/8/8/K7 w KQ - 0 1    counts 5, 10, 10   after: 4k3/8/8/8/8/8/8/K3K3 w KQ - 0 1
                                 castles offered in call 1: 4->6 AND 4->2 (king is on a1)
4k3/8/8/8/8/8/8/4K3 w K - 0 1    6 moves, one FLAG_CASTLE 4->6, position pure
kiwipete                         48, 48, 48, byte-identical across all three
```

`legalMoves` itself is unchanged since `ABC-005` (`2eea5a3`) — the two `ABC-011` commits added
`hasLegalEnPassant` below it and did not touch the filter. The ticket's `gameStatus` claim also
holds: `src/gameend.ts:137` calls `legalMoves` as the first executable line of `gameStatus`
(declared line 133), so `gameStatus` inherits this defect in full.

**The escalation trigger has NOT fired**, checked rather than assumed: `ABC-010` is neither deferred
nor descoped (still in `Backlog`), `EPIC-003` is undecomposed, and the only position any epic accepts
is `src/history.ts:73` `newGame(initialFen)`, which is supplied from inside the product. The defect
stays latent and `P1` is the right rank. `Blocked` is empty.

## The four defects BA/PM must fix in place

### 1. The ticket's headline harm has no acceptance criterion (this is the blocking one)

`## Scope` bullet 3 names **two** castling preconditions — *"the king on its home square, the
matching rook on its home square"*. **Only the rook half is tested.** Criterion 3 uses
`4k3/8/8/8/8/8/8/4K3 w K - 0 1`, where the king IS home and the rook is missing. No criterion places
the king off its home square with the matching rook present.

So a fix implementing the rook-presence check ALONE passes all six criteria:

- criterion 3 → the rook is absent → zero castles → 5 moves ✅
- criteria 1 and 2 → `K7 w KQ` has no rook at all → zero castles → pure, counts stable ✅
- criteria 4, 5, 6 → perft, suite, deep lane — untouched ✅

and leaves this live, measured by me on `main` at `aad6d48`:

```
4k3/8/8/8/8/8/8/K6R w K - 0 1   17 moves, FLAG_CASTLE 4->6
                                after: 4k3/8/8/8/8/8/8/K3K2R w K - 0 1   <- phantom king e1
4k3/8/8/8/8/8/8/R6K w Q - 0 1   17 moves, FLAG_CASTLE 4->2
                                after: 4k3/8/8/8/8/8/8/R3K2K w Q - 0 1   <- phantom king e1
```

That surviving row is precisely what the `P1` escalation block at the head of the ticket describes —
*"`legalMoves` offers a `FLAG_CASTLE` move `4->6` that is not a legal chess move, and taking it back
writes a king onto a square that never held one"* — reached with the king off e1. The escalation
argues the king-home half and the acceptance tests the rook half. Needed: a criterion asserting zero
`FLAG_CASTLE` on at least one king-off-home-square-with-rook-present FEN, both colours and both
sides, so the two preconditions fail **disjoint** named sets.

### 2. Purity is asserted through `toFen`, which is structurally blind to half the board

Criteria 1 and 4 compare `toFen` output. `src/fen.ts:185` iterates `file 0..7 x rank 0..7` through
`squareAt` — **64 of the 128 bytes of the 0x88 board**. Off-board writes are invisible to it.
`ABC-022` already ruled on this exact property in this exact module (its test note 2: all 128 board
bytes and all five scalars, *not* `toFen`, citing a prior stray-write-to-square-15 defect this
project had). `ABC-009` is the older ticket and predates that lesson; it should inherit it rather
than be the one place that does not. Note this is a criterion-strength fix, not a claim that an
off-board write exists today — I did not look for one.

### 3. `## Scope` bullet 1 overlaps `ABC-022` and `## Out of scope` does not fence it

Bullet 1 reads *"the position is byte-identical on return … for every position it accepts"*, which
covers `ABC-022`'s half (b) — the en-passant route to the identical symptom. `ABC-009`'s
`## Out of scope` was written 2026-07-29, before `ABC-022` was cut 2026-08-04, so it excludes
`ABC-010` and the audit's `RF-2` but says nothing about `addPawnMoves`. `ABC-022` names the seam;
`ABC-009` does not name it back. Two `S`/`P1` tickets sit in `Ready` with one undirected boundary
between them and both are eligible to be pulled. Needed: the reciprocal out-of-scope line, so the
engineer neither under-fixes (bullet 1 unmet) nor edits `ABC-022`'s fix site.

### 4. The `NFR-001` bar contains an unmeasurable clause

*"does not regress materially against the 2026-07-29 audit baseline of 6.09M–6.21M nodes/sec"* —
"materially" is not a number, and the absolute figures are bound to one machine. `ABC-022` already
solved this on this board: report **the ratio to the same measurement on the pre-fix tree in the same
process, ≥ 0.98**. `ABC-009` should carry the same form. Two smaller things ride along: `ABC-022`
records the standing baseline as **6.04M**–6.21M against `ABC-009`'s **6.09M**–6.21M, and
`plans/nfr-catalog.md`'s standing benchmarking caution (null-control twin, own process) is not
referenced here.

## Substrate ruling (unchanged, re-checked at the source, not inherited from a note)

`ls scripts` → no such directory in the repo; `ls /Users/olgeroeselg/.grugops/agent-factory/scripts`
→ the same in the kit. So Workflow 17's `scripts/claim.js` and Workflow 16's sanctioned writer
(`scripts/context-io.ts` / `mcp__grugops__propose_note`) are both absent. Consequences, and every
role on this task inherits them:

- Claim by hand: `mkdir` of `.grugops/queue/claimed/<subtask>/` (still atomic, still `EEXIST` on a
  second writer) plus a `claim.md` registry record; `pending → claimed → done` by plain `mv`.
- Notes hand-written into `.grugops/context/ticket-to-pr-ABC-009/notes/` in the exact shape of
  `agent-factory/contracts/context-note.md`.
- **`finding` is NOT admissible on this task.** There is no §14 gate here to issue a
  `§14-gate#<id>` stamp, and `context.human_admission` is `off`, so no `human:<name>` stamp is
  available either. Record verified work as `observation` / `decision` / `artifact-ref` and soft work
  as `claim` with `confidence: UNKNOWN - verify`. **Nothing self-stamped, ever.**
- Do not hand-fake `index.md` / `index.jsonl` — the renderer that derives them does not exist here.

## Scheduling

Tier: **Reduced** — the `Agent` spawn tool is available, so this runs PARALLEL-capable at
`queue.wip_limit` 3 width, but this session declares no runtime allowlist, so the routing grant is
held by instruction and not by enforcement. Stated rather than implied.

Width used now is **1**, and not because of the cap: the hops are genuinely serial. BA/PM's
correction decides what the engineer builds against, so no dev or QE work can start beside it
without being rewritten. `queue.claim_cap` is 2, unspent.

Queue was empty at this decision — `pending/` and `claimed/` both held nothing, `In Development`
0/3, `In Review` 0/3, `Ready` 3/8. No stale-claim sweep was owed (`queue.stale_ttl_minutes` 30, no
claims to age).

Enqueued: `ticket-to-pr-ABC-009-bapm` → BA/PM, Workflow 07, in-place correction inside `Ready`, no
board move. On its completion I re-run this gate against the corrected ticket and, if it clears,
take the `Ready → In Development` exit and enqueue the engineer, QE and Security/NFR hops.

## What this note does NOT establish

- **That the four defects above are the only ones.** I checked the ten Definition-of-Ready rows and
  re-derived the reproduction; I did not audit the ticket line by line, and the `ABC-018` pre-check
  is the standing warning here — BA/PM found two defects that no pre-check had named. BA/PM is
  expected to find more, not to stop at four.
- **That defect 2 corresponds to a live off-board write.** It is a blindness in the measuring
  instrument. I did not test whether anything exploits it.
- **Anything about the fix.** The mechanism is the engineer's call; `## Scope` is the requirement.
  I did not decide where the guard goes, and `addCastlingMoves` vs `legalMoves` is not ruled on here.
- **Any `NFR-001` number.** I ran no benchmark. `npm run perft` was not executed by me, and no
  throughput figure in this note is mine — the 6.09M–6.21M and 6.04M–6.21M figures are quoted from
  the two tickets as evidence that they disagree, not as measurements.
- **That the suite is green today.** I did not run `npm test`. The engineer's gate establishes that.
