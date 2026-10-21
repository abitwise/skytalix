---
id: ABC-159
title: "Four `*.nfr.test.ts` headers carry a running tally of `plans/nfr-catalog.md` in words (three times, five times now, the sixth, twice), and the tallies disagree with each other"
status: in-development
column: Backlog
size: XS
priority: P3
epic: EPIC-002
feature: —
---

# ABC-159 — the `ABC-030` repair, one class over: state the lesson, drop the tally. Comment lines only

> **Cut 2026-10-17 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-cut-followups`), from `ABC-030`'s QE gap
> **`QE-030-a`** (LOW; `.grugops/context/qe-ABC-030/notes/…5c5e3ce1`). QE named two sites. The re-measure at
> `main` `1671f24f` found **two more of the same class**, and found that the tallies contradict each other
> (`…bapm-cut-followups/notes/…readings-85e8dfdd`).

## Problem

*User:* the next reader of an `*.nfr.test.ts` header, who is deciding whether the file's bar is still justified.

*Pain:* `ABC-030` removed digit counts of sibling files from these headers, because a live count rots with every
commit. Its A1/A2 greps read digits, so tallies written in words survived. At `1671f24f`, a joined-text search
of `src/*.ts` (comment continuation `\n *` joined into one line) finds four:

| site | the tally |
|---|---|
| `src/status-panel.nfr.test.ts:4-5` | `plans/nfr-catalog.md` "has moved a bar off the clock and onto a count **three times**" |
| `src/history-pane.nfr.test.ts:5-6` | `plans/nfr-catalog.md` "has moved a bar off the clock and onto a count **five times now**" |
| `src/turn-loop.nfr.test.ts:8-9` | "It is the **sixth** bar on this project to move off a clock and onto a count." |
| `src/san.nfr.test.ts:17` | `plans/nfr-catalog.md` "records that lesson **twice**" |

The first three count **the same thing** and give three different numbers. They were each true on the day they
were written, and no reader can tell which, if any, is true today. That is the defect `ABC-030` exists to remove.

*Value:* the four headers keep their argument and lose the number that goes stale.

## Scope

- Rewrite the tally clause in each of the four sentences above so that it states the lesson (a timing bar with
  small headroom cannot fail on the regression it exists to catch, so the bar is a count) **without** a count or an
  ordinal of anything outside the file. The Engineer writes the words. A pointer to the catalog stays.
- Nothing else in any of the four files changes.

## Out of scope

- **Any line that is not inside a comment**, and any production file.
- **`src/glyph-mode.nfr.test.ts:14-15`** ("records against `NFR-001` and `NFR-005`, both times …"). It names its two
  instances, so it stays true while those two records exist. Left as is.
- Counting the catalog's moves. Whether any of the four tallies is true today is `UNKNOWN - verify`, and the repair
  removes the number rather than refreshing it.
- `QE-030-b` (accepted residual) and `QE-030-c` (INFO): unchanged.

## Acceptance (Given/When/Then)

- **`A1` (no tally of the catalog in words or digits).** **Given** the head tree, **when** this joined-text search
  runs over `src/*.ts`:

  ```
  node -e 'for (const f of process.argv.slice(1)) { const t = require("fs").readFileSync(f, "utf8").replace(/\n\s*\* ?/g, " ");
    for (const s of t.match(/[^.]*nfr-catalog\.md[^.]*\./g) ?? []) if (/\b(once|twice|thrice|three|four|five|six) times\b|\b(twice|thrice)\b/i.test(s)) console.log(f + ": " + s.trim()); }' src/*.ts
  ```

  **then** it prints **nothing**. At `1671f24f` it prints the `status-panel`, `history-pane` and `san` sites.
- **`A2` (the ordinal is gone).** `grep -nE '\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth) bar on this project' src/*.ts`
  exits **1**. At `1671f24f` it prints `src/turn-loop.nfr.test.ts:9`.
- **`A3` (the argument survives).** Each of the four rewritten sentences still says, in substance, that the bar is a
  count because a timing bar could not fail on the regression. A sentence that only says "this is a count" fails.
  QE reads this.
- **`A4` (comment lines only; nothing moved).**
  - `git diff --numstat <base>` lists exactly the four files. Every changed line is inside the file's header
    `/** */` block.
  - The per-file test counts are byte-identical at base and head:
    `npx vitest run --reporter=json | jq -r '.testResults[] | "\(.assertionResults|length) \(.name)"' | sort -k2`.
    Skips are **0**.

## Dependencies

- **`ABC-096` (`In Development`) edits `src/history-pane.nfr.test.ts`** (`ADR-0043`'s code fence). **Branch from a
  `main` that contains `ABC-096`'s merge.** Not a blocker on the cut; it decides the pull order.
- `ABC-030` — `Done`; this is its class, one register over.

## Security / NFR triggers

- **`NFR-008`:** 0 test files, 0 tests, 0 spawns. Comment-only.
- **Security:** not triggered.

## Test notes

1. **Read on joined text**, not with a line `grep`: two of the four sentences wrap (`G-QE-070-2`).
2. **Mandatory gates:** lint, typecheck, build, `npm test`. A QE hop is owed. The UAT waiver is expected (0
   production lines); it is measured at the exit.

## Size and priority

**`XS`:** four sentences in four headers. **Not `S`:** no code.

**`P3`:** stale prose misleads a reader and breaks nothing. **Not `P2`:** no test, gate or bar reads these words.

## Definition of Ready

BA/PM, 2026-10-17. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** four tallies at `1671f24f`; three of them count the same thing and disagree (3, 5, 6th) |
| 2 | scope and out-of-scope clear | **✅** four sentences; `glyph-mode` fenced with its reason |
| 3 | INVEST-shaped | **✅** small; independent apart from the pull order after `ABC-096` |
| 4 | acceptance testable and measurable | **✅** two searches that print nothing / exit 1, a QE read of the argument, identical per-file counts |
| 5 | dependencies known | **✅** `ABC-096` shares one file; pull after it merges |
| 6 | security/NFR triggers with a measurable target | **✅** 0 / 0 / 0 |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P3` |
| 10 | no major unresolved blocker | **✅** none; the pull order is a dependency, not a blocker |

