---
id: 20260806T212500Z-architect-design-decision-40352dd5
kind: decision
by: architect-design
at: 2026-08-06T21:25:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - architect-deploy-posture
  - 20260806T210000Z-orchestrator-decision-3d1f97a2
  - .grugops/factory.config.json
  - memory-bank/30-architecture.md
  - memory-bank/70-runbook.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - EPIC-006
supersedes: 
---

# RULED: this project deploys nowhere and runs locally. Both config keys CAN carry it and both were set. `ADR-0007` is accepted.

## The ruling

The deployment posture is an **as-built architecture fact**: **nothing is deployed, nothing is
published, nothing is released, and the only place the software runs is a developer's local
machine.** It is **present posture, explicitly revisitable**, and the revisit trigger is named:
**`EPIC-006` (packaging)**.

**The owner stated the posture; this role did not decide it, and the two are kept apart.** What was
actually decided here — the part that is an architecture call and that a later reader may disagree
with — is three things: that the posture binds as an architecture fact rather than a chat aside;
**which dials carry it and with what values**; and **what is preserved unchanged** so that "we deploy
nowhere today" can never be read as "we have decided never to deploy".

## The config keys — verified against the contract FIRST, then set

The orchestrator's decision note said the verification was owed and not assumed. It was performed
before either edit, against the kit's own `agent-factory/config/factory.config.md`:

| key | contract as documented | verdict | value |
|---|---|---|---|
| `default_stack.deploy` | sub-field of `default_stack` (*"Default technology stack the factory **recommends for new work**"*); the sub-field table lists a default only — **no allowed-value set** | **free-form string; it CAN honestly carry this** | `"kubernetes-ready"` → **`"none-local-only"`** |
| `environments` | *"array of strings"*, *"Deployment environments the factory recognizes"* — **no allowed-value set** | **free-form array; it CAN honestly carry this** | `["dev","staging","prod"]` → **`["local"]`** |

**Neither key is a fake dial.** Both are *read*: `environments` by
`agent-factory/workflows/12-release.md` and `13-incident.md`, `default_stack` by
`00-bootstrap-greenfield.md`. And **nothing parses them** — this install has no `scripts/` directory
at all, so roles read these values as prose and no value shape can break a consumer. So the
branching-model finding of earlier today does **not** transfer, and the opposite finding holds here:
leave these two and the first file every role opens keeps recommending Kubernetes for a
zero-dependency terminal program.

**The edited file still parses** (`node -e "require('./.grugops/factory.config.json')"` → OK) and the
diff is **exactly two lines**.

### Why `environments: ["local"]` and NOT `[]` — the closest call, surfaced rather than picked silently

`[]` is the more literal reading of *"does not deploy anywhere"* and was seriously considered.
**Rejected on two grounds.** (1) An empty array sits one careless step from **absence**, and the
kit's own zero-config rule reads an *absent* key as its lean default `["dev","staging","prod"]` — a
value whose most likely accidental "repair" restores the exact claim this task removes is a bad
value. (2) `[]` drops half the instruction: the owner said both *"does not deploy anywhere"* **and**
*"it will be used locally"*; `["local"]` carries both.

**The honest cost of `["local"]`, recorded rather than hidden:** nothing is *deployed* to "local" —
the source is run in place — so calling it a *deployment environment* stretches the reference's
wording slightly. It is accepted because the value is read as prose, a single-element array implies
no promotion path, and the competing failure (silently reverting to three fictional environments) is
worse. **This trade-off has its own falsifier row (`D6`) in `ADR-0007`**, so if a role is ever seen
treating `"local"` as a deploy destination, clause 3 is re-openable and `[]` becomes the better value.

Also rejected: **deleting `environments`** (worst option — default-on-absent reinstates the lie), and
**inventing a new key** such as `deployment: "none"` (the fake-dial failure the branching-model entry
recorded in writing earlier the same day).

## What was deliberately NOT changed, and why

- **`production_requires_human_confirmation` is still `true`** — re-read after the edit to confirm.
  Its justification never depended on a production environment existing: *"we have no production" is
  a fact about today, and the flag is the rail for the day that changes.* **`ADR-0007` clause 4
  explicitly forbids the inference "`environments` has no `prod`, therefore this flag is dead
  config", and falsifier `D7` is the tripwire that detects the inference being drawn anyway.**
