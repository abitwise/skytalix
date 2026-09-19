---
kind: adr
id: ADR-0018
---
# ADR-0018: The distribution channel is `git clone` + `npm run chess` — on the owner's word, "for now"

## Status

**accepted** — 2026-09-19 by Architect/Design at task `owner-rulings-2026-09-19`, subtask
`ruling-abc100-distribution` (Workflow 07), delivering `ABC-100`, under the project owner's standing
directive of 2026-08-03 recorded in `memory-bank/60-progress.md` § "Standing directive — who decides".
That delegation carries a condition — an ADR ratified under it **must record what would falsify it** —
and the table at the end of this file is that record.

**This ADR supersedes `ADR-0007` clause 5 ONLY, and nothing else in `ADR-0007`.** Clauses 1, 2, 3, 4
and 6 of `ADR-0007` stand exactly as written: the project still deploys nowhere and runs locally,
`default_stack.deploy` is still `none-local-only`, `environments` is still `["local"]`, and
**`production_requires_human_confirmation` is UNTOUCHED and still reads `true`** — re-checked at this
hop by `grep`, not assumed (see `D7`). `ADR-0007` `D5` said the day this question was answered it
would be handled *"by a superseding ADR, not a revert"*. This is that ADR. `ADR-0007` itself gains a
two-line pointer to this file and is otherwise byte-identical (`ABC-100` `A1`).

**The choice is the owner's, not this role's, and it is quoted rather than paraphrased.** Project owner
Olger Oeselg, in session, 2026-09-19, answering item 1 of six numbered questions put to him by the
Orchestrator, verbatim:

> "1. git clone + npm start works for now"
> — Olger Oeselg, project owner, in session, 2026-09-19

The full six-item answer, with the numbering and its reading, is transcribed in
`.grugops/context/owner-rulings-2026-09-19/notes/20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42.md`.
**Not a stamp:** `context.human_admission` is `off`, so this is an agent's auditable transcription of
the owner's word in git — `git log -S 'git clone + npm start works for now'` dates it and names the
commits that carry it — and it is not a mechanically un-forgeable signal (`ADR-0007` `D7` states the
same limit).

What the owner decided and what this role decided are kept apart. **The owner chose the channel.**
What this ADR decides is narrower and is genuinely an architecture call: (a) how *"npm start"* maps
onto the script that actually exists, without a code change; (b) what each option would have cost this
repository, priced so the choice can be disagreed with rather than inherited; (c) what `NFR-007`'s
window is now measured on; (d) what the chosen channel does **not** change; and (e) what would re-open
it, because the owner said *"for now"* and that is a bound, not a permanence claim.

## Context

`ADR-0007` clause 5 (2026-08-06) recorded the distribution mechanism as **UNDECIDED** — *"npm, a
standalone binary, a `git clone` and `npm start` — all open. That is `EPIC-006`'s question."* Three
other documents said the same (`AGENTS.md` § Deployment posture, `memory-bank/30-architecture.md`,
`memory-bank/70-runbook.md`), while `EPIC-006` asserted `npx` as settled in **four** places. That
contradiction was recorded on `plans/nfr-catalog.md`'s `NFR-007` row on 2026-08-06 as a
TWO-DOCUMENTS-DISAGREE item and left open, deliberately, because no agent may choose a channel.
`ABC-100` (cut 2026-08-16) is the ticket that gave the escalation an address; the owner answered on
2026-09-19.

### As-built facts this decision is priced against — measured at this hop, not inherited

