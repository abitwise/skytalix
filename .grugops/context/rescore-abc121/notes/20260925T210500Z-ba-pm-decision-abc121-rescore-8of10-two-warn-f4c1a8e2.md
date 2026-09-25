---
id: 20260925T210500Z-ba-pm-decision-abc121-rescore-8of10-two-warn-f4c1a8e2
kind: decision
by: ba-pm
at: 2026-09-25T21:05:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-080
  - ABC-081
  - ABC-122
  - ADR-0026
  - plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md
  - .grugops/context/ruling-abc121-lmr-oracle/notes/20260925T141021Z-architect-design-decision-r1-identity-rows-stay-binding-against-pre-abc121-doors-c41d9e07.md
  - .grugops/context/ruling-abc121-lmr-oracle/notes/20260925T141121Z-architect-design-decision-r2-lmr-on-is-judged-by-bounded-drift-mate-floor-and-depth-5e92b7a0.md
  - .grugops/context/ruling-abc121-lmr-oracle/notes/20260925T141221Z-architect-design-decision-r3-both-recursions-at-once-one-ticket-pvs-commit-first-7a4c19e3.md
  - .grugops/context/ruling-abc121-lmr-oracle/notes/20260925T141321Z-architect-design-decision-r4-adr0026-proposed-and-what-the-owner-decides-e61f2d84.md
supersedes:
---

# `ABC-121` re-score: R1–R4 folded in, 8/10, still NOT MET — two ⚠️, neither BA/PM's to close

Hand-authored, no `seal` (degraded posture per `AGENTS.md`: `scripts/context-io.ts` /
`scripts/claim.js` / `mcp__grugops__propose_note` are absent from this install and
`context.human_admission` is `off`, so no `finding` is admissible; recorded as `decision` per
`agent-factory/contracts/context-note.md`).

## What changed on the ticket page

Folded Architect/Design's `ruling-abc121-lmr-oracle` (task `wave-2026-09-25`, R1–R4) and
`ADR-0026` (**proposed**) into `plans/tickets/ABC-121-principal-variation-search-late-move-reductions.md`:

- **Scope** gained the test-oracle shape: two switches (`pvs`, `reductions`) in both recursions,
  four test-only doors, one exported pure reduction predicate, the mechanical re-pointing of
  every existing work row to the pre-`ABC-121` door of its own recursion, and the two-commit
  build order (PVS first, then the predicate + LMR), per R1/R3.
- **`A1`** replaced the ticket's original generic 50 cp / 95% bound (measured 100%, no
  ceiling) with R2's measured bar: 0 mate flips (hard), ≥ 95% within 25 cp, ≤ 75 cp max —
  measured this hop at 98.40% / 99.47% (d4/d5), max drift 50 / 45 cp.
- **`A2`** gained a clock-free companion (cumulative nodes to depth 7 vs. the 3 s node capacity)
  alongside the existing wall-clock reading, per R2.
- **`A3`** narrowed to the one-predicate mechanism (table-driven test + a source assertion both
  recursions route through it), per `ADR-0026` decision 6.
- **`A5`** narrowed to the two named positions (kiwipete 80.2%, position-6 70.8%), with
  position-4 named as the counter-case that grows under PVS, per R2.
- **Dependencies** dropped `ABC-080`/`ABC-081` (now `Done`) and added `ABC-122` (gate hardening,
  `In Development`, named by the ruling as landing first) and `ADR-0026`'s pending acceptance,
  with the concrete fallback cost if the owner declines (two merged bars, `ABC-080` `A3` and
  `ABC-081` `A3`, would need re-levelling; `ABC-078` `A3` stops holding as a cross-recursion
  identity).
- **`N8-LANE`** now names the new rows' default-lane cost as `UNKNOWN - verify` (the ruling only
  timed deep-shaped passes, under load), not silently assumed clear.
- **Test notes** gained a fifth: the Engineer lists every re-pointed row, QE checks the list
  against the tree.

## DoR re-score: 8/10, two ⚠️

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope clear | ✅ |
| 3 | INVEST-shaped | ⚠️ not independent — `ABC-080`/`ABC-081` are `Done`, but `ABC-122` is `In Development`, not `Done`, and the ruling names it as landing first |
| 4 | acceptance testable and measurable | ✅ six, `A1`/`A2` now carrying measured bounds, `A3`/`A5` tightened |
| 5 | dependencies known | ✅ `ABC-122` named as the new blocker; `ADR-0026`'s pending status named with its fallback cost; `ABC-084` non-blocking |
| 6 | security/NFR triggers, measurable target | ✅ `NFR-005` (+ clock-free companion), `N8-LANE` (cost `UNKNOWN - verify`, named honestly) |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `M` (3), unchanged — the ruling explicitly declines `SPLIT_REQUIRED` for the oracle plumbing |
| 9 | priority assigned | ✅ `P1`, unchanged |
| 10 | no major unresolved blocker | ⚠️ `ADR-0026` is `proposed`, not accepted; this ticket's whole oracle shape is built against it |

**8/10, 2 ⚠️, NOT MET. Stays in `Backlog`.** Item 3 closes when `ABC-122` reaches `Done` (a
dependency, not a defect). Item 10 closes only on the owner's word on `ADR-0026` — this ticket
does not start building against a proposed design. Neither ⚠️ is smoothed away or forced closed
here.

## What this note does NOT do

- It does not accept `ADR-0026` — that is the owner's word (Ruling 4), unchanged by this
  re-score.
- It does not move `ABC-121` on `plans/board.md` — the fence on this subtask excludes
  `plans/board.md`; the Orchestrator makes that move once both ⚠️ close.
- It does not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, or any ADR file — all excluded
  by this subtask's fence.
