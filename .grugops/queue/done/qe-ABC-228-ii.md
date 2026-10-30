---
subtask: qe-ABC-228-ii
role: qe-e2e
ticket: ABC-228
ref: .grugops/context/qe-ABC-228-ii/
branch: grugops/ABC-228 @ 5e84d0d7 (code 8c82399f on d9c5bcde; base main 61d5d629, src-identical to current main); QE commits on a new grugops/qe-ABC-228-ii from 5e84d0d7 (new worktree .claude/worktrees/qe-ABC-228-ii)
width: ALONE (timing + games)
---

# QE ABC-228 under (ii): new PREREG, G5/G6/G11 at 4 s, G8, then A6 smokes

## Why
qe-ABC-228 STOPPED at G6 (position-6 9 vs 10). se-ABC-228-ii built Scope 5 (LEVELS[5] + DEFAULT_BUDGET_MS → 4 000;
rating.ts R literal → 4000) and read A9 met (65.9 % / 97.4 % ≤ 133 %). Orchestrator code review PASS.

## Read
- Ticket: A5 "Under (ii)", A6 "Under (ii)", A9, § Test notes 4. ADR-0053 d10. EPIC-010 § The merge rule.
- se-ABC-228-ii notes (`…5a99ee51`, `…c8c1e541`, `…ce56f9a5`, `…0f553b17`) on grugops/ABC-228.
- Your predecessor's notes and scripts (task `qe-ABC-228`, branch grugops/qe-ABC-228; `raw/qe-scripts/g6.mjs`) — reuse, budget changed only.

## Do
- PREREG first, sealed and committed before any timed run or game.
- Re-verify the Q-SET now lives in src/quiescence.test.ts (QE-C1..C4, QE-M1..M3) with the checkpoint's values.
- Gates via `npm run …`; npm test + skip integrity; deep lanes one file at a time.
- G5 (level 5 ≤ 4 s, 5 s ceiling), G6 under (ii) per A5 (5 interleaved runs per build, head at 4 000 ms vs base at its
  3 000 ms, median, "≥ base", floor 6), G11 at 4 s, G8 base vs head in this session.
  **On a G6 miss: STOP before the smokes and report** (goes to the owner — no further route exists).
- Rule SE-228ii-a (LOW proposed: GO_G3500 rows no longer distinguish levels 5–7).
- **A6 smokes ALONE at `--concurrency 1`**, R from the candidate head's rating.ts (reads 4000):
  `d 5e84d0d7 61d5d629 <out> --budget-ms 1500 --rounds 5 --concurrency 1` and `r 5e84d0d7 <out> --elo 1910 --rounds 5 --concurrency 1`.
  S-1..S-4 under (ii) bars. Host wait-clear (no cutechess, no foreign vitest at start). Thermal stop: median > 85 °C → STOP.

## Fences
No src/, tools/ or data/ edits. Never push, force, amend or rebase. Never merge into main. No board edits. Linters only
via `npm run …`; never a bare `npx` or `npm exec`. No host paths in any commit. Scratch in scratchpad `qe-228-ii/`.

## Publish
Sealed notes (task `qe-ABC-228-ii`, `at` from `date -u`). Commit on your branch. `## Result` + 10-cell trace row here,
then move this brief and claim to done/ (tracked copy on your branch if the guard refuses).

## Result

**2026-10-30, QE/E2E. Verdict: PASS_WITH_GAPS under reading (ii).** G6 is MET on both boards (kiwipete 8 = 8; position-6 head 10 = base 10, with head at its 4 000 ms against base at its 3 000 ms). The A6 smokes are MET (S-1..S-4: D 5.0 / 10, R 7.0 / 10 at 4 000 ms, 0 faults, 0 time losses). The only gaps are non-blocking. Under Test note 3 and the 2026-10-22 ruling, **this verdict signs UAT**. The merge is a human's.

- **Branch:** `grugops/qe-ABC-228-ii`, from `5e84d0d7`. The records are at `895721b0`, and this brief follows in the next commit.
  - QE merged nothing and pushed nothing, and made no `src`, `tools` or `data` edit.
- **Notes:**
  - PREREG `20261030T093852Z-qe-e2e-decision-45da5a05`, committed in `133c9ee6` before any timed read or game.
  - Gates `…-observation-3fac6579`. G6 / G11 `…-observation-269152b2`. SE-228ii-a `…-decision-c448c753`.
  - Smokes `20261030T115900Z-qe-e2e-observation-2123617d`. Verdict `…-decision-e39d190c`. Artifacts `…-observation-891196d6`.
