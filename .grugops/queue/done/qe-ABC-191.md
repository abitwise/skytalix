---
subtask: qe-ABC-191
role: qe-e2e
ticket: plans/tickets/ABC-191-a-production-file-git-treats-as-binary-hides-every-changed-line-from-clause-b.md
ref: .grugops/context/qe-ABC-191/
branch: grugops/ABC-191 (tip 797a238b; harness 56d7215f, code 11245e3d, ADR+out 6b79aa51; base 01836fff); worktree ../wt-ABC-191 (read only)
width: 2 (beside ticket-to-pr-ABC-176)
---

# QE gate for ABC-191 (clause (b) diff call reads `--text --no-textconv`; harness rows BIN-NUL, BIN-ATTR; ADR-0036 § S1 block). Your read of A2–A7 closes `AR-188-BINARY`

## Do
- **Merge the current `main` into your QE branch first** (a merge, not a rebase); run everything at that merge; report the merge sha.
- Verify every criterion A1–A9 against the page with your own runs, before opening the Architect's notes (`…0c4ec0c5`, `…7eb389c5` on the branch).
- **Re-plant independently:** run `r2-mutants.sh` yourself against (i) the head instrument (12 of 12 as expected), (ii) base's instrument (fails on exactly `BIN-NUL` and `BIN-ATTR`), (iii) each one-flag copy (the page's A3: each falls short). Build your own binary-marking plants beyond the harness rows (e.g. a NUL elsewhere in a limb-1 holder, a `.gitattributes` `binary` macro, a textconv driver, and — in a scratch clone only — `.git/info/attributes` `-diff`); limb 1 must fire on each.
- Limbs 2/3 on the 10 existing rows byte-identical to `341da4c1` on the same plant; on the two new rows, equal to `341da4c1` on X1 with plant ids masked, as the page says.
- One diff call, still `execFileSync` with an argv array and no shell.
- **`ADR-0036` § S1 block:** dated, consistent with the code, after the ABC-188 block, 0 lines edited; retires the `--numstat` stand-in only as far as the instrument now covers it.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success (59 / 1987); skip-integrity `--skip-count 0`. No timing. UAT waiver in AGENTS.md's form; `git diff --numstat <base> <tip> -- src | awk '$1=="-"'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register; say plainly whether `AR-188-BINARY`'s close condition is met.

## Fences
- Work in your own worktree `../wt-qe-ABC-191` on a branch from the tip. Plants only in scratch clones (own `.git`) under a private `TMPDIR`; **never edit `.git/info/attributes` or git config of this repository or any worktree**.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-191 page there.
- No edits to the instrument, harness, ADR, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-176` or `grugops/ABC-176`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-191`). **Pass your worktree as the context root explicitly.** Take every `at` from `date -u` (UTC). `artifact-ref` needs a §14 gate run, so record artifacts as `observation`.
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |` — exactly 10 cells. Put it in your done record (`.grugops/queue/done/qe-ABC-191.md` + `.claim.md`, main's tree, uncommitted); the Orchestrator appends it.

## Result

**PASS_WITH_GAPS** (`QE-191-a` LOW, `QE-191-b` INFO, `QE-191-c` INFO; 0 blocking; none against a criterion). Branch
`grugops/qe-ABC-191` @ **`b5ac124d`** (worktree `../wt-qe-ABC-191`, from the tip `797a238b`).

- **Merge of `main`:** `cde60d03` merged at **`e0bc26fe`** with no conflict. `src/`, `biome.json`, `package*.json` and
  `tsconfig.json` are identical at `01836fff`, `11245e3d` and `e0bc26fe`. During the run, `main` moved to `331c7d18`
  (ABC-176 queue and trace records only; no `src/`, instrument, ADR or package change). QE did not re-merge.
- **Commit `b5ac124d`:** 5 sealed notes and a `## QE` section on the ABC-191 page. There are no edits to the
  instrument, harness, ADR, `src/`, `AGENTS.md`, the board, the trace or other pages.
