---
id: 20261022T155054Z-qe-e2e-observation-006ed3cf
kind: observation
by: qe-e2e
at: 2026-10-22T15:50:54Z
verified_by: 
confidence: high (side-by-side of QE's own outputs and the SE's published counts)
refs:
  - ABC-178
  - qe-ABC-178b
  - 0036e5c6
  - fb00ad68
  - 7b87e5de
  - 43e4996f
  - 66fd8e1b
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - ticket-to-pr-ABC-178b
  - 20261022T153506Z-software-engineer-decision-5e69047b
  - 20261022T153507Z-software-engineer-observation-ac6b8407
  - 20261022T153508Z-software-engineer-observation-246ca01c
  - 20261022T153509Z-software-engineer-observation-10cbb9ab
  - d12831c6
supersedes: 
seal: sha256:e56569aacbb61636c2b1e1402f4ed11b8fe0a4455dbbe03d8fc7df0c2d616241
---

# `ABC-178` QE cross-check of the SE's `ticket-to-pr-ABC-178b` notes, opened only after QE's own runs: every count agrees. The one item the SE left open (the M4 kill) QE re-ran: it still kills

QE opened `…5e69047b`, `…ac6b8407`, `…246ca01c` and `…10cbb9ab` at 15:47:57Z, after every run in this hop's B1–B6 and B9 notes (including the QP1d/QP1e and widening runs).

| item | SE | QE (own runs) | agree |
|---|---|---|---|
| fold shape | +2 against `efaa0a76`; one hunk of 9 `+` and 0 `-` against base | the same, against `43e4996f` and `d12831c6` | yes |
| QP1c, file/lane | 1/127 R1, 1/1 996 R1; red at `289:68`, line 286 green | the same | yes |
| QP1c before the fold | 0/127, 0/1 996 (H0 = `0fb19ab9`) | 0/127 (pre-fold file on H) | yes |
| QP0 / QP1 / QP1a / QP1b | 0 / R1 / R1 / 0 | the same | yes |
| census | R1 655, sum 608 965, `cmp`-equal to `census-H.tsv` | the same | yes |
| B4 | 127 in the file; lane 1 996, `success` true | 127; lane 1 995 → 1 996, R1 alone | yes |
| B9 | lint, typecheck, build 0; skip 0 → `No findings.`; `UCI_DEEP` 5/5; M4 kill **not re-run** | the same, **plus the M4 plant: 13/127 red, sweep row red** | yes; the gap is closed here |
| UAT waiver form | empty for 3 ranges | empty for the tip commit and both QE merges | yes |

The SE named `d12831c6` as the base, and the page names `43e4996f`. Their `src/` trees are identical (`git diff --name-only 43e4996f d12831c6` lists only `.grugops/` and `plans/`), so the readings are interchangeable. The SE's notes stay uncommitted on `grugops/ABC-178` by choice (the B3 literal reading). They are present in `main`'s tree.
