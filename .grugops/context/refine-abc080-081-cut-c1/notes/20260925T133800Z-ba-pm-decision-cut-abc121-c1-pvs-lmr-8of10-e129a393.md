---
id: 20260925T133800Z-ba-pm-decision-cut-abc121-c1-pvs-lmr-8of10-e129a393
kind: decision
by: ba-pm
at: 2026-09-25T13:38:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ABC-080
  - ABC-081
  - ABC-084
  - NFR-005
  - 20260925T081016Z-architect-design-decision-r5-depth6-path-and-candidate-tickets-2ba4fca3
supersedes:
---

# Cut `ABC-121` — Principal-variation search with late-move reductions (C1), from R5

**No sanctioned writer on this install** — same degraded posture as the sibling notes, not
re-derived here.

## Id chosen

`ABC-121` — checked `plans/tickets/`, `plans/board.md` and `git log --all --oneline` for every
`ABC-1[12]\d` id used on any branch; the highest in use anywhere is `ABC-120`
(`grugops/ABC-120-turn-loop-arms`). `ABC-121`/`ABC-122` appear on no branch, in no ticket file,
in no board row. `ABC-121` is free and is used exactly once.

## What was cut and why

R5's own candidate table ranks C1 (PVS + LMR) second by depth-per-point (0.33–0.50) among
`ABC-080` (0.67), `ABC-081` (0.33), C2 (~0.25), C3 (est.) and C4 (0), but the subtask names only
C1 for this cut — **C2, C3 and C4 are candidates, not cut**, and the new ticket page lists them
in its own `## Out of scope` rather than silently dropping them.

**Criteria are game-quality, not identity**, per R5's own instruction: "NOT value-preserving,
so an identity-with-`search()` criterion is wrong for it. It needs a game-quality criterion
instead, for example the tactical suite `ABC-084` names, or a bounded score drift against the
unreduced search." `A1` on the new ticket is written exactly that way: a bounded centipawn-drift
percentage plus a hard zero-tolerance no-mate-flip floor, explicitly NOT the
identical-scores bar `ABC-080`/`ABC-081` use.

**Dependencies are `ABC-080` and `ABC-081`**, as the subtask instructs — R5's own reasoning:
LMR's re-search ordering leans on `ABC-080`'s hash move, and `ABC-081`'s in-tree repetition is
`ADR-0002`'s correctness requirement, owed first regardless of C1's higher depth-per-point.
`ABC-084` (tactical puzzle suite) is named as a non-blocking option for `A1`'s corpus, not a
hard dependency — it is not one of the two dependencies this subtask names.

## Size, priority, DoR score

**Size `M` (3).** R5's own table reads `S–M (2–3)` for C1. `M` chosen over `S` because this
ticket owes the same measurement-discipline cost that made `ABC-080`/`ABC-081` `M` rather than
smaller: a game-quality corpus measurement (`A1`) and an instrumented reduction-safety check
(`A3`), not just a small control-flow change.

**Priority `P1`.** It insures the depth-6 floor's thin margin (`position-6` at 1.51x) and
reaches for the depth-7 WARN level, but the floor itself is `ABC-080`'s and `ABC-081`'s `P0`
work — this ticket is margin, not the floor.

**DoR: 8 of 10 clean, 2 ⚠️ — NOT MET; stays in `Backlog` behind `ABC-080` and `ABC-081`.**

- Item 3 (INVEST-shaped) ⚠️ — not independent, sits behind two open tickets (`ABC-080` and
  `ABC-081`, both `Backlog` at this cut, though `ABC-080` itself re-scores 10/10 Ready at this
  same cut).
- Item 10 (no major unresolved blocker) ⚠️ — `A1`'s 50 cp / 95% bound is a generic,
  not-measured-on-this-codebase figure, the same honest shape `ABC-080`'s original `A3` carried;
  flagged for re-leveling at this ticket's own build-time gate.
- All eight other items ✅ — problem, scope/fences, testable+measurable acceptance,
  dependencies named with reasons, `NFR-005`/`N8-LANE` triggers, test notes, size, priority.

Full DoR table on the ticket page.
