# AGENTS.md

## Mission

This repo runs a file-based agent factory for software delivery. One Orchestrator (the head grug) routes work through the full lifecycle; a few single-job grug agents execute within hard limits. The role is the intelligence. The workflow is the guardrail. The shared verified context is the memory. The board is the state. The gate is the backpressure. Humans decide; agents execute.

## How to work here

All work starts with the Orchestrator: `agent-factory/roles/orchestrator.md`.

Read in this order:

1. `.grugops/factory.config.json` — the dial (mode, cadence, autonomy, WIP limits). Runs lean with documented defaults when absent.
2. `agent-factory/roles/orchestrator.md` — the routing contract; act as the Orchestrator.
3. `plans/board.md` — the visible state; respect every column's WIP limit before pulling new work.

The Orchestrator classifies the request, activates the right specialist role(s), requires published notes from each, updates the board and traceability, and produces the next action.

## Role / workflow files

Roles pull the shared verified context they need and publish their work output as typed notes — per Workflow 16 (`agent-factory/workflows/16-context-read-write.md`). The shared context is the inter-role memory; the Orchestrator sequences by decompose→enqueue.

- Roles:      `agent-factory/roles/`
- Workflows:  `agent-factory/workflows/`
- Checklists: `agent-factory/checklists/`

> **No `finding` is admissible on this install.** `scripts/context-io.ts`, `scripts/claim.js` and
> `mcp__grugops__propose_note` are absent from this repository and from the kit, and
> `context.human_admission` is `off`, so no `§14-gate#<id>` verdict can be emitted. Record results as
> `claim` / `observation` / `decision` / `artifact-ref`, hand-authored per
> `agent-factory/contracts/context-note.md`, and take the queue claim by hand: `mkdir -p
> .grugops/queue/claimed` for the parent, then a **bare** `mkdir` (no `-p`) of the task directory —
> that bare `mkdir` is the atomic act. **Do not re-derive this; do not invent a stamp.**

Drafted by BA/PM at task `home-the-gaps-2026-08-13` and placed by the Orchestrator on the owner's
instruction. It is here because **eight consecutive hops re-derived it from scratch** before doing any
work. It records what IS, not what should be: restoring the sanctioned writer is an install-level fix
(`node install/install.js --check`), not project work, and it is escalated to the owner rather than
ticketed.

## Kit vs state

Clear voice — this is a resolution and safety rule, not a joke.

- `agent-factory/…` = **KIT** — read-only, resolved from the kit root; NEVER written.
- `plans/`, `memory-bank/`, `.grugops/` = **STATE** — read/write in THIS repo.
- Roles read and write the shared verified context only via Workflow 16 (`agent-factory/workflows/16-context-read-write.md`) — referenced, never restated.
- The kit root is resolved by the adapter only. If the resolved kit dir is absent: **STOP — do not hunt** the repo for `agent-factory/…`. Re-run the installer (`node install/install.js` or `node install/install.js --check`).

> **Kit vs state invariant:** `agent-factory/…` = read-only KIT (from the kit root, never written); `plans/`, `memory-bank/`, `.grugops/` = STATE in this repo. Roles pull shared context and publish typed notes per Workflow 16 — referenced, never restated. If the kit dir is absent, STOP — do not hunt.

## Commands

Real commands only, with flags, preferring fast single-file variants. If a command is unknown, ship `UNKNOWN - verify` — never fabricate. Do not enforce here what a linter or CI already enforces.

### Install

- Install / bootstrap: `npm install`

### Development

- Dev / run: `npm run chess` <!-- verified 2026-08-14 at ABC-042: prints the start position (23
  rows) on stdout and exits 0. Optional arguments, and the complete set: `--colour white|black|random`,
  `--ascii`, `--unicode`. It PRINTS A BOARD; it does not play a game — no move can be typed until
  ABC-043. -->
- Perft harness (move-gen correctness + nodes/sec, ABC-006): `npm run perft`
- Perft deep counts (opt-in slow suite): `PERFT_DEEP=1 npx vitest run src/perft.test.ts`
- Spike benchmark (throwaway, ABC-008): `npm run spike:perft [depth]`

### Test

- Test (all): `npm test` <!-- vitest run -->
- Test (single file): `npx vitest run <path>`

### Acceptance

- Acceptance / BDD scenarios: `UNKNOWN - verify` <!-- host runner, e.g. cucumber-js / behave / `bddgen && playwright test` — names live here only as examples, never as a hard command -->

### Test integrity

- Skip-count capture: `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` <!-- verified 2026-07-22: returns an integer (0 with no tests). Requires jq, confirmed present. --> <!-- the host runner's reported skipped-test COUNT (an integer) for the gate's test-integrity step. Examples by runner — verify against yours, never fabricate: vitest `vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`; jest `jest --json | jq '.numPendingTests'`; pytest `pytest --json-report --json-report-file=- | jq '.summary.skipped'`; go `go test -json ./... | jq -s '[.[]|select(.Action=="skip")]|length'` — examples only, never a hard command. If the count cannot be determined, record `UNKNOWN - verify`, never a silent 0. -->

