---
id: 20261025T042840Z-architect-design-decision-912bcb0d
kind: decision
by: architect-design
at: 2026-10-25T04:28:40Z
verified_by: 
confidence: high on the ruling; options 1 and 3 and the forward question are the owner's
refs:
  - ABC-205
  - EPIC-008
  - NFR-005
  - ADR-0031
  - ABC-083
  - ABC-207
  - ABC-215
  - G6
  - S1
  - QE-205-a
  - QE-205-b
  - QE-205-c
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
  - qe-ABC-205/20261025T041540Z-qe-e2e-decision-234d9814
  - qe-ABC-205/20261025T041540Z-qe-e2e-observation-35de132c
  - qe-ABC-205/20261025T041540Z-qe-e2e-failed-attempt-a44d9079
  - qe-ABC-205/20261025T041730Z-orchestrator-decision-4561be39
  - owner-word-2026-10-24/20261024T093000Z-orchestrator-decision-4c3f7639
  - grugops/arch-rule-ABC-205-g6
  - ffa0a5e8
  - b5d5cea5
  - d5690c5c
  - owner-delegation-2026-10-22/20261022T140148Z-orchestrator-decision-5aaf7cec
  - arch-rule-ABC-205-stop/20261023T231000Z-orchestrator-failed-attempt-c3d204a5
supersedes: 
seal: sha256:126fb4e9d469c9a4d12b8e0c5450c148dd1e53cbc128d788cb9dc5defa6add8b
---

# Architect/Design: ABC-205 G6 STOP ruled. The miss is real and no variant clears it. Recommend option 2: close ABC-205 unmerged under S1. "≥ base" is the owner's, and a forward question goes to him

Task `arch-rule-ABC-205-g6`, records only. Branch `grugops/arch-rule-ABC-205-g6` from `grugops/qe-ABC-205` `ffa0a5e8`.
Inputs: QE `…234d9814`, `…35de132c`, `…a44d9079`; Orchestrator `…4561be39`; owner rule `…4c3f7639`; the page
§ Design ruling (`A5`, `G6`); `ADR-0031` decision 4 and § Addendum `A5`. Probes: this task's observation note.

## The ruling
- **QE-205-a stands. It is not a measurement artefact.** The cause is deterministic. Head needs +4.89 % nodes to
  complete depth 8 on position-6, and it searches 1.84 % fewer nodes in 3 s. Base sits within ±0.5 % of its own
  depth-8 edge.
- **The forms are not defective.** `A1`–`A4` and `A7` are MET. The floor (6) and the WARN level (7) hold on both boards.
- **No variant of the accepted forms is predicted to clear "≥ base".** The gate carries the growth (+3.2 to +5.0 %
  on every gate-on row). Gate-off variants need a throughput cost below 0.57 % (`s3-B`) or 0.15 % (`s3`). Head's is
  1.84 %.
- **QE-205-b is closed as substituted.** The frozen-clock counts answer the question the same-session readings would
  answer. Taking those readings now would repeat G6, so none is owed.
- **QE-205-c is real, and it is not ABC-205's alone.** It goes to the owner as a forward question (below).
- No level moves here. Nothing is re-derived (`ADR-0031` decision 4). No reading is owed by this ruling.

