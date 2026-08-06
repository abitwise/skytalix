---
id: 20260806T201600Z-agents-md-scribe-artifact-ref-e22197f0
kind: artifact-ref
by: agents-md-scribe
at: 2026-08-06T20:16:00Z
verified_by: 
confidence: high
refs:
  - agents-md-branching-model
  - AGENTS.md
  - memory-bank/60-progress.md
supersedes: 
---

# What this hop produced, and where it stops

## Artifacts

- **`AGENTS.md`** — the only file changed. One new section `## Branching model` (between
  `## Delivery` and `## Safety rules`); one false line in `## Safety rules` replaced by two honest
  bullets. Additive apart from that single replaced line. File size 10.4 KB — well under the 32 KiB
  Codex cap that silently truncates.
- **`.grugops/context/agents-md-branching-model/notes/`** — this folder, four notes:
  `decision` (what was changed and what was left alone), `observation` (the kit-vs-owner
  contradiction and why it cannot be fixed in the kit), `claim` (the no-contradiction check and its
  honest limits, plus the traceability non-action), and this `artifact-ref`.
- **Branch `grugops/agents-md-branching-model`**, cut from `main` at `79dd734`.

No `index.md` / `index.jsonl` was written. They are DERIVED renders produced by
`scripts/context-io.ts`, which **does not exist in this install** — no other context folder in this
repo carries them either, and hand-faking a derived artifact would misrepresent a byte-reproducible
render as one.

## Substrate degradation, recorded plainly

No `scripts/context-io.ts`, no `scripts/claim.js`, no `hooks/` directory in this repo. All four
notes were hand-written in the schema's shape (`agent-factory/contracts/context-note.md`), matching
the existing notes under `.grugops/context/ticket-to-pr-ABC-012/notes/`. **No `finding` was
written**, because no §14 gate exists here to issue a stamp and a self-stamp is a structural FAIL.
Every result above is a `decision`, an `observation`, a `claim` or this pointer.

## Where this stops

**Nothing was merged and nothing was deployed.** The branch is committed and left for the
Orchestrator, which runs the gates and merges under the owner's standing approval — the first
exercise of the model this hop just wrote down. No file outside `AGENTS.md` and this notes folder
was touched: no board move, no traceability row, no config edit, no ticket.
