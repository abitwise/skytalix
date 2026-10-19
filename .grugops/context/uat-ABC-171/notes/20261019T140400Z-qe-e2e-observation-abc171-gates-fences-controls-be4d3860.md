---
id: 20261019T140400Z-qe-e2e-observation-abc171-gates-fences-controls-be4d3860
kind: observation
by: qe-e2e
task: uat-ABC-171
at: 2026-10-19T14:04:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - NFR-008
  - R-167-1
  - R-171-1
  - grugops/ABC-171
  - grugops/uat-ABC-171
  - .grugops/context/uat-ABC-171/probe/controls.txt
  - 20261019T140000Z-qe-e2e-artifact-ref-abc171-uat-pack-f340102a
supersedes:
---

# `ABC-171` UAT: the gates at the tip, the fences, and the harness controls

This note is hand-authored and unsealed.

## Gates at `5dee231c` (worktree `../wt-uat-ABC-171`, before any UAT file was added)

- `npm run -s lint` → exit 0 (115 files). `npm run -s typecheck` → exit 0. `npm run -s build` → exit 0.
- `npm test` → exit 0 on the first run: 59 files, **1962/1962** passed.
- `.test-results/last-run.json`: `success: true`, `numTotalTests` 1962, passed 1962, failed 0, pending 0, todo 0,
  `runState` `exited`, `exitCode` 0, 0 unhandled errors.
- Integrity: `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → `No findings.`
  (exit 0).
- `git merge-tree --write-tree main HEAD` against main `e4150359` → exit 0, tree `90db2b04`, clean.
- After the probe files were added, lint (still 115 files: `biome.json` excludes `.grugops`) and typecheck were
  re-run, both exit 0.
- `node_modules` was an APFS clone of main's (`cp -c -R`), and `package-lock.json` is identical to main's.
- The lane's duration is not graded and not quoted. N8-LANE is OWED (R-171-1).

## Fences

- Waiver test: `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` → `src/uci-session.ts`
  (+97/−15 by `--numstat`). It is production code, so the UAT is conducted.
- A12: `git diff --name-only 55a1e223 5dee231c -- src` (from the merge base) → exactly `src/uci-session.test.ts`
  and `src/uci-session.ts`. From ABC-167's UAT tip `660a0d50` to `5dee231c`, `src/` differs in the same two files only.
- A11's text half was read at entry. The file has nine imports, all of them D2's modules. `book.ts` is imported only
  as `import type { BookProbe }`. There is no `process` object, no `Date.now` and no `Math.random`. The grep's one hit is the
  word "process" in the comment at `:253` ("read once per process"). R-167-1 stands as carried.
- `src/uci-session.ts` had md5 `0d63103d546fa1a2d983d183667fb98c` before the gates, before and after every harness
  run, and after the controls. The controls ran on scratch copies outside the repository.
- Untouched: `src/`, `AGENTS.md`, `package.json`, `vitest.config.ts`, `plans/board.md`, `plans/traceability.md`,
  and `../wt-ABC-171` (still clean at `5dee231c`). I did not touch `../wt-ABC-173`. Its HEAD moved from `48842a1f`
  to `840ebbf7` during this hop, which is the in-flight `ticket-to-pr-ABC-173` hop, not mine. I touched no process
  I did not start. Nothing was pushed or merged, nothing was self-signed, and no `uat/*.uat.spec.ts` was written.
- `node tools/grugops/qe-hop-integrity.js --ticket ABC-171` on the branch → `ABC-171: covered (qe-e2e).`, exit 0.
  It names `qe-ABC-171`'s `…9d61b7e3` and this task's `…b2794b17`. It also prints "ABC-171 is not a row in
  "## Done" of plans/board.md", which is informational and the Orchestrator's to act on.

## Harness controls (`probe/controls.txt`)

Thirteen controls ran on scratch copies of the tip, each with one edit to `src/uci-session.ts`. **12 are caught and 1
is missed by design:**
- C1, names case-sensitive: S2–S9, 540 checks.
- C2, the book only at rate-0 levels (QE S25): S3, S5, S7.
- C3, `OwnBook` off still warms: S2, S3, S4.
- C4, a seed drawn on every `go`: S3, S6, S7, S8, S9.
- C5, `ucinewgame` draws a seed: S8.
- C6, no level cap: S1, S2, S6, S7, S8.
- C7, no dropped-limit line: S6.
- C8, `infinite` on a hit does not hold: S7.
- C9, an invalid `OwnBook` sets `false` (QE S12): S2.
- C10, a `2^16` seed (QE S33): S6, 6 checks.
- C11, a range check instead of an own key (QE S07, ruling f4): S2.
- C12, `default 5` advertised while 3 plays: S1, S4, S9.
- **C13, `warm()` on every `isready`: missed.** It is an equivalent mutant from outside, because the probe's own
  memo holds `read` at 1 (QE's S45/S47 reading).

**Thin spots.**
- C5, C7, C8, C9, C10 and C11 are each caught by one scenario only, and C10 by just 6 checks. The lane's `A13a` row
  (QE S33) is the stronger pin for C10.
- C12 is caught by the exact `uci`-line checks, not by S1's "the advertised default is what plays" check, which
  compares with a fixed 3. For `ABC-174`, a pin that ties the line to `DEFAULT_LEVEL` is the better one
  (`UAT-171-c`).

## Lane cost (reported, not graded)

Default lane: +0 files, +0 rows, +0 spawns. Nothing was added to `src/` or to the suite. Outside the lane, each harness
run checks 503 answers over 677 `go` lines with 0 child processes. S10 runs 5.73M engine nodes. Runs on the tip:
- the harness 7 times: RUN-0; two pre-f3 pairs, all four sha256 `bdffbdd4…` (one pair is a reproduction because an
  edit had not applied); and the final RUN-1 / RUN-2, `f704c86b…`;
- S10 twice;
- one exploratory scratch script before the harness (blunder-path readings), which is not evidence;
- the 13 controls, plus one earlier batch that I stopped once C1 had finished and restarted after adding the f3 block;
- one gate pass.
**No wall-clock figure is reported.**
