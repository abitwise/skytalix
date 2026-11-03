---
id: 20261103T221451Z-architect-design-decision-e67d5db6
kind: decision
by: architect-design
at: 2026-11-03T22:14:51Z
verified_by: 
confidence: high on the folds (each is the owner's verbatim word or an accepted ADR's own text); medium on the B-T4 reading (flagged in § 3 for the Orchestrator)
refs:
  - arch-owner-answers-1103b
  - grugops/arch-owner-answers-1103b
  - ADR-0068
  - ADR-0069
  - ADR-0024
  - ADR-0067
  - ADR-0065
  - ADR-0064
  - ADR-0056
  - ADR-0053
  - ADR-0028
  - ABC-270
  - ABC-239
  - ABC-272
  - ABC-274
  - ABC-271
  - Q1
  - E3
  - E3a
  - EPIC-011
  - B-T4
  - B-T5
  - B-T7
  - B-T8
  - Q-3K-6
  - Q-3K-8
  - 0bf243df
  - 7acdd528
  - f554dba4
  - orch-2026-10-30a/20261103T220500Z-orchestrator-decision-401c3d09
  - arch-ABC-270/20261103T203621Z-architect-design-decision-c858b5a5
  - arch-Q1-see-pruning/20261103T202937Z-architect-design-decision-5e73b0d4
  - arch-owner-answers-1103/20261103T202049Z-architect-design-observation-e81f6b25
supersedes: 
seal: sha256:ed11459853577a8fda98a6ebfe67b0b2710486d529935c64a8d6978dd9268a2a
---

# arch-owner-answers-1103b decisions: the owner's acceptance `…401c3d09` is folded. `ADR-0068` and `ADR-0069` are ACCEPTED 2026-11-03, each in force at its own ticket's merge. `ADR-0024` d4 is amended by `ADR-0069`. `ADR-0067` gets the lines `ADR-0068` owed it. No bar moved

Architect/Design, task `arch-owner-answers-1103b`, records only, on `grugops/arch-owner-answers-1103b` from `main`
`0bf243df`. Nothing was run. The source is the owner's word, verbatim: "yes, accept ADR-0068 and ADR-0069"
(`orch-2026-10-30a` `…401c3d09`).

## 1. The acceptances
- **`ADR-0068` (E3a, `ABC-270`): ACCEPTED 2026-11-03.** It is not in force until `ABC-270` merges.
  - Status block, decision-log rows (owner, Orchestrator, Architect).
  - d6 dated line: S2 nps is reported only, as for `ABC-274` (the Orchestrator's ruling in `…401c3d09`).
  - d8 dated line: its owed `ADR-0067` lines are now written.
- **`ADR-0069` (Q1): ACCEPTED 2026-11-03. The build may start.** It is not in force until the Q1 ticket merges on its own
  read: C2′ 100 games at 100 ms, GAIN ≥ 50.0, plus S′ at E 1 810 and the Levels deep lane.
  - Status block; d9 dated line (the `ADR-0024` pointer is written).

## 2. The folds
- **`ADR-0024`:** a third § Status block, in `ADR-0053`'s form. Decision 4 loses SEE, for quiescence pruning, by
  `ADR-0069` decisions 1–3. Delta pruning and quiet checks stay on d4's list. A dated line at d4. d2 and d5 are unchanged.
- **`ADR-0065`:** re-open 1 now reads "Q1 designed (`ADR-0069`, accepted)". An O3s re-open is a new PREREG over the
  merged Q1. In § Consequences: `src/see.ts` will exist at threshold 0, and a re-open adds its own −50 test beside it.
- **`ADR-0064`:** d4 and d6 have dated pointers saying `ADR-0067` was ACCEPTED 2026-11-03. d6's adds that `ABC-274`'s
  blend is in force (`2410d4f7`).
- **`ADR-0056`:** a status fold block, and D2's dated line for rows E3 and Q1:
  - row E3: E3a = `ADR-0068`, and its dependency now reads structure before E2's fit, values from E2;
  - row Q1: its dependency, basis and scope as `…5e73b0d4` § 5 (a) gives them, now accepted;
  - "Until he answers, d4 stays closed and Q1 stays fenced" is superseded.
  - D6 has a dated Phase 4 order, and D7 a dated line. Still open: Q-3K-6 and Q-3K-8.
- **`ADR-0067`:**
  - § Status dated line, and two decision-log rows.
  - **d4 / d5:** the tracer traces the three queen-on features. At the base values they are 0, so B-T1 alone cannot
    see a mis-traced feature. Two checks close that, neither a bar: a tracer count row on `ABC-270` K1 (c)'s frozen
    queen pairs, and one more gate run on the emitted file (a miss is F1).
  - **d6:** the free set gains the queen-on pairs. mg is free and ≥ 0; eg is held at 0 at the first pull (D5's eg 140
    is the same data pathology as the queen at 2 593). They count only if `ABC-270` has merged at fit time.
  - **Decision 9's list number is restored** ("9. **Data.**"). It was lost in `f554dba4`; the content is unchanged.
  - **B-T4, a re-pin rule** (old → new, `ADR-0064` d7, by reference), in a dated block under the bars table.
    - What B-T4 grades is unchanged: the only non-test file under `src/` that changes is `src/evaluate-params.ts`.
    - Test literals that record the old table are re-pinned, and the PR lists them in one table.
    - Never re-pinned: zugzwang depths, the mate floor, `G1`, the identity gate and relation tests.
    - Lost fixture properties are re-found (`ADR-0028` d2). Levels follow `ADR-0028`.
  - **B-T5, the KQK risk.** The bar is unchanged. If it fires: F4 (a defect check, then NOT MET; never a re-pin). The
    structural fix is `ABC-272`'s mop-up, landed first, then a new pull under its own PREREG. Recommended to QE: read
    B-T5 before B-T7 / B-T8.
  - **§ Consequences item 4:** the order is now `ABC-270` (structure) → `ABC-239`. The stall clause and the previous
    "builds: `ABC-239` first" line are superseded. Q1 merges, or misses, before `ABC-239`'s B-T7 / B-T8 freeze, never
    in between. `ABC-239`'s quiet filter is unmoved by Q1 (`ADR-0069` d6).

## 3. Bars
- **No bar moved.** One reading is flagged rather than assumed: **B-T4's re-pin rule.** Read literally, "the diff under
  `src/` is that file only" would forbid any test literal edit. A tuned table cannot meet that, since `ADR-0068`'s
  batch E reddened 28 rows in 7 files. Rules 1 and 2 of the coding rules ask that this be stated, so here it is.
  - This ADR reads B-T4 as grading the shipped change (A3's "`src/` gains constants only"). It reads d6's "no test bar
    is edited" as the relation tests and B-T5's safety rows, every one of which stays never re-pinned.
  - **If the Orchestrator reads a pin as a test bar, this becomes an owner question**, and `ADR-0067` says so in the
    line itself.

## 4. Owner questions
- **None.** Both acceptances are his verbatim word. No bar had to move.
