---
id: 20260809T110700Z-ba-pm-artifact-ref-5eba5219
kind: artifact-ref
by: ba-pm
at: 2026-08-09T11:07:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - EPIC-001
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/traceability.md
  - .grugops/queue/done/ticket-to-pr-ABC-009-bapm
supersedes: 
---

# What this subtask produced, and where it is

Trace ids: **`ABC-009`** → **`EPIC-001`** → feature `—` → **`NFR-001`**. Branch
`grugops/ticket-to-pr-ABC-009`. Task `ticket-to-pr-ABC-009`, subtask `bapm-abc009-acceptance`,
Workflow 07.

## Edited — exactly two files, both STATE

- **`plans/tickets/ABC-009-legalmoves-position-mutation.md`** — corrected in place. Sections changed:
  the escalation header (one sentence dated so it is not read as a claim about today),
  `## Reproduction` (a dated re-derivation with three measured families), `## Scope` (the two
  preconditions stated as identity tests, the layer named, "the position" defined as 128 bytes plus
  five scalars), `## Out of scope` (the reciprocal `ABC-022` fence, plus `ABC-011`'s guards and a
  restated `src/fen.ts` line), `## Acceptance` (six criteria → **ten**, labelled `A1`–`A10`, plus the
  correction block), `## Dependencies` (`ABC-022` and `ABC-013` named and bounded),
  `## Security / NFR triggers` (the ratio bar, the corrected baseline, `NFR-005` excluded
  structurally), `## Test notes` (two shapes → **five**), `## Size and priority rationale` (re-derived,
  `S` unmoved), `## Definition of Ready` (restated; *acceptance measurable* ❌ → ✅).
- **`plans/traceability.md`** — **one row (`ABC-009`), three cells** (`NFRs`, `Tests`, `Status`), plus a
  new `_Updated:` line prepended per this file's own convention. No other row touched, none appended,
  none removed.

## NOT edited, deliberately

`plans/tickets/ABC-022-*.md`, `ABC-010`, `ABC-011`, `ABC-013`, `plans/epics/EPIC-001*`,
`plans/nfr-catalog.md`, `plans/board.md`, and **every file under `src/`**. `git diff --stat -- src/`
against `main` is empty and `src/moves.ts` still hashes `fb4fa40934e768dffeaeed0b43548842`. No
production code and no test was written by this role.

## Board and queue

- **No board move.** `ABC-009` was already in `Ready` (2026-07-31) and stays there; **`Ready` stays
  3/8**. `plans/board.md` was not edited. The `Ready → In Development` exit is the Orchestrator's, was
  not taken, and **no engineer was enqueued**.
- Queue: `pending/ticket-to-pr-ABC-009-bapm.md` → `claimed/ticket-to-pr-ABC-009-bapm/` →
  `done/ticket-to-pr-ABC-009-bapm/`, claimed **by hand** because `scripts/claim.js` is absent from both
  the repo and the kit (re-checked at the source). The registry record is
  `claim.md` inside the claim directory, carrying `by` / `at` / `task` / `outcome` and an honest note
  that the claim was manual.

## Notes published under this task

- `20260809T110127Z-ba-pm-observation-6336a2ab` — the three leaking families, the twelve rows, the
  `toFen` projection, the unreachable shape, the caller graph.
- `20260809T110300Z-ba-pm-observation-43307eb5` — the seven-build mutant campaign and the
  disjoint-set result.
- `20260809T110430Z-ba-pm-decision-ff273859` — the seven defects, the rulings, each with the
  alternative it rejected; and what was adjudicated and deliberately left alone.
- `20260809T110545Z-ba-pm-claim-b2cb8912` — the soft results, `confidence: UNKNOWN - verify`.
- `20260809T110700Z-ba-pm-artifact-ref-5eba5219` — this note. **Five in total.**

**No `finding` was written.** None is admissible on this task: there is no §14 gate in this install to
issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no `human:<name>` stamp exists
either. **Nothing is self-stamped** — every note above carries an empty `verified_by`. **No `index.md`
or `index.jsonl` was hand-faked**; the renderer that derives them does not exist here, and a hand-written
render would be a fabricated artifact.

## Next hop

The Orchestrator re-runs the Definition of Ready against the corrected ticket and owns the
`Ready → In Development` exit. **This role does not certify its own output as ready.** Nothing was
merged and nothing was deployed.
