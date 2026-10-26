---
subtask: qe-gate-ABC-208
role: qe-e2e
ticket: plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
ref: .grugops/context/qe-gate-ABC-208/
branch: new grugops/qe-gate-ABC-208 from grugops/ABC-208 (80345eb9), worktree ../wt-qe-gate-ABC-208
width: 1 of 3 — NOT alone: no real-clock timing (no G2, G5, G6, G8, D)
---

# QE static gate for ABC-208 (null-move pruning, ADR-0050 PROPOSED)

> Split per Orchestrator `orch-2026-10-26g`. The ALONE real-clock reading (G2, G5, G6, G8, D under S1) is a later hop, `qe-ABC-208`, queued only after the owner accepts ADR-0050.

## Do
- Merge current `main` first (report sha). Own `npm ci --ignore-scripts`.
- Check the page's criteria A1–A4 independently against the `## Design ruling`, the dated amendment lines, ADR-0050 (Architect `…012b1053`, `…bae20026`) and the build (SE `…e0666f5b`, `…83c40265`). Real-clock parts are left for the later hop.
  - A1: run the cross-build check out of tree on the ABC-078 A3 corpus at that sweep's budgets.
  - Rule on the SE's flag: shipped `chooseMove` differs on 5/6 roots at d6, not the 6/6 the Architect's note states (position-3 is guarded out). Is A1 met as written?
  - A2: 7/7 at the per-row depths.
  - A3: the oracle and the mate floor at d5.
  - Re-run the load-bearing plants. Name the blind spots.
- Audit the 14 moved rows: cross-run each tree's code against the other's tests.
- Class the SE's flag on the ENGINE_DEEP real-clock "A2 — depth completed in the default budget" report row (still on `chooseMove`).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips, SEARCH_DEEP (including the new null-move lane), ENGINE_DEEP (deterministic rows), PUZZLE_DEEP (G1 54/58). Report the frozen-clock pre-check counts (base vs head).
- Verdict for the static part only (GATE PASS / FAIL with findings). UAT is not signed here; it is signed after the reading.

## Fences
- Only your worktree and `<scratchpad>/qe208gate/`. No `src/`/`tools/` edits. No real-clock timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Seal notes (task `qe-gate-ABC-208`), `at` from `date -u`, with a `kind: decision`. Commit on your branch. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-26 (task `qe-gate-ABC-208`, static part only). Verdict: GATE PASS at `ddc307a9`**
(`grugops/qe-gate-ABC-208` = `grugops/ABC-208` `80345eb9` + `main` `ef9711ec`; records at **`6c501290`**). Not alone, and
no real-clock timing. Not pushed, not merged into main. No `src/`/`tools/` edit, no board edit. Not a UAT signature: UAT is
signed after `qe-ABC-208`'s reading.

