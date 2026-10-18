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

---
done_at: 2026-10-18T17:55:20Z
branch: grugops/uat-ABC-170 (worktree ../wt-uat-ABC-170, from grugops/ABC-170 @ 36e3a753)
commit: 207d81ee
tree_under_test: 36e3a753 (unchanged; src/engine.ts md5 3ce3a251… before and after)
result: UAT conducted — PASS_WITH_GAPS on the observable half; NOT accepted, owner's word owed
---

QE/E2E conducted the UAT by the owner's delegation. **This is not the owner's acceptance.** The owner's word in
session signs. **A6 (NFR-005) is OWNER-RULED, NOT MEASURED.** No timing reading was taken, and no depth or time is
quoted or estimated for A6. No other process was touched.

- **Scenarios:** 6 of 6 PASS, 401 of 401 checks, through the engine's public API on virtual clocks. The run was
  repeated and the two outputs are byte-identical (sha256 `4ac8df2d…`).
  - S1 (A3, A6 behaviour only): no limit = today's engine. 288/288 equal to main's `src/` field for field.
  - S2 (A3, A7): levels 1–5 × seeds 1–3 and the engine seam unchanged, 49/49.
  - S3 (A1): `maxDepth`, 35/35. S4 (A2): `maxNodes`, 16/16. S5 (A5): whichever comes first, and the ceiling, 10/10.
  - S6 (A1, A2): the limits pass through `createEngine`, 3/3.
- **Per criterion:** A1 PASS; A2 PASS; A3 PASS; A4 PASS (observable half; text pins green in the lane); A5 PASS;
  **A6 OWNER-RULED, NOT MEASURED**; A7 PASS.
- **Gates at 36e3a753:** lint 0, typecheck 0, build 0. `npm test` exit 0 on the first run, 58 files, 1844/1844.
  `last-run.json` reads `success: true`, total 1844, passed 1844, failed 0, pending 0, todo 0. Integrity
  (`test-skip-integrity.js .grugops/test-skips.md --skip-count 0`) `No findings.`. `merge-tree` against main
  `af3769e3` is clean.
- **Harness controls** (scratch copies only): C1 `maxDepth` off by one, C2 no mid-iteration node abort and
  C3 an extra clock read on the no-limit path are all caught. **C4, a hidden 60 000 `maxNodes` default, is not
  caught** (the same gap as QE-170-b).
- **Defects: 0.** INFO items:
  - `UAT-170-a`: A7's literal `git diff --name-only 358810ac 36e3a753 -- src` lists 4 files because of the main
    merge `025a6bef`. From the merge base `acfdbeb3` it lists exactly 2. Use the merge base at the gate.
  - `UAT-170-b`: restates QE-170-b. A hidden `maxNodes` default goes unseen here too.
- **Not observable until ABC-167:** `go depth` / `go nodes` / `go mate` (including `mate N → maxDepth 2N−1`, D12),
  `info` output, and validation of edge values. No mate scenario was invented.
- **Notes** (in `.grugops/context/uat-ABC-170/notes/` on the branch, hand-authored, unsealed): `…5c8e21a4` (pack,
  artifact-ref), `…b7a3f0d2` (run), `…e4d07b39` (ABC-167 half and A6), `…a91f6c30` (gates and fences) and
  `…d19e6c57` (decision). `qe-hop-integrity.js --ticket ABC-170` reports covered (qe-e2e).
- **Lane cost (reported, not graded):** default lane +0 test files, +0 rows and +0 spawns. Nothing was added to
  `src/` or the suite. The harness is outside the lane, at 553 engine calls per run and 0 child processes. It ran
  2 times on the tip and 4 times on scratch controls. One gate pass was run. **No wall-clock figure is reported,
  by the A6 fence.**
- **Untouched:** `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`,
  `package.json`, `vitest.config.ts`, `../wt-ABC-170` and `../wt-ABC-146`. Nothing was pushed or merged, and
  nothing was self-signed. `pending/uat-ABC-170.md` and `claimed/uat-ABC-170/` are left for the Orchestrator's close.

Owner's one-word signoff checklist (from `…5c8e21a4`):
1. Do S1–S6 describe what you want from the two limits on their own?
2. Do you accept that the UCI half (`go depth` / `nodes` / `mate`, and `mate N → maxDepth 2N−1`) is proven on ABC-167?
3. Do you accept A6 as OWNER-RULED, NOT MEASURED, on your "timing seems ok"?
4. Do you accept the run's result, 6/6 PASS and 401/401 checks?
5. **Overall: accept or reject ABC-170?**

Trace row:
| ABC-170 (UAT) | Engine `maxDepth` / `maxNodes`. QE-conducted UAT by the owner's delegation (`…7f3a9c14`), subtask `uat-ABC-170`, at tip `36e3a753`. 6/6 scenarios PASS, 401/401 checks, through `chooseMove` / `createEngine` / `createLevel` on virtual clocks, compared with main's `src/` (byte-identical base engine). Two runs byte-identical. Controls C1–C3 caught, C4 (hidden `maxNodes` default) not caught (QE-170-b) | EPIC-007 | — | A6 (`NFR-005`) OWNER-RULED, NOT MEASURED. No timing reading | unchanged: `src/engine.ts` (+28/−2, production) | Harness under `.grugops/context/uat-ABC-170/probe/` (not a lane row). Lane 58 files / 1844 green; skip 0; integrity "No findings." | **UAT conducted — owner's word owed** (notes `…5c8e21a4`, `…b7a3f0d2`, `…e4d07b39`, `…a91f6c30`, `…d19e6c57`) | — | Branch `grugops/uat-ABC-170` @ `207d81ee`; not merged, not pushed; no board move. UCI half is ABC-167's. INFO `UAT-170-a` (A7: use the merge base `acfdbeb3`) |
