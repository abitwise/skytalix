---
id: ABC-132
title: Three production docblocks still cite the deleted `FRAME_PRODUCERS` list and the superseded "declared, not derived" rule — comment-only, three files
status: backlog
column: Backlog
size: XS
priority: P3
epic: —
feature: —
---

# ABC-132 — `ABC-053` deleted the list; three comments still send the reader to it

> **Cut 2026-10-10 by BA/PM** (task `wave-2026-09-25`, subtask `postmerge-followups-2026-10-10`) at
> wave tip `9ddd6e80`. This is the comment-only `XS` follow-up that `ABC-053` owed at merge
> (`ABC-053` § Out of scope; `ADR-0029` § Consequences, "Architect/Design recommends the
> follow-up"). QE confirmed the list of sites by filename (`.grugops/context/qe-ABC-053/notes/…a4b293d2`,
> "carried"). Security/NFR re-stated it as owed (`.grugops/context/secnfr-ABC-053/notes/…8deff3d6`).
> Reasoning: `.grugops/context/postmerge-followups-2026-10-10/notes/`.

## Problem

*User*: the next reader of `src/render-seam.ts`, `src/result-screen.ts` or `src/cli.ts` who wants
to know what puts a module on the frame path. That reader is the hop that adds a panel, a second
screen or a new entry-point wiring.

*Pain*: `ABC-053` (merged `a090dda0`) **deleted** `FRAME_PRODUCERS` and replaced `ADR-0011`
clause 2's "declared, not derived" with `ADR-0029`'s **one declared root** (`COMPOSITION_ROOT =
"render-seam.ts"`). From that root the path is **derived**. `ADR-0029` is accepted (owner,
2026-10-10). Three production docblocks still describe the old rule, measured at `9ddd6e80`:

| site | stale text | why it is wrong today |
|---|---|---|
| `src/render-seam.ts:33-36` | "IS a frame producer and is DECLARED as one in … `FRAME_PRODUCERS` (`ADR-0011` clause 2: the frame path is declared, not derived)" | the list is gone. This module IS the declared `COMPOSITION_ROOT`, and the path is derived from it |
| `src/result-screen.ts:13-15` | "NOT a frame producer and is deliberately NOT declared in … `FRAME_PRODUCERS` (`ADR-0011` clause 2 …) so the count moves deliberately" | there is no list and no count. It is off the path by `ADR-0029`'s membership rule: it is not in the root's load closure and no frame call loads it. Only `cli.ts` imports it (measured) |
| `src/cli.ts:7-8` | "the census moves … production 18 -> 20, entry points 1 -> 2, frame producers 6 unchanged" | "frame producers 6" counts a deleted list as if it still existed |

`git grep -c FRAME_PRODUCERS -- src` reads **2** (both production files). Case-insensitive
`frame producer` reads **3** lines, all in production files. `declared, not derived` reads **1** line
in production (`render-seam.ts:36`).

*Value*: each docblock again agrees with the guard that holds its claim. A reader who follows a
comment lands on `COMPOSITION_ROOT` and `ADR-0029`, not on an identifier `grep` cannot find.

## Scope

- **Rewrite the three stale sentences** so that each states the `ADR-0029` rule in force:
  - `render-seam.ts`: it is the declared `COMPOSITION_ROOT` in `src/history-pane.nfr.test.ts`, and
    the frame path is derived from it (its load closure plus what its frames load).
  - `result-screen.ts`: it is off the frame path because it is neither in that closure nor loaded by
    a frame call.
  - `cli.ts`: the census line stops stating a frame-producer count as current. Either drop that
    clause, or date it as `ABC-042`'s reading and point at `ADR-0029`.

  The wording is the Engineer's. Every other sentence in those docblocks is kept.

## Out of scope

- **Any executable line.** This is comment-only (`A4`).
- **Every other stale cite in these files**, including `turn-loop.ts:<line>` cites (`cli.ts:30`,
  `:181`; `result-screen.ts:12`). Those are `ABC-129`'s.
- **`src/history-pane.nfr.test.ts`'s docblock** (`ABC-054` / `ABC-057`) and every `.test.ts` file.
- **`ADR-0011`'s pointer** to `ADR-0029` (Architect/Design's, owed at acceptance), `ADR-0029`,
  `plans/nfr-catalog.md`.
- **The 2026-08-17 UAT waiver's reading for comment-only diffs** (`QE-051-d`). That is the owner's
  ruling, not this ticket's.

## Acceptance (Given/When/Then)

- **`A1` (the deleted identifier is gone).** **Then** `git grep -n FRAME_PRODUCERS -- src` prints
  **0** lines. *(2 at `9ddd6e80`.)*
- **`A2` (no frame-producer claim is left).** **Then** `git grep -niE 'frame producers?' -- src`
  prints **0** lines. *(3 at `9ddd6e80`.)* **And** `git grep -n 'declared, not derived' -- src`
  prints only lines in `.test.ts` files. *(Today: `render-seam.ts:36` and
  `history-pane.nfr.test.ts:168`. The second is `ADR-0029`'s own "supersedes … in part" quotation
  and stays.)*
