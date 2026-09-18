# Runbook
_Updated: 2026-08-06 by Architect/Design (task `refinement-deploy-posture-2026-08-06`) — **first
fill**; this file was the shipped empty template until today. It is short because there is genuinely
almost nothing to operate, and every "none" below was measured against the repo rather than assumed._

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  How to operate, deploy, and roll back in production. Ships EMPTY — fill per-project during
  bootstrap. Production steps are safety-critical: a human confirms a deploy or rollback;
  agents never deploy to production unattended. Keep it short and exact.
-->

> **Read this first.** This project **deploys nowhere and runs locally** — present posture,
> explicitly revisitable, revisit trigger **`EPIC-006`** (packaging). The architecture fact is in
> `memory-bank/30-architecture.md` § "Deployment posture"; the why, the alternatives weighed and the
> falsifiers are in `memory-bank/50-decisions/ADR-0007`. **This file records only what is
> operationally true today** — it is deliberately not a plan for a deployment that does not exist.

## Operate

**There is nothing running to operate.** No service, no daemon, no scheduled job, no hosted
instance, no database. The product is a single-player terminal chess game in one local process, and
that process does not exist yet — only the rules core is built.

**The game cannot be run.** There is no CLI entry point: `package.json` has no `bin` and no `start`
script, and `src/` has no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify` for exactly
this reason, and it stays `UNKNOWN - verify` until `EPIC-006` builds one. **Do not invent a run
command here** — a fabricated command in a runbook is worse than an admitted gap.

What *can* be executed today is development and verification only: install, test, lint, typecheck,
build, and the perft harness. **Those commands live in `AGENTS.md` § Commands and are deliberately
not duplicated here** — that file is their single source, and every command in it was run before it
was recorded there.

Monitoring, alerting, log aggregation, dashboards, SLO burn-rate: **none exist**, and none is owed
while nothing runs anywhere but a terminal a developer opened.

## Deploy

**There is no deploy, and there is no deploy procedure to write down.**

Verified against the repository on 2026-08-06 rather than read off the config:

- No Dockerfile, compose file, chart, manifest or IaC — the repo contains **no YAML file at all**.
- No CI, so no CI deploy step: `.github/` holds one file (`copilot-instructions.md`) and there is no
  `.github/workflows/`.
- Nothing publishable: `package.json` is `private`, with no `main`, `exports` or `bin`; the build is
  `tsc --noEmit` and emits nothing.
- Nowhere to push: the repo has **no git remote**.
- Nothing released: `plans/releases/` holds only `.gitkeep`.

`.grugops/factory.config.json` now records this instead of implying a cluster: `default_stack.deploy`
is `none-local-only` and `environments` is `["local"]`.

**"local" is where the code runs, not a target anything is deployed to.** The source is run in
place; nothing is shipped to it, and there is no environment to promote *between*.

**Two things stay true anyway, and this file is not a licence to weaken either:**

- **`production_requires_human_confirmation` is `true`, and a human holds deploy.** It does not
  become obsolete because there is no production today — it is the rail for the day there is one.
- **Merge approval is not deploy approval.** The owner's standing merge directive of 2026-08-06
  (`memory-bank/60-progress.md`) says so in as many words: *"DEPLOY IS NOT INCLUDED."*

**How this project will eventually be distributed is UNDECIDED** — npm, a standalone binary, a
`git clone` — and that is `EPIC-006`'s question, not this file's. When `EPIC-006` answers it, this
section is the first place that has to change.

**[CHANGED 2026-09-19, as the sentence above said it would be.** The owner ruled: *"1. git clone +
npm start works for now"* (Olger Oeselg, in session, 2026-09-19). The channel is **`git clone` +
`npm install` + `npm run chess`** — the script is `chess`, there is no `start` script — recorded in
`memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md`, which supersedes
`ADR-0007` clause 5 only. Nothing is published, built or deployed; there is still no git remote, so
today the clone path is realised only on the author's machine. Everything else in this file stands.]**

## Roll back

**Nothing is deployed, so there is nothing to roll back.** No released artifact, no running instance,
no data store — therefore no state to restore, no migration to reverse, and no RTO/RPO to meet.

The only reversal available today is a **source** reversal: `git revert` on a `grugops/<task>`
branch with the gates re-run, per `AGENTS.md` § Branching model. That is ordinary development, not a
rollback procedure, and it must not be recorded here as one.

A real rollback procedure becomes owed the moment `EPIC-006` produces a distributed artifact: a
published version can be superseded or withdrawn, and that will need writing down in this section.

## On-call and escalation

**There is no on-call rotation and no pager, because nothing is running that could page anyone.**

Escalation here is a development-time concern, not an operational one, and it already has owners
recorded elsewhere:

- **The project owner (Olger Oeselg) holds deploy and the product decisions.** The *merge* keystroke
  is delegated standing and revocable since 2026-08-06; the authority behind it is still the
  owner's. Which decisions are delegated to which role, and which are not, is recorded in
  `memory-bank/60-progress.md` under its standing-directive sections — that file is the authority,
  this is a pointer.
- **A blocked work item** escalates after `blocked_escalation_days` (`2`) through `plans/board.md`'s
  Blocked column, not through this file.

`agent-factory/workflows/13-incident.md` exists and is untouched — it is the procedure for the day an
incident is possible. It cannot fire today: an incident needs something in service.
