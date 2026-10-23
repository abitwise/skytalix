---
id: 20261023T190206Z-architect-design-decision-b9dc8455
kind: decision
by: architect-design
at: 2026-10-23T19:02:06Z
verified_by: 
confidence: high
refs:
  - arch-runbook-operate
  - memory-bank/70-runbook.md
  - 4ddae2c8
  - b4f2d26d
  - ABC-042
  - ABC-168
  - ABC-200
  - ADR-0018
  - ADR-0044
  - ADR-0045
  - e82a3798
  - 20261023T185614Z-architect-design-decision-5ffd0ca7
  - 20261023T190206Z-architect-design-observation-7b42b3f4
supersedes: 
seal: sha256:fc14f42287a38716c96440abe835f6cb635a684f8ef7cb0c8695302e767f9718
---

# Architect/Design: `70-runbook.md` § Operate rewritten to what `main` runs, § Roll back pointer corrected, deploy-key wording left for the Orchestrator (STOP on that one item)

**What was done.** Branch `grugops/arch-runbook-operate` at `b4f2d26d`, one commit on `main` `4ddae2c8`. Records only. `memory-bank/70-runbook.md` changed +45/−0; no line was deleted.
- **The header.** A dated `_Updated: 2026-10-23 …_` line under the 2026-08-06 one.
- **§ Operate.** A `[REWRITTEN 2026-10-23 …]` bracket and new text. It covers:
  - the game: `npm run chess`, its flags, the `--` separator (cited to `AGENTS.md`), the `ABC-200` startup questions, `help`, and the exit codes 0, 1 and 70;
  - the UCI engine `skytalix`: `npm run uci`, no arguments, the exit codes 0, 1 and 70, and `npm run build` producing `dist/uci.js` as the `bin` target, git-ignored and not published.

  Development and verification commands are cited to `AGENTS.md` § Commands and the receipts file, not restated. The three 2026-08-06 paragraphs stay verbatim under a "Dated history … not current" marker. A closing marker keeps the monitoring paragraph current, because it still holds.
- **§ Roll back.** A `[CORRECTED 2026-10-23 …]` bracket. The pointer "`AGENTS.md` § Branching model" is to be read as `memory-bank/45-standing-rulings.md` § Branching model, because the section moved there in `e82a3798` (`ABC-164`).

The evidence for every command is in `20261023T190206Z-architect-design-observation-7b42b3f4`.

**Authority.** The Orchestrator's housekeeping brief `arch-runbook-operate`, following up `…5ffd0ca7`. This is not an ADR. No decision was changed. Each edit corrects a statement the repository disproves, and the old wording stays visible.

**STOP on one item, which was not edited.** § Deploy says "a human holds deploy". § On-call says "The project owner … holds deploy". Both are older than the owner's 2026-08-15 directive "deploy is ALLOWED and NOT NEEDED". `45-standing-rulings.md` reads that directive as "Who holds the deploy key changed 2026-08-15". Rewording who holds deploy authority changes a governance statement, not a plain fact. `production_requires_human_confirmation` is still `true`, and it is the rail the runbook sentence sits beside. So this is the brief's STOP case. Both sentences are left as they are, for the Orchestrator to settle with the owner, or to confirm they stand as written.

**Left as written, on purpose.**
- The "Read this first" box's revisit trigger `EPIC-006` matches `45-standing-rulings.md` § Deployment posture and is a posture statement.
- § Roll back's "owed the moment `EPIC-006` produces a distributed artifact" still holds, as `…5ffd0ca7` found.
- The § Deploy facts were re-measured and hold.

**Follow-ups (INFO, nothing blocked, outside this fence).**
- Scribe: `AGENTS.md` "Dev / run" and `90-agents-md-command-log.md` § "Dev / run" do not mention the `ABC-200` startup questions.
- Scribe: the `AGENTS.md` sentence "without it npm silently drops the flag and runs with defaults" is true only for a flag with no value. A flag that takes a value is refused with exit 1. The measurements are in `20261023T190206Z-architect-design-observation-7b42b3f4`.
- Orchestrator: `45-standing-rulings.md` § Deployment posture still says "no `bin`/`main`/`exports`/`files`". That has been out of date since `ABC-168`.

**Not touched.** `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md`, config. No board column moved. Nothing was pushed or merged.