- **`A3` (each docblock states the rule in force).** **Then** `src/render-seam.ts`'s docblock
  contains `COMPOSITION_ROOT` and `ADR-0029`. `src/result-screen.ts`'s docblock contains `ADR-0029`
  and says it is not on the frame path. **The neighbouring sentences are kept word for word.** Line
  wrapping may move, because `:36` and `:13` each hold both stale text and a kept sentence. With the
  ` * ` prefixes removed and whitespace collapsed, both docblocks still contain, unchanged:
  - in `render-seam.ts`, the sentence from "The one runtime edge that could breach the premise" to
    "must STAY `import type`.";
  - in `result-screen.ts`, the sentence from "`INPUT_ENDED_NOTICE`" to "non-frame write to the
    sink." (`ABC-129` may re-point its cite. If `ABC-129` lands first, read this sentence on its
    tree.)
- **`A4` (comment-only, three paths).** `git diff --name-only <base>..<delivered> -- src` lists
  **exactly** `src/cli.ts`, `src/render-seam.ts` and `src/result-screen.ts`. **And** every changed
  line is inside a comment. This check prints nothing:
  `git diff -U0 <base>..<delivered> -- src | grep -E '^[+-][^+-]' | grep -vE '^[+-][[:space:]]*(\*|/\*\*|\*/)'`.
  Lint, typecheck, build and `npm test` exit 0. The skip count is 0, and integrity prints
  `No findings.`

## Dependencies

- **`ABC-053` — `Done`** (merged `a090dda0`). `ADR-0029` — accepted. **Pullable now.**
- **`ABC-129` (Backlog) edits two of these files on ADJACENT lines.** It changes
  `result-screen.ts:12` (this ticket edits `:13-15`) and `cli.ts:30` and `:181`. **Never build the
  two in parallel**, because adjacent hunks conflict. Either order works, and the second rebases.
  This ticket is pullable now. `ABC-129` still has its ⚠️ item 3 and a re-score owed (test note 3).
- **No other in-flight branch touches these files** (checked at `9ddd6e80`). `ABC-087` touches
  `src/levels*`. `ABC-126` touches puzzle files and `src/quiescence.test.ts`. `ABC-054` and
  `ABC-057` touch test files only.

## Security / NFR triggers

- **`N8-LANE` — ≤ 650 ms CPU net.** No new file and no executable line, so ≈ 0 ms.
- **`NFR-002` — not triggered.** No executable byte on the frame path changes (`A4`).
- **Security — not triggered.** `ABC-041`'s clauses: (a) no manifest; (b) no builtin, `process.`
  read, spawn or `eval` is gained, because only comments change, and the raw-text bars in test note 1
  would red one that a comment spelled; (c) no test file; (d) the three paths are named here.
- **UAT: the OWNER'S WORD IS OWED.** The 2026-08-17 waiver's literal git test lists **3 production
  files** for this diff. It is comment-only, but the owner has not ruled on comment-only diffs
  (`QE-051-d`, still open). The owner can give this word together with `ABC-129`'s, which owes the
  same. The QE hop applies.

## Test notes

1. **Two guards read these files RAW, comments included.** A word in a new comment can red them:
   - `src/render-seam.test.ts` "`A6` / `A7`" bars `process` (as a substring), `globalThis`,
     `import.meta`, `from "./glyph-mode.ts"` and `from "./history.ts"` anywhere in
     `render-seam.ts`. **"child process" or "processes" in the new sentence would red it.**
   - `src/cli.test.ts` "bar 1" bars `eval`, `Function(`, `child_process`, `import(`, `fetch`,
     `WebSocket` and `XMLHttpRequest` anywhere in `cli.ts`, and reads every `from "…"` specifier.
     **`ADR-0029`'s own verb "evaluated" contains `eval` and would red it.** `cli.ts` holds 0
     `eval` today.

   Run the whole suite. Do not assume a comment is inert.
2. **`render-seam.test.ts`'s digit ban** (`deliveredCode()`, `:221`) strips comments first, so a
   digit in the docblock is safe. The licence regex and the composer tripwire match only at column
   0, and a ` * ` docblock line cannot reach them.
3. **`ABC-129`'s ⚠️ item 3** (`ABC-036` and `ABC-051` merge first) reads as discharged on the board
   (both are `Done`, owner word 2026-10-10). The re-score is owed and is not this ticket's.

## Size and priority rationale

**Size `XS` (1).** Three comment sentences in three files, with four greps and a comment-only
filter as the checks. **Not `XL`. No split.**

**Priority `P3`.** Nothing is red, no user sees it, and every guard in force is correct. The cost is
one misdirected reader. It is worth cutting because `ABC-053` named it as owed, but it is not urgent.

## Definition of Ready

Assessed by BA/PM at the cutting hop, **2026-10-10**, wave tip `9ddd6e80`. **Result: 10 of 10, 0 ⚠️
— MET → `Ready`.** The board move is the Orchestrator's.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** three named sites, each quoted, with a measured grep count (2 / 3 / 1) |
| 2 | scope and out-of-scope clear | **✅** three sentences; five fences (executable lines, `ABC-129`'s cites, test files, ADRs, the waiver ruling) |
| 3 | INVEST-shaped | **✅** independent now. The only overlap, `ABC-129`, is an ordering, not a dependency |
| 4 | acceptance testable and measurable | **✅** two greps that must print 0, one grep with a named expected survivor, named words, byte-identical neighbours, and a three-path comment-only filter |
| 5 | dependencies known | **✅** `ABC-053` `Done`; `ABC-129` never in parallel; no other in-flight overlap |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≈ 0 (no file); `NFR-002` not triggered (proven by `A4`); security clauses walked |
| 7 | test notes present | **✅** three (both raw-text traps named, the digit ban, `ABC-129`'s re-score) |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P3`, with the reason |
| 10 | no major unresolved blocker | **✅** none. The owner's UAT word is an exit gate, not a start blocker |
