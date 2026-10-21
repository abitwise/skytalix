---
subtask: bapm-rework-ABC-161
role: ba-pm
ticket: plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
ref: .grugops/context/ticket-to-pr-ABC-161/ (on branch grugops/ABC-161 @ 1f623d18, notes only)
width: 1
---

# BA/PM: re-word ABC-161's A1 and A3 against today's `main`, then re-score DoR

The SE stopped `ticket-to-pr-ABC-161` before any code (decision `…67e9ccc1`, base readings `…b56b418c` which supersedes `…1ef80c09`, commands `…82d08f42`; on `grugops/ABC-161` @ `1f623d18`, read with `git show`). The page was cut at `1671f24f`; two later merges changed what its plants do at base `69610c5b`:
- **A1:** P11 is already **red on base**. The existing `A8′` row catches it at level 4, call 1, because `ABC-174` (`be6a5599`) set level 4 to `blunderRate: 0.05`. Levels 1–3 are still blind.
- **A3:** P9d is now **green on base**, since `f6b63c1c` put "ADR-0045" into the `AGENTS.md` Dev / run slot, so `4` occurs outside the level list. All five slot plants (P9a–P9e) are blind on base.
- **A2** holds as written (S2c green on base).

## Decide
1. **Fix 1 / A1.** Is fix 1 still wanted? If yes, re-word A1 so it measures what is still blind (e.g. a P11 variant scoped to levels 1–3, or a row that must discriminate per level), with green-on-base / red-on-head stated for today's base. If no, drop it with the reason, and say whether QE-101-a closes.
2. **A3.** Re-word for P9a–P9e all green on base → red on head (5 of 5), and the real `AGENTS.md` green on head.
3. **Refresh the stale pointers** (line numbers, "1810 of 1810", "78 of 78", the ABC-096 dependency line) to `main` readings, or drop them in favour of row names.
4. **Re-score DoR** and say where the ticket goes (Ready at 10/10). Size and priority as you judge; keep the promotion trigger.

## Fences
- Records only: the ABC-161 page, `plans/board.md` (the ABC-161 card, header counts, one `_Updated:` line prepended above the first existing one), notes.
- You may run plants in scratch copies outside the repo to confirm base readings (private `TMPDIR`; heap 400 for one file, 128 for multi-file). No `src/` or `AGENTS.md` edits. Never push or merge. Do not touch `../wt-ABC-161`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-rework-ABC-161`). Take every `at` from `date -u`.
- Write `.grugops/queue/done/bapm-rework-ABC-161.md` (brief + `## Result` + trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.
