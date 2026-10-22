---
subtask: ticket-to-pr-ABC-189
role: software-engineer
tickets: [ABC-189]
branch: grugops/ABC-189 (from main @ the main tip at your start); worktree ../wt-ABC-189
ref: .grugops/context/ticket-to-pr-ABC-189/
width: 3 (beside the other two hops of this wave; disjoint files)
---

# SE: ABC-189. One assertion pins `package.json` `bin` to `{ skytalix: "dist/uci.js" }` inside `ABC-042` A10 (closes AR-168-BINPIN on QE's red read). `src/cli.test.ts` only; ZERO production lines

## Read first
- The ticket page `plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md`: every criterion, § Scope, § Out of scope, § Test notes, and every source note it cites.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, the owner delegation `.grugops/context/owner-delegation-2026-10-22/notes/20261022T140148Z-orchestrator-decision-5aaf7cec.md`.

## Do
- Create the worktree `../wt-ABC-189` on `grugops/ABC-189` from the current `main` (`ABC-168` is merged at `513c0211`; main is at or after `14b840cc`). A `node_modules` symlink is fine for gates.
- **Red first:** on a scratch copy (full `node_modules`), `bin` → `src/uci.ts` passes every test at base and goes red at the tip on the new assertion only. Measure the other wrong values the page names.
- Implement exactly the page's Scope (one assertion, at most one comment line). Re-run ABC-187 A5's closer count; it must stay 9.
- Gates on the tip: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your start, 60 / 1995, plus any rows the page adds); skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing claims.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` must print nothing.

## Fences
- Only the files the page scopes, plus your notes in `../wt-ABC-189/.grugops/context/ticket-to-pr-ABC-189/` (the context root to pass). No other file, no `plans/`, `AGENTS.md`, `memory-bank/`, git config, `node_modules/` in main's checkout, other worktrees. Commit on `grugops/ABC-189` only. Never push, merge or `--force`.
- **Stop and report** if a criterion can't be met as written.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`). Pass the context root named under Fences explicitly, never the plugin dir. Every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; artifacts as `observation`.
- Trace row (10 cells, plain table line: `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`) in your done record `.grugops/queue/done/<subtask>.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave the pending file and the claim directory alone.

## Result

**Delivered.** Branch `grugops/ABC-189`, tip **`91883f94`**, from `main` `823a9885`. It has two commits: `deb555d2` (the test line) and `91883f94` (the sealed notes). Not pushed, not merged. No timing was taken.
The notes are sealed with `admitAndAppend` and read back by `readContext`, in `../wt-ABC-189/.grugops/context/ticket-to-pr-ABC-189/notes/`: decision `…96c58135`, observations `…5098b7a3` (red-first) and `…36feef6a` (gates). **They are committed on the branch.** A4 ignores `.grugops/`, so outside `.grugops/` the branch lists only `src/cli.test.ts`.

### Per criterion
| crit | result |
|---|---|
| A1 | **MET**. `grep -c 'AR-168-BINPIN'` gives 1 at the tip (0 at base). `grep -c 'skytalix: "dist/uci.js"'` gives 1 (0 at base) |
| A2 | **MET** (SE red-first; QE reads it itself). The exports are `git archive` with a full copied `node_modules`, heap 400, `-t "A10 — package.json"`, 95 tests and 1 selected. Tip real: 1 passed. Tip `(iv-b)`: 1 failed, `package.json bin (AR-168-BINPIN): expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }`. Tip `(iv-a)`: 1 failed. Base `(iv-b)`: 1 passed (the gap). Base `(iv-a)`: 1 passed |
| A3 | **MET**. `npm test` rc 0, 60/60 files and 1995/1995 tests, the same as base. `last-run.json` success true. Skip-count capture (as spelled) gives 0. `test-skip-integrity.js … --skip-count 0` prints `No findings.` |
| A4 | **MET**. Outside `.grugops/`, `git diff --name-only main...HEAD` lists only `src/cli.test.ts`. numstat `1 0`; `-U0` shows 1 `+` line and 0 `-` lines. No comment line was added. The waiver form prints nothing |

### Red first, the whole suite
- Base `(iv-b)` `npm test`: 60/1995 all pass, rc 0. So `bin` → `src/uci.ts` passes every test at base.
- Tip `(iv-b)` `npm test`: 1 failed / 1994 passed, rc 1. The only failure is A10 on the new assertion.

### Other checks
- ABC-187 A5 closer count: **9**, unchanged.
- Gates at the tip: lint rc 0, typecheck rc 0, build rc 0. Heap was 128 for whole-suite runs and 400 for one-file runs.

### UAT waiver form
`git -c core.quotePath=false diff --name-only 823a9885 91883f94 | grep -v '\.test\.ts$' | grep '^src/'` prints **nothing** (grep exit 1). The `deb555d2~1 deb555d2` form also prints nothing. Zero production lines.

### Owed
- The QE hop. AR-168-BINPIN closes on QE's red read of A2.

### Trace row
| ABC-189 (ticket-to-pr-ABC-189) | pin package.json bin to { skytalix: "dist/uci.js" } in ABC-042 A10 | EPIC-007 | — | AR-168-BINPIN (closes on QE's red read); QE-168-b (iv-b) | grugops/ABC-189 @ 91883f94<br>src/cli.test.ts (+1 line, 0 removed) | lint/typecheck/build green; npm test 60/1995 = base; skips 0, No findings; (iv-b) red 1/1995 at tip, 0/1995 at base; closer count 9 | UAT waived (0 production lines) | — | In Development → In Review |
