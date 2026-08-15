---
id: 20260815T143700Z-ba-pm-observation-gaps-with-severity-and-owner-and-what-i-refused-a1c5e883
kind: observation
by: ba-pm
at: 2026-08-15T14:37:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - Q4
  - Q5
  - Q8
  - G1
  - G2
  - A6
  - A8
  - N8-LANE
supersedes: 
---

# Every gap this hop leaves, with severity and owner — and the ones I deliberately did not take

**Numbered `B1`…`B3`** so they collide with nothing: the engineer hop's `G1`…`G8`, QE's `Q1`…`Q10` and the
fix hop's `E1`…`E4` all stand.

## Discharged by this hop

| # | status |
|---|---|
| **`E1`** | **CLOSED as a criterion decision.** `A6`(i)'s near-miss set is now complete over POSITION; measured to kill `endsWith` and `trim` while keeping `startsWith`/`toLowerCase` dead, and to accept **zero** of 138 on the delivered build. **The row itself is NOT yet written — the engineer implements it**, and it says it can do so within the hour |
| **`Q4`** | **CLOSED.** `A6`(ii)'s control counts **draws** against a **500** budget instead of counting survivors of a loop that cannot exit early. Measured: correct filter needs exactly 250 draws; `M17` exhausts the budget and reds instead of hanging |
| **`G2`** | **CLOSED.** The trigger says **TEN**, names the five criteria that force it, and records that an eleventh child is a defect |
| **`G5`** | **CLOSED.** `A1` asserts a byte-exact **tail** with no frame row before it |
| **`G7`** | **CLOSED.** `A12` points at Architect/Design's citation as supplied, not at the word "line" |
| **`G8`** | **CLOSED.** `A11` records with its machine in the task notes, per rule 2 |

## New gaps

| # | gap | severity | owner |
|---|---|---|---|
| **`B1`** | **`A6`(i)'s row does not exist yet — the criterion moved this hop and the instrument did not.** Between this commit and the engineer's, the page states a near-miss family the test file does not implement: `derived` is still 18 and `endsWith`/`trim` still ship green. **The ticket is HELD at the merge on `G1`, so nothing can ship into that window** — but if `G1` were answered tomorrow the page would over-state its own coverage | **HIGH while open** — it is `E1` at one remove, on the ASVS **V2.2.1 [L1]** surface that was this ticket's original BLOCK. It closes the moment the row lands | **Software Engineer.** The clause, the exact `nearMisses` shape, the 138/134 count trap and the four mutants are in my ruling and measurement notes; nothing needs rediscovering |
| **`B2`** | **`ABC-042` will read 328 lines against rule 2's ≤ 300 median target, and the reason is criterion count, not prose.** Acceptance plus the four ASVS bars is 172 lines (52%) and rule 2 says those stay. The only lever that reaches 300 is the split the page already names, and splitting a built, gated, held ticket to hit a prose target would be chasing the metric | **LOW**, and informational — it is evidence **for the owner's review of rule 2**, whose own control warns against buying shorter tickets with worse gaps | **BA/PM** at the next refinement, and **the project owner** for the rule's control reading |
| **`B3`** | **Two of QE's wording gaps were in my batch's neighbourhood and I did not take them: `Q5`** (bar 1b's regexes count occurrences, not call sites — a reviewer following the bar verbatim gets a **false RED** on the correct file) **and `Q8`** (`A8`'s stream ends with two newline BYTES because the frame's last row is empty; not a violation, but a reviewer running `tail -c 2` reopens a closed criterion). **Both are BA/PM's and both are one clause.** They were **not in this subtask's five** and I did not widen my own scope on a held ticket | **`Q5` LOW but live** (Security/NFR reads that bar first at any re-gate); **`Q8` LOW, informational** | **BA/PM** — one more wording hop, or fold them into the engineer's `E1` hop if the Orchestrator prefers one page edit to two |

## What I did NOT raise, so the list is not padded

- **`G3` (no `ABC-042` traceability row) and `G4` (the board move).** The subtask reserves both to the
  Orchestrator for the third time and says the reservation is deliberate. Named here only so a reader does
  not think they were forgotten. **I wrote neither `plans/board.md` nor `plans/traceability.md`.**
- **`G1` / `N8-LANE` at 2.00x.** With the project owner. My `G2` repair documents its driver — ten
  criteria-forced spawns — and moves nothing. My own lane delta is **+0.049 ms**, which is not a lane
  reading and must not be quoted as one.
- **`Q3`, `G6`, `E2` — `ADR-0011` clause 3, the licence comparator.** Architect/Design's, queued
  separately. `plans/nfr-catalog.md` and `ADR-0008` were not opened.
- **`E3` (`A9`(2) is entirely textual) and `E4` (the fix hop's harness fault).** Both already recorded with
  owners; I add nothing.
- **`Q10` (`A1`'s cold-clone path unproven).** UAT's, per QE, and `EPIC-006` is its destination.

## The judgement I want on the record, since it is the one a later hop might overturn

**I ruled `E1` as a coverage gap, and I ruled it at HIGH anyway.** The delivered build is correct — the
Orchestrator measured it and so did I — so nothing ships broken today. The severity is high because the
row that is supposed to stop this regression **is the row that already failed to stop it twice**, on the
one ASVS clause that blocked this ticket. **A criterion whose instrument cannot see the defect it names is
worth exactly as much as the next person's care**, and this ticket has three censuses proving how far that
gets. If a later hop wants to grade `B1` down and ship on the strength of the build being correct today,
every number in these notes survives that reading — only the urgency changes.
