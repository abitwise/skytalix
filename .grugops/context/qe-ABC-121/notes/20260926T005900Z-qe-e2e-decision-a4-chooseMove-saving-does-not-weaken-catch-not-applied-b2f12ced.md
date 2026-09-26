---
id: 20260926T005900Z-qe-e2e-decision-a4-chooseMove-saving-does-not-weaken-catch-not-applied-b2f12ced
kind: decision
by: qe-e2e
at: 2026-09-26T00:59:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - src/search.pvs-lmr.test.ts
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204100Z-software-engineer-decision-abc121-two-of-four-rows-moved-two-refused-only-guards-9bdce84b.md
  - .grugops/context/ticket-to-pr-ABC-121/notes/20260925T204200Z-software-engineer-observation-abc121-default-lane-ledger-23-of-23-placement-20-of-23-proposal-17a0830d.md
---

# Ruling on the Engineer's `A4` `chooseMove` saving: does NOT weaken what the row catches — recorded, NOT applied (QE does not change test behavior)

Hand-authored, no `seal`. The saving named in `…9bdce84b`: drop the reference deepening
(`reference = deepenTo(chooseMoveWithoutReductions, ...)` and the two equality assertions it
feeds, `shipped.score === reference.score` / move-label equal) from `A4`'s `chooseMove` row
(`src/search.pvs-lmr.test.ts:457-472`), keeping only `expect([shipped.score,
label(shipped.move)]).toEqual([95, "h5e5"])` and the `reSearches.length > 0` assertion.

## Reading

- `noLmrResearch-engine-only` and `noResearch-engine-only` — the two mutants this row is the
  ONLY default-lane guard for (`…17a0830d`) — both mutate the SHIPPED `chooseMove` recursion
  (`src/engine.ts`), not the reference door. Confirmed directly in this hop (`…8f303a8c`):
  applying `noLmrResearch` to both recursions reds exactly `A4`'s two rows via the literal
  mismatch — `shipped.score`/`shipped.move` come out wrong against the FIXED `[95, "h5e5"]`
  regardless of whether the reference is computed. Dropping the reference computation removes
  no detection here: the literal comparison is what fires, not the reference-equality check.
- The reference-equality check is demonstrably the WEAKER of the two, not the stronger one: the
  ledger's own `engine-door-withoutReductions-reduces` survivor (`…7f29f842`, "with the
  engine's reference reducing, it IS `chooseMove`, so the engine drift and `A4`'s engine row
  compare it with itself") shows a broken reference can equal a broken shipped path and pass a
  reference-based equality check while still being wrong. The fixed literal is immune to that
  failure mode; the reference-equality check is not. Removing it removes a comparison that was
  already shown, elsewhere in this build, to self-cancel under the right bug.
- No variant in the 23-mutant ledger is caught ONLY through `A4`'s reference-vs-shipped
  equality and not through the literal. The door-correctness mutants
  (`door-withoutReductions-reduces`, `engine-door-withoutReductions-reduces`) are caught by
  their own dedicated rows (the kp-vs-k identity guard, "the engine doors bite"), not by `A4`.

## Ruling

The saving does **not** weaken what `A4`'s `chooseMove` row catches for any of the 23 planted
variants. It removes a redundant, and separately shown to be foolable, comparison, and it saves
the cost of one extra `deepenTo(chooseMoveWithoutReductions, ...)` call. The one open cost: a
hardcoded literal does not self-correct if the CORRECT answer ever legitimately changes (a
future fix elsewhere shifting `A4_FEN`'s true score) — that is a maintenance property of any
pin, not a coverage weakening against the current mutant set, and the row is already a pin
(`toEqual([95, "h5e5"])`) regardless of whether the reference call stays.

**Not applied.** Per this subtask's fence (zero lines under `src/`) and the QE role's hard
limit (test behavior is reported on, not changed), this ruling is recorded for the owner or the
Engineer to apply, not executed here.
