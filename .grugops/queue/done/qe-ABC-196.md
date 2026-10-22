---
subtask: qe-ABC-196
role: qe-e2e
ticket: plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
ref: .grugops/context/qe-ABC-196/
branch: grugops/ABC-196 (tip 0492a007; harness 6d15460b; base a7857e0b); worktree ../wt-ABC-196 (read only)
width: 1
---

# QE gate for ABC-196: each twin-referenced row of `r2-mutants.sh` (PP-TPL, PP-REDIR, RA-PLUS, PP-EDIT, SP-N5) asserts its expected limb 2/3 verdict, and a drift goes red naming `row:limb`. Harness only, 0 `src/` lines

## Do
- Create your own worktree `../wt-qe-ABC-196` on `grugops/qe-ABC-196` from the tip. **Merge the current `main` into it first** (a merge, not a rebase), run everything at that merge, and report the merge sha.
- Verify every criterion (A1–A7) against the page with your own runs **before** opening the Architect's notes (`…7cd5d10a`, `…d955ee60` on the branch).
- **Re-plant independently:** reproduce the base hole (D2, an `src/cli.ts`-only refactor, a dropped `leak()` each read 25 of 25 at rc 0 on today's harness), then the fixed harness reds each, naming only the silent rows. Build drifts of your own beyond those. In particular, probe the limit the builder declared: the guard checks the verdict word, not WHICH line fires, so a drift that leaves a limb firing on another line stays green. Measure whether such a drift is constructible against these five plants, and rate it.
- Head output byte-equal to today's harness at base (177 lines); `r2-mutants.out.txt` unchanged and still equal to a run at its tip; pre-ABC-195 instrument `2c0c1985e6607110` still gives `MISMATCH: RA-PLUS SP-N5` with the same 9-limb DIFFER line.
- Plants only in scratch clones (own `.git`, private `HOME`/`GIT_CONFIG_GLOBAL`/`TMPDIR`, `GIT_CONFIG_NOSYSTEM=1`). **Never** set git config or attributes in this repository, any worktree, or your real `HOME`; never touch `node_modules/` in main's checkout. Use `/usr/bin/diff`.
- **Gates** at your merge: lint, typecheck, build; `npm test` + `last-run.json` success (base count at your merge); skip-count capture as spelled → `test-skip-integrity.js`. No timing.
- UAT waiver in the owner's form: `git -c core.quotePath=false diff --name-only <base> <tip> | grep -v '\.test\.ts$' | grep '^src/'` prints nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (ids `QE-196-x`, each with severity and a proposed route).

## Fences
- Work only in `../wt-qe-ABC-196`. Commit typed notes written inside your worktree (context root: `../wt-qe-ABC-196/.grugops/context`), and a `## QE` section on the ABC-196 page there.
- No edits to the harness, the instrument, ADRs, `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other ticket pages. Do not touch `../wt-ABC-196`, `../wt-ABC-168` or `../wt-qe-ABC-168`.
- Never push, `--force` (including `git worktree remove --force`), `--amend` or rebase; never merge into `main`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-196`). **Pass your worktree's `.grugops/context` as the context root explicitly.** Take every `at` from `date -u` (UTC). Include a `kind: decision`. Append-only; record artifacts as `observation` (no §14 gate run, no `finding`).
- Trace row (forward 10-cell rule): `| {ticket} ({hop}) | {what} | {EPIC or —} | {F or —} | {NFR/ADR/AR/finding ids or —} | {branch @ sha<br>files or —} | {gates/test counts or —} | {UAT verdict/waiver or —} | {release tag or —} | {column move or verdict} |`, exactly 10 cells, as a plain table line. Write your done record as `.grugops/queue/done/qe-ABC-196.md` (this brief plus a `## Result` section) and `.claim.md`, in main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS_WITH_GAPS.**
- Gaps: `QE-196-a` (LOW, proposed); `QE-196-b` and `QE-196-c` (INFO).
- None blocks, and none is against a criterion.
- Branch `grugops/qe-ABC-196` @ **`1c8d6990`** (worktree `../wt-qe-ABC-196`, branched at the tip `0492a007`). `git merge-tree --write-tree main 1c8d6990` is clean against `main` `5d3832ef`.

**Merges of `main`:**
- First, `git merge main` reported `Already up to date` (`main` was `a7857e0b`, the base), so the first readings were at `0492a007`.
- `main` then moved to `5d3832ef` (ABC-168 merged, with the new production file `src/uci.ts`). I merged it at **`35a2d708`** with no conflict.
- At `35a2d708` I re-ran the gates and 19 harness runs, and all reproduce. 46 harness runs in all; no timing.

