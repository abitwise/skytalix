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
  `--ascii`, `--unicode`.
  IT PLAYS A GAME as of ABC-043 (2026-08-19) — the line above described a board-printer and is kept
  for the row count and the option set, which are unchanged. It prints the board, prompts with `> `,
  reads one line per turn and answers with the merged engine, which occupies UP TO 3 SECONDS PER
  MOVE (`DEFAULT_BUDGET_MS`): `--colour black` opens with the engine, so the first board sits there
  thinking before the prompt appears, and that is the product working. RUN 2026-08-19 at the ABC-043
  branch tip: `node src/cli.ts` on a closed stdin prints one board, the prompt and `input ended`,
  and exits 0 (real 0.07 s); `--colour black` on a closed stdin prints two boards and exits 0
  (real 3.09 s, one engine ply). EXIT CODES: 0 when the session ran, 1 for a refused command line,
  70 for an internal error — a bug that ended the session, which is never a chess result.
  Pass an option AFTER `--`: `npm run chess -- --colour black` — RUN 2026-08-15 at `4e9ed1d`, exit 0,
  black-bottom board. The separator is load-bearing; do not tidy this example away. Without it npm
  keeps the flag: `npm run chess --ascii` (RUN 2026-08-15 at `4e9ed1d`, npm 11.7.0) warns `Unknown
  cli config "--ascii"` on stderr, runs `node src/cli.ts` with NO arguments, prints the DEFAULT board
  and exits 0 — the option is silently discarded and stdout looks like success. -->
- Perft harness (move-gen correctness + nodes/sec, ABC-006): `npm run perft`
- Perft deep counts (opt-in slow suite): `PERFT_DEEP=1 npx vitest run src/perft.test.ts`
- Spike benchmark (throwaway, ABC-008): `npm run spike:perft [depth]`

### Test

- Test (all): `npm test` <!-- vitest run -->
- Search deep lane (opt-in slow suite, ABC-077): `SEARCH_DEEP=1 npx vitest run src/search.test.ts`
  <!-- RUN 2026-08-17 at the ABC-077 branch tip: exit 0, 41 passed (28 in the default lane), 23.0 s.
  Unset, the deep cases are NOT DEFINED rather than skipped, so the gate's skip count stays 0 —
  the same shape as PERFT_DEEP. It holds the expensive REPETITIONS of A1-A7 (the depth-3 sweep on
  five of the six perft positions, A2's own kiwipete-depth-3 case, the 204-position broad corpus,
  and the depth-7 mate-in-2-vs-mate-in-4 case); every criterion is also answered in the default
  lane. Run it at the QE hop and after any change to src/search.ts. -->
- Engine deep lane (opt-in slow suite, ABC-078): `ENGINE_DEEP=1 npx vitest run src/engine.test.ts`
  <!-- RUN 2026-08-18 at the ABC-078 branch tip: exit 0, 23 passed (17 in the default lane),
  98.7 s. Unset, the deep cases are NOT DEFINED rather than skipped, so the gate's skip count
  stays 0 — the same shape as PERFT_DEEP and SEARCH_DEEP. It holds every WALL-CLOCK case, which
  is why it is opt-in: `plans/nfr-catalog.md`'s standing rule keeps wall-clock assertions out of
  the default lane, and the default lane runs entirely on an INJECTED clock. It carries `A1`'s
  30-position run at the 3 s budget (90.4 s of the 98.7), `NFR-005`'s depth-in-budget
  measurement, and the real-clock repetitions of `A2`, `A3`, `A5` and `A7`. Run it after any
  change to `src/engine.ts`. -->
