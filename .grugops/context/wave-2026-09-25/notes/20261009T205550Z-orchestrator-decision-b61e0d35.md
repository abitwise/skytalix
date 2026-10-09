---
id: 20261009T205550Z-orchestrator-decision-b61e0d35
kind: decision
by: orchestrator
at: 2026-10-09T20:55:50Z
verified_by: 
confidence: high
refs:
  - ABC-086
  - ABC-084
  - main
supersedes: 
---

Owner (Olger Oeselg), 2026-10-09, verbatim: "accept ABC-086, go with B for ABC-084"

1. `ABC-086` UAT ACCEPTED on QE PASS WITH FINDINGS (`7c8fd3c`). Merged `grugops/qe-ABC-086` (contains the build) into the wave at `3f26e21`; merged-tip gates: lint 0, typecheck 0, build 0, unit 49 files / 1530 / 0 skips, skip integrity "No findings". `ENGINE_DEEP` engine lane re-run on the merged tip (the only deep lane the change touches: `src/engine.test.ts`, `src/virtual-clock.ts`, `src/engine.ts` comments). `main` fast-forwards only on that lane green.
2. `ABC-084` DoR ⚠️(10) — "who runs the opt-in gate, at which transition" — RULED by the owner as option **B**, put to him 2026-10-09 in these words: *"QE, during review, when the change touches engine code (`src/engine.ts`, `src/search*.ts`, `src/evaluate*.ts`, `src/quiescence.ts`, `src/transposition.ts`, move ordering). A red result means QE fails the ticket."* With it, as stated to the owner: the baseline moves only in its own commit with a stated reason, never with an engine change; raising it is QE's, lowering it needs the owner's word (the `ADR-0028` pattern). NOT option A: `quality.mandatory_gates` is unchanged.
   Carriers: BA/PM folds B into `ABC-084` and re-scores (`fold-abc084-gate-b`); the `AGENTS.md` trigger line lands with `ABC-084`'s build (the lane must exist first) — Scribe's pen; QE's role text is kit, not edited.