| # | Checked | Method | Result at this hop (2026-09-19, branch `grugops/ruling-abc100-distribution` from `2c96dbd`) |
|---|---|---|---|
| 1 | deploy artifacts | `find` for `Dockerfile*` / `docker-compose*` / `Chart.yaml` / `*.tf` / `Procfile` / `fly.toml` / `*.yml` / `*.yaml` excluding `node_modules` and `.git`; `ls -a .github` | **zero matches; no YAML file of any kind; `.github/` holds only `copilot-instructions.md`** — unchanged from `ADR-0007` `D1` |
| 2 | publishability / executable surface | `grep` of `package.json` | `"private": true`; **no `bin`, `main`, `exports` or `files`**; `"version": "0.0.0"`; `"engines": { "node": ">=22" }`; **no `dependencies` key at all** (zero runtime dependencies); scripts include `chess` (`node src/cli.ts`) and **no `start`** |
| 3 | somewhere to push to | `git remote -v` | **empty.** No remote exists |
| 4 | release records | `ls -a plans/releases/` | `.gitkeep` only |
| 5 | build output | `npm run build` is `tsc --noEmit`; `ls -d dist` | **emits nothing; no `dist/`** |
| 6 | the flag | `grep production_requires_human_confirmation .grugops/factory.config.json` | **`true`** |
| 7 | toolchain on the measuring machine | `node --version`, `npm --version` | v24.12.0, 11.7.0 — Node runs `.ts` directly (type stripping), which is why there is no emit step |

**The script is `chess`, not `start`.** `package.json` has no `start` script (row 2). `npm start` with
no `start` script fails (`npm ERR! Missing script: "start"`). Adding one is an edit to `package.json`,
which `ABC-100` `A6` forbids at this ticket and `ABC-042` `A10` asserts key by key. So the owner's
*"npm start"* is honoured as the **shape** — clone the repository, then run the game through an npm
script — and its as-built realisation today is **`npm run chess`**. Whether a `start` alias is later
added is a code change for a gated ticket, not this file's; see Consequences.

## Decision

**1. The distribution channel is `git clone` + `npm install` + `npm run chess`.** Exactly one channel.
A user obtains the game by cloning the repository, running `npm install` (which installs the
development toolchain only — the game itself has zero runtime dependencies and `node src/cli.ts` needs
no `node_modules`), and starting it with `npm run chess` (options after `--`, e.g.
`npm run chess -- --colour black`; the separator is load-bearing, `AGENTS.md` § Commands). It requires
`git` and Node `>=22` on the user's machine and nothing else. **No package is published, no binary is
built, no `dist/` is emitted, no `bin` is added.**

**2. This supersedes `ADR-0007` clause 5 only.** Clause 5 read *"UNDECIDED"*; it now reads this file.
Every other clause of `ADR-0007` is unchanged and un-reopened. In particular clause 1's posture (deploys
nowhere, runs locally) is **confirmed** by this channel, not weakened: a clone runs from source, in
place, exactly as the author does.

**3. "For now" is a bound, and it is recorded as revisit triggers, not as permanence.** The owner's
words were *"works for now"*. This ADR is re-opened — by a superseding ADR on the owner's word, not a
revert — when **any** of the following happens:

- **the owner asks for a publish, a package, a binary or an `npx` invocation**, in any words;
- **a second user** — anyone who is not the author — needs to run the game and the clone path is found
  to be a barrier for them (recorded as a `failed-attempt` or `observation` note naming the person or
  the step that failed);
- **a git remote appears** (`D3` below), because that is the moment "clone" starts to mean distribution
  to someone other than the author, and the moment the supply-chain surface in Consequences becomes
  real;
- **`EPIC-006` acceptance criterion 1 is measured and fails** its `NFR-007` window under this channel.

**4. `NFR-007`'s window is now measurable, and this is what it is measured on.** The bar `< 2 s` is
Security/NFR's and **does not move here**. Its denominator was mechanism-specific (*"`npx` invocation …
with a warm npm cache"*) and is restated against the channel: **from `npm run chess` on a completed
clone (after `npm install`), to the first rendered board.** *"Warm npm cache"* has no meaning under
this channel — nothing is fetched at invocation time — and the analogue of that precondition is *"the
clone is complete and `npm install` has run"*. **Not measured here** (`ABC-100`'s obligation is to say
what the window is measured on, not to measure it); the figure for the row stays `UNKNOWN - verify`.
One prior data point exists and is cited as an observation, not a result: `AGENTS.md` records
`node src/cli.ts` on a closed stdin at real 0.07 s (RUN 2026-08-19, ABC-043 branch tip), which is the
inner term of this window without npm's own startup.

