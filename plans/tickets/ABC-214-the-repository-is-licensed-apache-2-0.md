---
id: ABC-214
title: "The repository is licensed Apache-2.0: a verbatim `LICENSE`, a `NOTICE`, and `\"license\": \"Apache-2.0\"` in `package.json`, with the CC BY-SA 3.0 evaluation tables carved out (path A)"
status: ready
column: Ready
size: XS
priority: P1
epic: EPIC-007 (post-close addition)
feature: —
adr: "the licence ADR (Architect/Design; supersedes ADR-0044 D13's private reading). It must be accepted before this ticket merges, not before it builds"
---

# ABC-214: Apache-2.0 for the repository. Zero executable lines

> **Cut 2026-10-24 by BA/PM** (task `bapm-cut-licence`, records only, at `main` `c487d89c`). The owner's word is
> `.grugops/context/owner-word-2026-10-23/notes/20261023T220500Z-orchestrator-decision-28633db0.md`. Verbatim:
> *"let's put license as apache 2.0"*. That note is a transcription, not a stamp. The licence facts and options come
> from Security/NFR's licence note `…21dd2358` (task `security-nfr-public-repo`, LIC-PUB-1). That branch is held, and
> this page copies nothing from it except licence facts.
>
> **Amended 2026-10-24 by BA/PM: path A** (task `bapm-ABC-214-path-a`, records only, at `main` `d4d49c5a`). The
> owner answered OD-214-1 with *"accept your recommendations, other session paused"* (`owner-word-2026-10-24`
> `…fb0468ff`, a transcription, not a stamp): path A. Every [B] row is deleted, and [both] and [A] stand unchanged.
> `A7` was path B's, and its number is not reused. Item 8's re-derive ticket is cut as `ABC-215` (`EPIC-008`,
> `Backlog`). DoR re-checked: 10/10 → `Ready` (§ Definition of Ready).
>
> *This is an engineering role's reading, not legal advice.* Every legal conclusion here is `UNKNOWN - verify`.

## Problem

- **User:** the owner, and anyone who now reads, clones or forks the public repository.
- **Pain:**
  - The repository is public. `package.json` says `"license": "UNLICENSED"` (`package.json:5`), and no `LICENSE`,
    `NOTICE` or `COPYING` file is tracked. A reader gets no permission to use, change or share the code.
  - The owner chose Apache-2.0 (`…28633db0`). Nothing in the tree says so.
  - `src/evaluate.ts:16-20` holds Tomasz Michniewski's values under CC BY-SA 3.0. Security/NFR reads Apache-2.0 as
    **not compatible** with CC BY-SA 3.0 if the tables are an Adaptation (`…21dd2358`; `UNKNOWN - verify`). A plain
    repo-wide Apache-2.0 grant would claim to license material the owner does not hold.
  - `ADR-0044` D13's precondition says *"re-derive our own values first"* before any distribution. Publication
    breached it (LIC-PUB-1, MEDIUM, owner-owned).
- **Value:** the repository carries the licence its owner chose, in the form tools and readers recognise. The one
  third-party, share-alike part is declared outside that licence (A), until `ABC-215` replaces it.

## Readings (at `main` `c487d89c`, this hop)

- `package.json`: `"private": true` (`:4`), `"license": "UNLICENSED"` (`:5`). No `dependencies` key.
- `package-lock.json`: `packages[""].license` is `"UNLICENSED"` (`:10`), placed there by `ABC-190` (`15766056`).
- `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*' 'README*'` prints nothing. **There is no README to edit.**
- `src/evaluate.ts`:
  - the header `/** … */` block is lines `1-21`;
  - the Michniewski credit is `:16-20`;
  - the seven credited arrays are `PIECE_VALUE` (`:43`), `PAWN_TABLE` (`:61`), `KNIGHT_TABLE` (`:73`),
    `BISHOP_TABLE` (`:85`), `ROOK_TABLE` (`:97`), `QUEEN_TABLE` (`:109`) and `KING_TABLE` (`:121`).
