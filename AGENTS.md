# AGENTS.md

## Mission

This repo runs a file-based agent factory for software delivery. One Orchestrator (the head grug) routes work through the full lifecycle; a few single-job grug agents execute within hard limits. The role is the intelligence. The workflow is the guardrail. The shared verified context is the memory. The board is the state. The gate is the backpressure. Humans decide; agents execute.

**Byte budget: this file targets ≤ 24,576 B.** The 32,768-byte reader cap it guards against is
**inherited** — sourced from the AGENTS.md Scribe's 2026-08-19 observation, not measured in this
repository — and its overflow is silent and eats the file from the tail (`ABC-109`).

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

- Dev / run: `npm run chess` <!-- prints the board and plays a full game against the merged engine
  (up to 3 s/move, `DEFAULT_BUDGET_MS`). Options: `--colour white|black|random`, `--ascii`,
  `--unicode`. Pass an option AFTER `--`: `npm run chess -- --colour black` — the separator is
  load-bearing; without it npm silently drops the flag and runs with defaults. Exit 0 normal
  session, 1 refused command line, 70 internal error. Full receipts (RUN dates, byte-exact
  before/after the `--` trap): `memory-bank/90-agents-md-command-log.md` § "Dev / run". -->
- Perft harness (move-gen correctness + nodes/sec, ABC-006): `npm run perft`
- Perft deep counts (opt-in slow suite): `PERFT_DEEP=1 npx vitest run src/perft.test.ts`
- Spike benchmark (throwaway, ABC-008): `npm run spike:perft [depth]`

### Test

Full RUN receipts for every command below (dates, exit codes, counts, traps): `memory-bank/90-agents-md-command-log.md`.

**Never wait on a lane with `pgrep -f "<text>"` / `until ! pgrep -f …`** — the pattern matches the
waiting shell's own command line and never exits. Wait on the PID you started or the tool's
completion notification; if a pattern is unavoidable, bracket one character (`[v]itest`).

- Test (all): `npm test` <!-- `node tools/grugops/run-bounded.js 60000 vitest run` (ABC-122). RUN
  2026-09-25: exit 0, 47 files, 1446 tests, 5.45 s. A hung lane exits 124 within the 60 s bound —
  stop with Ctrl-C/SIGTERM, never SIGKILL (R1: can orphan a hung vitest). `*_DEEP` lanes below run
  via `npx vitest run` directly, never through `npm test`. -->
- Search deep lane (opt-in, ABC-077): `SEARCH_DEEP=1 npx vitest run src/search.test.ts` <!-- exit 0,
  41 passed (28 default), 23.0 s. Unset: NOT DEFINED, not skipped (gate skip-count stays 0). Run at
  QE and after any src/search.ts change. -->
- Engine deep lane (opt-in, ABC-078): `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` <!-- exit 0,
  23 passed (17 default), 98.7 s — every WALL-CLOCK case; default lane runs on an injected clock.
  Run after any src/engine.ts change. -->
- Input-seam deep lane (opt-in, ABC-037): `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`
  <!-- RUN 2026-09-26: exit 0, 34 passed, 0.34 s — 34 is the whole lane; 33 means NODE_OPTIONS was
  dropped and the external-memory retention guard did not run (exits 0 either way). TRAP: never
  assert this guard on heapUsed — it is blind to an unflattened rope (0.00 vs 32.00 MiB via
  process.memoryUsage().external after gc(), the field that is NOT blind). Run after any
  src/line-input.ts change. -->
- Transposition deep lanes (ABC-081, `src/transposition.test.ts`): `SEARCH_DEEP=1 npx vitest run
  src/transposition.test.ts` <!-- exit 0, 40 passed (25 default), 47.7 s --> and `ENGINE_DEEP=1 npx
  vitest run src/transposition.test.ts` <!-- exit 0, 26 passed (25 default), 4.8 s -->
- Zobrist deep lane (ABC-075): `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` <!-- exit 0,
  33 passed (32 default), 37.0 s -->
