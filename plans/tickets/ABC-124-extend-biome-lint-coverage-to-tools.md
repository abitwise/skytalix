---
id: ABC-124
title: Extend Biome lint coverage to tools/grugops/*.js (typecheck stays out of scope)
status: backlog
column: Backlog
size: XS
priority: P2
epic: EPIC-004
feature: —
---

# ABC-124 — `npm run lint` reads `tools/grugops/*.js`, at last (typecheck deliberately not extended)

> **Cut 2026-09-27 by BA/PM** (task `ticket-lint-tools`, Workflow 07), on the owner's word,
> verbatim: *"lint ticket ok"*
> (`.grugops/context/wave-2026-09-25/notes/20260927T110855Z-orchestrator-decision-e8061413.md`,
> item 3: *"Cut a follow-up ticket (BA/PM): extend Biome lint (and, if cheap, typecheck) to cover
> `tools/` — the QE finding on ABC-123 (`qe-ABC-123` `…58925283`) and Security/NFR's informational
> line (`…9cbd8b67`)."*).
>
> **Source: two independent gate notes on `ABC-123`, not re-derived at the time each was
> written.** QE's finding (`.grugops/context/qe-ABC-123/notes/20260926T211200Z-qe-e2e-observation-
> 58925283.md`): `biome.json`'s `files.includes` has no `tools/**` entry, so the linter's own
> green, exit-`0` `A7` reading structurally never read either `ABC-123`-changed file. Security/NFR's
> informational line (`.grugops/context/secnfr-ABC-123/notes/20260926T210200Z-security-nfr-decision-
> 9cbd8b67.md`): *"`npm run lint` and `typecheck` do not read `tools/`… This is pre-existing and not
> introduced here. The committed proof is the only automated guard on these two files, and it
> catches a regression only when someone runs it."*

## Problem

*User*: every role and every future hop that touches `tools/grugops/*.js` — the wrapper `npm test`
itself runs through (`run-bounded.js`), its proof (`run-bounded.proof.js`), its synthetic-hang
fixture (`run-bounded.hang-fixture.js`), and the four other gate-support scripts in the same
directory (`lane-inventory.js`, `reference-check.js`, `test-skip-integrity.js`,
`uat-spec-integrity.js`).

*Pain, measured today (2026-09-27, BA/PM, this cutting hop, Biome `2.5.5`, the version pinned in
`package.json`)*:

- `biome.json`'s `files.includes` lists only `src/**/*.ts`, `spike/**/*.ts`, `*.json` and
  `vitest.config.ts`. `npx biome check tools/` reports **`Checked 0 files … These paths were
  provided but ignored: - tools/`** — not a clean pass, a structural no-op. `npm run lint`'s
  exit-`0` line says nothing about these seven files; it never opens them.
- Pointed at `tools/` through a scratch config that adds `tools/**/*.js` to `includes` (temporary,
  reverted, never committed — see `Definition of Ready` note below on how this was measured):
  **`Checked 7 files … Found 8 errors. Found 1 warning. Found 2 infos.`** Of the 8 errors, 6 are
  pure reformatting (indent-style/line-width diffs against Biome's 2-space formatter config; the
  files are written in the tools/ directory's own long-standing 4-space/tab style) and 2 are
  `assist/source/organizeImports`. The 1 warning is
  `lint/suspicious/noPrototypeBuiltins` and the 2 infos are `lint/complexity/noUselessContinue`,
  all three in `tools/grugops/uat-spec-integrity.js`. **All 8+1+2 are Biome's own `FIXABLE` (safe
  fix) diagnostics** — confirmed by running `biome check --write tools/` against the scratch
  config, which brought the recheck to 0/0/0 in one pass. `run-bounded.js`,
  `run-bounded.proof.js`, `run-bounded.hang-fixture.js`, `lane-inventory.js` and
  `reference-check.js` (the last one's own `assist/source/organizeImports` finding aside) carry
  **zero real lint-rule findings** — only formatting/import-order noise.
- `tsconfig.json`'s `include` is `["src/**/*.ts", "spike/**/*.ts", "vitest.config.ts"]`, and the
  compiler options carry no `allowJs`/`checkJs`. `tsc --noEmit` therefore does not, and structurally
  cannot without those two flags, read any `.js` file anywhere in the repository — `tools/` is not
  singled out; this is the whole-repo behavior for every `.js` file, `tools/` included.

*Value*: a real regression in a gate-support script (an off-by-one in `run-bounded.js`'s own
validation guard, a broken `Object.hasOwn` typo, a reintroduced dead branch) stops shipping past a
green `npm run lint` unnoticed. Today the only guard on these files is whoever remembers to hand-run
`run-bounded.proof.js` — Security/NFR's own words, quoted above. Closing this is control debt on
tooling every gate hop depends on, named by two independent gates on the same ticket and now
authorised by the owner.

## Scope

1. **Add `"tools/**/*.js"` to `biome.json`'s top-level `files.includes` array**, so `npm run lint`
   (`biome check .`) reads all seven files under `tools/grugops/`.
2. **Add one `overrides` entry scoping `tools/**/*.js`** that turns the **formatter off** and
   `assist/source/organizeImports` **off** for that glob only — linter rules (the `recommended`
   preset) stay fully enabled for `tools/`. This keeps the change to the size the owner authorised:
   without it, wiring in coverage would force a **~1,595-insertion / ~1,651-deletion** reformat
   across 6 of the 7 files (measured, `biome check --write tools/` against the scratch config,
   `uat-spec-integrity.js` alone: 2,953 changed lines) — a stylistic rewrite of files nobody asked
   to touch, riding on a coverage ticket. `src/**/*.ts` and `spike/**/*.ts` keep the formatter and
   `organizeImports` exactly as committed today; the override touches nothing outside
   `tools/**/*.js`.
3. **Apply Biome's own safe autofix (`biome check --write`) to the three real lint-rule findings**
   named above, all in `tools/grugops/uat-spec-integrity.js`: the `noPrototypeBuiltins` warning
   (→ `Object.hasOwn(...)`) and the two `noUselessContinue` infos (dead `continue` at the end of a
   block). This is the only production-line change this ticket makes to any `tools/` file.
4. **Typecheck / `checkJs`: explicitly OUT of scope.** See the dedicated section below — this is a
   decision, not an omission.

## Typecheck / `checkJs` — decision: OUT of scope

**Decision: do not add `allowJs`/`checkJs` to `tsconfig.json`, and do not add `tools/**/*.js` to
its `include` array, in this ticket.**

**Justification.**
- `tsc --noEmit` cannot read a `.js` file at all without `allowJs: true`, and reading it without
  raising errors on untyped code needs `checkJs: true` on top. Neither flag exists today.
- Turning both on is a **repo-wide** compiler-option change, not a `tools/`-scoped one — TypeScript
  has no per-glob `allowJs`/`checkJs` override the way Biome's `overrides` does. It would change how
  the compiler treats every `.js` file the `include` glob can ever reach, not just the seven files
  this ticket is about.
- These seven files have **never** been type-checked. Turning `checkJs` on for the first time
  against ~4,700 lines of un-annotated JavaScript (`uat-spec-integrity.js` alone is the largest file
  under `tools/`) is very likely to surface an **unmeasured, unbounded** number of new diagnostics
  (implicit `any`, missing JSDoc types, `require`/`module` interop noise) that this ticket has not
  sized, triaged, or budgeted time to fix — exactly the "someday-roadmap" scope-creep an `XS`
  ticket must cut, not absorb.
- The owner's own instruction was conditional: *"extend Biome lint **(and, if cheap, typecheck)**"*.
  It is not cheap — it is a repo-wide flag flip with an unbounded, unmeasured diagnostic count on
  the largest file in `tools/`. The lint half is cheap (three safe autofixes, one config edit); the
  typecheck half is not. Splitting them and taking only the cheap half is the honest reading of
  "if cheap."
- **Recommendation, not actioned here:** a future spike/ticket could measure `tsc --noEmit` against
  a *second*, `tools/`-scoped `tsconfig` (e.g. `tsconfig.tools.json`, `allowJs`+`checkJs`, `include:
  ["tools/**/*.js"]`, run as its own `npm run typecheck:tools` script) so the repo's main
  `tsconfig.json` and its `strict`/`exactOptionalPropertyTypes` settings for `src/` are never
  touched or weakened. Sizing that spike is not done here — it is future work, named so it is not
  silently lost.

## Out of scope

- **`tsconfig.json`, `allowJs`, `checkJs`, or any typecheck coverage of `tools/`.** See above —
  a deliberate, justified exclusion, not an oversight.
- **Reformatting `tools/**/*.js` to Biome's 2-space style.** Explicitly fenced by the `overrides`
  entry in `## Scope` item 2. The existing indentation/spacing style in `tools/` is left exactly as
  committed, except the 4 lines the safe autofix in item 3 touches.
