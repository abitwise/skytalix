---
id: 20261023T230351Z-architect-design-decision-3809d451
kind: decision
by: architect-design
at: 2026-10-23T23:03:51Z
verified_by: 
confidence: high (deterministic probes); OD-205-2 is the owner's
refs:
  - ABC-205
  - EPIC-008
  - ABC-121
  - ABC-081
  - ABC-083
  - ADR-0026
  - ADR-0028
  - ADR-0031
  - ADR-0034
  - ADR-0039
  - OD-205-1
  - OD-205-2
  - 4f650a45
  - bfc94880
  - f00038ef
  - grugops/ABC-205
  - grugops/arch-rule-ABC-205-stop
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-18a6a03c
  - ticket-to-pr-ABC-205/20261023T222449Z-software-engineer-decision-3050b787
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:5c3d47c42c51707b053ca053fd0be0e2ea21bea27926f047514cb52abedcaaea
---

# Architect/Design: ABC-205 STOP ruled. S1 is a re-pin by `maxDepth` (this role). S2/S3 is one level for the owner, `OD-205-2` (75 → 118 cp), PROPOSED

Records branch `grugops/arch-rule-ABC-205-stop` from `grugops/ABC-205` `4f650a45`. Records commit `bfc94880`. Page: `ABC-205` § Addendum 2026-10-24. ADR text: `ADR-0031` addendum `A7` and `ADR-0026` § Proposed amendment 2026-10-24. Readings: the observation note of this task.

## S1: transposition `A4` mate-reuse row (`SEARCH_DEEP`)
- Ruling: a value-only re-pin, under this role. The depth is pinned by `maxDepth: 10` on a frozen clock, not by ticks. No level moves.
- Why not 180 ticks: ticks are a node count in disguise, and the next evaluation change would break the row again.
- Why not a re-find (`ADR-0028` d2): the search-level ±ply bite was lost at `ABC-083`'s merge (`f00038ef`), before this ticket. No mate-corpus fixture bites on base and build. The one build-only cell does not meet "measured on base and branch".
- The ±ply guarantee rests on the two default-lane table rows. The gap is a search-level wiring check, and it is recorded for BA/PM. `ABC-205` does not owe it.

## S2/S3: pvs-lmr `A1` depth-5 drift maximum (79 against 75 cp, both recursions)
- Not a defect, by all three of `ADR-0028` d1's proofs. Identity and oracle rows are green. The shelter gate alone reproduces the red (87 cp), and the blend does not (55 cp). `early` stays red on the 95 % clause.
- Not a fixture. The corpus is built by rule, and the row has no margin label.
- Not this role's headroom. The level was set with 1.67x measured headroom (75 against 45), so d3 does not reach it and d4 makes it a stop. It is `ADR-0026` d9's text and an owner-accepted criterion (d5).
- **`OD-205-2` (owner, PROPOSED):** the maximum becomes ⌊1.5 × 79⌋ = 118 cp, in both recursions. Everything else in d9 stays. `ADR-0034`'s clean-lead bar follows for later L re-finds only.
- Decline path: neither term ships alone (gate 87 cp, scale 107 cp). `ABC-205` stops to BA/PM. No re-tune.

## Edits the Engineer may make
1. Now, in `src/transposition.test.ts`, the `A4` deep row only:
   - both calls take `{ budgetMs: 160, now: () => 0, maxDepth: 10 }`, and `ticks` is deleted;
   - the shipped depth check becomes `toBe(10)`;
   - the other four `expect`s stay byte-identical;
   - the row is renamed, and the comment is rewritten to the measured facts.
2. After the owner accepts `OD-205-2` only: in `src/search.pvs-lmr.test.ts`, `reportAndBar`'s `75` becomes `118`. The two row titles change to match, and one comment line cites `OD-205-2`.
3. `OD-205-1`'s cell stays unchanged until the owner answers.
4. Re-run `SEARCH_DEEP` transposition and pvs-lmr, and report the drift and mate-floor lines.

## Route
The Orchestrator reports `OD-205-1` and `OD-205-2` together. The merge waits on both owner words. D waits as ruled.
