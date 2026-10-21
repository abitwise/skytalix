---
subtask: scribe-ABC-168
role: agents-md-scribe
tickets: [ABC-168]
branch: grugops/ABC-168 (tip 2ed5469a) — commit ON THIS BRANCH in the SE's worktree ../wt-ABC-168
ref: .grugops/context/scribe-ABC-168/
width: 3 (beside bapm-rule-ABC-168-A6 and qe-ABC-187; disjoint files)
---

# Scribe: ABC-168 Scope 5 — `AGENTS.md` lines for `npm run uci`, the new `npm run build`, and the `UCI_DEEP` lane, in the ABC-164 layout

The SE finished Scope 1–3 and 6 on `grugops/ABC-168` (`2ed5469a`) and does not touch the branch again. The page's Scope 5 is yours.

## Do
- In `../wt-ABC-168` on `grugops/ABC-168`:
  - `AGENTS.md`: an `npm run uci` line; `npm run build`'s new meaning (`tsc -p tsconfig.build.json` → `dist/`); the lane command line `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts` (one backticked command: the `ABC-173` A3 parser will count 18, which its `>= 17` allows — confirm).
  - `memory-bank/90-agents-md-command-log.md`: the lane's comment and trigger (run at QE and after any change to `src/uci.ts`, `src/uci-session.ts`, `src/book-file.ts` or `src/engine.ts`; "Unset: NOT DEFINED, not skipped"), in § "On-demand commands" and its own section, per the ABC-164 layout.
- **Budget:** `AGENTS.md` ≤ 18,432 B (ABC-187's guard, merging soon; today's guard is still 24,576). Report bytes before and after.
- Gates on the new tip: lint, typecheck, build; `npm test` + `last-run.json` success (60 / 1988 at the SE's tip); skip-integrity `--skip-count 0`. No timing.

## Fences
- Only `AGENTS.md` and `memory-bank/90-agents-md-command-log.md`. No `src/`, `plans/` edits. Commit on `grugops/ABC-168` only. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `scribe-ABC-168`). **Pass the worktree `../wt-ABC-168` as the context root explicitly.** Take every `at` from `date -u`. Write notes inside that worktree.
- Write `.grugops/queue/done/scribe-ABC-168.md` (brief + `## Result`: new tip, lines added, bytes, gates) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| ABC-168 ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
