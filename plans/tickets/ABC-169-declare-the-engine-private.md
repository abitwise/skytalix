---
id: ABC-169
title: "Declare the engine private: `\"license\": \"UNLICENSED\"` next to `\"private\": true` in `package.json`, and the Michniewski credit comment in the `src/evaluate.ts` header"
status: done
column: Done
size: XS
priority: P1
epic: EPIC-007
feature: —
---

# ABC-169 — one manifest key, one header comment and one pin element. ZERO executable lines

> **Amended 2026-10-18 by BA/PM** (subtask `bapm-ABC-169-rescope`, at `main` `692770d6`) on the build stop
> (`.grugops/queue/done/ticket-to-pr-ABC-169.md`, tip `4a0a075f`): A1–A5 held and A6 failed. `src/cli.test.ts:1759`
> (`ABC-042` `A10`) pins the exact top-level key list of `package.json` in `AT_HEAD` (`:1766-1775`, 8 keys), so the
> `"license"` key that A1 requires turns it red. **Ruling:** the delivery adds exactly one element, `"license"`, to
> `AT_HEAD`, and changes nothing else in that test or that file (Scope 4). A5 now lists three files and A6 allows
> that one line. `ADR-0036` (c) is re-read below and still does not fire. The UAT reading is unchanged. This follows
> the `ABC-122` precedent (`amend-abc122-a4-pin`, 2026-09-25), which widened a fence by exactly one value in the same
> test. The reasoning is in `.grugops/context/bapm-ABC-169-rescope/notes/`. The readings at `4a0a075f` for A1–A4 still
> stand. The redo adds one commit that carries the pin line.

