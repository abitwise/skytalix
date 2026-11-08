---
id: ABC-308
title: "E5c: outposts. A knight or bishop on a square no enemy pawn can attack, defended by a pawn, earns a tapered term. Split from ABC-292 by ADR-0076 d1. Held: no build; it waits for a third pull that names it or a case of its own"
status: backlog
column: Backlog
size: S–M
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's), when the hold lifts: a new ADR on main's tapered evaluation, form (b) if on hand values: the definition, the rank zone, the anchor and the rule, the memo words and their bytes, and the G2 ratio. ADR-0076 d1 split it off and decides nothing else about it. A new ADR is the owner's to accept (reading (b))"
---

# ABC-308: outposts (E5c)

> **Split from `ABC-292` 2026-11-08 by BA/PM: DoR 9/10, Backlog, HELD, NO BUILD** (task `bapm-ABC-292-accept`, records only, at `main` `6eaeee01`; nothing run). Source: `ADR-0076` d1,
> accepted by the owner (`orch-2026-10-30a` `…23d30c72`): "The split rule fires … BA/PM cuts outposts as a held page in `ABC-306`'s form." The id was checked free on every local ref
> and every worktree at the cut. "E5c" follows `ABC-292`'s split rule (E5a…E5d), with E5d already `ABC-306`.
> - **Why it left `ABC-292`** (`ADR-0076` d1): of the three terms it is the only one that needs per-minor work in the walk, two more memo words and new work on the miss path: about 720 896
>   bytes against 589 824, two more reads per hit, a rank-zone judgment, and about half the seam rows. Its nearest anchor is an analogy to `ISOLATED`'s 10, and at that value the term moves
>   little for the most cost. The ADR gives it a different form and order from the two terms that stayed.
> - **Hold:** no hand values now, no build.
> - **Re-open trigger:** a yes to a third pull that names it, or a case of its own the Architect records. Neither exists today. **No date.** Nothing here rules that it will never come.
> - **The owner's stop ruling** (`…23d30c72`) names `ABC-290` and `ABC-293`, not this page. `ADR-0076` d14 (c) does not bar outposts, which have not been read. **Whether a re-open on
>   hand values sits on "the hand-valued path" after a miss on `ABC-292` is not ruled on any record**, and this page does not rule it: it is the Orchestrator's to read, or the owner's.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every middlegame.
- **Pain, read on `main`** (`src/evaluate-params.ts`): no outpost term. A knight or bishop on a square no enemy pawn can attack, defended by a pawn, scores as any other square of its table.
- **History:** never tried (`…ba8265e9`). It sat on `ABC-292` from its cut (`bapm-epic011-areas`, `181da9e3`) to `ADR-0076`.
- **Value:** a share of `ADR-0056` D2 row E5's **+30–80 Elo**, an estimate for the whole row, per-piece mobility included. This term's share is `UNKNOWN - verify`.

## Scope

The ADR governs each line. Outposts (a knight or bishop on a square no enemy pawn can attack, defended by a pawn), tapered, by the ADR's definition, its rank zone and its rule.

## Out of scope

- `ABC-292`'s two terms (the bishop pair, rooks on open and semi-open files), per-piece mobility (`ABC-306`), threats (`ABC-293`), king attack (`ABC-290`), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **On its own case, by hand values:** `ABC-292`'s form (b) list by reference (`ADR-0076` d9's K rows, in this term's own ADR's words), `G3`'s relation rows and `ABC-083` A4 (mobility
  within ± 100 cp) included. Intent and `G2` ratio are its ADR's.
- **Through a third pull that names it:** the route is the Architect's at that yes. `ADR-0076` d14 (b): outposts count at the third-pull door only if they merge one day.
- **No second set of values after a miss** binds this term only if he accepts that in its own ADR (`…c1623ae7`: each later term's ADR asks him).

## NFR triggers

- **`NFR-001` / `G2`:** at or below its ADR's ratio; outposts cost per call (`…ba8265e9`, `ADR-0076` d1). **`NFR-005`:** `G6` under `Q-3K-4` (b).
- **`NFR-009`:** two more memo words, about 720 896 bytes against 589 824 by `ADR-0076` d1's arithmetic, `UNKNOWN - verify`, its ADR's; ≤ 16 MiB in all.
- **`NFR-008`** (≤ 10 s): ≤ +0.10 s on the lane for a later term, the Orchestrator's line (`…aab9afd1`).

## Test notes

1. QE freezes the seam fixtures and the rows before the probe and the build, in `ADR-0076` d10's order, and the Orchestrator checks the freeze's ancestry before any build dispatch. The gate is
   on the dispatch: it adds no bar and no DoR row.
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S–M,** one term, to be re-read at the ADR (per-minor work in the walk, two memo words, a rank zone; `ADR-0076` d1). **Priority: P3,** held.

## Dependencies

- **The re-open trigger above. The ADR.** DoR row 10.
- **Not on `ABC-292`:** nothing there waits on this page, and this page waits on nothing there except where the owner's stop ruling may reach it (the banner).
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`, `ABC-292`, `ABC-293`, `ABC-294`, `ABC-306`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ no outpost term on `main`; the value is an estimate |
| 2 | scope and out-of-scope | ✅ one term |
| 3 | INVEST | ✅ S–M; one term, split from `ABC-292` by `ADR-0076` d1 |
| 4 | testable, measurable acceptance | ✅ `ABC-292`'s form (b) list by reference; counts owed with the ADR |
| 5 | dependencies known | ✅ the trigger; the ADR; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` at the ADR's ratio; `NFR-005` `G6`; `NFR-009` ≤ 16 MiB; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S–M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **held:** no third pull that names it and no case; the ADR is owed |

**DoR 9/10. Backlog, held.**
