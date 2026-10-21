---
id: 20261021T134905Z-qe-e2e-observation-ee6c6b75
kind: observation
by: qe-e2e
at: 2026-10-21T13:49:05Z
verified_by: 
confidence: high (own scripts and gates re-run at the second merge)
refs:
  - ABC-185
  - plans/traceability.md
  - grugops/qe-ABC-185
  - 745c6225
  - 3d166e01
  - d42f6a3b
  - 262defb7
  - 6273bed2
  - 20261021T134733Z-qe-e2e-observation-d85e5668
  - 20261021T134733Z-qe-e2e-observation-d0b8f5a8
supersedes: 
seal: sha256:1a19f00db62aa8fe561dfe8a8c394dc708b0e1ccabce56fffc106b0982e351ec
---

# ABC-185 re-merge: main moved to d42f6a3b during QE; merged again at 262defb7; A1–A6 and gates re-run, unchanged

`main` appended 2 ten-cell trace rows (`ABC-187 (SE)`, `ABC-187 (Scribe)`) and touched no `src/`. I merged it into `grugops/qe-ABC-185` at **262defb7** with no conflict; the tail is verbatim (`tail -7` equals `main`'s).
- A1 `[]`; A2 86/86; A3 705=705 (base → code), 710=710 (`main` → merge); A4 (a) 86/86; A4 (b) the same 3 named exceptions and 0 unexplained; A4 (c)/(d): the derived map is identical to the one at 6273bed2, and line numbers are unchanged. The render gives 2 `<table` and 708 `<tr`, every row with 10 cells. A5: removed and added are 86 = 86, the same rows. Excluding `.grugops/`, the SE branch (`main...3d166e01`) lists only `plans/traceability.md`. At the QE merge, the ticket page also appears; that is this hop's own `## QE` section. A6 `2 0`.
- Gates at 262defb7 (code tree identical to 745c6225): lint, typecheck and build 0; `npm test` 59 / 1987; last-run success, 0 failed / pending / todo; skip-count 0 `No findings.`
- These results supersede, in place, the merge sha in `…d85e5668` and `…d0b8f5a8`. The verdict is unchanged: PASS_WITH_GAPS (QE-185-a..d INFO).
