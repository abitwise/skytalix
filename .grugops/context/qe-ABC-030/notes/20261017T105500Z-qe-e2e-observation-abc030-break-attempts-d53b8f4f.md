---
id: 20261017T105500Z-qe-e2e-observation-abc030-break-attempts-d53b8f4f
kind: observation
by: qe-e2e
task: qe-ABC-030
at: 2026-10-17T10:55:00Z
verified_by:
confidence: high
refs:
  - ABC-030
  - QE-030-a
  - QE-030-b
  - QE-030-c
  - src/status-panel.nfr.test.ts
  - src/san.nfr.test.ts
  - src/gameend.nfr.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# ABC-030 break attempts: the whole-header integer audit and six planted live counts

## 1. Every number in the three header blocks, including number WORDS

The SE's decision note (`…3a1f0c30` § 4) lists digit forms only. QE re-read every number word too:

| site | text | refers to | form | QE reading |
|---|---|---|---|---|
| status-panel `:4-5` | *"`plans/nfr-catalog.md` has moved a bar off the clock and onto a count **three times**"* | another file (`nfr-catalog.md`) | **LIVE** (present perfect, undated; `695a2e7a`, 2026-08-11) | **not in the SE list.** Is it true today? `UNKNOWN - verify` |
| san `:17` | *"`plans/nfr-catalog.md` records that lesson **twice**"* | another file | **LIVE** (undated; `1e39511e`, 2026-08-10) | **not in the SE list.** Is it true today? `UNKNOWN - verify` |
| gameend `:7-8` | *"three separate mutations … left all 45 tests in `gameend.test.ts` green"* | sibling | DATED (*"Measured at the ABC-020 Security/NFR gate"*) | kept, as test note 2 and the re-score direct |
| gameend `:9` | `150-ply` | rule constant | — | not a count |
| gameend `:13` | *"three assertions"* | own file | — | 3 tests; holds |
| san `:4-5` | `1/5`, *"the same 42 moves"* | quote of `ABC-013` `N1`; P60 is pinned in-file (`:41`: *"42 legal moves"*) | sourced | holds |
| san `:7` | `~97%` / `~3%` | `ADR-0004`'s measurement | attributed | holds |
| san `:26` | *"four assertions"* | own file | — | 5 tests: four call-count tests and one non-vacuity check (`:76`). Own-file, so outside A4 |

The two LIVE rows are the ticket's defect shape (a live count of a quantity in another file), one layer over:
the foreign file is the catalog, not a sibling test file. They sit **outside the three repaired sentences**. The
re-score fences `gameend:8`, which lives in the same header block, so A4's "comment" reads as the justification
sentence. Under that reading A4 is MET. Under a whole-block reading these two lines, and `gameend:8`, would fail it.
→ `QE-030-a`.

`san:19`'s surviving universal (*"every one of the rows in `san.test.ts` is blind to how often `toSan`
generates"*) was checked rather than assumed. `san.test.ts` has 0 `vi.` / `spyOn` / mock hits, so the claim holds
at 22 tests.

## 2. Does the A1/A2 check "go red the moment anyone writes a live count back in"? (A4's own claim)

QE planted six live counts, one per copy of a tip file (QE scratch, not the worktree), and ran A2's regex
`all [0-9]+ tests there|the [0-9]+ rows in` against each:

| plant | text written | regex |
|---|---|---|
| P1 | status-panel: `for all 29 tests there` (the refused refresh) | **caught** |
| P2 | san: `of the 22 rows in` | **caught** |
| P3 | gameend: ``for all 45 tests in `gameend.test.ts` `` (**the form already standing at `gameend:8`**) | missed |
| P4 | status-panel: `for the 29 tests there` | missed |
| P5 | status-panel: `for all twenty-nine tests there` | missed |
| P6 | san: `of the 22 tests in` | missed |

The regex catches 2 of 6, and only the two historical phrasings. Nothing re-runs it after the gate either: a control
over comment text was refused at `ABC-028` `F4`, and this ticket's Out of scope keeps that refusal. So *"go red the
moment anyone writes a live count back in"* is true for those two phrasings only, and only when someone re-runs
the grep. The repair itself is correct by reading, so A4 is still MET. → `QE-030-b`.

A wider sweep of `src/*.ts` for `<number> tests|rows|cases|assertions (there|in \`x.test.ts\`)`, plus any
`[0-9]+ tests` in `src/*.nfr.test.ts`, finds two sites:

- `gameend:8`: dated, kept
- `glyph-mode.nfr.test.ts:50` (*"passed all 271 tests"*): attributed to `qe-abc015-review`, a past hop, so it is a
  dated witness. It belongs to `ABC-050`'s file, now Done, and is not this ticket's

No live sibling count remains in `src/`.

## 3. Record hygiene

The SE's three notes carry `at: 2026-10-17T13:40Z`–`13:50Z`. The commits are at `13:46:50+03:00`, which is
**10:46Z**, so those stamps are local time labelled `Z`. Their filenames therefore sort after this QE's true-UTC
notes. Nothing reads order from them today. → `QE-030-c` (INFO).
