---
subtask: qe-ABC-210
role: qe-e2e
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/qe-ABC-210/
branch: new grugops/qe-ABC-210 from grugops/ABC-210 (a96f36b0), worktree ../wt-qe-ABC-210
width: 1 — ALONE for timing (G2, G5, G6, G8, real-clock rows, D; ~6–12 h). Records-only hops may run beside it (no npm/vitest/build). ABC-210's own single reading.
---

# QE gate + readings for ABC-210 (check extension at the horizon; ADR-0051 ACCEPTED)

> **One run (`…4c3f7639`):** each reading runs once, and its result is final. No repeat after NOT MET or UNRESOLVED. The ship rule's own extension step is part of the run. Pausing is not a re-run.
> **Power:** host was on AC at routing (80 %). Log the power source; never stop a reading because of it.

## Do
- Read Orchestrator `orch-2026-10-27j/…334b383d` and `owner-word-2026-10-27/…047d411f`.
- Merge current `main` first and report the sha. Run your own `npm ci --ignore-scripts`.
- **QE gate at your merge.** Verify the page's criteria independently against the `## Design ruling`, ADR-0051 (Architect `arch-design-ABC-210/…c5d0e464`; accepted `arch-accept-adr0051/…e83d5703`) and the build (SE `ticket-to-pr-ABC-210/…8c4e8b4b`, `…548912ef`).
  - **A1 out of tree:** the doors node-equal to base (nodes, score, move) across the ruling's cells.
  - **A2:** the five horizon rows, the line-length instrument and the cap row. Re-run the load-bearing plants; name the blind spots.
  - **A3:** d6 nodes ≤ 1.5× the door; drift d5 on the 190 both recursions ≥ 90 % within 25 cp, none beyond 174 cp; same-depth mate floor on the 287.
  - **P1:** re-plant the fixture bug and show the depth-2 (−502) row still bites.
  - **Audit the moved rows** against the ruled set: P1, P2 (`zugzwang.005` d13 and the table-sanity range "8 to 13", ruled part of P2 in …334b383d), 2 export lists, 2 QE-208-c door maps, 5 re-points. Anything else moved → STOP to Architect/Design.
  - **The LOW in …334b383d:** an extended node does not itself test dead-position / 75-move draws. Say whether any row exercises it and whether you see a value effect.
- **Gates:** lint, typecheck, build, `npm test` + `last-run.json`, skips (`test-skip-integrity.js --skip-count 0`), SEARCH_DEEP (incl. null-move and check-extension lanes), ENGINE_DEEP, PUZZLE_DEEP (G1 ≥ 54/58).
- **Real-clock readings:** G2 ≤ 1 100 ns with base in the same session; G5, G8, G9, G10, G11 as the page states; the real-clock rows the build filtered out.
- **Pre-check:** the frozen-clock d7/d8 counts, base vs head, must equal the ruling's table. Any difference → STOP to Architect/Design, and no G6 or D.
- **G6** under EPIC-008's G6 rule, "≥ base" graded (rule A, `…2ae5fc12`): n = 5 per board per build, interleaved; graded by median; any run below 6 FAILs. A miss → STOP to Architect/Design, and no D.
- **D** only if the gate and G6 pass:
  - ABC-204 harness `d` mode: candidate = your merge, base = its merge-base on main. ABC-204 pins, B = 1 500 ms. PREREG first.
  - Grade by EPIC-008 ship rule **S1**. GAIN → MET. NEUTRAL → the one extension (400 more games, same pins, pooled; report the pooling); GAIN after it → MET. Anything else → NOT MET: a `failed-attempt` note, and no merge.
- **Before each reading:** load1 ≤ 8, and no foreign vitest (wait up to ~60 min). Sample every ~10 s and map overlaps to games. Report all-games and overlap-free results; grade by the page.
- **Verdict and UAT:** this is a production change, so the QE verdict signs UAT under `…5aaf7cec` item 2.

