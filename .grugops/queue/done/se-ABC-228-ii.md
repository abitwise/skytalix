---
subtask: se-ABC-228-ii
role: software-engineer
ticket: ABC-228
ref: .grugops/context/se-ABC-228-ii/
branch: grugops/ABC-228 @ d9c5bcde (worktree .claude/worktrees/agent-a2b69825faac13325); commit on it, forward only
width: ALONE (A9 is a timed read)
---

# SE ABC-228 (ii): build Scope 5, read A9 at 4 000 ms, fold QE's rows

## Why
qe-ABC-228 FAIL, STOPPED at G6: position-6 median depth head 9 vs base 10 (kiwipete 8/8). Finding QE-228-c (HIGH).
Owner's OQ-228-1 = (ii) already covers an A8/G6 miss (ticket § FOLDED; ADR-0053 d10). No new owner word needed.

## Read
- The ticket: Scope 5, A5 "Under (ii)", A6 "Under (ii)", A9, § Test notes 4, § Follow-ups. ADR-0053 d10.
- QE notes on branch grugops/qe-ABC-228 (task `qe-ABC-228`): `…8829bc22` (G6/G11 + node counts), `…70c4723b`
  (verdict), checkpoint `…bcf2fd7c` (QE's 6 rows + QE-C4). QE's G6 script: `.grugops/context/qe-ABC-228/raw/qe-scripts/g6.mjs` on that branch.

## Do
1. Scope 5 exactly as the ticket says (data only: LEVELS[5] → 4 000 ms; rating.ts R literal → 4000; nothing else).
   G9 waived on LEVELS[5] only.
2. A9 ALONE: forecast at 4 000 ms on kiwipete and position-6, bar ≤ 133 %. Wait-clear (no foreign vitest/cutechess)
   before timed reads. Above 133 % on either board: STOP, report; do not tune further.
3. QE-228-b: move QE's 6 rows + QE-C4 into `src/quiescence.test.ts` (test-only).
4. Gates via `npm run …`: lint, typecheck, unit, build; npm test count.

## Fences
No other src/ value changes. Never push, force, amend, rebase, or merge into main. No board edits. Never bare `npx`
or `npm exec`. No host paths in commits. Scratch in your scratchpad `se-228-ii/`.

## Publish
Sealed notes (task `se-ABC-228-ii`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
then move this brief + claim to done/ (tracked copy on your branch if the worktree guard refuses).

## Result

**2026-10-30, Software Engineer. Done. Branch `grugops/ABC-228`: code `8c82399f` on `d9c5bcde`, then the records commit (notes, raw, ticket line). Not merged; nothing pushed; no game played; no `cutechess-cli` ran.**

- **Scope 5 (data only):**
  - `LEVELS[5]` 3 000 → 4 000 and `DEFAULT_BUDGET_MS` 3 000 → 4 000. That is three literals, not two: the ticket and `ADR-0053` d10 name `DEFAULT_BUDGET_MS` for `ADR-0045` D2's equality (decision `…c8c1e541`).
  - `tools/rating/rating.ts` R mode: `mode === "r" ? 4000`, so `st=4`, `timemargin` 1 000.
  - Every other level value, `DEFAULT_LEVEL`, `HARDEST_LEVEL` and `HARD_CEILING_MS` are byte-identical. G9 is waived on `LEVELS[5]` only.
- **Test followers:** the `levels`, `engine` and `uci-session` pins. Level 5's ceiling margin is 1 000. The `uci-session` rows were not in the ADR's list. The `GO_G3500` rows now read 3 500.
- **A9, ALONE, wait-clear before every run** (0 vitest, 0 cutechess, load1 ≤ 2.0, Tctl ≤ 60 °C). A foreign vitest held the host for 2 min 46 s; the runner waited.
  - Base `61d5d629` at a real 3 s, round 1 (pre-declared): kiwipete d8 2 552 685, position-6 d10 2 617 954.
  - Head, frozen clock to that depth: 1 543 477 and 2 340 431.
  - **A9: 65.9 % and 97.4 % against the 133.3 % bar. MET on both boards** (observation `…5a99ee51`). Against 4/3 × base, that is 49.4 % and 73.1 %.
  - INFO: with QE's 1.139 factor, 68.9 % and 101.8 %.
  - INFO: head at a real 4 000 ms completed d8 and d10 in 3 of 3 runs each. That is not G6.
- **QE-228-b:** QE-C1..C3, QE-C4 (discriminating; closes QE-228-a) and QE-M1..M3 are now in `src/quiescence.test.ts`, as 8 new tests (observation `…ce56f9a5`).
- **Gates:** lint 0, typecheck 0, build 0. `npm test` 0: 63 files, **2 219 / 2 219**, 0 failed, 0 pending.
- **Findings** (observation `…0f553b17`):
  - SE-228ii-a (LOW, test strength): under (ii), the `GO_G3500` UCI rows no longer separate level 5 from levels 6/7.
  - SE-228ii-b (INFO): the old `forecast.mjs` mixes units in its A9 mode. It was not used.
  - SE-228ii-c (INFO): the brief and the ticket differ on the literal count. The ticket was followed.
- **QE owes:** G5, G6 and G11 at 4 s (head 4 000 against base 3 000), G8, the smokes under (ii) with the candidate's R tool, and UAT.
- **Queue:** the main checkout's queue accepted the move to done/.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-228 (se-ABC-228-ii) | Reading (ii): level 5 plays 4 000 ms; R mode passes skytalix 4000; QE's Q-SET rows in src | EPIC-010 | ADR-0053 d10 (OQ-228-1 (ii)); ADR-0045 D2 equality kept | NFR-005 A9 65.9 % / 97.4 % ≤ 133 % (MET); NFR-004 default 4 s, 5 s ceiling, margin 1 000 at level 5; G9 waived on LEVELS[5] only | grugops/ABC-228 @ 8c82399f (+ records commit): src/levels.ts, src/engine.ts, tools/rating/rating.ts | src/quiescence.test.ts (+8: QE-C1..C4, QE-M1..M3); followers in levels, engine, uci-session tests; npm test 63 files / 2 219 pass, skips 0 | — (UAT owed; QE verdict signs; G5/G6/G11 at 4 s and A6 smokes QE's) | — | In Review (branch, not merged; G6 under (ii) + smokes pending) |
