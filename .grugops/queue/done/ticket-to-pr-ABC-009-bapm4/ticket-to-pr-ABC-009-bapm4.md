---
task: ticket-to-pr-ABC-009
subtask: bapm-abc009-bytespace
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T15:10:28Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: make the criterion a FULL-BYTE-SPACE quantifier — the pass that ends the sequence

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Forty-six notes. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae` carries **local
time labelled `Z`** and is **superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`. Take your
own `at` from `date -u`; this machine is UTC+3.

You found the fourth class at the last hop: `A11`'s enemy-colour exclusion is measurably false for enemy
`KNIGHT` and enemy `PAWN`. You correctly named it and did not act on it, because your subtask forbade
adding criteria. **This subtask asks for exactly that, and nothing wider.**

The Orchestrator verified your gap before routing this: the delivered code answers **13 moves, 0 castles,
pure** on both `4k3/8/8/8/8/8/8/K3n2R w K - 0 1` and `…/K3p2R w K - 0 1`, and an enemy-knight-admitting
mutant **compiles and survives 371/371** while destroying a black knight and writing a **white** king over
it. **Zero production lines are owed.** `src/moves.ts` is still
`0e247853ab2c05887c76105ff83d8621` after four verification hops.

## The one job: stop listing sample classes, state the quantifier over the whole space

Read `20260809T151028Z-orchestrator-decision-22b59d96` for the accounting; the argument is that the space
is **finite and already fully measured**. Each home square holds one byte: `EMPTY` plus 6 piece types × 2
colours = **13 values**, of which **1** is correct, so **12 wrong values per square is the entire space**.
Every one is already accounted for by measurements on this task — absence rows, your own-type quantifier,
the enemy bishop, the two-type gap you just found, and a three-value equivalence set.

So restate the criterion to quantify over **all twelve wrong byte values per home square**, with the
behaviour-equivalent set **named, measured, and excluded with its reason** — enemy `KING`/`QUEEN`/`ROOK`,
which you measured as producing no observable change because the through-check masks them. That set is
**unfalsifiable by construction**, the same shape as guard ordering: no test could ever fail on it, so a
criterion over it would be theatre. **Name it and measure it; never silently omit it** — silent omission
is what produced four consecutive misses.

**State the exhaustiveness argument explicitly in the ticket**, so a later reader can check it rather than
inherit it: 13 values, 1 correct, 12 wrong, each in exactly one of {covered by an absence row, covered by
the own-type quantifier, covered by an enemy row, newly required, measured-equivalent-and-excluded}. That
sentence is what ends this sequence — it is why there cannot be a fifth class, as opposed to a hope that
there is not one.

Whether this widens `A11` in place or lands as a new `A13` is **your call**; say which and why.

## The stopping rule you are helping enforce

The Orchestrator has written down that **this is the last hardening pass on `ABC-009`**. Anything found
after it goes to a follow-up hardening ticket for `src/moves.ts`, not another `ABC-009` hop — the
`## Scope` is three bullets about castling preconditions, all three verified across five independent
derivations, and an unbounded mutation net is not in it. **If you believe the exhaustiveness argument does
NOT hold — that a thirteenth region exists — say so plainly; that is the one finding that would justify
another pass.**

## Boundaries

- **Do not touch `src/`.** Not one file. **You write no test rows** — QE's hop follows yours and writes
  them (enemy `KNIGHT` and enemy `PAWN`, both squares, at `A11`'s established doubling).
- **No board move.** The ticket stays in `Ready for UAT` (1/4).
- Do not edit `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` or `plans/nfr-catalog.md`.
- **`A7`, `A12`, guard ordering and `NFR-001` are settled.** Do not re-litigate.
- `A11`'s own-type rows are **met and verified**; do not reopen them.
- The `plans/traceability.md` 11-cell report **does not exist** — you closed it; it stays closed.
- **`ABC-018` frontmatter drift:** your call to write the trigger instead of cutting a ticket is
  **accepted**. The trigger fires on `ABC-009`'s close, which is two hops away.

## Traps that have each already caught a role here

- **One process per tree** — your own first harm probe was defeated by Node's module cache serving
  pristine `moves.ts` to four tree states in one process; the tell was identical output across trees.
- **Verify the instrument before believing a red** — the Orchestrator's `pieceTypeOf` control did not
  compile and produced 147 failures it nearly read as "QE's rows over-fit"; your own three controls hit
  `noUncheckedIndexedAccess` and were correctly scored `BROKEN-BUILD` rather than as dead controls.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is not admissible.** Nothing self-stamped, no `index.*` faked. Claim by hand;
`scripts/claim.js` does not exist here — re-check rather than trusting this file. Update your own row in
`plans/traceability.md`. Commit on the existing branch; never commit directly on `main`. Never merge,
never deploy.
