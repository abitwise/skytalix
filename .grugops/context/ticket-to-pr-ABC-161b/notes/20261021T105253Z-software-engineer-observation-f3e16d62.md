---
id: 20261021T105253Z-software-engineer-observation-f3e16d62
kind: observation
by: software-engineer
at: 2026-10-21T10:52:53Z
verified_by: 
confidence: high (each command run on the tip)
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - grugops/ABC-161
  - 35788fd4
  - ee1818bb
  - src/cli.test.ts
  - plans/tickets/ABC-161-three-cli-test-rows-a-wrong-difficulty-build-passes.md
  - 20261021T104240Z-ba-pm-decision-b0020834
  - 20261021T103740Z-ba-pm-observation-8425f6db
supersedes: 
seal: sha256:baf1985734d3e13f1c3f1e4eb641fe39b6502244abd78888e4c2d98c36f2a37b
---

# ABC-161 gates on tip ee1818bb (worktree ../wt-ABC-161): all green; A4 fences met; UAT waiver measured empty

Run in the worktree, one at a time, private `TMPDIR`, no timing taken.
- `npm run lint` (biome, 116 files): exit 0, no fixes.
- `npm run typecheck`: exit 0. `npm run build`: exit 0.
- `npm test`: exit 0, 59 files / 1987 tests passed. `.test-results/last-run.json`: `success: true`, 1987 total, 0 failed, 0 pending, 0 todo, 59 files. Equal to base (59 / 1987).
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`: 11/11, exit 0.
- `PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/perft.test.ts`: 32/32, exit 0.
- Single-file `src/cli.test.ts` at heap 400: 88/88.

**A4.** `git diff --name-only 35788fd4 ee1818bb`: `src/cli.test.ts` plus the first hop's four context notes under `.grugops/context/ticket-to-pr-ABC-161/` (records, rebased). Outside `.grugops/context/`, exactly `src/cli.test.ts`. All hunks lie in `ABC-065` `A3`, `ABC-101` `A3`, `ABC-101` `A8′` equivalence.

**UAT waiver (AGENTS.md form, unfiltered):** `git diff --name-only 35788fd4 ee1818bb | grep -v '\.test\.ts$' | grep '^src/'` prints nothing (grep exit 1). No `.snap` file changed. Zero production lines; the waiver applies, to be confirmed at the delivered merge. The QE hop is still owed.