**5. What this channel does NOT change — stated because this is exactly where the inference is
expected.** `production_requires_human_confirmation` stays `true`. The owner named a channel; he did
not name the flag or the human-confirmation requirement, and `ADR-0007` `D7` says only that would move
it. Nothing about the gate, the branch guard, the merge posture, `default_stack.deploy`, `environments`,
`plans/releases/`, the `Ready to Release` column or any kit file changes. **Nothing was built** (`A6`):
zero files under `src/`, `package.json` byte-identical.

## Alternatives

**Priced BEFORE the choice was recorded, and every option carries its cost — including the winner and
including the ones the owner did not choose** (`ABC-100` `A3`, test note 2). The four columns
`ABC-100` names are the first four; the last two are the ticket's NFR and security obligations.

| Option | `package.json` keys it requires | What `npm run build` must actually emit | Is a git remote a precondition? | Is a release record cut? | `NFR-007`'s window under it | Supply-chain surface it opens |
|---|---|---|---|---|---|---|
| **npm publish** (`npm install -g cli-chess` / `npx cli-chess` off the registry) | remove `"private": true`; add `bin` (a shebang entry — today's entry is `src/cli.ts`, a `.ts` file, so either an emitted `.js` bin or reliance on unflagged type stripping on the **consumer's** Node, which `engines: >=22` does not guarantee: `UNKNOWN - verify` the minimum version that strips types unflagged); `files`; a real `version` (not `0.0.0`); `repository` expected by the registry; `publishConfig` optional | **must emit** — `tsc --noEmit` becomes `tsc` with `outDir`, or the bin ships `.ts` and the consumer's Node is trusted to run it; either way the *"typecheck wearing the build slot's name"* has to become a build | **no** — `npm publish` works from a local directory; but a registry account, an auth token and a package name are, and none exists | **yes** — every version published is a release; `ADR-0007` `D4` fires legitimately | `npx cli-chess` (warm cache) → first board; includes npm's resolution and spawn; the *"warm npm cache"* wording was written for this option | an npm account, its token and 2FA; the package name; consumers trusting the registry and the publisher; provenance/signing if wanted. **The largest surface of the five** |
| **standalone binary** (Node SEA or a bundler + packager, one per OS/arch) | build-side only: `devDependencies` for a bundler (e.g. `esbuild`) and a packager, plus build scripts; `bin`/`private` need not change | **must emit twice** — a single-file JS bundle, then a per-platform executable; today emits nothing and there is no bundler in the tree | **no** — but somewhere to *host* binaries is, and there is no remote, no CI and no YAML file in the repository, so the whole pipeline is greenfield | **yes** — a binary is an artifact; `D1` (a CI deploy step) and `D4` fire legitimately | binary launch → first board; no npm anywhere in the window; likely the fastest window of the five, at the highest build cost | code-signing / notarization on macOS, checksums, a download host, per-platform CI. **Most expensive to build and to keep**; nothing in this repo points toward it |
| **`git clone` + `npm start` — CHOSEN, realised as `npm run chess`** | **none** — `package.json` is byte-identical at this hop. (A `start` alias for `chess` would be one scripts key in a later gated ticket; it is **not** `bin`/`main`/`exports`/`private`, so `D2` would not fire on it) | **nothing** — Node `>=22` runs `src/cli.ts` in place; the build slot stays a typecheck, honestly named | **YES — for anyone but the author.** Today `git remote -v` is empty, so the channel is realised only on the author's machine; a remote is what turns "clone" into distribution. That is expected evolution under this ADR (`D3` below), not a defect | **no** — a clone is taken at a sha; a git tag could name a version but no `REL-` record is required. `D4` stays unfired | **from `npm run chess` on a completed clone (after `npm install`) → first rendered board.** *"Warm cache"* is meaningless here; the precondition is *"clone complete"* | **clone-and-trust**: the user runs source they can read, at a sha they can name, from a git host they trust; no registry, no token, no signing. The surface is the git host plus whatever the user does with `npm install` (dev tooling only — the game has zero runtime dependencies). **Cost the user pays:** needs `git` and Node, and must know the `--` separator trap |
| **`npx` off a git URL** (`npx github:<owner>/cli-chess`) | **`bin` is mandatory** — `npx` has nothing to run without it — so `D2` fires; `private: true` may stay (it blocks publish only) | none if `bin` points at `src/cli.ts` and the consumer's Node strips types unflagged (`UNKNOWN - verify`, as for npm publish); otherwise an emitted `.js` | **YES** — there is no URL to `npx` without a remote | **no** | `npx <git-url>` → first board, and it clones + installs on first run, so the *"warm cache"* precondition is real again and the cold case is the slowest of the five | git host trust **plus** npm executing lifecycle scripts on fetch; it is the clone channel's surface with the registry channel's execution model. **The worst of both**, and it needs a `package.json` change this ticket forbids |
| **"not yet"** (leave clause 5 undecided) | none | nothing | no | no | **unmeasurable** — the row stays `UNKNOWN - verify` with no denominator | none opened — **and none of the four documents that disagree get repaired**; `EPIC-006` criterion 1 stays unmeetable and every packaging ticket stays fiction. This is the cost the project has been paying since 2026-08-06 |

