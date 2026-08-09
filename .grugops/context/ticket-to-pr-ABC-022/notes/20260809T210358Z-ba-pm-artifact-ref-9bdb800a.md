---
id: 20260809T210358Z-ba-pm-artifact-ref-9bdb800a
kind: artifact-ref
by: ba-pm
at: 2026-08-09T21:03:58Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
  - plans/traceability.md
supersedes: 
---

# Artifacts produced and consumed by the `ABC-022` `A11`-widening hop (second BA/PM hop)

## Edited in the repository (two files, both on branch `grugops/ticket-to-pr-ABC-022`)

- `plans/tickets/ABC-022-en-passant-generation-preconditions.md` — **`A11` only**, plus one dated
  blockquote appended under the `## Acceptance` preamble. `A1`–`A10`, the preamble's own text,
  `## Scope`, `## Out of scope`, `## Problem`, `## Source`, `## Reproduction`,
  `## THE CORRECTION THIS TICKET CARRIES`, `## Dependencies`, `## Security / NFR triggers`,
  `## Test notes`, `## Size and priority rationale`, `## Definition of Ready`, `## Implementation`,
  size, priority and the frontmatter (`status: in-review` / `column: In Review`) — **all untouched**.
- `plans/traceability.md` — one header line inserted; **one row edited (`ABC-022`), three cells**
  (`Code (PR/files)`, `Tests`, `Status`).

## Queue

- `.grugops/queue/claimed/ticket-to-pr-ABC-022-bapm2/` — claim directory created by a plain atomic
  `mkdir` (exit 0, so first writer), with `claim.md` and the subtask file moved in from `pending/`
  and on to `done/` at the end.

## Measurement harnesses — ALL OUTSIDE THE REPOSITORY, none committed

Under the session scratchpad, one full tree copy per state so no two tree states ever share a
process, `node_modules` symlinked to the repo and `tsconfig.json` narrowed to `src/**`:

| tree | `src/moves.ts` md5 | `src/legal.ts` md5 | what it is |
| --- | --- | --- | --- |
| `t-pristine` | `0e247853ab2c05887c76105ff83d8621` | (main) | `git archive main src` — the control |
| `t-fix` | `6335b452fc21ffe2d0f902ecab930840` | `aa645c6964ed902489425150e3879fd8` | `git archive HEAD src`, `cmp`-verified byte-identical to the repo working tree |
| `t-fix-noA` | `6335b452…` | `450cd8cd839a0d3514395512c743e05c` | guard (a) deleted from the FIXED tree |
| `t-fix-noB` | `6335b452…` | `23fa516a49cafa875c0111279148b9ba` | guard (b) deleted from the FIXED tree |
| `t-pristine-noA` | `0e247853…` | (main, guard (a) deleted) | the pre-fix baseline for the guard-(a) direction |

Probes: `probe-oracle.ts` (the two `src/legal.test.ts` tables plus `ADR-0005`'s two witnesses and two
in-domain controls, scored for `generateMoves` ep count / oracle / `hasLegalEnPassant` / `legalMoves`
purity), `probe-domain.ts` (the exhaustive `256 x 256 x 2 = 131,072`-state sweep of the two guard
inputs), `probe-extra.ts` (`src/legal.test.ts:202`'s `ABC-009` purity claim, and the four
`## THE CORRECTION THIS TICKET CARRIES` rows), `probe-mask.ts` (the self-masking FEN, across the call
and per make/unmake pair).

**`tsc --noEmit` exit 0 on every tree before any result was believed** — the board's recorded trap of
reading a non-compiling control as a result. Every mutant was an **anchored single deletion** that
asserted `count == 1` before writing and asserted the file changed after. Every probe **prints the
FEN it used and re-parses it** before taking a verdict; where a byte is not FEN-producible the sweep
writes the board directly and records the resulting throw as the observable, with the throw count
reported and identical across trees.

## Consumed

`agent-factory/roles/ba-pm.md`, `agent-factory/workflows/16-context-read-write.md`,
`agent-factory/workflows/17-task-claim.md`, `agent-factory/contracts/context-note.md`,
`.grugops/factory.config.json`, **all seventeen prior notes** in
`.grugops/context/ticket-to-pr-ABC-022/notes/`, `plans/board.md`, `plans/traceability.md`,
`plans/tickets/ABC-022-…md`, `plans/tickets/ABC-011-…md`, `plans/tickets/ABC-023-…md`,
`plans/tickets/ABC-009-…md`, `plans/nfr-catalog.md`, `plans/epics/`, `memory-bank/30-architecture.md`,
`memory-bank/60-progress.md`, `memory-bank/50-decisions/ADR-0005-…md`, `src/legal.ts`,
`src/legal.test.ts`, `src/moves.ts`, `src/moves.enpassant.test.ts`, `src/zobrist.ts`, `src/apply.ts`,
`src/position.ts`, `src/fen.ts`, `AGENTS.md`, `package.json`, `tsconfig.json`.

## Not produced, on purpose

**No `src/` edit — not one line, comment or otherwise** (`git status --short -- src/` empty, both
md5s unchanged from the branch tip). No test file and no test row. No board move and no
`plans/board.md` edit. No edit to `ADR-0005`, `ABC-011`, `ABC-010`, `ABC-013`, `ABC-023`,
`plans/nfr-catalog.md`, `plans/board.md` or `memory-bank/`. No `finding` note — none is admissible
here: there is no §14 gate to issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`
(re-read from `.grugops/factory.config.json` at this hop), so no `human:<name>` stamp exists either.
No `index.md` / `index.jsonl` — those are derived by `scripts/context-io.ts`, which does not exist in
this install, and hand-faking them would be a fabricated audit trail. No report `.md`. Nobody
enqueued.
