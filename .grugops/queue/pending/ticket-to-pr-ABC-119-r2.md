---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-119-r2
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
ref: .grugops/context/ticket-to-pr-ABC-119-r2/
source_refs: .grugops/context/recut-abc119/ (BA/PM decision …c9eab692)  .grugops/context/ticket-to-pr-ABC-119/ (first hop's stop …5b1e7c04)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:46:12Z
branch: grugops/ABC-119-r2
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: build `ABC-119` — an opt-in lane that spawns the delivered CLI with the REAL engine

Second build hop. DoR 10/10 after BA/PM's re-cut (lane in ONE new test file; `src/cli.test.ts`
fenced in full; `A5` by `git diff <wave>...HEAD`; `A3`(ii) bound at the 5 s ceiling). The ticket page is the contract, including its two MEASURED
construction traps (`describe.runIf` reports a skip; a file registering nothing fails the default
lane) and `A3` (no assertion names a move, score, depth or node count).

## First step — confirm the re-anchors still hold (quick)
The page was cut 2026-08-21; `src/cli.ts`, `src/engine.ts` and the lane counts have moved since
(`ABC-084`/`ABC-086`/`ABC-125`/`ABC-127` added deep lanes; `ABC-086` added a virtual clock).
Re-check every premise and number the page cites (spawn count ceiling, lane CPU, the four-lane
precedent). If a criterion's premise moved, write an observation note and STOP (BA/PM re-scores).

## Stop conditions
- Any file other than the ONE new test file (plus notes/page/trace) would change — STOP.
- The default lane's cost moves beyond what the page rules (it is priced OUT of the default lane) —
  STOP. `N8-LANE` > 650 ms CPU — STOP.
- Never touch puzzle files (ABC-127 in review), puzzle/baseline files (ABC-127 in Security/NFR),
  `src/turn-loop.ts`/`turn-loop.nfr.test.ts` (ABC-051), `src/command-input*` (ABC-036).

## Fences
Never merge; never push. No `plans/board.md`, ADRs, `plans/nfr-catalog.md`; `AGENTS.md` lane line
is the Scribe's — draft it in your note. Own worktree; link `node_modules` into YOUR worktree only.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps.

## Publish
Notes per Workflow 16, trace row at the END of `plans/traceability.md`, ticket § Delivery. Queue
pending → claimed → done. Report: re-verification, gates, per-criterion evidence, the new lane's
own reading, default-lane N8-LANE, `src/` numstat, drafted AGENTS.md line, branch + sha.
