# Runbook
_Updated: 2026-08-06 by Architect/Design (task `refinement-deploy-posture-2026-08-06`) — **first
fill**; this file was the shipped empty template until today. It is short because there is genuinely
almost nothing to operate, and every "none" below was measured against the repo rather than assumed._
_Updated: 2026-10-23 by Architect/Design (task `arch-runbook-operate`), verified on `main` `4ddae2c8`.
§ Operate was rewritten and the old text is kept below the new text as dated history. § Roll back got a
pointer correction. § Deploy carries its own dated brackets._
_Updated: 2026-10-23 by Architect/Design (task `arch-runbook-deploy-holder`), on `main` `ad9655fc`. § Deploy
and § On-call say who holds deploy. Both now carry a dated correction to the owner's directive of
2026-08-15. The old wording stays in place above each correction._
_Updated: 2026-10-24 by Architect/Design (task `arch-runbook-ABC-212`), on `grugops/scribe-ABC-212`
`2ba55ea7`. § Operate names levels 1–7 (`ABC-212` A11). The old wording is kept in a dated bracket._
_Updated: 2026-10-24 by AGENTS.md Scribe (task `scribe-runbook-ABC-212`), on `grugops/qe-ABC-212`
`052ae3ad`. § Operate says the `thinking...` line prints first (`QE-212-c`). The old wording is kept in a
dated bracket._

<!--
  FORMAT — read before you fill this in. (clear voice; this is a technical file, not a role prompt.)

  How to operate, deploy, and roll back in production. Ships EMPTY — fill per-project during
  bootstrap. Production steps are safety-critical: a human confirms a deploy or rollback;
  agents never deploy to production unattended. Keep it short and exact.
-->

> **Read this first.** This project **deploys nowhere and runs locally** — present posture,
> explicitly revisitable, revisit trigger **`EPIC-006`** (packaging). The architecture fact is in
> `memory-bank/30-architecture.md` § "Deployment posture"; the why, the alternatives weighed and the
> falsifiers are in `memory-bank/50-decisions/ADR-0007`. **This file records only what is
> operationally true today** — it is deliberately not a plan for a deployment that does not exist.

## Operate

**[REWRITTEN 2026-10-23 (`arch-runbook-operate`), verified on `main` `4ddae2c8`.** The 2026-08-06
text below this bracket said the game could not be run. That stopped being true at `ABC-042`.]**

**There is still nothing running to operate.** There is no service, daemon, scheduled job, hosted
instance or database. There are two local programs. Both run from source in a clone on Node >= 22.
The clone is the channel, per `ADR-0018`.

- **The game: `npm run chess`.** This runs `node src/cli.ts` (`ABC-042`).
  - Flags: `--colour white|black|random`, `--difficulty 1|2|3|4|5|6|7` (default 5, `ADR-0045`), and
    `--ascii` or `--unicode`.
  - Levels run from `1` (weakest) to `7` (strongest). Since `ABC-212`, the default 5 is no longer the
    hardest level. Level 5 thinks up to 3 s a move, level 6 thinks 5 s and level 7 thinks 30 s. Their
    hard ceilings are 7 s and 32 s, per the `NFR-004` text the owner accepts (`ADR-0045` § AMENDMENT
    2026-10-24). At level 7, the `thinking...` line prints at once, then expect about half a minute with
    no further output on each engine move.
  - **[CHANGED 2026-10-24 (`scribe-runbook-ABC-212`, `QE-212-c`), checked against the QE reading
    `qe-ABC-212/…f9560997` (A10: the thinking frame was drawn 1 ms after Enter, before the search).**
    The old wording was "expect about half a minute with no output on each engine move". It read as
    if nothing printed; only the output after the `thinking...` frame is silent.]
  - Pass flags after `--`, as in `npm run chess -- --colour black`. `AGENTS.md` § Commands
    "Dev / run" explains why.
  - On a terminal, `ABC-200` asks for each flag the command line left out, colour first, before the
    first board: `colour (white|black|random) [white]: ` then `difficulty (1|2|3|4|5|6|7) [5]: `.
  - **[CHANGED 2026-10-24 (`arch-runbook-ABC-212`, `ABC-212` A11), checked on `grugops/scribe-ABC-212`
    `2ba55ea7` against `src/cli-options.ts`, `src/levels.ts` and `src/startup-questions.ts`.** The old
    wording was `--difficulty 1|2|3|4|5` (default 5, `ADR-0045`) and the prompt
    `difficulty (1|2|3|4|5) [5]: `. Level 5 was the hardest level then.]
  - Enter keeps the default in brackets. A wrong answer is named, and the same question is asked
    again. End of input at a question ends the session with exit 0.
  - With stdin or stdout not a terminal, nothing is asked and the defaults apply.
  - In the game, `help` lists the commands.
  - Exit codes: 0 for a normal end, 1 for a refused command line (the usage line goes to stderr),
    70 for an internal error.
