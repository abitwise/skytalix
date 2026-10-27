<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: arch-repass-30-architecture

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-27T19:54:33Z | decision | architect-design | high: records only; every count measured read-only at main c383f8f0 by a calibrated parse; ruling rests on ADR-0011 clause 1 and its pinned instrument |  | # Architect/Design: `30-architecture` re-passed as-built at `main` `c383f8f0`. 46 production modules; `virtual-clock.ts` is one of them and no entry loads it (42 of 46 are loaded by an entry). Dated corrections are folded in, with one dated change line per edit |
| 2026-10-27T19:54:33Z | observation | architect-design | high: read-only parse and git reads at c383f8f0; calibration reproduced the 2026-08-12 figures exactly |  | # Architect/Design: how the `30-architecture` re-pass measured `main` `c383f8f0`, and two INFO items. Nothing is owed |