- **Notes** (sealed with `admitAndAppend` from the grugops 2.1.0 plugin cache, task `qe-ABC-191`, context root
  `../wt-qe-ABC-191/.grugops/context` passed explicitly, each `at` from `date -u`; `validate` gives `[]` and
  `sealVerdict` is ok on all 5):
  - observations: `20261021T164009Z-qe-e2e-observation-993a870d` (A1–A9),
    `20261021T164011Z-qe-e2e-observation-87c9f67b` (QE's own plants), `20261021T164012Z-qe-e2e-observation-9bc0b262`
    (gap register), `20261021T164013Z-qe-e2e-observation-b2a5673a` (artifacts and commands; recorded as an
    observation because an `artifact-ref` needs a §14 gate run);
  - decision: `20261021T164023Z-qe-e2e-decision-16ba4076` (the verdict and the `AR-188-BINARY` close condition).
  - There is no finding, because there was no §14-gate run.

**Criteria** (QE's own runs at `e0bc26fe`, `<tip>` `e0bc26fe`, before opening the Architect's `…0c4ec0c5` /
`…7eb389c5`; those notes agree on each):
- **A1 MET:** the 4 Scope files plus the Architect's 2 notes (`QE-182-d`).
- **A2 MET:** base instrument (`55641c55…`), rc 1. It prints `limb 1 MISMATCH: BIN-NUL BIN-ATTR` and `DIFFER … BIN-NUL:limb2
  BIN-NUL:limb3 BIN-ATTR:limb2 BIN-ATTR:limb3`. The 10 existing rows are `ok`, with 20 `identical`.
- **A3 MET:** the `--no-textconv`-only copy (`6be1a962…`) is the same as A2. The `--text`-only copy (`ce1225a3…`) is
  rc 0, 12/12, and `TXC` reads 6/12 on it.
- **A4 MET:** head (`d3abb847…`), rc 0, 12/12, 22 `identical`.
  - The 10 existing rows are byte-identical to base's output on the same plants.
  - Status is empty, and `HEAD` and all 50 refs are unchanged across a tight snapshot. A looser first snapshot caught
    other agents moving `main` and `grugops/ABC-176`, and creating `grugops/qe-ABC-176`; none of that was the harness.
  - A re-run is byte-identical. The committed `.out.txt` equals this run, apart from commit ids.
- **A5 MET:** `BIN-NUL` 2/4, `BIN-ATTR` 1/3.
- **A6 MET:** `TXC` head FIRES 1/3; base and `--text` only read 6/12; `--no-textconv` only reads 1/3. Limbs 2/3 equal
  `341da4c1` on X1, masked.
- **A7 MET:** a PATH shim logs 87 git calls on head and on base, identical apart from the one
  `diff -U0 --no-renames --text --no-textconv <b> <h> -- src`. There is one `execFileSync("git", args, …)`, with no
  shell option.
- **A8 MET:** 22 `+` / 0 `−`, dated 2026-10-21, after the `ABC-188` block. (i)–(iii) and the rollback are consistent
  with the code, and the `d722a6b6` reproduce pointer holds.
- **A9 / gates MET:** lint (116 files), typecheck and build rc 0. `npm test` rc 0, 59 / 1987, and `last-run.json`
  reads success with 0 failed, 0 pending and 0 todo. Skip count 0, and `--skip-count 0` gives `No findings.` rc 0.
  `biome.json` is unchanged. No timing was taken.
- **Limbs 2/3 by hand:** on `BIN-NUL` and `BIN-ATTR`, head equals `341da4c1` on X1 with plant ids masked. It differs
  from `341da4c1` on the same plant only in `production files changed: 0` → `1` plus the file line.
- **Re-planted independently.** QE ran 14 own binary plants in a scratch clone at `e0bc26fe`; each NUL plant was
  confirmed binary via `--numstat`. Limb 1 FIRES on head on all 14:
  - NUL at end of file, in a widening's string, in a new holder `src/fen.ts`, base side only, and in a deleted holder.
    Limb 2 and limb 3 plants with a NUL also fire on their own limbs.
  - `binary` macro, one-file `-diff`, nested `src/.gitattributes`, the scratch clone's own `.git/info/attributes`,
    and clone-local `core.attributesFile`.
  - `diff=<drv>` with `binary=true`, and textconv.
  - Base is silent on every one except textconv (counts 6/12). This resolves the Architect's `UNKNOWN - verify` on
    `core.attributesFile`.

**`AR-188-BINARY`: the close condition is MET.** QE's read of A2–A7 shows both plants fire at head and are silent on
base's instrument, as `…f5843a71` § 3 and ADR (iii) require. The Orchestrator records the close. The `--numstat`
stand-in may retire at merge (ADR (ii)), and it covered nothing the instrument now misses.

**Waiver and stand-in, verbatim:**
- `git diff --name-only 01836fff e0bc26fe | grep -v '\.test\.ts$' | grep '^src/'` printed nothing (rc 1). It also
  prints nothing per commit, for `56d7215f`, `11245e3d`, `6b79aa51`, `797a238b` and `e0bc26fe`.
- `git diff --numstat 01836fff e0bc26fe -- src | awk '$1=="-"'` printed nothing.
- UAT is waived (0 production lines). A waiver is not a signature.

**Gaps**
- **`QE-191-a` LOW (QE's rating; Security/NFR rates it, Architect/Design fixes it in a new ticket if wanted):** the one
  diff call still takes the operator's external-diff, colour and prefix settings.
  - An external diff driver (`diff=<drv>` plus `diff.<drv>.command`), `GIT_EXTERNAL_DIFF`, `color.diff=always`, or
    `diff.srcPrefix`/`dstPrefix` each blind every limb, on head and on base.
  - All of them need config or env; this host sets none.
  - The stand-in never caught them either. This is beyond `AR-188-BINARY`'s term.
  - Candidate flags (not tried; `UNKNOWN - verify`): `--no-ext-diff`, `--no-color`, `--src-prefix=a/ --dst-prefix=b/`.
- **`QE-191-b` INFO:** a non-ASCII production file name is quoted by `core.quotePath` in `ls-tree` and `diff`, so it
  is unseen on head and base. Once a production file imports it, the unresolved-edge fail-safe fires.
- **`QE-191-c` INFO (the `R-188-b` class):** `BIN-NUL` does not assert that its NUL applied; a drifted JSDoc line
  would silently re-run X1. Reading rule: `BIN-NUL` must read 2/4. `R-191-a` is confirmed cosmetic.

**Fences:** no breach. Plants and config were only in scratch clones under a private `TMPDIR`. The repository's and
the worktrees' `.git/info/attributes` and git config were never touched. There was no push, no `--force`, no
`--amend` and no rebase. Nothing was merged into `main`. `../wt-ABC-176` and `grugops/ABC-176` were not touched.
One stray: a lint log was briefly written to `/tmp/qe191-lint.txt` (not the scratchpad) and deleted at once.

**Trace row (for the Orchestrator to append; 10 cells):**
`| ABC-191 (QE) | QE gate on the AR-188-BINARY fix: A1–A9 by own runs at the merge of main; A2/A3 red as specified, A4 12/12; A5 2/4 and 1/3; A6 TXC 1/3; A7 one diff call with --text --no-textconv; 14 own binary plants fire | — | — | AR-188-BINARY (close condition met), ADR-0036, QE-191-a (LOW), QE-191-b (INFO), QE-191-c (INFO), R-188-b, R-191-a | grugops/qe-ABC-191 @ b5ac124d (from 797a238b; merge of main cde60d03 = e0bc26fe)<br>ABC-191 page (## QE); .grugops/context/qe-ABC-191/ | A2 rc 1 (BIN-NUL BIN-ATTR; 4 limbs DIFFER); A3 rc 1 / rc 0; A4 rc 0, 12/12, 22 identical; lint, typecheck, build rc 0; npm test 59 files / 1987, last-run success; skip-count 0 "No findings." | waiver (0 production lines) | — | PASS_WITH_GAPS; In Review → next (Orchestrator's move) |`
