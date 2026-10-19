---
id: 20261019T132100Z-security-nfr-decision-abc171-pass-with-risks-9a89caf5
kind: decision
by: security-nfr
task: secnfr-ABC-171
at: 2026-10-19T13:21:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-174
  - ABC-168
  - NFR-004
  - NFR-006
  - NFR-008
  - AR-NFR004-A
  - R-167-1
  - R-167-2
  - R-171-1
  - ADR-0036
  - ADR-0044
  - ADR-0045
  - 20261019T131500Z-qe-e2e-decision-abc171-recheck-verdict-pass-d60ef4d9
  - 20261019T085800Z-security-nfr-decision-abc167-pass-with-risks-99713c0e
  - 20261019T131800Z-security-nfr-observation-abc171-triggers-r1671-book-surface-5a40004e
  - 20261019T131900Z-security-nfr-observation-abc171-nfr004-level5-4500-02bc3a0c
  - 20261019T132000Z-security-nfr-observation-abc171-n8-lane-owed-22a93cd8
supersedes:
---

# Security/NFR `ABC-171` at `5dee231c`: **PASS_WITH_RISKS**

Hand-authored and unsealed. Nothing was fixed, committed, pushed or merged. I did not touch any of these: `src/`,
`plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `../wt-ABC-171`, `../wt-ABC-173`, or any process
I did not start.

| item | ruling | evidence |
|---|---|---|
| Triggers (a)–(d) | **not triggered**, confirmed at the tip. Clause-b gives 0/0/0 on every limb. Its one word hit is a JSDoc comment, which I do not dispute. `book.ts` is `import type` only, and the probe is injected | `…5a40004e` |
| R-167-1 carry | **confirmed, no new exposure.** The only grep hit is the test's `"constructor"` literal. `LEVELS[skill]` sits behind `Object.hasOwn`. R-167-1 stays LOW, owner Security/NFR, and carries to the ABC-174 and ABC-168 gates | `…5a40004e` |
| NFR-004 | **MET on reading.** Level 5 lets 4 500 ms leave the session (QE max 4 600 virtual ms), under the unchanged 5 000 clamp. Clause A: the default is still level 3 = 3 000, so `AR-NFR004-A` stands as written. Clause B: the same `chooseMove` call as the 4 500 ms real-clock readings on record. The `Verified by` cell does not move | `…02bc3a0c` |
| ADR-0045 / ABC-174 | **owed by ABC-174's gate:** a dated re-read block re-pointing `AR-NFR004-A` to `LEVELS[5]` (`:10`, `:1340`, `:1362`) and superseding `:1364` (max budget 3 000). Not done here | `…02bc3a0c` |
| D10 book surface | **confirmed.** No path comes from UCI input. A throwing or bad book gives one fixed warning, then legal `bestmove`s. `OwnBook` off reads 0 times. 118/118 at the tip | `…5a40004e` |
| NFR-006 | unchanged. The tests use in-memory bytes | page |
| NFR-008 N8-LANE | **OWED.** The window had foreign processes in 181 of 181 polls (ABC-173's coverage vitest, grugops vitest, platform workers). Merge may carry it as **R-171-1, LOW**, on the owner's word | `…22a93cd8` |

**Required fixes:** none.
**Accepted risks:**
- **R-171-1** (N8-LANE owed, LOW). Owner: Olger Oeselg, on his word.
- **R-167-1** (carried, LOW). Owner: Security/NFR.
- **`AR-NFR004-A`** (stands, re-read). Owner: Security/NFR.
- **R-167-2** stays open. One quiet-window reading discharges it together with R-171-1.

**Next column:** `Ready for UAT` once the Orchestrator and the owner take R-171-1. The owner's UAT applies.