**Why the chosen option is also the right rock, stated so it can be argued with.** It is the only
option that costs **zero** `package.json` keys, **zero** emitted artifacts, **zero** accounts and
**zero** new files, and it leaves `D1`, `D2` and `D4` exactly where `ADR-0007` measured them. Its one
real cost — a git remote before anyone else can use it — is a single owner action and is recorded as a
revisit trigger rather than hidden. **The honest counter-argument:** it is not distribution in the sense
`NFR-006` (*"no published-package bloat"*) and `NFR-007` (*"`npx` invocation"*) were written for; the
user must have `git` and Node and must learn the `--` separator. The owner chose it knowing the
product runs from source today; *"for now"* is how he bounded that.

## Consequences

- **`EPIC-006`'s four `npx` sentences are repaired to name this channel** (`ABC-100` `A7`) — `## Scope`,
  acceptance criterion 1 (now `git clone` + `npm install` + `npm run chess`), the `NFR-007` trigger,
  and `## Test notes`. Its historical narration that *quotes* the old wording is left as dated
  history.
- **`NFR-007`'s denominator is restated on the row** (Decision 4); its `< 2 s` bar is byte-identical.
  `plans/nfr-catalog.md` said the denominator edit is *"Security/NFR's … and does not own the choice"*;
  the choice is the owner's, the restatement is made here on the Orchestrator's instruction so that the
  row and this ADR do not disagree, and **Security/NFR may re-state the wording at the measuring hop
  without re-opening this ADR.** The 2026-08-06 TWO-DOCUMENTS-DISAGREE item is **closed**.
- **`memory-bank/30-architecture.md` and `memory-bank/70-runbook.md`** each gain a one-line dated
  pointer where they said *"UNDECIDED"*; `70-runbook.md` said in its own text that it would be *"the
  first place that has to change"*.
- **`AGENTS.md` § Deployment posture still says *"undecided … Do not fill that in"*.** It is **out of
  this hop's write scope** (`ABC-109` byte cap; the section is the AGENTS.md Scribe's) and is now
  **stale**. Flagged, not edited; the Scribe's hop owns the sentence.
- **`ABC-100`'s ticket page** says in `## Out of scope` that editing `EPIC-006` is a fence, and in the
  next section that *"whoever closes this ticket owns the epic-text correction as part of it"*. The
  latter is the operative sentence; the former was written for BA/PM's cutting hop. Not edited.
- **A packaging ticket can now be cut honestly.** Its scope under this channel is small: a remote,
  `NFR-007`'s measurement, and possibly a `start` alias. It is **not cut here** — that is BA/PM's, and
  cutting it before the remote exists would be cutting fiction of a smaller size.
