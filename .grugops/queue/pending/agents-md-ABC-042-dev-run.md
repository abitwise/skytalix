---
task: abc042-docs-2026-08-15
subtask: agents-md-ABC-042-dev-run
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/agents-md-ABC-042-dev-run/
parent_ref: .grugops/context/quality-gate-ABC-042-regate/
enqueued_by: orchestrator
enqueued_at: 2026-08-15T21:10:00Z
branch: grugops/agents-md-ABC-042-dev-run
base: grugops/quality-gate-ABC-042-regate @ d011df4
---

# Subtask: `AGENTS.md` now contradicts itself — `Q13`

**Branch from `grugops/quality-gate-ABC-042-regate` @ `d011df4`, NOT from `main`.** `main` is NOT an
ancestor and must not be merged in. This subtask file is tracked on `main` and will not exist in your
tree; read it before you branch. Its queue transition is the Orchestrator's.

## The defect, measured

- **§ Commands, line 62:** `- Dev / run: `npm run chess`` — placed by `ABC-042`'s `A1`, which
  required that exact command **having been run**.
- **§ Deployment posture, line 184:** *"There is also **no CLI entry point yet**, which is why
  `Dev / run` above is `UNKNOWN - verify` and **stays that way**."*

**Both cannot be true.** `A1`'s criterion asserts the command line and is structurally blind to prose
two sections away, so no gate on this ticket could catch it. QE raised it at the re-gate as `Q13`;
the Orchestrator confirmed it by reading both lines at the tip.

## What must NOT be flattened

**Exactly one fact changed: a CLI entry point now exists.** Everything else in § Deployment posture
stands and is load-bearing:

- **Packaging and distribution remain UNDECIDED and reserved to `EPIC-006`** by `ADR-0007` — no
  `bin`, no `main`, no `files`, no `publishConfig`, `private` still `true`. `ABC-042`'s `A10`/`A12`
  are the mechanical fence that kept it that way, and the ticket says so in its own § Out of scope.
- **This project still deploys nowhere**, `environments` is `["local"]`,
  `production_requires_human_confirmation` is `true`, and the never-deploy rule is untouched.
- **`ADR-0007` is the authority** and § Deployment posture is a pointer to it. **You are not amending
  `ADR-0007`** — if you believe it needs amending, say so and route it to Architect/Design.

**The trap to avoid:** "there is now an entry point" must not become "packaging is decided" or
"`npx` works". `EPIC-006` acceptance criteria #1 (`npx <package>`) and #4 (`--difficulty`) are
**explicitly NOT met** by `ABC-042`, and its page names both.

## Hard limits

- **`AGENTS.md` only.** No code, no criteria, no ADRs, no `plans/` files.
- **Real commands only.** If you touch any command slot, it must have been RUN — `npm run chess`
  works at this tip; verify it yourself rather than trusting this file.
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. *(Standing on
  this ticket.)*
- **Preserve adjacent content** (coding rules 9–12): the surrounding sections were written by other
  hops with reasons recorded elsewhere. Fix the contradiction; do not tidy the neighbourhood.
- **Do not merge, do not push, do not deploy.**

## Stop conditions

- The honest fix requires changing `ADR-0007` or a config value → **stop and route it.**
- You cannot state the new posture without asserting something about packaging → **stop.** That
  decision is a human's and `EPIC-006`'s.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory. Commit on your branch.

Report: the exact before/after text; every other place in `AGENTS.md` you checked for the same
contradiction and whether it was clean; confirmation that packaging language did not move; and any
gap with severity and owner.