- **Checks:**
  - Data rows and G9 under (ii) MET: only `LEVELS[5]` moved.
  - The Q-SET is in src at the checkpoint's values (QE-C1..C4, QE-M1..M3). QE's reader reads ALL PASS, so QE-228-b is closed.
  - lint, typecheck and build exit 0. `npm test` passed 2 219 / 2 219, with 0 skips and `No findings.`
  - All 15 deep lanes are green. **A4** 1.368× / 1.405×. **G1** 54/58.
  - **G5:** level 5 max 4 001 ms (≤ 4 s, ceiling 5 s).
  - **G8:** head median 9.61 s, base 8.91 s (+0.70 s). Its real-clock rows are `ENGINE_DEEP` only.
- **G6 under (ii):**
  - kiwipete: base 8 ×5, head 8 ×5.
  - position-6: base 10 ×5, head 10 ×5.
  - The floor holds. QE-228-c is closed.
- **G11 at 4 s (reported):** depth ≥ base on 5/5 positions, and the same move on 4/5 (10.Ne4 exd6 vs Be2, both at 7).
- **Smokes, ALONE at width 1:**
  - D (`d 5e84d0d7 61d5d629 --budget-ms 1500`): 3/3/4, **5.0 / 10**.
  - R (`r 5e84d0d7 --elo 1910`, `st=4`, from the candidate's `rating.ts`): 7/3/0, **7.0 / 10**.
  - The R row is recorded, but not compared and not pooled.
  - The pooled R since the last batch is `ABC-230`'s 8.0 / 10 at 3 000 ms. The flag is not evaluable (10 < 30). The pool closes at this merge.
- **Gaps / findings:**
  - **SE-228ii-a (LOW, non-blocking): CONFIRMED** by a planted fault. A `setoption Hash` that moves the level to 6 or 7 is red on base and green on head. Follow-up: give the Hash row a bare `go`, expecting 4 000.
  - **QE-228ii-b (INFO):** the transposition A7 row's title still says "3 s".
  - **QE-228ii-c (INFO, host):** a foreign vitest overlapped part of both smokes. No thermal stop fired, the frequency fall was ≤ 0.55 %, and the readings stand.
- **Host:**
  - Timing session: Tctl median 51.9 °C, max 70.3 °C.
  - D: median 76.0 °C, max 87.3 °C. R: median 75.13 °C, max 85.8 °C. No thermal stop fired.
- **Queue:** I worked only in the worktree. This tracked `done/` copy of the brief and its claim.md is on the QE branch. The main checkout's `claimed/qe-ABC-228-ii.*` was not touched.

### Trace row (10 cells, header order)

| ABC-228 (qe-ABC-228-ii) | QE PASS_WITH_GAPS under (ii) at 5e84d0d7: G6 kiwipete 8 = 8, position-6 head 10 (4 000 ms) = base 10 (3 000 ms) MET; A6 D 3/3/4 5.0/10, R 7/3/0 7.0/10 at 4 000 ms (not pooled), S-1..S-4 MET; Q-SET in src (QE-228-b closed); SE-228ii-a LOW confirmed (non-blocking) | EPIC-010 | in-check quiescence searches every evasion, mate score in quiescence, ADR-0053; level 5 plays 4 000 ms (ADR-0053 d10, reading (ii)) | NFR-004 G5 level 5 max 4 001 ms (≤ 4 s, ceiling 5 s); NFR-005 G6 10 = 10 / 8 = 8 MET; NFR-008 G8 9.61 s (+0.70 s); G1 54/58; heat: timing Tctl 51.9 / 70.3 °C, D 76.0 / 87.3 °C, R 75.13 / 85.8 °C | grugops/qe-ABC-228-ii @ 895721b0 (+ this brief; on grugops/ABC-228 5e84d0d7; code 8c82399f on d9c5bcde) | npm test 63 files 2 219/2 219, skips 0; 15 deep lanes green (quiescence 88/88 and 75/75, levels 44/44, engine 77/77, PUZZLE 18/18); planted-fault proof for SE-228ii-a; .grugops/context/qe-ABC-228-ii/notes/ (7) + raw/ | signed by the QE verdict (PASS_WITH_GAPS) | — | In Review → toward In Security/NFR (NFR-004/NFR-005 text) and the merge (human) |
