---
id: ABC-169
title: "Declare the AGPL-3.0 licence (pending `arch-licence-eval`): `LICENSE` and the `package.json` `license` field, with the kit's MIT files excluded"
status: backlog
column: Backlog
size: XS
priority: P1
epic: EPIC-007
feature: —
---

# ABC-169 — one licence file, one manifest key, one notice. ZERO production lines

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**. The id was
> reserved by `bapm-engine-plan`. **The licence is AGPL-3.0, pending `arch-licence-eval`.** Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T103000Z-orchestrator-decision-owner-word-engine-q12-agpl-q13-rename-6b2d90f1.md`,
> a transcription, not a stamp): *"Q12: AGPL v3 if possible, grugops has MIT license. Evaluate if it is ok to use the
> evaluation tables and reference them and still use AGPL v3 for the built software."* That supersedes the Q8 reading of
> GPL-3.0 in `ADR-0044` D13. **This page does not evaluate the licence.** The Architect's `arch-licence-eval` hop does,
> and the owner makes the final call. **This hop ran nothing.**

## Problem

*User:* the owner, and anyone who receives this code, including the web project, which runs it.

*Pain:* the repo has no `LICENSE` file and no `license` key in `package.json` (`ls LICENSE*` found nothing at
`a10e09c2`). Without one, nobody else may lawfully copy or modify the code.

*Value:* the code carries the licence the owner chose, with the parts that are not his (the kit's MIT files, and the
evaluation tables if `arch-licence-eval` says so) stated plainly.

## Scope

1. **`LICENSE`:** the AGPL-3.0 text, byte for byte, from <https://www.gnu.org/licenses/agpl-3.0.txt>. A short notice
   section before it names:
   - the copyright holder (`Olger Oeselg`) and the SPDX id (`A2`);
   - that `tools/grugops/` is the grugops kit's, under the MIT licence, and is **not** covered by this `LICENSE` (Q12(b));
   - what `arch-licence-eval` settles for `src/evaluate.ts`'s tables (Q12(a)), for example a credit line;
   - the existing third-party credits, by pointer: `data/opening-book/ATTRIBUTION.md` (CC0-1.0).
2. **`package.json`:** `"license": "<SPDX id>"`.

## Out of scope

- **The licence evaluation itself** (Q12(a), Q12(c), and whether AGPL-3.0 is "possible"). It is `arch-licence-eval`'s.
- **Replacing the evaluation tables.** If `arch-licence-eval` and the owner choose that, it is a new ticket outside this
  epic, because it changes strength and moves the evaluation, puzzle, ladder and level pins.
- Licence headers in source files, a `NOTICE` file separate from `LICENSE`, SPDX headers, and a CLA.
- Any byte under `src/` or `tools/`. Adding an MIT text to `tools/grugops/` needs the kit's copyright line, which is
  `UNKNOWN - verify`, so it is not done here.

## Acceptance (Given/When/Then)

- **`A1` (the text).** **Given** the tip, **when** the AGPL-3.0 section of `LICENSE` is compared with the FSF's
  `agpl-3.0.txt`, **then** they are byte-identical. The sha256 of the FSF file is recorded with its fetch date at the
  build hop.
- **`A2` (the SPDX id).** `npm pkg get license` prints the id that `arch-licence-eval` and the owner settle: **`"AGPL-3.0-or-later"`**
  by default (the Orchestrator's reading, `…6b2d90f1`), or `"AGPL-3.0-only"` if the owner says so. The notice section
  states the same id.
- **`A3` (the tables).** The notice section carries exactly what `arch-licence-eval` settles for Q12(a). If that is a
  credit, it names Tomasz Michniewski's "Simplified Evaluation Function" and
  <https://www.chessprogramming.org/Simplified_Evaluation_Function>. If the outcome is "AGPL-3.0 is not possible with
  these tables", this ticket stops and goes back to the owner. It does not pick a different licence by itself.
- **`A4` (the kit).** The notice section contains one sentence saying `tools/grugops/` is MIT-licensed (the owner's
  word) and not covered by this `LICENSE`. `git diff <base> <tip> -- tools` is empty.
- **`A5` (fences).** `git diff --name-only <base> <tip>` lists exactly `LICENSE` and `package.json`. In `package.json`
  the diff is the one `license` line. The production-`src/` grep (`AGENTS.md` § Test and UAT authority) is empty.

## Dependencies

- **`arch-licence-eval`** (Architect, in flight at this hop). It settles Q12(a), Q12(c), and whether AGPL-3.0 is possible.
  Until it reports, `A2` and `A3` cannot be written exactly.
- **None among the code tickets.** It shares `package.json` with `ABC-168` and `ABC-172` (different keys). Whichever
  merges later rebases.
- **The owner's final call** on `arch-licence-eval`'s outcome. This is a licence evaluation, not legal advice.

## Security / NFR triggers

- **Security: TRIGGERED, a short hop.** `ABC-041` clause (a) fires on any touch of `package.json` (*"touched at all"*).
  This corrects the first version of `EPIC-007`, which said "No". (b), (c) and (d) do not fire: there are 0 production
  lines, no test and no `src/` file. Expected result: no finding.
- **NFRs:** none apply. The UAT waiver is expected (0 production lines). It is measured at the exit, not asserted here.

## Test notes

1. **`A1` is a byte comparison**, for example `diff` of the AGPL section against the fetched file. A licence text that
   is "nearly" the FSF's is not the FSF's.
2. **No mandatory gate covers a `LICENSE` file.** The gates still run because `package.json` changed. `npm ci` exits `0`.

## Size and priority

**`XS`:** two files and no code. **Not `S`:** there is no criterion beyond text and one key.

**`P1`, inherited from `EPIC-007`.** **Not lower:** the web project needs to know what it may do with this code.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 8 of 10. Stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** no licence exists |
| 2 | scope and out-of-scope clear | **✅** two files; the evaluation and table replacement fenced off |
| 3 | INVEST-shaped | **✅** independent of the code tickets |
| 4 | acceptance testable and measurable | **⚠️** `A1`, `A4` and `A5` are exact. `A2` and `A3` are exact once `arch-licence-eval` reports |
| 5 | dependencies known | **✅** `arch-licence-eval`; the owner's call |
| 6 | security/NFR triggers with a measurable target | **✅** clause (a) fires; no NFR |
| 7 | test notes present | **✅** two |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **❌** `arch-licence-eval` has not reported, and the owner has not accepted `EPIC-007` |

**Recommended: stay in `Backlog`. When `arch-licence-eval` reports, BA/PM writes `A2` and `A3` exactly and re-scores.**
Column moves are the Orchestrator's.