- Quiescence deep lane (ABC-079): `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` <!-- exit 0,
  37 passed (29 default), 1.8 s -->
- Test (single file): `npx vitest run <path>`
- Coverage: `npx vitest run --coverage` <!-- exit 0, 856/856 on 30 files. Not in
  `quality.mandatory_gates` — a measurement, not a gate. TRAP: `src/cli.ts`'s tests SPAWN it as a
  child process and v8 coverage does not cross a process boundary, so it reads uncovered while
  thoroughly tested. -->
- Coverage (`src/` only — the other denominator; neither is agreed): `npx vitest run --coverage --coverage.include='src/**'` <!-- exit 0 -->

### Acceptance

- Acceptance / BDD scenarios: `UNKNOWN - verify` <!-- host runner, e.g. cucumber-js / behave / `bddgen && playwright test` — names live here only as examples, never as a hard command -->

### Test integrity

- Skip-count capture: `npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` <!-- verified: returns an integer (0 with no tests). Other runners: jest `jest --json | jq '.numPendingTests'`; pytest `pytest --json-report --json-report-file=- | jq '.summary.skipped'`; go `go test -json ./... | jq -s '[.[]|select(.Action=="skip")]|length'` — examples only. Undeterminable → `UNKNOWN - verify`, never a silent 0. -->

