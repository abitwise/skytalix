---
subtask: ticket-to-pr-ABC-182
role: software-engineer
tickets: [ABC-182]
branch: grugops/ABC-182 (from main @ the main tip at your start); worktree ../wt-ABC-182
ref: .grugops/context/ticket-to-pr-ABC-182/
width: 3 (beside two other ticket-to-pr hops in their own worktrees; disjoint files)
---

# SE: ABC-182: commit `r2-mutants.sh` and `r2-mutants.out.txt` beside `clause-b.mjs` (7 Ruling 2 plants). ZERO `src/` lines

## Read first
- The ticket page `plans/tickets/ABC-182-a-committed-ruling-2-plant-harness-r2-mutants-sh-beside-clause-b-mjs.md`: every criterion, its § Scope and § Out of scope.
- The notes it cites.
- `AGENTS.md`: lanes, the heap-flag rule, the 12 coding rules, and where the sealed-note writer lives.

## Do
- Create the worktree `../wt-ABC-182` on `grugops/ABC-182` from the current `main`. A `node_modules` symlink is fine; remove it before you finish if it isn't ignored.
- Implement exactly the page's scope. Where the page asks for a kill or a red, show it first: base green / head red (or the harness red on the named wrong copy), planted in scratch copies outside the repo with a private `TMPDIR`.
- Build the harness in `f-mutants.sh`'s shape, with the 7 plants and the expected verdicts exactly as the page's table states (Architect `…34e592ac`; plant bodies from QE `…7f56f339`). Read limb 1 from the `(b1) capability` and `(b1) Ruling 2` lines, never a bare `(b1)` grep.
- Run `A3` first (the `341da4c1` copy: nonzero, exactly `P2b`, `P2c`, `CMT`, `X1` named), then `A2` (green, exit 0, repo status and refs unchanged), then `A4` (`ALT`, scratch only, names limb 2). `A5`: re-run `A2` and show the committed output reproduces.
- Do not edit `clause-b.mjs`, `ADR-0036`, `src/` or `biome.json`. Any temporary copy placed so `typescript` resolves must be gone before you finish.
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
- Commit on `grugops/ABC-182` only. Never push or merge.
- Touch no process you did not start.
- **Stop and report** if a criterion can't be met as written. Don't widen scope.

## Publish
- Seal notes with the plugin writer: the `installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`, then `scripts/context-io.js` `admitAndAppend`, task `ticket-to-pr-ABC-182`.
- Write the notes **inside your worktree** so they land on your branch. Include a `kind: decision`.
- Write `.grugops/queue/done/ticket-to-pr-ABC-182.md` (brief + `## Result`: tip, per-criterion results, gates, waiver measurement, trace row as one `| ABC-182 | … |` line) and `.claim.md`, uncommitted on main.

## Result

**Done. A1–A6 are MET on the SE's readings. The QE read of A2–A4 is owed.** Software Engineer (claude-opus-5-5), 2026-10-21.

- **Branch / tip:** `grugops/ABC-182` @ **`a7adaf21`** (notes commit). The deliverable commit is **`053595af`**, from `main` `19abbdb1`. Not pushed, not merged. The worktree `../wt-ABC-182` is clean, and its `node_modules` symlink is removed.
- **Diff (`053595af`):** `.grugops/context/design-F-072-1/probe/r2-mutants.sh` (new, +x, 75 lines) and `r2-mutants.out.txt` (new, the A2 run). `clause-b.mjs`, `ADR-0036`, `src/` and `biome.json` are untouched.
- **Notes (sealed, on the branch):** `.grugops/context/ticket-to-pr-ABC-182/notes/` contains `…decision-c8d1c57c` (harness decisions), `…observation-82b37fc8` (A1–A6 readings) and `…observation-802f9d50` (branch, gates, waiver). The last is an observation, not an artifact-ref, because the writer requires `gate_run` for an artifact-ref.
- **Design points for QE and the Architect (decision note):**
  - A row compares the `limb 1:` verdict and the `file@<ends>` list under `(b1) Ruling 2`. No bare `(b1)` grep.
  - NOH's `adds nothing` is checked only when a Ruling 2 line is printed. Otherwise the `341da4c1` copy would also name NOH, and A3 would name 5 plants, not 4.
  - The script makes the `341da4c1` copy itself in `<scratch>/r2-mutants-ref/`, with `typescript` symlinked.
  - Plant commits use fixed dates, so re-runs make the same plant ids.
  - A plant that no longer applies exits 2.

