---
id: ABC-280
title: "tools/tune lands alone: ABC-239's tuner (tracer, PGN reader, bounds, fit, tests) merges with no src/ change. The identity gate (B-T1) and reproducibility (B-T3) are read on main's table. Tools only"
status: done
column: Done
closed: "2026-11-04, merged to local main at 0c8b385a (a merge commit; the src/ diff of the real merge is empty, QE-280-c met); QE PASS_WITH_GAPS (qe-ABC-280 …cf60119e); UAT waived (tools only); post-merge npm test 2 650 / 2 650 (the Orchestrator's board card). Front matter only, by bapm-W1-bundle-cut"
size: S
priority: P3
epic: EPIC-011
feature: —
adr: "ADR-0067 (ACCEPTED; d10, one tool module tools/tune; d5, the identity gate; d7, the provenance header; § Addendum, the Lichess data pin). No ADR change: this lands the method's tool without its output. The Architect's follow-on 1 (arch-ABC-239-f3f4 …69f22167 § 4); the Orchestrator's 'keep the tool' (…4c76bf7a)"
---

# ABC-280: `tools/tune` lands on `main` alone

> **Cut 2026-11-04 by BA/PM: DoR 10/10, Ready** (task `bapm-ABC-239-close`, records only, at `main` `ac55ddf6`; nothing
> run). Sources: the Orchestrator's decision `orch-2026-10-30a` `…4c76bf7a` ("keep the tool: BA/PM cuts a tools-only
> landing of tools/tune (no src change; the base table untouched) so the second pull starts from a merged, tested
> tool"); the Architect's `arch-ABC-239-f3f4` `…69f22167` § 4, follow-on 1; `se-ABC-239b` `…c3f94eab` and its data note
> `…e3751084`. `ABC-239`'s first pull closed NOT MET the same day (§ Close on its page).

## Problem

- **User:** the next tuning pull's engineer, and the owner who pays for its host time.
- **Pain:** the tuner exists only on `grugops/ABC-239b`, an unmerged branch whose tip carries a fitted table that will
  not ship. It was already rebuilt once (`grugops/ABC-239` → `grugops/ABC-239b`). Unmerged, it rots against every
  `src/evaluate*` change, and nothing tests it on `main`.
