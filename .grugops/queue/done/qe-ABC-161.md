---
subtask: qe-ABC-161
role: qe-e2e
ticket: plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
ref: .grugops/context/qe-ABC-161/
branch: grugops/ABC-161 (tip 5e755bcb; code ee1818bb; base 35788fd4); SE worktree ../wt-ABC-161 (read only)
width: 1
---

# QE gate for ABC-161 (three rows in `src/cli.test.ts`; 0 production lines)

## Do
- Verify A1–A4 against the page as re-worded by BA/PM (`bapm-rework-ABC-161`, `…b0020834`). **Re-plant every row yourself**, base test vs head test, scratch copies outside the repo, private `TMPDIR`:
  - **A1:** P11-L1, P11-L2, P11-L3 green → red (3 of 3); P11 and P11-L4 red on both. The row's non-vacuity block is kept.
  - **A2:** S2c green → red; `resolveOptions(["--difficulty", "3\n"])` refused with `offending: ["3\n"]` on the delivered build.
  - **A3:** P9a–P9e green → red (5 of 5) on scratch copies of `AGENTS.md`; the real `AGENTS.md` green on head.
- **Grade the new set-equal check (fix 3) beyond the plants.** It derives each option's values by calling `resolveOptions` and reads the documented list as the `|`-joined run after the option (`expect(lists.length).toBe(1)`). Find what it is blind to or over-strict about (e.g. a value list re-worded with spaces, an option that takes a value but has no `|` list, a single-value list). Record survivors with their severity.
- **A1's comment claims** seed 7 draws 0.0117, 0.0620, 0.9769 and that a rebuild at any level 1–4 differs by call 2. Check that claim against the code, not the SE's notes.
- **Independence.** Do your own plants and readings before opening the SE's (`.grugops/context/ticket-to-pr-ABC-161*/` on the branch).
- **A4 fences:** exact file list; every changed line inside the three named `it` blocks; test counts equal base (59 / 1987), skips 0.
- **Gates** on the code tip: lint, typecheck, build; `npm test` + `last-run.json` success; skip-integrity `--skip-count 0`; `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-161` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-161 page there.
- No production files, `AGENTS.md`, `plans/board.md`, or other ticket pages. Plants only in scratch copies.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-161`). **Pass your worktree as the context root explicitly**; the writer's default root is the plugin's own directory. Take every `at` from `date -u`.
- Write `.grugops/queue/done/qe-ABC-161.md` (brief + `## Result` + trace row as one `| ABC-161 | … |` line) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 11:13Z): **PASS_WITH_GAPS**. Commit `cfd998ef` on `grugops/qe-ABC-161` (from tip `5e755bcb`; worktree `../wt-qe-ABC-161`)

- One commit: 6 sealed notes (task `qe-ABC-161`) plus a `## QE` section on the ABC-161 page.
- No production file, `AGENTS.md`, `plans/board.md` or other ticket page was touched. Every plant was in a scratch copy outside the repository.
- No push, merge, `--force`, amend or rebase. No timing was taken.

### Grades (QE's own plants and reads; the SE's notes were opened afterwards and agree cell for cell)
| criterion | grade | reading (whole default lane, heap 128, base `35788fd4` test vs head `ee1818bb` test) |
|---|---|---|
| `A1` | MET | P11-L1, L2, L3: 1987/1987 on base, red on head at `A8′` "level N, call 2", 3 of 3. P11 and P11-L4 red on both (base "level 4, call 1"; head P11 "level 1, call 2", P11-L4 "level 4, call 1"). Non-vacuity block untouched and green |
| `A2` | MET | S2c: green on base, red on head at `ABC-101` `A3` (`"3\n"` resolved `ok: true`). Delivered resolver: `resolveOptions(["--difficulty","3\n"])` is `{ok:false, offending:["3\n"]}` |
| `A3` | MET | P9a–P9e: green on base, red on head at `ABC-065` `A3`, 5 of 5. The real `AGENTS.md` is green |
| `A4` | MET (on intent) | Outside `.grugops/context/` the diff is only `src/cli.test.ts`. Every hunk is inside the three named `it` blocks. 59/1987 = base (QE-measured), skips 0, `CLI_DEEP` 11/11. Literal wording: `QE-161-d` |

### A1's comment claim, checked against the code
- `seededRandom(7)` draws 0.011705, 0.061958, 0.976908 (0.699029 next).
- With `createLevel`'s `random() < blunderRate`, a per-move rebuild first differs at call index 2 for levels 1–3 and at index 1 for level 4. Level 5 cannot differ (rate 0).
- The plants show each differing decision is also a differing move. The claim holds in the row's zero-based `call` label.

### Fix 3 graded beyond the plants (12 probes, head row, heap 400)
- **Survivors, which pass with a wrong list:**
  - `--difficulty 1|2|3|4|5|`
  - `…5|+3`
  - `…5 |6`
  - `--colour white|black|random-ish`
  - `…5.5`
  - `…random|+black`
