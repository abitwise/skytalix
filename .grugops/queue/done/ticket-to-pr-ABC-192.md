---
subtask: ticket-to-pr-ABC-192
role: software-engineer
tickets: [ABC-192]
branch: grugops/ABC-192 (from main @ the main tip at your start); worktree ../wt-ABC-192
ref: .grugops/context/ticket-to-pr-ABC-192/
width: 3 (beside arch-build-ABC-193 and scribe-waiver-quotepath; disjoint files)
---

# SE: ABC-192 — a parser-read row pins that `setup` hands the guard `process.stdout` (QE-176-a), and a row pins the installed vitest at 4.1.11 with the re-run list as its message (QE-176-b). `src/cli.test.ts` only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-192-nothing-pins-the-stream-setup-hands-the-guard-and-a-vitest-bump-re-runs-no-capture-arm.md`: every criterion, § Scope, § Out of scope, § Test notes.
- BA/PM notes in `.grugops/context/bapm-rule-QE-176/notes/` (`…73efba41` rulings, `…af4186af` readings, `…ef39afc9` the failed in-process route — do not retry it); QE `qe-ABC-176` notes (`…fbdf5a60` mutants, `…c9b3023e` ordering); `tools/grugops/heap-guard.js`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-192` on `grugops/ABC-192` from the current `main`. A `node_modules` symlink is fine.
- Red first, on scratch copies outside the repository: the page's mutants (M4 `process.stderr`, M4b `{ write() {} }`, a version bump) turn the new rows red; base passes.
- Implement exactly the page's Scope. No new spawned child (`N8_SPAWN` stays 28).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 files, 1992 + your new rows); skip-count capture as spelled in `AGENTS.md` → its integer into `test-skip-integrity.js --skip-count`. One-file vitest runs `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128. No timing.
- UAT waiver in the owner's new form (`…717a2219`): `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-191-GITENV stand-in, in your shell and worktree: `git config --get-regexp '^(color\.(ui|diff)|diff\.(external|srcprefix|dstprefix)|diff\..+\.command)$' | grep -v -E '^color\.(ui|diff) (auto|true|false|never)$'; printenv GIT_EXTERNAL_DIFF` must print nothing.

## Fences
- Only `src/cli.test.ts`. Never `tools/`, `package*.json`, `AGENTS.md`, `plans/`, `memory-bank/`, git config, other worktrees. Commit on `grugops/ABC-192` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `ticket-to-pr-ABC-192`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

**Implemented; no stop.** Software Engineer, 2026-10-21T17:42:12Z. Branch `grugops/ABC-192`, worktree `../wt-ABC-192`, base `47a3c9a1`, code `5d1fbaa7`, tip `b5b8b0f9` (the notes). Not pushed, not merged, no `--force`, no git config set.

- **A1 (QE-176-a):** a parser-view row (`guardStreamFaultOf`) finds 1 default-exported `setup`, 1 `guard(…)` call, third argument `process.stdout`: no fault on `heap-guard.js`. Planted in memory: real call / `process.stderr` / `{ write() {} }` / commented-out call (0 calls) / two calls → `[false, true, true, true, true]` faults.
- **A2 (QE-176-b):** reads `node_modules/vitest/package.json` (4.1.11) against the literal `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"`, with a comment saying when to change it. The failure message is the page's four-item re-run list.
- **Red first** (scratch copies outside the repo, private TMPDIR, each file restored and `cmp`-checked). One-file `-t "ABC-192"` at 400: control 2 passed; M4 → A1 red; M4b → A1 red; vitest 4.1.12 → A2 red, with the list as its message. `npm test` on `git archive 5d1fbaa7` + a full copy of node_modules: control 59/1994 green; M4, M4b and the bump each give exactly 1 failed / 1993 passed, `success` false, and the only failing row is the new one.
- **A3:** `N8_SPAWN` still `17 + 7 + 1 + 2 + 1` (28). The diff adds 0 child_process calls. C2 is green. No timing.
- **A4 / gates (tip):** `git diff --name-only main...HEAD` → `src/cli.test.ts` plus this hop's three notes. lint, typecheck and build exit 0. `npm test` exit 0, 59 files, 1994 passed (1992 + 2), 0 failed, `last-run.json` `success` true. Skip count `0` → `test-skip-integrity.js --skip-count 0` `No findings.`, exit 0. AGENTS.md byte-identical base..tip (15,797 B).
- **Waiver:** `git -c core.quotePath=false diff --name-only 47a3c9a1 b5b8b0f9 | grep -v '\.test\.ts$' | grep '^src/'` printed nothing. Zero production lines; UAT waived (not a signature). **AR-191-GITENV stand-in** (worktree and main checkout): printed nothing.
- **Main moved during the hop** to `4f81850c` (scribe-waiver-quotepath; AGENTS.md now 15,821 B). Not rebased. `git merge-tree` against main is clean, and this `src/cli.test.ts` passes 95/95 on a scratch copy of `4f81850c`. The ABC-189 overlap stays `UNKNOWN - verify` at its merge.
- **Notes** (`.grugops/context/ticket-to-pr-ABC-192/notes/`, sealed, committed on the branch): decision `20261021T174146Z-software-engineer-decision-8fd17c58` (design); observations `…d7675de0` (red-first readings, including a recorded scratch-layout artefact) and `…b5cf0eb3` (tip gates, waiver, stand-in, main moved).
- **Fences:** none breached. Only `src/cli.test.ts` and the notes changed on the branch. The node_modules symlink is ignored by git and kept for QE.

### Trace row

| ABC-192 (ticket-to-pr) | parser-view row pins setup → guard(…, …, process.stdout); version row pins vitest 4.1.11 with the bump re-run list as its message | — | — | QE-176-a, QE-176-b, SEC-173-1, RISK-ABC173-STATE, RISK-ABC143-01, NFR-008 | grugops/ABC-192 @ b5b8b0f9 (code 5d1fbaa7)<br>src/cli.test.ts | lint/typecheck/build 0; npm test 59 files 1994/1994 (1992 + 2); skips 0, No findings.; red-first M4/M4b/bump 3/3 red (one-file and npm test); N8_SPAWN 28 | UAT waived (0 production lines; not a signature) | — | In Development → In Review |
