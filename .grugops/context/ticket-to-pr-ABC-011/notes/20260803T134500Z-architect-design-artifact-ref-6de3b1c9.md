---
id: 20260803T134500Z-architect-design-artifact-ref-6de3b1c9
kind: artifact-ref
by: architect-design
at: 2026-08-03T13:45:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-011
  - ABC-011
  - EPIC-001
  - NFR-005
  - ADR-0005
  - ADR-0006
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md
  - memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md
  - memory-bank/60-progress.md
  - .grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt
supersedes: 
---

# What this second design hop produced, and where each piece lives

Everything is on branch `grugops/ticket-to-pr-ABC-011`, on top of the QE and Security/NFR work.
**No file under `src/` was changed** — this was a design hop, and every measurement was driven
against copies of the shipped tree from a scratchpad outside the repository. **No PR exists — this
repo has no git remote**, so there is nowhere to push and no link to record; no link was invented.
**Nothing was merged and nothing was deployed; a human holds both.**

## The ratified fix contract — read this one first

- `plans/tickets/ABC-011-zobrist-en-passant-hashing.md` → **`### ANSWERED 2026-08-03 at the SECOND
  design hop`**, added **beside** the 2026-08-02 block and not over it. Six numbered items, the
  two-guards-not-one analysis, the domain of the oracle, the cost table, the six probe FENs with the
  mutant each kills, the two documentation corrections, the size call, and the one item routed to
  BA/PM. Front matter moved to `status: ready-for-dev` / `column: Ready for Dev`; `size: M` is
  unchanged. Both board moves of 2026-08-03 recorded under `## Definition of Ready`.

## The decision records — both now `accepted`

