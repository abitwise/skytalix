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

## Result

**Delivered.** Branch `grugops/ABC-178`, tip **`efaa0a76`**, from `main` `43e4996f`. One file, one commit. Not pushed, not merged. No timing was taken.
Notes are sealed with `admitAndAppend` (each reads back `sealVerdict` ok) in `../wt-ABC-178/.grugops/context/ticket-to-pr-ABC-178/notes/`: decision `…82e891e8`, observations `…8392960f` (red-first), `…3634ec07` (census) and `…a72e3f79` (gates). **They are uncommitted in the worktree**, because committing them on the branch would add `.grugops/…` paths to B3's `--name-only`. Bring them to `main` at close, as was done for `ticket-to-pr-ABC-177` (`fb9ed0ea`).

### Per criterion
| crit | result |
|---|---|
| B1 | **MET**. Session 1 is `talk(["position startpos", "go infinite"], 1_000)`, never released, with no `bestmove` line. Session 2 is a fresh `talk(["stop", "ponderhit"])` whose `out` is `[]` |
| B3 | **MET, with one flag.** `--name-only` gives `src/uci-session.test.ts`. `-U0` has 0 `-` lines and 1 hunk of 7 `+` lines: a comment citing ABC-178/QE-177-a, the 5-line row, and **one blank separator line**. I count the blank line as part of R1. A strict reader may not |
| B4 | **MET**. The file has 126 tests at base and 127 at the tip, all passed, 0 skipped. Names (`LC_ALL=C`): base ⊂ tip, and the one difference is R1's name. The lane has **1 995 at base and 1 996 at the tip** (main moved past ABC-168) |
| B5 | **MET**. R1 = **655** nodes (≤ 1 000). The other 126 rows are identical node for node to base |
| B6 | SE red-first only (QE owns the gate). QP0: 0 red at base and at the tip. **QP1: 0/1 995 red at base, 1/1 996 red at the tip, on R1 alone** |
| B7, B8 | QE's. Not run. No timing claims |
| B9 | **MET**. lint 0, typecheck 0, build 0. `npm test` exit 0, `last-run.json` success, 1 996/1 996. Skip-count capture → 0. `test-skip-integrity.js` → `No findings.` exit 0. `UCI_DEEP` 5/5 green. The A11 M4 sweep is green and still kills a scratch M4 mutant |

### UAT waiver form
`git -c core.quotePath=false diff --name-only 43e4996f efaa0a76 | grep -v '\.test\.ts$' | grep '^src/'` → **empty** (grep exit 1). The `efaa0a76~1 efaa0a76` form is also empty. Zero production lines.

### Trace row
| ABC-178 (ticket-to-pr-ABC-178) | R1 cross-session hold row restores QE-177-a's kill (QP1) | EPIC-007 | — | QE-177-a; BA/PM …8165d1ba; NFR-008/N8-LANE untouched by SE (B7/B8 owed to QE) | grugops/ABC-178 @ efaa0a76<br>src/uci-session.test.ts (+1 row, additive) | lint/typecheck/build green; npm test 1996/1996 (base 1995 + 1); file 127; skips 0; UCI_DEEP 5/5; QP1 red 1/1996 at tip, 0/1995 at base; R1 655 nodes | UAT waived (0 production lines) | — | In Development → In Review |
