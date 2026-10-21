---
subtask: ticket-to-pr-ABC-180
role: software-engineer
tickets: [ABC-180]
branch: grugops/ABC-180 (from main @ c940da40 or the main tip at your start); worktree ../wt-ABC-180
ref: .grugops/context/ticket-to-pr-ABC-180/
width: 3 (beside two other ticket-to-pr hops in their own worktrees)
---

# SE: ABC-180: put a non-book decoy at `data/opening-book/book.json` in `A7`'s neutral cwd, and label `A7`'s stderr assertion. Closes `AR-162-FALLBACK`. ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-180` on `grugops/ABC-180` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope, test-first where the page asks for a kill: show the named wrong build is green at base and red at head, planted in scratch copies outside the repo.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md):
  - `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only.
  - Whole-suite or multi-file runs use 128, as `npm test` does.
  - Run them one at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only the files the page scopes.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-180` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-180`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-180.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row) and `.claim.md`, uncommitted on main.

## Result

**Done. A1, A3, A4, A5 and A6 are MET on the SE's readings, and A2's matrix reproduces the page's table. QE's re-plant and the Orchestrator's `AR-162-FALLBACK` close are owed.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-180` @ **`d9c3cca3`** (notes commit). The code commit is **`acb52edfff16952bc8b95779687e5e972fdbaf78`** (`acb52edf`), from `main` `ccccc6bb` (`src/` identical to `e68962d6`). Not pushed, not merged. The worktree `../wt-ABC-180` is clean. Its `node_modules` symlink is git-ignored (`.git/info/exclude:9`) and is left in place for QE.
- **Diff (`acb52edf`):** `src/cli.real-engine.test.ts` only, +35/−11. 0 production lines.
  - The decoy is the text `ABC-180 decoy: not an opening book\n`. It is written in `A7`'s existing `beforeAll` after `mkdtempSync`, at `join(neutral, BOOK_PATH)`.
  - The no-`data/` assertion is replaced, in the same `it`, by three assertions, in this order: present, does not parse as UTF-8 JSON (`TextDecoder` fatal + `JSON.parse` throws), and not equal to the delivered bytes. Parse comes before differs so that PD reds at the parse assertion.
  - The stderr assertion is labelled in both its message and the `//` line directly above it. Both name `AR-095-CWD` and `AR-162-FALLBACK`.
  - Three comments are reworded.
  - Imports added: `mkdirSync`, `writeFileSync`, `dirname`.

| criterion | result |
|---|---|
| `A1` | **MET.** The deep lane at the tip is 11/11, exit 0. `A7`'s `[CLI_DEEP] (cwd $TMPDIR/abc162-neutral-cwd-…)` is not the tree root. `A7` asserts that the decoy is present, does not parse, and differs, and the test is green. **PD** (a scratch copy with the decoy write replaced by `copyFileSync` of the delivered book) gives 10/11, red `A7` at `:497` with `the decoy parses as UTF-8 JSON: expected [Function] to throw an error`. |
| `A2` | **MET (matrix).** none: base 11/11, head 11/11. **P6f: base 11/11 green, head 10/11 red `A7`.** P6b/P6c/P6e: base 10/11 red `A7` and head 10/11 red `A7`. Every head red is at the labelled stderr assertion (`:534`), and the received stderr is `opening book is not valid UTF-8 JSON; playing on without it`. The P6f head failure output contains `AR-162-FALLBACK`. Plants ran in scratch copies outside the repo, each with a private `TMPDIR`, one at a time. **QE re-plant owed.** |
| `A3` | **MET.** Lane-made entries left under the private `TMPDIR`: 0 after every run (green, P6f at head, and all others). The only entry left was Node's own `node-compile-cache`, which the lane does not create. |
| `A4` | **MET.** `grep -c AR-162-FALLBACK` is 4 at the tip, and 0 at `e68962d6` (exit 1). One occurrence is the message argument of `expect(booked.stderr, …)` and one is the `//` line directly above `expect(`. **QE read owed.** |
| `A5` | **MET.** At the tip the command exits 1. At `e68962d6` it prints `:48`, `:443` and `:476`. |
| `A6` | **MET.** The diff is only `src/cli.real-engine.test.ts`. The waiver form is empty. `npm test` is 59 files and 1987 tests at both base and tip, with 0 skips. `CLI_DEEP` is 11 tests at base and tip. Children: 6 at base and 6 at the tip, counted as `[CLI_DEEP] (cwd` lines in the verbose run. `grep -cF` counts: `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `spawnReal(` 5, all equal to base. |

- **Kill shown first:** P6f against the base test gave 11/11 green (the gap). The same plant against the head test gave 10/11, red `A7`.
- **Gates at `acb52edf`:** lint 0; typecheck 0; build 0. `npm test` exit 0, 59 files, 1987 passed. `last-run.json` reads `success: true`, 0 failed, 0 pending, 0 todo. Skip count is 0, and skip-integrity `--skip-count 0` reports `No findings.` with exit 0. `CLI_DEEP` 11/11. `PERFT_DEEP` 32/32. Heap was 128 for multi-file runs and 400 for one-file runs, one run at a time. **No timing was taken.**
- **UAT waiver (AGENTS.md form, `.snap` not filtered):**
  - `git diff --name-only ccccc6bb d9c3cca3 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1).
  - `acb52edf~1..acb52edf` is also empty.
  - `.snap` changed: **none**.
  - So there are 0 production lines, and the waiver condition holds.
- **Notes** are in `.grugops/context/ticket-to-pr-ABC-180/notes/`, sealed by `admitAndAppend` and committed on the branch in `d9c3cca3`:
  - `20261021T090600Z-software-engineer-decision-436be2c2`: decoy bytes, assertion order, label words, base;
  - `…090610Z-software-engineer-observation-f7427087`: the plant matrix, PD and A3;
  - `…090620Z-software-engineer-observation-81c15cc4`: the gates, waiver, and A4/A5/A6 counts;
  - `…090630Z-software-engineer-observation-7828cdaf`: the branch pointer. An `artifact-ref` was refused by admission because it needs a `gate_run`, which this install cannot issue, so the pointer was recorded as an observation.

  Disclosure: a first set of the same notes carried `at` stamps of 10:10Z, ahead of the real UTC time. They were removed before any commit and republished at 09:06Z, which is still about one minute ahead of the `date -u` reading taken just before the write.
- **Owed:** the QE hop (re-plant P6f, P6b, P6c, P6e and PD; read A4). The Orchestrator records the close of `AR-162-FALLBACK`. Board and trace moves are the Orchestrator's.

**Trace row (for the Orchestrator to append):**

| ABC-180 | AR-162-FALLBACK (G-1, G-2) | grugops/ABC-180 @ acb52edf (notes d9c3cca3) | src/cli.real-engine.test.ts (decoy + 3 assertions + labelled stderr assertion + 3 comments; 0 prod lines) | P6f base 11/11 green → head 10/11 red A7; P6b/c/e red holds; PD red at parse assertion; npm test 59/1987 equal, skip 0; CLI_DEEP 11/11 | In Review: QE hop owed; UAT waiver applies |
