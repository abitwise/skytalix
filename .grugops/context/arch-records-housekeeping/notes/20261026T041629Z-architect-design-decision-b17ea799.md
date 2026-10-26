---
id: 20261026T041629Z-architect-design-decision-b17ea799
kind: decision
by: architect-design
at: 2026-10-26T04:16:29Z
verified_by: 
confidence: high: records only; each fact checked read-only at 08b44f94 (git, grep); no run
refs:
  - ABC-216
  - QE-216-h
  - ADR-0034
  - ADR-0026
  - ADR-0044
  - OD-205-2
  - ABC-121
  - ABC-205
  - NFR-005
  - qe-polish-ABC-216/20261025T033430Z-qe-e2e-observation-63844928
  - qe-polish-ABC-216/20261025T034000Z-orchestrator-decision-665df062
  - arch-records-ADR-0050/20261026T040525Z-architect-design-decision-f9357ec6
  - memory-bank/30-architecture.md
  - memory-bank/50-decisions/ADR-0034-a-puzzle-red-on-an-evaluation-ticket-is-classed-per-row-and-only-budget-drift-goes-to-the-owner.md
  - grugops/arch-records-housekeeping
  - f5ef3d9b
  - 08b44f94
  - 39b93505
  - b5d5cea5
  - 6c984e3e
supersedes: 
seal: sha256:2611db038fcbd13901aba20d2f6028b64479a212f7dfeb920eb4efde5b98e9ae
---

# Architect/Design: two stale record lines dated (records only). `30-architecture` § Tech context gets the Node >= 22.18 floor line (`QE-216-h`); `ADR-0034` addendum decision 1's 118 cp pointer is dated "accepted, not in force on main". No bound moves

Task `arch-records-housekeeping`. Branch `grugops/arch-records-housekeeping` is cut from `main` `08b44f94`, and the
records commit is `f5ef3d9b`. Inputs: the Orchestrator's brief (routed in `6c984e3e`), QE `qe-polish-ABC-216/…63844928`
(`QE-216-h`), Orchestrator `qe-polish-ABC-216/…665df062`, and this role's `arch-records-ADR-0050/…f9357ec6` § Open.

## Written
1. **`QE-216-h`: `memory-bank/30-architecture.md` § Tech context.** The sentence "TypeScript on Node >= 22, ESM." is
   kept. A dated italic line follows it, in the page's own convention (the `ADR-0049` row 33 line in § Deployment
   posture): "2026-10-26 (`QE-216-h`): the floor now reads Node >= 22.18, matching `package.json` `engines.node` since
   `ABC-216` (`39b93505`); 22.18.0 is where Node 22 type-strips by default (`50-decisions/ADR-0044`)." Checked
   read-only: `39b93505`'s diff to `package.json` is exactly `>=22` → `>=22.18`, and it is on `main`; `ADR-0044`
   line 405 names 22.18.0 / 23.6.0 as the default-on points.
2. **`ADR-0034` addendum decision 1.** A sub-bullet under the 2026-10-24 `OD-205-2` pointer: "**2026-10-26: accepted,
   not in force on `main`.**" It follows `ADR-0026` d9's line (`…f9357ec6`). Checked read-only at `08b44f94`:
   - `src/search.pvs-lmr.test.ts` has one shared `toBeLessThanOrEqual(75)`, used by both `ABC-121` d5 drift rows
     ("none beyond 75 cp").
   - `grugops/ABC-205-final` (`b5d5cea5`, which carries 118) is not an ancestor of `main`.
   - The clean-lead bar is a screen run at an L re-find, not a test literal: no `src/` file codes it. The 118 hits
     in `src/` are 0x88 square indices, unrelated.
   - **Direction, stated in the line:** for this bar a larger ceiling is the stricter reading (the lead must exceed
     it). That is the reverse of `ADR-0026` d9, where `main`'s 75 cp rows are the stricter side.

## Not moved
- No status, bound, value, pin or criterion moves. No `src/`, `tools/`, `package.json` or `AGENTS.md` edit (the
  Scribe owns `AGENTS.md` § Stack). No board edit. No npm, vitest or timing run.
- `git diff --stat 08b44f94..f5ef3d9b -- src tools package.json AGENTS.md` printed nothing.

## Open (LOW, for the Orchestrator to route)
- Which number a later L re-find on `main` applies, 75 or 118, is not ruled here. The line records the facts only.
  No L re-find is pending that I know of: `UNKNOWN - verify`.
- See the observation note in this task for more stale lines on `30-architecture`, outside this brief.
