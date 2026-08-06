---
id: 20260806T222000Z-agents-md-scribe-decision-dfe783f9
kind: decision
by: agents-md-scribe
at: 2026-08-06T22:20:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - agents-md-deployment-section
  - 20260806T210000Z-orchestrator-decision-3d1f97a2
  - 20260806T212500Z-architect-design-decision-40352dd5
  - 20260806T213200Z-architect-design-observation-75e59a37
  - AGENTS.md
  - memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
  - EPIC-006
supersedes: 
---

# `AGENTS.md` gets a `## Deployment posture` section — a peer of `## Branching model`, not a footnote in `## Safety rules`

## What was written

One new top-level section, `## Deployment posture`, placed immediately after `## Branching model` and
before `## Safety rules`; plus **two clauses appended** to the existing never-deploy safety bullet.
Five short paragraphs: the measured fact, the revisit trigger, the authority pointer, what is *not*
relaxed, and precedence against the read-only kit. Diff is **+32 / −1 lines in `AGENTS.md` and
nothing else**.

**Nothing from `ADR-0007` is restated.** The section carries the fact and points at the ADR for the
why — the same move `## Branching model` makes at `memory-bank/60-progress.md` (*"That section is the
authority; this is a pointer to it"*), and the same length.

## The three judgement calls, each surfaced rather than picked silently

### 1. New section, NOT an extension of `## Safety rules` — and BOTH, in a specific split

The two candidates were real and the split between them is the answer.

**A deployment posture is not a safety rule.** `## Safety rules` is a list of imperatives to an agent
about to act (*don't read secrets, don't run destructive commands, never deploy*). The posture is a
**standing fact about the project** — measured, dated, revisitable, with an authority file behind it.
That is exactly the shape `## Branching model` already has, and the owner's word *"as well"* points
at that section by name. **Putting a dated, revisitable project fact inside an imperative list would
have made it read as a rule an agent might one day be authorized to relax, which is the opposite of
what it is.** So: peer section, placed adjacent to `## Branching model` so a reader sees the two
standing facts together.

**But the safety bullet still needed one clause**, because a reader who lands on *"Never deploy"* with
no pointer has to go hunting for whether anything changed today. Two clauses were **appended**:
*"There is also nothing to deploy and nowhere to deploy it — see `## Deployment posture`, which
confirms this rule rather than changing it."* This mirrors the merge bullet directly above it, which
already carries a `see ## Branching model` pointer — an existing precedent in this exact list, not an
invention. **Nothing in that bullet was deleted or softened**; `production_requires_human_confirmation
is true` and `a human holds deploy` are byte-unchanged, and the added text says in the file itself
that this confirms rather than changes.

### 2. The `## Commands` table needed NO change, and one slot was deliberately NOT created

Audited critically against the file's own rule (real commands only, `UNKNOWN - verify` where
genuinely unknown, never fabricate). **No slot claims a deploy target: nothing in the table mentions
deploy, docker, a registry or an environment.** Full audit in the sibling `observation` note.

**No `### Deploy` slot was added, and this is the sharpest call on this subtask.** The tempting move
is `Deploy: UNKNOWN - verify`. It would be **wrong, and wrong in the file's own terms**:
`UNKNOWN - verify` means *"this command exists and nobody has confirmed it — go find it."* That would
send every future reader hunting for a deploy command that **does not exist and is not supposed to**.
Known-absent and unknown are different facts, and the stronger one belongs in prose. The posture
section states it plainly instead. **No command was run to fill any slot, and no slot was fabricated.**

### 3. The kit's `dev → staging → prod` path DOES need the precedence paragraph — verified first-hand

The Architect flagged it; it was **re-checked at this hop rather than inherited**, because writing a
precedence rule off someone else's reading is exactly the failure the rule exists to prevent. Grepped
directly:

- `agent-factory/workflows/12-release.md` — **line 25** (*"the DR notes (RTO/RPO) for the
  `dev -> staging -> prod` path"*) and **line 34** (the release record's *"`dev -> staging -> prod`
  path"*).
- `agent-factory/roles/release-manager.md` — **line 32** (*"the deploy plan (the `dev → staging →
  prod` path…)"*) and **line 37** (the release-record template's *"environments path `dev → staging →
  prod`"*).

**Four hardcoded occurrences, in KIT files, which are read-only and cannot carry a project override.**
They now disagree with `environments: ["local"]`. That is structurally identical to the branching
model's *"the kit still reads 'agents never merge'"* problem, and it gets the same treatment: a short
precedence paragraph naming both the winner and — critically — **what does not move with it**
(never-deploy, the human-confirmation requirement). A precedence rule that does not name its limits
gets read wider than it was given; the branching-model paragraph already learned that lesson in this
file and the wording follows it.

**The counter-argument is recorded rather than suppressed:** this disagreement can only bite inside
Workflow 12, and no release has ever been cut here (`plans/releases/` is `.gitkeep` only), so one
could call the paragraph premature. It is kept because the cost is four lines in a file every role
already loads, and the failure it prevents — a Release Manager one day inventing a staging
environment from a kit template — is silent and expensive.

## Constraints checked at the end, not assumed at the start

- **`production_requires_human_confirmation` re-read after the edit: still `true`** (line 64 of
  `.grugops/factory.config.json`). Not written by this subtask; verified, because `ADR-0007`'s
  falsifier `D7` says a reader who concludes it is obsolete has drawn a forbidden inference.
- **The never-deploy safety rule and the branching-model deploy limit are both intact**, and the new
  section says in its own words that it confirms them rather than modifying them.
- **No distribution mechanism was decided.** The section records *undecided* and routes the question
  to `EPIC-006`, per `ADR-0007` clause 5.
- **No availability figure was written into `AGENTS.md`.** That bar is Security/NFR's and is being
  ruled concurrently; `AGENTS.md` says nothing about it, so neither ruling can contradict the other.
- **Adjacent content preserved.** `## Commands`, `## Delivery`, `## Branching model`, the 12 rules and
  every other section are byte-unchanged. No reflow, no reformat.
- **Size: `AGENTS.md` is 12,818 bytes** — comfortably under the 32 KiB Codex truncation cap.

## Not done, and why

**No row was appended to `plans/traceability.md`**, though the role file asks for one. That file's own
header rule is **one row per ticket**, and the Orchestrator ruled explicitly that this task cuts no
ticket. The precedent was checked rather than assumed: the branching-model directive of earlier the
same day is the same shape and appears there **zero** times. `plans/traceability.md` is also not on
this subtask's ownership list, which was given as a closed set. Same conclusion the Architect reached
independently one hop earlier — recorded here so the gap is visible rather than looking like an
oversight.
