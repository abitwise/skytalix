---
kind: adr
id: ADR-0007
---
# ADR-0007: This project deploys nowhere and runs locally — the posture, and what stays standing for the day it changes

## Status

**accepted** — 2026-08-06 by Architect/Design at task `refinement-deploy-posture-2026-08-06`
(subtask `architect-deploy-posture`), under the project owner's standing directive of 2026-08-03
recorded in `memory-bank/60-progress.md` under **"Standing directive — who decides"**, which retired
*"no agent may mark an ADR `accepted`"* and sends architecture decisions to the Architect. That
delegation carries a condition — an ADR ratified under it **must record what would falsify it** — and
the table at the end of this file is that record.

**What the owner stated and what this role decided are different things, and are kept apart.**
Project owner Olger Oeselg, 2026-08-06, verbatim:

> *"this project currently does not deploy anywhere, mark that as well, it will be used locally for
> now."*

The **posture** is the owner's statement of fact and is not this role's to decide. What this ADR
decides is narrower and is genuinely an architecture call: that the posture is an **as-built
architecture fact** rather than a chat aside, **which dials carry it and with what values**, and
**what is preserved unchanged** so that recording "we deploy nowhere today" cannot be read later as
"we have decided never to deploy".

**No code changes because of this ADR.** Two config values and three memory-bank files move; `src/`
is untouched, no ticket is cut, and no board column moves.

### Why this is an ADR and not another `60-progress.md` section

Stated so the judgment can be disagreed with rather than inherited. The branching-model directive of
**earlier the same day** took the other route — a standing-directive section in `60-progress.md`, no
ADR — and a reader is owed the reason these two look different.

- **The branching model had no expressible dial.** `autonomy` allows only `diff`/`branch`/`pr` and
  no value means "agents may merge", so prose was the *only* place that fact could live. **Here the
  dials exist, are documented as free-form, and are now set.** That inverts the problem: the record
  now owed is not *"where does this fact live"* but *"why is that dial set that way"*, which is
  exactly an ADR's job.
- **`.grugops/factory.config.json` is strict JSON and cannot carry a comment.** The two values
  written are terse slugs (`none-local-only`, `["local"]`). Without a file to point at, a later
  reader cannot tell a deliberate ruling from an unfilled bootstrap default — and their most likely
  repair is to restore the kit defaults, undoing this. That is precisely the *"a future maintainer
  will curse you if the why is missing"* test in the Architect's role file.
- **`memory-bank/30-architecture.md`'s own FORMAT comment instructs it**: *"Record the why of a
  structural choice as an ADR in 50-decisions/, not here."* The architecture file gets the fact; this
  file gets the why.

**The honest counter-argument, recorded rather than suppressed:** this is a governance/posture
ruling that changes no code, and this project already has a precedent for putting those in
`60-progress.md` rather than an ADR (the branching model, and BA/PM's FIDE 9.6.1 ruling of
2026-08-02). A reader who calls this gold-plating against the *"keep design just enough"* limit has a
fair case and a cheap remedy: delete this file and keep the decision note under
`.grugops/context/refinement-deploy-posture-2026-08-06/notes/` plus the paragraph in
`30-architecture.md`. Nothing else depends on it.

## Context

The repo did not read as a local-only project. It read as an **undeployed service**: three values in
the first file every role opens all implied Kubernetes, `AGENTS.md` had no deployment section, and
`memory-bank/70-runbook.md` — whose stated purpose is *"how to operate, deploy, and roll back in
production"* — was still the shipped empty template. A reader asking "how do I deploy this" found an
empty template and three config values pointing at a cluster.

### What was checked, and how — measured at this hop, not asserted from the config

Every claim below was verified against the repository on 2026-08-06 before any file was edited.

