---
subtask: ticket-to-pr-ABC-198
role: software-engineer
tickets: [ABC-198]
branch: grugops/ABC-198 (from main @ the main tip at your start); worktree ../wt-ABC-198
ref: .grugops/context/ticket-to-pr-ABC-198/
width: 3 (beside qe-ABC-178b and bapm-rule-QE-189)
---

# SE: ABC-198. In-range lock bump of the vitest family (4.1.12) and vite (7.3.7) clears the AR-1 drift; one test literal re-pinned after the bump re-run list. `package.json` unchanged

## Read first
- The ticket page `plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md`: every criterion (A1–A8), § Scope (the exact command), § Out of scope, § Test notes, and the vite fallback.
- BA/PM `.grugops/context/bapm-cut-AR-1-drift/notes/` (`…1a123d24` ruling, `…63b88f5d` readings); Security/NFR `security-nfr-ABC-190` (`…140008ff`, `…56bf0b02`); Orchestrator `…e4ef897b`; ABC-192's page and `BUMP_RERUN_LIST` in `src/cli.test.ts`; `AGENTS.md` (`RISK-ABC143-01`, the vitest notes).

## Do
- Create the worktree `../wt-ABC-198` on `grugops/ABC-198` from the current `main`. Install its own `node_modules` with `npm ci --ignore-scripts` **inside the worktree**. Never symlink main's `node_modules` here (the bump changes it), and never run npm in main's checkout.
- Run the page's command exactly. The lock diff must match A1 (10 packages, numstat `53 53`, `package.json` byte-equal). If it doesn't, stop and report with the diff.
- **A4 red first:** at the bumped lock, ABC-192's A2 row goes red on `CAPTURE_ARM_READ_ON_VITEST`. Run `BUMP_RERUN_LIST` items (1)–(3) on 4.1.12 and record each result. Only then re-pin the literal. If any item fails, stop and report.
- A2: the audit set pair by pair before and after (`npm audit --json`), with nothing added. A3: `npm ci` clean on a fresh clone of the tip. A6: `RISK-ABC143-01`, meaning the reporter writes `success: true` and a planted red run writes `false` (scratch copy).
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success with test counts and names equal to base (60 / 1995); skip-count capture as spelled → `test-skip-integrity.js`; `CLI_DEEP`, `UCI_DEEP`, `PERFT_DEEP`. Heap 128 multi-file, 400 one-file. **No timing claims.**
- UAT waiver form must print nothing (the only `src/` line is in a `.test.ts` file).
- Vite fallback exactly as the page says: if gates go red only with vite, drop vite and hand back with the measurement.

## Fences
- Only `package-lock.json` and the one literal in `src/cli.test.ts` (plus your notes in `../wt-ABC-198/.grugops/context/ticket-to-pr-ABC-198/`, the context root to pass). Never `package.json`, `AGENTS.md`, `plans/`, `memory-bank/`, `tools/`, git config, main's `node_modules`, other worktrees. Commit on `grugops/ABC-198` only. Never push, merge or `--force`. Temp files in your scratch area, not `/tmp`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-198`). Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/ticket-to-pr-ABC-198.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