- **`production_requires_human_confirmation` is unchanged and this file does not argue it obsolete**
  (`A5`). With `ADR-0007` clause 4's *"A is `EPIC-006`'s to remove by design"*: under this channel
  fact A (nothing to deploy) is **still true** — a clone is not a deploy — so the flag's present effect
  stays zero and its rail stays free.
- **`memory-bank/00-index.md` still says `ADR-0001`–`ADR-0016`, next free `ADR-0017`.** Stale since
  `ADR-0017` landed; **flagged, not fixed** at this hop (an unrelated line).

## Rollback

**Free.** This ADR moves no config value, emits nothing, and creates no account, key, remote, tag or
artifact. Reversing it is one `git revert` of a single commit — six markdown files return to *"UNDECIDED"*
and `EPIC-006` returns to saying `npx`. It gets dearer only at the moment the first revisit trigger
fires and a superseding ADR chooses a channel that *does* create artifacts; at that point **this** file
is superseded, not reverted, exactly as it superseded `ADR-0007` clause 5.

## What would falsify this

*(Carried forward from `ADR-0007` in its shape and with its ids, so a reader with both files can check
the same rows. Each row is checkable without trusting this file. `D2` and `D7` are the two `ABC-100`
`A4` names; both are explicit.)*

| # | what would falsify it | how to check |
|---|---|---|
| **D1** | a deploy artifact or CI deploy step appears (Dockerfile, compose, chart, manifest, IaC, workflow) | the Context row 1 scan. **At this hop: zero matches; no YAML file of any kind.** One appearing means a channel other than this one is being built without a superseding ADR |
| **D2** | **the package becomes publishable or exposes an executable** — `package.json` gains `bin`, `main` or `exports`, or loses `"private": true` | `grep` the four keys. **At this hop: private, none of the three present.** Under this channel none of them is needed, so any of them appearing is either the npm/`npx` option being taken silently or `ADR-0007` `D2`'s original firing condition — either way this file is being superseded without saying so. **A `start` script alias is NOT a `D2` event** (it is none of the four keys) |
| **D3** | **a git remote appears** | `git remote -v`. **At this hop: empty.** Under this channel this is **expected evolution, not a defect** — it is the moment the channel reaches a second machine — and it is the first revisit trigger in Decision 3. It falsifies the *"realised only on the author's machine"* sentence in Alternatives and nothing else; record it, do not revert |
| **D4** | a release record is cut | `ls plans/releases/`. **At this hop: `.gitkeep` only.** This channel needs none; one appearing means a versioned artifact exists and the channel has changed |
| **D5** | the owner revises the channel, or a second user cannot use it | the revisit triggers in Decision 3 firing. Handled by a **superseding** ADR, not a revert — the owner said *"for now"*, so this is expected |
| **D6** | `NFR-007` is measured against a denominator other than Decision 4's (e.g. someone re-introduces *"`npx`"* or *"warm cache"* into the row or the epic) | `grep -n npx plans/epics/EPIC-006-*.md plans/nfr-catalog.md` — the only hits should be dated history or this ADR's own pricing. If a live bar names `npx` again, two documents disagree again |
| **D7** | **`production_requires_human_confirmation` is found `false`, deleted, or argued obsolete on the strength of ANY document, dial or grant — including this ADR and the channel it names — WITHOUT the owner having named the flag or the human-confirmation requirement itself** | `grep production_requires_human_confirmation .grugops/factory.config.json` → must read `true`. **At this hop: `true`.** If it does not, the row fires **unless** `grep -rn` over `memory-bank/` returns a **dated, attributed, verbatim owner quotation naming the flag or the requirement**. The owner's 2026-09-19 word names a channel and does not name the flag; *"the game is just cloned, nothing deploys, so the flag is pointless"* is the third route to the forbidden inference (after `environments: ["local"]` and the 2026-08-15 deploy grant) and it is forbidden by the same rule |

**No `D8` was added.** The revisit triggers in Decision 3 are owner-driven events, not measurements,
and the one that is measurable (`D3`) already has a row. One channel, one table.