- Input-seam deep lane (opt-in slow suite, ABC-037): `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`
  <!-- RUN 2026-08-19 at `298bb95`: exit 0, 33 passed, 0.28 s. COUNT YOUR RUN: 33 is the whole lane;
  32 means NODE_OPTIONS was dropped and the external-memory retention guard did not run — it exits 0
  either way, so the count is the only signal. 29 is the default lane. Unset, the deep cases are NOT
  DEFINED rather than skipped, so the gate's skip count stays 0 — the same shape as PERFT_DEEP,
  SEARCH_DEEP and ENGINE_DEEP. It holds the BREADTH plus that guard: a 16 MiB unterminated-flood
  survival row, the chunk-boundary permutation sweep, the 10,000-character totality row. Every
  ACCEPTANCE criterion is answered in the default lane. It is opt-in because ABC-108 has the default
  lane at or over NFR-008's 13 s CPU clause, so this ticket did not claim N8-LANE's 650 ms. Run it
  after any change to src/line-input.ts — QE 2026-08-19 measured two mutants that die in this lane
  and in nothing else. TRAP, and read all of it: heapUsed must never be how a memory bound gets
  asserted here. A build retaining a 16,777,216-character line reports 0.01 MiB of heapUsed growth,
  so a heapUsed row is green whichever build it runs against; one was written, watched NOT fail, and
  DELETED rather than shipped green — do not put it back. But the bound IS testable, and heapUsed is
  not blind to cons-strings: it accounts a FLATTENED 16 MiB string in full. An unflattened rope does
  read ~0.02 MiB, so that account was HALF TRUE, and half-true aimed at the wrong field is worse than
  wrong: it ends the search. The retained leaves are EXTERNAL string data, and
  process.memoryUsage().external after a gc() separates the builds 0.00 vs 32.00 MiB (33,554,472 B,
  reproduced to the byte from a second tree) — which is why --expose-gc is in the command. Numbers
  and the guard itself are in .grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/ and its
  repair-ABC-037-2026-08-19/ sibling, not restated here. The rule this cost us: never ship a memory
  guard you have not watched go RED. -->
- Transposition deep lanes (ABC-081, `src/transposition.test.ts`): `SEARCH_DEEP=1 npx vitest run
  src/transposition.test.ts` <!-- RUN 2026-09-25 at `54565e8`: exit 0, 40 passed (25 default), 47.7 s.
  Holds A1/A2/A3/A4/A5's depth-4/5 hit-rate, node-savings and mate-reuse pins. --> and `ENGINE_DEEP=1
  npx vitest run src/transposition.test.ts` <!-- RUN 2026-09-25 at `54565e8`: exit 0, 26 passed
  (25 default), 4.8 s. Holds A7's 1 s vs 3 s heapUsed/arrayBuffers growth reading. Same two vars as
  `src/search.test.ts` / `src/engine.test.ts` above, applied to this file; unset, NOT DEFINED rather
  than skipped, same shape as PERFT_DEEP. -->
- Zobrist deep lane (ABC-075): `ZOBRIST_DEEP=1 npx vitest run src/zobrist.test.ts` <!-- RUN 2026-09-25
  at `54565e8`: exit 0, 33 passed (32 default), 37.0 s. Unset, NOT DEFINED rather than skipped, same
  shape as PERFT_DEEP. Holds A1/A2's zobristKeyAfterMove-vs-full-scan-oracle walk (11,024,485 nodes,
  0 mismatches, 0 drift) within 4 plies of every perft position. -->
- Quiescence deep lane (ABC-079): `SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts` <!-- RUN
  2026-09-25 at `54565e8`: exit 0, 37 passed (29 default), 1.8 s. Same var as `src/search.test.ts` /
  `src/transposition.test.ts` above, applied to this file. Holds A3's 200+-position corpus sweep under
  the `QUIESCENCE_MAX_PLY` cap and A5's depth-2/3 node-count-multiplier pins (kiwipete, position-6). -->
- Test (single file): `npx vitest run <path>`
- Coverage: `npx vitest run --coverage` <!-- RUN 2026-08-15 at `daa20c4` (this hop changed no code):
  exit 0, 856/856 on 30 files. `@vitest/coverage-v8` is in `devDependencies`; no npm script and no
  `vitest.config.ts` key invokes it, and `coverage` is NOT in `quality.mandatory_gates` — a
  measurement you run, not a gate that runs you. Figures, and which denominator decides whether this
  project meets `quality.coverage_threshold` (`0.8`), are in
  `.grugops/context/owner-grants-2026-08-15/notes/` — read them before quoting a number. TRAP from
  that note: `src/cli.ts`'s tests SPAWN it as a child process and v8 coverage does not cross a
  process boundary, so it reads uncovered while being thoroughly tested. -->
- Coverage (`src/` only — the other denominator; neither is the agreed one):
  `npx vitest run --coverage --coverage.include='src/**'` <!-- RUN 2026-08-15 at `daa20c4`: exit 0. -->

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

The project owner authorized merges to `main` standing (2026-08-06), and on 2026-08-15 made merge
and test explicitly the agent's **per ticket**. Of the three limits the 2026-08-06 directive set,
**one is retired and two stand**: deploy is no longer excluded — see `## Deployment posture`, which
is where that grant and its own limits live — while the gate still binds and the authority is still
the owner's and revocable. Both directives, with their words, reading and limits, are in
`memory-bank/60-progress.md` §§ "Standing directive — the branching model, and who turns the merge
key" and "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test and UAT are the
agent's, per ticket. 2026-08-15." **Those sections are the authority; this is a pointer to them.**

