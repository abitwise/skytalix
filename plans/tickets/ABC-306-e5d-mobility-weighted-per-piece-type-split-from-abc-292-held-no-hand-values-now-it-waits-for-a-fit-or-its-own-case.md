---
id: ABC-306
title: "E5d: mobility weighted per piece type in place of one shared weight (a re-try of dropped ABC-207), split from ABC-292. Held: no hand values now; it waits for a fit or its own case"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "owed (the Architect's), when the hold lifts: an ADR-0031 change: per-piece mobility against ADR-0031 D2's attack-map form and MOBILITY_CAP, the form, and the G2 ratio. A new or changed ADR is the owner's to accept (reading (b))"
---

# ABC-306: mobility per piece (E5d)

> **Split from `ABC-292` 2026-11-05 by BA/PM: DoR 9/10, Backlog, HELD** (task `bapm-wait-lines-1105`, records only, at `main` `a38315bf`; nothing
> run). Source: `ABC-292`'s split rule, fired by the order the Orchestrator accepted (`…ba8265e9`, brief `bapm-wait-lines-1105`). The id was
> checked free on every local ref at the cut.
> - **Hold:** per-piece mobility is the one part of E5 that has already lost on hand values, so it should wait for a fit or its own case
>   (`…ba8265e9`).
> - **Re-open trigger:** a third pull he has said yes to, or a case of its own recorded by the Architect. Neither exists today, and no date is set.
> - **The board move is the Orchestrator's.**

## Problem

- **User:** every middlegame.
- **Pain, read on `main`** (`src/evaluate-params.ts`): mobility is one shared weight (`MOBILITY_WEIGHT` mg 4 / eg 4, `MOBILITY_CAP` 100) for every
  piece type.
- **History:** `ABC-207` (mobility per piece with hand weights) lost, −18.3 ± 16.5, and was dropped (`EPIC-008`).
- **Value:** a share of `ADR-0056` D2 row E5's **+30–80 Elo**, an estimate for the whole row. This term's share is `UNKNOWN - verify`.

## Scope

The ADR governs each line. Mobility weighted per piece type, against `ADR-0031` D2's attack-map form, with `MOBILITY_CAP` as the ADR rules.

## Out of scope

- `ABC-292`'s three terms, an early-queen term (`ABC-207`'s other half), tuning itself.

## Acceptance criteria

The ADR fixes exact counts before Ready. None is loosened after Ready.

- **On its own case, by hand values:** `ABC-292`'s form (b) list by reference, `G3`'s relation rows and `ABC-083` A4 (mobility within ± 100 cp) included.
- **Through a fit:** ~~**how is `UNKNOWN - verify`.** `ADR-0056` D2's dated line supersedes "structure at 0" for row E5, and a fit can weigh only a term on
  `main`. The Architect's, when the hold lifts.~~ *2026-11-05 (`bapm-ABC-291-lines`; `ADR-0075` d11 (b), accepted, in force at `ABC-291`'s merge): **only on a yes that names it. The Architect writes the route at that yes.** The hold
  stands, and nothing is built now. The route: per-piece weights land value-identical, every piece at the shared `MOBILITY_WEIGHT` (not at 0), so the fit has a term on `main` to weigh. It needs its `ADR-0031`
  change and one dated line beside `ADR-0056` D2's supersession, since it is form (a) in substance. It would have no read of its own, so it fails `ADR-0067` test 2 as written: his yes must name it, or it stays
  out of the free set. Whether the tracer's single `clamp(W · m)` fits a weight per piece is `UNKNOWN - verify`, that ADR's. **So the re-open trigger's "a third pull he has said yes to" reads "a yes that names
  this term" on this route; the ADR holds.***
  *2026-11-07 (`bapm-terms-after-291`; `ADR-0075`'s dated block of `arch-ABC-291-closed`, `…8cc32a89` § 1, `…aab9afd1`): **"in force at `ABC-291`'s merge" has no merge left to wait for.** `ABC-291` is NOT MET, and `ADR-0075` stays accepted, not in force. **d11 (b) stands, not struck, by the Orchestrator's ruling,** so the route above stays this page's and the struck words do not return. The hold and the re-open trigger are unchanged. d11's readings stay open to overruling at any third-pull call.*

## NFR triggers

- **`NFR-001` / `G2`:** at or below the ADR's ratio; per-piece mobility costs per call. **`NFR-005`:** `G6` under `Q-3K-4` (b).
- **`NFR-008`** (≤ 10 s): units only. **`NFR-009`:** no new table expected.

## Test notes

1. QE freezes the seam fixtures and the rows before the build.
   *2026-11-07 (`bapm-terms-after-291`; `…aab9afd1`, `…32c023cc`, `ADR-0075`'s dated block of `arch-ABC-291-closed`): **the freeze is a gate before the build.** This term's build waits for QE's freeze of the seam fixtures and the rows, and the Orchestrator checks this ticket for it before any build dispatch. `ABC-291`'s freeze came after its build (K1 (c)), the fourth such miss. The gate is on the dispatch: it adds no bar and no DoR row, and this note's words stand.*
2. UAT is owed (production lines); the QE verdict signs it.

## Size and priority

- **Size: S,** one term, to be re-read at the ADR. **Priority: P3,** held.

## Dependencies

- **The re-open trigger above. The ADR.** DoR row 10.
- **One at a time on `src/evaluate.ts` / `src/evaluate-params.ts`** with `ABC-272`, `ABC-290`–`ABC-294`.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ one shared weight; `ABC-207`'s loss; the value is an estimate |
| 2 | scope and out-of-scope | ✅ one term |
| 3 | INVEST | ✅ S; one term, split from `ABC-292` |
| 4 | testable, measurable acceptance | ✅ `ABC-292`'s form (b) list by reference; counts owed with the ADR |
| 5 | dependencies known | ✅ the trigger; the ADR; the shared files |
| 6 | NFR triggers with targets | ✅ `G2` at the ADR's ratio; `NFR-005` `G6`; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 1–2 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **held:** no fit and no case; the ADR is owed |

**DoR 9/10. Backlog, held.**
