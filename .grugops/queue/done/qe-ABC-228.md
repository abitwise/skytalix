---
subtask: qe-ABC-228
role: qe-e2e
ticket: ABC-228
ref: .grugops/context/qe-ABC-228/
branch: grugops/ABC-228 @ d9c5bcde (code 9bd3c519; base main 61d5d629); QE commits on a new grugops/qe-ABC-228 from it
width: ALONE (timing + games)
---

# QE ABC-228: freeze-review the Q-SET, read the graded G6, then A6 (the smoke pair)

## Read
- The ticket (FOLDED blocks), ADR-0053 (ACCEPTED; decisions 9 and 10), SE notes `se-ABC-228/…1f8c9d92`, `…daf5ded5`,
  `…06ece474`, `…e87dea4a`; EPIC-010 § The merge rule; how qe-ABC-230 ran.

## Do
- PREREG first, sealed and committed before any timed run or game.
- **Q-SET:** the SE wrote the 12 rows without a prior QE freeze. Review each against the ticket and the ADR, and add rows
  where the class coverage is thin. Re-run the A1 identity (new doors = base's shipped path; older doors = themselves).
- **G6 (graded by its rule):** 5 interleaved runs per build at 3 000 ms on kiwipete and position-6, median, "≥ base",
  floor 6. The SE's forecast for position-6 is 98.3 %, so the margin is thin. **On a miss, STOP before the smokes and
  report.** The Orchestrator routes (ii) (ADR-0053 d10: A9 at 4 000 ms ≤ 133 %, level 5 → 4 s). Do not apply it yourself.
- G5 (real clock), G11 per the ticket, G1, G8 (time base and head in this session), gates, deep lanes (one file at a time,
  heap flag as needed).
- **A6, the smoke pair, ALONE at `--concurrency 1`** (Orchestrator's delivery call, as in qe-ABC-230):
  `d d9c5bcde 61d5d629 <out> --budget-ms 1500 --rounds 5 --concurrency 1` and `r d9c5bcde <out> --elo 1910 --rounds 5 --concurrency 1`.
  S-1..S-4. Host: no cutechess, no foreign vitest at start (wait-clear). Thermal stop: median > 85 °C → STOP.
- Note in your verdict that the SE ran one `npm exec --offline -- vitest` (an npx-like call). Rule its severity.

## Fences
- No src/, tools/ or data/ edits. Never push, force, amend or rebase. Never merge into main. No board edits. Linters only
  via `npm run …`; **never a bare `npx` or `npm exec`**. **No host paths in any commit**, intermediate ones included.
  Scratch goes in your own scratchpad subdirectory (`qe-228/`).

## Publish
- Seal notes (task `qe-ABC-228`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell trace row
  into this brief, then move it and its claim.md to done/. If the worktree guard refuses, put the done/ move on your
  branch's tracked copy and say so.

## Result

**2026-10-30, QE/E2E. Verdict: FAIL — STOPPED at G6.** On position-6, head's median completed depth at 3 000 ms is 9, against base's 10. **The smokes were not played** (the brief's STOP rule), and (ii) was not applied. The Orchestrator routes it (ADR-0053 d10). Under Test note 3 and the 2026-10-22 ruling, this verdict signs UAT, so **UAT is not signed** and the candidate does not merge on this reading.

- **Branch:** `grugops/qe-ABC-228`, from `d9c5bcde`. The records are at `dc91105c`, and this brief is in the commit after it. QE merged nothing, pushed nothing, and made no `src`, `tools` or `data` edit.
- **Notes:**
  - PREREG `20261030T072548Z-qe-e2e-decision-06163ef3`, committed in `184c5855` before any timed read or game.
  - Checkpoint `…-observation-bcf2fd7c`.
  - Gates `20261030T091456Z-qe-e2e-observation-ec55f86c`.
  - G6/G11 `…-observation-8829bc22`.
  - Verdict `…-decision-70c4723b`.
  - Pointers `…-observation-e41d498f` and the `.log.txt` note.
  - `readContext` reads back 7.
- **Q-SET (checkpoint):** the SE's 12 rows hold. QE's 6 rows hold, and the INFO row QE-C4 discriminates the new rule from the old. **A1 identity** is reproduced: 0 rows differ, and every sha equals the SE's.
- **Gates:**
  - lint, typecheck and build exit 0. `npm test` passed 2 211/2 211, the skip count is 0, and `No findings.`
  - All 15 deep lanes are green. **A4** 1.368× / 1.405×. **G1** 54/58.
  - **G5:** level 5 max 3 002 ms. **G7:** green.
  - **G8:** head median 9.37 s, base 9.05 s (+0.32 s). **G9** MET.
- **G6** (5 interleaved runs, wait-clear before each):
  - kiwipete: base 8,8,8,8,8 against head 8,8,8,8,8, **MET**.
  - position-6: base 10,10,10,10,10 against head 9,9,9,9,10, **NOT MET**.
  - The floor of 6 holds. Head's nodes at equal time are 87.8 % of base's on position-6. The measured CPU-per-node factor is 1.139, against A8's indicative 1.09, so the forecast would read ≈ 101.4 %.
- **G11** (reported): same depth on 5/5 positions and the same move on 4/5. Before 10.Ne4, head plays exd6 and base plays Be2, both at 7.
- **Host:** timing session Tctl median 55.3 °C, max 71.8 °C. A foreign vitest (another project) came and went 3 times; every timed read waited for it. The deep lanes overlapped it, stayed green, and peaked at Tctl 85.6 °C; they are not timed.
- **Gaps / findings:**
  - **QE-228-c (HIGH, blocks the merge):** G6 NOT MET on position-6. Route (ii).
  - QE-228-a (LOW): 3 in-check rows don't discriminate between the rules; the fix is to add QE-C4.
  - QE-228-b (LOW): QE's rows still need to move into `src/quiescence.test.ts`.
  - QE-228-d (LOW): the SE's single `npm exec --offline -- vitest`. It ran the local vitest offline, nothing was fetched, and no reading rests on it.
- **Smoke ledger:** no row, because A6 was not played. The pooled R is unchanged.
- **Queue:** I worked only in the worktree, per the Orchestrator. This tracked `done/` copy of the brief and its claim.md is on the QE branch. The main checkout's `claimed/qe-ABC-228.*` was not touched.
- **STOP:** G6 NOT MET, so I stopped before the smokes.

### Trace row (10 cells, header order)

| ABC-228 (qe-ABC-228) | QE FAIL (STOPPED at G6) at d9c5bcde: Q-SET 12 SE + 6 QE rows hold (+ INFO QE-C4); A1 identity reproduced (0 differ); A4 1.368x / 1.405x; G6 kiwipete 8 = 8 MET, position-6 head 9 < base 10 NOT MET; smokes not played; (ii) pending (Orchestrator) | EPIC-010 | in-check quiescence searches every evasion, mate score in quiescence, ADR-0053 | NFR-004 G5 level 5 max 3 002 ms; NFR-005 G6 position-6 9 < 10 NOT MET (kiwipete 8 = 8); NFR-008 G8 9.37 s (+0.32 s); G1 54/58; heat: timing Tctl median 55.3 / max 71.8 °C | grugops/qe-ABC-228 @ dc91105c (+ this brief; on grugops/ABC-228 d9c5bcde; code 9bd3c519) | npm test 63 files 2 211/2 211, skips 0; 15 deep lanes green (PUZZLE 18/18, levels 44/44, engine 77/77, transposition 26/26, quiescence 80/80); .grugops/context/qe-ABC-228/notes/ (7) + raw/ | not signed (QE verdict FAIL, G6) | — | In Review → back to the Orchestrator: route (ii) (Scope 5, A9 ≤ 133 %, re-read at 4 s) |
