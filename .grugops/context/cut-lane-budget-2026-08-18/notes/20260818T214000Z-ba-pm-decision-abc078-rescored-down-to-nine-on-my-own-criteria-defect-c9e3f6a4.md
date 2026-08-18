---
id: 20260818T214000Z-ba-pm-decision-abc078-rescored-down-to-nine-on-my-own-criteria-defect-c9e3f6a4
kind: decision
by: ba-pm
at: 2026-08-18T21:40:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - NFR-004
  - NFR-005
  - N8-LANE
  - AR-NFR004-A
  - AR-N8LANE-078
  - AR-ENGINE-DOC
  - RF-1
  - RISK-002
  - ABC-108
  - plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
supersedes:
---

# `ABC-078` re-scored against the gate results: **10/10 → 9 of 10, ⚠️x1 on ITEM 4** — and the ⚠️ is MY defect, not the engineer's. Criteria state RECORDED, nothing resolved, nothing marked met that is not

**This is not a stamp.** Hand-authored `decision`; no `finding` is admissible on this install.
**BA/PM rules no NFR bar here.** `A1` is `NFR-004`'s and it is **already ruled** by Security/NFR;
this hop transcribes that ruling onto the page and does not re-open it.

## The ⚠️ — item 4, and I am the author of the defect

DoR item 4 asks whether acceptance criteria are **testable and measurable**. `A2` and `A4` are
both, and QE proved that **a compliant implementation can satisfy every word of them while
violating the property they name**:

- **`A4` (`G2`, HIGH).** Its four checks are **entirely textual** — source regexes, `Object.keys`,
  `Function.length` — and **not one of them runs a search**. A two-line `if (iteration > 4) break;`
  inside the deepening loop gives a hard depth-4 cap that passes `tsc`, `biome`, **1 016/1 016**
  default tests and **23/23** `ENGINE_DEEP`. `RISK-002` — this epic's non-negotiable inherited
  constraint — has exactly one guard on this page and it does not hold.
- **`A2` (`G1`, HIGH).** The ticket calls it *"the criterion that proves the clock is checked
  inside the recursion"*. On its own fixture the delivered build and a between-iterations build are
  **byte-identically indistinguishable** (depth 2, 360 nodes, `elapsedMs` 75, 4 clock
  consultations). `A3` kills that mutant, as an undeclared side effect.
- **`A5` inherits the blind spot** — its observed depths never exceed a cap at 4.

**A criterion that is measurable but measures the wrong thing is a vague criterion wearing a
number**, and letting one exit `Ready` is precisely the defect this role exists to catch. The
engineer built what the page asked for; the page asked for the wrong assertion. **Owned, not
routed.** **Discharge: the repair hop lands criteria and tests that detect what they name — at
which point item 4 returns to ✅ and not before.**

## What did NOT move, and why — both refusals matter

- **`A1` is not a DoR item and was not treated as one.** It is an `NFR-004` bar. The same fence the
  2026-08-18 `cut-frame-overflow` re-score set holds; the difference is that the bar has since been
  **ruled**, so the ruling is now recorded on the page.
- **Item 6 was deliberately NOT marked down for `ABC-108`.** `N8-LANE`'s 650 ms is a fixed catalog
  number, it was measured against, and it has not moved. **What `ABC-108` puts under question is
  the DERIVATION of that number, not its measurability** — and re-scoring every page in the
  repository on that would be the DoR used to express alarm. The exposure is recorded on `ABC-108`,
  which is where it is routable. **I considered marking it and decided against it; the reasoning is
  on the page so the next reader can disagree with it explicitly.**

## Criteria state, recorded and NOT resolved

Written onto the page as `## Criteria state after QE and Security/NFR — RECORDED, NOT RESOLVED`.
Nothing is marked met that is not, and **the repair hop in flight is named rather than assumed
done**.

| criterion | state |
|---|---|
| `A1` | **NOT MET.** Clause A not met — worst 3 027/3 030/3 031 ms across three hops, 27–29 of 30 over 3 s, worst overshoot **31 ms = 1.03%** → **`AR-NFR004-A`, LOW, owner Security/NFR at `EPIC-006`'s difficulty hop (`ABC-087` if earlier); discharge = pass ~2 900 ms or re-accept IN WRITING with the number, NEVER by editing the row.** Clause B **BREACHED** — 5 000 → 5 002 ms, 6 000 → 6 004 ms → **`RF-1`, MEDIUM, ruled owed BY THIS TICKET**, in the repair hop |
| `A2` | met as written; guard **bypassable** (`G1`, HIGH) — in the repair hop |
| `A3` | **MET**, discard genuinely guarded; `G4` says its coupling job is too thin |
| `A4` | met on delivered code; guard **bypassable** (`G2`, HIGH) — in the repair hop |
| `A5` | met; cannot see the `G2` cap |
| `A6` | **MET** — four identical `src/turn-loop.ts` blob hashes, delivered `src/` diff is two ADDED files, 0 modifications |
| `A7` | **MET** — 2 045 real-clock calls over 409 positions: 0 null, 0 throws, 0 illegal, 0 mutated |

Also transcribed, none of it BA/PM's to rule: **`NFR-005` measured BELOW its FAIL floor and the
floor NOT relaxed** — a WAYPOINT, due at the close of the last of `ABC-079`/`ABC-080`/`ABC-081`;
**`AR-N8LANE-078`** (~840 ms vs 650 ms = 1.29x, LOW, owner Architect/Design, **discharge is
`ABC-108`**); **`AR-ENGINE-DOC`** (LOW, owner the `RF-1` repair hop). Security review **checked, not
inherited**: no ASVS L1 requirement fails, verdict `PASS_WITH_RISKS` rather than `BLOCKED` because
the only required fix is MEDIUM and `security.block_on` is `high`.
