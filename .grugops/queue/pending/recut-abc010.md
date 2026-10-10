---
task: wave-2026-09-25
subtask: recut-abc010
role: ba-pm
workflow: agent-factory/workflows (BA/PM re-cut; DoR per AGENTS.md)
ticket: plans/tickets/ABC-010-fen-semantic-validation.md
ref: .grugops/context/recut-abc010/
source_refs: .grugops/context/design-abc010/ (Architect decision …98a03297, observation …aa14ac4d, probe/)  memory-bank/50-decisions/ADR-0033-*
enqueued_by: orchestrator
enqueued_at: 2026-10-10T09:00:40Z
branch: grugops/recut-abc010
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: re-cut `ABC-010` after the design hop, and place the two defective puzzle rows

`ADR-0033` is `proposed` (owner acceptance owed) — cut against it, and say on the page that the
build waits for that acceptance. The Architect's decision note lists R1–R3; all three are yours:
1. **R1:** criterion 9 ("every fixture in the repo still parses") cannot hold — re-word it
   (Architect's proposed text is in the note).
2. **R2:** the build now touches ~16 files, not 2. Re-size, list the files, and name the
   ordering against `ABC-127` (in flight, `src/puzzle-corpus.ts`), `ABC-126` and `ABC-083`
   (`src/quiescence.test.ts`).
3. **R3:** the two `src/puzzle-corpus.ts` rows ("pin: Re1 pins the queen to the king",
   "discovered check: the bishop moves, Rxd8") are defects independent of `ABC-010`. Decide: fold
   into `ABC-126` (page is Ready — amend and re-score it) or cut a separate XS ticket (next free
   id after ABC-127) that lands before `ABC-010`. Re-authoring needs `ABC-084`'s oracle-proven
   answers; say how the baseline may move (`ABC-084` option B rules).
Re-score DoR on every page you touch. Fences: no `src/`, no `plans/board.md`, no ADR edits, no
`ABC-127` page. Decision note per Workflow 16; trace rows appended at the END of
`plans/traceability.md`.
