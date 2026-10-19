---
id: 20261019T092000Z-qe-e2e-decision-abc146-abc166-verdict-pass-with-gaps-7b4e1d93
kind: decision
by: qe-e2e
task: qe-ABC-146-166
at: 2026-10-19T09:20:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-166
  - plans/tickets/ABC-146-abc085s-verdict-run-the-same-ladder-harness-under-plain-node-then-take-a1-a2-at-step-4.md
  - plans/tickets/ABC-166-re-run-abc-146s-verdict-with-the-verbose-reporter-so-the-score-lines-print.md
  - ABC-085
  - ABC-087
  - ADR-0038
  - QE-166-a
  - QE-166-b
  - QE-166-c
  - QE-166-d
  - QE-146-a
  - .grugops/context/qe-ABC-146-166/notes/20261019T091700Z-qe-e2e-observation-abc166-a2-a3-recount-from-raw-5e1c7a42.md
  - .grugops/context/qe-ABC-146-166/notes/20261019T091800Z-qe-e2e-observation-abc146-abc166-criteria-staleness-and-record-order-8d3f2b60.md
  - .grugops/context/qe-ABC-146-166/notes/20261019T091900Z-qe-e2e-observation-abc146-166-merge-result-gates-and-waiver-2c6a9e14.md
supersedes:
---

# QE verdict, ABC-146 and ABC-166 at `d93e247b`: **PASS_WITH_GAPS**

Hand-authored and unsealed. This is a `decision`, not a stamp. QE does not sign, merge or push.

## Grades
| ticket | criterion | grade |
|---|---|---|
| ABC-146 | A0 | MET (recomputed: 10/10 at 29 717 nodes, `F` 0.954, `F_hi` 1.006, route V) |
| ABC-146 | Scope 1–4, A1–A4 | cancelled on route V (no `tools/ladder/`) |
| ABC-146 | A5 | MET for tree `d73c4d6c`. ABC-085 A1 MET 100/100. A2 RED on 3v4 (6.5/20) and 4v5 (10/20), MET on 2v3 and 1v2. The REDs go to ABC-087 |
| ABC-146 | A6 (route V) | MET (fence diff empty, one serial run) |
| ABC-146 | A7 | MET (no PROPOSED heading; addendum 2 dated, cites A0) |
| ABC-146 | staleness | **STALE vs main by rule** (QE-146-a); not a gate on the merge; short-mode games identical |
| ABC-166 | A1 | MET (git-checked parts); probe and width 1 attested only (QE-166-c) |
| ABC-166 | A2 | MET, every clause |
| ABC-166 | A3 | MET, 0 figure mismatches; digests cross-checked, not recomputable from the raw lines |
| ABC-166 | A4 | not triggered |
| ABC-166 | A5 | PARTIAL: both decisions recorded; the "before any A3 number is quoted" order not met (QE-166-a) |
| ABC-166 | A6 | MET (fence diff empty; production grep empty) |

## Gaps
- **QE-146-a LOW.** The verdict is stale against main under ABC-085's rule: `e29f7951` (ABC-170, `src/engine.ts`) and
  `b3fecb1b` (ABC-169, `src/evaluate.ts`, comment-only) both merged after the branch point. Short mode on the merge
  result plays 26/26 identical games with 5/5 identical digests plus an identical A5 digest. The rule says re-taking is
  the Orchestrator's to schedule. Either rule that the verdict stands for main, or schedule a re-take.
- **QE-166-a LOW.** A5's ordering was not met, and this cannot be repaired after the fact. The Orchestrator or the
  owner accepts it.
- **QE-166-b INFO.** The `at` stamps of `…4c1d8e27` and `…6a2f9d03` are later than the commits that carry them.
- **QE-166-c INFO.** A1's probe and width 1 are attested only. Whether `ticket-to-pr-ABC-167-i` started before
  08:40:36Z is `UNKNOWN - verify`.
- **QE-166-d INFO (record convention).** `node tools/grugops/qe-hop-integrity.js --ticket ABC-166` exits **1**. The
  tool requires the folder name itself to name the ticket (`:193`). `qe-ABC-146-166` tokenises to ABC-146 only, so
  this note covers ABC-146 (`--ticket ABC-146` exits 0, "covered") but not ABC-166, although its `refs:` name both.
  The brief fixed this folder. The Orchestrator must resolve it before ABC-166's `Done` move: add a pointer
  `decision` in a folder that names ABC-166, or rule otherwise. QE did not create a second folder.

## Why it is not FAIL
Every gap is either a record's ordering or provenance, or a staleness that the rule itself says is not a gate. None
of them changes a recounted figure.

The gates are green on the merge result:
- merge-tree clean;
- lint, typecheck and build exit 0;
- `npm test` 58 files, 1844/1844, `success: true`;
- skips 0, and the integrity check reports "No findings.".

**The UAT waiver applies:** the production-lines grep is empty.

## Next
- **Merge.** The ticket's QE hop is satisfied, and the merge itself is the Orchestrator's per-ticket authority.
- **Then the Scribe hop** for AGENTS.md (`…6a2f9d03`).
- **ABC-087** gets the REDs.
