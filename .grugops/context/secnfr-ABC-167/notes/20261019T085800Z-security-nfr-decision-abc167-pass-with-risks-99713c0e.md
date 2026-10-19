---
id: 20261019T085800Z-security-nfr-decision-abc167-pass-with-risks-99713c0e
kind: decision
by: security-nfr
task: secnfr-ABC-167
at: 2026-10-19T08:58:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - NFR-004
  - NFR-008
  - QE-167-g
  - QE-167-i
  - R-167-1
  - R-167-2
  - ADR-0036
  - ADR-0044
  - 20261018T211300Z-qe-e2e-decision-abc167-recheck-verdict-pass-with-gaps-c02ebd96
  - 20261019T085500Z-security-nfr-observation-abc167-triggers-and-qe167g-bracket-access-baba8a03
  - 20261019T085600Z-security-nfr-observation-abc167-nfr004-no-budget-above-3000-37084be2
  - 20261019T085700Z-security-nfr-observation-abc167-n8-lane-owed-a4316655
supersedes:
---

# Security/NFR `ABC-167` at `660a0d50`: **PASS_WITH_RISKS**

Hand-authored and unsealed. Nothing was fixed, committed, pushed or merged. `src/`, `plans/board.md` and
`plans/traceability.md` were not touched.

| item | ruling | evidence |
|---|---|---|
| Triggers (a)–(d) | **not triggered**, confirmed at the tip. Clause-b: 0 / 0 / 0 on all limbs, 0 word hits | `…baba8a03` |
| QE-167-g (M40/M42) | **ACCEPTED RISK R-167-1, LOW**. Owner: Security/NFR, carried to the ABC-171/ABC-168 gates. No required fix | `…baba8a03` |
| NFR-004 | **MET**: no budget above 3 000 ms leaves the session (A5 rows plus a virtual-clock edge probe) | `…37084be2` |
| NFR-008 N8-LANE | **OWED**: the 180 s window failed (foreign vitest, platform pidinfo). Merge may carry it as **R-167-2, LOW**, on the owner's word | `…a4316655` |
| QE-167-i | **no security or NFR weight**: a parse-correctness gap only, the cap is applied after parsing. Rows A7-i1..i6 now cover it at the tip | `…37084be2` |

**Required fixes:** none.
**Next column:** `Ready for UAT` once the Orchestrator and the owner take R-167-2. The owner's UAT applies.