- **The Apache-2.0 text.** `https://www.apache.org/licenses/LICENSE-2.0.txt`, fetched 2026-10-24 by this hop:
  - 11 358 bytes and 202 lines, ASCII;
  - sha256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`.
- **The lock moves by one line.** On a scratch copy, `"license": "Apache-2.0"` in `package.json` followed by
  `npm install --package-lock-only --ignore-scripts --offline` (npm 11.20.0, node v26.11.1) changed exactly one lock
  line: `packages[""].license` `"UNLICENSED"` → `"Apache-2.0"`.
- **The `package.json` pins** (`grep -n package.json src/*.test.ts`). **None moves on this ticket:**
  - `src/cli.test.ts:1827` (`ABC-042` `A10`): `AT_HEAD` already lists `"license"` (`:1838`, added by `ABC-169`). The
    key set does not change. Nothing in it reads the licence's value. `private` must be `true` (`:1866`), and it
    stays `true`.
  - `src/cli.test.ts:1178`, `:2483` and `:4065` read `scripts` only.
  - `src/line-input.test.ts:686`: no `dependencies` key. Holds.
  - `src/cli.real-engine.test.ts:99`: the opt-in lane copies `package.json` byte for byte. It compares the copy with
    the file as it is, so it holds.
  - No tracked test pins any `license` value, and no test lists the repository root.
- `biome.json` `files.includes` matches `*.json` at the root. It matches neither `LICENSE` nor `NOTICE`.
- First commit: `49edb4f7`, 2026-07-22. The copyright year is 2026.
- The kit's own `LICENSE` reads *"MIT License, Copyright (c) 2026 Olger Oeselg"*. It is the installed kit's file, read
  only.
- **Re-read 2026-10-24 at `main` `d4d49c5a`** (`bapm-ABC-214-path-a`). `git diff --stat c487d89c d4d49c5a` over
  `src/evaluate.ts`, `package.json`, `package-lock.json`, `src/cli.test.ts`, `src/line-input.test.ts`,
  `src/cli.real-engine.test.ts`, `biome.json` and `tools/grugops` prints nothing. The seven arrays are still at
  `:43`-`:121`, the `private` assertion is still at `:1866`, and no `LICENSE`, `NOTICE`, `COPYING` or `README` is
  tracked. Every reading above holds, and so does `A5`'s base check.

## Scope

### [both] Every path

1. **`LICENSE`** at the repository root (new). Byte-identical to `https://www.apache.org/licenses/LICENSE-2.0.txt`,
   with the APPENDIX included and its bracketed placeholders left as they are. The copyright line goes in `NOTICE`, not
   in `LICENSE`.
2. **`package.json`:** `"license": "UNLICENSED"` becomes `"license": "Apache-2.0"`. `"private": true` stays, so npm
   still refuses `npm publish`. No other key moves.
3. **`package-lock.json`:** the one matching line under `packages[""]` moves the same way. No other lock line moves.
4. **`src/cli.test.ts`, one assertion line.** Add, directly after `expect(packaged.private).toBe(true);` (`:1866`):

   ```ts
   expect(packaged.license, "package.json license (ABC-214)").toBe("Apache-2.0");
   ```

   Nothing else in that test or file changes. A public licence is now a promise to readers, so a silent edit should
   turn the gate red. `ABC-169` relied on `AT_HEAD`, but `AT_HEAD` sees keys, not values.
5. **`NOTICE`** at the repository root (new). Its common part, the default wording:

   ```text
   skytalix
   Copyright 2026 Olger Oeselg

   Licensed under the Apache License, Version 2.0 (the "License"); see the LICENSE file.
   The parts listed below are not licensed under the License.

   grugops kit files (MIT)
     tools/grugops/reference-check.js, tools/grugops/test-skip-integrity.js,
     tools/grugops/uat-spec-integrity.js and tools/grugops/host-protection.js come from the
     grugops kit. They are licensed under the MIT License, Copyright (c) 2026 Olger Oeselg.
   ```

   If the licence ADR gives different wording and lands first, the ADR's wording wins. `A4` must still hold.

### [A] Path A: carve the tables out now, re-derive later as its own ticket

6. **`NOTICE`** gains one more section after the header lines, before the kit section. The default wording:

   ```text
   Evaluation values (CC BY-SA 3.0)
     In src/evaluate.ts, PIECE_VALUE, PAWN_TABLE, KNIGHT_TABLE, BISHOP_TABLE, ROOK_TABLE,
     QUEEN_TABLE and KING_TABLE hold the values of Tomasz Michniewski's "Simplified Evaluation
     Function", published at https://www.chessprogramming.org/Simplified_Evaluation_Function
     under CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/) by its contributors.
     The values are unchanged. The layout and the king value of 0 are ours.
     These values are not licensed under the Apache License, Version 2.0. They remain under
     CC BY-SA 3.0. No endorsement by the author is implied.
   ```

7. **`src/evaluate.ts`, header comment only.** Add two comment lines after `:20` (*"…The layout, the king value of
   0 and all code are ours."*), inside the same `/** … */` block:

   > ` * These values are not licensed under the Apache License, Version 2.0 that covers the rest of`
   > ` * this repository. They remain under CC BY-SA 3.0. See NOTICE.`

   No number, identifier or code line moves.
8. **The later re-derive ticket is `ABC-215`** (cut 2026-10-24 on the owner's word, `EPIC-008`, `Backlog`). It
   removes the `NOTICE` section in item 6 and the header lines in item 7 in the same change as the new values. This
   ticket does not wait for it.

## Out of scope

- **Re-deriving the tables in this ticket.** Path A defers it to `ABC-215`.
- **Rewriting public history.** Three older public versions of `src/evaluate.ts` carry the values without credit.
  Removing them needs a force push, which is the owner's call (LIC-PUB-1). This ticket changes the tip only.
- **Moving the tables into their own file.** Security/NFR names that as a cleaner form of the carve-out under the
  Collection reading. It is a code change and an open legal point (`UNKNOWN - verify`). The licence ADR may raise it,
  and a ticket would follow on the owner's word.
- A README, SPDX headers in source files, and courtesy credits for the CC0 and public-domain parts. Nothing is owed
  for those: the opening book is CC0 (`ADR-0023`), and `data/opening-book/ATTRIBUTION.md` already records it.
  mulberry32 and splitmix64 are CC0 or public domain.
- Re-licensing the other kit outputs (`.claude/`, `.gemini/`, `.pi/`, `.github/`). Their inventory is
  `UNKNOWN - verify`. They fall under `LICENSE` by default. The licence ADR rules them.
- `"private": true`, `npm publish`, and any `dependencies` key.
- Editing `ADR-0044`, `EPIC-007` or `ABC-169`. The Architect's licence ADR lists what changes (§ Records drift).
- Security/NFR's other public-repo findings. They are tracked elsewhere and are not licence work.
- Legal advice, and writing to the rights holder for permission.

## Acceptance (Given/When/Then)

`<base>` is the build base. `<tip>` is the branch tip.

- **`A1` [both] (the manifest).** **Given** the tip, **when** `npm pkg get private license` runs, **then** it
  prints one JSON object with `"private": true` and `"license": "Apache-2.0"`.
  - `git diff --numstat <base> <tip> -- package.json` is `1 1`.
  - The removed line, trimmed, is `"license": "UNLICENSED",`. The added line, trimmed, is `"license": "Apache-2.0",`.
  - The SPDX id is exactly `Apache-2.0`. Case matters, and no other spelling counts (`Apache 2.0`,
    `Apache-2.0-only`, `Apache License 2.0`).
- **`A2` [both] (the lock).** `git diff --numstat <base> <tip> -- package-lock.json` is `1 1`. The removed line,
  trimmed, is `"license": "UNLICENSED",`, and the added line is `"license": "Apache-2.0",`, both under `packages[""]`.
  At the tip, `npm install --package-lock-only --ignore-scripts` leaves `git status --porcelain` empty.
- **`A3` [both] (the licence text).**
  - `shasum -a 256 LICENSE` prints `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`.
  - `wc -c < LICENSE` is `11358`.
  - The builder fetches `https://www.apache.org/licenses/LICENSE-2.0.txt` at build time and records its sha256 in the
    hop note. If it differs from the pin, the build stops and goes back to BA/PM.
