---
id: ABC-179
title: "Three test comments say what their source does not: san's unqualified \"a timing bar cannot fail\", two headers that quote `plans/nfr-catalog.md` for words it does not hold, and `cli.test.ts` pointing at `history-pane.nfr.test.ts:329` for a line at `:390` (QE-159-a, -d, -e)"
status: done
column: Done
size: XS
priority: P3
epic: EPIC-002
feature: —
---

# ABC-179: make three test comments say only what their source says. Comment lines only, four files

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-rule-QE-159`), from `ABC-159`'s QE gaps `QE-159-a` (LOW), `QE-159-d`
> (INFO) and `QE-159-e` (INFO). The register is `.grugops/context/qe-ABC-159/notes/…observation-a1580e88`. The
> ruling on all seven gaps is in `.grugops/context/bapm-rule-QE-159/notes/`. Base readings were taken at `main`
> `63f09a81`, and `src/` there is byte-identical to `ABC-159`'s merge `29e1d822`.

## Problem

*User:* the next reader of a guard's comment, who is deciding whether the guard is still justified or where it
lives.

*Pain:* the three sites below each send that reader somewhere false.

| site (at `63f09a81`) | what it says | what is true |
|---|---|---|
| `src/san.nfr.test.ts:16-19` (`QE-159-a`) | the catalog "records that lesson …: a timing bar cannot fail on the regression it exists to catch" | The clause has no headroom qualifier, so it reads as a universal, and as a universal it is false. San has no headroom figure of its own. Its ~97% `legalMoves` share (line 7) suggests `N1`'s ratio *could* move on the "ignored the supplied `legal` list" regression (QE's inference, `UNKNOWN - verify`). The catalog lesson it cites (`plans/nfr-catalog.md:555-558`, "A measurement is not a guard") says the bars **were held by nothing in the repo**. It does not say a clock cannot fail. |
| `src/status-panel.nfr.test.ts:4-6`, `src/history-pane.nfr.test.ts:5-7` (`QE-159-d`) | "the lesson `plans/nfr-catalog.md` records: a timing bar with {an order of magnitude \| a factor of two} of headroom cannot fail …" | The colon form reads as a quote of the catalog, and the quoted words are not there: `grep -niE "order of magnitude\|factor of two\|cannot fail" plans/nfr-catalog.md` finds none. The headroom figure is each file's own. The catalog does record the *move* in substance: an instrument moved "off the clock and onto a count" (`:25`, `:49`), and instruments that "cannot resolve" a delta (`:53`, `:55`). So a pointer to the catalog for the move is supported. The quote is not. |
| `src/cli.test.ts:1831` (`QE-159-e`) | "The merged equality at `src/history-pane.nfr.test.ts:329`" | The equality, `expect(runtimeImporters).toEqual(production.filter(…))`, is at `:390`. It is the only `history-pane.nfr.test.ts:<n>` citation in `src/`. A line number goes stale with every edit above it. |

*Value:* the san guard's reason stays true, the two headers keep their own argument without borrowing the
catalog's name for it, and the pointer finds its line without a number that rots.

## Scope

1. **`san.nfr.test.ts`, the "A MEASUREMENT IS NOT A GUARD" sentence.** Rewrite the clause after the colon so that:
   - it makes **no claim about what a timing bar can or cannot fail, catch or resolve**; and
   - it attributes to the catalog only what the catalog says. The lesson at `plans/nfr-catalog.md:555-558` is that
     a bar held by nothing in the repo leaves a behaviour-equivalent mutation green, so the in-suite guard is a
     count.

   The Engineer writes the words. The sentence's other half ("learned where a behaviour-equivalent mutation left
   the whole suite green") is already true and may stay.
2. **`status-panel.nfr.test.ts` and `history-pane.nfr.test.ts`, the "A count and not a clock" sentence.** Keep the
   file's own argument and its own headroom figure. Drop the form that presents that argument as the catalog's
   words. A pointer to the catalog may stay as a pointer (for example "see"), but not as a quote.
3. **`cli.test.ts`, the comment in the `A12 — the licence gained exactly the entry point` test.** Replace the
   `:329` line pointer with a pointer that names the equality instead of a line number.
4. Nothing else in any of the four files changes.

## Out of scope

- **Any line that is not a comment**, and any production file.
- **`src/turn-loop.nfr.test.ts`.** "That little headroom" points back to the file's own 2x. QE graded it MET.
- **`src/glyph-mode.nfr.test.ts`**, as `ABC-159` fenced it.
- **A new headroom claim for san.** Any claim that a clock can or cannot fail needs a timing measurement, which this
  ticket does not take. If one is wanted, it is a separate ticket with a measurement.
- **Adding the headroom lesson to `plans/nfr-catalog.md`.** The catalog belongs to Security/NFR. It is cheaper to
  stop quoting the catalog than to make it hold the quote.
- **`history-pane.nfr.test.ts` line numbers cited in `memory-bank/50-decisions/`** (`ADR-0011`, `ADR-0030`). Those
  are dated records, already stale (`:335`, `:324`), and are not edited.
- **A standing guard against tallies or misquotes** (`QE-159-c`). Accepted; see the ruling.

## Acceptance (Given/When/Then)

All readings use joined comment text, with `\n *` joined into one line and dots inside code spans kept, so that
`nfr-catalog.md` does not end a sentence.

- **`A1` (san makes no fail/catch claim).** **Given** the head tree, **when** this runs:

  ```
  node -e 'const t = require("fs").readFileSync("src/san.nfr.test.ts", "utf8").split("*/")[0].replace(/\n\s*\* ?/g, " ").replace(/`[^`]*`/g, (c) => c.replace(/\./g, "·"));
    for (const s of t.match(/[^.]*\./g) ?? []) if (/\b(cannot|can.t|could not|couldn.t) (fail|catch|resolve)\b/i.test(s)) console.log("san: " + s.trim())'
  ```

  **then** it prints **nothing**. At `63f09a81` it prints the "A MEASUREMENT IS NOT A GUARD" sentence.
- **`A2` (no header quotes the catalog for words it does not hold).**
  - **Given** the head tree, **when** this runs:

    ```
    node -e 'for (const f of process.argv.slice(1)) { const t = require("fs").readFileSync(f, "utf8").split("*/")[0].replace(/\n\s*\* ?/g, " ").replace(/`[^`]*`/g, (c) => c.replace(/\./g, "·"));
      for (const s of t.match(/[^.]*\./g) ?? []) if (/nfr-catalog/.test(s) && /records:/.test(s)) console.log(f + ": " + s.trim()); }' src/san.nfr.test.ts src/status-panel.nfr.test.ts src/history-pane.nfr.test.ts src/turn-loop.nfr.test.ts
    ```

    **then** it prints **nothing**. At `63f09a81` it prints the `status-panel` and `history-pane` sentences.
  - **And** QE reads every header sentence in `san`, `status-panel` and `history-pane` that names
    `plans/nfr-catalog.md`. Each passes only if (i) any quoted span in it is found by `grep -F` in
    `plans/nfr-catalog.md`, and (ii) what it attributes to the catalog is said, in substance, at a catalog line QE
    names. Candidate lines at `63f09a81` are `:25`, `:49` and `:53` for the clock-to-count move, and `:555-558` for
    "a measurement is not a guard". The command above is a floor, not the class (`QE-159-c`): rephrasing the colon away while still
    misquoting fails this read.
- **`A3` (the pointer names the equality, not a line).**
  - `grep -nE 'history-pane\.nfr\.test\.ts:[0-9]+' src/*.ts` exits **1**. At `63f09a81` it prints `src/cli.test.ts:1831`.
  - QE confirms that the rewritten comment identifies the `expect(runtimeImporters).toEqual(production.filter(…))`
    guard, and that a reader searching `src/history-pane.nfr.test.ts` for the text the comment names reaches that
    line. The equality and its text pin (`R5`) both hold that text, and either is acceptable.
- **`A4` (comment lines only; nothing moved).**
  - `git diff --numstat <base>` lists exactly `src/san.nfr.test.ts`, `src/status-panel.nfr.test.ts`,
    `src/history-pane.nfr.test.ts` and `src/cli.test.ts`.
  - Every changed line in the three `*.nfr.test.ts` files is inside the file's header `/** */` block.
  - Every changed line in `src/cli.test.ts` is a `//` comment line inside the `A12 — the licence gained exactly the
    entry point` test. Its numstat is **n/n** (net 0 lines), so `ABC-168`'s page pointers into that file do not move.
  - The per-file test counts are byte-identical at base and head, read in the same worktree:
    `NODE_OPTIONS=--max-old-space-size=128 npx vitest run --reporter=json 2>/dev/null | jq -r '.testResults[] | "\(.assertionResults|length) \(.name)"' | sort -k2`.
    Skips are **0**.

## Dependencies

- None blocking. `ABC-168` (Backlog) and `ABC-161` (Backlog) also edit `src/cli.test.ts`, but in other `it` blocks
  (`A10` around `:1759`; the three named difficulty rows). The hunks are disjoint, and `A4`'s net-0 rule keeps their
  line pointers still. `ABC-162` and `ABC-178` touch other files.
- `ABC-159`: `Done` (`29e1d822`). This ticket is its QE follow-up.

## Security / NFR triggers

- **`NFR-008`:** 0 test files, 0 tests, 0 spawns. Comment-only.
- **Security:** not triggered.

## Test notes

1. **Read on joined text, with code-span dots kept** (the `A1`/`A2` commands). A naive split at "." breaks inside
   `nfr-catalog.md`, and the search then finds nothing at base. That was checked while this page was cut.
2. **Three tests read `history-pane.nfr.test.ts` as text:** `cli.test.ts` `A12` (the `LICENSED_DRIVERS` list),
   `render-seam.test.ts` `A9` (`COMPOSITION_ROOT`, `LICENSED_DRIVERS`), and the file's own `R5` text pins. None
   reads the header, so a header edit leaves them green. The gates confirm it.
3. **No timing** at any hop. See Out of scope on a new san headroom claim.
4. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0
   production lines). It is measured with AGENTS.md's form, `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`,
   which must be empty (ruling `QE-159-f`).
5. **Every vitest command carries its heap prefix:** 128 for multi-file runs, 400 for one file (`ABC-173`'s guard;
   ruling `QE-159-b`).

## Size and priority

**`XS`:** three sentences and one comment line, in four files. **Not `S`:** no code and no test.

**`P3`:** a wrong reason or pointer misleads a reader and breaks nothing. **Not `P2`:** no test, gate or bar reads
these words.

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three sites, each with what it says and what is true, re-read at `63f09a81` |
| 2 | scope and out-of-scope clear | **✅** four sentences in four files; turn-loop, glyph-mode, the catalog, ADR line numbers and a guard fenced with reasons |
| 3 | INVEST-shaped | **✅** independent (disjoint hunks), small, testable, and the words are negotiable |
| 4 | acceptance testable and measurable | **✅** two searches that print nothing, one grep that exits 1, numstat n/n, identical per-file counts, and two named QE reads |
| 5 | dependencies known | **✅** `ABC-168`/`ABC-161` share `cli.test.ts` on disjoint hunks; none blocks |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` 0 / 0 / 0 |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none |

