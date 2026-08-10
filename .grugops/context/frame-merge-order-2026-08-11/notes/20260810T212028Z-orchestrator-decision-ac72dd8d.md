---
id: 20260810T212028Z-orchestrator-decision-ac72dd8d
kind: decision
by: orchestrator
at: 2026-08-10T21:20:28Z
verified_by:
confidence: high
refs:
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - AGENTS.md
supersedes:
---

# The frame merge order, and why it is three branches and not one

Grounded in `20260810T212028Z-orchestrator-observation-fef2e679` (same task). Read that first.

## The order

```
ABC-018  ── ALREADY MERGED 2026-08-09 (substrate, not a slot)
   │
   ▼
ABC-016  (M/3, P1)  status panel   ── merges 1st
   │  exports STATUS_ROWS; A11 hardcodes history:8; green alone
   ▼
ABC-017  (S/2, P2)  history pane   ── merges 2nd
   │  exports HISTORY_ROWS; A1 names STATUS_ROWS → needs ABC-016
   ▼
ABC-019  (L/5, P0)  turn loop      ── merges 3rd/last
      composes both panels through the render seam
```

**`ABC-016` before `ABC-017`** is forced by `ABC-017`'s own `A1`, which names `STATUS_ROWS`. Only
`ABC-016` creates it. Not a preference.

**`ABC-019` last** for three reasons, and one of them is a criterion that was FALSE until nine days ago:
`ABC-016`'s refinement deleted the panel's per-frame `gameStatusOf` call, and two of `ABC-019`'s
criteria (`rejected` and the non-mutating `board` command) require a frame re-emit **without**
re-evaluating `gameStatus`. A panel that derives status per frame makes both unsatisfiable. `ABC-016`'s
promoted "the panel derives nothing, pinned by a spied call count" is what makes them true. Also:
`ABC-019`'s one-render-per-ply and constant-row-count criteria compose both panels, and `ABC-020`'s
merge-order constraint (already satisfied, merged 2026-08-02) sits behind it.

**Priority inverts and that is on the record.** `ABC-019` is `P0` and merges last, behind a `P1` and a
`P2`. Forced by build edges, not by value. `ABC-019` *can be built* in parallel — its own Dependencies
block says it "can be built against `ABC-016`/`ABC-017` stubs" — so build order and merge order are not
the same line here. What it must not do is merge first.

## Three branches, not one — pushing back on the single-branch instruction

The instruction was: if the tickets depend on each other, develop them on a single branch and merge
them together. They do depend on each other. **A single branch is still the wrong shape, and coding
rule 3 says to say so rather than comply silently.**

1. **No mutual deadlock.** The edges form a *chain* with one-directional dependencies. The test for
   whether a combined branch is *necessary* is whether any ticket cannot go green alone — and
   `ABC-016` can. Nothing is blocked on nothing.
2. **A combined branch is 10 points and `XL` is 8.** `3 + 2 + 5 = 10`. This project's own rule is
   *no XL into dev* (`SPLIT_REQUIRED` at 8). Merging three tickets onto one branch manufactures by
   branch strategy precisely the oversized unit that sizing exists to prevent, and the gate would only
   ever see it as a blob.
3. **It contradicts the branching model.** `AGENTS.md` § Branching model: a short-lived
   `grugops/<task>` branch that "merges to `main` as soon as it is green." Three tickets on one branch
   cannot merge until the slowest is green — `ABC-019` (`L`, eight states, fifteen transitions) would
   hold `ABC-016` hostage.
4. **It destroys the check that has been catching real defects.** Every recent merge here recorded a
   per-ticket `src/` byte-identity result — `src/moves.ts` md5 `6335b452…` unchanged across five hops,
   `src/san.ts` md5 `cbcc3be3…` unchanged across seven. That is how this project proves *no gate
   repaired the thing it was measuring*. Blend three tickets and the per-ticket hash means nothing.

**The one carve-out, and it is not mine to settle.** `ABC-016` and `ABC-017` assert the same
`frameHeight({board:9, status:STATUS_ROWS, history:HISTORY_ROWS}) === 23` identity from opposite sides,
and `ABC-017` says in its own words that "when both land, neither ticket owns the 8 alone." If the two
constants must land as one contract, then `ABC-016 + ABC-017` on one branch is `3 + 2 = 5` (`L`) —
legal, and defensible. That is an architecture question about constant ownership, so it goes to
Architect/Design rather than being decided here by fiat.

**`ABC-019` stays on its own branch under either outcome.** Folding it in breaches `XL` (8) in the
5-point case and exceeds it in the 10-point case.

## Scheduling

Tier **Reduced**: the `Agent` tool is present but this is a default main thread, so the role allowlist
is honored by instruction and is NOT runtime-enforced. Width cap `queue.wip_limit` = 3.

Wave 1 runs **2 of 3** — deliberately under the cap, because wave 2 depends on wave 1's ruling and
running it now would mean guessing at the Architect's answer:

| # | Role | Task | Why it is independent |
|---|------|------|----------------------|
| 1 | Architect/Design | `design-frame-contract` | Owns constant ownership + the shared frame identity + `ABC-016`'s flagged `NFR-002` catalog row. Its ruling decides `ABC-017`'s `A1` and the 016/017 branch question. |
| 2 | BA/PM | `refinement-ABC-019` | `Backlog` → `Ready`. Loop-shaped work; does not touch the frame contract. |

Wave 2, after wave 1 publishes: BA/PM repairs `ABC-017`'s `A1`/Dependencies contradiction reading the
Architect's published notes, then the `Ready for Dev` gate on `ABC-016` and `ABC-017`.

No data is relayed between the two agents. `.grugops/context/<task>/notes/` is the only channel.

## Hard limits held

Nothing merged, nothing deployed, no protected branch touched. Work is on
`grugops/frame-merge-order-2026-08-11`. Merge and deploy stay with the owner; the standing merge
approval in `memory-bank/60-progress.md` covers gated work and is not exercised by this hop.
