---
id: 20261101T230113Z-architect-design-observation-1ddaadaf
kind: observation
by: architect-design
at: 2026-11-01T23:01:13Z
verified_by: 
confidence: high
refs:
  - ABC-263
  - memory-bank/50-decisions/ADR-0057
  - memory-bank/50-decisions/ADR-0056
  - memory-bank/50-decisions/ADR-0044
  - qe-ABC-263
  - arch-adr0057-fix
supersedes: 
seal: sha256:5406bca5bee2558896c0e8ada3fa19e513e620c45da573aa2cd165300011e77b
---

# ADR-0057 G3-G8 fixed as dated corrections (records only)

## Observation
Each fix is marked *(corrected 2026-11-01)* in the ADR, and the ADR's status block lists them.
- **G3:** D1.2 row (d) now gives one round trip per batch, 45-65/N us a position (estimate; under 0.01 us at N = 10 000), with no node to set it beside. Row (e) now reads n/a, because generation is offline and probing reads CPU memory or disk.
- **G4:** the D4 row for the classical path and EPIC-011's threads line had "—" for fair comparison. It now reads: the threads ticket's own Threads N vs Threads 1 read at 100 ms, wall time and core-seconds; every phase read stays Threads 1 vs Threads 1.
- **G5:** OQ-1 now also accepts, by name, reversing ADR-0044 D5 (one thread, no worker), and the D4 row points to OQ-1. OQ-6 now defines V4 inline as ADR-0056's V4, bitboards, re-opening ADR-0001, the next question if the curve flattens below 3 000 after phase 5.
- **G7:** D1.1 marks the onnxruntime-node 1.31.1 EP list UNKNOWN - verify (the cited README is 1.23.2), settled by reading the 1.31.1 tarball. § Consequences now lists 13 open UNKNOWN - verify items, each with what settles it. Also new inline: the Elo of workloads (b) and (e), the 24-worker cause, gfx1150 coherence, today's evaluation share and NFR-008 worker start-up.
- **G8:** "pass the 128 MiB ceiling" now reads "exceed (about 151 MiB)" in the D4 NFR-009 row and in OQ-4. The prototype ids P1-P6 are renamed SP1-SP6 in the ADR body, with the mapping in the status block; the sealed notes keep P-names.
- **Not changed:** G2 (raw outputs deleted as A8 requires; figures recompute per ...89232ca8) and G6 (SP1b's start already labelled inferred).

## Scope
Only ADR-0057 changed. No verdict, recommendation or order moved. OQ-1 now names a reversal that D4 already gave to the owner.

## Risks
None new. The SP rename touches about 28 lines; the mapping is stated once in the status block.
