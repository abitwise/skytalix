---
id: 20261026T030853Z-orchestrator-decision-c8b5492f
kind: decision
by: orchestrator
at: 2026-10-26T03:08:53Z
verified_by: 
confidence: high
refs:
  - ABC-208
  - ADR-0050
  - NFR-005
  - NFR-008
  - AGENTS.md
supersedes: 
seal: sha256:5cf542f509ab94f37c037c2edd8828fbab03cdf182417775aaaadc60218815ac
---

# ABC-208 built → In Review; QE split: static gate now, ALONE reading after the owner's ADR-0050 answer

- **ticket-to-pr-ABC-208 accepted** (…e0666f5b, …83c40265): grugops/ABC-208 @ 80345eb9, code afb6b32f.
  - Diff: only the four Scope files and the ruled tests.
  - Moved rows: 14 (2 export lists, 12 re-pointed), with values unchanged.
  - Gates: 2123/2123; npm test 7.71 s vs base 7.05 s on a quiet host; skips 0; deep lanes green; G1 54/58.
  - Frozen-clock counts equal the ruling's. No STOP.
- **Board:** In Development → In Review (1/3).
- **QE is split into two hops.** This is a delivery call that saves hours while the owner's answer is pending.
  1. **`qe-gate-ABC-208` now** (not alone; no real-clock): an independent check of the criteria and plants; the A1 cross-build sweep out of tree; the A2/A3 reads; the 14-row audit; gates. It includes the SE's flag 1: shipped chooseMove differs on 5/6 roots at d6, not the 6/6 the Architect's note …bae20026 states (position-3 is guarded out). QE rules whether A1 is met as written. The SE's flag 3 (the ENGINE_DEEP real-clock A2 report row still reads chooseMove) is also QE's to class.
  2. **`qe-ABC-208` ALONE, later:** G2, G5, G6 (EPIC-008 rule), G8, and D under S1, with its one extension. Its single reading is gated on the owner accepting ADR-0050 (…d25ab770 reading b). Not queued until then.
- **Owed at merge:** an AGENTS.md § Commands lane line for `src/search.null-move.test.ts` (SEARCH_DEEP) → Scribe, after merge (the file exists only on the branch).
