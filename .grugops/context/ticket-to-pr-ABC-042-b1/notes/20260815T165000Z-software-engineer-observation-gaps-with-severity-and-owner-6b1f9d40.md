---
id: 20260815T165000Z-software-engineer-observation-gaps-with-severity-and-owner-6b1f9d40
kind: observation
by: software-engineer
at: 2026-08-15T16:50:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B1
  - B4
  - B5
  - S1
  - S2
  - S3
  - Q5
  - Q8
  - G1
  - E1
  - E4
  - N8-LANE
  - src/cli.test.ts
supersedes: 
---

# Every gap this hop leaves, with severity and owner

**Numbered `B4`…`B5`**, continuing BA/PM's `B1`…`B3` so nothing collides: the engineer hop's `G1`…`G8`,
QE's `Q1`…`Q10`, the fix hop's `E1`…`E4` and Security/NFR's `S1`…`S3` all stand.

## Discharged by this hop

| # | status |
|---|---|
| **`B1`** | **CLOSED.** `A6`(i)'s row implements the near-miss family complete over POSITION — 138 cases, 134 distinct, both pinned — and `A6`(ii) counts draws against a 500 budget. `endsWith` and `trim` no longer ship green: watched RED, with the old instrument as the control. **The page no longer over-states its own coverage**, which is the state this ticket has worked hardest to avoid |
| **`E1`** | **CLOSED as an instrument.** It was closed as a criterion decision by BA/PM; the row that makes it true now exists and was watched. Three further weakenings of the same class (`MX15`–`MX17`, aimed at the flags and the value words) also die |
| **`Q4`** | **CLOSED as an instrument.** The over-dropping CONTAINS filter reds in **1.6 s** with `expected 500 to be less than 500`, where the unbounded loop did not terminate in 30 s |
| **`S3`** | **CLOSED.** The literal scan covers template literals; `M2` dies. Zero false-RED risk measured (13 literals before, 13 after) |
| **`S2`** | **CLOSED.** Bar 3 locates the echoed token instead of reading line 0; `M3` dies, `M3b` stays dead, no new spawn |

## New gaps

| # | gap | severity | owner |
|---|---|---|---|
| **`B4`** | **`S1` is still open and now has a named blocker: `BAR 1b` has no in-suite instrument, and one cannot be written without first choosing "comment-stripped", which is `Q5`'s clause.** Measured at my own hand: the bar's regexes applied verbatim to the **correct** delivered file return **1 / 1 / 1** (all in its own docblock) at base and at my tip alike; comment-stripped they return **0 / 0 / 0**. So the property is MET and the only mechanical guard on the one file licensed to spawn is still **prose in a docblock** | **LOW** — `V1.2.5 [L1]` is MET today by two independent measurements, the file is bounded, and this is a drift guard, not a control failure. It is Security/NFR's own grading and I did not move it | **BA/PM first** (`Q5`, one clause — apply the regexes to comment-stripped text), **then Software Engineer** (~8 lines, ready to write; the numbers it will assert are in my `S1` note) |
| **`B5`** | **The near-miss family's residual is now a STATED residual, and it should not be read as closed.** A weakening that accepts only tokens at **edit distance ≥ 2** from every accepted spelling still survives the 138 — BA/PM said so when ruling, and I confirm it after building the row rather than only after reading the ruling. What changed is that the instrument's completeness has a **dimension** (every position, one edit) instead of a list of three transformations | **LOW, informational.** No live defect: the delivered build accepts 0 of 138 and is correct | **Nobody, yet** — this note is the record. It becomes BA/PM's only if a future census produces a live distance-2 survivor |

## Still open and NOT mine — carried forward unchanged

- **`G1` / `N8-LANE` at 2.00x** — **with the PROJECT OWNER, escalated and unanswered.** My lane delta is
  at the identity-null floor (+20 ms treatment, +20 ms null) and adds **zero spawns**. I neither improved
  nor worsened it, and this ticket stays HELD at the merge.
- **`Q3` / `G6` / `E2` — `ADR-0011` clause 3 and the licence comparator** — **Architect/Design's**, running
  concurrently on its own branch. `src/history-pane.nfr.test.ts` was **not opened for writing** and is
  byte-identical by md5 and blob SHA. I agree with QE's routing: asserting there would breach `A12` to
  protect `A12`.
- **`Q5`** (bar 1b's regexes) — **LOW, BA/PM.** Now blocking `S1`; see `B4`.
- **`Q8`** (`A8`'s stream ends with two newline BYTES) and **`B2`** (the page reads 328 against rule 2's
  300) and **`B3`** — untouched, BA/PM's and the owner's.
- **`Q10`** (`A1`'s cold-clone path) — **UAT's**, and I worked in a worktree with `node_modules`
  symlinked, so I did not touch it and could not have.
- **`E3`** (`A9`(2) is entirely textual) — **Security/NFR's**, unchanged.
- **`E4`** (my own harness's false SURVIVED) — **already fixed and applied again this hop**, with the
  instrument guard proving the treatment on disk before *and* after all 22 mutant runs. Recorded once
  more only because it is the reason this census can be believed.
- **`G3`** (`plans/traceability.md` has no `ABC-042` row) and **`G4`** (the board move) — **the subtask
  reserves both to the Orchestrator for the fourth time and says the resulting board move is not a gap I
  must report.** Named here only so a reader does not think they were forgotten. **I wrote neither file.**

## What I am NOT raising, so the list is not padded

- **The two `biome.json` lint infos.** Not mine, checked rather than inherited, and they predate this
  ticket.
- **The 138 cases costing 1 ms.** Measured, three orders below anything `N8-LANE` can see. Reporting it as
  a cost would be theatre.
- **`AR-1`'s C1/CSI class.** A ruled, owned, L2-out-of-scope risk. My `S2` repair deliberately asserts the
  same character class the bar names and does not widen it.
