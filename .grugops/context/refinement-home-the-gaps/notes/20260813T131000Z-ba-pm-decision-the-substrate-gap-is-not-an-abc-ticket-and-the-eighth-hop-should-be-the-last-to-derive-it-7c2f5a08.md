---
id: 20260813T131000Z-ba-pm-decision-the-substrate-gap-is-not-an-abc-ticket-and-the-eighth-hop-should-be-the-last-to-derive-it-7c2f5a08
kind: decision
by: ba-pm
at: 2026-08-13T13:10:00Z
verified_by:
confidence: high
refs:
  - quality-gate-ABC-026
  - quality-gate-ABC-021
  - H2
  - agent-factory/workflows/16-context-read-write.md
  - agent-factory/workflows/17-task-claim.md
  - agent-factory/contracts/context-note.md
  - .grugops/factory.config.json
supersedes:
---

# The substrate gap: **NOT an `ABC-` ticket.** It is an install/kit defect, it belongs to a named human, and the honest thing is to say the consequence out loud once instead of re-deriving it a ninth time

> **Hand-authored, no stamp.** This note is itself an instance of what it describes.

## Re-verified at this hop rather than inherited — the EIGHTH consecutive hop

```
scripts/                                          does not exist in this repository
find . -iname '*context-io*' -o -iname 'claim.js'  no hits
find /Users/olgeroeselg/.grugops/agent-factory
     -iname '*context-io*' -o -iname '*claim.*'    no hits — ABSENT FROM THE KIT TOO
mcp__grugops__propose_note                         not in this session's tool set
.grugops/factory.config.json context.human_admission   "off"
§14-gate verdict record under this task            none
```

`tools/grugops/` exists and holds exactly two scripts (`reference-check.js`,
`test-skip-integrity.js`). **Neither is the sanctioned context writer.**

## The consequence, stated plainly once so nobody has to derive it a ninth time

Workflow 16 admits a `kind: finding` **only** with a real `§14-gate#<id>` stamp cross-checked against
a live green gate verdict, or a `human:<name>` stamp under a named human's session grant. Workflow 05
emits that verdict through the `emitVerdict` carve-out in `scripts/context-io.ts`. **That file does
not exist here or in the kit, so no `§14-gate` verdict can be emitted on this install**, and
`human_admission` is `off`.

**Therefore: not one result in this project's history has ever been admitted as a `finding`.** Every
note is a `claim`, an `observation`, a `decision` or an `artifact-ref`. I read nineteen notes across
three task folders at this hop and **every one of them is soft or neutral, and every one of them says
so in its own opening paragraph.**

**That is honest, and the honest thing is what everyone has done.** No hop faked a stamp, hand-wrote
a `by: §14-gate` note, or fabricated an `index.md`. Workflow 16's own escape hatch — *re-record
honestly as a `claim` with `confidence: UNKNOWN - verify`* — is the path every hop took. **The
admission machinery Workflow 16 describes has never once run here, and nothing built on it is
load-bearing, because nothing was ever allowed to be.**

## The ruling: **no `ABC-` ticket. Route to the named human who owns the install.**

Three reasons, in the order that decides it.

**1. The missing artifacts are the KIT's, and the kit is read-only to this project.** Workflow 16
names `scripts/context-io.ts` as *"the only sanctioned writer"*; Workflow 17 names `scripts/claim.js`
`claimTask` / `transition`; the note contract names the same file. **The kit's own workflows name
files the kit does not ship.** A `plans/tickets/ABC-0xx.md` cannot repair
`/Users/olgeroeselg/.grugops/agent-factory/` — that path is outside this repository and outside this
board's authority.

**2. Building it INSIDE cli-chess would be the largest scope violation on this board.** A ticket to
write `scripts/context-io.ts` here means this chess CLI implements its own factory substrate: an
admission validator, a stamp grammar, a gate-verdict cross-check, a JSONL renderer, a claim registry
and a stale sweep. **There is no user, no pain and no value in the product for any of it.** My job is
to protect the MVP and say no to that. **I am saying no.**

**3. It is the same class as `H2`, which this board has already ruled belongs to a named human.** An
agent may not author the machinery that admits its own results, for the identical reason it may not
author the registry that clears its own gate. **Self-provisioned admission is worse than no
admission**, because no admission is at least visible.

**Owner: the human who owns the grugops install — Olger Oeselg — via the Orchestrator's escalation.**
Not the Orchestrator's own work, and not a board column. The gate hop recorded the owner as
"Orchestrator"; **the Orchestrator is the router here, not the fixer.**

## The one part that IS cheap, in-repo, and actionable today

**The waste is not the gap. The waste is that eight hops have each spent budget re-deriving it.**
Every one of them ran the same `find`, reached the same conclusion, and wrote the same disclosure
paragraph. That is a re-derivation tax paid eight times for a fact that has not changed since the
first hop.

**The fix for THAT is one line in `AGENTS.md`, and the `AGENTS.md` Scribe lane is running right
now.** Suggested content, for the Orchestrator to route — **I did not write it; `AGENTS.md` is not
mine at this hop**:

> **No `finding` is admissible on this install.** `scripts/context-io.ts`, `scripts/claim.js` and
> `mcp__grugops__propose_note` are absent from this repository and from the kit, and
> `context.human_admission` is `off`, so no `§14-gate#<id>` verdict can be emitted. Record results as
> `claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
> `agent-factory/contracts/context-note.md`, and take the queue claim by hand: `mkdir -p
> .grugops/queue/claimed` for the parent, then a **bare** `mkdir` (no `-p`) of the task directory —
> that bare `mkdir` is the atomic act. **Do not re-derive this; do not invent a stamp.**

**Two lines of `AGENTS.md` end an eight-hop tax. That is worth more than the ticket I did not
write.**

## What I did NOT rule

**Whether the kit SHOULD ship those files** is not mine — it is a product decision about grugops, not
about cli-chess. Recorded as `UNKNOWN - verify` and routed. And I did **not** create
`.grugops/test-skips.md`, `scripts/`, or any stub of either.