- **Value:** the second pull (after `ABC-271`) starts from a merged tool with its own lane green, and spends its time
  on the fit, not on rebuilding the tool. The identity gate on `main` catches the first `src/evaluate*` change that
  the tracer does not model (F1's class).

## Scope

1. The tool commits of `grugops/ABC-239b`, and only those: `625b75fe`, `5ce4f870`, `def26997`, `8c03b713`. They are
   cherry-picked onto `main` (or squashed into one commit that names all four; the engineer's call). They bring:
   - `tools/tune/tracer.ts`, `tools/tune/pgn.ts`, `tools/tune/bounds.ts`, `tools/tune/tune.ts`,
     `tools/tune/tune.test.ts`;
   - one line in `tsconfig.json`'s `include` and one in `biome.json`'s `files.includes` (`tools/tune/**/*.ts`).
2. `bounds.ts` keeps `se-ABC-239b`'s one bound row as written (king-mobility A2 (b)'s phase-24 twin). **It is data from
   the closed pull, not a bar.** The second pull's PREREG sets its own bound set.

## Out of scope

- **Any change under `src/`.** That includes `src/evaluate-params.ts` (no fitted table: `26d06118` is not taken), test
  retirements and re-pins (also `26d06118`'s), and `954d44fb` (`QE-270-e`, the K1 (e) bite rows; owed by the second
  pull).
- Any fit of record, any game, `ADR-0067` d6's margin-aware amendment, R1 as a relation row, and tracing E4a's terms
  (all the second pull's).

## Acceptance criteria

- **A1 (contents).** **Given** the branch tip, **when** `git diff --name-only main...HEAD` runs, **then** outside
  `.grugops/`, `plans/` and `memory-bank/` it lists exactly seven paths: the five `tools/tune/*.ts` files, `tsconfig.json`
  and `biome.json`. **And** `git diff 8c03b713 HEAD -- tools/tune` is empty: each tool file is byte-equal to its blob at
  `8c03b713`. **And** the `tsconfig.json` and `biome.json` diffs against `main` are one added line each, equal to
  `625b75fe`'s.
- **A2 (`src/` untouched; zero production lines).** **Given** the branch tip, **then** `git diff --stat main HEAD --
  src` is empty, and `git -c core.quotePath=false diff --name-only main HEAD | grep '^src/'` prints nothing. So the UAT
  waiver for zero production lines applies. QE re-reads it on the delivered merge, in the standing rule's reference form.
- **A3 (default lane, unchanged count plus the tool's rows).** **Given** `main`'s `npm test` count N, read at the
  pre-ticket head on the same day, **when** `npm test` runs at the branch tip, **then** it exits 0 with N + 3 passed and
  0 failed. The 3 are the rows of `tools/tune/tune.test.ts` outside `TUNE_DEEP`: the source pins, the quiet filter's
  rules record, and the FEN source row. **And** the skip-count capture (AGENTS.md § Test integrity) returns the same
  integer as on `main`. The deep rows are not registered when `TUNE_DEEP` is unset, so they are never skipped rows.
  **And** `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` prints `No findings.`.
  **And** `npm run lint`, `npm run typecheck` and `npm run build` exit 0. After the build, `dist/` holds no file from
  `tools/` (`tsconfig.build.json` builds `src/uci.ts` only).
- **A4 (the tool's lane).** **When** `TUNE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run tools/tune`
  runs at the branch tip under the host lock, **then** it exits 0 with every registered row passed and 0 skipped. The
  count is reported (`se-ABC-239b` read this lane green; its count here is `UNKNOWN - verify`).
- **A5 (B-T1, the identity gate on `main`'s table).**
  - **Given** the pinned Lichess export, outside the repository at `<data>/lichess/` and checked with `sha256sum -c`
    against `ADR-0067` § Addendum's line (sha256 `b319297e…4320`), and the own games tracked at the branch tip.
  - **When** `extract` runs at `main`'s `src/evaluate-params.ts` (unchanged), under the host lock, with `timeout 1800`
    and `--max-old-space-size=3000`.
  - **Then** the identity gate (`ADR-0067` d5) reports **0 misses** over every gated key. The key count and the worst
    |model − evaluate| are reported. `se-ABC-239b` read 0 misses over 1 488 071 keys, worst 0.9583 cp. A different
    count is reported, and it is not a miss.
- **A6 (B-T3, reproducibility, emitted to scratch).**
  - **When** two full `extract | fit | emit` runs start from `main`'s table, with the tool as landed (scope 2's bound
    row included), and each emits to a scratch path outside the tree,
  - **then** the two emitted files are byte-identical, and their sha256 is reported.
  - **Reported, not graded:** whether that sha256 equals `26d06118`'s `10581fb5…95af`. Equality is expected only if
    the data manifest's sha256 equals `se-ABC-239b`'s `c9d777ef…5934`. No PGN changed between `a8fbade5` and `main`
    `ac55ddf6`. The manifest's sha256 is reported either way.
  - **Never committed:** `src/evaluate-params.ts` at the tip stays byte-equal to `main` (A2).
- **A7 (records).** **When** `node tools/grugops/records-path-check.js --base main` runs at the branch tip, **then** it
  exits 0. Every host path in a record is a placeholder (`<data>/lichess/`, `<scratch>`).
- **A8 (QE).** A `qe-e2e` hop records its verdict before the ticket leaves In Review. UAT is waived by A2's rule. QE's
  verdict and the waiver are recorded in the Done note.

## What happens on a miss

- **A1 or A2 fails:** it is a defect in the landing, fixed on the branch. No `src/` line may be added to make a row
  pass.
- **A4 or A5 fails on `main`** (the tool green on `a8fbade5` but red here): **STOP to Architect/Design**, with the
  failing row or the first miss. A miss means the tracer does not model `main`'s evaluation (F1's class). `src/` is not
  edited to fit the tool.
- **A6 fails:** F7's class, a defect, fixed before merge.
- **A data-stage stop fires** (`ABC-239` § What happens on a miss, stops 1–4: fewer than 250 000 Lichess rows, reader
  drops over 0.1 %, a run over 30 min, or the heap over 3 000 MB): **STOP to Architect/Design**, with its count.

## NFR triggers

- **`NFR-008`:** the deep rows stay outside the default lane, registered only under `TUNE_DEEP=1`. The 3 source rows
  join the default lane. Their added wall time is reported, not graded (`UNKNOWN - verify`; they read source files and
  one test file).
- **Host:** A5 and A6 take about 15 min under the lock (`se-ABC-239b`: one run 4 min 44 s to 5 min 0 s; extract peak RSS
  1.50–1.60 GB, inside the 3 000 MB flag). The figures are reported.
- **Security:** the tool reads local files only and makes no network call. The source-pin row asserts both. The 2.17
  GB export stays outside the repository and is never committed. No new NFR row.

## Test notes

1. No new test is written. The tool's own rows (`ABC-239` test notes 4, 5 and 8) land as they are.
2. A5 and A6 are host reads, recorded in the engineer's data note with raw outputs under that task's `raw/`. The
   emitted scratch files are not committed.
3. UAT is waived (A2). The QE hop is still owed (AGENTS.md, standing rulings).

## Size and priority

- **Size: S.** Four cherry-picks with no expected conflict (`tools/`, `tsconfig.json` and `biome.json` did not change
  between `a8fbade5` and `main` `ac55ddf6`, and nor did `src/`), the gates, and about 15 min of host reads. The
  smallest slice is XS, but A5–A6 add host time, so S.
- **Priority: P3.** It does not change play, and nothing waits on it until the second pull. Landing it soon is cheaper:
  every later `src/evaluate*` merge (first `ABC-271`) is one more chance for the tracer to drift unseen.

## Dependencies

- **None hard.** `ABC-239`'s first pull is closed (2026-11-04), so taking its tool commits collides with no open work.
- **One manual precondition, not a blocker:** the Lichess export is present at `<data>/lichess/` and passes
  `sha256sum -c` (it did for `se-ABC-239b`).
- **Order with `ABC-271`:** `ABC-271` is in design and edits no file here. If its build merges first and adds
  evaluation terms, A5 may miss on them. That is the STOP above, and the tracer's extension belongs to the second pull.
  Landing this first avoids that question.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the tool sits on an unmerged branch, already rebuilt once; the second pull needs it on `main` |
| 2 | scope and out-of-scope | ✅ four named commits, seven paths; no `src/`, no fit, no `954d44fb` |
| 3 | INVEST | ✅ independent (the first pull is closed); S; testable by A1–A8 |
| 4 | testable, measurable acceptance | ✅ exact path list and byte-equality; `src/` diff empty; N + 3 passed, same skip count; lane exit 0; 0 gate misses; two byte-identical emissions; path check exit 0 |
| 5 | dependencies known | ✅ none hard; the Lichess file present (manual precondition) |
| 6 | NFR triggers with targets | ✅ `NFR-008` (deep rows registered only under `TUNE_DEEP=1`); host ≤ 30 min a run, inside 3 000 MB |
| 7 | test notes | ✅ 1–3 |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ no owner item (zero production lines; no ADR change) |

**DoR 10/10. Ready.** The board move to Ready for Dev is the Orchestrator's.
