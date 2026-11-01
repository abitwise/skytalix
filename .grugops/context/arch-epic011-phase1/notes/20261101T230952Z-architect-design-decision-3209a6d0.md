---
id: 20261101T230952Z-architect-design-decision-3209a6d0
kind: decision
by: architect-design
at: 2026-11-01T23:09:52Z
verified_by: 
confidence: high on the rule and the table-pressure arithmetic (from qe-tc-depth-probe 1889e3b0 R1 medians; upper bounds); low on any Elo effect (ADR-0056 D2 estimate +5-15)
refs:
  - ABC-237
  - ADR-0025
  - ADR-0058
  - ABC-238
  - EPIC-011
  - ADR-0056
  - ADR-0026
  - ADR-0057
  - ABC-257
  - ABC-258
  - NFR-005
  - NFR-009
  - qe-tc-depth-probe/20261101T150824Z-qe-e2e-observation-1889e3b0
  - arch-epic011-phase1
  - grugops/arch-epic011-phase1
supersedes: 
seal: sha256:f9ac0d7f5f72259709682146d64a54b84087bfd3a31d68e11970814f8a3c28af
---

# T2 (ABC-237): ADR-0025 amendment PROPOSED — depth-preferred replacement

Deliverable: `memory-bank/50-decisions/ADR-0025-the-transposition-table-is-its-own-fixed-structure-cleared-per-search.md` § "Proposed amendment 2026-11-01 (ABC-237, T2)" plus a dated Status line. Changes decision 2's third bullet only; decision 4 (clear per search) and the size untouched. Acceptance is the owner's (changing an accepted ADR). Reading (b): build may proceed; read and merge wait on acceptance. Default: always-replace stands.

## Ruling
- A store writes its slot when (a) empty, (b) same full key, or (c) another position whose stored depth <= new depth; otherwise the store is dropped. Same key always replaces (the node was searched because its entry did not settle it; newest hash move is what the next iteration wants). Equal depth: newer wins. Root store always lands (every other entry in a per-search table has depth <= d-1).
- Switch `depthPreferred` in both recursions, argument to storeEntry. Two test-only doors (pre-ABC-237 shipped, node for node). Ladder: every older door turns it off, ADR-0058's doors included if ABC-238 merged first. No bits, no arrays, no age: 17+2+13 packing, tableByteLength 4 194 304.
- Rule rows (A2 wording for BA/PM): DIFFERENT keys sharing a slot — 6 then 2 keeps 6; 2 then 6 replaces; 4 then 4 replaces; SAME key 6 then 2 replaces; switch off replaces always. Drift regression net at d5 on the 190, both recursions, ADR-0058 d6 bars; near-identity expected and the identical count reported.

## Table pressure (arithmetic, upper bounds)
Share of stores landing on an occupied slot = 1 - (m/n)(1 - e^(-n/m)), m = 262 144: <= 8.5 % at 100 ms (47 131 nodes), <= 42 % at 500 ms (317 555), <= 91 % at 4 s (2 806 820). T2 scales with table pressure, not depth.

## The read ABC-237 owes
Intent **GAIN** (not re-classed to NEUTRAL: C2' reserves NEUTRAL for correctness fixes). C2' >= 50.0/100; S' as T1; Levels deep lane exit 0. **100 ms barely sees it**: the read guards against breakage, its score near a coin flip for this effect; reported with the limit stated (ABC-258 A4 form). Mechanism evidence = ABC-237 A3 (3 000 ms median depth, 5 interleaved runs; fixed-depth-8 nodes, kiwipete reaching d8 only near 4 s, ~10x slot count, inference). A 500 ms read (~2.3 h) is NOT recommended: at +5-15, 100 games cannot resolve the effect at any control (C2' P(pass|+10) = 0.66).

## Falsifiers
T2 (size) re-read unchanged, ABC-258's. T5 moot while d4 amendment not in force; ABC-257 re-reads it. **T6** A3 missed (median depth at 3 000 ms below base on either, or d8 nodes > 0.97 x door on both) or C2' NOT MET => not merged, "accepted, not in force". **T7** any A2 case wrong or drift row red => defect.
