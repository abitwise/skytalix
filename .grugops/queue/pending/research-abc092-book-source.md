---
task: owner-rulings-2026-09-19
subtask: research-abc092-book-source
role: architect-design
workflow: agent-factory/workflows/07-backlog-refinement.md (research → proposed ADR awaiting owner ratification)
ticket: plans/tickets/ABC-092-opening-book-source-and-licence-decided-before-a-byte-is-copied.md
ref: .grugops/context/research-abc092-book-source/
authority: .grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md
enqueued_by: orchestrator
enqueued_at: 2026-09-19T10:05:00Z
branch: grugops/research-abc092-book-source
base: grugops/owner-rulings-2026-09-19
adr_id: ADR-0023
---

# Subtask: research opening-book sources and their licences; draft `ADR-0023` as `proposed` for the owner to ratify

Read the authority note, `ABC-092` in full (`A1`–`A6`, the two senses of "licence"), `RISK-004` in
`plans/nfr-catalog.md`, `NFR-006` (≤ 1,048,576 bytes compiled book), `ABC-093`/`ABC-094` (what the
data must feed), and `EPIC-005`. The owner's word: *"2. i don't have preferred source, we can
research that"* — research is authorised; **ratification is NOT given and you cannot give it.**

## Deliver
- Candidate table: ≥ 3 sources of opening theory with a **published, readable** licence — e.g.
  ECO/opening-name tables (Lichess `chess-openings` repo, CC0), PGN/Polyglot books, hand-authored
  main lines. For each: licence identifier, the redistribution clause **quoted verbatim** from the
  licensor's own page (URL + date read), the attribution obligation, physical provenance, rough
  size vs `NFR-006`, and whether the format can carry an opening NAME (`ABC-096` needs it).
- `memory-bank/50-decisions/ADR-0023-<slug>.md`, **`status: proposed`**, recommending exactly ONE
  source with ≥ 2 rejected candidates and their licence/provenance reasons (`A3`), the attribution
  file path `ABC-093` must keep (`A4`), and a blank ratification line for the owner's name and date.
  `RISK-004` does NOT move until he ratifies (`A5`) — say so in the ADR.
- Update `ABC-092`'s page: research done, what remains is one owner sentence.

## Fences
- `A6`: **zero bytes of book data enter the repository.** No PGN, no Polyglot, no ECO table, no
  attribution file yet (the attribution artifact is written on ratification, not before).
- Zero files under `src/`. Do not touch `AGENTS.md`, `plans/board.md`.
- Do not merge, do not deploy. Own `git worktree`, commit on the branch above.

## Board / trace
Board moves are the Orchestrator's. Append your `plans/traceability.md` row.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`
(no `finding` admissible; the candidate table is an `observation`, the recommendation a `claim`
with `confidence` stated — it is not a decision until the owner speaks). Claim by hand per
Workflow 17: `mkdir .grugops/queue/claimed/research-abc092-book-source`, move this file in, then
out to `done/`.