Column moves are the Orchestrator's.

## QE

QE/E2E, 2026-10-21 (subtask `qe-ABC-159`). Reviewed tip `3c505abe` against base `4ab5b453` and re-ran every reading
myself in `../wt-qe-ABC-159`. I graded A3 before opening the SE's decision note. The detail is in
`.grugops/context/qe-ABC-159/notes/`, with the verdict in `…decision-10545147` and the gaps in `…observation-a1580e88`.

**Verdict: PASS_WITH_GAPS.** All four criteria are MET, and no gap blocks.

- **`A1`:** the verbatim search prints nothing at the tip. At base it prints the three sites. MET.
- **`A2`:** exit 1 at the tip. At base it prints `src/turn-loop.nfr.test.ts:9`. MET.
- **`A3`:** each of the four sentences says the bar is a count because a timing bar cannot fail on its
  regression. No count or ordinal of the catalog is left, and that includes "each time", "each after" and "both
  times", which a wider joined-text probe checks (`probe/wide-tally.cjs`). MET. See `QE-159-a` on san.
- **`A4`:** the diff is exactly the four files, every hunk is inside the `/** */` header, and the bytes after
  each header are identical. The per-file counts are byte-identical at base and tip (59 files, 1987 tests), and
  skips are 0. They were read at `NODE_OPTIONS=--max-old-space-size=128`, because the bare command is refused by
  the heap guard (`QE-159-b`). The SE's per-file 400 listings match byte for byte. MET.
- **Gates (tip):** lint, typecheck, build and `npm test` exit 0 (1987/1987), and `last-run.json` reads
  `success: true`. Skip count 0, and integrity reports `No findings.`. `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32.
- **Gaps:**
  - **`QE-159-a` (LOW):** san's new clause, "a timing bar cannot fail on the regression it exists to catch",
    drops the Scope's "small headroom" qualifier. It is also tied to a catalog lesson ("a measurement is not a
    guard") that does not say it.
  - **`QE-159-b` (LOW):** A4's command as written is refused by `ABC-173`'s heap guard and needs the 128 prefix.
  - `QE-159-c` (INFO): there is no standing guard against a tally coming back, and A1's regex is narrower than
    the class.
  - `QE-159-d` (INFO): "the lesson `plans/nfr-catalog.md` records: …" reads as a quote of words the catalog does
    not hold.
  - Outside the ticket: `QE-159-e`/`f`/`g` (INFO).
- **UAT waiver reading:** `git diff --name-only 4ab5b453...3c505abe -- src | grep -vE '\.test\.ts$|__snapshots__'`
  is **empty**. So is AGENTS.md's form, `git diff --name-only 3c505abe~1 3c505abe | grep -v '\.test\.ts$' | grep '^src/'`.
  Applying the waiver is the Orchestrator's job.
