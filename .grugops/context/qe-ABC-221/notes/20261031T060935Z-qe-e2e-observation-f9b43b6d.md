---
id: 20261031T060935Z-qe-e2e-observation-f9b43b6d
kind: observation
by: qe-e2e
at: 2026-10-31T06:09:35Z
verified_by: 
confidence: high: plain-node oracle against the real base and head trees, 78 717 checks 0 FAIL; census and SE-221-a by replay and arithmetic
refs:
  - qe-ABC-221
  - ABC-221
  - EPIC-009
  - ADR-0052
  - ADR-0045
  - ADR-0044
  - ADR-0046
  - ADR-0027
  - NFR-004
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - AR-UCI-BUSY
  - SEC-220-b
  - QE-220-a
  - ABC-220
  - ABC-244
  - QE-221-a
  - QE-221-b
  - QE-221-c
  - SE-221-a
  - SE-221-b
  - SE-221-c
  - SE-221-d
  - se-ABC-221/20261031T053932Z-software-engineer-decision-ac6abd6a
  - se-ABC-221/20261031T053932Z-software-engineer-observation-563fc63b
  - se-ABC-221/20261031T053932Z-software-engineer-observation-af63269c
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - grugops/ABC-221
  - c48a6f83
  - d58f2d77
  - grugops/qe-ABC-221
  - 6d7f2c24
  - src/uci-session.ts
  - src/engine.ts
  - src/uci-session.test.ts
  - src/uci.real-engine.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
supersedes: 
seal: sha256:4ddf6ed4b35cba18f6f11a077657880ebead8e3a6bb1ae8c7d51f57b10768337
---

# `ABC-221` QE oracle, A8 fence, R1 census and SE-221-a at head `c48a6f83` (base `d58f2d77`): oracle 78 717 checks, 0 FAIL; fence MET; census confirmed; SE-221-a confirmed

All runs are plain `node` (never vitest), out of the repository, on scratch trees B = `git archive d58f2d77` and
H = `git archive c48a6f83`. Scripts are under `raw/qe-scripts/`, outputs under `raw/fence/`, `raw/oracle/`,
`raw/census/` and `raw/se221a/`. PREREG `6d7f2c24` sections 1–4.

## A8 / D8 fence (`a8diff.mjs`): MET
- Changed files base..head: `src/engine.ts`, `src/uci-session.ts` and four test files. Nothing else.
- Byte-identical: `src/levels.ts`, `search.ts`, `uci.ts`, `cli.ts`, `cli-options.ts`, `startup-questions.ts`, `pgn.ts`,
  `level-seam.ts`, `virtual-clock.ts`, `package.json`, `package-lock.json`.
- `src/engine.ts`: exactly one non-comment line changed, `HARD_CEILING_MS = 32_000` → `60_000`.
- `src/uci-session.ts`: non-comment changes are only the third `TIME_MODES` value, the two constants, and D4's rule
  (`timeMode !== "level"`, one `cap`, the two `Math.min(…, cap)`).
- The `LEVELS` block, `DEFAULT_LEVEL`, `EASIEST_LEVEL`, `HARDEST_LEVEL` and the `Skill Level` option template are
  byte-equal.

## Oracle (`oracle.mjs`): ORACLE 78 717 checks, 0 FAIL
- **Method.** Each tree's REAL `uci-session.ts` and `levels.ts` run behind a counting shim. `engine.ts` is renamed and
  re-exported, and `chooseMove` records `{ budgetMs, min(budgetMs, that tree's HARD_CEILING_MS), maxDepth, maxNodes }`
  and answers at once. `now` is 0.
- **Grid.** 351 `go` lines × Skill Level 1–7 × White/Black to move, per `TimeMode`. The lines cover:
  - no token, `infinite`, `ponder`, depth/nodes/mate;
  - `movetime` from 0 to 3 600 000, plus −5, 1.5, a 320-digit figure (±Infinity, `SEC-220-b`) and malformed values;
  - symmetric and asymmetric clocks from 800 to 3 600 000, × 5 increment shapes × `movestogo` none/1/10/40;
  - `movetime` sent together with a clock, and malformed clocks.
- **P1, base parity (`TimeMode` unset, `level`, `simple-tournament`): 14 742 `go` records, every one equal to base.**
  - Compared per record: the handed budget and limits, the effective clamped budget, the output lines and the random
    draws.
  - **So `level` and `simple-tournament` are identical to base.** The largest finite budget handed is 30 000 in `level`
    and 22 000 in `simple-tournament`, so each is under both clamps and `min(b, 60 000) = min(b, 32 000)`.