## Fences
- Work only in your worktree and `<scratchpad>/qe210/`. Raw outputs go under your context folder, per ABC-204 A7. Make driver scripts executable before the first start.
- No `src/` or `tools/` edits.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-ABC-210`) with `at` taken from `date -u`, including a `kind: decision`. Commit on your branch.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-27 (task `qe-ABC-210`, ALONE for timing). Verdict: FAIL on A5 at merge `d71fc369`.** The branch
`grugops/qe-ABC-210` = `grugops/ABC-210` `a96f36b0` + `main` `a17d5945`, with records at **`16032408`**. Base = the merge-base
`a17d5945` (code = `b5c67ab7`).
- The gate, G2 and G6 pass. The ship rule rejects the change.
- Not pushed, not merged into main. No `src/` or `tools/` edit, no board edit.
- One pre-registered run under `…4c3f7639`, with S1's extension as its own step. `main` has not moved since `a17d5945`, so D
  is not stale.

- **Criteria:** `A1`–`A4` and `A6` MET; **`A5` NOT MET (S1).**
  - `A1` out of tree: **6 156/6 156** cells equal (the `ABC-078` `A3` sweep 5 772, six roots 384). The new pair equals base's
    shipped path, and all 12 older doors equal their pre-ticket selves.
  - `A2`: the five horizon rows ×2, the instrument and the cap row are green.
  - `A3`: d6 1.054× / 1.007×; drift 93.58 % / 94.12 %, max 116 cp; mate floor 0 of 189.
  - `A4`: `G1` 54/58, `G5`, `G8`, `G9` met, `G10` none.
- **Pre-check: 8 of 8 frozen d7/d8 counts equal the ruling's table.** No STOP.
- **Moved rows: exactly the ruled set.** P1, P2 (d13 and "8 to 13"), 2 export lists, 2 door maps, 5 re-points. Base's tests on
  head's `src/` red only those rows, and the re-pointed rows read their pre-ticket figures. No STOP.
- **P1:** three re-planted fixture bugs each red the d2 (−502) row.
- **Plants:** 26/26 red a row. The 3 caught only by the source row are equivalent mutants.
- **The LOW (…334b383d):** no row exercises it, and no value effect was found. A dead position cannot change value; the
  75-move rule showed 0 effect on 942 cells at clock 149. No fix owed.
- **G2 MET:** head 641.3 / 642.8 ns, base 645.1 / 641.5 ns.
- **G6 MET** against "≥ base", n = 5 per board per build, interleaved: kiwipete 8 ×5 both; position-6 9 ×5 both. 0 of 20 runs
  overlapped. **G11:** 5/5 choices equal.
- **D (S1) NOT MET:**
  - d1 **NEUTRAL −1.7 ± 22.8** (89/91/220, 400/400, 0 faults), so the one extension ran.
  - d2 **NEUTRAL −7.8 ± 23.0** (87/96/217, 400/400, 0 faults).
  - **Pooled NEUTRAL −4.78 ± 16.21** (176/187/437, n 800, X − Y = −20.98). The pooling is the sum of the two `Score of` lines
    through QE's `elo.cpp` port, checked equal to each tool line.
  - The grade is the same overlap-free (−5.30 ± 17.91), load-free (−6.62 ± 17.48) and by power (AC −1.14, battery −16.56); all
    NEUTRAL.
  - D exercised the change: the candidate's `dist/` carries `checkExtensionPlies`, and the base's does not.
- **Gates:**
  - lint, typecheck and build 0; `npm test` 64 files, 2 161/2 161, `last-run.json` success; skips 0, `No findings.`; lane
    inventory 64 = 64. `G8` 8.55 s at load1 7.57.
  - SEARCH_DEEP check-extension 43, null-move 44, search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29.
  - ENGINE_DEEP unfiltered 60/41/26/21/37/47: the 11 filtered real-clock rows ran and are green.
  - PUZZLE_DEEP 18/18; CLI_DEEP 11/11; UCI_DEEP 5/5.
  - `G5`: level 5 ≤ 3 003 ms; levels 6 and 7 inside their ceilings. `G7`: 8.70 → 8.71 MiB.
- **UAT: NOT signed** (no PASS; `A5` NOT MET is blocking by the page). **Merge: none.**
- **Findings:**
  - QE-210-a INFO: the null-child ×2 and before-repetition plants are equivalent mutants, caught only by the source row. No
    row owed.
  - QE-210-b LOW: the …334b383d blind spot, closed with no value effect found.
  - QE-210-c INFO: the `A1` roots capped `searchWithoutOrdering` at d4 and the unpruned doors at d3, for cost.
  - QE-210-d INFO, host: d1 shared the host with another project's vitest lane (144 games); d2 went to battery at 16:41:08Z
    (100 → 40 %); two outside load spikes (load1 31.0, 25.6). The grade is unchanged.
  - Carried `QE-207-g`: this claim was held about 12.7 h against a 30 min TTL.
- **Notes** (`.grugops/context/qe-ABC-210/notes/`, on `grugops/qe-ABC-210`): decision `…b953e670`; failed-attempt `…86b45c13`;
  observations `…bd87e22e` (gate), `…8b5e45fd` (pre-check, G2, G6, G11, real-clock rows) and `…e7597a78` (D). `raw/` holds the
  PREREG with its addendum, the scripts, the probes, the plants, the audit and the redacted outputs.
- **Owed:**
  - Orchestrator: the board (back to BA/PM under S1), the trace and routing. The QE branch goes to main by path only
    (`.grugops/context/qe-ABC-210/`); `grugops/ABC-210` is not merged. The AGENTS.md lane line does not land.
  - Architect: `ADR-0051` "accepted, not in force on main"; the `ADR-0050` d9 P2 line records that P2 did not land.
  - BA/PM: S1 (close, or one re-tune round, which needs the owner's word), and QE-210-b if the ticket is re-cut.

### Trace row
| ABC-210 (qe-ABC-210) | QE FAIL on A5 at d71fc369: A1–A4, A6 MET (A1 6 156/6 156 cross-build cells; A2 five horizon rows ×2 + instrument + cap row; A3 1.054×/1.007×, drift 93.58 %/94.12 % max 116 cp, mate floor 0/189); pre-check 8/8 equal; moved rows = the ruled set; P1 bites at d2; A5 S1 NOT MET: d1 NEUTRAL −1.7 ± 22.8, d2 NEUTRAL −7.8 ± 23.0, pooled NEUTRAL −4.78 ± 16.21 (176/187/437, 800 games, 0 faults); D exercised the change | EPIC-008 | check extension at the horizon, +1 ply once per line, off-door pair (ADR-0051 ACCEPTED; not in force: not merged) | NFR-005 G6 MET (kiwipete 8 = 8, position-6 9 = 9); G2 641.3/642.8 ns; G1 54/58; G5 ≤ 3 003 ms; G7 8.70 → 8.71 MiB; G8 8.55 s; G9 identical; G10 none | grugops/qe-ABC-210 @ 16032408 (d71fc369 + records)<br>.grugops/context/qe-ABC-210/notes/ (5) + raw/ | lint/typecheck/build 0; npm test 64/2161 success; skips 0 No findings.; lane inventory 64 = 64; SEARCH (incl. check-extension 43, null-move 44)/ENGINE (unfiltered, 11 real-clock rows green)/PUZZLE/CLI/UCI_DEEP green; plants 26/26 red (3 equivalent, source row only) | UAT NOT signed (A5 NOT MET; decision …b953e670; failed-attempt …86b45c13) | Orchestrator: board back to BA/PM under S1, trace, AGENTS.md line not landing; Architect: ADR-0051 "accepted, not in force on main", ADR-0050 d9 P2 line; BA/PM: S1 close or re-tune (owner's word), QE-210-b | In Review → back to BA/PM under S1 (Orchestrator's move); not merged |