| # | Checked | Method | Result |
|---|---|---|---|
| 1 | container / orchestration / IaC artifacts | filesystem `find` for `Dockerfile*`, `*.dockerfile`, `docker-compose*`, `Chart.yaml`, `*.tf`, `Procfile`, `fly.toml`, `*.yml`, `*.yaml`, excluding `node_modules/`, `.git/`, `coverage/`; plus `git ls-files` over tracked files | **zero matches.** This repository contains **no YAML file of any kind** — so no manifest, no chart, no compose file, and no CI workflow |
| 2 | CI, and therefore any CI deploy step | `ls -a .github` | one file, `copilot-instructions.md`. There is **no `.github/workflows/`** — no CI exists at all |
| 3 | publishability and executable surface | `package.json` | `"private": true`; **no `main`, no `exports`, no `bin`**, no `start` script, no publish script. It cannot be published and exposes nothing to run |
| 4 | anywhere to push to | `git remote -v` | **empty.** No remote exists on this repo |
| 5 | release records | `ls plans/releases/` | `.gitkeep` only — **zero** release records. The machinery is present and empty |
| 6 | build output | `npm run build` is `tsc --noEmit`; `ls -d dist` | the build **emits nothing** and no `dist/` exists |
| 7 | entry point | `ls src/` | no `index.ts`, `main.ts` or `cli.ts`. `perft-bench.ts` is the only module that prints, and it is a verification harness, not the game |

**So all three values the Orchestrator named were claims with no artifact behind them**, and the
absence is uniform rather than partial: there is not one deploy-shaped file in this repository.

### The key contracts, verified before editing

Read from the kit's own reference, `agent-factory/config/factory.config.md`, at this hop:

- **`default_stack.deploy`** — a sub-field of `default_stack`, which the reference defines as *"Default
  technology stack the factory **recommends for new work**"*. The sub-field table lists only a
  default (`kubernetes-ready`); **no allowed-value set constrains it.** A free-form string.
- **`environments`** — *"array of strings"*, default `["dev","staging","prod"]`, meaning *"Deployment
  environments the factory recognizes."* **No allowed-value set constrains it.** A free-form array.
- **Who reads them.** `environments` is read by `agent-factory/workflows/12-release.md` and
  `agent-factory/workflows/13-incident.md`; `default_stack` by
  `agent-factory/workflows/00-bootstrap-greenfield.md`. This install has no `scripts/` directory —
  nothing *parses* these values; roles read them as prose. **They are read, so they are not dead
  config; nothing parses them, so no value shape can break a consumer.**

**Both keys can therefore honestly carry this fact**, which is the opposite finding from the
branching-model case and is why the config was edited here and deliberately was not there.

## Decision

**1. The deployment posture is an as-built architecture fact: this project deploys nowhere and runs
locally.** It is **present posture, explicitly revisitable** — the owner's *"currently"* and *"for
now"* are honoured as written, not rounded up into "never". **The revisit trigger is named rather
than left to memory: `EPIC-006` (packaging)**, the first work here that produces an artifact someone
other than its author could run.

**2. `default_stack.deploy` is `"none-local-only"`** (was `"kubernetes-ready"`). Read as: for new
work in this repo, the recommended deploy approach is *none* — it runs locally.

**3. `environments` is `["local"]`** (was `["dev","staging","prod"]`). One entry, naming the only
place the software runs. **Not `[]`** — see Alternatives; the empty array was considered and
rejected for a specific reason.

**4. Nothing that exists to serve a future deploy is removed, and the absence of a `prod` entry is
NOT an argument that any of it is dead.** Explicitly and permanently:

- **`production_requires_human_confirmation` stays `true`.** The kit's reference calls it a must-stay
  flag, and its justification never depended on a production environment existing: *"we have no
  production" is a fact about today, and the flag is a rail for the day that changes.* A rail costs
  nothing while unused. **Anyone who reads `environments: ["local"]` and concludes this flag is now
  obsolete has drawn exactly the inference this clause forbids.**
- **`plans/releases/`, the `Ready to Release` board column, `agent-factory/workflows/12-release.md`,
  `agent-factory/workflows/13-incident.md`, and the never-deploy hard limit carried in all 17 role
  adapters are untouched.** (The kit is read-only regardless; this clause states intent, not just
  compliance.)
