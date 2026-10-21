---
subtask: bapm-cut-AR-183-CWDARG
role: ba-pm
ticket: ABC-183 (Done, merged 7a609285)
ref: .grugops/context/security-nfr-ABC-183/
width: 2 (beside ticket-to-pr-ABC-161; disjoint files)
---

# BA/PM: cut ABC-184, the XS P3 test-only fix for AR-183-CWDARG (QE-183-a)

Security/NFR ruled `…41f70925`: AR-180-VALIDATED is closed, and AR-183-CWDARG is opened (LOW, Orchestrator-owned; owner record `…bc2b06ce`). Dropping `booked`'s `neutral` cwd argument leaves the `CLI_DEEP` lane 11/11 under P6f, because A7 asserts the variable, not the child's working directory. QE's plant evidence is in the `qe-ABC-183` notes (verdict `…be7c2c82`); Security/NFR's scratch FIX measurement is in `…d5fd47e1`.

## Read first
- The ABC-183 page, including its QE section.
- The ABC-095 page's latest Security/NFR addendum (AR-183-CWDARG).
- Notes `…41f70925`, `…d5fd47e1`, `…be7c2c82`, `…bc2b06ce`.
- `src/cli.real-engine.test.ts` at `main` (A7, `spawnReal`, `spawnNode`, `RealChild`).

## Cut
- **Fix shape (Security/NFR's).** `RealChild` records the `cwd` it spawned with; A7 asserts `booked.cwd` equals `neutral`, with a message naming `AR-183-CWDARG`. 0 new spawns, 0 new tests, 0 production lines. Fence it to `src/cli.real-engine.test.ts`.
- **Acceptance.** A plant table read by QE, base test vs head test: none (green/green), P6f (red/red), **TCWD + P6f (green on base, red on head at the new assertion)**, TCWD alone (state the expected row). Plus the fence counts in ABC-183 `A5`'s style (file list, waiver form, `npm test` and `CLI_DEEP` counts equal, children 6).
- **Close condition.** AR-183-CWDARG closes when QE reads TCWD + P6f red at head.
- **Promotion trigger.** Same as AR-180-VALIDATED's: an edit to `src/book-file.ts`, or a packaging/bin/launch-path ticket (ABC-168 fires it; ABC-161 does not). On fire → P2, owed before that ticket merges. Any earlier ticket editing A7, `spawnReal`, `spawnNode` or `RealChild` carries the fix instead.
- **Housekeeping.** Id ABC-184 (verify it is free in `plans/tickets/`). Score DoR; place it in Ready if 10/10. Note on ABC-168's page or card that ABC-184 is owed before its merge, if that is where such owed items are recorded.

## Fences
- Records only: the new ticket page, `plans/board.md` (one row, header counts, one `_Updated:` line prepended above the first existing one), notes, and at most a one-line owed-item note on ABC-168's page.
- No `src/` or `AGENTS.md` edits. Never push or merge. Do not touch `../wt-ABC-161` or `src/cli.test.ts`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`; task `bapm-cut-AR-183-CWDARG`). Take every `at` from `date -u`; never copy another note's stamp.
- Write `.grugops/queue/done/bapm-cut-AR-183-CWDARG.md` (brief + `## Result` + trace row as one `| ABC-184 | … |` line) and `.claim.md`, uncommitted on main.
