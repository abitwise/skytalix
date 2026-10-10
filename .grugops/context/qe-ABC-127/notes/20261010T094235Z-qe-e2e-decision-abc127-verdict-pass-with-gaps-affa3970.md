---
id: 20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970
kind: decision
by: qe-e2e
at: 2026-10-10T09:42:35Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - ABC-126
  - ABC-083
  - ABC-087
  - RISK-003
  - N8-LANE
  - ADR-0027
  - ADR-0033
  - src/puzzle-corpus.ts
  - src/puzzle-suite.test.ts
  - src/puzzle-suite.baseline.json
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - 20261010T085351Z-software-engineer-decision-abc127-curated-rows-oracles-one-budget-558e9520
  - 20261010T091643Z-software-engineer-observation-abc127-gates-a1-a8-readings-eee7be49
  - 20261010T085351Z-software-engineer-claim-abc127-agents-md-line-and-owed-6341cc47
  - 20261010T094235Z-qe-e2e-observation-abc127-readings-a3-17of17-identical-oracle-38of38-f5e127b9
  - 20261010T094235Z-qe-e2e-decision-abc127-d1-random-placements-meet-the-page-breadth-ff8bd77d
supersedes:
---

# `ABC-127` QE verdict: **PASS_WITH_GAPS** at `a7e1128`. `A1`–`A6` MET, each re-proven by QE's own instruments. `A7`/`A8` are readings for Security/NFR. `A9` is owed by the Scribe. Seven advisory gaps, none blocking

Hand-authored and unsealed. This is a `decision`, not a `finding`: this install has no `§14-gate`
verdict. Diff under review: `4a64dd9..a7e1128` on `grugops/ABC-127-harder-puzzles`. Owner's option B
applies: QE ran `PUZZLE_DEEP=1` (three processes) and `PUZZLE_DEEP=weakened` itself. Readings and raw
files: observation `…f5e127b9`.

## Per criterion

| | QE's reading | result |
|---|---|---|
| `A1` | 22 new rows after the 40: 12 mate-in-3 and 10 win-material (7 black to move). Tags: quiet-key 14, `depth≥5` 10, `quiescence` 11. Tag truth from QE's own matrix: `W5` misses 10/10 `depth≥5` rows and `W1` misses 11/11 `quiescence` rows. QE's oracle confirms quiet-key (14/14) and finds no duplicate and no colour mirror. The 40 old rows and `HANGING_CORPUS` are byte-identical | **MET** |
| `A2` | QE's own oracle checks all **38/38** answered rows exact, the 6 old win-material rows included. It is a fresh mailbox generator, perft 13/13, with 0 imports from `src/` and no code shared with either build oracle. Both lane oracle rows are green in 3 processes. **22/22** seeds regenerate their FEN | **MET** |
| `A3` | QE's own harness: **15/17 red**. All 7 old reds stay red. **8/10 survivors** go red: `W1`, `W1b`, `W4`, `W5`, plus `W2`, `W13`, `W14`, `W16`. `W10` and `W11` survive. **Identical to the build's table on 17/17**: solved count, exit code and missed-row set. `src/` was clean after every plant (`git diff --quiet HEAD -- src`) | **MET** |
| `A4` | **58/62**, so solved = total − 4. The old 40 are 40/40. `ABC-084` A1 and A2 are green. `weakened` reads 19/62 with exit 1. The 4× run (out of tree) reads **62/62 > 58**, with 4 `NEWLY-SOLVED` lines | **MET** |
| `A5` | `47433c5` touches the baseline file alone, states a reason and records count, total, budget, step, `unsolved` (4), commit, machine, load and walls. 58 ≥ 40, so it is not a lowering. Under all 15 reds the printed `NEWLY-MISSED` lines equal QE's recomputation, and no `NEWLY-SOLVED` line appears. The gate is still count plus total. `e1f5732` alone: **only** the deep gate row is red (`expected 62 to be 40`), and the default lane is green | **MET** |
| `A6` | Three processes are `cmp`-identical on all 62 rows, and identical to the build's rows. The 5 step-guard rows are green | **MET** |
| `A7` | Gating 28.3 / 32.3 / 30.5 s and whole lane 44.8 / 53.4 / 47.0 s, at load1 7.4–8.8. Under the 45 / 90 s caps. Not asserted, 300 s guards | reading, **Security/NFR's** |
| `A8` | 50 test files at base and at tip (0 new). The ms charge was not measured by QE | reading, **Security/NFR's** |
| `A9` | Not landed. `AGENTS.md` is 23 464 B and unchanged. The line is drafted in `…6341cc47` | **OWED, Scribe.** Re-check after it lands. If a row is ever added, the drafted count `17 passed (12 default)` moves |

## Decision D1

**Accepted:** seeded random placements meet the page's breadth wording. Reasoning and residual:
decision `…ff8bd77d`.

## The host-protection check: exit 2, not a gate here