- Why: `${option} (\w+(?:\|\w+)+)` has no right-hand delimiter, so the capture stops at the first non-word character.
- **Red, loud:** a spaced, slashed or ranged list (count 0); a duplicate word (multiset compare); and `…5|0x6`. A single-value option would red on a correct slot (hypothetical; no such option).

### Gates (tip `5e755bcb`; code tree = `ee1818bb`; one at a time)
| gate | result |
|---|---|
| lint / typecheck / build | exit 0 / 0 / 0 |
| `npm test` (128) | exit 0, 59 files / 1987 tests |
| `last-run.json` | `success` true, 1987 total, 0 failed, 0 pending, 0 todo |
| base counts (QE-measured, scratch tree with the `35788fd4` test) | 59 / 1987: equal |
| skip count / skip-integrity `--skip-count 0` | 0 / `No findings.`, exit 0 |
| `CLI_DEEP` (400) | 11/11 |
| `PERFT_DEEP` (400) | 32/32 |

### UAT waiver (measured, AGENTS.md form, `.snap` not filtered)
- `git diff --name-only <d>~1 <d> | grep -v '\.test\.ts$' | grep '^src/'` is **empty** for `ee1818bb` and for `5e755bcb`, and so is the range from `35788fd4`.
- 0 `.snap` files changed. The waiver condition holds; applying it is the Orchestrator's job.

### Gap register (none blocks; none is against a criterion)
- **`QE-161-a` (LOW; route SE via BA/PM; fold into the next ticket that edits `ABC-065` `A3` or the slot).** Fix 3's list capture does not read past the first non-word character. Six scratch survivors are listed above. It is not live.
- **`QE-161-b` (INFO; BA/PM).** The row now requires the `|`-joined form, and the slot's WRITING RULES do not say so. Equivalent re-wordings and single-value lists red loudly.
- **`QE-161-c` (INFO; comment wording).** The row's last line compares the resolver's accepted sets, not the documented lists. "Every value word belongs to some documented list" holds only through the per-option equality.
- **`QE-161-d` (INFO; BA/PM wording).** A4's literal `git diff --name-only <base>` lists 11 files at the tip: `src/cli.test.ts` plus the SE's 10 context records. Same shape as `QE-182-d`.
- **`QE-161-e` (INFO; covered by the page's `P2` trigger on a `LEVELS` re-cut).**
  - Fix 1 discriminates a rebuild at a level only while its `blunderRate` is in (0.0117, 0.9769].
  - A level re-cut to ≤ 0.0117 would be blind there, and the row does not pin the window.

### Notes (task `qe-ABC-161`, sealed by `context-io.js` `admitAndAppend` with the worktree's context root passed explicitly; read back 6 of 6 by `readContext`; `render` run)
- `20261021T111252Z-qe-e2e-observation-9862b07f`: A1–A3 plant readings, the draws, A2's direct reading and the SE cross-check.
- `20261021T111252Z-qe-e2e-observation-50dc68dd`: fix 3 probes.
- `20261021T111252Z-qe-e2e-observation-12b5933f`: gates, A4 fences and the waiver measurement.
- `20261021T111252Z-qe-e2e-observation-4effc473`: gap register.
- `20261021T111252Z-qe-e2e-decision-cd61c6fd`: verdict. `qe-hop-integrity.js --ticket ABC-161` reports "covered (qe-e2e)" from the worktree.
- `20261021T111252Z-qe-e2e-observation-0b9536c1`: artifacts and the trace row. It is an observation, because an `artifact-ref` needs a `gate_run`.

### Process remarks
- The claim directory was empty on arrival. The brief was moved pending → claimed → done by `claim.js` `transition` at 11:13:32Z, and the empty claim directory was removed with `rmdir`.
- The worktree holds an untracked `node_modules` symlink to the main checkout's, the same as the SE's worktree. It is not committed.
- The main checkout's `git status --porcelain` was empty after all plants and before this file was written.

### Board
`ABC-161` may leave `In Review`. It is test-only with no Security trigger, and `NFR-008` is 0/0/0 (59/1987 at base and tip). UAT is next, and the measured waiver covers it. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-161 (QE) | three `src/cli.test.ts` rows sharpened (ABC-101 A8′ equivalence, ABC-101 A3 refused values, ABC-065 A3 value lists); qe-ABC-161 …decision-cd61c6fd | QE-101-a, QE-101-b, SEC-101-a; QE-161-a..e | grugops/ABC-161 @ 5e755bcb (code ee1818bb, src/cli.test.ts only, 0 src lines) | 0 tests added; 11 plants re-planted base vs head: P11-L1..L3 3/3, S2c, P9a-e 5/5 green→red, P11/P11-L4 red both; fix-3 probes: 6 survivors; npm test 59/1987 = base, skips 0; CLI_DEEP 11, PERFT_DEEP 32 | QE PASS_WITH_GAPS (QE-161-a LOW; -b..-e INFO); UAT waiver reading empty (0 production lines) | grugops/qe-ABC-161 @ cfd998ef |