- Test-integrity check (the gate's step): `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` <!-- verified: `No findings.`, exit 0, at skip count 0. `.grugops/test-skips.md` is HUMAN-OWNED — an agent may READ and RUN this, never write a row into it. -->

### Lint

- Lint (all): `npm run lint` <!-- biome check . -->
- Lint (single file, autofix): `npx biome check --write <path>`
- Format (single file): `npx biome format --write <path>`

### Typecheck

- Typecheck (single file): `UNKNOWN - verify` <!-- tsc is project-wide; no single-file mode. -->
- Typecheck (project): `npm run typecheck` <!-- tsc --noEmit -->

### Build

- Build (use sparingly): `npm run build` <!-- currently `tsc --noEmit` — type-checked, nothing
  published until EPIC-006. Honest naming: a typecheck wearing the build slot's name. -->
- Docs build / link-check: `UNKNOWN - verify`
- Clean / reset: `UNKNOWN - verify`

### E2E

- E2E: `UNKNOWN - verify` <!-- no runnable game until EPIC-006; `quality.ui_e2e` is
  `ui-or-critical-path` and this project has no UI surface yet -->

<!-- Command slots filled 2026-07-22 (ABC-008); every command was RUN before being recorded. A slot
  still `UNKNOWN - verify` is genuinely unknown — nothing was guessed. -->

### Stack

TypeScript on Node (>= 22), ESM. Vitest for tests, Biome for lint + format. Node runs `.ts`
files directly via built-in type stripping, so there is no bundler or transpile step in dev.

## Delivery

- Board: `plans/board.md`
- Cadence + WIP: `.grugops/factory.config.json`
- Traceability: `plans/traceability.md`

## Process rules (this project)

Two rules the owner adopted 2026-08-13, in this order. Full evidence and controls:
`.grugops/context/audit-delivery/notes/`.

**1. Criteria review happens at the `Ready for Dev` exit, not at a gate.** The Orchestrator re-reads
acceptance criteria against the built tree before a ticket enters `In Development` — not a DoR
re-run (DoR asks if criteria are well formed; this asks if they still match what exists). **Control:**
QE-found gaps < 3/ticket and backward moves < 0.5/ticket for five consecutive tickets, while
`Ready for Dev`-exit gaps RISE. Falling at both ends means the rule is hiding, not working.

**2. Ticket prose has a size budget; overflow goes to context notes.** Acceptance criteria, scope and
risks stay in the ticket; measurements, alternatives and gate narration go to
`.grugops/context/<task>/notes/` (Workflow 16). **Control:** median of the next ten cut tickets
≤ 300 lines, criterion gaps at QE do not rise. Shorter tickets bought with worse gaps mean the
budget cut rigour, not prose — revert it.

**Precedence.** The kit is silent on both — no re-read step, no ticket-prose budget. These ADD a
project step; they contradict nothing in the read-only kit.

## Branching model

Trunk-based: `main` is the only long-lived branch. Work happens on a short-lived `grugops/<task>`
branch and merges to `main` as soon as it is green. No `develop`, no release branches.

The owner authorized merges to `main` standing (2026-08-06) and made merge/test explicitly the
agent's **per ticket** (2026-08-15) — the gate still binds and the authority is his and revocable.
Full text, the authority: `memory-bank/60-progress.md` §§ "Standing directive — the branching model,
and who turns the merge key" and "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket. 2026-08-15." — this is a pointer to them.

The commit-side branch guard in `agent-factory/_commit-convention.md` still holds: commit on
`grugops/<task>`, never `main` directly.

**Kit override 1 of 3** (count and the "reader who counts four" line: `## QE validation authority`).
The kit says "agents never merge" (`_commit-convention.md` §(c), workflows 04/05/12) — read-only,
cannot carry a project override. Merge to `main` in THIS project is allowed once all tests pass and
the ticket is done, never before.

**Config trap.** `.grugops/factory.config.json`'s `autonomy: "pr"` has no dial for "agents may
merge" — left alone rather than faked; the merge authority lives in `memory-bank/60-progress.md`. No
git remote, so `pr` has always meant "branch + gate": nothing is pushed, no PR opened.

## Test and UAT authority

Running a ticket's tests and conducting its UAT are the agent's, standing since 2026-08-15 alongside
the per-ticket merge authority above — gate still binds, authority is the owner's and revocable.

**An agent-run UAT is not a human's signature.** `context.human_admission` is `off`; no `finding` is
admissible, so a UAT result is a `decision`/`observation`, never a stamp.

**2026-08-16 — the owner's word in session IS the `In UAT` signature.** Offered his word, a
self-written file, or a redefinition of the exit; chose his word, and a green agent report does NOT
count as his acceptance (`ABC-065`, `ABC-066` accepted this way). **NOT a kit override** — it
satisfies `agent-factory/workflows/06-uat-pack.md`'s named-human-signoff requirement; the owner IS
that human.

**2026-08-17 — a ticket whose delivered diff carries ZERO PRODUCTION LINES has UAT WAIVED, standing.**
`Ready for UAT` → `Done`, no UAT run. Measured from git, never asserted:
`git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` must be
**empty** — any production line and the rule does not apply. **A waiver is not a signature:** `Done`
here means merged and gated, never human-accepted. Composes with, does not supersede, 2026-08-16.
**This IS a kit override — the third** (with the branching model and the deployment posture); the
kit's UAT stage is unconditional. Close-out: `ABC-063` by his named word, `ABC-064` by the rule
applied to a measurement.

**Two misreadings to refuse in advance:** an agent still may **not** self-sign — the ruling is the
owner's word signs, never a green report; and the recorded acceptance is an agent's
**transcription** of that word (`human_admission` is still `off`, no `human:<name>` stamp exists),
never a stamp.

Scope is the `In UAT` exit signature only — `quality.gate_enforcement` stays `blocking`,
`production_requires_human_confirmation` stays `true`. Authority: `memory-bank/60-progress.md` §§
"Standing directive — deploy is ALLOWED and NOT NEEDED... 2026-08-15.", "...the owner's word in
session IS the `In UAT` signature. 2026-08-16." and "...ZERO PRODUCTION LINES has its UAT WAIVED,
standing. 2026-08-17." — this is a pointer to them, not the text itself.

## QE validation authority

**Every ticket gets a `qe-e2e` hop and QE's recorded verdict before leaving `In Review`; none reaches
`Done` without one.** Owner's, 2026-08-17, standing and revocable.

**Forward-only.** `ABC-068`, `ABC-061`–`ABC-064` were gated and merged with no QE hop and stay closed
(no retro pass); the residual exposure is named: +435/−11 lines of `src/cli.test.ts` assertions
never reviewed by QE.

**QE is NOT UAT** — conflating them is what let QE go missing for five tickets. The zero-production-
lines waiver (`## Test and UAT authority`) waives UAT only, completely unamended; a test-only ticket
still gets QE, and the 2026-08-16 signature ruling stands unamended too.

**NOT a kit override** — `agent-factory/workflows/04-ticket-to-pr.md` step 5 already required this
hop; this re-affirms, not adds — the same shape as the 2026-08-16 ruling. **This project's kit
overrides remain THREE: the branching model, the deployment posture, and the zero-production-lines
UAT waiver. A reader who counts four is wrong.**

`quality.mandatory_gates` is unchanged — QE's hop is a workflow step, not a gate command. Authority:
`memory-bank/60-progress.md` § "Standing directive — EVERY ticket passes through QE's validation. QE
dispatch resumes. 2026-08-17."

## Deployment posture

This project deploys nowhere; it runs locally, from source. No container, manifest, CI or git
remote, and no release has ever been cut. A CLI entry point exists since `ABC-042` (`Dev / run` =
`npm run chess`) but changes none of this — it runs `src/cli.ts` from source, in place. **Runnable
is not deployable**: `package.json` is `private: true`, no `bin`/`main`/`exports`/`files`.

**Present posture, explicitly revisitable** — owner said "currently"/"for now" (2026-08-06); revisit
trigger `EPIC-006` (packaging) decides HOW it is eventually distributed (npm, binary, `git clone` —
undecided). Ruling, evidence, what's preserved for that day:
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` — the authority; this is a
pointer.

**Who holds the deploy key changed 2026-08-15; where anything runs did not.** The owner granted
deploy authority to the agent AND re-affirmed no deploy is needed, in one sentence — both his.
Authority: `memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED;
merge, test and UAT are the agent's, per ticket. 2026-08-15." `ADR-0007` is Architect/Design's to
amend under it. Config: `default_stack.deploy` is `none-local-only`, `environments` is `["local"]`.

**Nothing here relaxes anything.** `production_requires_human_confirmation` stays `true` — the grant
deliberately did not flip it; moving it is the owner's word, never an inference from the grant.
"Deploys nowhere today" is not "decided never"; "may deploy" is not "has anything to deploy" — no
release machinery was added or removed.

**Kit override 2 of 3** (see `## QE validation authority` for the count and its "reader who counts
four" line). The kit hardcodes a `dev → staging → prod` path (`agent-factory/workflows/12-release.md`
step 3; `agent-factory/roles/release-manager.md`) — read-only, cannot carry a project override.
`.grugops/factory.config.json`, `ADR-0007` and `memory-bank/` win here; the human-confirmation
requirement stands unchanged.

## Safety rules

- Do not read or expose secrets.
- Do not run destructive commands.
- Merging gated work to `main` is authorized standing by the owner — see `## Branching model`. It
  is approval to merge work that PASSED, never to skip or soften a gate (`quality.gate_enforcement`
  is `blocking`): run the gates on the branch tip before and on `main` after, and record both.
  Running a ticket's tests and conducting its UAT are the agent's on the same terms — see
  `## Test and UAT authority`.
- **Deploy is allowed, and there is nothing to deploy.** Both halves came from the owner in one
  sentence (2026-08-15): the authority was granted and the need was denied — this project stays
  local. Read it as neither "deploy freely" nor "the old prohibition stands". There is no artifact,
  no target and no release machinery today, so there is no deploy to perform; `EPIC-006` is where
  that could change. `production_requires_human_confirmation` is `true` and the grant did not flip
  it — it binds as written, and moving it is the owner's word, never an inference from the grant.
  See `## Deployment posture`.
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
