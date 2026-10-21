---
subtask: qe-ABC-179
role: qe-e2e
ticket: plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
ref: .grugops/context/qe-ABC-179/
branch: grugops/ABC-179 (tip a7d64e07; code dd131b71; base ccccc6bb); SE worktree ../wt-ABC-179 (read only)
width: 3 (beside ticket-to-pr-ABC-180 and -163)
---

# QE gate for ABC-179 (comment lines only)

## Do
- Verify A1–A4 against the page. Two reads are yours:
  - **A2:** none of the three sentences that name the catalog contains a quoted span, and each is true to `plans/nfr-catalog.md` (`:25`, `:49`, `:555-556`).
  - **A3:** the `A12` comment's new pointer `expect(runtimeImporters).toEqual(` lands on the right equality.
- **Independence.** Read the four rewritten comments yourself before opening the SE's readings (`.grugops/context/ticket-to-pr-ABC-179/` on the branch). Check that no new claim got in. Use QE-159-a's lens: no universal the source doesn't support.
- **A4.** Confirm the diff is exactly four files and that every changed line is inside a comment. No executable line may change: compare the code with comments stripped, base vs head.
- **Gates** on the code tip:
  - lint, typecheck, build;
  - `npm test` + `last-run.json` success;
  - skip-integrity `--skip-count 0`;
  - `CLI_DEEP` and `PERFT_DEEP`.
- **Heap rule:** 400 for one-file runs, 128 for whole-suite or multi-file runs, one at a time. Take no timing.
- **UAT waiver:** measure it in AGENTS.md's form. Do not filter out `.snap`.
- **Verdict:** PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-179` on a branch from the tip.
- Commit typed notes, written inside your worktree, and a `## QE` section on the ABC-179 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `qe-ABC-179`).
- Write `.grugops/queue/done/qe-ABC-179.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 09:13Z): **PASS_WITH_GAPS**. Commit `2873e1ed` on `grugops/qe-ABC-179` (from tip `a7d64e07`; worktree `../wt-qe-ABC-179`)

- One commit: 5 sealed notes plus a `## QE` section on the ABC-179 page.
- No production file, `plans/board.md`, `AGENTS.md` or other ticket page was touched.
- No push, merge, force, amend or rebase. No timing was taken.

### Grades (QE's own readings; the comments and the catalog were read before the SE notes were opened)
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | the page command prints the san sentence at base and nothing at head |
| `A2` | MET | the command prints 2 sentences at base and nothing at head. QE read: no quoted span in the 3 catalog-naming sentences. San's attributions are at `nfr-catalog.md:555-556` (held by nothing) and `:552-554`/`:558` (the count). The two headers credit the catalog only with the move (`:25`, `:49`). Their headroom figures trace to `ABC-016:365` and `ABC-017:771` |
| `A3` | MET | grep exits 1 (base: `cli.test.ts:1831`). The prefix `expect(runtimeImporters).toEqual(` reaches `:390` (the equality) first and `:511` (`R5` pin) second |
| `A4` | MET | exactly 4 files, 2/2 and 3/3 (`cli.test.ts` net 0); all changed lines are header or `A12` `//` lines; with `removeComments`, all 98 `src/*.ts` print identically at base and head (a planted code change shows DIFF); per-file counts `cmp` 0 (59/1987, 0 skips, heap 128, same worktree) |

### Gates (tip `a7d64e07`, `src/` = code `dd131b71`; one at a time)
| gate | result |
|---|---|
| lint / typecheck / build | exit 0 / 0 / 0 |
| `npm test` | exit 0, 59 files / 1987 tests |
| `last-run.json` | `success` true, `exitCode` 0, 0 failed, 0 pending, 0 todo |
| skip-integrity `--skip-count 0` | `No findings.`, exit 0 |
| `CLI_DEEP` (400) | 11/11 |
| `PERFT_DEEP` (400) | 32/32 |

### UAT waiver (measured, AGENTS.md form, `.snap` not filtered)
- `git diff --name-only dd131b71~1 dd131b71 | grep -v '\.test\.ts$' | grep '^src/'` is **empty**. So are the tip commit and `ccccc6bb..a7d64e07`.
- 0 `.snap` files changed. The waiver condition holds; applying it is the Orchestrator's job.

### Gap register
- **`QE-179-a` (INFO, pre-existing, outside scope).** `src/status-panel.nfr.test.ts:10-12` says the `vi.mock` file-scope lesson is "recorded in the catalog". It is not found in `plans/nfr-catalog.md` under the phrasings tried, so `UNKNOWN - verify` for other wordings. Same class as `QE-159-d`. A2 does not reach it (no path named), and Scope 4 fences the line. **Route: BA/PM.**
- **`QE-179-b` (INFO).** `A12`'s span ends in U+2026, so a verbatim search of the whole span finds 0 lines; the prefix finds `:390`. The ticket uses the same elision. No route.

### Notes (task `qe-ABC-179`, sealed by `context-io.js` `admitAndAppend`, all 5 read back by `readContext`)
- `20261021T091200Z-qe-e2e-observation-65c508b3`: criteria readings and the comment-stripped compare.
- `20261021T091210Z-qe-e2e-observation-68bc7d95`: A2/A3 reads and the independence read.
- `20261021T091220Z-qe-e2e-observation-70d11a24`: gates and the waiver measurement.
- `20261021T091230Z-qe-e2e-observation-42fba2a4`: gap register.
- `20261021T091240Z-qe-e2e-decision-5603b830`: verdict.

### Process remarks
- **Method trap.** A bare `ts.createScanner` token compare desyncs at a template continuation (`cli.test.ts:1824`) and reports a false DIFF on `cli.test.ts`. Parse and print instead. This is recorded in `…65c508b3`.
- **Note `at` stamps.** I set them by hand at 09:12:00–09:12:40Z, but the seal ran at about 09:11Z, so they run up to roughly a minute ahead of the actual write. The content is unaffected; disclosed here rather than superseded.
- `node_modules` in the QE worktree is a symlink to the main checkout's (pinned vitest 4.1.11).
- The claim directory was empty on arrival (bare `mkdir` by the Orchestrator). The brief was moved pending → claimed → done by `claim.js` `transition` at 09:11:49Z, and the empty directory was removed.

### Board
`ABC-179` may leave `In Review`. Security is not triggered and `NFR-008` is 0/0/0, so UAT is next, and the measured waiver covers it. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-179 (QE) | three test comments say only what their source says: san clause re-attributed (`nfr-catalog :552-558`), two headers point at the move (`:25`, `:49`), `A12` pointer names the equality (`:390`); qe-ABC-179 …5603b830 | QE-159-a / QE-159-d / QE-159-e | grugops/ABC-179 @ a7d64e07 (code dd131b71, base ccccc6bb); QE grugops/qe-ABC-179 @ 2873e1ed | src/san.nfr.test.ts, src/status-panel.nfr.test.ts, src/history-pane.nfr.test.ts, src/cli.test.ts (comment lines only; 0 production lines; comment-stripped print identical) | lint/typecheck/build rc 0; npm test 59/1987 = base, 0 skips; skip-integrity 0; CLI_DEEP 11/11; PERFT_DEEP 32/32; UAT waiver: AGENTS.md form empty, 0 .snap | QE PASS_WITH_GAPS: A1–A4 MET; QE-179-a status-panel "recorded in the catalog" (pre-existing, BA/PM), QE-179-b ellipsis search key (info) |
