---
id: 20260809T195904Z-ba-pm-artifact-ref-314cefe0
kind: artifact-ref
by: ba-pm
at: 2026-08-09T19:59:04Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
  - plans/traceability.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` correction hop

## Edited in the repository (two files, both on branch `grugops/ticket-to-pr-ABC-022`)

- `plans/tickets/ABC-022-en-passant-generation-preconditions.md` — the in-place correction.
  `## Reproduction`, `## Acceptance` (`A2`–`A5`, `A11`, preamble), `## Dependencies`,
  `## Security / NFR triggers`, `## Test notes`, the escalation-trigger status and the
  `## Definition of Ready` block. `## Scope`, `## Out of scope`, `## Problem`, `## Source`,
  `## THE CORRECTION THIS TICKET CARRIES`, `A1`, `A6`–`A10`, size and priority untouched.
- `plans/traceability.md` — one header line inserted, **one row edited (`ABC-022`), four cells**
  (`NFRs`, `Code (PR/files)`, `Tests`, `Status`).

## Queue

- `.grugops/queue/claimed/ticket-to-pr-ABC-022-bapm/` — claim directory (atomic `mkdir`, exit 0, so
  first writer) with `claim.md` and the moved subtask file, transitioned to `done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, one full tree copy per state so no two tree states ever share a process:

| tree | `src/moves.ts` md5 | what it is |
| --- | --- | --- |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | today's `main`, the control |
| `t-fixE` | `54fd6c32fc68a09ced9406058d3587b9` | correct fix, **emptiness**-shaped clause |
| `t-fixC` | `1f7bcb9895e184bda8057524fb8ef29e` | correct fix, **colour**-shaped clause |
| `t-restr` | `603fccf48f6373360f89d73b8ebbbcc2` | colour-shaped **restructure**, drops the enemy `continue` |
| `t-white` | `b72437471705745813163fe77ba8b961` | captured-pawn precondition for **white only** |
| `t-count` | `cfdcf078c2982294f7dadd56e7c46149` | `t-fixE` + execution counters at the guard site |

Probes: `probe-repro.ts` (the ten reproduction rows), `probe-a4.ts` (`toFen` injectivity),
`probe-acc.ts` (`A1`–`A6` scored per tree), `probe-walk.ts` (reachability + per-node move-set
digests), `probe-domain.ts` (exhaustive 512-state byte sweep), `probe-black.ts` (black-to-move half
(b)), `probe-mask.ts` (the self-masking witness), `probe-a5new.ts` (the two new `A5` rows),
`probe-count.ts` (the `NFR-001` denominator).

**Every mutant typechecked `tsc --noEmit` exit 0 before any red was believed** — a non-compiling
control was nearly read as a result on `ABC-009`. Every anchor replacement asserted `count == 1`
before writing and asserted the file changed after. Every probe **prints the FEN it used and
re-parses it** before taking a verdict; where a byte is not FEN-producible the constructed board is
printed and read back instead, and that limit is stated rather than glossed.

## Consumed

`agent-factory/roles/ba-pm.md`, `agent-factory/checklists/definition-of-ready.md`,
`agent-factory/workflows/16-context-read-write.md`, `agent-factory/workflows/17-task-claim.md`,
`agent-factory/contracts/context-note.md`, `.grugops/factory.config.json`,
`.grugops/context/ticket-to-pr-ABC-022/notes/20260809T192651Z-orchestrator-decision-1b276013`,
`plans/board.md`, `plans/nfr-catalog.md`, `plans/tickets/ABC-010-fen-semantic-validation.md`,
`src/moves.ts`, `src/legal.ts`, `src/fen.ts`, `src/position.ts`, `src/apply.ts`, `src/perft.ts`,
`src/perft.test.ts`, `AGENTS.md`, `package.json`, `tsconfig.json`.

## Not produced, on purpose

No `src/` edit. No test file. No `index.md` / `index.jsonl` — those are derived by
`scripts/context-io.ts`, which does not exist in this install, and hand-faking them would be a
fabricated audit trail. No `finding` note. No report `.md`.
