---
subtask: qe-ABC-215
role: qe-e2e
ticket: plans/tickets/ABC-215-the-evaluation-values-are-our-own-and-the-cc-by-sa-carve-out-leaves-notice.md
ref: .grugops/context/qe-ABC-215/
branch: new grugops/qe-ABC-215 from grugops/ABC-215 (b778ab13), worktree ../wt-qe-ABC-215
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). ABC-215's own single reading.
---

# QE gate + G6 + D for ABC-215 (rule-made evaluation values)

> **One run (`…4c3f7639`, scope reading in `ticket-to-pr-ABC-215/…1976d0e9`):** each reading runs once; the result is final; no repeat on NOT MET/UNRESOLVED; the page's own extension step is part of the run; pausing is not a re-run.
> **Battery allowed (`qe-ABC-205/…10e61802`):** log the power source; never stop a reading for it.

## Do
- Merge current `main` first (report sha; this branch has no revert trap). Own `npm ci --ignore-scripts`.
- QE gate at your merge: verify the page's criteria (A1–A8a) independently, re-run load-bearing plants, audit the 16 moved rows and the SE's three companion edits (`…cfb55b57`; Orchestrator `…1976d0e9`). Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP.
- **Pre-check** (page test note): confirm the frozen-clock d7/d8 counts (base vs head) before any real-clock reading.
- **G6** exactly as the page's reading rule states ("≥ base" graded as written). A miss → STOP to Architect/Design; no D.
- **D** only if the gate and G6 pass: ABC-204 harness `d` mode, candidate = your merge vs base = its merge-base on main, ABC-204 pins, B = 1 500 ms (`qe-ABC-204/…f9d109ea`). PREREG first. Grade by the page's ship rule (incl. its one extension).
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (wait up to ~60 min). Sample every ~10 s; overlaps mapped to games; report all-games and overlap-free; grade by the page.
- Verdict; UAT (production change → QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe215/`; raw outputs under your context folder per ABC-204 A7. No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-215`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-25 (task `qe-ABC-215`). Verdict: PASS at merge `7d4cea3e`** (`grugops/qe-ABC-215` = `grugops/ABC-215`
`b778ab13` + `main` `cac2b4e9`, records at `2b7b31aa`; base = merge-base `cac2b4e9`). Not pushed, not merged into main. No
`src/`/`tools/` edit. One run per reading under `…4c3f7639`; AC throughout (logged per `…10e61802`).

- **Criteria:** `A1`–`A8a` all MET.
  - `A2`: QE's own rebuild equals all seven arrays; one-cell mutants red their row (7/7); base values red 14 rows.
  - `A3`: 0 hits in three files; `NOTICE` byte-equal to `ABC-214` Scope 5's common part.
  - `A5`: the 16 moved rows are exactly the ruling's set (cross-run both ways). Oracle re-run: kiwipete 8/e2a6,
    position-6 85/c3d5. The 3 companions keep their guards (`M11`/`M13`; the re-search and discard plants).
- **Pre-check** (nodes to complete depth k), base / head:
  - kiwipete d7 566 233 / 609 900; d8 1 638 196 / 1 735 339.
  - position-6 d7 644 469 / 586 333; d8 1 451 759 / 1 355 149 (−6.65 %).
  - Equal to the design's counts. No miss was predicted.
- **G6 MET**, n = 5 per board per build:
  - kiwipete: base 7 ×5, head 7 ×5.
  - position-6: base 7 7 8 7 7 (median 7), head 8 ×5 (median 8).
  - 0 of 20 runs overlapped.
- **G2 MET:** head 642.6 / 641.2 ns, base 641.1 / 637.8 ns.
- **Other gates:** `G1` 54/58; `G5` 2 999.4–3 002.3 ms; `G8` 7.11 s; `G9` empty diff.
- **D (S3) MET:** NEUTRAL, **X = +15.6 ± 23.8** (W/L/D 107/89/204, 400/400, 0 faults).
  - Not LOSS, and X ≥ 0, so no extension was run.
  - No game overlapped a vitest burst. Without the 8 games that touched load1 > 8: +15.1 ± 24.0.
- **G11** (reported): head plays d3 (4.Qa4) and exd6 (10.Ne4); the other three positions agree with base.
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2 090/2 090; skips `No findings.`.
  - SEARCH_DEEP 57/38/40/37/29; ENGINE_DEEP 60/41/26/21/37/47; PUZZLE_DEEP 18/18.
  - `N8-LANE`: 62 = 62. Sentinel base 6.92 / 6.98 s, head 6.95 / 6.83 s.
- **UAT:** signed by this PASS (`…5aaf7cec` item 2).
- **Findings** (none blocking):
  - QE-215-a LOW: the `G6` reading rule is borrowed from `ABC-205`. Write it into `EPIC-008`.
  - QE-215-b INFO: base straddles position-6 d8 (1 of 5 here, 3 of 5 at `qe-ABC-205`).
  - QE-215-c INFO: one vitest tick at the session's first second, meeting G2's first base run only.
  - QE-215-d INFO: the "killers earn 12 %" comment is stale.
  - QE-215-e INFO: `A8`'s name list does not cover the `.grugops/` records.
- **Notes** (`.grugops/context/qe-ABC-215/notes/`): gate `…dc2c86cc`, G6 `…a34270bf`, D `…0c9bab9a`, verdict
  `…c2c3540f`.
- **Owed:**
  - Orchestrator: board, trace and merge routing (a human merges).
  - Architect: the `ADR-0048` status line after the merge.
  - Security/NFR: `LIC-PUB-1` and `OQ-214-4`.
  - BA/PM or Architect: QE-215-a.

**Trace row** (for the Orchestrator):

| ABC-215 (qe-ABC-215) | QE PASS at 7d4cea3e: A1–A8a MET; G6 MET (position-6 head 8×5 v base median 7; kiwipete 7 = 7; 0 overlap); D NEUTRAL +15.6 ± 23.8 (400/400, 0 faults), S3 met without extension; G11 reported (head d3, exd6) | EPIC-008 | rule-made evaluation values (c2); CC BY-SA carve-out removed from NOTICE, the evaluate.ts header and the README sentence | NFR-005 G6 MET; G2 642.6/641.2 ns ≤ 1 100; G1 54/58; G5 ≤ 3 002.3 ms; G8 7.11 s; G9 identical; N8-LANE 62 = 62 | grugops/qe-ABC-215 @ 2b7b31aa (7d4cea3e + records)<br>plans/tickets/ABC-215-…md ## Reading<br>.grugops/context/qe-ABC-215/notes/ (4) + raw/ | lint/typecheck/build 0; npm test 62/2090 success; skips 0 No findings.; SEARCH/ENGINE/PUZZLE_DEEP green; 7 A2 mutants + base-values + N3/M11/M13/keepBestSoFar + 8 re-search plants red their rows; oracle re-run equal | UAT signed by QE PASS (…5aaf7cec item 2) | Architect: ADR-0048 status line after merge; Security/NFR: LIC-PUB-1, OQ-214-4; QE-215-a (G6 rule into EPIC-008) | In Review → merge-ready (Orchestrator's move; a human merges) |