- `memory-bank/50-decisions/ADR-0005-en-passant-availability-and-the-hash-layer.md` — **`accepted`
  with an amendment.** New: the authority-for-ratification section, the scope bound to en passant,
  **Decision clause 6** (the probe's precondition, decided but not yet built), the oracle-domain
  subsection, a corrected Consequences paragraph naming the defect that produced the amendment, and
  a six-row **falsifier table**. Clauses 1–5 unchanged.
- `memory-bank/50-decisions/ADR-0006-castling-rights-stay-rights-in-the-hash.md` — **NEW,
  `accepted`.** The castling ruling, its three reasons, four rejected alternatives, consequences,
  rollback, and a five-row **falsifier table**. Its Status section carries both the reasoning for
  splitting it out of `ADR-0005` **and** the honest counter-argument against it existing at all.

## The retained evidence

- `.grugops/context/ticket-to-pr-ABC-011/sources/FIDE-CURRENCY-2026-08-03.txt` — the integrity **and
  currency** re-verification of the FIDE text `ADR-0006` quotes: fresh fetch byte-identical to the
  retained copy, the handbook index's four published chapters, the soft-404 control run, the
  re-extracted 9.2.3.2 sentence, and the four-edition wording comparison. **The 186 KB of response
  bytes are NOT re-copied** — they are already retained under `refinement-fide-9-6-1` and are
  referenced by sha256; duplicating them would add weight for no evidentiary value, and editing
  another task's evidence folder is not this role's to do.

## The board and the trail

- `plans/board.md` — `ABC-011` moved **`In Design` → `Ready for Dev`**. In Design 1/2 → 0/2, Ready
  for Dev 0/6 → 1/6. Exit comment under `## In Design` above the Orchestrator's re-entry comment,
  entry comment under `## Ready for Dev` telling the engineer what is a delta and what is not, live
  ticket row moved, header updated. **No limit approached, no override taken, no written reason
  owed.**
- `plans/traceability.md` — `ABC-011`'s row updated **in place** (NFRs / Tests / Status), prior text
  behind `Previously` markers. **No row appended:** one row per ticket is this file's own format
  rule, and it is also why neither ADR got a decision row — both hang off this one ticket, so they
  are cited in its NFRs cell. The **UAT** cell is untouched and still reads `deferred — EPIC-006`.
- `plans/nfr-catalog.md` — `NFR-005`'s row gains the fix's cost with its denominators, its machine,
  its `UNKNOWN - verify`, and an explicit statement of the instrument's own resolution limit. **No
  target moved**; every depth level, the PROVISIONAL marker, the call-count sub-bar, the amortized
  row, the allocation figure and every demoted node-rate diagnostic are byte-identical.
- `memory-bank/60-progress.md` — the ADR count goes four → **six** with both ratifications and the
  amendment named; the castling follow-on under **"Standing directive — who decides"** is marked
  **ANSWERED** with the short form of the reasoning; the defects table gains two rows (the MEDIUM
  defect folded into `ABC-011`, and the new unticketed `generateMoves` finding routed to BA/PM); the
  board-state line and `## Next action` are re-pointed; the standing "an ADR awaits a human" item is
  **closed**.

## The reasoning and the measurements

- `.grugops/context/ticket-to-pr-ABC-011/notes/20260803T133000Z-architect-design-decision-7c41d0ab.md`
  — the three rulings, the mechanism read out of `src/apply.ts`, why the oracle cannot be the
  authority off-domain, the castling reasoning, the ADR dispositions, and the scope discipline.
- `…/20260803T133500Z-architect-design-observation-9b2e4f17.md` — the raw record: the reproduction
  table with three FENs nobody had, the generator's own unsoundness, the exhaustive walk with both
  guard-firing counts, the sandbox suite and mutant results, both cost tables, and the castling
  evidence.
- `…/20260803T134000Z-architect-design-claim-4a90cd52.md` — the six things this hop could **not**
  settle at `confidence: UNKNOWN - verify`, including one process note offered rather than smuggled
  into a ruling.

## The harness — NOT in the repository, and deliberately so

Eight throwaway scripts in the session scratchpad plus a sandbox with `node_modules` symlinked:
`repro.ts`, `hop2-sweep.ts`, `hop2-bench.ts`, `hop2-predbench.ts`, `hop2-guard1.ts`,
`hop2-castling.ts`, `hop2-rightsloss.ts`, `hop2-g4.ts`, and `hop2-sandbox/` (the repo's own suite
run against the guarded shape and against each single-guard mutant). **They are throwaway and are
not committed** — the same posture every prior measurement on this project has taken. Every number
they produced is transcribed into the observation note with its machine, so nothing depends on the
scripts surviving; anyone re-running them should expect to rebuild them from that note rather than
find them.

**One caution for whoever rebuilds them:** my first sweep used wrong FENs for `position-5` and
`position-6` and produced 490,296 nodes instead of 518,474. The table must be read out of
`src/perft.test.ts` — `position-5` carries the counters `- 1 8`, and `position-6` is
`r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10`.

## Substrate

Recorded rather than glossed, as every prior task here has: this install has **no `scripts/`
directory at all** — no `scripts/claim.js` and no `scripts/context-io.ts` /
`mcp__grugops__propose_note`. The queue file was moved
`pending/` → `claimed/ticket-to-pr-ABC-011-design2/` → `done/ticket-to-pr-ABC-011-design2/` **by
hand**, with a `claim.md` registry record written by hand alongside it, and these four notes were
**hand-written** into `notes/` in the schema's exact shape. **No `finding` was written — none is
admissible without a §14 gate to issue a stamp, and `context.human_admission` is `off` so no
`human:<name>` stamp is available either. Nothing was self-stamped.** There is no `index.md` /
`index.jsonl` render because the renderer does not exist here.

**One consequence worth naming for this hop specifically.** Two ADRs were moved to `accepted` on a
substrate where no `finding` can be admitted — so the ratifications are recorded as `decision`
notes and in the ADR files themselves, and the evidence under them is `observation`. The degraded
note kind changes the **admission class only**, never the authority: the authority is the project
owner's standing directive of 2026-08-03, quoted verbatim in `memory-bank/60-progress.md`, and it is
that file rather than a note kind that a later reader should check.
