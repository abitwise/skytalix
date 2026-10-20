---
subtask: ticket-to-pr-ABC-177
role: software-engineer
tickets: [ABC-177]
branch: grugops/ABC-177 (from main @ ff1e375f); worktree ../wt-ABC-177
ref: .grugops/context/ticket-to-pr-ABC-177/
---

# SE: ABC-177, default lane under 10 s per ADR-0046 (test-only)

## Read first
- The ticket page `plans/tickets/ABC-177-*.md`: criteria A1–A12, units U1–U8, and the step-1000 ruling.
- ADR-0046 (ACCEPTED).
- BA/PM's decision note `…e7b3c210`.
- The Architect's probe tables in `.grugops/context/arch-lane-under-10s/probe/`.
- `AGENTS.md`: the lanes and their heap prefixes.

## Do
- Create the worktree `../wt-ABC-177` on branch `grugops/ABC-177` from `ff1e375f`. A `node_modules` symlink to main's is fine; it is ignored.
- **Before any head change:** fix the mutant list for each changed unit, record each unit's kill set at base, and take the node-count census at base.
- Make U1–U8 exactly as the page scopes them:
  - the A6 merge;
  - the coarsest step that keeps the kill set, never finer than today;
  - step 1000 only where the ruling allows it, and never cutting a search with two or more clock checks down to one.
- **Prove the criteria you own:**
  - 126 tests, with the same sorted names at base and tip;
  - the step-only diff;
  - one file changed;
  - parity per unit;
  - the node census at head;
  - all gates green: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity 0, `CLI_DEEP`, `PERFT_DEEP`. Run every vitest command with its `NODE_OPTIONS` prefix, one at a time.
- **Timing (N8-LANE and the full-lane twin):** QE's job, not yours. Take no timing.
  - **New owner rule (`…owner-word` 2026-10-20, OQ-177-1 = YES):** any NFR-008 reading must be on AC power.

## Fences
- Test file `src/uci-session.test.ts` only. No production code, `tools/`, `AGENTS.md`, `vitest.config.ts` or `package*.json`.
- Do not touch `plans/board.md` or `plans/traceability.md`. Commit on `grugops/ABC-177` only.
- Never push or merge. Touch no process you did not start, and keep forks low.
- **Stop and report** if a criterion cannot be met as written. Do not widen scope: the O3 path belongs to Architect/BA/PM.

## Publish
- Notes under `ref:`, including a `kind: decision`. Use the sanctioned writer if available, and say so either way.
- `.grugops/queue/done/ticket-to-pr-ABC-177.md` (this brief + `## Result`) and `.claim.md` on main, uncommitted:
  - the tip;
  - per-criterion results;
  - units and steps, old → new;
  - kill sets, base vs head;
  - the node census;
  - the gates;
  - the production-lines measurement, which is expected empty, so the UAT waiver applies;
  - a trace row.

## Result

**Delivered.** Branch `grugops/ABC-177`, tip **`f81bf03c`**, from `ff1e375f`. One file. Not pushed, not merged.
No timing was taken. Notes are in `.grugops/context/ticket-to-pr-ABC-177/notes/` (decision `…937719ab`, observations
`…03c6e9de` and `…90221b3e`, artifact-ref `…e4a40fe5`). They are hand-authored and unsealed: no sanctioned writer
exists in the repo or the kit, and no `propose_note` tool was available.

