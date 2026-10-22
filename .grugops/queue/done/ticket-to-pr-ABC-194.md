---
subtask: ticket-to-pr-ABC-194
role: software-engineer
tickets: [ABC-194]
branch: grugops/ABC-194 (from main @ the main tip at your start); worktree ../wt-ABC-194
ref: .grugops/context/ticket-to-pr-ABC-194/
width: 2 (beside arch-build-ABC-195; disjoint files)
---

# SE: ABC-194 — ABC-192's `guardStreamFaultOf` also requires the `guard(…)` call to be a direct statement of `setup`'s body and `setup` to hold no `return`; plant table 5 → 9. `src/cli.test.ts` only; ZERO production lines; no new test row

## Read first
- The ticket page `plans/tickets/ABC-194-a-try-catch-or-an-off-switch-around-setups-guard-call-lets-an-uncapped-run-through.md`: every criterion, § Scope, § Out of scope, § Test notes.
- BA/PM notes `.grugops/context/bapm-rule-QE-192/notes/` (`…09a201ba` rulings, `…027683e7` readings incl. the 18-build prototype); QE `qe-ABC-192` notes (`…21079de0`, `…5eac2736` mutants); SE `ticket-to-pr-ABC-192` `…8fd17c58`; `tools/grugops/heap-guard.js`.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`.

## Do
- Create the worktree `../wt-ABC-194` on `grugops/ABC-194` from the current `main`. A `node_modules` symlink is fine.
- Red first, on scratch copies outside the repository (copy `node_modules` in full — a symlinked layout gives two vitest instances and false snapshot failures): the page's builds (try/catch, `if (false)`, uncalled arrow, early `return;`, deferred `.then`, labelled `break`, the two `HEAP_GUARD_OFF` off-switches) turn the row red; base, M4, M4b behave as the page says.
- Implement exactly the page's Scope. No new spawned child (`N8_SPAWN` stays 28); suite count stays 1994.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1994); skip-count capture as spelled in `AGENTS.md` → `test-skip-integrity.js`. One-file runs `NODE_OPTIONS=--max-old-space-size=400`; whole-suite 128. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing. AR-193-HUNKHDR stand-in (`…73e94c9f`): `git -c core.quotePath=false diff -U0 --no-renames --text --no-textconv --no-ext-diff --no-color --src-prefix=a/ --dst-prefix=b/ <base> <tip> -- src | awk '/^diff --git /{h=0} /^@@/{h=1} /^(\+\+\+|---) / && (h || /\t$/)'` must print nothing.

## Fences
- Only `src/cli.test.ts`. Never `tools/`, `package*.json`, `AGENTS.md`, `plans/`, `memory-bank/`, git config, `node_modules/`, other worktrees. Commit on `grugops/ABC-194` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree as the context root explicitly** — never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Notes are append-only: never delete one; a wrong note gets a superseding note. `artifact-ref` needs a §14 gate run, so record artifacts as `observation`. Task `ticket-to-pr-ABC-194`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells, as a plain table line (not in backticks). Put it in your done record (`.grugops/queue/done/<subtask>.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

**Done, no stop.** Branch `grugops/ABC-194` @ `fcf47534` (code `5e0839fd`, notes `fcf47534`), worktree `../wt-ABC-194`, from main `99d07d32` (main unmoved at end). Diff vs main: `src/cli.test.ts` (+30 −4) + 3 notes. 0 production lines; no push, merge or force.

- **Scope:** `guardStreamFaultOf` adds (1) a direct-statement check (the call's parent is an `ExpressionStatement` whose parent is setup's body) and (2) a no-`return` check (none outside `isFunctionLike` nodes). Faults name the condition and the SyntaxKind chain. The plant table goes 5 → 9; expected `[false,true,true,true,true,true,true,true,true]`.
- **A1:** base one-file `-t "ABC-192"` exit 0, 2 passed.
- **A2 / red-first** (scratch copy outside the repo, full node_modules copy, private TMPDIR, cmp 0 on every restore): try/catch, `if (!HEAP_GUARD_OFF)`, `if (HEAP_GUARD_OFF) return;`, `.then` deferral, M4, M4b → one-file 1 and npm test 1, with only ABC-192 > A1 red. The uncalled arrow, `if (false)`, `return;` and labelled break → one-file 1 (only A1); npm test 1 with A1 + ABC-173 A4/A6. Each fault names its condition.
- **A3:** direct check dropped → plant assertion red (3 entries); return check dropped → red (1 entry); both dropped → received `[F,T,T,T,T,F,F,F,F]`, the merged reading.
- **A4:** N8_SPAWN = 28 unchanged; 0 child-call lines added; ABC-173 C2 green; no timing.
- **A5:** lint/typecheck/build 0; npm test 0, 59 / 1994 passed, 0 failed; last-run.json success true; skip count 0 → `No findings.` exit 0. The UAT waiver form printed nothing; the AR-193-HUNKHDR stand-in printed nothing; AGENTS.md byte-identical (15,821 B).
- **Notes** (`.grugops/context/ticket-to-pr-ABC-194/notes/`): decision `20261021T195640Z-software-engineer-decision-aac5545f`; observations `…-observation-4566f46a` (red-first + A3) and `…-observation-cfa3d51f` (tip gates).
- **Open:** the ABC-189 textual overlap in src/cli.test.ts is `UNKNOWN - verify` at merge (different block). A QE hop is owed.

| ABC-194 (SE) | guardStreamFaultOf requires a direct-statement guard(…) call and no return in setup; plant table 5→9 (QE-192-a) | — | — | QE-192-a, QE-192-c, ADR-0008, NFR-008, AR-193-HUNKHDR | grugops/ABC-194 @ fcf47534<br>src/cli.test.ts | lint/typecheck/build 0; npm test 59/1994; skip 0, No findings. | waiver: 0 production lines (form empty) | — | In Development → In Review |