- **`A4` [both] (the `NOTICE`).**
  - Line 1 is `skytalix`. Line 2 is `Copyright 2026 Olger Oeselg`.
  - It contains `Apache License, Version 2.0` and `MIT License`.
  - It names each of the four kit paths: `tools/grugops/reference-check.js`, `tools/grugops/test-skip-integrity.js`,
    `tools/grugops/uat-spec-integrity.js` and `tools/grugops/host-protection.js`.
  - **No personal data beyond the copyright holder's name:** `grep -c '@' NOTICE` is `0`, and `grep -c '/Users/'
    NOTICE` is `0`.
  - `LC_ALL=C grep -c '[^ -~]' NOTICE` is `0` (printable ASCII only).
- **`A5` [A] (the carve-out).**
  - `NOTICE` contains `src/evaluate.ts`, `Michniewski`, `Simplified Evaluation Function`,
    `https://www.chessprogramming.org/Simplified_Evaluation_Function`, `CC BY-SA 3.0`,
    `https://creativecommons.org/licenses/by-sa/3.0/` and `not licensed under the Apache License, Version 2.0`.
  - It names exactly the seven identifiers in § Readings, each once, in the carve-out section.
  - The first `/** … */` block of `src/evaluate.ts` contains `not licensed under the Apache License, Version 2.0`,
    `CC BY-SA 3.0` and `See NOTICE`. It still opens at line 1, and the `import` from `./position.ts` still follows it.
  - **The identifier list is read against the base.** If `src/evaluate.ts` at `<base>` differs from `c487d89c` in
    `ts.transpileModule(…, { removeComments: true }).outputText`, the build stops. The list goes back to BA/PM for a
    one-line re-read. `ABC-205` and `ABC-207` are the known causes.
