---
task: ticket-to-pr-ABC-009
subtask: qe-abc009-a13
role: qe-e2e
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-009/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T15:36:13Z
branch: grugops/ticket-to-pr-ABC-009
---

# Subtask: discharge `A13` — eight rows, zero production lines. THE LAST HARDENING PASS.

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Fifty-two notes. Ordering warning: `20260809T141500Z-orchestrator-decision-865b06ae` carries **local time
labelled `Z`** and is **superseded** by `20260809T114649Z-orchestrator-decision-700d4a44`. Take your own
`at` from `date -u`; this machine is UTC+3.

**This is the last hardening pass on `ABC-009`** — a written stopping rule, not a preference. After it the
observable byte space for both home squares is exhausted by construction. Anything found afterwards goes
to a **follow-up hardening ticket for `src/moves.ts`**, not another `ABC-009` hop. Two regions are already
reserved for that ticket (the joint 13×13 pair space, inert today because `src/moves.ts:326-327` are two
independent byte compares; and the constants no criterion varies).

## What you owe

`A13` (ticket line ~618, added by BA/PM this hop — **read its own text, not this summary**) quantifies over
the **full occupant-byte space** per home square: 13 constructible values, 1 correct, 12 wrong, each in
exactly one of six buckets. `A13` **subsumes** `A11` and carries a value-by-value discharge map, so it costs
two values' worth of rows rather than twelve. **`A11` keeps its domain, its rows and its MET verdict — do
not reopen it.**

**Eight rows, zero production lines**: enemy `KNIGHT` and enemy `PAWN`, **both** home squares, at `A11`'s
established doubling (each type in ≥2 (colour, side) configurations). BA/PM measured all eight with setups
asserted (0/8 labels lie) and non-inert (0/8 masked or blocked):

```
king's square rows:  13, 14, 17, 19
rook's square rows:   4,  5,  4,  5
```

**Those are BA/PM's numbers, not yours.** The Orchestrator re-derived the four single-config values it
could reach cheaply and the collision structure below; it did **not** re-derive `14`, `17`, `19` or the
rook-square doubling. **A discrepancy is to be RAISED, never adjusted to match your code.**

## The one warning that changes how you must write these rows

Verified on the delivered code — every row is pure with 0 castles, so the move **count** is the only other
signal, and it collides:

```
king's square:  enemy BISHOP 13 · enemy KNIGHT 13 · enemy PAWN 13    ← three byte values, ONE count
rook's square:  enemy BISHOP  5 · enemy PAWN     5 · EMPTY       5    ← three byte values, ONE count
                enemy KNIGHT 4 is the only one that differs
```

A count-only row is therefore **interchangeable with two other byte values** — it would pass while testing
the wrong occupant. Your `expectImpostorSetup` pattern already caught one lying label (`PAWN` labelled, a
`BISHOP` present, at a coinciding count of 19). **Here it is mandatory, not prudent.** Assert the occupant
byte, not just the outcome.

## Prove it both directions, as you did last time

- **The eight must die**: build the enemy-`KNIGHT`-admitting and enemy-`PAWN`-admitting mutants for each
  square and confirm each dies **to your new rows**. The Orchestrator verified the enemy-knight mutant on
  the king's square **compiles and survives 371/371 today** with the harm live (14 moves; black knight
  destroyed, a **white** king written over it — material loss *and* a colour change).
- **The equivalents must still survive**: the nine from your first hop, plus the **three** enemy
  `KING`/`QUEEN`/`ROOK` admissions BA/PM measured as behaviour-equivalent on two instruments agreeing
  12/12. If your new rows kill any of those, they pin implementation shape rather than behaviour — and the
  enemy-`KING`/`QUEEN`/`ROOK` set is unfalsifiable by construction, so a row that kills them is a bug in
  the row.

## Boundaries

- **`src/moves.ts` must stay md5 `0e247853ab2c05887c76105ff83d8621`** — unchanged across five hops. Zero
  production lines. If you believe the code needs a change, **STOP and say so** instead.
- **Do not modify any of the 14 pre-existing test files** (`A8`, verified at line level, not by inspection).
- Do not edit `## Acceptance` — BA/PM's alone. Do not edit `ABC-022`, `ABC-010`, `ABC-011`, `ABC-018` or
  `plans/nfr-catalog.md`.
- **`A7`, `A11`, `A12`, guard ordering and `NFR-001` are all settled.** Do not re-litigate or re-measure.
- The `plans/traceability.md` 11-cell report **does not exist**. Closed.

## Traps — each has now caught a role, and the last one caught the Orchestrator twice

**Print the input, not the verdict.** This is the lesson of the whole task. BA/PM's byte-space probe said
`11` because its probe board already held a white king; the Orchestrator then rebuilt that probe to check
it and **got the same wrong `11` for the same reason**, in the hand-back that had just warned about it. The
true count is `13` on `e1`, `h1` and `a1`. Also: **one process per tree** (Node's module cache served
pristine `moves.ts` to four tree states in one process, the tell being identical output across trees), and
**verify the instrument before believing a red** (a `pieceTypeOf` control that did not compile produced 147
failures nearly read as "your rows over-fit"; three `noUncheckedIndexedAccess` controls were correctly
scored `BROKEN-BUILD`).

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is not admissible.** Nothing self-stamped, no `index.*` faked. Claim by hand;
`scripts/claim.js` does not exist here — re-check rather than trusting this file.

Run the full mandatory gate (lint, typecheck, unit, build), the skip count, and the deep lane before you
finish. Update your own row in `plans/traceability.md`. **No board move is yours** — the ticket is already
in `Ready for UAT` (1/4) and stays there; the Orchestrator takes the UAT ruling, the merge and the close.
Never merge, never deploy.