- **`run-bounded.js`, `run-bounded.proof.js`, `run-bounded.hang-fixture.js`, `lane-inventory.js`,
  `reference-check.js`, `test-skip-integrity.js`.** Zero lint-rule findings measured on any of these
  six files (`reference-check.js` and `test-skip-integrity.js` carry only the formatter/
  `organizeImports` noise item 2 fences out) — none of them gets a code-line change.
- **Any change to `src/`, `package.json`'s scripts, `AGENTS.md`, `plans/nfr-catalog.md`,
  `plans/board.md`, or any ADR.** Same fence `ABC-122`/`ABC-123` held on `tools/`-scoped tickets.
- **A CI job or a pre-commit hook.** Standing fence (`AGENTS.md` § Deployment posture) — this
  project has no CI and no git remote.
- **Any change to Biome's `recommended` preset, rule severities, or `lineWidth`/`indentWidth` for
  `src/**/*.ts`.** Untouched; this ticket only widens *which files* are read and scopes one
  `overrides` entry for `tools/`.

## Acceptance (Given/When/Then)

- **`A1` (coverage lands — files are read, not ignored).** **Given** the delivered `biome.json`,
  **when** `npx biome check tools/` (or `npm run lint`) is run, **then** it reports **`Checked 7
  files`**, not `Checked 0 files`, and the *"These paths were provided but ignored"* block is gone.
  Checked by running the command and reading the summary line — the exact contrast to today's
  measured baseline in `## Problem`.