- **`A6` [A] (comment only).** Both checks of the owner's Q4 measurement (`…5c8e2a17`) hold, as in `ABC-169` `A3`:
  - every `+` and `-` line of `git diff <base> <tip> -- src/evaluate.ts` lies inside the header block. Each one is a
    comment line (it starts with ` *` after optional whitespace);
  - `ts.transpileModule(source, { compilerOptions: { removeComments: true } }).outputText` of `src/evaluate.ts` is
    byte-identical at `<base>` and `<tip>`.

  If either check fails, the change is not comment-only. The ticket stops and goes back to BA/PM.
- **`A8` [both] (the pin).**
  - `git diff --numstat <base> <tip> -- src/cli.test.ts` is `1 0`. That added line, trimmed, is Scope 4's line. It sits
    inside `ABC-042` `A10`'s `it(…)` block, directly after the `private` assertion.
  - **The pin is armed.** With only the `package.json` licence line reverted to `UNLICENSED` (the test file as at
    the tip), `A10` is red, and it is the only red row. This is one reading in the hop record, not a new test. The line
    is restored before the commit.
- **`A9` [both] (fences).** `git diff --name-only <base> <tip>` lists exactly:
  - **[A]** `LICENSE`, `NOTICE`, `package.json`, `package-lock.json`, `src/cli.test.ts`, `src/evaluate.ts`.

  `git diff <base> <tip> -- tools data` is empty.
