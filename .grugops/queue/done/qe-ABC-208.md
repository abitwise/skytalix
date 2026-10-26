---
subtask: qe-ABC-208
role: qe-e2e
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/qe-ABC-208/
branch: new grugops/qe-ABC-208 from grugops/ABC-208 (2e9eb9a7), worktree ../wt-qe-ABC-208
width: 1 — ALONE for timing (G2, G5, G6, G8, real-clock rows, D; ~6–12 h). Records-only hops may run beside it (no npm/vitest/build; owner-word-2026-10-24/…619938c5 item 6). ABC-208's own single reading.
---

# QE reading for ABC-208 (null-move pruning; ADR-0050 ACCEPTED by the owner)

> **Owner word (`owner-word-2026-10-26/…58bcd17c`):** ADR-0050 accepted, so the gate on this reading is met (reading (b), `…d25ab770`).
> **One run (`…4c3f7639`):** each reading runs once, and its result is final. No repeat after NOT MET or UNRESOLVED. The ship rule's own extension step is part of the run. Pausing is not a re-run.
> **Battery allowed:** log the power source, and never stop a reading because of it.

## Do
- Merge current `main` first and report the sha. Run your own `npm ci --ignore-scripts`.
- **Re-check the test-gap fix first:** re-run the QE-208-a/b/c plants against SE `se-fix-ABC-208/…2beeb930` (5 rows). Each plant must go red, and head must be green.
- Static items are already passed (`qe-gate-ABC-208/…8c4f3e57`, A1–A3, the 14-row audit). Re-verify only what the merge or the fix could move.
- **Gates:** lint, typecheck, build, `npm test` + `last-run.json`, skips (`test-skip-integrity.js`), SEARCH_DEEP (including the null-move lane), ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58).
  - Run the lane command as AGENTS.md will carry it, `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.null-move.test.ts`, and report its result and wall time.
- **Real-clock readings:**
  - G2 ≤ 1 100 ns, with the base in the same session.
  - G5, G8, G9, G10, G11 as the page states.
  - The 10 real-clock rows the static gate filtered out.
- **Pre-check** (page Test notes): confirm the frozen-clock d7/d8 counts, base vs head, before any real-clock G6. If a miss is predicted → STOP to Architect/Design.
- **G6** under EPIC-008's G6 reading rule:
  - n = 5 per board per build, interleaved; graded by median.
  - Any run below 6 FAILs. "≥ base" is graded.
  - A miss → STOP to Architect/Design, and no D.
- **D (A5)** only if the gate and G6 pass:
  - ABC-204 harness `d` mode: candidate = your merge, base = its merge-base on main. ABC-204 pins, B = 1 500 ms. PREREG first.
  - Grade by EPIC-008 ship rule **S1**. GAIN → MET.
  - NEUTRAL → the one extension (400 more games, same pins, pooled; report the pooling). GAIN after it → MET.
  - Anything else → NOT MET: a `failed-attempt` note, and no merge.
- **Before each reading:** load1 ≤ 8, and no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free results; grade by the page.
- **Verdict and UAT:** this is a production change, so the QE verdict signs UAT under `…5aaf7cec` item 2.

