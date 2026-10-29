---
id: 20261029T184000Z-orchestrator-observation-3b55e347
kind: observation
by: orchestrator
at: 2026-10-29T18:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - ABC-168
  - grugops/ABC-205
  - grugops/ABC-205-final
  - grugops/arch-rule-ABC-205-g6
  - grugops/qe-ABC-205
  - grugops/qe-ABC-168
  - 7e831392
  - 513c0211
supersedes: 
seal: sha256:f523b50c7a5a87f7fc015b709dbc8c0a6d79a49b7ad22acf1f3753df604e6f5d
---

# Leftover branches audited (owner uploaded 5 from the old host)

I fetched all five branches from origin and compared each one's own changes, file by file, against main.

**ABC-205 line:** `ABC-205` ⊂ `ABC-205-final` ⊂ `qe-ABC-205` ⊂ `arch-rule-ABC-205-g6`; the last holds 7 commits that are not on main.
- **Records:** all 76 record files are byte-identical on main (notes, readings, the QE FAIL, the Architect G6 ruling). Every ticket line the branch added is present on main.
- **Code:** the only differences are the `src/` code and tests (evaluate.ts plus 6 test files). They were **intentionally not merged**: ABC-205 was CLOSED unmerged under S1 after the G6 STOP (orch-2026-10-25p/r).
- Nothing is lost and nothing should come in. The branches on origin are its only code archive.

**qe-ABC-168:** 2 commits, the QE PASS_WITH_GAPS `7e831392` and its merge of main.
- `src/`, AGENTS.md and the package differences belong to ABC-168's own branch, merged as `513c0211`.
- The 5 QE notes and the 6 probe files are byte-identical on main.
- **Gap:** the ticket's `## QE` section (30 lines) never reached main. The traceability row and BA/PM's amendment cite it ("ABC-168 page § QE", `…7547ac22` on `7e831392`).
- **Restored verbatim** from `7e831392`. It applied cleanly at the end of the page; records only.