- **`A10` [both] (the gates).**
  - The four mandatory gates (lint, typecheck, unit, build) are green.
  - The test count equals `<base>`'s, because no test file and no `it` is added.
  - `npm ci` exits `0`.
  - `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints `No findings.` (it does at `c487d89c`).

**Owner check, not gating (outside the repository):** after the owner pushes, GitHub's repository page names
Apache-2.0. Whether GitHub's licence detection also reports the `NOTICE` carve-out is `UNKNOWN - verify`.

## Dependencies

- **OD-214-1: answered 2026-10-24, path A** (`owner-word-2026-10-24` `…fb0468ff`). No longer blocking.
- **The licence ADR (Architect/Design).** It supersedes `ADR-0044` D13's private reading and records Apache-2.0. Its
  drift list is in § Records drift. The owner accepts it **before this ticket merges**. While D13 stands accepted, it
  says *"no `LICENSE` file"*, and a merge would contradict it. The build does not wait for it. If its `NOTICE`
  wording lands first, that wording wins (Scope 5).
- **`ABC-205`** (In Design, `arch-design-ABC-205`, in parallel with this cut). It edits `src/evaluate.ts` and replaces
  `KING_TABLE` with a tapered middlegame and endgame pair.
  - **[A]** This ticket edits only the header block, so the two diffs touch different lines. Whichever merges later
    rebases. A comment-only merge does not make `ABC-205`'s D reading stale (`EPIC-008` § "When a D reading goes
    stale"). **The carve-out's identifier list follows the file.** If `ABC-205` merges first, `A5`'s base check stops
    the build, and BA/PM re-reads the list. Two cases:
    - its tables are our own: `KING_TABLE` leaves the list;
    - any value comes from the Michniewski page (that page also has a king endgame table): it joins the list.

    **The `ABC-205` design hop should therefore name the source of every new king value.** The Orchestrator routes
    that point. This page cannot reach that hop.

    **Pre-read 2026-10-24** (`bapm-ABC-214-path-a`), for the stop above, at `grugops/ABC-205` `4f650a45` (built, not
    merged). The design ruling (`…1fb6e1bc` item 2) keeps `KING_TABLE` unchanged as the middlegame half and adds
    `KING_ENDGAME_TABLE`, "our own `40 − 15·m`; no Michniewski endgame table". The branch's header says *"The king
    endgame table is this project's own."* **If that merges as built, the list stays the same seven names.**
    `KING_ENDGAME_TABLE` does not join, and `KING_TABLE` does not leave. Header line `:20` then ends with that extra
    sentence, and item 7's two lines still go directly after it. If `ABC-205` changes before its merge, this pre-read
    no longer holds, and the stop goes to BA/PM as written.
- **`ABC-207`** (Backlog, `src/evaluate.ts` mobility). The same rebase rule applies. Mobility values are not
  Michniewski's.
- **`ABC-215`** (Backlog, `EPIC-008`) depends on this ticket, not the other way round. It re-derives the values and
  removes the carve-out (Scope 6 and 7) once this ticket has merged.
- **`ABC-211`** (Backlog, a new opening-book source under `ADR-0023`). If its source is not CC0, `NOTICE` gains a
  section in that ticket.
- **`package.json`:** no other open ticket edits it.

## Security / NFR triggers

- **Security: TRIGGERED, a short hop.** `ABC-041` clause (a) fires on any touch of `package.json` or
  `package-lock.json` (*"touched at all"*). Expected result: no finding. The hop also reads `A3`'s sha and `A4`'s
  no-personal-data checks.
- **`ADR-0036` (b1) and (b2) do not fire.**
  - (b1) asks for an added or changed line of executable code in a production file. **[A]** `A6` proves there is
    none.
  - (b2) asks for a new runtime import edge, and none is added.
- **(c) does not fire.** The one test edit (`A8`) adds one `expect` on an object the test already reads with
  `readFileSync`. It adds no import, call or capability. Read-only `node:fs` over the repository's own files is the
  clause's named precedent. `ABC-169` set the same reading for a one-line `AT_HEAD` edit.
- **(d) blast radius:** **[A]** two files under `src/`, both named in `A9`.
- **NFRs: none move.** **[A]** By `A6`'s transpile identity, the emitted code is unchanged. Every evaluation, puzzle,
  level and `EPIC-008` gate stays where it is. The `N8-LANE` set is unchanged: no test file is added.

## UAT

**Expected: WAIVED, by measurement at the exit.** The label is "WAIVED (waived is not accepted)".

- **[A]** `src/evaluate.ts` is a production file in the diff, so the 2026-08-17 file-level grep is not empty. The
  owner's Q4 word (2026-10-10, `…5c8e2a17`) counts a diff of comment lines only as zero production lines. The waiver
  applies when `A6` holds. **If `A6` fails, UAT is owed, and the QE verdict signs it.**
- `LICENSE`, `NOTICE` and `package*.json` are not under `src/`. They have no effect on the waiver.

## Test notes

1. **`A6` is the real check under A.** A comment that slips one character outside the block changes the emitted code.
   The transpile identity catches that where a line-shape grep might not.
2. **Fetch the licence, do not retype it.** `curl -sS -o LICENSE https://www.apache.org/licenses/LICENSE-2.0.txt`,
   then `A3`. An editor's trailing-newline or whitespace fix breaks the sha.