The commit-side branch guard in `agent-factory/_commit-convention.md` still holds — commit on the
`grugops/<task>` branch, never directly on `main`. What the owner changed is what happens *after*
the gate is green, not how work is produced.

**Precedence, so nobody has to guess.** The kit is shared and project-agnostic, so it still reads
"agents never merge" (`_commit-convention.md` §(c), workflows 04, 05, 12). It is read-only and
cannot carry a project override. Merge to main is allowed, deploys are currently not implemented.
Merge to `main` in THIS project only when all tests pass and ticket is done, never before.

**Config trap.** `.grugops/factory.config.json` says `autonomy: "pr"`, which the kit defines as
"branch + open a PR (agents never merge)". The dial allows only `diff`/`branch`/`pr` and there is
no `branching_model` key, so no value can express "agents may merge" — the config was left alone
rather than given a fake dial nothing reads, and `memory-bank/60-progress.md` is where the merge
authority actually lives. This repo also has no git remote, so `pr` has always meant "branch +
gate" here: nothing is pushed and no PR is opened.

## Test and UAT authority

Running a ticket's tests and conducting its UAT are the agent's, granted standing by the owner
(2026-08-15) alongside the per-ticket merge authority above. The same two limits apply: the gate
still binds, and the authority is the owner's and revocable. Tickets closed before `ABC-042` all
deferred UAT to `EPIC-006` because nothing was exercisable; `npm run chess` ended that reason.

**An agent-run UAT executes the business scenarios against a real build and reports the result. It
is NOT a named human's acceptance signature.** `context.human_admission` is `off` and no `finding`
is admissible here, so a UAT result is recorded as `decision` / `observation` like every other
result and carries no stamp. Write it so "UAT passed" can never later be read as a human having
accepted the work.

**The signature question was put to the owner directly on 2026-08-16 and he answered it: his word in
session IS this project's `In UAT` exit signature.** He was offered three options — his word, a file
he writes himself, or a redefinition of the exit — and was told explicitly that a green agent report
would NOT be treated as his acceptance. On the same word he accepted `ABC-065` and `ABC-066`.

**A whole class of tickets no longer needs signing at all, since 2026-08-17.** A ticket whose
**delivered diff carries zero production lines** has its UAT **waived standing** — `Ready for UAT` →
`Done`, no UAT conducted, no per-ticket asking. **The criterion is measured from git, never
asserted:** `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`
must come back **empty**. **ANY production line and the rule does not apply** — not "mostly test",
not "one trivial line"; then the owner's word is needed as before. **A waiver is not a signature:** a
waived ticket has had NO UAT and carries NO human acceptance, so `Done` under this rule means
*merged and gated*, never *accepted by a human*. It waives UAT and nothing else, and it is the
owner's and revocable. **It does NOT supersede the 2026-08-16 ruling — they compose:** that one says
who signs a UAT that is conducted, this one says which tickets need no signing. **Unlike 2026-08-16,
this one IS a kit override** — the kit's UAT stage is unconditional and carries no waiver — and it is
the third, alongside the branching model and the deployment posture. Authority, reasoning and the
2026-08-17 close-out (`ABC-063` by his named word, `ABC-064` by the rule applied to a measurement):
`memory-bank/60-progress.md` § "Standing directive — a ticket whose delivered diff carries ZERO
PRODUCTION LINES has its UAT WAIVED, standing. 2026-08-17."

**The 2026-08-16 answer SATISFIES the kit's requirement; it does not override it.**
`agent-factory/workflows/06-uat-pack.md` and `agent-factory/roles/uat-planner.md` make the `In UAT`
→ `Ready to Release` exit a **named human's signoff** and forbid an agent self-signing. **The owner
IS that named human and he gave it.** What was missing was never his authority — only a mechanism to
record it. So this is NOT one of this project's kit overrides; do not list it with the branching
model or the deployment posture. **The 2026-08-17 waiver above IS one — different case, and the
reasoning for the split is in `memory-bank/60-progress.md`, not to be re-derived here.**

**Two things follow, and both are the misreadings to expect.**

- **An agent still may not self-sign.** The ruling is that the **owner's word** signs. It does not
  say a green agent report signs, and it licenses no agent to sign on his behalf. Conduct the UAT,
  report the result, never self-sign.
