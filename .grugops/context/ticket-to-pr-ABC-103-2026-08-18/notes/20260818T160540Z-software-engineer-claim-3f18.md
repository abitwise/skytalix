---
id: 20260818T160540Z-software-engineer-claim-3f18
kind: claim
by: software-engineer
at: 2026-08-18T16:05:40Z
verified_by: 
confidence: UNKNOWN - verify
supersedes: 
refs:
  - ABC-103
  - src/cli.test.ts
  - ADR-0011
---

# What this repair does NOT prove — written for the `qe-e2e` hop that follows

Filed as a `claim` with `confidence: UNKNOWN - verify` deliberately: **no `kind: finding` is
admissible on this install** (`context.human_admission` is `off`, `scripts/context-io.ts` and
`mcp__grugops__propose_note` are absent), so nothing here carries a `§14-gate#<id>` stamp and none
was emitted.

1. **The `A3` row is now blind to a NEW flat production module, by design.** That is the whole point
   of `ABC-103`, but state it plainly: after this change nothing in `src/cli.test.ts` notices when a
   module is added to `src/`. If some OTHER guard was silently relying on that count as an inventory
   trip-wire, this hop did not look for it and cannot say. The `ADR-0011` clause 1 licence-guard
   trigger itself is explicitly out of scope per the ticket and was NOT re-derived.
2. **`A2` was proven for two wrong builds, not for all of them.** `src/cli.ts` moved to
   `src/cli/main.ts`, and a nested `src/cli/main.ts` added beside a flat `cli.ts`. A build that
   nests something OTHER than the entry point, or that reaches the entry point through a symlink,
   was not probed.
3. **The `A1` placeholder was an EMPTY `.ts` file.** It exercises the listing, not the type checker
   or the linter — `npm run lint` and `tsc --noEmit` were NOT re-run with the placeholder present,
   so "adding a module no longer reds the suite" is proven for `npm test` only, which is what `A1`
   asks.
4. **`N8-LANE` was not measured, and none is owed.** No test FILE was added — this is an edit to one
   existing file — so the ticket's own per-file floor does not apply. The observed effect is one
   fewer assertion; the suite duration moved between 2.0 s and 2.6 s across runs, which is noise and
   is NOT offered as a measurement.
5. **No UAT was conducted and no human has accepted this.** The delivered diff carries zero
   production lines, so the 2026-08-17 standing waiver applies on its measured criterion — but a
   waiver is not a signature. `Done` under that rule means merged and gated, never accepted.
6. **Not merged, not deployed.** The branch is left at its tip for review.

## The queue-claim irregularity, recorded rather than hidden

`.grugops/queue/pending/ticket-to-pr-ABC-103-2026-08-18.md` **did not exist** when this hop started:
`pending/` held only `.gitkeep` and `done/` holds no `ABC-103` record. The atomic claim was still
taken by hand per Workflow 17 (bare `mkdir` of
`.grugops/queue/claimed/ticket-to-pr-ABC-103-2026-08-18/`, which succeeded — no `EEXIST`, so the
claim is this hop's and unambiguous), but there was no `pending/ → claimed/` rename to perform and
the task file under `claimed/` was written from the dispatching task description instead of moved.
The claim's exclusivity property is intact; its provenance chain from `pending/` is not.
