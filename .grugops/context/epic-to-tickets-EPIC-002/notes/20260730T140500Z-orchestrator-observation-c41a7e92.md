---
id: 20260730T140500Z-orchestrator-observation-c41a7e92
kind: observation
by: orchestrator
at: 2026-07-30T14:05:00Z
verified_by: 
confidence: high
refs:
  - epic-to-tickets-EPIC-002
  - EPIC-002
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ADR-0002
  - ADR-0003
  - NFR-002
  - NFR-003
  - RISK-005
  - plans/epics/EPIC-002-terminal-board-and-game-loop.md
  - memory-bank/50-decisions/ADR-0002-game-history-ownership.md
  - memory-bank/30-architecture.md
  - plans/nfr-catalog.md
  - plans/board.md
supersedes: 
---

# Routing record — EPIC-002 decomposition runs in two waves, because ADR-0002 left three seams to THIS decomposition

Scheduling record for task `epic-to-tickets-EPIC-002`. Request: "Decompose EPIC-002".
Classification `epic-to-tickets` → Workflow 03. Mode `lean`, cadence `kanban`, autonomy `pr`.

## Why this is not a solo BA/PM job

Workflow 03's default is BA/PM alone, with the System Analyst pulled in only when behavior is
unclear. Two things in the ratified record override that default here, and both are checkable:

1. **`ADR-0002` (ratified 2026-07-30, all four clauses as proposed) explicitly defers three
   decisions to this exact step.** Its Decision section closes with: "Deliberately not decided
   here, and left to `EPIC-002`'s decomposition: the module's exact API, whether the derived
   counts are memoized, and where SAN formatting lives." Those are structure-and-boundary calls
   — Architect/Design's lane, not BA/PM's. If BA/PM cuts tickets before they are made, it either
   invents them out of lane or ships tickets with an open structural blocker, which fails the
   Definition of Ready on "dependencies known" and "no major unresolved blocker".

2. **The turn loop is specified in one line against two epics that do not exist.** The epic's
   scope reads "render → prompt human → apply → render → engine moves → repeat", while `EPIC-003`
   (input parsing) and `EPIC-004` (engine) are undecomposed and unbuilt. What the loop does at
   those two seams is genuinely unmapped — Workflow 03 step 3's stated trigger for the System
   Analyst.

Neither is ceremony. Both were read off ratified artifacts, not assumed.

## The wave split, and why it is a split rather than three-wide

WIP width cap is `queue.wip_limit` = 3. This runs **2 then 1**, not 3, because BA/PM's ticket
BOUNDARIES are a function of the two wave-1 outputs — where SAN lives decides whether "move
history display" is one ticket or two, and the turn-loop state map decides whether the loop
skeleton separates from the renderer. Running BA/PM concurrently would have it size and cut
against seams that were still being decided. Using 2 of 3 available width is the honest number,
not a conservative one: there are exactly two independent subtasks in wave 1.

- **Wave 1, width 2, parallel** — `architect-epic002-seams` (Architect/Design) and
  `system-analyst-epic002-turnloop` (System Analyst). Independent: one decides module structure,
  the other maps runtime behavior. Neither reads the other's output.
- **Wave 2, width 1** — `ba-pm-epic002-tickets` (BA/PM), which reads wave 1's published notes
  **from this folder on disk**. No data is relayed agent-to-agent; the shared context is the only
  channel, per Workflow 16.

## Claim protocol — stated honestly

This repo has **no queue root and no `scripts/claim.js`** (`scripts/` does not exist; the
`mcp__grugops__propose_note` tool is not installed either — `.grugops/install.json` records a
`copy`-mode kit install with no script surface). Workflow 17's atomic-claim mechanism is
therefore unavailable, exactly as it was for `architecture-audit-2026-07-29`, which coordinated
through `notes/` alone. No queue subsystem was scaffolded to fill the gap — that would be
unrequested infrastructure.

What replaces it is not a weaker version of the same thing, it is a case where the thing is not
needed: Workflow 17's claim exists to make ownership exactly-once when N agents race one pending
POOL. Here each agent is handed one distinct, named subtask by direct assignment and there is no
pool to race over, so exactly-once ownership holds structurally. Notes are written by hand to
`.grugops/context/epic-to-tickets-EPIC-002/notes/` following this repo's established format.
`finding` is therefore **not admissible** in this task — no `§14-gate` exists to stamp one. Wave-1
output must be `decision` / `observation` / `claim`, and any performance number must carry its
machine, per the standing convention in `plans/nfr-catalog.md`.

## Branch

`grugops/epic-to-tickets-EPIC-002`, cut from `grugops/architecture-audit-2026-07-29` (4d00cb1),
**not** from `main`. `ADR-0002` and `ADR-0003` — the two artifacts this whole decomposition rests
on — are ratified on the audit branch and are not on `main` yet. Branching from `main` would
decompose against a record that does not contain the decisions being decomposed against. Same
stacked-branch pattern the repo already used for ABC-004..007. The single human merge of that
stack is still outstanding and still human-held (`autonomy=pr`).

## Board

**No board move in wave 1.** Recording analysis or design notes against an undecomposed epic
does not move a ticket — Workflow 16 is a seam, not a column. `EPIC-002` stays in `Backlog`.
The `Backlog` exit is **BA/PM's** to make in wave 2, when the tickets are cut, matching what
`EPIC-001` actually did (it left `Backlog` on decomposition with no intermediate hop). The
Orchestrator does not make that move on BA/PM's behalf.

## Stop conditions handed to the agents

- Behavior ambiguous and unresolvable → stop and name the missing decision; do not fabricate the
  flow (Workflow 03 stop condition).
- Any ticket sized `XL` → `SPLIT_REQUIRED`, back to BA/PM before it can reach `Ready for Dev`.
- A wave-1 seam that turns out to need a human ruling rather than an agent call → stop and say so.
  `ADR-0002` and `ADR-0003` were both ratified by a named human; a fourth ADR would need the same
  and no agent may mark one `accepted`.
