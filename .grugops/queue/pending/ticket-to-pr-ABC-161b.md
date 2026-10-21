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