- **The recorded acceptance is an agent's transcription, not a stamp.**
  `context.human_admission` is still `off` and the owner did NOT flip it, so no `human:<name>` stamp
  exists and no `finding` is admissible. His acceptance is carried as a hand-authored `decision` note
  in git. Record that fidelity level honestly, and do not read this ruling as having moved the flag.

Scope is the `In UAT` exit signature only. `quality.gate_enforcement` is still `blocking`,
`production_requires_human_confirmation` is still `true`, and the merge/deploy posture is unchanged.

The authority is `memory-bank/60-progress.md` §§ "Standing directive — deploy is ALLOWED and NOT
NEEDED; merge, test and UAT are the agent's, per ticket. 2026-08-15.", "Standing directive — the
owner's word in session IS the `In UAT` signature. 2026-08-16." and "Standing directive — a ticket
whose delivered diff carries ZERO PRODUCTION LINES has its UAT WAIVED, standing. 2026-08-17."
**Those sections are the authority; this is a pointer to them.**

## QE validation authority

**Every ticket gets a `qe-e2e` hop and QE's recorded verdict before it may leave `In Review`. No
ticket reaches `Done` without one.** The owner's, 2026-08-17, standing and revocable.

**It is forward-only.** `ABC-068`, `ABC-061`, `ABC-062`, `ABC-063` and `ABC-064` were gated and
merged with no QE hop; the owner declined a retro pass over them and they stay closed. The residual
exposure that accepts is named, not glossed: **+435/−11 lines of assertions in `src/cli.test.ts`
were never reviewed by QE.**

**QE IS NOT UAT, and conflating them is the misreading to refuse in advance** — it is exactly what
let QE go missing for five consecutive tickets. The 2026-08-17 zero-production-lines waiver waives
**UAT and nothing else** and stands **completely unamended**: a test-only ticket still skips UAT,
and now still gets QE. The 2026-08-16 signature ruling stands unamended too.

**Precedence, so nobody has to guess. This is NOT a kit override.**
`agent-factory/workflows/04-ticket-to-pr.md` **step 5** already required this hop, so this
RE-AFFIRMS a rule that was already binding rather than adding one — the same shape as the 2026-08-16
ruling, which satisfied a kit requirement. **This project's kit overrides remain THREE**: the
branching model, the deployment posture, and the zero-production-lines UAT waiver. A reader who
counts four is wrong.

No config value changed. `quality.mandatory_gates` is unchanged — QE's hop is a workflow step, not a
gate command. The authority is `memory-bank/60-progress.md` § "Standing directive — EVERY ticket
passes through QE's validation. QE dispatch resumes. 2026-08-17." **That section is the authority;
this is a pointer to it.**

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
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`. **That ADR is the authority on
the posture; this is a pointer to it.**

**Who holds the deploy key changed on 2026-08-15, and where anything runs did not.** The owner
granted the deploy authority to the agent and in the same breath re-affirmed that this project does
not need deploying and stays local, naming a condition of his own for when that ends. **Both halves
are his**, so this section is confirmed by that grant, not weakened by it. The authority is
`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test
and UAT are the agent's, per ticket. 2026-08-15."; `ADR-0007` is Architect/Design's to amend under
it. The config carries the fact: `default_stack.deploy` is `none-local-only` and `environments` is
`["local"]`.

**Nothing here relaxes anything.** `production_requires_human_confirmation` is still `true` — the
2026-08-15 grant **deliberately did NOT flip it**, and `ADR-0007` carries a detection row for that
flag being found `false` or argued obsolete. Record its real state and leave it alone; do not read
the deploy grant as having moved it, and do not argue it obsolete because nothing deploys today. The
branching model's 2026-08-06 deploy limit is the one thing that DID move, and it moved by a later
grant of the owner's, not by this posture. "Deploys nowhere today" is not "decided never to deploy",
and "may deploy" is not "has anything to deploy": no release machinery, board column or workflow was
removed, and none was added.

**Precedence, so nobody has to guess.** The kit is shared and project-agnostic, so it still hardcodes
a `dev → staging → prod` promotion path (`agent-factory/workflows/12-release.md` step 3;
`agent-factory/roles/release-manager.md`'s release-record template). It is read-only and cannot carry
a project override. On this project's deployment posture — and, since 2026-08-15, on who may turn
the key — `.grugops/factory.config.json`, `ADR-0007` and `memory-bank/` win; the kit's never-deploy
line is overridden HERE and nowhere else, and everything else in those files — the
human-confirmation requirement above all — stands unchanged.

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
