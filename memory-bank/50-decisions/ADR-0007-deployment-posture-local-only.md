---
kind: adr
id: ADR-0007
---
# ADR-0007: This project deploys nowhere and runs locally — the posture, and what stays standing for the day it changes

## Status

**CLAUSE 5 SUPERSEDED 2026-09-19 by `ADR-0018` (`ADR-0018-distribution-channel-git-clone-npm-run-chess.md`) on the owner's word — the channel is `git clone` + `npm run chess`, "for now". Clauses 1–4 and 6 stand unamended; this file is otherwise byte-identical at that hop (`ABC-100` `A1`).**

**Pointer 2026-10-11** (`design-low-batch-2026-10-11`). How a gate reads `tools/grugops/host-protection.js`
exit 2 while `D3` holds is in `§ Pointers 2026-10-11` at the end of this file. No clause is amended.

**Note 2026-10-23** (`arch-adr0007-bin-note`, approved by the owner `…d3681daa`). The package has had a
`bin` since `ABC-168`. That fired the "exposes an executable" leg of `D2`. The posture did not move. See
`§ Note 2026-10-23` at the end of this file. No clause is amended.

**accepted** — 2026-08-06 by Architect/Design at task `refinement-deploy-posture-2026-08-06`
(subtask `architect-deploy-posture`), under the project owner's standing directive of 2026-08-03
recorded in `memory-bank/60-progress.md` under **"Standing directive — who decides"**, which retired
*"no agent may mark an ADR `accepted`"* and sends architecture decisions to the Architect. That
delegation carries a condition — an ADR ratified under it **must record what would falsify it** — and
the table at the end of this file is that record.

**AMENDED 2026-08-15 at task `owner-grants-2026-08-15`, subtask `design-adr0007-deploy-authority`,
Workflow 07 — ONE HALF-SENTENCE IN CLAUSE 4 IS STRUCK AND FALSIFIER `D7`'s TRIGGER IS WIDENED. THE
POSTURE IS UNCHANGED, AND IT WAS RE-CONFIRMED BY THE OWNER ON THE SAME DAY THIS FILE WAS AMENDED.**
Clauses 1, 2, 3, 5 and 6 are untouched, `default_stack.deploy` is still `none-local-only`,
`environments` is still `["local"]`, and **`production_requires_human_confirmation` is UNTOUCHED and
still reads `true`** — re-checked at this hop, not assumed.

