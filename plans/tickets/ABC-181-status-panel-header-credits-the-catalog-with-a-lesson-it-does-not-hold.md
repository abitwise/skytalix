---
id: ABC-181
title: "`status-panel.nfr.test.ts`'s header says the `vi.mock` own-file lesson is \"recorded in the catalog\". The catalog does not hold it; `gameend.nfr.test.ts`'s header does (QE-179-a)"
status: in-review
column: In Review
size: XS
priority: P3
epic: EPIC-002
feature: —
---

# ABC-181: stop crediting `plans/nfr-catalog.md` with `gameend.nfr.test.ts`'s `vi.mock` lesson. One comment sentence, one file

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-2026-10-21b`), from `ABC-179`'s QE gap `QE-179-a` (INFO). The
> register is `.grugops/context/qe-ABC-179/notes/…observation-42fba2a4`. The ruling is in
> `.grugops/context/bapm-cut-2026-10-21b/notes/`. Base readings were taken at `main` `59fc9215`.
> `src/` there is byte-identical to `95c250d7`, because `ABC-163`'s merge has 0 `src/` lines.

## Problem

*User:* the next reader of `src/status-panel.nfr.test.ts`'s header. That reader wants to know why the file stands
apart from `status-panel.test.ts`, and where that rule is written down.

*Pain:* `src/status-panel.nfr.test.ts:9-12` says that `vi.mock` is hoisted to file scope, so the spies live in their
own file. It then says: "That is `src/gameend.nfr.test.ts`'s lesson, **recorded in the catalog** and followed here."
The catalog does not record that lesson. Searched at `59fc9215` (QE's search, re-run while cutting this page):
- `vi.mock` occurs once in `plans/nfr-catalog.md`, at `:50`, in a list of `src/history.ts` importers;
- "file scope", "file-scope" and "re-route" occur 0 times;
- each of the 5 "hoisted" lines is about hoisting work out of a timed region;
- "own file" occurs once, at `:25`, where a harness asserts its own file and test count;
- "module graph" occurs at `:23` and `:490`, about frame membership;
- `gameend.nfr.test.ts` is cited at `:25`, `:49`, `:53`, `:553`, `:558`, `:1070` and `:1627`. Each cite is about its
  call-count bars or its `--no-isolate` failures. None is about the file's isolation.

The lesson is written in `src/gameend.nfr.test.ts:11-13` ("a `vi.mock` factory is hoisted to file scope, so putting
it in `gameend.test.ts` would re-route the module graph …").

This is the same class as `QE-159-d` (`ABC-179`): a header credits the catalog with words it does not hold.
`ABC-179`'s `A2` missed this sentence, because it says "the catalog" and not the path.

*Value:* the sentence sends the reader to the place that actually holds the lesson.

## Ruling (`QE-179-a`): cut, standalone. Not folded, not accepted

- **Not accepted.** `ABC-179` fixed the same class (`QE-159-d`, also INFO), one sentence earlier in this same header.
  Leaving this sentence would leave the header half-corrected.
- **Not folded into `ABC-183` or `ABC-182`.** `ABC-183` is a security rider that is due ahead of `ABC-168`, and its
  fence is one file. `ABC-182` is a probe script outside `src/`. A comment fix in a third file would break either
  one's fence and its independence.
- **Not done by adding the lesson to the catalog.** The catalog belongs to Security/NFR, and `ABC-179` ruled that
  "it is cheaper to stop quoting the catalog than to make it hold the quote." The same reasoning holds here.

## Scope

1. **`src/status-panel.nfr.test.ts`, the sentence "That is `src/gameend.nfr.test.ts`'s lesson, recorded in the
   catalog and followed here."** (`:11-12`). Rewrite it so that it no longer credits the catalog. It may keep crediting
   `src/gameend.nfr.test.ts`, whose header holds the lesson. The Engineer writes the words.
2. Nothing else in the file changes. That includes the "A count and not a clock" sentence above it, which `ABC-179`
   delivered and QE graded.

## Out of scope

- **Any line that is not a comment**, and any other file.
- **Adding the `vi.mock` lesson to `plans/nfr-catalog.md`.** See the ruling.
- **The "A count and not a clock" sentence** (`:3-7`), and its `see plans/nfr-catalog.md` pointer. `ABC-179`'s QE read
  places that pointer's attribution at catalog `:25` and `:49`.
- **A standing guard against misattributions.** `QE-159-c` accepted that one; it stays accepted.

## Acceptance (Given/When/Then)

Readings use the joined header text: `\n *` is joined into one line, and the dots inside code spans are kept, as in
`ABC-179`.

- **`A1` (no header sentence credits the catalog with the lesson).** **Given** the head tree, **when** this runs:

  ```
  node -e 'const t = require("fs").readFileSync("src/status-panel.nfr.test.ts", "utf8").split("*/")[0].replace(/\n\s*\* ?/g, " ").replace(/`[^`]*`/g, (c) => c.replace(/\./g, "·"));
    for (const s of t.match(/[^.]*\./g) ?? []) if (/catalog/.test(s) && /gameend|vi·mock|vi\.mock|lesson|own file|file scope/.test(s)) console.log(s.trim())'
  ```

  **then** it prints **nothing**. At `59fc9215` it prints the sentence "That is `src/gameend·nfr·test·ts`'s lesson,
  recorded in the catalog and followed here."
  - **And** `grep -c 'recorded in the catalog' src/status-panel.nfr.test.ts` prints **0**. At `59fc9215` it prints
    **1**.
  - **And** QE reads every header sentence in the file that mentions the catalog. Each one must pass `ABC-179`'s `A2`
    read: any quoted span is found by `grep -F` in `plans/nfr-catalog.md`, and what the sentence credits to the
    catalog is said, in substance, at a catalog line QE names. The command above is a floor. It does not define the
    whole class.
- **`A2` (the lesson keeps a true source).** If the rewritten header still names a source for the lesson, that source
  is `src/gameend.nfr.test.ts`, and QE confirms that the file's header holds it (at `59fc9215`, `:11-13`, "hoisted to
  file scope"). If the header names no source, this criterion is met by `A1` alone.
- **`A3` (comment lines only; nothing moved).**
  - `git diff --name-only <base>` lists exactly `src/status-panel.nfr.test.ts`.
  - Every changed line is inside the file's header `/** */` block (`:1-13` at `59fc9215`).
  - `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/status-panel.nfr.test.ts` passes **6** tests, as it does
    at `59fc9215`.
  - `npm test`: the file count and the test count equal base. Skips are **0**.

## Dependencies

- None blocking. **No open ticket edits `src/status-panel.nfr.test.ts`.** The open tickets on the board are
  `ABC-161`, `ABC-164`, `ABC-165`, `ABC-168`, `ABC-172`, `ABC-176`, `ABC-178`, `ABC-182` and `ABC-183`.
- `ABC-179`: `Done`. This ticket is its QE follow-up.

## Security / NFR triggers

- **`NFR-008`:** 0 test files, 0 tests, 0 spawns. Comment-only.
- **Security:** not triggered.

## Test notes

1. **Show the gap first:** run `A1`'s command at base. It prints the one sentence.
2. **Read the catalog before reading the Engineer's notes.** `A1`'s search terms are the ones QE used for `QE-179-a`
   (search-bounded). The QE read in `A1` is what decides the criterion.
3. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0
   production lines). Measure it with AGENTS.md's form,
   `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`, which must be empty.
4. **Every vitest command carries its heap prefix:** 400 for one file, 128 for multi-file runs (`ABC-173`'s guard).
5. No timing at any hop.

## Size and priority

**`XS`:** one sentence in one comment. **Not `S`:** no code and no test.

**`P3`:** a wrong pointer misleads a reader and breaks nothing. **Not `P2`:** no test, gate or bar reads these
words. The Orchestrator may send this ticket in the same SE hop as another comment-only ticket. It stays a ticket of
its own, with its own criteria.

## Definition of Ready

BA/PM, 2026-10-21. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** one sentence; the catalog searched at `59fc9215` under six phrasings and seven `gameend.nfr` cites; the lesson's real source is `gameend.nfr.test.ts:11-13` |
| 2 | scope and out-of-scope clear | **✅** one sentence in one file; the catalog, the `ABC-179` sentence and a guard are fenced, with reasons |
| 3 | INVEST-shaped | **✅** independent (no open ticket edits the file), small, testable; the words are negotiable |
| 4 | acceptance testable and measurable | **✅** a command that prints nothing (base: 1 sentence), a grep count 0 (base: 1), a named QE read, exactly 1 file, 6 tests, equal counts |
| 5 | dependencies known | **✅** none |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` 0 / 0 / 0; security not triggered |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none |

Column moves after `Ready` are the Orchestrator's.
