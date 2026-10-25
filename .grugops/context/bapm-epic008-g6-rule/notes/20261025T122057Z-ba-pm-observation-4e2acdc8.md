---
id: 20261025T122057Z-ba-pm-observation-4e2acdc8
kind: observation
by: ba-pm
at: 2026-10-25T12:20:57Z
verified_by: 
confidence: high (git reads at 0e2358ce; byte checks are grep/diff outputs)
refs:
  - EPIC-008
  - ABC-215
  - ABC-205
  - ABC-207
  - G6
  - NFR-005
  - S3
  - M2
  - QE-215-a
  - QE-215-b
  - QE-205-c
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
  - orch-2026-10-25w/20261025T121545Z-orchestrator-decision-ccf209d9
  - qe-ABC-215/20261025T121200Z-qe-e2e-decision-c2c3540f
  - qe-ABC-215/raw/PREREG.txt
  - qe-ABC-205/raw/PREREG.txt
  - grugops/bapm-epic008-g6-rule
  - 0e2358ce
  - 5c91e2e4
  - 7d4cea3e
supersedes: 
seal: sha256:a0a683171e0f386f99522b5ba04074605fad7c2e8eeeffe09af63c6f43fa21d0
---

# BA/PM re-reads at main 0e2358ce for the EPIC-008 G6 reading rule and the ABC-215 Done lines. Records only

Task `bapm-epic008-g6-rule`. Branch `grugops/bapm-epic008-g6-rule` from `main` `0e2358ce`. No npm, no vitest, no
timing. No `src/` edit. Scratch: `<scratchpad>/bapm008/` (this seal script only).

- `5c91e2e4` is an ancestor of `main` (`git merge-base --is-ancestor`); its subject names ABC-215, QE PASS, D NEUTRAL
  +15.6 ± 23.8, S3 met.
- The pre-registered rule, as written in the records:
  - `ABC-205` page, § Design ruling, "How `G6` is read": **at least** 5 interleaved rounds per board per build; "≥ base"
    compares the median completed depth per board; any single run below depth 6 is a FAIL.
  - `qe-ABC-205` and `qe-ABC-215` `raw/PREREG.txt` both ran **exactly** 5 rounds (the ABC-205 file calls 5 "the rule's
    minimum"): each round a kiwipete pair then a position-6 pair; odd rounds base first, even rounds head first;
    `chooseMove` at `DEFAULT_BUDGET_MS` 3 000 on the real clock, one fresh process per search, completed depth =
    `choice.depth`; median per board, head ≥ base on both boards; depth 7 WARN reported; graded over all runs.
  - The `qe-ABC-215` file says the ABC-215 page states no rule of its own, so it borrowed ABC-205's (`QE-215-a`).
- EPIC-008 before the edit: the G6 row's bar text and source cell carried no reading rule. After it, the bar text
  "depth **≥ 6** (FAIL floor), depth 7 (WARN), and **≥ the base build's** completed depth, same machine, same session"
  is present once, byte-equal to `main`. The other ten gate rows and the nine ticket rows are byte-equal to `main`.
- The ABC-215 page's frontmatter reads `status: ready`, `column: Ready` and is left as is. Other merged tickets' pages
  (for example ABC-214) also keep stale frontmatter; the brief asks only for a dated status line.
- The diff carries no personal path, username or hostname (grep count 0).
