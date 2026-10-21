---
subtask: ticket-to-pr-ABC-168
role: software-engineer
tickets: [ABC-168]
branch: grugops/ABC-168 (from main @ the main tip at your start); worktree ../wt-ABC-168
ref: .grugops/context/ticket-to-pr-ABC-168/
width: 3 (beside qe-ABC-185 and qe-ABC-187)
---

# SE: ABC-168 `skytalix`: `src/uci.ts`, the `dist/uci.js` artifact + `bin`, one opt-in real-child lane, and the four `ABC-042` A10 pin edits. Owner go (pull next, 2026-10-21)

## Read first
- The ticket page `plans/tickets/ABC-168-skytalix-the-uci-entry-point-and-its-built-dist-artifact.md`: every criterion, § Scope 1–6, § Out of scope, § Dependencies; `ADR-0044` (D2, D8, D9), `ADR-0011` clause 4, `ADR-0016`, `EPIC-007`.
- `AGENTS.md` (split by ABC-164: lane comments and triggers now live in `memory-bank/90-agents-md-command-log.md` § "On-demand commands"; governance in `memory-bank/45-standing-rulings.md`).

## The page was cut on 2026-10-18. Re-read it against today's `main` first
- **Dependencies met:** ABC-171 merged (`25162735`); ABC-167, 169, 170 merged. `AT_HEAD` already holds `"license"` (ABC-169): keep it.
- **Line numbers in Scope 6 are from 2026-10-18;** find the four edits by content.
- **`AGENTS.md` budget (Scope 5) changed:** the file is 15,606 B; the guard drops to 18,432 B when ABC-187 merges (in review now). Scope 5 is the Scribe's, after your commit — **you do not edit `AGENTS.md`**. Put the lane flag's name and its trigger in your done record so the Scribe can write it (command line in `AGENTS.md`, comment in the `90` log, per the ABC-164 layout).
- **Book-read risks:** AR-095-CWD, AR-162-FALLBACK, AR-180-VALIDATED and AR-183-CWDARG are all closed; nothing is owed from that chain. `ADR-0036` Ruling 2 still routes a `src/book-file.ts` read or a launch path through Security/NFR: a Security/NFR hop follows QE.
- **If your real-child lane reuses `spawnNode`/`RealChild` in `src/cli.real-engine.test.ts`:** keep the `spawnSync` `cwd` option and the returned `cwd` the same unmodified parameter (standing QE-184-a read).
- **Counting children:** any `[CLI_DEEP]`-style child count is read with `--reporter=verbose` and must be ≥ 1 (QE-184-c).
- **Stop and report** if any criterion no longer holds as written at today's base (as ABC-161 and ABC-164 did). Don't reinterpret it.

## Do
- Create the worktree `../wt-ABC-168` on `grugops/ABC-168` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored. Say whether `dist/` is git-ignored and keep it out of commits unless the page says otherwise.
- Implement exactly Scope 1–3 and 6. Scope 4 (UAT readings on the owner's Mac, cutechess-cli and En Croissant) is not yours: mark those criteria `UNKNOWN - verify` (owner).
- Gates on the tip: lint, typecheck, build (now `tsc -p tsconfig.build.json`); `npm test` + `last-run.json` success (59 / 1987 at base; report the new counts); skip-integrity `--skip-count 0`; `CLI_DEEP` (11/11, 6 children with `--reporter=verbose`), `PERFT_DEEP`, and your new lane. Heap: 400 for one-file vitest runs, 128 for multi-file (as `npm test` sets). One run at a time. No timing.
- Measure the UAT waiver in AGENTS.md's form and report it (production lines are expected; UAT is owed to the owner).

## Fences
- Only the files the page scopes, minus `AGENTS.md` (the Scribe's). No core file; `src/uci-session.ts` only if composition needs it.
- Never touch `plans/`, `memory-bank/`, other worktrees. Commit on `grugops/ABC-168` only. Never push or merge. Touch no process you did not start.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-168`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u`. Write notes inside your worktree; include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-168.md` (brief + `## Result`: tip, per-criterion results, the lane flag and trigger for the Scribe, gates, waiver) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**; do NOT append it yourself:
  `| {ticket} ({hop}) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`
