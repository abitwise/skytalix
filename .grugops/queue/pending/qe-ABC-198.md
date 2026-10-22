---
subtask: qe-ABC-198
role: qe-e2e
ticket: plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md
ref: .grugops/context/qe-ABC-198/
branch: grugops/ABC-198 (tip ef1d5ebc; lock a42f4bbb; re-pin d1a175f5; base 4952425a); worktree ../wt-ABC-198 (read only)
width: 2 (beside security-nfr-ABC-198, records only)
---

# QE gate for ABC-198: in-range lock bump (vitest family 4.1.12, vite 7.3.7) and one test literal re-pinned. A1–A7 are yours, including the A7 socket probe. **One open item has priority: an unexplained intermittent failure**

## Do
- Create your own worktree `../wt-qe-ABC-198` on `grugops/qe-ABC-198` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the sha. Install its own `node_modules` with `npm ci --ignore-scripts` inside the worktree. Never symlink main's, and never run npm in main's checkout.
- Verify A1–A6 with your own runs **before** opening the SE's notes (`…59297619`, `…f4334765`, `…240b63df`, `…7e9699c3` on the branch). A2: compare the audit set pair by pair (not the count) on fresh clones of base and tip.
- **The intermittent failure, first priority.** The SE saw 1 of 5 head runs of `npm test -- --coverage --coverage.thresholds.lines=100` with one red row, `src/engine.test.ts` `ABC-170 A2` (`describe` at line 1265, "maxNodes aborts, and the last COMPLETED iteration is played"), and lost the log. Base was 3 of 3 clean. Find out whether this is a flake that pre-exists on base (timing-, load- or coverage-sensitive) or something the 4.1.12 runner introduced:
  - read the row and say what it depends on;
  - run it repeatedly at base and at head, one-file and in that coverage form, with enough runs on each side to tell them apart (state N and the rate), keeping every log;
  - note the host load during the runs.
  If it is a pre-existing flake, say so with the evidence and propose a route. If head-only, that is a FAIL against A5.
- **A7:** a plain `npm test` opens 0 listening sockets across `run-bounded.js` → vitest → its workers. Prove the probe can fail with a planted listener in a scratch copy.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1995, names equal to base); skip-count capture as spelled → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file. No timing claims.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-198-x`).

## Fences
- Work only in `../wt-qe-ABC-198` and scratch clones in your scratch area. Commit typed notes inside your worktree (context root `../wt-qe-ABC-198/.grugops/context`) and a `## QE` section on the ABC-198 page there.
- No edits to `package*.json` or `src/` on the tip, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees or main's `node_modules`. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-198`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-198.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
