---
kind: adr
id: ADR-0049
---
# ADR-0049: The source is public on GitHub. The engine still deploys nowhere and publishes no package

## Status

**ACCEPTED** 2026-10-24 by Olger Oeselg (owner), in session, verbatim *"accept ADR-0049"* (note
`.grugops/context/owner-word-2026-10-24/notes/20261024T153400Z-orchestrator-decision-619938c5.md`, item 1).
Recorded by Architect/Design (task `arch-accept-adr0049`, records only, at `main` `2a1a7c93`).

- **The 14 Architect/Design rows of § Records are applied** (rows 2, 3, 4, 7, 8, 9, 10, 12, 15, 18, 30, 31, 32
  and 33). The rows owned by BA/PM (20–24), the Scribe (28, 29, 35) and Security/NFR (34) are theirs to apply.
- **Re-read at this hop** (read-only, at `2a1a7c93`): `git remote -v` prints 2 lines (one remote). `package.json`
  reads `"private": true`, `"license": "Apache-2.0"`, the same `bin`, and no `main`, `exports`, `files` or
  `prepare`. `.github/` holds only `copilot-instructions.md`. `plans/releases/` holds only `.gitkeep`. No YAML or
  deploy file is tracked. The config values in decision 2 are unchanged.
- **Decision 5's window has closed.** `ABC-214` merged at `59f50717`. The owner pushed `main` at `3497aad2`
  (same note, item 2), which contains that merge, so the public tip reads `"license": "Apache-2.0"`.
- **The owner reports GitHub checked** (same note, item 3). The only finding he named is a missing README, which
  BA/PM cuts as a ticket. He gave no per-item values, so § Consequences' owner-side items are not restated here.

Previously **PROPOSED** 2026-10-24 by Architect/Design (task `arch-public-posture-adr`, records only, at `main` `fb0a7703`).
**Acceptance is the owner's.** This is a new ADR (`memory-bank/45-standing-rulings.md`, 2026-10-22). No agent
moves it to accepted.

- **What it would supersede:** every statement that the repository is private, has no git remote, or is never
  distributed. § Records lists each one with its disposition.
- **What it does not supersede:** `ADR-0007` clause 1 (this project deploys nowhere), `ADR-0018`'s channel, and
  `ADR-0048`'s licence. All three stand.
- **Nothing in § Records is edited before acceptance.** The edits are dated lines, made on acceptance by the role
  named. Dated history stays as written.

## Context

- **The owner's words.** These are transcriptions, not stamps:
  - *"added git remote - skytalix, made it public"* (2026-10-23), in
    `.grugops/context/owner-word-2026-10-23/notes/20261023T204157Z-orchestrator-decision-59df15ce.md`. The
    Orchestrator routed this ADR there: the posture text changes, so it is a new ADR for the owner.
  - *"accept ADR-0048 ; keep grugops under MIT ; ok, if no creds."* (2026-10-24), in
    `.grugops/context/owner-word-2026-10-24/notes/20261024T091000Z-orchestrator-decision-776bba9a.md`. "ok, if no
    creds" accepts `SEC-PUB-1` on the condition that no credential is public.
- **Measured at this hop** (read-only, on the main checkout, at `fb0a7703`):
  - `git remote -v` prints 2 lines: one remote, `origin`, fetch and push.
  - `jq -c '[.private, .license, .bin, has("main"), has("exports"), has("files")]' package.json` prints
    `[true,"UNLICENSED",{"skytalix":"dist/uci.js"},false,false,false]`.
  - `.github/` holds only `copilot-instructions.md`. There is no CI.
  - `plans/releases/` holds only `.gitkeep`.
  - `production_requires_human_confirmation` is `true`. `default_stack.deploy` is `none-local-only`.
    `environments` is `["local"]`.
