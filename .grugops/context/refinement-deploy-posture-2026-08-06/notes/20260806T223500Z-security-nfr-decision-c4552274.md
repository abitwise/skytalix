---
id: 20260806T223500Z-security-nfr-decision-c4552274
kind: decision
by: security-nfr
at: 2026-08-06T22:35:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - security-nfr-availability-bar
  - 20260806T210000Z-orchestrator-decision-3d1f97a2
  - 20260806T212500Z-architect-design-decision-40352dd5
  - .grugops/factory.config.json
  - plans/nfr-catalog.md
  - agent-factory/config/factory.config.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - EPIC-006
supersedes: 
---

# RULED: `99.9%` availability is NOT a bar on this project. The key CAN carry that and was set. Nothing was deleted, no target moved.

## The ruling

**`nfr.availability: "99.9%"` was not a bar that is currently being missed — it is a bar that could
never have been failed, which means it was never a bar.** It is now
`"not-applicable-local-only (nothing is ever up; ruling in plans/nfr-catalog.md)"`.

**The owner stated the posture; this role did not decide it, and the two are kept apart.** What was
actually decided here — the part a later reader may disagree with — is four things: that an
availability SLO has **no referent** in this project rather than merely no measurement; **what the
honest value is** and why that value rather than a neighbour; **that the bar is parked with an owner
and a trigger rather than deleted**; and **what was deliberately left alone** so that "no availability
bar today" can never be read as "this project has ruled out ever having one".

Taken under the owner's **standing directive of 2026-08-03** (`memory-bank/60-progress.md`
§ "Standing directive — who decides"), which sends **risk, security and NFR bars** to this role. Not
the Architect's call and not the Orchestrator's — `ADR-0007` clause 6 explicitly declines to rule it.

## Why an availability SLO has no referent here

An availability SLO says **a service is reachable over a measurement window**. It needs three things,
and this project has none. Each was checked here, not inherited from the previous hop (the evidence
table is in the sibling `observation` note):

1. **Something that is "up" between uses.** `package.json` is `"private": true` with **no `bin`, no
   `main`, no `exports`, no `start`**; `src/` is ten modules with **no entry point**; nothing listens,
   serves, opens a socket, sets a timer or installs a signal handler.
2. **An observer that could find it unreachable.** No git remote, no CI, zero release records.
3. **A window and a denominator.** *99.9% of what, over what period, missed by whom* has no answer,
   and **none was invented.**

**"Not measurable" is a stronger statement than "not measured", and this project keeps them apart.**
`UNKNOWN - verify` elsewhere in `plans/nfr-catalog.md` means the quantity exists and nobody has run
the instrument yet. Here there is **no quantity and no instrument that could fail the bar**. That file
has recorded **seven instrument-limit corrections**, each refusing a number its instrument could not
resolve; the same standard applied to a bar with *no instrument at all* retires the bar.

**One more fact that settles it independently of any argument: the bar was never in the catalog.**
Before today the word "availability" appeared in `plans/nfr-catalog.md` exactly once, in the FORMAT
comment's list of *categories to consider*. Every other number this project holds itself to has a row
with a denominator, a position and a machine. `99.9%` had none and lived in exactly one place. **It is
an unadopted bootstrap default, not a commitment this project made.**

## The key's contract — verified BEFORE the edit, as the Orchestrator required

| key | contract in `agent-factory/config/factory.config.md` | verdict |
|---|---|---|
| `nfr.availability` | `nfr` sub-field table: default `99.9%`, meaning *"Availability target."* — **no allowed-value set**; **not** one of the nine keys in the "Config-dial contract" table | **free-form string; it CAN honestly carry this ruling** |

**It is not a fake dial and it is not a parsed one.** Grepping the whole kit for `availability` finds
the config reference, the seed catalog's category list, and three ASVS checklist rows — `V15.1.3`,
`V15.2.2` (**L2**) and `V16.5.4` (**L3**). This project runs `security.asvs_level: L1`, whose
cumulative filter admits **zero** availability requirements, so **no workflow, role or checklist reads
this key by name**; and nothing parses it, because this install has no `scripts/` directory. The file
re-parses after the edit and **the diff is exactly one line**.

## Why this value and not a neighbour — surfaced rather than picked silently

