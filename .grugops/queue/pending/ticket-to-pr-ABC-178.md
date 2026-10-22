---
subtask: ticket-to-pr-ABC-178
role: software-engineer
tickets: [ABC-178]
branch: grugops/ABC-178 (from main @ the main tip at your start, at or after 513c0211); worktree ../wt-ABC-178
ref: .grugops/context/ticket-to-pr-ABC-178/
width: 3 (beside qe-ABC-196 and scribe-owner-delegation; disjoint files)
---

# SE: ABC-178 (narrowed 2026-10-22 to R1 only): one additive cross-session hold row in `src/uci-session.test.ts` that restores QE-177-a's kill. Test-only, additive, one file, ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`. **The dated 2026-10-22 block after the H1 governs**: R2, B2 and the QP6 probe rows are out (moved to ABC-197), and B3–B6 cover R1 only. Then § Scope, § Out of scope, § Acceptance, § Test notes.
- BA/PM `.grugops/context/bapm-rerule-ABC-178/notes/` (`…8165d1ba` ruling, `…d5e744dd` readings); `bapm-rule-QE-177-ab` `…7c41e9a2`; QE `qe-ABC-177` notes and `probe/gap/` (`gp.mjs`, QP1).
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, and the owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`.

## Do
- Create the worktree `../wt-ABC-178` on `grugops/ABC-178` from the current `main`. A `node_modules` symlink is fine for gates; scratch copies for probes copy `node_modules` in full.
- **Red first:** on a scratch copy, QP1 (`held` hoisted to module scope) passes the whole default lane at base and goes red at the tip on R1 alone (B6 as amended).
- Implement exactly R1. Every existing line of the file stays byte-identical (B3); the row count goes up by exactly one (B4); B5's node census is as the page says.
- Gates on the tip (B9): lint, typecheck, build; `npm test` + `last-run.json` success (base count at your start + 1); skip-count capture as spelled → `test-skip-integrity.js`; `UCI_DEEP` lane as `AGENTS.md` spells it. Heap 128 multi-file, 400 one-file. **No timing claims.** B7/B8 are QE's.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing.

## Fences
- Only `src/uci-session.test.ts` (plus your notes in `../wt-ABC-178/.grugops/context/ticket-to-pr-ABC-178/`). Never production `src/*.ts`, `vitest.config.ts`, `package*.json`, `tools/`, `AGENTS.md`, `plans/`, `memory-bank/`, git config, `node_modules/` in main's checkout, other worktrees. Commit on `grugops/ABC-178` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). **Pass your worktree's `.grugops/context` as the context root explicitly**, never the plugin dir. Take every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Write your done record as `.grugops/queue/done/<subtask>.md` (this brief plus a `## Result` section) and `.claim.md`, in main's tree, uncommitted. Leave the pending file and the claim directory alone.
