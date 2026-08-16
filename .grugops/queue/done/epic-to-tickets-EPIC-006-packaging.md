---
task: epic-to-tickets-EPIC-006-packaging
subtask: epic-to-tickets-EPIC-006-packaging
role: ba-pm
workflow: agent-factory/workflows/03-epic-to-tickets.md
ref: .grugops/context/epic-to-tickets-EPIC-006-packaging/
epic: plans/epics/EPIC-006-game-session-and-packaging.md
enqueued_by: orchestrator
enqueued_at: 2026-08-16T06:00:00Z
branch: grugops/decompose-epics-2026-08-16
base: main @ a5a4d51
id_range: ABC-100 … ABC-115 (yours alone — a CEILING, never a quota)
---

# Subtask: decompose `EPIC-006`'s SECOND half — packaging, difficulty, `undo`

Read `plans/epics/EPIC-006-game-session-and-packaging.md` (259 lines) — **note its
`## DECOMPOSED 2026-08-13` section at `:91`: the RUNNABLE half is already cut as
`ABC-041`…`ABC-046` and is NOT yours.** Your half is the three things that decomposition
deliberately left: **packaging, difficulty, and `undo`**. Then read
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`, and `AGENTS.md`
§ *Deployment posture*. **I relay nothing.**

## THE HARD STOP — read this before you cut a single packaging ticket

**How this CLI will be distributed is UNDECIDED, and you may NOT decide it.** npm, a standalone
binary, a `git clone` and `npm start` — **all open**. Three independent sources say so and they
agree:

- `AGENTS.md` § Deployment posture: *"**Do not fill that in.**"*
- `ADR-0007` clause 5: the question is `EPIC-006`'s, and **that ADR does not decide it**.
- `ADR-0007` detection row **`D5`**: a mechanism being selected is a **named revisit trigger**
  handled by a **SUPERSEDING ADR**, not by a ticket. The board row adds: *"distribution stays with
  a human."*

**So: cut the DECISION as work, never the ANSWER.** Concretely — a ticket whose deliverable is a
superseding ADR authored by **Architect/Design** on the **owner's** word, with the options laid out
and the consequences of each priced, is correct and wanted. **A ticket that assumes npm publish, or
sets `bin`/`main`/`exports`/`files` in `package.json`, or removes `private: true`, is out of bounds
even if it looks obviously right.** If you catch yourself reasoning "it's a Node CLI, obviously
npm" — that is the failure this stop exists to prevent.

**Everything downstream of the channel is blocked by that decision**, and saying so in each ticket's
DoR is the honest outcome. I would rather this half come back as *"two tickets and one escalation"*
than as twelve tickets built on a channel nobody chose.

**One more thing you may not move:** `production_requires_human_confirmation` is `true`,
`ADR-0007` carries a detection row for it being found `false` **or argued obsolete**, and the
2026-08-15 owner grant deliberately did NOT flip it. **Do not cut a ticket that flips it and do not
argue it obsolete because nothing deploys today.**

## Subject boundary — the lesson of the last hop

Two sibling BA/PM agents are decomposing `EPIC-004` (engine) and `EPIC-005` (opening book) **right
now**. The boundary, ruled by me:

- **DIFFICULTY: the user-facing SELECTION is YOURS** — the flag or prompt, the level names, how a
  chosen level persists across a session, what a human sees. **The engine mechanism behind it —
  search depth, time budget, evaluation strength — is `EPIC-004`'s, and you do not cut it.**
  Depend on `EPIC-004` **by name and by behaviour, never by a guessed ticket id**; its ids are being
  minted in parallel and a guessed id is worse than an unresolved one.
- **A constraint you must respect rather than rediscover:** `RISK-002` survived as **GO WITH
  CONSTRAINT** with the engine's per-move budget **time-based, not depth-based**. **A difficulty
  level defined as a fixed search depth contradicts it.** Verify that in `plans/nfr-catalog.md`
  around `:536`, then write your levels in terms the constraint allows.
- **`undo` is yours outright** — it was named as deliberately-not-cut in the 2026-08-13 pass.
- **The runnable half (`ABC-041`…`ABC-046`) is not yours to re-cut, re-scope or renumber.**

If you find an overlap I have not named, **record it and do not resolve it.**

## What you own

- Cut into tickets inside `ABC-100`…`ABC-115`. **Sixteen ids is a ceiling, not a target** — and
  given the hard stop above I expect the packaging portion to be SMALL.
- **No `XL` ticket may enter dev** — `SPLIT_REQUIRED` if one sizes that way.
- Each ticket: testable acceptance criteria, size, priority, epic, dependencies, NFR triggers, and a
  `DoR n/10` reading with every ⚠️ named. **Packaging tickets blocked on the undecided channel
  should say so in their DoR and score accordingly — do not inflate them to look ready.**
- Report whether `EPIC-006`'s recorded size (`L`, already corrected once from `M`) still holds once
  both halves are counted.

## Hard limits

- **Write ONLY** `plans/tickets/ABC-1{00..15}-*.md` and your notes under `ref:`. **Never an id
  outside your range** — in particular **never `ABC-099` or below**, which is a sibling's territory.
- **Do not write `plans/board.md` or `plans/traceability.md`** — mine. Report the rows you want.
- **Do not edit `plans/epics/EPIC-006-*.md`**, and **do not touch its `## DECOMPOSED` section** —
  report corrections instead.
- **Do not edit `ADR-0007`, `AGENTS.md`, `.grugops/factory.config.json` or `package.json`.** The
  posture and the config are not yours; `ADR-0007` is Architect/Design's to supersede.
- **Do not write any code, test, or `src/` file.**
- **Do not run git.** Two sibling agents share this working tree and one index; I commit once.
- **Do not merge, push or deploy. No new spawns.**

## Prose budget (project process rule 2)

Criteria, scope and risks in the ticket; measurements, rejected alternatives and narration into
`ref:` notes. Median ≤300 lines per ticket page.

## Stop conditions

- A ticket sizes `XL` → `SPLIT_REQUIRED`.
- **You cannot write a packaging ticket without assuming a distribution channel → STOP.** That is
  the expected outcome for most of them, and it is a result, not a failure. Escalate it as the ADR
  ticket and record which downstream tickets it blocks.
- A difficulty level cannot be expressed without a fixed depth → that is `EPIC-004`'s design
  question; name the owner and stop.
- `undo`'s interaction with the merged turn loop is undecided → name it; do not invent the semantics.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable on this install; use `claim` / `observation` / `decision` /
`artifact-ref`. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`, then a **bare**
`mkdir` (no `-p`) of `.grugops/queue/claimed/epic-to-tickets-EPIC-006-packaging/`, write `claim.md`
inside it, `mv` this file in, and on completion `mv` it to `.grugops/queue/done/`.

Report: the ticket count and why; **what you escalated rather than decided**; which tickets are
blocked on the channel decision; the epic size check; the board rows you want; and every gap with
severity and owner.