- **Deleting the key — REJECTED, and it is the worst option.** The kit's zero-config rule reads a
  documented default on absence, so a deleted `availability` reads as `99.9%` again: the deletion
  **silently restores the claim it was meant to remove**. Identical trap to the one the Architect
  recorded for `environments` one hop earlier, and independently forbidden by this task.
- **`""`** — one careless step from absence, same trap.
- **`"UNKNOWN - verify"`** — false, and it would corrupt a marker this project uses precisely.
- **`"0%"`** — a different untrue claim.
- **A bare `"n/a"`** — drops the *why* and the trigger. `.grugops/factory.config.json` is strict JSON
  and **cannot carry a comment**, so a terse slug alone cannot distinguish a deliberate ruling from an
  unfilled bootstrap default; the Architect needed a whole ADR to solve that for their two keys. This
  role owns `plans/nfr-catalog.md`, which is the natural home, so **the value carries a pointer to
  it**. The leading token still reads as a slug (`not-applicable-local-only`, mirroring
  `deploy: "none-local-only"`), so a scanner that reads only the first word gets the right answer.
- **A new `NFR-008` row — REJECTED.** The catalog's FORMAT rule is *"keep targets few and real"*,
  `plans/traceability.md`'s ID scheme reserves `NFR-xxx` for non-functional **requirements**, and a
  row whose Target column reads "no target" is a contradiction a later reader will try to measure.
  **The cost of being wrong here is one row: promoting the new section into `NFR-008` loses nothing,
  because nothing was deleted.**

## The bar is PARKED, not destroyed — owner and trigger

- **Owner: Security/NFR.**
- **Trigger is a named CONDITION, not a milestone:** the first time this project ships something that
  must be reachable **while its user is not at the keyboard** — a hosted opponent, a server, a daemon,
  a network service. **Nothing in `EPIC-001`–`EPIC-006` does that.**
- **The product has already ruled the condition out, which is stronger than this role's reading:**
  `EPIC-006`'s `## Out of scope` names *"Network or multiplayer play — **permanent non-goal**"* and
  *"Accounts, cloud sync, ratings, or a stored game history database"*. That is BA/PM's ruling, cited
  and not re-decided; **if it is ever reversed, the reversal is the trigger.**
- **Checkpoint: `EPIC-006`**, where distribution is settled.
- **A caution recorded with it:** for a published CLI, "availability" is the **registry's** SLO, not
  this project's. Do not adopt someone else's SLO as a bar this project can be failed on.

## What was deliberately NOT done

- **`production_requires_human_confirmation` is still `true`** — re-read after the edit. Not this
  role's, and its justification never depended on a production environment existing.
- **No NFR row was deleted, no risk was closed, no release machinery was touched.** `plans/releases/`,
  the board columns and the workflows are untouched; `plans/board.md` was not opened for writing.
- **`NFR-001`–`NFR-007` are byte-identical.** No measured figure, denominator, `UNKNOWN - verify`
  marker or instrument-limit correction was reflowed, re-formatted or re-opened. **`NFR-005` and every
  performance bar were left closed** — explicitly out of scope for this subtask. The diff to
  `plans/nfr-catalog.md` is **two hunks: the `_Updated:` line and a pure append at the end of file**;
  the prior header text was verified to survive **verbatim** after the word "Previously".
- **`AGENTS.md` was not opened for writing** — the Scribe is running beside this subtask and owns it.
  Read-only check performed: `AGENTS.md` does not restate the availability bar anywhere, so nothing is
  owed to that hop from this one.
- **`default_stack`, `environments`, `memory-bank/**` and the ADRs were read, not rewritten** — the
  Architect's from the previous hop.
- **The distribution mechanism was NOT decided**, and **`NFR-007` was not rewritten** even though
  checking it surfaced a real disagreement (see the sibling `observation` note).

## Result

**`PASS_WITH_RISKS` in this role's vocabulary** — result PASS, **no required fix outstanding**, and
the items surfaced are flagged with named owners rather than fixed here. **No security finding at any
severity**; nothing at or near `security.block_on: high`; `compliance_regime` is `[]`, so no
Compliance Officer hop is owed. **This is not a §14 gate and it issues no stamp** — `finding` was not
used and `verified_by` is empty on every note published here, which the schema permits for
`decision` / `observation` / `claim` / `artifact-ref`. **Nothing was merged and nothing was deployed;
a human holds both.**