Column moves after `Ready` are the Orchestrator's.

## QE

QE/E2E, 2026-10-21 (subtask `qe-ABC-179`). I reviewed tip `a7d64e07` (code `dd131b71`) against base `ccccc6bb` and ran every
reading myself in `../wt-qe-ABC-179`. I read the four comments and the catalog before opening the SE's notes. The detail
is in `.grugops/context/qe-ABC-179/notes/`, with the verdict in `…decision-5603b830` and the gaps in `…observation-42fba2a4`.

**Verdict: PASS_WITH_GAPS.** All four criteria are MET. Both gaps are INFO, and neither blocks.

- **`A1`:** the page command prints nothing at the tip. At base it prints the san sentence. MET.
- **`A2`:** the command prints nothing at the tip. At base it prints the status-panel and history-pane sentences. On the QE
  read, none of the three sentences that name the catalog holds a quoted span. San's attributions are at `plans/nfr-catalog.md`
  `:555-556` ("held by nothing in the repo") and `:552-554` with `:558` (the count). The two headers credit the catalog
  only with the move, at `:25` and `:49` ("OFF THE CLOCK AND ONTO A COUNT"). Their headroom figures are their own, and
  their sources are `ABC-016`'s page `:365` (20x) and `ABC-017`'s page `:771`. MET.