## Fences
- Work only in your worktree and `<scratchpad>/qe208/`. Raw outputs go under your context folder, per ABC-204 A7.
- No `src/` or `tools/` edits.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-208`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-26 (task `qe-ABC-208`, ALONE for timing). Verdict: PASS at merge `3a87f9d7`** (`grugops/qe-ABC-208` =
`grugops/ABC-208` `2e9eb9a7` + `main` `ba74b71d`; records at **`fb079c92`**; base = merge-base `ba74b71d`). Not pushed, not
merged into main. No `src/`/`tools/` edit, no board edit. One pre-registered run under `…4c3f7639`. Power: AC throughout.
`main` moved records-only since `ba74b71d` (to `12270c02`), so D is not stale.

- **Test-gap fix re-check:** each of the six plants (QE-208-a, -b ×2, -c ×3) turns exactly its new row red, of 2 128. Head is
  2 128/2 128 green. **QE-208-a/b/c are closed.**
- **Criteria:** `A1`–`A6` MET.
  - `A1`/`A2`/`A3`: static (`…8c4f3e57`). The merge and the fix cannot move them (base `src` = `ef9711ec`; head = `ddc307a9`
    + a test file). Re-read at the merge: `A2` 7/7; `A3` 100 %/25 cp, 100 %/8 cp, mate floor 0 of 189.
  - `A6`: `ADR-0050` is ACCEPTED on `main`, with the dated report line.
- **Pre-check:** kiwipete d7 609 900 → 590 489, d8 1 735 339 → 1 259 463; position-6 d7 586 333 → 180 941, d8 1 355 149 →
  355 565. The counts equal the ruling's. Base straddles no depth, so no miss was predicted.
- **G2 MET:** head 642.5 / 647.0 ns, base 640.3 / 645.7 ns, in the same session.
- **G6 MET**, n = 5 per board per build, interleaved:
  - kiwipete: base 7 ×5, head **8 ×5**.
  - position-6: base 8 ×5, head **9 ×5**.
  - 0 of 20 runs overlapped. **The depth gain at 3 s is +1 ply on both boards.**
- **D (S1) MET:** d1 **GAIN +38.4 ± 23.3** (116/72/212, 400/400, 0 faults; X − Y = +15.1), so no extension was run.
  - A foreign vitest from another repository met 18 games (rounds 191–199). Without them: +40.2 ± 23.9, GAIN.
  - load1 > 8 touched 78 games. Without them: +30.3 ± 25.7, GAIN. The grade is unchanged both ways.
- **G11** (reported): head plays Be2, not exd6, before 10.Ne4, and the other four choices are equal. Head searches 1–3 plies
  deeper.
- **Gates:**
  - lint, typecheck and build 0; `npm test` 63 files, 2 128/2 128, `last-run.json` success; skips 0, `No findings.`; lane
    inventory 63 = 63.
  - `G1` 54/58. `G5` MET (≤ 3 003.4 ms; level 5 30/30; levels 6/7 inside their ceilings). `G8` 8.09 s at load1 4.32.
    `G9` empty diff. `G10` none.
  - SEARCH_DEEP null-move 44, search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29. ENGINE_DEEP unfiltered
    60/41/26/21/37/47: the 10 real-clock rows ran and are green. PUZZLE_DEEP 18/18.
  - `N8-LANE`: the lane command, 44/44, wall 46.0 s.
- **UAT: SIGNED** on this PASS under `…5aaf7cec` item 2 (decision `…0477ac64`).
- **Findings:**
  - QE-208-a/b/c: CLOSED.
  - QE-208-g INFO: a foreign vitest ran on the host during d1. The ALONE rule does not cover other sessions on the host.
  - QE-208-h INFO: the `G11` choice change above.
  - QE-208-i INFO: the null-move lane takes 46.0 s.
  - Carried: `QE-207-g` (this claim was held about 6.5 h against a 30 min TTL); `ABC-121`'s 75 cp vs 118; the static gate's
    named blind spots.
- **Notes** (`.grugops/context/qe-ABC-208/notes/`, on `grugops/qe-ABC-208`): decision `…0477ac64`; observations `…11909c4e`
  (gate), `…3d6a4c99` (pre-check, G2, G6, G11) and `…ce697bc8` (D). `raw/` holds the PREREG with its addendum, the scripts
  and the redacted outputs.
- **Owed:**
  - Orchestrator: the board, the trace, and the merge routing. A human merges `grugops/ABC-208` `2e9eb9a7`, whose `src` is
    the measured one. The QE branch goes to main by path only (`.grugops/context/qe-ABC-208/`).
  - Architect: the ADR-0050 "in force" line at merge.
  - Scribe, after merge: the `AGENTS.md` null-move lane line (44 rows, 46.0 s).

### Trace row
| ABC-208 (qe-ABC-208) | QE PASS at 3a87f9d7: A1–A6 MET; QE-208-a/b/c closed (6/6 plants red their row); A5 S1 MET: D d1 GAIN +38.4 ± 23.3 (116/72/212, 400/400, 0 faults; overlap-free +40.2, load-free +30.3, both GAIN); G11 reported (10.Ne4 exd6 → Be2) | EPIC-008 | null-move pruning at null-window nodes, R = 3, guard below three non-pawn pieces, door pair (ADR-0050 ACCEPTED, in force at merge) | NFR-005 G6 MET (kiwipete 7 → 8, position-6 8 → 9, +1 ply both); G2 642.5/647.0 ns; G1 54/58; G5 ≤ 3 003.4 ms; G8 8.09 s; G9 empty; G10 none; N8-LANE 44 rows 46.0 s | grugops/qe-ABC-208 @ fb079c92 (3a87f9d7 + records)<br>.grugops/context/qe-ABC-208/notes/ (4) + raw/ | lint/typecheck/build 0; npm test 63/2128 success; skips 0 No findings.; lane inventory 63 = 63; SEARCH/ENGINE (unfiltered, 10 real-clock rows green)/PUZZLE_DEEP green; plants 6/6 | UAT SIGNED on QE PASS (…5aaf7cec item 2; decision …0477ac64) | Orchestrator: board, trace, merge routing (human merges grugops/ABC-208); Architect: ADR-0050 in-force line; Scribe: AGENTS.md null-move lane line | In Review → ready to merge (Orchestrator's move) |
