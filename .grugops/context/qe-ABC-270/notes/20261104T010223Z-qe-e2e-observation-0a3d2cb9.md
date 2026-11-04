---
id: 20261104T010223Z-qe-e2e-observation-0a3d2cb9
kind: observation
by: qe-e2e
at: 2026-11-04T01:02:23Z
verified_by: 
confidence: high: each gap read from the run outputs, the ticket page, ADR-0068 and git; QE-270-e by a forward probe on the build; none blocking
refs:
  - qe-ABC-270
  - grugops/ABC-270
  - ABC-270
  - EPIC-011
  - E3a
  - ADR-0068
  - ADR-0067
  - ADR-0064
  - ADR-0028
  - ABC-083
  - ABC-274
  - ABC-239
  - K0
  - K1
  - K2
  - K3
  - K4
  - F1
  - F2
  - F5
  - G2
  - G6
  - S2
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - QE-270-a
  - QE-270-d
  - QE-270-e
  - QE-270-f
  - QE-270-g
  - UAT
  - 4b9c5357
  - 4cb84035
  - 795a6b61
  - 0f393c18
  - fb920c14
  - src/evaluate.ts
  - src/evaluate-params.ts
  - src/evaluate.queen-on.test.ts
  - src/evaluate.taper.test.ts
  - src/evaluate.king-mobility.test.ts
  - qe-ABC-270/20261104T001924Z-qe-e2e-decision-f8ab73a7
  - qe-ABC-270-freeze/20261103T222633Z-qe-e2e-decision-fa82b3f3
  - qe-ABC-270-freeze/20261103T222638Z-qe-e2e-observation-543b10d8
  - se-ABC-270/20261104T000848Z-software-engineer-decision-007dc90a
  - se-ABC-270/20261104T000848Z-software-engineer-observation-15cac083
  - se-ABC-270/20261104T000848Z-software-engineer-observation-bd09c051
  - se-ABC-270/20261104T000848Z-software-engineer-observation-77fd2bd9
  - sha256:68769ea9712097ff1a366b6ad952a71376579fba94d6625c032062dd5e19c681
supersedes: 
seal: sha256:4cb65ef57b3609448541063e0c8c3fa18e634d8367b1a05fcad66b3187625776
---

# qe-ABC-270 gaps: **none blocking, none above LOW.** QE-270-d LOW (process; Orchestrator): the Engineer edited `plans/board.md` on the branch. QE-270-e LOW (forward; Architect and `ABC-239`): the two K1 (e) "red with its term zeroed" rows zero only the base pair, so they turn red once `ABC-239` frees a queen-on mg. QE-270-f INFO (Architect, asked by the brief): `kingExposureForTest`'s form. QE-270-g INFO: reports not taken in full

QE/E2E, task `qe-ABC-270`, on `grugops/ABC-270` (code `795a6b61`). Each gap read from the run outputs, the ticket page, `ADR-0068` and git. `QE-270-a` (freeze, the per-king read) is **closed** by the K1 (c) read; `QE-270-b` / `-c` (freeze, INFO) were honoured as written.

- **QE-270-d LOW (process; owner: Orchestrator). The Engineer moved the board.** `f930e1ee` edits `plans/board.md` (ABC-270 In Development → In Review, the WIP counts) and adds `plans/tickets/history/ABC-270-board-history.md`. The board is the Orchestrator's. Not reverted, per the brief; the Orchestrator reconciles it at merge. No product effect.
- **QE-270-e LOW (forward; owner: Architect/Design for the rule, `ABC-239`'s BA/PM and Engineer for the edit). The twins' bite rows zero only the base pair.**
  - The four phase-24 twins carry both queens, so every queen-on pair acts on them once it is non-zero. The bite rows (`ABC-270` K1 (e), "red with its term zeroed") zero `KING_SHELTER_MISSING` or `KING_FILE_HALF_OPEN` only.
  - QE's forward probe on the build (`k1e.ts`, report): base shelter zeroed with `KING_SHELTER_MISSING_QUEEN` = { 29, 0 } (the probe's D5 shape, `ADR-0068` § Context): g6 −17 < sheltered 0, so the A2 bite row **reads red**. Base half-open zeroed with `KING_FILE_HALF_OPEN_QUEEN` = { 20, 0 }: e5 +1 < f5 +13, so the A3 bite row **reads red**. The fixtures still bite; the rows' "term" just no longer means all of it.
  - Effect: `ABC-239`'s emitted set will turn these two rows red if it frees any matching queen-on mg (`ADR-0068` d8: mg free, ≥ 0). The fix is test-only: zero the base pair **and** its queen-on pair together in each bite row. The Architect may also confirm that rows run under a test table are outside `ADR-0067` d6's "a red relation becomes a bound" (the twins' main rows are the relations; the bite rows are fixture checks).
  - Not this ticket's bar: no row is red today, and K1 (e) is met as written.
- **QE-270-f INFO (owner: Architect/Design; the brief's question). Is `kingExposureForTest` the wanted export form?** `UNKNOWN - verify` with the Architect. What QE read:
  - It follows the house's `…ForTest` pattern: exported from `src/evaluate.ts`, TEST-ONLY in its docblock, no production caller, named by no `tools/` file, and it does not call `loadParameters` (so `ABC-274` S3's call list holds). It reads the packed arrays in force, so it reads the test's table inside `withParametersForTest`.
  - It finds the kings and queens by **its own 0x88 scan**, not by the walk's flags. So it reads the rule at the seam, but it cannot see a walk-only flag bug. The walk is guarded by the `evaluate` / `evaluateWithoutTaper` net rows in the same file (QE's mutants confirm which ones catch what; see the verification note) and by QE's hot-path read in K1 (c).
  - QE's view, for the Architect: keep it. Feeding the walk's flags out would touch the hot path for a test read. If `ABC-239`'s tracer wants a per-king feature read, this export is the natural seam for it, and the Architect may want to name it so.
- **QE-270-g INFO. Reports not taken in full.**
  - S2: the formal ≈ 1 h protocol was not taken; the ruling asks only for the figure (as `QE-274-c`).
  - Base deep lanes were not re-run; the build's lanes were (all green), and K0 plus the cross-build show the trees node-identical, so no lane can differ.
  - QE's wide K1 (b) run (`a2.ts`, unchanged) does not include QE's 28 pair positions; the build's own K1 (b) row covers them against values read on the base before the build.
