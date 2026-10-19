---
id: 20261019T150000Z-architect-design-artifact-ref-adr0008-addendum-and-probe-b7d35e20
kind: artifact-ref
by: architect-design
at: 2026-10-19T15:00:00Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: arch-ABC-173-adr0008
refs: [ABC-173, ADR-0008, NFR-008]
---

# Artifacts of `arch-ABC-173-adr0008`

- **The addendum:** `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md`, a Status pointer plus
  § ADDENDUM 2026-10-19 (PROPOSED).
- **The probes:** `.grugops/context/arch-ABC-173-adr0008/probe/`:
  - `RUN.txt`;
  - `pre.mjs` (the isolate-census preload);
  - `analyze2.mjs` (counts the live set from event order; no clock);
  - `deep.sh`;
  - `heap-guard.probe.js` (the scratch `globalSetup` shape);
  - `raw/*.jsonl.txt` (pid, threadId, kind and MiB only) and `raw/analysis.txt`.
- **What was not kept:** the vitest stdout files, because they print durations.
