---
subtask: ticket-to-pr-ABC-183
role: software-engineer
tickets: [ABC-183]
branch: grugops/ABC-183 (from main @ the main tip at your start); worktree ../wt-ABC-183
ref: .grugops/context/ticket-to-pr-ABC-183/
width: 3 (beside two other ticket-to-pr hops in their own worktrees; disjoint files)
---

# SE: ABC-183: capture the decoy's existence on the line before the `booked` spawn and assert it in `A7`, labelled `AR-162-FALLBACK`. Closes `AR-180-VALIDATED` part (ii). ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md`: every criterion, its § Scope and § Out of scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-183` on `grugops/ABC-183` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope. Where the page asks for a kill or a red, show it first: base green / head red (or the harness red on the named wrong copy), planted in scratch copies outside the repo with a private `TMPDIR`.
- `A4`: run the plant table yourself (none, P6f, TMO + P6f, TMO) against the base test and the head test. P6f's body is QE `…567002e7` (`ABC-162`). The TMO + P6f row (base green, head red at the new assertion, `AR-162-FALLBACK` in the failure output) is the close row; QE re-plants it independently.
- `A5`: report every `grep -c` count the page names, base and head.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 tests at base);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
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
- Commit on `grugops/ABC-183` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-183`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-183.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-183 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**Done. A1, A2, A3 and A5 are MET on the SE's readings, and A4's four-row matrix reproduces the page's table in all eight cells. The QE re-plant and the Orchestrator's `AR-180-VALIDATED` close are still owed.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-183` @ **`c4c6d36e`** (notes commit). The code commit is **`7bd2b54fe4d316e2e77f6a385a5b0be8c4b8dd4d`** (`7bd2b54f`), from `main` `19abbdb1`. `src/` there is identical to `59fc9215` (`git diff --stat 59fc9215 19abbdb1 -- src` is empty). Not pushed, not merged. The worktree `../wt-ABC-183` is clean. Its `node_modules` symlink is git-ignored (`.git/info/exclude:9`) and is left in place for QE.
- **Diff (`7bd2b54f`):** `src/cli.real-engine.test.ts` only, +11/−0 in 4 hunks. 0 production lines.
  - `let decoyBeforeBooked: boolean;` with a doc comment, in the `ABC-095` `describe` block.
  - A `//` line under the `ABC-180` comment: ``// `ABC-183`: this write MUST come before the `booked` spawn, or a cwd-first read finds nothing.``
  - `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` directly before `booked = spawnReal(`.
  - In `A7`'s `it`: `expect(decoyBeforeBooked, "AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed").toBe(true)`.
- **Notes (sealed, on the branch):** `.grugops/context/ticket-to-pr-ABC-183/notes/` contains `…decision-c7e6106e`, `…observation-4e3e31eb` (A4 matrix), `…observation-3064660f` (counts and gates) and `…observation-90cab7c4` (branch and diff). The branch note is an observation, not an artifact-ref, because the writer requires `gate_run` for an artifact-ref and this hop has no §14-gate run id.

| criterion | result |
|---|---|
| `A1` | **MET.** The first line of `grep -B1 -F 'booked = spawnReal('` is `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));`. At base it was `bookless = spawnReal(copy, QUIT_TWICE);`. |
| `A2` | **MET (SE reading; QE read owed).** `A7`'s `it` has one `expect(decoyBeforeBooked, "AR-162-FALLBACK: …").toBe(true)`. `grep -c 'AR-162-FALLBACK'` is 4 at base and **6** at head. |
| `A3` | **MET (SE reading; QE read owed).** The `ABC-183` `//` line is the second line above `writeFileSync(join(neutral, BOOK_PATH), …)`. |
| `A4` | **MET (matrix; QE re-plant owed).** none: base 11/11, head 11/11. P6f: base 10/11 and head 10/11, both red `A7` at the stderr detector (`expected 'opening book is not valid UTF-8 JSON;…' to be ''`). **TMO + P6f: base 11/11 green, head 10/11 red `A7` at the new assertion** (`AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed: expected false to be true`, `:503`). TMO alone: base 11/11, head 10/11 red at the same assertion. The TMO + P6f head output contains `AR-162-FALLBACK`. Each cell ran in its own `git archive 19abbdb1` scratch copy outside the repo, with a private `TMPDIR`, one run at a time. P6f is the delivered file with QE `…567002e7`'s body (try the cwd read, catch and fall back to the module URL), sha256 `afeab577…f71e`. That is body-equivalent to QE's file but **not byte-identical** to QE's `e4947664…1d6`, because QE's file is not in shared context. |
| `A5` | **MET.** `git diff --name-only 19abbdb1 7bd2b54f` lists only `src/cli.real-engine.test.ts`. The waiver form is empty both for `7bd2b54f~1 7bd2b54f` and for `19abbdb1 c4c6d36e` (exit 1). `npm test` gives 59 files and 1987 tests at both base (scratch copy) and tip, with 0 skips. `CLI_DEEP` runs 11 tests at base and 11 at head. Children: 6 at base and 6 at head, counted as `[CLI_DEEP] (cwd` lines under `--reporter=verbose`; the default reporter hides the stdout of passing tests and prints 0. `grep -cF` from base to head: `spawnReal(` 5→5, `mkdtempSync(` 2→2, `removeCopy(` 3→3, `rmSync(` 1→1, `writeFileSync(` 1→1, `existsSync(` 5→6. `^\s*it\(` 11→11. No hunk starts above base line 452, so nothing above `:440` moved. |

- **Gap shown first:** TMO + P6f against the base test is 11/11 green. Against the head test it is 10/11, red at the new assertion.
- **Gates at `7bd2b54f` (the notes commit adds only `.grugops/context/`):** lint 0 (biome, 116 files); typecheck 0; build 0. `npm test` exits 0 with 59 files and 1987 passed. `last-run.json` reads `success: true`, with 0 failed, 0 pending and 0 todo. Skip-integrity `--skip-count 0` reports `No findings.` and exits 0. `CLI_DEEP` 11/11. `PERFT_DEEP` 32/32. Heap was 128 for multi-file runs and 400 for one-file runs, one run at a time. **No timing was taken.**
- **UAT waiver (AGENTS.md form, `.snap` not filtered):** `git diff --name-only 19abbdb1 c4c6d36e | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. `.snap` changes: **none**. The waiver condition holds.
- **Trace row:**

| ABC-183 | `A7` pins the decoy write before the `booked` spawn (`AR-180-VALIDATED` part (ii)) | `grugops/ABC-183` @ `c4c6d36e` (code `7bd2b54f`) | `src/cli.real-engine.test.ts` (+11/−0; 0 production lines) | `A7` + capture/assert `decoyBeforeBooked` (`AR-162-FALLBACK`); TMO+P6f base 11/11 → head 10/11; 0 new tests | In Development → In Review (SE done; QE re-plant owed; UAT waiver expected) |