- **Security/NFR's public-repo review** (task `security-nfr-public-repo`). Its branch is held and local only,
  because it restates home-lab detail. So this ADR cites only what the owner's note `…776bba9a` restates, and
  the redacted re-publication (task `security-nfr-public-repo-redacted`, in flight). By class only:
  - **Secrets: 0 real** across 3 056 commits. No password, key or token.
  - **`SEC-PUB-1`, MEDIUM.** Older public history holds captures of the owner's private home-lab
    infrastructure. They name hosts, a domain, private-network addresses, an identity realm, cluster
    contexts and namespaces, and in-cluster service and secret *names*. No credential value is among them.
  - **`SEC-PUB-2` to `SEC-PUB-4`, LOW.** Personal metadata: the owner's e-mail on commits, the author's
    home-directory path in tracked files, and the machine's name, model and time zone.
  - **`LIC-PUB-1`, MEDIUM.** It is answered by `ADR-0048` and closes when `ABC-214` merges.
  - **Posture:** about 28 record statements are now false. § Records re-reads them at `fb0a7703` and adds
    the ones the review did not list.
- **What fired:** `ADR-0007` `D3` ("there is somewhere to push to"), `ADR-0018` `D3` ("a git remote appears")
  and `ADR-0018` Decision 3's third revisit trigger. Each asks for a superseding record, not a revert.

## Decision

1. **The repository is public on GitHub, by the owner's own act.**
   - What is public: every pushed ref with its full history, every tracked file, and commit metadata.
     Tracked files include `src/`, the tests, `memory-bank/`, `plans/` and `.grugops/`.
   - Which refs are public beyond `main` is `UNKNOWN - verify`. The remote answers it, so the owner checks.
   - **Pushing stays the owner's.** Agents never push, never force and never open a PR. A local commit is
     public only after the owner pushes it.
   - **A branch the Orchestrator marks held is never pushed.** Today that is `grugops/security-nfr-public-repo`.
2. **What stays local-only, unchanged.**
   - The software runs from source on the machine that cloned it. Nothing is deployed (`ADR-0007` clause 1).
   - `default_stack.deploy` stays `none-local-only` and `environments` stays `["local"]`.
   - `"private": true` stays, so npm refuses `npm publish`. No package, binary or `dist/` is published.
   - No release is cut. There is no CI.
   - `production_requires_human_confirmation` stays `true`. The owner did not name it (`ADR-0007` `D7`).
3. **Distribution is `ADR-0018`'s channel, now reachable by anyone.**
   - `git clone`, `npm install`, `npm run chess` is unchanged. A clone is no longer realised only on the
     author's machine.
   - This ADR is the superseding record that `ADR-0018` Decision 3 asks for when a remote appears. The channel
     does not move.
   - **`npx` from the git URL is not offered.** There is no `prepare` script, so `dist/uci.js` would be
     missing. `ADR-0044` D8 keeps install from a git URL out of v1. Offering it needs its own ADR.
4. **`SEC-PUB-1` is accepted by the owner, on the "no creds" condition. History is not rewritten.**
   - No filter-repo run and no force push. The home-lab captures stay in public history.
   - The condition rests on Security/NFR's scan: 0 credentials. If a credential is ever found in a public
     ref, the acceptance lapses. That finding is HIGH and goes to the owner.
   - An owner-side suggestion, not a gate: confirm the lab's admin consoles are not reachable from the
     internet.
   - **From acceptance on, a record names infrastructure by class and count only.** No hostname, domain,
     address, realm, cluster or context, service or secret name, and no personal path.
   - `SEC-PUB-2` to `SEC-PUB-4` stay the owner's. This ADR decides nothing about them.
5. **The licence is `ADR-0048`'s** (accepted 2026-10-24).
   - Apache-2.0 takes effect at `ABC-214`'s merge, with the CC BY-SA 3.0 evaluation values carved out. The
     four kit files stay MIT.
   - Until the owner pushes that merge, the public tip still reads `"license": "UNLICENSED"`.
   - Older public versions are not rewritten (`ADR-0048` decision 8).
6. **Host-side checks become real.** The `ADR-0007` § Pointers 2026-10-11 revisit trigger has fired.
   - A gate's `host-protection.js` exit 2 is a real `UNKNOWN - verify` for the owner. The posture qualifier
     "N/A in this posture: no git remote" is dropped.
   - Branch protection on `main`, forks and clones, and GitHub secret scanning are `UNKNOWN - verify`. Only
     the owner can read them on the host.