- The deploy limit written into the branching-model directive — *"DEPLOY IS NOT INCLUDED"* — is
  **confirmed by this ADR, not modified.** Merge approval is still not deploy approval; a human holds
  deploy.

**5. How the CLI will eventually be distributed is UNDECIDED, and this ADR does not decide it.** npm,
a standalone binary, a `git clone` and `npm start` — all open. That is `EPIC-006`'s question.
**Recording "undecided" is the correct answer today; inventing one to fill a slot is not.**

**6. Scope bound.** This ADR rules the deploy posture and the two config keys in clauses 2 and 3. It
does **not** rule `nfr.availability`, `AGENTS.md`, `plans/nfr-catalog.md`, or the remaining
`default_stack` keys — see Consequences, where the ones that are still wrong are named rather than
silently ratified.

## Alternatives

**`environments: []` — the most literal reading, and the closest call here.** "Deploys nowhere" maps
term-for-term onto zero environments. **Rejected on two grounds.** First, an empty array is one
careless step from absence, and the kit's own zero-config rule reads an **absent** key as its lean
default — `["dev","staging","prod"]`. A value whose most likely accidental repair restores the exact
claim this ADR removes is a bad value. Second, `[]` drops half the instruction: the owner said both
*"does not deploy anywhere"* **and** *"it will be used locally"*, and `["local"]` carries both while
`[]` carries only the first. **The honest cost of `["local"]`, recorded rather than hidden:** nothing
is *deployed* to "local" — the source is run in place — so calling it a *deployment environment*
stretches the reference's wording. It is accepted because the value is read by agents as prose rather
than parsed, a single-element array implies no promotion path, and the alternative failure (silently
reverting to three fictional environments) is worse than the imprecision. Falsifier **D6** is this
trade-off's tripwire.

**Delete the `environments` key entirely.** Rejected, and it is the worst option: the documented
default-on-absent rule would read the deletion back as `["dev","staging","prod"]`. Removing the fact
would reinstate the lie.

**Invent a new key — `deployment: "none"`, `local_only: true`, or similar.** Rejected as the
**fake-dial failure this project recorded in writing earlier the same day**: a control placed in the
first file every role opens that nothing reads and nothing enforces. The branching-model entry
declined to invent `branching_model` for exactly this reason, and that lesson holds here even though
its conclusion (leave the config alone) does not.

**Leave the config untouched and record the posture only in prose — the branching-model shape.**
Rejected because the premise does not transfer. There, no dial could express the fact; here two
documented free-form dials can, and both are read by live workflows. Leaving them would mean the
first file every role opens keeps recommending Kubernetes for a zero-dependency terminal program,
with the correction buried in a memory-bank file the reader may never reach.

**Say nothing; let the empty runbook and the defaults stand.** Rejected on evidence: the state this
ADR is fixing *is* the status quo, and it actively misleads — three Kubernetes-shaped values and an
empty "how to deploy" template, backed by not one deploy artifact in the repository.

## Consequences

- **The config now agrees with the repository on the two keys named.** A role reading
  `.grugops/factory.config.json` first — as every role does — no longer starts from a cluster.
- **`nfr.availability: "99.9%"` is still an availability SLO on something that is never up.** It is
  **not fixed here**: NFR bars are Security/NFR's under the owner's 2026-08-03 directive, and that
  role runs on the next hop. **Named so that no reader treats this ADR as having ratified it.**
- **`default_stack.container` is still `"docker"` and there is no Dockerfile** — the same class of
  untrue claim this task exists to remove, and **it was not in the Orchestrator's list of three.**
  It is **flagged, not fixed**, because this subtask's ownership is `deploy` and `environments` only.
  More broadly, **five of the seven `default_stack` keys describe a stack this project does not use**
  (`backend: node-fastify`, `frontend: vue`, `db: postgresql`, `e2e: playwright`, `container:
  docker`) — verified against a repo with **zero runtime dependencies**, no server, no UI, no
  database and no Playwright. That is a separate decision for the owner or a later Architect hop; it
  is recorded here so it is not lost, and deliberately not taken.
