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

- Dev / run: `UNKNOWN - verify` <!-- no CLI entry point until EPIC-006 -->
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

## Safety rules

- Do not read or expose secrets.
- Do not run destructive commands.
- Never merge a protected branch. Never deploy prod without human confirmation.
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
