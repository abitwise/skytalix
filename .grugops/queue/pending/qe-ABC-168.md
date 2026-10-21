---
subtask: qe-ABC-168
role: qe-e2e
ticket: plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md
ref: .grugops/context/qe-ABC-168/
branch: grugops/ABC-168 (tip b71f8902; SE code 6232cfa7/825b21d1, merges of main 683129f7 and 8b1e1c67; Scribe a347902b); worktree ../wt-ABC-168 (read only)
width: 2 (beside qe-ABC-187)
---

# QE gate for ABC-168 (`skytalix`: UCI entry point, `dist/` artifact + `bin`, `UCI_DEEP` lane, ABC-042 A10 pin edits, Scope 5 lines)

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha and any conflict.
- Verify every criterion against the page **as amended** (ruling (a), `ADR-0044` § Addendum 2026-10-21; A6 route (2), BA/PM `…eb53fbfe`), with your own runs before opening the SE's and Scribe's notes.
- **`A6` is yours:** one run of an async probe under `.grugops/context/qe-ABC-168/probe/` with plain `node` (never vitest; `C2` stays untouched), against `node src/uci.ts` at the tip, default options, per the page's test note 6: clock points, one counted run, 10,000 ms miss bound, record host chip, Node version, load1, tip sha, met/missed per number. A miss is reported, not trimmed, and goes to Security/NFR.
- **`A7` on a fresh clone** of the tip: `npm ci && npm run build`, shebang, the `dist/` contents (four type-only emits allowed, not loaded), `grep -l 'import(' dist/*.js` empty, the away-from-clone run after `rm -f` of the four.
- **Pending owner confirmations:** EPIC-007 M9's and M3's rewordings are not yet confirmed. Read `A7` and `A6` regardless; record that their M9/M3 link is pending.
- **Mutation reads:** plant at least: (i) `src/uci.ts` writes before the `EPIPE` arm; (ii) an argument accepted instead of exit 1; (iii) the exception path exiting 0; (iv) `bin` pointing elsewhere; show each is caught by a test or a criterion, or record the survivor.
- **Standing reads:** if `spawnNode`/`RealChild` or a sibling helper is used, its `spawnSync` `cwd` option equals the returned `cwd` (QE-184-a); child counts with `--reporter=verbose`, ≥ 1 (QE-184-c).
- **Gates** on the tip/merge: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1988); skip-integrity `--skip-count 0`; `UCI_DEEP` (5/5), `CLI_DEEP` (11/11, 6 children), `PERFT_DEEP` (32/32). Heap 400 one-file, 128 multi-file; one at a time. No timing beyond A6's probe.
- **UAT:** production lines are present; UAT is owed to the owner (A8–A10 need cutechess-cli and En Croissant on his Mac). Measure the waiver form anyway and report it.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-168` on a branch from the tip. Plants only in scratch copies; the probe only under `.grugops/context/qe-ABC-168/probe/`.
- Commit typed notes, the probe and its output, written inside your worktree, and a `## QE` section on the ABC-168 page there.
- No edits to `src/`, `AGENTS.md`, `EPIC-007`, ADRs, `plans/board.md`, `plans/traceability.md` or other ticket pages.
- Never push, `--force`, `--amend` or rebase; never merge into `main`. Touch no process you did not start.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-168`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-168.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-168 (QE) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
