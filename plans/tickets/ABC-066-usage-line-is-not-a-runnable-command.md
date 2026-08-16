---
id: ABC-066
title: The usage line printed on every refusal is not a runnable command — `npm run chess -- ` occurs 0 times in the program's output, so a user who does what the error message tells him reproduces the error he is reading
status: done
column: Done
size: S
priority: P1
epic: —
feature: —
---

# ABC-066 — the error message that exists to teach the syntax teaches the syntax that produced the error

> **Cut 2026-08-15 by BA/PM** (task `usage-line-fix-2026-08-15`, Workflow 03) on the **project
> owner's direct instruction**, in session, verbatim: *"accept it and cut the usage line fix"* — the
> same sentence that accepted `ABC-042`. **He found it himself, by hand, at a terminal, doing what
> the program told him to do.** No scenario in the nineteen-scenario UAT pack asks about it.
>
> **`ABC-042` IS ACCEPTED AND `Done`. Its page is not edited, no criterion of its is re-opened, and
> it does not move.** See § *This is a NEW requirement* below — it was accepted on criteria it met.

## Problem

*User*: the person who mistypes a command line on a program whose entire vocabulary is six words.
For him the refusal message is not an error path — it is the only instruction the product gives.

*Pain*: **`src/cli.ts:53` prints a command that does not work, to a user who just found out his
command did not work.** Reproduced end to end at the cut (Apple M3, Darwin 25.5.0, Node v24.12.0,
npm 11.7.0, `main` @ `af3eb8b`):

```
$ npm run chess --colour black          # the natural spelling, missing the `--`
npm warn "black" is being parsed as a normal command line argument.
unrecognised argument: black
usage: npm run chess [--colour white|black|random] [--ascii | --unicode]      # exit 1
```

**Line 4 instructs him to type line 1.** He types it again, gets the same four lines, and there is
nowhere else to look: **the string `npm run chess -- ` occurs 0 times in the program's output** —
measured across all six refusal command lines — **and 0 times anywhere under `src/`**. `AGENTS.md`
does not carry it either; that is `ABC-065`'s half and it is a different file (§ Dependencies).

**The correct form works and has never been printed.** Measured at the cut, all six advertised
single-option invocations: `npm run chess -- ` with `[]`, `--colour white`, `--colour black`,
`--colour random`, `--ascii`, `--unicode` — **6 of 6 exit `0`, 27 lines of stdout, empty stderr.**

**And nothing watches the line.** The word `usage` occurs in `src/cli.test.ts` **exactly once, inside
a comment** (`:663`) — re-measured at the cut. That is how a wrong string shipped past two gates, a
30-file 856/856 suite and a nineteen-scenario UAT pack.

*Value*: **the first defect this repository's UAT detector ever caught is repaired, in one line.**
For a program that prints one frame and exits, the refusal message is half of everything a user can
see, and today the half that is meant to unstick him is the half that keeps him stuck.

## This is a NEW requirement, not a missed one

**No `ABC-042` acceptance criterion constrains what the usage line SAYS.** `A6`(iii) requires *"a
usage message **naming the offending argument** is written, the exit code is non-zero, no frame"*
(`:145`) — and the delivered build does exactly that, on all ten measured refusals. **`ABC-042` was
accepted on criteria it met.** This ticket adds a requirement nobody wrote down: *the invocation the
usage line prints must be one the user can actually run.* Recording it plainly so no later reader
mistakes this for a re-opened criterion or a gate that failed.

## Scope

- **`src/cli.ts:53`, the `USAGE` constant — ONE production line.** The printed invocation carries the
  separator: it contains the literal `npm run chess -- `, and the options it advertises follow it.
- **One new `it` block in `src/cli.test.ts`**, over the refusal children **already captured at module
  scope**: the separator form is present, and every invocation the line advertises resolves through
  `resolveOptions`.
- **A short comment at the site** recording why the separator is load-bearing — the package runner
  eats a flag written without it — so a later hop does not tidy it away as noise.

## Out of scope

- **`ABC-042`'s page and every merged criterion.** Not one line. Verified safe rather than assumed:
  `src/cli.test.ts` never reads the usage string (`usage` occurs once, in a comment at `:663`), the
  refusal rows at `:315` and `:325` assert only the offending token, and bar 3 at `:750` filters
  stderr words containing `[2Jpurple` — a `--` word cannot reach any of them. **If a chosen wording
  would require a merged row to move, STOP:** re-opening a merged criterion's instrument is the
  Orchestrator's ruling, not the implementing hop's.
