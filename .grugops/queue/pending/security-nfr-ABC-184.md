---
subtask: security-nfr-ABC-184
role: security-nfr
ticket: plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
ref: .grugops/context/qe-ABC-184/
branch: grugops/qe-ABC-184 @ 2c65403b (over SE 442d1e57/c6f80c81; base 5277babd); QE worktree ../wt-qe-ABC-184 (read only)
width: 2 (beside qe-ABC-165)
---

# Security/NFR: AR-183-CWDARG close, and QE-184-a / -b / -c

QE (verdict `…7b9ef6a7`) read `AR-183-CWDARG`'s close condition met: TCWD + P6f is 11/11 green on the base test and 10/11 on the head test, `A7` red at `:504`, `AR-183-CWDARG` in the output. QE also recorded three INFO gaps (plant evidence in the `qe-ABC-184` notes on the branch):
- **QE-184-a (TSPWN):** a one-line edit inside `spawnNode`, changing only the `spawnSync` `cwd` option for the neutral child, survives P6f. The page names this residual but calls it a "two-place helper edit"; QE measured one line.
- **QE-184-b (TFORGE):** a forged record on the `booked` line, `{ ...spawnReal(…), cwd: neutral }`, survives P6f.
- **QE-184-c:** child counting from `[CLI_DEEP]` lines needs `--reporter=verbose` in an agent session (vitest agent detection).

## Decide
1. **AR-183-CWDARG.** Close it as written, close it with a narrower named residual (owner, trigger, close condition), or keep it open. The Orchestrator owns the risk and records the close per your ruling.
2. **QE-184-a and QE-184-b.** Accept, or name a fix shape for BA/PM with priority and trigger. Say whether either undercuts the close (QE says neither does), and whether the page's "two-place" wording needs an erratum.
3. **QE-184-c.** Accept or route (it touches how the `N8-LANE` child count is read).
4. **Security surface.** Confirm the change is test-only (`src/cli.real-engine.test.ts`, +7/−0, 0 production lines) and raises no new concern.

## Fences
- Records only, plus the risk record where `AR-183-CWDARG` lives (the Security/NFR addenda on the ABC-095 page).
- No `src/`, `AGENTS.md`, board, `plans/traceability.md` or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-184`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/security-nfr-ABC-184.md` (brief + `## Result`: verdict, rulings) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order** (forward row rule `…d2b9bf09`):
  `| ABC-184 (Security/NFR) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
  `—` for an empty cell; a literal `|` is `\|`, inside code spans too; join facts with `<br>` or `; `.
