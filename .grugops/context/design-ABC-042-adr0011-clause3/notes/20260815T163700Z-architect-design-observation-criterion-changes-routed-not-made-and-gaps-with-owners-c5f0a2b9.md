---
id: 20260815T163700Z-architect-design-observation-criterion-changes-routed-not-made-and-gaps-with-owners-c5f0a2b9
kind: observation
by: architect-design
at: 2026-08-15T16:37:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G6
  - Q3
  - E2
  - R5
  - A9
  - A12
  - ADR-0011
  - src/history-pane.nfr.test.ts
supersedes: 
---

# Every criterion change I am ROUTING rather than making, and every gap this hop leaves — with severity and owner

**Numbered `D1`…`D3`** so they collide with nothing: the engineer hop's `G1`…`G8`, QE's `Q1`…`Q10`, the
fix hop's `E1`…`E4` and BA/PM's `B1`…`B3` all stand. **I edited no ticket and no criterion.**

## Criterion changes ROUTED, not made — ZERO of them are on `ABC-042`

**No criterion on `ABC-042` moves as a consequence of any ruling on this hop, and that is a result
rather than an omission.** The struck clause-3 sentence never blocked the ticket and the replacement
does not unblock it — the property was satisfied throughout, `A12` is checkable exactly as written, and
`A9`'s scope is ruled correct as delivered. **`A12` is NOT widened.**

| # | change | owner | why it is routed and not made |
|---|---|---|---|
| **1** | **A new ticket carrying TWO sites in ONE file, `src/history-pane.nfr.test.ts`, zero production lines:** (a) the comparator drift tripwire at `:335` (`Q3` / `ADR-0011` `R5`), priced at ~4 lines in the block at `:437-443`; (b) the licence docblock at `:196-199`, which restates the sentence this hop **struck** from `ADR-0011` clause 3 | **BA/PM** writes the rows; the **Engineer** builds them | `A12` bars that file to *"one element … plus its citation … and nothing else"*. Both sites are the same file, the same review and the same `XS`. `ADR-0011`'s own precedent for a stronger guard is *"a new row on a new ticket, not a change to this one"* |

**Nothing else is owed.** I checked `A2`, `A3`, `A9`, `A10`, `A11` and `A12` against the three rulings
and none of them moves.

## New gaps

| # | gap | severity | owner |
|---|---|---|---|
| **`D1`** | **`ADR-0011` clause 3's struck sentence is still live in the tree** at `src/history-pane.nfr.test.ts:196-199`, verbatim. Until the routed row lands, the ADR and the instrument's own docblock disagree — a reader at the declaration site gets the **struck** admission test, which is the one place a hop adding a third licence entry will actually be looking. **The amendment names this site and routes it rather than leaving it to be found** | **LOW while `ABC-042` is held; MEDIUM the day a THIRD licence entry is proposed** — that is the moment the wrong sentence is read at the moment it matters | **Architect/Design** owns the ruling; **BA/PM** owns the row; **the Engineer** the edit. It is routed above |
| **`D2`** | **The clause-3 admission test is not machine-checkable and cannot be made so cheaply.** The equality catches an unlicensed importer and a stale licence; it does **not** catch a *wrongly licensed* one — a hop adding a bad import and its licence entry in the same commit is green on every instrument in the repository. The gate is a human or agent reading the clause plus review, and this hop replaced a broken sentence with a better one **without** changing that fact | **MEDIUM, structural and long-lived.** Not new — `R2` already records the licence's silent over-listing on the same surface — but it has never been stated as a whole, and `R5` makes the third hole in the same declaration | **Architect/Design.** No repair is proposed here and none is cheap: a mechanical admission test would have to decide "necessity", which is a design judgement. **Recorded so the licence is not read as more mechanical than it is** |
| **`D3`** | **A precedent risk I am creating and will not pretend away:** a future hop can cite *"Architect/Design moved clause 3 at `ABC-042`"* as licence to move it again, toward the wide reading the amendment refuses. Three things bound it — the wide reading is refused **by name and priced in the file**, the struck text is **preserved not deleted**, and the separating test (property vs description) is written down — **and none of the three is a proof** | **LOW**, and it is the price of amending rather than a defect in the amendment | **Architect/Design**, at the next hop that opens clause 3 |

## Carried forward unchanged, and NOT mine

- **`G1` / `N8-LANE` at 2.00x** — with the project owner, escalated. **I touched neither
  `plans/nfr-catalog.md` nor `ADR-0008`**, and nothing on this hop moves a bar or a lane figure by a
  microsecond.
- **`B1`** (`A6`(i)'s row exists on the page and not yet in the instrument) — the Engineer's, per BA/PM.
  Nothing here touches `A6` or `src/cli.test.ts`.
- **`E1`, `E3`, `E4`, `Q4`, `Q5`, `Q8`, `Q10`, `B2`, `B3`** — untouched, with their owners.
- **`G3`** (no `ABC-042` traceability row) and **`G4`** (the board move) — **the Orchestrator's, reserved
  for the fourth time on this ticket.** Named only so a reader does not think they were forgotten. **I
  wrote neither `plans/board.md` nor `plans/traceability.md`.**

## What I am NOT raising, so the list is not padded

- **`R1`–`R4`.** Unchanged, unmoved, re-read at this hop and none is implicated by the amendment. `R1`'s
  `EPIC-006` expiry still does **not** arrive with `ABC-042` — clause 4 forbids rooting the entry point,
  so the frame path does not become a real closure — which my `design-ABC-042-stderr` hop already
  recorded and I am not re-deriving.
- **The `ADR-0012` id.** Still free; `memory-bank/00-index.md` still reads `ADR-0001`–`ADR-0011` and is
  still true, so it was not opened.