- **Any new child process.** `spawned` is pinned at **10** (`:780`) and an eleventh is a defect
  (`ABC-062`'s fence, adopted here). The end-to-end half — actually running the printed command
  through `npm` and asserting exit `0` — is **npm's behaviour, not this program's**, and it belongs
  in the UAT pack as a scenario, not in this lane. **This ticket's guard therefore proves that what
  the line advertises resolves, not that npm forwards it; that limit is stated, not hidden.**
- **`AGENTS.md`.** Zero bytes. The documentation site of this same omission is `ABC-065` and the pen
  on that file is the `AGENTS.md` Scribe's.
- **Exporting `USAGE`.** `src/cli.ts` exports nothing by `ABC-042`'s `A2` and `ADR-0011` clause 4.
  The line is read from a captured child's **stderr**, where a human reads it — `ABC-062`'s ruling,
  adopted rather than re-derived.
- **`npx`, a binary name, or `node src/cli.ts` as the advertised form.** Distribution is undecided
  (`ADR-0007` clause 5, `EPIC-006`); the usage line names the command that exists and that
  `package.json`'s `scripts.chess` and `AGENTS.md`'s `Dev / run` already name. A third spelling of
  the entry route is a defect, not a fix.
- **The silent-discard path** (`npm run chess --ascii` → board, exit `0`, flag dropped). The package
  runner's, unfixable from here, and already recorded on `ABC-065`.
- **`src/cli-options.ts`.** Read, never edited. No token enters or leaves `ACCEPTED_ARGUMENTS`.

## Acceptance (Given/When/Then)

- **`A1` (the separator reaches the user).** **Given** each refusal child already captured at module
  scope, **then** the usage line on its stderr contains the literal `npm run chess -- `.
  **Measured target: 6 of 6 captured refusal children, 0 new spawns.** *(Today: **0 of 6** — the
  string occurs 0 times in the program's output on any channel.)*
- **`A2` (what it advertises is what the resolver accepts).** **Given** the usage line read from a
  child's stderr, **when** the text after `npm run chess -- ` is expanded into the invocations it
  advertises — a bracketed group optional, `|` an alternation — **then** every member of that
  expansion resolves `ok: true` through `resolveOptions`, **and** the expansion has **at least 6**
  members, including `[]`, `--colour white`, `--colour black`, `--colour random`, `--ascii` and
  `--unicode`. *(All six were run end to end by hand at the cut: exit `0`, 27 stdout lines, empty
  stderr. Today this row cannot even be formed — there is no separator to split on — which is the
  defect, stated as a measurement.)*
- **`A3` (the vocabulary does not move).** **Given** the new line, **then** the set of
  `ACCEPTED_ARGUMENTS` tokens it names is **6 of 6, unchanged**, and `src/cli.ts` gains **no new argv
  token**. So `ABC-062`'s `A4` — the usage line names exactly the accepted set — stays green
  whichever of the two tickets merges first, in either order.
- **`A4` (the guard is falsifiable by the regression that actually shipped).** **Given**
  `src/cli.ts:53` restored to its delivered string byte-for-byte, **then** the suite is **RED**.
  *(Today: **856/856 green** with that string — it is the delivered build.)*
- **`A5` (read, never transcribed).** **Given** the new block, **then** its expectation is derived
  from the line the child actually printed and from `ACCEPTED_ARGUMENTS` at run time; **no second
  spelling of any accepted argument, and no copy of the usage text, is introduced into the test
  file.** A guard that hardcodes the sentence passes on the sentence and not on the property.
- **`A6` (nothing else moved).** **Given** `git diff --name-only <the delivered commit>~1 <the
  delivered commit>` — **the delivered commit**, per the ruling `ABC-060` carries; the ticket page,
  ADRs and everything under `.grugops/` are process artifacts of refinement, not part of what this
  delivers — **then** it shows **exactly** `src/cli.ts` and `src/cli.test.ts`: **2 paths**, **exactly
  1 production line changed** (`git diff --numstat -- src/cli.ts` reads `1 1`, comment lines aside),
  **0 new files**, **`spawned` still `10`**. Suite green, skip **0**.

## Dependencies

- **None blocking.** `ABC-042` is merged, `src/cli.ts` and `src/cli.test.ts` exist on `main`
  (verified at the cut, `af3eb8b`), and **neither file is under a queue claim**.
- **`ABC-065` — same defect, different site, DISJOINT FILES. Ruled a separate ticket, not a
  duplicate.** `ABC-065` changes `AGENTS.md` + `src/cli.test.ts` and its `A6` measures **two paths
  and zero production lines**; this changes `src/cli.ts` + `src/cli.test.ts`. **Neither one's
  criteria can be satisfied by the other's diff** — close `ABC-065` and `npm run chess -- ` is still
  absent from the program's output; close this and the documented option list is still compared to
  nothing. `ABC-065` is additionally blocked (DoR 9/10) by a live claim on `AGENTS.md`
  (`agents-md-owner-grants`); this ticket is not. **Recommended to the Orchestrator: pull them
  together when that claim drains** — until both land there is no correct spelling of the separator
  anywhere a user or a reader can reach.
- **`ABC-062` — same string, same test file, different property. Not a blocker, either order
  works.** `ABC-062` asserts that a usage line is *written* and that its *vocabulary* equals
  `ACCEPTED_ARGUMENTS`; it is a coverage ticket with **zero production lines**, and its `A4` is
  indifferent to a `--` that is not an accepted token (`A3` above pins that). **This ticket asserts
  the line's CONTENT is runnable.** Fences, both directions: the new block is **separately named**,
  neither ticket edits the other's block, and whichever merges second **reuses** the existing
  stderr-to-usage-line helper rather than writing a second one.
- **`ABC-061`, `ABC-063`, `ABC-064`** — same-file neighbours, no shared assertion, any order.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes** — the refusal children are reused. Added work: one string search and a
  handful of pure `resolveOptions` calls over already-captured stderr. **`N8-LANE` is `MET` at 0.23×
  (152.5 ms of 650 ms) and this ticket must not move it.** `N8-SPAWN` is not drawn on: no criterion
  here forces a child.
- **`NFR-002` not triggered.** A refusal writes no frame row (`ABC-042` `A5`/`A6`), and `src/cli.ts`
  exports nothing, so it is on no frame path and is no probe root (`ADR-0011` clause 4).
- **Security — clause (b) is examined, not waved, because this ticket DOES touch a production
  module.** `ABC-041`'s four falsifiable clauses: **(a)** no manifest touch — `package.json` and
  `package-lock.json` are not opened; **(b) does not fire on its own subject, which is CAPABILITY,
  not file-touched**: no Node builtin import is added, no new `process.` read, no
  `spawn`/`exec`/`fetch`/`eval`/`new Function` — the capability `src/cli.ts` already holds is
  `ABC-042`'s, merged and gated; **(c)** no test capability added — no network, no write, no new
  spawn; **(d)** blast radius **2 paths**, both named in `A6`. **The changed bytes are this module's
  own prose. Security bar 3 governs the ECHOED TOKEN and `printableOf` — neither is touched, and the
  new text contains no user input.** Disputed either way, it fires and the gate resolves it.

## Test notes

1. **Write `A4`'s mutant first and watch it RED.** The mutant is not hypothetical — it is `main`'s
   current line. A guard that passes without having been seen to fail on the delivered string has
   been argued, not tested.
2. **Assert the FORM, never the sentence.** `A1` needs `npm run chess -- ` present; an assertion on
   the surrounding wording is `ABC-059`'s defect — a guard pinned to one spelling — reproduced one
   file over.
3. **Take the line from stderr, mechanically.** `USAGE` is not exported and must not become so
   (`A2`/`ADR-0011` clause 4). If `ABC-062` has merged, its extraction helper exists; use it.
4. **Run every form you print, before you print it.** All six were run by hand at the cut and exit
   `0`; `AGENTS.md` § Commands forbids recording a command nobody ran, and this ticket exists
   *because* a command nobody ran was printed to users.
5. **Do not widen the expansion into a combinatorial sweep.** `A2` asks that what is advertised
   resolves; twelve cross-products prove nothing the six single-option forms do not, and the parse is
   the fiddly part — keep it small enough to read.

## Lane cost — how many test FILES this ticket implies

**Zero.** One block in an existing file; no child process.

## Size and priority rationale

**Size `S` (2).** One production line and one guard block — but the guard has to locate the line in
stderr, parse an option grammar into invocations, and stay clear of two neighbouring tickets writing
in the same file. `XS` would price the string edit and ignore everything that keeps it from
regressing.

**Priority `P1`.** The owner asked for this one by name, it is the only user-visible defect ever
found by UAT in this repository, and with `ABC-065` still blocked it is the only reachable half of
the repair. **Not `P0`: nothing in the product is broken** — the board draws, the exit code is right,
the offending argument is named — and `P0` here means the playable-game path (`ABC-031`, `ABC-032`,
`ABC-033`, `ABC-034`, `ABC-037`, `ABC-043`), which this must not preempt.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**. **Result: 10 of 10 — MET.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** reproduced end to end at the cut with its transcript; `npm run chess -- ` measured at **0** occurrences in the program's output and **0** under `src/`; the six correct forms measured at exit `0` |
| 2 | scope and out-of-scope clear | **✅** one production line, one guard block; seven fences, including "no eleventh child", "no `npx`", and "`ABC-042`'s rows verified safe by mechanism, not assumed" |
| 3 | INVEST-shaped | **✅** independent — files disjoint from `ABC-065`, property disjoint from `ABC-062`; small; testable by a mutant that is `main`'s own line |
| 4 | acceptance testable and measurable | **✅** **6 of 6** refusal children carry the separator (0 today), **≥6** advertised invocations resolve `ok`, vocabulary **6 of 6** unchanged, one mutant RED, **2** paths, **1** production line, `spawned` **10** |
| 5 | dependencies known | **✅** none blocking; `ABC-065` (disjoint, blocked, pull together), `ABC-062` (same file, fenced both directions), three same-file neighbours |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** new spawns against 152.5 ms; `NFR-002` untriggered with its reason; `ABC-041`'s four clauses answered **including (b), which this ticket's production touch makes live** |
| 7 | test notes present | **✅** five, including "the mutant is `main`'s current line" and "run every form you print" |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **✅** none — both files exist on `main`, neither is claimed, and the one ticket that IS blocked (`ABC-065`) is deliberately not this one |
