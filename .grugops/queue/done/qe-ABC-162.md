---
subtask: qe-ABC-162
role: qe-e2e
ticket: plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
ref: .grugops/context/qe-ABC-162/
branch: grugops/ABC-162 (tip 3d05e230; base 51503331); SE worktree ../wt-ABC-162 (read only)
width: 3 (beside qe-ABC-160 and ticket-to-pr-ABC-159; other worktrees, other files)
---

# QE gate for ABC-162. Its close also closes AR-095-CWD.

## Do
- **Re-plant.** Verify A1–A4 against the page. Re-plant P6b, the cwd-relative book read, yourself in scratch copies **outside** the repository, testing it at base and at head. Base must be green and head red, at `A7`. Add any further wrong build you think the new row should kill.
- **Independence.** Do not copy the SE's readings (`.grugops/context/ticket-to-pr-ABC-162/`). You may read its decision note `…fb754378` for the design only.
- **Temp directories.** Check that the per-run `mkdtemp` directory is removed by exact path. Parallel agents also create temp directories, so don't count by glob.
- **Gates.** Re-run on the tip: lint, typecheck, build, `npm test`, `last-run.json` success, skip-integrity `--skip-count 0`, `CLI_DEEP`, `PERFT_DEEP`. Every vitest call takes `NODE_OPTIONS=--max-old-space-size=400`, one at a time.
- **UAT waiver.** Measure it: `git diff --name-only 51503331...3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'`.
- **SE leftover `…cdcaf82a`.** `AGENTS.md:123-126` says "Two real children" but the lane starts 6. Grade whether it is stale and route it (Scribe). Do not edit it.
- **Verdict.** Return PASS / PASS_WITH_GAPS / FAIL with a gap register.

## Fences
- Work in your own worktree `../wt-qe-ABC-162` on a branch from the tip. Commit typed notes and a QE section on the ABC-162 page there.
- No production files, `plans/board.md`, `AGENTS.md`, or other ticket pages. No timing.
- Never merge, push, `--force`, `--amend` or rebase.

## Publish
- Seal the notes with `/Users/olgeroeselg/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/context-io.js` (`admitAndAppend`, task `qe-ABC-162`).
- Finish with `.grugops/queue/done/qe-ABC-162.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result (qe-e2e, 2026-10-21 08:23Z): **PASS_WITH_GAPS**. Commit `91f18689` on `grugops/qe-ABC-162` (from tip `3d05e230`; worktree `../wt-qe-ABC-162`)

- One commit: 5 sealed notes plus a `## QE` section on the ABC-162 page.
- No production file, `plans/board.md`, `AGENTS.md` or other ticket page was touched.
- No push, merge, force, amend or rebase. No timing was taken.

### Grades (QE's own readings; the SE readings `…9e1095de` / `…7afc0e5a` were not opened)
| criterion | grade | reading |
|---|---|---|
| `A1` | MET | A7 child `(cwd /var/folders/…/T/abc162-neutral-cwd-fDJ6Bw) … wt-qe-ABC-162/src/cli.ts --colour white --ascii`; no `data/`; `CLI_DEEP` 11/11; A7 stderr 0 B, exit 0 |
| `A2` | MET | P6b: base test **11/11 green**, head test **10/11 red on `A7` only**, at `expect(booked.stderr).toBe("")`. The child prints `opening book could not be read; playing on without it` (54 B) |
| `A3` | MET | each `mkdtemp` return is removed by that exact path (fs trace): after green, after the P6b red, and when `beforeAll` throws (hang plant). 0 lane-made entries survive |
| `A4` | MET | `git diff --name-only` lists only `src/cli.real-engine.test.ts`; production grep empty; `npm test` 59/1987 base = tip, 0 skips; `CLI_DEEP` 11 = base; 6 children = base |

