---
id: 20260812T041500Z-ba-pm-observation-a1-a12-sweep-8d3e07f5
kind: observation
by: ba-pm
at: 2026-08-12T04:15:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-a3
  - ABC-017
  - ABC-016
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
supersedes:
---

# The `A1`–`A12` sweep found the shape a fifth time, and this one has a SURVIVOR

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**
> Every verdict below was produced by patch-run-revert against the delivered tree with a uniqueness
> check on each anchor, out of tree in the session scratchpad. **No file was added to the repo** and
> `src/` is byte-identical to the build hop.

## D23 — `A9`'s snapshot clause cannot fail as delivered, and `WPOS` survives the whole project

**`A9` is the criterion that owns non-mutation.** Its clauses are: the two panes are byte-identical,
and `toFen(history.position)` / `history.moves.length` captured **before the first render** are
unchanged after the second.

**The delivered test loops over `ALL_CASES` — fourteen module-scope singletons that `A1`, `A2` and
`A6` have already rendered.** So the snapshot is taken *after* any first-render corruption, and a
build that corrupts once per object and is stable thereafter is invisible to it.

**This is exactly the `ABC-016` defect `A9` was written to prevent, one level up.** D10/D11 added the
timing clause because *"a snapshot taken between two renders is byte-identical across a build that
corrupts on every render, so only a snapshot taken before the first one catches it."* The delivered
fixtures reproduce that at **file** scope instead of at **test** scope.

**The survivor.** `WPOS` — corrupts the caller's authoritative `history.position` on the first render
of each history object, never again. It changes **no rendered byte**: the pane re-parses `initialFen`
and never reads `history.position`. That field is the only state `A9`'s `toFen` clause names, and
nothing else in `src/` reads it.

> **`WPOS` passes 697 / 697 on 24 files. Zero catchers in the entire project.**

Same criterion, same fixture kind, one difference — whether the snapshot precedes the object's first
render by anything:

| build | `A9` as DELIVERED (shared fixture) | `A9` as re-worded (fresh fixture) |
|---|---|---|
| the delivered pane | PASS | PASS |
| `W9ONCE` — drops one move once per object | **PASS** | **FAIL** — `expected 19 to be 20` |
| `WPOS` — corrupts `position` once per object | **PASS** | **FAIL** — the `toFen` clause |

**And when the clauses do fire, the byte-identical clause masks them.** On `W9` (corrupts on every
render) `A9` fails at `expect(second).toEqual(first)`, which asserts first — so `moves.length`, the
clause the ticket calls *"the criterion"*, **is never evaluated**. Same silent-precedence shape as the
original `A13` placement the Engineer split.

**The fix is a fixture change, not a new assertion, and it is cheap: 8.2 ms** to rebuild the heavy
fixtures including the 2,000-ply shuffle and the 300-ply deterministic game. `N8-LANE` is not in play
and **no bar was re-derived** — the ticket forbids it and it was not done.

## Four smaller findings of the same family — recorded in `## Test notes`, not as criterion changes

1. **`A1` asserts its tripwire before its requirement in one `it`.** `expect(HISTORY_ROWS).toBe(8)`
   precedes `expect(renderHistory(...)).toHaveLength(HISTORY_ROWS)`. Measured on a self-consistent
   9-row build (ships 9, exports 9): `A1` reports *"expected 9 to be 8"* and the row-count requirement
   is never evaluated. Six other tests fail that build, so severity is low — **but it is the identical
   shape we required the Engineer to split in `A13`, and consistency is the point.**
2. **Four assertions are strictly implied by an exact-list assertion earlier in the same `it`** and can
   never be the discriminator: `A3`'s `numbersOf` and its two `not.toContain`; `A4`'s `numbersOf`;
   `A6`'s `not.toContain(1)` on the **third** anchor. Harmless, free, and **a later reader will mistake
   them for protection.**
3. **`A2`'s "300 plies identical in count and width to 0 plies" is implied by `A1` + `A2`'s every-row
   clause.** It is in its own `it`, so nothing masks it — redundant rather than vacuous. Left alone,
   recorded so QE does not build a mutant expecting a kill.
4. **`A11`'s `expect(rendered).toBeLessThanOrEqual(2 * HISTORY_ROWS)` compares two of the TEST's own
   numbers** — `rendered` is a literal from the fixture table, not the build's call count. The two
   assertions above it make the composition sound, so it is decorative rather than wrong.

## What the sweep found HEALTHY, stated so it is not re-swept

`A4`'s positional clauses (`whiteCell(rows[7])`, `blackCell(rows[7])`) are **not** implied by its
normalised table — normalisation loses position — so they are live, and `A4` is the model of an extra
clause that earns its place. `A5` is the model criterion: one binding assertion, intent in prose.
`A8`'s `every(isBlank)` is live and is what kills the bottom-aligned build. `A11`'s six other tests
each carry one property, and the *"still renders the right cells while spied"* test is an explicit
anti-vacuity guard — the Engineer was already hunting this shape inside `A11`.

## The `HISTORY_COLS` exposure, flagged and NOT fixed

`expect(row).toHaveLength(HISTORY_COLS)` measures the pane against the pane's own exported constant.
Measured: **a build that pads to 24 columns and exports `HISTORY_COLS = 24` passes every width
assertion in `A1`–`A12`.** It is caught only by the hardcoded slice offsets in the wide-cell test, and
the message reads as SAN truncation (*"expected ' dxc1=Q' to be 'dxc1=Q+'"*), not as a width change.

**No criterion was added and `A2` was not edited.** Epic `4a` gives the exact split to the engineer;
`ADR-0010` cl. 2 is not re-opened; and the reason 21 was chosen over 24 is **cross-ticket** — 24 was
measured to MASK the status panel's swing (0/20 stale frames against 8/20). **A restraint taken for
another ticket's benefit cannot be guarded by a criterion on this one.** Carried for the Orchestrator;
the defect belongs to `ABC-027`. **Nothing here proposes widening `HISTORY_COLS`.**
