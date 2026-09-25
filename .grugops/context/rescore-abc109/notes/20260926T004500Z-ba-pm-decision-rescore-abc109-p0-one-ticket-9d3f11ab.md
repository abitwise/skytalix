---
id: 20260926T004500Z-ba-pm-decision-rescore-abc109-p0-one-ticket-9d3f11ab
kind: decision
by: ba-pm
at: 2026-09-26T00:45:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-121
  - AGENTS.md
  - src/cli.test.ts
  - plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md
  - plans/traceability.md
supersedes:
---

No sanctioned writer (`scripts/context-io.ts`, `scripts/claim.js`,
`mcp__grugops__propose_note`) is present in this repository or the kit, and
`context.human_admission` is `off` on this install — per `AGENTS.md`'s own recorded fact, this
note is hand-authored per `agent-factory/contracts/context-note.md` rather than admitted through
the absent writer.

# `ABC-109` re-scored against today's fact — `P0`, one ticket, executors named

Task `rescore-abc109` (queue, subtask of `wave-2026-09-25`, enqueued by the Orchestrator).
Worktree `.claude/worktrees/rescore-abc109`, branch `grugops/rescore-abc109` off `15c6eb0`.

## Measurement taken this hop

`wc -c AGENTS.md` in this worktree: **32,565 bytes**, headroom **203 bytes (0.62%)** against the
32,768-byte cap `ABC-109` names as inherited. At cut time (2026-08-19) the same file measured
29,749 bytes, 3,019 bytes headroom (9.2%). At the ticket's own measured rate of 1,159 B/edit,
203 B is **0.18 of one edit** — the next `AGENTS.md` commit of any real length is expected to
cross the cap, not the ~2.6 edits read at cut time.

## Is the problem, scope and acceptance still right? Yes — re-read, not amended

`A1`'s own test note ("re-measure the base at pull time; do not quote 29,749 from this page")
already anticipated a moved base, so today's number is the ticket's designed-for case arriving
early, not a defect in the ticket. `A1`–`A8` were re-read against today's fact one by one and
none needed a scope edit. The single ⚠️ found was `priority assigned` (item 9): the header still
read `P1`, but the ticket's own named promotion trigger — "if `AGENTS.md` is measured at
> 31,000 bytes on any branch... this becomes `P0`" — has fired at 32,565 B. Discharged in this
hop by raising the ticket header and rationale to `P0`, with the original `P1` argument kept as
superseded history (not deleted) per this project's own "supersede, don't overwrite" pattern.

**DoR: 9/10 (1 ⚠️, item 9) → 10/10, 0 ⚠️, discharged in-hop by the priority edit.** Full table on
the ticket page.

## The Orchestrator's recommended direction — weighed, not imposed

Extract the long per-command `<!-- RUN … -->` provenance comments out of `AGENTS.md` into a
linked file; keep each command line one line; land a guard that reds when `AGENTS.md` crosses a
set margin under the cap. `ABC-109`'s header is explicit that the remedy's shape is the
`AGENTS.md` Scribe's call, not BA/PM's, so this direction is recorded as **weighed input for the
Scribe**, not written into ticket scope as a mandate. It is already compatible with the ticket as
cut: the "16 HTML comment blocks, 4,657 B (16.8%)" figure on the ticket page is exactly this raw
material, already named and already left to the Scribe's discretion; `A5`'s byte-count guard
already functions as the "margin under the cap" guard the direction asks for (guarding the same
chosen budget the restructure targets); `A4`'s one-line, single-occurrence `- Dev / run:` slot
constraint is compatible with "keep each command line one line." No scope edit was needed to
accommodate the direction.

## Who executes, and one ticket or two

- **`AGENTS.md` Scribe** — `A1`–`A4`, `A6`–`A8`: the restructure, extraction target, and the
  final byte-budget constant. `AGENTS.md` is the Scribe's sole authored output
  (`agent-factory/roles/agents-md-scribe.md`).
- **Engineer** — `A5`: the byte-count guard, which lives in `src/cli.test.ts` (a `src/` file
  outside the Scribe's `AGENTS.md`-only boundary) and needs the Scribe's final budget constant as
  an input, so it is sequenced **after** the Scribe's pass, not in parallel.
- **One ticket, not two.** Splitting `A5` out would separate the guard assertion from the one
  number it exists to check, for no INVEST gain — `A5` is one assertion in a file that already
  exists, not a `SPLIT_REQUIRED`-shaped body of work, and the ticket's own re-size trigger (stop
  and re-cut only if the budget cannot be met without amending a directive's content) does not
  fire here. Size `M` unchanged.

## Fences held

Touched `plans/tickets/ABC-109-agents-md-is-near-a-cap-that-truncates-silently.md` (priority
header + rationale + new "Who executes" section + re-scored DoR, prior score kept as history) and
`plans/traceability.md` (header `_Updated:` line plus the `ABC-109` row's status cell) only,
besides this note and the queue transition. No `src/`, `AGENTS.md`, `plans/board.md`,
`plans/nfr-catalog.md`, or ADR touched. No merge, no push.
