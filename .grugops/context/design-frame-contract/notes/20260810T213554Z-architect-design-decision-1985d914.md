---
id: 20260810T213554Z-architect-design-decision-1985d914
kind: decision
by: architect-design
at: 2026-08-10T21:35:54Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0009
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
supersedes:
---

# The frame's row-constant contract: two tickets, two branches, and one fit-check in a third place

Grounded in `20260810T213554Z-architect-design-observation-1a02e27d` (same task) — read that first; the
six-mutant table is the whole basis of this decision. Recorded as `decision`, not `finding`: this hop
holds no `§14-gate#<id>` stamp and no `human:<name>` grant. Full record with alternatives and rollback:
`memory-bank/50-decisions/ADR-0009-frame-row-constant-ownership.md`.

## The ruling that was owed

**`ABC-017`'s `A1` does NOT import `STATUS_ROWS`. `ABC-016` and `ABC-017` land as TWO tickets in
sequence, on two branches — not as one contract on one branch.**

The Orchestrator's carve-out asked whether the two constants *must land as one contract*, in which case
`016 + 017` on one branch is `3 + 2 = 5` (`L`), legal and defensible. **They must not, and the reason is
that the assertion which appeared to bind them is the wrong assertion in the wrong place.**

1. **The producer owns its count.** `STATUS_ROWS` → the status-panel module; `HISTORY_ROWS` /
   `HISTORY_COLS` → the history-pane module; `MESSAGE_ROWS` / `PROMPT_ROWS` stay in `src/frame.ts`.
   This is not a new rule — it is the rule merged code already follows, `frame.ts` owning the two counts
   whose rows `frame.ts` produces.
2. **Strike the `frameHeight(...) is 23` clause from `ABC-017`'s `A1`.** That clause is the entire
   import edge.
3. **Strike the same clause from `ABC-016`'s `A11`** — symmetry, not courtesy. Measured: `A11` passes
   four of six row-count mutants including **both** that make epic `4b` unreachable, because it
   hardcodes `history` and `board`. A criterion added by `D8` to protect `4b` that cannot fail on the
   two cases which break `4b` is the same defect class `ABC-016`'s own hop was hunting.
4. **Each panel keeps the number it owns and claims no frame-level consequence it cannot see** — `A11`:
   exactly `STATUS_ROWS` = 3; `A1`: exactly `HISTORY_ROWS` = 8 at all ten lengths.
5. **The composition lands ONCE, in `src/frame.test.ts`, reading all three terms from delivered code** —
   `renderBoard(...).length`, `STATUS_ROWS`, `HISTORY_ROWS` — replacing the three shadow constants at
   `:38-43`. Two clauses: `= 23` is the **tripwire** (any row-count change must be deliberate); `<= 24`
   is the **requirement** (what `4b` needs and what `beginFrameSession` switches on). **Owed by
   whichever of `ABC-016` / `ABC-017` merges SECOND.**
6. **No `BOARD_ROWS` export is added to `src/render.ts`** and that merged module is not touched.
   `renderBoard(...).length` measures the delivered geometry instead of restating it, and it is the only
   form that fails M4.

## The honest answer to "do the constants belong in a third place?"

**The constants do not. The ASSERTION does — and that third place already exists, is already merged, and
already carries the assertion in a form that cannot fail.** `src/frame.test.ts:632-638` is it.

That is the ruling the subtask asked for in its hardest form, so the cost is stated plainly rather than
minimised:

- **Cost paid:** the second panel ticket to land owes an edit to `ABC-018`'s **merged** test file — a
  few lines, replacing three shadows with imports and adding the `<= 24` clause. **Zero production
  lines.** A new obligation on a merged ticket's file has to be named in a ticket rather than smuggled,
  and that is flagged below.
- **Cost NOT paid, and this is why the third place wins:** the one-branch alternative costs a coupling
  between merge order and the project-wide **blocking** typecheck gate, a 5-point combined unit, and the
  per-ticket `src/` byte-identity check this project uses to prove no gate repaired what it measured —
  and it buys an assertion that is *still* incomplete (`A1` passes M4).
- **The alternative I came closest to taking, and what rejecting it costs:** moving `STATUS_ROWS` and
  `HISTORY_ROWS` **into `src/frame.ts`**, on the genuinely strong argument that both values were derived
  from frame-fit arithmetic and are budget allocations rather than panel properties — 3 is what is left
  before `N` ≥ 5 kills `4b`; 8 is what the viewport leaves. Rejected because it edits a merged module for
  no behavioural gain, inverts the direction `frame.ts`'s header deliberately establishes, and makes a
  panel unable to state its own height without the frame. **What that rejection costs: the derivation of
  *why 3* and *why 8* stays in two ticket bodies instead of one module header.** Clause 5 is what pays
  it back — the fit-check sits in the frame's own test, next to the arithmetic.

## Correcting the Orchestrator's merge order on one point, deliberately and on the record

**The order `ABC-016` → `ABC-017` survives, but it is no longer FORCED.** The Orchestrator's decision
note recorded it as *"Forced by build edges, not by value … Not a preference."* That was correct about
the tickets **as written**. After clause 2 there is no edge in either direction and **both tickets go
green alone**, so the honest statement inverts: **it IS a preference** — it matches `P1` before `P2`, and
it gives clause 5's fit-check one definite home instead of a "whoever is second" rule nobody can read off
a ticket. It is a good preference and I am not asking to change it; I am asking that it stop being
recorded as a constraint, because a false constraint is what a later hop will plan around.

**Everything else in that decision stands and is strengthened, not weakened:** three branches not one,
`ABC-019` last and on its own branch, and the four reasons given against a combined branch. Sizes do not
move — `ABC-016` `M` (3), `ABC-017` `S` (2), and the 5-point unit is never created.

## Flagged, not taken — each with an owner

- **BA/PM (next hop): two ticket-text edits.** `A1` and `A11` lose the `frameHeight(...)` clause and
  keep their own row-count clause. **`plans/tickets/ABC-016*.md` and `ABC-017*.md` were NOT edited here**
  — they are a BA/PM hop's at this boundary. `ABC-017`'s `## Dependencies` sentence (*"no import edge
  either way"*) becomes true as written and needs no change; its `A1` is the half that was wrong.
- **BA/PM: `ABC-016`'s carried-forward `NFR-002` flag is stale.** It still reads *owed by
  Architect/Design*. It was ruled at `refinement-ABC-026` on the day it was raised and re-checked here;
  it should read *ruled, carried by Security/NFR at this ticket's own gate*.
- **BA/PM or whoever cuts the second panel ticket: clause 5's fit-check needs a home in ticket text**,
  as an acceptance criterion on the second of `ABC-016` / `ABC-017` to merge. Under the standing order
  that is `ABC-017`.
- **Orchestrator: no board move is taken here.** Both tickets are in `Ready`; whether a ticket-text
  amendment needs a column move is the Orchestrator's call, and `plans/board.md` was not touched.
- **Security/NFR (unchanged, restated so it is not lost):** each panel ticket's gate re-verifies the
  `src/history.ts`-importer fact on **delivered** code by `grep`. `A13` / `A11` are the tickets' own half
  and do not discharge the gate's.

## Limits held

Nothing merged, nothing deployed, no protected branch touched, **zero `src/` lines written**. Work is on
`grugops/frame-merge-order-2026-08-11`, shared with a concurrent `refinement-ABC-019` hop whose files
were not touched. `plans/board.md` and `plans/tickets/` untouched. `NFR-002`'s table row verified
byte-identical by hashing all eight `NFR-` table lines before and after the write rather than asserted.
