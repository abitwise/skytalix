---
id: ABC-062
title: Three UAT scenarios end "then the usage line" and no test asserts one — and the argv that crashes when the usage line goes missing is resolved by no test either
status: backlog
column: Backlog
size: S
priority: P1
epic: —
feature: —
---

# ABC-062 — the refusal path: what it says is asserted nowhere, and two command lines reach it untested

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03) out of QE/E2E's `R3` + `R4` (`.grugops/context/uat-ABC-042-qe/notes/`). **`ABC-042` is
> merged, `Done`, and both gates passed against it: its page is NOT edited and no criterion of its is
> re-opened.** The delivered refusal path is correct on every point examined; what is missing is the
> assertion.

## Problem

*User*: the person who types a command line wrong — which, on a command with a closed six-word
vocabulary, is everyone at least once. The only thing they are given is the refusal message.

*Pain*: **the refusal's message is asserted by nothing, and one of its branches crashes instead when
a single word is removed.**

- **The usage line has no assertion anywhere in the repository.** `USAGE` in `src/cli.ts` is
  `usage: npm run chess [--colour white|black|random] [--ascii | --unicode]`; the word `usage` occurs
  in `src/cli.test.ts` exactly **once, inside a comment**. Deleting `${USAGE}` from the rejection
  path ships **856/856 green** — while **UAT-9, UAT-10 and UAT-12 each end with "then the usage
  line"**, and it is the only help this version of the program offers.
- **`["--colour"]` — the command line that simply stops — is resolved by no test.** The near-miss
  family at `:401` always supplies a second token, `A6(ii)`'s sweep always supplies a word, and all
  four spawned refusal children carry one. QE mutated the `?? token` fallback at
  `src/cli-options.ts:130` (`next ?? token` → `next as string`): **856/856 green**, while
  `node src/cli.ts --colour` throws an uncaught `TypeError: text is not iterable` out of
  `printableOf` — a seven-line Node stack trace where the usage message belongs. **The exit code is
  `1` either way**, so even an exit-code assertion passes.
- **`["white"]` — a value word with no `--colour` in front of it — has no deterministic coverage at
  any level** (UAT-10 row d). `:477`'s random corpus reaches it only by accident.

*Value*: the refusal is a product surface, not an error path — for a program that prints one frame
and exits, it is half of everything a user can see. **After this ticket the message is pinned to the
accepted set, and both untested argvs are named.**

## Scope

- **A new `it` block naming the two uncovered argvs** — `["--colour"]` and `["white"]` — asserting
  `ok`, the `problem` text and the `offending` tokens for each.
- **A new `it` block asserting the usage line** over the refusal children **already captured at
  module scope**: that one is written, and that the tokens it names are exactly `ACCEPTED_ARGUMENTS`.
- **A comment naming the mutant** (`next as string`) and the scenarios that require the line
  (UAT-9, UAT-10, UAT-12), so a later "tidy" does not delete the reason.

## Out of scope

- **Every merged row.** `:315`, `:325`, `:401`, `:477` and `:750` stay **byte-identical**; the new
  assertions live in their own named blocks. `ABC-042`'s `A5`/`A6` are neither widened nor
  re-interpreted.
- **Exporting `USAGE` from `src/cli.ts`.** That module **exports nothing** by `ABC-042`'s `A2` and
  `ADR-0011` clause 4, and a test that forced an export would break a criterion to check a string.
  The line is read from a captured child's **stderr**, which is where a human reads it.
- **Any new child process.** The refusal children exist; the spawn count is pinned at **10**
  (`:780`) and an eleventh is a defect.
- **The five refusal command lines that are never spawned** (`--help`, `--COLOUR white`,
  `--colour WHITE`, and the two above) as **end-to-end** cases. They share one early-return path;
  this ticket pins them at the resolver, which is where the mutant lived.
- **Zero production lines.** `src/cli.ts` and `src/cli-options.ts` are read, never edited.

## Acceptance (Given/When/Then)

- **`A1` (the crashing branch is named).** **Given** `resolveOptions(["--colour"])`, **then** `.ok`
  is `false`, `.problem` is the missing-value message, and `.offending` deep-equals `["--colour"]`.
  **And given** `next as string` substituted at `src/cli-options.ts:130`, **then** the suite is
  **RED**. *(Today: **856/856 green** with that mutant, measured by QE.)*
- **`A2` (the bare value word is named).** **Given** `resolveOptions(["white"])`, **then** `.ok` is
  `false`, `.problem` is the unrecognised-argument message, and `.offending` deep-equals `["white"]`.
