---
id: 20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7
kind: decision
by: security-nfr
task: secnfr-ABC-095-s3
at: 2026-10-12T15:30:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-041
  - ABC-042
  - ABC-094
  - ABC-119
  - ADR-0036
  - ADR-0037
  - AR-095-READ
  - AR-095-L1UNIT
  - AR-095-CWD
  - QE-095-a
  - QE-095-d
  - QE-095-e
  - V12.3.1
  - NFR-006
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T151900Z-security-nfr-observation-s3-readings-clause-b-items-2-8-cwd-children-c24fec8e
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
supersedes:
---

# `ABC-095` `In Security/NFR` (S3): **PASS_WITH_RISKS**. All eight items MET, no fix required before merge. `QE-095-a` is accepted as `AR-095-CWD` (LOW) with a named fix, and item 7's text is corrected

This note is hand-authored and unsealed. No `finding` is admissible on this install, so every ruling here is
a `decision`. It covers the delivered pair `0974102f..2307fc11` (code `521a8513` + `09740ea4`) and the QE tip
`e1444f23`, which adds no production line. ASVS L1, `block_on: high`, no compliance regime. The checklist is
`.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43` § S3. The rule is `ADR-0036` § S1. The readings
are in `…c24fec8e`.

| S3 item | reading | state |
|---|---|---|
| 1 clause (b) | limb 1 FIRES: (b1) `book-file.ts:13`, (b2) `cli.ts -> book-file.ts`. Limb 2 FIRES: (b1) `cli.ts:177`. Limb 3 does not fire. `cli.ts -> book.ts` and `cli.ts -> book-engine.ts` do not fire. **Holders at the tip: 4.** Ruling 2 by hand FIRES. Nothing disputed | **MET, as predicted** |
| 2 `book-file.ts` | 1 import, 1 export with 0 parameters, 1 fixed-URL read, no `process`, no `catch`, nothing at import. Cwd-independent in a child | **MET** |
| 3 `cli.ts` | 3 imports, the one `const`, the `engine:` line, plus 4 comment lines. `warn` goes to stderr only | **MET** |
| 4 `A9` | third `process.stderr`; `\bprocess\b` 9 → 10; reason paragraph; `globalThis` guard kept; green | **MET** |
| 5 bars 1 and 4 | unedited and green; 0 forbidden substrings, comments included | **MET** |
| 6 hostile input | `book.ts` 0 lines; the warning carries a fixed reason, with no byte, path or errno | **MET** |
| 7 tree copy | real copy (`lstat`), leak detector present exactly once, `mkdtemp` under `tmpdir()`, exact-path removal | **MET in behaviour; text corrected below (`QE-095-e`)** |
| 8 `ABC-041` (a) (c) (d) | (a) not reached; (c) tmp-only writes, 0 new default-lane spawns, 2 named `CLI_DEEP` children; (d) the six files | **MET; nothing fires beyond (b)** |

## Ruling on `QE-095-a`: LOW, does not block, accepted as `AR-095-CWD`, with a named fix

**The gap.** No test pins how `readBookFile` resolves its path. Every child runs with its working directory
equal to its tree root, so a cwd-relative read is indistinguishable from the delivered read (`…c24fec8e` §
The cwd children).

**Severity: LOW.**
- **No requirement fails at the tip.** `V12.3.1` [L1] (no file path from an untrusted source) is met: the
  path is a constant resolved from the module's own URL. My child reading shows that the delivered build
  ignores a `book.json` planted in the working directory.
