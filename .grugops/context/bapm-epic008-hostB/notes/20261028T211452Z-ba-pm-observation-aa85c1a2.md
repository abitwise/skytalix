---
id: 20261028T211452Z-ba-pm-observation-aa85c1a2
kind: observation
by: ba-pm
at: 2026-10-28T21:14:52Z
verified_by: 
confidence: high (git reads and page reads at 54bcf923; arithmetic is BA/PM's, not a measurement)
refs:
  - EPIC-008
  - ABC-204
  - M1
  - M3
  - M4
  - Q1
  - Q3
  - A1
  - A4
  - A6
  - G6
  - 3497aad2
  - b5c67ab7
  - 54bcf923
  - orch-2026-10-28a/20261028T210902Z-orchestrator-decision-5dbd717b
  - orch-2026-10-27o/20261027T210610Z-orchestrator-decision-e018297c
  - bapm-s1-ABC-210/20261027T194008Z-ba-pm-decision-ff16a93d
  - owner-word-2026-10-23/…e44d2903
  - owner-word-2026-10-24/…4c3f7639
  - se-tools-rating-host
  - qe-epic008-close
  - plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md
  - grugops/bapm-epic008-hostB
  - ADR-0049
supersedes: 
seal: sha256:1cde6d8e65fc83a400066c5c10547f5696af1afd01a4d058c8b15480ff05f4ba
---

# BA/PM re-reads for bapm-epic008-hostB, at main 54bcf923 (records only; no npm, vitest, build or timing)

- `git diff --stat b5c67ab7 54bcf923 -- src data`: empty. `main`'s `src/`/`data/` equal `b5c67ab7`'s, so
  `main` qualifies as the close sha at this cut (QE re-confirms at its own cut).
- `3497aad2` exists as a commit. `git diff --stat 3497aad2 b5c67ab7 -- src data`: 17 files changed, so the two
  readings differ in code, as M1 needs.
- ABC-204 A4 (page): "score inside 25–75 %. If outside, E is moved once … and that run is the baseline … E is then
  frozen." ABC-204 § Reading: 70.5 % at E 1 910 read 151.3 ± 50.3. The first run, at E 1 650, read 82.0 % as
  263.4 ± 61.8. R is "on this host" (`Frozen for EPIC-008`).
- EPIC-008 § "States of a D reading": UNRESOLVED = an illegal move, disconnect, stall, time forfeit, fewer games, a
  missing raw file, or a watchdog stop. No state names the score band. The old close-path step 3 says "A4's band and
  its one E step belong to the baseline only".
- Arithmetic (BA/PM's): √2 × 61.8 ≈ 87.4, and √2 × 50.3 ≈ 71.1. Two readings at A6's 4.40 h each ≈ 8.8 h.
- Diff on the branch: one file, the EPIC-008 page. No `src/`, `tools/`, ABC-204 or board edits.
