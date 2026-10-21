---
subtask: ticket-to-pr-ABC-184
role: software-engineer
tickets: [ABC-184]
branch: grugops/ABC-184 (from main @ the main tip at your start); worktree ../wt-ABC-184
ref: .grugops/context/ticket-to-pr-ABC-184/
width: 2 (beside bapm-rescope-ABC-165, records only; disjoint files)
---

# SE: ABC-184: `RealChild` records the cwd it spawned with, and A7 asserts `booked.cwd` is `neutral`, labelled `AR-183-CWDARG`. Closes AR-183-CWDARG on QE's read. ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md`: every criterion, § Scope and § Out of scope.
- The notes it cites (BA/PM `…f5fcdaf5`; Security/NFR `…41f70925`, `…d5fd47e1`; QE `…cbd50a13`, `…be7c2c82`).
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-184` on `grugops/ABC-184` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Run the page's plant table yourself, base test vs head test, in scratch copies outside the repo with a private `TMPDIR`: none, P6f, **TCWD + P6f** (the close row: green on base, red on head at the new assertion, `AR-183-CWDARG` in the failure output), TCWD alone, TMO + P6f. P6f's body is QE `…567002e7` (`ABC-162`). Record each plant's sha256.
- The page marks two readings `UNKNOWN - verify`: TCWD alone on the base test, and whether the change typechecks. Measure both and report them.
- Implement exactly the page's scope, then prove each criterion (including every grep count A1, A2 and A5 name, base and head).
- Run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (59 / 1987 at base; must stay equal);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` (11 tests, 6 children) and `PERFT_DEEP`.
- Heap rule (AGENTS.md): `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only; whole-suite or multi-file runs use 128, as `npm test` does. One run at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only `src/cli.real-engine.test.ts`. `src/book-file.ts` and every production file are read-only.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-184` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-184`. **Pass your worktree as the context root explicitly** (the writer's default root is the plugin's own directory). Take every `at` from `date -u` (UTC).
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-184.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-184 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**Tip `c6f80c81`** on `grugops/ABC-184` (local, not pushed), from `main` `5277babd`. Commits: `442d1e57` (the three edits, `src/cli.real-engine.test.ts` only, +7/−0) and `c6f80c81` (notes). Verdict: **A1–A5 MET; ready for In Review / QE.**

**Edit** (decision `…decision-1027e5a6`):
- `RealChild` gains `readonly cwd: string` (`:231`).
- `spawnNode` returns `cwd` (`:268`), the same identifier as the `spawnSync` option (`:247`).
- A7 has `expect(booked.cwd, "AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed").toBe(neutral)` at `:501-504`. It sits directly under the kept "A7's working directory" line and above the stderr detector (`:549`).

**Per criterion** (readings `…observation-48b1a153` for the plants, `…observation-d4a0b821` for the criteria and gates):
- **A1 MET.**
  - `readonly cwd: string;` count 0 → 1, inside `RealChild`.
  - The record and the option use the same identifier.
- **A2 MET.**
  - One `booked.cwd` expect, labelled, ending `.toBe(neutral)`, above the detector.
  - `AR-183-CWDARG` count 0 → 1; `booked.cwd` count 0 → 1.
- **A3 MET.** Scratch `git archive` copies outside the repo, private `TMPDIR`, one cell at a time:
  - none: base 11/11, head 11/11.
  - P6f: base 10/11 and head 10/11, both red A7 at the stderr detector.
  - **TCWD + P6f: base 11/11 green → head 10/11, red A7 at `booked.cwd`.** `AR-183-CWDARG` is in the failure output.
  - TCWD alone: base **11/11 green** (the page's `UNKNOWN - verify`, now measured) → head red at `booked.cwd`.
  - TMO + P6f: base and head both red A7 at `AR-162-FALLBACK`.
  - sha256:
    - test files: base `8a84dfa3`, head `a4dbb308`; TCWD base `008c4e79` (= QE's and Security/NFR's), TCWD head `be86a15f`; TMO base `c9ff8261`, TMO head `379a451f`.
    - `book-file.ts`: P6f `c9e8032d`, delivered `890784c9`.
- **A4 MET.** The `grep -B1 -F 'booked = spawnReal('` first line is `decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));` at base and at head.
- **A5 MET.**
  - Outside `.grugops/context/`, the diff vs base is exactly `src/cli.real-engine.test.ts`.
  - Counts equal base: `spawnReal(` 5, `spawnNode(` 2, `mkdtempSync(` 2, `removeCopy(` 3, `rmSync(` 1, `writeFileSync(` 1, `existsSync(` 6, `it(` 11. `expect(` goes 75 → 76.
  - The first hunk is `@@ -229,0`, so nothing above `:223` moved.
  - `npm test` equals base: 59 / 1987 at base (re-read in a scratch tree byte-identical to `main`) and at head, 0 skipped.
  - `CLI_DEEP` runs 11 tests and 6 children at base and at head.

**Gates on the tip** (code `442d1e57`; the tip adds notes only):
- lint rc 0;
- **typecheck rc 0** (the page's `UNKNOWN - verify`, now measured);
- build rc 0;
- `npm test` rc 0: 59 / 1987, `last-run.json` success true, 0 failed, 0 pending, 0 todo;
- skip-integrity `--skip-count 0`: "No findings.", rc 0;
- `CLI_DEEP` 11/11 (6 children);
- `PERFT_DEEP` 32/32.

No timing was taken.

**Note on counting children:** under `CLAUDECODE=1`, vitest's default run prints no `[CLI_DEEP]` console lines. I counted children with `--silent=false --reporter=default`.

**UAT waiver:**
- `git diff --name-only 5277babd c6f80c81 | grep -v '\.test\.ts$' | grep '^src/'` → empty (rc 1).
- `c6f80c81~1..c6f80c81` is also empty.
- `.snap` changes: none.

**Notes** (task `ticket-to-pr-ABC-184`, on the branch):
- `…decision-1027e5a6`;
- `…observation-48b1a153` (plant matrix);
- `…observation-d4a0b821` (criteria and gates);
- `…observation-61c53dcf` (artifact). The writer refused `artifact-ref` without a §14 `gate_run`, so it is an observation.

**Not touched:**
- `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, and every production file.
- `git status --porcelain` is empty in the worktree.
- The worktree's `node_modules` symlink stays; it is ignored through `.git/info/exclude`.

**Trace row:**
| ABC-184 | grugops/ABC-184 @ c6f80c81 (code 442d1e57) | src/cli.real-engine.test.ts: RealChild.cwd recorded; A7 asserts booked.cwd === neutral (AR-183-CWDARG); 0 tests added, +1 expect | A1-A5 met: TCWD+P6f base 11/11 → head red at AR-183-CWDARG; 10 cells as table; 59/1987 green, 0 skips; CLI_DEEP 11/6, PERFT_DEEP green; typecheck green | UAT waiver measured empty; QE owed (re-plant TCWD, P6f, TMO); closes AR-183-CWDARG on QE's read |