- **What the gap leaves open is a future regression that no test sees.** If it landed, the book's source
  would become whoever controls the launching directory. The planted-file child shows the file read and
  parsed. That fails `V12.3.1`'s class, and it fires `AR-095-READ`'s trigger ("the path stops being a
  constant") in effect.
- **Why it is not HIGH.** Two controls stand between such an edit and a merge:
  - `ADR-0036` § S1 Ruling 2 routes any edit to `src/book-file.ts` to this gate;
  - S3 item 2 reads the file by hand there.

  Both are manual today: `AR-095-L1UNIT` until the fold lands, and this gate. The impact is also bounded:
  `ABC-094`'s parser and the legal-move re-validation. At worst, a hostile book chooses legal opening
  moves, or it costs the read whole (`AR-095-READ`). The overriding reason is that the default tag is
  for a failed requirement, and none fails. **Owner: the Orchestrator.**
- **Does it block the merge? No** (`block_on: high`). The delivered code is correct. The fix adds a
  detective control and changes no behaviour.

**The named fix: QE's, confirmed by measurement.** Run `A7`'s `booked` child from a **neutral** working
directory, not from its tree root.
- **How.** `spawnReal` couples `cwd` to `root`. The fix gives the `A7` child a cwd that is not the tree
  root: a fresh `mkdtemp` directory, removed by its exact path, or `os.tmpdir()` itself.
- **Measured.** P6b with a neutral cwd prints `opening book could not be read; …`, so `A7`'s stderr-0-B
  reading reds. The delivered build prints 0 B.
- **It runs where it must.** `CLI_DEEP` runs at QE on every ticket (`AGENTS.md`), so an edit to
  `book-file.ts` meets the fix at QE as well as at this gate.
- **Who.** BA/PM amends `A7`'s Given, or cuts a follow-up; the SE builds it. It is test-only: 0 production
  lines, and 0 new spawns (the child already exists).
- **Not owed before this merge.**

**`AR-095-CWD`** (LOW; owner the Orchestrator, who routes the fix). It closes when a test reds on P6b, read
by QE with the plant. Until then the interim controls are Ruling 2 by hand (`AR-095-L1UNIT`) and S3 item 2.

## Ruling on `QE-095-e`: item 7's text needs a fix, and this is the fix

**Why it needs one.** Item 7 says "every entry under the copy's `src/` is a regular file". That is false for
any correct copy, because `src/__snapshots__` is a directory.
- **Read literally,** it would fail the delivered copy.
- **Or it would push a builder to flatten the tree,** which breaks byte identity.

The delivered test implements the intended rule, and so did QE's and the SE's readings. **The behaviour does
not change.**

**S3 item 7, first bullet, now reads** (this replaces "The copy is real, not linked. Every entry under the
copy's `src/` is a regular file (`lstat`, not a symbolic link): …"; the rest of item 7 is unchanged):

> **The copy is real, not linked.** Checked with `lstat`, before any child runs:
> - no entry under the copy's `src/`, and not `src/` itself, is a symbolic link;
> - every entry that is not a directory is a regular file;
> - the entry listing equals the repository's `src/` listing, and every file is byte-identical;
> - `package.json` is a regular file, not a link, and byte-identical.
>
> Byte identity cannot see a link, and a linked `src/` (or a linked `src/book-file.ts`) reads the
> repository's book (`…f0bf8b4a` § 3).

**Who owes the page text.** The page wording is BA/PM's: `ABC-095` test note 4 and `ABC-119` § Amendment
(`plans/tickets/ABC-119-…md:407`). This note does not edit either page. `ADR-0037` § Status points here.

## `AR-095-READ` and `AR-095-L1UNIT` at the tip

- **`AR-095-READ`: confirmed, still accepted** (LOW; owner Security/NFR).
  - **The read is unchanged.** `readFileSync` of a constant, module-relative path, with the 1 MB `NFR-006`
    cap after the read.
  - **The trigger has not fired.** `package.json` is still `private` with no `bin`, so `EPIC-006` has not
    landed, and the path is still a constant.
  - **Its trigger now has a second spelling.** Any cwd-relative or input-derived resolution counts as "the
    path stops being a constant" (`AR-095-CWD` above).
- **`AR-095-L1UNIT`: confirmed, still open** (LOW; owner the Orchestrator; the fold is owed by
  Architect/Design).
  - **The fold has not landed.** `.grugops/context/design-F-072-1/probe/clause-b.mjs` is unchanged since
    `341da4c1`, on `main` and on this branch. Ruling 2 was applied by hand here, and it fires.
  - **A trap for the by-hand method.** When no limb-1 holder exists at either end, an empty
    `git diff --name-only … --` lists every changed file. That would be a false "fires". The rule: take
    the holders at `<base>` **and** `<head>`. If both are empty, Ruling 2 does not fire, and the
    `git diff` is not run. The brief's "take the holders from the base" would have hit this trap on this
    very pair, where the base holds none. The fold should treat the empty set explicitly. This is recorded
    as a dated reading under `ADR-0036` § S1.

## `ABC-041` beyond (b)

- **(a)** Not reached.
- **(c)** Reached by the `ABC-119` copy, and it does not fire: writes go under `os.tmpdir()` only, and
  removal is by the exact path. One more leftover path, the same class as `QE-095-d`: a copy whose
  `cpSync` or `copyFileSync` throws inside `makeBookAbsentCopy` is never returned, so it is never
  removed. It is tmp-only, same-user and outside the repository. **I agree with QE's LOW for
  `QE-095-d`.** It is the Orchestrator's to accept, and it needs no security fix.
- **(d)** Does not fire.

## Result

**PASS_WITH_RISKS.**
- **Required fixes before merge:** none.
- **Accepted risks:**
  - `AR-095-CWD` (LOW, the Orchestrator; fix routed to BA/PM, then the SE);
  - `AR-095-READ` (LOW, Security/NFR);
  - `AR-095-L1UNIT` (LOW, the Orchestrator; fold owed by Architect/Design).
- **Not this hop's:** `N8-LANE` (`QE-095-N8`, `QE-095-h`). No timing was read.

## Owed

- **BA/PM:**
  - the `QE-095-e` page text: `ABC-095` test note 4 and `ABC-119` § Amendment, to item 7's wording above;
  - the `AR-095-CWD` fix: amend `A7`'s Given, or cut a test-only follow-up, so that the `booked` child
    runs from a neutral working directory.
- **SE:** build the `AR-095-CWD` fix when it is cut.
- **Architect/Design:** fold Ruling 2 into `clause-b.mjs` (`AR-095-L1UNIT`), with P2b and P2c as plants
  that fire, **and** an empty-holder case that does not fire.
- **Orchestrator:**
  - move `ABC-095` to `Ready for UAT`; the board is yours;
  - the UAT waiver does not apply (3 production files), so the owner's word is owed;
  - route `QE-095-N8` and `QE-095-h`;
  - record `AR-095-CWD` and route its fix;
  - keep applying Ruling 2 by hand, holders at both ends, until the fold lands.