- **`A2` (red-then-green proof — coverage is demonstrated, not asserted).** **Given** a planted
  violation temporarily added to any one `tools/grugops/*.js` file (e.g. a reintroduced
  `Object.prototype.hasOwnProperty.call(...)` call, which `noPrototypeBuiltins` flags), **when**
  `npm run lint` is run first against the **pre-change, currently-committed** `biome.json`, **then**
  it reports 0 findings for that file — the planted violation is invisible (**RED**, in the sense
  that lint fails to catch a real problem, silently). **When** `npm run lint` is then run against
  the **delivered** `biome.json` with the same planted violation still in place, **then** it reports
  the violation as a diagnostic (**GREEN** — lint now catches it). The planted violation is reverted
  immediately after and never delivered; the before/after transcript is reported at delivery, not
  merely claimed.
- **`A3` (the three measured real findings are resolved, not left as new noise).** **Given** the
  baseline measured in `## Problem` (1 `lint/suspicious/noPrototypeBuiltins` warning, 2
  `lint/complexity/noUselessContinue` infos, all in `tools/grugops/uat-spec-integrity.js`), **when**
  the fix is applied via Biome's own safe autofix, **then** `npm run lint` reports **0 errors, 0
  warnings, 0 infos** for every file under `tools/` — checked by the summary line, not by exit code
  alone (Biome's own exit code is `0` even with warnings/infos present, measured at this cutting
  hop, so exit code alone would hide a live finding).
