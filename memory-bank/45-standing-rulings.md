# Standing rulings

The owner's standing rulings for this project, moved from `AGENTS.md` by `ABC-164` (2026-10-21) word for word. The five
section headings are the old `AGENTS.md` headings, so every `§` citation of them resolves here by name. `AGENTS.md` §
Standing rulings keeps the operative sentences and points here. In this file, "the authority above" and similar refer to
the sections in this order.

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
and UAT are the agent's, per ticket. 2026-08-15."

The commit-side branch guard in `agent-factory/_commit-convention.md` still holds: commit on
`grugops/<task>`, never `main` directly.

**Kit override 1 of 3** (count: `## QE validation authority`).
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
count as his acceptance. **NOT a kit override** — it
satisfies `agent-factory/workflows/06-uat-pack.md`'s named-human-signoff requirement; the owner IS
that human.

**2026-08-17 — a ticket whose delivered diff carries ZERO PRODUCTION LINES has UAT WAIVED, standing.**
`Ready for UAT` → `Done`, no UAT run. Measured from git, never asserted:
`git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'` must be
**empty** — any production line and the rule does not apply. This unfiltered form is the reference
measurement; no brief may add a `__snapshots__` filter. **Snapshot-only exception (owner,
2026-10-17):** if it lists only `src/__snapshots__/*.snap`, the waiver holds only if the
Orchestrator reads every changed `.snap` and records that in the Done note; any change the
criteria do not explain voids it and UAT goes to the owner. **A waiver is not a signature:** `Done`
here means merged and gated, never human-accepted. Composes with, does not supersede, 2026-08-16.
**This IS a kit override — the third** (with the branching model and the deployment posture); the
kit's UAT stage is unconditional.

**Two misreadings to refuse in advance:** an agent still may **not** self-sign — the ruling is the
owner's word signs, never a green report; and the recorded acceptance is an agent's
**transcription** of that word, never a stamp.

Scope is the `In UAT` exit signature only — `quality.gate_enforcement` stays `blocking`,
`production_requires_human_confirmation` stays `true`. Authority: `memory-bank/60-progress.md`, the
"Standing directive" §§ of 2026-08-15, -16 and -17 — pointers, not the text. The exception: owner
word `…be910aa8` (`wave-2026-09-25`); grant to amend this override `…d9aa42b9` (`qe-redact-SEC-177-1`).

## QE validation authority

**Every ticket gets a `qe-e2e` hop and QE's recorded verdict before leaving `In Review`; none reaches
`Done` without one.** Owner's, 2026-08-17, standing and revocable.

**Forward-only.** `ABC-068`, `ABC-061`–`ABC-064` merged with no QE hop and stay closed, no retro
pass (exposure: +435/−11 lines of `src/cli.test.ts` assertions QE never reviewed).

**QE is NOT UAT** — conflating them is what let QE go missing for five tickets. The zero-production-
lines waiver (`## Test and UAT authority`) waives UAT only; a test-only ticket
still gets QE, and the 2026-08-16 signature ruling stands unamended too.

**NOT a kit override** — `agent-factory/workflows/04-ticket-to-pr.md` step 5 already required this
hop; this re-affirms, not adds — the same shape as the 2026-08-16 ruling. **This project's kit
overrides remain THREE: the branching model, the deployment posture, and the zero-production-lines
UAT waiver. A reader who counts four is wrong.**

`quality.mandatory_gates` is unchanged — QE's hop is a workflow step, not a gate command. Authority:
`memory-bank/60-progress.md` § "Standing directive — EVERY ticket passes through QE's validation. QE
dispatch resumes. 2026-08-17."

QE-hop record convention and ceiling: `memory-bank/40-contributing.md` § Conventions.

## Deployment posture

This project deploys nowhere; it runs locally, from source. No container, manifest, CI or git
remote, and no release has ever been cut. A CLI entry point exists since `ABC-042` (`Dev / run` =
`npm run chess`) but changes none of this — it runs `src/cli.ts` from source, in place. **Runnable
is not deployable**: `package.json` is `private: true`, no `bin`/`main`/`exports`/`files`.

**Present posture, explicitly revisitable** — owner said "currently"/"for now" (2026-08-06); revisit
trigger `EPIC-006` (packaging) decides HOW it is eventually distributed (npm, binary, `git clone` —
undecided). Ruling, evidence, what's preserved for that day:
`memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md` — the authority.

**Who holds the deploy key changed 2026-08-15; where anything runs did not.** The owner granted
deploy authority to the agent AND re-affirmed no deploy is needed, in one sentence — both his.
Authority: `memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED;
merge, test and UAT are the agent's, per ticket. 2026-08-15." `ADR-0007` is Architect/Design's to
amend under it. Config: `default_stack.deploy` is `none-local-only`, `environments` is `["local"]`.

**Nothing here relaxes anything.** `production_requires_human_confirmation` stays `true` — the grant
deliberately did not flip it; moving it is the owner's word, never an inference from the grant.
"Deploys nowhere today" is not "decided never"; "may deploy" is not "has anything to deploy" — no
release machinery was added or removed.

**Kit override 2 of 3** (count: `## QE validation authority`). The kit hardcodes a `dev → staging → prod` path
(`agent-factory/workflows/12-release.md` step 3; `agent-factory/roles/release-manager.md`) — read-only, cannot carry a project override.
`.grugops/factory.config.json`, `ADR-0007` and `memory-bank/` win here; the human-confirmation
requirement stands unchanged.