### Per criterion (the SE's: A1–A5, A7)
| crit | result |
|---|---|
| A1 | **MET**. One `talk` on `[position, go infinite, R, R]`, asserting (a), (b) and (c). Armed reds: H1 reds (a) at line 269, H2 reds (c) at line 275. Both reverted |
| A2 | **MET**. Each unit at the coarsest admitted step with parity (table below) |
| A3 | **MET**. 126/126 passed and 0 skipped at base and at tip. Sorted names byte-identical (sha256 `a9875b13…`). Lane 1 987 at both |
| A4 | **MET**. Outside U1, the 7 hunks change only the step literal. No `it(`, `describe(` or `expect(` line touched outside U1. The U1 title is byte-identical |
| A5 | **MET**. Every hunk falls inside the U1–U8 base ranges. `--name-only` gives `src/uci-session.test.ts`. The census code lived in scratch |
| A6 | QE's. SE parity: the same killed ids on all 15 rows over the frozen list (below) |
| A7 | **MET**. All 15 rows strictly fewer nodes. 111 other rows unchanged. Delta **−492 968** nodes |
| A8–A11 | QE's, not run here. Any `NFR-008` reading must be on AC power (owner word, OQ-177-1 = YES) |
| A12 | **MET** (gates below) |

### Units and steps, old → new
| unit | rows | step | tried |
|---|---|---|---|
| U1 | A6 until stop / ponderhit (+ fold) | 100 → **1 000** | 1 000: parity SAME |
| U2 | A6-e1 | 100 → **1 000** | 1 000: SAME |
| U3 | A6-j1 | 100 → **1 000** | 1 000: SAME |
| U4 | A6-e4 | 100 → **1 000** | 1 000: SAME |
| U5 | A6-e5 | 100 → **1 000** | 1 000: SAME |
| U6 | A7-i5, i6 | 100 → **1 000** | 1 000: SAME |
| U7 | the six dropped-token rows | 100 → **1 000** | 1 000: SAME |
| U8 | "two sessions" (`levelOneMoves`, line 831) | 10 → **100** | 100: SAME (1 000 not admitted) |

### Kill sets, base vs head
- **The list** was frozen at 2026-10-20T18:43:15Z, before any head run (`probe/frozen-mutants.json`, sha256
  `b9033970…`).
  - 150 listed, 145 applicable at base.
  - It is the superset of ABC-167 M01–M51, ABC-171 N/S, ABC-174 M01–M22 and H1/H2, because "M01–M11" names a list in
    both ABC-167 and ABC-174.
- **Results:** 35 mutants are killed by at least one changed row. **Each of the 15 rows kills the same ids at base and
  tip.** Per-row lists: `…03c6e9de`, `probe/parity-base-vs-tip.out`.

### Node census
| rows | base → tip (nodes per row) |
|---|---|
| U1 × 2 | 76 863 → 655 |
| U2 | 25 642 → 676 |
| U3–U7 × 11 | 25 621 → 655 |
| U8 | 75 207 → 34 247 |
| **sum** | **536 406 → 43 438 (−492 968)** |

### Gates (tip)
- **Green:**
  - lint 0, typecheck 0, build 0;
  - `npm test` 1 987/1 987, `last-run.json` success true;
  - skip-integrity "No findings." at skip count 0;
  - `CLI_DEEP` 11/11, `PERFT_DEEP` 32/32;
  - the M4 sweep row green, and it reds on a non-M4 plant.

### Production lines (the UAT waiver)
- `git diff --name-only f81bf03c~1 f81bf03c | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. So the standing UAT
  waiver applies.

### Open
- **U8 at 100 and the brief's wording.** The level-1 searches go from 10 clock intervals to 1. The ticket admits
  {10, 100} for U8, so this is as written. The brief's "never cutting a search with two or more clock checks down to
  one" could be read to cover it. If BA/PM reads it so, the remedy is one literal back to 10 (`…90221b3e`).
- **U1–U7 at 1 000.** Each search ends on loop-top clock reads, at 655 nodes, before any in-search check. This
  satisfies condition 2 as defined.

### Trace row (for the Orchestrator to append)
`| ABC-177 | ADR-0046 | grugops/ABC-177 @ f81bf03c (from ff1e375f) | src/uci-session.test.ts (U1 fold + 8 step literals; 126 rows, no rows added) | parity 15/15 rows SAME over 145 frozen mutants; census −492 968 nodes; npm test 1987/1987; lint/typecheck/build/CLI_DEEP/PERFT_DEEP green | In Review (SE); A6, A8–A11 owed to QE (AC power) | UAT waived: 0 production lines |`