7. **Rollback of publication is not possible.** Clones, forks and caches keep their copies.
   - The owner can make the host repository private. That stops new clones and recalls nothing.
   - The runbook says this on acceptance (§ Records, row 30).

## Records

Each statement was re-read at `fb0a7703`, with this branch's `ADR-0048` edits applied. "False" means false as a
statement about today. Dispositions:

- **dated line**: on acceptance, add one dated line next to the statement. The statement stays as history.
- **dated note**: on acceptance, add one dated § Note to the ADR. Falsifier rows are not edited.
- **ADR-0048**: already answered by `ADR-0048`'s drift rows, applied today or by BA/PM's hop.
- **none**: dated history, a sealed note, a Done ticket's reading, or still true.

| # | record | statement (quoted short) | today | disposition | by |
|---|---|---|---|---|---|
| 1 | `ADR-0007` Context row 4 | "`git remote -v` … **empty.** No remote exists" | false | none: a 2026-08-06 measurement; row 3 covers it | — |
| 2 | `ADR-0007` clause 4, 2026-08-15 block, Fact A | "`D3` no git remote … UNCHANGED, and this is what stops you today" | `D3` leg false | dated line: Fact A still holds through `D1`, `D4` and `"private": true` | Architect/Design |
| 3 | `ADR-0007` falsifier `D3` | "there is somewhere to push to" | **fired** 2026-10-23 | dated note: `D3` fired; clause 1 holds; this ADR is the `D5` superseding record | Architect/Design |
| 4 | `ADR-0007` § Pointers 2026-10-11 | "`git remote -v` prints 0 lines … no host to ask"; the qualifier "N/A in this posture: no git remote" | false; its trigger fired | dated line: the qualifier is dropped; exit 2 is a real `UNKNOWN - verify` (decision 6) | Architect/Design |
| 5 | `ADR-0007` § Note 2026-10-23 | "`D3`: `git remote -v` prints 0 lines"; "Nothing is published"; "none of them fired" | false since that evening | none: a dated reading; row 3's note supersedes it | — |
| 6 | `ADR-0018` Context row 3 | "**empty.** No remote exists" | false | none: a 2026-09-19 measurement | — |
| 7 | `ADR-0018` Decision 3, third trigger | "a git remote appears" | **fired** | dated line in § Status: this ADR is the superseding record; the channel is unchanged | Architect/Design |
| 8 | `ADR-0018` Alternatives, chosen row | "realised only on the author's machine" | false | dated line: reachable by anyone since 2026-10-23 (its `D3` row says "record it, do not revert") | Architect/Design |
| 9 | `ADR-0018` falsifier `D3` | "a git remote appears" | **fired** | dated note, as row 3 | Architect/Design |
| 10 | `ADR-0018` § Note 2026-10-23 | "`D3`: … 0 lines"; "The `npx` option needs a remote, and `D3` holds" | false | covered by row 9's note: `npx` from the git URL is attemptable and not offered (decision 3) | Architect/Design |
| 11 | `ADR-0018` Consequences | a packaging ticket's scope is "a remote …"; "before the remote exists" | not false: the remote exists | none: a packaging ticket stays BA/PM's, on the owner's word | — |
| 12 | `ADR-0044` D8, last bullet | "It is local and built from a clone, and nothing is published" | half false: the source is public | dated line: the source is public (this ADR); no package or `dist/` is published | Architect/Design |
| 13 | `ADR-0044` D13, tables bullet | "The engine is not distributed … does not share the CC BY-SA material" | false | `ADR-0048` (row 2, applied today) | — |
| 14 | `ADR-0044` D13, precondition | "re-derive our own values first" before distribution | breached | `ADR-0048` decision 7 (applied today) | — |
| 15 | `ADR-0044` D13, "Withdrawn: the AGPL Source link" | "A private engine offers no source" | false | dated line: the source is public; the withdrawal stands, since Apache-2.0 has no network-source clause (`UNKNOWN - verify`, engineering reading) | Architect/Design |
| 16 | `ADR-0044` D13, kit bullet | the MIT notice is `UNKNOWN - verify` | resolvable | `ADR-0048` decision 5 (applied today) | — |
| 17 | `ADR-0044` D13, web-project bullet | "A bundle would be a distribution, and the precondition above would apply" | superseded | `ADR-0048` row 4 (applied today) | — |
| 18 | `ADR-0044` Consequences, distribution | "Distribution is unchanged (`ADR-0018`): a clone, built locally" | half false: the clone is public | dated line pointing here; its D13 half is `ADR-0048`'s (applied today) | Architect/Design |
| 19 | `ADR-0044` acceptance note `…fe0a5538` | the same precondition as row 14 | breached | none: a sealed note; `ADR-0048` supersedes it | — |
| 20 | `EPIC-007` M10 and its acceptance box | "The engine is declared private"; "private, all rights reserved" | "private" now means "not yet open-licensed", not "not shared" | `ADR-0048` rows 11–12 (BA/PM, task `bapm-epic007-licence-line`) | BA/PM |
| 21 | `EPIC-007` Q12(a) row | "A private engine that is not distributed does not share …" | false | `ADR-0048` row 12 (Q12 is named there) | BA/PM |
| 22 | `EPIC-007` "Recorded precondition, not a ticket" | "Before the engine is ever distributed to third parties …" | breached | `ADR-0048` row 12 and decision 7 | BA/PM |
| 23 | `EPIC-007` web-project bullet | "It runs a private, all rights reserved program" | superseded | `ADR-0048` row 12 ("web project") | BA/PM |
| 24 | `EPIC-007` `RISK-EPIC007-07` | "rests on the engine not being distributed" | fired | `ADR-0048` row 13 | BA/PM |
| 25 | `ABC-169` title and Scope | "Declare the engine private" | a Done ticket's reading | none (`ADR-0048` rows 8–10) | — |
| 26 | `ABC-169` Value | "anyone reading the repo sees that it is private" | "anyone" is now the public | none: a Done ticket's dated reading | — |
| 27 | `ABC-169` § Out of scope | "A private engine … is not distributed" | false | none: a Done ticket's dated reading | — |
| 28 | `45-standing-rulings.md` § Deployment posture | "No container, manifest, CI or git remote, and no release has ever been cut" | git-remote part false | dated correction, the shape of its 2026-10-23 one: a remote exists; the rest holds | the Scribe |
| 29 | `45-standing-rulings.md` § Deployment posture | "`EPIC-006` … decides HOW it is eventually distributed (npm, binary, `git clone` — undecided)" | stale since `ADR-0018`; now overtaken | dated correction, with row 28: `ADR-0018` decided it, and the clone is public | the Scribe |
| 30 | `70-runbook.md` § Roll back | "A real rollback procedure becomes owed the moment `EPIC-006` produces a distributed artifact" | open question | dated line: public source cannot be recalled; the owner can make the host repo private (decision 7). A package's procedure stays owed at `EPIC-006` | Architect/Design |
| 31 | `70-runbook.md` § Deploy, 2026-08-06 list | "Nowhere to push: the repo has **no git remote**" | false | dated line | Architect/Design |
| 32 | `70-runbook.md` § Deploy, 2026-09-19 bracket | "there is still no git remote, so today the clone path is realised only on the author's machine" | false | dated line | Architect/Design |
| 33 | `30-architecture.md` | "**Nowhere to push.** The repo has no git remote" | false | dated line | Architect/Design |
| 34 | `plans/nfr-catalog.md`, availability-SLO table | "No git remote at all" | false; the conclusion holds | dated reading: a git host does not observe a running service, and nothing runs | Security/NFR |
| 35 | `45-standing-rulings.md` § Branching model, config trap | "No git remote, so `pr` has always meant 'branch + gate': nothing is pushed, no PR opened" | remote part false | dated line: for agents `pr` still means branch + gate; pushing is the owner's (decision 1) | the Scribe |
| 36 | `AGENTS.md` § Standing rulings | "This project deploys nowhere; it runs locally, from source" | **true** | none: listed so this ADR does not over-reach | — |
| 37 | `.grugops/factory.config.json` | `deploy: none-local-only`, `environments: ["local"]`, the confirmation flag `true` | **true** | none | — |

