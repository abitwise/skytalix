---
subtask: ticket-to-pr-ABC-179
role: software-engineer
tickets: [ABC-179]
branch: grugops/ABC-179 (from main @ c940da40 or the main tip at your start); worktree ../wt-ABC-179
ref: .grugops/context/ticket-to-pr-ABC-179/
width: 3 (beside two other ticket-to-pr hops in their own worktrees)
---

# SE: ABC-179: make three test comments say only what their source says. Comment lines only, four files

## Read first
- The ticket page `plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-179` on `grugops/ABC-179` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
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
- Commit on `grugops/ABC-179` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-179`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-179.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row) and `.claim.md`, uncommitted on main.

## Result

**Done. A1, A3's grep and A4 are MET on the SE's readings. A2's QE read and A3's QE confirmation are owed to QE.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-179` @ **`a7d64e07`** (notes commit), code commit **`dd131b719e4768d92e2ccbaf613ab4517eaed58c`** (`dd131b71`), from `main` `ccccc6bb`. Not pushed, not merged. Worktree `../wt-ABC-179` is clean. Its `node_modules` symlink is git-ignored (`.git/info/exclude:9`) and left in place for QE.
- **Diff (`dd131b71`):** comment lines only, in four files: `src/san.nfr.test.ts` 2/2, `src/status-panel.nfr.test.ts` 3/3, `src/history-pane.nfr.test.ts` 3/3, `src/cli.test.ts` 3/3 (net 0).
  - san: "… green: the bars there were held by nothing in the repo, so the in-suite guard is a count."
  - status-panel and history-pane: "… because a timing bar with {an order of magnitude | a factor of two} of headroom cannot fail …, so the bar moves off the clock and onto a count (see `plans/nfr-catalog.md` for that move)."
  - cli A12: "The merged equality `expect(runtimeImporters).toEqual(…)` in `src/history-pane.nfr.test.ts` is what actually holds this; …"

| criterion | result |
|---|---|
| `A1` | **MET.** At base the page command prints the san sentence. At head it prints nothing. |
| `A2` | **Command MET.** At base it prints the status-panel and history-pane sentences. At head it prints nothing. **QE read owed.** None of the three catalog-naming sentences has a quoted span. san's attribution is `nfr-catalog.md:555-556` ("held by nothing in the repo"). The "see" pointer's move is at `:25` and `:49`. |
| `A3` | **grep MET.** At base it prints `src/cli.test.ts:1831` and exits 0. At head it exits 1. `grep -F 'expect(runtimeImporters).toEqual('` in history-pane reaches `:390` (the equality) and `:511` (the R5 pin). **QE confirmation owed.** |
| `A4` | **MET.** Numstat lists exactly the 4 files. Every changed line is in a header `/** */` block (closing at `:28`, `:13` and `:22`) or is a `//` line inside `A12` (`:1830-1843`). `cli.test.ts` is 3/3. The per-file counts (page command, heap 128, the same worktree) are byte-identical at base and head: 59 files, `cmp` 0. Skips 0. |

- **Kill:** the page names no wrong build. Its kills are the A1, A2 and A3 readings, which are red at base and silent at head. The retired forms were also planted in scratch copies of the head files, outside the repo, and all three checks bit.
- **Gates at `dd131b71`:** lint 0; typecheck 0; build 0. `npm test` exit 0, 59 files, 1987 passed; `last-run.json` `success: true`, 0 failed, 0 pending, 0 todo. Skip count 0; skip-integrity `--skip-count 0` reports `No findings.`, exit 0. `CLI_DEEP` 11/11. `PERFT_DEEP` 32/32. Run one at a time with heap 128 (multi-file) or 400 (one-file). **No timing was taken.**
- **UAT waiver (AGENTS.md form, `.snap` not filtered):**
  - `git diff --name-only dd131b71~1 dd131b71 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1).
  - `ccccc6bb..a7d64e07` is also empty.
  - `.snap` changed: **none**.
  - So 0 production lines, and the waiver condition holds.
- **Notes** (`.grugops/context/ticket-to-pr-ABC-179/notes/`, sealed by `admitAndAppend`, committed on the branch in `a7d64e07`):
  - `20261021T090140Z-software-engineer-decision-9ac129cf`: the wording decisions;
  - `…090141Z-software-engineer-observation-0a18c392`: the diff and files;
  - `…090142Z-software-engineer-observation-605950a6`: the gates;
  - `…090143Z-software-engineer-observation-e299c4fd`: the acceptance readings, plants and waiver.

  Disclosure: the `at` stamps came from a `date -u` call about one minute before the write.
- **Owed:** the QE hop (A2 read, A3 confirmation). Board and trace moves are the Orchestrator's.

**Trace row (for the Orchestrator to append):**

| ABC-179 | QE-159-a, QE-159-d, QE-159-e | grugops/ABC-179 @ dd131b71 (notes a7d64e07) | src/san.nfr.test.ts, src/status-panel.nfr.test.ts, src/history-pane.nfr.test.ts, src/cli.test.ts (comment lines only; 0 prod lines) | A1/A2/A3 red at base, silent at head; per-file counts identical 59/1987; skip 0 | In Review: QE hop owed; UAT waiver applies |