- **The `nfr` block was not touched** (`availability: "99.9%"` still stands). It is **Security/NFR's**
  on the next hop under the owner's 2026-08-03 directive. `ADR-0007` names it explicitly so that no
  reader treats this ADR as having ratified an availability SLO on something that is never up.
- **`AGENTS.md`, `plans/nfr-catalog.md` and `plans/board.md` were not touched.** Not mine.
- **Nothing under `plans/releases/`, no board column, no workflow and no never-deploy role limit was
  removed.** The never-deploy limit is carried in all 17 role adapters under `.claude/agents/`; none
  was edited. The kit is read-only regardless — this is recorded as intent, not merely compliance.
- **The distribution mechanism was NOT decided.** npm / binary / `git clone` all remain open;
  `ADR-0007` clause 5 records "undecided" as the correct answer and routes the question to
  `EPIC-006`. No slot was filled with an invention.

## `ADR-0007` is warranted, and it is `accepted`

Written and ratified to `accepted` by this role under the owner's **standing directive of
2026-08-03** (`memory-bank/60-progress.md` § "Standing directive — who decides"), which sends
architecture decisions to the Architect. That delegation's condition is honoured: **the ADR carries a
seven-row falsifier table**, each row checkable without trusting the file.

**Why an ADR here when the branching model got a `60-progress.md` section instead** — the difference
is the dial. The branching model had **no expressible dial**, so prose was the only home for the
fact. Here the dials exist and are now **set**, so the record owed is *"why is that dial set that
way"* — an ADR's job. Reinforcing it: **`.grugops/factory.config.json` is strict JSON and cannot
carry a comment**, so the two terse slugs (`none-local-only`, `["local"]`) have no way to distinguish
a deliberate ruling from an unfilled bootstrap default without a file to point at; and
`30-architecture.md`'s own FORMAT comment instructs that the *why* of a structural choice goes in an
ADR, not in that file. **The counter-argument (this is a no-code governance ruling and the project
has a precedent for putting those in `60-progress.md`) is recorded inside the ADR's Status section
with its cheap remedy, not suppressed.**

## Degraded substrate — recorded, not glossed

This install has **no `scripts/claim.js` and no `scripts/context-io.ts`** (confirmed: there is no
`scripts/` directory at all). Workflow 17 step 2's atomic `claimTask` could not execute and Workflow
16's sanctioned writer does not exist. The subtask was moved
`pending/` → `claimed/architect-deploy-posture/` → `done/` **by hand** (`mkdir` + `mv`), the
`claim.md` registry record was hand-written, and this note and its siblings were hand-authored into
`notes/` in the schema's exact shape. **`finding` was not used** — there is no §14 gate on this task
to issue a stamp — and **nothing was self-stamped**: `verified_by` is empty on every note published
here, which is what the schema permits for `decision` / `observation` / `artifact-ref`.

## Handed to the next hop

Both hop-2 agents read only these notes; nothing is relayed.

- **Security/NFR** (`security-nfr-availability-bar`): the posture above is the input to your call on
  `nfr.availability`. The verified evidence is in the sibling `observation` note — in particular
  **nothing is ever "up"**, so there is no measurable availability today. The `nfr` block is
  untouched and entirely yours; `ADR-0007` deliberately does not rule it.
- **AGENTS.md Scribe** (`agents-md-deployment-section`): the posture, its revisit trigger and the
  preserved rails above are what your deployment section records. **One thing worth carrying:
  `AGENTS.md` already has a `## Safety rules` bullet — *"Never deploy.
  `production_requires_human_confirmation` is `true`…"* — which this ruling confirms rather than
  changes.** There is also a **precedence** point that mirrors the one `AGENTS.md` already makes for
  the branching model: the read-only kit still hardcodes a `dev → staging → prod` path in
  `agent-factory/workflows/12-release.md` step 3 and in `agent-factory/roles/release-manager.md`'s
  release-record template, and it cannot carry a project override — see the sibling `observation`
  note on residual gaps. **Do not restate `ADR-0007`; point at it.**