3. **Write the lock with npm, not by hand.** `npm install --package-lock-only --ignore-scripts`, then `A2`'s numstat.
   This hop's probe ran offline and moved one line.
4. `npm pkg get private license` prints one JSON object, not two bare lines. Read both values from it.
5. The `NOTICE` wording in Scope is the default. `A4` and `A5` check strings, not the whole file. The ADR's wording
   may replace it as long as they hold.
6. **No new test file and no new `it`.** One `expect` line is added to `ABC-042` `A10`. `A8`'s armed reading shows it
   bites.

## Records drift: "private / UNLICENSED" statements for the Architect's licence ADR

Listed for the ADR's supersession. This page edits none of them. Read at `main` `c487d89c`.

| # | where | what it says now | why it is now false |
|---|---|---|---|
| 1 | `ADR-0044` D13, `:522-530` | *"Licence: private, all rights reserved"*; `package.json` gains `"license": "UNLICENSED"`; *"The repository gets no `LICENSE` file and no `NOTICE` file"*; *"For now"* … *"Opening the licence later is a new owner decision. It reopens this D13"* | The owner opened it: Apache-2.0 (`…28633db0`). The ADR uses D13's own reopening clause |
| 2 | `ADR-0044` D13, `:548-557` | The tables stay as they are because *"The engine is not distributed"*. *"A precondition for any distribution to third parties: re-derive our own values first"* (a clone handed to someone else counts) | The public repository is a distribution, and the precondition was breached (LIC-PUB-1). Path A (`…fb0468ff`) replaces the precondition with a carve-out now plus a later re-derive, `ABC-215` |
| 3 | `ADR-0044` D13, `:531-538` | The four kit files *"stay MIT"*. Their notice is `UNKNOWN - verify`. The other seven `tools/grugops/` files *"are private like `src/`"* | The kit's MIT line is now known (`Copyright (c) 2026 Olger Oeselg`, the kit's own `LICENSE`). The other seven fall under Apache-2.0 |
| 4 | `ADR-0044` D13, `:561-565` | The withdrawn AGPL "Source" link, and *"The web project's licence is its own … A bundle would be a distribution, and the precondition above would apply"* | The precondition now reads per path A: the carve-out, then `ABC-215` |
| 5 | `ADR-0044` § Revision — private, P1/P2/P6 (`:85-90`), and § Owner questions Q12/Q15 (`:831`, `:834`) | Private, all rights reserved; Q15 moot | They stand as history. The ADR adds a dated row that supersedes them |
| 6 | `ADR-0044` § Consequences, `:745-747` | Config: `"license": "UNLICENSED"` … *"There is no `LICENSE` file and no `NOTICE` file (D13)"* | `ABC-214` adds both |
| 7 | `ADR-0044` § Consequences, `:789-790`, and § Rollback, `:800` | Distribution needs our own values first (D13). The licence is not rolled back with the engine | Unchanged in sense, but it points at the D13 rows above |
| 8 | `ABC-169` (Done), title and Scope 1 | *"Declare the engine private"*: `"license": "UNLICENSED"` | Its value is replaced by `ABC-214` `A1` |
| 9 | `ABC-169` `A4` | `git ls-files 'LICENSE*' 'NOTICE*' 'COPYING*'` prints nothing | False at `ABC-214`'s tip. It is a Done ticket's dated reading, so it is kept as history and not edited |
| 10 | `ABC-169` § Out of scope | *"A `LICENSE` file, a `NOTICE` file, an SPDX header, or any open-source licence. The owner chose private."* Re-deriving is a precondition for future distribution | It is superseded by the owner's word and `ABC-214` |
| 11 | `EPIC-007` M10, `:223` | *"The engine is declared private"*: `npm pkg get private license` prints `"UNLICENSED"`. No `LICENSE`, `NOTICE` or `COPYING` is tracked | False at `ABC-214`'s tip. M10 was MET on `ABC-169` (`:85`). That reading stays dated history. The measure needs a superseding row, or a note that `ABC-214` replaces it |
| 12 | `EPIC-007` acceptance box `:19-21`, § Scope `:182-186`, the ticket table `:240`, Q12 `:299`, the web project `:332` | *"The licence is private, all rights reserved"*; *"No `LICENSE` or `NOTICE` file is added"*; *"a private, all rights reserved program"* | The same supersession, plus one dated line |
| 13 | `EPIC-007` `RISK-EPIC007-07`, `:382-386` | The tables rest on *"the engine not being distributed"*. The re-derive is cut *"only on the owner's word"* | It fired at publication. Its disposition is path A (`…fb0468ff`): the carve-out here, the re-derive in `ABC-215` |
| 14 | **Also found:** `ADR-0023` `:60-63` | *"The repository has no licence of its own"* … *"all rights reserved"* (measured 2026-09-19) | It is a dated measurement. It now reads as history. The CC0 book needs nothing under Apache-2.0 |