- **`A3` (a refusal writes the usage line).** **Given** each refusal child already captured at module
  scope, **then** its **stderr ends with the usage line** and its stdout carries **zero** frame rows.
  **Measured target: 6 of 6 captured refusal children**, `0` new spawns.
- **`A4` (the line names exactly the accepted set).** **Given** the usage line read from a child's
  stderr, **then** the set of tokens it contains that appear in `ACCEPTED_ARGUMENTS` **equals
  `ACCEPTED_ARGUMENTS`, element for element, both ways** — **6 of 6**. So a seventh accepted argument
  that never reaches the usage text reds, and a usage line advertising an argument the resolver
  refuses reds. **The expectation is read from `ACCEPTED_ARGUMENTS`, never transcribed** — a second
  spelling of the vocabulary is the same defect one level down.
- **`A5` (deleting the line reds).** **Given** `${USAGE}` removed from the rejection write in
  `src/cli.ts`, **then** the suite is **RED**. *(Today: green.)*
- **`A6` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `src/cli.test.ts` — **one path**, **zero production lines**,
  **`spawned` still `10`**. Suite green, skip **0**.

## Dependencies

- **None open.** `ABC-042` is merged at `dbaf972` and both modules exist on `main` (verified at the
  cut).
- **Same-file neighbours, not blockers:** `ABC-058`, `ABC-059`, `ABC-061`, `ABC-063`, `ABC-064`. No
  shared assertion, every one of them states "no merged row edited", any order works.
- **`ABC-063` overlaps in subject and not in code** — it names six argvs at the same refusal path.
  Either can merge first; if both land, the two case lists must stay separately named so a reader can
  tell UAT-16's six from this ticket's two.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes** — the refusal children are reused, which is why QE costed this at zero.
  Added work: two pure resolver calls and a string comparison over already-captured stderr.
  **`N8-LANE` is `MET` at 0.23× (152.5 ms of 650 ms) and this ticket must not move it.**
- **`NFR-002` not triggered.** A refusal writes no frame row, by `ABC-042`'s `A5`/`A6`.
- **Security: not triggered, but adjacent and worth one line.** The usage text is **this module's own
  prose** — `ABC-042`'s bar 3 governs the **echoed token**, which this ticket does not touch.
  `ABC-041`'s four clauses: no manifest touch, no non-test file under `src/`, no network/write/new
  spawn, blast radius one path.

## Test notes

1. **Write `A1`'s mutant and `A5`'s deletion first and watch both RED.** Two independent one-word
   witnesses; a guard that passes without them has been argued, not tested.
2. **Assert the line as the LAST line of stderr, not by `toContain`.** A build that writes the usage
   text and then a stack trace would pass a containment test — which is exactly the M2 failure shape.
3. **Derive `A4`'s expectation from `ACCEPTED_ARGUMENTS`.** Splitting the usage line on
   non-vocabulary characters and comparing sets keeps the row alive when the wording changes and red
   when the vocabulary does.
4. **Do not fold the two argvs into the near-miss family at `:401`.** That family is *complete over
   position* and derived from the table; adding hand-picked members changes what a merged criterion
   means.

## Lane cost — how many test FILES this ticket implies

**Zero.** Two blocks in an existing file; no child process.

## Size and priority rationale

**Size `S` (2).** Two blocks, three pure calls, one string comparison over captured output, plus two
mutants already written down. The `A4` set-comparison is the only fiddly part.

**Priority `P1`.** The second of exactly two items in this follow-up set with a **proven** witness,
and its failure shape is the worse of the two for a human: not a wrong picture but a stack trace
instead of the one sentence telling them what to type. **Not `P0`: the delivered build is correct —
it prints the line today.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one unasserted message, one crashing branch, one untested bare word, each with the measurement behind it |
| 2 | scope and out-of-scope clear | **✅** two new blocks; five fences, including "do not export `USAGE`" and "no eleventh child" |
| 3 | INVEST-shaped | **✅** independent, small, testable by a mutation already performed; `ABC-063`'s overlap is named and is not an ordering |
| 4 | acceptance testable and measurable | **✅** **2** argvs named, **6 of 6** refusal children carry the line, usage tokens **equal** `ACCEPTED_ARGUMENTS` both ways, two mutants RED, **1** path, `spawned` **10** |
| 5 | dependencies known | **✅** none open; five same-file neighbours and one subject-overlap named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms, **0** new files, **0** new spawns, against 152.5 ms today; `NFR-002` untriggered; bar 3's scope stated so it is not re-litigated |
| 7 | test notes present | **✅** four, including "last line, not `toContain`" — the specific mechanism M2 defeats |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **✅** none |
