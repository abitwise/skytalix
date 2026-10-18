---
task: uat-ABC-170
subtask: uat-ABC-170
role: qe-e2e
workflow: agent-factory/workflows/06-uat-pack.md
ticket: plans/tickets/ABC-170-the-engine-takes-two-optional-limits-maxdepth-and-maxnodes.md
ref: .grugops/context/uat-ABC-170/
enqueued_by: orchestrator
enqueued_at: 2026-10-18T17:42:00Z
branch: grugops/uat-ABC-170
base: grugops/ABC-170 @ 36e3a753
---

# Subtask: QE goes over ABC-170's UAT items (engine `maxDepth` / `maxNodes`)

**The owner chose the role on 2026-10-18 (`.grugops/context/wave-2026-09-25/notes/…-7f3a9c14`).** QE/E2E goes over the UAT items. The UAT Planner and BA/PM hops of Workflow 06 are not run, by the owner's word. Read `uat-planner.md` for the shape of the pack. The scenarios are yours to write.

**The waiver was tested and does NOT apply.** `git diff --name-only main...grugops/ABC-170 | grep -v '\.test\.ts$' | grep '^src/'` → `src/engine.ts` (+28/−2). **The owner's word signs**, not yours.

## A6 (NFR-005): owner-ruled, do not measure
The owner said *"timing seems ok"*. Record A6 as **OWNER-RULED, NOT MEASURED**.
- **Take no timing reading at all.** No `ENGINE_DEEP=1`, no depth-in-3 s runs, no wall-clock grading. The machine has a foreign vitest running, from `Projects/public/grugops`.
- **Do not quote or estimate any depth or time for A6.**
- Do not touch or kill any other process.
- A scenario that involves timing can check **behaviour only**, never speed.
  - Example: "with no limits, the move is the same as on base".
  - Example: "`maxDepth: 3` reports depth ≤ 3".

## Read first
- `AGENTS.md` § **Test and UAT authority**, and the **QE is NOT UAT** paragraph.
- The ABC-170 ticket page, especially § Acceptance A1–A7.
- `agent-factory/workflows/06-uat-pack.md`, `agent-factory/roles/qe-e2e.md`, `agent-factory/roles/uat-planner.md`, `agent-factory/checklists/uat-checklist.md`.
- `.grugops/context/qe-ABC-170/notes/`, the QE pass at `64b07741` (PASS_WITH_GAPS; gaps QE-170-a to QE-170-g).
- The fix hop `ticket-to-pr-ABC-170-fix`, done at `36e3a753`, which closed QE-170-a.

## What this ticket makes hard
ABC-170 is an **engine-API change with no CLI or UCI wiring**. ABC-167 wires `go depth` / `nodes` / `mate`, so `npm run chess` cannot show the new limits.
- **Do not re-run QE and call it UAT.** A UAT scenario says what a caller of `src/engine.ts` gets. For example:
  - "absent options = today's engine, same move".
  - "`maxDepth: N` never reports depth > N, and the result is a legal move".
  - "`maxNodes: K` stops near K nodes, plays a legal move, and leaves the position unchanged".
  - "`maxDepth: 1` still returns a move".
  - "the limits combine with the clock: whichever comes first".
- Run each scenario against the **branch tip `36e3a753`** through the public API. Use a throwaway harness under `ref:`.
- `go mate N → maxDepth 2N−1` is ADR-0044 D12. It is wired in ABC-167, not here. If a part has **no observable acceptance** until ABC-167, say so, and do not invent a scenario.
- **Gates at the tip:** run `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`. Check that `.test-results/last-run.json` shows `success: true` with the full count; if the run was cut off under load, re-run it. Run integrity at skip 0. The pass/fail of the default lane is a gate. Its duration is not graded.

## Fences
- Work from a scratch worktree, `git worktree add ../wt-uat-ABC-170 -b grugops/uat-ABC-170 36e3a753`. **Do not touch `../wt-ABC-170` or `../wt-ABC-146`.**
- **Do not touch `plans/board.md`.** Column moves are mine.
- **Do not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, `package.json` or `vitest.config.ts`.**
- **Do not fix any defect you find.** Report it. A failing UAT is a legitimate result.
- Do not merge, do not push, do not self-sign. Your result is an unsealed `decision` or `observation`. **Word it so "UAT pass" can never be read as the owner having accepted.**
- Report what the lane cost you. Do not grade it.
- **No committed `uat/*.uat.spec.ts`.** This repository has no browser e2e lane. Keep the harness under `ref:` and name the omission in the pack.

## Publish
- Publish typed notes into `ref:` per Workflow 16, hand-authored per `agent-factory/contracts/context-note.md`. Include at least one `kind: decision` note authored by `qe-e2e`, because qe-hop-integrity needs it.
- Publish the UAT pack in `ref:`:
  - the scenarios mapped to A1–A7,
  - the test data (FENs),
  - the pass/fail criteria,
  - the known limitations (A6 owner-ruled; mate is ABC-167's),
  - a signoff checklist the owner can answer with one word (accept / reject).
- Commit only on `grugops/uat-ABC-170`. Then write `.grugops/queue/done/uat-ABC-170.md` and `.grugops/queue/done/uat-ABC-170.claim.md` in main's working tree, uncommitted, with the result, the commit, the gates line and the trace-row text in the handoff.
