---
id: 20261010T123857Z-qe-e2e-decision-abc087-verdict-pass-with-gaps-5e6c0109
kind: decision
by: qe-e2e
at: 2026-10-10T12:38:57Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-085
  - ABC-101
  - EPIC-004
  - EPIC-006
  - ADR-0032
  - ADR-0027
  - ADR-0035
  - NFR-004
  - NFR-005
  - N8-LANE
  - src/levels.ts
  - src/levels.test.ts
  - 20261010T123857Z-qe-e2e-observation-abc087-invariants-reproved-eleven-mutants-62168263
  - 20261010T123857Z-qe-e2e-observation-abc087-gap-register-62d79e31
  - 20261010T123857Z-qe-e2e-observation-abc087-nfr004-clamp-bounds-deadline-not-return-df34cf5a
  - 20261010T120729Z-software-engineer-observation-abc087-rehop-option-a-n8-lane-met-69fa98d1
  - 20261010T120017Z-ba-pm-decision-abc087-n8lane-option-a-a4-frequency-reworded-085-risk-named-52f042aa
  - .grugops/context/qe-ABC-087/probe/out-gates-tip.txt
  - .grugops/context/qe-ABC-087/probe/raw-deep-tip.log
supersedes:
---

# `ABC-087` QE verdict: **PASS_WITH_GAPS** at `b2fe6f21`. `A1`–`A10` MET, and all six `ADR-0032`/`ADR-0027` invariants hold on QE's own harness. Two MEDIUM gaps are regression-net holes (`M3a`, `M8` survive every shipped lane). Neither is a defect, and neither blocks

Hand-authored, no seal. This is a `decision`, not a `finding`: no `§14-gate` verdict exists on this install.
- **Under review:** `94cf5e6b..b2fe6f21` on `grugops/ABC-087-difficulty-levels`. Code is `659215a3`,
  tests are `3a133d26`/`f61ad6b1`, and docs are on top.
- **The `src/` diff is `src/levels.ts` +182/−0 and `src/levels.test.ts` +501/−0 only.**
- QE ran the gates and the deep lane in the Engineer's worktree. Every probe and mutant ran in
  `git archive` copies in QE's scratchpad.
- **Wave drift since base:** the wave changed only `src/cli.test.ts` (`ABC-058`), so the production
  tree is the one this lands on.

| | reading at QE | result |
|---|---|---|
| `A1` | `LEVELS` keyed `1`–`5`, frozen, `{ budgetMs, blunderRate }` only: 100/0.40, 500/0.20, 3 000/0, 4 000/0, 4 500/0. `EASIEST_LEVEL` 1, `DEFAULT_LEVEL` 3, `HARDEST_LEVEL` 5. Default lane ×4 green | **MET** |
| `A2` | Deep, virtual clock (test note 3). Shipped path: 102/100, 510/500, 3 060/3 000, 4 080/4 000, 4 590/4 500 (+2.0 %). Blunder path at the easiest level: **101.3/100 over 20 children and over 43**. All ≤ 5 000. `M9` (deadline not shared) reds here | **MET** |
| `A3` | Deep, `ABC-084`'s rule at one 120 ms step: **easiest 35/62 < default 58/62**. The baseline JSON is untouched. A measurement, not the gate (`ADR-0034`) | **MET** |
| `A4` | Deep. `ENDGAMES`: (80 + 1)/204 = **39.7 %**, played 39.2 %. Perft + puzzles: (97 + 0)/246 = **39.4 %**. All legal; never the worst; the strict second-best on each list. **QE re-proved it independently against the ENGINE's real child scores** (`I3`/`I4`: 115 coarse + 12 fine positions, 29 with a tied best). Gaps: `QE-087-b` (the shipped clause reads a self-reported list), `QE-087-f` (the ±5 pp statistic) | **MET** |
| `A5` | Deep, REAL clock: **30/30 ≤ 5 000 ms, max 4 531 ms** (4 500–4 531) during a lane at load1 3.62 → 6.74. The hardest rate is 0, so the blunder clause does not apply (asserted) | **MET** |
| `A6` | `LEVELS[3].budgetMs` = 3 000 = `DEFAULT_BUDGET_MS`, rate 0. **QE's `I6`:** level 3 is `chooseMove` at 3 s, one call, with the same move, depth, nodes, elapsed and clock-read count on 17 positions × 3 seeds. So `NFR-005`'s readings on `chooseMove` at 3 s ARE this level's. Gap `QE-087-a`: the shipped A6 row is blind to `M3a` | **MET** |
| `A7` | Seed 2026, 30 positions, identical sequences with ≥ 1 blunder. QE's `I2` is stronger: the decisions follow the generator draw-for-draw | **MET** |
| `A8` | `git diff --numstat 94cf5e6b b2fe6f21 -- src/engine.ts src/search.ts src/cli.ts src/cli-options.ts src/turn-loop.ts src/virtual-clock.ts` is **empty**. `engine.ts`/`search.ts` blobs are identical (`9aa5b67a`, `7d172c4d`). The only production file is `src/levels.ts`. Its added lines hold no `process.`/`argv`/`readline`/`prompt`/`stdin`/`stdout`/`console.` and no `virtual-clock` import. There is no PRNG/seed in `engine.ts`/`search.ts` ("seeded" there is the Zobrist key array). There are 0 trigger-list files, so `PUZZLE_DEEP` is not triggered | **MET** |
| `A9` | 5 seeds → **5 distinct** sequences over 30 positions, before `A7` in the file. The note-7 guard inside it reds `M1`, `M2`, `M6`, `M7` in the default lane | **MET** |
| `A10` | Seeds 11/12 interleaved: 10/10 each, A ≠ B. Its A ≠ B clause also reds `M5a` | **MET** |

