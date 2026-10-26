---
id: 20261026T040525Z-architect-design-decision-f9357ec6
kind: decision
by: architect-design
at: 2026-10-26T04:05:25Z
verified_by: 
confidence: high: records only; each fact checked read-only at 42f33a7a (git, grep); the owner's answer on ADR-0050 is not recorded
refs:
  - ABC-208
  - ADR-0050
  - ADR-0026
  - QE-208-d
  - QE-208-e
  - orch-2026-10-26h/20261026T040103Z-orchestrator-decision-42479486
  - orch-2026-10-26e/20261026T023422Z-orchestrator-decision-749ff988
  - qe-gate-ABC-208/20261026T035949Z-qe-e2e-decision-8c4f3e57
  - ADR-0031
  - ADR-0034
  - OD-205-2
  - ABC-121
  - ABC-205
  - A6
  - NFR-005
  - memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
  - memory-bank/50-decisions/ADR-0026-a-value-changing-search-heuristic-gets-a-test-only-off-door-and-a-bounded-oracle.md
  - grugops/arch-records-ADR-0050
  - 998b0ffe
  - 42f33a7a
  - b5d5cea5
supersedes: 
seal: sha256:3c6ab3ab98dfb16c0f86bfad125bc7942bc598660dd47152c9d3017737fcd3d4
---

# Architect/Design: the ADR-0050 and ADR-0026 records from `orch-2026-10-26h` item 2 are written (records only). ADR-0050 stays PROPOSED; ADR-0026 d9's 118 cp is dated "not in force on main". No bound moves

Task `arch-records-ADR-0050`. Branch `grugops/arch-records-ADR-0050` is cut from `main` `42f33a7a`, and the records
commit is `998b0ffe`. Inputs: Orchestrator `…42479486` (item 2) and `…749ff988`, and QE `…8c4f3e57` (`QE-208-d`, `-e`).

## Written
1. **`QE-208-e`: `ADR-0050` § Status** gets a dated line, "2026-10-26: still PROPOSED; reported to the owner." The
   Orchestrator reported the text as a yes/no on 2026-10-26 (`…749ff988`; carried in `…42479486`). No answer is
   recorded: as of `42f33a7a` there is no owner-word note for 2026-10-26, and no note names an answer on `ADR-0050`. The
   PROPOSED paragraph is unchanged. This closes `A6`'s "records that the Orchestrator reported it" clause in the ADR
   text.
2. **`QE-208-d`:** the superseding observation note in this task (`supersedes` `…bae20026`): 6/6 → 5/6.
3. **`ADR-0026` decision 9** gets a dated line, "2026-10-26: accepted, not in force on `main`." It sits right under the
   `OD-205-2` amendment bullet, in the form of `ADR-0031`'s "accepted, not shipped" line. Checked read-only at
   `42f33a7a`:
   - `src/search.pvs-lmr.test.ts` has one shared `toBeLessThanOrEqual(75)` that both d5 drift rows use (titles: "none
     beyond 75 cp").
   - `grugops/ABC-205-final` (`b5d5cea5`) carries 118 and is not an ancestor of `main`.

## Not moved
- No status, bound, value, pin or criterion moves.
- No `src/`, `tools/` or `package.json` edit, and no board edit.
- No npm, vitest or timing run.

## Open (LOW, for the Orchestrator to route)
- `ADR-0034` addendum decision 1's pointer (2026-10-24, `OD-205-2`) reads "that ceiling is now 118 cp … So this bar
  reads 118 cp for later L re-finds only." That is the same not-in-force reading as `ADR-0026` d9. It is outside this
  brief, so it was not edited. It may want the same dated line.
