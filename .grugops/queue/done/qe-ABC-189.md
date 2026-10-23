---
subtask: qe-ABC-189
role: qe-e2e
ticket: plans/tickets/ABC-189-nothing-pins-the-value-of-package-json-bin-so-bin-pointing-at-src-uci-ts-passes-every-test.md
ref: .grugops/context/qe-ABC-189/
branch: grugops/ABC-189 (tip 91883f94; code deb555d2; base 823a9885); worktree ../wt-ABC-189 (read only)
width: 3 (beside qe-ABC-190 and bapm-rule-QE-178)
---

# QE gate for ABC-189: one assertion pins `package.json` `bin` to `{ skytalix: "dist/uci.js" }` in `ABC-042` A10. Your red read of A2 closes AR-168-BINPIN

## Do
- Create your own worktree `../wt-qe-ABC-189` on `grugops/qe-ABC-189` from the tip. **Merge the current `main` into it first** (a merge, not a rebase) and report the merge sha.
- Verify A1–A4 with your own runs **before** opening the SE's notes (`…96c58135`, `…5098b7a3`, `…36feef6a` on the branch).
- **A2 red read, independently:** on scratch exports (full `node_modules`; never edit the real `package.json`), every wrong `bin` the page names goes red at the tip on A10 alone and passes at base. Build plants of your own beyond the page: `bin` as a bare string, an extra second key, a missing key, `./dist/uci.js`, a wrong command name. Say for each whether the assertion catches it and whether it should.
- ABC-187 A5's closer count stays 9; the `AGENTS.md` byte guard is untouched.
- Gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` success; skip-count capture as spelled → `test-skip-integrity.js`. Heap 128 multi-file, 400 one-file. No timing.
- UAT waiver form must print nothing.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register (`QE-189-x`). Say whether AR-168-BINPIN's close condition is met.

## Fences
- Work only in `../wt-qe-ABC-189` and scratch exports. Commit typed notes inside your worktree (context root: `../wt-qe-ABC-189/.grugops/context`) and a `## QE` section on the ABC-189 page there.
- No edits to `src/` on the tip, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, other pages. Do not touch other worktrees. Never set git config. Never push, `--force`, `--amend` or rebase; never merge into `main`. Keep temp files in your scratch area, not `/tmp`.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-189`). Pass your worktree's `.grugops/context` explicitly. Every `at` from `date -u`. Include a `kind: decision`. Append-only.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/qe-ABC-189.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS_WITH_GAPS.**
- Gaps: `QE-189-a` (LOW, proposed), and `QE-189-b` and `QE-189-c` (INFO). None blocks, and none is against a criterion.
- Branch `grugops/qe-ABC-189` @ **`adf636f2`** (worktree `../wt-qe-ABC-189`, branched at the tip `91883f94`). `git merge-tree --write-tree main adf636f2` is clean against `main` `5aaf09ac`.

**Merges of `main`:**
1. `git merge main` (`823a9885`) gave `Already up to date`, so the first readings were at `91883f94`.
2. `main` moved to `66fd8e1b`, records only. I merged it at **`2022a8d8`**.
3. `main` moved to `11fc8c9c`: ABC-190 merged, `package-lock.json` +4. I merged it at **`32c20d02`**, my last merge.
- The gates and A2 were re-run at each merge and reproduce.
- `main` then moved to `5aaf09ac`, carrying `.grugops/` and `plans/` only. I did not merge again.

**Commits:**
- `d62767da`: 5 notes and the `## QE` section.
- `12063338`: 2 notes and a `## QE` line.
- `adf636f2`: 2 notes and a `## QE` line.
- No `src/`, package, `AGENTS.md`, board or traceability edits.

**Notes.** Sealed by `admitAndAppend` (grugops 2.1.0, task `qe-ABC-189`), with the context root `../wt-qe-ABC-189/.grugops/context` passed explicitly. `at` came from `date -u`, and the writer returned `findings` `[]` for all 9. There is no `finding`, because there was no §14 gate run.
- `20261022T153720Z-qe-e2e-observation-186419ff`: A1, A3 and A4.
- `20261022T153720Z-qe-e2e-observation-dac2aa03`: the A2 plant table.
- `20261022T153720Z-qe-e2e-observation-f3106f00`: QE-189-a and QE-189-b.
- `20261022T153720Z-qe-e2e-observation-c55e148e`: gates, closers, the byte guard, the waiver, and the SE comparison.
- `20261022T153720Z-qe-e2e-decision-1067b881`: the verdict at `91883f94` (superseded).
- `20261022T153920Z-qe-e2e-observation-d91bb60e`, `…decision-449bc365`: the re-merge at `2022a8d8` (superseded).
- `20261022T154204Z-qe-e2e-observation-340a360e`, `…decision-b2012318`: the re-merge at `32c20d02`, QE-189-c, and the standing verdict.