- **What it read.** `node tools/grugops/host-protection.js` exits **2**: `UNKNOWN - verify`. The
  repository has **0 git remotes**, so `gh` cannot name a repository. The production-environment line
  is `UNKNOWN - verify` by design.
- **Why it is not a gate.** `.grugops/factory.config.json` `quality.mandatory_gates` is
  `["lint","typecheck","unit","build"]`, and the host check is not in it. Workflow 05 step 3 runs it as
  a **report** that "never changes the terminal result on its own". A zero-config solo repository "is
  never blocked by it".
- **How it is recorded.** As `UNKNOWN - verify`, and **never read as a pass**. With no remote it
  cannot become anything else. The merge floor here is the owner's standing authority (`AGENTS.md`
  § Branching model), not a host rule.

## Gap register (advisory; none breaks a criterion)

**QE-127-a, MEDIUM — the thin reds sit on the budget edge.**
- **What QE measured.** At 0.8× readings (step 1.25, out of tree) the shipped engine reads **54/62**.
  It loses 4 `depth≥5` mate rows: seeds 1008, 1075, 1424 and 1982.
- **Which reds that touches.** `W14` is red by 2 rows, seeds 1008 and 1075. `W13` is red by 3 rows,
  seeds 1, 69 and 1982. Both are caught only by `depth≥5` sparse mate rows, and three of those five
  rows also fall to a 20 % cut in readings.
- **What follows.** The suite cannot tell "LMR mis-reduces" from "the search spends 20 % more readings
  per depth".
- **Why it matters for `ABC-083` / `ABC-087`.** An engine change that adds nodes per iteration
  (extensions, heavier ordering) can go red on exactly these rows at fixed readings. Red = QE FAIL
  under the owner's rule, and a lowering needs the owner's word.
- **For whoever reads such a red.** Compare the per-row depth and nodes before routing. That is a
  reading aid, not a change to the rule.

**QE-127-b, LOW — `W11` still survives.** No row separates the shortest mate from a longer one, and
`W10` survives by design. The page allows both (≥ 2 of the optional five; `W10` is not required).

**QE-127-c, LOW — breadth residual (D1).** All 62 rows have at most 14 men. The new mate rows are 4–8
men. All 4 headroom rows are sparse mating nets, so only "longer mates in sparse endings" can show as
an improvement. A `NEWLY-MISSED` line names a seed, not a motif. See `…ff8bd77d`.

**QE-127-d, LOW — the count gate can be masked, by the page's design.**
- A ticket that solves *k* headroom rows while losing *k* rows elsewhere stays green.
- The `NEWLY-MISSED` lines name both, but they do not gate. With `W14`'s margin of 2, two gained
  headroom rows would hide it.
- **Recommended practice:** at every option-B run, treat any `NEWLY-MISSED` line on a green run as a
  finding to read.

**QE-127-e, LOW — `unsolved` is not cross-checked against the corpus.**
- A stale or misspelt name in `src/puzzle-suite.baseline.json` `unsolved` gives a spurious
  `NEWLY-MISSED` line on a green run. It is never red.
- A cheap deep-lane row would close it: every `unsolved` name is a row, and `solved + |unsolved| =
  total`.
- **Not added by QE.** It would move the lane count the Scribe's drafted `A9` line quotes. Routed to
  BA/PM. `ABC-126`'s rebase is the natural moment.

**QE-127-f, LOW, inherited — two defective old rows now feed the deep `A2` row.**
- The two rows are already `ABC-126`'s: "pin: Re1…" has a pawn on rank 1/8, and "discovered check…"
  has the side not to move in check.
- Since this build they are inputs to the deep `A2` win-material row.
- The second row's accepted set exists only under the convention that a king is never captured. With
  king capture allowed, QE's oracle read `d4g7` at +998.
- **For `ABC-126`.** Its re-author must keep that row green with a legal position. The build named this
  too (`…558e9520` D6).

**QE-127-g, LOW, for Security/NFR — `A7` walls near the caps under load.**
- At `e1f5732`, with QE's matrix running alongside (load1 ~9–19), the gating run read 43.7 s against
  the 45 s cap.
- The 4× reading (not a lane row) read 299.0 s at load1 19→44, 1 s under the 300 s guard. Anyone who
  re-runs the 4× reading under load should expect a guard trip.
- **These are readings.** The caps and their load condition (load1 ≤ 8) are Security/NFR's to rule.

## Not QE's, recorded only

- **`A7`, `A8`, `N8-LANE`:** Security/NFR rules on them (readings above and in `…f5e127b9`).
- **`A9`:** the Scribe's.
- **The board move** (`In Review` exit → `In Security/NFR`): the Orchestrator writes it.
  `plans/board.md` is fenced from this hop.

**Not merged, not pushed. QE added 0 test rows and 0 production lines.** QE's commit carries the
notes, the probe and one trace row.
