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

## Result

**New tip:** `grugops/ABC-168` @ `b71f8902` (the lines commit is `a347902b`; `b71f8902` adds the sealed note only). Base was `2ed5469a`. Not pushed, not merged.

**Lines added (`AGENTS.md`, +3 / -1):**
- § Development: `- UCI engine entry (ABC-168): `npm run uci``, own label, never `Dev / run` (the `ABC-042`/`059`/`065`/`071` pins).
- § Test: `- Real-engine UCI lane (opt-in, ABC-168): `UCI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci.real-engine.test.ts``, one backticked command. The `ABC-173` `A3` parser's regex over `AGENTS.md` counts **18** (was 17); its floor `>= 17` holds (confirmed by running the regex, and `npm test` is green).
- § Build: `npm run build` kept; its comment now says `tsc -p tsconfig.build.json` -> `dist/` (`ADR-0044` D8).

**`memory-bank/90-agents-md-command-log.md`:** the lane's row and trigger in § "On-demand commands" ("Unset: NOT DEFINED, not skipped"); new § "UCI entry point" and § "Real-engine UCI lane"; § "Build (use sparingly)" rewritten with the old text kept; a `scribe-ABC-168` pass entry.

**Bytes:** `AGENTS.md` 15,606 B -> **16,090 B** (+484 B). Against the 18,432 B ceiling (`ABC-187`): 2,342 B headroom; against today's 24,576 B guard: 8,486 B. The log is 75,979 B -> 80,517 B.

**Gates** (on `a347902b`; `b71f8902` adds only a note file; no timing): lint 0 (119 files), typecheck 0, build 0; `npm test` exit 0, **60 files / 1988 tests**, `last-run.json` success true, 0 failed, 0 pending; `test-skip-integrity.js --skip-count 0`: `No findings.`; `UCI_DEEP` lane 5 passed (1 default + 4 deep).

**Fences:** only `AGENTS.md`, `memory-bank/90-agents-md-command-log.md` and the note under `.grugops/context/scribe-ABC-168/` (in the worktree). No `src/` or `plans/` lines.

**Note:** `.grugops/context/scribe-ABC-168/notes/20261021T141646Z-agents-md-scribe-observation-a5903bc5.md` (sealed with `admitAndAppend`, context root the worktree).

**Trace row (10 cells; not appended here):**
`| ABC-168 (Scribe) | AGENTS.md lines for npm run uci, build -> dist/ and the UCI_DEEP lane; lane comment and trigger in the command log | EPIC-007 | — | ADR-0044 D8/D9, ABC-173 A3 (parser counts 18) | grugops/ABC-168 @ b71f8902<br>AGENTS.md, memory-bank/90-agents-md-command-log.md | lint/typecheck/build 0; npm test 60/1988; skip 0; UCI_DEEP 5/5; AGENTS.md 16,090 B | waiver does not apply to the branch (src/uci.ts from the SE hop); this hop touches no src/ | — | In Development -> In Review (Scribe Scope 5 done; QE and UAT owed) |`