- Test-integrity check (the gate's step): `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` <!-- verified 2026-08-13: `No findings.`, exit 0, at skip count 0. `.grugops/test-skips.md` is HUMAN-OWNED (kit: "the agent may not self-author a justification to clear its own gate") — an agent may READ it and RUN this, never write a row into it. Created by the owner 2026-08-13, discharging `H2`; before that this step exited 2 (could not run) on every gate. -->

### Lint

- Lint (all): `npm run lint` <!-- biome check . -->
- Lint (single file, autofix): `npx biome check --write <path>`
- Format (single file): `npx biome format --write <path>`

### Typecheck

- Typecheck (single file): `UNKNOWN - verify` <!-- tsc is project-wide; there is no
  single-file mode. Use the project-wide command below. -->
- Typecheck (project): `npm run typecheck` <!-- tsc --noEmit -->

### Build

- Build (use sparingly): `npm run build` <!-- currently `tsc --noEmit`: the project is
  type-checked but emits nothing, because nothing is published until EPIC-006 packaging.
  Honest naming — this is a typecheck wearing the build slot's name, not a real bundle. -->
- Docs build / link-check: `UNKNOWN - verify`
- Clean / reset: `UNKNOWN - verify`

### E2E

- E2E: `UNKNOWN - verify` <!-- no runnable game until EPIC-006; `quality.ui_e2e` is
  `ui-or-critical-path` and this project has no UI surface yet -->

<!--
  Command slots filled 2026-07-22 during ABC-008. Every command above was RUN before being
  recorded here. Slots that are still `UNKNOWN - verify` are genuinely unknown — nothing was
  guessed to make the table look complete.
-->

### Stack

TypeScript on Node (>= 22), ESM. Vitest for tests, Biome for lint + format. Node runs `.ts`
files directly via built-in type stripping, so there is no bundler or transpile step in dev.

## Delivery

- Board: `plans/board.md`
- Cadence + WIP: `.grugops/factory.config.json`
- Traceability: `plans/traceability.md`

## Process rules (this project)

Two rules the owner adopted 2026-08-13, in this order. Evidence and the full controls live in the
delivery audit's notes (`.grugops/context/audit-delivery/notes/`) — read them there, not here.

**1. Criteria review happens at the `Ready for Dev` exit, not at a gate.** The Orchestrator owns that
exit: before a ticket enters `In Development`, re-read its acceptance criteria against the built tree
and record the gaps found there. Not a Definition of Ready re-run — DoR asks whether criteria are well
formed; this asks whether they still match what exists. **Control: gaps found at QE fall below 3 per
ticket for five consecutive tickets and backward moves below 0.5 per ticket, while gaps recorded at
the `Ready for Dev` exit RISE.** If gaps fall at both ends the rule is not working — it is hiding.

**2. Ticket prose has a size budget; overflow goes to context notes.** Acceptance criteria, scope and
risks stay in the ticket; measurements, rejected alternatives and gate narration go to
`.grugops/context/<task>/notes/` (Workflow 16). This is `plans/board.md`'s one-line rule applied to
`plans/tickets/`. **Control: median length of the next ten cut tickets ≤ 300 lines (720 today) and
criterion gaps at QE do not rise.** Shorter tickets bought with worse gaps mean the budget cut rigour
instead of prose — revert it.

**Precedence, so nobody has to guess.** The kit is silent on both: no kit workflow re-reads criteria
against the built tree at that exit, and no kit file budgets ticket prose (its `size` is effort,
`XS`–`XL`, not lines). These rules ADD a project step and contradict nothing in the kit — which is
read-only and cannot carry them.

## Branching model

Trunk-based. `main` is the single long-lived branch. Work happens on a short-lived
`grugops/<task>` branch — the only place a gate can run RED without `main` ever being red — and
merges to `main` as soon as it is green. No `develop`, no release branches, no long-lived feature
branches.

The project owner authorized merges to `main` standing (2026-08-06). Three limits did not move:
deploy is NOT included, the gate still binds, and the authority is the owner's and revocable. The
directive, its reading and its limits are in `memory-bank/60-progress.md` § "Standing directive —
the branching model, and who turns the merge key". **That section is the authority; this is a
pointer to it.**

The commit-side branch guard in `agent-factory/_commit-convention.md` still holds — commit on the
`grugops/<task>` branch, never directly on `main`. What the owner changed is what happens *after*
the gate is green, not how work is produced.

**Precedence, so nobody has to guess.** The kit is shared and project-agnostic, so it still reads
"agents never merge" (`_commit-convention.md` §(c), workflows 04, 05, 12). It is read-only and
cannot carry a project override. On merge to `main` in THIS project, the owner's directive wins;
everything else in those files — the branch guard, the gate, never-deploy — stands unchanged.

**Config trap.** `.grugops/factory.config.json` says `autonomy: "pr"`, which the kit defines as
"branch + open a PR (agents never merge)". The dial allows only `diff`/`branch`/`pr` and there is
no `branching_model` key, so no value can express "agents may merge" — the config was left alone
rather than given a fake dial nothing reads, and `memory-bank/60-progress.md` is where the merge
authority actually lives. This repo also has no git remote, so `pr` has always meant "branch +
gate" here: nothing is pushed and no PR is opened.

## Deployment posture

This project deploys nowhere. It runs locally, from source on a developer's machine. There is no
container, no manifest, no CI, no git remote, and no release has ever been cut — that absence was
measured, not assumed. There IS a CLI entry point as of `ABC-042` (2026-08-14) — `Dev / run` above
is `npm run chess` — and it changes none of the above: it runs `src/cli.ts` from source, in place.
**Runnable is not deployable.** `package.json` is still `private: true` with no `bin`, `main`,
`exports` or `files`; nothing is built, emitted, published or installable.

This is **present posture and explicitly revisitable** — the owner said "currently" and "for now"
(2026-08-06). The revisit trigger is named: `EPIC-006` (packaging). **How the CLI will eventually be
distributed — npm, a binary, a `git clone` — is undecided, and `EPIC-006` decides it.** Do not fill
that in.

The ruling, the evidence behind it, and what is deliberately preserved for the day it changes are in
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`. **That ADR is the authority;
this is a pointer to it.** The config carries the fact: `default_stack.deploy` is `none-local-only`
and `environments` is `["local"]`.

**Nothing here relaxes anything.** `production_requires_human_confirmation` stays `true`, the
never-deploy safety rule below stands, and the branching model's deploy limit — deploy is not
included in the owner's standing merge approval — is confirmed by this, not modified. "Deploys
nowhere today" is not "decided never to deploy": no release machinery, board column or workflow was
removed.

**Precedence, so nobody has to guess.** The kit is shared and project-agnostic, so it still hardcodes
a `dev → staging → prod` promotion path (`agent-factory/workflows/12-release.md` step 3;
`agent-factory/roles/release-manager.md`'s release-record template). It is read-only and cannot carry
a project override. On this project's deployment posture, `.grugops/factory.config.json`, `ADR-0007`
and `memory-bank/` win; everything else in those files — never-deploy, the human-confirmation
requirement — stands unchanged.

## Safety rules

- Do not read or expose secrets.
- Do not run destructive commands.
- Merging gated work to `main` is authorized standing by the owner — see `## Branching model`. It
  is approval to merge work that PASSED, never to skip or soften a gate (`quality.gate_enforcement`
  is `blocking`): run the gates on the branch tip before and on `main` after, and record both.
- Never deploy. `production_requires_human_confirmation` is `true`, and merge approval is not
  deploy approval — a human holds deploy. There is also nothing to deploy and nowhere to deploy it
  — see `## Deployment posture`, which confirms this rule rather than changing it.
- Do not change dependencies without reason. No unrelated refactors. No fake results.

## Coding rules (the 12)

Andrej Karpathy's coding-agent rules — 12 rules grouped under four principles. Follow them by default. Written in clear voice.

### Principle 1 — Think Before Coding

1. **State assumptions explicitly.** If uncertain, ask.
2. **Present multiple interpretations.** If multiple readings exist, surface them — don't pick silently.
3. **Push back when warranted.** If a simpler approach exists, say so.
4. **Stop when confused.** Name what's confusing. Ask.

### Principle 2 — Simplicity First

5. **Only requested features.** No features beyond what was asked.
6. **No single-use abstractions.** Don't abstract one-off code.
7. **No unrequested flexibility.** No "configurability" that wasn't requested.
8. **No impossible-scenario handling.** No error handling for cases that can't occur.

- Heuristics: "If you write 200 lines and it could be 50, rewrite it." Ask whether a senior engineer would call it overcomplicated; simplify if yes.

### Principle 3 — Surgical Changes

9. **Preserve adjacent code.** Don't "improve" unrelated code, comments, or formatting.
10. **Don't refactor working code.** Leave functioning logic untouched.
11. **Match existing style**, even if you'd do it differently.
12. **Flag, don't delete, pre-existing dead code.** Mention it; don't remove it unless asked.

- Corollary: remove only the imports/variables/functions YOUR edits made unused. Every changed line connects directly to the request.

### Principle 4 — Goal-Driven Execution

- Transform tasks into **verifiable goals** with specific checks.
- For multi-step work, outline a brief plan with steps and verification points.
- "Strong success criteria let you loop independently." Give the agent success criteria, not step-by-step commands, and let it loop until they're met.

## Definition of ready / done

- Definition of Ready: `agent-factory/checklists/definition-of-ready.md`
- Definition of Done: `agent-factory/checklists/definition-of-done.md`
- Enterprise Definition of Done (applies when `mode=enterprise`): `agent-factory/checklists/definition-of-done-enterprise.md`

## Memory bank & plans

- `memory-bank/*` — the agent-maintained working memory: read on start; `60-progress.md` is the running plan-of-record, `50-decisions/` holds ADRs, plus project brief, product, architecture, contributing, runbook, glossary.
- `plans/*` — the delivery state: `board.md` (status), `traceability.md` (requirement→ticket→code→test→UAT→release), `nfr-catalog.md`, plus `sprints/`, `releases/`, `epics/`, `features/`, `tickets/`.

## When uncertain

Stop. Write the open question or the assumption. Do not guess silently.