- **O1, `uci-clock-mode` at head against an independent oracle written from D2/D4: 4 914 records, all equal.**
  - The rule: `movetime x` → `min(x, 59 500)`; otherwise the side to move's clock → `min(59 500, C(t, own inc,
    movestogo or 20))`; otherwise 22 000.
  - Each record has one engine call and 0 random draws. The handed budget is always ≤ 59 500 and the effective budget is
    ≤ 60 000. The largest finite budget handed is 59 500.
- **S1:** in both modes the records are identical across Skill Level 1–7, so Skill Level is not read.
- **L1:** every level budget sits under both clamps, and `LEVELS` and `DEFAULT_LEVEL` are equal at B and H.
- **POST-HOC (informative, after the plants):** `posthoc-oracle.sh` ran the same oracle against the two lane survivors
  (plants note). It catches both:
  - HSCM: 1 386 FAIL. For example, `go wtime 800 btime 800 winc 2000` hands 1 890 ms with 800 ms on the clock.
  - CLOCKWINSCM: 112 FAIL. For example, `go wtime 900000 btime 900000 movestogo 40 movetime 300` hands 22 375, not 300.

## R1 census (`census.mjs`; `ADR-0046` § Addendum R1, ticket A9): the SE's census is confirmed
The SE's three rows were replayed on H's real modules with a counting virtual clock (no shim, no spy):

| row | budget | step | ⌈b ÷ s⌉ (SE) | readings in the `go` (QE) | depth | `time` | assertion |
|---|---|---|---|---|---|---|---|
| A5 real, `go wtime 800 btime 800` | 1 | 10 | 1 | 3 | 1 | 20 | depth 1, `time` 20 ✓ |
| A7 real, `go movetime 90000` | 59 500 | 5 000 | 12 | 14 | 5 | 65 000 | in [59 500, 69 500] ✓ |
| A11, `go movetime 30000` + mid-search `isready` | 30 000 | 5 000 | 6 | 8 | 4 | 35 000 | in [30 000, 40 000]; `bestmove`, then `readyok` ✓ |

- Readings = ⌈b ÷ s⌉ + 2: the start reading and the return reading, as the SE's note states.
- **Every row reads `time`, so all are class P.** No time-blind row was added, so no R2 step is owed.
- **No other real-engine default-lane row was added.** The added test lines hold only these three real-engine sites
  (two `stub: false` and one direct `createUciSession`). The two other `createUciSession` hits are the `ENGINE_DEEP` A10
  child.
- **RF-1 (`se-ABC-221` `raw/rf1-census.mjs`, re-run on B and H):**
  - Equal at B and H: reads (4/4/4 and 24), nodes 108, depth 2, the level row's `blunder`, and elapsed ÷ step (23).
  - What differs: `clamp`, and elapsed in virtual ms (48 000 → 90 000), which is three steps of clamp ÷ 2.
  - PREREG section 3 said "B == H for every field except `clamp`". That wording missed this scaled elapsed figure, which
    is the expected scaling and not a fault. **"The same number of clock reads" (A9) holds.**

## SE-221-a (`se221a.mjs`, written from the ticket's words): CONFIRMED
- **A6 as worded** (80 moves, no added time): **17 204.53 ms after move 80**, rounded 17 205. That is the closest call.
  Every move leaves ≥ 1 000 ms, so **A6's bound is met**. But "≥ 117 s" is false on this shape.
- **alloc.txt's shape** (+900 000 ms after move 40, still no `movestogo`): closest **117 735.08 ms, after move 40**,
  rounded 117 735. Every move leaves ≥ 117 000 ms. This matches `arch-epic009-settings` `raw/alloc.txt` § "40/15, no
  movestogo sent, 80 moves" (117 735) and § "sudden death 15 min, 80 moves" (17 205).
- **For BA/PM's fold:** A6's parenthetical "(≥ 117 s by arithmetic)" describes the alloc.txt shape, not A6's words.
  Either change it to 17 205 ms, or add "+900 000 after move 40" to A6. The bound (≥ 1 000 ms) holds either way, and both
  shapes are pinned by a row. The same sentence is in `ADR-0052` D4 and belongs to the Architect.
