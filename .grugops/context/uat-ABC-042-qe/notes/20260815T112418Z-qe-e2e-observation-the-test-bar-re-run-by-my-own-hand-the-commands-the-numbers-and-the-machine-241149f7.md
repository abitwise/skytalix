---
id: 20260815T112418Z-qe-e2e-observation-the-test-bar-re-run-by-my-own-hand-the-commands-the-numbers-and-the-machine-241149f7
kind: observation
by: qe-e2e
at: 2026-08-15T11:24:18Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - AGENTS.md
  - .grugops/test-skips.md
  - tools/grugops/test-skip-integrity.js
  - src/cli.test.ts
supersedes: 
---

# The test bar, re-run by my own hand — the command lines, the actual numbers, and the machine

**Nothing below is inherited.** The gate figures recorded at the merge (`856/856 on 30 files, skip 0,
integrity clean`) were re-measured rather than carried, because a coverage judgement that quotes
somebody else's run is a judgement about a document, not about a tree.

**This is an `observation`, not a `finding`, and a green run is NOT a stamp.**
`context.human_admission` is `off` on this install; no `finding` kind and no `§14-gate#<id>` verdict
is admissible here (`AGENTS.md` § Role / workflow files). `verified_by` is empty and stays empty.

## The tree I measured, and the proof it is the delivered product

Branch `grugops/uat-ABC-042-qe`, cut **by name** from `grugops/uat-ABC-042-pack` at its tip
`286de279855c1f661966b879aa4ba2149e4bec9d`, in a **private `git worktree`** — a BA/PM agent is running
in parallel, so the shared worktree's `HEAD` was never moved and none of its files were touched.

```
$ git diff main --stat -- src package.json      # empty, exit 0
$ git rev-parse main:src   grugops/uat-ABC-042-qe:src
2b35f71cb939de02fc30f41821b2847250dc51ee
2b35f71cb939de02fc30f41821b2847250dc51ee
$ git rev-parse main:package.json   grugops/uat-ABC-042-qe:package.json
81d3a85ae064041428c3d8ad3720f42edb9a7071
81d3a85ae064041428c3d8ad3720f42edb9a7071
```

`main` was at `eebbaa3d08ab539f33a13e34c0a9fc1dbefd1661`. **The `src/` tree object and the
`package.json` blob are identical to `main`**, so the suite I ran is the delivered suite over the
delivered code.

## The three commands, and what actually came back

Every command is the one `AGENTS.md` § Commands records, run verbatim, in the private worktree after
`npm install` (which left `package-lock.json` unmodified — `git status` clean afterwards).

| # | command (`AGENTS.md` slot) | result |
|---|---|---|
| 1 | `npm test` (§ Test → Test (all), i.e. `vitest run`) | **Test Files 30 passed (30) · Tests 856 passed (856)**, 0 failed, duration 1.93 s |
| 2 | `npx vitest run --reporter=json 2>/dev/null \| jq '.numPendingTests + .numTodoTests'` (§ Test integrity → Skip-count capture) | **`0`** |
| 3 | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` (§ Test integrity → the gate's step) | **`No findings.`, exit 0** |

`src/cli.test.ts` alone: **29 tests passed**. Ten child processes are spawned at module scope in that
file and the file's own row asserts the count is exactly ten (`src/cli.test.ts:777`).

**`.grugops/test-skips.md` was READ and the integrity check was RUN against it. No row was written
into it** — it is human-owned and an agent may not author a justification that clears its own gate.

## The machine, because a number without its machine is not a measurement

| item | value |
|---|---|
| machine | Apple M3, 8 cores (`Mac.lan`) |
| OS | Darwin 25.5.0, macOS 26.5.2, arm64 |
| Node | v24.12.0 |
| npm | 11.7.0 |
| vitest | 3.2.7 (`vitest/3.2.7 darwin-arm64 node-v24.12.0`) |
| jq | jq-1.7.1-apple, `/usr/bin/jq` |
| working copy | private `git worktree` under the session scratchpad |

## Disagreements found: NONE on the current numbers, and one gap in what is pinned

- **No disagreement.** `856/856 on 30 files, skip 0, integrity clean` is what the parent decision
  (`uat-ABC-042-2026-08-15`), the UAT pack's entry criterion 2, `plans/board.md`, `plans/traceability.md`
  and `plans/tickets/history/ABC-042-board-history.md` all record for `ABC-042`, and it is exactly what
  came back on my own run. The older figures in those files (`807/807`, `814/814`, `824/824`, `827/827`,
  `828/828`, and `29 files` / `31 files`) are earlier tickets' rows, not competing readings of this one.
- **The gap, recorded because it is the honest edge of my measurement:** `package.json` declares
  `engines.node >= 22`; **this run, like the pack's, was on Node v24.12.0. The oldest supported runtime
  is exercised by nobody** — not by a test, not by a config, not by either UAT run. Named rather than
  assumed away.
