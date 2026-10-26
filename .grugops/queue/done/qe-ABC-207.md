---
subtask: qe-ABC-207
role: qe-e2e
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/qe-ABC-207/
branch: new grugops/qe-ABC-207 from grugops/ABC-207 (5477df21), worktree ../wt-qe-ABC-207
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). ABC-207's own single reading.
---

# QE gate + G6 + D for ABC-207 (per-piece mobility weights + early-queen term)

> **One run (`…4c3f7639`; scope reading in `orch-2026-10-25ab`):** each reading runs once; the result is final; no repeat on NOT MET/UNRESOLVED; the ship rule's own extension step is part of the run; pausing is not a re-run.
> **Battery allowed (`qe-ABC-205/…10e61802`):** log the power source; never stop a reading for it.

## Do
- Merge current `main` first (report sha). Own `npm ci --ignore-scripts`.
- QE gate at your merge: verify the page's criteria (A1–A5) independently against the `## Design ruling` (Architect `…a21b7cc9`) and the build (SE `…71735f56`, `…84f82342`, `…723cbf60`). Re-run load-bearing plants. Audit the 12 moved rows: cross-run each tree's code against the other's tests, and confirm the pvs-lmr A4 re-find under ADR-0028 d2 and the oracle rows. Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58). G2 ≤ 1 100 ns with the base in the same session. G5, G8, G9, G10, G11 as the page states.
- **Pre-check** (page Test note 4): confirm the frozen-clock d7/d8 counts (base vs head) before any real-clock reading. If a miss is predicted → STOP to Architect/Design.
- **G6** under EPIC-008's G6 row reading rule (n = 5 per board per build, interleaved, median; any run < 6 FAILs; "≥ base" graded). A miss → STOP to Architect/Design; no D.
- **D** only if the gate and G6 pass: ABC-204 harness `d` mode, candidate = your merge vs base = its merge-base on main, ABC-204 pins, B = 1 500 ms. PREREG first. Grade by EPIC-008 ship rule **S1**: GAIN → MET; NEUTRAL → the one extension (400 more games, same pins, pooled; pooling reported), GAIN after → MET; anything else → NOT MET (a `failed-attempt` note; no merge).
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (wait up to ~60 min). Sample every ~10 s; map overlaps to games; report all-games and overlap-free; grade by the page.
- Verdict; UAT (production change → the QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe207/`; raw outputs under your context folder per ABC-204 A7. No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-207`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-26 (task `qe-ABC-207`). Verdict: FAIL at merge `3d39c8ff`** (`grugops/qe-ABC-207` = `grugops/ABC-207`
`5477df21` + `main` `7020cca3`, records at `276dcd88` and `ab39b73f`; base = merge-base `7020cca3`). Not pushed, not merged
into main. No `src/`/`tools/` edit. One run per reading under `…4c3f7639`, and S1's extension was part of it. Power was
logged per `…10e61802`: AC, except 32 battery samples in d1.

- **Criteria:** `A1`–`A4` MET. **`A5` NOT MET** (S1).
  - `A1`: QE's own pairs give Q 1 < R 2 < B 4 = N 4 per square, with the clamp out of play. The mobility term equals QE's
    re-implementation on 31 358 corpus positions.
  - `A2`: QE's own Qa4/Qd1 pair reads −15 < −8. The term is 0 when the minors are developed and in endgames with no minors.
    It equals QE's model on every corpus position.
  - `A3`: `G3` is green. The mirror is exact on the 22 new positions and on the corpus (3 514 positions exercise both
    terms).
- **12 moved rows:** they are exactly the ruling's set.
  - X1 (head `src` with base tests) turns 12 rows red. X2 (base `src` with head tests) turns 11 red, plus the 2 new relation
    rows.
  - The pvs-lmr `A4` re-find holds on base and branch (`a4scan` d4: head 2 hits, first = the new fixture).
  - The oracle re-run gives kiwipete 20/e2a6 and position-6 78/c3d5, equal to the pins.
- **Pre-check** (nodes to complete depth k), base / head:
  - kiwipete d7 609 900 / 602 091; d8 1 735 339 / 1 700 946.
  - position-6 d7 586 333 / 469 639; d8 1 355 149 / 1 111 000 (−18.0 %).
  - The counts equal the design's. Base straddles no depth, so no miss was predicted.
- **G2 MET:** head 660.7 / 661.7 ns, base 639.8 / 641.0 ns, in the same session.
- **G6 MET**, n = 5 per board per build:
  - kiwipete: base 7 ×5, head 7 ×5.
  - position-6: base 8 ×5, head 8 ×5.
  - 0 of 20 runs overlapped.
- **D (S1) NOT MET:**
  - d1 was NEUTRAL, **−15.6 ± 22.8** (81/99/220, 400/400, 0 faults), so the one extension ran.
  - d2 was NEUTRAL, −20.9 ± 23.8 (86/110/204, 400/400, 0 faults).
  - **Pooled: 167/209/424, −18.3 ± 16.5, LOSS.**
  - 0 vitest overlap. Without the load1 > 8 games, pooled is −18.1 ± 16.8, the same grade.
- **G11** (reported): head's five choices equal base's (d3, Be2, exd6, d4, Kc1).
- **Gates:**
  - lint, typecheck and build 0; `npm test` 62 files, 2 097/2 097; skips `No findings.`.
  - `G1` 54/58; `G5` 2 999.4–3 002.4 ms; `G8` 6.89 s; `G9` empty diff.
  - SEARCH_DEEP 57/38/40/37/29; ENGINE_DEEP 60/41/26/21/37/47; PUZZLE_DEEP 18/18.
  - `N8-LANE`: 62 = 62. Sentinel base 7.34 / 7.34 s, head 7.18 / 7.22 s.
  - Plants: 25 of 29 red; 4 survived, each named below.
- **UAT:** NOT signed (QE FAIL; `…5aaf7cec` item 2).
- **Findings:**
  - QE-207-a BLOCKING: `A5` NOT MET under S1. No merge; back to BA/PM.
  - QE-207-b LOW: the "≥ 2 minors" boundary is unpinned (the ≥ 1 and ≥ 3 plants survive).
  - QE-207-c LOW: the re-pinned pvs-lmr `chooseMove()` row no longer catches the engine-side discard-re-search plant.
    `ABC-121`'s mutants still turn it red.
  - QE-207-d INFO: `A3`'s "positions that exercise both terms" is ambiguous. Only 5 of the row's 22 positions exercise both;
    QE's corpus has 3 514.
  - QE-207-e INFO: the 25 cp size is unpinned (the 20 cp plant survives).
  - QE-207-f INFO: base already plays d3 before 4.Qa4, so head changes no `G11` choice.
  - QE-207-g INFO: the queue's 30 min stale TTL is shorter than this 12 h ALONE claim.
  - Unsealed remark: `qe-ABC-215`'s committed raw has no `*.log` files, because `.gitignore` drops them. This run keeps them
    as `*.log.txt`.
- **Notes** (`.grugops/context/qe-ABC-207/notes/`): gate `…b14d3cba`, timing `…dc779c4a`, D `…138c1740`, failed attempt
  `…243de4b1`, verdict `…cc744e8c`.
- **Owed:**
  - Orchestrator: board and trace rows, and the S1 close routing. Nothing merges.
  - BA/PM: S1's re-tune-or-close call (at most one re-tune round).
  - QE-207-b and -c matter only if a re-tuned build is cut.

**Trace row** (for the Orchestrator):

| ABC-207 (qe-ABC-207) | QE FAIL at 3d39c8ff: A1–A4 MET; A5 NOT MET (S1): D d1 NEUTRAL −15.6 ± 22.8 → extension d2 −20.9 ± 23.8 → pooled 800 −18.3 ± 16.5 LOSS (0 faults, 0 overlap); G11 reported (head = base on all five) | EPIC-008 | per-piece mobility weights N4 B4 R2 Q1 (K4) before the ±100 clamp; early-queen term 25 cp outside it | NFR-005 G6 MET (kiwipete 7 = 7; position-6 8 = 8); G2 660.7/661.7 ns ≤ 1 100; G1 54/58; G5 ≤ 3 002.4 ms; G8 6.89 s; G9 identical; N8-LANE 62 = 62 | grugops/qe-ABC-207 @ ab39b73f (3d39c8ff + records 276dcd88, ab39b73f)<br>.grugops/context/qe-ABC-207/notes/ (5) + raw/ | lint/typecheck/build 0; npm test 62/2097 success; skips 0 No findings.; SEARCH/ENGINE/PUZZLE_DEEP green; 12-row cross-run exact; a4scan re-find on base and head; oracle re-run equal; 25/29 plants red (4 named survivors) | UAT NOT signed (QE FAIL) | BA/PM: S1 re-tune-or-close (QE-207-a); QE-207-b/-c only if re-cut; Orchestrator: board, trace | In Review → not merged; back to BA/PM under S1 (Orchestrator's move) |
