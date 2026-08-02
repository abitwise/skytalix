---
id: 20260802T214800Z-architect-design-artifact-ref-de57b47d
kind: artifact-ref
by: architect-design
at: 2026-08-02T21:48:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
  - NFR-001
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - memory-bank/60-progress.md
supersedes: 
---

# What this design hop produced, and where each piece lives

Everything below is on branch `grugops/ticket-to-pr-ABC-011`, cut from `main`. **No file under
`src/` was changed** — this was a design hop, and every measurement was driven read-only against
merged `src/` from a scratchpad outside the repository.

## The ratified contract — read this one first

- `plans/tickets/ABC-011-zobrist-en-passant-hashing.md` → **`### ANSWERED 2026-08-02 at the design
  hop by Architect/Design — build exactly this`**, under the ticket's own `### Open design question`.
  The reading, the exact shape, six numbered rules, the measured cost table, the FEN pair the ruling
  decides, the fourth acceptance criterion's oracle, and the two documentation edits owed when the
  change lands. Front matter moved to `status: ready-for-dev` / `column: Ready for Dev` / `size: M`,
  with the re-size recorded in `## Size and priority rationale` and the move recorded under
  `## Definition of Ready`.

## The decision record

- `memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md` — **status
  `proposed`.** No agent may mark it `accepted` and none did. It does **not** block `ABC-011`;
  the reasoning for that is in its own Status section.

## The board and the trail

- `plans/board.md` — `Ready` 5/8 → 4/8, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6.
  Nine-point exit comment under `## In Design`, entry comment under `## Ready for Dev`, live ticket
  row added, header updated. No limit approached, no override taken, no written reason owed.
- `plans/traceability.md` — `ABC-011`'s row updated **in place** (NFRs / Code / Tests / Status).
  No row appended: `ADR-0005` hangs off one ticket, so it is cited in that ticket's NFR cell rather
  than given a decision row, which is the distinction the file's own format comment draws.
- `plans/nfr-catalog.md` — `NFR-005`'s row gains the per-node key cost with its denominator, its
  machine and its `UNKNOWN - verify`. **No target moved**; every depth level, the PROVISIONAL marker
  and every demoted node-rate diagnostic are byte-identical.
- `memory-bank/60-progress.md` — plan-of-record refreshed: the ADR count, the board state, the
  `ABC-011` row in the defects table, and `## Next action` re-pointed at the Orchestrator's pull.

## The reasoning and the measurements

- `.grugops/context/ticket-to-pr-ABC-011/notes/20260802T214500Z-architect-design-decision-501d774b.md`
  — the ruling, the five reasons behind it, the five rejected alternatives each with the measurement
  that killed it, the `ADR-0002` clause-by-clause check with its falsifier, and the re-size.
- `…/20260802T214600Z-architect-design-observation-5f316a31.md` — the raw measurements: key
  reproduction, acceptance criteria under each reading, divergence with its denominators, predicate
  agreement against the real generator and filter, the cost tables, the purity/`ABC-009` result, the
  rebuilt dependency graph, and one structural fact about repetition the ticket does not state.
- `…/20260802T214700Z-architect-design-claim-3cddf634.md` — the five things this hop could **not**
  settle, at `confidence: UNKNOWN - verify`.

## The spike harness — NOT in the repository, and deliberately so

Seven scripts in the session scratchpad, importing merged `src/` by relative path from a copy taken
at `4a73cf3`: `verify.ts` (keys and ep counts), `sweep.ts` (divergence over the perft table),
`variants.ts` + `zobrist-variants.ts` (the three readings against the merged module's exact table
construction), `bench.ts` (per-call cost), `amortized.ts` (per-node cost over a 120,000-node pool),
`acceptance.ts` (the ticket's criteria under each reading, plus allocation), `purity.ts` (the
`ABC-009` inheritance test), `dag.mjs` (the dependency graph). **They are throwaway and are not
committed** — the same posture every prior measurement on this project has taken. Every number they
produced is transcribed into the observation note with its machine, so nothing depends on the
scripts surviving; anyone re-running them should expect to rebuild them from that note rather than
find them.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has no `scripts/claim.js`
and no `scripts/context-io.ts` / `mcp__grugops__propose_note`. The queue file was moved
`pending/` → `claimed/ticket-to-pr-ABC-011/` → `done/ticket-to-pr-ABC-011/` **by hand**, and these
four notes were **hand-written** into `notes/` in the schema's exact shape. **No `finding` was
written — none is admissible without a §14 gate, and nothing was self-stamped.** There is no
`index.md` / `index.jsonl` render because the renderer does not exist here.