- **One residual disagreement with the read-only kit, stated so nobody has to guess precedence.**
  `agent-factory/workflows/12-release.md` step 3 hardcodes *"the `dev -> staging -> prod` path"* and
  `agent-factory/roles/release-manager.md` hardcodes an *"environments path `dev → staging → prod`"*
  in its release-record template. **The kit is shared, project-agnostic and read-only; it cannot
  carry a project override.** On this project's deployment posture, `.grugops/factory.config.json`,
  this ADR and `memory-bank/` win; everything else in those kit files — including the never-deploy
  limit and the human-confirmation requirement — stands unchanged. This is the same precedence shape
  `AGENTS.md` already uses for the branching model.
- **`memory-bank/70-runbook.md` stops being an empty template** and says honestly that there is
  nothing to operate, deploy or roll back, with the dev/test commands left where they already live
  (`AGENTS.md § Commands`) rather than duplicated.
- **`EPIC-006` inherits two things**: it is the named revisit trigger for this posture, and it owns
  the undecided distribution question from clause 5. It already carries the deferred-UAT checkpoint
  and the merge-checkpoint revisit; this joins that list rather than starting a new one.
- **Nothing about the gate, the branch guard, or the merge directive changes.** `autonomy` stays
  `pr`, `quality.gate_enforcement` stays `blocking`, work still happens on a `grugops/<task>` branch.

## Rollback

**Free, and it stays free.** Reversing this decision is two string edits in
`.grugops/factory.config.json` plus reverting three markdown files — one `git revert` of a single
commit. Nothing is generated from these keys, no code reads them (this install has no `scripts/`
directory at all; the factory is prompt-driven), no test asserts them, and no artifact was built or
deleted on the strength of the decision.

It never gets dearer, because the thing that would ordinarily make a posture decision expensive to
unwind — infrastructure created under it — does not exist and is not created by it. The one moment it
changes character is when `EPIC-006` picks a distribution mechanism: at that point this ADR is
**superseded** by the ADR that records the choice, not reverted.

## What would falsify this

*(Ratifying carries owning. Each is checkable without trusting this file.)*

| # | what would falsify it | how to check |
|---|---|---|
| **D1** | **the direct one** — any deploy artifact exists in this repo (Dockerfile, compose file, chart, manifest, IaC, or a CI deploy step) | re-run the scan in Context row 1: `find` for `Dockerfile*` / `docker-compose*` / `Chart.yaml` / `*.tf` / `Procfile` / `fly.toml` / `*.yml` / `*.yaml`, excluding `node_modules`, and `ls -a .github`. **At this hop: zero matches, and the repo contains no YAML file of any kind.** One appearing means the posture moved without this file moving |
| **D2** | the package becomes publishable or exposes an executable | `package.json` gains `bin`, `main` or `exports`, or loses `"private": true`. **At this hop: private, and none of the three present** |
| **D3** | there is somewhere to push to | `git remote -v`. **At this hop: empty** |
| **D4** | a release is actually cut | a `REL-xxxx.md` appears in `plans/releases/`. **At this hop: `.gitkeep` only** |
| **D5** | the owner revises the posture, or `EPIC-006` selects a distribution mechanism | the named revisit trigger firing. Handled by a **superseding** ADR, not a revert — clause 1 says "currently", so this is expected evolution, not a defect |
| **D6** | **the sharp one** — `environments: ["local"]` misleads a role into treating "local" as a deploy **target** to promote to, which is exactly the imprecision accepted in Alternatives | any role's published note or release record that reads `["local"]` as a destination. The mitigation is clause 3 plus `memory-bank/70-runbook.md § Deploy`, which both state that nothing is deployed anywhere. If it happens anyway, `[]` becomes the better value and clause 3 is re-openable |
| **D7** | `production_requires_human_confirmation` is found set to `false`, deleted, or argued obsolete on the strength of this ADR | `grep production_requires_human_confirmation .grugops/factory.config.json` → must read `true`. Clause 4 forbids the inference; this row is how a reader detects that it was drawn anyway |
