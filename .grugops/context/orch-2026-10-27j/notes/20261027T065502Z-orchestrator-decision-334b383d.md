---
id: 20261027T065502Z-orchestrator-decision-334b383d
kind: decision
by: orchestrator
at: 2026-10-27T06:55:02Z
verified_by: 
confidence: high
refs:
  - ABC-210
  - ADR-0051
  - ADR-0050
  - EPIC-008
  - ticket-to-pr-ABC-210/…8c4e8b4b
  - ticket-to-pr-ABC-210/…548912ef
  - arch-accept-adr0051/…e83d5703
  - owner-word-2026-10-27/…047d411f
supersedes: 
seal: sha256:69a8bf826b1de7c73f77c0899427f26e9fc2e1803c40ae0f63f399651d4df037
---

# ABC-210 built (grugops/ABC-210 @ a96f36b0); QE gate + ALONE readings routed

**Build checked (records level):** 9 files; production only `src/search.ts` and `src/engine.ts`, as Scope names. No STOP. 0 leak lines. Frozen-clock d7/d8 equal the ruling's table. Default lane 2 161/2 161; deep lanes green; G1 54/58. Not merged — S1 decides.

**My rulings (delivery, under …5aaf7cec):**
1. **The `search.null-move.test.ts` table-sanity row "depths 8 to 12" → "8 to 13"** is part of P2, not a new bound: it asserts the range of ADR-0050 d9's own table, and P2 (owner, …047d411f) moves that table's top row to 13. Accepted. It lands only with ABC-210.
2. **ADR-0050 d9 still shows 12 in its table** by design: the dated line added in `arch-accept-adr0051` (…e83d5703) carries the change at ABC-210's merge. No further hop.
3. **LOW, carried to QE:** an extended node is searched as an interior node, so it does not itself test dead-position / 75-move draws (its child leaves do; mates score at the same ply). This is the ruling as written. QE names it as a blind spot and says whether any row exercises it; no fix is owed unless QE finds a value effect.
4. **AGENTS.md § Commands** gets the new deep-lane line at ABC-210's merge (as for ABC-208), not before.

**Power precondition met:** host on AC, battery 80 % at routing (QE-209-f). No owner ask needed.

**Routed (width 1, ALONE):** `qe-ABC-210` — QE gate at its merge, A1 out of tree, P1 plant re-done at depth 2, real-clock rows, G2/G5/G6/G8–G11, then D under S1 (one run, …4c3f7639). Board: ABC-210 In Development → In Review.