- **`A4` (the formatter/`organizeImports` fence holds — no stylistic reformat rides along).**
  **Given** the delivered `biome.json`'s `overrides` entry, **when** `npx biome check --write
  tools/` is run again after delivery, **then** it reports **`Fixed 0 files`** — the existing
  indentation/spacing style in `tools/` is provably untouched by the coverage change. Checked by
  running the command and reading the summary line.
- **`A5` (typecheck is unchanged, stated not silently).** **Given** the delivered `tsconfig.json`,
  **when** diffed against the pre-ticket committed version, **then** it is **byte-identical** —
  checked by `git diff --numstat` reporting 0 lines touched in `tsconfig.json`. `tsc --noEmit`'s own
  behavior on every `.js` file in the repository is unchanged.
- **`A6` (the fence — `git diff --numstat` scoped).** `git diff --numstat <base>...HEAD` touches
  only `biome.json` (the two edits in `## Scope` items 1–2) and
  `tools/grugops/uat-spec-integrity.js` (the safe-autofix lines in item 3) — no line under `src/`,
  no line in `package.json`, `tsconfig.json`, `AGENTS.md`, `plans/nfr-catalog.md`, `plans/board.md`
  or any ADR, and no line in `run-bounded.js`, `run-bounded.proof.js`,
  `run-bounded.hang-fixture.js`, `lane-inventory.js`, `reference-check.js` or
  `test-skip-integrity.js`.
