---
subtask: qe-ABC-205
role: qe-e2e
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/qe-ABC-205/
branch: new grugops/qe-ABC-205 from grugops/ABC-205-final (b5d5cea5), worktree ../wt-qe-ABC-205
width: 1 — ALONE (G6 depth-in-budget, D reading ~6–12 h). The last timing run under the owner's one-run rule.
---

# QE gate + G6 + D for ABC-205 (king safety)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** Run once; the result is final. No repeat on NOT MET or UNRESOLVED; the page's own steps (S1's one pooled 400-game extension) are part of the one run. Pausing for a precondition is not a re-run.
> **Owner word on power (`qe-ABC-205/…10e61802`):** battery is allowed; log the power source, never stop a reading for it.

## Do
- **Do NOT merge main into this branch** (it would re-apply `7c9cd9b9` and delete ABC-205's code). The branch already sits on main `d5690c5c`; if main has moved, report the diff `d5690c5c..main -- src` and proceed on `b5d5cea5` if it is empty.
- QE gate: verify the page's criteria independently at `b5d5cea5` (re-run load-bearing plants; the SE's integration proof `se-integrate-ABC-205/…c685972c`). Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP, ENGINE_DEEP, PUZZLE_DEEP if the page names G1.
- **G6** exactly as the page's reading rule states (NFR-005: depth ≥ 6 and ≥ base). A miss is a STOP to Architect/Design per the page — report it, no re-level.
- **D** only if G6 and the gate pass: the ABC-204 harness `d` mode, candidate `b5d5cea5` vs base = its merge-base on main, under ABC-204's pins and B = 1 500 ms (`qe-ABC-204/…f9d109ea`). Write the procedure down before the first game (PREREG). Ship rule S1: GAIN is MET; NEUTRAL gets the one pooled 400-game extension; then grade.
- Preconditions per reading start: load1 ≤ 8, no foreign vitest (`pgrep -fl 'node.*vitest'`; another session runs vitest in bursts — wait up to ~60 min). Sample every ~10 s; map overlaps to games; report the statistic over all games AND over overlap-free games; grade by the page's rule.
- Verdict; UAT (production change in `src/evaluate.ts` → QE verdict signs under `…5aaf7cec` item 2).

## Fences
- Only your worktree and `<scratchpad>/qe205/`; raw outputs under your context folder per ABC-204 A7 (.out.gz + PGN, SHA256SUMS). No `src/`/`tools/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-205`), `at` from `date -u`, with a `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

QE/E2E, 2026-10-25, branch `grugops/qe-ABC-205` @ `ffa0a5e8` (= `b5d5cea5` + records; not pushed, not merged; main
never merged into it). Base `d5690c5c` (merge-base). `d5690c5c..main -- src data tools` is empty (main `c2775024` moved
`package.json` `engines.node` only), so the run stayed on `b5d5cea5`. **One run under `…4c3f7639`.**

- **Verdict: FAIL. `G6` misses "≥ base" on position-6. STOP to Architect/Design. D was NOT run** (page: gates first,
  then D). UAT is NOT signed.
- **A1 MET** (8 pairs, all strict; base equal on all 8), **A2 MET** (ending 65 > −2; middlegame 38 > −33), **A3 MET**
  (111 > 31, 187 > 87; `A3b` 40 > 21). Each mutant reds its own row. Values re-derived on scratch trees.
- **A4 MET:** `G3` mirror exact (corpus + 37). `G2` reused from the SE (700.7 / 700.5 against 653.4 / 645.3 ns).
- **A5 FAIL on `G6`:** kiwipete base 7 ×5, head 7 ×5. **position-6 base 8 7 8 7 8 (median 8), head 7 ×5 (median 7).**
  The floor (6) and the WARN level (7) hold.
  - Host: AC, load1 2.76–4.08, 0 foreign-vitest samples, 0 of 20 runs overlapped. All-runs and overlap-free grades agree.
  - Why (frozen clock): depth 8 on position-6 costs base 1 451 759 nodes and head 1 522 790 (+4.9 %). Taper only is
    +3.2 %, scale only −0.1 %. Base's 3 s lands on its own depth-8 edge.
  - Other gates: `G1` 55/58; `G4` green; `G5` 2 999.8–3 001.8 ms; `G8` 7.23 s; `G9` byte-identical.
- **A6 not read** (no D, no Elo, no extension). `G11` (reported): base Qa4, Be2, Be2, d4, Kc1; head d3, Be2, Be2, Ng4,
  Kc1.
- **A7 MET** (`ADR-0031` addendum ACCEPTED, `…fb0468ff`).
- **Gates:** lint, typecheck and build 0; `npm test` 62 files, 2 091/2 091, success, 0 pending; skips 0, `No findings.`.
  SEARCH_DEEP 57/38/40/37/29, ENGINE_DEEP 60/41/26/21/37/47, PUZZLE_DEEP 18/18 — all green.
- **Findings:**
  - QE-205-a BLOCKING: the `G6` miss.
  - QE-205-b LOW: the PREREG omitted the page's same-session scale-only and taper-only readings. Node counts are given
    instead.
  - QE-205-c INFO: base straddles a depth boundary.
  - QE-205-d INFO: the vitest reporter hides stdout; the heap-guard flag.
  - QE-205-e INFO: one disclosed pre-PREREG smoke; main moved `package.json` only.
- **Notes** (`.grugops/context/qe-ABC-205/notes/`): gate `…cb1e302f`, G6 `…35de132c`, failed attempt `…a44d9079`,
  verdict `…234d9814`.
- **Owed:**
  - Architect/Design rules the STOP.
  - The Orchestrator rules whether ABC-205's D is ever owed after that ruling.
  - The board and the trace are the Orchestrator's.

**Trace row** (for the Orchestrator):

| ABC-205 (qe-ABC-205) | QE FAIL at b5d5cea5: A1–A4, A7 MET; A5 FAIL on G6 (position-6 base median 8 v head 7; kiwipete 7 = 7; floor and WARN held; clean host, 0 overlap); A6 not read (D not run: STOP before D); G11 reported (head d3/Be2/Be2/Ng4/Kc1) | EPIC-008 | king safety: queen scale ×3, tapered gated king square | NFR-005 G6 ≥ base FAIL (depth-8 tree +4.9 %, taper +3.2 %); G2 reused ≤ 1 100 ns; G1 55/58; G5 ≤ 3 001.8 ms; G8 7.23 s; G9 identical | grugops/qe-ABC-205 @ ffa0a5e8 (b5d5cea5 + records)<br>plans/tickets/ABC-205-…md ## Reading<br>.grugops/context/qe-ABC-205/notes/ (4) + raw/ | lint/typecheck/build 0; npm test 62/2091 success; skips 0 No findings.; SEARCH/ENGINE/PUZZLE_DEEP green; 4 mutants + 1 quiescence plant red their rows | UAT NOT signed (QE FAIL) | Architect/Design rules the G6 STOP (QE-205-a/-b/-c); Orchestrator rules whether D is owed | In Review → STOP to Architect/Design (Orchestrator's move) |