Security/NFR's 28 items are rows 1–10, 12–16, 18–20, 26–34 and 36. Rows 11, 17, 21–25, 35 and 37 are added at
this hop. Dated `_Updated` lines, `60-progress.md`, and Done tickets other than `ABC-169` are history and are not
listed.

*Applied 2026-10-24 (task `arch-accept-adr0049`):* the Architect/Design rows 2, 3, 4, 7, 8, 9, 10, 12, 15, 18 and
30–33. Each carries "2026-10-24" and "`ADR-0049` row N" at its place. Rows 20–24 (BA/PM), 28, 29 and 35 (the
Scribe) and 34 (Security/NFR) are not applied here.

## Alternatives

- **Take the repository private again.** It contains new clones and recalls nothing. Not recommended: the owner
  chose Apache-2.0 and accepted `SEC-PUB-1`. It stays open to him at any time.
- **Purge history (filter-repo plus a force push).** Rejected by the owner's condition: "ok, if no creds" accepts
  the history as it is. Clones taken before a purge keep the old history anyway.
- **Dated notes on `ADR-0007` and `ADR-0018` only, with no new ADR.** Rejected. The posture text in three ADRs and
  in the standing rulings changes, and the Orchestrator ruled that a new ADR (`…59df15ce`).
- **Fold the posture into `ADR-0048`.** Rejected. The licence is a separate decision (`ADR-0044` § Rollback), and
  `ADR-0048` is already accepted.
