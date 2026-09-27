---
id: 20260927T111632Z-ba-pm-decision-abc124-cut-dor-10of10-lint-tools-d747a73a
kind: decision
by: ba-pm
at: 2026-09-27T11:16:32Z
verified_by:
confidence: high
refs:
  - ABC-124
  - ABC-123
  - biome.json
  - tsconfig.json
  - tools/grugops/run-bounded.js
  - tools/grugops/uat-spec-integrity.js
  - plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md
  - plans/traceability.md
  - .grugops/context/qe-ABC-123/notes/20260926T211200Z-qe-e2e-observation-58925283.md
  - .grugops/context/secnfr-ABC-123/notes/20260926T210200Z-security-nfr-decision-9cbd8b67.md
  - .grugops/context/wave-2026-09-25/notes/20260927T110855Z-orchestrator-decision-e8061413.md
supersedes:
---

# ABC-124 cut: extend Biome lint coverage to `tools/grugops/*.js`, typecheck deliberately kept out of scope. DoR 10/10 — pullable today

Hand-authored and unsealed: a `decision`, not a stamp. There is no `scripts/context-io.ts` on this
install and `human_admission` is `off` (`.grugops/factory.config.json`), the same posture every
prior hop in this worktree recorded under (see `ticket-run-bounded-r2r3`'s own note,
`…f3a1c8e0.md`, for the identical disclaimer on `ABC-123`'s own cut).

## Owner's word and source, not re-derived

Owner (Olger Oeselg), 2026-09-27, verbatim: **"lint ticket ok"** — item 3 of a three-part answer
(`.grugops/context/wave-2026-09-25/notes/20260927T110855Z-orchestrator-decision-e8061413.md`),
which itself reads: *"Cut a follow-up ticket (BA/PM): extend Biome lint (and, if cheap, typecheck)
to cover `tools/` — the QE finding on ABC-123 (`qe-ABC-123` `…58925283`) and Security/NFR's
informational line (`…9cbd8b67`)."*

Both source items are gate notes already in the shared context, not re-derived from a fresh
opinion here:
- QE's finding (`qe-ABC-123` `…58925283`): `biome.json`'s `files.includes` has no `tools/**` entry,
  so `npm run lint`'s green `A7` reading on `ABC-123` never actually read either changed file.
- Security/NFR's informational line (`secnfr-ABC-123` `…9cbd8b67`): *"`npm run lint` and
  `typecheck` do not read `tools/`… The committed proof is the only automated guard on these two
  files, and it catches a regression only when someone runs it."*

## What was measured at this cutting hop (read-only; nothing committed by the measurement itself)

- `npx biome check tools/` today: **`Checked 0 files … These paths were provided but ignored:
  - tools/`** — a structural no-op, not a clean pass.
- Pointed at `tools/` through a temporary, reverted scratch copy of `biome.json` (`files.includes`
  gained `"tools/**/*.js"`; `git status` clean before and after every measurement):
  **`Checked 7 files … Found 8 errors. Found 1 warning. Found 2 infos.`** 6 of the 8 errors are
  pure reformatting (the tools/ files' own long-standing indent style vs Biome's committed 2-space
  formatter config); 2 are `assist/source/organizeImports`. The 1 warning is
  `lint/suspicious/noPrototypeBuiltins` and the 2 infos are `lint/complexity/noUselessContinue`,
  all three in `tools/grugops/uat-spec-integrity.js`. `biome check --write tools/` against the same
  scratch config brought a recheck to `Checked 7 files … No fixes applied` (0/0/0) in one pass —
  every finding is Biome's own `FIXABLE` (safe fix) class.
- With an added `overrides` entry (formatter off, `organizeImports` off, scoped to
  `tools/**/*.js`, linter rules unchanged) in the same scratch config: `Checked 7 files … Found 1
  warning. Found 2 infos.` — 0 errors, the 6-file reformat and the 2 `organizeImports` findings
  gone, only the 3 real lint-rule findings remain. `biome check --write tools/` under this scoped
  config touches exactly 1 file (`uat-spec-integrity.js`, +1/−3 lines) and brings the recheck to
  0/0/0. Confirmed Biome's own exit code is `0` even with the unfixed warning/infos present — a
  check on `A3` must read the summary line, not exit code alone.
- `tsconfig.json`'s `include` is `["src/**/*.ts", "spike/**/*.ts", "vitest.config.ts"]`, no
  `allowJs`/`checkJs` anywhere in `compilerOptions`. This is a whole-repo `.js` blind spot, not a
  `tools/`-specific one.
- `git status` was clean before this cutting hop began and is clean now; every scratch edit above
  (`biome.json` copies under `/tmp`, one temporary in-place edit reverted with `git checkout --`)
  left no trace in the worktree.

## What was cut

One new ticket, `ABC-124` (`XS`, `P2`, `EPIC-004`), at
`plans/tickets/ABC-124-extend-biome-lint-coverage-to-tools.md`. Scope: (1) add
`"tools/**/*.js"` to `biome.json`'s `files.includes`; (2) add one `overrides` entry scoping
`tools/**/*.js` with the formatter and `assist/source/organizeImports` turned off, keeping the
change to the size the owner authorised rather than forcing a measured ~1,595-insertion /
~1,651-deletion stylistic reformat across 6 of 7 files nobody asked to touch; (3) apply Biome's
own safe autofix to the three real lint-rule findings, all in `uat-spec-integrity.js`; (4) leave
typecheck/`checkJs` explicitly out of scope, with the justification written on the ticket page
(a repo-wide flag flip with an unmeasured, unbounded new-diagnostic risk on ~4,700 lines of
never-checked `.js` — not "cheap", the owner's own stated condition for including it).

Eight acceptance criteria (`A1`–`A8`), each testable and measurable, including the task's own
required red-then-green proof (`A2`): a planted violation is shown invisible to `npm run lint`
against the pre-change, currently-committed `biome.json`, then caught after the change lands, then
reverted and never delivered.

## DoR score: 10/10 — PULLABLE TODAY

Full table is on the ticket page. No item scored ⚠️: the one open judgment call this page carries
(the exact file chosen to host `A2`'s planted violation, and `A7`'s exact re-derived invocation of
`uat-spec-integrity.js`) is left to the delivering hop by design — BA/PM does not author the fix or
re-derive a fact only the delivering hop can measure fresh — and it is falsifiable either way, the
same non-blocking shape `ABC-123`'s own DoR item 10 used.

## Checked for overlap

No other open `Backlog` ticket touches `biome.json` or any file under `tools/grugops/` at this
cutting hop.

## Board (proposed row, not applied — BA/PM does not edit `plans/board.md`)

`ABC-124` — `Backlog → Ready` (DoR 10/10 MET). Column moves and `plans/board.md` edits are the
Orchestrator's.

## Traceability

One row appended: `ABC-124 (cut)` in `plans/traceability.md`, `EPIC-004`, summarising the cut,
the measured baseline, and the DoR result.