**Criteria.** All are my own runs, taken before I opened the SE's `…96c58135`/`…5098b7a3`/`…36feef6a`, which agree on every shared number.
- **A1 MET.** At head, `AR-168-BINPIN` gives 1 and `skytalix: "dist/uci.js"` gives 1; at base, 0 and 0. The line is `src/cli.test.ts:1823`, under `expect(packaged.private).toBe(true);`.
- **A2 MET.**
  - The real file is `1 passed`.
  - `(iv-b)` is `1 failed`, with `package.json bin (AR-168-BINPIN): expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }`.
  - `(iv-a)` is `1 failed`.
  - All three are `1 passed` at base `823a9885`.
  - This held with symlinked and with copied (`cp -a`) `node_modules`, and at `91883f94`, `2022a8d8` and `32c20d02`.
  - On `(iv-b)` the whole suite gives 1 failed / 1994 passed, and the only red is A10. At base it is 60/1995 green.
- **A3 MET.** 60/60 and 1995/1995 at head and at base; `success` true; skip count `0` → `No findings.`
- **A4 MET.** Only `src/cli.test.ts` (`1 0`) beside the SE's notes. The waiver form prints nothing over `823a9885..91883f94`, `deb555d2~1..deb555d2` and `main..32c20d02`.
- ABC-187 A5: the closer count is 9, and `:2245` says 9. `AGENTS_MD_BUDGET_BYTES = 18_432` is unchanged, and `AGENTS.md` is byte-equal (16,305 B).

**Per-plant (`-t "A10 — package.json"`, heap 400; head / base):**

| plant | head | base | fires on | npm 11.20.0 reads | should it go red? |
|---|---|---|---|---|---|
| real | green | green | — | same | no |
| (iv-b) src/uci.ts | **red** | green | pin :1823 | src/uci.ts | yes |
| (iv-a) dist/cli.js | **red** | green | pin | dist/cli.js | yes |
| bare string | red | green | pin | {skytalix: dist/uci.js} | no; harmless (QE-189-b) |
| extra second key | red | green | pin | 2 commands | yes |
| `{}` | red | green | pin | none | yes |
| bin removed | red | red | key list :1818 | none | yes (already held at base) |
| ./dist/uci.js | red | green | pin | dist/uci.js | no; harmless (QE-189-b) |
| wrong name skytalix-uci | red | green | pin | skytalix-uci | yes |
| Skytalix | red | green | pin | Skytalix | yes |
| dist/uci.ts | red | green | pin | dist/uci.ts | yes |
| trailing space | red | green | pin | "dist/uci.js " | yes |
| dist\uci.js | red | green | pin | dist/uci.js | no; harmless (QE-189-b) |
| array | red | green | pin | {uci.js: …} | yes |
| duplicate key, real last | green | green | — | dist/uci.js | no (correct) |
| duplicate key, real first | red | green | pin | src/uci.ts | yes |

**Gates** at `32c20d02` (also at `91883f94` and `2022a8d8`):
- lint, typecheck and build give rc 0 (`dist/uci.js` has a shebang);
- `npm test` gives rc 0, 60/60 and 1995/1995, with `success` true;
- the skip capture as spelled gives 0 → `No findings.`;
- heap was 128 multi-file and 400 one-file, and there was no timing.

**Gaps:**
- **QE-189-a (LOW, proposed).** The pin fixes `bin`'s string, not its target.
  - `tsconfig.build.json` `outDir` → `build` passes lint, typecheck, build and 60/1995 while `bin` dangles.
  - Route: BA/PM. Either it goes onto AR-168-BINPIN's trigger list (the packaging ticket owes "build emits what `bin` names"), or an XS pin of `outDir`/`files`.
- **QE-189-b (INFO).** Three npm-equivalent spellings go red. That is safe, and no action is needed.
- **QE-189-c (INFO).** The lock root's `bin` (ABC-190) is unpinned, and a lock-only drift passes 60/1995. No install effect is known (`UNKNOWN - verify`). It is outside the fence.

**AR-168-BINPIN.** The close is "the pin lands and QE reads it red on (iv-b)" (`…75a45be0` § 5).
- The QE red read is done.
- "Lands" is the human merge of `grugops/ABC-189` into `main`. The risk closes at that merge, and the Orchestrator records it.

**UAT.** Waived: 0 production lines.

**Trace row** (for the Orchestrator):
`| ABC-189 (qe-ABC-189) | QE: A1–A4 met on own runs at 91883f94, 2022a8d8 and 32c20d02; (iv-b)/(iv-a) red at head on the pin alone, green at base; 11 of 13 own plants red on the pin | EPIC-007 | — | AR-168-BINPIN (QE red read done; closes on merge); QE-189-a LOW, QE-189-b/-c INFO | grugops/qe-ABC-189 @ adf636f2<br>src/cli.test.ts | lint/typecheck/build 0; 60 files / 1995 tests; skip 0, No findings. | UAT waived (0 src/ lines) | — | PASS_WITH_GAPS |`
