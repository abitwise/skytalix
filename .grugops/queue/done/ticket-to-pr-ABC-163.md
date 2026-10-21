---
subtask: ticket-to-pr-ABC-163
role: software-engineer
tickets: [ABC-163]
branch: grugops/ABC-163 (from main @ c940da40 or the main tip at your start); worktree ../wt-ABC-163
ref: .grugops/context/ticket-to-pr-ABC-163/
width: 3 (beside two other ticket-to-pr hops in their own worktrees)
---

# SE: ABC-163 — `clause-b.mjs` learns Ruling 2, with its empty-holder case. Closes `AR-095-L1UNIT`. ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md`: every criterion and its § Scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-163` on `grugops/ABC-163` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope, test-first where the page asks for a kill: show the named wrong build is green at base and red at head, planted in scratch copies outside the repo.
- Prove each criterion you own, then run all gates green on the tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
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
- Commit on `grugops/ABC-163` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-163`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-163.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row) and `.claim.md`, uncommitted on main.

## Result

**Done. A1–A5 are MET on the SE's readings. QE's re-plant of P2b, P2c and the comment edit is owed.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-163` @ **`dc4d4f15`** (notes commit), from `main` `ccccc6bb`. Not pushed, not merged. The worktree `../wt-ABC-163` is clean, and its `node_modules` symlink has been removed.
  - `87d3897d`: the instrument. `.grugops/context/design-F-072-1/probe/clause-b.mjs` is edited **in place**, +24/−2. Pre-fold readings reproduce from the file at `341da4c1`.
  - `d8c073e2`: `ADR-0036` § S1, +9, `#### Ruling 2 folded — 2026-10-21 (ABC-163)`.
  - `dc4d4f15`: four sealed notes.
- **How it works.** For limb 1 only, a new `(b1) Ruling 2` line names each production file that has a `+` line and holds limb 1 at `<base>` or `<head>`, and marks it "fired by Ruling 2". It reads the same `-U0 --no-renames -- src` diff the instrument already parses, so no pathspec diff is run. With no holder at either end, it prints `adds nothing`. Limb 2 and limb 3 output is byte-identical to the old instrument.

The readings: scratch repo = `git archive 1671f24f` + one plant commit; real pairs read in a scratch clone. OLD = `341da4c1`, NEW = `87d3897d`.

| criterion | result |
|---|---|
| `A1` | **MET.** P2b and P2c: OLD does not fire; NEW limb 1 **FIRES**, with (b1) Ruling 2 naming `src/book-file.ts`. 2 of 2 |
| `A2` | **MET.** A comment-only edit: OLD does not fire; NEW **FIRES** |
| `A3` | **MET.** Pair named: `dbaf972f^..dbaf972f` (`ABC-042`): 0 holders at both ends, 2 production files with `+` lines. Ruling 2 adds 0 and prints "no limb-1 holder at `<base>` or `<head>`; adds nothing". The verdict equals OLD's (does not fire). A git shim logged no `--name-only` and no pathspec diff |
| `A4` | **MET.** `0974102f..2307fc11`: L1 FIRES on (b1) `book-file.ts:13` and (b2) `cli.ts -> book-file.ts`; L2 FIRES on `cli.ts:177`; L3 does not fire; holders 4; Ruling 2 adds `src/book-file.ts`. `3ea3e352..98ea0a84`: all three do not fire; holders 4; Ruling 2 adds nothing |
| `A5` | **MET.** The dated line is in `ADR-0036` § S1. `git diff --numstat ccccc6bb dc4d4f15 -- src/` is empty |

- **Regression, 9 pairs × 3 limbs** (A4's two pairs and F-072-1's seven):
  - limbs 2 and 3 are byte-identical, 18 of 18;
  - limb 1 verdicts are equal, 9 of 9, and the only change is the added Ruling 2 line.
- **Extra plant X1.** The holder is held at `<base>` only. OLD does not fire; NEW FIRES.
- **Kill shown.** P2b, P2c and A2 are silent (green) under OLD at base and FIRE (red) under NEW at head. The first NEW run caught my own label defect ("FIRES (disputed…)"). It was fixed before `87d3897d`, and all the rows above are the re-run.
- **Gates at the tip:**

  | gate | result |
  |---|---|
  | lint | 0 |
  | typecheck | 0 |
  | build | 0 |
  | `npm test` | exit 0, 59 files, 1987 passed |
  | `last-run.json` | `success: true`, 0 failed, 0 pending, 0 todo |
  | skip count | 0 |
  | skip-integrity `--skip-count 0` | `No findings.`, exit 0 |
  | `CLI_DEEP` | 11/11 |
  | `PERFT_DEEP` | 32/32 |

  Lanes ran one at a time, heap 128 for multi-file and 400 for one file. No timing was taken. Biome ignores `.grugops/`, so lint does not reach the instrument (recorded).
- **UAT waiver (AGENTS.md form, `.snap` not filtered):** `git diff --name-only ccccc6bb dc4d4f15 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (exit 1). `.snap` changed: **none**. 0 production lines, so the waiver condition holds.
- **Notes** (`.grugops/context/ticket-to-pr-ABC-163/notes/`, sealed by `admitAndAppend`; `validate` → `[]` on all four):
  - `20261021T090518Z-software-engineer-decision-78d30164`: in place, the separate line, no pathspec, the A3 pair, the role note;
  - `…090519Z-software-engineer-observation-b896aae8`: the A1–A5 readings;
  - `…090520Z-software-engineer-observation-a61bb150`: the gates and the waiver;
  - `…090521Z-software-engineer-observation-83110c81`: the branch, commits, files, and what is owed.
- **Flags:**
  - The page names Architect/Design as the builder, and this was built by the SE on the Orchestrator's dispatch.
  - On limb 1, the old harnesses that grep `(b1)` now also match the Ruling 2 line.
- **Owed:**
  - QE: the re-plants;
  - the Orchestrator: the `AR-095-L1UNIT` close, retiring the by-hand step, and the board and trace moves.

**Trace row (for the Orchestrator to append):**

| ABC-163 | AR-095-L1UNIT, ADR-0036 § S1 Ruling 2 | grugops/ABC-163 @ dc4d4f15 (code 87d3897d, ADR d8c073e2) | .grugops/context/design-F-072-1/probe/clause-b.mjs, ADR-0036 (0 src lines) | A1 P2b/P2c FIRE, A2 comment FIRES, A3 dbaf972f 0 lines, A4 two pairs equal record; L2/L3 byte-identical 18/18; 0 tests | In Review: QE hop owed; UAT waiver applies |