## Option 1: ship a changed build
- **What changes.** One of three forms:
  - `s3` (scale only): drops the taper, so `A2` and `A3b` red;
  - `s3-B` (scale and blend, no gate): drops the gate, so `A3b` reds;
  - a re-tune (`s2-BG`, the page's 3 → 2): keeps every row.
- **Node cost, position-6 to depth 8, against base 1 451 759:** `s3` −0.08 %; `s3-B` −0.51 %; `s2-BG` +4.10 %;
  head +4.89 %. Kiwipete is a tie at depth 7 for every variant.
- **Evidence.** Every variant is predicted to miss "≥ base" whenever base's median is 8. `s2-BG` needs more nodes
  than base's best 3-s run searched, so it reaches depth 8 only if it searches faster than base. Gate-off variants pass only if their eval is nearly free, and their throughput cost is
  `UNKNOWN - verify`.
- **What it needs:**
  - BA/PM: a scope change (scope item 2, in whole or in part) and the one re-tune round under S1;
  - the owner: an amendment of the accepted `ADR-0031` addendum `A2`/`A3` text;
  - the owner: new real-clock runs beyond `…4c3f7639`'s four;
  - the Engineer: the build and its re-pins;
  - QE: a gate pass, then a new G6 session (about 2 min plus preconditions);
  - QE, after a G6 pass: D, 400 games at B = 1 500 ms (about 6–12 h), plus one pooled 400-game extension if NEUTRAL.
- **Who decides.** The owner (runs and ADR text), BA/PM (scope), Architect/Design (forms).
- **Not recommended.** It spends an owner exception on a predicted FAIL. Choosing a constant that shrinks this one
  board's tree tunes to the benchmark: scale 2 alone reads +5.00 %, and scale 3 alone reads −0.08 %.

## Option 2: close ABC-205 unmerged (recommended)
- **What changes:**
  - ABC-205 goes back to BA/PM, who closes it under S1 ("anything else is NOT MET … closes or re-cuts it");
  - the failed attempt is already sealed (`…a44d9079`);
  - `grugops/ABC-205-final` stays unmerged, so rollback is a re-open;
  - D is not owed: there is no build to measure. The Orchestrator rules it;
  - the `ADR-0031` addendum gets a dated status line after the close: "accepted, not shipped: `G6` STOP". Architect/Design
    writes it then.
- **Cost.** 0 nodes and 0 time. It saves D's 6–12 h.
- **What EPIC-008 loses:**
  - proposal 1, the largest measured cause in game 1: 721 of 1 428 cp, over three moves;
  - a candidate source for M1 (≥ +100 Elo);
  - nothing in M2 or M3: nothing ships unmeasured;
  - `G11` (reported, never graded): head changed 2 of 5 choices (4.Qa4 → d3, 13.d4 → Ng4).
- **What EPIC-008 gains:**
  - `ABC-207` and `ABC-215` name "`ABC-205` closed under S1" as their Ready trigger, so both unblock on `main`;
  - no revert of the restore commit is owed (`…c3d204a5`);
  - the forms and their rows stay on the branch for a later re-cut.
- **Evidence.** The owner's rule: "a NOT MET result is graded as the ticket's rules say (e.g. no GAIN → ABC-205
  does not ship)". The page grades a G6 miss as a STOP, with no re-level.
- **Who decides.** BA/PM closes. The Orchestrator makes the delivery call under `…5aaf7cec`, and the owner is told.
  His veto stays open.

## Option 3: a reading of "≥ base" (the owner's)
- **Whose.** "≥ base" is `EPIC-008` `G6`'s non-regression clause, from `ABC-083` `A7`, filed under `NFR-005`. The
  owner accepted it as a STOP in the `ADR-0031` addendum `A5`. The catalog bound itself (≥ 6 FAIL, 7 WARN) is MET.
  Only the owner moves either one.
- **Readings, as named (none is applied here):**
  - **3a, as written** (median depth per board): FAIL. This ruling stands on it.
  - **3b, the catalog bound only:** MET. It drops `A7`'s non-regression rule for ABC-205.
  - **3c, a tolerance when base straddles two depths** (for example, head's median ≥ base's lowest run): MET (7 ≥ 7).
  - **3d, a frozen-clock instrument** (nodes to the depth base completes): FAIL at depth 8 (+4.89 %), MET at
    depth 7 (−4.01 %). It needs a further rule to pick the depth.
- **Cost.** 0 nodes. If one is applied to ABC-205, D on `b5d5cea5` is owed (6–12 h). Whether D falls inside
  `…4c3f7639`'s one run is the owner's word.
- **Not recommended for ABC-205.** Any of 3b–3d chosen after the reading moves the goal after the result.

## The forward question for the owner (QE-205-c; it is not a condition of option 2)
- **The problem.** Base sits on its position-6 depth-8 edge. Any evaluation change that costs over about 0.5 %
  throughput fails "≥ base" by the median, unless it shrinks that one tree. `ABC-207` (mobility) costs more than
  this ticket. `ABC-215` reshapes the tables. Each has only one reading.
- **Why it matters.** In `EPIC-008`, D measures what a lost ply costs in games. `A7` predates D, as the criterion
  "that notices" a leaf cost.
- **The question.** Does "≥ base" stay graded for later `EPIC-008` tickets, or does `G6` grade the floor and the
  WARN level and report "≥ base", with D as the judge?
  - Default without an answer: "≥ base" stays graded as written.
- **A procedure step that needs no owner word.** Before any later `EPIC-008` ticket spends its real-clock reading,
  QE reports frozen-clock nodes to depths 7 and 8 on both boards, base and head. A head count above base's at a depth
  base straddles predicts a G6 miss. That is a STOP before the run, not a re-level. BA/PM writes it into the tickets.

## Next move
- **Orchestrator:** take option 2 to BA/PM and tell the owner. Bring him the forward question. Rule that D is not owed.
  ABC-205 stays Blocked until BA/PM closes it.
- **This branch carries `b5d5cea5`'s `src/` diff (7 files) against `main`.** Do not merge it as records. Take the
  records commit alone.
