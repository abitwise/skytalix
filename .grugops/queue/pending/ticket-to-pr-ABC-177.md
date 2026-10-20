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