Not drift: `"private": true` stays true. `45-standing-rulings.md` `:135-140` and `ADR-0044` D8 `:359` stand. The
"unlicensed" in `ADR-0011`, `ABC-029`, `ABC-057`, `ABC-136` and `ABC-137` means "outside the `ADR-0011` clause 3 import
licence set", not the software licence. `ABC-190` is a Done ticket's dated reading.

## Open questions (none blocks the build; OD-214-1 is answered, path A)

- **OQ-214-2, the copyright line.** Default: `Copyright 2026 Olger Oeselg`, the form the kit's own `LICENSE` uses. How
  far copyright protects AI-assisted code is `UNKNOWN - verify` (legal). That does not change the line.
- **OQ-214-3, the kit files.** Default: they stay MIT (D13 item 2) and `NOTICE` names them. The owner holds both
  copyrights, so folding them into Apache-2.0 is also open to him. That would drop one `NOTICE` section. The licence
  ADR rules it.
- **OQ-214-4 (legal, not a criterion).** Under the Adaptation reading, does a `NOTICE` carve-out satisfy BY-SA 3.0
  § 4(b)? `UNKNOWN - verify`, legal advice. `ABC-215` removes the question at its tip.

## Size and priority

**`XS`:** two fixed texts (one fetched, one short), one manifest line, one lock line, one test line, and under A two
comment lines. There is no code. **Not `S`:** nothing is designed in the build. The open choices are the owner's, and
they are settled before the pull.

**`P1`.** The repository is public now with no licence, and LIC-PUB-1 is MEDIUM and open. **Not P0:** nothing is
broken for the owner, and nothing is deployed.

## Definition of Ready

**Re-checked 2026-10-24 by BA/PM** (`bapm-ABC-214-path-a`, at `main` `d4d49c5a`, after OD-214-1 = path A).
**Result: 10 of 10 → `Ready`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** public repository, no licence; the owner chose Apache-2.0; CC BY-SA tables in `src/evaluate.ts` |
| 2 | scope and out-of-scope clear | **✅** six files (`A9`); the re-derive (`ABC-215`), history, table split, README, SPDX headers and kit outputs fenced off |
| 3 | INVEST-shaped | **✅** small; testable by sha, numstat, grep and transpile; independent: it builds on `main` as it is, and `ABC-215` follows it, not the reverse |
| 4 | acceptance testable and measurable | **✅** an exact sha and byte count; `1 1` numstats; named strings; a 0-count personal-data grep; transpile identity; an exact file list; an armed pin. `A7` (path B) is deleted |
| 5 | dependencies known | **✅** OD-214-1 answered; the licence ADR before merge (Architect, in flight); `ABC-205` (with the pre-read of its built king tables), `ABC-207`, `ABC-211`; `ABC-215` follows |
| 6 | security/NFR triggers with a measurable target | **✅** `ABC-041` (a) fires; (b1), (b2) and (c) do not, by `A6`/`A8`; no NFR moves |
| 7 | test notes present | **✅** six |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker | **✅** none blocks the build. The licence ADR gates the merge, not the build (§ Dependencies). An `ABC-205` merge first is handled by `A5`'s stop, and its answer is pre-read |

Ready's WIP is 0/8 at `d4d49c5a`, so this makes 1/8. The board move is the Orchestrator's.

*History:* the cut's own check (2026-10-24, `bapm-cut-licence`, at `c487d89c`) was 9 of 10, with item 10 ❌ on the
open OD-214-1. It recommended `Backlog` until the answer, and on "A" this amendment and 10/10.
