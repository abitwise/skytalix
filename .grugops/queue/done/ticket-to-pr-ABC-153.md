---
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-153
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-153-the-book-sha256-test-alters-only-the-first-source-file.md
ref: .grugops/context/ticket-to-pr-ABC-153/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-153-book-sha256-every-file
base: main @ 05a1f11d
---

# Subtask: deliver `ABC-153`. The `ABC-145` test alters each of the five source files in turn, over five distinct hashes.

XS, P3, DoR 10/10. The ticket page is the contract. Test-only: exactly `tools/opening-book/book.test.ts`, 0 new files, 0 new tests, 0 spawns, the `fixture()` helper, every block outside the `ABC-145` describe and that describe's `A3` `it` byte-identical to base (`cmp` on each window). `compile.ts` and `book.json` `cmp` 0 against base.
- **Show the gap first** (Test note 1): plant `M05` (check covers only `a.tsv`) and `M-SWAP` (b/c expected hashes swapped) and `M06` (first file skipped) in scratch copies OUTSIDE the repo, run `npx vitest run tools/opening-book/book.test.ts` against the BASE test, then against your HEAD test, plus the unmutated head. Record all eight readings (4 builds × base and head test).
- `A1`: the test asserts the set of expected hashes has size 5, and for each file asserts refusal, the 3-of-3 content (name, expected hash, actual hash) and that the scratch output path does not exist. `A2` control stays.
- `A4`: `npm test` file and test counts equal base (read them at `main` now), skips 0.

## Fences
Never merge or push. Do not touch `plans/board.md`. Work in your OWN worktree (`git worktree add ../wt-ticket-to-pr-ABC-153 -b grugops/ABC-153-book-sha256-every-file main`), with `node_modules` symlinked in only. Never `update-ref` another hop's branch, never `--force`, `-D` or `reset --hard`. `git status --porcelain` clean after every plant. End each commit with a `Co-Authored-By:` trailer naming the model you actually are. `diff` is a git wrapper here; use `/usr/bin/diff` or `cmp`. Gates before your last commit: `npm run -s lint && npm run -s typecheck && npm run -s build && npm test`, with `.test-results/last-run.json` success:true. One other hop runs in parallel (width 2): take NO timing readings. Publish typed notes per Workflow 16 under `ref:`, add a trace row at the END of `plans/traceability.md`, fill § Delivery on the ticket page. Queue: `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-153`, then at the end write FLAT files `.grugops/queue/done/ticket-to-pr-ABC-153.md` (copy of this brief) and `.grugops/queue/done/ticket-to-pr-ABC-153.claim.md` (not a directory); leave both uncommitted. Report: branch tip, gate results, each criterion PASS/FAIL with its reading, the eight mutant readings, the UAT-waiver reading (`git diff --name-only main...HEAD | grep -v "\.test\.ts$" | grep "^src/"`), and the board move you recommend.
