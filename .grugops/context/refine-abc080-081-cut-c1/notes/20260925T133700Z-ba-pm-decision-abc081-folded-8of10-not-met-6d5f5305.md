---
id: 20260925T133700Z-ba-pm-decision-abc081-folded-8of10-not-met-6d5f5305
kind: decision
by: ba-pm
at: 2026-09-25T13:37:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ABC-080
  - ADR-0006
  - ADR-0025
  - NFR-005
  - NFR-009
  - 20260925T080716Z-architect-design-decision-r2-abc081-adr0006-caveat-rights-key-is-required-for-a-tt-23e0307f
  - 20260925T080816Z-architect-design-decision-r3-abc081-tt-separate-from-per-ply-key-array-adr0025-a937c4bd
  - 20260925T080916Z-architect-design-decision-r4-abc081-memory-nfr-row-draft-nfr009-4dd1bbaa
supersedes:
---

# ABC-081 — R2/R3/R4 folded into criteria, re-scored 8/10, still NOT MET

**No sanctioned writer on this install** — same degraded posture as the sibling note, not
re-derived here.

## What changed on the ticket page

- **Scope** gains `ADR-0025`'s shape (R3): the table is its own fixed-size module, separate
  from the per-ply key array, sharing only the key value; cleared per `chooseMove`/`search()`
  entry, not carried across moves; only full-width nodes probe/store it.
- **The inherited-caveat section** gains R2's ruling: `ADR-0006` unchanged — for a table the
  rights key is *required*, not merely safe (`knight-g1` pair: perft 3 reads 1 335 vs 1 320).
  `ADR-0006` gains a dated amendment and falsifier `G6`.
- **`A3`** re-stated in the engine's cumulative-iterative-deepening shape (R3): as originally
  written (fixed depth 5, table only) it reads 80.4% / 81.2% and FAILS ≤ 70%; with `ABC-080`'s
  hash move live it reads 63.2% / 49.7% and passes.
- **Dependencies** updated: `ABC-075`/`ABC-077` now `Done`; `ABC-080` is now named a
  prerequisite **for `A3`'s measurement specifically** (not for `A1`/`A2`/`A4`–`A8`); both
  Architect/Design rulings (caveat, storage separation) marked RULED with pointers.
- **Test notes** gain `G6` (name the `knight-g1`-shaped fixture inside `A1`) and the
  `ABC-078` `A3` identity-sweep amendment this ticket's build hop owes (accept an equal-scored
  root move — the hash move flips 1 of 48 ties).
- **Memory NFR trigger** records `NFR-009` DRAFT (R4: ≤ 16 MiB fixed, ≤ 1 MiB growth,
  `heapUsed`/`arrayBuffers` after `gc()`) — **not placed** in `plans/nfr-catalog.md`; that pen
  is Security/NFR's, on the owner's word, explicitly fenced out of this subtask.

## Re-score — 8 of 10 clean, 2 ⚠️, still NOT MET

- **Item 5 (dependencies known) flips ⚠️ → ✅.** Both open rulings the 2026-09-25 re-score
  named (`ADR-0006`'s caveat, table-vs-array storage) are now answered.
- **Item 3 (INVEST-shaped) flips ✅ → ⚠️ — a new, honestly-named blocker.** The prior re-score
  held this ✅ on "`ABC-080` remains not a blocker in either direction." That is no longer true:
  the same ruling that answers item 5 also re-states `A3` in a shape that only passes with
  `ABC-080`'s hash move live, and `ABC-080` is `Backlog`, not `Done`, as of this cut (it
  re-scores 10/10, Ready, at this same cut — see the sibling note). `A1`, `A2`, `A4`–`A8` remain
  independently buildable.
- **Item 10 stays ⚠️, per this subtask's own fence.** `NFR-009` is drafted but not placed;
  placing it is Security/NFR's and the owner's, explicitly out of scope here.
- **Net score is unchanged at 8/10, but the shape of the two open items changed**: item 3's
  blocker is schedule-bound (resolves when `ABC-080` lands) and item 10's is not
  (owner-ratification-bound). Recording this distinction rather than reporting a flat "no
  change."

**Pullable today: NO.** Size `M`, priority `P0`, unchanged. **Recommended routing: pull
`ABC-080` first — it is Ready on its own and discharges this ticket's item-3 blocker. Route
item 10 (`NFR-009` placement) to Security/NFR in parallel; it does not gate `ABC-080`'s pull.**

Full DoR table on the ticket page, `§ DoR re-score — 2026-09-25 (BA/PM, task
`refine-abc080-081-cut-c1`, Workflow 07)`.