- **Offer `npx` from the git URL now that a URL exists.** Not now. It needs a `prepare` script, and `ADR-0044` D8
  keeps it out of v1. That would be its own ADR on the owner's word.

## Consequences

- **No code moves.** No file under `src/`, `tools/` or `package.json` changes because of this ADR.
- **No NFR moves.** `nfr.availability` stays "not-applicable-local-only": a public git host runs nothing.
- **Gates:** `host-protection.js` exit 2 is a real `UNKNOWN - verify` from acceptance on (decision 6). It still
  never changes a gate's terminal result on its own (`ADR-0007` § Pointers).
- **Every record is now public once pushed.** The class rule in decision 4 applies to notes, ADRs, tickets,
  briefs and commit messages alike.
- **Owner-side `UNKNOWN - verify` items:** branch protection on `main`, which refs are public, forks and clones,
  and GitHub secret scanning.
- **`ADR-0007` and `ADR-0018` stay accepted.** Each gains the dated lines in § Records. Neither is reverted.

## Rollback

- **Before acceptance:** mark this ADR `rejected`. No record was edited.
- **After acceptance:** revert the dated-line commits and mark this ADR `superseded` by the owner's choice.
- **Publication itself cannot be rolled back** (decision 7). Making the host repository private is the owner's
  step, and it leaves every existing copy in place.

## What would falsify this

| # | what would falsify it | how to check |
|---|---|---|
| **P1** | a credential is found in any public ref | Security/NFR's secret scan over the public history. **At this hop: 0 (Security/NFR).** A hit lapses the `SEC-PUB-1` acceptance: HIGH, to the owner |
| **P2** | a package is published, or `"private": true` is removed | `jq -c '[.private, .bin, has("main"), has("exports"), has("files")]' package.json`. **At this hop: `[true,{"skytalix":"dist/uci.js"},false,false,false]`.** Any other value needs a new ADR |
| **P3** | something is deployed, or a release is cut | `ADR-0007` `D1` and `D4`. **At this hop: no deploy artifact, no YAML file, `plans/releases/` holds `.gitkeep` only** |
| **P4** | an agent pushes, or a held branch reaches the remote | the owner reads the remote's refs. **At this hop: `UNKNOWN - verify` (owner)** |
| **P5** | a record names infrastructure after acceptance | a class pattern scan over new records (IPv4 addresses, host and realm patterns). **At this hop: this ADR names none** |