### Plants (scratch copies outside the repo; only `src/book-file.ts` replaced)
- **Green → red on `A7`:** P6b (cwd-relative), P6c (`resolve(process.cwd(), …)`) and P6e (walk up from cwd).
- **Survives (G-1):** P6f (cwd first, module-URL fallback), green at base and at head.
- **Scratch decoy-row probe** (a non-book file at `data/opening-book/book.json` inside A7's neutral cwd): clean green; P6b and P6f red on `A7`. 0 new spawns.

### Gates (tip, in the QE worktree, one at a time)
| gate | result |
|---|---|
| lint | rc 0 |
| typecheck | rc 0 |
| build | rc 0 |
| `npm test` | rc 0, 59 files / 1987 tests |
| `last-run.json` | `success: true`, 0 pending |
| skip-integrity `--skip-count 0` | `No findings.` |
| `CLI_DEEP` | 11/11 |
| `PERFT_DEEP` | 32/32 |

- Every vitest call carried `NODE_OPTIONS=--max-old-space-size=400`.
- `npm test`'s script substitutes its own 128 for the suite.

### UAT waiver (measured)
`git diff --name-only 51503331...3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'` is **empty**, so the change is test-only and the waiver holds.

### Gap register
- **G-1 (LOW).** The P6f fallback form of `AR-095-CWD` passes the head test.
  - **Fix measured in scratch:** a decoy book in the existing neutral cwd.
  - **Route:** Security/NFR, to rule whether `AR-095-CWD` closes outright or keeps P6f as a narrower residual; then BA/PM if a ticket is wanted.
- **G-2 (LOW).** The kill rests on A7's one stderr assertion, because the engine's searched reply to 1. e4 (`d6`) is itself a book entry. Route: the next hop on A7, for a comment naming the detector.
- **G-3 (INFO).** The kill assumes `os.tmpdir()` lies outside the tree. No action.
- **G-4 (LOW, pre-existing).** SE leftover `…cdcaf82a` is graded **STALE**:
  - `AGENTS.md:123-126` says "Two real children of `node src/cli.ts --colour black --ascii`", but the lane starts 6, at base and at tip: 5 `src/cli.ts` sessions and 1 `node -e` heap probe.
  - The drift is not from this ticket. It entered with `ABC-095`, `ABC-101` and `ABC-173`.
  - **Route: AGENTS.md Scribe.** Not edited here.

### Notes (task `qe-ABC-162`, sealed by `context-io.js` `admitAndAppend`, all read back by `readContext`)
- `20261021T082200Z-qe-e2e-observation-865e9bc6`: criteria and gates.
- `20261021T082210Z-qe-e2e-observation-567002e7`: plant matrix and decoy probe.
- `20261021T082220Z-qe-e2e-observation-df4fc9ed`: temp directories by exact path.
- `20261021T082230Z-qe-e2e-observation-315eb7f0`: AGENTS.md leftover grade and route.
- `20261021T082240Z-qe-e2e-decision-68554c31`: verdict and gap register.

### Process remarks
- The session scratch path `…/scratchpad/abc162/` already held the SE's files (logs, note drafts, `admit.mjs`). My first `git archive` extraction created 10 copy directories there, which I moved to `…/scratchpad/qe162/` before any run.
- The SE's files were neither read nor changed.
- A first `npx vitest --version` in the QE worktree, before `node_modules` was linked, fetched vitest 5.0.5 into the npx cache. It ran nothing else. Every lane run used the pinned 4.1.11.

### Board
`ABC-162` leaves `In Review` QE-green toward Security/NFR (the `AR-095-CWD` close ruling with G-1). UAT is waived. The Orchestrator makes the move.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| ABC-162 (QE) | A7's booked child runs from a fresh mkdtemp cwd; P6b/P6c/P6e green → red on A7 stderr; P6f survives (G-1); exact-path cleanup incl. failing hook; qe-ABC-162 …68554c31 | AR-095-CWD / QE-095-a | grugops/ABC-162 @ 3d05e230 (base 51503331); QE grugops/qe-ABC-162 @ 91f18689 | src/cli.real-engine.test.ts (test-only; 0 production lines) | lint/typecheck/build rc 0; npm test 59/1987 = base, 0 skips; skip-integrity 0; CLI_DEEP 11/11; PERFT_DEEP 32/32; UAT waiver: non-test src list empty | QE PASS_WITH_GAPS: A1–A4 MET; G-1 P6f fallback (Security/NFR), G-2 single-assertion kill, G-3 info, G-4 AGENTS.md stale (Scribe) |
