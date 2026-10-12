---
id: 20261012T110000Z-agents-md-scribe-observation-pointer-command-row-and-count-after-abc105-912554da
kind: observation
by: agents-md-scribe
at: 2026-10-12T11:00:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - ABC-153
  - AGENTS.md
  - memory-bank/40-contributing.md
  - memory-bank/90-agents-md-command-log.md
  - .grugops/context/ticket-to-pr-ABC-105/
supersedes:
---

# `AGENTS.md` after `ABC-105` and `ABC-153`: a pointer, a command row, the test count, 279 B tightened first

Hand-authored and unsealed. `AGENTS.md` records that no sanctioned writer exists on this install and
`context.human_admission` is `off`; this note is not a `finding`.

## What changed in `AGENTS.md`

- **Pointer (item 1, `A7`).** One line under `## QE validation authority`: "QE-hop record convention and ceiling:
  `memory-bank/40-contributing.md` § Conventions." (+88 B incl. blank line).
- **Command row (item 3).** Under `### Test integrity`: `node tools/grugops/qe-hop-integrity.js --ticket ABC-xxx` |
  `--sweep`, exit 0 clean / 1 finding / 2 cannot run, `--json`, Orchestrator runs `--ticket` at every move to `Done`
  (+215 B incl. blank line). Added because the bytes allowed it after item 1.
- **Test count (item 2).** `Test (all)` "56 files, 1743 tests" -> "57 files, 1775 tests", read here at `main`
  `6ae6dd27` by `npm test` (exit 0, 57 passed files, 1775 passed tests, `.test-results/last-run.json` success true).
  Counts only, no timing taken.
- **Tightened first (279 B freed), no reading lost.** Each old -> new is quoted with its measured bytes in the
  command log's `scribe-ABC-105-2026-10-12` pass table: the "All work starts with the Orchestrator" paragraph folded
  into step 2 (-57); the Coverage "was 856/856 on 30 files" moved to its command-log entry (-25); three
  "this is a pointer" phrases cut (-31, -24, -19) and the Safety bullet shortened (-36); both "Kit override N of 3"
  parentheses shortened to "(count: `## QE validation authority`)" (-38, -49; the "reader who counts four" line
  itself is untouched in `## QE validation authority`).
- **Size:** 24,545 B -> **24,569 B** (+24 B; budget 24,576 B, `ABC-109`; headroom 31 -> 7 B).

## Checked, not changed

- Item 4: the test-integrity row already states the full form `node tools/grugops/test-skip-integrity.js
  .grugops/test-skips.md --skip-count <N>`; the bare form is not written anywhere in `AGENTS.md`. No edit.
- Item 5: `memory-bank/40-contributing.md` § Conventions did NOT say when the check runs. One sentence added: the
  Orchestrator runs it at every move to `Done`, with the exit codes. The instance (the Orchestrator running it for
  `ABC-105` at `f6400877`) is the dispatch brief's account; its output is not in the tree, so the paragraph states
  the practice, not that run's output.

## Readings (item 3, `--sweep` at `main` `6ae6dd27`)

`--sweep` exit 1: Done rows **133**, pre-cutover 38, covered (qe-e2e) **78**, covered (substitute) 2, findings 15,
malformed 0. The brief expected 132/38/77/2/15. The difference is `ABC-105` itself: the build-tip reading (132) was
taken while it sat in `In Review`; `c1841b36` moved it to `Done` (+1 Done, +1 covered). `ABC-153` was already
`Done` at the build tip. Findings unchanged at 15. `--ticket ABC-105` exit 0, `--ticket ABC-038` exit 1,
`--ticket ABC-999` exit 1, no argument exit 2.

## Owed

- Headroom is **7 B**. The next Scribe edit must tighten or move receipts to the command log first.
- The `--sweep` still reports 15 `Done` rows with no QE verdict note (`ABC-038` .. `ABC-150`); not this hop's, and
  not caused by `ABC-105`. The owner decides whether any is back-filled or waived.