- **`A3`:** the grep exits 1. The pointer's prefix, `expect(runtimeImporters).toEqual(`, reaches the equality at `:390`
  first, and the `R5` pin at `:511` second. MET.
- **`A4`:** the diff is exactly the four files, at 2/2 and 3/3 (`cli.test.ts` 3/3, net 0). Every changed line is inside
  the header `/** */` block or is a `//` line inside `A12`. Parsed with `removeComments`, all 98 `src/*.ts` files print
  identically at base and tip. A planted one-token change shows a difference, so that result is not vacuous. The per-file
  counts (heap 128, same worktree) are byte-identical: 59 files, 1987 tests, 0 skips. MET.
- **Gates (tip):** lint, typecheck, build and `npm test` exit 0 (1987/1987), and `last-run.json` reads `success: true`.
  Skip count 0, and integrity reports `No findings.`. `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32.
- **Gaps:**
  - `QE-179-a` (INFO, pre-existing, outside this ticket's scope): status-panel `:10-12` says the `vi.mock`
    file-scope lesson is "recorded in the catalog". I did not find it there. It is the same class as `QE-159-d`. Route:
    BA/PM.
  - `QE-179-b` (INFO): the pointer's `…` means a verbatim search for the whole span finds nothing, so the search key is
    the prefix. No route.
- **UAT waiver reading (AGENTS.md's form, `.snap` not filtered):**
  `git diff --name-only dd131b71~1 dd131b71 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. No `.snap` changed.
  Applying the waiver is the Orchestrator's job.