| criterion | result |
|---|---|
| `A1` | **MET at `053595af`.** `git diff --name-only 19abbdb1 053595af` lists exactly `r2-mutants.out.txt` and `r2-mutants.sh`. `git diff --quiet … -- clause-b.mjs` exits 0. **Note:** at the tip `a7adaf21`, the diff also lists the 3 notes under `.grugops/context/ticket-to-pr-ABC-182/notes/`, because this brief requires notes on the branch. |
| `A3` (run first) | **MET.** On the `341da4c1` copy (sha256 `433d0c50…`, in scratch with `typescript` symlinked), the run exits **1** with `limb 1 MISMATCH: P2b P2c CMT X1`, exactly those four. Limbs 2 and 3 are identical on 7 of 7. |
| `A2` | **MET.** On the folded instrument (sha256 `ad47a564…` = `87d3897d`), the run exits **0** with 7 of 7 rows as the table says. Limbs 2 and 3 are byte-identical to `341da4c1` on 7 of 7 (14 of 14). The worktree `status --porcelain` is empty and HEAD is unchanged. During this run, `main` moved to `106d5601` and `grugops/qe-ABC-181` appeared. Both are concurrent Orchestrator/ABC-181 commits. None of the 8 plant commits exists in the repo (`git cat-file -e`). On the A5 re-run, `for-each-ref` was identical before and after. |
| `A4` | **MET.** The `ALT` copy has a 1-byte change in `NAME[2]` (`cmp -l` = 1). The run exits **1** with `limbs 2/3 DIFFER from 341da4c1: P2b:limb2 … G1-GRD:limb2` on all 7, and no limb 3 difference. The ALT directory was deleted. |
| `A5` | **MET.** Re-running A2 at the committed tip exits 0, and `cmp` with `r2-mutants.out.txt` is byte-identical. There is no time or load header to exempt. |
| `A6` | **MET.** `npm test` gives 59 files and 1987 tests, equal to base, with 0 skips. `biome.json` is unchanged. |

- **Gates at `053595af` (the notes commit adds only `.grugops/context/`):** lint 0 (biome, 116 files); typecheck 0; build 0. `npm test` exits 0, 59 files and 1987 passed. `last-run.json` reads `success: true`, 0 failed, 0 pending, 0 todo, 59 testResults. Skip-integrity `--skip-count 0` reports `No findings.` (rc 0). `CLI_DEEP` 11/11. `PERFT_DEEP` 32/32. Heap was 128 for the whole suite and 400 for one-file lanes, one run at a time. **No timing was taken.** All harness runs were in the session scratchpad with a private `TMPDIR`.
- **UAT waiver (AGENTS.md form, `.snap` not filtered):** `git diff --name-only 19abbdb1 a7adaf21 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. `.snap` changes: **none**. The waiver condition holds.
- **Trace row:**

| ABC-182 | committed Ruling 2 plant harness beside `clause-b.mjs` (ABC-163 G-4) | `grugops/ABC-182` @ `a7adaf21` (code `053595af`) | `.grugops/context/design-F-072-1/probe/r2-mutants.sh` (+75), `r2-mutants.out.txt` (new); 0 `src/` lines | 7 plants (P2b, P2c, CMT, X1, NOH, G1-IMP, G1-GRD); A3 on `341da4c1` exits 1 naming exactly P2b/P2c/CMT/X1; A2 exits 0, 7/7, limbs 2+3 14/14 identical; A4 ALT names limb 2; A5 byte-identical; 0 new tests | In Development → In Review (SE done; QE read of A2–A4 owed; UAT waiver expected) |
