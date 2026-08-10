---
id: 20260810T061302Z-orchestrator-decision-3f8a91c4
kind: decision
by: orchestrator
at: 2026-08-10T06:13:02Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-022
  - ABC-009
  - EPIC-001
  - EPIC-004
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - src/moves.castling.test.ts
  - plans/board.md
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
supersedes: 
---

# `ABC-023` opened; its blocking dependency is CLEARED but its acceptance is now STALE — Definition of Ready comes back **AMBER**, no board move taken

This note opens task `ticket-to-pr-ABC-023` on branch `grugops/ticket-to-pr-ABC-023`. **No board move
is taken by it.** `ABC-023` stays in `Backlog`; the `Backlog → Ready` exit is BA/PM's and the ticket
says so itself.

## What the owner asked for, and what that does and does not authorise

"Continue with ABC-023 and when you are done, merge the branch and delete the branch after merging."

Merge authority is the owner's standing directive of 2026-08-06 (`memory-bank/60-progress.md`
§ "Standing directive"), re-confirmed here for this ticket, and branch deletion is added to it. **It
is approval to merge work that PASSED, never to skip or soften a gate** — `quality.gate_enforcement`
is `blocking`. Deploy is not included and nothing is deployed. The gates run on the branch tip
**before** the merge and again on `main` **after** it, both recorded, exactly as the last four merges
did.

## The dependency is satisfied — verified, not assumed

`ABC-023` `## Dependencies`: *"`ABC-009` must be merged first. Its branch delivers both files this
ticket edits."* `ABC-009` merged 2026-08-09 (fast-forward `aad6d48` → `5ee84e8`). Both files are on
`main` at this hop:

```
src/moves.castling.hardening.test.ts   38218 bytes   44 tests   green
src/moves.castling.test.ts             10136 bytes   33 tests   green
```

The four impostor tables the ticket extends (`IMPOSTOR_ON_KING_SQUARE` :291,
`IMPOSTOR_ON_ROOK_SQUARE` :315, `ENEMY_ON_KING_SQUARE` :342, `ENEMY_ON_ROOK_SQUARE` :355) and the
`expectImpostorSetup` helper (:216) all exist and are named where the ticket expects them. **This
clears the one ⚠️ row in the ticket's own Definition-of-Ready block** — the row that put it in
`Backlog` rather than `Ready`.

## Baseline re-measured on `main` at this hop, so nothing downstream inherits a number

```
npm test          559 passed / 559 on 18 files
skip count        0            (by the AGENTS.md `### Test integrity` command)
npm run lint      exit 0       (biome, 35 files, 2 infos, no fixes applied)
npm run typecheck exit 0       (tsc --noEmit)
md5 src/moves.ts  6335b452fc21ffe2d0f902ecab930840
```

## Definition of Ready — **AMBER**. The pull is NOT taken.

Checked against `agent-factory/checklists/definition-of-ready.md`. The ticket's own DoR block is
dated 2026-08-09 and was honest **on the day it was written**. `ABC-022` merged later the same day
and invalidated part of it.

### Defect 1 — BLOCKING. `A4`'s hash pin is stale, so `A4` FAILS before a line is written.

`A4` requires that *"`src/moves.ts` still hashes `0e247853ab2c05887c76105ff83d8621`"*. Measured at
this hop with `md5 -q`, `src/moves.ts` on `main` hashes **`6335b452fc21ffe2d0f902ecab930840`**.
`ABC-022`'s fix landed two guard conditions and a local const in `addPawnMoves` **in that file**.

As written the criterion is unsatisfiable by any correct implementation of this ticket, which makes
it not a criterion but a trap. **This was foreseen and deliberately routed here rather than fixed
early**: the `ticket-to-pr-ABC-022` opening decision note recorded the direction of the dependency,
and the `ABC-022` BA/PM brief explicitly fenced `ABC-023` off ("*re-pinning it now is not wanted* …
*deliberately deferred to `ABC-023`'s own promotion hop so the hash is re-derived once*"). This hop
is that hop. The repair is a re-pin **plus** everything defect 2 forces.

### Defect 2 — every `381/381` verdict in the ticket was scored against a tree that no longer exists.

The suite is **559 on 18 files** today; the ticket's sixteen mutant verdicts (six in `## Reproduction`
1, two in 2, eight in 3) and every *(Measured today: …)* parenthetical were scored at **381 on 16**.
`ABC-022` added `src/moves.enpassant.test.ts` (58 tests) and `src/moves.enpassant.hardening.test.ts`
and changed `src/moves.ts` itself.

**"Survived 381" does not imply "survives 559", and the ticket's whole design rests on those
survivals.** The three criteria `A1`, `A2` and `A3` each *name the mutant that must die* — that
naming is the ticket's best property and it is exactly what goes stale. If a mutant the ticket calls
a survivor is now incidentally dead, the criterion it justifies has lost its discriminator and must
be **restated honestly, not quietly kept**. `A5` is the sharpest case: it requires that fifteen
behaviour-equivalent controls from `ABC-009` **still survive, killed count zero**, and those fifteen
were also measured at 381.

### Defect 3 — `## Dependencies` states the `ABC-022` relationship backwards, and this hop is the proof.

It says *"Independent of `ABC-010`, `ABC-011` and `ABC-022` — different modules or different branches,
and either order works."* Defect 1 is the counter-example: `ABC-022` merged first and invalidated this
ticket's acceptance. Correct the sentence to record what actually happened. Leaving "either order
works" in a merged ticket teaches the next reader a false rule.

## What this note does NOT establish — re-derive, do not inherit

**Three is the floor, not the ceiling.** The precedent on this board is unambiguous and it runs one
way only: `ABC-018` five defects where the pre-check named three; `ABC-009` seven where it named four,
three seen by no pre-check and one blocking; `ABC-022` seven at the pull where the pre-check named
two, then five more false statements at a later sweep.

I did not:

- run a single mutant. **Every** SURVIVED / KILLED verdict above is inherited from the ticket, not
  verified by me — including the claim that the two destination-square mutants survive, which is `A2`'s
  entire justification and the only legally-reachable class on this board.
- re-derive the *"9 of 13 type/table pairs vary ONE axis"* table in `## Reproduction` 3. I confirmed the
  four tables and the helper still exist and are green; I did not read a single row's axes.
- check any witness FEN against today's tree, or any move count in any parenthetical.
- check whether `ABC-009`'s fifteen behaviour-equivalent controls still survive, which `A5` requires.
- audit the ticket for **this board's recurring defect shape — a criterion narrower than its own
  `## Scope`** — which was defect 1 on `ABC-022` and has appeared on three consecutive tickets. Sweep
  for that shape specifically.

## Routing, width, and why this hop runs alone

One subtask enqueued: `ticket-to-pr-ABC-023-bapm` → BA/PM (Workflow 07). Width **1**, and by
dependency rather than by caution — nothing downstream can start against acceptance criteria that are
known-stale, and the engineer's `A4` is one of the stale ones. `queue.wip_limit` is 3 and
`In Development` is 0/3; the room exists and is deliberately unused.

`ABC-013` (`Ready`, `M`, `P1`) is **not** pulled alongside. The owner named `ABC-023`; pulling a
second ticket is scope this request did not ask for.

## Board state after this note

Unchanged. `Backlog` holds `ABC-023`; `Ready` 1/8; `In Development` 0/3. BA/PM owns the
`Backlog → Ready` exit and takes it only if the corrected ticket earns it.