- **`A7` (the change doesn't break the tools it touches).** `uat-spec-integrity.js` is hand-run,
  not wired into `npm test` (`AGENTS.md`'s own test-integrity line invokes
  `test-skip-integrity.js`, not `uat-spec-integrity.js`, via `npm test`'s own path) — **given** the
  safe-autofixed file, **when** it is invoked the same way it is invoked today (whatever its own
  documented/observed invocation is — this is a re-derive-at-delivery item, not assumed), **then**
  its behavior and exit code are unchanged from before the autofix. Checked by running it
  before-and-after the autofix on the same input and diffing the output.
- **`A8` (production behavior otherwise unchanged; repo-wide gates stay green).** `npm test`
  (through the unchanged wrapper, default `N = 60000`) is green at the current baseline count
  (report the live count at delivery — do not assume the `48 files / 1467 tests` figure recorded on
  `ABC-123`'s own trace row is still current). `npm run lint` (the whole repo, `src/**/*.ts`
  included) exits `0` with **0 new findings under `src/**`** — this ticket's `biome.json` edits do
  not touch the `src/**/*.ts` / `spike/**/*.ts` entries or their formatter/rule settings. `npm run
  typecheck` and `npm run build` each exit `0`.

## Dependencies

- **None blocking.** `ABC-123` is `Done` and merged to the wave (owner's word,
  `…e8061413`, item 1); this ticket is the follow-up both its own QE and Security/NFR gates named.
  No other open `Backlog` ticket touches `biome.json` or any file under `tools/grugops/`, checked
  at this cutting hop.
- **Read-only measurement, not a committed change, informed this page.** The exact figures in
  `## Problem` (`Checked 0/7 files`, `8 errors / 1 warning / 2 infos`, the `1,595/1,651`-line
  reformat count) came from a temporary, reverted scratch copy of `biome.json` — `git status` was
  clean before and after every measurement in this cutting hop. The delivering Software Engineer
  re-derives these numbers against `HEAD` rather than trusting this page's transcript.

## Security / NFR triggers

- **`N8-LANE` — not engaged. Lint is not a vitest lane.** This ticket adds no file under `src/`,
  runs no vitest suite of its own, and `biome check` is not collected by, or charged against,
  `NFR-008`'s default-lane CPU budget in `plans/nfr-catalog.md`. Stated explicitly so this is not
  silently assumed `0` — it is `0` because the mechanism this ticket touches (Biome's own file
  walker) is categorically outside the lane the `N8-*` family measures, not because the charge was
  measured and happened to net to zero.
- **`N8-SPAWN` — not engaged.** No test criterion in this ticket spawns a child process; `A2`'s
  red-then-green proof runs `npm run lint` by hand at delivery time, outside any lane.
- **Security: no ASVS surface.** No new spawn shape, no shell, no external input path, no
  production (`src/`) behavior change. The only code-line change is two safe, mechanical
  rewrites (`Object.hasOwn`, two dead `continue` removals) in a hand-run, non-shipped dev-tooling
  script.

## Test notes

1. **`A2`'s red-then-green transcript is the criterion that decides whether this ticket did
   anything real** — the same discipline `ABC-122`/`ABC-123` used for their own fixes: a coverage
   claim that is never shown failing to catch a planted problem on the old config, then catching it
   on the new one, is an assertion, not a demonstration.
2. **`A4` is the guard against scope creep riding along on a coverage ticket** — without it, the
   first `npm run lint` (or `lint:fix`) run after this ticket lands would silently reformat six
   files nobody asked to touch, mixing an authorised coverage change with an unauthorised stylistic
   rewrite in the same commit.
3. **`A3`'s check reads the summary line, not the exit code**, because this cutting hop measured
   that Biome's own exit code stays `0` even with live warnings/infos present — an exit-code-only
   check here would look green while `tools/` still carried the very findings this ticket exists to
   surface.
4. **Report the live `npm test` count at `A8`, not the last-recorded trace figure** — the wave has
   moved since `ABC-123`'s own trace row was written (its own count was already stale at delivery
   time, per that ticket's own `A7` note).

## Size and priority rationale

**Size `XS`.** One two-part `biome.json` edit (an `includes` addition plus one scoped `overrides`
entry) and one safe, mechanical three-line autofix in a single file — no new production feature, no
new file, no dependency change, no `src/` line. Calibrated against `ABC-057`/`ABC-059`/`ABC-104`
(each `XS`: a narrow, single-file fix with one acceptance surface); this ticket's moving parts (a
config edit plus a coverage-proof AC) match that shape, and the explicit typecheck-out-of-scope
decision keeps it from growing into the unbounded `checkJs` sizing question named above.

**Priority `P2`.** Not `P0`/`P1`: nothing is broken at `main` today, both source gates rated the gap
non-blocking/informational, and the owner gave no ordering ahead of other named work — only the
authorisation to cut the ticket (*"lint ticket ok"*). Not `P3`: this closes a **named, two-gate
gap** (QE finding + Security/NFR informational line) on the only automated guard the repository's
own gate-support tooling has, and it was explicitly authorised this wave rather than left
indefinitely unscheduled, so it is not mere polish.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at this cutting hop,
**2026-09-27**. **Result: 10 of 10 MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the gap is named by two independent, already-recorded gates (QE finding `…58925283`, Security/NFR informational `…9cbd8b67`), re-measured fresh at this cutting hop (`Checked 0 files … ignored`), not re-derived from either gate's own words alone |
| 2 | scope and out-of-scope clear | **✅** four scoped deliverables (`includes`, one `overrides` entry, the safe autofix, the typecheck decision) and six fences, each naming the file(s) or config it does not touch |
| 3 | INVEST-shaped | **✅** independent of every other open ticket (checked: none touch `biome.json` or `tools/grugops/`); each acceptance criterion below is a runnable, falsifiable check; small by the size rationale above |
| 4 | acceptance testable and measurable | **✅** eight criteria: two exact file-count/summary-line assertions, one red-then-green proof discipline, an exact 0/0/0 findings count, a zero-files-rewritten formatter-fence check, a byte-identical-diff check, a `git diff --numstat` fence, a behavior-preserved re-run, and the repo-wide green-gates check |
| 5 | dependencies known | **✅** none blocking; checked for overlap against every other open `Backlog` ticket (none found touching `biome.json` or `tools/grugops/`); the measurement method (scratch, reverted config) stated so the delivering hop knows to re-derive, not trust, this page's numbers |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` and `N8-SPAWN` both explicitly not engaged, with the reasoning stated (lint is not a vitest lane; no lane-collected file or spawn is added) rather than left silent |
| 7 | test notes present | **✅** four, each naming the criterion that actually decides the fix's worth rather than restating the acceptance list |
| 8 | size assigned | **✅** `XS`, calibrated against three named comparables, with the reason it does not grow (the typecheck exclusion) stated |
| 9 | priority assigned | **✅** `P2`, with the not-`P0`/`P1` and not-`P3` arguments both stated and anchored to the two source gates' own ratings |
| 10 | no major unresolved blocker | **✅** none. The one open judgment call this page carries — the exact file chosen to host `A2`'s planted violation, and `A7`'s exact re-derived invocation of `uat-spec-integrity.js` — is left to the delivering hop by design (BA/PM does not author the fix or re-derive a fact only the delivering hop can measure fresh), the same shape `ABC-123`'s own DoR item 10 used, and it is falsifiable either way, so it does not block the pull |

Column moves are the Orchestrator's.