- **The UCI engine, `skytalix`: `npm run uci`.** This runs `node src/uci.ts` (`ABC-168`, `ADR-0044`).
  - It speaks UCI on stdin and stdout, for a GUI or a tester. It takes no arguments.
  - Exit codes: 0 on `quit` or end of input, 1 for any argument (the usage line goes to stderr),
    70 for an exception.
  - `npm run build` (`tsc -p tsconfig.build.json`) emits `dist/uci.js`. That file is the target of
    `package.json`'s `bin` `skytalix`. `dist/` is git-ignored. Nothing is installed or published;
    see § Deploy.

**Development and verification commands live in `AGENTS.md` § Commands and are not copied here.** That
covers install, `npm test`, the opt-in `*_DEEP` lanes, lint, typecheck, build and perft. Their receipts
are in `memory-bank/90-agents-md-command-log.md`.

**[Dated history: the 2026-08-06 text, superseded by the bracket above. It is not current.]**

**There is nothing running to operate.** No service, no daemon, no scheduled job, no hosted
instance, no database. The product is a single-player terminal chess game in one local process, and
that process does not exist yet — only the rules core is built.

**The game cannot be run.** There is no CLI entry point: `package.json` has no `bin` and no `start`
script, and `src/` has no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify` for exactly
this reason, and it stays `UNKNOWN - verify` until `EPIC-006` builds one. **Do not invent a run
command here** — a fabricated command in a runbook is worse than an admitted gap.

What *can* be executed today is development and verification only: install, test, lint, typecheck,
build, and the perft harness. **Those commands live in `AGENTS.md` § Commands and are deliberately
not duplicated here** — that file is their single source, and every command in it was run before it
was recorded there.

**[End of the 2026-08-06 history. The paragraph below is still current. Both programs are local
processes, started by a person at a terminal or by a GUI on the same machine.]**

Monitoring, alerting, log aggregation, dashboards, SLO burn-rate: **none exist**, and none is owed
while nothing runs anywhere but a terminal a developer opened.

## Deploy

**There is no deploy, and there is no deploy procedure to write down.**

Verified against the repository on 2026-08-06 rather than read off the config:

- No Dockerfile, compose file, chart, manifest or IaC — the repo contains **no YAML file at all**.
- No CI, so no CI deploy step: `.github/` holds one file (`copilot-instructions.md`) and there is no
  `.github/workflows/`.
- Nothing publishable: `package.json` is `private`, with no `main`, `exports` or `bin`; the build is
  `tsc --noEmit` and emits nothing.
- Nowhere to push: the repo has **no git remote**. *2026-10-24 (`ADR-0049` row 31): no longer true. The
  owner added a remote on 2026-10-23 and the repository is public. Pushing is the owner's; agents never push.
  Still nothing is deployed.*
- Nothing released: `plans/releases/` holds only `.gitkeep`.

`.grugops/factory.config.json` now records this instead of implying a cluster: `default_stack.deploy`
is `none-local-only` and `environments` is `["local"]`.

**"local" is where the code runs, not a target anything is deployed to.** The source is run in
place; nothing is shipped to it, and there is no environment to promote *between*.

**Two things stay true anyway, and this file is not a licence to weaken either:**

- **`production_requires_human_confirmation` is `true`, and a human holds deploy.** It does not
  become obsolete because there is no production today — it is the rail for the day there is one.
- **Merge approval is not deploy approval.** The owner's standing merge directive of 2026-08-06
  (`memory-bank/60-progress.md`) says so in as many words: *"DEPLOY IS NOT INCLUDED."*

**[CORRECTED 2026-10-23 (`arch-runbook-deploy-holder`).** The two bullets above are older than the
owner's directive of 2026-08-15. The Orchestrator ruled the gap drift against that recorded
directive, not a new governance call. The authority is `memory-bank/60-progress.md` § "Standing
directive — deploy is ALLOWED and NOT NEEDED; merge, test and UAT are the agent's, per ticket.
2026-08-15." It quotes the owner verbatim: *"I allow you to deploy, but this project does not need to
be deployed, it is local for now until completed, mark that down."* Read the bullets this way:

- **"a human holds deploy" is no longer true. The agent may deploy, and no deploy is needed.** The
  directive says: *"What moved is who holds the deploy key, not where anything runs."* Nothing runs
  anywhere but locally: *"it is local for now until completed"*.
- **"`production_requires_human_confirmation` is `true`" still holds.** The directive says:
  *"`production_requires_human_confirmation` is STILL `true`. THIS ENTRY DID NOT FLIP IT."* A human
  confirms anything production. Only the owner's explicit word moves the flag; the grant does not.
- **"DEPLOY IS NOT INCLUDED" is retired.** The directive's table marks that 2026-08-06 limit *"RETIRED
  by grant 1 — deploy is now allowed (and not needed)"*. Merge approval is still not deploy approval,
  because they are two separate grants. `ADR-0007` clause 4 was amended the same way on 2026-08-15.]**

**How this project will eventually be distributed is UNDECIDED** — npm, a standalone binary, a
`git clone` — and that is `EPIC-006`'s question, not this file's. When `EPIC-006` answers it, this
section is the first place that has to change.

**[CHANGED 2026-09-19, as the sentence above said it would be.** The owner ruled: *"1. git clone +
npm start works for now"* (Olger Oeselg, in session, 2026-09-19). The channel is **`git clone` +
`npm install` + `npm run chess`** — the script is `chess`, there is no `start` script — recorded in
`memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md`, which supersedes
`ADR-0007` clause 5 only. Nothing is published, built or deployed; there is still no git remote, so
today the clone path is realised only on the author's machine. Everything else in this file stands.]**

*2026-10-24 (`ADR-0049` row 32):* the bracket above's *"there is still no git remote, so today the clone path is
realised only on the author's machine"* is no longer true. The owner added a remote on 2026-10-23 and the
repository is public, so anyone can take the clone path. The channel is unchanged (`ADR-0018` § Note
2026-10-24).

**[CORRECTED 2026-10-23 (`arch-adr0018-bin-note`, approved by the owner `…366ebd9e`).** The bracket
above says *"Nothing is published, built or deployed"*. "Built" stopped being true at `ABC-168` (merged
`513c0211`, 2026-10-22). Read it as: **nothing is published or deployed; the UCI engine artifact is
built locally.** `npm run build` is now `tsc -p tsconfig.build.json`. It emits `dist/uci.js`, which
`package.json`'s `bin` (`skytalix`) points at. `dist/` is git-ignored and never committed, and the
package is still `"private": true`, so nothing ships anywhere. The 2026-08-06 bullet above (*"no `main`,
`exports` or `bin`; the build is `tsc --noEmit` and emits nothing"*) is dated history in the same way.
The channel is unchanged. See `ADR-0018` § Note 2026-10-23 and `ADR-0044` D8.]**

## Roll back

**Nothing is deployed, so there is nothing to roll back.** No released artifact, no running instance,
no data store — therefore no state to restore, no migration to reverse, and no RTO/RPO to meet.

The only reversal available today is a **source** reversal: `git revert` on a `grugops/<task>`
branch with the gates re-run, per `AGENTS.md` § Branching model. That is ordinary development, not a
rollback procedure, and it must not be recorded here as one.

**[CORRECTED 2026-10-23 (`arch-runbook-operate`).** `AGENTS.md` has had no § Branching model since
`e82a3798` (`ABC-164`, 2026-10-21). That section moved word for word to
`memory-bank/45-standing-rulings.md` § Branching model, which `AGENTS.md` § Standing rulings points
at. Read the pointer above as that file.]**

A real rollback procedure becomes owed the moment `EPIC-006` produces a distributed artifact: a
published version can be superseded or withdrawn, and that will need writing down in this section.

*2026-10-24 (`ADR-0049` row 30, decision 7):* the source has been public since 2026-10-23, and public source
cannot be recalled. Clones, forks and caches keep their copies. The owner can make the host repository private,
which stops new clones and recalls nothing. That step is the owner's. A package's rollback procedure stays owed
at `EPIC-006`.

## On-call and escalation

**There is no on-call rotation and no pager, because nothing is running that could page anyone.**

Escalation here is a development-time concern, not an operational one, and it already has owners
recorded elsewhere:

- **The project owner (Olger Oeselg) holds deploy and the product decisions.** The *merge* keystroke
  is delegated standing and revocable since 2026-08-06; the authority behind it is still the
  owner's. Which decisions are delegated to which role, and which are not, is recorded in
  `memory-bank/60-progress.md` under its standing-directive sections — that file is the authority,
  this is a pointer.

  **[CORRECTED 2026-10-23 (`arch-runbook-deploy-holder`).** "holds deploy" in the bullet above is
  older than the owner's directive of 2026-08-15, in the same file. In the owner's words: *"I allow
  you to deploy, but this project does not need to be deployed, it is local for now until completed"*.
  Read the bullet as: **the owner holds the product decisions; the agent may deploy; no deploy is
  needed; nothing runs anywhere but locally.** `production_requires_human_confirmation` stays `true`.
  A human confirms anything production. See § Deploy's 2026-10-23 bracket for the quoted ruling.]**
- **A blocked work item** escalates after `blocked_escalation_days` (`2`) through `plans/board.md`'s
  Blocked column, not through this file.

`agent-factory/workflows/13-incident.md` exists and is untouched — it is the procedure for the day an
incident is possible. It cannot fire today: an incident needs something in service.
