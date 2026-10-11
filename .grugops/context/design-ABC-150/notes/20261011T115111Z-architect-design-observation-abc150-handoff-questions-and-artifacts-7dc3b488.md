---
id: 20261011T115111Z-architect-design-observation-abc150-handoff-questions-and-artifacts-7dc3b488
kind: observation
by: architect-design
at: 2026-10-11T11:51:11Z
verified_by:
confidence: high
refs:
  - ABC-150
  - ADR-0041
  - .grugops/context/design-ABC-150/probe/
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# `ABC-150` design hop: hand-off, owner questions, artifacts

This note is hand-authored and unsealed.

## Board (the Orchestrator's move)

- **Recommended:** `ABC-150` leaves `In Design` for BA/PM with the ruling, under the split rule (close on
  `D1`–`D3`).
- **Not `Ready` for dev:** there is no setting to build.

## Questions for the owner (via the Orchestrator)

1. **Accept `ADR-0041`?** The cause is found, no runner setting is admissible, and `ABC-150` closes at the ruling.
2. **Route (a):** do you want a new ticket for vitest ≥ 4.1 with the module runner off?
   - `ABC-149` goes first.
   - The test-content change in `render-seam.test.ts` and `cli.test.ts` is your R-3 call.
   - Its lane-CPU effect is `UNKNOWN - verify`.
3. **Pin (for BA/PM):** should decision 3's warning (no `deps.external` over `src/`) get a value pin, as
   `isolate` has? That is a test, so it is a new ticket.

## Artifacts (branch `grugops/design-ABC-150`)

- `.grugops/context/design-ABC-150/probe/`:
  - method `METHOD.md` (`f24469bf`, before the first graded run);
  - drivers `d-pairs.mjs`, `c3-control.mjs`, `lane-screen.mjs`;
  - sides `d-node.mjs`, `d.probe.test.mjs`, `vitest.d.config.mjs`;
  - `workload150.mjs`, `build-bundle.mjs` + `bundle/`;
  - inspections `inspect-*.mjs`, `graph-check.mjs`;
  - `raw/`, every process and pair, plus the ungraded smoke and inspection outputs.
- `memory-bank/50-decisions/ADR-0041-vitests-5x-is-the-module-runners-cross-module-interop-and-no-admissible-runner-setting-removes-it.md` (PROPOSED).
- `plans/nfr-catalog.md`: one dated line, no row touched.
- `plans/traceability.md`: one row at the end.

## Not done, by instruction

No `L1`–`L4`, no `--cpu-prof`, no `src/`, `vitest.config.ts`, `package.json` or `plans/board.md` edit. No merge, no push.
