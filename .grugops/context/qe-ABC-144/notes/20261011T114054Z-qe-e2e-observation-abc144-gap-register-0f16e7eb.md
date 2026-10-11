---
id: 20261011T114054Z-qe-e2e-observation-abc144-gap-register-0f16e7eb
kind: observation
by: qe-e2e
at: 2026-10-11T11:40:54Z
verified_by:
confidence: high
refs:
  - ABC-144
  - ADR-0040
  - ABC-143
  - ABC-146
  - RISK-ABC143-01
  - QE-144-a
  - QE-144-b
  - QE-144-c
  - QE-144-d
  - QE-144-e
  - QE-144-f
  - 20261011T114054Z-qe-e2e-observation-abc144-readings-f287edc5
  - 20261011T114054Z-qe-e2e-observation-abc144-pin-plants-21613086
supersedes:
---

# QE `ABC-144`: gap register (6 INFO; none is an unmet criterion, none blocks) and the ruling on unsealed notes

This note is hand-authored and unsealed. The readings are in `…f287edc5` and `…21613086`.

| id | severity | owner | gap |
|---|---|---|---|
| `QE-144-a` | INFO | BA/PM (attach to `RISK-ABC143-01`'s vitest-bump trigger) | **The pin does not read `test.projects`.** A per-project `isolate: false` (q5), or a per-project `poolOptions.threads.isolate: false` (q5b), leaves `A7` green. The project resolves `isolate: false` for all 55 specs. **It is inert at runtime on vitest 3.2.7.** The threads pool reads isolation from the root config, and QE's leak probe shows each file isolated (1, 1, 1 against r2's 1, 2, 3). Today the route is closed by vitest's own behaviour, not by the pin. The ticket's Out of scope names "a per-project override" as a forbidden form, so it is worth a guard if a bump opens it. **Promotion trigger:** any vitest bump, minor or major. Re-run q5, q5b and the leak probe (`../probe/`) |
| `QE-144-b` | INFO | none (by design) | **A hand-typed `--maxWorkers=N` raises the cap unseen** (q9) on a narrow set or a `*_DEEP` command. A config import cannot see a CLI flag. `npm test` is closed by `ABC-042` `A10`'s byte pin on `scripts.test`, which is what `ADR-0040` d3 claims, and no more. Not a criterion gap: `A7` pins the configured cap |
| `QE-144-c` | INFO | none | **Adversarial survivor q10.** A config value conditioned on `VITEST_WORKER_ID` reads 3 inside the worker, where the pin imports the config, and resolves 8 in the main process. No drive-by edit takes this shape. Recorded so the plant set is complete, not as a risk |
| `QE-144-d` | INFO | Orchestrator (at merge) | **The dry-run merge against the wave tip `9d0fcb96` conflicts in `plans/traceability.md` only.** The conflict is append against append: the `ABC-143` build and QE rows on the wave, and the `ABC-144` build row (plus this hop's QE row) on the branch. A union resolves it. `src/cli.test.ts` auto-merges, and the merged tree is green (`…f287edc5`) |
| `QE-144-e` | INFO | Orchestrator / `ABC-146` | **`LADDER_DEEP=verdict` collection is equal, but its exit was not run.** It is the ladder's ~44 h verdict run, the hop `ABC-146` owns. One file runs on one worker under any cap (`ADR-0040` addendum, d5 narrowed). `LADDER_DEEP=1` did run: exit 0, 18 / 18 |
| `QE-144-f` | INFO | human (git host) | `host-protection.js` exit 2: `UNKNOWN - verify` (gh returned no readable HTTP status). Environmental, the same as `QE-143-f` |

**Owed, and not gaps of this build** (they belong to Window B, Security/NFR at width 1, by the queue
file's fence): `A1`, `A3`, `A4`, `A5`, the `AR-N8SPAWN-DRIFT` discharge, the thermal-pressure log,
the median effective parallelism (CPU ÷ wall) for `A2`, and the `*_DEEP` lanes' walls (`A6` says
"reported, not bounded"). QE recorded no wall and graded no timing.

## Ruling: does it matter that the hand-written notes are "unsealed"? No

- **It is this install's norm, stated once in `AGENTS.md` § Role / workflow files.** `scripts/context-io.ts`,
  `scripts/claim.js` and `propose_note` are absent from the repository and the kit, and
  `context.human_admission` is `off`. So no note here can be sealed, and no `finding` or `§14-gate#<id>`
  stamp can be emitted. Every role's notes in this task are hand-authored the same way: the SE's three,
  the Architect's, Security/NFR's Window A, and QE's on `ABC-143` and `ABC-085`.
- **Nothing in this verdict rests on a seal.** No note claims to be a `finding` or carries a stamp. QE
  did not take the SE's readings on trust: every SE number QE cites was re-run by QE (the reds, the
  resolved config, the counts and the gates).
- **What "unsealed" does cost is stated, not hidden.** The record is an agent's `observation` /
  `decision`, never a verified `finding`, and Workflow 16's "refused on read as `unsealed`" has no
  reader on this install to refuse it. Restoring the writer is an install-level fix escalated to the
  owner (`AGENTS.md`), not a gap of this ticket.
