---
subtask: ticket-to-pr-ABC-161b
role: software-engineer
tickets: [ABC-161]
branch: grugops/ABC-161 (holds the first hop's notes at 1f623d18; rebase it onto the current main tip, local only); worktree ../wt-ABC-161
ref: .grugops/context/ticket-to-pr-ABC-161b/
width: 1
---

# SE (second hop): ABC-161, against the re-worded page. ZERO production lines, ZERO new tests

The first hop (`ticket-to-pr-ABC-161`) stopped correctly: A1 and A3 no longer held at base. BA/PM re-worded them in `bapm-rework-ABC-161` (decision `…b0020834`, readings `…8425f6db`; DoR 10/10 at `afc8d43a`). Build to the page as it now stands.

## Read first
- The ticket page `plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md` as of `main` now: every criterion, § Scope, § Out of scope, and the exact plant strings it gives.
- BA/PM's notes above, and your first hop's notes on `grugops/ABC-161` (`…67e9ccc1`, `…b56b418c`).
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- In `../wt-ABC-161`, rebase `grugops/ABC-161` onto the current `main` (local operation; never push). A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Show each gap first on the base test, then on head, exactly as the page's A1–A3 now state (A1: P11-L1/L2/L3 green → red, 3 of 3; P11 and P11-L4 red on both. A2: S2c. A3: P9a–P9e green → red, 5 of 5; the real `AGENTS.md` green on head). Plants in scratch copies outside the repo with a private `TMPDIR`, including the `AGENTS.md` plants. `git status --porcelain` is empty afterwards.
- Implement exactly the page's three edits, inside the three existing `it` blocks of `src/cli.test.ts`.
- Prove each criterion, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (59 files / 1987 at base; must stay equal);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md): `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only; whole-suite or multi-file runs use 128, as `npm test` does. One run at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only `src/cli.test.ts`. `AGENTS.md` and every production file are read-only.
- Never touch `plans/board.md`, `plans/traceability.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-161` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-161b`. **Pass the worktree as the context root explicitly** (the writer's default root is the plugin's own directory, where a note must never land). Take every `at` from `date -u` (UTC).
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-161b.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**Tip `5e755bcb`** on `grugops/ABC-161` (local, not pushed), rebased onto `main` `35788fd4`. Commits: `dc1fbc93` (first hop's notes, rebased), `ee1818bb` (the three edits, `src/cli.test.ts` only, +23/-5), `5e755bcb` (this hop's notes). Verdict: **A1-A4 MET; ready for In Review / QE.**

**Edits** (decision `…decision-7c491426`): fix 1 `call < 3` at seed 7 (non-vacuity block untouched); fix 2 `"3\n"` in `refusedValues`; fix 3 per-option `|`-joined list read from the slot, set-equal to the value words the resolver accepts after that option (derived from `ACCEPTED_ARGUMENTS`), plus a union check that every value word is listed.

**Per criterion** (readings `…observation-d1eb80ac`; whole default lane, heap 128, scratch copies outside the repo, private `TMPDIR`):
- **A1 MET.** P11-L1/L2/L3: base 1987/1987 green → head red at `A8′` equivalence, "level 1/2/3, call 2", 3 of 3. P11 and P11-L4 red on both (base "level 4, call 1"; head P11 "level 1, call 2", P11-L4 "level 4, call 1"). Seam green on head; non-vacuity kept, green.
- **A2 MET.** S2c base green → head red at `ABC-101` `A3`, `--difficulty "3\n"`. Delivered build refuses it with `offending: ["3\n"]` (row green).
- **A3 MET.** P9a-P9e base green → head red at `ABC-065` `A3`, 5 of 5. Real `AGENTS.md` green.
- **A4 MET.** Outside `.grugops/context/`, `git diff --name-only 35788fd4 5e755bcb` is exactly `src/cli.test.ts`; every hunk is inside the three named `it` blocks. Counts equal base: 59 / 1987, 0 skipped.
- `git status --porcelain` empty in main and worktree after the plants; no scratch copy left.

**Gates on the tip** (observation `…f3e16d62`): lint exit 0; typecheck exit 0; build exit 0; `npm test` exit 0, 59 files / 1987 passed, `.test-results/last-run.json` `success: true`, 0 failed/pending/todo; skip-integrity "No findings." exit 0; `CLI_DEEP` 11/11; `PERFT_DEEP` 32/32. No timing taken.

**UAT waiver:** `git diff --name-only 35788fd4 5e755bcb | grep -v '\.test\.ts$' | grep '^src/'` → empty (grep exit 1). `.snap` changes: none.

**Notes** (task `ticket-to-pr-ABC-161b`, on the branch): `…decision-7c491426`, `…observation-d1eb80ac` (readings), `…observation-f3e16d62` (gates), `…observation-f93d22f3` (artifact; the writer refused `artifact-ref` without a §14 `gate_run` id, so it is an observation).

**Not touched:** `plans/board.md`, `plans/traceability.md`, production files, `AGENTS.md`. The worktree's `node_modules` symlink stays; it is ignored via `.git/info/exclude`.

**Trace row:**
| ABC-161 | grugops/ABC-161 @ 5e755bcb (code ee1818bb) | src/cli.test.ts: ABC-065 A3, ABC-101 A3, ABC-101 A8′ sharpened; 0 tests added | A1-A4 met: 11 plants base vs head; 59/1987 green, 0 skips; CLI_DEEP, PERFT_DEEP green | UAT waiver measured empty; QE owed |