**Gate at `b2fe6f21`** (`probe/out-gates-tip.txt`, load1 2.56–3.40):
- `npm run lint` exit 0 (100 files); `typecheck` exit 0; `build` exit 0.
- `npm test` exit 0: **52 files / 1600 passed**, 6.67 s real (22.78 user).
- Skip count 0. `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: "52; git tracks 52. No findings.", exit 0.
- **`ENGINE_DEEP=1 npx vitest run src/levels.test.ts`: exit 0, 25 passed (19 default), 196.5 s real,
  load1 3.62 → 6.74** (`probe/raw-deep-tip.log`). `A5` took 135.3 s of it, `A4` deep 28.1 s and `A3` 21.5 s.

**Cost (`N8-LANE`): the Engineer's `ADR-0035` reading is ACCEPTED, not re-measured.**
- QE re-scored `runs-rehop1.tsv` with its own script (`probe/rescore.mjs`) and got the same figures:
  +0.535 s (0.500–0.620), sign 8/8, twin +0.31 % at 4/8, R 0.030 s, load1 6.42–6.85.
- **MET**, and the upper end 0.62 is below 0.65.
- `src/` is byte-identical between the measured `f61ad6b1` and `b2fe6f21`.
- It rests on `ADR-0035`, which is `proposed`.

**Why `_WITH_GAPS` and not `FAIL`.** Every criterion is met on the delivered code, and QE proved the
invariants from outside the module. The six gaps are mutants or readings that the shipped suite
cannot see (`…62d79e31`).
- **`QE-087-a` (MEDIUM):** the seed reaching the engine is unpinned. `M3a` is green on 19/19 and 25/25.
- **`QE-087-b` (MEDIUM):** a sign-flipped list (the second-WORST played) is green on every lane.
- **LOW:** `QE-087-c` (clamp, equivalent today), `QE-087-d` (one draw per move), `QE-087-e` (the stale
  "default lane, ENDGAMES" label), and `QE-087-f` (the ±5 pp has a ~15 % false-red rate per seed).
- **Recommendation to the Orchestrator:** land `a` and `b` as test-only rows on this branch before
  merge (Engineer; BA/PM costs them against `N8-LANE`'s ~115 ms headroom), or ticket them before
  `ABC-085` builds on this module. That is the Orchestrator's call, not QE's.

**Next:** Security/NFR (`NFR-004`, with QE's clamp facts in `…df34cf5a`). The `AGENTS.md` lane line is
owed by the Scribe before merge, and the owner's word on `ADR-0035`.
