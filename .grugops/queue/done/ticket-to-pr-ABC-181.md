---
subtask: ticket-to-pr-ABC-181
role: software-engineer
tickets: [ABC-181]
branch: grugops/ABC-181 (from main @ the main tip at your start); worktree ../wt-ABC-181
ref: .grugops/context/ticket-to-pr-ABC-181/
width: 3 (beside two other ticket-to-pr hops in their own worktrees; disjoint files)
---

# SE: ABC-181: `status-panel.nfr.test.ts`'s header stops crediting the catalog with `gameend.nfr.test.ts`'s `vi.mock` lesson. One comment sentence, one file

## Read first
- The ticket page `plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md`: every criterion, its § Scope and § Out of scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-181` on `grugops/ABC-181` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope. Where the page asks for a kill or a red, show it first: base green / head red (or the harness red on the named wrong copy), planted in scratch copies outside the repo with a private `TMPDIR`.
- Run `A1`'s command at base first (it prints one sentence), then at head (nothing). Every changed line must sit inside the header `/** */` block. Do not touch the "A count and not a clock" sentence.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `.test-results/last-run.json` success (1987 tests at base);
  - skip-integrity `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- Heap rule (AGENTS.md):
  - `NODE_OPTIONS=--max-old-space-size=400` for one-file vitest runs only.
  - Whole-suite or multi-file runs use 128, as `npm test` does.
  - Run them one at a time.
- Take no timing.
- Measure the UAT waiver in AGENTS.md's form: `git diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'`. Do not filter out `__snapshots__`; list any `.snap` change separately.

## Fences
- Only the files the page scopes.
- Never touch `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, other tickets' files, or other worktrees.
- Commit on `grugops/ABC-181` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-181`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-181.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-181 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**Done. A1's command and grep, A2 and A3 are MET on the SE's readings. The QE read of A1 is owed.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-181` @ **`18b3c993`** (notes commit). The code commit is **`8f8c88b3`**, from `main` `19abbdb1`. Base `src/` is byte-identical to `59fc9215`, because `git diff --stat 59fc9215 19abbdb1 -- src` is empty. Not pushed, not merged. Worktree `../wt-ABC-181` is clean. Its `node_modules` symlink was removed. It was git-ignored (`.git/info/exclude:9`), so QE can re-link it.
- **Diff (`8f8c88b3`):** one line in one file, `src/status-panel.nfr.test.ts:12` (1 insertion, 1 deletion, no rewrap).
  - Before: "That is `src/gameend.nfr.test.ts`'s lesson, recorded in the catalog and followed here."
  - After: "That is `src/gameend.nfr.test.ts`'s lesson, written in that file's own header and followed here."

| criterion | result |
|---|---|
| `A1` | **Command MET.** At base it prints "That is `src/gameend·nfr·test·ts`'s lesson, recorded in the catalog and followed here." At head it prints nothing. `grep -c 'recorded in the catalog'` gives 1 at base and 0 at head. **QE read owed.** One header sentence at head still mentions the catalog: ABC-179's out-of-scope "A count and not a clock … (see `plans/nfr-catalog.md` for that move)", left unchanged. |
| `A2` | **MET.** The header still names `src/gameend.nfr.test.ts` as the source. That file's header at `:11-13` says "a `vi.mock` factory is hoisted to file scope, so putting it in `gameend.test.ts` would re-route the module graph …". |
| `A3` | **MET.** `git diff --name-only 19abbdb1 8f8c88b3` lists exactly `src/status-panel.nfr.test.ts`. The only changed line is `:12`, inside the `/** */` header (`:1-13`). The one-file run (heap 400) passes 6 of 6. `npm test` gives 59 files and 1987 tests at both base (change stashed, same worktree) and head. Skips are 0. The branch tip also adds the 3 sealed notes under `.grugops/context/`, as the brief asks. They are outside `src/`. |

- **Kill:** the page names no wrong build. Its kill is the A1 reading, which prints at base and is silent at head. No extra plant was made, because a planted copy of the retired sentence would just be the base file.
- **Gates on `8f8c88b3`:** lint 0 (biome, 116 files); typecheck 0; build 0.
  - `npm test` exit 0: 59 files, 1987 passed. `last-run.json` shows `success: true`, 0 failed, 0 pending, 0 todo.
  - skip-integrity `--skip-count 0` reports `No findings.`, exit 0.
  - `CLI_DEEP` 11/11. `PERFT_DEEP` 32/32.
  - Runs went one at a time, with heap 128 for multi-file runs and 400 for one-file runs. **No timing was taken.**
- **UAT waiver (AGENTS.md form, `.snap` not filtered):**
  - `git diff --name-only 19abbdb1 18b3c993 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1). `8f8c88b3~1..8f8c88b3` is also empty.
  - No `.snap` file changed.
  - So 0 production lines, and the waiver condition holds.
- **Notes** (`.grugops/context/ticket-to-pr-ABC-181/notes/`, sealed by `admitAndAppend`, committed in `18b3c993`):
  - `20261021T095900Z-software-engineer-decision-15535dbd`: the wording decision;
  - `…095901Z-software-engineer-observation-7413b8f6`: the A1-A3 readings;
  - `…095902Z-software-engineer-observation-8f09b496`: the gates and the waiver.

  Disclosure: the first seal used `at` stamps an hour ahead (10:59Z). That unmerged notes commit was reset on this branch, and the notes were resealed at 09:59Z. Real time at reseal was about 09:59Z.
- **Owed:** the QE hop (A1's QE read). Board and trace moves are the Orchestrator's.

**Trace row (for the Orchestrator to append):**

| ABC-181 | QE-179-a | grugops/ABC-181 @ 8f8c88b3 (notes 18b3c993) | src/status-panel.nfr.test.ts (1 header comment line; 0 prod lines) | A1 prints at base, silent at head; grep 1→0; 6/6 one-file; counts identical 59/1987; skip 0 | In Review: QE hop owed; UAT waiver applies |