The owner granted the agent deploy authority and denied the need for it in one sentence on
2026-08-15. **The authority is `memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED
and NOT NEEDED; merge, test and UAT are the agent's, per ticket. 2026-08-15", where the words are
quoted verbatim and all four grants are recorded separately. This file CITES that section and does
not restate it.** Two fragments identify it: *"I allow you to deploy"* and *"it is local for now
until completed"*.

**What moved is who holds the deploy key. Nothing about where anything runs moved** — the second
fragment says what the 2026-08-06 quote said, and adds the owner's own bound, *"until completed"*,
alongside the revisit trigger clause 1 already names. So this is not a reversal: it is one clause
going stale inside a document the owner has now confirmed twice.

**No ratification is manufactured and none is owed.** This amendment sets no target and no level and
accepts no new risk — the same distinction `ADR-0008` draws and `ADR-0011` re-asks at each amending
hop. It transcribes an authority the owner stated himself, and it neither extends nor narrows it.
Still `accepted`. **Zero production lines, zero test lines, zero config values, no ticket cut, no
board column moved.**

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
- **[DATED 2026-08-15 at `design-adr0007-deploy-authority` — every sentence in this bullet was TRUE
  when written. TWO have since been overtaken by the owner and ONE still stands. The strike marks the
  half that no longer holds; the amendment block at the end of this clause rules it.]** The deploy
  limit written into the branching-model directive — *"DEPLOY IS NOT INCLUDED"* — is **confirmed by
  this ADR, not modified.** *(That limit was **RETIRED** by the owner on 2026-08-15; this file
  confirmed it correctly for the nine days it stood.)* **Merge approval is still not deploy approval**
  — that half is unchanged and is the reason the sentence is not deleted outright, see the block —
  ~~a human holds deploy~~.

> ### **[AMENDED 2026-08-15 at task `owner-grants-2026-08-15`, subtask `design-adr0007-deploy-authority` (Workflow 07) — WHO HOLDS THE DEPLOY KEY HAS MOVED; WHAT CAN BE DEPLOYED HAS NOT. Bullet 3 is dated and half of it struck. Bullets 1 and 2 STAND, and the flag is UNTOUCHED.]**
>
> **This file was written when *"deploys nowhere"* and *"may not deploy"* were one sentence. They are
> two facts now, they fail for different reasons, and a reader in three months has to know which one
> stops him. Separating them is the whole of this block.**
>
> **Fact A — CAPABILITY. There is nothing to deploy and nowhere to deploy it.** Re-measured at this
> hop rather than inherited from 2026-08-06: `D1` zero deploy artifacts and still no YAML file of any
> kind, `D2` `private: true` with no `bin` / `main` / `exports` / `files`, `D3` no git remote, `D4`
> `plans/releases/` holds `.gitkeep` only. **UNCHANGED, and this is what stops you today.**
>
> **Fact B — PERMISSION. An agent may deploy.** Granted by the owner on 2026-08-15, dormant on
> arrival, revocable by one sentence. **This stopped you before 2026-08-15. It does not stop you
> now.**
>
> **The consequence that inverts the obvious reading of the grant.** Three things would stop an agent
> from a production deploy: **A** (nothing to deploy), **B** (no permission), and
> **`production_requires_human_confirmation`**. **B is gone. A is `EPIC-006`'s to remove by design —
> that is what packaging IS.** The flag is the only one of the three that is not scheduled to
> disappear. **Its apparent redundancy and its actual importance both went up on the same day**, and
> that is the argument for `D7` that this file could not make on 2026-08-06.
>
> **The flag was NOT moved here and bullet 1 is unchanged.** The owner did not name it; what would
> legitimately move it is ruled in the `D7` block under `## What would falsify this`. Bullet 1's
> forbidden inference gains a **second route** and loses nothing: reading `environments: ["local"]`
> and concluding the flag is obsolete was the route that existed in August 2026; reading *"the owner
> allowed deploy"* and concluding the same is the route that opened on 2026-08-15. **Same conclusion,
> different premise, same defect.**
>
> **Bullet 2 stands exactly as written and is deliberately not amended.** Those files ARE untouched.
> What is true today and was not on 2026-08-06 is that the never-deploy line carried in all 17 role
> adapters **contradicts the owner on this project** — and the adapters are GENERATED
> (`scripts/generate-role-adapters.js`), so hand-editing them is wrong and regeneration would restore
> the line anyway. **That is a precedence question, it is answered immediately below, and it is not a
> licence to edit a generated file.**
>
> **Precedence, unchanged in shape from the merge case.** The kit is shared, project-agnostic and
> read-only; it still says never deploy and cannot carry a project override. **On this project the
> owner's directive of 2026-08-15 wins.** Everything else in those kit files stands unchanged —
> including the human-confirmation requirement, which the owner did not touch.
>
> **What this amendment does NOT do.** It does not move the posture, `default_stack.deploy`,
> `environments`, `production_requires_human_confirmation`, clause 5's undecided distribution, any
> board column, any ticket or any traceability row. It writes **zero bytes under `src/`**. It is one
> block, not a new clause 7, because **adding a clause would imply this ADR decided something new
> about the posture. It did not — the owner did, and this file records it.**

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
  this ADR and `memory-bank/` win; everything else in those kit files — including ~~the never-deploy
  limit and~~ **[STRUCK 2026-08-15 at `design-adr0007-deploy-authority` — the owner's directive of
  2026-08-15 overrides the kit's never-deploy limit on this project, by the very precedence rule this
  sentence states. The RULE is unchanged and produced the right answer; one of the examples it listed
  is no longer an example of it. See clause 4's amendment block.]** the human-confirmation
  requirement — stands unchanged. This is the same precedence shape `AGENTS.md` already uses for the
  branching model.
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
| **D7** | **TRIGGER WIDENED 2026-08-15 — the CHECK and the VERDICT are unchanged; see the block below.** `production_requires_human_confirmation` is found set to `false`, deleted, or argued obsolete ~~on the strength of this ADR~~ **on the strength of ANY document, dial or grant — including the owner's deploy grant of 2026-08-15 — WITHOUT the owner having named the flag or the human-confirmation requirement itself** | `grep production_requires_human_confirmation .grugops/factory.config.json` → must read `true`. **At the amending hop: `true`.** If it does not, the row fires **unless** `grep -rn` over `memory-bank/` returns a **dated, attributed, verbatim owner quotation naming the flag or the confirmation requirement** — the absence of that quotation IS the firing condition. Clause 4 forbids the inference by both of its routes; this row is how a reader detects that it was drawn anyway |

> ### **[AMENDED 2026-08-15 at task `owner-grants-2026-08-15`, subtask `design-adr0007-deploy-authority` (Workflow 07) — `D7` SURVIVES. Its CHECK and its VERDICT are unchanged. Its TRIGGER named the only inference route that existed in 2026-08-06, and there are two now.]**
>
> **`D7` was tested for the first time on the day the authority moved, and it held.** The owner
> granted deploy on 2026-08-15 and **did not name this flag**. The Orchestrator recorded the grant
> and **deliberately did not flip the flag, citing `D7` by name**
> (`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED…", grant 1).
> Architect/Design re-checked at this amending hop: `grep` → **`true`**. Recorded because **a tripwire
> nobody has ever seen fire is not yet known to work**, and this one now is.
>
> **Why the trigger needed widening.** *"On the strength of this ADR"* names one route: read
> `environments: ["local"]`, conclude the flag is obsolete. A second route opened on 2026-08-15 —
> *"the owner allowed deploy, so the human-confirmation rail went with it"* — and that inference is
> **not drawn on the strength of this ADR**, so the row as written would not have caught it. The
> widened trigger is **source-agnostic**: what fires it is the flag moving without the owner naming
> it, whatever document is cited.
>
> #### What would LEGITIMATELY move the flag
>
> **Exactly one thing: the owner naming it.** Specifically — words that name
> `production_requires_human_confirmation` or the human-confirmation requirement **itself**, recorded
> **verbatim, dated and attributed** in `memory-bank/`, the way every owner directive in this project
> already is. That is checkable by a third party who trusts nothing in this file:
> `grep -rn production_requires_human_confirmation memory-bank/` returns an owner quotation, and
> `git log -S` on that quotation dates it and names the commit that introduced it
> (`context.audit_retention` is `git`).
>
> **What does NOT move it. Each of these is a live temptation, not a hypothetical:**
>
> 1. **The deploy grant of 2026-08-15.** It moves **who may act**. The flag governs **what is
>    required at the moment of acting**. A human can hand an agent the deploy key and still want to be
>    asked before production — those are orthogonal, and nothing in the owner's sentence speaks to the
>    moment of the act. **Read together the two are consistent, not contradictory:** the agent may
>    deploy; a production deploy asks a human; there is no production environment, so the pair has no
>    effect today.
> 2. **`environments: ["local"]`, or "there is no production".** The original forbidden inference,
>    unchanged and still forbidden.
> 3. **"It has zero present effect."** True — and it is an argument for leaving a **free** rail
>    standing, never for removing it.
> 4. **An agent's judgement that the owner would say yes if asked.** Asking is cheap; the flag is not
>    an obstacle to any work in flight, because nothing deploys.
> 5. **A kit default, a bootstrap re-run, or a config regeneration** restoring a default — the
>    *deleted* route this row has always covered.
>
> **The honest limit of that discriminator, stated rather than assumed away.**
> `context.human_admission` is `off` and no `human:<name>` stamp is emittable on this install, so
> **there is no mechanically un-forgeable owner signal here**. The verbatim-quote-in-`memory-bank`
> convention is the whole of it. Its strength is that it is **auditable** — a quotation is a string,
> and `git log -S` dates it and names the commit that added it — **not** that it cannot be forged. A
> reader who needs more than an audit trail must ask the owner directly.
>
> #### The recommendation, which is a recommendation and NOT an edit
>
> **Do not flip it.** Four reasons, in order of weight: the owner did not name it; it guards a
> different object than the grant moved (see 1 above); it has **zero present effect**, so flipping
> buys nothing today while disarming a rail before `EPIC-006` has designed the machinery it guards;
> and the kit's own reference calls it a must-stay flag. **If the owner wants it moved, one sentence
> naming the flag does it** — and that sentence is worth asking for explicitly, because with **B**
> retired and **A** scheduled for removal by `EPIC-006` (clause 4's block), this flag is the last of
> the three.
>
> **The counter-argument, recorded rather than suppressed:** a reader may say that leaving `true`
> standing after the owner granted deploy is an agent overriding an owner. **It is not.** `true` is
> the value the owner's own session left in place — the flag read `true` before, during and after his
> sentence, and he named deploy, merge, test and UAT without naming it. **Preserving a state is not
> overriding one**, and nothing is blocked by it today.
>
> #### Two decisions of restraint, so they are not read as oversights
>
> **No `D8` was added.** The permission half of the new fact is not falsifiable by measurement — it is
> granted and revoked by the owner's sentence — and the dormancy half is exactly `D1`–`D4`, all four
> of which were **re-run at this hop and all four hold**. Splitting the flag question across two rows
> would make it possible to satisfy one tripwire and miss the other. **One flag, one row.**
>
> **The gap `D7` does NOT close, named so nobody mistakes its reach.** It detects the flag being
> **changed**. It does not detect the flag being **ignored**. Nothing on this install parses
> `.grugops/factory.config.json` — there is no `scripts/` directory, `.claude/settings.json` enables a
> plugin and registers **no hook**, and no test asserts the value — so the flag is **prose honoured by
> roles, not an enforced control**. Its observable trace if ignored would be a release record (`D4`)
> or a deploy artifact (`D1`). **A rail with no instrument is exactly as strong as its prose, which is
> the strongest argument in this file against weakening the prose.**

## § Pointers 2026-10-11

Written by Architect/Design (task `wave-2026-09-25`, subtask `design-low-batch-2026-10-11`). **No clause
is amended.** Note `…647fad5d`.

**`host-protection.js` exit 2, while `D3` holds, means "could not run". It is neither a pass nor a
fault.**
- **The contract.** It is the tool's own header (`D-12`) and the kit's gate step 3. Exit 2 means
  `UNKNOWN - verify` on some branch, with none `unprotected`, or that the check could not run. *"Exit 2
  is never a pass."* The gate records `UNKNOWN - verify` with the printed reason. The check never
  changes the terminal result on its own.
- **Here.** `git remote -v` prints 0 lines (`D3`, re-read at this hop). There is no host to ask. Gates
  at `ABC-082`, `ABC-093`, `ABC-141` and `ABC-142` recorded exit 2 with *"gh returned no readable HTTP
  status"*.
- **Not a pass.** No note may say the host floor exists. There is no host. The merge floor in this
  posture is the human who merges (`_commit-convention.md` (c)).
- **Not a fault.** It is not a finding against the ticket. It uses no self-fix attempt and blocks
  nothing.
- **The one exception: exit 2 is a fault of the invocation** when the printed reason is a refused command
  line or a thrown error. Fix the command and re-run.
- **What a gate writes.** It keeps the kit's token and adds the posture qualifier:
  `host-protection.js: exit 2, UNKNOWN - verify (<reason as printed>). N/A in this posture: no git
  remote (ADR-0007 D3; git remote -v printed 0 lines at this run).`
- **Why the qualifier is added and does not replace the token** (BA/PM's recommendation `…d8990fbb` item
  5 was to write *"N/A — no git remote"* in place of `UNKNOWN`):
  - The kit's step 3 prescribes the token, and the kit is read-only.
  - The printed reason does not say "no remote". It says what a missing `gh` login also looks like. So
    "N/A" is true only when the same run checks `git remote -v` and finds it empty.
  - A bare "N/A", written from habit, would outlive the remote's arrival and hide a real `UNKNOWN`.
- **Revisit trigger: `D3` fires** (a remote is added, as under `EPIC-006`). From then on exit 2 is a real
  `UNKNOWN - verify` for a human to resolve. The tool cites the grugops checkout's git-host checklist
  (`install/README.md` §5, which is not in this repository). The qualifier is dropped.

## § Note 2026-10-23: a `bin` since ABC-168

Written by Architect/Design (subtask `arch-adr0007-bin-note`). The owner approved it in session on
2026-10-23 (note `…d3681daa`): *"approve the ADR note"*. This is a dated note on an accepted ADR. **No
clause is amended, no falsifier row is edited, and the posture is unchanged.** Notes `…0f003634`
(decision) and `…97e856c3` (observation) are in `.grugops/context/arch-adr0007-bin-note/`.

**The fact, read on `main` `2d962400`.**
- `package.json` has `"bin": { "skytalix": "dist/uci.js" }`. `jq -c '[.private, .bin, has("main"),
  has("exports"), has("files")]' package.json` prints `[true,{"skytalix":"dist/uci.js"},false,false,false]`.
- The `bin` arrived in `825b21d1` (`ABC-168`). It was merged to `main` at `513c0211` on 2026-10-22.
  `git log -G'"bin"' -- package.json` names only that commit, so the value has not changed since.
- The target is built, not tracked. `build` is `tsc -p tsconfig.build.json`, which emits `src/uci.ts`
  and its imports into `dist/`. `dist/` is git-ignored, and no file under it is tracked. `src/uci.ts`
  starts `#!/usr/bin/env node`.
- The design is `ADR-0044` D8, which the owner accepted on 2026-10-18. A separate backend spawns the
  engine. D8 says: *"This stays inside `ADR-0007` and `ADR-0018`. It is local and built from a clone,
  and nothing is published."*

**What it changes in this file.**
- **`D2`: the "exposes an executable" leg FIRED at `513c0211`. The "publishable" leg did not.**
  `"private": true` stands, and there is no `main`, `exports` or `files` key.
- Context row 3 (*"no `bin` … exposes nothing to run"*) and row 6 (*"the build emits nothing and no
  `dist/` exists"*) are readings from 2026-08-06. They are no longer true. They stay as written, as
  dated history. The same applies to the `D2` reading in clause 4's block (2026-08-15).
- **The posture in clause 1 holds. I re-read it at this hop:**
  - `D1`: 0 deploy artifacts and no YAML file. `.github/` holds only `copilot-instructions.md`.
  - `D3`: `git remote -v` prints 0 lines.
  - `D4`: `plans/releases/` holds only `.gitkeep`.
  - `default_stack.deploy` is `none-local-only` and `environments` is `["local"]`.
  - `D7`: `production_requires_human_confirmation` is `true`.
- The `bin` runs on the machine that cloned and built the repository. Nothing is published, and
  nothing is deployed.

**Why this is a note and not a new ADR.** A `bin` is a local executable. It is not a distribution
channel and it is not a deploy. The publishable leg of `D2`, together with `D1`, `D3` and `D4`, would
move the posture, and none of them fired. The owner ruled "not a reversal; no posture change"
(`…d3681daa`).

**How to read `D2` from now on.** The row is not edited. Check it against this note's reading,
`[true,{"skytalix":"dist/uci.js"},false,false,false]`. Any other value fires `D2` again: a changed or
second `bin`, a `main`, `exports` or `files` key, or `"private"` removed. AR-1's check 3 reads the same
line (Release Manager `…edd18e94`).

**Other triggers on the same ground, owned elsewhere (cited, not restated).**
- `ADR-0044` D8's revisit trigger: `npm publish`, a `files` allow-list, or packaging `dist/` for third
  parties. That needs a superseding ADR under `D5`, not a note.
- `AR-168-BINPIN` (Security/NFR `…75a45be0`): any edit to the `bin`.
- There is no `files` list, so a pack would carry the whole repository (Security/NFR `…7d7b76ec` § 6,
  INFO; the owner is the Orchestrator).

**Not edited here; follow-ups for the Orchestrator.** `ADR-0018` carries the same `D2` row under the same
id. It also has the same out-of-date wording: Context row 2 says "no `bin`", and Decision 1 says "no
`dist/` is emitted, no `bin` is added". `70-runbook.md` says "Nothing is published, built or deployed",
and "built" is no longer true. The owner's approval covers only this file.
