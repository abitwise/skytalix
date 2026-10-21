---
subtask: ticket-to-pr-ABC-161
role: software-engineer
tickets: [ABC-161]
branch: grugops/ABC-161 (from main @ the main tip at your start); worktree ../wt-ABC-161
ref: .grugops/context/ticket-to-pr-ABC-161/
width: 2 (beside bapm-cut-AR-183-CWDARG, records only)
---

# SE: ABC-161: sharpen three existing rows in `src/cli.test.ts` until P11, S2c and P9a/b/c/e go red. ZERO production lines, ZERO new tests

## Read first
- The ticket page `plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md`: every criterion, § Scope and § Out of scope.
- The notes it cites (`qe-ABC-101`, `secnfr-ABC-101`, `bapm-cut-followups` readings `…85e8dfdd` for the plant bodies).
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Stale pointers on the page
- The page was cut at `1671f24f` (1810 tests). Its line numbers (`:3665`, `:3592`, `:2262`) and counts ("1810 of 1810", "78 of 78") are from then; `main` has 1987 tests now. Find the three rows by name (`A8′` equivalence, `A3` refused values, `ABC-065` `A3` value check) and record their lines at your base. The criteria are relative (base vs head) and stand as written.
- Its Dependencies line still says `ABC-096` is In Development; ABC-096 is merged (`b20eb451`), so any current `main` satisfies it.

## Do
- Create the worktree `../wt-ABC-161` on `grugops/ABC-161` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Show each gap first on the base test, then on head: P11, S2c, P9a, P9b, P9c, P9e green → red; P9d red on both. Plants in scratch copies outside the repo with a private `TMPDIR`, including the `AGENTS.md` plants. `git status --porcelain` is empty afterwards.
- Implement exactly the page's three edits, inside the three existing `it` blocks. Fix 3 compares each documented value list set-equal to the accepted values from `src/cli-options.ts` (read-only) or derived from `ACCEPTED_ARGUMENTS`.
- Prove each criterion, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 at base; must stay equal);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md): `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only; whole-suite or multi-file runs use 128, as `npm test` does. The page's "whole default `npx vitest run`" lane is a multi-file run: use 128. One run at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only `src/cli.test.ts`. `AGENTS.md` and every production file are read-only.
- Never touch `plans/board.md`, `plans/traceability.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-161` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-161`. Take every `at` from `date -u` (UTC); never local time.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-161.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**STOPPED before any code edit. A1 and A3 cannot be met as written at base `69610c5b`: P11 is already RED on base, and P9d is GREEN on base. Both come from merges after the page was cut. The brief says to stop and report in this case, so `src/cli.test.ts` is untouched. BA/PM needs to re-word A1 and A3 before this can be re-dispatched.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-161` @ **`1f623d18`** (notes only), from `main` `69610c5b`. Not pushed, not merged. The worktree `../wt-ABC-161` is clean. Its `node_modules` symlink is git-ignored (`.git/info/exclude:9`) and is left in place for the re-dispatch.
- **Rows at base, found by name in `src/cli.test.ts`:** `ABC-065` `A3` value check `:2284` (the `toContain(value)` loop is `:2312-2314`); `ABC-101` `A3` refused values `:4049` (`refusedValues` is `:4056`); `ABC-101` `A8′` equivalence `:4116` (`call < 2` is `:4129`).
- **Notes (sealed, on the branch):** `.grugops/context/ticket-to-pr-ABC-161/notes/`:
  - `…observation-b56b418c`: the base readings. It supersedes `…observation-1ef80c09`, which had wrong row line numbers.
  - `…decision-67e9ccc1`: the stop.
  - `…observation-82d08f42`: branch and commands. It is an observation because the writer refuses an artifact-ref without a `gate_run`.

**Base plant readings.** Whole default lane, `NODE_OPTIONS=--max-old-space-size=128 npx vitest run`. Each run used its own `git archive 69610c5b` scratch copy outside the repo with a private `TMPDIR`, one run at a time, and no timing was taken. Scratch copies left afterwards: 0. `git status --porcelain` in the worktree is empty.

| plant | base (59 files / 1987 tests) | page expects | criterion |
|---|---|---|---|
| unplanted | 1987/1987, 0 skipped | — | — |
| P11 (`createLevel` per call) | **1 failed**: `A8′` equivalence, "level 4, call 1" | green | **A1 NOT MEETABLE as written** |
| S2c (`/^[1-5]$/m`) | 1987/1987 green | green | holds |
| P9a / P9b / P9c / P9e | 1987/1987 green each | green | holds |
| P9d (`1\|2\|3\|5`) | **1987/1987 green** | red | **A3 "P9d red on both" NOT MEETABLE** |

- **Cause, P11:** `ABC-174` (`be6a5599`, ADR-0045) re-cut `LEVELS`, and level 4 is now `blunderRate: 0.05`. At seed 7 the first two draws are 0.0117 and 0.0620, so level 4 plays blunder then engine. A rebuilt generator blunders twice. The existing row therefore already reds P11, but only at level 4. Levels 1-3 still decide the same on both calls. Fix 1 would still harden levels 1-3, but QE-101-a's "nothing catches it" is no longer true. BA/PM decides whether to keep fix 1.
- **Cause, P9d:** `f6b63c1c` added "ADR-0045" to the slot. Every digit from 1 to 5 now occurs at least twice in the slot, so no level word is load-bearing. QE-101-b is wider than recorded: 5 of 5 plants are blind, not 4 of 5. Fix 3 would still red P9d on head. Only the "red on base" half fails.
- **Re-cut needed (BA/PM):** A1 needs a new statement, either "P11 red on both, and red at a level ≤ 3 on head" or fix 1 dropped. A3 needs "P9d green on base, red on head" (5 of 5). A2 is unaffected.
- **Gates:** not run on the tip, because nothing outside `.grugops/context/` changed. Lint, typecheck, build, `npm test`, skip-integrity, `CLI_DEEP` and `PERFT_DEEP` are all `UNKNOWN - verify` for this tip. For reference, the unplanted base copy ran 59 files / 1987 tests, all green, with 0 pending/todo.
- **UAT waiver (AGENTS.md form, `.snap` not filtered):** `git diff --name-only 69610c5b 1f623d18 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1). `.snap` changes: none. This is moot, because no ticket work was delivered.
- **Trace row:**

| ABC-161 | three `src/cli.test.ts` rows (`A8′`, `A3` refused values, `ABC-065` `A3`) | `grugops/ABC-161` @ `1f623d18` (notes only) | none (0 lines; `src/cli.test.ts` untouched) | none; base readings: P11 red on base (level 4), P9d green on base | In Development (SE STOPPED: A1/A3 not meetable as written at `69610c5b`; BA/PM re-word owed) |