> **Re-scoped 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-epic007-accept`) on the owner's word,
> verbatim (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"License: let's keep private for now ; Q14: keep it ; Q15: picked private ; accept
> the revised ADR-0044 and EPIC-007"*. **The engine is private, all rights reserved.** This supersedes the AGPL-3.0
> scope this page carried at `459d6741` (`LICENSE`, `NOTICE`, an SPDX id), and the GPL-3.0 reading of Q8 before it.
> The page file was renamed from `ABC-169-declare-the-agpl-3-0-licence.md` at this hop.
>
> **Cut 2026-10-18 by BA/PM** (subtask `bapm-engine-revise`) as an AGPL-3.0 proposal. That scope is superseded and is
> kept only in git history (`git show 459d6741:plans/tickets/ABC-169-declare-the-agpl-3-0-licence.md`).
>
> **This hop ran nothing** except the readings below, taken at `main` `50e081fc`.

## Problem

*User:* the owner, and the web project's backend, which runs this engine as a separate process on the owner's own
machine.

*Pain:* `package.json` already carries `"private": true` (`package.json:4`), so npm will not publish it. But it has no
`license` key, so the manifest does not say "all rights reserved". The evaluation tables in `src/evaluate.ts` are
Tomasz Michniewski's values, and the file does not say so.

*Value:* anyone reading the repo sees that it is private and all rights reserved. The one third-party source the
engine's evaluation rests on is credited where it is used.

## Readings (at `main` `50e081fc`)

- `npm pkg get private license` prints `{ "private": true }`. The `license` key is absent.
- `ls LICENSE* NOTICE*` finds nothing.
- `src/evaluate.ts` holds `PIECE_VALUE` (`:37`) and six piece-square tables (`PAWN_TABLE` `:55` to `KING_TABLE`
  `:115`). Its header comment is `:1-15`. `grep -rn -i -E 'michniewski|chessprogramming' src/` is empty.
- `tools/grugops/` holds eleven files. Four are kit files and stay MIT on the owner's word (`ADR-0044` D13 item 2:
  `reference-check.js`, `test-skip-integrity.js`, `uat-spec-integrity.js`, `host-protection.js`).
  **None of the four carries an in-file MIT notice today**: `grep -n -E '\bMIT\b|SPDX|Copyright' tools/grugops/*` is
  empty. So "they keep their notice" means they are not edited, and their MIT status rests on the owner's word, as
  before. Adding a notice text needs the kit's copyright line, which is `UNKNOWN - verify`. It is not done here.

## Scope

1. **`package.json`:** add `"license": "UNLICENSED"`. `"private": true` is already there and stays.
2. **`src/evaluate.ts`, header comment only:** add one credit paragraph to the existing `/** … */` header block
   (`:1-15`). The default wording follows `ADR-0044` D13's credit at `459d6741`, without its `See NOTICE.`, because a
   private repo has no `NOTICE`:

   > `PIECE_VALUE` and the six piece-square tables are the values of Tomasz Michniewski's "Simplified Evaluation
   > Function", first posted to the Polish chess-programming list progszach and published at
   > <https://www.chessprogramming.org/Simplified_Evaluation_Function> under CC BY-SA 3.0
   > (<https://creativecommons.org/licenses/by-sa/3.0/>). The values are unchanged. The layout, the king value of 0
   > and all code are ours.

   If `ADR-0044` D13, as the Architect's `arch-adr0044-accept` hop rewrites it to private, gives different wording,
   D13's wording wins. `A2` holds either way.
3. **The four MIT kit files in `tools/grugops/`:** untouched. They stay MIT (the owner's word).
4. **`src/cli.test.ts`, one pin element only** (amended 2026-10-18). Add the element `"license",` as one new line
   inside `ABC-042` `A10`'s `AT_HEAD` array (`:1766-1775`). It can go anywhere in the array, because the assertion at
   `:1788` sorts both sides; next to `"private",` reads best. Nothing else in the test changes: not the test's name,
   its comments, `SCRIPTS_AT_HEAD` (`:1776-1786`), the reserved list (`:1789`), the `private` check (`:1792`), or the
   `added` check (`:1799`). Nothing else in the file changes either. The pin keeps its purpose: it still checks the
   manifest key by key, and now its list includes the one key this ticket adds.

## Out of scope

- **A `LICENSE` file, a `NOTICE` file, an SPDX header, or any open-source licence.** The owner chose private.
- **Any value change in `src/evaluate.ts`.** No number, identifier or code line moves.
- **Re-deriving our own evaluation values.** The owner-word note `…c3e81a57` records it as a **precondition for any
  future distribution of the engine to third parties**, for example a browser bundle or a published binary. A private
  engine that runs on the owner's own backend over stdio is not distributed. A ticket for it is cut only on the
  owner's word.
- An MIT notice text inside the four kit files (the copyright line is `UNKNOWN - verify`).
- The adjacent header sentence *"Every number below is HAND-TUNED and expected to move"* (`src/evaluate.ts:12`). It is
  left as written (coding rule 9). The credit names only `PIECE_VALUE` and the six tables.
- `npm publish`, and any change to `"private": true`.
- Any other test edit, including a new test for the `license` key. The amended `AT_HEAD` pin covers the key.

## Acceptance (Given/When/Then)

- **`A1` (the manifest).** **Given** the tip, **when** `npm pkg get private license` runs, **then** it prints a JSON
  object with `"private": true` and `"license": "UNLICENSED"`. `git diff <base> <tip> -- package.json` adds exactly
  one line, `"license": "UNLICENSED",`, and removes none. `package-lock.json` is unchanged.
- **`A2` (the credit).** **Given** the tip, **when** the first `/** … */` block of `src/evaluate.ts` is read, **then**
  it contains each of these at least once: `Michniewski`, `Simplified Evaluation Function`,
  `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0`, and a sentence saying the values
  are unchanged. The block still opens at line 1, and the `import` from `./position.ts` still follows it.
- **`A3` (comment only).** Both checks of the owner's Q4 measurement (`…5c8e2a17`) hold:
  - every `+` and `-` line of `git diff <base> <tip> -- src/evaluate.ts` lies inside the header `/** … */` block and
    is a comment line (it starts with ` *` after optional whitespace);
  - `ts.transpileModule(source, { compilerOptions: { removeComments: true } }).outputText` of `src/evaluate.ts` is
    byte-identical at `<base>` and `<tip>`.

  If either check fails, the change is not comment-only. The ticket stops and goes back to BA/PM.
- **`A4` (no open-source files).** `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` prints nothing at the tip.
- **`A5` (fences, amended 2026-10-18).** `git diff --name-only <base> <tip>` lists exactly `package.json`,
  `src/evaluate.ts` and `src/cli.test.ts`. `git diff --numstat <base> <tip> -- src/cli.test.ts` shows 1 line added and 0
  removed. That added line, trimmed, is `"license",`, and it sits between `const AT_HEAD = [` and the `];` that closes it.
  `git diff <base> <tip> -- tools package-lock.json` is empty.
- **`A6` (the gates, amended 2026-10-18).** The four mandatory gates (lint, typecheck, unit, build) are green, with the
  same test count as at `<base>`. No test file is added. The only test-file edit is A5's one line. `ABC-042` `A10`
  passes at the tip. **The pin is still armed:** with only the `"license"` line taken out of `package.json` (the test
  file as at the tip), `A10` is red, and it is the only red row. This is one reading in the hop record, not a new test,
  and the line is restored before the commit.

## Dependencies

- **None among open tickets.** It shares `package.json` with `ABC-168` (`bin`, `build`) and `ABC-172` (`name`), on
  different keys. Whichever merges later rebases.
- **It also shares `src/cli.test.ts`'s `AT_HEAD` with `ABC-168`** (amended 2026-10-18). `ABC-168` adds `"bin"` there.
  Whichever of the two merges later rebases and keeps both elements. `ABC-172` changes a value, not a key, so it
  does not touch the pin.
- **`ADR-0044` D13** is being rewritten to private by the Architect's `arch-adr0044-accept` hop, in parallel with this
  one. Only the credit wording reads from it (Scope 2), and `A2` holds either way.
- **Gate: met.** The owner accepted `EPIC-007` and the revised `ADR-0044` on 2026-10-18 (`…c3e81a57`).

## Security / NFR triggers

- **Security: TRIGGERED, a short hop.** `ABC-041` clause (a) fires on any touch of `package.json` (*"touched at
  all"*). No `dependencies` key is added (`A1`). Expected result: no finding.
- **`ADR-0036` (b1) and (b2) do not fire.** (b1) asks for an added or changed line of **executable code** in a
  production file, and `A3` proves there is none. (b2) asks for a new runtime import edge, and a comment adds none.
- **(c), re-read 2026-10-18 now that a test file is in the diff: it does not fire.** The clause
  (`plans/tickets/ABC-041-render-seam-closure.md:228-231`) fires only if a test file in the diff *"introduces a
  capability this lane does not already hold: network, a filesystem write outside a temp dir, or a new
  `child_process` spawn"*. The edit adds one string literal to an array literal. It adds no import, no call and no
  capability. The test already reads `package.json` with `readFileSync` (`:1762`), and read-only `node:fs` over the
  repository's own files is named precedent in the clause. The clause's tie rule (*"whichever way a reading is
  disputed, it fires"*) has nothing to act on, because a one-line string element leaves no reading to dispute.
- **Other test-integrity rules, read 2026-10-18: none fires.** `tools/grugops/test-skip-integrity.js` counts skips,
  and the edit adds none, so the skip count stays `0` and the check prints `No findings.`
  `.grugops/test-skips.md` is not touched. `tools/grugops/qe-hop-integrity.js` checks QE hops at `Done`, and nothing
  here changes what it reads. This pin edit does not weaken anything: the assertion, the reserved list and the
  `scripts` checks stay as they are, and `A6`'s armed check shows the pin still goes red without the key. The
  `ABC-122` amendment set the precedent: a BA/PM ruling may move a value in `ABC-042` `A10` by exactly the line that
  the ticket's own manifest change requires.
- **Clause (d) (blast radius):** two files under `src/`, both named here. `src/evaluate.ts` gets comment lines only
  (`A3`). `src/cli.test.ts` gets one array element (`A5`).
- **NFRs:** none apply. Because of `A3`'s transpile identity, the emitted code is unchanged, and so is every
  evaluation, puzzle, ladder and level pin.

## UAT

**Expected: WAIVED, by measurement at the exit.** The diff touches one production file, `src/evaluate.ts`, so the
2026-08-17 file-level grep alone is not empty. The owner's Q4 word (2026-10-10, `…5c8e2a17`) counts a production diff
whose changed lines are all comments as zero production lines. The standing waiver therefore applies when `A3` holds.
The label is "WAIVED (waived is not accepted)". **If `A3` fails, the owner's UAT applies.** `package.json` is not under
`src/` and has no effect on the waiver. **Unchanged by the 2026-10-18 amendment:** the 2026-08-17 grep's
`grep -v '\.test\.ts$'` removes `src/cli.test.ts`, so the grep still names only `src/evaluate.ts`, and `A3` covers it.

## Test notes

1. **`A3` is the real check.** A "comment" that slips one character outside the block changes the emitted code. The
   transpile identity catches that where a line-shape grep might not.
2. **No new test, and one pin line amended** (Scope 4, amended 2026-10-18). `npm ci` exits `0`. The gates run
   because `package.json` and `src/` files changed.
3. `npm pkg get private license` prints one JSON object, not two bare lines. Read both values from it.
4. **The test pins on `package.json`, read at `main` `692770d6`** (`grep -rn package.json` over the tracked
   `*.test.ts`). Only the first goes red on this ticket:
   - `src/cli.test.ts:1759` (`ABC-042` `A10`): `AT_HEAD` key list (`:1766-1775`), `SCRIPTS_AT_HEAD` values
     (`:1776-1786`), reserved keys `bin`, `main`, `files`, `publishConfig`, `dependencies` (`:1789`), `private` is
     `true` (`:1792`), and the added scripts are exactly `["chess"]` (`:1799`). **Red on `"license"`. Scope 4 fixes
     it.**
   - `src/cli.test.ts:1111` (`ABC-042` `A1`): `scripts.chess` is `node src/cli.ts`. Holds.
   - `src/cli.test.ts:2386` (`ABC-059` `A1-A4`): exactly one script runs `src/cli.ts`. Holds.
   - `src/line-input.test.ts:674`: there is no `dependencies` key. Holds.
   - `src/cli.real-engine.test.ts:84`: the opt-in lane copies `package.json` byte for byte into a temp tree. Holds,
     because it compares the copy with the file as it is.
   No tracked test pins the value `cli-chess` or any `license` value.

## Size and priority

**`XS`:** one manifest line, one comment paragraph and one pin element, and no code. **Not `S`:** the pin edit is one
line that names the key this ticket adds. No value moves, and the pin's logic stays as it is.

**`P1`, inherited from `EPIC-007`.** **Not lower:** the web project should see that it runs a private, all rights
reserved program.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `50e081fc`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `692770d6` (subtask
`bapm-ABC-169-rescope`), after the `A6` stop. **Result: 10 of 10.** Items 2, 4, 5, 6 and 7 are re-read below.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** no `license` key; the tables are not credited |
| 2 | scope and out-of-scope clear | **✅** three files, one of them a single pin element (Scope 4); `LICENSE`, `NOTICE`, value changes, re-derivation and any other test edit fenced off |
| 3 | INVEST-shaped | **✅** independent of the code tickets; testable by `npm pkg get`, a grep and a transpile |
| 4 | acceptance testable and measurable | **✅** one added manifest line; five named strings; transpile byte identity; empty `git ls-files`; an exact three-file list; a 1/0 numstat on the test file; the pin armed |
| 5 | dependencies known | **✅** none open; `package.json` shared; `AT_HEAD` shared with `ABC-168`; the D13 wording only |
| 6 | security/NFR triggers with a measurable target | **✅** clause (a) fires; (b1) and (b2) do not, by `A3`; (c) re-read and does not fire (no capability added); no NFR |
| 7 | test notes present | **✅** four, one of them the list of `package.json` pins |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted `EPIC-007` and `ADR-0044` and chose private (`…c3e81a57`) |

**Recommended: → `Ready`, as far as Ready's WIP limit (8) allows.** Column moves are the Orchestrator's.
