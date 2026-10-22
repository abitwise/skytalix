# AGENTS.md

## Mission

This repo runs a file-based agent factory for software delivery. One Orchestrator (the head grug) routes work through the full lifecycle; a few single-job grug agents execute within hard limits. The role is the intelligence. The workflow is the guardrail. The shared verified context is the memory. The board is the state. The gate is the backpressure. Humans decide; agents execute.

**Byte budget: this file targets ≤ 18,432 B.** Why, and the size of every pass: the preamble and the last entry of `memory-bank/90-agents-md-command-log.md`.

## How to work here

Read in this order:

1. `.grugops/factory.config.json` — the dial (mode, cadence, autonomy, WIP limits). Runs lean with documented defaults when absent.
2. `agent-factory/roles/orchestrator.md` — the routing contract. All work starts here; act as the Orchestrator.
3. `plans/board.md` — the visible state; respect every column's WIP limit before pulling new work.

The Orchestrator classifies the request, activates the right specialist role(s), requires published notes from each, updates the board and traceability, and produces the next action.

## Role / workflow files

Roles pull the shared verified context they need and publish their work output as typed notes — per Workflow 16 (`agent-factory/workflows/16-context-read-write.md`). The shared context is the inter-role memory; the Orchestrator sequences by decompose→enqueue.

- Roles:      `agent-factory/roles/`
- Workflows:  `agent-factory/workflows/`
- Checklists: `agent-factory/checklists/`

