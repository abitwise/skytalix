---
task: ticket-to-pr-ABC-012
subtask: engineer-abc012-implement
role: software-engineer
claimed_at: 2026-08-04T13:00:00Z
claimed_by: software-engineer
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/claim.js`, so Workflow 17 step 2's atomic
`mkdirSync` claim primitive could not be executed and nothing here provides exclusivity.
Queue width is 1 and no contention is possible, so the claim is degenerate. Recorded rather
than glossed, exactly as the queued subtask instructed and as every prior task on this board
recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is
likewise absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-012/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a stamp — and nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

The `ref:` context folder was read BEFORE any code was written: the Orchestrator's pull
decision `20260804T120000Z-orchestrator-decision-f066a9d0`, which carries the correction to
`## Test notes` trap 1's stated REASON. The ticket was then read in full, and its two seam
notes were read at source in `.grugops/context/epic-to-tickets-EPIC-002/notes/`
(`…-decision-d7a42f7a`, SEAM 1 the exact API; `…-decision-38b772b6`, SEAM 2 no memoization)
rather than from any summary of them. This ticket had no design hop and needs none: those two
notes ARE its design.

---
completed_at: 2026-08-04T14:20:00Z
outcome: IMPLEMENTED — both seams built exactly as closed, neither re-opened. src/history.ts is a
  NEW module (154 lines, 51 executable) with SEAM 1's six exact signatures, three fields, and no
  cache / version counter / invalidation (SEAM 2). NOTHING ELSE UNDER src/ WAS TOUCHED: every
  tracked file there is md5-identical to merged `main` 39e260d and `git diff --numstat 39e260d --
  src/` is empty — a byte-level result, stronger than the line-level check acceptance criterion 9
  asks for. The instrument that FAILED is recorded rather than buried: a `grep -vxF -f`
  line-presence check reported 13–81 "absent" lines per file and fails its own null control by
  identity (src/fen.test.ts against ITSELF reports 13), so no number is claimed from it. Seven
  tests, one per acceptance criterion, each PROVEN able to fail — seven mutants of the shipped
  module, all seven killed — and the deep-equal instrument itself controlled (toEqual on a
  Map<bigint, number> rejects a differing count, a missing entry and an empty map). Dependency claim
  MEASURED: 10 modules, zero cycles, depth 6 -> 7, history.ts alone at level 7, all six edges
  downward, no legal.ts and no san.ts import, and the ONE module with zero importers. Gates: 221
  passed / 10 files / 0 failed (was 214 / 9), skip count 0 via the AGENTS.md command, lint +
  typecheck + build all exit 0, src/history.ts 100% on all four coverage axes. ALL FIVE NFR BARS
  MEASURED AND MET on Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify`
  elsewhere, two samples, out of tree, no wall-clock assertion added to the suite: takeBack(2)
  2.45 µs vs 5 (an upper bound), keyHistory 40.5–40.7 µs vs 60, repetitionCounts 45.7 µs vs 75,
  gameStatusOf 49.0–49.3 µs vs 75, playMove 12.4–12.7 ns vs 100 ns, and repetitionCounts @300 plies
  99.1–99.6 µs vs 150. ONE ACCEPTANCE CRITERION CANNOT BE SATISFIED AS WORDED and is handed to BA/PM
  rather than rewritten or ignored: criterion 2 asks gameStatusOf to return `result: "draw", reason:
  "threefold-repetition"`, which src/gameend.ts cannot return and its TYPE cannot express, because
  ABC-020 ruled threefold CLAIMABLE on FIDE 9.2.1 — its INTENT is tested and green. Board: In
  Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override taken. plans/
  nfr-catalog.md and the trace row's NFRs cell deliberately NOT edited — Security/NFR owns them and
  re-gates. ABC-009, ABC-010 and ABC-022 carried, not fixed. NO PR — this repo has no git remote, so
  there is nowhere to push and none was invented; nothing merged, nothing deployed. Four leads
  handed to QE by name rather than absorbed, including that criterion 2's own test does NOT pin the
  board half of takeBack.
moved: pending/ -> claimed/ticket-to-pr-ABC-012-dev/ -> done/ticket-to-pr-ABC-012-dev/ — ALL BY HAND
  (no scripts/claim.js in this install).