**Commits:**
- `0c7307c3`: 4 sealed notes and a `## QE` section on the ABC-196 page.
- `1c8d6990`: 2 more notes (the re-merge, and a decision superseding the first) and the `## QE` update.
- No other edits. The harness, instrument, ADRs, `src/`, `AGENTS.md`, board and traceability were not touched.

**Notes.** Sealed by `admitAndAppend` (grugops 2.1.0 plugin cache, task `qe-ABC-196`). The context root was `../wt-qe-ABC-196/.grugops/context`, passed explicitly. `at` came from `date -u`, and the writer returned `findings` `[]` for all 6. There is no `finding`, because there was no §14 gate run.
- `20261022T142926Z-qe-e2e-observation-a8e8fbc8`: A1–A7 at `0492a007`;
- `20261022T142926Z-qe-e2e-observation-7e6804d4`: own drifts and the which-line probe;
- `20261022T142926Z-qe-e2e-observation-143f86d8`: gates, waiver, artifacts;
- `20261022T142926Z-qe-e2e-decision-fd211043`: verdict at `0492a007` (superseded);
- `20261022T144447Z-qe-e2e-observation-c6b997d0`: the re-merge at `35a2d708`;
- `20261022T144447Z-qe-e2e-decision-df052eb2`: the verdict at `35a2d708`, superseding `fd211043`.

**Criteria.** All are my own runs, read before I opened the Architect's `…7cd5d10a`/`…d955ee60`, which agree on every shared number.
- **A1 MET.** `r2-mutants.sh` plus this hop's records. `r2-mutants.out.txt` is unchanged, and it still equals a fixed-harness run at its tip `0dfd17b3`.
- **A2 MET.** Base's harness exits 0 at `25 of 25` on D2, at R and on L, at both merges.
- **A3 MET.** The fix exits 1 on each, naming only `PP-EDIT:limb2` (D2, R) or the 6 limbs of PP-TPL, PP-REDIR and RA-PLUS (L). The last line is the only difference from base's output.
- **A4 MET.** Fix vs base: 177 lines, `cmp` byte-equal at both merges. Lines 2–140 hash to `a00519f3ddcc2ca2` at `a7857e0b` and `1b87c526f22b01c7` at `35a2d708`; the latter adds one Ruling 2 holder, `src/uci.ts`, from ABC-168.
- **A5 MET.** The pre-`ABC-195` instrument `2c0c1985e6607110` gives rc 1, `MISMATCH: RA-PLUS SP-N5`, and the same 9-limb DIFFER line, plus one added line naming the same 9.
- **A6 MET.** D1, D3, D4 and D5 exit 2, naming PP-TPL, SP-N5, PP-TPL and PP-EDIT.
- **A7 MET.**
  - At `0492a007`: 59 / 1994. At `35a2d708`: 60 / 1995, equal to `main`.
  - Lint, typecheck and build exit 0; `success` true; skip count 0 → `No findings.`
- **UAT waiver.** The owner's form over `a7857e0b 0492a007` prints nothing, and so does `main..35a2d708`.

**`QE-195-a`: close condition met.**

**The declared "which line fires" limit is constructible (`QE-196-a`).**
- R3 / R3' (`3d26dff8` / `36f19186`) is a `src/cli.ts`-only refactor: `main` becomes an arrow `const`, and `printableOf` moves below it. tsc is 0, biome is clean, and the whole suite is green, so it would merge.
- On it, the fixed harness reads `25 of 25` at rc 0.
- Under the pre-`ABC-195` instrument, `PP-EDIT:limb2` is no longer named (9 → 8 limbs). PP-EDIT still FIRES, but on a line that now precedes the header-shaped line.
- The other three `++` rows still discriminate.
- Rating: LOW. It is the same trigger class as `QE-195-a`, but it narrows one row rather than silencing the class.
- Route: BA/PM records it, or cuts an XS harness hop. One shape: each `TW` row also requires the pre-`ABC-195` instrument not to read it as expected.
- `QE-196-b` (INFO): for the `pp` rows the limit needs a harness edit; SP-N5 was not made silent.
- `QE-196-c` (INFO): header cosmetics.

**Trace row** (for the Orchestrator):
`| ABC-196 (qe-ABC-196) | QE: A1–A7 met on own runs at 0492a007 and 35a2d708; own drifts E1/E2/E4 red as named; which-line limit constructible (R3) | — | — | QE-195-a closed; QE-196-a LOW, QE-196-b/-c INFO; AR-193-HUNKHDR | grugops/qe-ABC-196 @ 35a2d708<br>.grugops/context/design-F-072-1/probe/r2-mutants.sh | lint/typecheck/build 0; 60 files / 1995 tests; skip 0, No findings. | UAT waived (0 src/ lines) | — | PASS_WITH_GAPS |`
