---
id: 20260809T192651Z-orchestrator-decision-1b276013
kind: decision
by: orchestrator
at: 2026-08-09T19:26:51Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-023
  - ABC-009
  - ABC-010
  - ABC-013
  - EPIC-001
  - NFR-001
  - src/moves.ts
  - src/legal.ts
  - plans/board.md
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `ABC-022` selected over `ABC-023`; Definition of Ready comes back **AMBER**; BA/PM corrects in place before any pull

This note opens task `ticket-to-pr-ABC-022`. **No board move is taken by it.** `ABC-022` stays in
`Ready` (2/8) and the correction hop that follows takes no board move either.

## What was selected, and against what

The owner offered three: the `ABC-018` frontmatter fix, `ABC-022`, `ABC-023`.

**The `ABC-018` frontmatter fix is not a competitor and was not treated as one.** It is board state,
the Orchestrator owns it, it costs no WIP and it consumed no queue slot — done inline in `cb6515f`
before this decision, together with `ABC-012`'s identical drift. Its trigger had fired: the last
`ABC-009` hop deferred it by name to "`ABC-009`'s close", and `ABC-009` closed in `e644039`.

**`ABC-022` over `ABC-023`, on priority first and dependency second.**

- `ABC-022` is `P1`, already in `Ready`, `S`, `EPIC-001`, no blocking dependency. `ABC-023` is `P2`
  and in `Backlog`, so it needs BA/PM's `Backlog → Ready` exit before it is even pullable.
  `priority_scheme` is `P0-P3`; `P1` outranks `P2` and nothing here overturns that.
- `ABC-022` has been displaced twice on this board and the displacement is recorded under `Ready`.
  It is the oldest un-started `P1`.

## The engineering dependency the two tickets do NOT state, and it runs the other way

`ABC-023` `## Dependencies` says it is *"independent of ... `ABC-022` — different modules or
different branches, and either order works."* **That is wrong as written, and the direction matters.**

`ABC-023`'s `A4` pins `src/moves.ts` at md5 `0e247853ab2c05887c76105ff83d8621` as an acceptance
criterion, and its `A1`/`A2`/`A5` mutation results and every *(Measured today: …)* parenthetical are
stated against that exact tree. `ABC-022`'s fix lands in `addPawnMoves` **in `src/moves.ts`**, so
`ABC-022` merging **invalidates `A4`'s literal hash** and puts every `ABC-023` measurement on a tree
that no longer exists.

Verified rather than assumed: `src/moves.ts` on `main` hashes `0e247853ab2c05887c76105ff83d8621`
right now, so `ABC-023`'s pin is valid **today** and stops being valid the moment `ABC-022` lands.

Consequences, both taken:

1. **They are not run in parallel**, even though `In Development` has room (0/3) and
   `queue.wip_limit` is 3. Concurrency here would have `ABC-023` running a mutation campaign against
   a tree `ABC-022` is actively rewriting. Serialised on purpose, not on caution.
2. **`ABC-023` is promoted AFTER `ABC-022` merges**, so BA/PM re-derives the hash and the affected
   parentheticals **once** rather than twice. Promoting it now would bank a number with a known
   expiry date.

This is a cost of the chosen order and it is named as one, not hidden: taking the `P1` first means
`ABC-023`'s evidence must be re-pinned. The cost is one hash and a re-measurement pass at a
promotion hop BA/PM owns anyway, which does not outweigh a priority inversion.

## Definition of Ready — **AMBER**, and the pull is NOT taken

Checked against `agent-factory/checklists/definition-of-ready.md`. The ticket's own DoR block is
dated 2026-08-04 and ticks every row green; **nothing has re-checked it in the five days since**, and
this board has now had three consecutive pulls where exactly that pattern hid a defect (`ABC-015`,
`ABC-018` five defects, `ABC-009` seven, three of them named by no pre-check and one blocking).

**What I checked and found SOUND** — recorded so the correction hop does not re-derive it:

- **The defect is real and I read it out of the source, not out of the ticket.** `src/moves.ts:176`
  is `if (target !== EMPTY && isBlack(target) !== black)`. An **own-colour** occupant makes the
  second clause false, so the branch does not `continue`, and control reaches
  `if (to === position.epSquare)` at line 187, which pushes a `FLAG_EN_PASSANT` move unconditionally.
  Both halves confirmed by reading: no emptiness test, and no test that the claimed captured pawn
  exists.
- **The line citations are NOT stale, which was a live risk.** `ABC-009` changed `src/moves.ts`
  (+30/−8) after this ticket was written. It changed `addCastlingMoves`, which sits *below*
  `addPawnMoves`, so nothing shifted: the capture loop is still at 172, the en-passant comment still
  at 183–186, and `src/legal.ts`'s guard-(a) comment that `A11` corrects is still at 102–103.
- **`A1` and `A3` are disjointly load-bearing** — the failure that blocked `ABC-009`'s pull. A fix
  implementing only the empty-target condition still offers `b2a3` on `A3`'s
  `4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` (a3 is empty), so `A3` catches it. A fix implementing only the
  captured-pawn condition still offers `d4e3` on `A1`'s first FEN (the white e4 pawn **is** present),
  so `A1` catches it. Neither half can ship alone on a green board. This is the check `ABC-009`
  failed and `ABC-022` passes.
- **Baseline re-measured on `main` at this hop:** 381/381 on 16 files, skip count 0 by the AGENTS.md
  command, perft fast lane 24/24 green.

**AMBER — two defects, both in `## Acceptance`:**

1. **`A4` is narrower than the ticket's own `## Scope`, and narrower than its own `## Test notes`.**
   `## Scope` bullet 3 requires `legalMoves` to leave its argument byte-identical over *"all 128
   board bytes and all five scalars"*. `A4` requires only that `toFen(position)` round-trips and that
   *"all 128 board bytes are unchanged"* — **the five scalars are absent**. A build that corrupts a
   scalar and no board byte satisfies `A4` and violates `## Scope`. Worse, `## Test notes` item 2
   states purity must be asserted over the full position state and **explicitly not via `toFen`**
   ("`toFen` cannot see an off-board square, and this project has already had one defect — a stray
   write to square 15 — that `toFen` was blind to"), yet `A4` makes `toFen` a co-equal assertion.
   `ABC-009`'s equivalent criterion covered 128 bytes **and** five scalars; this one regressed
   against its own sibling.

2. **`A5`'s stated justification appears to be false, and it is `ABC-009`'s `A7` shape exactly.**
   `A5` is the enemy-occupant regression guard, already 0 today. Its parenthetical claims it is
   *"named so the fix is not written as 'reject own-colour occupants', which would leave this passing
   by accident rather than by the rule."* **A colour-shaped fix leaves `A5` passing** — the ticket's
   own sentence concedes it — so `A5` cannot discriminate the shape it says it exists to discriminate.
   My reading of why is the part BA/PM should test rather than accept: an emptiness test and a
   colour test may be **behaviour-equivalent here**, because the ordinary-capture branch above
   already `continue`s on every enemy occupant, so no position can distinguish them. If that is
   right, no criterion can discriminate and the honest repair is to **restate `A5`'s justification**
   (a pure regression guard, no discriminating claim) rather than to add a criterion — the same
   outcome `ABC-009` reached when `A7` killed nothing across 62 mutants and its justification was
   retired as false. If it is wrong, there is a distinguishing position and `A5` should name it.

## What this note does NOT establish

I did not audit the ticket line by line. **Two is the floor, not the ceiling** — on `ABC-018` BA/PM
found five where the pre-check named three, and on `ABC-009` seven where it named four, three of
which no pre-check had seen. I did not re-derive the 518,474 / 81,397 reachability walk, did not
re-measure any `NFR-001` figure, did not verify the seven reproduction FENs behave as tabulated, and
did not check `A7`'s six per-root node counts against today's tree. Any of those could be stale in a
way I did not look for. **Re-derive; do not inherit these numbers.**