> **No `finding` is admissible on this install:** `context.human_admission` is `off`, so no
> `§14-gate#<id>` verdict can be emitted. Record results as `claim` / `observation` / `decision` /
> `artifact-ref` per `agent-factory/contracts/context-note.md`.
> **Seal every note with the sanctioned writer:** a hand-authored note reads back `unsealed`. It is
> `scripts/context-io.js` (`admitAndAppend`, `readContext`) in the installed grugops plugin, with
> `claim.js` beside it (`claimTask`, `transition`). Find the plugin: `installPath` of `grugops@grugops`
> in `~/.claude/plugins/installed_plugins.json`. Pass `contextRoot` explicitly: the `.grugops/context`
> of the checkout you work in (the default root is the plugin's own directory). The Orchestrator also has
> `mcp__plugin_grugops_grugops__propose_note`. A bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/<task>` is the atomic claim act. **Do not re-derive this; do not invent a stamp.**

## Kit vs state

- `agent-factory/…` = **KIT** — read-only, resolved from the kit root; NEVER written.
- `plans/`, `memory-bank/`, `.grugops/` = **STATE** — read/write in THIS repo.
- Roles read and write the shared verified context only via Workflow 16 (`agent-factory/workflows/16-context-read-write.md`) — referenced, never restated.
- The kit root is resolved by the adapter only. If the resolved kit dir is absent: **STOP — do not hunt** the repo for `agent-factory/…`. Re-run the installer (`node install/install.js` or `node install/install.js --check`).

## Commands

Real commands only, with flags, preferring fast single-file variants. If a command is unknown, ship `UNKNOWN - verify` — never fabricate. Do not enforce here what a linter or CI already enforces.

### Install

- Install / bootstrap: `npm install`

### Development

- Dev / run: `npm run chess` <!-- prints the board and plays a game against the engine, default
  level 5 (≤3 s/move, ADR-0045). Options: `--colour white|black|random`, `--difficulty 1|2|3|4|5`, `--ascii`,
  `--unicode`. Pass an option AFTER `--`: `npm run chess -- --colour black` — the separator is
  load-bearing; without it npm silently drops the flag and runs with defaults. Exit 0 normal
  session, 1 refused command line, 70 internal error.
  Writing rules for this slot and full receipts (RUN dates, byte-exact before/after the `--` trap): `memory-bank/90-agents-md-command-log.md` § "Dev / run". -->
- Perft deep counts (opt-in slow suite): `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`
- UCI engine entry (ABC-168): `npm run uci` <!-- `node src/uci.ts`: reads UCI on stdin, writes UCI on stdout; exit 0 on `quit` or end of input, 1 on any argument, 70 on an exception. Receipts: `memory-bank/90-agents-md-command-log.md` § "UCI entry point". -->

### Test

Full RUN receipts for every command below (dates, exit codes, counts, traps): `memory-bank/90-agents-md-command-log.md`.
Perft, the opening-book regeneration, each lane's trigger and trap, and the coverage notes: `memory-bank/90-agents-md-command-log.md` § "On-demand commands".

**Never wait on a lane with `pgrep -f "<text>"` / `until ! pgrep -f …`** — the pattern matches the
waiting shell's own command line and never exits. Wait on the PID you started or the tool's
completion notification; if a pattern is unavoidable, bracket one character (`[v]itest`).

- Test (all): `npm test` <!-- `NODE_OPTIONS=--max-old-space-size=128 node tools/grugops/run-bounded.js 60000 vitest run` (ABC-122). A hung lane exits 124 at the 60 s bound — stop
  with Ctrl-C/SIGTERM, never SIGKILL (R1: can orphan a hung vitest). `*_DEEP` lanes below run via
  `npx vitest run` directly, never through `npm test`. -->
- Heap flag (ABC-173): `--max-old-space-size=400` is for ONE-file vitest runs only. Whole-suite or
  multi-file runs use 128, as `npm test` sets itself; the heap guard refuses 400 there.
- Worker cap (ABC-144, ADR-0040 addendum 2): `vitest.config.ts` `test.maxWorkers: 2`, pinned by value in
  `src/cli.test.ts`; `isolate` stays on; no `projects`/`poolOptions`. Never raise it or pass a higher
  `--maxWorkers`; env may only lower it: `VITEST_MAX_WORKERS` 1..2. The env note, the module
  runner and the negative-value risk: `memory-bank/90-agents-md-command-log.md` § "Vitest worker cap and module runner".
- Search deep lane (opt-in, ABC-077): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/search.test.ts`
- Engine deep lane (opt-in, ABC-078): `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/engine.test.ts`
- Levels deep lane (ABC-087, `src/levels.test.ts`): `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts`
- Input-seam deep lane (opt-in, ABC-037): `INPUT_DEEP=1 NODE_OPTIONS="--expose-gc --max-old-space-size=400" npx vitest run src/line-input.test.ts`
- Transposition deep lanes (ABC-081, `src/transposition.test.ts`): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
  src/transposition.test.ts` and `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx
  vitest run src/transposition.test.ts`
- Zobrist deep lane (ABC-075): `ZOBRIST_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/zobrist.test.ts`
- Quiescence deep lane (ABC-079): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/quiescence.test.ts`
- Puzzle suite, strength gate (opt-in, ABC-084): `PUZZLE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/puzzle-suite.test.ts`
- PVS/LMR deep lane (ABC-121, `src/search.pvs-lmr.test.ts`): `SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
  src/search.pvs-lmr.test.ts`
- Real-engine CLI lane (opt-in, ABC-119): `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`
- Real-engine UCI lane (opt-in, ABC-168): `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts`
- Self-play ladder lane (opt-in, ABC-085, ADR-0038): `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts`
- Test (single file): `NODE_OPTIONS=--max-old-space-size=400 npx vitest run <path>`
- Coverage: `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage`
- Coverage (`src/` only — the other denominator; neither is agreed): `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --coverage --coverage.include='src/**'`

### Acceptance

- Acceptance / BDD scenarios: `UNKNOWN - verify`

### Test integrity

- Skip-count capture: `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` <!-- verified: returns an integer (0 with no tests). Undeterminable → `UNKNOWN - verify`, never a silent 0. Run it as spelled: quotes without its prefix (before ABC-173) are history; refused by the heap guard, they print no integer and exit non-zero (ABC-176). -->

- Test-integrity check (the gate's step): `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` <!-- verified: `No findings.`, exit 0, at skip count 0. `.grugops/test-skips.md` is HUMAN-OWNED — an agent may READ and RUN this, never write a row into it. -->

- QE-hop check (`ABC-105`): `node tools/grugops/qe-hop-integrity.js --ticket ABC-xxx` | `--sweep` — the Orchestrator's check before a row moves to `Done`. Exit codes and the convention: `memory-bank/40-contributing.md` § "Conventions".

### Lint

- Lint (all): `npm run lint` <!-- biome check . -->
- Lint (single file, autofix): `npx biome check --write <path>`
- Format (single file): `npx biome format --write <path>`

### Typecheck

- Typecheck (single file): `UNKNOWN - verify` <!-- tsc is project-wide; no single-file mode. -->
- Typecheck (project): `npm run typecheck` <!-- tsc --noEmit -->

### Build

- Build (use sparingly): `npm run build` <!-- `tsc -p tsconfig.build.json` -> `dist/` (ABC-168, ADR-0044 D8): the engine artifact, `dist/uci.js`; the `typecheck` gate still covers the whole tree. -->
- Docs build / link-check: `UNKNOWN - verify`
- Clean / reset: `UNKNOWN - verify`

### E2E

- E2E: `UNKNOWN - verify` <!-- no UI surface (`quality.ui_e2e`: `ui-or-critical-path`) -->

### Stack

TypeScript on Node (>= 22), ESM. Vitest 4.1 (module runner off) for tests, Biome for lint + format. Node runs `.ts`
files directly via built-in type stripping, so there is no bundler or transpile step in dev.

## Delivery

- Board: `plans/board.md`
- Cadence + WIP: `.grugops/factory.config.json`
- Traceability: `plans/traceability.md` (10 cells/row)

## Standing rulings

The owner's rulings, in full with their evidence: `memory-bank/45-standing-rulings.md`, sections "Process rules (this project)", "Branching model", "Test and UAT authority", "QE validation authority", "Deployment posture". Read it when you review criteria, merge, run UAT, certify a ticket or touch deploy. The operative sentences, verbatim:

- Criteria review happens at the `Ready for Dev` exit, not at a gate. Ticket prose has a size budget; overflow goes to context notes.
- Merge to `main` in THIS project is allowed once all tests pass and the ticket is done, never before. The commit-side branch guard in `agent-factory/_commit-convention.md` still holds: commit on `grugops/<task>`, never `main` directly.
- 2026-10-22 — the owner delegated his decisions to the Orchestrator and trusts QE: the `In UAT` exit is signed by an agent-run acceptance on QE's recorded verdict (PASS, or PASS_WITH_GAPS with no blocking gap), recorded as a `decision` naming the QE verdict note, never a stamp. Supersedes 2026-08-16 (the owner's word signs). Still the owner's: a new or reversed ADR, requirement or scope changes (including NFR bounds), accepting a HIGH security risk, `production_requires_human_confirmation`. Unchanged: blocking gates, the QE hop on every ticket, merge on green.
- 2026-08-17 — a ticket whose delivered diff carries ZERO PRODUCTION LINES has UAT WAIVED, standing. `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` must be **empty** — any production line and the rule does not apply. This unfiltered form is the reference measurement; no brief may add a `__snapshots__` filter. Snapshot-only exception (owner, 2026-10-17): if it lists only `src/__snapshots__/*.snap`, the waiver holds only if the Orchestrator reads every changed `.snap` and records that in the Done note; any change the criteria do not explain voids it and UAT runs (signed per 2026-10-22). A waiver is not a signature: `Done` here means merged and gated, never human-accepted.
- Every ticket gets a `qe-e2e` hop and QE's recorded verdict before leaving `In Review`; none reaches `Done` without one. This project's kit overrides remain THREE: the branching model, the deployment posture, and the zero-production-lines UAT waiver. A reader who counts four is wrong.
- This project deploys nowhere; it runs locally, from source. `production_requires_human_confirmation` stays `true` — the grant deliberately did not flip it; moving it is the owner's word, never an inference from the grant.

## Safety rules

- Do not read or expose secrets.
- Do not run destructive commands.
- Merging gated work to `main` is authorized standing by the owner — see `memory-bank/45-standing-rulings.md` § Branching model. It
  is approval to merge work that PASSED, never to skip or soften a gate (`quality.gate_enforcement`
  is `blocking`): run the gates on the branch tip before and on `main` after, and record both.
  Tests and UAT are the agent's on the same terms — see `memory-bank/45-standing-rulings.md` § Test and UAT authority.
- **Deploy is allowed, and there is nothing to deploy** (the owner, 2026-08-15, one sentence).
  `production_requires_human_confirmation` stays `true`; the grant did not flip it. See `memory-bank/45-standing-rulings.md` § Deployment posture.
- Do not change dependencies without reason. No unrelated refactors. No fake results.
- A `vitest`/`@vitest/*` bump carries `RISK-ABC143-01` (`ABC-143` § Follow-ups): the result-file reporter uses vitest internals; fails loud at load if one is gone (`ABC-152`).

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
- `memory-bank/45-standing-rulings.md` — the owner's standing rulings in full (process, branching, test and UAT, QE, deployment); `memory-bank/90-agents-md-command-log.md` — on-demand commands, lane triggers and traps, and the receipts behind § Commands.
- `plans/*` — the delivery state: `board.md` (status), `traceability.md` (requirement→ticket→code→test→UAT→release), `nfr-catalog.md`, plus `sprints/`, `releases/`, `epics/`, `features/`, `tickets/`.

## When uncertain

Stop. Write the open question or the assumption. Do not guess silently.
