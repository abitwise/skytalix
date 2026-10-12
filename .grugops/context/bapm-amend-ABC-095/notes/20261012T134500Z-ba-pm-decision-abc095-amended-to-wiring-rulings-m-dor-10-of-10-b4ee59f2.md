---
id: 20261012T134500Z-ba-pm-decision-abc095-amended-to-wiring-rulings-m-dor-10-of-10-b4ee59f2
kind: decision
by: ba-pm
task: bapm-amend-ABC-095
at: 2026-10-12T13:45:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - ABC-042
  - ADR-0037
  - ADR-0036
  - ADR-0015
  - NFR-004
  - NFR-008
  - N8-LANE
  - AR-095-READ
  - AR-095-L1UNIT
  - F-095-1
  - 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T134225Z-ba-pm-observation-who-reads-the-ten-children-and-four-readings-off-the-list-809044ec
supersedes:
---

# `ABC-095` amended to the wiring rulings, re-sized `S` → `M`, DoR 10/10; five `Done` pages carry dated amendments delivered by its diff

This note is hand-authored and unsealed, and it is an agent `decision`, not a stamp. The ticket pages'
`## Scope` and `## Acceptance` are authoritative. This note records why. The readings are in
`…809044ec`.

## What was applied, page by page

| page | amendment | source |
|---|---|---|
| `ABC-095` § Scope | adds `src/book-file.ts` (holder, R1 contract), the 10 re-targets, the 2 pins, `ABC-119`'s lane move, and clause (d)'s six-file `src/` list | Architect 1, 4; Security (d) |
| `ABC-095` `A2` | the Given is cold (the first call in a fresh process); the bar does not change | Architect 6; R3 |
| `ABC-095` `A7` | `read: readBookFile`, `warn` writes `line + "\n"` to `process.stderr` in `cli.ts`; "only changed property" unchanged | Architect 1 |
| `ABC-095` `NFR-004` | the 5 ms miss bar is WARM: warm-up hit, 200 timed calls, max ≤ 5 ms, median and p99 recorded; cites R3 | Architect 5; brief |
| `ABC-095` `NFR-008` | 0 spawns, ≤ 1 file hold; two `UNKNOWN - verify` costs on `N8-LANE`: the 10 children's real closure, and `ABC-119`'s default-lane copy | Architect 7; `…809044ec` § 2.4 |
| `ABC-095` Security | the old (b1)/(b2) prediction is struck; R1's is written; it cites § S1 and S3; names `AR-095-READ`, `AR-095-L1UNIT`, `F-095-1` closed; bar 4 is file-scoped | Architect 2; Security owed 3; brief |
| `ABC-095` test note 4 | the copy's rules: real (`lstat`), byte-identical, book absent, `mkdtemp(os.tmpdir())`, exact-path `rmSync` | S3 item 7 |
| `ABC-095` § Lane cost | still one new file; two existing test files are edited | Architect 8 |
| `ABC-095` 2026-10-10 Overlaps | "does not need to edit `src/cli.test.ts`" is struck | Architect 3 |
| `ABC-095` § Size, front matter | `S` → `M` (3) | Architect 4; brief |
| `ABC-119` `A1` | the Given gains the copy (real, no link, byte-identical `src/` asserted before the spawn, book absent, `mkdtemp`, exact-path `rmSync`); the parenthetical "a double, or the book" | Architect 1, 2; Security owed 1 |
| `ABC-119` `A3`, `A4` | the same Given as `A1`; `A3`(iv): the warning is asserted PRESENT, exactly once | Architect 3; Security owed 2 |
| `ABC-119` default-lane row | the entry path moves to the copy; the copy's checks join it; it still spawns nothing | Architect 4; Security owed 1 |
| `ABC-043` | `A1` pointer; a dated note under the testability ruling (`./book-engine.ts`, `withBook`); 3 (N) rows (`A5`, `A2`, `A7`) | Architect 1–3 |
| `ABC-044` | (N) is confirmed for `A3`, **and for `A6`** (`mate`, not on the Architect's list) | Architect; `…809044ec` § 2.1 |
| `ABC-045` | (N) is confirmed for `A4`; QE's "with the engine substituted" stays true | Architect |
| `ABC-046` | (N) is confirmed for `A2`/`A3`/`A6` | Architect |
| `ABC-042` | **not edited**: criteria unchanged; bar 4 is Security/NFR's (S2, no change) | Architect |

**The form on `Done` pages.** Each `Done` page gets a dated `## Amendment — 2026-10-12` section,
appended. Where criterion text changes (only on `ABC-119`), the old words are struck and kept, and the new
ones are dated in place. Each `Done` page says that the amendment is delivered by `ABC-095`'s diff, and
that the page stays `Done`.

## (N), one line per criterion

The re-target keeps each double at the same seam: the `EngineSeam` at `engine:`. Only the module that
supplies it changes, from `./engine.ts` to `./book-engine.ts`. (N) is criterion-relative and is not a
module list, so the module's name is not what (N) reads. **The verdicts:**
- (N1)–(N3) hold for `ABC-043` `A2`/`A5`/`A7`, `ABC-044` `A3`/`A6`, `ABC-045` `A4` and `ABC-046`
  `A2`/`A3`/`A6`.
- No criterion's Given changes.
- No re-target is refused, so `ADR-0037`'s R2 falsifier did not fire.

## Size: `S` → `M` (3)

`S` was priced on "two or three call sites and one test file". After the rulings, the ticket has:
- 3 production files, 2 of them new, one of them a capability holder with an 8-item gate;
- 1 new test file and 2 edited ones, including a new tree-copy harness with three safety properties
  shared with `ABC-119`, 2 `CLI_DEEP` rows and 12 mechanical edits;
- a `Done` ticket's amended Givens to deliver.

`ABC-119` (`M`) is the comparable. **Not `L`:** everything is ruled and named, and the decorator is
built. **Not splittable:** the re-targets and the lane move have to land with the wiring line, or two
lanes go red (`…ef39c9a6`).

## DoR: 10 of 10

The table is on the page. The wiring hop may proceed. **No item needs the owner's word.** The size move
is BA/PM's, and the column move is the Orchestrator's (the ticket is `In Development`).

## Owed by others (not this role's pen)

- **SE (wiring hop):** build to the page and to S3 items 2–8.
- **QE:**
  - read both `UNKNOWN - verify` costs on `N8-LANE`;
  - read `ABC-119` `A6`'s mutant against the amended lane;
  - run `CLI_DEEP`.
- **Architect/Design:** the `clause-b.mjs` fold (`AR-095-L1UNIT`).
- **Orchestrator:**
  - apply Ruling 2 by hand at routing;
  - the board row's size (`S` → `M`);
  - the stale `status:`/`column:` front matter on `ABC-095`.