| criterion | static verdict |
|---|---|
| `A1` | **MET**, out of tree, base `ef9711ec` vs head `ddc307a9`. The `ABC-078` `A3` corpus at that sweep's budgets: **4 795/4 795** cells equal in move, score and nodes (depths read d1–d5). The six-roots extension: **258/258**. Total **5 053/5 053**; the unpruned doors were capped at d3 (they have no null-window node). Bite: shipped differs on 82/440 + 38/393 sweep cells and 10/24 + 15/18 root cells |
| flag 1 (5/6) | **`A1` is met as written.** It asks the door to equal base's shipped search and each older door to equal itself, not how often shipped differs. Measured 5/6 at d6 (position-3 has no null move under the three-piece guard). `…bae20026`'s "6/6" is wrong: LOW, records (QE-208-d) |
| `A2` | **MET 7/7** at the ruled depths. The instrument and pawn-only rows are green. QE's own KPK bitbase confirms all four K+P rows are unique wins |
| `A3` | **MET**: 100.00 %/25 cp, 100.00 %/8 cp, 0 mate flips, mate floor 0 of 189. Probe in the unchecked direction: 0 null-only, shorter or longer mates (287 and 190, both recursions) |
| `A4` | `G1` **54/58** (base's four misses). `G4` MET via `A1`. `G7` not owed. `G5`/`G6`/`G8`/`G9`/`G10` → `qe-ABC-208` |
| `A6` | content MET. The ADR records the report to the owner as intent only: LOW (QE-208-e) |
| 14 moved rows | **exactly the ruled set**, cross-run both ways. Base code with head tests reds all 14 and only them; head code with base tests reds only the 2 export lists. Printed readings are equal to base's line for line |
| flag 3 | `ENGINE_DEEP` real-clock "A2 — depth completed" report row on `chooseMove`: consistent with `ADR-0050` d4 (a report on the shipped path stays), not a moved row, INFO. Its depth now includes null move |
| Test note 4 | kiwipete d7 609 900 → 590 489, d8 1 735 339 → 1 259 463; position-6 d7 586 333 → 180 941, d8 1 355 149 → 355 565 (head d9 2 907 475; 940 109). All equal the ruling's. **Does not stop the run.** Kiwipete d6 is +24.8 % (reported) |
| Plants | 30 on the whole default lane: 24 bite, 6 survive. The ADR's deep figures reproduce exactly (cut 42.78 %, sign 41.71 %, no guard 7/7 A2 + mate floor, guard 2 `.004`/`.005`, null score source-only) |
| Gates | lint/typecheck/build 0; `npm test` 63 files **2 123/2 123**, `last-run.json` success, 0 failed/pending/todo; skips 0, `No findings.`; lane inventory 63 = 63. `SEARCH_DEEP` null-move 39, search 57, ordering 38, transposition 40, quiescence 37, pvs-lmr 29; `ENGINE_DEEP` engine 54 (+6 filtered), levels 37 (+4), transposition 25 (+1); `PUZZLE_DEEP` 18/18. 10 real-clock rows not run |

**Findings.**
- **QE-208-a (MEDIUM, SE, test-only, before merge):** nothing pins the engine's null-move unmake on abort. The no-`finally` plant
  survives every deterministic lane (0/2 123 default, 0/385 deep), while 438/900 aborted calls return a flipped-side position.
- **QE-208-b (MEDIUM, SE, test-only, before merge):** nothing pins the null child's key write in either recursion. Its plant
  survives every lane, but changes nodes, and in `search()` the score and move, at d6/d7. At d ≤ 5 every null child is a leaf.
- **QE-208-c (LOW, SE, with a/b):** nothing in tree pins `nullMove: false` on the PVS-off pruned doors. SE choice 5's premise is
  measured false (25/661, 25/661 and 9/471 node diffs). Only the out-of-tree `A1` sees it.
- **QE-208-d** (LOW, records), **QE-208-e** (LOW, `A6` status line), **QE-208-f** (INFO).

Notes are sealed via `admitAndAppend` and read back 4/4, in
`../wt-qe-gate-ABC-208/.grugops/context/qe-gate-ABC-208/notes/`: decision `…8c4f3e57` (verdict, rulings, findings), observations
`…78e6edcd` (criteria evidence), `…98174381` (audit, plants, blind spots) and `…e4e8a8e6` (gates); `raw/` holds the scripts and
outputs.

**Owed:** SE: QE-208-a/b/c (rows only; QE re-runs the three plants). Owner: `ADR-0050`. Then `qe-ABC-208` ALONE (`G2`, `G5`,
`G6`, `G8`, `G9`, `G10`, `G11`, D under S1, the 10 real-clock rows). Carried: the `AGENTS.md` null-move lane line (Scribe, after
merge); `ABC-121`'s 75 cp vs 118 (backlog).

### Trace row
| ABC-208 (qe-gate-ABC-208) | QE static GATE PASS at ddc307a9: A1 MET out of tree 5 053/5 053 (A3 corpus 4 795 + six roots 258; 5/6 ruled, A1 met as written); A2 7/7; A3 = ruling; 14 moved rows = ruled set; 2 MEDIUM + 1 LOW test gaps owed (QE-208-a/b/c) | EPIC-008 | null-move pruning (ADR-0050 PROPOSED) | G1 54/58; G4 via A1; frozen-clock pre-check does not stop (head < base at d7/d8 on both boards); G2/G5/G6/G8/G9/G10/G11, D → qe-ABC-208 | grugops/qe-gate-ABC-208 @ 6c501290 (ddc307a9 + records)<br>.grugops/context/qe-gate-ABC-208/notes/ (4) + raw/ | lint/typecheck/build 0; npm test 63/2123 success; skips 0 No findings.; SEARCH/ENGINE(deterministic)/PUZZLE_DEEP green; 30 plants (24 bite, 6 survive → QE-208-a/b/c); cross-run audit both ways; KPK bitbase 4/4 | not signed here (after qe-ABC-208's reading) | — | In Review (static gate PASS; SE test-only rows owed; ALONE reading waits on ADR-0050) |
